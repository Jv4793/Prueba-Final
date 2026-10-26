"use strict";

// CacheStorage is shared by every application on this origin, not by SW scope.
const CACHE_PREFIX = `playstation-zone:${encodeURIComponent(self.registration.scope)}:`;
const CACHE_NAME = `${CACHE_PREFIX}v4`;
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/images/console-blue.svg",
  "./assets/images/console-dark.svg",
  "./assets/images/console-white.svg",
  "./assets/images/handheld.svg",
  "./assets/images/game-action.svg",
  "./assets/images/game-adventure.svg",
  "./assets/images/game-racing.svg",
  "./assets/images/game-city.svg",
  "./assets/images/game-forest.svg",
  "./assets/images/game-portal.svg",
  "./assets/images/game-sun.svg",
  "./assets/images/game-space.svg"
];

const SHELL_URLS = new Set(APP_SHELL.map((path) => new URL(path, self.registration.scope).href));
const INDEX_URL = new URL("index.html", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([...SHELL_URLS]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names
        // Do not delete unscoped legacy caches: another installation may own them.
        .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        .map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

async function readCached(request) {
  try {
    return await (await caches.open(CACHE_NAME)).match(request);
  } catch {
    // Storage eviction or denial must not prevent an online load.
    return undefined;
  }
}

async function respond(request, isShell) {
  const cached = isShell ? await readCached(request) : undefined;
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (isShell && response.status === 200 && !response.redirected &&
        !/\bno-store\b/i.test(response.headers.get("Cache-Control") ?? "")) {
      try {
        // Await and contain quota/storage failures inside the fetch lifetime.
        await (await caches.open(CACHE_NAME)).put(request, response.clone());
      } catch {
        // The successful network response is still usable without persistence.
      }
    }
    return response;
  } catch {
    if (request.mode === "navigate") {
      const index = await readCached(INDEX_URL);
      if (index) return index;
    }
    return new Response("Recurso no disponible sin conexión.", {
      status: 503,
      statusText: "Offline",
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("Range")) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.search ||
      !url.href.startsWith(self.registration.scope)) return;
  const isShell = SHELL_URLS.has(url.href);
  // Do not persist APIs, private responses, other apps, or arbitrary assets.
  if (!isShell && request.mode !== "navigate") return;
  event.respondWith(respond(request, isShell));
});
