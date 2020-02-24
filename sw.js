const APP_PREFIX = 'mecEdit';
const VERSION = '24.02.2020-10:42';
const CACHE_NAME = 'deepmech_' + VERSION;
const urlsToCache = [
    '/', '/index.html', '/site.manifest',
    '/favicon-16x16.png', '/favicon-32x32.png',
    '/apple-touch-icon.png', '/safari-pinned-tab.svg',
    '/favicon.ico', '/browserconfig.xml',
    '/src/canvasInteractor.js', '/src/g2.js', '/src/g2.selector.js',
    '/src/mec-chart.htmlelement.js', '/src/mec.deepmech.js', '/src/mec.htmlelement.js',
    '/src/mec.slider.js', '/src/mec2.min.js', '/src/models.js', '/src/tf.min.js'
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
