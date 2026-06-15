# Checklist de entrega - PlayStation Zone

| Requisito | Estado | Archivo donde se cumple | Explicación breve |
|---|---|---|---|
| HTML5 válido con `DOCTYPE` y `lang="es"` | Cumplido | `index.html` | El documento declara HTML5, idioma español, charset UTF-8 y viewport responsive. |
| Meta description y theme color | Cumplido | `index.html` | Incluye descripción SEO básica y color de tema PWA. |
| Enlaces a CSS, JS, manifest e iconos | Cumplido | `index.html` | Usa rutas relativas `./css/styles.css`, `./js/app.js`, `./manifest.json` e iconos PNG. |
| Etiquetas semánticas | Cumplido | `index.html` | Usa `header`, `nav`, `main`, `section`, `article` y `footer`. |
| Un único `h1` | Cumplido | `index.html` | El único `h1` es `PlayStation Zone`. |
| Encabezados ordenados | Cumplido | `index.html`, `js/app.js` | Las secciones usan `h2` y las tarjetas/paneles usan `h3`. |
| Menú con anclas internas | Cumplido | `index.html` | Navega a `#consolas`, `#videojuegos`, `#favoritos`, `#clima` y `#pwa`. |
| Sin textos de relleno ni mensajes internos visibles | Cumplido | `index.html` | La interfaz usa copy final y no contiene textos de trabajo visibles. |
| Variables CSS | Cumplido | `css/styles.css` | Define tokens en `:root` para colores, radios, sombras y transiciones. |
| Diseño responsive | Cumplido | `css/styles.css` | Usa Grid/Flexbox y media queries para móvil, tablet y escritorio. |
| Modo claro y oscuro | Cumplido | `css/styles.css`, `js/app.js` | Cambia con `data-theme` y persiste en LocalStorage. |
| Hover y transiciones | Cumplido | `css/styles.css` | Tarjetas, botones y enlaces tienen estados hover y transiciones suaves. |
| Focus visible | Cumplido | `css/styles.css` | `:focus-visible` mejora navegación por teclado. |
| Sin desbordamiento horizontal | Cumplido | `css/styles.css` | Verificado en Chromium a 1366px y 390px. |
| Arrays de datos | Cumplido | `js/app.js` | Incluye `consolasPlayStation` y `videojuegosPlayStation`. |
| Contenido dinámico | Cumplido | `js/app.js` | Consolas, videojuegos y favoritos se renderizan desde JavaScript. |
| Buscador funcional | Cumplido | `js/app.js` | Filtra por título, consola y género. |
| Favoritos funcionales | Cumplido | `js/app.js` | Permite añadir/quitar favoritos y actualiza la sección correspondiente. |
| LocalStorage | Cumplido | `js/app.js` | Guarda favoritos y preferencia de tema. |
| Console logs útiles | Cumplido | `js/app.js` | Registra carga de datos, favoritos, tema, API y Service Worker. |
| Imágenes cargan correctamente | Cumplido | `assets/images/`, `js/app.js` | 14 imágenes verificadas en Chromium sin roturas. |
| Sin imágenes embebidas en JavaScript | Cumplido | `js/app.js` | Las tarjetas usan rutas relativas a SVG del proyecto. |
| Imágenes con `alt` | Cumplido | `js/app.js` | Cada tarjeta genera `img` con texto alternativo descriptivo. |
| Manifest válido | Cumplido | `manifest.json` | JSON válido con nombre, descripción, `start_url`, `scope`, colores, iconos y `lang`. |
| Iconos PWA 192 y 512 | Cumplido | `icons/` | `icon-192.png` mide 192x192 y `icon-512.png` mide 512x512. |
| Service Worker registrado | Cumplido | `js/app.js`, `service-worker.js` | Se registra desde JavaScript con ruta relativa. |
| Caché offline | Cumplido | `service-worker.js` | Cachea HTML, CSS, JS, manifest, iconos e imágenes necesarias. |
| Versión de caché actualizada | Cumplido | `service-worker.js` | Usa `playstation-zone-v3`. |
| Fetch cache first | Cumplido | `service-worker.js` | Sirve recursos locales desde caché y guarda respuestas de red. |
| Recarga offline tras primera carga | Cumplido | `service-worker.js` | Verificado en Chromium con contexto offline. |
| API Open-Meteo | Cumplido | `js/app.js` | Consulta temperatura, viento, código meteorológico y día/noche. |
| Mensaje amigable si falla la API | Cumplido | `js/app.js`, `service-worker.js` | Muestra error comprensible y no rompe la app sin conexión. |
| Accesibilidad de formularios | Cumplido | `index.html` | El buscador tiene `label` asociado. |
| Botones accesibles | Cumplido | `index.html`, `js/app.js` | Botones con texto visible, `aria-label` o `aria-pressed` cuando aporta valor. |
| `aria-live` en zonas dinámicas | Cumplido | `index.html` | Resultados, favoritos y clima anuncian cambios relevantes. |
| README completo | Cumplido | `README.md` | Documenta descripción, tecnologías, uso local, PWA, API, GitHub Pages y autor. |
| Preparado para GitHub Pages | Cumplido | Proyecto raíz | `index.html` está en raíz, rutas relativas y sin backend. |
| Repositorio GitHub remoto | Pendiente externo | GitHub | Depende de crear el repositorio en GitHub. |
| Commits reales | Pendiente externo | Git local | Git no está disponible en el PATH de este entorno. |
| Activar GitHub Pages | Pendiente externo | GitHub | Debe configurarse manualmente en `Settings > Pages`. |
| Crear ZIP final | Pendiente externo | Sistema de archivos | Solo depende de empaquetar la carpeta final si se solicita entrega en ZIP. |
