// Katalog 200 senjata baharu (pelan v9.7–v9.9) — sumber tunggal untuk pelan, katalog & pembinaan
// Susunan nama setiap jenis: [Biasa..., Jarang..., Epik..., Legenda..., Mitos...]
const RAR = ['Biasa', 'Jarang', 'Epik', 'Legenda', 'Mitos'];
const RAR_K = [1, 1.15, 1.3, 1.45, 1.6];       // pengganda kuasa ikut kelangkaan (berbanding Biasa jenis sama)
const SPLIT_LAMA = [2, 3, 2, 2, 1];            // 11 jenis sedia ada: 10 senjata baharu setiap satu
const SPLIT_BARU = [4, 4, 5, 3, 2];            // 5 jenis baharu: 18 senjata setiap satu

// elemen: digunakan untuk carta kuat/lemah. jenis: f fizikal / m magis
const JENIS = {
  biasa:    { nama: 'Peluru',    ikon: '🔫', el: 'fizikal',  baru: false, kelas: ['penembak', 'jitu', 'robo'] },
  serak:    { nama: 'Serakan',   ikon: '💥', el: 'fizikal',  baru: false, kelas: ['penembak'] },
  tepat:    { nama: 'Tepat',     ikon: '🎯', el: 'fizikal',  baru: false, kelas: ['jitu'] },
  letup:    { nama: 'Letupan',   ikon: '💣', el: 'letupan',  baru: false, kelas: ['robo'] },
  lontar:   { nama: 'Lontar',    ikon: '🌀', el: 'fizikal',  baru: false, kelas: ['pemburu'] },
  ais:      { nama: 'Ais',       ikon: '❄', el: 'ais',      baru: false, kelas: ['salji'] },
  api:      { nama: 'Api',       ikon: '🔥', el: 'api',      baru: false, kelas: ['pemburu'] },
  racun:    { nama: 'Racun',     ikon: '☠', el: 'racun',    baru: false, kelas: ['salji', 'penyembuh'] },
  elektrik: { nama: 'Elektrik',  ikon: '⚡', el: 'elektrik', baru: false, kelas: ['sihir'] },
  tenaga:   { nama: 'Tenaga',    ikon: '🔆', el: 'tenaga',   baru: false, kelas: ['sihir'] },
  sokong:   { nama: 'Sokongan',  ikon: '💚', el: 'cahaya',   baru: false, kelas: ['penyembuh'] },
  angin:    { nama: 'Angin',     ikon: '💨', el: 'angin',    baru: true,  kelas: ['penembak'] },
  bumi:     { nama: 'Bumi',      ikon: '🪨', el: 'bumi',     baru: true,  kelas: ['robo'] },
  air:      { nama: 'Air',       ikon: '💧', el: 'air',      baru: true,  kelas: ['salji'] },
  cahaya:   { nama: 'Cahaya',    ikon: '✨', el: 'cahaya',   baru: true,  kelas: ['jitu', 'penyembuh'] },
  bayang:   { nama: 'Bayang',    ikon: '🌑', el: 'bayang',   baru: true,  kelas: ['pemburu', 'sihir'] }
};
const KELAS = {
  penembak:  { nama: 'Penembak',      ikon: '🔫' }, jitu: { nama: 'Penembak Jitu', ikon: '🎯' }, robo: { nama: 'Perobohan', ikon: '💣' },
  pemburu:   { nama: 'Pemburu',       ikon: '🌀' }, salji: { nama: 'Penjaga Salji', ikon: '❄' }, sihir: { nama: 'Ahli Sihir', ikon: '⚡' },
  penyembuh: { nama: 'Penyembuh',     ikon: '💚' }
};

