const CACHE_VERSION = "v3";  // Promenite verziju kad god napravite veće izmene
const CACHE_NAME = `turnir-cache-${CACHE_VERSION}`;  // Koristi novu verziju cache-a
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install event - kešira potrebne resurse
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate event - briše stare verzije cache-a
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          // Brišemo sve starije kešove koji nisu trenutna verzija
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch event - dohvaća resurse sa keša ili mreže ako nisu keširani
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Ako resurs postoji u kešu, vraćamo ga, u suprotnom, preuzimamo sa mreže
      return response || fetch(event.request);
    })
  );
});

