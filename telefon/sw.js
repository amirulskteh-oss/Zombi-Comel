// Service worker Zombi Comel: simpan fail game supaya boleh dimain tanpa internet.
// 9.18 diganti oleh tools/build.js setiap kali dibina, jadi versi baharu = cache baharu.
const CACHE = 'zombi-comel-9.18';
const FONTS = 'zombi-comel-fonts';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './maskable-512.png', './apple-touch-icon.png', './favicon-64.png', './hero-01-ninja-amir.png', './hero-02-sarjan-rahim.png', './hero-03-dr-lina.png', './hero-04-jurutera-wei.png', './hero-05-ratu-salju.png', './hero-06-hang-kilat.png', './hero-07-komander-zara.png', './hero-08-pak-usu.png', './hero-09-budak-lastik.png', './hero-10-kak-long.png', './hero-11-abang-jo.png', './hero-01-ninja-amir-attack.png', './hero-01-ninja-amir-walk.png', './hero-01-ninja-amir-ultimate.png', './hero-02-sarjan-rahim-attack.png', './hero-02-sarjan-rahim-walk.png', './hero-02-sarjan-rahim-ultimate.png', './hero-03-dr-lina-attack.png', './hero-03-dr-lina-walk.png', './hero-03-dr-lina-ultimate.png', './hero-04-jurutera-wei-attack.png', './hero-04-jurutera-wei-walk.png', './hero-04-jurutera-wei-ultimate.png', './hero-05-ratu-salju-attack.png', './hero-05-ratu-salju-walk.png', './hero-05-ratu-salju-ultimate.png', './hero-06-hang-kilat-attack.png', './hero-06-hang-kilat-walk.png', './hero-06-hang-kilat-ultimate.png', './hero-07-komander-zara-attack.png', './hero-07-komander-zara-walk.png', './hero-07-komander-zara-ultimate.png', './hero-08-pak-usu-attack.png', './hero-08-pak-usu-walk.png', './hero-08-pak-usu-ultimate.png', './hero-09-budak-lastik-attack.png', './hero-09-budak-lastik-walk.png', './hero-09-budak-lastik-ultimate.png', './hero-10-kak-long-attack.png', './hero-10-kak-long-walk.png', './hero-10-kak-long-ultimate.png', './hero-11-abang-jo-attack.png', './hero-11-abang-jo-walk.png', './hero-11-abang-jo-ultimate.png'];

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
