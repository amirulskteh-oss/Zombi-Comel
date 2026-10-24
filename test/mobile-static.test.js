const fs = require('fs');
const path = require('path');
const assert = require('assert');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const head = read('src/head.html');
const ui = read('src/ui.js');
const sw = read('public/sw.js');
const manifest = JSON.parse(read('public/manifest.webmanifest'));
let n = 0;
function test(name, fn) { fn(); n++; console.log('✓ ' + name); }

test('mobile viewport respects device width and safe areas', () => {
  assert.match(head, /name="viewport"[^>]*width=device-width/);
  assert.match(head, /viewport-fit=cover/);
  assert.match(head, /env\(safe-area-inset-top/);
  assert.match(head, /env\(safe-area-inset-bottom/);
});
test('layout has a narrow-screen responsive breakpoint', () => {
  assert.match(head, /@media\s*\(max-width:\s*760px\)/);
  assert.match(head, /grid-template-columns:\s*1fr/);
});
test('canvas handles pointer input and cancellation', () => {
  assert.match(ui, /addEventListener\(['"]pointerdown['"]/);
  assert.match(ui, /addEventListener\(['"]pointerup['"]/);
  assert.match(ui, /pointercancel/);
  assert.match(ui, /addEventListener\(['"]resize['"]/);
});
test('save storage gracefully falls back when localStorage fails', () => {
  assert.match(ui, /localStorage\.getItem/);
  assert.match(ui, /localStorage\.setItem/);
  assert.match(ui, /catch\s*\(e\)\s*\{\s*\}/);
  assert.match(ui, /mem\[k\]/);
});
test('PWA manifest includes installable display and app identity', () => {
  assert.ok(manifest.name && manifest.short_name, 'app name missing');
  assert.ok(['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display), 'unexpected display mode');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'PWA icons missing');
});
test('service worker caches app entry point for offline startup', () => {
  assert.match(sw, /c\.addAll\(ASSETS\)/);
  assert.match(sw, /['"]\.\/index\.html['"]/);
  assert.match(sw, /self\.skipWaiting\(\)/);
  assert.match(sw, /self\.clients\.claim\(\)/);
});
console.log(n + ' ujian statik telefon/PWA lulus');
