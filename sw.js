// sw.js — NitroIDE PWA service worker (cache-first, same-origin GETs only)
const CACHE = 'nitroide-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/tools/codebox.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo/logo_white.png',
  '/logo/logo_black.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only intercept same-origin GET requests (leaves CDN/Monaco traffic alone)
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(request).then((cached) =>
      cached || fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => caches.match(request))
    )
  );
});