// arketaip: dmg, rate, range (asas Biasa), sifat mekanik. d=darat sahaja
const ARK = {
  biasa:    [['Pistol', 10, 1.6, 340, {}], ['SMG', 5, 4, 290, { spread: 0.1 }], ['Senapang', 18, 1.1, 380, {}], ['Gatling', 3, 8, 300, { spread: 0.08 }]],
  serak:    [['Pam', 7, 1, 260, { n: 3, spread: 0.22, d: 1 }], ['Lebar', 6, 0.8, 260, { n: 5, spread: 0.3, d: 1 }], ['Slug', 16, 0.8, 300, { n: 2, spread: 0.1, d: 1 }]],
  tepat:    [['Bolt', 36, 0.45, 560, { pierce: 3 }], ['Separa', 20, 0.8, 500, { pierce: 2 }], ['Anti-kebal', 55, 0.28, 680, { pierce: 99 }]],
  letup:    [['Bom', 14, 0.7, 300, { splash: 45, d: 1 }], ['Roket', 38, 0.35, 420, { splash: 65 }], ['Meriam', 28, 0.4, 380, { splash: 55, d: 1 }], ['Mortar', 24, 0.3, 620, { splash: 80, d: 1 }]],
  lontar:   [['Lastik', 6, 2.2, 280, {}], ['Cakera', 9, 1, 300, { pierce: 4, d: 1 }], ['Busur', 18, 0.8, 420, { pierce: 2 }], ['Bintang', 8, 2, 300, { n: 2, spread: 0.15 }]],
  ais:      [['Pistol ais', 5, 1.2, 320, { slow: 0.45 }], ['Meriam ais', 6, 0.8, 320, { splash: 35, slow: 0.6, d: 1 }], ['Lembing ais', 14, 0.7, 400, { pierce: 3, slow: 0.3 }]],
  api:      [['Obor', 6, 1.3, 300, { burn: 1 }], ['Penyembur', 4, 2.4, 240, { burn: 0.8, d: 1 }], ['Lava', 6, 0.6, 320, { splash: 40, burn: 1.5, d: 1 }]],
  racun:    [['Semburan', 4, 1.1, 320, { slow: 0.25, burn: 0.8, d: 1 }], ['Sumpit', 7, 1.4, 340, { burn: 1 }], ['Kabus', 5, 0.7, 320, { splash: 40, burn: 1, d: 1 }]],
  elektrik: [['Tongkat', 12, 0.9, 330, { chain: 3 }], ['Gegelung', 8, 0.8, 320, { chain: 5 }], ['Gauss', 26, 0.6, 400, { pierce: 2, chain: 1 }]],
  tenaga:   [['Pancaran', 18, 0.8, 600, { pierce: 99 }], ['Ion', 26, 0.9, 420, { pierce: 3 }], ['Denyut', 9, 2, 380, { pierce: 2 }]],
  sokong:   [['Penyembuh', 5, 1, 300, { heal: 0.015 }], ['Penguat', 6, 1.2, 320, { heal: 0.01, buff: 0.05 }]],
  angin:    [['Peniup', 6, 1.6, 300, { knock: 14 }], ['Pusaran', 10, 0.9, 340, { splash: 35, knock: 20 }], ['Busur angin', 16, 0.9, 440, { pierce: 2, aa: 1.5 }]],
  bumi:     [['Batu', 14, 0.8, 300, { splash: 30, stun: 0.15, d: 1 }], ['Gempa', 10, 0.6, 340, { splash: 60, stun: 0.25, d: 1 }], ['Gerudi', 20, 0.7, 320, { pierce: 4, d: 1 }]],
  air:      [['Pancut', 6, 1.6, 320, { wet: 3 }], ['Ombak', 9, 0.8, 300, { splash: 45, wet: 3, knock: 12, d: 1 }], ['Lembing air', 16, 0.8, 400, { pierce: 3, wet: 3 }]],
  cahaya:   [['Sinar', 12, 1, 480, { pierce: 3 }], ['Pelita', 7, 1.2, 340, { heal: 0.008 }], ['Prisma', 8, 1.2, 360, { n: 3, spread: 0.15 }]],
  bayang:   [['Bilah', 14, 1.2, 320, { critB: 0.2 }], ['Gelap', 20, 0.7, 420, { pen: 30 }], ['Sumpahan', 8, 1, 340, { mark: 0.15 }]]
};
const JENIS_DMG = { biasa: 'f', serak: 'f', tepat: 'f', letup: 'f', lontar: 'f', ais: 'm', api: 'm', racun: 'm', elektrik: 'm', tenaga: 'm', sokong: 'm', angin: 'f', bumi: 'f', air: 'm', cahaya: 'm', bayang: 'm' };

