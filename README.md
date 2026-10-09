# 🧟 Zombi Comel

Game idle pertahanan zombie comel dalam **satu fail HTML** — boleh dimain di pelayar dan **dipasang di telefon** sebagai aplikasi (PWA), termasuk tanpa internet.

**22 hero · 32 senjata · 1000 spesies zombie · 50 pagar · 9 kuasa · 195 trofi · 50 latar · 6 cabaran**

---

## 📁 Struktur folder

```
zombi-comel/
├── src/                  ← KOD SUMBER (edit di sini)
│   ├── head.html         ← HTML + CSS (bahagian atas fail)
│   ├── logic.js          ← logik game (tiada DOM, boleh diuji)
│   └── ui/               ← paparan, lukisan, bunyi, kawalan (11 modul: 01-permulaan.js … 11-v7-skrin…js)
│                           digabung mengikut susunan nama fail; jangan ubah nombor di depan
├── public/               ← fail PWA
│   ├── manifest.webmanifest
│   ├── sw.js             ← service worker (main tanpa internet)
│   └── icons/            ← ikon aplikasi
├── tools/build.js        ← cantum src/ + public/ → docs/
├── docs/                 ← HASIL BINAAN (inilah yang dihidangkan GitHub Pages)
│   ├── index.html
│   ├── manifest.webmanifest, sw.js, icons/
├── test/
│   ├── unit.test.js      ← 166 ujian logik
│   ├── smoke-v3.test.js  ← ujian UI asas
│   ├── smoke-v4.test.js  ← ujian UI penuh
│   └── balance.js        ← simulasi keseimbangan
├── .github/workflows/test.yml ← GitHub jalankan ujian setiap commit
├── package.json
├── CHANGELOG.md
└── README.md
```

> **Peraturan emas:** `src/` ialah sumber sebenar. `docs/` dijana semula oleh `npm run build` — jangan edit `docs/index.html` dengan tangan.

---

## 🚀 Langkah 1 — Muat naik ke GitHub (melalui pelayar)

1. Log masuk GitHub → **New repository** → nama: `zombi-comel` → **Public** → *Create repository*.
2. Tekan **uploading an existing file** (atau *Add file → Upload files*).
3. Buka zip ini di komputer, kemudian **seret semua kandungan folder `zombi-comel/`** ke halaman muat naik → **Commit changes**.
4. ⚠️ Folder bertitik (`.github`) kadang-kadang tidak ikut diseret. Jika tiada selepas muat naik: *Add file → Create new file* → nama `.github/workflows/test.yml` → tampal isi fail itu → Commit.

## 🌐 Langkah 2 — Hidupkan GitHub Pages

1. Dalam repo: **Settings → Pages**.
2. *Build and deployment* → **Source: Deploy from a branch**.
3. **Branch: `main`**, folder: **`/docs`** → **Save**.
4. Tunggu 1–2 minit. Game akan berada di:
   `https://<nama-akaun>.github.io/zombi-comel/`

## 📱 Langkah 3 — Pasang di telefon

**Android (Chrome):** buka pautan di atas → menu **⋮** → **Pasang aplikasi / Install app** (atau *Tambah ke skrin utama*).

**iPhone/iPad (Safari sahaja):** buka pautan → butang **Kongsi** ⬆ → **Tambah ke Skrin Utama**.

Selepas dipasang: ikon zombie bermahkota muncul di skrin utama, game dibuka skrin penuh, dan boleh dimain **tanpa internet** selepas kali pertama dibuka.


## 📱 Muat naik dari telefon sahaja (tanpa komputer)

Folder `telefon/` ialah versi **rata** (tiada folder dalam folder) supaya mudah dimuat naik melalui Chrome di telefon.
Bina semula dengan `npm run build:telefon`. Dalam Settings → Pages, pilih folder **`/ (root)`** dan salin 8 fail dalam `telefon/` ke akar repo.

## 💾 Pindah progress dari versi Claude

Progress disimpan **ikut laman**. Versi GitHub bermula kosong. Untuk pindah:
1. Dalam versi lama: **Lagi → Tetapan & Info → Eksport** → salin kod `ZC5:...`
2. Dalam versi GitHub/aplikasi: tampal kod → **Import**.

---

## 🔁 Aliran kerja kemas kini

1. Dapatkan fail `src/` baharu (dan `docs/` yang sudah dibina) daripada Claude.
2. GitHub → buka fail → ✏️ / *Upload files* → ganti → **Commit**.
3. Tab **Actions** akan menjalankan ujian — ✅ hijau bermaksud selamat.
4. Pages dikemas kini automatik dalam 1–2 minit.
5. Dalam game, butang **"Versi baharu sedia. Tekan untuk muat semula"** akan muncul.

## 🧪 Untuk pembangunan di komputer (pilihan)

Perlu [Node.js](https://nodejs.org) 18 ke atas. Tiada pakej tambahan diperlukan.

```bash
npm test            # semak sintaks + bina + semua ujian
npm run build       # bina docs/ sahaja
npm run balance     # simulasi keseimbangan
cd docs && python3 -m http.server 8000   # cuba di http://localhost:8000
```

> Service worker hanya aktif di **HTTPS** (GitHub Pages). Di `localhost` game tetap berfungsi, cuma tanpa mod offline.

---

## 🎧 Ujian bunyi (pilihan)

```
npm i --no-save node-web-audio-api
npm run test:audio
```
Menjana setiap bunyi ke memori dan memeriksa ia tidak senyap, tidak pecah dan tempohnya munasabah. Sama ada bunyi itu *sedap* didengar perlu dinilai dengan telinga di **Ensiklopedia → 🎧 Bunyi**.

## 🎞 Menggantikan sprite dengan seni PNG (pilihan masa depan)

Badan zombie kini dilukis sekali ke **atlas sprite** (8 bingkai berjalan mendatar) dan disalin setiap bingkai.
Untuk menggunakan seni PNG sendiri, daftarkan sprite sheet dengan format yang sama:

```js
// bingkai mendatar; fw×fh setiap bingkai; ax, ay = titik tengah kaki; saiz rujukan jejari zombie 22 px
ZC_registerSprite('zombie:biasa', 'sprites/zombie-biasa.png', 80, 90, 8, 40, 50);
```

Jenis: `biasa`, `gemuk`, `laju`, `topi`, `kesatria`, `peludah`, `beku`, `hantu`, `pengebom`, `penyembuh`, `melompat`, `gergasi`.
Jika PNG gagal dimuat, game kembali kepada sprite yang dilukis sendiri.

## 🏪 Play Store? (pilihan masa depan)

PWA ini boleh dibungkus menjadi aplikasi Android menggunakan alat seperti **PWABuilder** (pwabuilder.com). Penerbitan di Google Play memerlukan akaun pembangun berbayar — semak syarat & yuran terkini di laman rasmi Google Play Console sebelum bermula.

## 📜 Lesen

Belum ditetapkan. Jika mahu kongsi secara terbuka, pertimbangkan lesen seperti MIT.
