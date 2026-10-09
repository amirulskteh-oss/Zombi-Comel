# 📱 Panduan Google Play — Zombi Comel (TWA via PWABuilder)

> Tag keyakinan: [PASTI] = daripada dokumen rasmi · [MUNGKIN] = amalan biasa, belum disahkan pada akaun anda · [SEMAK] = sahkan sendiri kerana antara muka boleh berubah

## A. Sebelum mula
1. **Isi e-mel** dalam `public/privasi.html` (2 tempat: `[EMEL ANDA DI SINI]` dan `[YOUR EMAIL HERE]`). Play Console memerlukan polisi privasi kerana game ini sesuai untuk kanak-kanak. [PASTI]
2. Muat naik repo utama seperti biasa. Selepas 1–2 minit, semak:
   - `https://amirulskteh-oss.github.io/Zombi-Comel/` → game **tanpa trainer**, penanda **"Versi 7.9 (binaan Google Play)"**
   - `https://amirulskteh-oss.github.io/Zombi-Comel/dev/` → game **dengan trainer**, save berasingan (untuk anda sahaja)
   - `https://amirulskteh-oss.github.io/Zombi-Comel/privasi.html` → polisi privasi

## B. Repo akar (wajib untuk skrin penuh)
Fail `assetlinks.json` mesti berada di **akar domain** (`/.well-known/assetlinks.json`), bukan dalam `/Zombi-Comel/`. [PASTI]
1. GitHub → **New repository** → nama tepat: `amirulskteh-oss.github.io` → **Public** → Create.
2. **Add file → Create new file** (lebih selamat daripada seret folder bertitik dari telefon) [MUNGKIN]:
   - nama `.nojekyll` → kosong → Commit. *(Tanpa fail ini GitHub Pages mungkin mengabaikan folder `.well-known`.)* [MUNGKIN]
   - nama `index.html` → salin dari `repo-akar/index.html` → Commit.
3. **Settings → Pages** → Deploy from a branch → `main` / `(root)` → Save.
4. `.well-known/assetlinks.json` dibuat di langkah D (perlu cap jari kunci dahulu).

## C. Akaun Play Console
- Daftar akaun **peribadi** atas nama anda. Jangan guna nama/logo SK Teh atau KPM tanpa kebenaran rasmi.
- Yuran: [SEMAK] pada halaman pendaftaran (dijangka bayaran sekali sahaja).
- Akaun peribadi baharu: **ujian tertutup dengan ≥ 12 penguji, 14 hari berterusan** sebelum boleh mohon produksi. [PASTI] Rekrut 15–20 guru sebagai penimbal.

## D. Jana aplikasi dengan PWABuilder
1. Buka `https://www.pwabuilder.com` → masukkan `https://amirulskteh-oss.github.io/Zombi-Comel/` → **Package for stores → Android → Google Play**. [SEMAK nama butang]
2. Tetapan yang dicadangkan:
   - **Package ID:** `io.github.amirulsktehoss.zombicomel` (*kekal selama-lamanya; tiada tanda sempang*)
   - **App name:** Zombi Comel · **Launcher name:** Zombi Comel
   - **Version code:** 1 · **Version name:** 7.9
   - **Display:** standalone (atau fullscreen jika mahu sorok bar status)
   - **Orientation:** portrait
   - **Signing key:** *Create new*
3. Muat turun zip. Di dalamnya ada fail **.aab** (untuk Play), **signing.keystore** + **signing-key-info.txt** dan **assetlinks.json**. [MUNGKIN]
4. ⚠️ **Simpan `signing.keystore` dan kata laluannya di 2 tempat selamat** (contohnya Google Drive + pemacu USB). Tanpanya anda tidak boleh mengemas kini aplikasi dengan mudah.
5. ⚠️ [SEMAK] Pastikan aplikasi yang dijana **menyasarkan Android 16 (API 36)**. Play mewajibkan ini untuk aplikasi baharu. Jika Play Console menolak kerana API, jana semula dengan versi PWABuilder terkini.

## E. Cap jari kunci → assetlinks.json
Dengan *Play App Signing*, Google menandatangani semula aplikasi menggunakan kunci mereka. Oleh itu assetlinks.json perlu **DUA** cap jari: [MUNGKIN — ini punca biasa bar URL muncul]
1. Play Console → buat aplikasi → **Ujian tertutup** → muat naik `.aab`.
2. **Test and release → App integrity → App signing** [SEMAK lokasi menu] → salin **SHA-256** "App signing key certificate" dan "Upload key certificate".
3. Dalam repo akar: **Create new file** → nama `.well-known/assetlinks.json` → tampal kandungan `repo-akar/.well-known/assetlinks.json` → gantikan kedua-dua `GANTI_...` dengan cap jari tadi (format `AB:CD:...`) → Commit.
4. Semak `https://amirulskteh-oss.github.io/.well-known/assetlinks.json` memaparkan JSON.

## F. Uji di telefon
- Pasang daripada pautan ujian tertutup. Aplikasi patut dibuka **skrin penuh tanpa bar URL**.
- Jika bar URL muncul → cap jari atau package name dalam assetlinks.json tidak sepadan.
- Kemas kini game selepas ini: **push ke GitHub seperti biasa**, tanpa muat naik ke Play. Hanya pembungkus Android (sekitar setahun sekali untuk tahap API baharu) perlu dimuat naik semula.

