/* ==========================================================================
   AGENDA DE CITAS — Terapia del Pulso de Origen Vital
   Google Apps Script que conecta la página web con el Google Calendar de
   Ana Laura. Instrucciones de instalación en backend/LEEME.md.

   Qué hace:
   • Calcula los horarios libres (horario de consulta − eventos del calendario).
   • Al reservar: vuelve a comprobar que el horario siga libre, crea la cita
     en el calendario y envía un correo al paciente y otro a la psicóloga.
   • Un día antes, envía un recordatorio por correo al paciente.
   ========================================================================== */

const CONFIG = {
  // Calendario donde se guardan las citas ("primary" = el principal).
  CALENDAR_ID: "primary",

  // Correo que recibe los avisos de nuevas citas. Vacío = la cuenta dueña del script.
  EMAIL_PSICOLOGA: "",

  NOMBRE: "Psic. Ana Laura Alemán Chávez",
  MARCA: "Terapia del Pulso de Origen Vital",
  WHATSAPP: "525637799686",
  DIRECCION: "Tzenzontle 9, Las Arboledas, 52950 Cd. López Mateos, Atizapán de Zaragoza, Edo. Méx.",
  MAPS_URL: "https://maps.app.goo.gl/tatccwMxJ53QBbca7",
  SITIO: "https://anapsicologa.github.io",

  PRECIO: 700,
  DURACION_MIN: 60,
  MODALIDADES: ["Presencial", "Online"],

  // Horas mínimas de anticipación para reservar y días hacia adelante visibles.
  ANTICIPACION_HORAS: 12,
  DIAS_VISIBLES: 45,

  // Horario de consulta. 0 = domingo, 1 = lunes … 6 = sábado. Formato 24 h.
  // ESTE es el horario que manda: la página web lo toma de aquí.
  HORARIO: {
    1: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"],
    2: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"],
    3: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"],
    4: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"],
    5: ["10:00", "11:00", "12:00", "16:00", "17:00"],
    6: ["09:00", "10:00", "11:00", "12:00"],
  },

  // Días sin consulta ("AAAA-MM-DD"). También se puede bloquear cualquier
  // horario simplemente creando un evento en el calendario.
  DIAS_BLOQUEADOS: ["2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01"],

  // Crear enlace de Google Meet automático para citas online.
  // Requiere activar el servicio avanzado "Google Calendar API" (ver LEEME.md).
  CREAR_MEET: true,

  // Hora (0-23) a la que se envían los recordatorios del día siguiente.
  HORA_RECORDATORIOS: 9,
};

const TAG = "citaWeb"; // marca interna para reconocer citas creadas desde la web

/* ---------------------------------------------------------------------------
   Puntos de entrada web
   --------------------------------------------------------------------------- */

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "slots";
    if (action === "slots") {
      return json_({ ok: true, slots: horariosLibresCache_(), duracion: CONFIG.DURACION_MIN });
    }
    return json_({ ok: false, code: "accion", error: "Acción no válida." });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, code: "error", error: "No se pudieron cargar los horarios." });
  }
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return json_({ ok: false, code: "datos", error: "Solicitud inválida." });
  }

  // Trampa para robots: un campo oculto que las personas nunca llenan.
  if (data.website) return json_({ ok: true });

  const cita = validar_(data);
  if (cita.error) return json_({ ok: false, code: "datos", error: cita.error });

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, code: "ocupado", error: "Hay mucha actividad en este momento. Intenta de nuevo." });
  }

  try {
    // Se recalcula sin caché para que dos personas nunca tomen el mismo horario.
    const libres = horariosLibres_();
    if (!(libres[cita.fecha] || []).includes(cita.hora)) {
      return json_({
        ok: false,
        code: "ocupado",
        error: "Ese horario se acaba de ocupar. Por favor elige otro.",
        slots: libres,
      });
    }

    const inicio = fechaHora_(cita.fecha, cita.hora);
    const fin = new Date(inicio.getTime() + CONFIG.DURACION_MIN * 60000);
    const evento = crearEvento_(cita, inicio, fin);
    CacheService.getScriptCache().remove("slots");

    let correos = true;
    try {
      enviarCorreoPaciente_(cita, inicio, fin, evento);
      enviarCorreoPsicologa_(cita, inicio, evento);
    } catch (err) {
      console.error("Error al enviar correos", err);
      correos = false;
    }

    return json_({
      ok: true,
      fecha: cita.fecha,
      hora: cita.hora,
      modalidad: cita.modalidad,
      meet: evento.meet || "",
      correos: correos,
    });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, code: "error", error: "No se pudo registrar la cita. Intenta de nuevo o escríbeme por WhatsApp." });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------------------------------------------------------------------
   Disponibilidad
   --------------------------------------------------------------------------- */

