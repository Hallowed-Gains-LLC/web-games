// Moonflower's service worker: makes the game installable and playable with
// no internet at all (a dark nursery at 3am is not the place to find out the
// Wi-Fi dropped).
//
// Registered from this folder, so its scope is /games/moonflower/ and it
// never touches the rest of the site.
//
// Same two strategies as lily/sw.js:
//   * the page: network first, cache as the backup. A push to `main` is live
//     the next time the game is opened with a signal.
//   * icons, manifest, fonts: cache first. Bump CACHE when they change.
//
// Panic switch: if this worker ever misbehaves, replace everything below with
// these lines and push. Installed copies will clean themselves up.
//
//   self.addEventListener('install', () => self.skipWaiting());
//   self.addEventListener('activate', e => e.waitUntil(
//     caches.keys()
//       .then(k => Promise.all(k.map(c => caches.delete(c))))
//       .then(() => self.registration.unregister())));

const CACHE = 'moonflower-v1';

const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('moonflower-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isFont = url =>
  url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

// "./" and "./index.html" share one cache entry; query strings are ignored.
const pageKey = url => {
  let path = url.pathname;
  if (path.endsWith('/')) path += 'index.html';
  return url.origin + path;
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin && !isFont(url)) return;

  if (req.mode === 'navigate') {
    const page = pageKey(url);
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(page, copy)); }
          return res;
        })
        .catch(() => caches.match(page)
          .then(hit => hit || caches.match('./index.html'))
          .then(hit => hit || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
