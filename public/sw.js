// Lingomaster service worker.
// Keeps the app shell available offline by caching same-origin GET requests
// with a network-first strategy for navigations (so users get updates quickly)
// and a cache-first strategy for hashed build assets.
//
// The app is deployed under a base path (e.g. /tuan/ on GitLab Pages), so all
// paths are resolved relative to registration scope rather than hard-coded.

const CACHE_VERSION = 'lingo-v1';
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(['./'])).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET requests; let everything else pass through.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // Network-first for navigations so new deploys appear on next reload.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./')))
    );
    return;
  }

  // Cache-first for static assets (hashed, immutable).
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          // Only cache successful, basic responses to avoid storing errors.
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        }).catch(() => cached)
    )
  );
});
