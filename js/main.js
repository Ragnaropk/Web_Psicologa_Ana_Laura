/* ==========================================================================
   Lógica del sitio. Los datos se editan en js/config.js.
   ========================================================================== */
(function () {
  "use strict";

  const S = window.SITE || {};
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const money = (n) =>
    new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 }).format(n);
  const pad = (n) => String(n).padStart(2, "0");
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseISO = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const longDate = (d) =>
    d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  const waLink = (text) =>
    `https://wa.me/${S.whatsapp || ""}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* ---------- Datos simples en el HTML ---------- */
  const fill = {
    nombre: S.nombre,
    aniosExperiencia: S.aniosExperiencia,
    precio: S.consulta && money(S.consulta.precio),
    moneda: S.consulta && S.consulta.moneda,
    duracion: S.consulta && S.consulta.duracionMin,
    modalidades: S.consulta && S.consulta.modalidades.join(" u "),
    googleRating: S.google && S.google.calificacion,
    googleReviews: S.google && S.google.resenas,
  };
  $$("[data-site]").forEach((el) => {
    const v = fill[el.dataset.site];
    if (v !== undefined && v !== null && v !== "") el.textContent = v;
  });

  $("#year").textContent = new Date().getFullYear();
  if (S.cedula) $("#cedula").textContent = `· ${S.cedula}`;

  /* ---------- Imágenes con respaldo ---------- */
  function fallback(img, container, cls) {
    if (!img || !container) return;
    const fail = () => container.classList.add(cls);
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail);
  }
  fallback($(".logo-img"), $(".logo-ring"), "no-logo");
  fallback($(".portrait__img"), $(".portrait"), "no-photo");

  /* ---------- Navegación ---------- */
  const header = $(".header");
  const nav = $("#nav");
  const toggle = $(".nav-toggle");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
  });
  $$("a", nav).forEach((a) =>
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    })
  );

  const onScroll = () => {
    const h = document.documentElement;
    const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    header.style.setProperty("--progress", p.toFixed(4));
    header.classList.toggle("is-scrolled", h.scrollTop > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Aparición al hacer scroll ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Talleres ---------- */
  (function renderWorkshops() {
    const wrap = $("#workshops");
    const today = parseISO(isoDate(new Date()));
    const list = (S.talleres || [])
      .map((t) => ({ ...t, _date: t.fecha ? parseISO(t.fecha) : null }))
      .sort((a, b) => (a._date || 0) - (b._date || 0));

    const upcoming = list.filter((t) => !t._date || t._date >= today);
    if (!upcoming.length) {
      $("#workshops-empty").hidden = false;
      return;
    }

    wrap.innerHTML = upcoming
      .map((t) => {
        const date = t._date
          ? t._date.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "long" })
          : "Fecha por anunciar";
        const msg = `Hola, me interesa el taller "${t.titulo}" (${date}). ¿Me compartes la información para inscribirme?`;
        const href = t.linkPago || waLink(msg);
        const label = t.linkPago ? "Inscribirme y pagar" : "Apartar mi lugar";
        return `
          <article class="workshop reveal is-visible">
            <div class="workshop__top">
              ${t.etiqueta ? `<span class="workshop__tag">${escapeHTML(t.etiqueta)}</span>` : ""}
              <span class="workshop__date">${escapeHTML(date)}</span>
              <h3>${escapeHTML(t.titulo)}</h3>
            </div>
            <div class="workshop__body">
              ${t.subtitulo ? `<p class="workshop__sub">${escapeHTML(t.subtitulo)}</p>` : ""}
              <p class="workshop__desc">${escapeHTML(t.descripcion || "")}</p>
              <ul class="workshop__meta">
                <li><strong>Horario</strong>${escapeHTML(t.horario || "Por confirmar")}</li>
                <li><strong>Modalidad</strong>${escapeHTML(t.modalidad || "—")}</li>
                ${t.cupo ? `<li><strong>Cupo</strong>${t.cupo} personas</li>` : ""}
              </ul>
              <div class="workshop__foot">
                <span class="workshop__price">$${money(t.precio)} <small>MXN</small></span>
                <a class="btn btn--small" href="${escapeHTML(href)}" target="_blank" rel="noopener">${label}</a>
              </div>
            </div>
          </article>`;
      })
      .join("");
  })();

  /* ---------- Servicios ---------- */
  (function renderServices() {
    const wrap = $("#services");
    const list = S.servicios || [];
    if (!list.length) {
      $("#servicios").hidden = true;
      return;
    }
    const etiquetas = { etapas: "Para quién", emocional: "Salud emocional", duelo: "Duelo y pérdidas" };

    wrap.innerHTML = list
      .map((sv) => {
        const flyers = (sv.flyers || []).map((f) => encodeURI(f)).join("|");
        const ask = waLink(`Hola Ana Laura, me gustaría información sobre: ${sv.titulo}.`);
        return `
        <article class="service" data-cat="${escapeHTML(sv.categoria || "")}">
          <p class="service__cat">${escapeHTML(etiquetas[sv.categoria] || "")}</p>
          <h3>${escapeHTML(sv.titulo)}</h3>
          ${sv.subtitulo ? `<p class="service__sub">${escapeHTML(sv.subtitulo)}</p>` : ""}
          ${sv.para ? `<p class="service__para">${escapeHTML(sv.para)}</p>` : ""}
          <p class="service__frase">${escapeHTML(sv.frase || "")}</p>
          <ul>${(sv.puntos || []).map((pt) => `<li>${escapeHTML(pt)}</li>`).join("")}</ul>
          <div class="service__actions">
            <a class="btn btn--small" href="#agenda">Agendar</a>
            <a class="link-btn" href="${ask}" target="_blank" rel="noopener">Preguntar</a>
            ${flyers ? `<button class="link-btn" type="button" data-flyers="${flyers}" data-title="${escapeHTML(sv.titulo)}">Ver flyer</button>` : ""}
          </div>
        </article>`;
      })
      .join("");

    const filters = $$(".filter");
    filters.forEach((btn) =>
      btn.addEventListener("click", () => {
        const cat = btn.dataset.cat;
        filters.forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        $$(".service", wrap).forEach((card) => {
          card.hidden = cat !== "todos" && card.dataset.cat !== cat;
        });
      })
    );
  })();

  /* ---------- Visor de flyers ---------- */
  (function lightbox() {
    const dlg = $("#lightbox");
    if (!dlg || typeof dlg.showModal !== "function") return;
    const img = $("#lightbox-img");
    const count = $("#lightbox-count");
    const prevBtn = $("#lightbox-prev");
    const nextBtn = $("#lightbox-next");
    let items = [];
    let idx = 0;
    let title = "";

    const show = () => {
      img.src = items[idx];
      img.alt = `Flyer: ${title}`;
      const many = items.length > 1;
      prevBtn.hidden = nextBtn.hidden = !many;
      count.textContent = many ? `${idx + 1} / ${items.length}` : title;
    };

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-flyers]");
      if (!btn) return;
      items = btn.dataset.flyers.split("|").filter(Boolean);
      title = btn.dataset.title || "";
      idx = 0;
      show();
      dlg.showModal();
    });
    prevBtn.addEventListener("click", () => {
      idx = (idx - 1 + items.length) % items.length;
      show();
    });
    nextBtn.addEventListener("click", () => {
      idx = (idx + 1) % items.length;
      show();
    });
    $(".lightbox__close", dlg).addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close(); // clic fuera de la imagen
    });
    dlg.addEventListener("close", () => img.removeAttribute("src"));
  })();

  /* ---------- Testimonios ---------- */
  (function renderQuotes() {
    const list = S.testimonios || [];
    if (!list.length) {
      $("#testimonios").hidden = true;
      return;
    }
    $("#quotes").innerHTML = list
      .map(
        (q) => `
        <figure class="quote reveal is-visible">
          <blockquote>${escapeHTML(q.texto)}</blockquote>
          <figcaption>
            <span class="quote__stars" aria-label="5 estrellas">★★★★★</span>
            <span><strong>${escapeHTML(q.autor)}</strong>${q.detalle ? ` · ${escapeHTML(q.detalle)}` : ""}</span>
          </figcaption>
        </figure>`
      )
      .join("");
  })();

  /* ---------- Contacto y mapa ---------- */
  (function contact() {
    const addr = $("#c-address");
    addr.textContent = [S.direccion, S.ciudad].filter(Boolean).join(", ") || "Por confirmar";
    if (S.googleMapsUrl) addr.href = S.googleMapsUrl;
    else addr.removeAttribute("href");

    const wa = $("#c-whatsapp");
    wa.href = waLink("Hola Ana Laura, me gustaría pedir información sobre la terapia.");
    if (S.telefonoVisible) wa.textContent = S.telefonoVisible;
    $("#wa-float").href = waLink("Hola Ana Laura, me gustaría pedir información.");

    if (S.email) {
      $("#c-email-row").hidden = false;
      $("#c-email").textContent = S.email;
      $("#c-email").href = `mailto:${S.email}`;
    }

    const socials = [
      ["Instagram", S.instagram],
      ["Facebook", S.facebook],
      ["Google Maps", S.googleMapsUrl],
    ].filter(([, url]) => url);
    $("#socials").innerHTML = socials
      .map(([name, url]) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">${name}</a>`)
      .join("");

    const fullAddress = [S.direccion, S.ciudad].filter(Boolean).join(", ");
    $("#footer-address").textContent = fullAddress;
    $("#footer-address").hidden = !fullAddress;
    const rating = $("#rating");
    if (S.google && S.googleMapsUrl) rating.href = S.googleMapsUrl;
    else rating.hidden = true;

    if (S.googleMapsEmbed) {
      const map = $("#map");
      map.src = S.googleMapsEmbed;
      map.hidden = false;
      $("#map-placeholder").hidden = true;
    }
  })();

  /* ---------- Agenda ---------- */
  // Dos modos:
  //  • Con S.agendaApi (Google Apps Script): horarios reales del calendario,
  //    la reserva aparta el horario y se envían correos a ambas partes.
  //  • Sin él: horario fijo de config.js y la solicitud se envía por WhatsApp.
  (function booking() {
    const A = S.agenda || {};
    const API = (S.agendaApi || "").trim();
    let online = Boolean(API);
    let remoteSlots = null; // { "AAAA-MM-DD": ["10:00", …] }

    const today = parseISO(isoDate(new Date()));
    const first = new Date(today);
    first.setDate(first.getDate() + (online ? 0 : A.diasAnticipacionMin ?? 1));
    const last = new Date(today);
    last.setDate(last.getDate() + (A.diasVisibles ?? 45));
    const blocked = new Set(A.diasBloqueados || []);

    const grid = $("#cal-grid");
    const title = $("#cal-title");
    const prev = $("#cal-prev");
    const next = $("#cal-next");
    const slotsEl = $("#slots");
    const slotsTitle = $("#slots-title");
    const form = $("#booking-form");
    const submit = $("#booking-submit");
    const msg = $("#form-msg");
    const summary = $("#summary");
    const booked = $("#booked");

    let view = new Date(first.getFullYear(), first.getMonth(), 1);
    let selDate = null;
    let selTime = null;
    let loading = online;

    const slotsFor = (d) => {
      if (online) return (remoteSlots && remoteSlots[isoDate(d)]) || [];
      if (d < first || d > last || blocked.has(isoDate(d))) return [];
      return (A.horario || {})[d.getDay()] || [];
    };

    const setMsg = (text, ok) => {
      msg.textContent = text || "";
      msg.classList.toggle("is-ok", Boolean(ok));
    };

    function applyMode() {
      submit.textContent = online ? "Reservar mi cita" : "Solicitar cita por WhatsApp";
      form.email.required = online;
      $("#email-hint").textContent = online ? "(para enviarte la confirmación)" : "(opcional)";
    }

    // Modalidades
    const mods = (S.consulta && S.consulta.modalidades) || ["Presencial"];
    $("#modalidades").innerHTML = mods
      .map(
        (m, i) => `
        <label class="pill">
          <input type="radio" name="modalidad" value="${escapeHTML(m)}" ${i === 0 ? "checked" : ""} />
          <span>${escapeHTML(m)}</span>
        </label>`
      )
      .join("");

    function renderCalendar() {
      const y = view.getFullYear();
      const m = view.getMonth();
      const t = view.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
      title.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      grid.classList.toggle("is-loading", loading);

      const offset = (new Date(y, m, 1).getDay() + 6) % 7; // semana inicia en lunes
      const days = new Date(y, m + 1, 0).getDate();
      let html = "";
      for (let i = 0; i < offset; i++) html += "<span></span>";
      for (let d = 1; d <= days; d++) {
        const date = new Date(y, m, d);
        const free = !loading && slotsFor(date).length > 0;
        const cls = [
          "cal__day",
          free && "is-free",
          isoDate(date) === isoDate(today) && "is-today",
          selDate && isoDate(date) === isoDate(selDate) && "is-selected",
        ]
          .filter(Boolean)
          .join(" ");
        html += `<button type="button" class="${cls}" data-date="${isoDate(date)}" ${free ? "" : "disabled"}
          aria-label="${longDate(date)}${free ? ", disponible" : ", sin horarios"}">${d}</button>`;
      }
      grid.innerHTML = html;

      prev.disabled = new Date(y, m, 1) <= new Date(first.getFullYear(), first.getMonth(), 1);
      next.disabled = new Date(y, m + 1, 1) > last;
    }

    function renderSlots() {
      if (loading) {
        slotsTitle.textContent = "Cargando horarios…";
        slotsEl.innerHTML = `<p class="muted">Consultando la agenda en tiempo real.</p>`;
        return;
      }
      if (!selDate) {
        slotsTitle.textContent = "Elige un día";
        slotsEl.innerHTML = `<p class="muted">Selecciona un día disponible en el calendario para ver los horarios.</p>`;
        return;
      }
      const label = longDate(selDate);
      slotsTitle.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      const list = slotsFor(selDate);
      slotsEl.innerHTML = list.length
        ? list
            .map(
              (t) =>
                `<button type="button" class="slot ${t === selTime ? "is-selected" : ""}" data-time="${t}">${t}</button>`
            )
            .join("")
        : `<p class="muted">Ya no quedan horarios este día. Elige otro, por favor.</p>`;
    }

    function renderSummary() {
      if (selDate && selTime) {
        summary.hidden = false;
        summary.innerHTML = `Tu cita: <strong>${longDate(selDate)}</strong> a las <strong>${selTime} h</strong> · $${money(
          S.consulta.precio
        )} ${S.consulta.moneda}`;
      } else {
        summary.hidden = true;
      }
    }

    function renderAll() {
      renderCalendar();
      renderSlots();
      renderSummary();
    }

    // Si el horario elegido ya no está libre, se quita la selección.
    function reconcile() {
      if (selDate && !slotsFor(selDate).length) selDate = null;
      if (selDate && selTime && !slotsFor(selDate).includes(selTime)) selTime = null;
      if (!selDate) selTime = null;
    }

    function jumpToFirstFree() {
      const firstDay = Object.keys(remoteSlots || {}).sort()[0];
      if (firstDay) {
        const d = parseISO(firstDay);
        view = new Date(d.getFullYear(), d.getMonth(), 1);
      }
    }

    async function loadSlots() {
      try {
        const res = await fetch(`${API}?action=slots`, { cache: "no-store" });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "error");
        remoteSlots = data.slots || {};
        return true;
      } catch (err) {
        console.warn("Agenda en línea no disponible, se usa WhatsApp.", err);
        return false;
      }
    }

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".cal__day.is-free");
      if (!btn) return;
      selDate = parseISO(btn.dataset.date);
      selTime = null;
      setMsg("");
      renderAll();
    });

    slotsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".slot");
      if (!btn) return;
      selTime = btn.dataset.time;
      setMsg("");
      renderSlots();
      renderSummary();
    });

    prev.addEventListener("click", () => {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
      renderCalendar();
    });
    next.addEventListener("click", () => {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      renderCalendar();
    });

    function readForm() {
      const data = new FormData(form);
      const get = (k) => String(data.get(k) || "").trim();
      return {
        nombre: get("nombre"),
        telefono: get("telefono"),
        email: get("email"),
        modalidad: get("modalidad"),
        motivo: get("motivo"),
        website: get("website"),
        acepto: data.get("acepto") === "on",
      };
    }

    function validate(d) {
      const telOk = d.telefono.replace(/\D/g, "").length >= 8;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email);
      form.nombre.classList.toggle("is-invalid", d.nombre.length < 2);
      form.telefono.classList.toggle("is-invalid", !telOk);
      form.email.classList.toggle("is-invalid", online ? !emailOk : Boolean(d.email) && !emailOk);
      if (!selDate || !selTime) return "Elige primero un día y un horario.";
      if (d.nombre.length < 2 || !telOk) return "Escribe tu nombre y un teléfono válido.";
      if (online && !emailOk) return "Escribe un correo válido para enviarte la confirmación.";
      if (!d.acepto) return "Para continuar, acepta el uso de tus datos para la cita.";
      return "";
    }

    function showBooked(d, meet) {
      form.hidden = true;
      $(".slots").hidden = true;
      booked.hidden = false;
      $("#booked-when").textContent = `${longDate(selDate)} · ${selTime} h · ${d.modalidad}`;
      $("#booked-detail").innerHTML =
        `Te envié la confirmación a <strong>${escapeHTML(d.email)}</strong> (revisa también tu carpeta de spam). ` +
        (d.modalidad === "Presencial"
          ? `Te espero en ${escapeHTML([S.direccion, S.ciudad].filter(Boolean).join(", ").replace(/\.$/, ""))}.`
          : meet
            ? "Tu enlace de videollamada también va en el correo."
            : "Te enviaré el enlace de la videollamada antes de la sesión.");
      const meetBtn = $("#booked-meet");
      meetBtn.hidden = !meet;
      if (meet) meetBtn.href = meet;
      $("#booked-wa").href = waLink(
        `Hola Ana Laura, soy ${d.nombre}. Acabo de reservar mi cita para el ${longDate(selDate)} a las ${selTime} h (${d.modalidad}).`
      );
      booked.focus();
    }

    $("#booked-again").addEventListener("click", () => {
      booked.hidden = true;
      form.hidden = false;
      $(".slots").hidden = false;
      form.reset();
      selDate = null;
      selTime = null;
      setMsg("");
      renderAll();
    });

    function sendWhatsApp(d) {
      const text = [
        `Hola Ana Laura, me gustaría agendar una cita.`,
        ``,
        `• Nombre: ${d.nombre}`,
        `• Teléfono: ${d.telefono}`,
        d.email ? `• Correo: ${d.email}` : null,
        `• Fecha: ${longDate(selDate)}`,
        `• Hora: ${selTime} h`,
        `• Modalidad: ${d.modalidad}`,
        d.motivo ? `• Motivo: ${d.motivo}` : null,
      ]
        .filter((l) => l !== null)
        .join("\n");
      window.open(waLink(text), "_blank", "noopener");
      setMsg("¡Listo! Se abrió WhatsApp con tu solicitud. Envía el mensaje y te confirmo a la brevedad.", true);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const d = readForm();
      const error = validate(d);
      if (error) return setMsg(error);
      if (!online) return sendWhatsApp(d);

      submit.disabled = true;
      submit.textContent = "Reservando…";
      setMsg("");
      try {
        const res = await fetch(API, {
          method: "POST",
          // text/plain evita la verificación CORS previa que Apps Script no admite
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ ...d, fecha: isoDate(selDate), hora: selTime }),
        });
        const r = await res.json();
        if (r.ok) {
          remoteSlots[isoDate(selDate)] = slotsFor(selDate).filter((t) => t !== selTime);
          showBooked(d, r.meet);
        } else if (r.code === "ocupado") {
          if (r.slots) remoteSlots = r.slots;
          else await loadSlots();
          reconcile();
          renderAll();
          setMsg(r.error || "Ese horario se acaba de ocupar. Por favor elige otro.");
        } else {
          setMsg(r.error || "No se pudo reservar. Intenta de nuevo.");
        }
      } catch (err) {
        console.error(err);
        setMsg("No pudimos conectar con la agenda. Revisa tu conexión o escríbeme por WhatsApp.");
      } finally {
        submit.disabled = false;
        applyMode();
      }
    });

    applyMode();
    renderAll();

    if (online) {
      loadSlots().then((ok) => {
        loading = false;
        if (ok) {
          jumpToFirstFree();
        } else {
          online = false; // respaldo: horario fijo + WhatsApp
          first.setDate(first.getDate() + (A.diasAnticipacionMin ?? 1));
          applyMode();
        }
        renderAll();
      });
    }
  })();
})();
