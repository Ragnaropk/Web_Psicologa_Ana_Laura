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
          <figcaption>— ${escapeHTML(q.autor)}</figcaption>
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

    if (S.googleMapsEmbed) {
      const map = $("#map");
      map.src = S.googleMapsEmbed;
      map.hidden = false;
      $("#map-placeholder").hidden = true;
    }
  })();

  /* ---------- Agenda ---------- */
  (function booking() {
    const A = S.agenda || {};
    const horario = A.horario || {};
    const blocked = new Set(A.diasBloqueados || []);
    const today = parseISO(isoDate(new Date()));
    const first = new Date(today);
    first.setDate(first.getDate() + (A.diasAnticipacionMin ?? 1));
    const last = new Date(today);
    last.setDate(last.getDate() + (A.diasVisibles ?? 45));

    const grid = $("#cal-grid");
    const title = $("#cal-title");
    const prev = $("#cal-prev");
    const next = $("#cal-next");
    const slotsEl = $("#slots");
    const slotsTitle = $("#slots-title");
    const form = $("#booking-form");
    const msg = $("#form-msg");
    const summary = $("#summary");

    let view = new Date(first.getFullYear(), first.getMonth(), 1);
    let selDate = null;
    let selTime = null;

    const slotsFor = (d) => {
      if (d < first || d > last || blocked.has(isoDate(d))) return [];
      return horario[d.getDay()] || [];
    };

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

      const offset = (new Date(y, m, 1).getDay() + 6) % 7; // semana inicia en lunes
      const days = new Date(y, m + 1, 0).getDate();
      let html = "";
      for (let i = 0; i < offset; i++) html += "<span></span>";
      for (let d = 1; d <= days; d++) {
        const date = new Date(y, m, d);
        const free = slotsFor(date).length > 0;
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
      if (!selDate) {
        slotsTitle.textContent = "Elige un día";
        slotsEl.innerHTML = `<p class="muted">Selecciona un día disponible en el calendario para ver los horarios.</p>`;
        return;
      }
      const label = longDate(selDate);
      slotsTitle.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      slotsEl.innerHTML = slotsFor(selDate)
        .map(
          (t) =>
            `<button type="button" class="slot ${t === selTime ? "is-selected" : ""}" data-time="${t}">${t}</button>`
        )
        .join("");
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

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".cal__day.is-free");
      if (!btn) return;
      selDate = parseISO(btn.dataset.date);
      selTime = null;
      msg.textContent = "";
      renderCalendar();
      renderSlots();
      renderSummary();
    });

    slotsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".slot");
      if (!btn) return;
      selTime = btn.dataset.time;
      msg.textContent = "";
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

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.classList.remove("is-ok");
      const data = new FormData(form);
      const nombre = String(data.get("nombre") || "").trim();
      const tel = String(data.get("telefono") || "").trim();
      form.nombre.classList.toggle("is-invalid", !nombre);
      form.telefono.classList.toggle("is-invalid", tel.replace(/\D/g, "").length < 8);

      if (!selDate || !selTime) {
        msg.textContent = "Elige primero un día y un horario.";
        return;
      }
      if (!nombre || tel.replace(/\D/g, "").length < 8) {
        msg.textContent = "Escribe tu nombre y un teléfono válido.";
        return;
      }

      const motivo = String(data.get("motivo") || "").trim();
      const text = [
        `Hola Ana Laura, me gustaría agendar una cita.`,
        ``,
        `• Nombre: ${nombre}`,
        `• Teléfono: ${tel}`,
        `• Fecha: ${longDate(selDate)}`,
        `• Hora: ${selTime} h`,
        `• Modalidad: ${data.get("modalidad")}`,
        motivo ? `• Motivo: ${motivo}` : null,
      ]
        .filter((l) => l !== null)
        .join("\n");

      window.open(waLink(text), "_blank", "noopener");
      msg.classList.add("is-ok");
      msg.textContent = "¡Listo! Se abrió WhatsApp con tu solicitud. Envía el mensaje y te confirmo a la brevedad.";
    });

    renderCalendar();
    renderSlots();
  })();
})();
