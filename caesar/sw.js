var GHPATH = '/caesar';
var APP_PREFIX = 'caesar_';
var VERSION = 'version_001';
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/css/bootstrap.css`,
  `${GHPATH}/css/bootstrap.min.css`,
  `${GHPATH}/css/bootstrap-theme.css`,
  `${GHPATH}/css/bootstrap-theme.min.css`,
  `${GHPATH}/imgages/favicon.png`,
  `${GHPATH}/imgages/favicon.svg`,
  `${GHPATH}/imgages/favicon.ico`,
  `${GHPATH}/js/app.js`,
  `${GHPATH}/js/bootstrap.js`,
  `${GHPATH}/js/bootstrap.min.js`,
  `${GHPATH}/js/jquery-1.7.1.min.js`,
  `${GHPATH}/js/jquery-1.12.4.min.js`,
  `${GHPATH}/js/jquery-3.2.1.min.js`,
  `${GHPATH}/js/knockout-3.4.2.js`,
  `${GHPATH}/js/sammy.min.js`,
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { 
        console.log('Responding with cache : ' + e.request.url);
        return request
      } else {       
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})