function horariosLibresCache_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get("slots");
  if (hit) return JSON.parse(hit);
  const libres = horariosLibres_();
  cache.put("slots", JSON.stringify(libres), 60); // 1 minuto
  return libres;
}

function horariosLibres_() {
  const ahora = new Date();
  const minimo = new Date(ahora.getTime() + CONFIG.ANTICIPACION_HORAS * 3600000);
  const desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const hasta = new Date(desde.getTime());
  hasta.setDate(hasta.getDate() + CONFIG.DIAS_VISIBLES + 1);

  // Cualquier evento del calendario (citas, pendientes personales, vacaciones
  // de "todo el día") ocupa ese espacio.
  const ocupados = calendario_()
    .getEvents(desde, hasta)
    .map((ev) => [ev.getStartTime().getTime(), ev.getEndTime().getTime()]);

  const bloqueados = new Set(CONFIG.DIAS_BLOQUEADOS);
  const duracion = CONFIG.DURACION_MIN * 60000;
  const libres = {};

  for (let d = new Date(desde.getTime()); d < hasta; d.setDate(d.getDate() + 1)) {
    const fecha = iso_(d);
    if (bloqueados.has(fecha)) continue;
    const horas = (CONFIG.HORARIO[d.getDay()] || []).filter((hora) => {
      const ini = fechaHora_(fecha, hora).getTime();
      const fin = ini + duracion;
      if (ini < minimo.getTime()) return false;
      return !ocupados.some(([s, e]) => s < fin && e > ini);
    });
    if (horas.length) libres[fecha] = horas;
  }
  return libres;
}

/* ---------------------------------------------------------------------------
   Calendario
   --------------------------------------------------------------------------- */

function calendario_() {
  return CONFIG.CALENDAR_ID === "primary"
    ? CalendarApp.getDefaultCalendar()
    : CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
}

function crearEvento_(c, inicio, fin) {
  const titulo = `Terapia · ${c.nombre} (${c.modalidad})`;
  const descripcion = [
    `Paciente: ${c.nombre}`,
    `Teléfono: ${c.telefono}`,
    `Correo: ${c.email}`,
    `Modalidad: ${c.modalidad}`,
    c.motivo ? `Motivo: ${c.motivo}` : null,
    "",
    "Cita agendada desde la página web.",
    "Para cancelarla basta con borrar este evento: el horario vuelve a quedar libre.",
  ]
    .filter((l) => l !== null)
    .join("\n");
  const ubicacion = c.modalidad === "Presencial" ? CONFIG.DIRECCION : "Videollamada";
  const online = c.modalidad !== "Presencial";

  // Con Google Meet (servicio avanzado de Calendar).
  if (CONFIG.CREAR_MEET && online && typeof Calendar !== "undefined") {
    try {
      const ev = Calendar.Events.insert(
        {
          summary: titulo,
          description: descripcion,
          location: ubicacion,
          start: { dateTime: inicio.toISOString() },
          end: { dateTime: fin.toISOString() },
          attendees: [{ email: c.email, displayName: c.nombre }],
          extendedProperties: { private: datosTag_(c) },
          conferenceData: {
            createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: "hangoutsMeet" } },
          },
        },
        CONFIG.CALENDAR_ID,
        { conferenceDataVersion: 1, sendUpdates: "none" }
      );
      const meet =
        ev.hangoutLink ||
        ((ev.conferenceData && ev.conferenceData.entryPoints) || []).map((p) => p.uri).find(Boolean) ||
        "";
      return { link: ev.htmlLink || "", meet: meet };
    } catch (err) {
      console.warn("No se pudo crear Meet, se crea evento normal.", err);
    }
  }

  const ev = calendario_().createEvent(titulo, inicio, fin, {
    description: descripcion,
    location: ubicacion,
    guests: c.email,
    sendInvites: false,
  });
  const tags = datosTag_(c);
  Object.keys(tags).forEach((k) => ev.setTag(k, tags[k]));
  return { link: "", meet: "" };
}

