// Lily's games service worker — makes the menu and every game installable and
// playable with no internet at all.
//
// The site is a menu (./index.html) plus one self-contained page per game in
// its own folder (./unicorn/, ./walk-me-home/). One worker, registered from
// the root, covers all of it.
//
// Two strategies, on purpose:
//   * the pages  — network first, cache as the backup. A push to `main` is
//     live the next time a game is opened, and a plane/car with no signal
//     still gets the last version that was played.
//   * icons, manifest, fonts — cache first. They only change when their name
//     or the CACHE version below changes.
//
// Bump CACHE whenever the icons, manifest or the list of pages change, so old
// copies are dropped.
//
// Panic switch: if this worker ever misbehaves out in the world, replace
// everything below with these lines and push — installed copies will clean
// themselves up and go back to being a plain website.
//
//   self.addEventListener('install', () => self.skipWaiting());
//   self.addEventListener('activate', e => e.waitUntil(
//     caches.keys()
//       .then(k => Promise.all(k.map(c => caches.delete(c))))
//       .then(() => self.registration.unregister())));

const CACHE = 'lilys-games-v5';

const CORE = [
  './',
  './index.html',
  './unicorn/',
  './unicorn/index.html',
  './walk-me-home/',
  './walk-me-home/index.html',
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
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isFont = url =>
  url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

// The cache key for a page: its path with "index.html" spelled out and no
// query string or hash, so every way of asking for a page shares one entry.
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

  // A page (the menu or a game): freshest wins, the cache is the offline
  // safety net. Pages are cached under their own path, minus any query string,
  // so "./unicorn/" and "./unicorn/index.html" both find the same copy.
  if (req.mode === 'navigate') {
    const page = pageKey(url);
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(page, copy));
          return res;
        })
        .catch(() => caches.match(page)
          .then(hit => hit || caches.match(page.replace(/index\.html$/, '')))
          .then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // Everything else: cache first, and quietly fill the cache on a miss.
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        // `opaque` is what a cross-origin font comes back as — still cacheable.
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
