#!/usr/bin/env node
// Bina docs/index.html daripada src/ (head.html + logic.js + ui.js) dan salin fail PWA.
// Folder docs/ dihidangkan oleh GitHub Pages.
const fs = require('fs'), path = require('path');
const FLAT = process.argv.includes('--flat'); // --flat: semua fail dalam satu folder (mudah dimuat naik dari telefon)
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src'), PUB = path.join(ROOT, 'public'), OUT = path.join(ROOT, FLAT ? 'telefon' : 'docs');
const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const logic = read('logic.js'), versi = (logic.match(/const VERSION = '([^']+)'/) || [])[1] || 'dev';

const PWA_HEAD = `<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#2E9E6A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Zombi Comel">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" href="icons/favicon-64.png">
`;
const PWA_FOOT = `<script>
// Pasang service worker (hanya di laman sendiri, bukan pratonton Claude)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing; if (!nw) return;
      nw.addEventListener('statechange', () => {
        if (nw.state === 'activated' && navigator.serviceWorker.controller) {
          const b = document.createElement('button');
          b.textContent = 'Versi baharu sedia. Tekan untuk muat semula';
          b.style.cssText = 'position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:99;padding:10px 16px;border:0;border-radius:999px;background:#2E9E6A;color:#fff;font:800 15px system-ui;box-shadow:0 4px 12px rgba(0,0,0,.25)';
          b.onclick = () => location.reload(); document.body.appendChild(b);
        }
      });
    });
  }).catch(() => {});
}
</script>
`;
let head = read('head.html');
if (!head.includes('<meta name="viewport"')) throw new Error('head.html tiada meta viewport');
head = head.replace('</title>', '</title>\n' + PWA_HEAD);
// UI dipecah kepada modul dalam src/ui/ (01-…, 02-…); digabung mengikut susunan nama fail
const UI_DIR = path.join(SRC, 'ui'), ui = fs.readdirSync(UI_DIR).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(UI_DIR, f), 'utf8')).join('');
// --- dua binaan ---
// PLAY (docs/index.html): trainer & Mod Pembangun dibuang sepenuhnya — inilah yang dimuat oleh aplikasi Google Play (TWA)
// DEV  (docs/dev/index.html): dengan trainer, save berasingan, tanpa PWA — untuk Cikgu menguji
const headDev = head.replace('</title>\n' + PWA_HEAD, '</title>\n');
const toPlay = s => { const out = s.replace(/<!--DEV-START-->[\s\S]*?<!--DEV-END-->/g, '').replace('const PLAY_BUILD = false;', 'const PLAY_BUILD = true;'); if (!out.includes('const PLAY_BUILD = true;')) throw new Error('bendera PLAY_BUILD tidak ditemui'); if (/id="(trainerBox|devToggle|trGold1)"/.test(out)) throw new Error('trainer masih ada dalam binaan Play'); return out; };
const devLogic = logic.replace("const SAVE_KEY = 'zombi_comel_save_v1';", "const SAVE_KEY = 'zombi_comel_dev_save_v1';");
if (devLogic === logic) throw new Error('SAVE_KEY tidak ditemui');
const devHtml = headDev.replace('<title>Zombi Comel', '<title>[DEV] Zombi Comel') + devLogic + ui + '</script>\n</body>\n</html>\n';
if (process.argv.includes('--artifact')) { fs.writeFileSync(path.join(ROOT, 'zombi-comel.html'), headDev + logic + ui + '</script>\n</body>\n</html>\n'); }
const html = toPlay(head + logic + ui + '</script>\n' + PWA_FOOT + '</body>\n</html>\n');

const fix = s => FLAT ? s.replace(/icons\//g, '').replace(/heroes\//g, '') : s;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, FLAT ? '' : 'icons'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), fix(html));
if (!FLAT) { fs.mkdirSync(path.join(OUT, 'dev'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'dev', 'index.html'), devHtml); }
fs.writeFileSync(path.join(OUT, 'privasi.html'), fs.readFileSync(path.join(PUB, 'privasi.html'), 'utf8').replace(/\{\{VERSI\}\}/g, versi));
fs.copyFileSync(path.join(PUB, 'hero-packs.html'), path.join(OUT, 'hero-packs.html'));
fs.writeFileSync(path.join(OUT, 'sw.js'), fix(fs.readFileSync(path.join(PUB, 'sw.js'), 'utf8')).replace(/__VERSI__/g, versi));
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), fix(fs.readFileSync(path.join(PUB, 'manifest.webmanifest'), 'utf8')));
for (const f of fs.readdirSync(path.join(PUB, 'icons'))) fs.copyFileSync(path.join(PUB, 'icons', f), path.join(OUT, FLAT ? '' : 'icons', f));
const HERO_OUT = path.join(OUT, FLAT ? '' : 'heroes'); fs.mkdirSync(HERO_OUT, { recursive: true });
for (const f of fs.readdirSync(path.join(PUB, 'heroes'))) fs.copyFileSync(path.join(PUB, 'heroes', f), path.join(HERO_OUT, f));
if (!FLAT) { const DEV_HERO_OUT = path.join(OUT, 'dev', 'heroes'); fs.mkdirSync(DEV_HERO_OUT, { recursive: true }); for (const f of fs.readdirSync(path.join(PUB, 'heroes'))) fs.copyFileSync(path.join(PUB, 'heroes', f), path.join(DEV_HERO_OUT, f)); }
const PACK_OUT = path.join(OUT, 'hero-packs'); fs.mkdirSync(PACK_OUT, { recursive: true });
for (const f of fs.readdirSync(path.join(PUB, 'hero-packs'))) fs.copyFileSync(path.join(PUB, 'hero-packs', f), path.join(PACK_OUT, f));
if (!FLAT) { fs.copyFileSync(path.join(PUB, 'hero-packs.html'), path.join(OUT, 'dev', 'hero-packs.html')); const DEV_PACK_OUT = path.join(OUT, 'dev', 'hero-packs'); fs.mkdirSync(DEV_PACK_OUT, { recursive: true }); for (const f of fs.readdirSync(path.join(PUB, 'hero-packs'))) fs.copyFileSync(path.join(PUB, 'hero-packs', f), path.join(DEV_PACK_OUT, f)); }
if (!FLAT) fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('✓ ' + path.basename(OUT) + '/ dibina — versi ' + versi + ', index.html ' + Math.round(html.length / 1024) + ' KB');