const NAMA = {
  biasa:    ['Pistol Saku', 'Pistol Polis', 'Senapang Peronda', 'SMG Kancil', 'Karbin Ringan', 'Senapang Serbu', 'Mesingan Berat', 'Gatling Diraja', 'Senapang Harimau', 'Gatling Naga Emas'],
  serak:    ['Senapang Tumpul', 'Senapang Pam', 'Senapang Dua Laras', 'Pelempar Paku', 'Senapang Kuda', 'Senapang Serbu Pam', 'Meriam Kaca', 'Senapang Ribut', 'Senapang Seribu Butir', 'Senapang Petala Langit'],
  tepat:    ['Senapang Burung', 'Senapang Kayu', 'Senapang Pemburu', 'Senapang Teropong', 'Senapang Bolt', 'Sniper Senyap', 'Sniper Gunung', 'Sniper Helang', 'Senapang Anti-Kebal', 'Sniper Bintang Kejora'],
  letup:    ['Mercun Besar', 'Bom Kelapa', 'Pelancar Bunga Api', 'Bom Lekit', 'Pelontar Bom Tangan', 'Roket Berkembar', 'Bom Kluster', 'Meriam Kapal Perang', 'Roket Gergasi', 'Meriam Gunung Berapi'],
  lontar:   ['Lembing Kayu', 'Pelontar Guli', 'Panah Buluh', 'Cakera Besi', 'Kerambit Terbang', 'Busur Berganda', 'Cakera Gergaji', 'Busur Rajawali', 'Bumerang Diraja', 'Panah Seribu Bulan'],
  ais:      ['Penyembur Salji', 'Bola Salji', 'Pistol Sejuk Beku', 'Lembing Ais', 'Meriam Salji', 'Senapang Fros', 'Ribut Salji Mini', 'Tombak Glasier', 'Busur Kutub', 'Mahkota Zaman Ais'],
  api:      ['Obor', 'Pistol Suar', 'Penyembur Api', 'Panah Bara', 'Lastik Api', 'Meriam Lava', 'Pelontar Bara', 'Penyembur Naga', 'Tombak Magma', 'Sayap Feniks'],
  racun:    ['Botol Racun', 'Sumpit Racun', 'Penyembur Lendir', 'Pistol Asid', 'Bom Kabus', 'Meriam Asid', 'Senapang Lumpur Toksik', 'Tongkat Paya', 'Busur Ular Tedung', 'Jantung Hutan Beracun'],
  elektrik: ['Pistol Renjat', 'Bateri Lontar', 'Senapang Arka', 'Tongkat Kilat Kecil', 'Cakera Elektrik', 'Meriam Guruh', 'Senapang Gauss', 'Gegelung Ribut', 'Tombak Petir Biru', 'Mahkota Halilintar'],
  tenaga:   ['Pistol Sinar', 'Penunjuk Laser', 'Senapang Foton', 'Laser Kembar', 'Pistol Ion', 'Meriam Ion', 'Senapang Zarah', 'Pancaran Graviti', 'Laser Orbit', 'Teras Bintang'],
  sokong:   ['Botol Ubat', 'Pistol Vitamin', 'Penyembur Herba', 'Tongkat Doktor', 'Busur Penawar', 'Meriam Ubat', 'Tongkat Teratai', 'Picagari Emas', 'Loceng Penyembuh', 'Pohon Kehidupan'],
  angin:    ['Pistol Angin', 'Kipas Tolak', 'Peniup Daun', 'Pam Angin', 'Senapang Taufan Kecil', 'Kipas Besi', 'Pelontar Puting Beliung', 'Busur Bayu', 'Meriam Udara', 'Senapang Pusaran', 'Tongkat Monsun', 'Bumerang Bayu', 'Panah Badai', 'Ribut Tropika', 'Sayap Rajawali Angin', 'Meriam Taufan', 'Mata Taufan', 'Tombak Angin Utara'],
  bumi:     ['Pelontar Batu', 'Tukul Kayu', 'Penyodok Tanah', 'Lastik Kerikil', 'Tukul Batu', 'Meriam Kerikil', 'Gerudi Tanah', 'Bola Lumpur', 'Tukul Gempa', 'Pelontar Batu Besar', 'Lembing Batu Gunung', 'Gegar Tanah', 'Meriam Pasir', 'Penumbuk Gunung', 'Gada Gunung', 'Tangan Golem', 'Jantung Gunung', 'Gada Teras Bumi'],
  air:      ['Pistol Air', 'Belon Air', 'Penyembur Hos', 'Senapang Buih', 'Meriam Air', 'Busur Ombak', 'Pistol Pancut', 'Lembing Ikan Todak', 'Senapang Gelombang', 'Pelontar Pusaran Air', 'Tongkat Hujan', 'Meriam Buih', 'Busur Pasang Surut', 'Trisula Laut', 'Meriam Ombak Besar', 'Payung Ribut Hujan', 'Mutiara Lautan', 'Tombak Raja Laut'],
  cahaya:   ['Lampu Suluh', 'Pistol Kilau', 'Cermin Kecil', 'Lilin Ajaib', 'Busur Cahaya', 'Tongkat Pelangi', 'Senapang Prisma', 'Pistol Bintang', 'Meriam Suria', 'Tombak Fajar', 'Busur Bulan Sabit', 'Pelita Ajaib', 'Senapang Aurora', 'Lembing Matahari', 'Tongkat Purnama', 'Cermin Suria Agung', 'Matahari Kecil', 'Bintang Pagi Abadi'],
  bayang:   ['Pistol Senja', 'Shuriken Malam', 'Sumpit Bayang', 'Lastik Hitam', 'Kerambit Bayang', 'Busur Gelap', 'Senapang Senyap Malam', 'Cakera Malam', 'Sabit Bayang', 'Panah Gerhana', 'Tongkat Kelawar', 'Senapang Hantu', 'Meriam Kabus Hitam', 'Sabit Gerhana', 'Lembing Malam', 'Busur Burung Hantu', 'Lubang Hitam Mini', 'Mahkota Bayang']
};

