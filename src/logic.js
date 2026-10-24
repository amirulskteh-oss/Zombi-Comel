// ================= LOGIK GAME v3 (tulen, tiada DOM) =================
const VERSION = '9.19';
const SAVE_KEY = 'zombi_comel_save_v1';
const W = 360, H = 600, WALL_Y = 488, WAVES_PER_STAGE = 10, OFFLINE_CAP = 28800, ZCAP = 70, SAVE_V = 7, INV_CAP = 200, MAX_SLOTS = 6, WALL_SLOTS = 3;

// ---------- Kemahiran unik hero (kuasa naik setiap 10 bintang) ----------
const SKILLS = {
  pistol:   { nama: 'Pengawal Setia',     desc: '+20% damage kepada zombie dekat pagar' },
  budak:    { nama: 'Serangan Berganda',  desc: '15% peluang menyerang 2 kali' },
  shotgun:  { nama: 'Pelindung Keluarga', desc: 'HP pagar pasukan +10%' },
  mesingan: { nama: 'Enjin Panas',        desc: 'Laju tembak naik ketika menembak berterusan (maks +45%)' },
  sniper:   { nama: 'Mata Helang',        desc: '+25% peluang kritikal' },
  frost:    { nama: 'Nafas Beku',         desc: 'Zombie yang perlahan menerima +20% damage daripada semua hero' },
  bom:      { nama: 'Mercun Raya',        desc: 'Kawasan letupan +30%' },
  api:      { nama: 'Api Marak',          desc: 'Setiap serangan membakar; damage bakar ×2' },
  tukang:   { nama: 'Tukang Baiki',       desc: 'Pagar pulih 0.5% sesaat' },
  petir:    { nama: 'Litar Pintas',       desc: 'Serangan melompat ke zombie lain (+2 jika senjata elektrik)' },
  doktor:   { nama: 'Rawatan Kecemasan',  desc: 'Pulih 15% pagar bila HP bawah 30% (sekali setiap gelombang)' },
  roket:    { nama: 'Veteran Perang',     desc: '+40% damage kepada boss' },
  racun:    { nama: 'Racun Tersebar',     desc: 'Setiap serangan meracun; racun merebak ke 2 zombie' },
  koboi:    { nama: 'Tembakan Maut',      desc: 'Setiap tembakan ke-5 pasti kritikal' },
  laser:    { nama: 'Teknologi Angkasa',  desc: 'Masa bertenang kuasa −15%' },
  ninja:    { nama: 'Bayang Ninja',       desc: '20% peluang serangan tambahan' },
  askar:    { nama: 'Arahan Sarjan',      desc: 'Damage semua hero +10%' },
  saintis:  { nama: 'Kaji Zombie',        desc: '+30% damage kepada zombie berevolusi, item jatuh +25%' },
  jurutera: { nama: 'Renjatan EMP',       desc: '10% peluang melumpuhkan zombie 0.5 saat' },
  ratu_ais: { nama: 'Takhta Salju',       desc: 'Tembakan kritikal membekukan zombie 0.6 saat' },
  pahlawan: { nama: 'Halilintar',         desc: 'Setiap 8 saat, halilintar menyambar zombie (5× damage)' },
  komander: { nama: 'Komando Elit',       desc: 'Laju tembak semua hero +15%' }
};
function skillLvl(save, id) { return 1 + Math.floor((save.stars[id] || 0) / 10); }
function skillK(save, id) { return 1 + 0.25 * (skillLvl(save, id) - 1); }

// ---------- v9.5: Ultimate hero (dicas dengan membunuh zombie) ----------
// cas = bilangan zombie untuk penuh; k = jenis kesan; m = pengganda kuasa (× DPS hero)
const ULTS = {
  pistol:   { nama: 'Hujan Peluru',       ikon: '🔫', cas: 25, k: 'sRate',  m: 4,   dur: 5,   desc: 'Laju tembak Pak Usu ×4 selama 5 saat' },
  budak:    { nama: 'Batu Gergasi',       ikon: '🪨', cas: 30, k: 'batu',   m: 14,  r: 75,    desc: 'Batu gergasi menghempap kumpulan zombie paling padat dan memeningkan mereka' },
  shotgun:  { nama: 'Tembok Besi',        ikon: '🛡', cas: 30, k: 'perisai', dur: 6,          desc: 'Pagar terima 80% kurang damage selama 6 saat dan pulih 10%' },
  mesingan: { nama: 'Tembakan Gila',      ikon: '🔥', cas: 25, k: 'sRate',  m: 3,   dur: 6,   desc: 'Laju tembak ×3 selama 6 saat' },
  sniper:   { nama: 'Satu Das Maut',      ikon: '🎯', cas: 30, k: 'snipe',  m: 45,            desc: 'Satu tembakan dahsyat kepada zombie paling kuat' },
  frost:    { nama: 'Ribut Salji',        ikon: '❄', cas: 35, k: 'freeze', m: 4,   dur: 2.5, desc: 'Bekukan semua zombie 2.5 saat dan cederakan mereka' },
  bom:      { nama: 'Karpet Bom',         ikon: '💣', cas: 35, k: 'carpet', m: 9,   r: 60,    desc: '7 bom meletup merentas medan' },
  api:      { nama: 'Lautan Api',         ikon: '🌋', cas: 30, k: 'burnAll', m: 2,            desc: 'Semua zombie terbakar dengan api yang marak' },
  tukang:   { nama: 'Baiki Kilat',        ikon: '🔧', cas: 30, k: 'heal',   m: 0.35,          desc: 'Pagar pulih 35% serta-merta' },
  petir:    { nama: 'Ribut Elektrik',     ikon: '⚡', cas: 30, k: 'storm',  m: 7,             desc: '6 panahan petir, setiap satu melompat ke 3 zombie' },
  doktor:   { nama: 'Penawar Ajaib',      ikon: '💉', cas: 30, k: 'regen',  m: 0.03, dur: 6,  desc: 'Pagar pulih 20% dan 3% sesaat selama 6 saat' },
  roket:    { nama: 'Serangan Udara',     ikon: '🚀', cas: 35, k: 'rockets', m: 10, r: 50,    desc: '6 roket menyasar zombie paling kuat (+50% pada zombie terbang)' },
  racun:    { nama: 'Kabus Racun',        ikon: '☠', cas: 30, k: 'poison', m: 2,   dur: 4,   desc: 'Semua zombie diracun dan diperlahankan 35%' },
  koboi:    { nama: 'Enam Das Pantas',    ikon: '🤠', cas: 30, k: 'six',    m: 9,             desc: '6 tembakan kritikal kepada 6 zombie berbeza' },
  laser:    { nama: 'Pancaran Orbit',     ikon: '🛰', cas: 35, k: 'beam',   m: 7,             desc: 'Pancaran laser dari angkasa menyapu seluruh medan' },
  ninja:    { nama: 'Seribu Bayang',      ikon: '🥷', cas: 30, k: 'slash',  m: 5,             desc: '12 tetakan kilat kepada zombie rawak' },
  askar:    { nama: 'Panggilan Platun',   ikon: '🎖', cas: 30, k: 'tDmg',   m: 1.5, dur: 8,   desc: 'Damage semua hero ×1.5 selama 8 saat' },
  saintis:  { nama: 'Serum Lemah',        ikon: '🧪', cas: 30, k: 'lemah',  m: 1.4, dur: 8,   desc: 'Semua zombie terima +40% damage selama 8 saat' },
  jurutera: { nama: 'Gelombang EMP',      ikon: '📡', cas: 30, k: 'emp',    m: 3,   dur: 2,   desc: 'Lumpuhkan semua zombie 2 saat dan hapuskan peluru boss' },
  ratu_ais: { nama: 'Musim Sejuk Abadi',  ikon: '👑', cas: 40, k: 'freeze', m: 6,   dur: 4,   desc: 'Bekukan semua zombie 4 saat dengan damage besar' },
  pahlawan: { nama: 'Tombak Halilintar',  ikon: '🔱', cas: 35, k: 'smite',  m: 30,  r: 90,    desc: 'Halilintar gergasi menyambar zombie paling kuat dan sekelilingnya' },
  komander: { nama: 'Arahan Serang',      ikon: '📣', cas: 30, k: 'tRate',  m: 1.5, dur: 8,   desc: 'Laju tembak semua hero ×1.5 selama 8 saat; Ultimate hero lain +20%' }
};
const ULT_PASIF = 50;   // saat untuk cas penuh tanpa membunuh
function ultK(save, id) { return skillK(save, id); }
function ultDesc(save, id) { const U = ULTS[id]; return U ? U.desc + (skillLvl(save, id) > 1 ? ' (kuasa ×' + ultK(save, id).toFixed(2) + ')' : '') : ''; }

// ---------- Boss unik setiap 10 stage ----------
// v8.8: 15 bentuk boss × 6 elemen × 4 tahap = 360 boss istimewa
const BOSS_FORMS = [
  { id: 'lendir',  nama: 'Raja Lendir',       warna: '#6CC04A', desc: 'Pecah menjadi 4 lendir bila HP tinggal separuh.', f2: 'Pecah menjadi 4 lendir' },
  { id: 'jeneral', nama: 'Jeneral Tengkorak', warna: '#8A8698', desc: 'Memanggil 2 askar zombie setiap 5 saat.', f2: 'Panggil 3 askar sekali gus' },
  { id: 'ratu',    nama: 'Ratu Racun',        warna: '#A040C0', desc: 'Meludah awan racun yang memperlahankan hero 40% selama 3 saat.', f2: 'Awan racun 5 saat' },
  { id: 'besi',    nama: 'Gergasi Besi',      warna: '#7A8494', desc: 'Kebal sepenuhnya selama 2 saat setiap 8 saat.', f2: 'Kebal 3 saat' },
  { id: 'naga',    nama: 'Naga Zombi',        warna: '#C8402A', desc: 'Menerpa ke hadapan dan menyembur api ke pagar dari jauh.', f2: 'Semburan api lebih panas', ranged: 1 },
  { id: 'gorila',  nama: 'Gorila Zombi',      warna: '#5A4A44', desc: 'Berdiri jauh dan melempar batu besar ke pagar.', f2: 'Lempar 3 batu serentak', ranged: 1 },
  { id: 'badut',   nama: 'Badut Bom',         warna: '#E8C8D8', desc: 'Melempar bom berdetik dari jauh. Tembak bom di udara!', f2: 'Lempar 2 bom', ranged: 1 },
  { id: 'pemanah', nama: 'Pemanah Rangka',    warna: '#D8D0C0', desc: 'Hujan anak panah ke pagar dari jauh.', f2: 'Hujan 8 anak panah', ranged: 1 },
  { id: 'sihir',   nama: 'Ahli Sihir',        warna: '#5A3A8A', desc: 'Berteleport dan melontar bola api.', f2: 'Lindungi zombie berdekatan dengan sihir', ranged: 1 },
  { id: 'labah',   nama: 'Labah-labah Ratu',  warna: '#3A3040', desc: 'Menembak jaring yang mengikat hero 2 saat dan menetaskan anak labah-labah.', f2: 'Tembak 2 jaring' },
  { id: 'ais',     nama: 'Gergasi Ais',       warna: '#9FD8F0', desc: 'Membekukan semua menara selama 3 saat.', f2: 'Turut membekukan seorang hero' },
  { id: 'robot',   nama: 'Robot Zombi',       warna: '#8A96A8', desc: 'Garisan amaran merah, kemudian sinar laser ke pagar.', f2: 'Dua sinar laser', ranged: 1 },
  { id: 'ular',    nama: 'Ular Sawa Zombi',   warna: '#6E8A3A', desc: 'Menyelam bawah tanah (kebal) dan muncul dekat pagar.', f2: 'Menyelam lebih lama' },
  { id: 'kelawar', nama: 'Kelawar Gergasi',   warna: '#4A3A5A', desc: 'Terbang zig-zag dan menukik ke hadapan.', f2: 'Jeritan sonik memperlahankan hero' },
  { id: 'ketam',   nama: 'Ketam Gergasi',     warna: '#D0583A', desc: 'Cangkerang tebal (damage −40%) kecuali bila sepitnya terbuka.', f2: 'Sepit memukul pagar 3× kuat' }
];
const BIG_BOSSES = BOSS_FORMS;
const BOSS_ORDER = ['lendir', 'jeneral', 'gorila', 'badut', 'ratu', 'labah', 'besi', 'pemanah', 'naga', 'ais', 'robot', 'sihir', 'ular', 'kelawar', 'ketam'];
const BOSS_ELEMS = [
  { id: 'api',      nama: 'Api',      ikon: '🔥', warna: '#FF6A2B', desc: 'Serangan +25%' },
  { id: 'ais',      nama: 'Salji',    ikon: '❄', warna: '#8FE0FF', desc: 'Separuh kebal beku, HP +10%' },
  { id: 'racun',    nama: 'Racun',    ikon: '☠', warna: '#8BE04A', desc: 'Pulih 0.6% HP sesaat' },
  { id: 'elektrik', nama: 'Petir',    ikon: '⚡', warna: '#FFE07A', desc: 'Laju +25%, kuasa lebih kerap' },
  { id: 'bayang',   nama: 'Bayang',   ikon: '🌑', warna: '#6A5A8A', desc: '25% elak peluru' },
  { id: 'emas',     nama: 'Emas',     ikon: '🪙', warna: '#F2C230', desc: 'Gold ×3, HP +15%' }
];
const BOSS_TIERS = [
  { nama: 'Muda',   hp: 1,    r: 40, bin: '★' },
  { nama: 'Ganas',  hp: 1.08, r: 44, bin: '★★' },
  { nama: 'Purba',  hp: 1.16, r: 48, bin: '★★★' },
  { nama: 'Diraja', hp: 1.25, r: 52, bin: '👑' }
];
const BOSS_TOTAL = BOSS_FORMS.length * BOSS_ELEMS.length * BOSS_TIERS.length;
const BOSS_CD = { lendir: 99, jeneral: 5, ratu: 6, besi: 8, naga: 7, gorila: 4, badut: 5, pemanah: 4.5, sihir: 6, labah: 7, ais: 9, robot: 7, ular: 8, kelawar: 5, ketam: 6 };
function bossFormIdx(id) { return BOSS_FORMS.findIndex(f => f.id === id); }
function bossById(id) { const f = Math.floor(id / 24), e = Math.floor(id / 4) % 6, t = id % 4, F = BOSS_FORMS[f], E = BOSS_ELEMS[e], T = BOSS_TIERS[t]; return F ? { id, f, e, t, form: F, elem: E, tier: T, nama: F.nama + ' ' + E.nama + ' ' + T.nama } : null; }
function bossHash(n) { n = (n ^ 61) ^ (n >>> 16); n = Math.imul(n, 9); n ^= n >>> 4; n = Math.imul(n, 0x27d4eb2d); n ^= n >>> 15; return n >>> 0; }
function bossDay(now) { return Math.max(0, Math.floor((now || 0) / 86400000)); }
// boss stage bertukar setiap hari (day) — koleksi 360 boss boleh dilengkapkan dengan bermain berulang kali
function bossOf(stage, off, day) {
  const s = stage + (off || 0), big = isBigBoss(stage), h = bossHash(stage * 131 + (off || 0) * 977 + (day || 0) * 7919 + 7), h2 = bossHash(h + 3);
  const nF = Math.min(15, 1 + Math.floor(s / 4)), fid = big ? BOSS_ORDER[(stage / 10 - 1 + (day || 0)) % 15] : BOSS_ORDER[h % nF];
  const nE = Math.min(6, 1 + Math.floor(s / 10)), e = h2 % nE;
  let t = s < 25 ? 0 : s < 60 ? 1 : s < 120 ? 2 : 3; if (big) t = Math.min(3, t + 1);
  const b = bossById(bossFormIdx(fid) * 24 + e * 4 + t); b.big = big; return b;
}
// ---------- v9.3: 18 sifat boss ----------
const BTRAIT = {
  kfiz:     { ikon: '🛡', nama: 'Kebal Fizikal',    desc: 'Damage fizikal tidak berkesan',                  lawan: 'Bawa senjata ✨ Magis' },
  kmag:     { ikon: '🔮', nama: 'Kebal Magis',      desc: 'Damage magis tidak berkesan',                    lawan: 'Bawa senjata 🗡 Fizikal' },
  giliran:  { ikon: '🔄', nama: 'Perisai Bergilir', desc: 'Bertukar Kebal Fizikal ↔ Kebal Magis setiap 6 s', lawan: 'Pasukan campuran Fizikal + Magis' },
  kslow:    { ikon: '🧊', nama: 'Kebal Perlahan',   desc: 'Tidak boleh diperlahankan atau dibekukan',       lawan: 'Damage tinggi' },
  kapi:     { ikon: '🔥', nama: 'Kebal Api',        desc: 'Api tidak berkesan & memulihkan boss',           lawan: 'Elak senjata api' },
  kracun:   { ikon: '☠', nama: 'Kebal Racun',      desc: 'Racun tidak berkesan',                           lawan: 'Elak senjata racun' },
  ktolak:   { ikon: '🪨', nama: 'Kebal Kawalan',    desc: 'Tidak ditarik, dipengsankan atau dibekukan oleh kuasa', lawan: 'Damage terus' },
  kkrit:    { ikon: '🎯', nama: 'Kebal Kritikal',   desc: 'Pukulan kritikal jadi pukulan biasa',            lawan: 'Damage asas tinggi' },
  batu:     { ikon: '🪨', nama: 'Kulit Batu',       desc: 'Setiap pukulan maksimum 3% HP boss',             lawan: 'Senjata laju (Minigun, SMG)' },
  pantul:   { ikon: '🔁', nama: 'Pantul',           desc: '20% peluru dipantul balik ke pagar',             lawan: 'Baiki pagar, tembak jatuh' },
  terbang:  { ikon: '✈', nama: 'Terbang',          desc: 'Hanya senjata udara boleh kena',                 lawan: 'Bawa senjata ⬆⬇ Udara' },
  bayang:   { ikon: '👻', nama: 'Bayang',           desc: 'Elak 30% peluru',                                lawan: 'Ketepatan (item topi)' },
  serap:    { ikon: '🌀', nama: 'Penyerap',         desc: 'Senjata sama elemen memulihkan boss',            lawan: 'Guna elemen berbeza' },
  tahanketik: { ikon: '👆', nama: 'Tahan Ketik',    desc: 'Ketikan jari tiada kesan',                       lawan: 'Biar hero menembak' },
  amuk:     { ikon: '💢', nama: 'Pengamuk',         desc: 'Makin rendah HP, makin laju',                    lawan: 'Bunuh cepat' },
  sembuh:   { ikon: '💚', nama: 'Penyembuh',        desc: 'Memulihkan zombie berdekatan',                   lawan: 'Bunuh pengiring dahulu' },
  pengawal: { ikon: '🛡', nama: 'Pengawal',         desc: 'Zombie berdekatan terima 60% kurang damage',     lawan: 'Fokus boss' },
  bangkit:  { ikon: '⏳', nama: 'Kebangkitan',      desc: 'Hidup semula sekali dengan 30% HP',              lawan: 'Simpan kuasa untuk akhir' }
};
const BTRAIT_ORDER = Object.keys(BTRAIT);
const BOSS_SIG = { lendir: 'bangkit', jeneral: 'pengawal', ratu: 'kracun', besi: 'giliran', naga: 'kapi', gorila: 'ktolak', badut: 'tahanketik', pemanah: 'kkrit', sihir: 'kmag', labah: 'sembuh', ais: 'kslow', robot: 'pantul', ular: 'amuk', kelawar: 'terbang', ketam: 'batu' };
const ELEM_TRAIT = { api: 'kapi', ais: 'kslow', racun: 'kracun', bayang: 'bayang' };
const W_ELEM = { api: ['api', 'napalm'], ais: ['frost', 'nitrogen', 'ais_g'], racun: ['racun', 'tongkat_r'], elektrik: ['petir', 'tesla', 'tukul'] };
function bossTraits(id) {
  const B = bossById(id); if (!B) return []; const n = [1, 1, 2, 3][B.t], out = [BOSS_SIG[B.form.id]];
  const et = ELEM_TRAIT[B.elem.id]; if (out.length < n && et && !out.includes(et)) out.push(et);
  const pool = BTRAIT_ORDER.filter(k => k !== 'terbang' && !(k === 'serap' && !W_ELEM[B.elem.id])); let h = bossHash(id * 977 + 31);
  while (out.length < n) { const k = pool[h % pool.length]; h = bossHash(h + 7);
    if (out.includes(k)) continue; const imm = out.some(x => x === 'kfiz' || x === 'kmag' || x === 'giliran'); if ((k === 'kfiz' || k === 'kmag' || k === 'giliran') && imm) continue; out.push(k); }
  return out;
}
function bossAdvice(tr) { const t = tr.find(k => k === 'kfiz' || k === 'kmag' || k === 'giliran' || k === 'terbang') || tr[0]; return t ? BTRAIT[t].ikon + ' ' + BTRAIT[t].nama + ' — ' + BTRAIT[t].lawan : ''; }
// v9.9: faktor kesesuaian senjata terhadap sifat boss (0 = tidak berguna, 1 = biasa)
function bossFit(wid, tr, belem) { const w = WEAPONS[wid]; if (!w || wid === 'batu') return 0.3; let k = 1;
  if (tr.includes('kfiz') && w.jenis === 'f') k *= 0.05; if (tr.includes('kmag') && w.jenis === 'm') k *= 0.05;
  if (tr.includes('terbang') && !w.udara) k *= 0.1; if (tr.includes('kapi') && W_FAM[wid] === 'api') k *= 0.02; if (tr.includes('kracun') && W_FAM[wid] === 'racun') k *= 0.05;
  if (tr.includes('serap') && W_ELEM[belem] && W_ELEM[belem].includes(wid)) k *= 0.02; k *= elemKFor(wid, BOSS_ZEL[belem] || null, tr.includes('terbang'), [], tr); if (tr.includes('batu')) k *= Math.min(1.5, 0.5 + w.rate / 4); if (tr.includes('kkrit') && w.critB) k *= 0.85; return k; }
// pasang senjata terbaik untuk boss pada setiap hero pasukan (tamak, ikut susunan pasukan)
function bossArm(save, tr, belem) { const team = save.team.filter(h => save.heroes[h]), used = new Set(), own = Object.keys(save.weapons).filter(w => WEAPONS[w] && w !== 'batu'); let n = 0;
  const pick = {}; for (const h of team) { let best = null, bs = -1; for (const w of own) { if (used.has(w)) continue; const sc = weaponScore(save, h, w) * bossFit(w, tr, belem); if (sc > bs) { bs = sc; best = w; } } if (best) { used.add(best); pick[h] = best; } }
  if (tr.includes('giliran') && team.length >= 2) { const js = new Set(team.map(h => pick[h] && WEAPONS[pick[h]].jenis)); if (js.size < 2) { const need = js.has('f') ? 'm' : 'f', h = team[team.length - 1], alt = own.filter(w => !used.has(w) && WEAPONS[w].jenis === need).sort((a, b) => weaponScore(save, h, b) - weaponScore(save, h, a))[0]; if (alt) { used.delete(pick[h]); pick[h] = alt; used.add(alt); } } }
  for (const h of team) if (pick[h] && heroWeapon(save, h) !== pick[h]) { const other = HERO_ORDER.find(o => o !== h && save.heroWpn[o] === pick[h]); if (other && !team.includes(other)) delete save.heroWpn[other]; save.heroWpn[h] = pick[h]; n++; }
  normalizeWeapons(save);
  return { ok: true, n, msg: n ? '🎯 ' + n + ' senjata ditukar untuk boss' : '🎯 Senjata pasukan sudah sesuai untuk boss ini' }; }
// v9.9: stat senjata untuk grafik (ikut level & bintang); maksimum dikira sekali pada level 1
function wpnBarStats(save, wid) { const w = WEAPONS[wid], lv = (save && save.weapons[wid]) || 1, k = wpnLvlMult(lv) * (save ? wStarMult(save, wid) : 1), n = w.n || 1, dmg = w.dmg * k * n, rate = w.rate * (save && wStars(save, wid) >= 3 ? 1.1 : 1);
  return { dmg, rate, range: w.range, dps: dmg * rate * (1 + Math.min(3, (w.pierce || 1) - 1) * 0.3) * (w.splash ? 1.8 : 1) * (w.chain ? 1 + w.chain * 0.4 : 1) }; }
let W_BAR_MAX = null;
function wpnBarMax() { if (W_BAR_MAX) return W_BAR_MAX; const m = { dmg: 0, rate: 0, range: 0, dps: 0 }; WEAPON_ORDER.forEach(w => { const s = wpnBarStats(null, w); Object.keys(m).forEach(k => { m[k] = Math.max(m[k], s[k]); }); }); return (W_BAR_MAX = m); }
// ---------- v9.10: carta elemen — senjata (ikut jenis) lawan elemen zombie: kuat ×1.5, lemah ×0.6 ----------
const ELEMEN = {
  fizikal:  { nama: 'Fizikal',  ikon: '🗡', kuat: [],                           lemah: [] },
  letupan:  { nama: 'Letupan',  ikon: '💣', kuat: ['Logam', 'Kristal', 'Ais'],  lemah: ['Bayang'] },
  ais:      { nama: 'Ais',      ikon: '❄', kuat: ['Api', 'Elektrik'],          lemah: ['Ais'] },
  api:      { nama: 'Api',      ikon: '🔥', kuat: ['Ais', 'Lumut', 'Busuk'],    lemah: ['Api'] },
  racun:    { nama: 'Racun',    ikon: '☠', kuat: ['Darah', 'Lumut'],           lemah: ['Logam'] },
  elektrik: { nama: 'Elektrik', ikon: '⚡', kuat: ['Logam'],                    lemah: ['Elektrik'] },
  tenaga:   { nama: 'Tenaga',   ikon: '🔆', kuat: ['Bayang'],                   lemah: ['Kristal'] },
  angin:    { nama: 'Angin',    ikon: '💨', kuat: ['Racun', 'Terbang'],         lemah: ['Logam'] },
  bumi:     { nama: 'Bumi',     ikon: '🪨', kuat: ['Elektrik', 'Kristal'],      lemah: ['Terbang'] },
  air:      { nama: 'Air',      ikon: '💧', kuat: ['Api'],                      lemah: ['Elektrik'] },
  cahaya:   { nama: 'Cahaya',   ikon: '✨', kuat: ['Bayang', 'Darah', 'Racun'], lemah: ['Kristal'] },
  bayang:   { nama: 'Bayang',   ikon: '🌑', kuat: ['Kristal', 'Pucat'],         lemah: ['Bayang'] }
};
const ELEMEN_ORDER = Object.keys(ELEMEN);
const FAM_EL = { biasa: 'fizikal', serak: 'fizikal', tepat: 'fizikal', lontar: 'fizikal', letup: 'letupan', ais: 'ais', api: 'api', racun: 'racun', elektrik: 'elektrik', tenaga: 'tenaga', sokong: 'cahaya', angin: 'angin', bumi: 'bumi', air: 'air', cahaya: 'cahaya', bayang: 'bayang' };
const BOSS_ZEL = { api: 'Api', ais: 'Ais', racun: 'Racun', elektrik: 'Elektrik', bayang: 'Bayang' };
const ZEL_IKON = { Hijau: '🟢', Lumut: '🌿', Pucat: '👻', Busuk: '🤢', Api: '🔥', Ais: '❄', Racun: '☠', Elektrik: '⚡', Logam: '🔩', Bayang: '🌑', Kristal: '💎', Darah: '🩸', Terbang: '✈' };
const ZEL_ORDER = ['Lumut', 'Pucat', 'Busuk', 'Api', 'Ais', 'Racun', 'Elektrik', 'Logam', 'Bayang', 'Kristal', 'Darah', 'Terbang'];
function wElem(wid) { return FAM_EL[W_FAM[wid]] || 'fizikal'; }
// pengganda elemen untuk sasaran (nama elemen + terbang). Lemah tidak ditambah jika sasaran sudah kebal jenis itu (elak penalti berganda)
function elemKFor(wid, zel, fly, traits, btr) { return elemKEl(wElem(wid), zel, fly, traits, btr); }
function elemKEl(el, zel, fly, traits, btr) { const e = ELEMEN[el]; if (!e || !e.kuat.length && !e.lemah.length) return 1; let k = 1; const T = traits || [], B = btr || [];
  const kebal = (el === 'api' && (T.includes('kebal_api') || B.includes('kapi'))) || (el === 'ais' && (T.includes('kebal_ais') || B.includes('kslow'))) || (el === 'racun' && B.includes('kracun'));
  for (const tg of [zel, fly ? 'Terbang' : null]) { if (!tg) continue; if (e.kuat.includes(tg)) k *= 1.5; else if (e.lemah.includes(tg) && !kebal) k *= 0.6; }
  return k; }
function elemK(wid, z) { return elemKFor(wid, z.zel, !!z.fly, z.traits, z.btr); }
function elemCounters(zel) { return ELEMEN_ORDER.filter(k => ELEMEN[k].kuat.includes(zel)); }
function kebalK(battle) { return battle && battle.diff && battle.diff.id !== 'normal' ? 1 : 0.95; }
function bossDexGet(save, id) { return +((save.bossDex || '')[id] || 0); }
function bossDexSet(save, id, v) { let d = save.bossDex || ''; if (d.length < BOSS_TOTAL) d += '0'.repeat(BOSS_TOTAL - d.length); if (+d[id] >= v) { save.bossDex = d; return false; } save.bossDex = d.slice(0, id) + v + d.slice(id + 1); return true; }
// ---------- v9.1: Serbuan Boss mingguan ----------
const RAID_STEPS = 10;
function raidWeek(now) { return Math.floor(((now || 0) / 86400000 - 4) / 7); } // minggu bermula Isnin
function raidWeekEnd(now) { return ((raidWeek(now) + 1) * 7 + 4) * 86400000; }
function raidEnsure(save, now) {
  const wk = raidWeek(now), r = save.raid;
  if (r && r.wk === wk && Array.isArray(r.list) && r.list.length === RAID_STEPS) return r;
  const seed = bossHash(wk * 7919 + 13), ids = [];
  for (let i = 0; i < BOSS_TOTAL; i++) ids.push(i);
  // utamakan boss yang belum ditewaskan supaya koleksi boleh dilengkapkan
  ids.sort((a, b) => ((bossDexGet(save, a) >= 2) - (bossDexGet(save, b) >= 2)) || (bossHash(a * 31 + seed) - bossHash(b * 31 + seed)));
  const pick = ids.slice(0, RAID_STEPS).sort((a, b) => (a % 4) - (b % 4) || a - b);
  save.raid = { wk, list: pick, step: 0, rekod: (r && r.rekod) || 0 };
  return save.raid;
}
function raidStage(save, i) { return Math.max(10, Math.round(effBest(save) * 0.8)) + i * 5; }
function raidReward(i) { return { gems: 15 + i * 5 + (i === RAID_STEPS - 1 ? 100 : 0), leg: i === 4 || i === RAID_STEPS - 1 ? 1 : 0 }; }
function raidWin(save, i, now) {
  const r = raidEnsure(save, now); if (i !== r.step || i >= RAID_STEPS) return { ok: false, msg: 'Langkah serbuan tidak sah' };
  const rw = raidReward(i); r.step++; r.rekod = Math.max(r.rekod || 0, r.step); save.gems += rw.gems; stat(save, 'raidWins'); const leg = rw.leg || 0; if (leg && save.wpeti) { save.wpeti.leg += leg; stat(save, 'wLegGot', leg); }
  return { ok: true, msg: '👑 Serbuan ' + r.step + '/' + RAID_STEPS + ' lepas! +' + rw.gems + ' gems' + (leg ? ' + 🟣 Peti Senjata Legenda' : '') + (r.step === RAID_STEPS ? ' — semua boss minggu ini ditewaskan!' : ''), gems: rw.gems };
}
function bossDexCount(save, v) { let n = 0; const d = save.bossDex || ''; for (let i = 0; i < d.length; i++) if (+d[i] >= (v || 1)) n++; return n; }
function bigBossOf(stage, off) { return isBigBoss(stage) ? bossOf(stage, off || 0).form : null; }

// ---------- Harian: log masuk 7 hari & misi ----------
function dayKey(now) { const d = new Date(now); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
const LOGIN_REWARDS = [
  { nama: 'Gold',          jenis: 'gold',  n: 300 },
  { nama: '20 gems',       jenis: 'gems',  n: 20 },
  { nama: '10 shard',      jenis: 'shard', n: 10 },
  { nama: 'Peti Emas',     jenis: 'peti',  n: 1 },
  { nama: '50 gems',       jenis: 'gems',  n: 50 },
  { nama: 'Gold besar',    jenis: 'gold',  n: 2000 },
  { nama: '30 shard SR+ & 100 gems', jenis: 'mega', n: 1 }
];
function loginAvailable(save, now) { return save.daily.login !== dayKey(now); }
function claimLogin(save, now, rng) {
  if (!clockCheck(save, now)) return { ok: false, msg: 'Jam peranti nampaknya diundurkan. Betulkan tarikh & masa dahulu' };
  if (!loginAvailable(save, now)) return { ok: false, msg: 'Ganjaran hari ini sudah dituntut' };
  const d = save.daily.streak % 7, r = LOGIN_REWARDS[d], mult = Math.pow(GOLD_G, effBest(save) - 1); let msg = 'Hari ' + (d + 1) + ': ';
  if (r.jenis === 'gold') { const g = Math.floor(r.n * mult); save.gold += g; msg += '+' + fmtNum(g) + ' gold'; }
  else if (r.jenis === 'gems') { save.gems += r.n; msg += '+' + r.n + ' gems'; }
  else if (r.jenis === 'shard') { const h = randomShardHero(rng); addShards(save, h, 10); msg += '+10 shard ' + HEROES[h].nama; }
  else if (r.jenis === 'peti') { const it = addItem(save, makeItem(save, rng, 2)); msg += 'item ' + RARITY[it.it.rar].nama; }
  else { for (let i = 0; i < 30; i++) addShards(save, randomShardHero(rng, 5), 1); save.gems += 100; msg += '+30 shard SR+, +100 gems'; }
  save.daily.login = dayKey(now); save.daily.streak++; stat(save, 'logins');
  return { ok: true, msg };
}
const MISSION_POOL = [
  { k: 'kills',      nama: 'Tewaskan {n} zombie',          n: [80, 200, 400] },
  { k: 'bosses',     nama: 'Tewaskan {n} boss',            n: [1, 3, 5] },
  { k: 'stagesWon',  nama: 'Menang {n} stage',             n: [2, 4, 7] },
  { k: 'powersUsed', nama: 'Guna kuasa {n} kali',          n: [3, 8, 15] },
  { k: 'taps',       nama: 'Tekan zombie {n} kali',        n: [30, 80, 150] },
  { k: 'evoKills',   nama: 'Tewaskan {n} zombie berevolusi', n: [10, 30, 60] },
  { k: 'itemsGot',   nama: 'Dapat {n} item',               n: [2, 5, 10] },
  { k: 'forges',     nama: 'Tempa item {n} kali',          n: [1, 3, 6] },
  { k: 'shardsGot',  nama: 'Kumpul {n} shard',             n: [5, 15, 30] },
  { k: 'chests',     nama: 'Buka {n} peti',                n: [1, 2, 4] }
];
function rollMissions(save, now) {
  const key = dayKey(now); if (save.daily.mDay === key) return false;
  let seed = 0; for (const ch of key) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const r = mulberry(seed), pool = MISSION_POOL.map((m, i) => i), list = [];
  while (list.length < 5) { const i = pool.splice(Math.floor(r() * pool.length), 1)[0], m = MISSION_POOL[i], lv = Math.floor(r() * 3); list.push({ i, lv, base: save.stats[m.k] || 0, done: false }); }
  save.daily.mDay = key; save.daily.missions = list; save.daily.bonus = false; return true;
}
function missionInfo(save, m) { const d = MISSION_POOL[m.i], need = d.n[m.lv], v = Math.max(0, (save.stats[d.k] || 0) - m.base); return { nama: d.nama.replace('{n}', need), v: Math.min(v, need), need, ready: v >= need && !m.done, gems: 10 + m.lv * 10, gold: Math.floor((200 + m.lv * 300) * Math.pow(GOLD_G, save.best - 1)) }; }
function claimMission(save, idx) {
  const m = save.daily.missions[idx]; if (!m) return { ok: false, msg: 'Tiada misi' };
  const info = missionInfo(save, m); if (!info.ready) return { ok: false, msg: m.done ? 'Sudah dituntut' : 'Belum selesai' };
  m.done = true; save.gems += info.gems; save.gold += info.gold; stat(save, 'missions');
  return { ok: true, msg: 'Misi selesai: +' + info.gems + ' gems, +' + fmtNum(info.gold) + ' gold' };
}
function claimMissionBonus(save, rng) {
  if (save.daily.bonus || !save.daily.missions.length || !save.daily.missions.every(m => m.done)) return { ok: false, msg: 'Selesaikan semua 5 misi dahulu' };
  save.daily.bonus = true; const got = {}; for (let i = 0; i < 15; i++) { const h = randomShardHero(rng); got[h] = (got[h] || 0) + 1; addShards(save, h, 1); } save.gems += 50;
  return { ok: true, msg: 'Bonus harian: +50 gems, +15 shard' };
}

// ---------- Kebangkitan (prestij) ----------
const PRESTIGE_MIN = 60;
const PERKS = {
  permulaan: { nama: 'Permulaan Kuat',  desc: 'Mula semula di stage +5 setiap level',            kos: l => 10 * Math.pow(2, l), max: 20 },
  warisan:   { nama: 'Warisan Emas',    desc: 'Gold permulaan ×3 setiap level',                  kos: l => 8 * Math.pow(1.8, l), max: 30 },
  latihan:   { nama: 'Latihan Kekal',   desc: 'Kekalkan 5% level hero setiap level (maks 50%)',  kos: l => 20 * Math.pow(2, l), max: 10 },
  berkat:    { nama: 'Berkat Pahlawan', desc: 'Damage semua hero +10% setiap level',             kos: l => 15 * Math.pow(1.5, l), max: 999 },
  rezeki:    { nama: 'Rezeki Permata',  desc: 'Gems daripada boss +20% setiap level',            kos: l => 12 * Math.pow(1.6, l), max: 50 }
};
const PERK_ORDER = Object.keys(PERKS);
function rohMult(save) { return 1 + 0.02 * (save.rohTotal || 0); }
function perk(save, id) { return (save.perks && save.perks[id]) || 0; }
function prestigeGain(save) { return (save.mode || 'normal') !== 'normal' || save.best < PRESTIGE_MIN ? 0 : Math.floor(Math.pow((save.best - 40) / 10, 2) * 10); }
function buyPerk(save, id) {
  const p = PERKS[id], l = perk(save, id); if (l >= p.max) return { ok: false, msg: 'Sudah maksimum' };
  const c = Math.ceil(p.kos(l)); if (save.roh < c) return { ok: false, msg: 'Roh tak cukup (perlu ' + c + ')' };
  save.roh -= c; save.perks[id] = l + 1; return { ok: true, msg: p.nama + ' Lv.' + (l + 1) };
}
function doPrestige(save) {
  if ((save.mode || 'normal') !== 'normal') return { ok: false, msg: 'Kebangkitan hanya dalam mod Normal' };
  const g = prestigeGain(save); if (!g) return { ok: false, msg: 'Perlu sampai stage ' + PRESTIGE_MIN + ' untuk Kebangkitan' };
  save.roh += g; save.rohTotal += g; stat(save, 'prestige'); statMax(save, 'bestEver', save.best);
  const keep = Math.min(0.5, 0.05 * perk(save, 'latihan'));
  Object.keys(save.heroes).forEach(h => { save.heroes[h] = Math.max(1, Math.floor(save.heroes[h] * keep)); });
  Object.keys(save.weapons).forEach(w => { save.weapons[w] = 1; });
  Object.keys(save.powers).forEach(p => { save.powers[p] = 1; });
  ['damage', 'speed', 'wall', 'tap', 'jariApi', 'kombo'].forEach(k => { save.shop[k] = 0; });
  if (save.tapak) save.tapak.lvl = {};
  save.towers = save.towers.map(t => t ? { type: t.type, lvl: 1, br: [] } : null);
  save.wallsOwned = 1; save.wallActive = 0; save.wallLv = {};
  save.best = 1 + 5 * perk(save, 'permulaan'); save.stage = save.best;
  save.gold = perk(save, 'warisan') ? Math.floor(1000 * Math.pow(3, perk(save, 'warisan'))) : 0;
  return { ok: true, msg: 'Kebangkitan! +' + g + ' Roh Pahlawan (bonus kini ×' + rohMult(save).toFixed(2) + ')' };
}

// ---------- Mod Cabaran ----------
const CHALLENGES = [
  { id: 'rapuh',  nama: 'Pagar Rapuh',   desc: 'HP pagar hanya 15%',                         buka: 15, mods: { wall: 0.15 } },
  { id: 'pantas', nama: 'Larian Gila',   desc: 'Semua zombie 2× lebih laju',                 buka: 20, mods: { spd: 2 } },
  { id: 'tunggal',nama: 'Wira Tunggal',  desc: 'Hanya hero pertama dalam pasukan bertempur', buka: 25, mods: { solo: true } },
  { id: 'gerombolan', nama: 'Gerombolan', desc: '3× bilangan zombie, HP setiap satu 40%',    buka: 30, mods: { horde: true } },
  { id: 'boss',   nama: 'Serbuan Boss',  desc: 'Boss muncul di setiap gelombang',            buka: 40, mods: { bossRush: true } },
  { id: 'evolusi',nama: 'Evolusi Penuh', desc: 'Semua zombie berevolusi maksimum, tiada kuasa', buka: 50, mods: { evoMax: true, noPower: true } }
];
const CHAL_LEVELS = 10, CHAL_WAVES = 5;
function chalUnlocked(save, c) { return Math.max(save.best, save.stats.bestEver || 0) >= c.buka; }
function chalStage(save, c, lvl) { return Math.max(3, Math.floor(Math.max(effBest(save), 10) * 0.5)) + (lvl - 1) * 3; }
function chalReward(lvl) { return { gems: 30 + 10 * lvl, shard: 10 + 2 * lvl, item: lvl === 5 ? 5 : lvl === 10 ? 7 : -1 }; }
function chalNext(save, c) { return (save.chal[c.id] || 0) + 1; }
function winChallenge(save, id, lvl, rng) {
  const c = CHALLENGES.find(x => x.id === id); if (!c) return { ok: false, msg: 'Tiada' };
  stat(save, 'chalWins');
  if (lvl !== chalNext(save, c) || lvl > CHAL_LEVELS) return { ok: true, msg: 'Cabaran ' + c.nama + ' Lv.' + lvl + ' menang (ganjaran sudah dituntut sebelum ini)' };
  save.chal[id] = lvl; stat(save, 'chalLevels');
  const r = chalReward(lvl); save.gems += r.gems; let msg = c.nama + ' Lv.' + lvl + ' selesai! +' + r.gems + ' gems';
  for (let i = 0; i < r.shard; i++) addShards(save, randomShardHero(rng), 1); msg += ', +' + r.shard + ' shard';
  if (r.item >= 0) { const it = addItem(save, makeItem(save, rng, r.item)); msg += ', item ' + RARITY[it.it.rar].nama; }
  return { ok: true, msg };
}

// ---------- Menara pagar ----------
const TOWER_X = [56, 180, 304], TOWER_X4 = [42, 136, 224, 318], TOWER_Y = WALL_Y - 34;
function towerXs(n) { return n >= 4 ? TOWER_X4 : TOWER_X; }
const TOWER4_ROH = 150;
// cabang menara: pilih satu di Lv.25 dan satu di Lv.50
const TOWER_BRANCH = {
  panah:  [[{ id: 'api', nama: 'Panah Api', desc: 'Membakar zombie', burn: 0.8 }, { id: 'ganda', nama: 'Panah Berganda', desc: '+1 anak panah setiap tembakan', n: 1 }],
           [{ id: 'tembus', nama: 'Anak Panah Tembus', desc: 'Menembusi 3 zombie', pierce: 3 }, { id: 'laju', nama: 'Busur Kilat', desc: 'Laju tembak ×1.5', rate: 1.5 }]],
  meriam: [[{ id: 'mortar', nama: 'Mortar', desc: 'Jarak +150, letupan +30', range: 150, splash: 30 }, { id: 'meriamais', nama: 'Meriam Ais', desc: 'Letupan memperlahankan 40%', slow: 0.4 }],
           [{ id: 'gergasi', nama: 'Meriam Gergasi', desc: 'Damage ×1.8', dmg: 1.8 }, { id: 'kelompok', nama: 'Bom Kelompok', desc: 'Letupan +40 & ×1.3 damage', splash: 40, dmg: 1.3 }]],
  ais:    [[{ id: 'ribut', nama: 'Ribut Salji', desc: 'Peluru meletup kawasan 45', splash: 45 }, { id: 'kristal', nama: 'Kristal Tusuk', desc: 'Menembusi 3 zombie, damage ×1.4', pierce: 3, dmg: 1.4 }],
           [{ id: 'beku', nama: 'Sejuk Beku', desc: '15% peluang membeku 0.6 saat', freeze: 0.15 }, { id: 'sejuk', nama: 'Zon Kutub', desc: 'Perlahan 70% & damage ×1.3', slow: 0.7, dmg: 1.3 }]],
  petir:  [[{ id: 'rantai', nama: 'Rantai Panjang', desc: 'Kilat +2 lompatan', chain: 2 }, { id: 'kaku', nama: 'Renjatan Kaku', desc: 'Perlahan 50%', slow: 0.5 }],
           [{ id: 'ribut', nama: 'Ribut Petir', desc: 'Damage ×1.6', dmg: 1.6 }, { id: 'pantas', nama: 'Kilat Pantas', desc: 'Laju ×1.5', rate: 1.5 }]],
  api:    [[{ id: 'naga', nama: 'Naga Api', desc: 'Bakar +100%', burn: 1 }, { id: 'lautan', nama: 'Lautan Api', desc: 'Letupan api kawasan 40', splash: 40 }],
           [{ id: 'panas', nama: 'Bara Panas', desc: 'Damage ×1.6', dmg: 1.6 }, { id: 'semburan', nama: 'Semburan Berganda', desc: '+1 semburan', n: 1 }]],
  racun:  [[{ id: 'awan', nama: 'Awan Besar', desc: 'Kawasan racun 45', splash: 45 }, { id: 'lemah', nama: 'Racun Melemah', desc: 'Perlahan 40%', slow: 0.4 }],
           [{ id: 'toksik', nama: 'Toksik', desc: 'Bakar racun +80%', burn: 0.8 }, { id: 'wabak', nama: 'Wabak', desc: 'Racun melompat ke 2 zombie', chain: 2 }]],
  tepat:  [[{ id: 'tembus', nama: 'Peluru Tembus', desc: 'Menembusi 3 zombie', pierce: 3 }, { id: 'teropong', nama: 'Teropong', desc: 'Damage ×1.5', dmg: 1.5 }],
           [{ id: 'maut', nama: 'Tembakan Maut', desc: 'Damage ×2', dmg: 2 }, { id: 'auto', nama: 'Senapang Auto', desc: 'Laju ×1.8', rate: 1.8 }]],
  laser:  [[{ id: 'kembar', nama: 'Sinar Kembar', desc: '+1 sinar', n: 1 }, { id: 'bakar', nama: 'Pembakar', desc: 'Sinar membakar', burn: 0.6 }],
           [{ id: 'fokus', nama: 'Fokus', desc: 'Damage ×1.7', dmg: 1.7 }, { id: 'prisma', nama: 'Prisma', desc: 'Laju ×1.5', rate: 1.5 }]],
  angin:  [[{ id: 'puting', nama: 'Puting Beliung', desc: 'Tolakan +30', push: 30 }, { id: 'dingin', nama: 'Angin Dingin', desc: 'Perlahan 40%', slow: 0.4 }],
           [{ id: 'taufan', nama: 'Taufan', desc: 'Tolak kawasan 50', splash: 50 }, { id: 'ribut', nama: 'Ribut', desc: 'Laju ×1.6', rate: 1.6 }]],
  tukang: [[{ id: 'pantas', nama: 'Baiki Pantas', desc: 'Baiki ×1.6', dmg: 1.6 }, { id: 'perisai', nama: 'Perisai Baja', desc: '+10% perisai pagar', armor: 10 }],
           [{ id: 'semula', nama: 'Bina Semula', desc: 'Baiki ×2 bila HP pagar < 30%', low: 2 }, { id: 'duri', nama: 'Pagar Berduri', desc: '+2% duri pagar', thorns: 0.02 }]]
};
const BRANCH_LV = [25, 50];
function towerMods(t) {
  const m = { rate: 1, dmg: 1, n: 0, pierce: 0, splash: 0, slow: 0, burn: 0, range: 0, freeze: 0, chain: 0, push: 0, armor: 0, thorns: 0, low: 1 };
  (t.br || []).forEach((k, tier) => { const b = (TOWER_BRANCH[t.type][tier] || []).find(x => x.id === k); if (!b) return;
    m.rate *= b.rate || 1; m.dmg *= b.dmg || 1; m.n += b.n || 0; m.pierce = Math.max(m.pierce, b.pierce || 0); m.splash += b.splash || 0; m.slow = Math.max(m.slow, b.slow || 0); m.burn += b.burn || 0; m.range += b.range || 0; m.freeze = Math.max(m.freeze, b.freeze || 0); m.chain += b.chain || 0; m.push += b.push || 0; m.armor += b.armor || 0; m.thorns += b.thorns || 0; m.low = Math.max(m.low, b.low || 1); });
  return m;
}
function branchAvailable(t) { if (!t) return -1; const br = t.br || []; for (let i = 0; i < BRANCH_LV.length; i++) if (!br[i] && t.lvl >= BRANCH_LV[i]) return i; return -1; }
function chooseBranch(save, slot, id) {
  const t = save.towers[slot], tier = branchAvailable(t); if (tier < 0) return { ok: false, msg: 'Tiada cabang tersedia' };
  const b = TOWER_BRANCH[t.type][tier].find(x => x.id === id); if (!b) return { ok: false, msg: 'Cabang tidak sah' };
  t.br = (t.br || []).slice(0, tier); t.br[tier] = id; return { ok: true, msg: TOWERS[t.type].nama + ' → ' + b.nama };
}
function buyTowerSlot(save) {
  if (save.towers.length >= 4) return { ok: false, msg: 'Slot menara sudah maksimum' };
  if (save.roh < TOWER4_ROH) return { ok: false, msg: 'Perlu ' + TOWER4_ROH + ' Roh Pahlawan' };
  save.roh -= TOWER4_ROH; save.towers.push(null); return { ok: true, msg: 'Slot menara ke-4 dibuka!' };
}
function upgradeAllTowers(save) { let n = 0; const g0 = save.gold; for (let k = 0; k < 3000; k++) { let best = -1, bc = Infinity; save.towers.forEach((t, i) => { if (t && towerUpCost(t.lvl) < bc) { bc = towerUpCost(t.lvl); best = i; } }); if (best < 0 || save.gold < bc) break; upgradeTower(save, best, 1); n++; } return { ok: n > 0, msg: n ? n + ' naik taraf menara (−' + fmtNum(g0 - save.gold) + ' gold)' : 'Gold tak cukup' }; }
function towerDps(save, t) { if (!t) return 0; const T = TOWERS[t.type], m = towerMods(t), team = save.team.filter(h => save.heroes[h]); const avg = team.length ? team.reduce((a, h) => a + heroStats(save, h, 0).dmg, 0) / team.length : 10; return avg * 0.25 * T.mult * towerLvlMult(t.lvl) * m.dmg * T.rate * m.rate * (1 + m.n); }
function defenseStats(save) {
  const ws = wallStats(save), effHp = ws.max / Math.max(0.05, 1 - ws.armor), dps = save.towers.reduce((a, t) => a + towerDps(save, t), 0);
  const zs = zombieStats('biasa', Math.max(1, save.best), 5, diffOf(save).off), atk = zs.dmg * 6; // anggaran: 6 zombie biasa menyerang serentak
  return { hp: ws.max, effHp, armor: ws.armor, regen: ws.regen, thorns: ws.thorns, towerDps: dps, holdSec: atk > 0 ? effHp / atk : Infinity };
}
// ---------- naik taraf pantas (panel ⬆ dalam pertempuran) ----------
function upgradeChoices(save) {
  const o = [];
  save.team.forEach(h => { if (save.heroes[h]) o.push({ label: HEROES[h].nama + ' Lv.' + (save.heroes[h] + 1), cost: upCost(save.heroes[h]), f: () => upgradeHero(save, h, 1) }); });
  [...new Set(save.team.map(h => heroWeapon(save, h)))].forEach(w => { if (save.weapons[w]) o.push({ label: WEAPONS[w].nama + ' Lv.' + (save.weapons[w] + 1), cost: wpnCost(w, save.weapons[w]), f: () => upgradeWeapon(save, w, 1) }); });
  save.towers.forEach((t, i) => { if (t) o.push({ label: TOWERS[t.type].nama + ' Lv.' + (t.lvl + 1), cost: towerUpCost(t.lvl), f: () => upgradeTower(save, i, 1) }); });
  ['damage', 'wall'].forEach(k => o.push({ label: SHOP[k].nama + ' Lv.' + (save.shop[k] + 1), cost: shopCost(k, save.shop[k]), f: () => buyShop(save, k) }));
  return o.sort((a, b) => a.cost - b.cost);
}
// ---------- penarafan bintang selepas menang ----------
function battleStars(b) { if (b.state !== 'menang') return 0; const p = b.wallMax ? b.wall / b.wallMax : 1; return p >= 0.7 ? 3 : p >= 0.35 ? 2 : 1; }
const TOWERS = {
  panah:  { nama: 'Menara Panah',  desc: 'Menembak laju',                 wid: 'silang', rate: 1.6, mult: 0.8,  range: 300 },
  meriam: { nama: 'Menara Meriam', desc: 'Peluru meletup kena ramai',     wid: 'meriam', rate: 0.5, mult: 2.2,  range: 330 },
  ais:    { nama: 'Menara Ais',    desc: 'Memperlahankan zombie',         wid: 'frost',  rate: 1.0, mult: 0.6,  range: 300 },
  // v8.5: 7 menara baharu, dibuka ikut stage berkesan tertinggi (stage)
  petir:  { nama: 'Menara Petir',  desc: 'Kilat melompat ke 3 zombie',    wid: 'petir',  rate: 0.9, mult: 0.65,  range: 320, stage: 15, warna: '#F2D04A' },
  api:    { nama: 'Menara Api',    desc: 'Panah berapi yang membakar, jarak dekat', wid: 'api', rate: 1.4, mult: 0.55, range: 240, stage: 25, warna: '#E5603A' },
  racun:  { nama: 'Menara Racun',  desc: 'Racun berterusan & tembus perisai', wid: 'racun', rate: 1.1, mult: 0.5, range: 300, stage: 35, warna: '#7EC850', pen: 100 },
  tepat:  { nama: 'Menara Penembak Tepat', desc: 'Jarak seluruh medan; sasar zombie HP tertinggi & boss', wid: 'sniper', rate: 0.4, mult: 1.7, range: 620, stage: 45, warna: '#4E6A3A', target: 'hp' },
  laser:  { nama: 'Menara Laser',  desc: 'Sinar menembusi semua zombie dalam laluan', wid: 'laser', rate: 0.7, mult: 1.9, range: 600, stage: 60, warna: '#E04FC8' },
  angin:  { nama: 'Menara Angin',  desc: 'Menolak zombie ke belakang (kecuali boss)', wid: 'plasma', rate: 0.7, mult: 0.3, range: 300, stage: 75, warna: '#BFE4F0', peluru: '#EAF6FF', push: 48 },
  tukang: { nama: 'Menara Tukang', desc: 'Tidak menembak; membaiki pagar setiap saat', wid: 'tukul', rate: 1, mult: 0, range: 0, stage: 90, warna: '#E8A23A', heal: 0.012 }
};
function towerUnlocked(save, type) { const T = TOWERS[type]; return !!T && (!T.stage || effBest(save) >= T.stage); }
function towerHealRate(tw) { const T = TOWERS[tw.type], M = tw.mods || towerMods(tw); return T.heal ? Math.min(0.08, T.heal * (1 + 0.03 * (tw.lvl - 1)) * M.dmg) : 0; }
const TOWER_ORDER = Object.keys(TOWERS);
function towerBuildCost(slot) { return [800, 8000, 80000, 800000][slot]; }
function towerUpCost(lvl) { return Math.floor(200 * Math.pow(1.22, lvl - 1)); }
function towerLvlMult(lvl) { return (1 + 0.25 * (lvl - 1)) * Math.pow(1.5, Math.floor(lvl / 20)); }
function buildTower(save, slot, type) {
  if (!TOWERS[type] || slot < 0 || slot > 3) return { ok: false, msg: 'Tidak sah' };
  if (!towerUnlocked(save, type)) return { ok: false, msg: '🔒 ' + TOWERS[type].nama + ' dibuka di stage ' + TOWERS[type].stage };
  if (slot >= save.towers.length) return { ok: false, msg: 'Slot belum dibuka' };
  if (save.towers[slot]) { if (save.towers[slot].type !== type) save.towers[slot].br = []; save.towers[slot].type = type; return { ok: true, msg: 'Slot ' + (slot + 1) + ' ditukar ke ' + TOWERS[type].nama }; }
  const c = towerBuildCost(slot); if (save.gold < c) return { ok: false, msg: 'Gold tak cukup (perlu ' + c + ')' };
  save.gold -= c; save.towers[slot] = { type, lvl: 1, br: [] }; return { ok: true, msg: TOWERS[type].nama + ' dibina!' };
}
function upgradeTower(save, slot, n) {
  const t = save.towers[slot]; if (!t) return { ok: false, msg: 'Bina menara dahulu' }; n = n || 1;
  let k = 0, cost = 0; while (k < n && save.gold >= cost + towerUpCost(t.lvl + k)) { cost += towerUpCost(t.lvl + k); k++; }
  if (!k) return { ok: false, msg: 'Gold tak cukup (perlu ' + towerUpCost(t.lvl) + ')' };
  save.gold -= cost; t.lvl += k; return { ok: true, msg: TOWERS[t.type].nama + ' Lv.' + t.lvl };
}

// ---------- Naik semua (belanja gold secara automatik pada pilihan paling murah) ----------
function upgradeOptions(save) {
  const o = [];
  save.team.forEach(h => { if (save.heroes[h]) o.push({ c: upCost(save.heroes[h]), f: () => upgradeHero(save, h, 1) }); });
  [...new Set(save.team.map(h => heroWeapon(save, h)))].forEach(w => { if (save.weapons[w]) o.push({ c: wpnCost(w, save.weapons[w]) * 1.2, real: () => wpnCost(w, save.weapons[w]), f: () => upgradeWeapon(save, w, 1) }); });
  save.towers.forEach((t, i) => { if (t) o.push({ c: towerUpCost(t.lvl) * 1.5, real: () => towerUpCost(t.lvl), f: () => upgradeTower(save, i, 1) }); });
  ['damage', 'wall'].forEach(k => o.push({ c: shopCost(k, save.shop[k]) * 1.1, real: () => shopCost(k, save.shop[k]), f: () => buyShop(save, k) }));
  return o;
}
function upgradeAll(save, budget) {
  let n = 0; const g0 = save.gold, keep = budget == null ? 0 : Math.max(0, g0 - budget);
  for (let k = 0; k < 5000; k++) { const o = upgradeOptions(save).sort((a, b) => a.c - b.c)[0]; if (!o) break; const real = o.real ? o.real() : o.c; if (save.gold - real < keep) break; if (!o.f().ok) break; n++; }
  return { ok: n > 0, n, spent: g0 - save.gold, msg: n ? n + ' naik taraf (−' + fmtNum(g0 - save.gold) + ' gold)' : 'Gold tak cukup untuk naik taraf' };
}
function cheapestUpgrade(save) { const o = upgradeOptions(save).map(x => x.real ? x.real() : x.c); return o.length ? Math.min(...o) : Infinity; }

// ---------- Kunci item & bandingan ----------
function toggleLock(save, uid) { const it = itemByUid(save, uid); if (!it) return { ok: false, msg: 'Item tiada' }; it.lock = !it.lock; return { ok: true, msg: it.lock ? '🔒 Item dikunci' : 'Kunci dibuka' }; }
const ITEM_KEYS = { senjata: [['dmg', '% damage'], ['crit', '% kritikal']], helm: [['crit', '% kritikal'], ['critDmg', '% damage kritikal']], baju: [['hp', '% HP pagar']], tangan: [['rate', '% laju']], but: [['gold', '% gold']], beg: [['drop', '% peluang jatuh']], perisai: [['hp', '% HP pagar'], ['armor', '% perisai']] };
function itemKey(it) { const s = itemStats(it); return it.jenis === 'helm' ? s.crit * 3 + s.critDmg : (s[ITEM_KEYS[it.jenis][0][0]] || 0); }
function compareItem(save, uid, heroId) {
  const it = itemByUid(save, uid); if (!it) return null;
  let cur = null;
  if (it.jenis === 'perisai') { const eq = save.wallEquip.map(u => itemByUid(save, u)); cur = eq.includes(null) ? null : eq.reduce((a, b) => (itemPower(b) < itemPower(a) ? b : a)); }
  else cur = itemByUid(save, (save.equip[heroId] || {})[it.jenis]);
  if (cur && cur.uid === it.uid) return { same: true };
  const a = itemStats(it), b = cur ? itemStats(cur) : {};
  const keys = ITEM_KEYS[it.jenis];
  const diff = keys.map(([k, n]) => ({ k, n, d: (a[k] || 0) - (b[k] || 0) })).filter(x => x.d);
  return { cur, diff, better: itemKey(it) > (cur ? itemKey(cur) : -1) };
}

// ---------- Susun pasukan terbaik ----------
function weaponScore(save, heroId, wid) {
  const prev = save.heroWpn[heroId]; save.heroWpn[heroId] = wid; const st = heroStats(save, heroId, 0), wd = WEAPONS[st.wid]; save.heroWpn[heroId] = prev; if (prev === undefined) delete save.heroWpn[heroId];
  return st.dmg * st.rate * (wd.n || 1) * (1 + Math.min(3, (wd.pierce || 1) - 1) * 0.3) * (wd.splash ? 1.8 : 1) * (wd.chain ? 1 + wd.chain * 0.4 : 1) * (wd.heal ? 0.8 : 1);
}
function bestTeam(save) {
  const own = HERO_ORDER.filter(h => save.heroes[h] && !onExped(save, h)), wpns = Object.keys(save.weapons);
  const score = h => Math.max(weaponScore(save, h, 'batu'), ...wpns.filter(w => canEquip(h, w)).map(w => weaponScore(save, h, w)));
  const pick = own.sort((a, b) => score(b) - score(a)).slice(0, save.slots);
  // doktor/tukang/askar/komander/laser/shotgun memberi aura: kekalkan jika dimiliki dan pasukan belum penuh oleh hero lebih kuat
  save.team = pick;
  const usedW = new Set(); pick.forEach(h => { const best = wpns.filter(w => !usedW.has(w) && canEquip(h, w)).sort((a, b) => weaponScore(save, h, b) - weaponScore(save, h, a))[0]; if (best) { save.heroWpn[h] = best; usedW.add(best); } });
  HERO_ORDER.filter(h => save.heroes[h] && !pick.includes(h)).forEach(h => { if (usedW.has(heroWeapon(save, h))) delete save.heroWpn[h]; }); normalizeWeapons(save);
  const n = autoEquipBest(save);
  return { ok: true, msg: 'Pasukan terbaik: ' + pick.map(h => HEROES[h].nama).join(', ') + (n ? ' (' + n + ' item dipasang)' : '') };
}

// ---------- Jam peranti & sandaran ----------
function clockCheck(save, now) { if (!save.maxNow || now > save.maxNow) { save.maxNow = now; return true; } return now >= save.maxNow - 300000; }
function needBackup(save, now) { return save.best >= 6 && (!save.lastExport || now - save.lastExport > 7 * 86400000); }

// ---------- Formasi ----------
function moveTeam(save, id, dir) {
  const i = save.team.indexOf(id), j = i + dir; if (i < 0 || j < 0 || j >= save.team.length) return { ok: false, msg: 'Tidak boleh dialih' };
  [save.team[i], save.team[j]] = [save.team[j], save.team[i]]; return { ok: true, msg: HEROES[id].nama + ' dialih' };
}
function swapTeam(save, a, b) { const i = save.team.indexOf(a), j = save.team.indexOf(b); if (i < 0 || j < 0 || i === j) return false; [save.team[i], save.team[j]] = [save.team[j], save.team[i]]; return true; }

// ---------- Ganjaran offline ----------
function offlineRewards(save, seconds, rng) {
  const r = { gold: offlineGold(save, seconds), shards: {}, items: [] }; if (!(seconds >= 60)) return r;
  const s = Math.min(seconds, OFFLINE_CAP), nS = Math.floor(s / 900), nI = Math.floor(s / 3600);
  for (let i = 0; i < nS; i++) { const h = randomShardHero(rng); r.shards[h] = (r.shards[h] || 0) + 1; }
  for (let i = 0; i < nI; i++) r.items.push(makeItem(save, rng, Math.min(4, 1 + Math.floor(effBest(save) / 40))));
  return r;
}
function applyOffline(save, r) { save.gold += r.gold; Object.keys(r.shards).forEach(h => addShards(save, h, r.shards[h])); r.items.forEach(it => addItem(save, it)); }

// ---------- Event bermusim (tarikh tetap) ----------
const EVENTS = [
  { id: 'tahunbaru', nama: 'Sambutan Tahun Baru', desc: 'Gold ×1.5 & bunga api', mula: [12, 26], tamat: [1, 7],  gold: 1.5, shard: 1,   hias: 'bungaapi' },
  { id: 'guru',      nama: 'Minggu Hari Guru',    desc: 'Shard jatuh ×2',         mula: [5, 10],  tamat: [5, 22], gold: 1,   shard: 2,   hias: 'guru' },
  { id: 'merdeka',   nama: 'Semangat Merdeka',    desc: 'Gold ×1.5, shard ×1.5 & Jalur Gemilang', mula: [8, 20], tamat: [9, 20], gold: 1.5, shard: 1.5, hias: 'merdeka' },
  { id: 'hujung',    nama: 'Pesta Hujung Minggu', desc: 'Gold ×1.3 setiap Sabtu & Ahad', minggu: true, gold: 1.3, shard: 1, hias: 'pesta' }
];
function inRange(m, d, a, b) { const v = m * 100 + d, s = a[0] * 100 + a[1], e = b[0] * 100 + b[1]; return s <= e ? v >= s && v <= e : v >= s || v <= e; }
function activeEvent(now, force) {
  if (force) return EVENTS.find(e => e.id === force) || null;
  const d = new Date(now), m = d.getMonth() + 1, day = d.getDate(), wd = d.getDay();
  for (const e of EVENTS) { if (e.minggu) { if (wd === 0 || wd === 6) return e; } else if (inRange(m, day, e.mula, e.tamat)) return e; }
  return null;
}
function eventChestAvailable(save, now) { const e = activeEvent(now, save.eventForce); return !!e && save.daily.eventDay !== dayKey(now) + e.id; }
function claimEventChest(save, now, rng) {
  if (!clockCheck(save, now)) return { ok: false, msg: 'Jam peranti nampaknya diundurkan' };
  const e = activeEvent(now, save.eventForce); if (!e) return { ok: false, msg: 'Tiada event aktif' };
  if (!eventChestAvailable(save, now)) return { ok: false, msg: 'Peti event hari ini sudah dituntut' };
  save.daily.eventDay = dayKey(now) + e.id; save.gems += 40; for (let i = 0; i < 12; i++) addShards(save, randomShardHero(rng), 1); stat(save, 'eventChests');
  return { ok: true, msg: 'Peti ' + e.nama + ': +40 gems, +12 shard' };
}

// ---------- Sandaran save ----------
function encodeSave(save) { const j = JSON.stringify(save); return 'ZC5:' + btoa(unescape(encodeURIComponent(j))); }
function decodeSave(code, now) {
  code = String(code || '').trim(); if (!code.startsWith('ZC5:')) throw new Error('Kod save tidak sah (mesti bermula dengan ZC5:)');
  if (code.length > 2 * 1024 * 1024) throw new Error('Kod save terlalu besar');
  let o; try { o = JSON.parse(decodeURIComponent(escape(atob(code.slice(4))))); } catch (e) { throw new Error('Kod save rosak atau tidak lengkap'); }
  if (!o || typeof o !== 'object' || !o.heroes) throw new Error('Kod save tidak mengandungi data game');
  return migrate(o, now);
}

// ---------- Tier hero (10 tahap) ----------
const TIERS = [
  { nama: 'Basic', warna: '#8A96A8', bina: 25,  mult: 1.0, sGem: 10 },
  { nama: 'N',     warna: '#6FAF6A', bina: 30,  mult: 1.15, sGem: 12 },
  { nama: 'N+',    warna: '#4FB06A', bina: 40,  mult: 1.3, sGem: 15 },
  { nama: 'R',     warna: '#3B9BE0', bina: 50,  mult: 1.5, sGem: 20 },
  { nama: 'R+',    warna: '#2F7FD0', bina: 60,  mult: 1.7, sGem: 25 },
  { nama: 'SR',    warna: '#A066E8', bina: 80,  mult: 2.0, sGem: 35 },
  { nama: 'SR+',   warna: '#8A4AD8', bina: 100, mult: 2.3, sGem: 45 },
  { nama: 'SSR',   warna: '#E7A71E', bina: 120, mult: 2.7, sGem: 60 },
  { nama: 'SSR+',  warna: '#F07A2E', bina: 150, mult: 3.1, sGem: 80 },
  { nama: 'UR',    warna: '#E5484D', bina: 200, mult: 3.6, sGem: 100 }
];
const MAX_STARS = 50;
function starCost(k) { return 10 + 5 * (k - 1); }              // shard untuk mencapai bintang ke-k
function starMult(s) { return (1 + 0.1 * s) * Math.pow(1.5, Math.floor(s / 10)); }
// ---------- Hero (rupa, tier, senjata khas, kisah) ----------
const HEROES = {
  pistol:   { nama: 'Pak Usu',       tier: 0, wpn: 'pistol',   baju: '#3B82C4', topi: '#2B3A55', kulit: '#F2C28E', gaya: 'cap',      kisah: 'Pengawal kampung yang tidak pernah lewat. Pistol lamanya sudah 30 tahun berkhidmat.' },
  budak:    { nama: 'Budak Lastik',  tier: 0, wpn: 'lastik',   baju: '#F2B43A', topi: '#5A3A20', kulit: '#E8B07E', gaya: 'rambut',   kisah: 'Juara lastik sekolah. Batu-batu kecilnya lebih tepat daripada pistol.' },
  shotgun:  { nama: 'Kak Long',      tier: 1, wpn: 'shotgun',  baju: '#E0569B', topi: '#7A2350', kulit: '#E8B07E', gaya: 'tudung',   kisah: 'Kakak sulung yang melindungi adik-adiknya dengan senapang patah arwah datuk.' },
  mesingan: { nama: 'Abang Jo',      tier: 1, wpn: 'mesingan', baju: '#E07A2E', topi: '#4A3020', kulit: '#C98E62', gaya: 'bandana',  kisah: 'Mekanik bengkel yang membina mesingannya sendiri daripada alat ganti motosikal.' },
  sniper:   { nama: 'Adik',          tier: 2, wpn: 'sniper',   baju: '#4CAF7A', topi: '#24563B', kulit: '#F5CFA0', gaya: 'topi',     kisah: 'Pendiam tetapi matanya paling tajam. Boleh menembak zombie dari hujung padang.' },
  frost:    { nama: 'Tok Wan',       tier: 2, wpn: 'frost',    baju: '#7FC8E8', topi: '#F1F1F1', kulit: '#E2B48A', gaya: 'ketayap',  kisah: 'Bekas tukang ais batu. Rahsia pistol aisnya hanya diketahui cucunya.' },
  bom:      { nama: 'Mak Cik Siti',  tier: 3, wpn: 'bom',      baju: '#9B6AD0', topi: '#5B3A88', kulit: '#E8B98C', gaya: 'tudung',   kisah: 'Pengusaha kedai mercun yang kini membuat bom untuk mempertahankan kampung.' },
  api:      { nama: 'Cik Mira',      tier: 3, wpn: 'api',      baju: '#E5484D', topi: '#7A1E22', kulit: '#F0C49A', gaya: 'rambut',   kisah: 'Atlet memanah negeri. Anak panahnya dibalut kain berminyak dan dinyalakan.' },
  tukang:   { nama: 'Pak Mat Tukang',tier: 3, wpn: 'gergaji',  baju: '#C98B4E', topi: '#F2C230', kulit: '#C98E62', gaya: 'hardhat',  kisah: 'Tukang rumah yang mengubah gergaji bulatnya menjadi pelontar.' },
  petir:    { nama: 'Uncle Lim',     tier: 4, wpn: 'petir',    baju: '#3A4E8C', topi: '#1E2A4A', kulit: '#F2D0A4', gaya: 'cap',      kisah: 'Juruteknik elektrik yang tahu cara memanggil kilat dari tiang lampu.' },
  doktor:   { nama: 'Doktor Hana',   tier: 4, wpn: 'doktor',   baju: '#F4F7F8', topi: '#2EAE8E', kulit: '#E9BC92', gaya: 'tudung',   kisah: 'Doktor klinik desa. Picagarinya menyembuhkan pagar dan mencederakan zombie.' },
  roket:    { nama: 'Pak Din',       tier: 5, wpn: 'roket',    baju: '#6E7B3A', topi: '#3E4620', kulit: '#C08A5E', gaya: 'helmet',   kisah: 'Bekas askar yang menyimpan pelancar roket dalam stor padi.' },
  racun:    { nama: 'Kak Ros',       tier: 5, wpn: 'racun',    baju: '#5DBB63', topi: '#2F6B33', kulit: '#E3B086', gaya: 'rambut',   kisah: 'Pakar racun serangga ladang. Zombie pun tidak tahan baunya.' },
  koboi:    { nama: 'Koboi Ali',     tier: 5, wpn: 'revolver', baju: '#A86A3A', topi: '#6E4520', kulit: '#E0A878', gaya: 'koboi',    kisah: 'Peminat filem koboi yang benar-benar menjadi koboi bila zombie menyerang.' },
  laser:    { nama: 'Kapten Bakar',  tier: 6, wpn: 'laser',    baju: '#2A2F45', topi: '#E8C547', kulit: '#C9956A', gaya: 'cap',      kisah: 'Kapten kapal angkasa yang terdampar di kampung bersama senjata lasernya.' },
  ninja:    { nama: 'Ninja Amir',    tier: 6, wpn: 'shuriken', baju: '#2B2B3A', topi: '#1A1A24', kulit: '#E8B98C', gaya: 'ninja',    kisah: 'Pelajar silat yang berlatih secara rahsia pada waktu malam.' },
  askar:    { nama: 'Sarjan Rahim',  tier: 7, wpn: 'minigun',  baju: '#4E6B3A', topi: '#2E4220', kulit: '#C08A5E', gaya: 'helmet',   kisah: 'Ketua platun yang tidak pernah berundur. Minigunnya diberi nama Melati.' },
  saintis:  { nama: 'Dr. Lina',      tier: 7, wpn: 'plasma',   baju: '#E8ECF4', topi: '#3B82C4', kulit: '#F2D0A4', gaya: 'goggles',  kisah: 'Saintis universiti yang mencipta senapang plasma untuk mengkaji zombie.' },
  jurutera: { nama: 'Jurutera Wei',  tier: 8, wpn: 'tesla',    baju: '#F2B43A', topi: '#2B3A55', kulit: '#F2D0A4', gaya: 'goggles',  kisah: 'Jurutera loji elektrik. Gegelung Teslanya boleh menyalakan seluruh kampung.' },
  ratu_ais: { nama: 'Ratu Salju',    tier: 8, wpn: 'ais_g',    baju: '#A8E0F8', topi: '#E8F8FF', kulit: '#F5DCC8', gaya: 'mahkota',  kisah: 'Puteri dari kerajaan salju di puncak gunung. Sentuhannya membekukan apa sahaja.' },
  pahlawan: { nama: 'Hang Kilat',    tier: 9, wpn: 'tukul',    baju: '#C8302A', topi: '#F5B82E', kulit: '#C98E62', gaya: 'tengkolok',kisah: 'Pahlawan legenda yang tukulnya memanggil halilintar dari langit.' },
  komander: { nama: 'Komander Zara', tier: 9, wpn: 'railgun',  baju: '#1E2A44', topi: '#C8302A', kulit: '#E0A878', gaya: 'beret',    kisah: 'Ketua pasukan elit anti-zombie. Railgunnya menembusi apa sahaja di laluannya.' }
};
const HERO_ORDER = Object.keys(HEROES);
// 11 hero yang sudah direka khas tersedia terus dalam game; hero lain kekal ikut sistem shard biasa.
const GENERATED_HEROES = ['ninja', 'askar', 'saintis', 'jurutera', 'ratu_ais', 'pahlawan', 'komander', 'pistol', 'budak', 'shotgun', 'mesingan'];
function grantGeneratedHeroes(save) {
  if (save.heroPackV >= 1) return;
  GENERATED_HEROES.forEach(id => { if (!save.heroes[id]) save.heroes[id] = 1; });
  save.heroPackV = 1;
}
const SLOT_COST = { 4: 50, 5: 150, 6: 400 };
const HERO_CHESTS = {
  hero:    { nama: 'Peti Hero',         harga: 50,  shard: 10, minTier: 0, desc: '10 shard hero rawak' },
  legenda: { nama: 'Peti Hero Legenda', harga: 300, shard: 30, minTier: 5, desc: '30 shard hero SR ke atas' }
};
function shardWeight(id) { return 1 / Math.pow(HEROES[id].tier + 1, 1.3); }
function randomShardHero(rng, minTier) {
  const pool = HERO_ORDER.filter(h => HEROES[h].tier >= (minTier || 0)); let tot = 0; pool.forEach(h => tot += shardWeight(h));
  let x = rng() * tot; for (const h of pool) { x -= shardWeight(h); if (x <= 0) return h; } return pool[pool.length - 1];
}

// ---------- Senjata: 12 asal (milik hero) + 20 baharu ----------
// n=peluru serentak, spread, pierce, slow, splash, burn, chain, heal, homing, critB (bonus kritikal)
const WEAPONS = {
  pistol:   { nama: 'Pistol',              desc: 'Seimbang dan stabil',               dmg: 10, rate: 1.6,  range: 340, laras: 16, peluru: '#FFD54A', harga: 0 },
  shotgun:  { nama: 'Senapang Patah',      desc: '3 peluru serentak',                 dmg: 7,  rate: 1.0,  range: 260, laras: 20, peluru: '#FF9EC8', n: 3, spread: 0.22, harga: 0 },
  mesingan: { nama: 'Mesingan',            desc: 'Tembakan sangat laju',              dmg: 4,  rate: 5.0,  range: 300, laras: 22, peluru: '#FFB04A', spread: 0.06, harga: 0 },
  sniper:   { nama: 'Sniper',              desc: 'Tembus 3 zombie',                   dmg: 38, rate: 0.45, range: 560, laras: 26, peluru: '#B6F27A', pierce: 3, harga: 0 },
  frost:    { nama: 'Pistol Ais',          desc: 'Perlahankan zombie',                dmg: 5,  rate: 1.2,  range: 320, laras: 16, peluru: '#9FE6FF', slow: 0.45, harga: 0 },
  bom:      { nama: 'Bom Tangan',          desc: 'Letupan kawasan',                   dmg: 14, rate: 0.7,  range: 300, laras: 10, peluru: '#5A5A5A', splash: 45, harga: 0 },
  api:      { nama: 'Busur Api',           desc: 'Bakar 3 saat',                      dmg: 6,  rate: 1.3,  range: 300, laras: 18, peluru: '#FF6A2B', burn: 1.0, harga: 0 },
  petir:    { nama: 'Tongkat Petir',       desc: 'Kilat lompat ke 3 zombie',          dmg: 12, rate: 0.9,  range: 330, laras: 18, peluru: '#FFF27A', chain: 3, harga: 0 },
  doktor:   { nama: 'Picagari',            desc: 'Baiki pagar 1.5% sesaat',           dmg: 5,  rate: 1.0,  range: 300, laras: 12, peluru: '#7FF0C8', heal: 0.015, harga: 0 },
  roket:    { nama: 'Pelancar Roket',      desc: 'Letupan besar',                     dmg: 40, rate: 0.35, range: 420, laras: 26, peluru: '#FF8A3A', splash: 70, harga: 0 },
  racun:    { nama: 'Penyembur Racun',     desc: 'Racun + perlahan',                  dmg: 4,  rate: 1.1,  range: 320, laras: 18, peluru: '#A6F05A', burn: 0.8, slow: 0.25, harga: 0 },
  laser:    { nama: 'Laser',               desc: 'Tembus semua',                      dmg: 18, rate: 0.8,  range: 600, laras: 24, peluru: '#FF4FD8', pierce: 99, harga: 0 },
  lastik:   { nama: 'Lastik',              desc: 'Murah dan laju',                    dmg: 6,  rate: 2.2,  range: 280, laras: 12, peluru: '#C9A06A', harga: 20 },
  revolver: { nama: 'Revolver',            desc: '+15% peluang kritikal',             dmg: 22, rate: 0.9,  range: 360, laras: 18, peluru: '#FFE07A', critB: 0.15, harga: 40 },
  smg:      { nama: 'SMG',                 desc: 'Laju, sedikit tersebar',            dmg: 5,  rate: 4.0,  range: 290, laras: 18, peluru: '#FFC36A', spread: 0.1, harga: 60 },
  shuriken: { nama: 'Shuriken',            desc: '2 bintang serentak',                dmg: 8,  rate: 2.0,  range: 300, laras: 8,  peluru: '#D8DDE6', n: 2, spread: 0.15, harga: 80 },
  silang:   { nama: 'Busur Silang',        desc: 'Tembus 2 zombie',                   dmg: 20, rate: 0.8,  range: 420, laras: 20, peluru: '#B98A4A', pierce: 2, harga: 100 },
  bumerang: { nama: 'Bumerang',            desc: 'Tembus 4 zombie',                   dmg: 9,  rate: 1.0,  range: 300, laras: 10, peluru: '#E0A050', pierce: 4, harga: 130 },
  lima:     { nama: 'Senapang Lima Laras', desc: '5 peluru serentak',                 dmg: 6,  rate: 0.8,  range: 260, laras: 22, peluru: '#FF8EB8', n: 5, spread: 0.14, harga: 160 },
  gergaji:  { nama: 'Pelontar Gergaji',    desc: 'Tembus 6, perlahankan sedikit',     dmg: 12, rate: 0.9,  range: 320, laras: 20, peluru: '#B8C2CC', pierce: 6, slow: 0.2, harga: 200 },
  minigun:  { nama: 'Minigun',             desc: 'Hujan peluru',                      dmg: 3,  rate: 9.0,  range: 300, laras: 26, peluru: '#FFD27A', spread: 0.12, harga: 240 },
  meriam:   { nama: 'Meriam',              desc: 'Bola besi meletup',                 dmg: 30, rate: 0.4,  range: 380, laras: 24, peluru: '#3A3A3A', splash: 55, harga: 280 },
  tesla:    { nama: 'Gegelung Tesla',      desc: 'Kilat lompat ke 5 zombie',          dmg: 8,  rate: 0.8,  range: 320, laras: 16, peluru: '#8FE8FF', chain: 5, harga: 330 },
  nitrogen: { nama: 'Meriam Nitrogen',     desc: 'Letupan ais, perlahan kuat',        dmg: 6,  rate: 0.8,  range: 320, laras: 22, peluru: '#CFF4FF', slow: 0.6, splash: 35, harga: 380 },
  napalm:   { nama: 'Napalm',              desc: 'Letupan api membakar',              dmg: 6,  rate: 0.6,  range: 320, laras: 22, peluru: '#FF5A1F', burn: 1.5, splash: 40, harga: 440 },
  mortar:   { nama: 'Mortar',              desc: 'Jarak jauh, letupan besar',         dmg: 25, rate: 0.3,  range: 620, laras: 14, peluru: '#6A6A4A', splash: 80, harga: 500 },
  plasma:   { nama: 'Senapang Plasma',     desc: 'Tembus 3, damage tinggi',           dmg: 26, rate: 0.9,  range: 420, laras: 22, peluru: '#7AF0FF', pierce: 3, harga: 580 },
  peluru_p: { nama: 'Peluru Berpandu',     desc: 'Mengejar sasaran, meletup',         dmg: 22, rate: 0.6,  range: 520, laras: 22, peluru: '#FF7A5A', splash: 45, homing: true, harga: 660 },
  tongkat_r:{ nama: 'Tongkat Racun',       desc: 'Racun melompat ke 2 zombie',        dmg: 6,  rate: 1.0,  range: 320, laras: 20, peluru: '#B2F06A', burn: 1.2, chain: 2, harga: 740 },
  ais_g:    { nama: 'Meriam Ais Gergasi',  desc: 'Letupan ais besar',                 dmg: 20, rate: 0.5,  range: 380, laras: 26, peluru: '#B8ECFF', slow: 0.5, splash: 50, harga: 820 },
  railgun:  { nama: 'Railgun',             desc: 'Tembus semua, sangat kuat',         dmg: 60, rate: 0.25, range: 700, laras: 30, peluru: '#9AA8FF', pierce: 99, harga: 900 },
  tukul:    { nama: 'Tukul Halilintar',    desc: 'Letupan + kilat ke 4 zombie',       dmg: 28, rate: 0.4,  range: 360, laras: 14, peluru: '#FFF06A', chain: 4, splash: 30, harga: 1000 }
};
const WEAPON_ORDER = Object.keys(WEAPONS);

// ---------- 50 jenis perisai pagar: 10 bahan × 5 gred ----------
const WALL_MAT = [
  { nama: 'Kayu',     warna: '#C98B4E', gelap: '#8A5A30' }, { nama: 'Buluh',   warna: '#B9C46A', gelap: '#6E7A2E' },
  { nama: 'Bata',     warna: '#C8644A', gelap: '#7E3626' }, { nama: 'Batu',    warna: '#9AA0A8', gelap: '#5E646C' },
  { nama: 'Besi',     warna: '#8C96A4', gelap: '#4E5866' }, { nama: 'Keluli',  warna: '#6E8AA8', gelap: '#3A4E66' },
  { nama: 'Konkrit',  warna: '#B4B0A6', gelap: '#76726A' }, { nama: 'Kristal', warna: '#8FD8F0', gelap: '#3E8EB0' },
  { nama: 'Plasma',   warna: '#C08CF0', gelap: '#6A3EA8' }, { nama: 'Kayangan', warna: '#F2D06A', gelap: '#B08A20' }
];
const WALL_GRADE = [
  { nama: 'Asas',    hp: 1.0, armor: 0,  thorns: 0,    regen: 0 },
  { nama: 'Kukuh',   hp: 1.35, armor: 5, thorns: 0,    regen: 0 },
  { nama: 'Berduri', hp: 1.35, armor: 5, thorns: 0.015, regen: 0 },
  { nama: 'Pemulih', hp: 1.5, armor: 8,  thorns: 0,    regen: 0.008 },
  { nama: 'Agung',   hp: 1.8, armor: 12, thorns: 0.015, regen: 0.008 }
];
const WALLS = [];
WALL_MAT.forEach((m, i) => WALL_GRADE.forEach((g, j) => {
  const k = i * 5 + j;
  WALLS.push({ idx: k, mat: i, grade: j, nama: m.nama + ' ' + g.nama, hp: Math.pow(1.45, i) * g.hp, armor: Math.min(40, g.armor + i * 2), thorns: g.thorns, regen: g.regen, warna: m.warna, gelap: m.gelap });
}));
// ---------- v8.6: ciri bahan, kemahiran aktif, level & koleksi pagar ----------
const MAT_TRAIT = [
  { id: 'kayu',     ikon: '🪵', nama: 'Mudah Dibaiki', desc: 'Semua pemulihan pagar +30%' },
  { id: 'buluh',    ikon: '🎋', nama: 'Lentur',        desc: 'Zombie yang menghentak terpantul ke belakang (bukan boss)' },
  { id: 'bata',     ikon: '🧱', nama: 'Tebal',         desc: 'HP pagar +12%' },
  { id: 'batu',     ikon: '🪨', nama: 'Teguh',         desc: 'Serangan boss −25%' },
  { id: 'besi',     ikon: '⚙', nama: 'Pantul',        desc: 'Pantulkan 20% kerosakan kepada penyerang' },
  { id: 'keluli',   ikon: '🛡', nama: 'Bersalut',      desc: 'Perisai +6% (had 56%)' },
  { id: 'konkrit',  ikon: '🏗', nama: 'Tidak Goyah',   desc: 'HP bawah 35%: perisai +15%' },
  { id: 'kristal',  ikon: '💎', nama: 'Pancaran',      desc: 'Semua damage +6%' },
  { id: 'plasma',   ikon: '⚡', nama: 'Medan Plasma',  desc: 'Zombie yang menyentuh pagar terkena 2% HP/saat (boss 0.3%)' },
  { id: 'kayangan', ikon: '✨', nama: 'Restu',         desc: 'Sekali setiap gelombang: HP bawah 25% → pulih 40%' }
];
const WALL_SKILL = [
  { nama: 'Baiki Segera',     desc: 'Pulih 25% HP pagar' },
  { nama: 'Pancang Buluh',    desc: 'Tolak zombie dekat pagar 70px ke belakang + damage' },
  { nama: 'Tembok Darurat',   desc: 'Perisai +30% selama 6 saat' },
  { nama: 'Runtuhan Batu',    desc: 'Batu jatuh di depan pagar: damage besar + pengsan 1.5 saat' },
  { nama: 'Duri Besi',        desc: 'Duri pagar ×4 (sekurang-kurangnya 3% HP zombie) selama 8 saat' },
  { nama: 'Kubu Keluli',      desc: 'Pagar kebal selama 4 saat' },
  { nama: 'Konkrit Basah',    desc: 'Zombie dekat pagar perlahan 50% selama 6 saat + pulih 10%' },
  { nama: 'Kilauan Kristal',  desc: 'Bekukan zombie dekat pagar 2.5 saat + damage' },
  { nama: 'Kejutan Plasma',   desc: 'Renjatan besar ke semua zombie di barisan depan' },
  { nama: 'Restu Kayangan',   desc: 'Pulih 50% + kebal 3 saat' }
];
const WALL_SKILL_CD = 45, WALL_LV_MAX = 10, WALL_COLL_PCT = 1;
function wallLvOf(save, k) { return Math.max(0, Math.min(WALL_LV_MAX, Math.floor(((save.wallLv || {})[k]) || 0))); }
function wallLvCost(k, lvl) { return Math.floor(Math.max(500, wallCost(k) * 0.6) * Math.pow(1.8, lvl)); }
function wallCollPct(save) { return WALL_COLL_PCT * Math.max(0, (save.wallsOwned || 1) - 1); }
function upgradeWallLv(save, k) {
  if (k == null) k = save.wallActive; if (k < 0 || k >= save.wallsOwned) return { ok: false, msg: 'Pagar belum dimiliki' };
  const l = wallLvOf(save, k); if (l >= WALL_LV_MAX) return { ok: false, msg: 'Level pagar sudah maksimum' };
  const c = wallLvCost(k, l); if (save.gold < c) return { ok: false, msg: 'Gold tak cukup' };
  save.gold -= c; if (!save.wallLv) save.wallLv = {}; save.wallLv[k] = l + 1; return { ok: true, msg: WALLS[k].nama + ' Lv.' + (l + 1) };
}
function wallCost(k) { return k === 0 ? 0 : Math.floor(300 * Math.pow(1.9, k - 1)); }
function wallDesc(w) { const p = ['HP ×' + w.hp.toFixed(2)]; if (w.armor) p.push('perisai ' + w.armor + '%'); if (w.thorns) p.push('duri ' + (w.thorns * 100).toFixed(1) + '% HP zombie'); if (w.regen) p.push('pulih ' + (w.regen * 100).toFixed(1) + '%/s'); return p.join(', '); }

// ---------- Kuasa (power-up) semasa pertempuran ----------
const POWERS = {
  meteor:  { nama: 'Hujan Meteor',   desc: 'Meteor jatuh dan meletup pada zombie',            harga: 0,   cd: 30, dur: 0 },
  ais:     { nama: 'Zaman Ais',      desc: 'Bekukan semua zombie',                            harga: 60,  cd: 40, dur: 4 },
  duri:    { nama: 'Ladang Duri',    desc: 'Duri tumbuh di depan pagar, cedera + perlahan',   harga: 80,  cd: 35, dur: 8 },
  petir:   { nama: 'Ribut Petir',    desc: 'Kilat menyambar zombie berulang kali',            harga: 120, cd: 35, dur: 6 },
  penawar: { nama: 'Penawar Pagar',  desc: 'Pulih 40% pagar + perisai kebal',                 harga: 150, cd: 45, dur: 4 },
  amuk:    { nama: 'Hero Mengamuk',  desc: 'Hero tembak 2.5× laju, damage ×1.5',              harga: 200, cd: 50, dur: 8 },
  emas:    { nama: 'Hujan Emas',     desc: 'Gold ×3 dari setiap zombie',                      harga: 250, cd: 90, dur: 12 },
  lubang:  { nama: 'Lubang Hitam',   desc: 'Sedut zombie ke tengah, kemudian meletup',        harga: 320, cd: 55, dur: 4 },
  bom:     { nama: 'Bom Gergasi',    desc: 'Letupan sangat besar di tengah medan',            harga: 400, cd: 60, dur: 0 }
};
const POWER_ORDER = Object.keys(POWERS);
function powCost(id, lvl) { return Math.floor((150 + POWERS[id].harga * 4) * Math.pow(1.17, lvl - 1)); }
function powLvlMult(lvl) { return (1 + 0.2 * (lvl - 1)) * Math.pow(1.5, Math.floor(lvl / 20)); }
function powCd(id, lvl) { return POWERS[id].cd * Math.max(0.5, 1 - 0.01 * (lvl - 1)); }
function powDur(id, lvl) { return POWERS[id].dur * (1 + Math.min(1, 0.02 * (lvl - 1))); }

// ---------- Statistik & pencapaian (trofi) ----------
function stat(save, k, n) { save.stats[k] = (save.stats[k] || 0) + (n == null ? 1 : n); }
function statMax(save, k, v) { if (!(save.stats[k] >= v)) save.stats[k] = v; }
const TROFI = [
  { nama: 'Gangsa',   warna: '#C08A50', mata: 1, gems: 10 },
  { nama: 'Perak',    warna: '#B8C0CC', mata: 2, gems: 25 },
  { nama: 'Emas',     warna: '#F2C230', mata: 3, gems: 50 },
  { nama: 'Platinum', warna: '#7FD8E0', mata: 4, gems: 100 },
  { nama: 'Berlian',  warna: '#9AA8FF', mata: 5, gems: 200, shard: 20 }
];
const ACH_KAT = ['Pertempuran', 'Hero', 'Senjata', 'Pagar', 'Item', 'Kuasa', 'Ensiklopedia', 'Ekonomi & Masa'];
const S = k => s => s.stats[k] || 0;
const ACH = [
  { id: 'kills',    kat: 0, nama: 'Pemburu Zombie',      desc: 'Tewaskan {n} zombie',                      v: S('kills'),       t: [100, 1000, 10000, 100000, 1000000] },
  { id: 'bosses',   kat: 0, nama: 'Penumpas Boss',       desc: 'Tewaskan {n} boss',                        v: S('bosses'),      t: [1, 10, 50, 250, 1000] },
  { id: 'raid',     kat: 0, nama: 'Penyerbu',            desc: 'Menang {n} pertempuran Serbuan Boss',      v: S('raidWins'),    t: [1, 10, 30, 80, 200] },
  { id: 'projdown', kat: 0, nama: 'Penembak Jatuh',      desc: 'Tembak jatuh {n} peluru boss',             v: S('projDown'),    t: [5, 50, 250, 1000, 5000] },
  { id: 'bossdex',  kat: 6, nama: 'Pemburu Boss Istimewa', desc: 'Tewaskan {n} boss istimewa berbeza',    v: s => bossDexCount(s, 2), t: [5, 25, 75, 150, 360] },
  { id: 'bigboss',  kat: 0, nama: 'Penakluk Boss Besar', desc: 'Tewaskan {n} boss besar (setiap 10 stage)', v: S('bigBosses'),   t: [1, 5, 15, 40, 100] },
  { id: 'stage',    kat: 0, nama: 'Penjelajah',          desc: 'Lepasi stage {n}',                         v: s => s.best - 1,  t: [10, 25, 50, 100, 200] },
  { id: 'perfect',  kat: 0, nama: 'Pagar Tak Tercalar',  desc: 'Menang {n} stage tanpa pagar disentuh',    v: S('perfect'),     t: [1, 5, 25, 100, 500] },
  { id: 'solo',     kat: 0, nama: 'Sendirian Berani',    desc: 'Menang {n} stage dengan hanya 1 hero',     v: S('solo'),        t: [1, 5, 20, 50, 150] },
  { id: 'evokill',  kat: 0, nama: 'Pemburu Evolusi',     desc: 'Tewaskan {n} zombie yang berevolusi',      v: S('evoKills'),    t: [10, 100, 1000, 10000, 100000] },
  { id: 'taps',     kat: 0, nama: 'Jari Pantas',         desc: 'Tekan zombie {n} kali',                    v: S('taps'),        t: [100, 1000, 10000, 50000, 200000] },
  { id: 'heroes',   kat: 1, nama: 'Pengumpul Hero',      desc: 'Bina {n} hero',                            v: s => Object.keys(s.heroes).length, t: [3, 6, 10, 15, 22] },
  { id: 'star1',    kat: 1, nama: 'Bintang Bersinar',    desc: 'Capai {n}★ pada mana-mana hero',           v: s => Math.max(0, ...Object.values(s.stars)), t: [1, 5, 10, 25, 50] },
  { id: 'stars',    kat: 1, nama: 'Galaksi Bintang',     desc: 'Kumpul {n}★ untuk semua hero',             v: s => Object.values(s.stars).reduce((a, b) => a + b, 0), t: [10, 50, 150, 400, 1100] },
  { id: 'tier',     kat: 1, nama: 'Hero Elit',           desc: 'Bina hero tier {tier}',                    v: s => 1 + Math.max(-1, ...Object.keys(s.heroes).map(h => HEROES[h].tier)), t: [4, 6, 8, 9, 10] },
  { id: 'hlvl',     kat: 1, nama: 'Latihan Keras',       desc: 'Naikkan hero ke Lv.{n}',                   v: s => Math.max(0, ...Object.values(s.heroes)), t: [10, 50, 100, 250, 500] },
  { id: 'shards',   kat: 1, nama: 'Pengumpul Shard',     desc: 'Kumpul {n} shard',                         v: S('shardsGot'),   t: [50, 250, 1000, 5000, 20000] },
  { id: 'team6',    kat: 1, nama: 'Pasukan Penuh',       desc: 'Isi {n} slot pasukan',                     v: s => s.team.length, t: [2, 3, 4, 5, 6] },
  { id: 'weapons',  kat: 2, nama: 'Gudang Senjata',      desc: 'Miliki {n} senjata',                       v: s => Object.keys(s.weapons).length, t: [5, 10, 16, 24, 32] },
  { id: 'wlvl',     kat: 2, nama: 'Tukang Senjata',      desc: 'Naikkan senjata ke Lv.{n}',                v: s => Math.max(0, ...Object.values(s.weapons)), t: [10, 25, 50, 100, 250] },
  { id: 'walls',    kat: 3, nama: 'Arkitek Pagar',       desc: 'Bina {n} jenis pagar',                     v: s => s.wallsOwned, t: [3, 10, 20, 35, 50] },
  { id: 'wallshop', kat: 3, nama: 'Kubu Kuat',           desc: 'Naikkan Pagar Besi ke Lv.{n}',             v: s => s.shop.wall, t: [5, 10, 25, 50, 100] },
  { id: 'wallitem', kat: 3, nama: 'Perisai Lengkap',     desc: 'Pasang item perisai {tier2} pada 3 slot pagar', v: s => Math.min(...s.wallEquip.map(u => { const it = itemByUid(s, u); return it ? it.rar + 1 : 0; })), t: [1, 3, 5, 7, 10] },
  { id: 'items',    kat: 4, nama: 'Pemungut Harta',      desc: 'Dapat {n} item',                           v: S('itemsGot'),    t: [10, 100, 500, 2000, 10000] },
  { id: 'rarity',   kat: 4, nama: 'Harta Karun',         desc: 'Dapat item {tier2}',                       v: s => s.stats.maxRar != null ? s.stats.maxRar + 1 : 0, t: [4, 5, 6, 8, 10] },
  { id: 'forge',    kat: 4, nama: 'Tukang Tempa',        desc: 'Tempa item {n} kali',                      v: S('forges'),      t: [10, 100, 500, 2000, 10000] },
  { id: 'sell',     kat: 4, nama: 'Peniaga',             desc: 'Jual {n} item',                            v: S('itemsSold'),   t: [10, 100, 500, 2000, 10000] },
  { id: 'chests',   kat: 4, nama: 'Pembuka Peti',        desc: 'Buka {n} peti',                            v: S('chests'),      t: [5, 25, 100, 500, 2000] },
  { id: 'powers',   kat: 5, nama: 'Ahli Kuasa',          desc: 'Buka {n} kuasa',                           v: s => Object.keys(s.powers).length, t: [2, 4, 6, 8, 9] },
  { id: 'powuse',   kat: 5, nama: 'Kuasa Tanpa Had',     desc: 'Guna kuasa {n} kali',                      v: S('powersUsed'),  t: [10, 100, 500, 2000, 10000] },
  { id: 'ultuse',   kat: 5, nama: 'Detik Ultimate',      desc: 'Lancarkan Ultimate {n} kali',              v: S('ults'),        t: [5, 50, 250, 1000, 5000] },
  { id: 'powlvl',   kat: 5, nama: 'Kuasa Agung',         desc: 'Naikkan kuasa ke Lv.{n}',                  v: s => Math.max(0, ...Object.values(s.powers)), t: [5, 10, 20, 50, 100] },
  { id: 'seen',     kat: 6, nama: 'Ahli Zoologi Zombie', desc: 'Temui {n} spesies zombie',                 v: s => (s.seenZ.match(/1/g) || []).length, t: [25, 100, 250, 500, 1000] },
  { id: 'bases',    kat: 6, nama: 'Kenal Semua Jenis',   desc: 'Temui {n} jenis badan zombie',             v: s => new Set(SPECIES.filter(sp => s.seenZ[sp.id] === '1').map(sp => sp.base)).size, t: [3, 6, 9, 11, 12] },
  { id: 'gold',     kat: 7, nama: 'Jutawan',             desc: 'Kumpul {n} gold',                          v: S('goldEarned'),  t: [1e4, 1e6, 1e9, 1e12, 1e15] },
  { id: 'gems',     kat: 7, nama: 'Pemburu Permata',     desc: 'Kumpul {n} gems daripada pertempuran',     v: S('gemsGot'),     t: [100, 1000, 5000, 25000, 100000] },
  { id: 'boosts',   kat: 7, nama: 'Peminat Booster',     desc: 'Guna booster {n} kali',                    v: S('boosts'),      t: [1, 10, 50, 200, 1000] },
  { id: 'battles',  kat: 7, nama: 'Veteran',             desc: 'Tamatkan {n} pertempuran',                 v: S('battles'),     t: [10, 100, 500, 2000, 10000] },
  { id: 'prestige', kat: 7, nama: 'Kebangkitan',         desc: 'Lakukan Kebangkitan {n} kali',             v: S('prestige'),    t: [1, 3, 10, 25, 50] },
  { id: 'chal',     kat: 0, nama: 'Juara Cabaran',       desc: 'Selesaikan {n} level cabaran',             v: S('chalLevels'),  t: [1, 6, 18, 36, 60] },
  { id: 'combo',    kat: 0, nama: 'Raja Kombo',          desc: 'Capai kombo tekan ×{n}',                   v: S('maxCombo'),    t: [10, 25, 50, 100, 200] },
  { id: 'towers',   kat: 3, nama: 'Jurutera Menara',     desc: 'Kumpul {n} level menara',                  v: s => s.towers.reduce((a, t) => a + (t ? t.lvl : 0), 0), t: [3, 25, 75, 200, 500] },
  { id: 'play',     kat: 7, nama: 'Setia',               desc: 'Bermain selama {jam}',                     v: S('playSec'),     t: [600, 3600, 36000, 180000, 720000] }
];
function achTier(save, a) { return save.achClaimed[a.id] || 0; }
function achValue(save, a) { const v = a.v(save); return isFinite(v) ? v : 0; }
function achReady(save, a) { const k = achTier(save, a); return k < 5 && achValue(save, a) >= a.t[k]; }
function achDesc(a, k) {
  const n = a.t[Math.min(k, 4)];
  return a.desc.replace('{n}', fmtNum(n)).replace('{tier}', TIERS[n - 1] ? TIERS[n - 1].nama : '').replace('{tier2}', RARITY[n - 1] ? RARITY[n - 1].nama : '').replace('{jam}', n < 3600 ? (n / 60) + ' minit' : (n / 3600) + ' jam');
}
function claimAch(save, id, rng) {
  const a = ACH.find(x => x.id === id); if (!a) return { ok: false, msg: 'Tiada' };
  const k = achTier(save, a);
  if (k >= 5) return { ok: false, msg: 'Semua trofi sudah dituntut' };
  if (achValue(save, a) < a.t[k]) return { ok: false, msg: 'Belum dicapai' };
  const T0 = TROFI[k]; save.achClaimed[a.id] = k + 1; save.gems += T0.gems;
  let extra = '';
  if (T0.shard) { const h = randomShardHero(rng || Math.random); addShards(save, h, T0.shard); extra = ', +' + T0.shard + ' shard ' + HEROES[h].nama; }
  return { ok: true, msg: 'Trofi ' + T0.nama + ': ' + a.nama + ' (+' + T0.gems + ' gems' + extra + ')' };
}
function trophyPoints(save) { let p = 0; for (const a of ACH) for (let k = 0; k < achTier(save, a); k++) p += TROFI[k].mata; return p; }
function trophyCounts(save) { const c = [0, 0, 0, 0, 0]; for (const a of ACH) for (let k = 0; k < achTier(save, a); k++) c[k]++; return c; }
function trophyLevel(p) { let lv = 1, need = 10, left = p; while (left >= need) { left -= need; lv++; need = Math.round(need * 1.25); } return { lv, left, need }; }

// ---------- Kedai, booster ----------
const SHOP = {
  damage: { nama: 'Peluru Tajam',   desc: 'Damage semua hero ×1.1 setiap level', mata: 'gold', base: 80,  mult: 1.55 },
  speed:  { nama: 'Picu Laju',      desc: '+6% kelajuan tembak setiap level',   mata: 'gold', base: 100, mult: 1.6 },
  wall:   { nama: 'Pagar Besi',     desc: 'HP pagar ×1.15 setiap level',        mata: 'gold', base: 60,  mult: 1.5 },
  tap:    { nama: 'Jari Sakti',     desc: '+50% damage tekan setiap level',     mata: 'gold', base: 50,  mult: 1.5 },
  jariApi: { nama: 'Jari Api',       desc: 'Radius tekanan +8 piksel setiap level', mata: 'gold', base: 120, mult: 1.7 },
  kombo:  { nama: 'Kombo Kuat',     desc: 'Kombo kekal +0.1 saat & bonus maksimum +10%', mata: 'gold', base: 150, mult: 1.65 },
  magnet: { nama: 'Magnet Syiling', desc: '+15% gold setiap level',             mata: 'gems', base: 15,  mult: 1.4 },
  luck:   { nama: 'Tangan Bertuah', desc: 'Lebih banyak item & item lebih jarang', mata: 'gems', base: 20, mult: 1.45 }
};
const SHOP_ORDER = Object.keys(SHOP);
const BOOSTS = {
  gold:  { nama: '2× Gold',     desc: 'Gold berganda',    harga: 25, minit: 10 },
  dmg:   { nama: '2× Damage',   desc: 'Damage berganda',  harga: 25, minit: 10 },
  speed: { nama: 'Picu Turbo',  desc: 'Tembak +50% laju', harga: 20, minit: 10 },
  drop:  { nama: 'Magnet Item', desc: 'Peluang item ×3',  harga: 30, minit: 10 }
};
const BOOST_ORDER = Object.keys(BOOSTS);

// ---------- Item: 10 tahap kejarangan, 3 jenis ----------
const RARITY = [
  { nama: 'Biasa',      warna: '#8A96A8', mult: 1,    p: 50 },
  { nama: 'Luar Biasa', warna: '#4FB06A', mult: 1.3,  p: 22 },
  { nama: 'Jarang',     warna: '#3B9BE0', mult: 1.7,  p: 13 },
  { nama: 'Epik',       warna: '#A066E8', mult: 2.3,  p: 7 },
  { nama: 'Legenda',    warna: '#E7A71E', mult: 3.1,  p: 4 },
  { nama: 'Mitos',      warna: '#E5484D', mult: 4.2,  p: 2 },
  { nama: 'Purba',      warna: '#2FB8A8', mult: 5.6,  p: 1 },
  { nama: 'Dewa',       warna: '#F07AC0', mult: 7.5,  p: 0.55 },
  { nama: 'Kosmik',     warna: '#5A6CF0', mult: 10,   p: 0.25 },
  { nama: 'Abadi',      warna: '#F0F0F0', mult: 14,   p: 0.08 }
];
const ITEM_NAMES = {
  senjata:  ['Laras', 'Peluru', 'Picu', 'Teropong', 'Muncung', 'Pemetik'],
  helm:     ['Topi Keledar', 'Ketopong', 'Topi Besi', 'Serban Perang', 'Helmet Taktikal', 'Mahkota Perang'],
  baju:     ['Rompi', 'Baju Besi', 'Jaket Kalis', 'Perisai Dada', 'Baju Rantai', 'Jubah Pahlawan'],
  tangan:   ['Sarung Tangan', 'Gelang Kuasa', 'Sarung Besi', 'Cekak Tangan', 'Sarung Kulit', 'Tangan Gergasi'],
  but:      ['But', 'Kasut Kilat', 'But Besi', 'Sepatu Angin', 'But Kulit', 'Kasut Pahlawan'],
  beg:      ['Beg Galas', 'Uncang', 'Beg Kulit', 'Peti Galas', 'Beg Ajaib', 'Bekas Harta'],
  perisai:  ['Paku', 'Plat', 'Kawat', 'Simen', 'Rantai Pagar', 'Tiang']
};
const HERO_SLOTS = ['senjata', 'helm', 'baju', 'tangan', 'but', 'beg'];
const SLOT_NAMA = { senjata: 'Senjata', helm: 'Topi keledar', baju: 'Baju perisai', tangan: 'Sarung tangan', but: 'But', beg: 'Beg', perisai: 'Perisai pagar' };
const ITEM_JENIS = ['senjata', 'helm', 'baju', 'tangan', 'but', 'beg', 'perisai'];
const JENIS_W = [18, 13, 13, 13, 13, 13, 17];   // peluang jenis item (%)
function rollJenis(rng) { let x = rng() * 100; for (let i = 0; i < ITEM_JENIS.length; i++) { x -= JENIS_W[i]; if (x <= 0) return ITEM_JENIS[i]; } return 'perisai'; }
// aksesori lama → slot baharu: Azimat→Beg Ajaib, Gelang→Gelang Kuasa, Topi→Topi Keledar, But→But, Rantai→Baju Rantai, Sarung Tangan→Sarung Tangan
const AKS_MAP = [['beg', 4], ['tangan', 1], ['helm', 0], ['but', 0], ['baju', 4], ['tangan', 0]];
const PITY_N = 30;
const RAR_SUFFIX = ['Usang', 'Kemas', 'Kukuh', 'Berkilau', 'Diraja', 'Sakti', 'Purba', 'Dewata', 'Kosmik', 'Abadi'];
const CHESTS = {
  kayu:  { nama: 'Peti Kayu',  mata: 'gold', minRar: 0, desc: '1 item rawak' },
  emas:  { nama: 'Peti Emas',  mata: 'gems', harga: 30,  minRar: 2, desc: '1 item, sekurang-kurangnya Jarang. Mitos dijamin setiap ' + PITY_N + ' peti' },
  mitos: { nama: 'Peti Mitos', mata: 'gems', harga: 150, minRar: 5, desc: '1 item, sekurang-kurangnya Mitos' },
  abadi: { nama: 'Peti Dewa', mata: 'gems', harga: 800, minRar: 7, desc: '1 item, sekurang-kurangnya Dewa' }
};
function chestCost(id, best) { return id === 'kayu' ? Math.floor(150 * Math.pow(1.17, best - 1)) : CHESTS[id].harga; }

// ---------- 1000 spesies zombie: 12 badan × 12 elemen × 7 kelengkapan ----------
const ZBASE = [
  { id: 'biasa',     nama: 'Biasa',     stage: 1,  sifat: [],            desc: 'Berjalan perlahan ke arah pagar.' },
  { id: 'gemuk',     nama: 'Gemuk',     stage: 1,  sifat: [],            desc: 'Lambat tetapi tebal dan kuat.' },
  { id: 'laju',      nama: 'Laju',      stage: 2,  sifat: [],            desc: 'Kecil dan pantas berlari.' },
  { id: 'topi',      nama: 'Pekerja',   stage: 4,  sifat: [],            desc: 'Memakai topi keselamatan kuning.' },
  { id: 'kesatria',  nama: 'Kesatria',  stage: 6,  sifat: ['perisai'],   desc: 'Memakai baju besi, menerima kurang damage.' },
  { id: 'peludah',   nama: 'Peludah',   stage: 8,  sifat: ['penembak'],  desc: 'Meludah asid ke pagar dari jauh.' },
  { id: 'beku',      nama: 'Pembeku',   stage: 10, sifat: ['pembeku'],   desc: 'Hawa sejuknya memperlahankan tembakan hero.' },
  { id: 'hantu',     nama: 'Hantu',     stage: 12, sifat: ['hantu'],     desc: 'Separuh lutsinar, kadang-kadang peluru tembus tanpa kena.' },
  { id: 'pengebom',  nama: 'Pengebom',  stage: 14, sifat: ['pengebom'],  desc: 'Meletupkan diri bila sampai di pagar.' },
  { id: 'penyembuh', nama: 'Penyembuh', stage: 16, sifat: ['penyembuh'], desc: 'Memulihkan zombie lain di sekelilingnya.' },
  { id: 'melompat',  nama: 'Pelompat',  stage: 18, sifat: ['melompat'],  desc: 'Melompat jauh ke hadapan setiap beberapa saat.' },
  { id: 'gergasi',   nama: 'Gergasi',   stage: 20, sifat: [],            desc: 'Sangat besar, perlahan dan sukar dibunuh.' }
];
const ZELEM = [
  { nama: 'Hijau',   tint: null,      hp: 1,    spd: 1,    dmg: 1,   gold: 1,   sifat: [] },
  { nama: 'Lumut',   tint: '#7AA85A', hp: 1.1,  spd: 1,    dmg: 1,   gold: 1.05, sifat: [] },
  { nama: 'Pucat',   tint: '#C8D0B8', hp: 1,    spd: 1.12, dmg: 1,   gold: 1.05, sifat: [] },
  { nama: 'Busuk',   tint: '#8A9A40', hp: 1,    spd: 1,    dmg: 1.2, gold: 1.1, sifat: [] },
  { nama: 'Api',     tint: '#E07A40', hp: 1.05, spd: 1.05, dmg: 1.1, gold: 1.15, sifat: ['kebal_api'] },
  { nama: 'Ais',     tint: '#88C8E8', hp: 1.1,  spd: 0.95, dmg: 1,   gold: 1.15, sifat: ['kebal_ais'] },
  { nama: 'Racun',   tint: '#9AD040', hp: 1.05, spd: 1,    dmg: 1,   gold: 1.15, sifat: ['pemulih'] },
  { nama: 'Elektrik',tint: '#E8D040', hp: 1,    spd: 1.05, dmg: 1.1, gold: 1.2, sifat: ['pecut'] },
  { nama: 'Logam',   tint: '#9AA0A8', hp: 1.15, spd: 0.95, dmg: 1,   gold: 1.2, sifat: ['perisai'] },
  { nama: 'Bayang',  tint: '#5A5070', hp: 1,    spd: 1.05, dmg: 1.1, gold: 1.25, sifat: ['hantu'] },
  { nama: 'Kristal', tint: '#B8A0F0', hp: 1.3,  spd: 1,    dmg: 1,   gold: 1.35, sifat: [] },
  { nama: 'Darah',   tint: '#B04048', hp: 1.1,  spd: 1.05, dmg: 1.15, gold: 1.3, sifat: ['pembelah'] }
];
const ZGEAR = [
  { id: 'tiada',   nama: '',                 hp: 1,    spd: 1,    gold: 1,   sifat: [] },
  { id: 'keledar', nama: 'Bertopi Keledar',  hp: 1.15, spd: 1,    gold: 1.1, sifat: [] },
  { id: 'besi',    nama: 'Berbaju Besi',     hp: 1.1,  spd: 0.95, gold: 1.15, sifat: ['perisai'] },
  { id: 'perisai', nama: 'Berperisai Kayu',  hp: 1.25, spd: 0.95, gold: 1.15, sifat: [] },
  { id: 'tong',    nama: 'Bertong',          hp: 1.45, spd: 0.85, gold: 1.2, sifat: [] },
  { id: 'mahkota', nama: 'Bermahkota',       hp: 1.1,  spd: 1,    gold: 1.6, sifat: [] },
  { id: 'bom',     nama: 'Berbom',           hp: 1,    spd: 1.05, gold: 1.2, sifat: ['pengebom'] }
];
const SPECIES = (() => {
  const all = [];
  ZBASE.forEach((b, bi) => ZELEM.forEach((e, ei) => ZGEAR.forEach((g, gi) => {
    all.push({ base: b.id, bi, ei, gi, score: b.stage * 3 + ei * 2.2 + gi * 2.6 + (bi * 7 + ei * 3 + gi * 5) % 4 * 0.1 });
  })));
  all.sort((a, b) => a.score - b.score || a.bi - b.bi || a.ei - b.ei || a.gi - b.gi);
  return all.slice(0, 1000).map((s, i) => {
    const b = ZBASE[s.bi], e = ZELEM[s.ei], g = ZGEAR[s.gi];
    const sifat = [...new Set([...b.sifat, ...e.sifat, ...g.sifat])];
    return { id: i, base: s.base, ei: s.ei, gi: s.gi, stage: Math.max(b.stage, Math.ceil((i + 1) / 4)),
      nama: 'Zombi ' + b.nama + (e.nama !== 'Hijau' ? ' ' + e.nama : '') + (g.nama ? ' ' + g.nama : ''),
      hp: e.hp * g.hp, spd: e.spd * g.spd, dmg: e.dmg, gold: e.gold * g.gold, sifat };
  });
})();
const SPECIES_BY_BASE = {}; SPECIES.forEach(s => { (SPECIES_BY_BASE[s.base] = SPECIES_BY_BASE[s.base] || []).push(s); });
function speciesDesc(sp) {
  const b = ZBASE.find(x => x.id === sp.base), parts = [b.desc];
  if (sp.ei) parts.push('Elemen ' + ZELEM[sp.ei].nama.toLowerCase() + '.');
  if (sp.gi) parts.push(ZGEAR[sp.gi].nama.replace(/^Ber/, 'Memakai ').replace('Memakai topi', 'Memakai topi').toLowerCase().replace(/^memakai/, 'Memakai') + '.');
  return parts.join(' ');
}
function pickSpecies(base, stage, rng) {
  const list = (SPECIES_BY_BASE[base] || []).filter(s => s.stage <= stage);
  if (!list.length) return null;
  if (rng() < 0.6) { const recent = list.slice(-10); return recent[Math.floor(rng() * recent.length)]; }
  return list[Math.floor(rng() * list.length)];
}

// ---------- Zombie, evolusi & stage ----------
const ZTYPES = {
  biasa: { hp: 20,  spd: 28, dmg: 8,  gold: 3,   r: 15, kulit: '#8DC95B' },
  laju:  { hp: 12,  spd: 55, dmg: 6,  gold: 4,   r: 12, kulit: '#C9D94F' },
  gemuk: { hp: 70,  spd: 16, dmg: 18, gold: 9,   r: 21, kulit: '#5FA25B' },
  topi:  { hp: 45,  spd: 24, dmg: 12, gold: 7,   r: 16, kulit: '#9CC77A' },
  kesatria:  { hp: 60,  spd: 20, dmg: 14, gold: 9,  r: 17, kulit: '#8FB070' },
  peludah:   { hp: 30,  spd: 26, dmg: 10, gold: 7,  r: 15, kulit: '#A8D060' },
  beku:      { hp: 35,  spd: 24, dmg: 9,  gold: 8,  r: 15, kulit: '#9FD8C8' },
  hantu:     { hp: 25,  spd: 32, dmg: 8,  gold: 8,  r: 14, kulit: '#C8E0D8' },
  pengebom:  { hp: 28,  spd: 30, dmg: 10, gold: 8,  r: 15, kulit: '#B8C060' },
  penyembuh: { hp: 32,  spd: 22, dmg: 6,  gold: 9,  r: 15, kulit: '#A0D890' },
  melompat:  { hp: 26,  spd: 26, dmg: 9,  gold: 8,  r: 13, kulit: '#C0D870' },
  gergasi:   { hp: 160, spd: 13, dmg: 26, gold: 20, r: 26, kulit: '#6E9A58' },
  boss:  { hp: 380, spd: 12, dmg: 30, gold: 120, r: 36, kulit: '#8C6BC2' }
};
const BOSS_COLORS = ['#8C6BC2', '#C25E6B', '#4E8FB8', '#B88A3E', '#3E9E86'];
const EVO_NAMES = ['', 'I', 'II', 'III', 'IV'];
const EVO_COLORS = ['', '#7CFF7C', '#5AC8FF', '#C27CFF', '#FF5A5A'];
const TRAITS = {
  perisai:   { nama: 'Berperisai',  desc: 'Terima 35% kurang damage fizikal',  stage: 3,  huruf: 'P', warna: '#9AA0A8' },
  pemulih:   { nama: 'Pemulih',     desc: 'Pulih 3% HP sesaat',                stage: 6,  huruf: '+', warna: '#4FD07A' },
  pecut:     { nama: 'Pecut',       desc: 'Bergerak 50% lebih laju',           stage: 9,  huruf: '»', warna: '#F2C230' },
  kebal_ais: { nama: 'Kebal Ais',   desc: 'Tidak boleh diperlahankan',         stage: 12, huruf: '❄', warna: '#8FE0FF' },
  kebal_api: { nama: 'Kebal Api',   desc: 'Tidak terbakar atau beracun',       stage: 15, huruf: '♨', warna: '#FF8A3A' },
  pembelah:  { nama: 'Pembelah',    desc: 'Pecah jadi 2 zombie kecil bila mati', stage: 18, huruf: '⑂', warna: '#B07CE0' },
  penembak:  { nama: 'Penembak',    desc: 'Serang pagar dari jauh',            stage: 22, huruf: '➶', warna: '#E5484D' },
  pembeku:   { nama: 'Pembeku',     desc: 'Memperlahankan tembakan hero',      stage: 26, huruf: '✻', warna: '#5AC8FF' },
  hantu:     { nama: 'Hantu',       desc: '25% peluang mengelak peluru',       stage: 30, huruf: '◌', warna: '#D8E0F0' },
  pengebom:  { nama: 'Pengebom',    desc: 'Meletup di pagar (5× damage)',      stage: 34, huruf: '✹', warna: '#F2A33A' },
  penyembuh: { nama: 'Penyembuh',   desc: 'Pulihkan zombie berdekatan',        stage: 38, huruf: '✚', warna: '#7FF0C8' },
  melompat:  { nama: 'Pelompat',    desc: 'Melompat ke hadapan',               stage: 42, huruf: '⤒', warna: '#C0D870' },
  perisai_m: { nama: 'Perisai Magis', desc: 'Terima 35% kurang damage magis',   stage: 20, huruf: 'M', warna: '#B48CFF' }
};
const TRAIT_ORDER = Object.keys(TRAITS);
const EVO_TIME = 6;
function maxEvo(stage) { return Math.min(4, 1 + Math.floor(stage / 10)); }
function traitsFor(stage) { return TRAIT_ORDER.filter(t => TRAITS[t].stage <= stage); }

const BIOMES = ['Kampung', 'Pekan', 'Sekolah', 'Pasar Malam', 'Ladang Sawit', 'Pantai', 'Hutan Simpan', 'Kilang', 'Kota Hantu', 'Gunung Berapi'];
const SUASANA = ['Siang', 'Senja', 'Malam', 'Hujan', 'Kabus'];
// tempat diputar ikut suasana supaya stage boss (10, 20, 30…) berlaku di tempat berbeza
const BACKGROUNDS = []; SUASANA.forEach((s, si) => BIOMES.forEach((b0, k) => { const bi = (k + si) % BIOMES.length, b = BIOMES[bi]; BACKGROUNDS.push({ bi, si, nama: b + (si ? ' ' + (b === 'Pasar Malam' && s === 'Malam' ? 'Tengah Malam' : s) : '') }); }));
function bgIndex(n) { return (n - 1) % BACKGROUNDS.length; }
function stageName(n) { const k = Math.floor((n - 1) / BACKGROUNDS.length); return BACKGROUNDS[bgIndex(n)].nama + (k ? ' ' + (k + 1) : ''); }
function isBigBoss(stage) { return stage % 10 === 0; }
const HP_G = 1.44, GOLD_G = 1.17;
function stageMult(stage) { return Math.pow(HP_G, stage - 1); }
function earlyEase(stage) { return stage >= 10 ? 1 : 0.5 + 0.05 * stage; }   // stage 1–9 lebih mudah untuk pemain baharu
function wavesFor(stage) { return stage <= 10 ? 5 : WAVES_PER_STAGE; }
// ---------- v8.4: 5 mod kesukaran (setiap mod ada kemajuan stage sendiri) ----------
// off = anjakan stage: zombie & gold di stage N mod ini sama dengan Normal stage N+off
const DIFFS = [
  { id: 'normal', nama: 'Normal',      ikon: '🙂', warna: '#4CAF7A', off: 0,  spd: 1,    gems: 1,   rar: 0, evo: 0, desc: 'Pengembaraan biasa' },
  { id: 'hard',   nama: 'Hard',        ikon: '😠', warna: '#F2B43A', off: 15, spd: 1.08, gems: 1.5, rar: 1, evo: 0, desc: 'Zombie lebih kuat & laju. Tiada item Biasa' },
  { id: 'ngeri',  nama: 'Mimpi Ngeri', ikon: '😱', warna: '#E07A2E', off: 35, spd: 1.16, gems: 2,   rar: 2, evo: 1, desc: 'Zombie lahir berevolusi. Item Jarang ke atas' },
  { id: 'neraka', nama: 'Neraka',      ikon: '🔥', warna: '#E5484D', off: 60, spd: 1.24, gems: 3,   rar: 3, evo: 1, desc: 'Untuk pasukan terkuat. Item Epik ke atas' },
  { id: 'abadi',  nama: 'Abadi',       ikon: '💀', warna: '#A066E8', off: 90, spd: 1.32, gems: 4,   rar: 4, evo: 2, desc: 'Cabaran muktamad. Item Legenda ke atas' }
];
const DIFF_BY = {}; DIFFS.forEach(d => { DIFF_BY[d.id] = d; });
const MODE_UNLOCK = 30;   // tamatkan stage 30 dalam mod sebelum untuk membuka mod seterusnya
function diffOf(save) { return DIFF_BY[save && save.mode] || DIFFS[0]; }
function modeBest(save, id) { return id === (save.mode || 'normal') ? save.best : ((save.modeProg || {})[id] || {}).best || 1; }
function modeUnlocked(save, id) { const i = DIFFS.findIndex(d => d.id === id); if (i < 0) return false; return i === 0 || modeBest(save, DIFFS[i - 1].id) > MODE_UNLOCK; }
// stage berkesan tertinggi merentas semua mod (untuk gold idle/offline, level item, cabaran)
function effBest(save) { const cur = save.mode || 'normal', P = save.modeProg || {}; return Math.max(...DIFFS.filter(d => d.id === cur || P[d.id]).map(d => modeBest(save, d.id) + (modeBest(save, d.id) > 1 || d.id === 'normal' ? d.off : 0))); }
function switchMode(save, id) {
  const d = DIFF_BY[id]; if (!d) return { ok: false, msg: 'Mod tidak sah' };
  const cur = save.mode || 'normal'; if (id === cur) return { ok: true, msg: 'Mod ' + d.nama };
  if (!modeUnlocked(save, id)) { const i = DIFFS.indexOf(d); return { ok: false, msg: '🔒 Tamatkan stage ' + MODE_UNLOCK + ' dalam mod ' + DIFFS[i - 1].nama + ' dahulu' }; }
  save.modeProg = save.modeProg || {}; save.modeProg[cur] = { best: save.best, stage: save.stage, cleared: save.cleared.slice() };
  const p = save.modeProg[id] || { best: 1, stage: 1, cleared: [] }; delete save.modeProg[id];
  save.best = p.best; save.stage = Math.min(p.best, p.stage); save.cleared = p.cleared.slice(); save.mode = id;
  return { ok: true, msg: d.ikon + ' Mod ' + d.nama + ' · stage ' + save.stage };
}
function zombieStats(type, stage, wave, off) {
  const big = type === 'boss' && isBigBoss(stage), s = stage + (off || 0), z = ZTYPES[type], m = earlyEase(s) * stageMult(s) * (1 + 0.06 * (wave - 1)) * (big ? 2 : 1);
  return {
    hp: Math.round(z.hp * m), spd: z.spd * Math.min(1.6, 1 + 0.015 * (s - 1)),
    dmg: Math.round(z.dmg * Math.pow(1.12, s - 1)),
    gold: Math.max(1, Math.round(z.gold * Math.pow(GOLD_G, s - 1) * (1 + 0.05 * (wave - 1)) * (big ? 3 : 1)))
  };
}
function waveComposition(stage, wave) {
  if (wave === WAVES_PER_STAGE) { const l = Array(3 + Math.min(stage, 12)).fill('biasa'); l.splice(Math.floor(l.length / 2), 0, 'boss'); return l; }
  const n = Math.min(40, 5 + wave + stage * 2), list = [];
  for (let i = 0; i < n; i++) {
    if (stage >= 2 && i % 4 === 3) list.push('laju');
    else if (wave >= 5 && i % 6 === 5) list.push('gemuk');
    else if (stage >= 4 && i % 5 === 2) list.push('topi');
    else if (stage >= 6 && i % 7 === 6) { const av = ZBASE.filter(b => b.stage <= stage && b.stage >= 6); list.push(av[(i + wave + stage) % av.length].id); }
    else list.push('biasa');
  }
  return list;
}

// ---------- Formula ----------
function upCost(lvl) { return Math.floor(25 * Math.pow(1.13, lvl - 1)); }
function upCostN(lvl, n) { let t = 0; for (let i = 0; i < n; i++) t += upCost(lvl + i); return t; }
function wpnCost(id, lvl) { return Math.floor((60 + WEAPONS[id].harga) * Math.pow(1.16, lvl - 1)); }
function wpnLvlMult(lvl) { return (1 + 0.1 * (lvl - 1)) * Math.pow(1.6, Math.floor(lvl / 20)); }
function shopCost(id, lvl) { const s = SHOP[id]; return Math.floor(s.base * Math.pow(s.mult, lvl)); }
function heroLvlMult(lvl) { return (1 + 0.12 * (lvl - 1)) * Math.pow(2, Math.floor(lvl / 25)); }
function boostOn(save, id, now) { return (save.boost[id] || 0) > now; }
function goldMult(save, now) { const ev = now || save.eventForce ? activeEvent(now, save.eventForce) : null; return (ev ? ev.gold : 1) * rohMult(save) * (1 + 0.15 * save.shop.magnet) * (boostOn(save, 'gold', now) ? 2 : 1); }
function firstPassGems(stage) { return 20 + 5 * Math.min(stage, 40) + (isBigBoss(stage) ? 25 : 0); }
function idleRate(best) { return 0.24 * best * Math.pow(GOLD_G, best - 1); }
function offlineGold(save, seconds) { if (!(seconds >= 60)) return 0; return Math.floor(Math.min(seconds, OFFLINE_CAP) * idleRate(effBest(save)) * (1 + 0.15 * save.shop.magnet)); }

function itemPower(it) { return RARITY[it.rar].mult * Math.pow(1.07, it.ilvl - 1); }
// ---------- Stat sampingan item (Legenda+ : 1, Mitos/Purba : 2, Dewa+ : 3) ----------
const SUBSTATS = {
  boss:    { nama: 'damage boss',     base: 6 },
  pen:     { nama: 'tembus perisai',  base: 5 },
  acc:     { nama: 'ketepatan',       base: 6 },
  critDmg: { nama: 'damage kritikal', base: 8 },
  dmg:     { nama: 'damage',          base: 4 },
  rate:    { nama: 'laju tembak',     base: 3 },
  gold:    { nama: 'gold',            base: 6 },
  drop:    { nama: 'peluang jatuh',   base: 3 }
};
const SUB_KEYS = Object.keys(SUBSTATS);
function subCount(rar) { return rar >= 7 ? 3 : rar >= 5 ? 2 : rar >= 4 ? 1 : 0; }
function rollSubs(jenis, rar, seed) {
  if (jenis === 'perisai') return [];
  const r = mulberry((seed >>> 0) || 1), keys = SUB_KEYS.slice(), out = [];
  for (let i = 0; i < subCount(rar); i++) { const k = keys.splice(Math.floor(r() * keys.length), 1)[0]; out.push({ k, q: Math.round((0.7 + 0.6 * r()) * 100) / 100 }); }
  return out;
}
function subValue(it, s) { return Math.round(SUBSTATS[s.k].base * s.q * (1 + 0.25 * (it.rar - 4)) * (1 + 0.01 * (it.ilvl - 1)) * 10) / 10; }
function itemSubs(it) { return (it.sub || []).filter(s => SUBSTATS[s.k]).map(s => ({ k: s.k, v: subValue(it, s), nama: SUBSTATS[s.k].nama })); }
function itemStats(it) {
  const p = itemPower(it), rm = RARITY[it.rar].mult;
  if (it.jenis === 'senjata') return { dmg: Math.round(15 * p), crit: it.rar >= 3 ? Math.min(50, 3 * it.rar + Math.floor(it.ilvl / 10)) : 0 };
  if (it.jenis === 'helm') return { crit: Math.min(40, 2 + 2 * it.rar + Math.floor(it.ilvl / 15)), critDmg: Math.round(10 * rm + 0.5 * (it.ilvl - 1)) };
  if (it.jenis === 'baju') return { hp: Math.round(6 * p) };
  if (it.jenis === 'tangan') return { rate: Math.round(Math.min(150, 4 * rm + 0.4 * (it.ilvl - 1))) };
  if (it.jenis === 'but') return { gold: Math.round(8 * rm + 0.6 * (it.ilvl - 1)) };
  if (it.jenis === 'beg') return { drop: Math.round(Math.min(100, 5 * rm + 0.3 * (it.ilvl - 1))) };
  return { hp: Math.round(20 * p), armor: Math.min(25, Math.round(1.5 * rm + 0.05 * it.ilvl)), thorns: it.rar >= 5 ? Math.min(3, 0.5 * (it.rar - 4)) : 0, regen: it.rar >= 4 ? Math.min(1, 0.1 * (it.rar - 3)) : 0 };
}
function itemName(it) { return ITEM_NAMES[it.jenis][it.base % 6] + ' ' + RAR_SUFFIX[it.rar] + ' +' + it.ilvl; }
function forgeCost(it) { return Math.floor(40 * RARITY[it.rar].mult * Math.pow(1.11, it.ilvl)); }
function sellValue(it) { return Math.floor(12 * RARITY[it.rar].mult * Math.pow(1.1, it.ilvl)); }
function itemDesc(it) {
  const s = itemStats(it);
  if (it.jenis === 'senjata') return '+' + s.dmg + '% damage' + (s.crit ? ', ' + s.crit + '% kritikal' : '');
  if (it.jenis === 'helm') return '+' + s.crit + '% kritikal, +' + s.critDmg + '% damage kritikal';
  if (it.jenis === 'baju') return '+' + s.hp + '% HP pagar';
  if (it.jenis === 'tangan') return '+' + s.rate + '% laju tembak';
  if (it.jenis === 'but') return '+' + s.gold + '% gold';
  if (it.jenis === 'beg') return '+' + s.drop + '% peluang item & shard jatuh';
  return '+' + s.hp + '% HP pagar, perisai ' + s.armor + '%' + (s.thorns ? ', duri ' + s.thorns + '%' : '') + (s.regen ? ', pulih ' + s.regen.toFixed(1) + '%/s' : '');
}
function itemDescFull(it) { const subs = itemSubs(it); return itemDesc(it) + (subs.length ? ' · ' + subs.map(s => '+' + s.v + '% ' + s.nama).join(', ') : '') + (it.jenis !== 'perisai' ? ' · Set ' + ITEM_SETS[it.base % 6].nama : ''); }
const itemByUid = (save, uid) => (uid == null ? null : save.items.find(x => x.uid === uid) || null);

function teamBagDrop(save) { let d = 0; save.team.forEach(h => { const e = save.equip[h] || {}; HERO_SLOTS.forEach(s => { const it = itemByUid(save, e[s]); if (!it) return; if (s === 'beg') d += itemStats(it).drop; itemSubs(it).forEach(x => { if (x.k === 'drop') d += x.v; }); }); }); return Math.min(200, d); }
function heroWeapon(save, id) { const w = save.heroWpn[id]; return WEAPONS[w] && save.weapons[w] && canEquip(id, w) ? w : 'batu'; }
// ---------- Kostum khas setiap hero (2 kostum: SR & UR) ----------
const SKIN_THEMES = [
  { id: 'pahlawan', nama: 'Pahlawan',   baju: '#B8322A', topi: '#F2C230', gaya: 'tengkolok', stat: 'dmg' },
  { id: 'angkasa',  nama: 'Angkasawan', baju: '#E8ECF4', topi: '#FFFFFF', gaya: 'helmet',    stat: 'rate' },
  { id: 'ninja',    nama: 'Ninja',      baju: '#2B2B3A', topi: '#3A3A4A', gaya: 'ninja',     stat: 'crit' },
  { id: 'bomba',    nama: 'Bomba',      baju: '#E5484D', topi: '#F2C230', gaya: 'hardhat',   stat: 'pen' },
  { id: 'lanun',    nama: 'Lanun',      baju: '#3A3048', topi: '#C8302A', gaya: 'bandana',   stat: 'gold' },
  { id: 'robot',    nama: 'Robot',      baju: '#8C96A4', topi: '#5A6070', gaya: 'goggles',   stat: 'acc' },
  { id: 'penyihir', nama: 'Penyihir',   baju: '#5A3A8A', topi: '#3A2A5A', gaya: 'koboi',     stat: 'critDmg' },
  { id: 'atlet',    nama: 'Atlet',      baju: '#2E9E6A', topi: '#FFFFFF', gaya: 'cap',       stat: 'rate' },
  { id: 'diraja',   nama: 'Diraja',     baju: '#7A2A8A', topi: '#F2C230', gaya: 'mahkota',   stat: 'boss' },
  { id: 'komando',  nama: 'Komando',    baju: '#4E6A3A', topi: '#3A4E2A', gaya: 'beret',     stat: 'dmg' },
  { id: 'salji',    nama: 'Salji',      baju: '#9FD8F0', topi: '#FFFFFF', gaya: 'topi',      stat: 'crit' },
  { id: 'api',      nama: 'Bara Api',   baju: '#E07A2E', topi: '#C8302A', gaya: 'rambut',    stat: 'boss' }
];
const SKIN_STAT = { dmg: [8, 15, 'damage'], rate: [6, 12, 'laju tembak'], crit: [4, 8, 'kritikal'], critDmg: [15, 30, 'damage kritikal'], pen: [10, 20, 'tembus perisai'], acc: [10, 20, 'ketepatan'], boss: [10, 20, 'damage boss'], gold: [10, 20, 'gold'] };
const KEEP_GAYA = ['tudung', 'ketayap'];   // tudung & kopiah dikekalkan dalam setiap kostum
const SKINS = []; const SKIN_BY_ID = {};
HERO_ORDER.forEach((h, i) => { const a = (i * 5) % 12; let b = (i * 7 + 6) % 12; if (b === a) b = (b + 1) % 12;
  [[a, 0], [b, 1]].forEach(([ti, rar]) => { const th = SKIN_THEMES[ti], sk = { id: h + '_' + th.id, hero: h, theme: th, rar, nama: HEROES[h].nama + ' ' + th.nama }; SKINS.push(sk); SKIN_BY_ID[sk.id] = sk; }); });
// kostum eksklusif Pek Penyokong: kosmetik sahaja (tiada stat, tiada bonus koleksi, tiada dalam peti)
const SUP_THEME = { id: 'penyokong', nama: 'Penyokong', baju: '#E5486A', topi: '#FFD24A', gaya: 'beret', stat: 'dmg' };
['pistol', 'komander', 'shotgun'].forEach(h => { if (!HEROES[h]) return; const sk = { id: h + '_penyokong', hero: h, theme: SUP_THEME, rar: 1, sup: true, nama: HEROES[h].nama + ' Penyokong' }; SKINS.push(sk); SKIN_BY_ID[sk.id] = sk; });
const SKIN_CHEST = { nama: 'Peti Kostum', harga: 200, ur: 0.2, desc: '1 kostum hero rawak (SR 80%, UR 20%). Pendua menaikkan ★ kostum' };
const SKIN_MAX_STAR = 5;
function skinStats(sk, stars) { if (sk.sup) return {}; const t = SKIN_STAT[sk.theme.stat], m = 1 + 0.2 * (stars || 0), o = {}; o[sk.theme.stat] = Math.round(t[sk.rar] * m * 10) / 10; if (sk.rar === 1) o.dmg = (o.dmg || 0) + Math.round(5 * m * 10) / 10; return o; }
function skinDesc(sk, stars) { const s = skinStats(sk, stars); if (sk.sup) return 'Kosmetik eksklusif Penyokong ❤ (tiada stat)'; return Object.keys(s).map(k => '+' + s[k] + '% ' + (SKIN_STAT[k] ? SKIN_STAT[k][2] : k)).join(', '); }
function skinCount(save) { return Object.keys(save.skins || {}).filter(k => SKIN_BY_ID[k] && !SKIN_BY_ID[k].sup).length; }
function grantSkin(save, id) {
  const sk = SKIN_BY_ID[id]; if (!sk || sk.sup) return { ok: false, msg: 'Kostum tidak sah' };
  if (save.skins[id] == null) { save.skins[id] = 0; stat(save, 'skins'); return { ok: true, sk, baru: true, msg: 'Kostum baharu: ' + sk.nama + '!' }; }
  if (save.skins[id] < SKIN_MAX_STAR) { save.skins[id]++; return { ok: true, sk, naik: true, msg: sk.nama + ' ★' + save.skins[id] }; }
  save.gems += 50; return { ok: true, sk, refund: 50, msg: sk.nama + ' sudah ★' + SKIN_MAX_STAR + ': +50 gems' };
}
function randomSkin(rng) { const ur = rng() < SKIN_CHEST.ur, pool = SKINS.filter(s => s.rar === (ur ? 1 : 0) && !s.sup); return pool[Math.floor(rng() * pool.length)]; }
function openSkinChest(save, rng) {
  if (save.gems < SKIN_CHEST.harga) return { ok: false, msg: 'Gems tak cukup (perlu ' + SKIN_CHEST.harga + ')' };
  save.gems -= SKIN_CHEST.harga; stat(save, 'chests'); return grantSkin(save, randomSkin(rng).id);
}
function equipSkin(save, hero, id) {
  if (!id) { delete save.skinOn[hero]; return { ok: true, msg: HEROES[hero].nama + ': kostum asal' }; }
  const sk = SKIN_BY_ID[id]; if (!sk || sk.hero !== hero || save.skins[id] == null) return { ok: false, msg: 'Kostum belum dimiliki' };
  save.skinOn[hero] = id; return { ok: true, msg: HEROES[hero].nama + ' memakai kostum ' + sk.theme.nama };
}
function heroSkin(save, hero) { const id = save.skinOn && save.skinOn[hero]; return id && SKIN_BY_ID[id] && save.skins[id] != null ? SKIN_BY_ID[id] : null; }
// ---------- Set bertema (ikut corak item: 6 set) ----------
const ITEM_SETS = [
  { nama: 'Perintis', b2: ['dmg', 5],  b4: ['rate', 8],     b6: ['dmg', 12] },
  { nama: 'Pemburu',  b2: ['crit', 3], b4: ['critDmg', 20], b6: ['boss', 15] },
  { nama: 'Pahlawan', b2: ['dmg', 6],  b4: ['boss', 10],    b6: ['dmg', 15] },
  { nama: 'Bayang',   b2: ['acc', 8],  b4: ['crit', 5],     b6: ['critDmg', 35] },
  { nama: 'Besi',     b2: ['pen', 8],  b4: ['dmg', 8],      b6: ['pen', 25] },
  { nama: 'Diraja',   b2: ['gold', 10], b4: ['rate', 10],   b6: ['dmg', 18] }
];
const SET_STAT_NAMA = { dmg: 'damage', rate: 'laju tembak', crit: 'kritikal', critDmg: 'damage kritikal', boss: 'damage boss', pen: 'tembus perisai', acc: 'ketepatan', gold: 'gold' };
function heroSetCounts(save, id) { const e = save.equip[id] || {}, c = [0, 0, 0, 0, 0, 0]; HERO_SLOTS.forEach(s => { const it = itemByUid(save, e[s]); if (it) c[it.base % 6]++; }); return c; }
function setBonuses(save, id) { const out = []; heroSetCounts(save, id).forEach((n, i) => { const S0 = ITEM_SETS[i]; [[2, 'b2'], [4, 'b4'], [6, 'b6']].forEach(([need, k]) => { if (n >= need) out.push({ set: S0.nama, need, k: S0[k][0], v: S0[k][1] }); }); }); return out; }
function setDesc(i) { const S0 = ITEM_SETS[i]; return [['2', S0.b2], ['4', S0.b4], ['6', S0.b6]].map(([n, b]) => '(' + n + ') +' + b[1] + '% ' + SET_STAT_NAMA[b[0]]).join(' · '); }

// pasang item terbaik untuk seorang hero (tidak mengambil item hero pasukan lain)
function equipBestFor(save, id) {
  if (!save.heroes[id]) return { ok: false, msg: 'Hero belum dibina' }; let n = 0;
  HERO_SLOTS.forEach(s => { const cur = itemByUid(save, (save.equip[id] || {})[s]);
    const pool = save.items.filter(x => { if (x.jenis !== s) return false; const w = whoEquips(save, x.uid); return !w || w.hero === id || !save.team.includes(w.hero); });
    const best = pool.sort((a, b) => itemPower(b) - itemPower(a))[0];
    if (best && (!cur || itemPower(best) > itemPower(cur))) { equipItem(save, best.uid, id); n++; } });
  return { ok: n > 0, msg: n ? n + ' item lebih baik dipasang pada ' + HEROES[id].nama : 'Sudah memakai item terbaik yang ada' };
}

function equipBestWall(save) {
  const pool = save.items.filter(x => x.jenis === 'perisai').sort((a, b) => itemPower(b) - itemPower(a)).slice(0, WALL_SLOTS);
  const cur = save.wallEquip.map(u => itemByUid(save, u)).filter(Boolean).map(x => x.uid).sort().join(), want = pool.map(x => x.uid).sort().join();
  if (!pool.length || cur === want) return { ok: false, msg: pool.length ? 'Pagar sudah memakai perisai terbaik' : 'Tiada item perisai pagar dalam beg' };
  save.wallEquip = [0, 1, 2].map(i => pool[i] ? pool[i].uid : null); return { ok: true, msg: pool.length + ' perisai terbaik dipasang pada pagar' };
}

// ---------- Dompet: pek gold, tukar gold → gems, hadiah harian ----------
const GOLD_PACKS = [
  { id: 'kecil',     nama: 'Pek Kecil',     gems: 20,  sec: 1800,  bonus: 1,   label: 'gold 30 minit' },
  { id: 'sederhana', nama: 'Pek Sederhana', gems: 100, sec: 10800, bonus: 1,   label: 'gold 3 jam' },
  { id: 'besar',     nama: 'Pek Besar',     gems: 300, sec: 36000, bonus: 1.2, label: 'gold 10 jam +20%' }
];
const GEM_SWAP = { gems: 10, sec: 7200, perDay: 5 }, FREE_GEMS = 20;
function goldPackAmount(save, p) { return Math.floor(idleRate(effBest(save)) * p.sec * p.bonus * rohMult(save)); }
function buyGoldPack(save, id) {
  const p = GOLD_PACKS.find(x => x.id === id); if (!p) return { ok: false, msg: 'Pek tidak sah' };
  if (save.gems < p.gems) return { ok: false, msg: 'Gems tak cukup (perlu ' + p.gems + ')' };
  const g = goldPackAmount(save, p); save.gems -= p.gems; save.gold += g; stat(save, 'goldPacks');
  return { ok: true, gold: g, msg: p.nama + ': +' + fmtNum(g) + ' gold' };
}
function swapCost(save) { return Math.floor(idleRate(effBest(save)) * GEM_SWAP.sec * rohMult(save)); }
function swapLeft(save, now) { return save.swap && save.swap.day === dayKey(now) ? Math.max(0, GEM_SWAP.perDay - save.swap.n) : GEM_SWAP.perDay; }
function swapGoldForGems(save, now) {
  if (!clockCheck(save, now)) return { ok: false, msg: 'Jam peranti nampaknya diundurkan' };
  if (swapLeft(save, now) <= 0) return { ok: false, msg: 'Had tukar hari ini sudah habis (' + GEM_SWAP.perDay + '/hari)' };
  const c = swapCost(save); if (save.gold < c) return { ok: false, msg: 'Gold tak cukup (perlu ' + fmtNum(c) + ')' };
  const k = dayKey(now); if (!save.swap || save.swap.day !== k) save.swap = { day: k, n: 0 };
  save.gold -= c; save.gems += GEM_SWAP.gems; save.swap.n++; stat(save, 'gemsGot', GEM_SWAP.gems);
  return { ok: true, msg: '+' + GEM_SWAP.gems + ' gems (' + swapLeft(save, now) + ' tukaran lagi hari ini)' };
}
function freeGemsReady(save, now) { return save.freeGemDay !== dayKey(now); }
function claimFreeGems(save, now) {
  if (!clockCheck(save, now)) return { ok: false, msg: 'Jam peranti nampaknya diundurkan' };
  if (!freeGemsReady(save, now)) return { ok: false, msg: 'Hadiah hari ini sudah dituntut. Datang esok!' };
  save.freeGemDay = dayKey(now); save.gems += FREE_GEMS; stat(save, 'gemsGot', FREE_GEMS); return { ok: true, msg: '🎁 +' + FREE_GEMS + ' gems percuma!' };
}

// ---------- Pembelian dalam aplikasi (Google Play Billing) ----------
// Harga sebenar datang daripada Google Play (getDetails); 'harga' di sini hanya paparan sandaran.
const IAP = [
  { id: 'penyokong', nama: 'Pek Penyokong', sekali: true, harga: 'RM 3.90', desc: '3 kostum eksklusif, lencana ❤, slot ekspedisi ke-4' },
  { id: 'gems_300',  nama: 'Pek Gems Kecil',     gems: 300,  harga: 'RM 3.90' },
  { id: 'gems_850',  nama: 'Pek Gems Sederhana', gems: 850,  harga: 'RM 9.90' },
  { id: 'gems_1800', nama: 'Pek Gems Besar',     gems: 1800, harga: 'RM 19.90' },
  { id: 'tangan_pembantu', nama: 'Tangan Pembantu', sekali: true, harga: 'RM 19.90', desc: 'Tekan zombie automatik 3 kali sesaat semasa bertempur. Boleh dihidup/matikan.' }
];
// Produk sekali beli TIDAK di-consume: Google Play mengingatnya dan listPurchases memulihkannya (telefon baharu / data dipadam)
function iapSekali(id) { const p = IAP.find(x => x.id === id); return !!(p && p.sekali); }
function iapOwned(save, id) { return id === 'penyokong' ? !!save.supporter : id === 'tangan_pembantu' ? !!(save.tpb && save.tpb.own) : false; }
function iapCanBuy(save, id) { const p = IAP.find(x => x.id === id); return !!p && !(p.sekali && iapOwned(save, id)); }
// Beri ganjaran SEKALI bagi setiap token pembelian (selamat dipanggil berulang: pulih selepas ranap / listPurchases)
function iapGrant(save, id, token) {
  const p = IAP.find(x => x.id === id); if (!p) return { ok: false, msg: 'Produk tidak dikenali: ' + id };
  if (!token || typeof token !== 'string') return { ok: false, msg: 'Token pembelian tiada' };
  save.iap = save.iap || { tok: [], n: 0 };
  if (save.iap.tok.includes(token)) return { ok: true, dup: true, msg: 'Pembelian ini sudah diterima' };
  save.iap.tok.push(token); if (save.iap.tok.length > 200) save.iap.tok.splice(0, save.iap.tok.length - 200); save.iap.n++;
  if (p.gems) { save.gems += p.gems; stat(save, 'gemsGot', p.gems); return { ok: true, gems: p.gems, msg: '💎 +' + p.gems + ' gems. Terima kasih!' }; }
  if (p.id === 'tangan_pembantu') { const had = !!(save.tpb && save.tpb.own); save.tpb = { own: true, on: true }; return { ok: true, tpb: true, dup: had, msg: '🤖 Tangan Pembantu aktif! Ia akan menekan zombie 3 kali sesaat. Terima kasih!' }; }
  const hadSup = !!save.supporter; save.supporter = true; SKINS.filter(s => s.sup).forEach(s => { if (save.skins[s.id] == null) save.skins[s.id] = 0; });
  return { ok: true, sup: true, dup: hadSup, msg: '❤ Terima kasih, Penyokong! 3 kostum eksklusif & slot ekspedisi ke-4 dibuka' };
}
// Padam progress: pembelian wang sebenar (Penyokong, Tangan Pembantu, sejarah token) TIDAK dipadam
function resetSave(old, now) { const s = migrate(null, now); s.dev = !!old.dev; s.settings = old.settings; s.tut = 99;
  s.iap = old.iap || s.iap; if (old.supporter) { s.supporter = true; SKINS.filter(k => k.sup).forEach(k => { if (s.skins[k.id] == null) s.skins[k.id] = 0; }); }
  if (old.tpb && old.tpb.own) s.tpb = { own: true, on: old.tpb.on !== false }; return s; }
// Pintu ibu bapa: soalan darab yang mudah untuk orang dewasa, sukar diteka kanak-kanak kecil
function gateQ(rng) { const a = 13 + Math.floor(rng() * 37), b = 3 + Math.floor(rng() * 7); return { a, b, ans: a * b, q: a + ' × ' + b }; }

// ---------- Ekspedisi (hero simpanan) ----------
const EXPED_DUR = [1, 2, 4, 8], EXPED_SLOTS = 3, EXPED_MAX_HERO = 3;
const EXPED_DEST = [
  { id: 'hutan',  nama: 'Hutan Simpan',  ikon: '🌳', bi: 6, desc: 'Lebih banyak shard',             m: { gold: 0.8, gems: 0.8, shard: 1.8, item: 1 } },
  { id: 'gua',    nama: 'Gua Kristal',   ikon: '💎', bi: 8, desc: 'Item lebih banyak & lebih baik', m: { gold: 0.7, gems: 0.8, shard: 0.8, item: 2, rar: 1 } },
  { id: 'pantai', nama: 'Pantai Lanun',  ikon: '🏴‍☠️', bi: 5, desc: 'Gold berganda',                 m: { gold: 2, gems: 0.8, shard: 0.8, item: 1 } },
  { id: 'gunung', nama: 'Gunung Berapi', ikon: '🌋', bi: 9, desc: 'Gems lebih banyak',              m: { gold: 0.8, gems: 2.5, shard: 0.8, item: 1 } }
];
const EXPED_EVENTS = {
  hutan:  ['{h} jumpa sarang shard di bawah pokok', '{h} menyeberang sungai deras', '{h} tersesat seketika… kemudian jumpa jalan', '{h} menumpaskan zombie berlumut', '{h} jumpa kesan tapak kaki misteri'],
  gua:    ['{h} nampak kilauan kristal', '{h} menerangi lorong gelap', '{h} jumpa peti kayu lama', '{h} mengelak kelawar zombie', '{h} menggali dinding berkilat'],
  pantai: ['{h} jumpa syiling di pasir', '{h} menaiki bot lanun lama', '{h} bertarung dengan zombie lanun', '{h} menggali peti harta karun', '{h} berehat di bawah pokok kelapa'],
  gunung: ['{h} mendaki laluan berbatu', '{h} jumpa permata dalam batu lava', '{h} mengelak percikan lava', '{h} berkhemah di lereng', '{h} menumpaskan zombie bara']
};
function expedDest(ex) { return EXPED_DEST.find(d => d.id === ex.dest) || EXPED_DEST[0]; }
function expedEvents(ex) {
  const r = mulberry(((ex.t / 1000) | 0) ^ (ex.d * 7919) ^ ex.h.join('').length * 131), D = expedDest(ex), pool = EXPED_EVENTS[D.id].slice(), n = 2 + Math.min(3, ex.d), out = [];
  for (let i = 0; i < n && pool.length; i++) { const txt = pool.splice(Math.floor(r() * pool.length), 1)[0].replace('{h}', HEROES[ex.h[Math.floor(r() * ex.h.length)]].nama); out.push({ at: (i + 0.5 + r() * 0.4) / (n + 0.4), txt }); }
  return out.sort((a, b) => a.at - b.at);
}
function expedSlots(save) { return save.supporter ? 4 : EXPED_SLOTS; }
function onExped(save, h) { return (save.exped || []).some(ex => ex.h.includes(h)); }
function expedLeft(ex, now) { return Math.max(0, ex.t + ex.d * 3600000 - now); }
function expedPower(ex) { return ex.h.reduce((a, h) => a + 1 + HEROES[h].tier, 0); }
function expedPreview(save, ex) { const p = expedPower(ex), m = 1 + 0.1 * p, M = expedDest(ex).m; return { gold: Math.floor(idleRate(effBest(save)) * 1800 * ex.d * m * M.gold), gems: Math.round(3 * ex.d * (1 + 0.05 * p) * M.gems), shardOwn: Math.max(1, Math.round(ex.d * M.shard)), shardRand: Math.max(1, Math.round(ex.d * M.shard)), items: Math.floor(ex.d / 2 * M.item), minRar: Math.min(6, 1 + Math.floor(p / 6) + (M.rar || 0)) }; }
function startExped(save, heroes, d, now, dest) {
  heroes = [...new Set(heroes)];
  if (save.exped.length >= expedSlots(save)) return { ok: false, msg: 'Semua ' + expedSlots(save) + ' slot ekspedisi sedang digunakan' };
  if (!EXPED_DUR.includes(d)) return { ok: false, msg: 'Tempoh tidak sah' };
  if (!heroes.length || heroes.length > EXPED_MAX_HERO) return { ok: false, msg: 'Pilih 1 hingga ' + EXPED_MAX_HERO + ' hero' };
  for (const h of heroes) { if (!save.heroes[h]) return { ok: false, msg: 'Hero belum dibina' }; if (save.team.includes(h)) return { ok: false, msg: HEROES[h].nama + ' dalam pasukan' }; if (onExped(save, h)) return { ok: false, msg: HEROES[h].nama + ' sedang ekspedisi' }; }
  const D = EXPED_DEST.find(x => x.id === dest) || EXPED_DEST[0];
  save.exped.push({ h: heroes, d, t: now, dest: D.id }); return { ok: true, msg: D.ikon + ' Ekspedisi ' + D.nama + ' ' + d + ' jam bermula (' + heroes.map(h => HEROES[h].nama).join(', ') + ')' };
}
function claimExped(save, i, now, rng) {
  const ex = save.exped[i]; if (!ex) return { ok: false, msg: 'Tiada ekspedisi' };
  if (!clockCheck(save, now)) return { ok: false, msg: 'Jam peranti nampaknya diundurkan' };
  if (expedLeft(ex, now) > 0) return { ok: false, msg: 'Ekspedisi belum selesai' };
  const r = expedPreview(save, ex), got = { gold: r.gold, gems: r.gems, shards: {}, items: [] };
  save.gold += r.gold; save.gems += r.gems;
  ex.h.forEach(h => { addShards(save, h, r.shardOwn); got.shards[h] = (got.shards[h] || 0) + r.shardOwn; });
  for (let k = 0; k < r.shardRand; k++) { const h = randomShardHero(rng); addShards(save, h, 1); got.shards[h] = (got.shards[h] || 0) + 1; }
  for (let k = 0; k < r.items; k++) { const a = addItem(save, makeItem(save, rng, r.minRar)); got.items.push(a.it); }
  save.exped.splice(i, 1); stat(save, 'expeds');
  return { ok: true, got, msg: 'Ekspedisi selesai: +' + fmtNum(r.gold) + ' gold, +' + r.gems + ' gems, +' + Object.values(got.shards).reduce((a, b) => a + b, 0) + ' shard' + (got.items.length ? ', ' + got.items.length + ' item' : '') };
}
function cancelExped(save, i) { if (!save.exped[i]) return { ok: false, msg: 'Tiada ekspedisi' }; save.exped.splice(i, 1); return { ok: true, msg: 'Ekspedisi dibatalkan (tiada ganjaran)' }; }

// ---------- Latihan simpanan: hero luar pasukan naik level perlahan-lahan ----------
const TRAIN_SEC = 180;
function benchCap(save) { const t = save.team.filter(h => save.heroes[h]); return t.length ? Math.floor(t.reduce((a, h) => a + save.heroes[h], 0) / t.length * 0.5) : 1; }
function benchHeroes(save) { return HERO_ORDER.filter(h => save.heroes[h] && !save.team.includes(h)); }
function trainBench(save, sec) {
  if (!(sec > 0)) return 0; save.trainAcc = (save.trainAcc || 0) + Math.min(sec, 8 * 3600); const steps = Math.floor(save.trainAcc / TRAIN_SEC); if (!steps) return 0;
  save.trainAcc -= steps * TRAIN_SEC; const cap = benchCap(save); let gained = 0;
  benchHeroes(save).forEach(h => { const lv = save.heroes[h]; if (lv < cap) { const n = Math.min(cap, lv + steps); gained += n - lv; save.heroes[h] = n; } });
  return gained;
}

// ---------- Kuasa Tempur ----------
function heroCP(st) { return Math.round(st.dmg * st.rate * (1 + st.crit * (st.critMul - 1)) * (1 + st.boss / 200) * (1 + st.pen / 300) * (1 + st.acc / 400) * 10); }
function heroStats(save, id, now) {
  const wid = heroWeapon(save, id), wd = WEAPONS[wid], lvl = save.heroes[id] || 1, eq = save.equip[id] || {};
  let dmgPct = 0, crit = wd.critB || 0, ratePct = 0, goldPct = 0, critDmg = 0, epic = 0, boss = 0, pen = 0, acc = 0;
  const add = (k, v) => { if (k === 'dmg') dmgPct += v; else if (k === 'rate') ratePct += v; else if (k === 'gold') goldPct += v; else if (k === 'critDmg') critDmg += v; else if (k === 'crit') crit += v / 100; else if (k === 'boss') boss += v; else if (k === 'pen') pen += v; else if (k === 'acc') acc += v; };
  for (const slot of HERO_SLOTS) {
    const it = itemByUid(save, eq[slot]); if (!it) continue; const s = itemStats(it); if (it.rar >= 3) epic++;
    dmgPct += s.dmg || 0; crit += (s.crit || 0) / 100; ratePct += s.rate || 0; goldPct += s.gold || 0; critDmg += s.critDmg || 0;
    itemSubs(it).forEach(x => add(x.k, x.v));
  }
  const setOn = epic === HERO_SLOTS.length; if (setOn) dmgPct += 10;
  const H0 = HEROES[id], PR = H0.peranan, aff = wAff(id, wid), AF = AFF[aff];
  if (PR === 'sihir' && wd.jenis === 'm') dmgPct += 20; if (PR === 'pejuang' && wd.jenis === 'f') dmgPct += 20; if (PR === 'laju') ratePct += 20; if (PR === 'tepat') crit += 0.15;
  const sk = heroSkin(save, id); if (sk) { const ss = skinStats(sk, save.skins[sk.id]); Object.keys(ss).forEach(k => add(k, ss[k])); }
  dmgPct += skinCount(save);   // bonus koleksi: +1% damage setiap kostum dimiliki
  setBonuses(save, id).forEach(b => add(b.k, b.v));
  return {
    wid, dmg: rohMult(save) * (1 + 0.1 * perk(save, 'berkat')) * wd.dmg * heroLvlMult(lvl) * TIERS[HEROES[id].tier].mult * starMult(save.stars[id] || 0) * wpnLvlMult(save.weapons[wid] || 1) * (wid === 'batu' ? 1 : wStarMult(save, wid)) * AF.dmg * Math.pow(1.1, save.shop.damage) * (1 + dmgPct / 100) * (boostOn(save, 'dmg', now) ? 2 : 1),
    rate: wd.rate * AF.rate * (wid !== 'batu' && wStars(save, wid) >= 3 ? 1.1 : 1) * (1 + 0.06 * save.shop.speed) * (1 + ratePct / 100) * (boostOn(save, 'speed', now) ? 1.5 : 1),
    crit: Math.min(0.9, crit), goldPct, critMul: 2 + critDmg / 100, setOn, rangeK: PR === 'tepat' ? 1.1 : 1, robo: PR === 'robo',
    boss: Math.round(boss * 10) / 10, pen: Math.min(100, Math.round((pen + (wd.pen || 0)) * 10) / 10), aff, acc: Math.min(100, Math.round(acc * 10) / 10), dmgPct, ratePct
  };
}
function wallStats(save) {
  const w = WALLS[save.wallActive] || WALLS[0];
  let hpPct = 0, armor = w.armor, thorns = w.thorns, regen = w.regen;
  save.wallEquip.forEach(uid => { const it = itemByUid(save, uid); if (!it) return; const s = itemStats(it); hpPct += s.hp; armor += s.armor; thorns += s.thorns / 100; regen += s.regen / 100; });
  save.team.forEach(h => { const it = itemByUid(save, (save.equip[h] || {}).baju); if (it) hpPct += itemStats(it).hp; });
  const lv = wallLvOf(save, w.idx), mat = w.mat; hpPct += lv * 5 + wallCollPct(save);
  const hpMat = mat === 2 ? 1.12 : 1, armCap = mat === 5 ? 56 : 50; if (mat === 5) armor += 6;
  return { max: Math.round(100 * Math.pow(1.15, save.shop.wall) * w.hp * hpMat * (1 + hpPct / 100)), armor: Math.min(armCap, armor), thorns, regen, w, mat, lv, coll: wallCollPct(save) };
}

// ---------- Save ----------
function defaultSave(now) {
  return { v: SAVE_V, gold: 0, gems: 0, stage: 1, best: 1, cleared: [], heroes: { pistol: 1 }, team: ['pistol'], slots: 3,
    weapons: { pistol: 1 }, heroWpn: { pistol: 'pistol' }, kelasV: 1, wallsOwned: 1, wallActive: 0, wallLv: {}, wallEquip: [null, null, null],
    shop: { damage: 0, speed: 0, wall: 0, tap: 0, magnet: 0, luck: 0 }, items: [], equip: {}, boost: {}, nextUid: 1, last: now || 0, kills: 0, evoSeen: 0, powers: { meteor: 1 }, autoPow: false, stars: {}, shards: {}, seenZ: '', stats: {}, achClaimed: {}, daily: { login: '', streak: 0, mDay: '', missions: [], bonus: false }, autoSell: -1, dev: false, tut: 0, mode: 'normal', modeProg: {}, skins: {}, skinOn: {}, exped: [], trainAcc: 0, swap: null, freeGemDay: '', supporter: false, tapak: cleanTapak(null), tpb: cleanTpb(null), iap: { tok: [], n: 0 }, discOk: false, settings: { music: 0.5, sfx: 0.7, master: 2, vib: true, voice: true, dmgNum: true, amb: 0.4, gearView: 'penuh', speed: 1, auto: false, awake: true, calm: typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches, bigText: false }, roh: 0, rohTotal: 0, perks: {}, chal: {}, towers: [null, null, null], bossDex: '', raid: null, pity: { emas: 0 }, wsh: {}, wst: {}, debu: 0, wpeti: { kayu: 0, leg: 0, free: '', pe: 0, pl: 0, pj: 0, jenis: '' }, wshop: null, wtarget: '', eventForce: '', maxNow: 0, lastExport: 0, tips: {} };
}
function cleanDaily(d) {
  const r = { login: '', streak: 0, mDay: '', missions: [], bonus: false }; if (!d || typeof d !== 'object') return r;
  if (typeof d.login === 'string') r.login = d.login; if (typeof d.mDay === 'string') r.mDay = d.mDay;
  r.streak = Math.max(0, Math.floor(typeof d.streak === 'number' ? d.streak : 0)); r.bonus = d.bonus === true;
  if (typeof d.eventDay === 'string') r.eventDay = d.eventDay;
  if (Array.isArray(d.missions)) r.missions = d.missions.filter(m => m && MISSION_POOL[m.i] && m.lv >= 0 && m.lv <= 2).slice(0, 5).map(m => ({ i: m.i, lv: m.lv, base: +m.base || 0, done: m.done === true }));
  return r;
}
function cleanMap(m, okKey, max) { const r = {}; if (m && typeof m === 'object') for (const k of Object.keys(m)) { const v = m[k]; if (okKey(k) && typeof v === 'number' && isFinite(v) && v > 0) r[k] = Math.min(max, Math.floor(v)); } return r; }
function migrate(o, now) { const s = migrate0(o, now); if (s && s.heroes) { s.tapak = cleanTapak(o && o.tapak); s.tpb = cleanTpb(o && o.tpb); if (!s.kelasV) kelasMigrate(s, !!(o && typeof o === 'object' && o.heroes)); grantGeneratedHeroes(s); normalizeWeapons(s); } return s; }
// v9.4: hero tidak lagi membawa senjata — save lama: senjata asal hero yang dimiliki dipasang & kekal
function kelasMigrate(s, old) {
  HERO_ORDER.forEach(h => { if (!s.heroes[h]) return; const sig = HEROES[h].wpn; if (old && !s.weapons[sig]) s.weapons[sig] = 1;
    const cur = s.heroWpn[h]; if (!cur || !s.weapons[cur] || !inClass(h, cur)) { if (s.weapons[sig]) s.heroWpn[h] = sig; else delete s.heroWpn[h]; } });
  s.kelasV = 1; if (old) s.kelasNotice = true;
}
function migrate0(o, now) {
  const d = defaultSave(now);
  if (!o || typeof o !== 'object') return d;
  const num = (x, def) => (typeof x === 'number' && isFinite(x) && x >= 0 ? x : def);
  const ver = num(o.v, 1);
  const src = o.heroes || o.surv || {}, heroes = {};
  HERO_ORDER.forEach(id => { const l = src[id]; if (typeof l === 'number' && l >= 1) heroes[id] = Math.floor(l); });
  if (!heroes.pistol) heroes.pistol = 1;
  const shop = {}; SHOP_ORDER.forEach(id => { shop[id] = Math.floor(num(o.shop && o.shop[id], 0)); });
  const best = Math.max(1, Math.floor(num(o.best, 1)));
  const slots = Math.min(MAX_SLOTS, Math.max(3, Math.floor(num(o.slots, 3))));
  const RMAP = [0, 2, 3, 4, 5]; // tahap lama (5) → tahap baharu (10)
  let items = Array.isArray(o.items) ? o.items.filter(it => it && typeof it.uid === 'number' && (ITEM_NAMES[it.jenis] || it.jenis === 'aksesori') && typeof it.rar === 'number' && it.ilvl >= 1) : [];
  items = items.map(it => { if (it.jenis !== 'aksesori') return it; const m = AKS_MAP[Math.floor(num(it.base, 0)) % 6]; return Object.assign({}, it, { jenis: m[0], base: m[1] }); });
  items = items.map(it => ({ uid: it.uid, jenis: it.jenis, rar: Math.min(9, Math.max(0, Math.floor(ver < 3 ? (RMAP[it.rar] ?? 0) : it.rar))), ilvl: Math.floor(it.ilvl), base: Math.floor(num(it.base, 0)) % 6, lock: it.lock === true, sub: Array.isArray(it.sub) ? it.sub.filter(s => s && SUBSTATS[s.k] && s.q > 0 && s.q < 3).slice(0, 3).map(s => ({ k: s.k, q: +s.q })) : null })).map(it => { if (!it.sub) it.sub = rollSubs(it.jenis, it.rar, it.uid * 7919 + it.rar); return it; }).slice(0, INV_CAP);
  // UID mesti unik: itemByUid mengambil padanan pertama, jadi migrasi juga perlu mengekalkan padanan pertama.
  const seenUid = new Set();
  items = items.filter(it => { if (seenUid.has(it.uid)) return false; seenUid.add(it.uid); return true; });
  const uids = new Set(items.map(i => i.uid)), jenisOf = {}; items.forEach(i => { jenisOf[i.uid] = i.jenis; });
  const equip = {};
  if (o.equip && typeof o.equip === 'object') for (const h of Object.keys(o.equip)) if (heroes[h]) { const e = o.equip[h] || {}; equip[h] = {}; HERO_SLOTS.concat(['aksesori']).forEach(s => { const u = e[s], j = jenisOf[u]; if (uids.has(u) && HERO_SLOTS.includes(j) && equip[h][j] == null && !Object.values(equip).some(q => Object.values(q).includes(u))) equip[h][j] = u; }); }
  let team = Array.isArray(o.team) ? o.team.filter((id, i, a) => heroes[id] && a.indexOf(id) === i) : Object.keys(heroes);
  team = team.slice(0, slots); if (!team.length) team = ['pistol'];
  const boost = {}; BOOST_ORDER.forEach(id => { boost[id] = num(o.boost && o.boost[id], 0); });
  const weapons = {};
  if (o.weapons && typeof o.weapons === 'object') WEAPON_ORDER.forEach(w => { const l = o.weapons[w]; if (typeof l === 'number' && l >= 1) weapons[w] = Math.floor(l); });
  Object.keys(heroes).forEach(h => { const w = HEROES[h].wpn; if (!weapons[w]) weapons[w] = 1; }); // senjata khas hero
  const heroWpn = {};
  if (o.heroWpn && typeof o.heroWpn === 'object') Object.keys(o.heroWpn).forEach(h => { if (heroes[h] && weapons[o.heroWpn[h]]) heroWpn[h] = o.heroWpn[h]; });
  const wallsOwned = Math.min(WALLS.length, Math.max(1, Math.floor(num(o.wallsOwned, 1))));
  const wallActive = Math.min(wallsOwned - 1, Math.floor(num(o.wallActive, 0)));
  const wallLv = {}; if (o.wallLv && typeof o.wallLv === 'object') Object.keys(o.wallLv).forEach(k => { const i = Math.floor(+k), l = Math.floor(num(o.wallLv[k], 0)); if (i >= 0 && i < wallsOwned && l > 0) wallLv[i] = Math.min(WALL_LV_MAX, l); });
  const powers = {};
  if (o.powers && typeof o.powers === 'object') POWER_ORDER.forEach(p => { const l = o.powers[p]; if (typeof l === 'number' && l >= 1) powers[p] = Math.floor(l); });
  if (!powers.meteor) powers.meteor = 1;
  const seen = new Set();
  const wallEquip = [0, 1, 2].map(i => { const u = Array.isArray(o.wallEquip) ? o.wallEquip[i] : null; if (uids.has(u) && jenisOf[u] === 'perisai' && !seen.has(u)) { seen.add(u); return u; } return null; });
  return {
    kelasV: o.kelasV ? 1 : 0, kelasNotice: o.kelasNotice === true, heroPackV: Math.max(0, Math.floor(num(o.heroPackV, 0))),
    v: SAVE_V, gold: num(o.gold, 0), gems: num(o.gems, 0), best, stage: Math.min(best, Math.max(1, Math.floor(num(o.stage, 1)))),
    cleared: Array.isArray(o.cleared) ? o.cleared.filter(n => typeof n === 'number') : [],
    heroes, team, slots, weapons, heroWpn, wallsOwned, wallActive, wallLv, wallEquip, shop, items, equip, boost,
    nextUid: Math.max(num(o.nextUid, 1), ...items.map(i => i.uid + 1), 1), last: num(o.last, now || 0), kills: num(o.kills, 0), evoSeen: num(o.evoSeen, 0), powers, autoPow: o.autoPow === true,
    stars: cleanMap(o.stars, h => heroes[h], MAX_STARS), shards: cleanMap(o.shards, h => HEROES[h], 1e12),
    seenZ: typeof o.seenZ === 'string' ? o.seenZ.replace(/[^01]/g, '').slice(0, 1000) : '',
    stats: cleanMap(o.stats, () => true, 1e300), achClaimed: cleanMap(o.achClaimed, k => ACH.some(a => a.id === k), 5),
    daily: cleanDaily(o.daily), autoSell: Math.max(-1, Math.min(4, Math.floor(typeof o.autoSell === 'number' ? o.autoSell : -1))), dev: o.dev === true,
    tut: Math.max(0, Math.floor(num(o.tut, o.heroes ? 99 : 0))), roh: Math.floor(num(o.roh, 0)), rohTotal: Math.floor(num(o.rohTotal, 0)),
    raid: o.raid && typeof o.raid === 'object' && Array.isArray(o.raid.list) && o.raid.list.length === RAID_STEPS && o.raid.list.every(i => Number.isInteger(i) && i >= 0 && i < BOSS_TOTAL) ? { wk: Math.floor(num(o.raid.wk, 0)), list: o.raid.list.slice(), step: Math.max(0, Math.min(RAID_STEPS, Math.floor(num(o.raid.step, 0)))), rekod: Math.max(0, Math.min(RAID_STEPS, Math.floor(num(o.raid.rekod, 0)))) } : null,
    bossDex: typeof o.bossDex === 'string' && /^[012]*$/.test(o.bossDex) ? o.bossDex.slice(0, BOSS_TOTAL) : '',
    towers: (Array.isArray(o.towers) && o.towers.length >= 4 ? [0, 1, 2, 3] : [0, 1, 2]).map(i => { const t = Array.isArray(o.towers) ? o.towers[i] : null; return t && TOWERS[t.type] && t.lvl >= 1 ? { type: t.type, lvl: Math.floor(t.lvl), br: (Array.isArray(t.br) ? t.br : []).slice(0, 2).filter((k, j) => TOWER_BRANCH[t.type][j] && TOWER_BRANCH[t.type][j].some(x => x.id === k)) } : null; }),
    skins: cleanMap(o.skins, k => !!SKIN_BY_ID[k], SKIN_MAX_STAR), skinOn: (() => { const r = {}; if (o.skinOn && typeof o.skinOn === 'object') Object.keys(o.skinOn).forEach(h => { const id = o.skinOn[h]; if (SKIN_BY_ID[id] && SKIN_BY_ID[id].hero === h && o.skins && o.skins[id] != null) r[h] = id; }); return r; })(),
    exped: (Array.isArray(o.exped) ? o.exped : []).filter(ex => ex && Array.isArray(ex.h) && ex.h.length && ex.h.length <= EXPED_MAX_HERO && ex.h.every(h => HEROES[h]) && EXPED_DUR.includes(ex.d) && typeof ex.t === 'number').slice(0, 4).map(ex => ({ h: ex.h.slice(), d: ex.d, t: ex.t, dest: EXPED_DEST.some(x => x.id === ex.dest) ? ex.dest : 'hutan' })), trainAcc: Math.max(0, num(o.trainAcc, 0)),
    swap: o.swap && typeof o.swap.day === 'string' ? { day: o.swap.day, n: Math.max(0, Math.min(GEM_SWAP.perDay, Math.floor(num(o.swap.n, 0)))) } : null, freeGemDay: typeof o.freeGemDay === 'string' ? o.freeGemDay : '',
    supporter: o.supporter === true, iap: { tok: o.iap && Array.isArray(o.iap.tok) ? o.iap.tok.filter(t => typeof t === 'string').slice(-200) : [], n: Math.max(0, Math.floor(num(o.iap && o.iap.n, 0))) },
    mode: DIFF_BY[o.mode] ? o.mode : 'normal', modeProg: (() => { const r = {}; if (o.modeProg && typeof o.modeProg === 'object') Object.keys(o.modeProg).forEach(k => { const p = o.modeProg[k]; if (DIFF_BY[k] && k !== o.mode && p && typeof p === 'object') { const b = Math.max(1, Math.floor(num(p.best, 1))); r[k] = { best: b, stage: Math.min(b, Math.max(1, Math.floor(num(p.stage, 1)))), cleared: Array.isArray(p.cleared) ? p.cleared.filter(n => typeof n === 'number') : [] }; } }); return r; })(),
    discOk: o.discOk === true, pity: { emas: Math.max(0, Math.floor(num(o.pity && o.pity.emas, 0))) }, maxNow: num(o.maxNow, 0), lastExport: num(o.lastExport, 0), tips: o.tips && typeof o.tips === 'object' ? Object.fromEntries(Object.keys(o.tips).map(k => [k, true])) : {},
    wsh: cleanMap(o.wsh, k => WEAPONS[k] && k !== 'batu', 1e9), wst: cleanMap(o.wst, k => weapons[k] && k !== 'batu', W_STAR_MAX), debu: Math.floor(num(o.debu, 0)), wpeti: cleanWpeti(o.wpeti), wshop: cleanWshop(o.wshop), wtarget: typeof o.wtarget === 'string' && WEAPONS[o.wtarget] && o.wtarget !== 'batu' ? o.wtarget : '',
    eventForce: typeof o.eventForce === 'string' && EVENTS.some(e => e.id === o.eventForce) ? o.eventForce : '',
    perks: cleanMap(o.perks, k => PERKS[k], 999), chal: cleanMap(o.chal, k => CHALLENGES.some(c => c.id === k), CHAL_LEVELS), settings: { master: Math.max(0.5, Math.min(3, num(o.settings && o.settings.master, 2))), music: Math.min(1, num(o.settings && o.settings.music, 0.5)), sfx: Math.min(1, num(o.settings && o.settings.sfx, 0.7)), vib: !(o.settings && o.settings.vib === false), voice: !(o.settings && o.settings.voice === false), dmgNum: !(o.settings && o.settings.dmgNum === false), amb: Math.max(0, Math.min(1, num(o.settings && o.settings.amb, 0.4))), gearView: ['penuh', 'ringkas', 'tiada'].includes(o.settings && o.settings.gearView) ? o.settings.gearView : 'penuh', speed: [1, 2, 3].includes(o.settings && o.settings.speed) ? o.settings.speed : 1, auto: !!(o.settings && o.settings.auto), awake: !(o.settings && o.settings.awake === false), calm: !!(o.settings && o.settings.calm), bigText: !!(o.settings && o.settings.bigText) }
  };
}

// ---------- Tindakan ----------
function upgradeHero(save, id, n) {
  n = n || 1; const lvl = save.heroes[id];
  if (!lvl) return { ok: false, msg: 'Hero belum dibuka' };
  let k = 0, cost = 0;
  while (k < n && save.gold >= cost + upCost(lvl + k)) { cost += upCost(lvl + k); k++; }
  if (!k) return { ok: false, msg: 'Gold tak cukup (perlu ' + upCost(lvl) + ')' };
  save.gold -= cost; save.heroes[id] = lvl + k;
  return { ok: true, msg: HEROES[id].nama + ' naik ke Lv.' + (lvl + k) };
}
function unlockHero(save, id) {
  if (save.heroes[id]) return { ok: false, msg: 'Sudah dibina' };
  const need = TIERS[HEROES[id].tier].bina, have = save.shards[id] || 0;
  if (have < need) return { ok: false, msg: 'Shard tak cukup (' + have + '/' + need + ')' };
  save.shards[id] = have - need; save.heroes[id] = 1; save.stars[id] = 0;
  if (HEROES[id].tier === 0 && !save.weapons[HEROES[id].wpn]) { save.weapons[HEROES[id].wpn] = 1; save.heroWpn[id] = HEROES[id].wpn; } // hadiah selamat datang: hero Basic datang dengan senjatanya
  if (save.team.length < save.slots) save.team.push(id);
  normalizeWeapons(save); autoArm(save);
  return { ok: true, msg: HEROES[id].nama + ' (' + TIERS[HEROES[id].tier].nama + ') menyertai pasukan!' };
}
function addShards(save, id, n) { save.shards[id] = (save.shards[id] || 0) + n; stat(save, 'shardsGot', n); }
function starUp(save, id) {
  if (!save.heroes[id]) return { ok: false, msg: 'Hero belum dibina' };
  const s = save.stars[id] || 0;
  if (s >= MAX_STARS) return { ok: false, msg: 'Sudah 50 bintang (maksimum)' };
  const need = starCost(s + 1), have = save.shards[id] || 0;
  if (have < need) return { ok: false, msg: 'Shard tak cukup (' + have + '/' + need + ')' };
  save.shards[id] = have - need; save.stars[id] = s + 1;
  return { ok: true, msg: HEROES[id].nama + ' kini ' + (s + 1) + '★' };
}
function buyShards(save, id) {
  const c = TIERS[HEROES[id].tier].sGem;
  if (save.gems < c) return { ok: false, msg: 'Gems tak cukup (perlu ' + c + ')' };
  save.gems -= c; addShards(save, id, 5); return { ok: true, msg: '+5 shard ' + HEROES[id].nama };
}
function openHeroChest(save, kind, rng) {
  const c = HERO_CHESTS[kind];
  if (save.gems < c.harga) return { ok: false, msg: 'Gems tak cukup (perlu ' + c.harga + ')' };
  save.gems -= c.harga; stat(save, 'chests'); const got = {};
  for (let i = 0; i < c.shard; i++) { const h = randomShardHero(rng, c.minTier); got[h] = (got[h] || 0) + 1; addShards(save, h, 1); }
  return { ok: true, got, msg: Object.keys(got).map(h => '+' + got[h] + ' ' + HEROES[h].nama).join(', ') };
}
function toggleTeam(save, id) {
  if (!save.heroes[id]) return { ok: false, msg: 'Hero belum dibuka' };
  const i = save.team.indexOf(id);
  if (i >= 0) { if (save.team.length === 1) return { ok: false, msg: 'Pasukan perlu sekurang-kurangnya seorang' }; save.team.splice(i, 1); return { ok: true, msg: HEROES[id].nama + ' berehat' }; }
  if (save.team.length >= save.slots) return { ok: false, msg: 'Slot penuh (' + save.slots + '). Keluarkan seorang dahulu' };
  if (onExped(save, id)) return { ok: false, msg: HEROES[id].nama + ' sedang ekspedisi' };
  save.team.push(id); return { ok: true, msg: HEROES[id].nama + ' masuk pasukan' };
}
function buySlot(save) {
  if (save.slots >= MAX_SLOTS) return { ok: false, msg: 'Slot sudah maksimum' };
  const c = SLOT_COST[save.slots + 1];
  if (save.gems < c) return { ok: false, msg: 'Gems tak cukup (perlu ' + c + ')' };
  save.gems -= c; save.slots++; return { ok: true, msg: 'Slot pasukan kini ' + save.slots };
}
const W_BUY_MAX = 1;   // v9.6: hanya Biasa & Jarang boleh dibeli terus; Epik ke atas melalui shard (Peti Senjata)
function canBuyWeapon(wid) { return (WEAPONS[wid].rar || 0) <= W_BUY_MAX; }
function unlockWeapon(save, id) {
  if (save.weapons[id]) return { ok: false, msg: 'Sudah dimiliki' }; if (!WEAPONS[id] || id === 'batu') return { ok: false, msg: 'Tiada' };
  if (!canBuyWeapon(id)) return { ok: false, msg: W_RAR_NAMA[WEAPONS[id].rar].nama + ': hanya melalui shard (⚔ Peti Senjata)' };
  const P = weaponPrice(id);
  if (P.gold) { if (save.gold < P.gold) return { ok: false, msg: 'Gold tak cukup (perlu ' + fmtNum(P.gold) + ')' }; save.gold -= P.gold; }
  else { if (save.gems < P.gems) return { ok: false, msg: 'Gems tak cukup (perlu ' + P.gems + ')' }; save.gems -= P.gems; }
  save.weapons[id] = 1; stat(save, 'weaponsBought');
  // pasang terus pada hero yang tiada senjata & boleh guna
  const h = save.team.concat(HERO_ORDER).find(x => save.heroes[x] && heroWeapon(save, x) === 'batu' && canEquip(x, id)); if (h) save.heroWpn[h] = id;
  return { ok: true, msg: WEAPONS[id].nama + ' dibeli!' + (h ? ' Dipasang pada ' + HEROES[h].nama + '.' : '') };
}
function upgradeWeapon(save, id, n) {
  n = n || 1; const lvl = save.weapons[id];
  if (!lvl) return { ok: false, msg: 'Senjata belum dimiliki' };
  let k = 0, cost = 0;
  while (k < n && save.gold >= cost + wpnCost(id, lvl + k)) { cost += wpnCost(id, lvl + k); k++; }
  if (!k) return { ok: false, msg: 'Gold tak cukup (perlu ' + wpnCost(id, lvl) + ')' };
  save.gold -= cost; save.weapons[id] = lvl + k; return { ok: true, msg: WEAPONS[id].nama + ' Lv.' + (lvl + k) };
}
function weaponHolder(save, wid, except) { if (wid === 'batu') return null; for (const h of HERO_ORDER) if (h !== except && save.heroes[h] && heroWeapon(save, h) === wid) return h; return null; }
function normalizeWeapons(save) {
  const order = save.team.filter(h => save.heroes[h]).concat(HERO_ORDER.filter(h => save.heroes[h] && !save.team.includes(h)));
  const used = new Set(); let moved = 0;
  for (const h of order) {
    let w = heroWeapon(save, h);
    if (w !== 'batu' && used.has(w)) { const sig = HEROES[h].wpn, alt = !used.has(sig) && save.weapons[sig] && canEquip(h, sig) ? sig : WEAPON_ORDER.find(x => save.weapons[x] && !used.has(x) && canEquip(h, x) && !save.team.concat(HERO_ORDER).some(o => o !== h && save.heroes[o] && save.heroWpn[o] === x)); if (alt) save.heroWpn[h] = alt; else delete save.heroWpn[h]; w = alt || 'batu'; moved++; }
    if (w !== 'batu') used.add(w);
  }
  return moved;
}
// pasang senjata terbaik yang belum dipakai pada hero tanpa senjata (pasukan dahulu)
function autoArm(save) { let n = 0; const order = save.team.filter(h => save.heroes[h]).concat(HERO_ORDER.filter(h => save.heroes[h] && !save.team.includes(h)));
  for (const h of order) { if (heroWeapon(save, h) !== 'batu') continue; const used = new Set(order.map(x => heroWeapon(save, x)));
    const sig = HEROES[h].wpn, opts = WEAPON_ORDER.filter(w => save.weapons[w] && !used.has(w) && canEquip(h, w)); if (!opts.length) continue;
    const w = opts.includes(sig) ? sig : opts.sort((a, b) => weaponScore(save, h, b) - weaponScore(save, h, a))[0]; save.heroWpn[h] = w; n++; }
  return n; }
function equipWeapon(save, heroId, wid) {
  if (!save.heroes[heroId] || !save.weapons[wid]) return { ok: false, msg: 'Tidak boleh dipasang' };
  const prev = heroWeapon(save, heroId); if (prev === wid) return { ok: true, msg: HEROES[heroId].nama + ' sudah guna ' + WEAPONS[wid].nama };
  const other = weaponHolder(save, wid, heroId); save.heroWpn[heroId] = wid;
  if (other) { if (prev !== 'batu' && canEquip(other, prev)) save.heroWpn[other] = prev; else delete save.heroWpn[other]; normalizeWeapons(save); const A1 = AFF[wAff(heroId, wid)]; return { ok: true, msg: HEROES[heroId].nama + ' ⇄ ' + HEROES[other].nama + (save.heroWpn[other] ? ': tukar senjata' : ': ' + HEROES[other].nama + ' kini tanpa senjata') + ' · ' + A1.ikon + ' ' + A1.nama }; }
  normalizeWeapons(save); const A0 = AFF[wAff(heroId, wid)]; return { ok: true, msg: HEROES[heroId].nama + ' kini guna ' + WEAPONS[wid].nama + ' · ' + A0.ikon + ' ' + A0.nama + ' (' + A0.desc + ')' };
}
// ---------- Gabung item: 3 item jenis & tahap sama → 1 item tahap seterusnya ----------
function fuseCandidates(save, it) { return save.items.filter(x => x.uid !== it.uid && x.jenis === it.jenis && x.rar === it.rar && !x.lock && !whoEquips(save, x.uid)).sort((a, b) => a.ilvl - b.ilvl); }
function fuseItem(save, uid) {
  const it = itemByUid(save, uid); if (!it) return { ok: false, msg: 'Item tiada' };
  if (it.rar >= RARITY.length - 1) return { ok: false, msg: 'Abadi ialah tahap tertinggi' };
  if (it.lock) return { ok: false, msg: 'Buka kunci 🔒 dahulu' };
  if (whoEquips(save, uid)) return { ok: false, msg: 'Tanggalkan item dahulu' };
  const c = fuseCandidates(save, it); if (c.length < 2) return { ok: false, msg: 'Perlu 2 lagi ' + SLOT_NAMA[it.jenis].toLowerCase() + ' ' + RARITY[it.rar].nama + ' (tidak dipasang, tidak berkunci)' };
  const used = [it, c[0], c[1]], n = { uid: save.nextUid++, jenis: it.jenis, rar: it.rar + 1, ilvl: Math.max(...used.map(x => x.ilvl)), base: it.base }; n.sub = rollSubs(n.jenis, n.rar, n.uid * 7919 + n.rar);
  save.items = save.items.filter(x => !used.includes(x)); save.items.push(n); stat(save, 'fusions'); statMax(save, 'maxRar', n.rar);
  return { ok: true, it: n, msg: 'Gabung berjaya: ' + itemName(n) };
}
function fuseAll(save, maxRar) {
  let n = 0;
  for (let r = 0; r <= maxRar; r++) for (const j of ITEM_JENIS) {
    for (let k = 0; k < 500; k++) { const pool = save.items.filter(x => x.jenis === j && x.rar === r && !x.lock && !whoEquips(save, x.uid)).sort((a, b) => a.ilvl - b.ilvl); if (pool.length < 3) break; if (!fuseItem(save, pool[0].uid).ok) break; n++; }
  }
  return { ok: n > 0, msg: n ? n + ' gabungan berjaya' : 'Tiada 3 item sama tahap untuk digabung' };
}
// ---------- Kadar (dipaparkan di Kedai & Ensiklopedia) ----------
function rarityDist(minRar, luck) { const w = RARITY.map((r, i) => r.p * (i ? Math.pow(1 + 0.06 * (luck || 0), i) : 1)); let t = 0; for (let i = minRar; i < w.length; i++) t += w[i]; return w.map((x, i) => (i < minRar ? 0 : x / t)); }
function shardTierDist(minTier) { const p = TIERS.map(() => 0); let t = 0; HERO_ORDER.filter(h => HEROES[h].tier >= (minTier || 0)).forEach(h => { p[HEROES[h].tier] += shardWeight(h); t += shardWeight(h); }); return p.map(x => x / t); }
function buyWall(save) {
  if (save.wallsOwned >= WALLS.length) return { ok: false, msg: 'Semua 50 pagar sudah dimiliki' };
  const k = save.wallsOwned, c = wallCost(k);
  if (save.gold < c) return { ok: false, msg: 'Gold tak cukup (perlu ' + c + ')' };
  save.gold -= c; save.wallsOwned++; save.wallActive = k; return { ok: true, msg: 'Pagar ' + WALLS[k].nama + ' dibina' };
}
function setWall(save, k) { if (k < 0 || k >= save.wallsOwned) return { ok: false, msg: 'Pagar belum dimiliki' }; save.wallActive = k; return { ok: true, msg: 'Guna pagar ' + WALLS[k].nama }; }
function unlockPower(save, id) {
  if (save.powers[id]) return { ok: false, msg: 'Sudah dimiliki' };
  const c = POWERS[id].harga;
  if (save.gems < c) return { ok: false, msg: 'Gems tak cukup (perlu ' + c + ')' };
  save.gems -= c; save.powers[id] = 1; return { ok: true, msg: POWERS[id].nama + ' dibuka!' };
}
function upgradePower(save, id, n) {
  n = n || 1; const lvl = save.powers[id];
  if (!lvl) return { ok: false, msg: 'Kuasa belum dibuka' };
  let k = 0, cost = 0;
  while (k < n && save.gold >= cost + powCost(id, lvl + k)) { cost += powCost(id, lvl + k); k++; }
  if (!k) return { ok: false, msg: 'Gold tak cukup (perlu ' + powCost(id, lvl) + ')' };
  save.gold -= cost; save.powers[id] = lvl + k; return { ok: true, msg: POWERS[id].nama + ' Lv.' + (lvl + k) };
}
function buyShop(save, id) {
  const s = SHOP[id], lvl = save.shop[id], c = shopCost(id, lvl);
  if (save[s.mata] < c) return { ok: false, msg: (s.mata === 'gold' ? 'Gold' : 'Gems') + ' tak cukup (perlu ' + c + ')' };
  save[s.mata] -= c; save.shop[id] = lvl + 1; return { ok: true, msg: s.nama + ' Lv.' + (lvl + 1) };
}
function buyBoost(save, id, now) {
  const b = BOOSTS[id];
  if (save.gems < b.harga) return { ok: false, msg: 'Gems tak cukup (perlu ' + b.harga + ')' };
  save.gems -= b.harga; save.boost[id] = Math.max(now, save.boost[id] || 0) + b.minit * 60000; stat(save, 'boosts'); return { ok: true, msg: b.nama + ' aktif' };
}
function rollRarity(rng, luck, minRar) {
  const w = RARITY.map((r, i) => r.p * (i ? Math.pow(1 + 0.06 * luck, i) : 1));
  let tot = 0; for (let i = minRar; i < w.length; i++) tot += w[i];
  let x = rng() * tot;
  for (let i = minRar; i < w.length; i++) { x -= w[i]; if (x <= 0) return i; }
  return w.length - 1;
}
function makeItem(save, rng, minRar, jenis) {
  const it = { uid: save.nextUid++, jenis: jenis || rollJenis(rng), rar: rollRarity(rng, save.shop.luck, minRar || 0), ilvl: Math.max(1, effBest(save) - 1 + Math.floor(rng() * 3)), base: Math.floor(rng() * 6) };
  it.sub = rollSubs(it.jenis, it.rar, Math.floor(rng() * 4294967295)); return it;
}
function addItem(save, it) {
  if (it.rar <= save.autoSell) { const v = sellValue(it); save.gold += v; stat(save, 'itemsGot'); stat(save, 'itemsSold'); statMax(save, 'maxRar', it.rar); return { ok: false, sold: v, it, auto: true }; }
  if (save.items.length >= INV_CAP) { const v = sellValue(it); save.gold += v; return { ok: false, sold: v, it }; }
  save.items.push(it); stat(save, 'itemsGot'); statMax(save, 'maxRar', it.rar); return { ok: true, it };
}
function openChestN(save, id, n, rng) { const out = []; for (let i = 0; i < n; i++) { const r = openChest(save, id, rng); if (!r.ok) break; out.push(r); } return out; }
function openHeroChestN(save, kind, n, rng) { const out = []; for (let i = 0; i < n; i++) { const r = openHeroChest(save, kind, rng); if (!r.ok) break; out.push(r); } return out; }
function openSkinChestN(save, n, rng) { const out = []; for (let i = 0; i < n; i++) { const r = openSkinChest(save, rng); if (!r.ok) break; out.push(r); } return out; }
function openChest(save, id, rng) {
  const c = CHESTS[id], cost = chestCost(id, effBest(save));
  if (save[c.mata] < cost) return { ok: false, msg: (c.mata === 'gold' ? 'Gold' : 'Gems') + ' tak cukup (perlu ' + cost + ')' };
  save[c.mata] -= cost; stat(save, 'chests');
  const pityHit = id === 'emas' && (save.pity.emas || 0) >= PITY_N - 1;
  const r = addItem(save, makeItem(save, rng, pityHit ? 5 : c.minRar));
  if (id === 'emas') save.pity.emas = r.it.rar >= 5 ? 0 : (save.pity.emas || 0) + 1;
  return { ok: true, it: r.it, msg: r.ok ? 'Dapat ' + RARITY[r.it.rar].nama + ': ' + itemName(r.it) : 'Beg penuh, item dijual +' + r.sold + ' gold' };
}
function whoEquips(save, uid) {
  const wi = save.wallEquip.indexOf(uid); if (wi >= 0) return { hero: '__pagar', slot: wi };
  for (const h of Object.keys(save.equip)) for (const s of HERO_SLOTS) if (save.equip[h][s] === uid) return { hero: h, slot: s };
  return null;
}
function equipItem(save, uid, heroId) {
  const it = itemByUid(save, uid);
  if (!it) return { ok: false, msg: 'Item tiada' };
  if (it.jenis === 'perisai') return equipWallItem(save, uid);
  if (!save.heroes[heroId]) return { ok: false, msg: 'Tidak boleh dipasang' };
  const prev = whoEquips(save, uid); if (prev) unequipItem(save, uid);
  save.equip[heroId] = save.equip[heroId] || {}; save.equip[heroId][it.jenis] = uid;
  return { ok: true, msg: itemName(it) + ' dipasang pada ' + HEROES[heroId].nama };
}
function equipWallItem(save, uid, slot) {
  const it = itemByUid(save, uid);
  if (!it || it.jenis !== 'perisai') return { ok: false, msg: 'Hanya item perisai untuk pagar' };
  if (save.wallEquip.includes(uid)) return { ok: false, msg: 'Sudah dipasang pada pagar' };
  if (slot == null) {
    slot = save.wallEquip.indexOf(null);
    if (slot < 0) { let lo = 0; save.wallEquip.forEach((u, i) => { if (itemPower(itemByUid(save, u)) < itemPower(itemByUid(save, save.wallEquip[lo]))) lo = i; }); slot = lo; }
  }
  save.wallEquip[slot] = uid; return { ok: true, msg: itemName(it) + ' dipasang pada pagar (slot ' + (slot + 1) + ')' };
}
function unequipItem(save, uid) {
  const p = whoEquips(save, uid); if (!p) return { ok: false, msg: 'Tidak dipasang' };
  if (p.hero === '__pagar') save.wallEquip[p.slot] = null; else delete save.equip[p.hero][p.slot];
  return { ok: true, msg: 'Item ditanggalkan' };
}
function forgeItem(save, uid) {
  const it = itemByUid(save, uid); if (!it) return { ok: false, msg: 'Item tiada' };
  const c = forgeCost(it); if (save.gold < c) return { ok: false, msg: 'Gold tak cukup (perlu ' + c + ')' };
  save.gold -= c; it.ilvl++; stat(save, 'forges'); return { ok: true, msg: itemName(it) };
}
function sellItem(save, uid) {
  const i = save.items.findIndex(x => x.uid === uid); if (i < 0) return { ok: false, msg: 'Item tiada' };
  if (save.items[i].lock) return { ok: false, msg: 'Item dikunci 🔒. Buka kunci dahulu' };
  if (whoEquips(save, uid)) unequipItem(save, uid);
  const v = sellValue(save.items[i]); save.gold += v; save.items.splice(i, 1); stat(save, 'itemsSold');
  return { ok: true, msg: 'Dijual +' + v + ' gold' };
}
function sellAllBelow(save, rar) {
  let n = 0, g = 0;
  save.items = save.items.filter(it => { if (it.rar <= rar && !it.lock && !whoEquips(save, it.uid)) { g += sellValue(it); n++; return false; } return true; });
  save.gold += g; stat(save, 'itemsSold', n); return { ok: n > 0, msg: n ? n + ' item dijual +' + g + ' gold' : 'Tiada item untuk dijual' };
}
function autoEquipBest(save) {
  let n = 0;
  for (const j of HERO_SLOTS) {
    const its = save.items.filter(i => i.jenis === j).sort((a, b) => itemKey(b) - itemKey(a));
    save.team.forEach((h, i) => { if (its[i] && (save.equip[h] || {})[j] !== its[i].uid) { equipItem(save, its[i].uid, h); n++; } });
  }
  const ps = save.items.filter(i => i.jenis === 'perisai').sort((a, b) => itemPower(b) - itemPower(a)).slice(0, WALL_SLOTS);
  const want = ps.map(i => i.uid);
  if (want.join() !== save.wallEquip.filter(x => x != null).join()) { save.wallEquip = [0, 1, 2].map(i => want[i] ?? null); n += want.length; }
  return n;
}
function jumpSize(maxZY) { const d = maxZY / WALL_Y; return d < 0.35 ? 5 : d < 0.5 ? 4 : d < 0.65 ? 3 : 2; }
function winStage(save, stage, rng) {
  let gems = 0;
  if (!save.cleared.includes(stage)) { gems = Math.round(firstPassGems(stage) * diffOf(save).gems); save.gems += gems; stat(save, 'gemsGot', gems); save.cleared.push(stage); addShards(save, randomShardHero(rng || Math.random), 5); if (save.wpeti) { if (isBigBoss(stage)) save.wpeti.kayu++; if (stage % 50 === 0) { save.wpeti.leg++; stat(save, 'wLegGot'); } } }
  save.best = Math.max(save.best, stage + 1); save.stage = Math.min(save.best, stage + 1);
  return gems;
}
function mulberry(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------- v9.2: jenis senjata (Fizikal / Magis) & sasaran (Darat / Udara) ----------
const W_MAGIS = ['frost', 'api', 'petir', 'doktor', 'racun', 'laser', 'tesla', 'nitrogen', 'napalm', 'plasma', 'tongkat_r', 'ais_g', 'tukul'];
const W_DARAT = ['shotgun', 'lima', 'bom', 'meriam', 'mortar', 'bumerang', 'gergaji', 'nitrogen', 'napalm', 'racun', 'ais_g'];
Object.keys(WEAPONS).forEach(id => { const w = WEAPONS[id]; w.jenis = W_MAGIS.includes(id) ? 'm' : 'f'; w.udara = !W_DARAT.includes(id); w.aa = id === 'roket' || id === 'peluru_p' ? 1.5 : 1; w.bossB = id === 'sniper' ? 0.3 : 0; });
const T_DARAT = ['meriam', 'api', 'racun'];
Object.keys(TOWERS).forEach(t => { TOWERS[t].udara = !T_DARAT.includes(t) && !!(WEAPONS[TOWERS[t].wid] || {}).udara; });
TOWERS.tukang.udara = false;
const JENIS_NAMA = { f: '🗡 Fizikal', m: '✨ Magis' };
// ---------- v9.4: keluarga senjata, kelas hero, peranan, kepakaran, kelangkaan senjata ----------
const FAM = { biasa: { nama: 'Api biasa', ikon: '🔫' }, serak: { nama: 'Serakan', ikon: '💥' }, tepat: { nama: 'Tepat', ikon: '🎯' }, letup: { nama: 'Letupan', ikon: '💣' }, lontar: { nama: 'Lontar', ikon: '🌀' }, ais: { nama: 'Ais', ikon: '❄' }, api: { nama: 'Api', ikon: '🔥' }, racun: { nama: 'Racun', ikon: '☠' }, elektrik: { nama: 'Elektrik', ikon: '⚡' }, tenaga: { nama: 'Tenaga', ikon: '🔆' }, sokong: { nama: 'Sokongan', ikon: '💚' }, angin: { nama: 'Angin', ikon: '💨' }, bumi: { nama: 'Bumi', ikon: '🪨' }, air: { nama: 'Air', ikon: '💧' }, cahaya: { nama: 'Cahaya', ikon: '✨' }, bayang: { nama: 'Bayang', ikon: '🌑' } };
const FAM_OF = { biasa: ['pistol', 'revolver', 'smg', 'mesingan', 'minigun'], serak: ['shotgun', 'lima'], tepat: ['sniper', 'railgun'], letup: ['bom', 'roket', 'peluru_p', 'meriam', 'mortar'], lontar: ['lastik', 'shuriken', 'bumerang', 'silang', 'gergaji'], ais: ['frost', 'nitrogen', 'ais_g'], api: ['api', 'napalm'], racun: ['racun', 'tongkat_r'], elektrik: ['petir', 'tesla', 'tukul'], tenaga: ['laser', 'plasma'], sokong: ['doktor'], angin: [], bumi: [], air: [], cahaya: [], bayang: [] };
const W_FAM = {}; Object.keys(FAM_OF).forEach(f => FAM_OF[f].forEach(w => { W_FAM[w] = f; }));
const KELAS = {
  penembak:  { nama: 'Penembak',      ikon: '🔫', fam: ['biasa', 'serak', 'angin'] },
  jitu:      { nama: 'Penembak Jitu', ikon: '🎯', fam: ['tepat', 'biasa', 'cahaya'] },
  robo:      { nama: 'Perobohan',     ikon: '💣', fam: ['letup', 'biasa', 'bumi'] },
  pemburu:   { nama: 'Pemburu',       ikon: '🌀', fam: ['lontar', 'api', 'bayang'] },
  salji:     { nama: 'Penjaga Salji', ikon: '❄', fam: ['ais', 'racun', 'air'] },
  sihir:     { nama: 'Ahli Sihir',    ikon: '⚡', fam: ['elektrik', 'tenaga', 'bayang'] },
  penyembuh: { nama: 'Penyembuh',     ikon: '💚', fam: ['sokong', 'racun', 'cahaya'] }
};
const PERANAN = {
  penjaga:  { nama: 'Penjaga',        ikon: '🛡', desc: 'HP pagar +8%, perisai pagar +3%' },
  laju:     { nama: 'Penembak Laju',  ikon: '⚡', desc: 'Laju tembak +20%' },
  tepat:    { nama: 'Penembak Tepat', ikon: '🎯', desc: 'Kritikal +15%, jarak +10%' },
  robo:     { nama: 'Perobohan',      ikon: '💥', desc: 'Kawasan letupan +25%' },
  sihir:    { nama: 'Ahli Sihir',     ikon: '✨', desc: 'Damage Magis +20%' },
  pejuang:  { nama: 'Pejuang',        ikon: '🗡', desc: 'Damage Fizikal +20%' },
  penyembuh: { nama: 'Penyembuh',     ikon: '💚', desc: 'Pagar pulih 0.3% sesaat' },
  pemimpin: { nama: 'Pemimpin',       ikon: '🎖', desc: 'Semua hero +5% damage' }
};
const HERO_KP = { pistol: ['penembak', 'penjaga'], budak: ['pemburu', 'laju'], shotgun: ['penembak', 'penjaga'], mesingan: ['penembak', 'laju'], sniper: ['jitu', 'tepat'], frost: ['salji', 'sihir'], bom: ['robo', 'robo'], api: ['pemburu', 'sihir'], tukang: ['pemburu', 'penjaga'], petir: ['sihir', 'sihir'], doktor: ['penyembuh', 'penyembuh'], roket: ['robo', 'robo'], racun: ['salji', 'sihir'], koboi: ['penembak', 'tepat'], laser: ['sihir', 'pemimpin'], ninja: ['pemburu', 'laju'], askar: ['penembak', 'pemimpin'], saintis: ['sihir', 'sihir'], jurutera: ['sihir', 'pemimpin'], ratu_ais: ['salji', 'sihir'], pahlawan: ['sihir', 'pejuang'], komander: ['jitu', 'pemimpin'] };
Object.keys(HERO_KP).forEach(h => { HEROES[h].kelas = HERO_KP[h][0]; HEROES[h].peranan = HERO_KP[h][1]; HEROES[h].pakar = W_FAM[HEROES[h].wpn]; });
// v9.7: semua hero boleh pakai semua senjata; kesan ikut padanan ⭐ Pakar / ✅ Sekelas / ⚠ Luar kelas
function canEquip(heroId, wid) { return !!(HEROES[heroId] && WEAPONS[wid] && wid !== 'batu'); }
function inClass(heroId, wid) { const H = HEROES[heroId]; return !!(H && WEAPONS[wid] && wid !== 'batu' && KELAS[H.kelas].fam.includes(W_FAM[wid])); }
const AFF = { pakar: { nama: 'Pakar', ikon: '⭐', dmg: 1.3, rate: 1.1, desc: '+30% damage, +10% laju' }, kelas: { nama: 'Sekelas', ikon: '✅', dmg: 1.1, rate: 1, desc: '+10% damage' }, luar: { nama: 'Luar kelas', ikon: '⚠', dmg: 0.6, rate: 0.8, desc: '−40% damage, −20% laju' }, batu: { nama: 'Tiada senjata', ikon: '🪨', dmg: 1, rate: 1, desc: 'Baling Batu' } };
const AFF_ORD = { pakar: 0, kelas: 1, luar: 2, batu: 3 };
// pilihan senjata untuk hero: Pakar → Sekelas → Luar kelas, kemudian level tertinggi
function wpnChoices(save, heroId) { return Object.keys(save.weapons).filter(w => WEAPONS[w] && w !== 'batu').sort((a, b) => AFF_ORD[wAff(heroId, a)] - AFF_ORD[wAff(heroId, b)] || (save.weapons[b] || 0) - (save.weapons[a] || 0)); }
function wAff(heroId, wid) { const H = HEROES[heroId]; if (!H || !WEAPONS[wid] || wid === 'batu') return 'batu'; if (W_FAM[wid] === H.pakar) return 'pakar'; return inClass(heroId, wid) ? 'kelas' : 'luar'; }
const W_RAR_LIST = [['pistol', 'lastik', 'revolver', 'smg', 'bumerang', 'doktor'], ['shotgun', 'mesingan', 'frost', 'bom', 'api', 'shuriken', 'petir', 'racun'], ['sniper', 'silang', 'roket', 'gergaji', 'lima', 'napalm', 'mortar', 'meriam'], ['minigun', 'laser', 'tesla', 'nitrogen', 'plasma', 'tongkat_r', 'peluru_p'], ['ais_g', 'tukul', 'railgun']];
const W_RAR_NAMA = [{ nama: 'Biasa', ikon: '⚪', warna: '#B8C2CC' }, { nama: 'Jarang', ikon: '🟢', warna: '#4FB06A' }, { nama: 'Epik', ikon: '🔵', warna: '#3B9BE0' }, { nama: 'Legenda', ikon: '🟣', warna: '#A066E8' }, { nama: 'Mitos', ikon: '🟠', warna: '#F07A2E' }];
W_RAR_LIST.forEach((l, r) => l.forEach(w => { WEAPONS[w].rar = r; }));
const W_PRICE = [{ gold: 1500 }, { gems: 60 }, { gems: 150 }, { gems: 300 }, { gems: 600 }];
function weaponPrice(wid) { return W_PRICE[WEAPONS[wid].rar || 0]; }
// ==== GEN v9.8 MULA: 200 senjata (dijana oleh tools/senjata200/gen.js — jangan sunting dengan tangan) ====
const W_GEN = {
  w_pistol_saku: {"nama":"Pistol Saku","dmg":10,"rate":1.6,"range":340,"laras":14,"peluru":"#FFD54A","harga":100,"fam":"biasa","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"perk":[],"desc":"Seimbang dan stabil"},
  w_pistol_polis: {"nama":"Pistol Polis","dmg":10,"rate":1.6,"range":340,"laras":14,"peluru":"#FFD54A","harga":100,"fam":"biasa","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"perk":[],"desc":"Seimbang dan stabil"},
  w_senapang_peronda: {"nama":"Senapang Peronda","dmg":20.7,"rate":1.1,"range":380,"laras":22,"peluru":"#FFC36A","harga":200,"fam":"biasa","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"perk":[],"desc":"Seimbang dan stabil"},
  w_smg_kancil: {"nama":"SMG Kancil","dmg":5.8,"rate":4,"range":290,"laras":18,"peluru":"#FFC36A","harga":200,"fam":"biasa","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"smg","gen":1,"spread":0.1,"perk":[],"desc":"Tembakan sangat laju"},
  w_karbin_ringan: {"nama":"Karbin Ringan","dmg":5.8,"rate":4,"range":290,"laras":18,"peluru":"#FFC36A","harga":200,"fam":"biasa","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"smg","gen":1,"spread":0.1,"perk":[],"desc":"Tembakan sangat laju"},
  w_senapang_serbu: {"nama":"Senapang Serbu","dmg":23.4,"rate":1.265,"range":380,"laras":22,"peluru":"#FFE07A","harga":300,"fam":"biasa","rar":2,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"perk":["pantas"],"desc":"Seimbang dan stabil"},
  w_mesingan_berat: {"nama":"Mesingan Berat","dmg":3.9,"rate":9.2,"range":300,"laras":22,"peluru":"#FFE07A","harga":300,"fam":"biasa","rar":2,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"gatling","gen":1,"spread":0.08,"perk":["pantas"],"desc":"Tembakan sangat laju"},
  w_gatling_diraja: {"nama":"Gatling Diraja","dmg":4.4,"rate":9.8,"range":300,"laras":22,"peluru":"#FFD54A","harga":400,"fam":"biasa","rar":3,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"gatling","gen":1,"spread":0.08,"perk":["pantas+"],"desc":"Tembakan sangat laju"},
  w_senapang_harimau: {"nama":"Senapang Harimau","dmg":26.1,"rate":1.348,"range":380,"laras":22,"peluru":"#FFD54A","harga":400,"fam":"biasa","rar":3,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"perk":["pantas+"],"desc":"Seimbang dan stabil"},
  w_gatling_naga_emas: {"nama":"Gatling Naga Emas","dmg":4.8,"rate":9.2,"range":300,"laras":20,"peluru":"#FFC36A","harga":500,"fam":"biasa","rar":4,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"spread":0.08,"perk":["pantas","mitos_kembar"],"mitos":"kembar","desc":"Tembakan sangat laju"},
  w_senapang_tumpul: {"nama":"Senapang Tumpul","dmg":7,"rate":1,"range":260,"laras":20,"peluru":"#FF9EC8","harga":100,"fam":"serak","rar":0,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"patah","gen":1,"n":3,"spread":0.22,"perk":[],"desc":"3 peluru serentak"},
  w_senapang_pam: {"nama":"Senapang Pam","dmg":7,"rate":1,"range":260,"laras":20,"peluru":"#FF9EC8","harga":100,"fam":"serak","rar":0,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"patah","gen":1,"n":3,"spread":0.22,"perk":[],"desc":"3 peluru serentak"},
  w_senapang_dua_laras: {"nama":"Senapang Dua Laras","dmg":18.4,"rate":0.8,"range":300,"laras":20,"peluru":"#FFB070","harga":200,"fam":"serak","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"patah","gen":1,"n":2,"spread":0.1,"perk":[],"desc":"2 peluru serentak"},
  w_pelempar_paku: {"nama":"Pelempar Paku","dmg":6.9,"rate":0.8,"range":260,"laras":24,"peluru":"#FFB070","harga":200,"fam":"serak","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"n":5,"spread":0.3,"perk":[],"desc":"5 peluru serentak"},
  w_senapang_kuda: {"nama":"Senapang Kuda","dmg":18.4,"rate":0.8,"range":300,"laras":20,"peluru":"#FFB070","harga":200,"fam":"serak","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"patah","gen":1,"n":2,"spread":0.1,"perk":[],"desc":"2 peluru serentak"},
  w_senapang_serbu_pam: {"nama":"Senapang Serbu Pam","dmg":9.1,"rate":1,"range":260,"laras":20,"peluru":"#FF9EC8","harga":300,"fam":"serak","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"patah","gen":1,"n":3,"spread":0.22,"perk":["pecah"],"pen":25,"desc":"3 peluru serentak, Tembus perisai 25%"},
  w_meriam_kaca: {"nama":"Meriam Kaca","dmg":20.8,"rate":0.8,"range":300,"laras":22,"peluru":"#FF9EC8","harga":300,"fam":"serak","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"n":2,"spread":0.1,"perk":["pecah"],"pen":25,"desc":"2 peluru serentak, Tembus perisai 25%"},
  w_senapang_ribut: {"nama":"Senapang Ribut","dmg":8.7,"rate":0.8,"range":260,"laras":20,"peluru":"#FFB070","harga":400,"fam":"serak","rar":3,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"patah","gen":1,"n":5,"spread":0.3,"perk":["pecah+"],"pen":38,"desc":"5 peluru serentak, Tembus perisai 38%"},
  w_senapang_seribu_butir: {"nama":"Senapang Seribu Butir","dmg":8.7,"rate":0.8,"range":260,"laras":20,"peluru":"#FFB070","harga":400,"fam":"serak","rar":3,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"patah","gen":1,"n":5,"spread":0.3,"perk":["pecah+"],"pen":38,"desc":"5 peluru serentak, Tembus perisai 38%"},
  w_senapang_petala_langit: {"nama":"Senapang Petala Langit","dmg":9.6,"rate":0.8,"range":260,"laras":20,"peluru":"#FF9EC8","harga":500,"fam":"serak","rar":4,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"n":5,"spread":0.3,"perk":["pecah","mitos_lantun"],"pen":25,"mitos":"lantun","desc":"5 peluru serentak, Tembus perisai 25%"},
  w_senapang_burung: {"nama":"Senapang Burung","dmg":36,"rate":0.45,"range":560,"laras":26,"peluru":"#B6F27A","harga":100,"fam":"tepat","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":3,"perk":[],"desc":"Tembus 3"},
  w_senapang_kayu: {"nama":"Senapang Kayu","dmg":36,"rate":0.45,"range":560,"laras":26,"peluru":"#B6F27A","harga":100,"fam":"tepat","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":3,"perk":[],"desc":"Tembus 3"},
  w_senapang_pemburu: {"nama":"Senapang Pemburu","dmg":23,"rate":0.8,"range":500,"laras":26,"peluru":"#D8FFB0","harga":200,"fam":"tepat","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":2,"perk":[],"desc":"Tembus 2"},
  w_senapang_teropong: {"nama":"Senapang Teropong","dmg":23,"rate":0.8,"range":500,"laras":26,"peluru":"#D8FFB0","harga":200,"fam":"tepat","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":2,"perk":[],"desc":"Tembus 2"},
  w_senapang_bolt: {"nama":"Senapang Bolt","dmg":41.4,"rate":0.45,"range":560,"laras":26,"peluru":"#D8FFB0","harga":200,"fam":"tepat","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":3,"perk":[],"desc":"Tembus 3"},
  w_sniper_senyap: {"nama":"Sniper Senyap","dmg":26,"rate":0.8,"range":500,"laras":26,"peluru":"#B6F27A","harga":300,"fam":"tepat","rar":2,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":2,"perk":["kritik"],"critB":0.1,"desc":"Tembus 2, +10% kritikal"},
  w_sniper_gunung: {"nama":"Sniper Gunung","dmg":46.8,"rate":0.45,"range":560,"laras":26,"peluru":"#B6F27A","harga":300,"fam":"tepat","rar":2,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":3,"perk":["kritik"],"critB":0.1,"desc":"Tembus 3, +10% kritikal"},
  w_sniper_helang: {"nama":"Sniper Helang","dmg":52.2,"rate":0.45,"range":560,"laras":26,"peluru":"#D8FFB0","harga":400,"fam":"tepat","rar":3,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":3,"perk":["kritik+"],"critB":0.15,"desc":"Tembus 3, +15% kritikal"},
  w_senapang_anti_kebal: {"nama":"Senapang Anti-Kebal","dmg":79.8,"rate":0.28,"range":680,"laras":26,"peluru":"#D8FFB0","harga":400,"fam":"tepat","rar":3,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"sniper","gen":1,"pierce":99,"perk":["kritik+"],"critB":0.15,"desc":"Tembus semua, +15% kritikal"},
  w_sniper_bintang_kejora: {"nama":"Sniper Bintang Kejora","dmg":88,"rate":0.28,"range":680,"laras":20,"peluru":"#B6F27A","harga":500,"fam":"tepat","rar":4,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"pierce":99,"perk":["kritik","mitos_lantun"],"critB":0.1,"mitos":"lantun","desc":"Tembus semua, +10% kritikal"},
  w_mercun_besar: {"nama":"Mercun Besar","dmg":14,"rate":0.7,"range":300,"laras":10,"peluru":"#FF8A3A","harga":100,"fam":"letup","rar":0,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"bom","gen":1,"splash":45,"perk":[],"desc":"Letupan kawasan"},
  w_bom_kelapa: {"nama":"Bom Kelapa","dmg":14,"rate":0.7,"range":300,"laras":10,"peluru":"#FF8A3A","harga":100,"fam":"letup","rar":0,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"bom","gen":1,"splash":45,"perk":[],"desc":"Letupan kawasan"},
  w_pelancar_bunga_api: {"nama":"Pelancar Bunga Api","dmg":43.7,"rate":0.35,"range":420,"laras":24,"peluru":"#FFB04A","harga":200,"fam":"letup","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"splash":65,"perk":[],"desc":"Letupan kawasan"},
  w_bom_lekit: {"nama":"Bom Lekit","dmg":16.1,"rate":0.7,"range":300,"laras":10,"peluru":"#FFB04A","harga":200,"fam":"letup","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"bom","gen":1,"splash":45,"perk":[],"desc":"Letupan kawasan"},
  w_pelontar_bom_tangan: {"nama":"Pelontar Bom Tangan","dmg":16.1,"rate":0.7,"range":300,"laras":24,"peluru":"#FFB04A","harga":200,"fam":"letup","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"splash":45,"perk":[],"desc":"Letupan kawasan"},
  w_roket_berkembar: {"nama":"Roket Berkembar","dmg":49.4,"rate":0.35,"range":420,"laras":24,"peluru":"#FF8A3A","harga":300,"fam":"letup","rar":2,"jenis":"f","udara":true,"aa":1,"bossB":0.25,"bentuk":"pelancar","gen":1,"splash":65,"perk":["boss"],"desc":"Letupan kawasan"},
  w_bom_kluster: {"nama":"Bom Kluster","dmg":18.2,"rate":0.7,"range":300,"laras":10,"peluru":"#FF8A3A","harga":300,"fam":"letup","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0.25,"bentuk":"bom","gen":1,"splash":45,"perk":["boss"],"desc":"Letupan kawasan"},
  w_meriam_kapal_perang: {"nama":"Meriam Kapal Perang","dmg":40.6,"rate":0.4,"range":380,"laras":22,"peluru":"#FFB04A","harga":400,"fam":"letup","rar":3,"jenis":"f","udara":false,"aa":1,"bossB":0.375,"bentuk":"meriam","gen":1,"splash":55,"perk":["boss+"],"desc":"Letupan kawasan"},
  w_roket_gergasi: {"nama":"Roket Gergasi","dmg":55.1,"rate":0.35,"range":420,"laras":24,"peluru":"#FFB04A","harga":400,"fam":"letup","rar":3,"jenis":"f","udara":true,"aa":1,"bossB":0.375,"bentuk":"pelancar","gen":1,"splash":65,"perk":["boss+"],"desc":"Letupan kawasan"},
  w_meriam_gunung_berapi: {"nama":"Meriam Gunung Berapi","dmg":44.8,"rate":0.4,"range":380,"laras":20,"peluru":"#FF8A3A","harga":500,"fam":"letup","rar":4,"jenis":"f","udara":false,"aa":1,"bossB":0.25,"bentuk":"mitos","gen":1,"splash":55,"perk":["boss","mitos_meletup"],"mitos":"meletup","desc":"Letupan kawasan"},
  w_lembing_kayu: {"nama":"Lembing Kayu","dmg":18,"rate":0.8,"range":420,"laras":24,"peluru":"#D8DDE6","harga":100,"fam":"lontar","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"pierce":2,"perk":[],"desc":"Tembus 2"},
  w_pelontar_guli: {"nama":"Pelontar Guli","dmg":6,"rate":2.2,"range":280,"laras":24,"peluru":"#D8DDE6","harga":100,"fam":"lontar","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"perk":[],"desc":"Seimbang dan stabil"},
  w_panah_buluh: {"nama":"Panah Buluh","dmg":20.7,"rate":0.8,"range":420,"laras":14,"peluru":"#C9A06A","harga":200,"fam":"lontar","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"pierce":2,"perk":[],"desc":"Tembus 2"},
  w_cakera_besi: {"nama":"Cakera Besi","dmg":10.4,"rate":1,"range":300,"laras":10,"peluru":"#C9A06A","harga":200,"fam":"lontar","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"cakera","gen":1,"pierce":4,"perk":[],"desc":"Tembus 4"},
  w_kerambit_terbang: {"nama":"Kerambit Terbang","dmg":9.2,"rate":2,"range":300,"laras":8,"peluru":"#C9A06A","harga":200,"fam":"lontar","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"bintang","gen":1,"n":2,"spread":0.15,"perk":[],"desc":"2 peluru serentak"},
  w_busur_berganda: {"nama":"Busur Berganda","dmg":23.4,"rate":0.8,"range":420,"laras":14,"peluru":"#D8DDE6","harga":300,"fam":"lontar","rar":2,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"busur","gen":1,"pierce":2,"perk":["udara"],"desc":"Tembus 2, Kuat lawan zombie terbang"},
  w_cakera_gergaji: {"nama":"Cakera Gergaji","dmg":11.7,"rate":1,"range":300,"laras":10,"peluru":"#D8DDE6","harga":300,"fam":"lontar","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"cakera","gen":1,"pierce":6,"perk":["tembus"],"desc":"Tembus 6"},
  w_busur_rajawali: {"nama":"Busur Rajawali","dmg":26.1,"rate":0.8,"range":420,"laras":14,"peluru":"#C9A06A","harga":400,"fam":"lontar","rar":3,"jenis":"f","udara":true,"aa":1.75,"bossB":0,"bentuk":"busur","gen":1,"pierce":2,"perk":["udara+"],"desc":"Tembus 2, Kuat lawan zombie terbang"},
  w_bumerang_diraja: {"nama":"Bumerang Diraja","dmg":13.1,"rate":1,"range":300,"laras":10,"peluru":"#C9A06A","harga":400,"fam":"lontar","rar":3,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"cakera","gen":1,"pierce":7,"perk":["tembus+"],"desc":"Tembus 7"},
  w_panah_seribu_bulan: {"nama":"Panah Seribu Bulan","dmg":28.8,"rate":0.8,"range":420,"laras":20,"peluru":"#D8DDE6","harga":500,"fam":"lontar","rar":4,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"mitos","gen":1,"pierce":2,"perk":["udara","mitos_kembar"],"mitos":"kembar","desc":"Tembus 2, Kuat lawan zombie terbang"},
  w_penyembur_salji: {"nama":"Penyembur Salji","dmg":5,"rate":1.2,"range":320,"laras":18,"peluru":"#9FE6FF","harga":100,"fam":"ais","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"penyembur","gen":1,"slow":0.45,"perk":[],"desc":"Perlahan 45%"},
  w_bola_salji: {"nama":"Bola Salji","dmg":5,"rate":1.2,"range":320,"laras":10,"peluru":"#9FE6FF","harga":100,"fam":"ais","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"bom","gen":1,"slow":0.45,"perk":[],"desc":"Perlahan 45%"},
  w_pistol_sejuk_beku: {"nama":"Pistol Sejuk Beku","dmg":5.8,"rate":1.2,"range":320,"laras":14,"peluru":"#CFF4FF","harga":200,"fam":"ais","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"slow":0.45,"perk":[],"desc":"Perlahan 45%"},
  w_lembing_ais: {"nama":"Lembing Ais","dmg":16.1,"rate":0.7,"range":400,"laras":24,"peluru":"#CFF4FF","harga":200,"fam":"ais","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"pierce":3,"slow":0.3,"perk":[],"desc":"Tembus 3, Perlahan 30%"},
  w_meriam_salji: {"nama":"Meriam Salji","dmg":6.9,"rate":0.8,"range":320,"laras":22,"peluru":"#CFF4FF","harga":200,"fam":"ais","rar":1,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":35,"slow":0.6,"perk":[],"desc":"Letupan kawasan, Perlahan 60%"},
  w_senapang_fros: {"nama":"Senapang Fros","dmg":18.2,"rate":0.7,"range":400,"laras":22,"peluru":"#9FE6FF","harga":300,"fam":"ais","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0.25,"bentuk":"senapang","gen":1,"pierce":3,"slow":0.3,"perk":["boss"],"desc":"Tembus 3, Perlahan 30%"},
  w_ribut_salji_mini: {"nama":"Ribut Salji Mini","dmg":7.8,"rate":0.8,"range":320,"laras":22,"peluru":"#9FE6FF","harga":300,"fam":"ais","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0.25,"bentuk":"meriam","gen":1,"splash":35,"slow":0.6,"perk":["boss"],"desc":"Letupan kawasan, Perlahan 60%"},
  w_tombak_glasier: {"nama":"Tombak Glasier","dmg":20.3,"rate":0.7,"range":400,"laras":24,"peluru":"#CFF4FF","harga":400,"fam":"ais","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0.375,"bentuk":"tombak","gen":1,"pierce":3,"slow":0.3,"perk":["boss+"],"desc":"Tembus 3, Perlahan 30%"},
  w_busur_kutub: {"nama":"Busur Kutub","dmg":20.3,"rate":0.7,"range":400,"laras":14,"peluru":"#CFF4FF","harga":400,"fam":"ais","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0.375,"bentuk":"busur","gen":1,"pierce":3,"slow":0.3,"perk":["boss+"],"desc":"Tembus 3, Perlahan 30%"},
  w_mahkota_zaman_ais: {"nama":"Mahkota Zaman Ais","dmg":9.6,"rate":0.8,"range":320,"laras":20,"peluru":"#9FE6FF","harga":500,"fam":"ais","rar":4,"jenis":"m","udara":false,"aa":1,"bossB":0.25,"bentuk":"mitos","gen":1,"splash":35,"slow":0.6,"perk":["boss","mitos_beku"],"mitos":"beku","desc":"Letupan kawasan, Perlahan 60%"},
  w_obor: {"nama":"Obor","dmg":6,"rate":1.3,"range":300,"laras":14,"peluru":"#FF6A2B","harga":100,"fam":"api","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"obor","gen":1,"burn":1,"perk":[],"desc":"Bakar"},
  w_pistol_suar: {"nama":"Pistol Suar","dmg":6,"rate":1.3,"range":300,"laras":14,"peluru":"#FF6A2B","harga":100,"fam":"api","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"burn":1,"perk":[],"desc":"Bakar"},
  w_penyembur_api: {"nama":"Penyembur Api","dmg":4.6,"rate":2.4,"range":240,"laras":18,"peluru":"#FFB04A","harga":200,"fam":"api","rar":1,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"penyembur","gen":1,"burn":0.8,"perk":[],"desc":"Bakar"},
  w_panah_bara: {"nama":"Panah Bara","dmg":6.9,"rate":1.3,"range":300,"laras":14,"peluru":"#FFB04A","harga":200,"fam":"api","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"burn":1,"perk":[],"desc":"Bakar"},
  w_lastik_api: {"nama":"Lastik Api","dmg":6.9,"rate":1.3,"range":300,"laras":12,"peluru":"#FFB04A","harga":200,"fam":"api","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"lastik","gen":1,"burn":1,"perk":[],"desc":"Bakar"},
  w_meriam_lava: {"nama":"Meriam Lava","dmg":7.8,"rate":0.6,"range":320,"laras":22,"peluru":"#FF6A2B","harga":300,"fam":"api","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":40,"burn":1.5,"perk":["ganda"],"ganda":2,"desc":"Letupan kawasan, Bakar"},
  w_pelontar_bara: {"nama":"Pelontar Bara","dmg":7.8,"rate":0.6,"range":320,"laras":24,"peluru":"#FF6A2B","harga":300,"fam":"api","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"splash":40,"burn":1.5,"perk":["ganda"],"ganda":2,"desc":"Letupan kawasan, Bakar"},
  w_penyembur_naga: {"nama":"Penyembur Naga","dmg":5.8,"rate":2.4,"range":240,"laras":18,"peluru":"#FFB04A","harga":400,"fam":"api","rar":3,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"penyembur","gen":1,"burn":0.8,"perk":["ganda+"],"ganda":2.5,"desc":"Bakar"},
  w_tombak_magma: {"nama":"Tombak Magma","dmg":8.7,"rate":0.6,"range":320,"laras":24,"peluru":"#FFB04A","harga":400,"fam":"api","rar":3,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"splash":40,"burn":1.5,"perk":["ganda+"],"ganda":2.5,"desc":"Letupan kawasan, Bakar"},
  w_sayap_feniks: {"nama":"Sayap Feniks","dmg":9.6,"rate":1.3,"range":300,"laras":20,"peluru":"#FF6A2B","harga":500,"fam":"api","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"burn":1,"perk":["ganda","mitos_abadi"],"ganda":2,"mitos":"abadi","desc":"Bakar"},
  w_botol_racun: {"nama":"Botol Racun","dmg":5,"rate":0.7,"range":320,"laras":10,"peluru":"#A6F05A","harga":100,"fam":"racun","rar":0,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"botol","gen":1,"splash":40,"burn":1,"perk":[],"desc":"Letupan kawasan, Bakar"},
  w_sumpit_racun: {"nama":"Sumpit Racun","dmg":7,"rate":1.4,"range":340,"laras":24,"peluru":"#A6F05A","harga":100,"fam":"racun","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"sumpit","gen":1,"burn":1,"perk":[],"desc":"Bakar"},
  w_penyembur_lendir: {"nama":"Penyembur Lendir","dmg":4.6,"rate":1.1,"range":320,"laras":18,"peluru":"#7AD050","harga":200,"fam":"racun","rar":1,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"penyembur","gen":1,"slow":0.25,"burn":0.8,"perk":[],"desc":"Perlahan 25%, Bakar"},
  w_pistol_asid: {"nama":"Pistol Asid","dmg":8,"rate":1.4,"range":340,"laras":14,"peluru":"#7AD050","harga":200,"fam":"racun","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"burn":1,"perk":[],"desc":"Bakar"},
  w_bom_kabus: {"nama":"Bom Kabus","dmg":5.8,"rate":0.7,"range":320,"laras":10,"peluru":"#7AD050","harga":200,"fam":"racun","rar":1,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"bom","gen":1,"splash":40,"burn":1,"perk":[],"desc":"Letupan kawasan, Bakar"},
  w_meriam_asid: {"nama":"Meriam Asid","dmg":6.5,"rate":0.7,"range":320,"laras":22,"peluru":"#A6F05A","harga":300,"fam":"racun","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":40,"burn":1,"perk":["pecah"],"pen":25,"desc":"Letupan kawasan, Bakar"},
  w_senapang_lumpur_toksik: {"nama":"Senapang Lumpur Toksik","dmg":5.2,"rate":1.1,"range":320,"laras":22,"peluru":"#A6F05A","harga":300,"fam":"racun","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"slow":0.25,"burn":0.8,"perk":["pecah"],"pen":25,"desc":"Perlahan 25%, Bakar"},
  w_tongkat_paya: {"nama":"Tongkat Paya","dmg":10.2,"rate":1.4,"range":340,"laras":18,"peluru":"#7AD050","harga":400,"fam":"racun","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"burn":1,"perk":["pecah+"],"pen":38,"desc":"Bakar, Tembus perisai 38%"},
  w_busur_ular_tedung: {"nama":"Busur Ular Tedung","dmg":10.2,"rate":1.4,"range":340,"laras":14,"peluru":"#7AD050","harga":400,"fam":"racun","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"burn":1,"perk":["pecah+"],"pen":38,"desc":"Bakar, Tembus perisai 38%"},
  w_jantung_hutan_beracun: {"nama":"Jantung Hutan Beracun","dmg":8,"rate":0.7,"range":320,"laras":20,"peluru":"#A6F05A","harga":500,"fam":"racun","rar":4,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"splash":40,"burn":1,"perk":["pecah","mitos_meletup"],"pen":25,"mitos":"meletup","desc":"Letupan kawasan, Bakar"},
  w_pistol_renjat: {"nama":"Pistol Renjat","dmg":12,"rate":0.9,"range":330,"laras":14,"peluru":"#FFF27A","harga":100,"fam":"elektrik","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"chain":3,"perk":[],"desc":"Kilat lompat ke 3 zombie"},
  w_bateri_lontar: {"nama":"Bateri Lontar","dmg":12,"rate":0.9,"range":330,"laras":10,"peluru":"#FFF27A","harga":100,"fam":"elektrik","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"bom","gen":1,"chain":3,"perk":[],"desc":"Kilat lompat ke 3 zombie"},
  w_senapang_arka: {"nama":"Senapang Arka","dmg":29.9,"rate":0.6,"range":400,"laras":22,"peluru":"#9AE0FF","harga":200,"fam":"elektrik","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"pierce":2,"chain":1,"perk":[],"desc":"Tembus 2, Kilat lompat ke 1 zombie"},
  w_tongkat_kilat_kecil: {"nama":"Tongkat Kilat Kecil","dmg":13.8,"rate":0.9,"range":330,"laras":18,"peluru":"#9AE0FF","harga":200,"fam":"elektrik","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"chain":3,"perk":[],"desc":"Kilat lompat ke 3 zombie"},
  w_cakera_elektrik: {"nama":"Cakera Elektrik","dmg":13.8,"rate":0.9,"range":330,"laras":10,"peluru":"#9AE0FF","harga":200,"fam":"elektrik","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"cakera","gen":1,"chain":3,"perk":[],"desc":"Kilat lompat ke 3 zombie"},
  w_meriam_guruh: {"nama":"Meriam Guruh","dmg":10.4,"rate":0.8,"range":320,"laras":22,"peluru":"#FFF27A","harga":300,"fam":"elektrik","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"chain":5,"perk":["ganda"],"ganda":2,"desc":"Kilat lompat ke 5 zombie"},
  w_senapang_gauss: {"nama":"Senapang Gauss","dmg":33.8,"rate":0.6,"range":400,"laras":22,"peluru":"#FFF27A","harga":300,"fam":"elektrik","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"pierce":2,"chain":1,"perk":["ganda"],"ganda":2,"desc":"Tembus 2, Kilat lompat ke 1 zombie"},
  w_gegelung_ribut: {"nama":"Gegelung Ribut","dmg":11.6,"rate":0.8,"range":320,"laras":16,"peluru":"#9AE0FF","harga":400,"fam":"elektrik","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"gegelung","gen":1,"chain":5,"perk":["ganda+"],"ganda":2.5,"desc":"Kilat lompat ke 5 zombie"},
  w_tombak_petir_biru: {"nama":"Tombak Petir Biru","dmg":37.7,"rate":0.6,"range":400,"laras":24,"peluru":"#9AE0FF","harga":400,"fam":"elektrik","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"pierce":2,"chain":1,"perk":["ganda+"],"ganda":2.5,"desc":"Tembus 2, Kilat lompat ke 1 zombie"},
  w_mahkota_halilintar: {"nama":"Mahkota Halilintar","dmg":12.8,"rate":0.8,"range":320,"laras":20,"peluru":"#FFF27A","harga":500,"fam":"elektrik","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"chain":5,"perk":["ganda","mitos_rantai"],"ganda":2,"mitos":"rantai","desc":"Kilat lompat ke 5 zombie"},
  w_pistol_sinar: {"nama":"Pistol Sinar","dmg":9,"rate":2,"range":380,"laras":14,"peluru":"#FF4FD8","harga":100,"fam":"tenaga","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"pierce":2,"perk":[],"desc":"Tembus 2"},
  w_penunjuk_laser: {"nama":"Penunjuk Laser","dmg":18,"rate":0.8,"range":600,"laras":22,"peluru":"#FF4FD8","harga":100,"fam":"tenaga","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"pierce":99,"perk":[],"desc":"Tembus semua"},
  w_senapang_foton: {"nama":"Senapang Foton","dmg":10.4,"rate":2,"range":380,"laras":22,"peluru":"#7AF0FF","harga":200,"fam":"tenaga","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"pierce":2,"perk":[],"desc":"Tembus 2"},
  w_laser_kembar: {"nama":"Laser Kembar","dmg":20.7,"rate":0.8,"range":600,"laras":22,"peluru":"#7AF0FF","harga":200,"fam":"tenaga","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"pierce":99,"perk":[],"desc":"Tembus semua"},
  w_pistol_ion: {"nama":"Pistol Ion","dmg":29.9,"rate":0.9,"range":420,"laras":14,"peluru":"#7AF0FF","harga":200,"fam":"tenaga","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"pierce":3,"perk":[],"desc":"Tembus 3"},
  w_meriam_ion: {"nama":"Meriam Ion","dmg":33.8,"rate":0.9,"range":420,"laras":22,"peluru":"#FF4FD8","harga":300,"fam":"tenaga","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0.25,"bentuk":"meriam","gen":1,"pierce":3,"perk":["boss"],"desc":"Tembus 3"},
  w_senapang_zarah: {"nama":"Senapang Zarah","dmg":33.8,"rate":0.9,"range":420,"laras":22,"peluru":"#FF4FD8","harga":300,"fam":"tenaga","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0.25,"bentuk":"senapang","gen":1,"pierce":3,"perk":["boss"],"desc":"Tembus 3"},
  w_pancaran_graviti: {"nama":"Pancaran Graviti","dmg":26.1,"rate":0.8,"range":600,"laras":22,"peluru":"#7AF0FF","harga":400,"fam":"tenaga","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0.375,"bentuk":"senapang","gen":1,"pierce":99,"perk":["boss+"],"desc":"Tembus semua"},
  w_laser_orbit: {"nama":"Laser Orbit","dmg":26.1,"rate":0.8,"range":600,"laras":22,"peluru":"#7AF0FF","harga":400,"fam":"tenaga","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0.375,"bentuk":"senapang","gen":1,"pierce":99,"perk":["boss+"],"desc":"Tembus semua"},
  w_teras_bintang: {"nama":"Teras Bintang","dmg":28.8,"rate":0.8,"range":600,"laras":20,"peluru":"#FF4FD8","harga":500,"fam":"tenaga","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0.25,"bentuk":"mitos","gen":1,"pierce":99,"perk":["boss","mitos_rantai"],"mitos":"rantai","desc":"Tembus semua"},
  w_botol_ubat: {"nama":"Botol Ubat","dmg":5,"rate":1,"range":300,"laras":10,"peluru":"#7FF0C8","harga":100,"fam":"sokong","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"botol","gen":1,"heal":0.015,"perk":[],"desc":"Baiki pagar"},
  w_pistol_vitamin: {"nama":"Pistol Vitamin","dmg":5,"rate":1,"range":300,"laras":14,"peluru":"#7FF0C8","harga":100,"fam":"sokong","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"heal":0.015,"perk":[],"desc":"Baiki pagar"},
  w_penyembur_herba: {"nama":"Penyembur Herba","dmg":5.8,"rate":1,"range":300,"laras":18,"peluru":"#B8FFD8","harga":200,"fam":"sokong","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"penyembur","gen":1,"heal":0.015,"perk":[],"desc":"Baiki pagar"},
  w_tongkat_doktor: {"nama":"Tongkat Doktor","dmg":6.9,"rate":1.2,"range":320,"laras":18,"peluru":"#B8FFD8","harga":200,"fam":"sokong","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"heal":0.01,"buff":0.05,"perk":[],"desc":"Baiki pagar, Pasukan +5% damage"},
  w_busur_penawar: {"nama":"Busur Penawar","dmg":5.8,"rate":1,"range":300,"laras":14,"peluru":"#B8FFD8","harga":200,"fam":"sokong","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"heal":0.015,"perk":[],"desc":"Baiki pagar"},
  w_meriam_ubat: {"nama":"Meriam Ubat","dmg":7.8,"rate":1.2,"range":384,"laras":22,"peluru":"#7FF0C8","harga":300,"fam":"sokong","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"heal":0.01,"buff":0.05,"perk":["jauh"],"desc":"Baiki pagar, Pasukan +5% damage"},
  w_tongkat_teratai: {"nama":"Tongkat Teratai","dmg":7.8,"rate":1.2,"range":384,"laras":18,"peluru":"#7FF0C8","harga":300,"fam":"sokong","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"heal":0.01,"buff":0.05,"perk":["jauh"],"desc":"Baiki pagar, Pasukan +5% damage"},
  w_picagari_emas: {"nama":"Picagari Emas","dmg":7.3,"rate":1,"range":390,"laras":10,"peluru":"#B8FFD8","harga":400,"fam":"sokong","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"botol","gen":1,"heal":0.015,"perk":["jauh+"],"desc":"Baiki pagar"},
  w_loceng_penyembuh: {"nama":"Loceng Penyembuh","dmg":8.7,"rate":1.2,"range":416,"laras":18,"peluru":"#B8FFD8","harga":400,"fam":"sokong","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"heal":0.01,"buff":0.05,"perk":["jauh+"],"desc":"Baiki pagar, Pasukan +5% damage"},
  w_pohon_kehidupan: {"nama":"Pohon Kehidupan","dmg":9.6,"rate":1.2,"range":384,"laras":20,"peluru":"#7FF0C8","harga":500,"fam":"sokong","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"heal":0.01,"buff":0.05,"perk":["jauh","mitos_suci"],"mitos":"suci","desc":"Baiki pagar, Pasukan +5% damage"},
  w_pistol_angin: {"nama":"Pistol Angin","dmg":6,"rate":1.6,"range":300,"laras":14,"peluru":"#C8F4F0","harga":100,"fam":"angin","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"knock":14,"perk":[],"desc":"Tolak zombie"},
  w_kipas_tolak: {"nama":"Kipas Tolak","dmg":6,"rate":1.6,"range":300,"laras":12,"peluru":"#C8F4F0","harga":100,"fam":"angin","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"kipas","gen":1,"knock":14,"perk":[],"desc":"Tolak zombie"},
  w_peniup_daun: {"nama":"Peniup Daun","dmg":6,"rate":1.6,"range":300,"laras":18,"peluru":"#C8F4F0","harga":100,"fam":"angin","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"penyembur","gen":1,"knock":14,"perk":[],"desc":"Tolak zombie"},
  w_pam_angin: {"nama":"Pam Angin","dmg":6,"rate":1.6,"range":300,"laras":18,"peluru":"#C8F4F0","harga":100,"fam":"angin","rar":0,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"penyembur","gen":1,"knock":14,"perk":[],"desc":"Tolak zombie"},
  w_senapang_taufan_kecil: {"nama":"Senapang Taufan Kecil","dmg":11.5,"rate":0.9,"range":340,"laras":22,"peluru":"#9AE8E0","harga":200,"fam":"angin","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"splash":35,"knock":20,"perk":[],"desc":"Letupan kawasan, Tolak zombie"},
  w_kipas_besi: {"nama":"Kipas Besi","dmg":6.9,"rate":1.6,"range":300,"laras":12,"peluru":"#9AE8E0","harga":200,"fam":"angin","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"kipas","gen":1,"knock":14,"perk":[],"desc":"Tolak zombie"},
  w_pelontar_puting_beliung: {"nama":"Pelontar Puting Beliung","dmg":11.5,"rate":0.9,"range":340,"laras":24,"peluru":"#9AE8E0","harga":200,"fam":"angin","rar":1,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"splash":35,"knock":20,"perk":[],"desc":"Letupan kawasan, Tolak zombie"},
  w_busur_bayu: {"nama":"Busur Bayu","dmg":18.4,"rate":0.9,"range":440,"laras":14,"peluru":"#9AE8E0","harga":200,"fam":"angin","rar":1,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"busur","gen":1,"pierce":2,"perk":[],"desc":"Tembus 2, Kuat lawan zombie terbang"},
  w_meriam_udara: {"nama":"Meriam Udara","dmg":13,"rate":0.9,"range":340,"laras":22,"peluru":"#C8F4F0","harga":300,"fam":"angin","rar":2,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"meriam","gen":1,"splash":35,"knock":20,"perk":["udara"],"desc":"Letupan kawasan, Tolak zombie"},
  w_senapang_pusaran: {"nama":"Senapang Pusaran","dmg":13,"rate":0.9,"range":340,"laras":22,"peluru":"#C8F4F0","harga":300,"fam":"angin","rar":2,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"senapang","gen":1,"splash":35,"knock":20,"perk":["udara"],"desc":"Letupan kawasan, Tolak zombie"},
  w_tongkat_monsun: {"nama":"Tongkat Monsun","dmg":13,"rate":0.9,"range":340,"laras":18,"peluru":"#C8F4F0","harga":300,"fam":"angin","rar":2,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"tongkat","gen":1,"splash":35,"knock":20,"perk":["udara"],"desc":"Letupan kawasan, Tolak zombie"},
  w_bumerang_bayu: {"nama":"Bumerang Bayu","dmg":20.8,"rate":0.9,"range":440,"laras":10,"peluru":"#C8F4F0","harga":300,"fam":"angin","rar":2,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"cakera","gen":1,"pierce":2,"perk":["udara"],"desc":"Tembus 2, Kuat lawan zombie terbang"},
  w_panah_badai: {"nama":"Panah Badai","dmg":20.8,"rate":0.9,"range":440,"laras":14,"peluru":"#C8F4F0","harga":300,"fam":"angin","rar":2,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"busur","gen":1,"pierce":2,"perk":["udara"],"desc":"Tembus 2, Kuat lawan zombie terbang"},
  w_ribut_tropika: {"nama":"Ribut Tropika","dmg":14.5,"rate":1.103,"range":340,"laras":22,"peluru":"#9AE8E0","harga":400,"fam":"angin","rar":3,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":35,"knock":20,"perk":["pantas+"],"desc":"Letupan kawasan, Tolak zombie"},
  w_sayap_rajawali_angin: {"nama":"Sayap Rajawali Angin","dmg":23.2,"rate":1.103,"range":440,"laras":14,"peluru":"#9AE8E0","harga":400,"fam":"angin","rar":3,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"busur","gen":1,"pierce":2,"perk":["pantas+"],"desc":"Tembus 2, Kuat lawan zombie terbang"},
  w_meriam_taufan: {"nama":"Meriam Taufan","dmg":14.5,"rate":1.103,"range":340,"laras":22,"peluru":"#9AE8E0","harga":400,"fam":"angin","rar":3,"jenis":"f","udara":true,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":35,"knock":20,"perk":["pantas+"],"desc":"Letupan kawasan, Tolak zombie"},
  w_mata_taufan: {"nama":"Mata Taufan","dmg":16,"rate":0.9,"range":340,"laras":20,"peluru":"#C8F4F0","harga":500,"fam":"angin","rar":4,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"mitos","gen":1,"splash":35,"knock":20,"perk":["udara","mitos_lantun"],"mitos":"lantun","desc":"Letupan kawasan, Tolak zombie"},
  w_tombak_angin_utara: {"nama":"Tombak Angin Utara","dmg":25.6,"rate":0.9,"range":440,"laras":20,"peluru":"#C8F4F0","harga":500,"fam":"angin","rar":4,"jenis":"f","udara":true,"aa":1.5,"bossB":0,"bentuk":"mitos","gen":1,"pierce":2,"perk":["udara","mitos_kembar"],"mitos":"kembar","desc":"Tembus 2, Kuat lawan zombie terbang"},
  w_pelontar_batu: {"nama":"Pelontar Batu","dmg":14,"rate":0.8,"range":300,"laras":24,"peluru":"#C8A070","harga":100,"fam":"bumi","rar":0,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"splash":30,"stun":0.15,"perk":[],"desc":"Letupan kawasan, 15% kaku"},
  w_tukul_kayu: {"nama":"Tukul Kayu","dmg":14,"rate":0.8,"range":300,"laras":14,"peluru":"#C8A070","harga":100,"fam":"bumi","rar":0,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"tukul","gen":1,"splash":30,"stun":0.15,"perk":[],"desc":"Letupan kawasan, 15% kaku"},
  w_penyodok_tanah: {"nama":"Penyodok Tanah","dmg":14,"rate":0.8,"range":300,"laras":14,"peluru":"#C8A070","harga":100,"fam":"bumi","rar":0,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"tukul","gen":1,"splash":30,"stun":0.15,"perk":[],"desc":"Letupan kawasan, 15% kaku"},
  w_lastik_kerikil: {"nama":"Lastik Kerikil","dmg":14,"rate":0.8,"range":300,"laras":12,"peluru":"#C8A070","harga":100,"fam":"bumi","rar":0,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"lastik","gen":1,"splash":30,"stun":0.15,"perk":[],"desc":"Letupan kawasan, 15% kaku"},
  w_tukul_batu: {"nama":"Tukul Batu","dmg":16.1,"rate":0.8,"range":300,"laras":14,"peluru":"#A88A5A","harga":200,"fam":"bumi","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"tukul","gen":1,"splash":30,"stun":0.15,"perk":[],"desc":"Letupan kawasan, 15% kaku"},
  w_meriam_kerikil: {"nama":"Meriam Kerikil","dmg":16.1,"rate":0.8,"range":300,"laras":22,"peluru":"#A88A5A","harga":200,"fam":"bumi","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":30,"stun":0.15,"perk":[],"desc":"Letupan kawasan, 15% kaku"},
  w_gerudi_tanah: {"nama":"Gerudi Tanah","dmg":23,"rate":0.7,"range":320,"laras":18,"peluru":"#A88A5A","harga":200,"fam":"bumi","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"gerudi","gen":1,"pierce":4,"perk":[],"desc":"Tembus 4"},
  w_bola_lumpur: {"nama":"Bola Lumpur","dmg":16.1,"rate":0.8,"range":300,"laras":10,"peluru":"#A88A5A","harga":200,"fam":"bumi","rar":1,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"bom","gen":1,"splash":30,"stun":0.15,"perk":[],"desc":"Letupan kawasan, 15% kaku"},
  w_tukul_gempa: {"nama":"Tukul Gempa","dmg":13,"rate":0.6,"range":340,"laras":14,"peluru":"#C8A070","harga":300,"fam":"bumi","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"tukul","gen":1,"splash":60,"stun":0.25,"perk":["pecah"],"pen":25,"desc":"Letupan kawasan, 25% kaku"},
  w_pelontar_batu_besar: {"nama":"Pelontar Batu Besar","dmg":18.2,"rate":0.8,"range":300,"laras":24,"peluru":"#C8A070","harga":300,"fam":"bumi","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"splash":30,"stun":0.15,"perk":["pecah"],"pen":25,"desc":"Letupan kawasan, 15% kaku"},
  w_lembing_batu_gunung: {"nama":"Lembing Batu Gunung","dmg":26,"rate":0.7,"range":320,"laras":24,"peluru":"#C8A070","harga":300,"fam":"bumi","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"pierce":4,"perk":["pecah"],"pen":25,"desc":"Tembus 4, Tembus perisai 25%"},
  w_gegar_tanah: {"nama":"Gegar Tanah","dmg":13,"rate":0.6,"range":340,"laras":14,"peluru":"#C8A070","harga":300,"fam":"bumi","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"tukul","gen":1,"splash":60,"stun":0.25,"perk":["pecah"],"pen":25,"desc":"Letupan kawasan, 25% kaku"},
  w_meriam_pasir: {"nama":"Meriam Pasir","dmg":18.2,"rate":0.8,"range":300,"laras":22,"peluru":"#C8A070","harga":300,"fam":"bumi","rar":2,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":30,"stun":0.15,"perk":["pecah"],"pen":25,"desc":"Letupan kawasan, 15% kaku"},
  w_penumbuk_gunung: {"nama":"Penumbuk Gunung","dmg":14.5,"rate":0.6,"range":340,"laras":14,"peluru":"#A88A5A","harga":400,"fam":"bumi","rar":3,"jenis":"f","udara":false,"aa":1,"bossB":0.375,"bentuk":"tukul","gen":1,"splash":60,"stun":0.25,"perk":["boss+"],"desc":"Letupan kawasan, 25% kaku"},
  w_gada_gunung: {"nama":"Gada Gunung","dmg":14.5,"rate":0.6,"range":340,"laras":14,"peluru":"#A88A5A","harga":400,"fam":"bumi","rar":3,"jenis":"f","udara":false,"aa":1,"bossB":0.375,"bentuk":"tukul","gen":1,"splash":60,"stun":0.25,"perk":["boss+"],"desc":"Letupan kawasan, 25% kaku"},
  w_tangan_golem: {"nama":"Tangan Golem","dmg":29,"rate":0.7,"range":320,"laras":14,"peluru":"#A88A5A","harga":400,"fam":"bumi","rar":3,"jenis":"f","udara":false,"aa":1,"bossB":0.375,"bentuk":"tukul","gen":1,"pierce":4,"perk":["boss+"],"desc":"Tembus 4"},
  w_jantung_gunung: {"nama":"Jantung Gunung","dmg":16,"rate":0.6,"range":340,"laras":20,"peluru":"#C8A070","harga":500,"fam":"bumi","rar":4,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"splash":60,"stun":0.25,"perk":["pecah","mitos_gempa"],"pen":25,"mitos":"gempa","desc":"Letupan kawasan, 25% kaku"},
  w_gada_teras_bumi: {"nama":"Gada Teras Bumi","dmg":16,"rate":0.6,"range":340,"laras":20,"peluru":"#C8A070","harga":500,"fam":"bumi","rar":4,"jenis":"f","udara":false,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"splash":60,"stun":0.25,"perk":["pecah","mitos_meletup"],"pen":25,"mitos":"meletup","desc":"Letupan kawasan, 25% kaku"},
  w_pistol_air: {"nama":"Pistol Air","dmg":6,"rate":1.6,"range":320,"laras":14,"peluru":"#5AB8FF","harga":100,"fam":"air","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"wet":3,"perk":[],"desc":"Basahkan zombie"},
  w_belon_air: {"nama":"Belon Air","dmg":6,"rate":1.6,"range":320,"laras":10,"peluru":"#5AB8FF","harga":100,"fam":"air","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"bom","gen":1,"wet":3,"perk":[],"desc":"Basahkan zombie"},
  w_penyembur_hos: {"nama":"Penyembur Hos","dmg":6,"rate":1.6,"range":320,"laras":18,"peluru":"#5AB8FF","harga":100,"fam":"air","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"penyembur","gen":1,"wet":3,"perk":[],"desc":"Basahkan zombie"},
  w_senapang_buih: {"nama":"Senapang Buih","dmg":6,"rate":1.6,"range":320,"laras":22,"peluru":"#5AB8FF","harga":100,"fam":"air","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"wet":3,"perk":[],"desc":"Basahkan zombie"},
  w_meriam_air: {"nama":"Meriam Air","dmg":10.4,"rate":0.8,"range":300,"laras":22,"peluru":"#8AD8FF","harga":200,"fam":"air","rar":1,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":45,"knock":12,"wet":3,"perk":[],"desc":"Letupan kawasan, Tolak zombie"},
  w_busur_ombak: {"nama":"Busur Ombak","dmg":18.4,"rate":0.8,"range":400,"laras":14,"peluru":"#8AD8FF","harga":200,"fam":"air","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"pierce":3,"wet":3,"perk":[],"desc":"Tembus 3, Basahkan zombie"},
  w_pistol_pancut: {"nama":"Pistol Pancut","dmg":6.9,"rate":1.6,"range":320,"laras":14,"peluru":"#8AD8FF","harga":200,"fam":"air","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"wet":3,"perk":[],"desc":"Basahkan zombie"},
  w_lembing_ikan_todak: {"nama":"Lembing Ikan Todak","dmg":18.4,"rate":0.8,"range":400,"laras":24,"peluru":"#8AD8FF","harga":200,"fam":"air","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"pierce":3,"wet":3,"perk":[],"desc":"Tembus 3, Basahkan zombie"},
  w_senapang_gelombang: {"nama":"Senapang Gelombang","dmg":11.7,"rate":0.8,"range":360,"laras":22,"peluru":"#5AB8FF","harga":300,"fam":"air","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"splash":45,"knock":12,"wet":3,"perk":["jauh"],"desc":"Letupan kawasan, Tolak zombie"},
  w_pelontar_pusaran_air: {"nama":"Pelontar Pusaran Air","dmg":11.7,"rate":0.8,"range":360,"laras":24,"peluru":"#5AB8FF","harga":300,"fam":"air","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"pelancar","gen":1,"splash":45,"knock":12,"wet":3,"perk":["jauh"],"desc":"Letupan kawasan, Tolak zombie"},
  w_tongkat_hujan: {"nama":"Tongkat Hujan","dmg":11.7,"rate":0.8,"range":360,"laras":18,"peluru":"#5AB8FF","harga":300,"fam":"air","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"splash":45,"knock":12,"wet":3,"perk":["jauh"],"desc":"Letupan kawasan, Tolak zombie"},
  w_meriam_buih: {"nama":"Meriam Buih","dmg":11.7,"rate":0.8,"range":360,"laras":22,"peluru":"#5AB8FF","harga":300,"fam":"air","rar":2,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":45,"knock":12,"wet":3,"perk":["jauh"],"desc":"Letupan kawasan, Tolak zombie"},
  w_busur_pasang_surut: {"nama":"Busur Pasang Surut","dmg":20.8,"rate":0.8,"range":480,"laras":14,"peluru":"#5AB8FF","harga":300,"fam":"air","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"pierce":3,"wet":3,"perk":["jauh"],"desc":"Tembus 3, Basahkan zombie"},
  w_trisula_laut: {"nama":"Trisula Laut","dmg":23.2,"rate":0.8,"range":400,"laras":24,"peluru":"#8AD8FF","harga":400,"fam":"air","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"pierce":6,"wet":3,"perk":["tembus+"],"desc":"Tembus 6, Basahkan zombie"},
  w_meriam_ombak_besar: {"nama":"Meriam Ombak Besar","dmg":13.1,"rate":0.8,"range":300,"laras":22,"peluru":"#8AD8FF","harga":400,"fam":"air","rar":3,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"splash":45,"knock":12,"wet":3,"perk":["tembus+"],"pierce":4,"desc":"Tembus 4, Letupan kawasan"},
  w_payung_ribut_hujan: {"nama":"Payung Ribut Hujan","dmg":13.1,"rate":0.8,"range":300,"laras":18,"peluru":"#8AD8FF","harga":400,"fam":"air","rar":3,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"splash":45,"knock":12,"wet":3,"perk":["tembus+"],"pierce":4,"desc":"Tembus 4, Letupan kawasan"},
  w_mutiara_lautan: {"nama":"Mutiara Lautan","dmg":14.4,"rate":0.8,"range":360,"laras":20,"peluru":"#5AB8FF","harga":500,"fam":"air","rar":4,"jenis":"m","udara":false,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"splash":45,"knock":12,"wet":3,"perk":["jauh","mitos_beku"],"mitos":"beku","desc":"Letupan kawasan, Tolak zombie"},
  w_tombak_raja_laut: {"nama":"Tombak Raja Laut","dmg":25.6,"rate":0.8,"range":480,"laras":20,"peluru":"#5AB8FF","harga":500,"fam":"air","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"pierce":3,"wet":3,"perk":["jauh","mitos_lantun"],"mitos":"lantun","desc":"Tembus 3, Basahkan zombie"},
  w_lampu_suluh: {"nama":"Lampu Suluh","dmg":7,"rate":1.2,"range":340,"laras":14,"peluru":"#FFF2A0","harga":100,"fam":"cahaya","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"obor","gen":1,"heal":0.008,"perk":[],"desc":"Baiki pagar"},
  w_pistol_kilau: {"nama":"Pistol Kilau","dmg":12,"rate":1,"range":480,"laras":14,"peluru":"#FFF2A0","harga":100,"fam":"cahaya","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"pierce":3,"perk":[],"desc":"Tembus 3"},
  w_cermin_kecil: {"nama":"Cermin Kecil","dmg":8,"rate":1.2,"range":360,"laras":12,"peluru":"#FFF2A0","harga":100,"fam":"cahaya","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"cermin","gen":1,"n":3,"spread":0.15,"perk":[],"desc":"3 peluru serentak"},
  w_lilin_ajaib: {"nama":"Lilin Ajaib","dmg":7,"rate":1.2,"range":340,"laras":14,"peluru":"#FFF2A0","harga":100,"fam":"cahaya","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"obor","gen":1,"heal":0.008,"perk":[],"desc":"Baiki pagar"},
  w_busur_cahaya: {"nama":"Busur Cahaya","dmg":13.8,"rate":1,"range":480,"laras":14,"peluru":"#FFFFFF","harga":200,"fam":"cahaya","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"pierce":3,"perk":[],"desc":"Tembus 3"},
  w_tongkat_pelangi: {"nama":"Tongkat Pelangi","dmg":9.2,"rate":1.2,"range":360,"laras":18,"peluru":"#FFFFFF","harga":200,"fam":"cahaya","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"n":3,"spread":0.15,"perk":[],"desc":"3 peluru serentak"},
  w_senapang_prisma: {"nama":"Senapang Prisma","dmg":9.2,"rate":1.2,"range":360,"laras":12,"peluru":"#FFFFFF","harga":200,"fam":"cahaya","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"cermin","gen":1,"n":3,"spread":0.15,"perk":[],"desc":"3 peluru serentak"},
  w_pistol_bintang: {"nama":"Pistol Bintang","dmg":13.8,"rate":1,"range":480,"laras":14,"peluru":"#FFFFFF","harga":200,"fam":"cahaya","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"pierce":3,"perk":[],"desc":"Tembus 3"},
  w_meriam_suria: {"nama":"Meriam Suria","dmg":15.6,"rate":1,"range":480,"laras":22,"peluru":"#FFF2A0","harga":300,"fam":"cahaya","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"pierce":3,"perk":["kritik"],"critB":0.1,"desc":"Tembus 3, +10% kritikal"},
  w_tombak_fajar: {"nama":"Tombak Fajar","dmg":15.6,"rate":1,"range":480,"laras":24,"peluru":"#FFF2A0","harga":300,"fam":"cahaya","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"pierce":3,"perk":["kritik"],"critB":0.1,"desc":"Tembus 3, +10% kritikal"},
  w_busur_bulan_sabit: {"nama":"Busur Bulan Sabit","dmg":15.6,"rate":1,"range":480,"laras":14,"peluru":"#FFF2A0","harga":300,"fam":"cahaya","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"pierce":3,"perk":["kritik"],"critB":0.1,"desc":"Tembus 3, +10% kritikal"},
  w_pelita_ajaib: {"nama":"Pelita Ajaib","dmg":9.1,"rate":1.2,"range":340,"laras":14,"peluru":"#FFF2A0","harga":300,"fam":"cahaya","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"obor","gen":1,"heal":0.008,"perk":["kritik"],"critB":0.1,"desc":"Baiki pagar, +10% kritikal"},
  w_senapang_aurora: {"nama":"Senapang Aurora","dmg":10.4,"rate":1.2,"range":360,"laras":22,"peluru":"#FFF2A0","harga":300,"fam":"cahaya","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"n":3,"spread":0.15,"perk":["kritik"],"critB":0.1,"desc":"3 peluru serentak, +10% kritikal"},
  w_lembing_matahari: {"nama":"Lembing Matahari","dmg":17.4,"rate":1,"range":480,"laras":24,"peluru":"#FFFFFF","harga":400,"fam":"cahaya","rar":3,"jenis":"m","udara":true,"aa":1.75,"bossB":0,"bentuk":"tombak","gen":1,"pierce":3,"perk":["udara+"],"desc":"Tembus 3, Kuat lawan zombie terbang"},
  w_tongkat_purnama: {"nama":"Tongkat Purnama","dmg":10.2,"rate":1.2,"range":340,"laras":18,"peluru":"#FFFFFF","harga":400,"fam":"cahaya","rar":3,"jenis":"m","udara":true,"aa":1.75,"bossB":0,"bentuk":"tongkat","gen":1,"heal":0.008,"perk":["udara+"],"desc":"Baiki pagar, Kuat lawan zombie terbang"},
  w_cermin_suria_agung: {"nama":"Cermin Suria Agung","dmg":11.6,"rate":1.2,"range":360,"laras":12,"peluru":"#FFFFFF","harga":400,"fam":"cahaya","rar":3,"jenis":"m","udara":true,"aa":1.75,"bossB":0,"bentuk":"cermin","gen":1,"n":3,"spread":0.15,"perk":["udara+"],"desc":"3 peluru serentak, Kuat lawan zombie terbang"},
  w_matahari_kecil: {"nama":"Matahari Kecil","dmg":19.2,"rate":1,"range":480,"laras":20,"peluru":"#FFF2A0","harga":500,"fam":"cahaya","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"pierce":3,"perk":["kritik","mitos_suci"],"critB":0.1,"mitos":"suci","desc":"Tembus 3, +10% kritikal"},
  w_bintang_pagi_abadi: {"nama":"Bintang Pagi Abadi","dmg":19.2,"rate":1,"range":480,"laras":20,"peluru":"#FFF2A0","harga":500,"fam":"cahaya","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"pierce":3,"perk":["kritik","mitos_rantai"],"critB":0.1,"mitos":"rantai","desc":"Tembus 3, +10% kritikal"},
  w_pistol_senja: {"nama":"Pistol Senja","dmg":14,"rate":1.2,"range":320,"laras":14,"peluru":"#A070E0","harga":100,"fam":"bayang","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"pistol","gen":1,"critB":0.2,"perk":[],"desc":"+20% kritikal"},
  w_shuriken_malam: {"nama":"Shuriken Malam","dmg":14,"rate":1.2,"range":320,"laras":8,"peluru":"#A070E0","harga":100,"fam":"bayang","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"bintang","gen":1,"critB":0.2,"perk":[],"desc":"+20% kritikal"},
  w_sumpit_bayang: {"nama":"Sumpit Bayang","dmg":8,"rate":1,"range":340,"laras":24,"peluru":"#A070E0","harga":100,"fam":"bayang","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"sumpit","gen":1,"mark":0.15,"perk":[],"desc":"Sumpahan +15%"},
  w_lastik_hitam: {"nama":"Lastik Hitam","dmg":14,"rate":1.2,"range":320,"laras":12,"peluru":"#A070E0","harga":100,"fam":"bayang","rar":0,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"lastik","gen":1,"critB":0.2,"perk":[],"desc":"+20% kritikal"},
  w_kerambit_bayang: {"nama":"Kerambit Bayang","dmg":16.1,"rate":1.2,"range":320,"laras":8,"peluru":"#6A4AA0","harga":200,"fam":"bayang","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"bintang","gen":1,"critB":0.2,"perk":[],"desc":"+20% kritikal"},
  w_busur_gelap: {"nama":"Busur Gelap","dmg":23,"rate":0.7,"range":420,"laras":14,"peluru":"#6A4AA0","harga":200,"fam":"bayang","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"pen":30,"perk":[],"desc":"Tembus perisai 30%"},
  w_senapang_senyap_malam: {"nama":"Senapang Senyap Malam","dmg":23,"rate":0.7,"range":420,"laras":22,"peluru":"#6A4AA0","harga":200,"fam":"bayang","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"pen":30,"perk":[],"desc":"Tembus perisai 30%"},
  w_cakera_malam: {"nama":"Cakera Malam","dmg":16.1,"rate":1.2,"range":320,"laras":10,"peluru":"#6A4AA0","harga":200,"fam":"bayang","rar":1,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"cakera","gen":1,"critB":0.2,"perk":[],"desc":"+20% kritikal"},
  w_sabit_bayang: {"nama":"Sabit Bayang","dmg":18.2,"rate":1.2,"range":320,"laras":14,"peluru":"#A070E0","harga":300,"fam":"bayang","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"sabit","gen":1,"critB":0.3,"perk":["kritik"],"desc":"+30% kritikal"},
  w_panah_gerhana: {"nama":"Panah Gerhana","dmg":26,"rate":0.7,"range":420,"laras":14,"peluru":"#A070E0","harga":300,"fam":"bayang","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"pen":30,"perk":["kritik"],"critB":0.1,"desc":"+10% kritikal, Tembus perisai 30%"},
  w_tongkat_kelawar: {"nama":"Tongkat Kelawar","dmg":10.4,"rate":1,"range":340,"laras":18,"peluru":"#A070E0","harga":300,"fam":"bayang","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tongkat","gen":1,"mark":0.15,"perk":["kritik"],"critB":0.1,"desc":"+10% kritikal, Sumpahan +15%"},
  w_senapang_hantu: {"nama":"Senapang Hantu","dmg":26,"rate":0.7,"range":420,"laras":22,"peluru":"#A070E0","harga":300,"fam":"bayang","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"senapang","gen":1,"pen":30,"perk":["kritik"],"critB":0.1,"desc":"+10% kritikal, Tembus perisai 30%"},
  w_meriam_kabus_hitam: {"nama":"Meriam Kabus Hitam","dmg":26,"rate":0.7,"range":420,"laras":22,"peluru":"#A070E0","harga":300,"fam":"bayang","rar":2,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"meriam","gen":1,"pen":30,"perk":["kritik"],"critB":0.1,"desc":"+10% kritikal, Tembus perisai 30%"},
  w_sabit_gerhana: {"nama":"Sabit Gerhana","dmg":20.3,"rate":1.2,"range":320,"laras":14,"peluru":"#6A4AA0","harga":400,"fam":"bayang","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"sabit","gen":1,"critB":0.2,"perk":["pecah+"],"pen":38,"desc":"+20% kritikal, Tembus perisai 38%"},
  w_lembing_malam: {"nama":"Lembing Malam","dmg":29,"rate":0.7,"range":420,"laras":24,"peluru":"#6A4AA0","harga":400,"fam":"bayang","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"tombak","gen":1,"pen":68,"perk":["pecah+"],"desc":"Tembus perisai 68%"},
  w_busur_burung_hantu: {"nama":"Busur Burung Hantu","dmg":29,"rate":0.7,"range":420,"laras":14,"peluru":"#6A4AA0","harga":400,"fam":"bayang","rar":3,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"busur","gen":1,"pen":68,"perk":["pecah+"],"desc":"Tembus perisai 68%"},
  w_lubang_hitam_mini: {"nama":"Lubang Hitam Mini","dmg":32,"rate":0.7,"range":420,"laras":20,"peluru":"#A070E0","harga":500,"fam":"bayang","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"pen":30,"perk":["kritik","mitos_kembar"],"critB":0.1,"mitos":"kembar","desc":"+10% kritikal, Tembus perisai 30%"},
  w_mahkota_bayang: {"nama":"Mahkota Bayang","dmg":12.8,"rate":1,"range":340,"laras":20,"peluru":"#A070E0","harga":500,"fam":"bayang","rar":4,"jenis":"m","udara":true,"aa":1,"bossB":0,"bentuk":"mitos","gen":1,"mark":0.15,"perk":["kritik","mitos_abadi"],"critB":0.1,"mitos":"abadi","desc":"+10% kritikal, Sumpahan +15%"}
};
const W_ELEM_FAM = { api: 'api', ais: 'ais', racun: 'racun', elektrik: 'elektrik' };
Object.keys(W_GEN).forEach(id => { const w = W_GEN[id]; WEAPONS[id] = w; WEAPON_ORDER.push(id); W_FAM[id] = w.fam; FAM_OF[w.fam].push(id); W_RAR_LIST[w.rar].push(id); const e = W_ELEM_FAM[w.fam]; if (e) W_ELEM[e].push(id); });
// ==== GEN v9.8 TAMAT ====

// ---------- v9.6: Peti Senjata, shard senjata, bintang senjata ★1–5, Debu Senjata, Kedai Harian ----------
const W_UNLOCK = [10, 20, 40, 80, 150];              // shard untuk membuka senjata ikut kelangkaan
const W_STAR_MAX = 5, W_STAR_K = [0.5, 1, 1.5, 2, 3]; // kos ★ = W_UNLOCK × k
const W_DUST_SHARD = [2, 4, 8, 15, 30];               // Debu untuk 1 shard pilihan
const W_DUST_DUP = [1, 2, 3, 5, 8];                   // Debu bagi setiap shard berlebihan (senjata ★5)
const W2RAR = [0, 2, 4, 6, 8];                        // warna kelangkaan senjata → warna RARITY (animasi peti)
const WCHESTS = {
  kayu:    { nama: 'Peti Senjata Kayu',    mata: 'gold',  shard: 3,  debu: 5,  odds: [70, 25, 5, 0, 0],  desc: '3 shard senjata jenis kelas pasukan anda (Biasa–Epik). 1 percuma setiap hari' },
  jenis:   { nama: 'Peti Jenis',           mata: 'gems',  harga: 120, shard: 25, debu: 20, odds: [0, 50, 35, 13, 2], pity: { n: 10, rar: 3 }, desc: '25 shard senjata jenis pilihan anda (Jarang ke atas). Legenda dijamin setiap 10 peti' },
  emas:    { nama: 'Peti Senjata Emas',    mata: 'gems',  harga: 100, shard: 25, debu: 20, odds: [0, 50, 35, 13, 2], pity: { n: 10, rar: 3 }, desc: '25 shard senjata Jarang ke atas. Legenda dijamin setiap 10 peti' },
  legenda: { nama: 'Peti Senjata Legenda', mata: 'token', shard: 60, debu: 60, odds: [0, 0, 40, 45, 15], pity: { n: 20, rar: 4 }, desc: '60 shard senjata Epik ke atas. Hanya dari permainan. Mitos dijamin setiap 20 peti' }
};
const WCHEST_ORDER = ['kayu', 'emas', 'jenis', 'legenda'];
// jenis senjata yang sepadan dengan kelas hero dalam pasukan (untuk Peti Kayu & kedai harian)
function teamFams(save) { const f = new Set(); (save.team || []).forEach(h => { if (HEROES[h] && save.heroes[h]) KELAS[HEROES[h].kelas].fam.forEach(x => f.add(x)); }); return [...f]; }
function wJenisPick(save) { const j = save.wpeti && save.wpeti.jenis; return FAM[j] ? j : (teamFams(save)[0] || 'biasa'); }
function wchestCost(id, best) { return id === 'kayu' ? Math.floor(450 * Math.pow(1.17, Math.min(best, 600) - 1)) : WCHESTS[id].harga || 0; }
function wShards(save, wid) { return (save.wsh && save.wsh[wid]) || 0; }
function wStars(save, wid) { return (save.wst && save.wst[wid]) || 0; }
function wStarCost(wid, s) { return Math.ceil(W_UNLOCK[WEAPONS[wid].rar || 0] * W_STAR_K[Math.min(W_STAR_MAX - 1, s)]); }
function wStarMult(save, wid) { return 1 + 0.2 * wStars(save, wid); }
function wNeed(save, wid) { return save.weapons[wid] ? (wStars(save, wid) >= W_STAR_MAX ? 0 : wStarCost(wid, wStars(save, wid))) : W_UNLOCK[WEAPONS[wid].rar || 0]; }
function wFreeKayu(save, now) { return !save.wpeti || save.wpeti.free !== dayKey(now); }
// tambah shard: buka automatik bila cukup; senjata ★5 → Debu
function addWShards(save, wid, n) {
  const r = WEAPONS[wid].rar || 0, out = { wid, n, baru: false, debu: 0 };
  if (save.weapons[wid] && wStars(save, wid) >= W_STAR_MAX) { out.debu = n * W_DUST_DUP[r]; save.debu = (save.debu || 0) + out.debu; return out; }
  save.wsh[wid] = wShards(save, wid) + n; stat(save, 'wShardsGot', n);
  if (!save.weapons[wid] && save.wsh[wid] >= W_UNLOCK[r]) {
    save.wsh[wid] -= W_UNLOCK[r]; if (!save.wsh[wid]) delete save.wsh[wid]; save.weapons[wid] = 1; out.baru = true; stat(save, 'wUnlocked');
    const h = save.team.concat(HERO_ORDER).find(x => save.heroes[x] && heroWeapon(save, x) === 'batu' && canEquip(x, wid)); if (h) { save.heroWpn[h] = wid; out.hero = h; }
  }
  return out;
}
function wStarUp(save, wid) {
  if (!save.weapons[wid]) return { ok: false, msg: 'Senjata belum dimiliki' };
  const st = wStars(save, wid); if (st >= W_STAR_MAX) return { ok: false, msg: 'Sudah ★' + W_STAR_MAX + ' (maksimum)' };
  const need = wStarCost(wid, st), have = wShards(save, wid);
  if (have < need) return { ok: false, msg: 'Shard tak cukup (' + have + '/' + need + ')' };
  save.wsh[wid] = have - need; if (!save.wsh[wid]) delete save.wsh[wid]; save.wst[wid] = st + 1; stat(save, 'wStars');
  return { ok: true, msg: WEAPONS[wid].nama + ' kini ★' + (st + 1) + (st + 1 === 3 ? ' — perk: +10% laju tembakan!' : st + 1 === W_STAR_MAX ? ' — aura: pasukan +5% damage!' : '') };
}
function wDustBuy(save, wid, n) {
  n = n || 1; if (!WEAPONS[wid] || wid === 'batu') return { ok: false, msg: 'Tiada' };
  if (save.weapons[wid] && wStars(save, wid) >= W_STAR_MAX) return { ok: false, msg: 'Senjata sudah ★' + W_STAR_MAX };
  const c = W_DUST_SHARD[WEAPONS[wid].rar || 0] * n; if ((save.debu || 0) < c) return { ok: false, msg: 'Debu tak cukup (perlu ' + c + ')' };
  save.debu -= c; const r = addWShards(save, wid, n);
  return { ok: true, res: r, msg: '+' + n + ' shard ' + WEAPONS[wid].nama + (r.baru ? ' — senjata dibuka!' : '') };
}
function rollWRar(rng, odds) { let x = rng() * 100; for (let i = 0; i < odds.length; i++) { x -= odds[i]; if (x < 0 && odds[i] > 0) return i; } for (let i = odds.length - 1; i >= 0; i--) if (odds[i] > 0) return i; return 0; }
function rollWeapon(rng, rar, fams) { let l = W_RAR_LIST[rar]; if (fams && fams.length) { const f = l.filter(w => fams.includes(W_FAM[w])); if (f.length) l = f; } return l[Math.floor(rng() * l.length) % l.length]; }
// Senjata Sasaran: bila kelangkaan peti sama dengan sasaran, 50% shard masuk ke senjata sasaran
const W_TARGET_P = 0.5;
function wTargetOk(save, wid) { return !!(wid && WEAPONS[wid] && wid !== 'batu' && !(save.weapons[wid] && wStars(save, wid) >= W_STAR_MAX)); }
function setWTarget(save, wid) {
  if (!wid || save.wtarget === wid) { save.wtarget = ''; return { ok: true, msg: 'Senjata Sasaran dibuang' }; }
  if (!wTargetOk(save, wid)) return { ok: false, msg: 'Senjata ini sudah ★' + W_STAR_MAX };
  save.wtarget = wid; return { ok: true, msg: '🎯 Sasaran: ' + WEAPONS[wid].nama + ' (50% shard ' + W_RAR_NAMA[WEAPONS[wid].rar].nama + ' dari peti masuk ke sini)' };
}
function openWChest(save, id, rng, now) {
  const c = WCHESTS[id]; if (!c) return { ok: false, msg: 'Tiada' };
  const P = save.wpeti; let free = false;
  if (id === 'kayu' && wFreeKayu(save, now)) { free = true; P.free = dayKey(now); }
  else if (id === 'kayu' && P.kayu > 0) P.kayu--;
  else if (c.mata === 'token') { if (!(P.leg > 0)) return { ok: false, msg: 'Tiada Peti Legenda. Dapatkan dari Serbuan Boss & stage 50, 100, 150…' }; P.leg--; }
  else { const cost = wchestCost(id, effBest(save)); if (save[c.mata] < cost) return { ok: false, msg: (c.mata === 'gold' ? 'Gold' : 'Gems') + ' tak cukup (perlu ' + fmtNum(cost) + ')' }; save[c.mata] -= cost; }
  stat(save, 'wChests');
  let rar = rollWRar(rng, c.odds);
  if (c.pity) { const k = id === 'emas' ? 'pe' : id === 'jenis' ? 'pj' : 'pl'; if ((P[k] || 0) >= c.pity.n - 1) rar = Math.max(rar, c.pity.rar); P[k] = rar >= c.pity.rar ? 0 : (P[k] || 0) + 1; }
  const T = save.wtarget, hitT = wTargetOk(save, T) && WEAPONS[T].rar === rar && (id !== 'jenis' || W_FAM[T] === wJenisPick(save)) && rng() < W_TARGET_P;
  const fams = id === 'jenis' ? [wJenisPick(save)] : id === 'kayu' ? teamFams(save) : null;
  const wid = hitT && (!fams || fams.includes(W_FAM[T])) ? T : rollWeapon(rng, rar, fams), r = addWShards(save, wid, c.shard); save.debu = (save.debu || 0) + c.debu;
  if (T && !wTargetOk(save, T)) save.wtarget = '';
  let tapak = ''; if (id === 'legenda' && save.tapak && !save.tapak.own.raja && rng() < TAPAK_RAJA_P) { save.tapak.own.raja = 1; tapak = 'raja'; }
  return { ok: true, free, rar, wid, tapak, sasaran: wid === T, n: c.shard, baru: r.baru, hero: r.hero, debu: c.debu + r.debu, msg: '+' + c.shard + ' shard ' + WEAPONS[wid].nama + (r.baru ? ' — BARU!' : '') };
}
function openWChestN(save, id, n, rng, now) { const out = []; for (let i = 0; i < n; i++) { const r = openWChest(save, id, rng, now); if (!r.ok) { if (!out.length) out.push(r); break; } out.push(r); } return out; }
function wPityLeft(save, id) { const c = WCHESTS[id]; return c.pity ? c.pity.n - ((save.wpeti[id === 'emas' ? 'pe' : id === 'jenis' ? 'pj' : 'pl']) || 0) : 0; }
function setWJenis(save, j) { if (!FAM[j]) return { ok: false, msg: 'Jenis tidak sah' }; save.wpeti.jenis = j; return { ok: true, msg: 'Peti Jenis: ' + FAM[j].ikon + ' ' + FAM[j].nama }; }
// Kedai Senjata Harian: 4 tawaran shard, berubah setiap hari
const WSHOP_GEM = [2, 3, 4, 4, 5];
function wshopEnsure(save, now) {
  const day = dayKey(now); if (save.wshop && save.wshop.day === day && save.wshop.o.length === 6) return save.wshop;
  let h = 7; for (let i = 0; i < day.length; i++) h = (Math.imul(h, 31) + day.charCodeAt(i)) >>> 0; const rng = mulberry(h ^ 0x5EED);
  const tf = teamFams(save), spec = [[0, 1, 'gold', 6, 1], [1, 2, 'gems', 5, 1], [0, 1, 'gold', 6, 0], [1, 2, 'gems', 5, 0], [2, 3, 'debu', 5, 0], [3, 4, 'gems', 3, 0]];
  const o = spec.map(([a, b, m, n, kls]) => { const r = rng() < 0.65 ? a : b, w = rollWeapon(rng, r, kls ? tf : null);
    const harga = m === 'gold' ? Math.max(100, Math.floor(wchestCost('kayu', effBest(save)) / 3 * n * 0.8)) : m === 'gems' ? WSHOP_GEM[r] * n : Math.ceil(W_DUST_SHARD[r] * n * 0.8);
    return { w, n, mata: m, harga, beli: false }; });
  save.wshop = { day, o }; return save.wshop;
}
function wshopBuy(save, i, now) {
  const S = wshopEnsure(save, now), o = S.o[i]; if (!o) return { ok: false, msg: 'Tiada' }; if (o.beli) return { ok: false, msg: 'Sudah dibeli hari ini' };
  const k = o.mata; if ((save[k] || 0) < o.harga) return { ok: false, msg: (k === 'gold' ? 'Gold' : k === 'gems' ? 'Gems' : 'Debu') + ' tak cukup' };
  if (save.weapons[o.w] && wStars(save, o.w) >= W_STAR_MAX) return { ok: false, msg: 'Senjata sudah ★' + W_STAR_MAX };
  save[k] -= o.harga; o.beli = true; const r = addWShards(save, o.w, o.n);
  return { ok: true, res: r, msg: '+' + o.n + ' shard ' + WEAPONS[o.w].nama + (r.baru ? ' — senjata dibuka!' : '') };
}
function cleanWpeti(o) { const n = x => Math.max(0, Math.floor(typeof x === 'number' && isFinite(x) ? x : 0)); o = o && typeof o === 'object' ? o : {}; return { kayu: Math.min(999, n(o.kayu)), leg: Math.min(999, n(o.leg)), free: typeof o.free === 'string' ? o.free : '', pe: Math.min(9, n(o.pe)), pl: Math.min(19, n(o.pl)), pj: Math.min(9, n(o.pj)), jenis: typeof o.jenis === 'string' && FAM[o.jenis] ? o.jenis : '' }; }
function cleanWshop(o) { if (!o || typeof o.day !== 'string' || !Array.isArray(o.o) || o.o.length !== 6) return null; const ok = o.o.every(x => x && WEAPONS[x.w] && x.w !== 'batu' && ['gold', 'gems', 'debu'].includes(x.mata) && x.n > 0 && x.n <= 10 && x.harga > 0); return ok ? { day: o.day, o: o.o.map(x => ({ w: x.w, n: Math.floor(x.n), mata: x.mata, harga: Math.floor(x.harga), beli: x.beli === true })) } : null; }
// senjata sementara untuk hero tanpa senjata (tidak boleh dikumpul)
WEAPONS.batu = { nama: 'Baling Batu', desc: 'Senjata sementara — pasang senjata sebenar!', dmg: 3, rate: 1.1, range: 260, laras: 6, peluru: '#9A8A7A', harga: -1, jenis: 'f', udara: false, aa: 1, bossB: 0, rar: 0 };
function wTag(wid) { const w = WEAPONS[wid]; return JENIS_NAMA[w.jenis] + ' · ' + (w.udara ? '⬆⬇ Udara+Darat' : '⬇ Darat'); }
// zombie udara (mula stage 15)
const FLY = { kelawar: { dari: 'laju', nama: 'Kelawar Zombi', hp: 0.7, spd: 1.3, gold: 1.2 }, gagak: { dari: 'biasa', nama: 'Gagak Zombi', hp: 0.6, spd: 1.15, gold: 1.1 }, belon: { dari: 'gemuk', nama: 'Zombi Belon', hp: 1.6, spd: 0.6, gold: 1.5 } };
function flyChance(s) { return s < 15 ? 0 : s < 40 ? 0.1 : s < 80 ? 0.15 : 0.2; }
// ---------- v9.0: geometri muncung (dikongsi oleh lukisan & logik) ----------
const HERO_ARM = { x: 12, y: 6 }, WPN_SC = 1.15, TOWER_ARM = { y: -12, sc: 1.05 };
function heroSc(n) { return n > 5 ? 1.2 : 1.32; }
function heroPivot(m, n) { const sc = heroSc(n); return { x: m.x + HERO_ARM.x * sc, y: m.y - 4 + HERO_ARM.y * sc, sc }; }
function muzzleLen(wid) { return (WEAPONS[wid].laras + 2) * WPN_SC; }
function heroMuzzle(m, n, wid, a) { const p = heroPivot(m, n), d = muzzleLen(wid) * p.sc; a = a == null ? m.aim : a; return { x: p.x + Math.cos(a) * d, y: p.y + Math.sin(a) * d }; }
function towerMuzzle(tw, wid, a) { const d = (WEAPONS[wid].laras + 2) * TOWER_ARM.sc; a = a == null ? tw.aim : a; return { x: tw.x + Math.cos(a) * d, y: tw.y + TOWER_ARM.y + Math.sin(a) * d }; }
// ---------- Pertempuran ----------
function Battle(save, stage, rng, chal) {
  this.save = save; this.stage = stage; this.rng = rng || Math.random; this.now = 0;
  this.chal = chal || null; this.diff = chal ? DIFFS[0] : diffOf(save); this.mods = chal ? (CHALLENGES.find(c => c.id === chal.id) || {}).mods || {} : {}; if (chal && chal.raid != null) { this.bossInfo = bossById(chal.bossId); this.bossInfo.big = true; } this.maxWave = chal && chal.raid != null ? 1 : chal ? CHAL_WAVES : wavesFor(stage);
  this.wave = 1; this.zombies = []; this.bullets = []; this.fx = []; this.drops = []; this.evolved = 0;
  const ws = wallStats(save); this.wallMax = ws.max; this.wall = this.wallMax;
  this.state = 'main'; this.pause = 0.8; this.nextId = 1; this.god = false;
  this.earnedGold = 0; this.earnedGems = 0; this.team = [];
  this.dmgBy = {}; this.pcd = {}; this.act = {}; this.meteors = []; this.bombs = []; this.autoPower = false; this.autoGap = 0;
  this.syncTeam(); this.loadWave();
}
Battle.prototype.syncTeam = function () {
  let ids = this.save.team.filter(id => this.save.heroes[id]); if (this.mods && this.mods.solo) ids = ids.slice(0, 1);
  const gap = W / (ids.length + 1), old = {};
  this.team.forEach(m => { old[m.id] = m; });
  this.team = ids.map((id, i) => { const o = old[id]; return { id, aff: wAff(id, heroWeapon(this.save, id)), ult: o ? o.ult : 0, x: gap * (i + 1), y: 540, cd: o ? o.cd : 0.3 + i * 0.15, aim: o ? o.aim : -Math.PI / 2, recoil: 0 }; });
  const has = h => ids.includes(h) ? skillK(this.save, h) : 0;
  this.aura = { wall: 1 + 0.1 * has('shotgun'), dmg: 1 + 0.1 * has('askar'), rate: 1 + 0.15 * has('komander'), powCd: 1 - Math.min(0.5, 0.15 * has('laser')), slowAmp: 0.2 * has('frost'), regen: 0.005 * has('tukang'), drop: 1 + 0.25 * has('saintis'), doktor: has('doktor'), pahlawan: has('pahlawan') };
  { const roles = ids.map(h => HEROES[h].peranan), cnt = r => roles.filter(x => x === r).length; this.aura.wall *= Math.pow(1.08, cnt('penjaga')); this.aura.regen += 0.003 * cnt('penyembuh'); this.aura.dmg *= Math.pow(1.05, cnt('pemimpin')); this.aura.armorP = 3 * cnt('penjaga'); this.aura.dmg *= 1 + Math.max(0, ...ids.map(h => WEAPONS[heroWeapon(this.save, h)].buff || 0)); this.aura.dmg *= Math.pow(1.05, ids.filter(h => { const w = heroWeapon(this.save, h); return w !== 'batu' && wStars(this.save, w) >= W_STAR_MAX; }).length); };
  this.bagDrop = teamBagDrop(this.save);
  const ws = wallStats(this.save), ratio = this.wallMax ? this.wall / this.wallMax : 1, wmax = Math.max(1, Math.round(ws.max * this.aura.wall * ((this.mods && this.mods.wall) || 1)));
  this.wallMax = wmax; this.wall = Math.max(0, ratio * wmax); this.ws = this.aura.armorP ? Object.assign({}, ws, { armor: Math.min(60, ws.armor + this.aura.armorP) }) : ws; this.mat = this.mods && this.mods.noWallSkill ? -1 : ws.mat; this.hm = ws.mat === 0 ? 1.3 : 1; this.dmgMat = ws.mat === 7 ? 1.06 : 1;
  (this.save.towers || []).forEach(t => { if (t && t.type === 'tukang') { const M = towerMods(t); if (M.armor || M.thorns) this.ws = Object.assign({}, this.ws, { armor: Math.min(90, this.ws.armor + M.armor), thorns: this.ws.thorns + M.thorns }); } });
  const old2 = {}; (this.towers || []).forEach(t => { old2[t.slot] = t; });
  const TXS = towerXs(this.save.towers.length); this.towers = this.save.towers.map((t, i) => t ? { slot: i, type: t.type, lvl: t.lvl, br: (t.br || []).slice(), mods: towerMods(t), x: TXS[i], y: TOWER_Y, cd: old2[i] ? old2[i].cd : 0.5 + i * 0.2, aim: -Math.PI / 2, recoil: 0 } : null).filter(Boolean);
};
Battle.prototype.loadWave = function () {
  if (this.chal && this.chal.raid != null) { this.queue = ['laju', 'biasa', 'gemuk', 'laju', 'biasa', 'gemuk', 'boss']; this.spawnT = 0; return; }
  let q = waveComposition(this.stage, this.wave === this.maxWave ? WAVES_PER_STAGE : this.wave);
  if (this.mods.horde) q = q.concat(q.filter(t => t !== 'boss'), q.filter(t => t !== 'boss'));
  if (this.mods.bossRush && !q.includes('boss')) q.push('boss');
  this.queue = q; this.spawnT = 0;
};
Battle.prototype.spawn = function (type, at) {
  const st = zombieStats(type, this.stage, this.wave, this.diff.off), z = ZTYPES[type]; st.spd *= this.diff.spd;
  const r = type === 'boss' && isBigBoss(this.stage) ? 44 : z.r;
  const sp = type !== 'boss' && !at ? pickSpecies(type, this.stage, this.rng) : null;
  const zz = { id: this.nextId++, type, x: at ? at.x : r + 10 + this.rng() * (W - 2 * r - 20), y: at ? at.y : -r, hp: st.hp, maxHp: st.hp, spd: st.spd, dmg: st.dmg, gold: st.gold, r,
    slowT: 0, slowK: 0, burnT: 0, burnD: 0, atkT: 0, wob: this.rng() * 6, hitT: 0, evo: 0, evoT: 0, traits: [], rage: false, kid: !!at,
    warna: type === 'boss' ? BOSS_COLORS[(this.stage - 1) % BOSS_COLORS.length] : z.kulit, sp: sp ? sp.id : -1, gear: sp ? ZGEAR[sp.gi].id : 'tiada', tint: sp ? ZELEM[sp.ei].tint : null, zel: sp ? ZELEM[sp.ei].nama : null, jumpT: 2 + this.rng() * 2, healT: 1 };
  if (type === 'boss' && !at) {
    const B = this.bossInfo || (this.bossInfo = bossOf(this.stage, this.chal ? 0 : this.diff.off, bossDay(this.now))), F = B.form, E = B.elem.id;
    zz.bossKind = F.id; zz.bossId = B.id; zz.bossNama = B.nama; zz.belem = E; zz.zel = BOSS_ZEL[E] || null; zz.btier = B.t; zz.big = B.big; zz.warna = F.warna; zz.abT = 3; zz.r = B.tier.r + (B.big ? 4 : 0);
    zz.easy = this.stage + (this.chal ? 0 : this.diff.off) < 10 && !(this.chal && this.chal.raid != null);
    if (this.chal && this.chal.raid != null && !isBigBoss(this.stage)) { zz.hp = zz.maxHp = zz.hp * 3; zz.gold *= 2; }
    if (!zz.easy) zz.hp = zz.maxHp = Math.round(zz.hp * B.tier.hp * (E === 'ais' ? 1.1 : E === 'emas' ? 1.15 : 1));
    zz.traits = F.id === 'besi' && !zz.easy ? ['perisai'] : [];
    if (!zz.easy) { if (E === 'api') zz.dmg = Math.round(zz.dmg * 1.25); if (E === 'elektrik') zz.spd *= 1.25; if (E === 'emas') zz.gold *= 3; if (E === 'ais') zz.traits.push('kebal_ais'); if (E === 'bayang') zz.traits.push('hantu'); }
    zz.btr = zz.easy ? [] : bossTraits(B.id);
    if (zz.btr.includes('kslow') && !zz.traits.includes('kebal_ais')) zz.traits.push('kebal_ais');
    if (zz.btr.includes('sembuh') && !zz.traits.includes('penyembuh')) zz.traits.push('penyembuh');
    if (zz.btr.includes('terbang')) zz.fly = 'boss';
    if (bossDexSet(this.save, B.id, 1)) (this.newBoss = this.newBoss || []).push(B.id);
  }
  if (sp) {
    zz.hp = zz.maxHp = Math.round(st.hp * sp.hp); zz.spd *= sp.spd; zz.dmg = Math.round(st.dmg * sp.dmg); zz.gold = Math.max(1, Math.round(st.gold * sp.gold)); zz.traits = sp.sifat.slice();
    if (zz.traits.includes('pecut')) zz.spd *= 1.5;
    this.markSeen(sp.id);
  }
  if (!at && type !== 'boss' && (type === 'laju' || type === 'biasa' || type === 'gemuk')) { const fc = flyChance(this.stage + (this.chal ? 0 : this.diff.off)); if (fc && this.rng() < fc) { const fk = Object.keys(FLY).find(k => FLY[k].dari === type), F = FLY[fk];
    zz.fly = fk; zz.hp = zz.maxHp = Math.max(1, Math.round(zz.hp * F.hp)); zz.spd *= F.spd; zz.gold = Math.max(1, Math.round(zz.gold * F.gold)); zz.traits = zz.traits.filter(t => t !== 'melompat' && t !== 'pengebom' && t !== 'penembak'); stat(this.save, 'flySeen'); } }
  if (this.mods.horde && !at && type !== 'boss') zz.hp = zz.maxHp = Math.max(1, Math.round(zz.hp * 0.4));
  if (this.mods.spd) zz.spd *= this.mods.spd;
  if (this.mods.evoMax && type !== 'boss') while (this.evolve(zz, true));
  if (at) { zz.hp = zz.maxHp = Math.max(1, Math.round(at.hp)); zz.r = 10; zz.gold = Math.max(1, Math.round(at.gold)); }
  // zombie peringkat tinggi kadang-kadang lahir sudah berevolusi
  const pre = Math.min(maxEvo(this.stage) - 1, Math.floor(this.stage / 25));
  if (!at && type !== 'boss') { for (let i = 0; i < pre; i++) if (this.rng() < 0.5) this.evolve(zz, true); for (let i = 0; i < this.diff.evo; i++) this.evolve(zz, true); }
  zz.born = this.clock || 0;
  if (type === 'boss' && zz.bossKind) { const B = this.bossInfo; this.fx.push({ kind: 'bossIntro', t: 0, life: 2.6, txt: B.nama, big: B.big, bk: B.form.id, tr: (zz.btr || []).map(k => BTRAIT[k].ikon + ' ' + BTRAIT[k].nama).join(' · '), sub: (this.stage + (this.chal ? 0 : this.diff.off) < 10) ? 'Boss latihan — kuasa boss bermula di stage 10' : B.elem.ikon + ' ' + B.form.desc, tier: B.tier.bin, warna: B.elem.warna }); }
  this.zombies.push(zz); return zz;
};
Battle.prototype.bossAbility = function (z, dt) {
  z.abT -= dt; if (z.invT > 0) z.invT -= dt;
  if (z.easy) return;
  const F = z.bossKind, R = this.rng, BT = z.btr || [];
  if (BT.includes('amuk')) { z.amukK = 1 + (1 - Math.max(0, z.hp) / z.maxHp) * 0.9; z.abT -= dt * (z.amukK - 1); }
  if (BT.includes('kslow') || BT.includes('ktolak')) { z.freezeT = 0; if (BT.includes('kslow')) { z.slowK = 0; z.slowT = 0; } }
  if (BT.includes('pengawal')) for (const o of this.zombies) if (o !== z && o.hp > 0 && o.type !== 'boss' && Math.hypot(o.x - z.x, o.y - z.y) < 140) o.guardU = (this.clock || 0) + 0.2;
  if (!z.p2 && z.hp < z.maxHp / 2) { z.p2 = true; this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 34, t: 0, txt: '⚠ FASA 2!', warna: '#FF7A5A' }); this.fx.push({ kind: 'evo', x: z.x, y: z.y, t: 0, r: z.r, warna: '#FF5A5A' }); }
  if (z.belem === 'racun') z.hp = Math.min(z.maxHp, z.hp + z.maxHp * 0.006 * dt);
  if (F === 'lendir' && !z.split && z.hp < z.maxHp / 2) { z.split = true; for (let i = 0; i < 4; i++) { const k = this.spawn('gemuk', { x: Math.max(20, Math.min(W - 20, z.x + (i - 1.5) * 26)), y: z.y + 10, hp: z.maxHp * 0.08, gold: z.gold * 0.05 }); k.warna = '#6CC04A'; k.r = 16; } this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 20, t: 0, txt: 'Lendir pecah!', warna: '#6CC04A' }); }
  if (F === 'kelawar') z.x = Math.max(z.r, Math.min(W - z.r, z.x + Math.cos((this.clock || 0) * 2.2 + z.id) * 70 * dt));
  if (F === 'ular' && z.under > 0) { z.under -= dt; z.invT = Math.max(z.invT || 0, 0.05); z.y = Math.min(WALL_Y - z.r - 4, z.y + 110 * dt); if (z.under <= 0) { this.fx.push({ kind: 'boom', x: z.x, y: z.y, t: 0, r: 40, wid: 'ular' }); this.fx.push({ kind: 'shake', t: 0, mag: 4 }); } }
  if (F === 'ketam' && z.openT > 0) z.openT -= dt;
  if (F === 'robot' && z.laserT > 0) { z.laserT -= dt; if (z.laserT <= 0) { for (const lx of z.laserX || []) { this.hitWallAt(lx, z.dmg * 1.5); this.fx.push({ kind: 'bbeam', x: z.x, y: z.y, tx: lx, t: 0, life: 0.45 }); } this.fx.push({ kind: 'shake', t: 0, mag: 4 }); } }
  if (z.y < 60 && z.abT < 0.7) z.abT = 0.7;
  if (z.abT > 0) { if (z.abT < 0.6 && !z.warned && F !== 'lendir') { z.warned = true; this.fx.push({ kind: 'bwarn', z, t: 0, life: 0.6 }); } return; }
  z.warned = false; const sE = this.stage + (this.chal ? 0 : this.diff.off); z.abT = (BOSS_CD[F] || 99) * (z.belem === 'elektrik' ? 0.8 : 1) * (z.big ? 1 : sE < 20 ? 2.2 : sE < 40 ? 1.6 : 1.3);
  const p2 = !!z.p2, team = this.team, say = (t, c) => this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 20, t: 0, txt: t, warna: c || '#FFE07A' });
  switch (F) {
    case 'jeneral': for (let i = 0; i < (p2 ? 3 : 2); i++) { const zs = zombieStats('laju', this.stage, this.wave, this.diff.off), k = this.spawn('laju', { x: Math.max(16, Math.min(W - 16, z.x + (i - 1) * 30)), y: z.y, hp: zs.hp, gold: zs.gold }); k.r = 13; } say('Serbu!', '#C8D0DC'); break;
    case 'ratu': this.poisonT = p2 ? 5 : 3; this.fx.push({ kind: 'cloud', x: W / 2, y: WALL_Y + 40, t: 0, life: this.poisonT }); say('Awan racun!', '#C080E0'); break;
    case 'besi': z.invT = p2 ? 3 : 2; say('Perisai kebal!', '#C8D0DC'); break;
    case 'naga': z.y = Math.min(WALL_Y - z.r - 130, z.y + 80); z.hop = 0.35; this.fx.push({ kind: 'breath', x: z.x, y: z.y, t: 0, life: 0.8 }); this.hitWall(z, p2 ? 2.5 : 1.5); break;
    case 'gorila': for (let i = 0; i < (p2 ? 3 : 1); i++) this.bThrow(z, z.x + (i - (p2 ? 1 : 0)) * 70, 'batu', 1, 1.1); say('Lempar batu!', '#D8C0A0'); break;
    case 'badut': for (let i = 0; i < (p2 ? 2 : 1); i++) this.bThrow(z, 30 + R() * (W - 60), 'bom', 1.2, 1.5); say('Bom!', '#FF8A8A'); break;
    case 'pemanah': for (let i = 0; i < (p2 ? 8 : 4); i++) this.bThrow(z, 20 + R() * (W - 40), 'panah', 0.25, 0.7 + i * 0.06); break;
    case 'sihir': z.x = z.r + R() * (W - 2 * z.r); this.fx.push({ kind: 'evo', x: z.x, y: z.y, t: 0, r: z.r, warna: '#C08CF0' }); this.bThrow(z, z.x, 'apiS', 0.8, 0.9);
      if (p2) { for (const o of this.zombies) if (o !== z && o.hp > 0 && Math.hypot(o.x - z.x, o.y - z.y) < 140) o.invT = Math.max(o.invT || 0, 1.5); say('Sihir pelindung!', '#C08CF0'); } break;
    case 'labah': { const hs = team.slice().sort(() => R() - 0.5).slice(0, p2 ? 2 : 1); for (const m of hs) this.bThrow(z, m.x, 'jaring', 0, 0.8, m.id);
      for (let i = 0; i < 3; i++) { const zs = zombieStats('laju', this.stage, this.wave, this.diff.off), k = this.spawn('laju', { x: Math.max(14, Math.min(W - 14, z.x + (i - 1) * 22)), y: z.y + 10, hp: zs.hp * 0.5, gold: zs.gold * 0.3 }); k.r = 9; k.warna = '#3A3040'; } break; }
    case 'ais': for (const tw of this.towers) tw.frozenT = 3; if (p2 && team.length) { const m = team[Math.floor(R() * team.length)]; m.webT = 1.5; m.iceT = 1.5; } this.fx.push({ kind: 'bfreeze', t: 0, life: 0.8 }); say('Menara beku!', '#8FE0FF'); break;
    case 'robot': z.laserT = 1.2; z.laserX = p2 ? [40 + R() * (W / 2 - 60), W / 2 + 20 + R() * (W / 2 - 60)] : [Math.max(20, Math.min(W - 20, z.x + (R() - 0.5) * 120))]; this.fx.push({ kind: 'blaser', x: z.x, y: z.y, xs: z.laserX.slice(), t: 0, life: 1.2 }); break;
    case 'ular': z.under = p2 ? 2.6 : 1.8; z.invT = Math.max(z.invT || 0, 0.05); this.fx.push({ kind: 'boom', x: z.x, y: z.y, t: 0, r: 30, wid: 'ular' }); break;
    case 'kelawar': z.y = Math.min(WALL_Y - z.r, z.y + 70); z.hop = 0.35; if (p2) { this.poisonT = Math.max(this.poisonT || 0, 2); say('Jeritan sonik!', '#C8A0F0'); } break;
    case 'ketam': z.openT = 2; z.x = Math.max(z.r, Math.min(W - z.r, z.x + (R() < 0.5 ? -60 : 60))); if (p2 && z.y >= WALL_Y - z.r - 4) this.hitWall(z, 3); say('Sepit terbuka!', '#FFB08A'); break;
  }
};
// peluru boss: melengkung dari boss ke pagar (atau hero); boleh ditembak jatuh / diketik
Battle.prototype.bThrow = function (z, tx, kind, mul, dur, hero) {
  const m = hero ? this.team.find(h => h.id === hero) : null;
  (this.bproj || (this.bproj = [])).push({ kind, sx: z.x, sy: z.y, x: z.x, y: z.y, tx: Math.max(10, Math.min(W - 10, m ? m.x : tx)), ty: m ? m.y - 10 : WALL_Y - 6, t: 0, dur: dur || 1, dmg: z.dmg * mul, hero: hero || null, r: kind === 'batu' ? 13 : kind === 'bom' ? 11 : kind === 'panah' ? 7 : 9, arc: kind === 'panah' ? 30 : kind === 'jaring' ? 50 : 90 });
  this.fx.push({ kind: 'bthrow', x: z.x, y: z.y, t: 0, k: kind });
};
Battle.prototype.hitWallAt = function (x, dmg) { this.hitWall({ x, dmg, hp: 0, maxHp: 0, type: 'proj', r: 10, traits: [] }); };
Battle.prototype.updateBProj = function (dt) {
  const P = this.bproj; if (!P || !P.length) return;
  for (const p of P) {
    if (p.dead) continue; p.t += dt; const k = Math.min(1, p.t / p.dur);
    p.x = p.sx + (p.tx - p.sx) * k; p.y = p.sy + (p.ty - p.sy) * k - Math.sin(k * Math.PI) * p.arc;
    if (k >= 1) { p.dead = true;
      if (p.hero) { const m = this.team.find(h => h.id === p.hero); if (m) m.webT = Math.max(m.webT || 0, 2); this.fx.push({ kind: 'txt', x: p.tx, y: p.ty - 20, t: 0, txt: 'Terikat jaring!', warna: '#E8E8F0' }); }
      else { this.hitWallAt(p.tx, p.dmg); if (p.kind !== 'panah') this.fx.push({ kind: 'boom', x: p.tx, y: WALL_Y - 10, t: 0, r: p.kind === 'bom' ? 50 : 30, wid: p.kind === 'apiS' ? 'api' : 'meteor' }); } }
  }
  this.bproj = P.filter(p => !p.dead);
};
Battle.prototype.shootDown = function (p, x, y) { p.dead = true; stat(this.save, 'projDown'); this.fx.push({ kind: 'pdown', x: x == null ? p.x : x, y: y == null ? p.y : y, t: 0, k: p.kind, life: 0.5 }); };
Battle.prototype.markSeen = function (id) {
  let s = this.save.seenZ || ''; if (s.length < 1000) s = s + '0'.repeat(1000 - s.length);
  if (s[id] === '1') { this.save.seenZ = s; return false; }
  this.save.seenZ = s.slice(0, id) + '1' + s.slice(id + 1); (this.newSeen = this.newSeen || []).push(id); return true;
};
Battle.prototype.evolve = function (z, silent) {
  if (z.type === 'boss' || z.evo >= maxEvo(this.stage)) return false;
  z.evo++; z.hp *= 1.6; z.maxHp *= 1.6; z.r += 2; z.spd *= 1.1; z.dmg = Math.round(z.dmg * 1.4); z.gold = Math.round(z.gold * 1.5);
  if (z.evo >= 2 && z.traits.length < Math.floor(z.evo / 2)) {
    const pool = traitsFor(this.stage).filter(t => !z.traits.includes(t));
    if (pool.length) { const t = pool[Math.floor(this.rng() * pool.length)]; z.traits.push(t); if (t === 'pecut') z.spd *= 1.5; }
  }
  if (!silent) {
    this.evolved++; this.fx.push({ kind: 'evo', x: z.x, y: z.y, t: 0, r: z.r, warna: EVO_COLORS[z.evo] });
    // teks hanya untuk evolusi tinggi atau sifat baharu, dan tidak lebih sekali setiap 1.2 saat
    if ((z.evo >= 2 || z.traits.length) && (this.clock || 0) - (this.lastEvoTxt || -9) > 1.2) { this.lastEvoTxt = this.clock || 0; this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 8, t: 0, txt: 'Evolusi ' + EVO_NAMES[z.evo] + '!', warna: EVO_COLORS[z.evo] }); }
  }
  return true;
};
Battle.prototype.addGold = function (g, extraPct) { const v = Math.max(1, Math.round(g * goldMult(this.save, this.now) * (1 + (extraPct || 0) / 100) * (this.act.emas ? 3 : 1))); this.save.gold += v; this.earnedGold += v; stat(this.save, 'goldEarned', v); return v; };
Battle.prototype.teamGoldPct = function () { let p = 0; for (const m of this.team) p += heroStats(this.save, m.id, this.now).goldPct; return p; };
Battle.prototype.skillFx = function (h) {
  const ck = this.clock || 0; this.skT = this.skT || {}; if (ck - (this.skT[h] == null ? -9 : this.skT[h]) < 2.5) return; this.skT[h] = ck;
  const m = this.team.find(t => t.id === h); if (m) this.fx.push({ kind: 'skill', h, x: m.x, y: m.y, t: 0, life: 1.1 });
};
Battle.prototype.bossTraitDmg = function (z, dmg, fx) {
  const T = z.btr, wid = fx.wid, W = wid && WEAPONS[wid], J = W ? W.jenis : null, K = kebalK(this);
  const kebal = (why) => { const ck = this.clock || 0; if (!z._kbT || ck - z._kbT > 0.45) { z._kbT = ck; this.fx.push({ kind: 'txt', x: z.x + (Math.random() - 0.5) * 20, y: z.y - z.r - 8, t: 0, txt: 'KEBAL' + (why ? ' ' + why : ''), warna: '#B8C0CC' }); } return dmg * (1 - K); };
  if (fx.bullet && T.includes('bayang') && this.rng() < 0.3 * (1 - Math.min(100, fx.acc || 0) / 100)) { this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r, t: 0, txt: 'Elak!', warna: '#D8E0F0' }); return null; }
  if (J) {
    const ph = T.includes('giliran') ? (Math.floor((this.clock || 0) / 6) % 2 ? 'kmag' : 'kfiz') : null;
    if (J === 'f' && (T.includes('kfiz') || ph === 'kfiz')) dmg = kebal('🛡');
    else if (J === 'm' && (T.includes('kmag') || ph === 'kmag')) dmg = kebal('🔮');
    if (T.includes('kapi') && W_ELEM.api.includes(wid)) { z.hp = Math.min(z.maxHp, z.hp + dmg * 0.1); dmg = kebal('🔥'); fx.burn = 0; }
    if (T.includes('kracun') && W_ELEM.racun.includes(wid)) { dmg = kebal('☠'); fx.burn = 0; }
    if (T.includes('serap') && W_ELEM[z.belem] && W_ELEM[z.belem].includes(wid)) { z.hp = Math.min(z.maxHp, z.hp + dmg * 0.2); this.fx.push({ kind: 'heal', x: z.x, y: z.y, t: 0 }); return null; }
  }
  if (fx.bullet && fx.crit && T.includes('kkrit') && fx.cm > 1) dmg /= fx.cm;
  if (T.includes('batu')) dmg = Math.min(dmg, z.maxHp * 0.03);
  if (fx.bullet && T.includes('pantul') && this.rng() < 0.2) { const ck = this.clock || 0; if (!z._ptT || ck - z._ptT > 0.25) { z._ptT = ck; this.hitWallAt(z.x, z.dmg * 0.12); this.fx.push({ kind: 'ring', x: z.x, y: z.y, t: 0, life: 0.25, r: z.r + 6, col: '200,220,255' }); } return null; }
  return dmg;
};
Battle.prototype.damage = function (z, dmg, fx) {
  if (z.hp <= 0) return;
  if (z.invT > 0) { if (this.fx.length < 200 && Math.random() < 0.2) this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r, t: 0, txt: 'Kebal', warna: '#C8D0DC' }); return; }
  if (fx && fx.bullet && z.traits.includes('hantu') && this.rng() < 0.25 * (1 - Math.min(100, fx.acc || 0) / 100)) { this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r, t: 0, txt: 'Elak!', warna: '#D8E0F0' }); return; }
  if (z.btr && z.btr.length && fx) { const r = this.bossTraitDmg(z, dmg, fx); if (r === null) return; dmg = r; }
  if (z.guardU && (this.clock || 0) < z.guardU) dmg *= 0.4;
  const J = fx && fx.wid && WEAPONS[fx.wid] ? WEAPONS[fx.wid].jenis : null, pen = fx && fx.wid === 'railgun' ? 100 : Math.min(100, (fx && fx.pen) || 0);
  if (J !== 'm' && z.traits.includes('perisai')) dmg *= 1 - 0.35 * (1 - pen / 100);
  if (J === 'm' && z.traits.includes('perisai_m')) dmg *= 1 - 0.35 * (1 - pen / 100);
  const src = fx && fx.src; if (src) { const dealt = Math.min(dmg, Math.max(0, z.hp)); if (isFinite(dealt)) this.dmgBy[src] = (this.dmgBy[src] || 0) + dealt; }
  if (this.dmgMat > 1) dmg *= this.dmgMat;
  if (z.bossKind === 'ketam' && !(z.openT > 0)) dmg *= 0.6;
  if (this.act.uLemah) dmg *= this.act.uLemah.k;
  if (z.markT > 0) dmg *= 1 + (z.markK || 0);
  z.hp -= dmg; z.hitT = 0.12; if (fx && fx.wid) z.lastWid = fx.wid;
  if (fx && fx.bullet && this.fx.length < 220) {
    const ck = this.clock || 0;
    if (this.dmgNums && (!z._dnT || ck - z._dnT > 0.22)) { z._dnT = ck; this.fx.push({ kind: 'dn', x: z.x + (Math.random() - 0.5) * 12, y: z.y - z.r, v: dmg, crit: !!fx.crit, t: 0, life: 0.75 }); }
    if (z.traits.includes('perisai') && Math.random() < 0.25) this.fx.push({ kind: 'clank', x: z.x, y: z.y, t: 0, life: 0.3 });
  }
  if (fx && fx.slow && !z.traits.includes('kebal_ais')) { z.slowT = 1.5; z.slowK = Math.max(z.slowK, fx.slow); }
  if (fx && fx.burn && !z.traits.includes('kebal_api')) { z.burnT = fx.abadi ? 6 : 3; z.burnD = Math.max(z.burnD, fx.burn); z.burnW = fx.wid || z.burnW; if (fx.src) z.burnSrc = fx.src; }
  if (fx && fx.crit) this.fx.push({ kind: 'txt', x: z.x + 10, y: z.y - 6, t: 0, txt: 'KRITIKAL', warna: '#FF5A5A' });
  if (z.type === 'boss' && !z.rage && z.hp > 0 && z.hp < z.maxHp / 2) {
    z.rage = true; z.spd *= 1.4; z.dmg = Math.round(z.dmg * 1.5); z.evo = Math.max(z.evo, 2);
    this.fx.push({ kind: 'evo', x: z.x, y: z.y, t: 0, r: z.r, warna: '#FF5A5A' }); this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 30, t: 0, txt: 'BOSS MENGAMUK!', warna: '#FF5A5A' }); this.evolved++;
  }
  if (z.hp <= 0 && z.btr && z.btr.includes('bangkit') && !z.revived) { z.revived = true; z.hp = z.maxHp * 0.3; z.invT = 1.2; this.fx.push({ kind: 'evo', x: z.x, y: z.y, t: 0, r: z.r, warna: '#F2C230' }); this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 30, t: 0, txt: '⏳ BANGKIT SEMULA!', warna: '#F2C230' }); return; }
  if (z.hp <= 0) {
    this.ultCharge(z);
    const g = this.addGold(z.gold, this.goldPctCache || 0);
    this.save.kills += 1; stat(this.save, 'kills'); if (z.evo > 0) stat(this.save, 'evoKills');
    this.fx.push({ kind: 'txt', x: z.x, y: z.y, t: 0, txt: '+' + fmtNum(g), warna: '#F5B82E' });
    this.fx.push({ kind: 'pop', x: z.x, y: z.y, t: 0, r: z.r, warna: z.warna, boss: z.type === 'boss' });
    if (z.type !== 'boss') this.fx.push({ kind: 'die', z, t: 0, life: 0.65 });
    if (z.traits.includes('pembelah') && !z.kid) for (let i = 0; i < 2; i++) this.spawn('laju', { x: Math.max(14, Math.min(W - 14, z.x + (i ? 16 : -16))), y: z.y, hp: z.maxHp * 0.25, gold: z.gold * 0.2 });
    const dropP = (ITEM_DROP_BASE + 0.002 * this.save.shop.luck) * (boostOn(this.save, 'drop', this.now) ? 3 : 1) * (1 + 0.25 * z.evo) * (this.aura ? this.aura.drop : 1) * (1 + (this.bagDrop || 0) / 100);
    if (z.type === 'boss') {
      if (z.bossId != null && bossDexSet(this.save, z.bossId, 2)) stat(this.save, 'bossKinds');
      const gm = Math.round((isBigBoss(this.stage) ? 25 : 5) * (1 + 0.2 * perk(this.save, 'rezeki')) * this.diff.gems); this.save.gems += gm; this.earnedGems += gm; stat(this.save, 'bosses'); stat(this.save, 'gemsGot', gm); if (isBigBoss(this.stage)) stat(this.save, 'bigBosses');
      this.fx.push({ kind: 'txt', x: z.x, y: z.y - 24, t: 0, txt: '+' + gm + ' gems', warna: '#A066E8' });
      this.dropItem(z, Math.min(8, (isBigBoss(this.stage) ? 4 : 3) + this.diff.rar));
      if (isBigBoss(this.stage) && this.rng() < 0.03) { const r = grantSkin(this.save, randomSkin(this.rng).id); this.fx.push({ kind: 'txt', x: z.x, y: z.y - 52, t: 0, txt: '👘 ' + r.sk.nama, warna: '#FFB04A' }); (this.skinLog = this.skinLog || []).push(r.sk.id); }
    } else if (this.rng() < dropP) this.dropItem(z, Math.min(3, z.evo) + this.diff.rar);
    const evS = this.now || this.save.eventForce ? activeEvent(this.now, this.save.eventForce) : null; if (z.type === 'boss' || this.rng() < 0.006 * (1 + 0.3 * z.evo) * (evS ? evS.shard : 1) * (1 + (this.bagDrop || 0) / 100)) { const h = randomShardHero(this.rng), n = z.type === 'boss' ? (isBigBoss(this.stage) ? 5 : 3) : 1; addShards(this.save, h, n); (this.shardLog = this.shardLog || []).push({ h, n }); this.fx.push({ kind: 'loot', sub: 'shard', tier: HEROES[h].tier, n, x: z.x, y: z.y, t: 0, life: 1.6, dir: this.rng() < 0.5 ? -1 : 1 }); }
  }
};
// v9.7: mekanik senjata baharu — knock (tolak px), stun (peluang kaku), wet (basah s), mark (sumpahan +%)
Battle.prototype.wMech = function (z, d, b) {
  if (z.hp <= 0) return; const kebal = z.btr && z.btr.includes('ktolak'), boss = z.type === 'boss';
  if (d.knock && !kebal) { z.y = Math.max(-z.r, z.y - d.knock * (boss ? 0.5 : z.r > 20 ? 0.7 : 1)); }
  if (d.stun && !kebal && (this.clock || 0) >= (z.stunCd || 0) && this.rng() < d.stun) { z.freezeT = Math.max(z.freezeT || 0, boss ? 0.2 : 0.5); z.stunCd = (this.clock || 0) + 2; if (this.fx.length < 200) this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 8, t: 0, txt: 'Kaku!', warna: '#C8A070' }); }
  if (d.wet) z.wetT = Math.max(z.wetT || 0, d.wet);
  if (z.wetT > 0 && W_FAM[b.wid] === 'ais' && !z.traits.includes('kebal_ais')) { z.slowT = Math.max(z.slowT || 0, 3); if (!kebal && this.rng() < 0.15) z.freezeT = Math.max(z.freezeT || 0, boss ? 0.25 : 0.6); }
  if (d.mark) { z.markT = 3; z.markK = Math.max(z.markT > 0 ? z.markK || 0 : 0, d.mark); }
};
// v9.8: 8 Kuasa Mitos (dipanggil selepas peluru senjata Mitos mengenai zombie)
const W_PERK = { ganda: ['Tembakan Berganda', 'Setiap tembakan ke-4 ×2 damage'], boss: ['Pemburu Boss', '+25% damage kepada boss'], tembus: ['Penembus', '+2 tembus'], kritik: ['Kritikal Tajam', '+10% kritikal'], pantas: ['Pantas', '+15% laju tembak'], jauh: ['Jarak Jauh', '+20% jarak'], udara: ['Anti-Udara', '+50% damage kepada zombie terbang'], pecah: ['Pemecah Perisai', 'Abaikan 25% perisai'] };
const MITOS_DESC = { meletup: 'Zombie yang mati meletup (30% damage kawasan)', lantun: 'Peluru melantun ke 2 zombie lain', rantai: '+2 lompatan kilat setiap pukulan', beku: '10% peluang beku 1 saat', abadi: 'Bakaran 2× lebih lama', suci: 'Setiap bunuhan pulihkan pagar 0.2%', kembar: '20% peluang peluru berganda', gempa: '10% peluang kaku kawasan 0.8 saat' };
function wPerkText(wid) { const w = WEAPONS[wid]; if (!w || !w.perk) return ''; return w.perk.map(p => { if (p.startsWith('mitos_')) { const m = p.slice(6); return '🟠 ' + MITOS_NAMA[m] + ': ' + MITOS_DESC[m]; } const k = p.replace('+', ''), P = W_PERK[k]; return P ? '✦ ' + P[0] + (p.endsWith('+') ? ' (×1.5)' : '') + ': ' + P[1] : ''; }).filter(Boolean).join(' · '); }
const MITOS_NAMA = { meletup: 'Letupan Maut', lantun: 'Lantunan', rantai: 'Kilat Berantai', beku: 'Pembekuan', abadi: 'Api Abadi', suci: 'Pancaran Suci', kembar: 'Bayang Kembar', gempa: 'Gempa' };
Battle.prototype.mitosHit = function (z, d, b, fx) {
  const M = d.mitos, kebal = z.btr && z.btr.includes('ktolak'), boss = z.type === 'boss';
  if (M === 'meletup' && z.hp <= 0) this.splash(z.x, z.y, 50, b.dmgHit * 0.5, fx, z.id);       // splash() memberi 60% → 30% damage peluru
  else if (M === 'suci' && z.hp <= 0) { this.heal(0.002); if (this.fx.length < 200) this.fx.push({ kind: 'heal', x: z.x, y: z.y, t: 0 }); }
  else if (M === 'rantai') this.chainFrom(z, 2, b.dmgHit * 0.6, fx);
  else if (M === 'beku') { if (!kebal && this.rng() < 0.1) { z.freezeT = Math.max(z.freezeT || 0, boss ? 0.4 : 1); if (this.fx.length < 200) this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 8, t: 0, txt: 'Beku!', warna: '#9FE6FF' }); } }
  else if (M === 'gempa') { if (this.rng() < 0.1) { for (const o of this.zombies) if (o.hp > 0 && !(o.btr && o.btr.includes('ktolak')) && Math.hypot(o.x - z.x, o.y - z.y) < 55 + o.r) o.freezeT = Math.max(o.freezeT || 0, o.type === 'boss' ? 0.3 : 0.8); this.fx.push({ kind: 'shake', t: 0, mag: 3 }); } }
  else if (M === 'lantun') {
    if (b.bounce == null) b.bounce = 2;
    if (b.bounce > 0) { let nx = null, nd = 170; for (const o of this.zombies) if (o.hp > 0 && !b.hit.includes(o.id) && (!o.fly || b.air !== false)) { const dd = Math.hypot(o.x - z.x, o.y - z.y); if (dd < nd) { nd = dd; nx = o; } }
      if (nx) { b.bounce--; b.pierce = Math.max(b.pierce, 0) + 1; const a = Math.atan2(nx.y - b.y, nx.x - b.x); b.vx = Math.cos(a) * b.spd; b.vy = Math.sin(a) * b.spd; b.life = Math.max(b.life, 0.6); } }
  }
};
Battle.prototype.dropItem = function (z, minRar) {
  const r = addItem(this.save, makeItem(this.save, this.rng, minRar));
  this.drops.push(r);
  this.fx.push({ kind: 'loot', sub: 'item', rar: r.it.rar, jenis: r.it.jenis, x: z.x, y: z.y, t: 0, life: 1.8, dir: this.rng() < 0.5 ? -1 : 1 });
};
Battle.prototype.splash = function (x, y, rad, dmg, fx, skipId) {
  this.fx.push({ kind: 'boom', x, y, t: 0, r: rad, wid: fx && fx.wid });
  for (const z of this.zombies) if (z.hp > 0 && z.id !== skipId && !(z.fly && fx && fx.air === false) && Math.hypot(z.x - x, z.y - y) < rad + z.r) this.damage(z, dmg * 0.6, fx);
};
Battle.prototype.chainFrom = function (z0, n, dmg, fx) {
  let cur = z0; const hit = [z0.id];
  for (let i = 0; i < n; i++) {
    let nx = null, bd = 130;
    for (const z of this.zombies) if (z.hp > 0 && !hit.includes(z.id)) { const d = Math.hypot(z.x - cur.x, z.y - cur.y); if (d < bd) { bd = d; nx = z; } }
    if (!nx) break;
    this.fx.push({ kind: 'zap', x: cur.x, y: cur.y, x2: nx.x, y2: nx.y, t: 0, wid: fx && fx.wid, seed: Math.random() * 1000 });
    hit.push(nx.id); this.damage(nx, dmg * 0.7, fx); cur = nx;
  }
};
// ---------- v9.16: Sarung Tapak (12) ----------
const TAPAK = {
  biasa:  { nama: 'Tapak Biasa',  ikon: '✋', el: 'fizikal', warna: '#F2C28E', gelap: '#B07A4A', dapat: { j: 'free' }, desc: 'Tapak asas. Tiada kesan tambahan.' },
  api:    { nama: 'Tapak Api',    ikon: '🔥', el: 'api', warna: '#FF7A3A', gelap: '#A8301A', dapat: { j: 'stat', k: 'taps', n: 1000, t: 'Tekan zombie 1,000 kali' }, desc: 'Bakar zombie selama 2 saat.' },
  ais:    { nama: 'Tapak Ais',    ikon: '❄', el: 'ais', warna: '#9FE0FF', gelap: '#3A7AA8', dapat: { j: 'stat', k: 'maxCombo', n: 50, t: 'Capai kombo ×50' }, desc: 'Perlahankan zombie 30%.' },
  petir:  { nama: 'Tapak Petir',  ikon: '⚡', el: 'elektrik', warna: '#FFE45A', gelap: '#A8861A', dapat: { j: 'stat', k: 'stomps', n: 20, t: 'Lepaskan 20 Tapak Gergasi' }, desc: 'Kilat melompat ke 2 zombie berdekatan (50% damage).' },
  angin:  { nama: 'Tapak Angin',  ikon: '💨', el: 'angin', warna: '#9AF0E0', gelap: '#2E8A7A', dapat: { j: 'stat', k: 'taps', n: 5000, t: 'Tekan zombie 5,000 kali' }, desc: 'Tolak zombie ke belakang (boss hanya sedikit).' },
  batu:   { nama: 'Tapak Batu',   ikon: '🪨', el: 'bumi', warna: '#B8A888', gelap: '#5A4A32', dmg: 1.3, win: 0.8, dapat: { j: 'best', n: 50, t: 'Sampai stage 50' }, desc: 'Damage ×1.3, tetapi kombo tamat lebih cepat.' },
  air:    { nama: 'Tapak Air',    ikon: '💧', el: 'air', warna: '#6AB8F0', gelap: '#1E5A9A', dapat: { j: 'stat', k: 'maxCombo', n: 100, t: 'Capai kombo ×100' }, desc: 'Zombie jadi Basah 3 saat (kuat dengan senjata elektrik).' },
  racun:  { nama: 'Tapak Racun',  ikon: '☠', el: 'racun', warna: '#9AE05A', gelap: '#3A6A1A', dapat: { j: 'gems', n: 300 }, desc: 'Racun bertimbun pada zombie (sehingga 30% damage sesaat).' },
  emas:   { nama: 'Tapak Emas',   ikon: '💰', el: 'fizikal', warna: '#FFD24A', gelap: '#A87A10', dapat: { j: 'gems', n: 500 }, desc: 'Setiap tekanan memberi sedikit gold.' },
  bayang: { nama: 'Tapak Bayang', ikon: '🌑', el: 'bayang', warna: '#8A6AC8', gelap: '#2A1A50', crit: 0.25, dapat: { j: 'gems', n: 500 }, desc: 'Peluang kritikal 25% (biasa 10%).' },
  cahaya: { nama: 'Tapak Cahaya', ikon: '✨', el: 'cahaya', warna: '#FFF2A0', gelap: '#B89A30', dapat: { j: 'gems', n: 400 }, desc: 'Setiap 20 tekanan kena, pagar pulih 1%.' },
  raja:   { nama: 'Tapak Raja',   ikon: '👑', el: 'fizikal', warna: '#C89AFF', gelap: '#5A2A9A', dmg: 1.1, crit: 0.15, mitos: 1, dapat: { j: 'peti', t: 'Peluang 3% dari Peti Senjata Legenda' }, desc: 'Gabungan kecil: bakar, perlahan, Basah, kritikal 15%, sedikit gold.' }
};
const TAPAK_ORDER = Object.keys(TAPAK), TAPAK_MAX = 30, TAPAK_CAP = 3, TAPAK_RAJA_P = 0.03, PEMBANTU_RATE = 3;
function cleanTapak(o) { const r = { own: { biasa: 1 }, lvl: {}, pakai: 'biasa' }; if (!o || typeof o !== 'object') return r;
  if (o.own && typeof o.own === 'object') TAPAK_ORDER.forEach(k => { if (o.own[k]) r.own[k] = 1; });
  if (o.lvl && typeof o.lvl === 'object') TAPAK_ORDER.forEach(k => { const l = o.lvl[k]; if (typeof l === 'number' && isFinite(l) && l > 1) r.lvl[k] = Math.min(TAPAK_MAX, Math.floor(l)); });
  if (TAPAK[o.pakai]) r.pakai = o.pakai; return r; }
function cleanTpb(o) { return { own: !!(o && o.own === true), on: !(o && o.on === false) }; }
function tapakOk(save, id) { const T = TAPAK[id]; if (!T) return false; const P = save.tapak; if (P && P.own[id]) return true; const d = T.dapat;
  if (d.j === 'free') return true; if (d.j === 'stat') return ((save.stats && save.stats[d.k]) || 0) >= d.n; if (d.j === 'best') return Math.max(save.best || 1, (save.stats && save.stats.bestEver) || 0) >= d.n; return false; }
// tandakan tapak yang sudah layak sebagai milik kekal; pulangkan yang baharu
function tapakSync(save) { if (!save.tapak) save.tapak = cleanTapak(null); const baru = []; TAPAK_ORDER.forEach(k => { if (!save.tapak.own[k] && tapakOk(save, k)) { save.tapak.own[k] = 1; baru.push(k); } }); return baru; }
function tapakPakai(save) { const P = save.tapak; return P && TAPAK[P.pakai] && tapakOk(save, P.pakai) ? P.pakai : 'biasa'; }
function tapakLvl(save, id) { return (save.tapak && save.tapak.lvl[id]) || 1; }
function tapakMult(save, id) { return (TAPAK[id].dmg || 1) * (1 + 0.05 * (tapakLvl(save, id) - 1)); }
function tapakCost(id, l) { return Math.round(400 * Math.pow(1.55, l - 1) * (TAPAK[id].mitos ? 2 : 1)); }
function equipTapak(save, id) { if (!TAPAK[id]) return { ok: false, msg: 'Tiada tapak itu' }; if (!tapakOk(save, id)) return { ok: false, msg: 'Belum dibuka: ' + (TAPAK[id].dapat.t || 'beli dengan gems') }; tapakSync(save); save.tapak.pakai = id; return { ok: true, msg: TAPAK[id].ikon + ' ' + TAPAK[id].nama + ' dipakai' }; }
function buyTapak(save, id) { const T = TAPAK[id]; if (!T || T.dapat.j !== 'gems') return { ok: false, msg: 'Tapak ini tidak dijual' }; tapakSync(save); if (save.tapak.own[id]) return { ok: false, msg: 'Sudah dimiliki' };
  if (save.gems < T.dapat.n) return { ok: false, msg: 'Gems tak cukup (perlu ' + T.dapat.n + ')' }; save.gems -= T.dapat.n; save.tapak.own[id] = 1; return { ok: true, msg: T.ikon + ' ' + T.nama + ' dibuka!' }; }
function upgradeTapak(save, id) { if (!TAPAK[id] || !tapakOk(save, id)) return { ok: false, msg: 'Tapak belum dibuka' }; const l = tapakLvl(save, id); if (l >= TAPAK_MAX) return { ok: false, msg: 'Sudah maksimum' };
  const c = tapakCost(id, l); if (save.gold < c) return { ok: false, msg: 'Gold tak cukup (perlu ' + fmtNum(c) + ')' }; save.gold -= c; tapakSync(save); save.tapak.lvl[id] = l + 1; return { ok: true, msg: TAPAK[id].nama + ' Lv.' + (l + 1) }; }
// pengganda elemen tapak; tapak Api/Racun separuh damage lawan zombie/boss yang kebal elemen itu
function tapakElK(id, zel, fly, traits, btr) { const T = TAPAK[id], Tr = traits || [], B = btr || []; let k = elemKEl(T.el, zel, fly, Tr, B);
  if ((T.el === 'api' && (Tr.includes('kebal_api') || B.includes('kapi'))) || (T.el === 'racun' && B.includes('kracun'))) k *= 0.5; return k; }
// tapak terbaik untuk boss (ikut elemen & sifat)
function tapakForBoss(save, zel, btr) { const B = btr || []; let best = 'biasa', bk = -1;
  TAPAK_ORDER.forEach(id => { if (!tapakOk(save, id)) return; const T = TAPAK[id]; let k = tapakMult(save, id) * tapakElK(id, zel, B.includes('terbang'), [], B) * (1 + ((T.crit || 0.1) - 0.1)); if (id === 'ais' && B.includes('kslow')) k *= 0.9; if (k > bk + 1e-9) { bk = k; best = id; } }); return best; }
function tapRadius(save) { return 45 + 8 * (save.shop.jariApi || 0); }
function tapWindow(save) { return (0.9 + 0.1 * (save.shop.kombo || 0)) * (TAPAK[tapakPakai(save)].win || 1); }
function comboMult(save, combo) { return 1 + Math.min(1 + 0.1 * (save.shop.kombo || 0), combo / 20); }
const STOMP_EVERY = 50;
Battle.prototype.tapBase = function () { if (!this.team.length) return 0; return Math.max(...this.team.map(m => heroStats(this.save, m.id, this.now).dmg)) * 0.3 * (1 + 0.5 * this.save.shop.tap); };
Battle.prototype.tap = function (x, y, auto) {
  if (this.state !== 'main') return false;
  const R0 = tapRadius(this.save); let hit = null, bd = 1e9;
  if (!auto && this.bproj) for (const p of this.bproj) if (!p.dead && Math.hypot(p.x - x, p.y - y) < p.r + 22) { this.shootDown(p, x, y); return true; }
  for (const z of this.zombies) if (z.hp > 0) { const d = Math.hypot(z.x - x, z.y - y) - z.r; if (d < R0 && d < bd) { bd = d; hit = z; } }
  if (hit && hit.btr && hit.btr.includes('tahanketik')) { if (!auto) this.fx.push({ kind: 'txt', x: hit.x, y: hit.y - hit.r, t: 0, txt: '👆 Tahan Ketik', warna: '#B8C0CC' }); return false; }
  if (!hit) return auto ? false : this.tapGround(x, y);
  const tid = tapakPakai(this.save), T = TAPAK[tid];
  if (!auto) { this.combo = (this.comboT > 0 ? this.combo || 0 : 0) + 1; this.comboT = tapWindow(this.save); statMax(this.save, 'maxCombo', this.combo); }
  const combo = this.combo || 0, ek = tapakElK(tid, hit.zel, !!hit.fly, hit.traits, hit.btr);
  const crit = this.rng() < (T.crit || 0.1), k = Math.min(TAPAK_CAP, tapakMult(this.save, tid) * ek);
  const dmg = this.tapBase() * comboMult(this.save, combo) * (crit ? 2 : 1) * k;
  this.damage(hit, dmg); stat(this.save, auto ? 'autoTaps' : 'taps');
  this.tapEffect(hit, tid, dmg, combo >= 25 ? 2 : 1);
  if (ek !== 1 && !auto && this.fx.length < 200 && (!hit._ekT || (this.clock || 0) - hit._ekT > 2.5)) { hit._ekT = this.clock || 0; this.fx.push({ kind: 'txt', x: hit.x, y: hit.y - hit.r - 18, t: 0, txt: ek > 1 ? 'KUAT!' : 'LEMAH', warna: ek > 1 ? '#7FF07A' : '#B8C0CC' }); }
  this.fx.push({ kind: 'tapHit', x: hit.x, y: hit.y, t: 0, dmg, crit, combo, a: this.rng() * Math.PI, tapak: tid, auto: !!auto });
  if (combo >= 10) { let o2 = null, od = 61; for (const o of this.zombies) if (o !== hit && o.hp > 0 && !(o.btr && o.btr.includes('tahanketik'))) { const d = Math.hypot(o.x - hit.x, o.y - hit.y) - o.r; if (d < od) { od = d; o2 = o; } }
    if (o2) { this.damage(o2, dmg * 0.5); this.fx.push({ kind: 'tapHit', x: o2.x, y: o2.y, t: 0, dmg: dmg * 0.5, crit: false, combo, a: this.rng() * Math.PI, tapak: tid, auto: true, kecil: true }); } }
  this.tapCharge = (this.tapCharge || 0) + 1;
  if (this.tapCharge >= STOMP_EVERY) { this.tapCharge = 0; this.stomp(hit.x, hit.y); }
  return true;
};
// v9.17: tekan di tanah (tiada zombie dekat jari) — tapak tetap menampar: gelombang kecil 50% damage, isi bar ✋
const TAP_SPLASH = 70;
function tapSplashR(save) { return TAP_SPLASH + 4 * (save.shop.jariApi || 0); }
Battle.prototype.tapGround = function (x, y) {
  const tid = tapakPakai(this.save), R = tapSplashR(this.save), base = this.tapBase() * 0.5 * comboMult(this.save, this.combo || 0); let n = 0;
  for (const z of this.zombies) if (z.hp > 0 && !(z.btr && z.btr.includes('tahanketik')) && Math.hypot(z.x - x, z.y - y) < R + z.r) { this.damage(z, base * Math.min(TAPAK_CAP, tapakMult(this.save, tid) * tapakElK(tid, z.zel, !!z.fly, z.traits, z.btr))); n++; }
  this.fx.push({ kind: 'tapHit', x, y, t: 0, dmg: 0, ground: true, n, r: R, tapak: tid, combo: 0, a: this.rng() * Math.PI });
  if (n) stat(this.save, 'taps');
  this.tapCharge = (this.tapCharge || 0) + 1; if (this.tapCharge >= STOMP_EVERY) { this.tapCharge = 0; this.stomp(x, y); }
  return n > 0;
};
// kesan elemen sarung tapak (m = 2 bila kombo ×25 ke atas)
Battle.prototype.tapEffect = function (z, tid, dmg, m) {
  if (!z || z.hp <= 0) return; const T = z.traits || [], B = z.btr || [], boss = z.type === 'boss';
  const burn = (d, t) => { if (T.includes('kebal_api') || B.includes('kapi')) return; z.burnT = Math.max(z.burnT || 0, t); z.burnD = Math.max(z.burnD || 0, d); z.burnW = 'api'; };
  const slow = k => { if (T.includes('kebal_ais') || B.includes('kslow')) return; z.slowT = Math.max(z.slowT || 0, 1.5); z.slowK = Math.max(z.slowK || 0, Math.min(0.6, k)); };
  if (tid === 'api') burn(dmg * 0.15 * m, 2);
  else if (tid === 'ais') slow(0.3 * m);
  else if (tid === 'racun') { if (!B.includes('kracun')) { const prev = z.burnW === 'racun' ? (z.burnD || 0) : 0, other = z.burnW === 'racun' ? 0 : (z.burnD || 0); z.burnD = Math.max(other, Math.min(dmg * 0.3 * m, prev + dmg * 0.06 * m)); z.burnT = Math.max(z.burnT || 0, 4); z.burnW = 'racun'; } }
  else if (tid === 'petir') { const n = 2 * m, near = this.zombies.filter(o => o !== z && o.hp > 0 && Math.hypot(o.x - z.x, o.y - z.y) < 90).sort((a, b) => Math.hypot(a.x - z.x, a.y - z.y) - Math.hypot(b.x - z.x, b.y - z.y)).slice(0, n);
    for (const o of near) { this.damage(o, dmg * 0.5, { wid: 'petir' }); if (this.fx.length < 220) this.fx.push({ kind: 'tapZap', x: z.x, y: z.y, x2: o.x, y2: o.y, t: 0, life: 0.25 }); } }
  else if (tid === 'angin') z.y = Math.max(-20, z.y - (boss || B.length ? 3 : 14 * m));
  else if (tid === 'air') z.wetT = Math.max(z.wetT || 0, 3 * m);
  else if (tid === 'emas') this.addGold(Math.max(1, (z.gold || 1) * 0.05 * m));
  else if (tid === 'cahaya') { this.tapHeal = (this.tapHeal || 0) + m; if (this.tapHeal >= 20) { this.tapHeal = 0; this.heal(0.01); this.fx.push({ kind: 'txt', x: W / 2, y: WALL_Y - 40, t: 0, txt: '✨ Pagar +1%', warna: '#FFF2A0' }); } }
  else if (tid === 'raja') { burn(dmg * 0.06 * m, 1.5); slow(0.15 * m); z.wetT = Math.max(z.wetT || 0, 1.5); this.addGold(Math.max(1, (z.gold || 1) * 0.02 * m)); }
};
// Tangan Pembantu (pembelian): sasar zombie paling hampir dengan pagar
Battle.prototype.pembantuTarget = function () { let best = null; for (const z of this.zombies) if (z.hp > 0 && z.y > 0 && !(z.btr && z.btr.includes('tahanketik')) && (!best || z.y > best.y)) best = z; return best; };
Battle.prototype.updatePembantu = function (dt) {
  const P = this.save.tpb; if (!P || !P.own || !P.on) return;
  const iv = 1 / PEMBANTU_RATE; this.pbT = (this.pbT || 0) + dt; let n = 0;
  while (this.pbT >= iv && n < 3) { this.pbT -= iv; n++; const z = this.pembantuTarget(); if (z) { this.tap(z.x, z.y, true); this.pbPos = { x: z.x, y: z.y }; } }
  if (this.pbT > iv) this.pbT = 0;
};
Battle.prototype.stomp = function (x, y) {
  const dmg = this.tapBase() * 6 * ((this.combo || 0) >= 50 ? 1.5 : 1), tid = tapakPakai(this.save); stat(this.save, 'stomps');
  this.fx.push({ kind: 'stomp', x, y, t: 0, life: 1, tapak: tid, kuat: (this.combo || 0) >= 50 }); this.fx.push({ kind: 'shake', t: 0, mag: 8 });
  for (const z of this.zombies) if (z.hp > 0 && Math.hypot(z.x - x, z.y - y) < 110 + z.r) { this.damage(z, dmg * (z.type === 'boss' ? 0.5 : 1)); z.slowT = 1; z.slowK = Math.max(z.slowK, 0.5); if (tid !== 'emas' && tid !== 'cahaya') this.tapEffect(z, tid, dmg * 0.2, 1); }
};
Battle.prototype.teamDps = function () {
  let s = 0;
  for (const m of this.team) { const st = heroStats(this.save, m.id, this.now), wd = WEAPONS[st.wid]; s += st.dmg * st.rate * (wd.n || 1) * (wd.splash ? 1.5 : 1) * (wd.chain ? 1 + wd.chain * 0.3 : 1); }
  return s;
};
Battle.prototype.heal = function (frac) { if (this.wall <= 0) return; this.wall = Math.min(this.wallMax, this.wall + this.wallMax * frac * (this.hm || 1)); };
Battle.prototype.wallSkillReady = function () { return this.state === 'main' && this.mat >= 0 && !(this.pcd.wall > 0) && this.wall > 0; };
Battle.prototype.useWallSkill = function () {
  if (!this.wallSkillReady()) return false;
  const m = this.mat, base = this.teamDps() * 0.5, near = this.zombies.filter(z => z.hp > 0 && z.y + z.r > WALL_Y - 150);
  this.pcd.wall = WALL_SKILL_CD; stat(this.save, 'wallSkills');
  this.fx.push({ kind: 'wskill', mat: m, t: 0, life: 1.3 });
  switch (m) {
    case 0: this.heal(0.25); break;
    case 1: for (const z of near) { this.damage(z, base * 2); if (z.type !== 'boss') z.y -= 70; } break;
    case 2: this.act.wbata = { t: 6 }; break;
    case 3: for (const z of near) { this.damage(z, base * 6 * (z.type === 'boss' ? 0.5 : 1)); z.freezeT = Math.max(z.freezeT || 0, z.type === 'boss' ? 0.5 : 1.5); } this.fx.push({ kind: 'shake', t: 0, mag: 6 }); break;
    case 4: this.act.wduri = { t: 8 }; break;
    case 5: this.act.wkebal = { t: 4 }; break;
    case 6: this.act.wslow = { t: 6 }; this.heal(0.10); break;
    case 7: for (const z of near) { this.damage(z, base * 3); z.freezeT = Math.max(z.freezeT || 0, z.type === 'boss' ? 1 : 2.5); } break;
    case 8: for (const z of near) { this.damage(z, base * 8 * (z.type === 'boss' ? 0.5 : 1)); this.fx.push({ kind: 'strike', x: z.x, y: z.y, t: 0 }); } break;
    case 9: this.heal(0.5); this.act.wkebal = { t: 3 }; break;
  }
  return true;
};
Battle.prototype.powerReady = function (id) { return !this.mods.noPower && this.state === 'main' && !!this.save.powers[id] && !(this.pcd[id] > 0); };
Battle.prototype.usePower = function (id) {
  if (!this.powerReady(id)) return false;
  const lvl = this.save.powers[id], base = this.teamDps() * 0.5 * powLvlMult(lvl), dur = powDur(id, lvl);
  this.pcd[id] = powCd(id, lvl) * (this.aura ? this.aura.powCd : 1); stat(this.save, 'powersUsed');
  this.fx.push({ kind: 'power', id, x: W / 2, y: 200, t: 0 });
  const alive = this.zombies.filter(z => z.hp > 0);
  switch (id) {
    case 'meteor': {
      const n = Math.min(12, 5 + Math.floor(lvl / 5));
      for (let i = 0; i < n; i++) {
        const z = alive.length ? alive[Math.floor(this.rng() * alive.length)] : null;
        const tx = z ? z.x + (this.rng() - 0.5) * 30 : 40 + this.rng() * (W - 80), ty = z ? Math.max(40, z.y + z.spd * 1.2) : 60 + this.rng() * 300;
        this.meteors.push({ x: tx + 120, y: -60, tx, ty, t: -i * 0.18, fall: 0.9, dmg: base * 4, r: 55 });
      }
      break;
    }
    case 'ais': this.act.ais = { t: dur }; for (const z of alive) { z.freezeT = z.traits.includes('kebal_ais') ? dur / 2 : dur; this.damage(z, base * 2); } break;
    case 'duri': this.act.duri = { t: dur, dps: base * 1.5 }; break;
    case 'petir': this.act.petir = { t: dur, tick: 0, dmg: base * 3 }; break;
    case 'penawar': this.heal(0.4); this.act.penawar = { t: dur }; break;
    case 'amuk': this.act.amuk = { t: dur }; break;
    case 'emas': this.act.emas = { t: dur }; break;
    case 'lubang': this.act.lubang = { t: dur, x: W / 2, y: 250, dps: base * 2, end: base * 6 }; break;
    case 'bom': this.bombs.push({ x: W / 2, y: 240, t: 1.2, dmg: base * 15, r: 170 }); break;
  }
  return true;
};
Battle.prototype.ultReady = function (h) { const m = this.team.find(t => t.id === h); return !!m && this.state === 'main' && !this.mods.noPower && m.ult >= 1 && !!ULTS[h]; };
Battle.prototype.ultCharge = function (z) { for (const m of this.team) { const U = ULTS[m.id]; if (U && m.ult < 1) m.ult = Math.min(1, m.ult + (z && z.type === 'boss' ? 10 : 1) / U.cas); } };
Battle.prototype.useUlt = function (h) {
  if (!this.ultReady(h)) return false;
  const m = this.team.find(t => t.id === h), U = ULTS[h], st = heroStats(this.save, h, this.now), K = ultK(this.save, h);
  const P = Math.max(1, st.dmg * st.rate) * K, fx = { src: h, wid: st.wid, ult: true, pen: st.pen }, dur = (U.dur || 0) * (1 + 0.1 * (skillLvl(this.save, h) - 1));
  m.ult = 0; m.uRdy = 0; stat(this.save, 'ults'); this.ultN = (this.ultN || 0) + 1;
  this.fx.push({ kind: 'ult', h, x: m.x, y: m.y, t: 0, life: 1.6, nama: U.nama, ikon: U.ikon });
  const al = this.zombies.filter(z => z.hp > 0 && z.y > -20), strong = () => al.filter(z => z.hp > 0).sort((a, b) => b.hp - a.hp)[0];
  const frz = (z, t) => { z.freezeT = Math.max(z.freezeT || 0, z.type === 'boss' ? t * 0.4 : t); };
  switch (U.k) {
    case 'sRate': this.act['uS_' + h] = { t: dur, k: U.m }; break;
    case 'tRate': this.act.uRate = { t: dur, k: U.m }; for (const o of this.team) if (o.id !== h) o.ult = Math.min(1, o.ult + 0.2); break;
    case 'tDmg': this.act.uDmg = { t: dur, k: U.m }; break;
    case 'lemah': this.act.uLemah = { t: dur, k: U.m }; for (const z of al) this.fx.push({ kind: 'ring', x: z.x, y: z.y, t: 0, life: 0.5, r: z.r + 8, col: '160,240,120' }); break;
    case 'perisai': this.act.uPerisai = { t: dur }; this.heal(0.1); break;
    case 'heal': this.heal(U.m * K > 0.6 ? 0.6 : U.m * K); this.fx.push({ kind: 'heal', x: W / 2, y: WALL_Y - 20, t: 0 }); break;
    case 'regen': this.heal(0.2); this.act.uRegen = { t: dur, k: U.m * K }; break;
    case 'batu': { let best = null, bn = -1; for (const z of al) { const n = al.filter(o => Math.hypot(o.x - z.x, o.y - z.y) < U.r).length; if (n > bn) { bn = n; best = z; } }
      if (best) { const bx = best.x, by = best.y; this.splash(bx, by, U.r, P * U.m / 0.6, fx); for (const z of al) if (z.hp > 0 && Math.hypot(z.x - bx, z.y - by) < U.r + z.r) frz(z, 1.2); this.fx.push({ kind: 'shake', t: 0, mag: 7 }); } break; }
    case 'snipe': { const z = strong(); if (z) { this.fx.push({ kind: 'ushot', x: m.x, y: m.y - 20, x2: z.x, y2: z.y, t: 0, life: 0.5 }); this.damage(z, P * U.m, Object.assign({ crit: true }, fx)); } break; }
    case 'smite': { const z = strong(); if (z) { const zx = z.x, zy = z.y; this.fx.push({ kind: 'strike', x: zx, y: zy, t: 0 }); this.fx.push({ kind: 'shake', t: 0, mag: 9 }); this.damage(z, P * U.m, fx); this.splash(zx, zy, U.r, P * 8 / 0.6, fx, z.id); } break; }
    case 'freeze': for (const z of al) { frz(z, dur); this.damage(z, P * U.m, Object.assign({ slow: 0.5 }, fx)); } this.act.ais = { t: Math.min(dur, 3) }; break;
    case 'emp': for (const z of al) { frz(z, dur); this.damage(z, P * U.m, fx); } if (this.bproj) for (const p of this.bproj) if (!p.dead) this.shootDown(p); this.fx.push({ kind: 'ring', x: m.x, y: m.y, t: 0, life: 0.8, r: 420, col: '120,200,255' }); break;
    case 'carpet': for (let i = 0; i < 7; i++) { const tx = 30 + i * (W - 60) / 6, near = al.filter(z => Math.abs(z.x - tx) < 40).sort((a, b) => b.y - a.y)[0]; this.bombs.push({ x: tx, y: near ? near.y : 160 + (i % 2) * 120, t: 0.25 + i * 0.12, dmg: P * U.m, r: U.r }); } break;
    case 'burnAll': for (const z of al) this.damage(z, P * U.m * 0.5, Object.assign({ burn: P * U.m }, fx)); this.fx.push({ kind: 'shake', t: 0, mag: 4 }); break;
    case 'poison': for (const z of al) { this.damage(z, P, Object.assign({ burn: P * U.m }, fx)); z.slowT = Math.max(z.slowT || 0, dur); z.slowK = Math.max(z.slowK || 0, 0.35); } break;
    case 'storm': for (let i = 0; i < 6; i++) { const live = al.filter(z => z.hp > 0); if (!live.length) break; const z = live[Math.floor(this.rng() * live.length)]; this.fx.push({ kind: 'strike', x: z.x, y: z.y, t: 0 }); this.damage(z, P * U.m, fx); this.chainFrom(z, 3, P * U.m * 0.6, fx); } break;
    case 'rockets': { const tg = al.slice().sort((a, b) => b.hp - a.hp).slice(0, 6); for (let i = 0; i < 6; i++) { const z = tg[i % Math.max(1, tg.length)]; const tx = z ? z.x : 60 + this.rng() * (W - 120), ty = z ? Math.max(40, z.y + z.spd * 1.0) : 120 + this.rng() * 200; this.meteors.push({ x: tx + 120, y: -60, tx, ty, t: -i * 0.12, fall: 0.7, dmg: P * U.m * (z && z.fly ? 1.5 : 1), r: U.r }); } break; }
    case 'six': { const tg = al.slice().sort((a, b) => b.y - a.y).slice(0, 6); for (let i = 0; i < 6 && tg.length; i++) { const z = tg[i % tg.length]; if (z.hp <= 0) continue; this.fx.push({ kind: 'ushot', x: m.x, y: m.y - 20, x2: z.x, y2: z.y, t: -i * 0.06, life: 0.45 }); this.damage(z, P * U.m, Object.assign({ crit: true }, fx)); } break; }
    case 'beam': this.fx.push({ kind: 'ubeam', t: 0, life: 1.1 }); for (const z of al) this.damage(z, P * U.m * (z.type === 'boss' ? 0.6 : 1), fx); this.fx.push({ kind: 'shake', t: 0, mag: 6 }); break;
    case 'slash': for (let i = 0; i < 12; i++) { const live = al.filter(z => z.hp > 0); if (!live.length) break; const z = live[Math.floor(this.rng() * live.length)]; this.fx.push({ kind: 'uslash', x: z.x, y: z.y, t: -i * 0.05, life: 0.4 }); this.damage(z, P * U.m, fx); } break;
  }
  return true;
};
Battle.prototype.ultAuto = function () {
  const al = this.zombies.filter(z => z.hp > 0 && z.y > 0), boss = al.some(z => z.type === 'boss'), busy = al.length >= 5 || boss;
  for (const m of this.team) { if (!this.ultReady(m.id)) continue; const k = ULTS[m.id].k;
    const want = k === 'heal' || k === 'regen' ? this.wall < this.wallMax * 0.6 : k === 'perisai' ? this.wall < this.wallMax * 0.7 && al.some(z => z.y + z.r > WALL_Y - 60) : k === 'snipe' || k === 'smite' ? boss || al.length >= 3 : busy;
    if (want && this.useUlt(m.id)) return true; }
  return false;
};
Battle.prototype.updatePowers = function (dt) {
  for (const k in this.pcd) if (this.pcd[k] > 0) this.pcd[k] -= dt;
  // meteor jatuh
  for (const m of this.meteors) {
    m.t += dt; if (m.t < 0) continue;
    const p = Math.min(1, m.t / m.fall); m.x = m.tx + 120 * (1 - p); m.y = -60 + (m.ty + 60) * p;
    if (p >= 1 && !m.done) { m.done = true; this.splash(m.tx, m.ty, m.r, m.dmg / 0.6, { wid: 'meteor', burn: m.dmg * 0.05 }); this.fx.push({ kind: 'shake', t: 0, mag: 4 }); }
  }
  this.meteors = this.meteors.filter(m => !m.done);
  // bom gergasi
  for (const b of this.bombs) {
    b.t -= dt;
    if (b.t <= 0 && !b.done) { b.done = true; this.fx.push({ kind: 'boom', x: b.x, y: b.y, t: 0, r: b.r, wid: 'bom_g' }); this.fx.push({ kind: 'shake', t: 0, mag: 10 });
      for (const z of this.zombies) if (z.hp > 0 && Math.hypot(z.x - b.x, z.y - b.y) < b.r + z.r) this.damage(z, b.dmg * (z.type === 'boss' ? 0.5 : 1)); }
  }
  this.bombs = this.bombs.filter(b => !b.done);
  // kesan bertempoh
  for (const id of Object.keys(this.act)) {
    const a = this.act[id]; a.t -= dt;
    if (id === 'uRegen') this.heal(a.k * dt);
    if (id === 'duri') for (const z of this.zombies) if (z.hp > 0 && z.y + z.r > WALL_Y - 120) { this.damage(z, a.dps * dt); z.slowT = Math.max(z.slowT, 0.2); z.slowK = Math.max(z.slowK, 0.3); }
    if (id === 'petir') { a.tick -= dt; if (a.tick <= 0) { a.tick = 0.3; const al = this.zombies.filter(z => z.hp > 0 && z.y > 0); if (al.length) { const z = al[Math.floor(this.rng() * al.length)]; this.fx.push({ kind: 'strike', x: z.x, y: z.y, t: 0 }); this.damage(z, a.dmg); this.chainFrom(z, 2, a.dmg * 0.6, { wid: 'petir' }); } } }
    if (id === 'lubang') {
      for (const z of this.zombies) if (z.hp > 0) { const dx = a.x - z.x, dy = a.y - z.y, d = Math.hypot(dx, dy) || 1, pull = (z.type === 'boss' ? (z.btr && z.btr.includes('ktolak') ? 0 : 25) : 90) * dt; if (d > 6) { z.x += dx / d * Math.min(pull, d); z.y += dy / d * Math.min(pull, d); } if (d < 90) this.damage(z, a.dps * dt); }
      if (a.t <= 0) { this.splash(a.x, a.y, 110, a.end / 0.6, { wid: 'lubang' }); this.fx.push({ kind: 'shake', t: 0, mag: 6 }); }
    }
    if (a.t <= 0) delete this.act[id];
  }
  // auto kuasa
  if (this.autoPower) {
    this.autoGap -= dt;
    if (this.autoGap <= 0) {
      const al = this.zombies.filter(z => z.hp > 0 && z.y > 0), boss = al.some(z => z.type === 'boss'), busy = al.length >= 5 || boss;
      for (const id of POWER_ORDER) {
        if (!this.powerReady(id)) continue;
        const want = id === 'penawar' ? this.wall < this.wallMax * 0.5 : id === 'emas' ? al.length >= 6 : busy;
        if (want && this.usePower(id)) { this.autoGap = 0.6; break; }
      }
      if (this.autoGap <= 0 && this.ultAuto()) this.autoGap = 0.6;
      if (this.autoGap <= 0 && this.wallSkillReady()) { const heal = this.mat === 0 || this.mat === 9 || this.mat === 5 || this.mat === 2 || this.mat === 6; if ((heal ? this.wall < this.wallMax * 0.5 : al.filter(z => z.y + z.r > WALL_Y - 150).length >= 3 || boss) && this.useWallSkill()) this.autoGap = 0.6; }
    }
  }
};
// ---------- v8.2: kerosakan pagar setempat (15 tiang × 24 px) ----------
const WALL_SEGS = 15;
const ITEM_DROP_BASE = 0.006;   // v8.3: separuh daripada 1.2% (peluang zombie biasa menjatuhkan item)
function wallSegIndex(x) { return Math.max(0, Math.min(WALL_SEGS - 1, Math.floor(x / (W / WALL_SEGS)))); }
// Agih kerosakan keseluruhan (1 − HP%) kepada tiang ikut berat serangan setempat ('water-filling'):
// purata kerosakan tiang = kerosakan pagar, setiap tiang 0..1, tiang paling kerap diserang rosak dahulu.
function wallSegDamage(seg, p) {
  const N = WALL_SEGS, D = Math.max(0, Math.min(1, 1 - p)), out = new Array(N).fill(0); if (D <= 0) return out;
  const s = (seg && seg.length === N) ? seg : new Array(N).fill(0), sum = s.reduce((a, v) => a + Math.max(0, v), 0);
  const wt = s.map(v => Math.max(0, v) + (sum > 0 ? sum * 0.05 / N : 1));   // sedikit haus untuk semua tiang
  let left = D * N, open = wt.map((_, i) => i);
  for (let it = 0; it < 6 && left > 1e-9 && open.length; it++) {
    const tw = open.reduce((a, i) => a + wt[i], 0); const next = []; let used = 0;
    for (const i of open) { const add = left * wt[i] / tw, room = 1 - out[i]; if (add >= room) { out[i] = 1; used += room; } else { out[i] += add; used += add; next.push(i); } }
    left -= used; open = next;
  }
  return out;
}
const WALL_GROUP = ['kayu', 'kayu', 'batu', 'batu', 'logam', 'logam', 'batu', 'kristal', 'kristal', 'kristal'];
function wallMatGroup(mat) { return WALL_GROUP[mat] || 'kayu'; }
Battle.prototype.hitWall = function (z, mult) {
  const ws = this.ws, m = this.mat;
  let arm = ws.armor + (this.act.wbata ? 30 : 0) + (m === 6 && this.wall < this.wallMax * 0.35 ? 15 : 0); arm = Math.min(85, arm);
  const d = z.dmg * (mult || 1) * (1 - arm / 100) * (m === 3 && z.type === 'boss' ? 0.75 : 1) * (this.act.uPerisai ? 0.2 : 1);
  if (m === 4 && z.hp > 0) this.damage(z, d * 0.2);
  if (m === 1 && z.type !== 'boss' && !(mult > 1)) z.y -= z.r > 20 ? 4 : 9;
  if (!this.god && !this.act.penawar && !this.act.wkebal) { this.wall -= d; this.wallHit = true; const i = wallSegIndex(z.x), sg = this.wallSeg || (this.wallSeg = new Array(WALL_SEGS).fill(0)); sg[i] += d; if (i > 0) sg[i - 1] += d * 0.3; if (i < WALL_SEGS - 1) sg[i + 1] += d * 0.3; }
  if (!this.lastWH || (this.clock || 0) - this.lastWH > 0.25) { this.lastWH = this.clock || 0; this.fx.push({ kind: 'wallHit', x: z.x, t: 0 }); }
  const th = this.act.wduri ? Math.max(ws.thorns * 4, 0.03) : ws.thorns;
  if (th > 0) this.damage(z, z.maxHp * th * (z.type === 'boss' ? 0.2 : 1));
};
Battle.prototype.update = function (dt) {
  if (this.state !== 'main') { this.updateFx(dt); return; }
  this.clock = (this.clock || 0) + dt;
  if (this.comboT > 0) { this.comboT -= dt; if (this.comboT <= 0) this.combo = 0; }
  this.updatePembantu(dt);
  this.goldPctCache = this.teamGoldPct();
  for (const m of this.team) { if (m.ult < 1 && ULTS[m.id]) m.ult = Math.min(1, (m.ult || 0) + dt / ULT_PASIF); if (m.ult >= 1 && !m.uRdy) { m.uRdy = 1; this.fx.push({ kind: 'txt', x: m.x, y: m.y - 46, t: 0, txt: ULTS[m.id].ikon + ' ULTIMATE SEDIA!', warna: '#FFD24A' }); } }
  this.updatePowers(dt);
  this.updateBProj(dt);
  const rg = this.ws.regen + this.aura.regen; if (rg > 0) this.heal(rg * dt);
  if (this.mat === 9 && !this.restuUsed && this.wall > 0 && this.wall < this.wallMax * 0.25) { this.restuUsed = true; this.heal(0.4); this.fx.push({ kind: 'txt', x: W / 2, y: WALL_Y - 40, t: 0, txt: '✨ Restu Kayangan!', warna: '#F2D06A' }); }
  if (this.aura.doktor && !this.docUsed && this.wall < this.wallMax * 0.3 && this.wall > 0) { this.docUsed = true; this.heal(0.15 * this.aura.doktor); this.fx.push({ kind: 'txt', x: W / 2, y: WALL_Y - 40, t: 0, txt: 'Rawatan Kecemasan!', warna: '#7FF0C8' }); }
  if (this.aura.pahlawan) { this.hkT = (this.hkT || 8) - dt; if (this.hkT <= 0) { this.hkT = 8; const al = this.zombies.filter(z => z.hp > 0 && z.y > 0); if (al.length) { const z = al.reduce((a, b) => (b.hp > a.hp ? b : a)); const pm = this.team.find(m => m.id === 'pahlawan'); const d0 = pm ? heroStats(this.save, 'pahlawan', this.now).dmg : 0; this.fx.push({ kind: 'strike', x: z.x, y: z.y, t: 0 }); this.damage(z, d0 * 5 * this.aura.pahlawan); } } }
  if (this.pause > 0) this.pause -= dt;
  else if (this.queue.length && this.zombies.length < ZCAP) { this.spawnT -= dt; if (this.spawnT <= 0) { this.spawn(this.queue.shift()); this.spawnT = (0.8 - Math.min(0.45, this.stage * 0.02)) * (this.mods.horde ? 0.4 : 1); } }
  const evoTime = Math.max(3.5, EVO_TIME - this.stage * 0.03);
  for (const z of this.zombies) {
    if (z.hp <= 0) continue;
    z.wob += dt * 6; if (z.hitT > 0) z.hitT -= dt; if (z.atkAnim > 0) z.atkAnim -= dt;
    if (z.slowT > 0) z.slowT -= dt; else z.slowK = 0;
    if (z.wetT > 0) z.wetT -= dt; if (z.markT > 0) { z.markT -= dt; if (z.markT <= 0) z.markK = 0; }
    if (z.burnT > 0) { z.burnT -= dt; this.damage(z, z.burnD * dt, { src: z.burnSrc, wid: z.burnW }); if (z.burnT <= 0) z.burnD = 0; }
    if (z.hp <= 0) continue;
    if (z.hp > 0 && z.y > (this.maxZY || 0)) this.maxZY = z.y;
    if (z.bossKind && z.hp > 0) this.bossAbility(z, dt);
    if (z.freezeT > 0) { z.freezeT -= dt; continue; }
    if (z.y + z.r >= WALL_Y - 160) { if (this.act.wslow) { z.slowT = Math.max(z.slowT || 0, 0.2); z.slowK = Math.max(z.slowK || 0, 0.5); } if (this.mat === 8 && z.y >= WALL_Y - z.r - 2) this.damage(z, z.maxHp * (z.type === 'boss' ? 0.003 : 0.02) * dt, { wid: 'petir' }); }
    if (z.traits.includes('pemulih')) z.hp = Math.min(z.maxHp, z.hp + z.maxHp * 0.03 * dt);
    if (z.traits.includes('penyembuh')) { z.healT -= dt; if (z.healT <= 0) { z.healT = 1; let n = 0; for (const o of this.zombies) if (o !== z && o.hp > 0 && o.hp < o.maxHp && Math.hypot(o.x - z.x, o.y - z.y) < 90) { o.hp = Math.min(o.maxHp, o.hp + o.maxHp * 0.05); n++; } if (n) this.fx.push({ kind: 'heal', x: z.x, y: z.y, t: 0 }); } }
    if (z.traits.includes('melompat') && z.y > 0) { z.jumpT -= dt; if (z.jumpT <= 0) { z.jumpT = 3; z.hop = 0.35; z.y = Math.min(WALL_Y - z.r - (z.traits.includes('penembak') ? 120 : 0), z.y + 50); } }
    if (z.hop > 0) z.hop -= dt;
    z.evoT += dt; if (z.evoT >= evoTime) { z.evoT = 0; this.evolve(z); }
    const ranged = z.traits.includes('penembak') || (z.bossKind && (BOSS_FORMS[bossFormIdx(z.bossKind)] || {}).ranged);
    const stopY = ranged ? WALL_Y - z.r - 120 : WALL_Y - z.r;
    if (z.y < stopY) z.y = Math.min(stopY, z.y + z.spd * (1 - z.slowK) * (z.amukK || 1) * dt);
    else if (z.traits.includes('pengebom') && !ranged) { this.hitWall(z, 5); this.fx.push({ kind: 'boom', x: z.x, y: WALL_Y - 10, t: 0, r: 45, wid: 'pengebom' }); this.fx.push({ kind: 'shake', t: 0, mag: 5 }); z.boomed = true; this.damage(z, Infinity); }
    else { z.atkT -= dt; if (z.atkT <= 0) { z.atkT = ranged ? 1.5 : 1; z.atkAnim = 0.3; this.hitWall(z, ranged ? 0.6 : 1); this.fx.push(ranged ? { kind: 'spit', x: z.x, y: z.y, t: 0 } : { kind: 'bonk', x: z.x, y: WALL_Y, t: 0 }); } }
  }
  let fz = 0; for (const z of this.zombies) if (z.hp > 0 && z.y > 60 && z.traits.includes('pembeku')) fz++;
  if (this.poisonT > 0) this.poisonT -= dt;
  this.heroSlow = Math.min(0.6, 0.12 * fz + (this.poisonT > 0 ? 0.4 : 0));
  for (const m of this.team) {
    const st = heroStats(this.save, m.id, this.now), d = WEAPONS[st.wid];
    if (d.heal) this.heal(d.heal * dt);
    if (m.recoil > 0) m.recoil -= dt;
    if (m.webT > 0) { m.webT -= dt; if (m.iceT > 0) m.iceT -= dt; continue; }
    m.cd -= dt;
    let target = null;
    for (const z of this.zombies) if (z.hp > 0 && z.y > -5 && (!z.fly || d.udara) && Math.hypot(z.x - m.x, z.y - m.y) <= d.range * st.rangeK) { if (!target || z.y > target.y) target = z; }
    const piv = heroPivot(m, this.team.length);
    if (target) m.aim = Math.atan2(target.y - piv.y, target.x - piv.x); else m.heat = 0;
    if (target && m.cd <= 0) {
      if (m.id === 'mesingan') m.heat = Math.min(0.45 * skillK(this.save, 'mesingan'), (m.heat || 0) + 0.03);
      m.cd = 1 / (st.rate * (this.act.amuk ? 2.5 : 1) * (this.act.uRate ? this.act.uRate.k : 1) * (this.act['uS_' + m.id] ? this.act['uS_' + m.id].k : 1) * (1 - this.heroSlow) * this.aura.rate * (1 + (m.heat || 0))); m.recoil = 0.1; m.shots = (m.shots || 0) + 1;
      const sk = skillK(this.save, m.id), extra = (m.id === 'budak' && this.rng() < 0.15 * sk) || (m.id === 'ninja' && this.rng() < 0.2 * sk) ? 1 : 0; if (extra) this.skillFx(m.id);
      const kembar = d.mitos === 'kembar' && this.rng() < 0.2 ? 1 : 0, gm = d.ganda && m.shots % 4 === 0 ? d.ganda : 1; if (kembar && this.fx.length < 200 && (this.clock || 0) >= (m.kbT || 0)) { m.kbT = (this.clock || 0) + 2; this.fx.push({ kind: 'txt', x: m.x, y: m.y - 30, t: 0, txt: 'Bayang Kembar!', warna: '#B48AF5' }); }
      const n = (d.n || 1) + extra + kembar;
      for (let i = 0; i < n; i++) {
        const crit = (m.id === 'koboi' && m.shots % 5 === 0) || this.rng() < st.crit + (m.id === 'sniper' ? 0.25 * sk : 0); if (crit && (m.id === 'koboi' || m.id === 'sniper')) this.skillFx(m.id);
        const a = m.aim + (i - (n - 1) / 2) * (d.spread || 0.08 * (n > 1 ? 1 : 0)) + (n === 1 && d.spread ? (this.rng() - 0.5) * d.spread : 0);
        const spd = d.splash ? 380 : 560;
        this.bullets.push({ hero: m.id, sk, wid: st.wid, air: d.udara !== false, robo: st.robo, x: piv.x + Math.cos(a) * muzzleLen(st.wid) * piv.sc, y: piv.y + Math.sin(a) * muzzleLen(st.wid) * piv.sc, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, spd, dmg: st.dmg * gm * (crit ? st.critMul : 1) * (this.act.amuk ? 1.5 : 1) * (this.act.uDmg ? this.act.uDmg.k : 1), crit, cm: crit ? st.critMul : 1, boss: st.boss, pen: st.pen, acc: st.acc, pierce: d.pierce || 1, hit: [], warna: d.peluru, life: d.range / spd + 0.4 * (d.homing ? 2 : 0) + 0.15, big: !!d.splash, laser: d.pierce >= 99, target: d.homing ? target.id : 0 });
      }
    }
  }
  if (this.towers.length) {
    const avg = this.team.length ? this.team.reduce((a, m) => a + heroStats(this.save, m.id, this.now).dmg, 0) / this.team.length : 10;
    for (const tw of this.towers) {
      if (tw.frozenT > 0) { tw.frozenT -= dt; continue; }
      const T = TOWERS[tw.type], wd = WEAPONS[T.wid]; if (tw.recoil > 0) tw.recoil -= dt; tw.cd -= dt;
      const M = tw.mods || towerMods(tw), RNG = T.range + M.range;
      if (T.heal) { if (this.wall < this.wallMax && this.wall > 0) { const k = towerHealRate(tw) * (this.wall < this.wallMax * 0.3 ? M.low : 1); this.heal(k * dt); if (tw.cd <= 0) { tw.cd = 1; tw.recoil = 0.25; this.fx.push({ kind: 'repair', x: tw.x, t: 0 }); } } continue; }
      let tg = null; for (const z of this.zombies) if (z.hp > 0 && z.y > -5 && (!z.fly || T.udara) && Math.hypot(z.x - tw.x, z.y - tw.y) <= RNG) { if (!tg || (T.target === 'hp' ? (z.type === 'boss') - (tg.type === 'boss') > 0 || ((z.type === 'boss') === (tg.type === 'boss') && z.hp > tg.hp) : z.y > tg.y)) tg = z; }
      if (tg) tw.aim = Math.atan2(tg.y - (tw.y + TOWER_ARM.y), tg.x - tw.x);
      if (tg && tw.cd <= 0) { tw.cd = 1 / (T.rate * M.rate * (1 - this.heroSlow * 0.5)); tw.recoil = 0.12; const spd = wd.splash || M.splash ? 380 : 560;
        const ov = { splash: (wd.splash || 0) + M.splash, slow: Math.max(wd.slow || 0, M.slow), burn: (wd.burn || 0) + M.burn, freeze: M.freeze, chain: (wd.chain || 0) + M.chain, push: (T.push || 0) + M.push };
        for (let k = 0; k <= M.n; k++) { const a = tw.aim + (k - M.n / 2) * 0.12;
          this.bullets.push({ air: !!T.udara, hero: 'menara' + tw.slot, sk: 1, wid: T.wid, ov, x: tw.x + Math.cos(a) * (WEAPONS[T.wid].laras + 2) * TOWER_ARM.sc, y: tw.y + TOWER_ARM.y + Math.sin(a) * (WEAPONS[T.wid].laras + 2) * TOWER_ARM.sc, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, spd, dmg: avg * 0.25 * T.mult * towerLvlMult(tw.lvl) * M.dmg, crit: false, pen: T.pen || 0, pierce: Math.max(wd.pierce || 1, M.pierce || 1), hit: [], warna: M.burn && tw.type !== 'api' ? '#FF8A3A' : T.peluru || wd.peluru, life: RNG / spd + 0.15, big: !!ov.splash, laser: false, target: 0 }); } }
    }
  }
  for (const b of this.bullets) {
    if (b.target) {
      let t = this.zombies.find(z => z.id === b.target && z.hp > 0);
      if (!t) { t = this.zombies.find(z => z.hp > 0); if (t) b.target = t.id; }
      if (t) { const a = Math.atan2(t.y - b.y, t.x - b.x), c = Math.atan2(b.vy, b.vx); let da = a - c; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; const na = c + Math.max(-6 * dt, Math.min(6 * dt, da)); b.vx = Math.cos(na) * b.spd; b.vy = Math.sin(na) * b.spd; }
    }
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    b.age = (b.age || 0) + dt;
    if (this.bproj && this.bproj.length && b.pierce > 0) for (const p of this.bproj) if (!p.dead && Math.abs(p.x - b.x) < p.r + 6 && Math.abs(p.y - b.y) < p.r + 6) { this.shootDown(p); b.pierce--; break; }
    const d = b.ov ? Object.assign({}, WEAPONS[b.wid], b.ov) : WEAPONS[b.wid], fx = { slow: d.slow, burn: d.burn ? b.dmg * d.burn : 0, crit: b.crit, wid: b.wid, bullet: true, src: b.hero, pen: b.pen || 0, acc: b.acc || 0, air: b.air !== false, cm: b.cm || 1 };
    for (const z of this.zombies) {
      if (b.pierce <= 0) break;
      if (z.hp > 0 && !b.hit.includes(z.id) && (!z.fly || b.air !== false) && Math.hypot(z.x - b.x, z.y - b.y) < z.r + (b.big ? 7 : 4)) {
        b.hit.push(z.id); b.pierce--;
        let mul = this.aura.dmg;
        if (z.fly && d.aa > 1) mul *= d.aa; if (z.type === 'boss' && d.bossB) mul *= 1 + d.bossB;
        if (b.hero === 'pistol' && z.y > WALL_Y - 120) { mul *= 1 + 0.2 * b.sk; this.skillFx('pistol'); }
        if (b.hero === 'roket' && z.type === 'boss') { mul *= 1 + 0.4 * b.sk; this.skillFx('roket'); }
        if (b.boss && z.type === 'boss') mul *= 1 + b.boss / 100;
        if (b.hero === 'saintis' && z.evo > 0) { mul *= 1 + 0.3 * b.sk; this.skillFx('saintis'); }
        if (this.aura.slowAmp && z.slowT > 0) mul *= 1 + this.aura.slowAmp;
        { let em = elemK(b.wid, z); if (z.wetT > 0) { const F = W_FAM[b.wid]; em *= F === 'elektrik' ? 1.5 : F === 'api' ? 0.7 : 1; } em = Math.max(0.5, Math.min(2, em)); mul *= em;
          if (em !== 1 && this.fx.length < 200 && (this.clock || 0) >= (z._elT || 0)) { z._elT = (this.clock || 0) + 1.2; this.fx.push({ kind: 'txt', x: z.x - 12, y: z.y - z.r - 14, t: 0, txt: em > 1 ? 'KUAT!' : 'LEMAH', warna: em > 1 ? '#7CF0A8' : '#B8C2CC' }); } }
        let fx2 = mul === 1 ? fx : Object.assign({}, fx); b.dmgHit = b.dmg * mul;
        if (b.hero === 'api' && fx.burn) { fx2.burn = fx.burn * (1 + b.sk); this.skillFx('api'); }
        if (b.hero === 'jurutera' && this.rng() < 0.1 * b.sk) { z.freezeT = Math.max(z.freezeT || 0, 0.5); this.skillFx('jurutera'); }
        if (b.hero === 'ratu_ais' && b.crit) { z.freezeT = Math.max(z.freezeT || 0, 0.6 * b.sk); this.skillFx('ratu_ais'); }
        if (b.hero === 'racun' && fx.burn) { this.skillFx('racun'); let k = 0; for (const o of this.zombies) if (o !== z && o.hp > 0 && k < 2 && Math.hypot(o.x - z.x, o.y - z.y) < 70) { o.burnT = 3; o.burnD = Math.max(o.burnD, fx.burn); o.burnW = 'racun'; k++; } }
        if (this.fx.length < 200) this.fx.push({ kind: 'hit', x: b.x, y: b.y, t: 0, wid: b.wid, a: Math.atan2(b.vy, b.vx) });
        if (d.mitos === 'abadi' && fx2.burn) { if (fx2 === fx) fx2 = Object.assign({}, fx); fx2.abadi = true; }
        this.damage(z, b.dmgHit, fx2);
        if (d.mitos) this.mitosHit(z, d, b, fx2);
        if (d.freeze && this.rng() < d.freeze) z.freezeT = Math.max(z.freezeT || 0, 0.6);
        if (d.splash) { if (b.hero === 'bom') this.skillFx('bom'); this.splash(b.x, b.y, d.splash * (b.hero === 'bom' ? 1 + 0.3 * b.sk : 1) * (b.robo ? 1.25 : 1), b.dmgHit, fx2, z.id); }
        this.wMech(z, d, b);
        if (d.push && z.type !== 'boss' && z.hp > 0) { z.y = Math.max(-z.r, z.y - d.push * (z.r > 20 ? 0.5 : 1)); if (d.splash) for (const o of this.zombies) if (o !== z && o.hp > 0 && o.type !== 'boss' && Math.hypot(o.x - z.x, o.y - z.y) < d.splash) o.y = Math.max(-o.r, o.y - d.push * 0.6); this.fx.push({ kind: 'gust', x: z.x, y: z.y, t: 0 }); }
        if (!d.chain && b.hero === 'petir' && this.rng() < 0.5) this.chainFrom(z, Math.max(1, Math.round(b.sk)), b.dmgHit * 0.6, fx2);
        if (!fx.burn && (b.hero === 'racun' || b.hero === 'api') && z.hp > 0 && !z.traits.includes('kebal_api')) { z.burnT = 2; z.burnD = Math.max(z.burnD || 0, b.dmgHit * 0.12 * b.sk); z.burnW = b.hero === 'api' ? 'api' : 'racun'; z.burnSrc = b.hero; }
        if (d.chain) { if (b.hero === 'petir') this.skillFx('petir'); this.chainFrom(z, d.chain + (b.hero === 'petir' ? Math.round(2 * b.sk) : 0), b.dmgHit, fx2); }
      }
    }
  }
  this.bullets = this.bullets.filter(b => b.life > 0 && b.pierce > 0 && b.y > -40 && b.x > -40 && b.x < W + 40 && b.y < H + 40);
  this.zombies = this.zombies.filter(z => z.hp > 0);
  this.updateFx(dt);
  if (this.wall <= 0) { this.wall = 0; this.state = 'kalah'; stat(this.save, 'battles'); return; }
  if (!this.queue.length && !this.zombies.length && this.pause <= 0) {
    if (this.wave >= this.maxWave) { this.state = 'menang'; const frontier = !this.chal && this.stage >= this.save.best; if (!this.chal) this.earnedGems += winStage(this.save, this.stage, this.rng); stat(this.save, 'battles'); stat(this.save, 'stagesWon'); if (!this.wallHit) stat(this.save, 'perfect');
      // lompatan bila menang mudah: ikut sejauh mana zombie paling dalam mara (stage boss besar tidak dilangkau)
      let jump = 0;
      if (frontier && !this.wallHit) { const n = jumpSize(this.maxZY || 0), tgt = Math.min(this.stage + n, Math.ceil((this.stage + 1) / 10) * 10); for (let s = this.stage + 1; s < tgt; s++) this.earnedGems += winStage(this.save, s, this.rng); jump = Math.max(0, tgt - this.stage - 1); }
      if (!this.chal && this.diff.id === 'normal' && !this.wallHit && this.stage + 3 <= (this.save.stats.bestEver || 0) * 0.8) { this.save.best = Math.max(this.save.best, this.stage + 3); this.save.stage = Math.max(this.save.stage, this.stage + 3); jump = Math.max(jump, 2); }
      if (jump > 0) { this.skipped = this.save.stage - this.stage - 1; stat(this.save, 'skips'); } if (this.team.length === 1) stat(this.save, 'solo'); }
    else { this.wave++; this.docUsed = false; this.restuUsed = false; this.loadWave(); this.pause = 1.4; this.heal(0.1); }
  }
};
Battle.prototype.killAll = function () { for (const z of this.zombies.slice()) this.damage(z, Infinity); for (const z of this.zombies) if (z.kid) z.hp = 0; this.zombies = this.zombies.filter(z => z.hp > 0); };
Battle.prototype.updateFx = function (dt) { for (const f of this.fx) f.t += dt; this.fx = this.fx.filter(f => f.t < (f.life || 0.9)); if (this.fx.length > 240) this.fx.splice(0, this.fx.length - 240); };
Battle.prototype.simulate = function (maxSec) { const dt = 1 / 30; for (let t = 0; t < maxSec && this.state === 'main'; t += dt) this.update(dt); return this.state; };

const SUFFIX = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
function fmtNum(n) {
  n = Math.floor(n); if (!isFinite(n)) return '∞';
  if (n < 10000) return n.toLocaleString('ms-MY');
  const k = Math.floor(Math.log10(n) / 3);
  if (k >= SUFFIX.length) return n.toExponential(2).replace('+', '');
  const v = n / Math.pow(1000, k);
  return v.toFixed(v >= 100 ? 0 : 1) + SUFFIX[k];
}
