const CACHE_NAME = 'tarot-cosmique-cache-v4';
const urlsToCache = [
    'index.html',
    'gallery.html',
    'style.css',
    'script.js',
    'gallery_script.js',
    'cards_data.json',
    'img/00.png',
    'img/01.png',
    'img/02.png',
    'img/03.png',
    'img/04.png',
    'img/05.png',
    'img/06.png',
    'img/07.png',
    'img/08.png',
    'img/09.png',
    'img/10.png',
    'img/11.png',
    'img/12.png',
    'img/13.png',
    'img/14.png',
    'img/15.png',
    'img/16.png',
    'img/17.png',
    'img/18.png',
    'img/19.png',
    'img/20.png',
    'img/21.png',
    'img/icons/icon-192x192.png',
    'img/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});