// perk: Epik 1 perk; Legenda 1 perk (×1.5); Mitos 1 perk jenis + 1 Kuasa Mitos
const PERK = {
  ganda:   { nama: 'Tembakan Berganda', desc: 'Setiap tembakan ke-4 ×2 damage' },
  boss:    { nama: 'Pemburu Boss',      desc: '+25% damage kepada boss' },
  tembus:  { nama: 'Penembus',          desc: '+2 tembus' },
  kritik:  { nama: 'Kritikal Tajam',    desc: '+10% peluang kritikal' },
  pantas:  { nama: 'Pantas',            desc: '+15% laju tembak' },
  jauh:    { nama: 'Jarak Jauh',        desc: '+20% jarak' },
  udara:   { nama: 'Anti-Udara',        desc: '+50% damage kepada zombie terbang' },
  pecah:   { nama: 'Pemecah Perisai',   desc: 'Abaikan 25% perisai' }
};
const PERK_PILIH = { biasa: ['ganda', 'pantas'], serak: ['tembus', 'pecah'], tepat: ['boss', 'kritik'], letup: ['pecah', 'boss'], lontar: ['tembus', 'udara'], ais: ['jauh', 'boss'], api: ['pantas', 'ganda'], racun: ['jauh', 'pecah'], elektrik: ['udara', 'ganda'], tenaga: ['kritik', 'boss'], sokong: ['pantas', 'jauh'], angin: ['udara', 'pantas'], bumi: ['pecah', 'boss'], air: ['jauh', 'tembus'], cahaya: ['kritik', 'udara'], bayang: ['kritik', 'pecah'] };
const MITOS = {
  meletup:  { nama: 'Letupan Maut',   desc: 'Zombie yang mati meletup (30% damage kawasan)' },
  lantun:   { nama: 'Lantunan',       desc: 'Peluru melantun ke 2 zombie lain' },
  rantai:   { nama: 'Kilat Berantai', desc: '+2 lompatan kilat pada setiap pukulan' },
  beku:     { nama: 'Pembekuan',      desc: '10% peluang beku 1 saat' },
  abadi:    { nama: 'Api Abadi',      desc: 'Bakaran ×2 lebih lama' },
  suci:     { nama: 'Pancaran Suci',  desc: 'Setiap bunuhan pulihkan pagar 0.2%' },
  kembar:   { nama: 'Bayang Kembar',  desc: '20% peluang peluru berganda' },
  gempa:    { nama: 'Gempa',          desc: '10% peluang kaku kawasan 0.8 saat' }
};
const MITOS_PILIH = { biasa: ['kembar'], serak: ['lantun'], tepat: ['lantun'], letup: ['meletup'], lontar: ['kembar'], ais: ['beku'], api: ['abadi'], racun: ['meletup'], elektrik: ['rantai'], tenaga: ['rantai'], sokong: ['suci'], angin: ['lantun', 'kembar'], bumi: ['gempa', 'meletup'], air: ['beku', 'lantun'], cahaya: ['suci', 'rantai'], bayang: ['kembar', 'abadi'] };

