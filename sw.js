const CACHE_NAME = 'aloy-site-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/favicons/manifest.json',
  '/images/Aloy.png',
  '/favicons/android-icon-192x192.png'
];

// Install the service worker and cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate worker immediately
});

// Activate the service worker and remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Take control immediately
});

// Fetch assets
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          caches.match('/index.html') // fallback if offline
        )
      );
    })
  );
});
