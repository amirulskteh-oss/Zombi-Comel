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