function datosTag_(c) {
  return {
    [TAG]: "1",
    paciente: c.nombre,
    email: c.email,
    telefono: c.telefono,
    modalidad: c.modalidad,
  };
}

/* ---------------------------------------------------------------------------
   Correos
   --------------------------------------------------------------------------- */

function enviarCorreoPaciente_(c, inicio, fin, evento) {
  const fecha = fechaLarga_(inicio);
  const lugar =
    c.modalidad === "Presencial"
      ? `<p style="margin:0 0 6px"><b>Lugar:</b> ${esc_(CONFIG.DIRECCION)}<br><a href="${CONFIG.MAPS_URL}">Ver en Google Maps</a></p>`
      : evento.meet
        ? `<p style="margin:0 0 6px"><b>Videollamada:</b> <a href="${evento.meet}">${evento.meet}</a></p>`
        : `<p style="margin:0 0 6px"><b>Videollamada:</b> te enviaré el enlace antes de la sesión.</p>`;

  const agregar = enlaceGoogleCalendar_(
    `Terapia con ${CONFIG.NOMBRE}`,
    inicio,
    fin,
    c.modalidad === "Presencial" ? CONFIG.DIRECCION : evento.meet || "Videollamada"
  );
  const wa = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(
    `Hola Ana Laura, soy ${c.nombre}. Tengo cita el ${fecha} a las ${c.hora} h.`
  )}`;

  const cuerpo = `
    <p>Hola ${esc_(primerNombre_(c.nombre))},</p>
    <p>Tu cita quedó <b>reservada</b>. Gracias por darte este espacio.</p>
    ${tarjeta_(`
      <p style="margin:0 0 6px"><b>Fecha:</b> ${esc_(fecha)}</p>
      <p style="margin:0 0 6px"><b>Hora:</b> ${c.hora} h (${CONFIG.DURACION_MIN} min)</p>
      <p style="margin:0 0 6px"><b>Modalidad:</b> ${esc_(c.modalidad)}</p>
      ${lugar}
      <p style="margin:0"><b>Inversión:</b> $${CONFIG.PRECIO} MXN</p>
    `)}
    <p>${boton_(agregar, "Agregar a mi calendario")} ${boton_(wa, "Escribir por WhatsApp", "#25D366")}</p>
    <p style="color:#6a5a73;font-size:14px">Si necesitas cambiar o cancelar tu cita, avísame por WhatsApp o responde este correo con al menos 24 horas de anticipación.</p>
    <p>Con cariño,<br><b>${esc_(CONFIG.NOMBRE)}</b><br><i>${esc_(CONFIG.MARCA)}</i></p>`;

  MailApp.sendEmail({
    to: c.email,
    subject: `Tu cita: ${fecha}, ${c.hora} h · ${CONFIG.MARCA}`,
    htmlBody: plantilla_(cuerpo),
    name: CONFIG.NOMBRE,
    replyTo: emailPsicologa_(),
  });
}

function enviarCorreoPsicologa_(c, inicio, evento) {
  const fecha = fechaLarga_(inicio);
  const telWa = telefonoWa_(c.telefono);
  const confirmar = `https://wa.me/${telWa}?text=${encodeURIComponent(
    `Hola ${primerNombre_(c.nombre)}, te escribe Ana Laura. Te confirmo tu cita el ${fecha} a las ${c.hora} h (${c.modalidad}).` +
      (c.modalidad === "Presencial"
        ? ` Dirección: ${CONFIG.DIRECCION} ${CONFIG.MAPS_URL}`
        : evento.meet
          ? ` Enlace de la videollamada: ${evento.meet}`
          : "") +
      " ¡Nos vemos!"
  )}`;

  const cuerpo = `
    <p><b>Nueva cita desde la página web</b></p>
    ${tarjeta_(`
      <p style="margin:0 0 6px"><b>Paciente:</b> ${esc_(c.nombre)}</p>
      <p style="margin:0 0 6px"><b>Fecha:</b> ${esc_(fecha)}, ${c.hora} h</p>
      <p style="margin:0 0 6px"><b>Modalidad:</b> ${esc_(c.modalidad)}</p>
      <p style="margin:0 0 6px"><b>Teléfono:</b> ${esc_(c.telefono)}</p>
      <p style="margin:0 0 6px"><b>Correo:</b> ${esc_(c.email)}</p>
      ${evento.meet ? `<p style="margin:0 0 6px"><b>Meet:</b> <a href="${evento.meet}">${evento.meet}</a></p>` : ""}
      ${c.motivo ? `<p style="margin:0"><b>Motivo:</b> ${esc_(c.motivo)}</p>` : ""}
    `)}
    <p>${boton_(confirmar, "Confirmar por WhatsApp al paciente", "#25D366")}
       ${evento.link ? boton_(evento.link, "Ver en Google Calendar") : ""}</p>
    <p style="color:#6a5a73;font-size:14px">La cita ya está en tu calendario y ese horario dejó de mostrarse en la página. Para cancelarla, borra el evento del calendario.</p>`;

  MailApp.sendEmail({
    to: emailPsicologa_(),
    subject: `Nueva cita: ${c.nombre} · ${fecha}, ${c.hora} h`,
    htmlBody: plantilla_(cuerpo),
    name: "Agenda web",
    replyTo: c.email,
  });
}

/* ---------------------------------------------------------------------------
   Recordatorios (se activan con instalarRecordatorios)
   --------------------------------------------------------------------------- */

function enviarRecordatorios() {
  const hoy = new Date();
  const desde = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  const hasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 2);

  calendario_()
    .getEvents(desde, hasta)
    .filter((ev) => ev.getTag(TAG) === "1" && ev.getTag("recordatorio") !== "1")
    .forEach((ev) => {
      const email = ev.getTag("email");
      if (!email) return;
      const inicio = ev.getStartTime();
      const hora = Utilities.formatDate(inicio, Session.getScriptTimeZone(), "HH:mm");
      const presencial = ev.getTag("modalidad") === "Presencial";
      const cuerpo = `
        <p>Hola ${esc_(primerNombre_(ev.getTag("paciente") || ""))},</p>
        <p>Te recuerdo que <b>mañana</b> tenemos sesión:</p>
        ${tarjeta_(`
          <p style="margin:0 0 6px"><b>${esc_(fechaLarga_(inicio))}, ${hora} h</b></p>
          <p style="margin:0">${
            presencial
              ? `${esc_(CONFIG.DIRECCION)} · <a href="${CONFIG.MAPS_URL}">Cómo llegar</a>`
              : "Sesión online: el enlace está en tu correo de confirmación o en tu calendario."
          }</p>
        `)}
        <p style="color:#6a5a73;font-size:14px">Si no puedes asistir, avísame por WhatsApp lo antes posible.</p>
        <p>Con cariño,<br><b>${esc_(CONFIG.NOMBRE)}</b></p>`;
      MailApp.sendEmail({
        to: email,
        subject: `Recordatorio: tu sesión es mañana a las ${hora} h`,
        htmlBody: plantilla_(cuerpo),
        name: CONFIG.NOMBRE,
        replyTo: emailPsicologa_(),
      });
      ev.setTag("recordatorio", "1");
    });
}

/** Ejecutar UNA vez desde el editor para activar los recordatorios diarios. */
function instalarRecordatorios() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "enviarRecordatorios")
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("enviarRecordatorios").timeBased().everyDays(1).atHour(CONFIG.HORA_RECORDATORIOS).create();
}

/** Ejecutar desde el editor para dar permisos y comprobar que todo funciona. */
function probar() {
  const libres = horariosLibres_();
  const dias = Object.keys(libres);
  console.log(`Días con horarios libres: ${dias.length}`);
  if (dias.length) console.log(`Primer día: ${dias[0]} → ${libres[dias[0]].join(", ")}`);
  console.log(`Los avisos llegarán a: ${emailPsicologa_()}`);
  console.log(`Correos restantes hoy: ${MailApp.getRemainingDailyQuota()}`);
}

/* ---------------------------------------------------------------------------
   Utilidades
   --------------------------------------------------------------------------- */

function validar_(d) {
  const s = (v, max) => String(v == null ? "" : v).trim().slice(0, max);
  const c = {
    nombre: s(d.nombre, 80),
    telefono: s(d.telefono, 25),
    email: s(d.email, 120).toLowerCase(),
    fecha: s(d.fecha, 10),
    hora: s(d.hora, 5),
    modalidad: s(d.modalidad, 30),
    motivo: s(d.motivo, 600),
  };
  if (c.nombre.length < 2) return { error: "Escribe tu nombre." };
  if (c.telefono.replace(/\D/g, "").length < 8) return { error: "Escribe un teléfono válido." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) return { error: "Escribe un correo válido." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.fecha) || !/^\d{2}:\d{2}$/.test(c.hora)) return { error: "Fecha u hora inválida." };
  if (!CONFIG.MODALIDADES.includes(c.modalidad)) return { error: "Modalidad inválida." };
  return c;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function fechaHora_(fecha, hora) {
  const [y, m, d] = fecha.split("-").map(Number);
  const [h, mi] = hora.split(":").map(Number);
  return new Date(y, m - 1, d, h, mi);
}

function iso_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function fechaLarga_(d) {
  const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]}`;
}

