// Simple service worker: cache shell assets and respond with cache-first strategy.
// Note: This is minimal and suitable for small projects / demos.
const CACHE_NAME = 'expressions-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/manifest.json',
  '/public/icons/icon-192.png',
  '/public/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          try { cache.put(event.request, fetchRes.clone()); } catch(e) {}
          return fetchRes;
        })
      });
    }).catch(()=> caches.match('/index.html'))
  );
});
