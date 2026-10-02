# Terapia del Pulso de Origen Vital — Sitio web

Sitio de la **Psic. Ana Laura Alemán Chávez**: metodología, corrientes que integra, consulta individual, talleres, agenda de citas y contacto.

Es un sitio estático (HTML + CSS + JS, sin dependencias), listo para publicarse gratis en GitHub Pages, Netlify o Vercel.

## Ver el sitio en tu computadora

Abre `index.html` en el navegador, o desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Cómo editar el contenido

Casi todo se cambia en **`js/config.js`**:

| Qué | Dónde |
| --- | --- |
| WhatsApp, correo, redes | `whatsapp`, `email`, `instagram`, `facebook` |
| Dirección y mapa | `direccion`, `ciudad`, `googleMapsUrl`, `googleMapsEmbed` |
| Precio y duración de la consulta | `consulta` |
| Días y horarios disponibles | `agenda.horario` (0 = domingo … 6 = sábado) |
| Vacaciones / días sin consulta | `agenda.diasBloqueados` |
| Talleres | `talleres` (copiar un bloque para agregar otro) |
| Testimonios | `testimonios` (si queda vacío, la sección se oculta) |

### Imágenes

- `img/logo.png` → logotipo circular (si no existe, se muestra un logo de respaldo).
- `img/ana-laura.jpg` → foto para "Sobre mí" (si no existe, se muestra un marcador).

## Cómo funciona la agenda

La persona elige día, hora y modalidad; al enviar, se abre WhatsApp con un mensaje ya escrito para Ana Laura, que confirma la cita manualmente. La agenda **no sabe** qué horarios ya están ocupados: para bloqueo automático se puede conectar más adelante Cal.com, Calendly o Google Calendar.

## Pendientes

- [ ] Número de WhatsApp real
- [ ] Dirección y mapa (Google Maps)
- [ ] Subir `img/logo.png` y `img/ana-laura.jpg`
- [ ] Formación académica y cédula profesional
- [ ] Fechas y precios reales de talleres
- [ ] Testimonios reales (con permiso)
- [ ] Formas de pago
