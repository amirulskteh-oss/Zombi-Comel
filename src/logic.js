// ================= LOGIK GAME v3 (tulen, tiada DOM) =================
const VERSION = '6.2';
const SAVE_KEY = 'zombi_comel_save_v1';
const W = 360, H = 600, WALL_Y = 488, WAVES_PER_STAGE = 10, OFFLINE_CAP = 28800, ZCAP = 70, SAVE_V = 6, INV_CAP = 150, MAX_SLOTS = 6, WALL_SLOTS = 3;

// ---------- Kemahiran unik hero (kuasa naik setiap 10 bintang) ----------
const SKILLS = {
  pistol:   { nama: 'Pengawal Setia',     desc: '+20% damage kepada zombie dekat pagar' },
  budak:    { nama: 'Lastik Berganda',    desc: '15% peluang menembak 2 kali' },
  shotgun:  { nama: 'Pelindung Keluarga', desc: 'HP pagar pasukan +10%' },
  mesingan: { nama: 'Enjin Panas',        desc: 'Laju tembak naik ketika menembak berterusan (maks +45%)' },
  sniper:   { nama: 'Mata Helang',        desc: '+25% peluang kritikal' },
  frost:    { nama: 'Nafas Beku',         desc: 'Zombie yang perlahan menerima +20% damage daripada semua hero' },
  bom:      { nama: 'Mercun Raya',        desc: 'Kawasan letupan +30%' },
  api:      { nama: 'Api Marak',          desc: 'Damage bakar ×2' },
  tukang:   { nama: 'Tukang Baiki',       desc: 'Pagar pulih 0.5% sesaat' },
  petir:    { nama: 'Litar Pintas',       desc: 'Kilat melompat ke 2 zombie tambahan' },
  doktor:   { nama: 'Rawatan Kecemasan',  desc: 'Pulih 15% pagar bila HP bawah 30% (sekali setiap gelombang)' },
  roket:    { nama: 'Veteran Perang',     desc: '+40% damage kepada boss' },
  racun:    { nama: 'Racun Tersebar',     desc: 'Racun merebak ke 2 zombie berdekatan' },
  koboi:    { nama: 'Tembakan Maut',      desc: 'Setiap tembakan ke-5 pasti kritikal' },
  laser:    { nama: 'Teknologi Angkasa',  desc: 'Masa bertenang kuasa −15%' },
  ninja:    { nama: 'Bayang Ninja',       desc: '20% peluang melontar shuriken tambahan' },
  askar:    { nama: 'Arahan Sarjan',      desc: 'Damage semua hero +10%' },
  saintis:  { nama: 'Kaji Zombie',        desc: '+30% damage kepada zombie berevolusi, item jatuh +25%' },
  jurutera: { nama: 'Renjatan EMP',       desc: '10% peluang melumpuhkan zombie 0.5 saat' },
  ratu_ais: { nama: 'Takhta Salju',       desc: 'Tembakan kritikal membekukan zombie 0.6 saat' },
  pahlawan: { nama: 'Halilintar',         desc: 'Setiap 8 saat, halilintar menyambar zombie (5× damage)' },
  komander: { nama: 'Komando Elit',       desc: 'Laju tembak semua hero +15%' }
};
function skillLvl(save, id) { return 1 + Math.floor((save.stars[id] || 0) / 10); }
function skillK(save, id) { return 1 + 0.25 * (skillLvl(save, id) - 1); }

