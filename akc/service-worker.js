/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

'use strict';

var precacheConfig = [["index.html","index_html_hash"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');

var cleanResponse = function(originalResponse) {
  // If this is not a redirected response, then we don't have to do anything.
  if(!originalResponse.redirected) {
    return Promise.resolve(originalResponse);
  }

  // Firefox 50 and below doesn't support the Response.body stream, so we may
  // need to read the entire body to memory as a Blob.
  var bodyPromise = 'body' in originalResponse ?
    Promise.resolve(originalResponse.body) :
    originalResponse.blob();

  return bodyPromise.then(function(body) {
    // new Response() is happy when passed either a stream or a Blob.
    return new Response(body, {
      headers: originalResponse.headers,
      status: originalResponse.status,
      statusText: originalResponse.statusText
    });
  });
};

var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);

    var cachedUrl = new URL(absoluteUrl);
    cachedUrl.search += (cachedUrl.search ? '&' : '') + 'precache=' + encodeURIComponent(hash);

    return [absoluteUrl.toString(), cachedUrl.toString()];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

function fetchAndCache(cache, url) {
  var request = new Request(url, {credentials: 'same-origin'});
  return fetch(request).then(function(response) {
    // Bail out of installation unless we get back a 200 OK for
    // every request.
    if(!response.ok) {
      throw new Error('Request for ' + url + ' returned a response with status ' + response.status);
    }

    return cleanResponse(response).then(function(responseToCache) {
      cache.put(url, responseToCache.clone());
      return responseToCache;
    });
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if(!cachedUrls.has(cacheKey)) return fetchAndCache(cache, cacheKey);
          })
        );
      });
    }).then(function() {
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if(!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      return self.clients.claim();
    })
  );
});

function canonicalise(originalUrl) {
  var url = new URL(originalUrl);
  // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
  url.hash = '';
  // add 'index.html' at the end if path refers to a directory.
  if(url.pathname.slice(-1) === '/') url.pathname += 'index.html';
  return url.toString();
}

self.addEventListener('fetch', function(event) {
  if(event.request.method != 'GET') return;

  var url = canonicalise(event.request.url);

  if(urlsToCacheKeys.has(url)) {
    event.respondWith(
      caches.open(cacheName).then(function(cache) {
        return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
          if(response) return response;
        });
      })
    );
  }
  else if(url.match(/\.(?:png|gif|jpg|jpeg|svg|mp3)$/)) {
    event.respondWith(
      caches.open(cacheName).then(function(cache) {
        return cache.match(url).then(function(response) {
          if(response) return response;
          else return fetchAndCache(cache, url);
        });
      })
    );
  }
});
