# Validación de recuperación meteorológica — 2026-11-07

Base: `main@c569c2c`. La consulta a Open-Meteo ahora tiene un límite de ocho
segundos, cancela una petición anterior antes de iniciar otra y valida que
temperatura, viento, código e indicador día/noche sean números utilizables. Un
fallo conserva la aplicación y muestra **Reintentar clima**; las respuestas
tardías de una solicitud sustituida no pueden sobrescribir la más reciente. El
shell pasa a caché `v6` para distribuir el JavaScript actualizado.

Entorno local: Linux, Node 24, Playwright 1.64.1 y Chromium 154.0.8037.57.

| Comprobación | Resultado |
| --- | --- |
| Sintaxis de aplicación y worker | Correcta |
| Worker | 19/19 pruebas: instalación, actualización, offline, cuota y aislamiento |
| Chromium | 7/7 recorridos: raíz/subruta, escritorio/móvil, almacenamiento denegado y reintento meteorológico |
| Open-Meteo real | Bloqueado: conexión HTTPS rechazada antes de recibir respuesta |

El séptimo recorrido devuelve primero HTTP 503 y después un contrato válido;
comprueba el botón de reintento y que la segunda respuesta se renderice. Los
otros recorridos conservan favoritos, tema, actualización del service worker,
carga offline, imágenes y una caché ajena.

La consulta real se intentó contra la misma URL pública y terminó con
`ECONNREFUSED` en el puerto 443. No se atribuye a la aplicación ni acredita el
proveedor. Siguen pendientes Firefox/WebKit, instalación PWA, publicación y
equipos Windows, macOS, Android e iOS reales.