// ---------- Boss unik setiap 10 stage ----------
const BIG_BOSSES = [
  { id: 'lendir',  nama: 'Raja Lendir',       warna: '#6CC04A', desc: 'Pecah menjadi 4 lendir bila HP tinggal separuh.' },
  { id: 'jeneral', nama: 'Jeneral Tengkorak', warna: '#8A8698', desc: 'Memanggil 2 askar zombie setiap 5 saat.' },
  { id: 'ratu',    nama: 'Ratu Racun',        desc: 'Meludah awan racun yang memperlahankan hero 40% selama 3 saat.', warna: '#A040C0' },
  { id: 'besi',    nama: 'Gergasi Besi',      warna: '#7A8494', desc: 'Kebal sepenuhnya selama 2 saat setiap 8 saat.' },
  { id: 'naga',    nama: 'Naga Zombi',        warna: '#C8402A', desc: 'Menerpa ke hadapan dan menyembur api ke pagar dari jauh.' }
];
function bigBossOf(stage) { return isBigBoss(stage) ? BIG_BOSSES[(stage / 10 - 1) % BIG_BOSSES.length] : null; }

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
  const d = save.daily.streak % 7, r = LOGIN_REWARDS[d], mult = Math.pow(GOLD_G, save.best - 1); let msg = 'Hari ' + (d + 1) + ': ';
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
function prestigeGain(save) { return save.best < PRESTIGE_MIN ? 0 : Math.floor(Math.pow((save.best - 40) / 10, 2) * 10); }
function buyPerk(save, id) {
  const p = PERKS[id], l = perk(save, id); if (l >= p.max) return { ok: false, msg: 'Sudah maksimum' };
  const c = Math.ceil(p.kos(l)); if (save.roh < c) return { ok: false, msg: 'Roh tak cukup (perlu ' + c + ')' };
  save.roh -= c; save.perks[id] = l + 1; return { ok: true, msg: p.nama + ' Lv.' + (l + 1) };
}
function doPrestige(save) {
  const g = prestigeGain(save); if (!g) return { ok: false, msg: 'Perlu sampai stage ' + PRESTIGE_MIN + ' untuk Kebangkitan' };
  save.roh += g; save.rohTotal += g; stat(save, 'prestige'); statMax(save, 'bestEver', save.best);
  const keep = Math.min(0.5, 0.05 * perk(save, 'latihan'));
  Object.keys(save.heroes).forEach(h => { save.heroes[h] = Math.max(1, Math.floor(save.heroes[h] * keep)); });
  Object.keys(save.weapons).forEach(w => { save.weapons[w] = 1; });
  Object.keys(save.powers).forEach(p => { save.powers[p] = 1; });
  ['damage', 'speed', 'wall', 'tap', 'jariApi', 'kombo'].forEach(k => { save.shop[k] = 0; });
  save.towers = save.towers.map(t => t ? { type: t.type, lvl: 1 } : null);
  save.wallsOwned = 1; save.wallActive = 0;
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
function chalStage(save, c, lvl) { return Math.max(3, Math.floor(Math.max(save.best, 10) * 0.5)) + (lvl - 1) * 3; }
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
const TOWER_X = [56, 180, 304], TOWER_Y = WALL_Y - 34;
const TOWERS = {
  panah:  { nama: 'Menara Panah',  desc: 'Menembak laju',                 wid: 'silang', rate: 1.6, mult: 0.8,  range: 300 },
  meriam: { nama: 'Menara Meriam', desc: 'Peluru meletup kena ramai',     wid: 'meriam', rate: 0.5, mult: 2.2,  range: 330 },
  ais:    { nama: 'Menara Ais',    desc: 'Memperlahankan zombie',         wid: 'frost',  rate: 1.0, mult: 0.6,  range: 300 }
};
const TOWER_ORDER = Object.keys(TOWERS);
function towerBuildCost(slot) { return [800, 8000, 80000][slot]; }
function towerUpCost(lvl) { return Math.floor(200 * Math.pow(1.22, lvl - 1)); }
function towerLvlMult(lvl) { return (1 + 0.25 * (lvl - 1)) * Math.pow(1.5, Math.floor(lvl / 20)); }
function buildTower(save, slot, type) {
  if (!TOWERS[type] || slot < 0 || slot > 2) return { ok: false, msg: 'Tidak sah' };
  if (save.towers[slot]) { save.towers[slot].type = type; return { ok: true, msg: 'Slot ' + (slot + 1) + ' ditukar ke ' + TOWERS[type].nama }; }
  const c = towerBuildCost(slot); if (save.gold < c) return { ok: false, msg: 'Gold tak cukup (perlu ' + c + ')' };
  save.gold -= c; save.towers[slot] = { type, lvl: 1 }; return { ok: true, msg: TOWERS[type].nama + ' dibina!' };
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
function itemKey(it) { const s = itemStats(it); return it.jenis === 'senjata' ? s.dmg : it.jenis === 'aksesori' ? s.rate * 3 + s.gold : s.hp; }
function compareItem(save, uid, heroId) {
  const it = itemByUid(save, uid); if (!it) return null;
  let cur = null;
  if (it.jenis === 'perisai') { const eq = save.wallEquip.map(u => itemByUid(save, u)); cur = eq.includes(null) ? null : eq.reduce((a, b) => (itemPower(b) < itemPower(a) ? b : a)); }
  else cur = itemByUid(save, (save.equip[heroId] || {})[it.jenis]);
  if (cur && cur.uid === it.uid) return { same: true };
  const a = itemStats(it), b = cur ? itemStats(cur) : {};
  const keys = it.jenis === 'senjata' ? [['dmg', '% damage'], ['crit', '% kritikal']] : it.jenis === 'aksesori' ? [['rate', '% laju'], ['gold', '% gold']] : [['hp', '% HP pagar'], ['armor', '% perisai']];
  const diff = keys.map(([k, n]) => ({ k, n, d: (a[k] || 0) - (b[k] || 0) })).filter(x => x.d);
  return { cur, diff, better: itemKey(it) > (cur ? itemKey(cur) : -1) };
}

// ---------- Susun pasukan terbaik ----------
function weaponScore(save, heroId, wid) {
  const prev = save.heroWpn[heroId]; save.heroWpn[heroId] = wid; const st = heroStats(save, heroId, 0), wd = WEAPONS[wid]; save.heroWpn[heroId] = prev;
  return st.dmg * st.rate * (wd.n || 1) * (1 + Math.min(3, (wd.pierce || 1) - 1) * 0.3) * (wd.splash ? 1.8 : 1) * (wd.chain ? 1 + wd.chain * 0.4 : 1) * (wd.heal ? 0.8 : 1);
}
function bestTeam(save) {
  const own = HERO_ORDER.filter(h => save.heroes[h]), wpns = Object.keys(save.weapons);
  const score = h => Math.max(...wpns.map(w => weaponScore(save, h, w)));
  const pick = own.sort((a, b) => score(b) - score(a)).slice(0, save.slots);
  // doktor/tukang/askar/komander/laser/shotgun memberi aura: kekalkan jika dimiliki dan pasukan belum penuh oleh hero lebih kuat
  save.team = pick;
  pick.forEach(h => { const best = wpns.slice().sort((a, b) => weaponScore(save, h, b) - weaponScore(save, h, a))[0]; if (best) save.heroWpn[h] = best; });
  const n = autoEquipBest(save);
  return { ok: true, msg: 'Pasukan terbaik: ' + pick.map(h => HEROES[h].nama).join(', ') + (n ? ' (' + n + ' item dipasang)' : '') };
}

// ---------- Jam peranti & sandaran ----------
function clockCheck(save, now) { if (!save.maxNow || now > save.maxNow) { save.maxNow = now; return true; } return now >= save.maxNow - 300000; }
function needBackup(save, now) { return save.best >= 6 && (!save.lastExport || now - save.lastExport > 3 * 86400000); }

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
  for (let i = 0; i < nI; i++) r.items.push(makeItem(save, rng, Math.min(4, 1 + Math.floor(save.best / 40))));
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
  aksesori: ['Azimat', 'Gelang', 'Topi', 'But', 'Rantai', 'Sarung Tangan'],
  perisai:  ['Paku', 'Plat', 'Kawat', 'Simen', 'Rantai Pagar', 'Tiang']
};
const ITEM_JENIS = ['senjata', 'aksesori', 'perisai'];
const RAR_SUFFIX = ['Usang', 'Kemas', 'Kukuh', 'Berkilau', 'Diraja', 'Sakti', 'Purba', 'Dewata', 'Kosmik', 'Abadi'];
const CHESTS = {
  kayu:  { nama: 'Peti Kayu',  mata: 'gold', minRar: 0, desc: '1 item rawak' },
  emas:  { nama: 'Peti Emas',  mata: 'gems', harga: 30,  minRar: 2, desc: '1 item, sekurang-kurangnya Jarang' },
  mitos: { nama: 'Peti Mitos', mata: 'gems', harga: 150, minRar: 5, desc: '1 item, sekurang-kurangnya Mitos' },
  abadi: { nama: 'Peti Kosmik', mata: 'gems', harga: 800, minRar: 7, desc: '1 item, sekurang-kurangnya Dewa' }
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
  perisai:   { nama: 'Berperisai',  desc: 'Terima 35% kurang damage',          stage: 3,  huruf: 'P', warna: '#9AA0A8' },
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
  melompat:  { nama: 'Pelompat',    desc: 'Melompat ke hadapan',               stage: 42, huruf: '⤒', warna: '#C0D870' }
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
function zombieStats(type, stage, wave) {
  const z = ZTYPES[type], m = earlyEase(stage) * stageMult(stage) * (1 + 0.06 * (wave - 1)) * (type === 'boss' && isBigBoss(stage) ? 2 : 1);
  return {
    hp: Math.round(z.hp * m), spd: z.spd * Math.min(1.6, 1 + 0.015 * (stage - 1)),
    dmg: Math.round(z.dmg * Math.pow(1.12, stage - 1)),
    gold: Math.max(1, Math.round(z.gold * Math.pow(GOLD_G, stage - 1) * (1 + 0.05 * (wave - 1)) * (type === 'boss' && isBigBoss(stage) ? 3 : 1)))
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
function offlineGold(save, seconds) { if (!(seconds >= 60)) return 0; return Math.floor(Math.min(seconds, OFFLINE_CAP) * idleRate(save.best) * (1 + 0.15 * save.shop.magnet)); }

function itemPower(it) { return RARITY[it.rar].mult * Math.pow(1.07, it.ilvl - 1); }
function itemStats(it) {
  const p = itemPower(it), rm = RARITY[it.rar].mult;
  if (it.jenis === 'senjata') return { dmg: Math.round(15 * p), crit: it.rar >= 3 ? Math.min(50, 3 * it.rar + Math.floor(it.ilvl / 10)) : 0 };
  if (it.jenis === 'aksesori') return { rate: Math.round(Math.min(150, 4 * rm + 0.4 * (it.ilvl - 1))), gold: Math.round(6 * rm + 0.5 * (it.ilvl - 1)) };
  return { hp: Math.round(20 * p), armor: Math.min(25, Math.round(1.5 * rm + 0.05 * it.ilvl)), thorns: it.rar >= 5 ? Math.min(3, 0.5 * (it.rar - 4)) : 0, regen: it.rar >= 4 ? Math.min(1, 0.1 * (it.rar - 3)) : 0 };
}
function itemName(it) { return ITEM_NAMES[it.jenis][it.base % 6] + ' ' + RAR_SUFFIX[it.rar] + ' +' + it.ilvl; }
function forgeCost(it) { return Math.floor(40 * RARITY[it.rar].mult * Math.pow(1.11, it.ilvl)); }
function sellValue(it) { return Math.floor(12 * RARITY[it.rar].mult * Math.pow(1.1, it.ilvl)); }
function itemDesc(it) {
  const s = itemStats(it);
  if (it.jenis === 'senjata') return '+' + s.dmg + '% damage' + (s.crit ? ', ' + s.crit + '% kritikal' : '');
  if (it.jenis === 'aksesori') return '+' + s.rate + '% laju tembak, +' + s.gold + '% gold';
  return '+' + s.hp + '% HP pagar, perisai ' + s.armor + '%' + (s.thorns ? ', duri ' + s.thorns + '%' : '') + (s.regen ? ', pulih ' + s.regen.toFixed(1) + '%/s' : '');
}
const itemByUid = (save, uid) => (uid == null ? null : save.items.find(x => x.uid === uid) || null);

function heroWeapon(save, id) { const w = save.heroWpn[id]; return WEAPONS[w] && save.weapons[w] ? w : HEROES[id].wpn; }
function heroStats(save, id, now) {
  const wid = heroWeapon(save, id), wd = WEAPONS[wid], lvl = save.heroes[id] || 1, eq = save.equip[id] || {};
  let dmgPct = 0, crit = wd.critB || 0, ratePct = 0, goldPct = 0;
  for (const slot of ['senjata', 'aksesori']) {
    const it = itemByUid(save, eq[slot]); if (!it) continue; const s = itemStats(it);
    dmgPct += s.dmg || 0; crit += (s.crit || 0) / 100; ratePct += s.rate || 0; goldPct += s.gold || 0;
  }
  return {
    wid, dmg: rohMult(save) * (1 + 0.1 * perk(save, 'berkat')) * wd.dmg * heroLvlMult(lvl) * TIERS[HEROES[id].tier].mult * starMult(save.stars[id] || 0) * wpnLvlMult(save.weapons[wid] || 1) * Math.pow(1.1, save.shop.damage) * (1 + dmgPct / 100) * (boostOn(save, 'dmg', now) ? 2 : 1),
    rate: wd.rate * (1 + 0.06 * save.shop.speed) * (1 + ratePct / 100) * (boostOn(save, 'speed', now) ? 1.5 : 1),
    crit: Math.min(0.9, crit), goldPct
  };
}
function wallStats(save) {
  const w = WALLS[save.wallActive] || WALLS[0];
  let hpPct = 0, armor = w.armor, thorns = w.thorns, regen = w.regen;
  save.wallEquip.forEach(uid => { const it = itemByUid(save, uid); if (!it) return; const s = itemStats(it); hpPct += s.hp; armor += s.armor; thorns += s.thorns / 100; regen += s.regen / 100; });
  return { max: Math.round(100 * Math.pow(1.15, save.shop.wall) * w.hp * (1 + hpPct / 100)), armor: Math.min(50, armor), thorns, regen, w };
}

// ---------- Save ----------
function defaultSave(now) {
  return { v: SAVE_V, gold: 0, gems: 0, stage: 1, best: 1, cleared: [], heroes: { pistol: 1 }, team: ['pistol'], slots: 3,
    weapons: { pistol: 1 }, heroWpn: {}, wallsOwned: 1, wallActive: 0, wallEquip: [null, null, null],
    shop: { damage: 0, speed: 0, wall: 0, tap: 0, magnet: 0, luck: 0 }, items: [], equip: {}, boost: {}, nextUid: 1, last: now || 0, kills: 0, evoSeen: 0, powers: { meteor: 1 }, autoPow: false, stars: {}, shards: {}, seenZ: '', stats: {}, achClaimed: {}, daily: { login: '', streak: 0, mDay: '', missions: [], bonus: false }, autoSell: -1, dev: false, tut: 0, settings: { music: 0.5, sfx: 0.7, vib: true, calm: typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches, bigText: false }, roh: 0, rohTotal: 0, perks: {}, chal: {}, towers: [null, null, null], eventForce: '', maxNow: 0, lastExport: 0, tips: {} };
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
function migrate(o, now) {
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
  let items = Array.isArray(o.items) ? o.items.filter(it => it && typeof it.uid === 'number' && ITEM_NAMES[it.jenis] && typeof it.rar === 'number' && it.ilvl >= 1) : [];
  items = items.map(it => ({ uid: it.uid, jenis: it.jenis, rar: Math.min(9, Math.max(0, Math.floor(ver < 3 ? (RMAP[it.rar] ?? 0) : it.rar))), ilvl: Math.floor(it.ilvl), base: Math.floor(num(it.base, 0)) % 6, lock: it.lock === true })).slice(0, INV_CAP);
  const uids = new Set(items.map(i => i.uid)), jenisOf = {}; items.forEach(i => { jenisOf[i.uid] = i.jenis; });
  const equip = {};
  if (o.equip && typeof o.equip === 'object') for (const h of Object.keys(o.equip)) if (heroes[h]) { const e = o.equip[h] || {}; equip[h] = {}; ['senjata', 'aksesori'].forEach(s => { if (uids.has(e[s]) && jenisOf[e[s]] === s) equip[h][s] = e[s]; }); }
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
  const powers = {};
  if (o.powers && typeof o.powers === 'object') POWER_ORDER.forEach(p => { const l = o.powers[p]; if (typeof l === 'number' && l >= 1) powers[p] = Math.floor(l); });
  if (!powers.meteor) powers.meteor = 1;
  const seen = new Set();
  const wallEquip = [0, 1, 2].map(i => { const u = Array.isArray(o.wallEquip) ? o.wallEquip[i] : null; if (uids.has(u) && jenisOf[u] === 'perisai' && !seen.has(u)) { seen.add(u); return u; } return null; });
  return {
    v: SAVE_V, gold: num(o.gold, 0), gems: num(o.gems, 0), best, stage: Math.min(best, Math.max(1, Math.floor(num(o.stage, 1)))),
    cleared: Array.isArray(o.cleared) ? o.cleared.filter(n => typeof n === 'number') : [],
    heroes, team, slots, weapons, heroWpn, wallsOwned, wallActive, wallEquip, shop, items, equip, boost,
    nextUid: Math.max(num(o.nextUid, 1), ...items.map(i => i.uid + 1), 1), last: num(o.last, now || 0), kills: num(o.kills, 0), evoSeen: num(o.evoSeen, 0), powers, autoPow: o.autoPow === true,
    stars: cleanMap(o.stars, h => heroes[h], MAX_STARS), shards: cleanMap(o.shards, h => HEROES[h], 1e12),
    seenZ: typeof o.seenZ === 'string' ? o.seenZ.replace(/[^01]/g, '').slice(0, 1000) : '',
    stats: cleanMap(o.stats, () => true, 1e300), achClaimed: cleanMap(o.achClaimed, k => ACH.some(a => a.id === k), 5),
    daily: cleanDaily(o.daily), autoSell: Math.max(-1, Math.min(4, Math.floor(typeof o.autoSell === 'number' ? o.autoSell : -1))), dev: o.dev === true,
    tut: Math.max(0, Math.floor(num(o.tut, o.heroes ? 99 : 0))), roh: Math.floor(num(o.roh, 0)), rohTotal: Math.floor(num(o.rohTotal, 0)),
    towers: [0, 1, 2].map(i => { const t = Array.isArray(o.towers) ? o.towers[i] : null; return t && TOWERS[t.type] && t.lvl >= 1 ? { type: t.type, lvl: Math.floor(t.lvl) } : null; }),
    maxNow: num(o.maxNow, 0), lastExport: num(o.lastExport, 0), tips: o.tips && typeof o.tips === 'object' ? Object.fromEntries(Object.keys(o.tips).map(k => [k, true])) : {},
    eventForce: typeof o.eventForce === 'string' && EVENTS.some(e => e.id === o.eventForce) ? o.eventForce : '',
    perks: cleanMap(o.perks, k => PERKS[k], 999), chal: cleanMap(o.chal, k => CHALLENGES.some(c => c.id === k), CHAL_LEVELS), settings: { music: Math.min(1, num(o.settings && o.settings.music, 0.5)), sfx: Math.min(1, num(o.settings && o.settings.sfx, 0.7)), vib: !(o.settings && o.settings.vib === false), calm: !!(o.settings && o.settings.calm), bigText: !!(o.settings && o.settings.bigText) }
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
  const w = HEROES[id].wpn; if (!save.weapons[w]) save.weapons[w] = 1;
  if (save.team.length < save.slots) save.team.push(id);
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
  save.team.push(id); return { ok: true, msg: HEROES[id].nama + ' masuk pasukan' };
}
function buySlot(save) {
  if (save.slots >= MAX_SLOTS) return { ok: false, msg: 'Slot sudah maksimum' };
  const c = SLOT_COST[save.slots + 1];
  if (save.gems < c) return { ok: false, msg: 'Gems tak cukup (perlu ' + c + ')' };
  save.gems -= c; save.slots++; return { ok: true, msg: 'Slot pasukan kini ' + save.slots };
}
function unlockWeapon(save, id) {
  if (save.weapons[id]) return { ok: false, msg: 'Sudah dimiliki' };
  const w = WEAPONS[id];
  if (!w.harga) return { ok: false, msg: 'Dibuka bersama hero asalnya' };
  if (save.gems < w.harga) return { ok: false, msg: 'Gems tak cukup (perlu ' + w.harga + ')' };
  save.gems -= w.harga; save.weapons[id] = 1; return { ok: true, msg: w.nama + ' masuk gudang!' };
}
function upgradeWeapon(save, id, n) {
  n = n || 1; const lvl = save.weapons[id];
  if (!lvl) return { ok: false, msg: 'Senjata belum dimiliki' };
  let k = 0, cost = 0;
  while (k < n && save.gold >= cost + wpnCost(id, lvl + k)) { cost += wpnCost(id, lvl + k); k++; }
  if (!k) return { ok: false, msg: 'Gold tak cukup (perlu ' + wpnCost(id, lvl) + ')' };
  save.gold -= cost; save.weapons[id] = lvl + k; return { ok: true, msg: WEAPONS[id].nama + ' Lv.' + (lvl + k) };
}
function equipWeapon(save, heroId, wid) {
  if (!save.heroes[heroId] || !save.weapons[wid]) return { ok: false, msg: 'Tidak boleh dipasang' };
  save.heroWpn[heroId] = wid; return { ok: true, msg: HEROES[heroId].nama + ' kini guna ' + WEAPONS[wid].nama };
}
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
  return { uid: save.nextUid++, jenis: jenis || ITEM_JENIS[Math.floor(rng() * 3)], rar: rollRarity(rng, save.shop.luck, minRar || 0), ilvl: Math.max(1, save.best - 1 + Math.floor(rng() * 3)), base: Math.floor(rng() * 6) };
}
function addItem(save, it) {
  if (it.rar <= save.autoSell) { const v = sellValue(it); save.gold += v; stat(save, 'itemsGot'); stat(save, 'itemsSold'); statMax(save, 'maxRar', it.rar); return { ok: false, sold: v, it, auto: true }; }
  if (save.items.length >= INV_CAP) { const v = sellValue(it); save.gold += v; return { ok: false, sold: v, it }; }
  save.items.push(it); stat(save, 'itemsGot'); statMax(save, 'maxRar', it.rar); return { ok: true, it };
}
function openChest(save, id, rng) {
  const c = CHESTS[id], cost = chestCost(id, save.best);
  if (save[c.mata] < cost) return { ok: false, msg: (c.mata === 'gold' ? 'Gold' : 'Gems') + ' tak cukup (perlu ' + cost + ')' };
  save[c.mata] -= cost; stat(save, 'chests');
  const r = addItem(save, makeItem(save, rng, c.minRar));
  return { ok: true, it: r.it, msg: r.ok ? 'Dapat ' + RARITY[r.it.rar].nama + ': ' + itemName(r.it) : 'Beg penuh, item dijual +' + r.sold + ' gold' };
}
function whoEquips(save, uid) {
  const wi = save.wallEquip.indexOf(uid); if (wi >= 0) return { hero: '__pagar', slot: wi };
  for (const h of Object.keys(save.equip)) for (const s of ['senjata', 'aksesori']) if (save.equip[h][s] === uid) return { hero: h, slot: s };
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
  for (const j of ['senjata', 'aksesori']) {
    const its = save.items.filter(i => i.jenis === j).sort((a, b) => itemPower(b) - itemPower(a));
    save.team.forEach((h, i) => { if (its[i] && (save.equip[h] || {})[j] !== its[i].uid) { equipItem(save, its[i].uid, h); n++; } });
  }
  const ps = save.items.filter(i => i.jenis === 'perisai').sort((a, b) => itemPower(b) - itemPower(a)).slice(0, WALL_SLOTS);
  const want = ps.map(i => i.uid);
  if (want.join() !== save.wallEquip.filter(x => x != null).join()) { save.wallEquip = [0, 1, 2].map(i => want[i] ?? null); n += want.length; }
  return n;
}
function winStage(save, stage, rng) {
  let gems = 0;
  if (!save.cleared.includes(stage)) { gems = firstPassGems(stage); save.gems += gems; stat(save, 'gemsGot', gems); save.cleared.push(stage); addShards(save, randomShardHero(rng || Math.random), 5); }
  save.best = Math.max(save.best, stage + 1); save.stage = Math.min(save.best, stage + 1);
  return gems;
}
function mulberry(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------- Pertempuran ----------
function Battle(save, stage, rng, chal) {
  this.save = save; this.stage = stage; this.rng = rng || Math.random; this.now = 0;
  this.chal = chal || null; this.mods = chal ? (CHALLENGES.find(c => c.id === chal.id) || {}).mods || {} : {}; this.maxWave = chal ? CHAL_WAVES : wavesFor(stage);
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
  this.team = ids.map((id, i) => { const o = old[id]; return { id, x: gap * (i + 1), y: 540, cd: o ? o.cd : 0.3 + i * 0.15, aim: o ? o.aim : -Math.PI / 2, recoil: 0 }; });
  const has = h => ids.includes(h) ? skillK(this.save, h) : 0;
  this.aura = { wall: 1 + 0.1 * has('shotgun'), dmg: 1 + 0.1 * has('askar'), rate: 1 + 0.15 * has('komander'), powCd: 1 - Math.min(0.5, 0.15 * has('laser')), slowAmp: 0.2 * has('frost'), regen: 0.005 * has('tukang'), drop: 1 + 0.25 * has('saintis'), doktor: has('doktor'), pahlawan: has('pahlawan') };
  const ws = wallStats(this.save), ratio = this.wallMax ? this.wall / this.wallMax : 1, wmax = Math.max(1, Math.round(ws.max * this.aura.wall * ((this.mods && this.mods.wall) || 1)));
  this.wallMax = wmax; this.wall = Math.max(0, ratio * wmax); this.ws = ws;
  const old2 = {}; (this.towers || []).forEach(t => { old2[t.slot] = t; });
  this.towers = this.save.towers.map((t, i) => t ? { slot: i, type: t.type, lvl: t.lvl, x: TOWER_X[i], y: TOWER_Y, cd: old2[i] ? old2[i].cd : 0.5 + i * 0.2, aim: -Math.PI / 2, recoil: 0 } : null).filter(Boolean);
};
Battle.prototype.loadWave = function () {
  let q = waveComposition(this.stage, this.wave === this.maxWave ? WAVES_PER_STAGE : this.wave);
  if (this.mods.horde) q = q.concat(q.filter(t => t !== 'boss'), q.filter(t => t !== 'boss'));
  if (this.mods.bossRush && !q.includes('boss')) q.push('boss');
  this.queue = q; this.spawnT = 0;
};
Battle.prototype.spawn = function (type, at) {
  const st = zombieStats(type, this.stage, this.wave), z = ZTYPES[type];
  const r = type === 'boss' && isBigBoss(this.stage) ? 44 : z.r;
  const sp = type !== 'boss' && !at ? pickSpecies(type, this.stage, this.rng) : null;
  const zz = { id: this.nextId++, type, x: at ? at.x : r + 10 + this.rng() * (W - 2 * r - 20), y: at ? at.y : -r, hp: st.hp, maxHp: st.hp, spd: st.spd, dmg: st.dmg, gold: st.gold, r,
    slowT: 0, slowK: 0, burnT: 0, burnD: 0, atkT: 0, wob: this.rng() * 6, hitT: 0, evo: 0, evoT: 0, traits: [], rage: false, kid: !!at,
    warna: type === 'boss' ? BOSS_COLORS[(this.stage - 1) % BOSS_COLORS.length] : z.kulit, sp: sp ? sp.id : -1, gear: sp ? ZGEAR[sp.gi].id : 'tiada', tint: sp ? ZELEM[sp.ei].tint : null, jumpT: 2 + this.rng() * 2, healT: 1 };
  const bb = type === 'boss' ? bigBossOf(this.stage) : null;
  if (bb) { zz.bossKind = bb.id; zz.warna = bb.warna; zz.abT = 3; zz.r = bb.id === 'naga' || bb.id === 'besi' ? 46 : 44; if (bb.id === 'besi') zz.traits = ['perisai']; }
  if (sp) {
    zz.hp = zz.maxHp = Math.round(st.hp * sp.hp); zz.spd *= sp.spd; zz.dmg = Math.round(st.dmg * sp.dmg); zz.gold = Math.max(1, Math.round(st.gold * sp.gold)); zz.traits = sp.sifat.slice();
    if (zz.traits.includes('pecut')) zz.spd *= 1.5;
    this.markSeen(sp.id);
  }
  if (this.mods.horde && !at && type !== 'boss') zz.hp = zz.maxHp = Math.max(1, Math.round(zz.hp * 0.4));
  if (this.mods.spd) zz.spd *= this.mods.spd;
  if (this.mods.evoMax && type !== 'boss') while (this.evolve(zz, true));
  if (at) { zz.hp = zz.maxHp = Math.max(1, Math.round(at.hp)); zz.r = 10; zz.gold = Math.max(1, Math.round(at.gold)); }
  // zombie peringkat tinggi kadang-kadang lahir sudah berevolusi
  const pre = Math.min(maxEvo(this.stage) - 1, Math.floor(this.stage / 25));
  if (!at && type !== 'boss') for (let i = 0; i < pre; i++) if (this.rng() < 0.5) this.evolve(zz, true);
  this.zombies.push(zz); return zz;
};
Battle.prototype.bossAbility = function (z, dt) {
  z.abT -= dt; if (z.invT > 0) z.invT -= dt;
  if (z.bossKind === 'lendir' && !z.split && z.hp < z.maxHp / 2) { z.split = true; for (let i = 0; i < 4; i++) { const k = this.spawn('gemuk', { x: Math.max(20, Math.min(W - 20, z.x + (i - 1.5) * 26)), y: z.y + 10, hp: z.maxHp * 0.08, gold: z.gold * 0.05 }); k.warna = '#6CC04A'; k.r = 16; } this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 20, t: 0, txt: 'Lendir pecah!', warna: '#6CC04A' }); }
  if (z.abT > 0) return;
  if (z.bossKind === 'jeneral') { z.abT = 5; for (let i = 0; i < 2; i++) { const k = this.spawn('laju', { x: Math.max(16, Math.min(W - 16, z.x + (i ? 30 : -30))), y: z.y, hp: zombieStats('laju', this.stage, this.wave).hp, gold: zombieStats('laju', this.stage, this.wave).gold }); k.r = 13; } this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 20, t: 0, txt: 'Serbu!', warna: '#C8D0DC' }); }
  else if (z.bossKind === 'ratu') { z.abT = 6; this.poisonT = 3; this.fx.push({ kind: 'cloud', x: W / 2, y: WALL_Y + 40, t: 0, life: 3 }); this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 20, t: 0, txt: 'Awan racun!', warna: '#C080E0' }); }
  else if (z.bossKind === 'besi') { z.abT = 8; z.invT = 2; this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 20, t: 0, txt: 'Perisai kebal!', warna: '#C8D0DC' }); }
  else if (z.bossKind === 'naga') { z.abT = 7; z.y = Math.min(WALL_Y - z.r - 130, z.y + 80); z.hop = 0.35; this.fx.push({ kind: 'breath', x: z.x, y: z.y, t: 0, life: 0.8 }); this.hitWall(z, 1.5); }
  else z.abT = 99;
};
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
Battle.prototype.damage = function (z, dmg, fx) {
  if (z.hp <= 0) return;
  if (z.invT > 0) { if (this.fx.length < 200 && Math.random() < 0.2) this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r, t: 0, txt: 'Kebal', warna: '#C8D0DC' }); return; }
  if (fx && fx.bullet && z.traits.includes('hantu') && this.rng() < 0.25) { this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r, t: 0, txt: 'Elak!', warna: '#D8E0F0' }); return; }
  if (z.traits.includes('perisai')) dmg *= 0.65;
  const src = fx && fx.src; if (src) { const dealt = Math.min(dmg, Math.max(0, z.hp)); if (isFinite(dealt)) this.dmgBy[src] = (this.dmgBy[src] || 0) + dealt; }
  z.hp -= dmg; z.hitT = 0.12;
  if (fx && fx.slow && !z.traits.includes('kebal_ais')) { z.slowT = 1.5; z.slowK = Math.max(z.slowK, fx.slow); }
  if (fx && fx.burn && !z.traits.includes('kebal_api')) { z.burnT = 3; z.burnD = Math.max(z.burnD, fx.burn); z.burnW = fx.wid || z.burnW; if (fx.src) z.burnSrc = fx.src; }
  if (fx && fx.crit) this.fx.push({ kind: 'txt', x: z.x + 10, y: z.y - 6, t: 0, txt: 'KRITIKAL', warna: '#FF5A5A' });
  if (z.type === 'boss' && !z.rage && z.hp > 0 && z.hp < z.maxHp / 2) {
    z.rage = true; z.spd *= 1.4; z.dmg = Math.round(z.dmg * 1.5); z.evo = Math.max(z.evo, 2);
    this.fx.push({ kind: 'evo', x: z.x, y: z.y, t: 0, r: z.r, warna: '#FF5A5A' }); this.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 30, t: 0, txt: 'BOSS MENGAMUK!', warna: '#FF5A5A' }); this.evolved++;
  }
  if (z.hp <= 0) {
    const g = this.addGold(z.gold, this.goldPctCache || 0);
    this.save.kills += 1; stat(this.save, 'kills'); if (z.evo > 0) stat(this.save, 'evoKills');
    this.fx.push({ kind: 'txt', x: z.x, y: z.y, t: 0, txt: '+' + fmtNum(g), warna: '#F5B82E' });
    this.fx.push({ kind: 'pop', x: z.x, y: z.y, t: 0, r: z.r, warna: z.warna, boss: z.type === 'boss' });
    if (z.traits.includes('pembelah') && !z.kid) for (let i = 0; i < 2; i++) this.spawn('laju', { x: Math.max(14, Math.min(W - 14, z.x + (i ? 16 : -16))), y: z.y, hp: z.maxHp * 0.25, gold: z.gold * 0.2 });
    const dropP = (0.012 + 0.002 * this.save.shop.luck) * (boostOn(this.save, 'drop', this.now) ? 3 : 1) * (1 + 0.25 * z.evo) * (this.aura ? this.aura.drop : 1);
    if (z.type === 'boss') {
      const gm = Math.round((isBigBoss(this.stage) ? 25 : 5) * (1 + 0.2 * perk(this.save, 'rezeki'))); this.save.gems += gm; this.earnedGems += gm; stat(this.save, 'bosses'); stat(this.save, 'gemsGot', gm); if (isBigBoss(this.stage)) stat(this.save, 'bigBosses');
      this.fx.push({ kind: 'txt', x: z.x, y: z.y - 24, t: 0, txt: '+' + gm + ' gems', warna: '#A066E8' });
      this.dropItem(z, isBigBoss(this.stage) ? 3 : 2);
    } else if (this.rng() < dropP) this.dropItem(z, Math.min(3, z.evo));
    const evS = this.now || this.save.eventForce ? activeEvent(this.now, this.save.eventForce) : null; if (z.type === 'boss' || this.rng() < 0.006 * (1 + 0.3 * z.evo) * (evS ? evS.shard : 1)) { const h = randomShardHero(this.rng), n = z.type === 'boss' ? (isBigBoss(this.stage) ? 5 : 3) : 1; addShards(this.save, h, n); (this.shardLog = this.shardLog || []).push({ h, n }); this.fx.push({ kind: 'loot', sub: 'shard', tier: HEROES[h].tier, n, x: z.x, y: z.y, t: 0, life: 1.6, dir: this.rng() < 0.5 ? -1 : 1 }); }
  }
};
Battle.prototype.dropItem = function (z, minRar) {
  const r = addItem(this.save, makeItem(this.save, this.rng, minRar));
  this.drops.push(r);
  this.fx.push({ kind: 'loot', sub: 'item', rar: r.it.rar, jenis: r.it.jenis, x: z.x, y: z.y, t: 0, life: 1.8, dir: this.rng() < 0.5 ? -1 : 1 });
};
Battle.prototype.splash = function (x, y, rad, dmg, fx, skipId) {
  this.fx.push({ kind: 'boom', x, y, t: 0, r: rad, wid: fx && fx.wid });
  for (const z of this.zombies) if (z.hp > 0 && z.id !== skipId && Math.hypot(z.x - x, z.y - y) < rad + z.r) this.damage(z, dmg * 0.6, fx);
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
function tapRadius(save) { return 45 + 8 * (save.shop.jariApi || 0); }
function tapWindow(save) { return 0.9 + 0.1 * (save.shop.kombo || 0); }
function comboMult(save, combo) { return 1 + Math.min(1 + 0.1 * (save.shop.kombo || 0), combo / 20); }
const STOMP_EVERY = 50;
Battle.prototype.tapBase = function () { return Math.max(...this.team.map(m => heroStats(this.save, m.id, this.now).dmg)) * 0.3 * (1 + 0.5 * this.save.shop.tap); };
Battle.prototype.tap = function (x, y) {
  if (this.state !== 'main') return false;
  const R0 = tapRadius(this.save); let hit = null, bd = 1e9;
  for (const z of this.zombies) if (z.hp > 0) { const d = Math.hypot(z.x - x, z.y - y) - z.r; if (d < R0 && d < bd) { bd = d; hit = z; } }
  if (!hit) { this.fx.push({ kind: 'tapMiss', x, y, t: 0 }); return false; }
  this.combo = (this.comboT > 0 ? this.combo || 0 : 0) + 1; this.comboT = tapWindow(this.save); statMax(this.save, 'maxCombo', this.combo);
  const crit = this.rng() < 0.1, dmg = this.tapBase() * comboMult(this.save, this.combo) * (crit ? 2 : 1);
  this.damage(hit, dmg); stat(this.save, 'taps');
  this.fx.push({ kind: 'tapHit', x: hit.x, y: hit.y, t: 0, dmg, crit, combo: this.combo, a: this.rng() * Math.PI });
  this.tapCharge = (this.tapCharge || 0) + 1;
  if (this.tapCharge >= STOMP_EVERY) { this.tapCharge = 0; this.stomp(hit.x, hit.y); }
  return true;
};
Battle.prototype.stomp = function (x, y) {
  const dmg = this.tapBase() * 6; stat(this.save, 'stomps');
  this.fx.push({ kind: 'stomp', x, y, t: 0, life: 1 }); this.fx.push({ kind: 'shake', t: 0, mag: 8 });
  for (const z of this.zombies) if (z.hp > 0 && Math.hypot(z.x - x, z.y - y) < 110 + z.r) { this.damage(z, dmg * (z.type === 'boss' ? 0.5 : 1)); z.slowT = 1; z.slowK = Math.max(z.slowK, 0.5); }
};
Battle.prototype.teamDps = function () {
  let s = 0;
  for (const m of this.team) { const st = heroStats(this.save, m.id, this.now), wd = WEAPONS[st.wid]; s += st.dmg * st.rate * (wd.n || 1) * (wd.splash ? 1.5 : 1) * (wd.chain ? 1 + wd.chain * 0.3 : 1); }
  return s;
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
    case 'penawar': this.wall = Math.min(this.wallMax, this.wall + this.wallMax * 0.4); this.act.penawar = { t: dur }; break;
    case 'amuk': this.act.amuk = { t: dur }; break;
    case 'emas': this.act.emas = { t: dur }; break;
    case 'lubang': this.act.lubang = { t: dur, x: W / 2, y: 250, dps: base * 2, end: base * 6 }; break;
    case 'bom': this.bombs.push({ x: W / 2, y: 240, t: 1.2, dmg: base * 15, r: 170 }); break;
  }
  return true;
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
    if (id === 'duri') for (const z of this.zombies) if (z.hp > 0 && z.y + z.r > WALL_Y - 120) { this.damage(z, a.dps * dt); z.slowT = Math.max(z.slowT, 0.2); z.slowK = Math.max(z.slowK, 0.3); }
    if (id === 'petir') { a.tick -= dt; if (a.tick <= 0) { a.tick = 0.3; const al = this.zombies.filter(z => z.hp > 0 && z.y > 0); if (al.length) { const z = al[Math.floor(this.rng() * al.length)]; this.fx.push({ kind: 'strike', x: z.x, y: z.y, t: 0 }); this.damage(z, a.dmg); this.chainFrom(z, 2, a.dmg * 0.6, { wid: 'petir' }); } } }
    if (id === 'lubang') {
      for (const z of this.zombies) if (z.hp > 0) { const dx = a.x - z.x, dy = a.y - z.y, d = Math.hypot(dx, dy) || 1, pull = (z.type === 'boss' ? 25 : 90) * dt; if (d > 6) { z.x += dx / d * Math.min(pull, d); z.y += dy / d * Math.min(pull, d); } if (d < 90) this.damage(z, a.dps * dt); }
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
    }
  }
};
Battle.prototype.hitWall = function (z, mult) {
  const ws = this.ws, d = z.dmg * (mult || 1) * (1 - ws.armor / 100);
  if (!this.god && !this.act.penawar) { this.wall -= d; this.wallHit = true; }
  if (!this.lastWH || (this.clock || 0) - this.lastWH > 0.25) { this.lastWH = this.clock || 0; this.fx.push({ kind: 'wallHit', x: z.x, t: 0 }); }
  if (ws.thorns > 0) this.damage(z, z.maxHp * ws.thorns * (z.type === 'boss' ? 0.2 : 1));
};
Battle.prototype.update = function (dt) {
  if (this.state !== 'main') { this.updateFx(dt); return; }
  this.clock = (this.clock || 0) + dt;
  if (this.comboT > 0) { this.comboT -= dt; if (this.comboT <= 0) this.combo = 0; }
  this.goldPctCache = this.teamGoldPct();
  this.updatePowers(dt);
  const rg = this.ws.regen + this.aura.regen; if (rg > 0) this.wall = Math.min(this.wallMax, this.wall + this.wallMax * rg * dt);
  if (this.aura.doktor && !this.docUsed && this.wall < this.wallMax * 0.3 && this.wall > 0) { this.docUsed = true; this.wall += this.wallMax * 0.15 * this.aura.doktor; this.fx.push({ kind: 'txt', x: W / 2, y: WALL_Y - 40, t: 0, txt: 'Rawatan Kecemasan!', warna: '#7FF0C8' }); }
  if (this.aura.pahlawan) { this.hkT = (this.hkT || 8) - dt; if (this.hkT <= 0) { this.hkT = 8; const al = this.zombies.filter(z => z.hp > 0 && z.y > 0); if (al.length) { const z = al.reduce((a, b) => (b.hp > a.hp ? b : a)); const pm = this.team.find(m => m.id === 'pahlawan'); const d0 = pm ? heroStats(this.save, 'pahlawan', this.now).dmg : 0; this.fx.push({ kind: 'strike', x: z.x, y: z.y, t: 0 }); this.damage(z, d0 * 5 * this.aura.pahlawan); } } }
  if (this.pause > 0) this.pause -= dt;
  else if (this.queue.length && this.zombies.length < ZCAP) { this.spawnT -= dt; if (this.spawnT <= 0) { this.spawn(this.queue.shift()); this.spawnT = (0.8 - Math.min(0.45, this.stage * 0.02)) * (this.mods.horde ? 0.4 : 1); } }
  const evoTime = Math.max(3.5, EVO_TIME - this.stage * 0.03);
  for (const z of this.zombies) {
    if (z.hp <= 0) continue;
    z.wob += dt * 6; if (z.hitT > 0) z.hitT -= dt; if (z.atkAnim > 0) z.atkAnim -= dt;
    if (z.slowT > 0) z.slowT -= dt; else z.slowK = 0;
    if (z.burnT > 0) { z.burnT -= dt; this.damage(z, z.burnD * dt, z.burnSrc ? { src: z.burnSrc } : null); if (z.burnT <= 0) z.burnD = 0; }
    if (z.hp <= 0) continue;
    if (z.bossKind && z.hp > 0) this.bossAbility(z, dt);
    if (z.freezeT > 0) { z.freezeT -= dt; continue; }
    if (z.traits.includes('pemulih')) z.hp = Math.min(z.maxHp, z.hp + z.maxHp * 0.03 * dt);
    if (z.traits.includes('penyembuh')) { z.healT -= dt; if (z.healT <= 0) { z.healT = 1; let n = 0; for (const o of this.zombies) if (o !== z && o.hp > 0 && o.hp < o.maxHp && Math.hypot(o.x - z.x, o.y - z.y) < 90) { o.hp = Math.min(o.maxHp, o.hp + o.maxHp * 0.05); n++; } if (n) this.fx.push({ kind: 'heal', x: z.x, y: z.y, t: 0 }); } }
    if (z.traits.includes('melompat') && z.y > 0) { z.jumpT -= dt; if (z.jumpT <= 0) { z.jumpT = 3; z.hop = 0.35; z.y = Math.min(WALL_Y - z.r - (z.traits.includes('penembak') ? 120 : 0), z.y + 50); } }
    if (z.hop > 0) z.hop -= dt;
    z.evoT += dt; if (z.evoT >= evoTime) { z.evoT = 0; this.evolve(z); }
    const ranged = z.traits.includes('penembak') || z.bossKind === 'naga';
    const stopY = ranged ? WALL_Y - z.r - 120 : WALL_Y - z.r;
    if (z.y < stopY) z.y = Math.min(stopY, z.y + z.spd * (1 - z.slowK) * dt);
    else if (z.traits.includes('pengebom') && !ranged) { this.hitWall(z, 5); this.fx.push({ kind: 'boom', x: z.x, y: WALL_Y - 10, t: 0, r: 45, wid: 'pengebom' }); this.fx.push({ kind: 'shake', t: 0, mag: 5 }); z.boomed = true; this.damage(z, Infinity); }
    else { z.atkT -= dt; if (z.atkT <= 0) { z.atkT = ranged ? 1.5 : 1; z.atkAnim = 0.3; this.hitWall(z, ranged ? 0.6 : 1); this.fx.push(ranged ? { kind: 'spit', x: z.x, y: z.y, t: 0 } : { kind: 'bonk', x: z.x, y: WALL_Y, t: 0 }); } }
  }
  let fz = 0; for (const z of this.zombies) if (z.hp > 0 && z.y > 60 && z.traits.includes('pembeku')) fz++;
  if (this.poisonT > 0) this.poisonT -= dt;
  this.heroSlow = Math.min(0.6, 0.12 * fz + (this.poisonT > 0 ? 0.4 : 0));
  for (const m of this.team) {
    const st = heroStats(this.save, m.id, this.now), d = WEAPONS[st.wid];
    if (d.heal) this.wall = Math.min(this.wallMax, this.wall + this.wallMax * d.heal * dt);
    if (m.recoil > 0) m.recoil -= dt;
    m.cd -= dt;
    let target = null;
    for (const z of this.zombies) if (z.hp > 0 && z.y > -5 && Math.hypot(z.x - m.x, z.y - m.y) <= d.range) { if (!target || z.y > target.y) target = z; }
    if (target) m.aim = Math.atan2(target.y - m.y, target.x - m.x); else m.heat = 0;
    if (target && m.cd <= 0) {
      if (m.id === 'mesingan') m.heat = Math.min(0.45 * skillK(this.save, 'mesingan'), (m.heat || 0) + 0.03);
      m.cd = 1 / (st.rate * (this.act.amuk ? 2.5 : 1) * (1 - this.heroSlow) * this.aura.rate * (1 + (m.heat || 0))); m.recoil = 0.1; m.shots = (m.shots || 0) + 1;
      const sk = skillK(this.save, m.id), extra = (m.id === 'budak' && this.rng() < 0.15 * sk) || (m.id === 'ninja' && this.rng() < 0.2 * sk) ? 1 : 0;
      const n = (d.n || 1) + extra;
      for (let i = 0; i < n; i++) {
        const crit = (m.id === 'koboi' && m.shots % 5 === 0) || this.rng() < st.crit + (m.id === 'sniper' ? 0.25 * sk : 0);
        const a = m.aim + (i - (n - 1) / 2) * (d.spread || 0.08 * (n > 1 ? 1 : 0)) + (n === 1 && d.spread ? (this.rng() - 0.5) * d.spread : 0);
        const spd = d.splash ? 380 : 560;
        this.bullets.push({ hero: m.id, sk, wid: st.wid, x: m.x + Math.cos(a) * 18, y: m.y - 8 + Math.sin(a) * 18, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, spd, dmg: st.dmg * (crit ? 2 : 1) * (this.act.amuk ? 1.5 : 1), crit, pierce: d.pierce || 1, hit: [], warna: d.peluru, life: d.range / spd + 0.4 * (d.homing ? 2 : 0) + 0.15, big: !!d.splash, laser: d.pierce >= 99, target: d.homing ? target.id : 0 });
      }
    }
  }
  if (this.towers.length) {
    const avg = this.team.length ? this.team.reduce((a, m) => a + heroStats(this.save, m.id, this.now).dmg, 0) / this.team.length : 10;
    for (const tw of this.towers) {
      const T = TOWERS[tw.type], wd = WEAPONS[T.wid]; if (tw.recoil > 0) tw.recoil -= dt; tw.cd -= dt;
      let tg = null; for (const z of this.zombies) if (z.hp > 0 && z.y > -5 && Math.hypot(z.x - tw.x, z.y - tw.y) <= T.range) { if (!tg || z.y > tg.y) tg = z; }
      if (tg) tw.aim = Math.atan2(tg.y - tw.y, tg.x - tw.x);
      if (tg && tw.cd <= 0) { tw.cd = 1 / (T.rate * (1 - this.heroSlow * 0.5)); tw.recoil = 0.12; const spd = wd.splash ? 380 : 560;
        this.bullets.push({ hero: 'menara' + tw.slot, sk: 1, wid: T.wid, x: tw.x + Math.cos(tw.aim) * 14, y: tw.y + Math.sin(tw.aim) * 14, vx: Math.cos(tw.aim) * spd, vy: Math.sin(tw.aim) * spd, spd, dmg: avg * 0.25 * T.mult * towerLvlMult(tw.lvl), crit: false, pierce: wd.pierce || 1, hit: [], warna: wd.peluru, life: T.range / spd + 0.15, big: !!wd.splash, laser: false, target: 0 }); }
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
    const d = WEAPONS[b.wid], fx = { slow: d.slow, burn: d.burn ? b.dmg * d.burn : 0, crit: b.crit, wid: b.wid, bullet: true, src: b.hero };
    for (const z of this.zombies) {
      if (b.pierce <= 0) break;
      if (z.hp > 0 && !b.hit.includes(z.id) && Math.hypot(z.x - b.x, z.y - b.y) < z.r + (b.big ? 7 : 4)) {
        b.hit.push(z.id); b.pierce--;
        let mul = this.aura.dmg;
        if (b.hero === 'pistol' && z.y > WALL_Y - 120) mul *= 1 + 0.2 * b.sk;
        if (b.hero === 'roket' && z.type === 'boss') mul *= 1 + 0.4 * b.sk;
        if (b.hero === 'saintis' && z.evo > 0) mul *= 1 + 0.3 * b.sk;
        if (this.aura.slowAmp && z.slowT > 0) mul *= 1 + this.aura.slowAmp;
        const fx2 = mul === 1 ? fx : Object.assign({}, fx); b.dmgHit = b.dmg * mul;
        if (b.hero === 'api' && fx.burn) fx2.burn = fx.burn * (1 + b.sk);
        if (b.hero === 'jurutera' && this.rng() < 0.1 * b.sk) z.freezeT = Math.max(z.freezeT || 0, 0.5);
        if (b.hero === 'ratu_ais' && b.crit) z.freezeT = Math.max(z.freezeT || 0, 0.6 * b.sk);
        if (b.hero === 'racun' && fx.burn) { let k = 0; for (const o of this.zombies) if (o !== z && o.hp > 0 && k < 2 && Math.hypot(o.x - z.x, o.y - z.y) < 70) { o.burnT = 3; o.burnD = Math.max(o.burnD, fx.burn); o.burnW = 'racun'; k++; } }
        if (this.fx.length < 200) this.fx.push({ kind: 'hit', x: b.x, y: b.y, t: 0, wid: b.wid, a: Math.atan2(b.vy, b.vx) });
        this.damage(z, b.dmgHit, fx2);
        if (d.splash) this.splash(b.x, b.y, d.splash * (b.hero === 'bom' ? 1 + 0.3 * b.sk : 1), b.dmgHit, fx2, z.id);
        if (d.chain) this.chainFrom(z, d.chain + (b.hero === 'petir' ? Math.round(2 * b.sk) : 0), b.dmgHit, fx2);
      }
    }
  }
  this.bullets = this.bullets.filter(b => b.life > 0 && b.pierce > 0 && b.y > -40 && b.x > -40 && b.x < W + 40 && b.y < H + 40);
  this.zombies = this.zombies.filter(z => z.hp > 0);
  this.updateFx(dt);
  if (this.wall <= 0) { this.wall = 0; this.state = 'kalah'; stat(this.save, 'battles'); return; }
  if (!this.queue.length && !this.zombies.length && this.pause <= 0) {
    if (this.wave >= this.maxWave) { this.state = 'menang'; if (!this.chal) this.earnedGems += winStage(this.save, this.stage, this.rng); stat(this.save, 'battles'); stat(this.save, 'stagesWon'); if (!this.wallHit) stat(this.save, 'perfect');
      if (!this.chal && !this.wallHit && this.stage + 3 <= (this.save.stats.bestEver || 0) * 0.8) { this.save.best = Math.max(this.save.best, this.stage + 3); this.save.stage = this.stage + 3; this.skipped = 3; stat(this.save, 'skips'); } if (this.team.length === 1) stat(this.save, 'solo'); }
    else { this.wave++; this.docUsed = false; this.loadWave(); this.pause = 1.4; this.wall = Math.min(this.wallMax, this.wall + this.wallMax * 0.1); }
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
