// Menjana blok 200 senjata ke dalam src/logic.js (antara penanda GEN). Jalankan: node tools/senjata200/gen.js
const fs = require('fs'), path = require('path'), D = require('./data.js');
const LOGIC = path.join(__dirname, '..', '..', 'src', 'logic.js');
const A = '// ==== GEN v9.8 MULA: 200 senjata (dijana oleh tools/senjata200/gen.js — jangan sunting dengan tangan) ====';
const B = '// ==== GEN v9.8 TAMAT ====';
const r3 = x => Math.round(x * 1000) / 1000;
function desc(w, s) {
  const f = [];
  if (s.n) f.push(s.n + ' peluru serentak');
  if (s.pierce >= 99) f.push('Tembus semua'); else if (s.pierce > 1) f.push('Tembus ' + s.pierce);
  if (s.splash) f.push('Letupan kawasan');
  if (s.chain) f.push('Kilat lompat ke ' + s.chain + ' zombie');
  if (s.slow) f.push('Perlahan ' + Math.round(s.slow * 100) + '%');
  if (s.burn) f.push('Bakar');
  if (s.knock) f.push('Tolak zombie');
  if (s.stun) f.push(Math.round(s.stun * 100) + '% kaku');
  if (s.wet) f.push('Basahkan zombie');
  if (s.heal) f.push('Baiki pagar');
  if (s.buff) f.push('Pasukan +5% damage');
  if (s.critB) f.push('+' + Math.round(s.critB * 100) + '% kritikal');
  if (s.pen) f.push('Tembus perisai ' + s.pen + '%');
  if (s.mark) f.push('Sumpahan +' + Math.round(s.mark * 100) + '%');
  if (s.aa > 1) f.push('Kuat lawan zombie terbang');
  if (!f.length && w.rate >= 4) f.push('Tembakan sangat laju');
  if (!f.length && w.dmg >= 30) f.push('Damage sangat tinggi');
  return f.length ? f.slice(0, 2).join(', ') : 'Seimbang dan stabil';
}
function toWeapon(w) {
  const s = Object.assign({}, w.sifat), o = { nama: w.nama, dmg: w.dmg, rate: w.rate, range: w.range, laras: w.laras, peluru: w.warna, harga: 100 * (w.rar + 1) };
  o.fam = w.jenis; o.rar = w.rar; o.jenis = w.dmgJenis; o.udara = w.udara; o.aa = s.aa || 1; o.bossB = 0; o.bentuk = w.bentuk; o.gen = 1;
  ['n', 'spread', 'pierce', 'splash', 'slow', 'burn', 'chain', 'heal', 'buff', 'knock', 'stun', 'wet', 'critB', 'pen', 'mark'].forEach(k => { if (s[k] != null) o[k] = s[k]; });
  o.perk = [];
  for (const p of w.perk) {
    const k = p.kuat;
    if (p.id.startsWith('mitos_')) { o.mitos = p.id.slice(6); o.perk.push(p.id); continue; }
    o.perk.push(p.id + (k > 1 ? '+' : ''));
    if (p.id === 'ganda') o.ganda = 1 + k;
    if (p.id === 'boss') o.bossB = r3(0.25 * k);
    if (p.id === 'tembus') o.pierce = (o.pierce || 1) + Math.round(2 * k);
    if (p.id === 'kritik') o.critB = r3((o.critB || 0) + 0.1 * k);
    if (p.id === 'pantas') o.rate = r3(o.rate * (1 + 0.15 * k));
    if (p.id === 'jauh') o.range = Math.round(o.range * (1 + 0.2 * k));
    if (p.id === 'udara') o.aa = r3(1 + 0.5 * k);
    if (p.id === 'pecah') o.pen = (o.pen || 0) + Math.round(25 * k);
  }
  o.desc = desc(w, Object.assign({}, s, { pierce: o.pierce, critB: o.critB, pen: o.pen, aa: o.aa }));
  return [w.id, o];
}
const W = D.build(), rows = W.map(toWeapon);
const body = [A,
  'const W_GEN = {',
  rows.map(([id, o]) => '  ' + id + ': ' + JSON.stringify(o)).join(',\n'),
  '};',
  'const W_ELEM_FAM = { api: \'api\', ais: \'ais\', racun: \'racun\', elektrik: \'elektrik\' };',
  'Object.keys(W_GEN).forEach(id => { const w = W_GEN[id]; WEAPONS[id] = w; WEAPON_ORDER.push(id); W_FAM[id] = w.fam; FAM_OF[w.fam].push(id); W_RAR_LIST[w.rar].push(id); const e = W_ELEM_FAM[w.fam]; if (e) W_ELEM[e].push(id); });',
  B].join('\n');
let src = fs.readFileSync(LOGIC, 'utf8');
const anchor = 'function weaponPrice(wid) { return W_PRICE[WEAPONS[wid].rar || 0]; }\n';
if (src.includes(A)) src = src.slice(0, src.indexOf(A)) + body + src.slice(src.indexOf(B) + B.length);
else { if (!src.includes(anchor)) throw new Error('penanda weaponPrice tiada'); src = src.replace(anchor, anchor + body + '\n'); }
fs.writeFileSync(LOGIC, src);
console.log('✓ ' + rows.length + ' senjata dijana ke src/logic.js (' + Math.round(body.length / 1024) + ' KB)');
