
// sw.js

const CACHE_NAME = 'shago-meals';
const urlsToCache = [
'/',
'/index.html',
'/manifest.json',
'/favicon.ico',
'/logo192.png',
'/logo512.png',
'/static/js/main.chunk.js',
'/static/js/0.chunk.js',
'/static/js/bundle.js',
'/static/css/main.chunk.css',
'/static/css/0.chunk.css',
];

this.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Cache opened');
            return cache.addAll(urlsToCache);
        })
    );
});


this.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }

            return fetch(event.request)
                .then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return response;
                });
            })
            .catch(error => {
                // if (error.message === "")
                console.log("Error fetching app update:", error)
            })
    );
});


this.addEventListener('load', event => {
    event.waitUntil(
        // check for app updates and install
        null
    )
})