// carta elemen: kuat ×1.5, lemah ×0.6 (lemah tidak bertindan dengan sifat kebal yang sedia ada)
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
const ZELEM_SEMUA = ['Hijau', 'Lumut', 'Pucat', 'Busuk', 'Api', 'Ais', 'Racun', 'Elektrik', 'Logam', 'Bayang', 'Kristal', 'Darah', 'Terbang'];


// arketaip dipilih ikut nama (peraturan pertama yang padan); tiada padanan = ralat
const ARK_RULE = {
  biasa:    [[/Pistol/, 'Pistol'], [/SMG|Karbin/, 'SMG'], [/Gatling|Mesingan/, 'Gatling'], [/Senapang/, 'Senapang']],
  serak:    [[/Pelempar|Seribu|Ribut|Petala/, 'Lebar'], [/Pam|Tumpul/, 'Pam'], [/Laras|Kuda|Kaca/, 'Slug']],
  tepat:    [[/Anti|Bintang/, 'Anti-kebal'], [/Senyap|Teropong|Pemburu/, 'Separa'], [/./, 'Bolt']],
  letup:    [[/Roket|Pelancar/, 'Roket'], [/Meriam/, 'Meriam'], [/Mercun|Bom/, 'Bom']],
  lontar:   [[/Lembing|Panah|Busur/, 'Busur'], [/Cakera|Bumerang/, 'Cakera'], [/Kerambit/, 'Bintang'], [/Guli/, 'Lastik']],
  ais:      [[/Meriam|Ribut|Mahkota/, 'Meriam ais'], [/Lembing|Tombak|Busur|Senapang/, 'Lembing ais'], [/Pistol|Penyembur|Bola/, 'Pistol ais']],
  api:      [[/Penyembur/, 'Penyembur'], [/Meriam|Pelontar|Magma/, 'Lava'], [/Obor|Pistol|Panah|Lastik|Sayap/, 'Obor']],
  racun:    [[/Penyembur|Lumpur/, 'Semburan'], [/Botol|Bom|Meriam|Jantung/, 'Kabus'], [/Sumpit|Pistol|Busur|Tongkat/, 'Sumpit']],
  elektrik: [[/Gegelung|Mahkota|Guruh/, 'Gegelung'], [/Gauss|Senapang|Tombak/, 'Gauss'], [/Pistol|Bateri|Tongkat|Cakera/, 'Tongkat']],
  tenaga:   [[/Ion|Zarah/, 'Ion'], [/Pancaran|Penunjuk|Laser|Teras/, 'Pancaran'], [/Pistol|Foton/, 'Denyut']],
  sokong:   [[/Tongkat|Loceng|Pohon|Meriam/, 'Penguat'], [/Botol|Pistol|Penyembur|Busur|Picagari/, 'Penyembuh']],
  angin:    [[/Busur|Panah|Bumerang|Tombak|Sayap/, 'Busur angin'], [/Meriam|Pusaran|Puting|Ribut|Taufan|Monsun/, 'Pusaran'], [/Pistol|Kipas|Peniup|Pam/, 'Peniup']],
  bumi:     [[/Gerudi|Lembing|Tangan/, 'Gerudi'], [/Gempa|Gegar|Penumbuk|Jantung|Gada/, 'Gempa'], [/Pelontar|Tukul|Penyodok|Lastik|Meriam|Bola/, 'Batu']],
  air:      [[/Lembing|Trisula|Tombak|Busur/, 'Lembing air'], [/Meriam|Ombak|Gelombang|Pusaran|Payung|Mutiara|Hujan/, 'Ombak'], [/Pistol|Belon|Penyembur|Senapang/, 'Pancut']],
  cahaya:   [[/Prisma|Pelangi|Cermin|Aurora/, 'Prisma'], [/Pelita|Lilin|Lampu|Purnama/, 'Pelita'], [/Pistol|Busur|Tombak|Lembing|Bintang|Meriam|Matahari/, 'Sinar']],
  bayang:   [[/Sumpit|Tongkat|Mahkota/, 'Sumpahan'], [/Senapang|Meriam|Lubang|Lembing|Panah|Busur/, 'Gelap'], [/Shuriken|Kerambit|Sabit|Cakera|Pistol|Lastik/, 'Bilah']]
};
function arkOf(j, nama) { const r = ARK_RULE[j].find(x => x[0].test(nama)); if (!r) throw new Error('Tiada arketaip untuk ' + nama); const A = ARK[j].find(a => a[0] === r[1]); if (!A) throw new Error('Arketaip tidak wujud ' + r[1]); return A; }

