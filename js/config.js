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

  // --- Agenda -------------------------------------------------------------
  // URL del servidor de citas (Google Apps Script). Ver backend/LEEME.md.
  // Con la URL puesta: los horarios salen del Google Calendar de Ana Laura,
  // cada reserva aparta el horario y se envían correos a ella y al paciente.
  // El horario de consulta se edita entonces en backend/Code.gs.
  // Sin URL (""): se usa el horario de abajo y la solicitud va por WhatsApp.
  agendaApi: "",

  // Horario de respaldo (solo se usa si agendaApi está vacío).
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

  // --- Servicios (resumen de los flyers de la carpeta Actividades) ---------
  // categoria: "etapas" (Para quién) · "emocional" (Salud emocional) ·
  //            "duelo" (Duelo y pérdidas)
  // flyers: imágenes que se abren con el botón "Ver flyer".
  servicios: [
    {
      titulo: "Terapia para niños",
      categoria: "etapas",
      para: "Niñas y niños",
      frase: "Un espacio seguro para jugar, expresar y comprender lo que sienten.",
      puntos: [
        "Pulso de Origen + arteterapia: juego, arte y regulación emocional.",
        "Ansiedad, conducta, autoestima, miedos, duelo y cambios.",
        "Acompaño también a mamá y papá para fortalecer el proceso.",
      ],
      flyers: ["Actividades/13.jpeg"],
    },
    {
      titulo: "Terapia para adolescentes",
      categoria: "etapas",
      para: "Adolescentes",
      frase: "Un espacio seguro para expresar, comprender y reconstruir su historia.",
      puntos: [
        "Pulso de Origen + arteterapia: arte, palabra y regulación emocional.",
        "Ansiedad, depresión, identidad y autoestima.",
        "Vínculos, duelo y heridas emocionales.",
      ],
      flyers: ["Actividades/14.jpeg"],
    },
    {
      titulo: "Terapia de pareja",
      categoria: "etapas",
      para: "Parejas",
      frase: "Reconecten, compréndanse y construyan juntos una relación más sana.",
      puntos: [
        "Método: cuerpo · emoción · historia · elección · conexión.",
        "Comunicación, conflictos sanos, confianza e intimidad.",
        "Sesiones individuales para sanar lo que duele en silencio.",
      ],
      flyers: ["Actividades/15.jpeg"],
    },
    {
      titulo: "Psicogerontología",
      categoria: "etapas",
      para: "Personas mayores",
      frase: "Tu historia tiene valor. Tu voz sigue contando.",
      puntos: [
        "Reconocer tu propia voz, tu historia y tu sentido de vida.",
        "Acompañar duelos, cambios y vínculos.",
        "Regulación emocional a tu ritmo, respetando tu autonomía.",
      ],
      flyers: ["Actividades/5.jpeg"],
    },
    {
      titulo: "Ansiedad",
      categoria: "emocional",
      frase: "Tu cuerpo no está en peligro: está intentando protegerte.",
      puntos: [
        "No solo controlar síntomas: liberar su origen emocional.",
        "Regular el sistema nervioso y salir del estado de alerta.",
        "DBT, Gestalt, logoterapia y trabajo con el niño interior.",
      ],
      flyers: ["Actividades/19.jpeg", "Actividades/17.jpeg"],
    },
    {
      titulo: "Depresión",
      categoria: "emocional",
      para: "Adolescentes y adultos",
      frase: "No es flojera ni falta de voluntad: es dolor que lleva tiempo en silencio.",
      puntos: [
        "Recuperar energía y actividades significativas.",
        "Comprender emociones, necesidades, heridas y pérdidas.",
        "Fortalecer vínculos, autocuidado y sentido de vida.",
      ],
      flyers: ["Actividades/20.jpeg", "Actividades/6.jpeg"],
    },
    {
      titulo: "TLP",
      subtitulo: "Trastorno límite de la personalidad",
      categoria: "emocional",
      para: "Adolescentes y adultos",
      frase: "Sentirlo todo no es exagerar. Tiene una historia.",
      puntos: [
        "Habilidades DBT para emociones intensas e impulsos.",
        "Vínculos, límites y miedo al abandono.",
        "Identidad y sentido: más calma y estabilidad.",
      ],
      flyers: ["Actividades/16.jpeg", "Actividades/7.jpeg"],
    },
    {
      titulo: "TID",
      subtitulo: "Trastorno de identidad disociativo",
      categoria: "emocional",
      frase: "Tu experiencia merece comprensión. Tu proceso merece tiempo.",
      puntos: [
        "Seguridad, estabilidad y anclaje al presente.",
        "Comprensión y cooperación entre estados de identidad.",
        "Trabajo gradual con el trauma, según tu estabilidad y consentimiento.",
      ],
      flyers: ["Actividades/4.jpeg", "Actividades/3.jpeg"],
    },
    {
      titulo: "TOC",
      subtitulo: "Trastorno obsesivo-compulsivo",
      categoria: "emocional",
      frase: "No son manías: muchas veces es buscar control cuando por dentro hay miedo.",
      puntos: [
        "Sanar el origen emocional que sostiene el ciclo.",
        "Recuperar calma, espacio mental y control interno.",
        "DBT, Gestalt, logoterapia y trabajo con el niño interior.",
      ],
      flyers: ["Actividades/18.jpeg"],
    },
    {
      titulo: "TDAH",
      categoria: "emocional",
      para: "Niños, adolescentes y adultos",
      frase: "Herramientas que se adaptan a ti, a tu edad y a tu contexto.",
      puntos: [
        "Organización cotidiana: pasos pequeños, rutinas y apoyos visuales.",
        "Recursos para la frustración y la impulsividad.",
        "Autoestima y vínculos: comprender tus necesidades.",
      ],
      flyers: ["Actividades/2.jpeg"],
    },
    {
      titulo: "Adicciones",
      categoria: "emocional",
      frase: "No te defino por tu consumo: te acompaño a comprender lo que intentas aliviar.",
      puntos: [
        "El dolor, la ansiedad y el vacío que hay detrás.",
        "Trauma, culpa, vergüenza y patrones de repetición.",
        "Regular impulsos y prevenir recaídas, con apoyo médico o psiquiátrico si se requiere.",
      ],
      flyers: ["Actividades/21.jpeg"],
    },
    {
      titulo: "Trastornos alimentarios",
      categoria: "emocional",
      frase: "No reduzco tu proceso al peso: acompaño tu relación con el cuerpo y tu historia.",
      puntos: [
        "Autoestima, perfeccionismo, ansiedad y control.",
        "Sanar el vínculo contigo con sensibilidad y a tu ritmo.",
        "Trabajo coordinado con psiquiatría, medicina y nutrición si se requiere.",
      ],
      flyers: ["Actividades/22.jpeg"],
    },
    {
      titulo: "Tanatología y duelo",
      categoria: "duelo",
      frase: "Honrar, sentir y resignificar también es sanar.",
      puntos: [
        "No solo acompaño el dolor: te ayudo a comprenderlo y transformarlo.",
        "Integro tanatología, logoterapia, Gestalt, Jung y trauma.",
        "Un proceso único y respetuoso de tu historia y tu ritmo.",
      ],
      flyers: ["Actividades/8.jpeg"],
    },
    {
      titulo: "Duelo perinatal",
      categoria: "duelo",
      para: "Mamá, papá y pareja",
      frase: "Cuando un bebé se va, nace un duelo que merece ser nombrado y honrado.",
      puntos: [
        "No minimizo tu dolor ni lo apresuro.",
        "Trabajo el vínculo, la culpa, el cuerpo y el sentido de la pérdida.",
        "Acompaño a mamá, papá y pareja con una mirada sensible.",
      ],
      flyers: ["Actividades/10.jpeg"],
    },
    {
      titulo: "Infertilidad",
      categoria: "duelo",
      para: "Personas y parejas",
      frase: "Un espacio para sostener el duelo, la esperanza y el sentido. No tienen que atravesarlo solos.",
      puntos: [
        "Procesar dolor, frustración e incertidumbre.",
        "Culpa, heridas emocionales y autocuidado.",
        "Comunicación en pareja y reconexión con el sentido personal.",
      ],
      flyers: ["Actividades/9.jpeg"],
    },
    {
      titulo: "Pacientes terminales",
      categoria: "duelo",
      para: "Paciente y familia",
      frase: "Acompañar el final de la vida también es honrarla.",
      puntos: [
        "Escucha, contención y manejo emocional y espiritual.",
        "Apoyo a la familia.",
        "Cierre, despedida y legado.",
      ],
      flyers: ["Actividades/11.jpeg"],
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
