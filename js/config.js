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
  whatsapp: "525637799686",
  telefonoVisible: "56 3779 9686",
  email: "", // Ej. "contacto@analaura.mx"
  instagram: "", // URL completa
  facebook: "", // URL completa

  // --- Ubicación -----------------------------------------------------------
  direccion: "Tzenzontle 9, Las Arboledas",
  ciudad: "52950 Cd. López Mateos, Atizapán de Zaragoza, Edo. Méx.",
  googleMapsUrl: "https://maps.app.goo.gl/tatccwMxJ53QBbca7",
  // Mapa insertado (src del iframe):
  googleMapsEmbed:
    "https://maps.google.com/maps?q=19.5593456,-99.2171605&z=16&hl=es&output=embed",

  // Calificación en Google (actualizar de vez en cuando):
  google: { calificacion: "5,0", resenas: 64 },

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
  // Reseñas reales de su ficha de Google Maps (nombre + inicial del apellido).
  // "detalle" es opcional. Si la lista queda vacía, la sección se oculta sola.
  testimonios: [
    {
      texto:
        "Estoy muy agradecida con la psicóloga Ana Laura por todo el apoyo que me ha dado. Desde la primera sesión me hizo sentir en confianza y nunca me he sentido juzgada al hablar con ella.",
      autor: "Diana C.",
    },
    {
      texto:
        "La terapia que he recibido me ha ayudado a verme de manera distinta y sanar poco a poco. Es muy buena en su trabajo y lo hace con mucha pasión y entrega. 100% recomendable.",
      autor: "Alejandra R.",
    },
    {
      texto:
        "Increíble atención profesional y empática, el enfoque humanista de la Dra. Ana es de mucha ayuda.",
      autor: "Ayrton F.",
    },
    {
      texto:
        "Extraordinaria psicóloga, principios y ética profesional intachable. Mi admiración y reconocimiento total. Tomo mis terapias desde la ciudad de Acapulco y 10/10.",
      autor: "Azucena C.",
      detalle: "Online desde Acapulco",
    },
    {
      texto:
        "Excelente psicóloga, he tomado las terapias presencial y puedo decir que me han ayudado demasiado, tiene calidez humana.",
      autor: "Berenice R.",
      detalle: "Presencial",
    },
    {
      texto:
        "100% profesional, amable, empática y con alternativas que me han ayudado a ir progresando poco a poco. Los cambios se han notado y es algo que agradezco enormemente.",
      autor: "Alexis R.",
    },
    {
      texto:
        "Eres mi primer acercamiento a la psicología y puedo decir que tomé la decisión correcta al escogerte como el inicio de mi mejora personal.",
      autor: "Kevin F.",
    },
    {
      texto:
        "Excelente terapeuta, muy atenta. No importa la distancia y no hay pretexto para tu salud mental: por medio de videollamada se puede. Saludos desde el Caribe, 100% recomendada.",
      autor: "Tere",
      detalle: "Online desde el Caribe",
    },
    {
      texto:
        "Es muy profesional y paciente al escuchar. Llevo con ella más de 3 meses y veo avances en lo personal, en mis emociones y en mi vida. ¡La recomiendo al 100%!",
      autor: "Irving B.",
    },
  ],
};