// perk yang tidak masuk akal untuk senjata tertentu ditukar
function perkOk(P, w) { if (P === 'udara' && !w.udara) return false; if (P === 'tembus' && (w.sifat.pierce || 0) >= 99) return false; if (P === 'jauh' && w.range >= 600) return false; return true; }
// bentuk lukisan: ikut nama dahulu, kemudian arketaip (tiada padanan = ralat)
const SHAPE_NAME = [  [/Tukul|Gada|Penumbuk|Penyodok|Tangan Golem/, 'tukul'], [/Lastik/, 'lastik'], [/Busur|Panah/, 'busur'], [/Lembing|Tombak|Trisula/, 'tombak'], [/Meriam/, 'meriam'],
  [/Gatling|Mesingan/, 'gatling'], [/SMG|Karbin/, 'smg'], [/Sniper|Senapang Burung|Senapang Bolt|Senapang Teropong|Senapang Pemburu|Senapang Kayu|Anti-Kebal/, 'sniper'],
  [/Roket|Pelancar|Pelontar Bom/, 'pelancar'], [/Bom|Mercun|Belon|Bola|Bateri/, 'bom'], [/Cakera|Bumerang/, 'cakera'], [/Shuriken|Kerambit/, 'bintang'], [/Sabit/, 'sabit'],
  [/Gegelung/, 'gegelung'], [/Gerudi/, 'gerudi'], [/Kipas/, 'kipas'], [/Sumpit/, 'sumpit'], [/Botol|Picagari/, 'botol'], [/Cermin|Prisma/, 'cermin'],
  [/Obor|Lampu|Lilin|Pelita/, 'obor'], [/Penyembur|Hos|Peniup|Pam Angin/, 'penyembur'], [/Tongkat|Loceng|Payung/, 'tongkat'], [/Pelontar|Pelempar/, 'pelancar'],
  [/Pistol/, 'pistol'], [/Senapang|Laser|Penunjuk/, 'senapang']];
const SHAPE_ARK = { Pistol: 'pistol', SMG: 'smg', Senapang: 'senapang', Gatling: 'gatling', Pam: 'patah', Lebar: 'patah', Slug: 'patah', Bolt: 'sniper', Separa: 'sniper', 'Anti-kebal': 'sniper',
  Bom: 'bom', Roket: 'pelancar', Meriam: 'meriam', Lastik: 'lastik', Cakera: 'cakera', Busur: 'busur', Bintang: 'bintang', 'Pistol ais': 'pistol', 'Meriam ais': 'meriam', 'Lembing ais': 'tombak',
  Obor: 'obor', Penyembur: 'penyembur', Lava: 'meriam', Semburan: 'penyembur', Sumpit: 'sumpit', Kabus: 'bom', Tongkat: 'tongkat', Gegelung: 'gegelung', Gauss: 'senapang', Pancaran: 'senapang',
  Ion: 'senapang', Denyut: 'pistol', Penyembuh: 'botol', Penguat: 'tongkat', Peniup: 'penyembur', Pusaran: 'meriam', 'Busur angin': 'busur', Batu: 'lastik', Gempa: 'tukul', Gerudi: 'gerudi',
  Pancut: 'pistol', Ombak: 'meriam', 'Lembing air': 'tombak', Sinar: 'senapang', Pelita: 'obor', Prisma: 'cermin', Bilah: 'bintang', Gelap: 'senapang', Sumpahan: 'tongkat' };