## G. Borang Play Console (ringkas)
- **Polisi privasi:** `https://amirulskteh-oss.github.io/Zombi-Comel/privasi.html`
- **Keselamatan data:** tiada data dikumpul, tiada data dikongsi.
- **Iklan:** tiada. **Pembelian dalam aplikasi:** ADA (lihat bahagian H).
- **Sasaran umur:** jika termasuk kanak-kanak → Polisi Families terpakai. [PASTI]
- **Penilaian kandungan:** isi soal selidik IARC dengan jujur (keganasan kartun: zombie comel ditumpaskan).
- **Akses aplikasi:** tiada log masuk.

## H. Pembelian dalam aplikasi (v8.0)
**Produk** — Play Console → *Monetize → Products → In-app products* → cipta 5 produk (v9.16 menambah `tangan_pembantu`). **ID mesti sama tepat** dengan kod: [PASTI dalam kod game]

| Product ID | Nama | Harga |
|---|---|---|
| `penyokong` | Pek Penyokong | RM 3.90 |
| `gems_300` | Pek Gems Kecil | RM 3.90 |
| `gems_850` | Pek Gems Sederhana | RM 9.90 |
| `gems_1800` | Pek Gems Besar | RM 19.90 |
| `tangan_pembantu` | Tangan Pembantu (tekan automatik) | RM 19.90 |

**Akaun pembayaran (merchant)** — wajib dihubungkan dengan akaun pembangun sebelum boleh menjual. [PASTI] Sahkan Malaysia disokong & kadar yuran Google semasa mendaftar. [SEMAK]

**Pembungkus mesti hidupkan Play Billing** — dokumentasi Chrome: Bubblewrap ≥ 1.8.2, dalam `twa-manifest.json` hidupkan `features.playBilling.enabled` **dan** `alphaDependencies.enabled`, kemudian `bubblewrap update` + `bubblewrap build`. [PASTI]
- [SEMAK] Jika PWABuilder tiada pilihan Play Billing, gunakan Bubblewrap di komputer (perlu Node.js; Bubblewrap memasang JDK & Android SDK sendiri). Saya boleh sediakan arahan langkah demi langkah.

**Tanpa pelayan — cara game mengakui pembelian (v9.16)**
- Produk **gems** di-`consume()` sebaik sahaja ganjaran disimpan (boleh dibeli berulang). [PASTI dalam kod game]
- Produk **sekali beli** (`penyokong`, `tangan_pembantu`) **TIDAK di-consume**, supaya Google Play mengingat pemiliknya dan `listPurchases()` memulihkannya selepas nyahpasang / telefon baharu. Jika API ada `acknowledge()`, game memanggilnya. [PASTI dalam kod game]
- Pembelian yang tidak diakui dipulangkan wang oleh Google selepas 3 hari. [PASTI] **[SEMAK — WAJIB dalam ujian tertutup]**: beli Tangan Pembantu dengan akaun penguji lesen, tunggu > 3 hari, pastikan ia TIDAK dipulangkan dan masih muncul selepas pasang semula. Saya tidak pasti sama ada Digital Goods API v2 mengakui pembelian secara automatik; jika ia dipulangkan, beritahu saya — penyelesaiannya ialah consume selepas simpan (seperti sebelum v9.16) dan bergantung pada Eksport kod save.
- Pek Penyokong yang dibeli **sebelum v9.16** sudah di-consume — ia tidak boleh dipulihkan oleh Google; ia kekal dalam save sahaja.
- Butang *Padam progress* tidak lagi memadam Penyokong / Tangan Pembantu.
- [MUNGKIN] Tanpa pengesahan pelayan, pemain yang mahir boleh mengubah save sendiri — risiko kecil untuk game pemain tunggal.

**Uji pembelian (WAJIB sebelum lancar)**
1. Play Console → *Settings → License testing* → tambah e-mel Gmail anda & 2–3 guru penguji. [SEMAK lokasi menu]
2. Pasang daripada pautan ujian tertutup. Pembeli penguji lesen **tidak dicaj**.
3. Senarai semak: harga RM dipaparkan · jawapan salah membatalkan · beli 300 gems → gems bertambah sekali · batal di skrin Google → tiada perubahan · beli Pek Penyokong → ❤ + kostum + slot ekspedisi ke-4 · **tunggu 3 hari → pastikan tiada bayaran balik automatik** (bukti consume berfungsi).

**Negara** — *Production → Countries/regions* → **keluarkan Belgium** (peti rawak dianggap perjudian di sana sejak 2019; status terkini [SEMAK]).

**Borang yang berubah**
- **Penilaian kandungan (IARC):** jawab **YA** untuk pembelian digital dan item rawak yang boleh dibeli secara tidak langsung (gems → peti).
- **Keselamatan data:** pembayaran diproses Google; aplikasi hanya menyimpan token pembelian dalam peranti (tidak dihantar).
- **Polisi privasi:** sudah dikemas kini (bahagian 3a).
- **Polisi Families:** pastikan pintu ibu bapa kekal, tiada tawaran mendesak, kadar peti dipaparkan.
