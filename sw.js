// sw.js — NitroIDE PWA service worker (cache-first, same-origin GETs only)
const CACHE = 'nitroide-v34';

const APP_SHELL = [
  '/',
  '/index.html',
  '/tools/codebox.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo/logo_white.png',
  '/logo/logo_black.png',
  // Self-hosted LZString (share-link compression, MIT)
  '/vendor/lz-string/lz-string.min.js',
  // Self-hosted Monaco editor (vendor/monaco/vs)
  '/vendor/monaco/vs/loader.js',
  '/vendor/monaco/vs/editor/editor.main.js',
  '/vendor/monaco/vs/editor/editor.main.css',
  '/vendor/monaco/vs/editor/editor.main.nls.js',
  '/vendor/monaco/vs/base/worker/workerMain.js',
  '/vendor/monaco/vs/language/typescript/tsWorker.js',
  '/vendor/monaco/vs/language/css/cssWorker.js',
  '/vendor/monaco/vs/language/html/htmlWorker.js',
  '/vendor/monaco/vs/language/json/jsonWorker.js',
  // Self-hosted fonts (vendor/fonts)
  '/vendor/fonts/Inter-400.woff2',
  '/vendor/fonts/Inter-500.woff2',
  '/vendor/fonts/Inter-600.woff2',
  '/vendor/fonts/Inter-700.woff2',
  '/vendor/fonts/Inter-800.woff2',
  '/vendor/fonts/JetBrainsMono-400.woff2',
  '/vendor/fonts/JetBrainsMono-500.woff2',
  '/vendor/fonts/JetBrainsMono-700.woff2',
  // Self-hosted Phosphor icons (vendor/icons)
  '/vendor/icons/phosphor/regular/style.css',
  '/vendor/icons/phosphor/bold/style.css',
  '/vendor/icons/phosphor/fill/style.css',
  '/vendor/icons/phosphor/light/style.css',
  '/vendor/icons/phosphor/duotone/style.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL).catch((err) => console.warn('NitroIDE SW: precache partially failed, continuing anyway:', err)))
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
  // Only intercept same-origin GET requests (all core assets are self-hosted now)
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // ads.txt must always be served fresh (AdSense crawler + account verification).
  // devto-latest.json too: it is the same-origin fallback for the dev.to API
  // fetch, refreshed by the publishing pipeline on every Pulse update.
  try { var ffp = new URL(request.url).pathname; if (ffp === '/ads.txt' || ffp === '/assets/devto-latest.json') return; } catch (e) {}
  // Share links (?code=, ?gist=, ...) all serve the same HTML shell — cache document
  // navigations under the bare path so unique URLs can't bloat the cache.
  var cacheKey = request;
  try {
    var u = new URL(request.url);
    if (u.search && (request.mode === 'navigate' || request.destination === 'document')) cacheKey = u.origin + u.pathname;
  } catch (e) {}
  event.respondWith(
    caches.match(cacheKey).then((cached) =>
      cached || fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(cacheKey, copy));
        return response;
      }).catch(() => caches.match(cacheKey))
    )
  );
});
