/* ==========================================================================
   CONFIGURACIÓN DEL SITIO
   Todo lo que Ana Laura necesite cambiar (precios, horarios, talleres,
   teléfono, dirección…) se edita AQUÍ, sin tocar el resto del código.
   ========================================================================== */

window.SITE = {
  // --- Datos generales -----------------------------------------------------
  nombre: "Ana Laura Alemán Chávez",
  titulo: "Psicóloga Humanista",
  metodologia: "Terapia del Pulso de Origen Vital",
  lema: "Regresa a tu Yo Original",
  aniosExperiencia: 10,
  cedula: "", // Ej. "Céd. Prof. 1234567" — se muestra en el pie si se llena

  // WhatsApp en formato internacional, solo números (52 = México).
  whatsapp: "520000000000",
  telefonoVisible: "", // Ej. "55 1234 5678"
  email: "", // Ej. "contacto@analaura.mx"
  instagram: "", // URL completa
  facebook: "", // URL completa

  // --- Ubicación -----------------------------------------------------------
  direccion: "Dirección del consultorio (pendiente)",
  ciudad: "",
  googleMapsUrl: "", // Enlace "Compartir" de Google Maps
  // Enlace "Insertar mapa" de Google Maps (solo el src del iframe):
  googleMapsEmbed: "",

  // --- Consulta individual -------------------------------------------------
  consulta: {
    precio: 700,
    moneda: "MXN",
    duracionMin: 60,
    modalidades: ["Presencial", "Online"],
  },

  // --- Agenda (disponibilidad semanal) ------------------------------------
  // 0 = domingo, 1 = lunes … 6 = sábado. Horas en formato 24 h.
  agenda: {
    diasAnticipacionMin: 1, // no se puede agendar para hoy
    diasVisibles: 45, // cuántos días hacia adelante se muestran
    horario: {
      1: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"],
      2: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"],
      3: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"],
      4: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00"],
      5: ["10:00", "11:00", "12:00", "16:00", "17:00"],
      6: ["09:00", "10:00", "11:00", "12:00"],
    },
    // Fechas sin consulta (vacaciones, días festivos): "AAAA-MM-DD"
    diasBloqueados: ["2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01"],
  },

  // --- Talleres ------------------------------------------------------------
  // Para agregar uno nuevo, copia un bloque { … } y cambia los datos.
  // linkPago: enlace de Mercado Pago / Stripe / PayPal. Si se deja vacío,
  // el botón abre WhatsApp para apartar lugar.
  // (Los talleres de abajo son EJEMPLOS: cambiar fechas, precios y textos.)
  talleres: [
    {
      titulo: "Regresa a tu Yo Original",
      subtitulo: "Taller introductorio a la Terapia del Pulso",
      descripcion:
        "Una experiencia vivencial para reconocer las voces, etiquetas y heridas aprendidas que te alejaron de tu esencia, y dar los primeros pasos de regreso a ti.",
      fecha: "2026-11-08",
      horario: "10:00 – 14:00",
      modalidad: "Presencial",
      precio: 950,
      cupo: 12,
      linkPago: "",
      etiqueta: "Próximo",
    },
    {
      titulo: "Habitar las emociones",
      subtitulo: "Regulación emocional desde la DBT y la Gestalt",
      descripcion:
        "Herramientas prácticas para dejar de pelear con lo que sientes: conciencia corporal, tolerancia al malestar y el poder del aquí y ahora.",
      fecha: "2026-11-22",
      horario: "17:00 – 20:00",
      modalidad: "Online (Zoom)",
      precio: 650,
      cupo: 20,
      linkPago: "",
      etiqueta: "Online",
    },
    {
      titulo: "Duelo y transformación",
      subtitulo: "Círculo de acompañamiento tanatológico",
      descripcion:
        "Para quienes atraviesan una pérdida: una persona, una relación, una etapa. Un grupo pequeño y seguro para darle lugar al dolor y encontrarle sentido.",
      fecha: "2026-12-06",
      horario: "10:00 – 13:00",
      modalidad: "Presencial",
      precio: 800,
      cupo: 10,
      linkPago: "",
      etiqueta: "Cupo reducido",
    },
  ],

  // --- Testimonios ---------------------------------------------------------
  // IMPORTANTE: reemplazar por reseñas reales (p. ej. las de Google Maps),
  // con permiso de quien las escribió. Si la lista queda vacía, la sección
  // se oculta sola.
  testimonios: [
    {
      texto:
        "Texto de ejemplo — aquí irá una reseña real de Google Maps. Me sentí escuchada desde la primera sesión, sin juicios.",
      autor: "Paciente (ejemplo)",
    },
    {
      texto:
        "Texto de ejemplo — aquí irá una reseña real. El taller me ayudó a entender cosas de mí que llevaba años cargando.",
      autor: "Asistente a taller (ejemplo)",
    },
    {
      texto:
        "Texto de ejemplo — aquí irá una reseña real. Las sesiones en línea funcionaron muy bien para mí.",
      autor: "Paciente en línea (ejemplo)",
    },
  ],
};
