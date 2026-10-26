import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Execute the production worker with explicit in-memory CacheStorage/event doubles.
// These tests do not claim browser installation or device acceptance.
const source = await readFile(new URL('../service-worker.js', import.meta.url), 'utf8');
const scope = 'https://example.test/Prueba-Final/';
const prefix = `playstation-zone:${encodeURIComponent(scope)}:`;

function harness({ network = async () => new Response('network'), readError = false, writeError = false } = {}) {
  const handlers = new Map();
  const stores = new Map();
  const calls = [];
  let skipped = false;
  let claimed = false;
  const key = request => new URL(typeof request === 'string' ? request : request.url, scope).href;
  const cache = name => {
    if (!stores.has(name)) stores.set(name, new Map());
    const values = stores.get(name);
    return {
      async addAll(urls) {
        if (writeError) throw new Error('quota exceeded');
        for (const url of urls) values.set(key(url), new Response('shell'));
      },
      async match(request) {
        if (readError) throw new Error('cache unavailable');
        return values.get(key(request))?.clone();
      },
      async put(request, response) {
        if (writeError) throw new Error('quota exceeded');
        values.set(key(request), response.clone());
      },
    };
  };
  const caches = {
    async open(name) { return cache(name); },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(request) {
      for (const name of stores.keys()) {
        const response = await cache(name).match(request);
        if (response) return response;
      }
      return undefined;
    },
  };
  const self = {
    registration: { scope },
    location: new URL('service-worker.js', scope),
    addEventListener: (name, callback) => handlers.set(name, callback),
    skipWaiting: async () => { skipped = true; },
    clients: { claim: async () => { claimed = true; } },
  };
  const context = vm.createContext({ self, caches, URL, Response, console: { log() {}, warn() {} },
    fetch: async request => { calls.push(request.url ?? request); return network(request); } });
  vm.runInContext(source, context);
  const current = vm.runInContext('CACHE_NAME', context);
  async function dispatch(name, request) {
    const lifetime = [];
    let response;
    let intercepted = false;
    handlers.get(name)({ request,
      waitUntil(promise) { lifetime.push(Promise.resolve(promise)); },
      respondWith(promise) { intercepted = true; response = Promise.resolve(promise); },
    });
    const resolved = await response;
    await Promise.all(lifetime);
    await new Promise(resolve => setImmediate(resolve));
    return { intercepted, response: resolved };
  }
  const request = (path, extra = {}) => ({
    url: new URL(path, scope).href, method: 'GET', mode: 'cors', headers: new Headers(), ...extra,
  });
  return { stores, current, cache, calls, dispatch, request,
    get skipped() { return skipped; }, get claimed() { return claimed; } };
}

test('activation preserves caches owned by another app and another scope', async () => {
  const h = harness();
  for (const name of ['other-app-v1', 'playstation-zone-v3', `${prefix}old`, `${prefix}v4`, 'playstation-zone:other-scope:v4']) h.cache(name);
  await h.dispatch('activate');
  assert.ok(h.stores.has('other-app-v1'));
  assert.ok(h.stores.has('playstation-zone-v3'), 'unscoped legacy ownership is ambiguous');
  assert.ok(h.stores.has('playstation-zone:other-scope:v4'));
  assert.ok(!h.stores.has(`${prefix}old`));
  assert.ok(h.stores.has(h.current));
  assert.equal(h.claimed, true);
});

test('installation uses a scope-owned cache with absolute shell URLs', async () => {
  const h = harness();
  await h.dispatch('install');
  assert.ok(h.current.startsWith(prefix));
  assert.ok(h.stores.get(h.current).has(new URL('index.html', scope).href));
  assert.equal(h.skipped, true);
});

test('failed installation does not replace the active worker', async () => {
  const h = harness({ writeError: true });
  await assert.rejects(h.dispatch('install'), /quota/);
  assert.equal(h.skipped, false);
});

test('fetch never borrows a response from another cache', async () => {
  const h = harness();
  await h.cache('unrelated').put(h.request('js/app.js'), new Response('foreign'));
  const { response } = await h.dispatch('fetch', h.request('js/app.js'));
  assert.equal(await response.text(), 'network');
  assert.equal(h.calls.length, 1);
});

test('known static shell is served from this worker cache while offline', async () => {
  const h = harness({ network: async () => { throw new Error('offline'); } });
  await h.cache(h.current).put(h.request('js/app.js'), new Response('owned'));
  const { response } = await h.dispatch('fetch', h.request('js/app.js'));
  assert.equal(await response.text(), 'owned');
  assert.equal(h.calls.length, 0);
});

for (const [label, path, extra] of [
  ['external', 'https://another.test/file.js', {}],
  ['another app', '/Other/index.html', {}],
  ['API', 'api/private', {}],
  ['query string', 'js/app.js?secret=synthetic', {}],
  ['POST', 'index.html', { method: 'POST' }],
  ['range', 'js/app.js', { headers: new Headers({ Range: 'bytes=0-5' }) }],
]) test(`${label} requests are not intercepted or persisted`, async () => {
  const h = harness();
  const result = await h.dispatch('fetch', h.request(path, extra));
  assert.equal(result.intercepted, false);
  assert.equal(h.calls.length, 0);
  assert.equal(h.stores.size, 0);
});

for (const status of [404, 503, 206]) test(`HTTP ${status} is not cached as a valid application resource`, async () => {
  const h = harness({ network: async () => new Response('error or partial', { status }) });
  const { response } = await h.dispatch('fetch', h.request('js/app.js'));
  assert.equal(response.status, status);
  assert.equal(h.stores.get(h.current)?.size ?? 0, 0);
});

test('quota exhaustion does not discard a successful network response', async () => {
  const h = harness({ writeError: true });
  const { response } = await h.dispatch('fetch', h.request('js/app.js'));
  assert.equal(await response.text(), 'network');
});

test('unavailable cache still permits a successful network response', async () => {
  const h = harness({ readError: true });
  const { response } = await h.dispatch('fetch', h.request('js/app.js'));
  assert.equal(await response.text(), 'network');
});

test('offline navigation with no shell returns a real 503 response', async () => {
  const h = harness({ network: async () => { throw new Error('offline'); } });
  const { response } = await h.dispatch('fetch', h.request('page', { mode: 'navigate' }));
  assert.ok(response instanceof Response);
  assert.equal(response.status, 503);
});

test('offline navigation falls back only to the owned index', async () => {
  const h = harness({ network: async () => { throw new Error('offline'); } });
  await h.cache('foreign').put(h.request('index.html'), new Response('foreign index'));
  await h.cache(h.current).put(h.request('index.html'), new Response('owned index'));
  const { response } = await h.dispatch('fetch', h.request('page', { mode: 'navigate' }));
  assert.equal(await response.text(), 'owned index');
});

test('no-store responses remain uncached', async () => {
  const h = harness({ network: async () => new Response('private', { headers: { 'Cache-Control': 'no-store' } }) });
  await h.dispatch('fetch', h.request('js/app.js'));
  assert.equal(h.stores.get(h.current)?.size ?? 0, 0);
});
