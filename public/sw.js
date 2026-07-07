// Lingomaster service worker.
// Keeps the app shell available offline by caching same-origin GET requests
// with a network-first strategy for navigations (so users get updates quickly)
// and a cache-first strategy for hashed build assets.
// External assets (audio, PDF from GitHub Releases) use stale-while-revalidate.

const CACHE_VERSION = 'lingo-v3';
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const EXTERNAL_CACHE = `${CACHE_VERSION}-external`;

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

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Stale-while-revalidate for external assets (GitHub Releases audio/PDF)
  if (!isSameOrigin && url.hostname.includes('github.com')) {
    event.respondWith(
      caches.open(EXTERNAL_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                cache.put(request, response.clone()).catch(() => {});
              }
              return response;
            })
            .catch(() => cached);

          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Skip non-same-origin requests that aren't GitHub
  if (!isSameOrigin) return;

  // Never cache API proxy requests (PDF/audio streaming)
  if (url.pathname.startsWith('/api/')) return;

  // Always fetch PDF files from network (don't serve cached HTML)
  if (url.pathname.endsWith('.pdf')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
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
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        }).catch(() => cached)
    )
  );
});
