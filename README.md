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
| Servidor de citas | `agendaApi` (ver `backend/LEEME.md`) |
| Días y horarios disponibles | `backend/Code.gs` → `HORARIO` (o `agenda.horario` si no hay servidor) |
| Vacaciones / días sin consulta | `agenda.diasBloqueados` |
| Talleres | `talleres` (copiar un bloque para agregar otro) |
| Testimonios | `testimonios` (si queda vacío, la sección se oculta) |

### Imágenes

- `img/logo.png` → logotipo circular (si no existe, se muestra un logo de respaldo).
- `img/ana-laura.jpg` → foto para "Sobre mí" (si no existe, se muestra un marcador).

## Cómo funciona la agenda

La agenda se conecta al **Google Calendar de Ana Laura** mediante un pequeño servidor gratuito de Google Apps Script (carpeta [`backend/`](backend/LEEME.md)):

1. La página muestra solo los horarios libres (horario de consulta menos lo que ya hay en su calendario).
2. Al reservar, el horario se aparta al instante y nadie más puede tomarlo.
3. La cita se crea en su calendario (con Google Meet si es online).
4. Llega un correo de confirmación al paciente y otro de aviso a Ana Laura, con un botón para confirmarle por WhatsApp.
5. Un día antes, el paciente recibe un recordatorio por correo.

**Instalación:** seguir [`backend/LEEME.md`](backend/LEEME.md) y pegar la URL del servidor en `agendaApi` de `js/config.js`.
Mientras `agendaApi` esté vacío, la agenda usa el horario fijo de `config.js` y envía la solicitud por WhatsApp.

## Publicar

Su ficha de Google Maps ya enlaza a `anapsicologa.github.io`. Para que esa dirección muestre este sitio, crear en la cuenta de GitHub **anapsicologa** un repositorio llamado `anapsicologa.github.io` con estos archivos (o activar GitHub Pages en este repositorio y actualizar el enlace en Google Maps).

## Pendientes

- [x] Número de WhatsApp real
- [x] Dirección y mapa (Google Maps)
- [x] Reseñas de Google (3 destacadas + calificación 5,0 / 64 reseñas)
- [ ] Subir `img/logo.png` y `img/ana-laura.jpg`
- [ ] Formación académica y cédula profesional
- [ ] Instalar el servidor de citas (`backend/LEEME.md`) y poner su URL en `agendaApi`
- [ ] Horario de consulta real
- [ ] Fechas y precios reales de talleres
- [ ] Más testimonios (opcional)
- [ ] Formas de pago
