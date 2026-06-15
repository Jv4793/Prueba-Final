# PlayStation Zone

## 1. Descripción del proyecto

PlayStation Zone es una WebApp progresiva sobre consolas PlayStation, videojuegos destacados, favoritos del usuario y clima para jugar. Está diseñada con una estética gaming moderna, limpia y responsive.

## 2. Objetivo de la práctica

El objetivo es desarrollar una aplicación web progresiva completa usando tecnologías frontend estándar, preparada para ejecutarse con Live Server en Visual Studio Code y desplegarse en GitHub Pages sin backend.

## 3. Tecnologías utilizadas

- HTML5 semántico.
- CSS3 con variables, Grid, Flexbox, transiciones y media queries.
- JavaScript puro.
- Manifest PWA.
- Service Worker.
- LocalStorage.
- API pública Open-Meteo sin clave.

## 4. Funcionalidades implementadas

- Listado dinámico de consolas PlayStation.
- Listado dinámico de videojuegos destacados.
- Buscador por título, consola o género.
- Sistema de favoritos.
- Persistencia de favoritos en LocalStorage.
- Modo claro y modo oscuro persistente.
- Consulta de clima actual en Gijón, Asturias.
- Mensajes de carga y error.
- Navegación interna por anclas.
- Experiencia PWA instalable y funcionamiento offline básico.

## 5. Requisitos cumplidos de HTML y CSS

- `index.html` incluye `DOCTYPE`, `lang="es"`, `charset`, viewport, description, theme color, manifest, iconos, CSS y JavaScript con `defer`.
- Se usan etiquetas semánticas: `header`, `nav`, `main`, `section`, `article` y `footer`.
- Existe un único `h1` y secciones con `h2` y tarjetas con `h3`.
- Todas las imágenes generadas dinámicamente incluyen atributo `alt`.
- `styles.css` incluye variables en `:root`, modo oscuro, diseño responsive, tarjetas, botones, focus visible, mensajes de carga/error y media queries.

## 6. Requisitos cumplidos de JavaScript

- Existen los arrays `consolasPlayStation` y `videojuegosPlayStation`.
- Las tarjetas se generan dinámicamente con JavaScript.
- Se implementan funciones como `renderConsolas()`, `renderVideojuegos()`, `renderFavoritos()`, `toggleFavorito()`, `guardarFavoritos()`, `cargarFavoritos()`, `aplicarModoOscuro()`, `obtenerClima()` y `registrarServiceWorker()`.
- Se usa `fetch()` para consultar la API pública.
- Hay `console.log()` útiles para comprobar carga de datos, favoritos, tema, API y Service Worker.
- El código incluye comentarios explicativos en las partes principales.

## 7. Requisitos cumplidos de PWA

- `manifest.json` define nombre, nombre corto, descripción, `start_url`, `scope`, `display`, colores, idioma, orientación e iconos.
- `service-worker.js` define caché, instala archivos principales, activa limpieza de versiones antiguas y responde a peticiones con estrategia cache first.
- Archivos cacheados principales:
  - `./`
  - `./index.html`
  - `./css/styles.css`
  - `./js/app.js`
  - `./manifest.json`
  - `./icons/icon-192.png`
  - `./icons/icon-512.png`

## 8. Accesibilidad y usabilidad

- Enlace para saltar al contenido principal.
- Botones con texto visible o `aria-label`.
- `aria-live` en zonas dinámicas.
- `aria-pressed` en favoritos y modo oscuro.
- Formularios con `label`.
- Navegación funcional por teclado.
- Focus visible en enlaces, botones e inputs.
- Contraste alto en modo claro y oscuro.
- Mensajes claros cuando no hay favoritos o falla la API.

## 9. Uso de LocalStorage

LocalStorage guarda:

- Videojuegos favoritos en `playstation-zone-favoritos`.
- Preferencia visual en `playstation-zone-tema`.

Al recargar la página, los favoritos y el modo claro/oscuro se mantienen.

## 10. Uso de API pública Open-Meteo

La sección "Clima para jugar" usa Open-Meteo sin clave:

```text
https://api.open-meteo.com/v1/forecast?latitude=43.5322&longitude=-5.6611&current=temperature_2m,wind_speed_10m,weather_code,is_day&timezone=Europe%2FMadrid
```

Se muestran temperatura, velocidad del viento y un mensaje personalizado.

## 11. Estructura de carpetas

```text
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── assets/
│   └── images/
├── manifest.json
├── service-worker.js
├── README.md
└── .gitignore
```

## 12. Cómo abrir en local con Visual Studio Code

1. Abre Visual Studio Code.
2. Selecciona `File > Open Folder`.
3. Abre la carpeta del proyecto.
4. Revisa `index.html`, `css/styles.css` y `js/app.js`.

## 13. Cómo probar con Live Server

1. Instala la extensión Live Server si no la tienes.
2. Haz clic derecho sobre `index.html`.
3. Selecciona `Open with Live Server`.
4. Abre la consola del navegador para revisar los mensajes de carga, favoritos, tema, API y Service Worker.
5. Para probar offline, carga la web una vez, abre DevTools, activa modo offline y recarga.

## 14. Cómo subir a GitHub

Si Git está instalado:

```bash
git init
git add .gitignore index.html manifest.json icons/
git commit -m "Estructura inicial de la PWA"

git add css/ js/ assets/
git commit -m "Interfaz responsive y contenido dinámico"

git add service-worker.js README.md checklist-entrega.md AUDITORIA-FINAL.md
git commit -m "Service Worker, LocalStorage, API y documentación"

git branch -M main
git remote add origin https://github.com/USUARIO/playstation-zone.git
git push -u origin main
```

Si ya tienes un repositorio inicializado, usa solo `git add`, `git commit` y `git push` según corresponda.

## 15. Cómo desplegar en GitHub Pages

1. Crea un repositorio público en GitHub.
2. Sube el proyecto.
3. Entra en `Settings`.
4. Entra en `Pages`.
5. Selecciona la rama `main`.
6. Selecciona la carpeta `root`.
7. Guarda los cambios.
8. Copia la URL pública generada por GitHub Pages.

## 16. Créditos

- Datos meteorológicos: Open-Meteo.
- Contenido técnico y estructura PWA desarrollados para la práctica.
- Imágenes internas creadas como SVG propios en `assets/images/` para evitar rutas externas y dependencias.

## 17. Autor

Jorge Hernández.
