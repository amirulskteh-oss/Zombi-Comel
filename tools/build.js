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
const html = head + logic + read('ui.js') + '</script>\n' + PWA_FOOT + '</body>\n</html>\n';

const fix = s => FLAT ? s.replace(/icons\//g, '') : s;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, FLAT ? '' : 'icons'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), fix(html));
fs.writeFileSync(path.join(OUT, 'sw.js'), fix(fs.readFileSync(path.join(PUB, 'sw.js'), 'utf8')).replace(/__VERSI__/g, versi));
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), fix(fs.readFileSync(path.join(PUB, 'manifest.webmanifest'), 'utf8')));
for (const f of fs.readdirSync(path.join(PUB, 'icons'))) fs.copyFileSync(path.join(PUB, 'icons', f), path.join(OUT, FLAT ? '' : 'icons', f));
if (!FLAT) fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('✓ ' + path.basename(OUT) + '/ dibina — versi ' + versi + ', index.html ' + Math.round(html.length / 1024) + ' KB');
