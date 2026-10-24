#!/usr/bin/env node
// Semak sintaks JavaScript dalam docs/index.html selepas modul UI digabung
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
for (const rel of [['docs', 'index.html'], ['docs', 'dev', 'index.html']]) {
const html = fs.readFileSync(path.join(__dirname, '..', ...rel), 'utf8');
const js = html.slice(html.indexOf('<script>') + 8, html.indexOf('</script>'));
const tmp = path.join(os.tmpdir(), 'zombi-comel-check.js'); fs.writeFileSync(tmp, js);
execFileSync(process.execPath, ['--check', tmp], { stdio: 'inherit' });
const ids = {}; (html.match(/\sid="([^"]+)"/g) || []).forEach(m => { const k = m.slice(5, -1); ids[k] = (ids[k] || 0) + 1; });
const dup = Object.keys(ids).filter(k => ids[k] > 1);
if (dup.length) { console.error('✗ ID berganda dalam HTML: ' + dup.join(', ')); process.exit(1); }
console.log('✓ tiada ID berganda (' + Object.keys(ids).length + ' ID)');
if (/[^.\w]confirm\(|[^.\w]alert\(|window\.(confirm|alert|prompt)\(/.test(js)) { console.error('✗ guna confirm()/alert() browser — disekat dalam paparan artifak; guna askYes()'); process.exit(1); }
console.log('✓ tiada confirm()/alert() browser');
console.log('✓ sintaks fail gabungan OK (' + Math.round(js.length / 1024) + ' KB)');
console.log('  ↳ ' + rel.join('/'));
}

// Semak metadata PWA yang dipaparkan sepadan dengan sumber dan versi permainan.
const root = path.join(__dirname, '..');
const logic = fs.readFileSync(path.join(root, 'src', 'logic.js'), 'utf8');
const version = (logic.match(/const VERSION = '([^']+)'/) || [])[1];
if (!version) { console.error('✗ versi permainan tidak ditemui'); process.exit(1); }
const sourceManifest = JSON.parse(fs.readFileSync(path.join(root, 'public', 'manifest.webmanifest'), 'utf8'));
const builtManifest = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'manifest.webmanifest'), 'utf8'));
if (sourceManifest.description !== builtManifest.description) {
  console.error('✗ penerangan manifest sumber dan docs tidak sepadan'); process.exit(1);
}
if (!builtManifest.description.includes('232 senjata')) {
  console.error('✗ penerangan manifest tidak menyatakan 232 senjata'); process.exit(1);
}
const sw = fs.readFileSync(path.join(root, 'docs', 'sw.js'), 'utf8');
if (!sw.includes("const CACHE = 'zombi-comel-" + version + "'")) {
  console.error('✗ versi cache service worker tidak sepadan dengan permainan (' + version + ')'); process.exit(1);
}
console.log('✓ metadata PWA dan versi cache sepadan (' + version + ')');
