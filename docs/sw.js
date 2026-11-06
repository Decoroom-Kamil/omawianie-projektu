/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "qr-code.png",
    "revision": "14a568a48171c5c1d13457c1c8c72eba"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "036f16ceea135c27da64b1f9b1cd6369"
  }, {
    "url": "pwa-96x96.png",
    "revision": "c6aa851020e7c541506dcffae88e1530"
  }, {
    "url": "pwa-512x512.png",
    "revision": "81cbd50061b5437a61f044157e8d7804"
  }, {
    "url": "pwa-384x384.png",
    "revision": "05128570b16efaca16cd1eec377f3deb"
  }, {
    "url": "pwa-256x256.png",
    "revision": "e4cc5c6d7ae1353b87a91e84377dfea0"
  }, {
    "url": "pwa-192x192.png",
    "revision": "c292fd4731eae431c035a1a0f579f805"
  }, {
    "url": "pwa-128x128.png",
    "revision": "fbfd4f0c3348b989eef1cd3a1ff50558"
  }, {
    "url": "offline.html",
    "revision": "7dbc4392022629a4a781d73fa66bd10a"
  }, {
    "url": "manifest.json",
    "revision": "a0157607064a72bcbccbd304a1f68950"
  }, {
    "url": "index.html",
    "revision": "dedf01dd6ac2144fe7b2a0fc291fc06e"
  }, {
    "url": "icon.svg",
    "revision": "4dbe3a424c72e7b9b7b4f2a09013291e"
  }, {
    "url": "favicon.ico",
    "revision": "834f49045c2b0e5326fd044ce90279ec"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "f6d6807505a05be22bc596043e3a67bb"
  }, {
    "url": "404.html",
    "revision": "b2c187230546d86458517c5c669c6d76"
  }, {
    "url": "screenshots/mobile-750x1334.png",
    "revision": "8af9548ae919a26da169df5f04410b9f"
  }, {
    "url": "screenshots/desktop-1280x720.png",
    "revision": "5c676864dea83d8a0224600f5f80d114"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/purify.es-Dqk5qvad.js",
    "revision": null
  }, {
    "url": "assets/index.es-BfKJt2Gx.js",
    "revision": null
  }, {
    "url": "assets/index-D_XokteR.js",
    "revision": null
  }, {
    "url": "assets/index-ChbNMZv-.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "f6d6807505a05be22bc596043e3a67bb"
  }, {
    "url": "favicon.ico",
    "revision": "834f49045c2b0e5326fd044ce90279ec"
  }, {
    "url": "icon.svg",
    "revision": "4dbe3a424c72e7b9b7b4f2a09013291e"
  }, {
    "url": "manifest.json",
    "revision": "618645c156bd4f25d7e3711b891278c8"
  }, {
    "url": "offline.html",
    "revision": "7dbc4392022629a4a781d73fa66bd10a"
  }, {
    "url": "pwa-128x128.png",
    "revision": "fbfd4f0c3348b989eef1cd3a1ff50558"
  }, {
    "url": "pwa-192x192.png",
    "revision": "c292fd4731eae431c035a1a0f579f805"
  }, {
    "url": "pwa-256x256.png",
    "revision": "e4cc5c6d7ae1353b87a91e84377dfea0"
  }, {
    "url": "pwa-384x384.png",
    "revision": "05128570b16efaca16cd1eec377f3deb"
  }, {
    "url": "pwa-512x512.png",
    "revision": "81cbd50061b5437a61f044157e8d7804"
  }, {
    "url": "pwa-96x96.png",
    "revision": "c6aa851020e7c541506dcffae88e1530"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "036f16ceea135c27da64b1f9b1cd6369"
  }, {
    "url": "screenshots/desktop-1280x720.png",
    "revision": "5c676864dea83d8a0224600f5f80d114"
  }, {
    "url": "screenshots/mobile-750x1334.png",
    "revision": "8af9548ae919a26da169df5f04410b9f"
  }, {
    "url": "manifest.json",
    "revision": "a0157607064a72bcbccbd304a1f68950"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
