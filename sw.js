// Quando pubblichi modifiche aumenta la versione qui E in index.html (APP_VERSION),
// così le app aperte mostrano "Nuova versione disponibile".
const CACHE = 'matrimonio-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png',
  './fonts/figtree-latin-400-normal.woff2', './fonts/figtree-latin-500-normal.woff2', './fonts/figtree-latin-600-normal.woff2',
  './fonts/figtree-latin-700-normal.woff2', './fonts/italiana-latin-400-normal.woff2'];

self.addEventListener('install', e => {
  // Niente skipWaiting automatico: la nuova versione parte quando l'utente tocca "Aggiorna".
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // Solo i file dell'app: Google (accesso e Drive) passa sempre dalla rete.
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // Controllo aggiornamenti: sempre dalla rete.
  if (req.cache === 'no-store' || url.searchParams.has('check')) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
