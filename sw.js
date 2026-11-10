// sw.js — NitroIDE PWA service worker (network-first for pages + script.js, cache-first for vendor assets)
const CACHE = 'nitroide-v321';
// Vendor runtime cache: stable across app deploys. Monaco (~10MB) and other
// /vendor/* files are fetched once and kept here. The app-shell CACHE above is
// wiped on every deploy — Pulse bumps it ~4x/day — which used to force a full
// Monaco re-download on the next codebox visit, and every re-download is
// another chance for a transient failure to kill the editor (Sentry
// JAVASCRIPT-5/-7/-8, Nov 2026). Bump VENDOR_CACHE only when a file under
// /vendor/ actually changes.
const VENDOR_CACHE = 'nitroide-vendor-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/tools/codebox.html',
  '/styles.css',
  '/script.js',
  '/search-index.json',
  '/manifest.json',
  '/favicon.ico',
  '/logo/logo_white.png',
  '/logo/logo_black.png',
  // Self-hosted LZString (share-link compression, MIT)
  '/vendor/lz-string/lz-string.min.js',
  // Self-hosted JSZip (ZIP export/import, MIT) — was jsdelivr CDN, self-hosted 2026-11-01 so export works without a third-party host
  '/vendor/jszip/jszip.min.js',
  // NOTE (2026-10-13): Monaco (~9.9MB) is NOT precached anymore — a homepage
  // visitor who never opens the IDE used to download all of it during SW install.
  // Monaco is runtime-cached on first IDE use instead (see the cache-first
  // branch in the fetch handler below: first use fetches from network, then
  // stores the response in this same cache).
  // Self-hosted fonts (vendor/fonts)
  '/vendor/fonts/Inter-400.woff2',
  '/vendor/fonts/Inter-500.woff2',
  '/vendor/fonts/Inter-600.woff2',
  '/vendor/fonts/Inter-700.woff2',
  '/vendor/fonts/Inter-800.woff2',
  '/vendor/fonts/JetBrainsMono-400.woff2',
  '/vendor/fonts/JetBrainsMono-500.woff2',
  '/vendor/fonts/JetBrainsMono-700.woff2',
  // Self-hosted Phosphor icons (vendor/icons) — only weights actually used (bold/fill/duotone)
  '/vendor/icons/phosphor/bold/style.css',
  '/vendor/icons/phosphor/fill/style.css',
  '/vendor/icons/phosphor/duotone/style.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch((err) => {
        // Audit 2026-10-31 (#15): a failed precache must FAIL the install, not
        // skipWaiting into a half-populated cache. The old worker keeps serving
        // and the browser retries install on the next navigation.
        console.error('NitroIDE SW: precache failed, install aborted:', err);
        throw err;
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== VENDOR_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});


// Retry a vendor fetch once after ~400 ms: a single transient network blip
// (Sentry JAVASCRIPT-5/-8, Nov 2026) should not kill the editor. Only
// helps SW-controlled loads (returning visitors); a first-visit load is
// not intercepted by the SW at all, so it cannot benefit from this retry.
function fetchWithVendorRetry(request, isVendor) {
  return fetch(request).catch(function (err) {
    if (!isVendor) throw err;
    return new Promise(function (resolve) { setTimeout(resolve, 400); }).then(function () { return fetch(request); });
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only intercept same-origin GET requests (all core assets are self-hosted now)
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // ads.txt must always be served fresh (AdSense crawler + account verification).
  // devto-latest.json too: it is the same-origin fallback for the dev.to API
  // fetch, refreshed by the publishing pipeline on every Pulse update.
  // /api/* (forms backend + admin) must never be cached: submissions and
  // stats have to be live on every request.
  try { var ffp = new URL(request.url).pathname; if (ffp === '/ads.txt' || ffp === '/llms.txt' || ffp === '/llms-full.txt' || ffp === '/pricing.md' || ffp === '/rss.xml' || ffp === '/rss-changelog.xml' || ffp === '/assets/devto-latest.json' || ffp.indexOf('/api/') === 0) return; } catch (e) {}
  // Share links (?code=, ?gist=, ...) all serve the same HTML shell — cache document
  // navigations under the bare path so unique URLs can't bloat the cache.
  var cacheKey = request;
  var isDocument = false;
  try {
    var u = new URL(request.url);
    isDocument = (request.mode === 'navigate' || request.destination === 'document');
    if (u.search && isDocument) cacheKey = u.origin + u.pathname;
  } catch (e) {}
  // Network-first for pages and the main logic bundle: deploys show up on the
  // next refresh instead of hiding behind the cache. Cache is offline fallback.
  // Heavy vendor assets (fonts, icons) stay cache-first for fast loads. Monaco is
  // also cache-first here on first IDE use — it is just no longer precached.
  var networkFirst = isDocument;
  try { var pth = new URL(request.url).pathname; if (pth === '/script.js' || pth === '/styles.css') networkFirst = true; } catch (e) {}
  if (networkFirst) {
    event.respondWith(
      fetch(request).then(function (response) {
        // Audit 2026-10-31 (#15): never cache a failed response — a cached
        // 404/500 would keep serving the failure after the network recovers.
        if (response.ok) {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) { cache.put(cacheKey, copy); });
        }
        return response;
      }).catch(function () { return caches.match(cacheKey); })
    );
    return;
  }
  // Vendor files go to the stable VENDOR_CACHE (see above) so app deploys
  // don't wipe them; everything else runtime-cached goes to CACHE.
  var isVendor = false;
  try { isVendor = new URL(request.url).pathname.indexOf('/vendor/') === 0; } catch (e) {}
  event.respondWith(
    caches.match(cacheKey).then((cached) =>
      cached || fetchWithVendorRetry(request, isVendor).then((response) => {
        // Audit 2026-10-31 (#15): same rule as the network-first branch —
        // only cache successful responses.
        if (response.ok) {
          const copy = response.clone();
          caches.open(isVendor ? VENDOR_CACHE : CACHE).then((cache) => cache.put(cacheKey, copy));
        }
        return response;
      }).catch(() => caches.match(cacheKey))
    )
  );
});
