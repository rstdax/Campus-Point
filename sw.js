const CACHE_NAME = "campus-point-v1";
const urlsToCache = ["/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Simple pass-through fetch to satisfy PWA requirements
  event.respondWith(fetch(event.request));
});