# Agenda de citas conectada a Google Calendar

Este servidor gratuito (Google Apps Script) hace que la agenda de la página:

- muestre **solo horarios libres**, según el horario de consulta y el Google Calendar de Ana Laura;
- **aparte el horario** al reservar: nadie más puede tomarlo, aunque dos personas reserven al mismo tiempo;
- cree la cita en su **Google Calendar**, con enlace de **Google Meet** si es online;
- envíe un **correo de confirmación al paciente** (con dirección o enlace de Meet, botón para agregarla a su calendario y botón de WhatsApp);
- envíe un **correo de aviso a Ana Laura** con los datos y un botón para **confirmar al paciente por WhatsApp** en un toque;
- mande un **recordatorio por correo** al paciente un día antes.

Se configura una sola vez y tarda unos 10 minutos. Hace falta la cuenta de Gmail de Ana Laura (la del calendario donde quiere ver sus citas).

---

## Instalación

### 1. Crear el proyecto

1. Con la cuenta de Gmail de Ana Laura, entra a **https://script.google.com** y pulsa **Nuevo proyecto**.
2. Arriba a la izquierda, cambia el nombre "Proyecto sin título" por **Agenda web**.
3. Borra todo lo que hay en `Código.gs` y pega el contenido completo de [`Code.gs`](Code.gs).

### 2. Pegar la configuración del proyecto

1. En el menú de la izquierda entra a **⚙️ Configuración del proyecto**.
2. Activa **"Mostrar el archivo de manifiesto appsscript.json en el editor"**.
3. Vuelve al **Editor** (`< >`), abre `appsscript.json`, borra su contenido y pega el de [`appsscript.json`](appsscript.json).
   Esto fija la zona horaria de México y activa Google Calendar para crear los enlaces de Meet.
4. Guarda (💾 o Ctrl + S).

### 3. Revisar horario y correo

Al inicio de `Code.gs`, dentro de `CONFIG`:

- `HORARIO`: días y horas de consulta. **Este es el horario que manda**: la página lo toma de aquí.
- `DIAS_BLOQUEADOS`: vacaciones o días festivos.
- `EMAIL_PSICOLOGA`: si se deja vacío, los avisos llegan al mismo Gmail.
- `ANTICIPACION_HORAS`: con cuántas horas de anticipación se puede reservar (12 por defecto).

### 4. Dar permisos y probar

1. En la barra de arriba, en el selector de funciones, elige **`probar`** y pulsa **▶ Ejecutar**.
2. Google pedirá permisos: **Revisar permisos** → elige la cuenta → aparece "Google no ha verificado esta aplicación" → **Configuración avanzada** → **Ir a Agenda web (no seguro)** → **Permitir**.
   El aviso sale porque el script es personal y no está publicado en una tienda. Solo lo usa su propia cuenta.
3. En el registro de ejecución debe aparecer cuántos días libres hay y a qué correo llegarán los avisos.

### 5. Activar los recordatorios

Elige la función **`instalarRecordatorios`** y pulsa **▶ Ejecutar** (una sola vez). Cada día a las 9:00 se envían los recordatorios de las citas del día siguiente.

### 6. Publicar el servidor

1. Arriba a la derecha: **Implementar → Nueva implementación**.
2. En el engrane ⚙️, tipo **Aplicación web**.
3. **Ejecutar como:** Yo. **Quién tiene acceso:** Cualquier usuario.
4. Pulsa **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).

### 7. Conectar la página

En `js/config.js` de la página web, pega la URL:

```js
agendaApi: "https://script.google.com/macros/s/XXXXXXXX/exec",
```

Sube el cambio a GitHub. Desde ese momento la agenda funciona en tiempo real.

---

## Uso diario

| Quiero… | Qué hacer |
| --- | --- |
| Ver mis citas | Abrir Google Calendar (celular o computadora). Cada cita dice nombre, teléfono, correo y motivo. |
| Bloquear un horario | Crear cualquier evento en el calendario a esa hora. Ese horario deja de aparecer en la página. |
| Tomar vacaciones | Crear un evento de **todo el día** (o varios días) en el calendario. |
| Cancelar una cita | Avisar al paciente y **borrar el evento**. El horario vuelve a quedar libre. |
| Cambiar el horario de consulta | Editar `HORARIO` en `Code.gs` y volver a implementar (ver abajo). |

### Si se modifica `Code.gs`

**Implementar → Gestionar implementaciones → ✏️ editar → Versión: Nueva versión → Implementar.**
Así la URL sigue siendo la misma y no hay que tocar la página.

---

## Límites y notas

- **Correos:** una cuenta de Gmail normal puede enviar unos 100 correos al día con Apps Script. Cada cita usa 2 y cada recordatorio 1, así que alcanza de sobra.
- **WhatsApp automático:** enviar mensajes de WhatsApp sin que nadie pulse "enviar" requiere la API oficial de WhatsApp Business (Meta). Es de pago, pide verificar el negocio y solo admite mensajes con plantillas aprobadas. Por ahora el correo de Ana Laura trae un botón que abre WhatsApp con la confirmación ya escrita para el paciente: un toque y listo. Si más adelante se quiere 100 % automático, se puede conectar.
- **Si el servidor falla** o la URL no está puesta, la página vuelve sola al modo anterior: horario fijo de `config.js` y solicitud por WhatsApp.
- **Privacidad:** los datos de los pacientes se guardan solo en el Google Calendar de Ana Laura, no en la página ni en GitHub.
