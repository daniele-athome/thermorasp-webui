// The Service Worker
// inspired by https://developers.google.com/web/fundamentals/primers/service-workers/
// It will cache everything that the browser will request

const CACHE_NAME = 'thermorasp-cache-v1';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/app.js',
    '/assets/adminator/vendor.js',
    '/assets/adminator/bundle.js',
    '/assets/adminator/style.css',
    '/assets/css/style.css',
    '/assets/images/logo.png',
    '/assets/images/logo_hi.png',
    '/assets/images/launcher-1x.png',
    '/assets/images/launcher-2x.png',
    '/assets/images/launcher-4x.png',
    '/assets/images/user_admin.png',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                // not sure how this will improve performance since there is a cache-on-demand code right below
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    // do not cache requests to APIs
    const requestUrl = new URL(event.request.url);
    if (/^\/api\//.test(requestUrl.pathname)) {
        return fetch(event.request);
    }

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
