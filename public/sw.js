// Service worker Zombi Comel: simpan fail game supaya boleh dimain tanpa internet.
// __VERSI__ diganti oleh tools/build.js setiap kali dibina, jadi versi baharu = cache baharu.
const CACHE = 'zombi-comel-__VERSI__';
const FONTS = 'zombi-comel-fonts';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-64.png', './heroes/hero-01-ninja-amir.png', './heroes/hero-02-sarjan-rahim.png', './heroes/hero-03-dr-lina.png', './heroes/hero-04-jurutera-wei.png', './heroes/hero-05-ratu-salju.png', './heroes/hero-06-hang-kilat.png', './heroes/hero-07-komander-zara.png', './heroes/hero-08-pak-usu.png', './heroes/hero-09-budak-lastik.png', './heroes/hero-10-kak-long.png', './heroes/hero-11-abang-jo.png', './heroes/hero-01-ninja-amir-attack.png', './heroes/hero-01-ninja-amir-walk.png', './heroes/hero-01-ninja-amir-ultimate.png', './heroes/hero-02-sarjan-rahim-attack.png', './heroes/hero-02-sarjan-rahim-walk.png', './heroes/hero-02-sarjan-rahim-ultimate.png', './heroes/hero-03-dr-lina-attack.png', './heroes/hero-03-dr-lina-walk.png', './heroes/hero-03-dr-lina-ultimate.png', './heroes/hero-04-jurutera-wei-attack.png', './heroes/hero-04-jurutera-wei-walk.png', './heroes/hero-04-jurutera-wei-ultimate.png', './heroes/hero-05-ratu-salju-attack.png', './heroes/hero-05-ratu-salju-walk.png', './heroes/hero-05-ratu-salju-ultimate.png', './heroes/hero-06-hang-kilat-attack.png', './heroes/hero-06-hang-kilat-walk.png', './heroes/hero-06-hang-kilat-ultimate.png', './heroes/hero-07-komander-zara-attack.png', './heroes/hero-07-komander-zara-walk.png', './heroes/hero-07-komander-zara-ultimate.png', './heroes/hero-08-pak-usu-attack.png', './heroes/hero-08-pak-usu-walk.png', './heroes/hero-08-pak-usu-ultimate.png', './heroes/hero-09-budak-lastik-attack.png', './heroes/hero-09-budak-lastik-walk.png', './heroes/hero-09-budak-lastik-ultimate.png', './heroes/hero-10-kak-long-attack.png', './heroes/hero-10-kak-long-walk.png', './heroes/hero-10-kak-long-ultimate.png', './heroes/hero-11-abang-jo-attack.png', './heroes/hero-11-abang-jo-walk.png', './heroes/hero-11-abang-jo-ultimate.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Fon Google: guna salinan simpanan, kemas kini di latar belakang
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  // Fail game: cache dahulu (pantas & offline), rangkaian sebagai sandaran
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
    if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : undefined)));
});