function shapeOf(nama, ark, rar) { if (rar === 4) return 'mitos'; if (/^Senapang/.test(nama) && SHAPE_ARK[ark] === 'patah') return 'patah'; const r = SHAPE_NAME.find(x => x[0].test(nama)); if (r) return r[1]; if (SHAPE_ARK[ark]) return SHAPE_ARK[ark]; throw new Error('Tiada bentuk untuk ' + nama); }
const LARAS = { pistol: 14, smg: 18, senapang: 22, gatling: 22, patah: 20, sniper: 26, pelancar: 24, meriam: 22, bom: 10, lastik: 12, cakera: 10, busur: 14, bintang: 8, tongkat: 18, penyembur: 18, gegelung: 16, tukul: 14, tombak: 24, kipas: 12, sabit: 14, obor: 14, cermin: 12, gerudi: 18, sumpit: 24, botol: 10, mitos: 20 };
const WARNA = { biasa: ['#FFD54A', '#FFC36A', '#FFE07A'], serak: ['#FF9EC8', '#FFB070'], tepat: ['#B6F27A', '#D8FFB0'], letup: ['#FF8A3A', '#FFB04A'], lontar: ['#D8DDE6', '#C9A06A'], ais: ['#9FE6FF', '#CFF4FF'],
  api: ['#FF6A2B', '#FFB04A'], racun: ['#A6F05A', '#7AD050'], elektrik: ['#FFF27A', '#9AE0FF'], tenaga: ['#FF4FD8', '#7AF0FF'], sokong: ['#7FF0C8', '#B8FFD8'],
  angin: ['#C8F4F0', '#9AE8E0'], bumi: ['#C8A070', '#A88A5A'], air: ['#5AB8FF', '#8AD8FF'], cahaya: ['#FFF2A0', '#FFFFFF'], bayang: ['#A070E0', '#6A4AA0'] };
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
function power(w) { // kuasa berkesan (sama cara dengan bot imbangan)
  const s = w.sifat; return w.dmg * w.rate * (s.n || 1) * (1 + Math.min(3, (s.pierce || 1) - 1) * 0.3) * (s.splash ? 1.8 : 1) * (s.chain ? 1 + s.chain * 0.4 : 1);
}
function build() {
  const out = [];
  for (const j of Object.keys(JENIS)) {
    const split = JENIS[j].baru ? SPLIT_BARU : SPLIT_LAMA, names = NAMA[j], ark = ARK[j]; let i = 0;
    split.forEach((cnt, r) => { for (let k = 0; k < cnt; k++, i++) {
      const A = arkOf(j, names[i]), sifat = Object.assign({}, A[4]), d = !!sifat.d; delete sifat.d;
      const w = { id: 'w_' + slug(names[i]), nama: names[i], jenis: j, rar: r, rarNama: RAR[r], dmgJenis: JENIS_DMG[j], elemen: JENIS[j].el, arketaip: A[0],
        dmg: Math.round(A[1] * RAR_K[r] * 10) / 10, rate: A[2], range: A[3], udara: !d, sifat, perk: [], kelas: JENIS[j].kelas };
      if (r >= 2) { const opts = PERK_PILIH[j]; let P = opts[(k + i) % 2]; if (!perkOk(P, w)) P = opts[(k + i + 1) % 2]; if (!perkOk(P, w)) P = 'boss'; w.perk.push({ id: P, kuat: r === 3 ? 1.5 : 1 }); }
      if (r === 4) { const M = MITOS_PILIH[j][k % MITOS_PILIH[j].length]; w.perk.push({ id: 'mitos_' + M, kuat: 1 }); }
      w.bentuk = shapeOf(names[i], A[0], r); w.laras = LARAS[w.bentuk]; w.warna = WARNA[j][r % WARNA[j].length];
      w.kuasa = Math.round(power(w) * 10) / 10; out.push(w);
    } });
  }
  return out;
}
module.exports = { LARAS, WARNA, PERK_PILIH, MITOS_PILIH, RAR, RAR_K, JENIS, KELAS, ARK, NAMA, PERK, MITOS, ELEMEN, ZELEM_SEMUA, SPLIT_LAMA, SPLIT_BARU, build };
