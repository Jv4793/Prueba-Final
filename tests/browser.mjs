import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const worker = await readFile(path.join(root, 'service-worker.js'), 'utf8');
const version = /CACHE_NAME = `\$\{CACHE_PREFIX\}(v\d+)`/.exec(worker)[1];
const nextVersion = `v${Number(version.slice(1)) + 1}`;
let updating = false;
const allowed = new Set(['index.html', 'js/app.js', 'css/styles.css', 'manifest.json',
  'service-worker.js', 'icons/icon-192.png', 'icons/icon-512.png',
  ...(await readdir(path.join(root, 'assets/images'))).map(name => `assets/images/${name}`)]);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = url.pathname.replace(/^\/(?:Prueba-Final\/)?/, '') || 'index.html';
  if (!allowed.has(file)) { res.writeHead(404).end(); return; }
  try {
    const body = file === 'service-worker.js' && updating
      ? worker.replace(`}${version}\``, `}${nextVersion}\``)
      : await readFile(path.join(root, file));
    res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch { res.writeHead(500).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const cases = process.env.CHECK_STORAGE_DENIAL_ONLY
    ? [{ route: '/', width: 390, storage: 'get' }]
    : [
      ...['/', '/Prueba-Final/'].flatMap(route => [1440, 390].map(width => ({ route, width }))),
      { route: '/', width: 390, storage: 'get' },
      { route: '/Prueba-Final/', width: 390, storage: 'set' },
    ];
  for (const { route, width, storage } of cases) {
    updating = false;
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    let offline = false;
    // Explicit weather double: no external account, location lookup or provider claim.
    await context.route('https://api.open-meteo.com/**', route => offline
      ? route.abort('internetdisconnected')
      : route.fulfill({ json: { current: { temperature_2m: 20, wind_speed_10m: 5,
        weather_code: 0, is_day: 1 } } }));
    if (storage) await context.addInitScript(mode => {
      const denied = () => { throw new DOMException('Synthetic storage denial', 'SecurityError'); };
      if (mode === 'get') Object.defineProperty(window, 'localStorage', { get: denied });
      else Storage.prototype.setItem = denied;
    }, storage);
    try {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const url = origin + route;
      await page.goto(url);
      assert.deepEqual(errors, [], 'Application must initialize when storage is denied');
      await page.locator('#videojuegos-grid .favorite-button').first().waitFor();
      assert.ok(await page.locator('#consolas-grid article').count());
      const game = page.locator('#videojuegos-grid .favorite-button').first();
      const id = await game.getAttribute('data-id');
      await game.click();
      await page.waitForFunction(id => document.querySelector(`#favoritos-lista [data-id="${id}"]`), id);
      const previous = await page.locator('body').getAttribute('data-theme');
      await page.locator('#theme-toggle').click();
      const theme = await page.locator('body').getAttribute('data-theme');
      assert.notEqual(theme, previous);
      await page.locator('#buscador').fill('unmatched-synthetic-query');
      assert.equal(await page.locator('#videojuegos-grid article').count(), 0);
      await page.locator('#buscador').fill('');
      if (storage) {
        assert.equal(await page.locator('#estado-almacenamiento').isVisible(), true);
        assert.match(await page.locator('#estado-almacenamiento').innerText(), /podrían perderse/);
      } else {
        await page.reload();
        assert.equal(await page.locator('body').getAttribute('data-theme'), theme);
        assert.equal(await page.locator(`#favoritos-lista [data-id="${id}"]`).count(), 1);
        await page.evaluate(() => navigator.serviceWorker.ready);
        await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
        await page.evaluate(async () => {
          await (await caches.open('unrelated-app')).put('/keep', new Response('keep'));
        });
        updating = true;
        await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
        await page.waitForFunction(async ({ url, nextVersion }) =>
          (await caches.keys()).includes(`playstation-zone:${encodeURIComponent(url)}:${nextVersion}`),
        { url, nextVersion });
        await page.waitForFunction(async ({ url, version }) =>
          !(await caches.keys()).includes(`playstation-zone:${encodeURIComponent(url)}:${version}`),
        { url, version });
        offline = true;
        await context.setOffline(true);
        await page.reload();
        assert.equal(await page.locator('body').getAttribute('data-theme'), theme);
        assert.equal(await page.locator(`#favoritos-lista [data-id="${id}"]`).count(), 1);
        assert.equal(await page.evaluate(() => caches.has('unrelated-app')), true);
        for (const image of await page.locator('img').all()) await image.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.deepEqual(errors, []);
      console.log(`PASS ${route} ${width}px ${storage ? `storage ${storage} denied` : 'persistence, SW update, offline, cache isolation'}`);
    } finally { await context.close(); }
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
