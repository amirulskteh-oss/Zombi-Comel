// Semakan automatik katalog: gagal terus jika ada kecacatan
const D = require('./data.js'), A = require('assert');
require('vm').runInThisContext(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'src', 'logic.js'), 'utf8'));
const W = D.build(); const errs = []; const ok = (c, m) => { if (!c) errs.push(m); };
ok(W.length === 200, 'jumlah 200, dapat ' + W.length);
const ids = new Set(W.map(w => w.id)), names = new Set(W.map(w => w.nama.toLowerCase()));
ok(ids.size === 200, 'id unik'); ok(names.size === 200, 'nama unik');
const ASAL = WEAPON_ORDER.filter(w => !WEAPONS[w].gen);
ASAL.forEach(w => { ok(!ids.has(w) && !ids.has('w_' + w), 'id bertembung dengan senjata lama ' + w); ok(!names.has(WEAPONS[w].nama.toLowerCase()), 'nama bertembung: ' + WEAPONS[w].nama); });
for (const j of Object.keys(D.JENIS)) { const exp = D.JENIS[j].baru ? 18 : 10; ok(D.NAMA[j].length === exp, j + ' perlu ' + exp + ' nama, ada ' + D.NAMA[j].length); }
const rc = [0, 0, 0, 0, 0]; W.forEach(w => rc[w.rar]++);
// setiap jenis ada Biasa & Jarang (boleh dibeli) ; setiap kelas ada senjata boleh beli dalam setiap jenisnya
for (const j of Object.keys(D.JENIS)) { const l = W.filter(w => w.jenis === j); ok(l.some(w => w.rar === 0) && l.some(w => w.rar === 1), j + ' tiada Biasa/Jarang'); ok(l.some(w => w.rar === 4), j + ' tiada Mitos'); }
for (const k of Object.keys(D.KELAS)) { const js = Object.keys(D.JENIS).filter(j => D.JENIS[j].kelas.includes(k)); ok(js.length === 3 || (k === 'penembak' || k === 'jitu' || k === 'robo') && js.length >= 3, k + ' jenis: ' + js.join()); }
// kuasa: dalam jenis sama, Mitos ≥ Biasa untuk arketaip sama; tiada senjata melebihi 2× kuasa tertinggi lama
const oldMax = Math.max(...ASAL.map(w => { const d = WEAPONS[w]; return d.dmg * d.rate * (d.n || 1) * (1 + Math.min(3, (d.pierce || 1) - 1) * 0.3) * (d.splash ? 1.8 : 1) * (d.chain ? 1 + d.chain * 0.4 : 1); }));
W.forEach(w => { ok(w.kuasa <= oldMax * 2, w.nama + ' terlalu kuat ' + w.kuasa); ok(w.dmg > 0 && w.rate > 0 && w.range >= 240, w.nama + ' stat tidak sah'); });
for (const j of Object.keys(D.JENIS)) for (const a of D.ARK[j]) { const l = W.filter(w => w.jenis === j && w.arketaip === a[0]).sort((x, y) => x.rar - y.rar); for (let i = 1; i < l.length; i++) ok(l[i].kuasa >= l[i - 1].kuasa, 'kuasa menurun: ' + l[i].nama); }
// perk sah
W.forEach(w => { ok(w.perk.length === (w.rar >= 4 ? 2 : w.rar >= 2 ? 1 : 0), w.nama + ' bil. perk'); w.perk.forEach(p => ok(D.PERK[p.id] || D.MITOS[p.id.replace('mitos_', '')], 'perk tak wujud ' + p.id)); });
// carta elemen: setiap elemen zombie (selain Hijau) ada sekurang-kurangnya 1 penentang; tiada elemen kuat & lemah pada sasaran sama
const counters = {}; Object.values(D.ELEMEN).forEach(e => { e.kuat.forEach(z => { counters[z] = (counters[z] || 0) + 1; }); ok(!e.kuat.some(z => e.lemah.includes(z)), e.nama + ' kuat & lemah sama'); });
D.ZELEM_SEMUA.filter(z => z !== 'Hijau').forEach(z => ok(counters[z] >= 1, 'tiada penentang untuk zombie ' + z));
ZELEM.forEach(z => ok(D.ZELEM_SEMUA.includes(z.nama), 'elemen zombie tidak dipeta: ' + z.nama));
Object.keys(D.JENIS).forEach(j => ok(D.ELEMEN[D.JENIS[j].el], 'elemen jenis ' + j));
const perJenis = {}; W.forEach(w => { perJenis[w.jenis] = (perJenis[w.jenis] || 0) + 1; });
console.log('Kelangkaan:', D.RAR.map((r, i) => r + ' ' + rc[i]).join(', '));
console.log('Per jenis:', JSON.stringify(perJenis));
console.log('Kuasa lama tertinggi', oldMax.toFixed(1), '| baharu tertinggi', Math.max(...W.map(w => w.kuasa)), '| terendah', Math.min(...W.map(w => w.kuasa)));
console.log('Penentang setiap elemen zombie:', JSON.stringify(counters));
if (errs.length) { console.log('GAGAL', errs.length); errs.forEach(e => console.log(' ✗', e)); process.exit(1); } else console.log('✓ Semua semakan lulus');
require('fs').writeFileSync(__dirname + '/katalog.json', JSON.stringify({ W, JENIS: D.JENIS, KELAS: D.KELAS, PERK: D.PERK, MITOS: D.MITOS, ELEMEN: D.ELEMEN, RAR: D.RAR, ZELEM: D.ZELEM_SEMUA }));