function emailPsicologa_() {
  return CONFIG.EMAIL_PSICOLOGA || Session.getEffectiveUser().getEmail();
}

function telefonoWa_(tel) {
  const n = String(tel).replace(/\D/g, "");
  return n.length === 10 ? `52${n}` : n; // 10 dígitos = número mexicano
}

function primerNombre_(nombre) {
  return String(nombre).trim().split(/\s+/)[0] || "";
}

function enlaceGoogleCalendar_(titulo, inicio, fin, lugar) {
  const f = (d) => Utilities.formatDate(d, "UTC", "yyyyMMdd'T'HHmmss'Z'");
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(titulo)}` +
    `&dates=${f(inicio)}/${f(fin)}` +
    `&location=${encodeURIComponent(lugar)}`
  );
}

function esc_(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

function tarjeta_(html) {
  return `<div style="background:#fbf6ee;border-left:4px solid #7b4bb0;border-radius:10px;padding:16px 18px;margin:16px 0">${html}</div>`;
}

function boton_(href, texto, color) {
  return `<a href="${href}" style="display:inline-block;margin:4px 6px 4px 0;padding:11px 18px;border-radius:999px;background:${
    color || "#4a1f5c"
  };color:#fff;text-decoration:none;font-weight:600;font-size:14px">${texto}</a>`;
}

function plantilla_(contenido) {
  return `
  <div style="background:#f5ede4;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#33243f;line-height:1.55">
    <div style="max-width:560px;margin:0 auto;background:#fffdf9;border-radius:16px;overflow:hidden">
      <div style="height:6px;background:linear-gradient(90deg,#7b4bb0,#d23c86,#f29a3b,#1e9c93,#6baf4a)"></div>
      <div style="padding:26px 28px">
        <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:20px;color:#4a1f5c;letter-spacing:.04em">${esc_(CONFIG.MARCA)}</p>
        ${contenido}
      </div>
      <div style="padding:14px 28px;background:#fbf6ee;font-size:12px;color:#8d7c97">
        ${esc_(CONFIG.NOMBRE)} · <a href="${CONFIG.SITIO}" style="color:#8d7c97">${CONFIG.SITIO.replace(/^https?:\/\//, "")}</a><br>
        Si estás en crisis, llama a la Línea de la Vida: 800 911 2000 (24 h) o al 911.
      </div>
    </div>
  </div>`;
}
