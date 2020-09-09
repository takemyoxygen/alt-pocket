const CACHE_NAME = 'alt-cache-v1';

const index = self.location.origin + '/';

function log(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

function fetchCached(request) {
  log('SW: fetching data -', request);

  return fetch(request).then(
    function(response) {
      // Check if we received a valid response
      if(!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      // IMPORTANT: Clone the response. A response is a stream
      // and because we want the browser to consume the response
      // as well as the cache consuming the response, we need
      // to clone it so we have two streams.
      var responseToCache = response.clone();

      caches.open(CACHE_NAME)
        .then(function(cache) {
          log('SW: response cached -', request);
          cache.put(request, responseToCache);
        });

      return response;
    }
  );
}

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))))
  );
});

self.addEventListener('fetch', event => {
  if (
    event.request.url === index ||
    event.request.url.endsWith('.js') ||
    event.request.url.endsWith('.css')
  ) {
      log('SW: cacheable request -', event.request);

      event.respondWith(
        caches.match(event.request)
          .then(response => {
              const freshResponse = fetchCached(event.request);

              if (response) {
                log('SW: found in cache, returning cached value -', event.request);
                return response;
              }

              return freshResponse;
          })
      )
    }
});
