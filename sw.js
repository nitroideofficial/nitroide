// sw.js - Required for PWA Installability
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // A fetch handler is strictly required by Chromium to trigger the install prompt.
  // We are leaving it empty so it doesn't interfere with your Monaco/CDN engine.
  return;
});