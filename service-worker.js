"use strict";

const CACHE_NAME = "playstation-zone-v3";
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

self.addEventListener("install", (event) => {
  console.log("Service Worker instalando cache:", CACHE_NAME);
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activado:", CACHE_NAME);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => new Response("Recurso externo no disponible sin conexión.", {
        status: 503,
        statusText: "Offline",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      }))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }

          return new Response("Recurso no disponible sin conexión.", {
            status: 503,
            statusText: "Offline",
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
        });
    })
  );
});
