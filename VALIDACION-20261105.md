# Validación PWA y almacenamiento — 2026-11-05

Base: PR #1, `dd9bbf40fec362f796e0838f7d9951671da28434`. Al denegar
localStorage, la lectura del tema abortaba el arranque; una escritura fallida
tampoco permitía completar las acciones de favoritos/tema. Ahora la aplicación
continúa con estado en memoria y muestra el límite de persistencia. Las claves
y el formato de datos existentes se conservan.

El worker usa la versión `v5` dentro de su prefijo por scope para distribuir el
cambio. Solo elimina versiones antiguas de ese mismo scope; conserva las cachés
ajenas y las antiguas sin propietario inequívoco.

Validación en Linux, Node 24.19.0, Playwright 1.64.1 y Chromium del sistema:

```sh
node --check js/app.js
node --check service-worker.js
node --test tests/service-worker.test.mjs
PLAYWRIGHT_MODULE=/ruta/a/playwright CHROMIUM_PATH=/usr/bin/chromium node tests/browser.mjs
```

**19 pruebas del worker y 6 recorridos Chromium aprobados**. Los cuatro recorridos
normales comprueban raíz/subruta, escritorio/tamaño móvil, favoritos y tema tras
recarga y actualización real del SW, carga offline, imágenes y caché ajena intacta.
Los dos restantes deniegan explícitamente lectura o escritura de localStorage y
comprueban catálogo, búsqueda, favoritos en memoria y aviso visible sin error JS.
La regresión de lectura denegada falla sobre la base con `SecurityError` y pasa
tras el arreglo. La denegación es inyectada: no simula una cuota física agotada.

El servidor de prueba modifica el worker únicamente en memoria para provocar
una actualización posterior; no modifica los archivos del proyecto. La respuesta
de Open-Meteo es un doble declarado, no una validación actual del proveedor.

Pendientes: integración de la PR, CI, instalación PWA en equipos físicos,
Firefox/WebKit, publicación y proveedor meteorológico real. No hay paquetes
nativos acreditados. Revisión posterior del diff por el mismo agente, sin
subagentes. Las comprobaciones anteriores de `checklist-entrega.md` son históricas.
