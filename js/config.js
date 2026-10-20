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
  cedula: "Céd. Prof. 11069167", // se muestra en el pie de página

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

  // --- Áreas de atención (documento "Áreas de Atención y Servicios") -------
  // categoria: "personas" (Para quién) · "emocional" (Salud emocional) ·
  //            "trauma" (Trauma, violencia y duelo)
  // frase: frase corta de sus flyers (opcional).
  // temas: lo que se atiende (se muestran 6 y el resto con "ver más").
  // objetivo / nota: textos de su documento.
  // flyers: imágenes de la carpeta Actividades que abre "Ver flyer".
  servicios: [
    {
      titulo: "Psicología infantil",
      categoria: "personas",
      para: "Niñas y niños",
      frase: "Un espacio seguro para jugar, expresar y comprender lo que sienten.",
      temas: [
        "Ansiedad y miedos",
        "Regulación emocional",
        "Impulsividad",
        "Dificultades de conducta",
        "TDAH y TEA",
        "Baja autoestima",
        "Bullying",
        "Duelo infantil",
        "Separación o divorcio de los padres",
        "Adaptación escolar",
        "Experiencias adversas y trauma",
        "Socialización y habilidades interpersonales",
      ],
      objetivo:
        "Recursos: cuentos terapéuticos, arteterapia, actividades lúdicas, identificación emocional, estrategias de autorregulación y orientación a padres.",
      flyers: ["Actividades/13.jpeg"],
    },
    {
      titulo: "Psicología para adolescentes",
      categoria: "personas",
      para: "Adolescentes",
      frase: "Un espacio seguro para expresar, comprender y reconstruir su historia.",
      temas: [
        "Ansiedad y depresión",
        "Distimia",
        "Construcción de identidad",
        "Autoestima y autoconcepto",
        "Regulación emocional",
        "TDAH y autismo",
        "Bullying y ciberbullying",
        "Dificultades sociales",
        "Duelo y pérdidas",
        "Conflictos familiares",
        "Imagen corporal",
        "Problemas escolares",
        "Relaciones afectivas",
        "Conductas impulsivas y de riesgo",
      ],
      objetivo:
        "Acompañar al adolescente en su desarrollo emocional, fortalecer su autonomía y darle herramientas para afrontar las dificultades de esta etapa.",
      flyers: ["Actividades/14.jpeg"],
    },
    {
      titulo: "Terapia de pareja",
      categoria: "personas",
      para: "Parejas con y sin neurodivergencias",
      frase: "Reconecten, compréndanse y construyan juntos.",
      temas: [
        "Comunicación",
        "Resolución de conflictos",
        "Distanciamiento emocional",
        "Problemas de confianza",
        "Acuerdos de convivencia",
        "Límites",
        "Necesidades afectivas",
        "Conflictos de crianza",
        "Intimidad emocional",
        "Procesos de separación",
      ],
      objetivo: "Desarrollar habilidades de comunicación, comprensión mutua y acuerdos saludables.",
      nota: "Cuando hay antecedentes de violencia, se realiza una valoración previa de seguridad.",
      flyers: ["Actividades/15.jpeg"],
    },
    {
      titulo: "Parejas neurodivergentes",
      categoria: "personas",
      para: "Uno o ambos con TDAH o autismo",
      temas: [
        "Diferencias en comunicación y procesamiento emocional",
        "Sensibilidad sensorial",
        "Organización y responsabilidades",
        "Funciones ejecutivas",
        "Manejo de conflictos",
        "Necesidades de espacio y cercanía",
        "Comprensión de las diferencias individuales",
      ],
      objetivo:
        "Favorecer acuerdos, comprensión mutua y formas de convivencia respetuosas de las características neurodivergentes.",
    },
    {
      titulo: "Psicoeducación y orientación familiar",
      categoria: "personas",
      para: "Pacientes, padres, cuidadores, familias y escuelas",
      temas: [
        "Comprensión de diagnósticos psicológicos",
        "Manejo y regulación de emociones",
        "Estrategias de afrontamiento",
        "Comunicación asertiva",
        "Límites",
        "Crianza y desarrollo emocional",
        "Familias neurodivergentes",
        "Familiares con TLP o trastorno bipolar",
        "Prevención y reconocimiento de crisis",
        "Psicoeducación sobre adicciones",
        "Prevención de violencia",
        "Orientación a docentes",
      ],
      objetivo:
        "Información clara, herramientas prácticas y recursos de apoyo para el bienestar individual y familiar.",
    },
    {
      titulo: "Psicogerontología",
      categoria: "personas",
      para: "Personas mayores",
      frase: "Tu historia tiene valor. Tu voz sigue contando.",
      temas: [
        "Tu propia voz entre mandatos y etiquetas",
        "Historia, identidad y sentido de vida",
        "Duelos, cambios y vínculos",
        "Regulación emocional respetando tu autonomía",
      ],
      flyers: ["Actividades/5.jpeg"],
    },
    {
      titulo: "Ansiedad y trastornos relacionados",
      categoria: "emocional",
      frase: "Tu cuerpo no está en peligro: está intentando protegerte.",
      temas: [
        "Ansiedad generalizada (TAG)",
        "Crisis de ansiedad y ataques de pánico",
        "Ansiedad social y fobias",
        "Ansiedad por separación",
        "Estrés y dificultades de adaptación",
        "Manifestaciones físicas de la ansiedad",
      ],
      objetivo:
        "Fortalecer tus recursos de afrontamiento y desarrollar estrategias para comprender y regular las respuestas de ansiedad.",
      flyers: ["Actividades/19.jpeg", "Actividades/17.jpeg"],
    },
    {
      titulo: "Depresión y distimia",
      categoria: "emocional",
      frase: "No es flojera ni falta de voluntad: es dolor que lleva tiempo en silencio.",
      temas: [
        "Trastornos depresivos",
        "Depresión persistente o distimia",
        "Desmotivación y pérdida de interés",
        "Vacío emocional y autoestima",
        "Experiencias de vida difíciles",
      ],
      objetivo:
        "Regulación emocional, autoconocimiento, recuperar actividades significativas y construir objetivos personales.",
      flyers: ["Actividades/20.jpeg", "Actividades/6.jpeg"],
    },
    {
      titulo: "Trastorno bipolar",
      categoria: "emocional",
      temas: [
        "Psicoeducación sobre el trastorno",
        "Señales tempranas de recaída",
        "Manejo del estrés",
        "Rutinas y hábitos saludables",
        "Autoestima",
        "Orientación y acompañamiento familiar",
      ],
      objetivo:
        "Apoyo psicoterapéutico complementario, en coordinación con el tratamiento psiquiátrico indicado.",
    },
    {
      titulo: "TLP",
      subtitulo: "Trastorno límite de la personalidad",
      categoria: "emocional",
      frase: "Sentirlo todo no es exagerar. Tiene una historia.",
      temas: [
        "Regulación emocional",
        "Impulsividad",
        "Temor al abandono",
        "Identidad y autoconcepto",
        "Relaciones inestables",
        "Sentimientos de vacío",
        "Tolerancia al malestar",
        "Establecimiento de límites",
      ],
      objetivo:
        "Manejar emociones intensas, comprender patrones relacionales y fortalecer una identidad más estable.",
      nota: "Se integran habilidades de DBT, que no equivalen al programa integral de DBT.",
      flyers: ["Actividades/16.jpeg", "Actividades/7.jpeg"],
    },
    {
      titulo: "TOC",
      subtitulo: "Trastorno obsesivo-compulsivo",
      categoria: "emocional",
      frase: "No son manías: muchas veces es buscar control cuando por dentro hay miedo.",
      temas: [
        "Pensamientos obsesivos e intrusivos",
        "Compulsiones y rituales",
        "Ansiedad asociada",
        "Necesidad de certeza",
        "Culpa y vergüenza",
        "Impacto en la vida cotidiana",
      ],
      objetivo:
        "Psicoeducación y apoyo emocional, junto con el acceso a tratamientos específicos como la terapia cognitivo-conductual con exposición y prevención de respuesta (EPR).",
      flyers: ["Actividades/18.jpeg"],
    },
    {
      titulo: "TDAH",
      subtitulo: "Déficit de atención e hiperactividad",
      categoria: "emocional",
      para: "Niños, adolescentes y adultos",
      frase: "Herramientas que se adaptan a ti, a tu edad y a tu contexto.",
      temas: [
        "Atención y concentración",
        "Impulsividad",
        "Hiperactividad",
        "Organización y planificación",
        "Funciones ejecutivas",
        "Procrastinación",
        "Regulación emocional",
        "Autoestima y autoconcepto",
        "Dificultades escolares y laborales",
        "Estrategias para la vida cotidiana",
      ],
      objetivo:
        "Reconocer fortalezas y necesidades, desarrollar herramientas de organización y autorregulación y favorecer la autonomía.",
      flyers: ["Actividades/2.jpeg"],
    },
    {
      titulo: "TEA",
      subtitulo: "Trastorno del espectro autista",
      categoria: "emocional",
      para: "Niños, adolescentes y adultos autistas",
      temas: [
        "Necesidades emocionales y sensoriales",
        "Regulación emocional",
        "Comunicación y habilidades sociales",
        "Comprensión de las propias emociones",
        "Autoconocimiento e identidad",
        "Cambios y transiciones",
        "Adaptaciones escolares y familiares",
        "Prevención de sobrecarga emocional",
        "Psicoeducación familiar",
      ],
      objetivo:
        "Fortalecer el bienestar y la autonomía respetando la identidad neurodivergente, sin promover la supresión forzada de comportamientos propios del autismo.",
    },
    {
      titulo: "Trastornos de la conducta alimentaria",
      categoria: "emocional",
      frase: "No reduzco tu proceso al peso: acompaño tu relación con el cuerpo y tu historia.",
      temas: [
        "Anorexia nerviosa",
        "Bulimia nerviosa",
        "Trastorno por atracón",
        "Insatisfacción e imagen corporal",
        "Autoestima ligada al peso y la apariencia",
        "Emociones asociadas con la alimentación",
      ],
      objetivo:
        "Trabajar lo emocional, la identidad y el autoconcepto como parte de un tratamiento especializado y multidisciplinario.",
      flyers: ["Actividades/22.jpeg"],
    },
    {
      titulo: "Adicciones",
      categoria: "emocional",
      frase: "No te defino por tu consumo: te acompaño a comprender lo que intentas aliviar.",
      temas: [
        "Consumo problemático de alcohol",
        "Cannabis y otras sustancias",
        "Cocaína y estimulantes",
        "Dependencia de sustancias",
        "Juego problemático",
        "Regulación emocional",
        "Motivación para el cambio",
        "Prevención de recaídas",
        "Acompañamiento familiar",
      ],
      objetivo:
        "Reconocer los factores psicológicos del consumo y fortalecer el afrontamiento, en coordinación con servicios especializados cuando sea necesario.",
      flyers: ["Actividades/21.jpeg"],
    },
    {
      titulo: "Autoestima, autoconcepto e identidad",
      categoria: "emocional",
      frase: "Uno de los pilares centrales de la Terapia del Pulso de Origen Vital.",
      temas: [
        "Baja autoestima",
        "Autocrítica excesiva",
        "Inseguridad personal",
        "Sentimientos de insuficiencia",
        "Dependencia de la aprobación externa",
        "Autoaceptación",
        "Conflictos de identidad",
        "Creencias limitantes",
        "Reconocer tus fortalezas",
        "Límites saludables",
      ],
      objetivo: "Autoconocimiento, aceptación personal y una identidad más consciente y auténtica.",
    },
    {
      titulo: "Trauma y trastornos disociativos",
      categoria: "trauma",
      frase: "Tu experiencia merece comprensión. Tu proceso merece tiempo.",
      temas: [
        "Experiencias traumáticas",
        "Estrés postraumático (TEPT)",
        "Experiencias adversas en la infancia",
        "Miedo e hipervigilancia",
        "Seguridad emocional",
        "Consecuencias de experiencias violentas",
        "Apoyo complementario ante síntomas disociativos",
      ],
      objetivo: "Desarrollar seguridad, estabilización emocional y recursos de afrontamiento.",
      nota: "El trastorno de identidad disociativo y otras condiciones disociativas complejas requieren atención especializada.",
      flyers: ["Actividades/4.jpeg", "Actividades/3.jpeg"],
    },
    {
      titulo: "Víctimas de violencia",
      categoria: "trauma",
      temas: [
        "Violencia psicológica",
        "Violencia física",
        "Violencia sexual",
        "Violencia económica y patrimonial",
        "Violencia familiar",
        "Violencia de pareja",
        "Violencia vicaria",
        "Violencia digital",
        "Control coercitivo y manipulación",
      ],
      objetivo:
        "Fortalecer la seguridad, la autonomía y los recursos psicológicos de las personas afectadas, respetando su ritmo y sus decisiones.",
    },
    {
      titulo: "Violencia narcisista y relaciones dañinas",
      categoria: "trauma",
      temas: [
        "Manipulación emocional",
        "Descalificación y humillaciones",
        "Gaslighting",
        "Dependencia emocional",
        "Culpabilización",
        "Aislamiento y control",
        "Dificultad para poner límites",
        "Pérdida de autoestima y confianza",
      ],
      objetivo: "Reconocer dinámicas de maltrato, fortalecer la identidad y recuperar la autonomía emocional.",
      nota: "«Violencia narcisista» describe dinámicas de maltrato; no es un diagnóstico de quien ejerce violencia.",
    },
    {
      titulo: "Bullying y violencia escolar",
      categoria: "trauma",
      temas: [
        "Acoso escolar",
        "Ciberbullying",
        "Exclusión y rechazo social",
        "Humillaciones recurrentes",
        "Ansiedad por el entorno escolar",
        "Baja autoestima",
        "Dificultades de integración",
        "Redes de apoyo",
        "Orientación a padres y docentes",
      ],
      objetivo:
        "Fortalecer la seguridad emocional y los recursos de protección, junto con la familia y la escuela cuando corresponda.",
    },
    {
      titulo: "Tanatología y procesos de duelo",
      categoria: "trauma",
      frase: "Honrar, sentir y resignificar también es sanar.",
      temas: [
        "Pérdidas gestacionales",
        "Aborto espontáneo e interrupción del embarazo",
        "Muerte fetal, perinatal y neonatal",
        "Duelo por infertilidad",
        "Muerte de hijos, padres, pareja y seres queridos",
        "Duelo infantil y adolescente",
        "Duelo anticipatorio",
        "Enfermedades graves y terminales",
        "Separación y divorcio",
        "Duelo migratorio",
        "Pérdidas laborales y económicas",
        "Cambios de identidad y proyecto de vida",
        "Muerte de animales de compañía",
      ],
      objetivo:
        "Acompañar con respeto la pérdida, favorecer su elaboración emocional y apoyar la reconstrucción del sentido de vida.",
      flyers: ["Actividades/8.jpeg", "Actividades/10.jpeg", "Actividades/9.jpeg", "Actividades/11.jpeg"],
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
