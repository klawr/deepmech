const APP_PREFIX = 'mecEdit';
const VERSION = '24.02.2020-20:51';
const CACHE_NAME = 'deepmech_' + VERSION;
const urlsToCache = [
    '/',
    '/index.html',
    // assets
    'assets/site.manifest',
    'assets/favicon-16x16.png', 'assets/favicon-32x32.png',
    'assets/apple-touch-icon.png', 'assets/safari-pinned-tab.svg',
    'assets/favicon.ico', 'assets/browserconfig.xml',
    // dist
    '/dist/deepmech_bundle.js',
    '/dist/model.js', '/dist/models.js',
    // third_party
    '/third_party/tf.min.js', '/third_party/mec2.html.js',
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting())
                    .catch(e => { console.error('sw install error:', e) })
            })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(caches.match(e.request)
        .then(function (response) {
            return response || fetch(e.request)
        }).catch(function (error) {
            console.error('sw fetch error:', error, '\nrequest: ', e.request.url)
        }))
});

self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys()
        .then(function (keyList) {
            const cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf('deepmech')
            });
            return cacheWhitelist.push(CACHE_NAME), Promise.all(keyList.map(function (key, i) {
                if (-1 === cacheWhitelist.indexOf(key)) {
                    console.log('Deleting cache: ' + keyList[i])
                    return caches.delete(keyList[i])
                }
            }))
        }).catch(function (error) {
            console.error('sw activation error:', error)
        })
    );
});
