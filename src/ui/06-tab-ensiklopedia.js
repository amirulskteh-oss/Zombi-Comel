  // ---------- tab ENSIKLOPEDIA ----------
  let encMode = 'zombie', encPage = 0, encFilter = 'semua', encBase = '', encQuery = '', encSig = '';
  const ENC_PER = 24;
  function seenCount() { return (save.seenZ.match(/1/g) || []).length; }
  function encList() {
    const q = encQuery.trim().toLowerCase();
    return SPECIES.filter(sp => { const seen = save.seenZ[sp.id] === '1';
      if (encFilter === 'ditemui' && !seen) return false; if (encFilter === 'belum' && seen) return false;
      if (encBase && sp.base !== encBase) return false; if (q && !(seen && sp.nama.toLowerCase().includes(q))) return false; return true; });
  }
  function bossIconHD(c, F, tier, elem, dark) { c.fillStyle = '#2B3340'; rr(c, 2, 2, 60, 60, 12); c.fill(); const z = { id: 1, type: 'boss', bossKind: F.id, x: 32, y: 36, r: 15, hp: 1, maxHp: 1, warna: dark ? '#4A5260' : F.warna, traits: [], wob: .8, evo: 0, slowT: 0, burnT: 0, hitT: 0, atkAnim: 0, gear: 'tiada', btier: tier, belem: elem }; const o = ctx; ctx = c; drawZombie(z); ctx = o; if (dark) { c.fillStyle = 'rgba(20,26,36,.55)'; rr(c, 2, 2, 60, 60, 12); c.fill(); label(c, '?', 32, 40, 22, '#FFFFFF'); } }
  function buildEnc() {
    const sig = encMode + encPage + encFilter + encBase + encQuery + '|' + (encMode === 'zombie' ? seenCount() : JSON.stringify(save.stars) + Object.keys(save.heroes).length + '|' + Object.keys(save.weapons).length + save.wallsOwned + Object.keys(save.powers).length + save.best) + '|' + (save.bossDex || '');
    if (sig === encSig) return; encSig = sig;
    ['hero', 'zombie', 'boss', 'senjata', 'pagar', 'item', 'kostum', 'kuasa', 'sifat', 'tier', 'latar', 'kedai', 'bunyi'].forEach(m => $('enc_' + m).setAttribute('aria-pressed', encMode === m));
    $('encZTools').hidden = encMode !== 'zombie';
    const box = $('encList'); box.innerHTML = '';
    const box0 = $('encList');
    if (encMode !== 'hero' && encMode !== 'zombie') { box0.innerHTML = ''; const box = box0;
    // ---------- bahagian ensiklopedia lain ----------
    if (encMode !== 'zombie') { $('encPager').hidden = true; }
    const card = (iconFn, size, title, html, locked) => {
      const el = document.createElement('div'); el.className = 'card enc' + (locked ? ' locked' : '');
      el.innerHTML = (iconFn ? '<canvas class="ico" aria-hidden="true"></canvas>' : '') + '<div class="info"><h3>' + title + '</h3>' + html + '</div>';
      if (iconFn) paintIcon(el.querySelector('canvas'), iconFn, size || 56);
      box.appendChild(el); return el;
    };
    const sec = txt => { const h = document.createElement('h3'); h.className = 'sec'; h.textContent = txt; box.appendChild(h); };
    if (encMode === 'boss') {
      const seen = bossDexCount(save, 1), won = bossDexCount(save, 2);
      $('encInfo').textContent = '👁 Ditemui ' + seen + '/' + BOSS_TOTAL + ' · 🏆 Ditewaskan ' + won + '/' + BOSS_TOTAL;
      card(null, 0, 'Koleksi 360 boss istimewa', '<p>15 bentuk × 6 elemen × 4 tahap. Boss setiap stage bertukar setiap hari dan ikut mod. <b>Serbuan Boss</b> mingguan (tab Arena) memilih boss yang belum ditewaskan.</p><div class="bxbar"><span style="width:' + (won / BOSS_TOTAL * 100).toFixed(1) + '%"></span></div><p class="muted">' + BOSS_ELEMS.map(e => e.ikon + ' ' + e.nama + ': ' + e.desc).join(' · ') + '</p><p class="muted">' + BOSS_TIERS.map(t => t.bin + ' ' + t.nama).join(' → ') + '</p>');
      card(null, 0, 'Carta elemen', '<p class="muted">Setiap jenis senjata ada elemen. <b class="ku">Kuat ×1.5</b> · <b class="le">Lemah ×0.6</b>. Di medan muncul teks KUAT! atau LEMAH. Zombie basah: ⚡ Elektrik ×1.5, 🔥 Api ×0.7 (jumlah dihadkan ×0.5–×2).</p><div class="trgrid">' + ELEMEN_ORDER.map(e => { const E = ELEMEN[e], js = Object.keys(FAM_EL).filter(f => FAM_EL[f] === e).map(f => FAM[f].ikon + ' ' + FAM[f].nama).join(', ');
        return '<div class="trk"><div class="trh"><span class="tri">' + E.ikon + '</span><b>' + E.nama + '</b></div><p class="muted">' + js + '</p>' + (E.kuat.length ? '<span class="trl">Kuat: ' + E.kuat.map(z => ZEL_IKON[z] + ' ' + z).join(', ') + '</span>' : '<span class="trl o">Neutral — tiada kuat/lemah</span>') + (E.lemah.length ? '<span class="trl le">Lemah: ' + E.lemah.map(z => ZEL_IKON[z] + ' ' + z).join(', ') + '</span>' : '') + '</div>'; }).join('') + '</div><p class="muted" style="margin-top:6px"><b>Lawan zombie:</b> ' + ZEL_ORDER.map(z => ZEL_IKON[z] + ' ' + z + ' → ' + elemCounters(z).map(e => ELEMEN[e].ikon).join('')).join(' · ') + '</p>');
      card(null, 0, '18 sifat boss', '<div class="trgrid">' + BTRAIT_ORDER.map(k => '<div class="trk"><div class="trh"><span class="tri">' + BTRAIT[k].ikon + '</span><b>' + esc(BTRAIT[k].nama) + '</b></div><p>' + esc(BTRAIT[k].desc) + '</p><span class="trl">💡 ' + esc(BTRAIT[k].lawan) + '</span></div>').join('') + '</div><p class="muted">Kebal: −95% dalam mod Normal, −100% dalam mod Hard ke atas. Bilangan sifat: ★ 1 · ★★ 1 · ★★★ 2 · 👑 3. Tiada boss kebal Fizikal dan Magis serentak.</p>');
      BOSS_FORMS.forEach((F, fi) => { let fw = 0, fs = 0; let grid = '<div class="bxgrid"><span></span>' + BOSS_TIERS.map(t => '<span class="bxh">' + t.bin + '</span>').join('');
        BOSS_ELEMS.forEach((E, ei) => { grid += '<span class="bxh">' + E.ikon + '</span>'; BOSS_TIERS.forEach((T, ti) => { const id = fi * 24 + ei * 4 + ti, st = bossDexGet(save, id); if (st >= 1) fs++; if (st >= 2) fw++; grid += '<span class="bx s' + st + '" style="' + (st ? '--bc:' + E.warna : '') + '" title="' + esc(st ? bossById(id).nama : '???') + '">' + (st >= 2 ? '✓' : st ? '•' : '?') + '</span>'; }); });
        grid += '</div>';
        card(c => bossIconHD(c, F, fs ? 3 : 0, fs ? 'emas' : null, !fs), 56, esc(F.nama) + ' <span class="lv">' + fw + '/24</span>', (fs ? '<p>' + esc(F.desc) + '</p><p class="st">Sifat tetap: ' + BTRAIT[BOSS_SIG[F.id]].ikon + ' ' + BTRAIT[BOSS_SIG[F.id]].nama + ' · ⚠ Fasa 2: ' + esc(F.f2) + (F.ranged ? ' · 🎯 jarak jauh' : '') + '</p>' : '<p class="muted">Belum ditemui. Teruskan bermain untuk berjumpa boss ini.</p>') + grid, !fs); });
      return;
    }
    if (encMode === 'senjata') {
      $('encInfo').textContent = Object.keys(save.weapons).length + '/' + WEAPON_ORDER.length + ' dimiliki';
      WEAPON_ORDER.forEach(id => {
        const w = WEAPONS[id], owner = HERO_ORDER.find(h => HEROES[h].wpn === id), ciri = [];
        if (w.n > 1) ciri.push(w.n + ' peluru serentak'); if (w.pierce > 1) ciri.push(w.pierce >= 99 ? 'tembus semua' : 'tembus ' + w.pierce); if (w.splash) ciri.push('letupan ' + w.splash + 'px');
        if (w.chain) ciri.push('kilat ke ' + w.chain); if (w.slow) ciri.push('perlahan ' + Math.round(w.slow * 100) + '%'); if (w.burn) ciri.push('bakar/racun'); if (w.heal) ciri.push('baiki pagar'); if (w.homing) ciri.push('mengejar sasaran'); if (w.critB) ciri.push('+' + Math.round(w.critB * 100) + '% kritikal');
        card(c => weaponIcon(c, id), 56, esc(w.nama) + (save.weapons[id] ? ' <span class="lv">Lv.' + save.weapons[id] + '</span>' : ''),
          '<p>' + esc(w.desc) + '.</p><p class="st">Damage ' + w.dmg + ' · ' + w.rate + ' tembakan/s · jarak ' + w.range + '</p><p>' + (ciri.length ? '<b>Ciri:</b> ' + ciri.join(', ') : '<span class="muted">Tiada ciri khas</span>') + '</p><p class="muted">' + (owner ? 'Senjata khas ' + esc(HEROES[owner].nama) + ' (dapat bila hero dibina)' : '') + (w.harga ? (owner ? ' atau ' : '') + 'Dibeli dengan ' + w.harga + ' gems' : '') + '</p>', !save.weapons[id]);
      });
      return;
    }
    if (encMode === 'pagar') {
      $('encInfo').textContent = save.wallsOwned + '/50 dibina';
      card(null, 0, 'Cara pagar berfungsi', '<p>Zombie menyerang pagar. Bila HP pagar habis, pertempuran kalah. HP pagar = 100 × Pagar Besi (×1.15 setiap level) × jenis pagar × item perisai.</p><p><b>Perisai</b> mengurangkan damage (maksimum 50%). <b>Duri</b> mencederakan zombie yang menyerang. <b>Pulih</b> membaiki pagar setiap saat.</p><p>Gred: Asas → Kukuh (paku besi) → Berduri → Pemulih (+) → Agung (mahkota).</p>');
      sec('Menara pagar'); TOWER_ORDER.forEach(t => card(c => towerIcon(c, t), 48, esc(TOWERS[t].nama), '<p>' + esc(TOWERS[t].desc) + '.' + (TOWERS[t].stage ? ' <b>Dibuka di stage ' + TOWERS[t].stage + (towerUnlocked(save, t) ? ' ✔' : ' 🔒') + '</b>.' : '') + (TOWERS[t].heal ? ' Membaiki ' + (TOWERS[t].heal * 100).toFixed(1) + '% HP pagar sesaat (naik ikut level).' : '') + '<br>Cabang: ' + TOWER_BRANCH[t].map(x => x.map(y => y.nama).join(' / ')).join(' · ') + '.</p><p class="muted">' + (TOWERS[t].heal ? 'Tidak menembak.' : 'Kuasa ' + TOWERS[t].mult + '× daripada 25% purata damage hero, ' + TOWERS[t].rate + ' tembakan/s, jarak ' + TOWERS[t].range + '.') + '</p><p class="muted">3 slot di atas pagar. Bina: 800 / 8K / 80K gold. Level tiada had.</p>'));
      sec('50 jenis pagar');
      WALLS.forEach((w, k) => card(c => wallIcon(c, k), 48, (k + 1) + '. ' + esc(w.nama), '<p>' + esc(wallDesc(w)) + '</p><p class="muted">Kos bina: ' + (k ? fmt(wallCost(k)) + ' gold' : 'percuma') + '</p>', k >= save.wallsOwned));
      return;
    }
    if (encMode === 'item') {
      $('encInfo').textContent = save.items.length + ' item dalam beg';
      sec('3 jenis item');
      [['senjata', 'Slot hero. +% damage; Epik ke atas juga +% kritikal.'], ['helm', 'Slot hero. +% peluang kritikal & +% damage kritikal.'], ['baju', 'Slot hero. +% HP pagar (setiap hero dalam pasukan menyumbang).'], ['tangan', 'Slot hero. +% laju tembak.'], ['but', 'Slot hero. +% gold.'], ['beg', 'Slot hero. +% peluang item & shard jatuh (jumlah pasukan, had +200%).'], ['xaksesori', 'Dipasang pada hero. Menambah kelajuan tembak dan % gold yang dikutip.'], ['perisai', 'Dipasang pada pagar (3 slot). Menambah HP pagar dan perisai; tahap Legenda ke atas memberi pemulihan, Mitos ke atas memberi duri.']]
        .filter(([j]) => ITEM_JENIS.includes(j)).forEach(([j, d]) => card(c => { iconBg(c, '#EEF2F8', '#8C9AB0'); itemGlyph(c, 32, 32, 2.2, j, '#5A6CF0'); }, 48, SLOT_NAMA[j], '<p>' + d + '</p>'));
      card(null, 0, 'Stat hero', '<p><b>Damage</b>, <b>Laju</b>, <b>Kritikal</b> & <b>Damage kritikal</b> (asas ×2). <b>Damage boss</b>: tambahan kepada boss. <b>Tembus perisai</b>: zombie berperisai biasanya menahan 35% damage. <b>Ketepatan</b>: zombie hantu biasanya mengelak 25% tembakan. <b>⚡ Kuasa Tempur</b> menggabungkan semuanya.</p><p><b>Stat sampingan ◆</b>: item Legenda dapat 1, Mitos & Purba 2, Dewa ke atas 3 stat rawak (damage boss, tembus, ketepatan, damage kritikal, damage, laju, gold, peluang jatuh). Naik ikut level item.</p>');
      card(null, 0, 'Bonus set', '<p>Pakai 6 item hero <b>Epik (T4) ke atas</b> pada seorang hero → <b>+10% damage</b>.</p><p>Satu senjata (Pistol, Tukul…) hanya boleh dipegang oleh seorang hero. Memilih senjata hero lain menukar senjata antara mereka.</p>');
      sec('Kadar tahap item (T1 → T10)');
      { const src = [['Zombie', 0], ['Evolusi I', 1], ['Evolusi II', 2], ['Evolusi III', 3], ['Boss', 3], ['Boss besar', 4]].concat(Object.keys(CHESTS).map(k => [CHESTS[k].nama, CHESTS[k].minRar])), dists = src.map(s => rarityDist(s[1], save.shop.luck));
        const el = document.createElement('div'); el.className = 'card enc rtab'; el.innerHTML = '<div class="info"><p class="muted">Peluang zombie biasa menjatuhkan item: ' + pctTxt(ITEM_DROP_BASE + 0.002 * save.shop.luck) + ' (evolusi +25% setiap peringkat, booster ×3, beg pasukan +' + Math.round(teamBagDrop(save)) + '%). Boss sentiasa menjatuhkan item.</p><div class="tscroll"><table><tr><th>Tahap</th>' + src.map(s => '<th>' + esc(s[0]) + '</th>').join('') + '</tr>' + RARITY.map((r, i) => '<tr><td style="color:' + r.warna + '"><b>T' + (i + 1) + '</b> ' + r.nama + '</td>' + dists.map(d => '<td>' + (d[i] > 0 ? pctTxt(d[i]) : '–') + '</td>').join('') + '</tr>').join('') + '</table></div><p class="muted">Jenis item: ' + ITEM_JENIS.map((j, i) => SLOT_NAMA[j] + ' ' + JENIS_W[i] + '%').join(' · ') + '</p></div>'; box.appendChild(el); }
      card(null, 0, 'Tempa & jual', '<p><b>Tempa</b> menaikkan level item tanpa had (+7% kuasa setiap level). <b>Jual</b> menukar item kepada gold. Beg memuatkan ' + INV_CAP + ' item; item berlebihan dijual automatik.</p><p>Item jatuh daripada zombie (lebih kerap daripada zombie berevolusi), boss (sekurang-kurangnya Jarang) dan peti.</p>');
      sec('10 tahap kejarangan');
      const tot = RARITY.reduce((a, r) => a + r.p, 0);
      RARITY.forEach((r, i) => card(c => { iconBg(c, '#F4F7FA', r.warna); lootChest(c, 32, 36, 1.6, i, 0, 0); label(c, 'T' + (i + 1), 50, 16, 13); }, 48, rarChip(i) + ' <span style="color:' + r.warna + '">' + r.nama + '</span>', '<p>Kuasa ×' + r.mult + ' · peluang asas ' + (r.p / tot * 100).toFixed(r.p < 1 ? 2 : 1) + '%</p><p class="muted">Contoh nama: ' + esc(ITEM_NAMES.senjata[0] + ' ' + RAR_SUFFIX[i]) + '</p>'));
      return;
    }
    if (encMode === 'kuasa') {
      $('encInfo').textContent = Object.keys(save.powers).length + '/9 dibuka';
      POWER_ORDER.forEach(id => { const p = POWERS[id]; card(ICONS['p_' + id], 56, esc(p.nama) + (save.powers[id] ? ' <span class="lv">Lv.' + save.powers[id] + '</span>' : ''), '<p>' + esc(p.desc) + '.</p><p class="st">Bertenang ' + p.cd + 's' + (p.dur ? ' · tempoh ' + p.dur + 's' : '') + ' · ' + (p.harga ? p.harga + ' gems' : 'percuma') + '</p><p class="muted">Setiap level: kuasa +20%, bertenang −1%, tempoh +2%.</p>', !save.powers[id]); });
      return;
    }
    if (encMode === 'sifat') {
      $('encInfo').textContent = '12 jenis badan · ' + TRAIT_ORDER.length + ' sifat';
      sec('Evolusi');
      card(null, 0, 'Peringkat evolusi I – IV', '<p>Zombie yang hidup terlalu lama berevolusi: HP ×1.6, damage ×1.4, gold ×1.5, lebih besar dan pantas. Had evolusi naik setiap 10 stage (maksimum IV). Evolusi II dan IV memberi sifat baharu.</p><p>' + [1, 2, 3, 4].map(e => '<span class="trc"><span class="dot" style="background:' + EVO_COLORS[e] + '"></span>' + EVO_NAMES[e] + '</span>').join(' ') + '</p><p>Boss <b>mengamuk</b> bila HP tinggal separuh: lebih laju dan kuat.</p>');
      sec('Boss unik (setiap 10 stage)');
      BIG_BOSSES.forEach((bb, i) => card(c => { c.fillStyle = '#2B3340'; rr(c, 2, 2, 60, 60, 12); c.fill(); const z = { id: 1, type: 'boss', bossKind: bb.id, x: 32, y: 34, r: 17, hp: 1, maxHp: 1, warna: bb.warna, traits: [], wob: .8, evo: 0, slowT: 0, burnT: 0, hitT: 0, atkAnim: 0, gear: 'tiada' }; const o = ctx; ctx = c; drawZombie(z); ctx = o; }, 56, esc(bb.nama), '<p>' + esc(bb.desc) + '</p><p class="muted">Muncul di stage ' + [1, 2, 3, 4, 5].map(k => (i + 1) * 10 + (k - 1) * 50).join(', ') + '…</p>'));
      sec('Zombie udara (mula stage 15)');
      card(null, 0, '🦇 Kelawar · 🐦 Gagak · 🎈 Belon', '<p>Terbang di atas medan: hanya senjata <b>⬆⬇ Udara+Darat</b> & menara udara boleh kena. Senjata ⬇ Darat (letupan tanah, semburan) melepasi mereka. Ketikan jari sentiasa kena. Roket & Peluru Berpandu +50% damage pada zombie udara.</p><p class="muted">' + Object.keys(FLY).map(k => FLY[k].nama + ': HP ×' + FLY[k].hp + ', laju ×' + FLY[k].spd).join(' · ') + '. Kekerapan: 10% (stage 15) → 15% (40) → 20% (80).</p>');
      card(null, 0, '🗡 Fizikal vs ✨ Magis', '<p>Berperisai: −35% damage fizikal. Perisai Magis (stage 20+): −35% damage magis. Bawa campuran senjata dalam pasukan. Railgun & Penyembur Racun tembus perisai.</p>');
      sec('Jenis badan');
      ZBASE.forEach(bz => { const sp = SPECIES_BY_BASE[bz.id][0], seen = save.seenZ[sp.id] === '1'; card(c => speciesIcon(c, sp.id, seen), 48, esc(bz.nama), '<p>' + esc(bz.desc) + '</p><p class="muted">Muncul dari stage ' + bz.stage + (bz.sifat.length ? ' · sifat asal: ' + bz.sifat.map(t => TRAITS[t].nama).join(', ') : '') + '</p>', !seen); });
      sec('Sifat');
      TRAIT_ORDER.forEach(t => card(c => { c.fillStyle = '#F4F7FA'; rr(c, 2, 2, 60, 60, 12); c.fill(); traitIcon(c, t, 32, 32, 22); }, 40, esc(TRAITS[t].nama), '<p>' + esc(TRAITS[t].desc) + '.</p><p class="muted">Boleh muncul melalui evolusi dari stage ' + TRAITS[t].stage + '; juga sifat asal sesetengah spesies.</p>'));
      sec('Elemen & kelengkapan');
      card(null, 0, '12 elemen', '<p>' + ZELEM.map(e => '<span class="trc"><span class="dot" style="background:' + (e.tint || '#8DC95B') + '"></span>' + e.nama + (e.sifat.length ? ' (' + TRAITS[e.sifat[0]].nama + ')' : '') + '</span>').join(' ') + '</p>');
      card(null, 0, '7 kelengkapan', '<p>' + ZGEAR.map(g => '<b>' + (g.nama || 'Tiada') + '</b>: HP ×' + g.hp + ', gold ×' + g.gold + (g.sifat.length ? ', ' + TRAITS[g.sifat[0]].nama : '')).join(' · ') + '</p>');
      return;
    }
    if (encMode === 'tier') {
      $('encInfo').textContent = '10 tier · 50 bintang';
      card(null, 0, 'Bintang hero', '<p>Naik bintang dengan shard: bintang pertama 10 shard, setiap bintang seterusnya +5 shard (bintang ke-50 perlu 255). Jumlah ke 50★: 6,625 shard.</p><p>Setiap bintang: damage +10%. Setiap 10 bintang: damage ×1.5 dan warna bintang naik tahap.</p><p>' + [0, 10, 20, 30, 40].map(s => starRow(s + 5)).join('<br>') + '</p>');
      TIERS.forEach((T0, i) => card(c => { c.fillStyle = T0.warna; rr(c, 4, 14, 56, 36, 10); c.fill(); label(c, T0.nama, 32, 40, T0.nama.length > 3 ? 16 : 20); }, 48, 'Tier ' + T0.nama, '<p>Kuasa ×' + T0.mult + ' · bina ' + T0.bina + ' shard · 5 shard = ' + T0.sGem + ' gems</p><p class="muted">Hero: ' + HERO_ORDER.filter(h => HEROES[h].tier === i).map(h => HEROES[h].nama).join(', ') + '</p>'));
      return;
    }
    if (encMode === 'latar') {
      $('encInfo').textContent = '50 latar · berkitar setiap 50 stage';
      BACKGROUNDS.forEach((bg, i) => card(c => { c.save(); c.beginPath(); rr(c, 2, 2, 60, 60, 10); c.clip(); c.scale(64 / W, 64 / W); c.translate(0, -120); drawBiome(c, bg.bi, mulberry(i * 977 + 13)); if (SUASANA_TINT[bg.si]) { c.fillStyle = SUASANA_TINT[bg.si]; c.fillRect(0, 0, W, H); } c.restore(); }, 56,
        'Stage ' + (i + 1) + ': ' + esc(bg.nama), '<p>Tempat: ' + BIOMES[bg.bi] + ' · suasana: ' + SUASANA[bg.si] + '</p><p class="muted">Juga stage ' + (i + 51) + ', ' + (i + 101) + ', ' + (i + 151) + '…</p>', save.best < i + 1));
      return;
    }
    if (encMode === 'bunyi') {
      $('encInfo').textContent = SOUND_LIST.reduce((a, g) => a + g[1].length, 0) + ' bunyi · tekan ▶ untuk dengar';
      card(null, 0, '🎧 Uji Bunyi', '<p>Dengar setiap bunyi dalam game. Semua bunyi dijana oleh kod (tiada fail audio). Beritahu pembangun bunyi mana yang perlu diubah.</p><p class="muted">Kelantangan: Lagi → Pilihan (muzik, kesan bunyi, suasana, suara watak).</p>');
      SOUND_LIST.forEach(([g, list]) => { sec(g); const el = card(null, 0, '', '<div class="sndgrid">' + list.map(([n, a, l]) => '<button class="sndb" data-snd="' + n + '" data-arg="' + esc(JSON.stringify(a)) + '">▶ ' + esc(l) + '</button>').join('') + '</div>');
        el.addEventListener('click', e => { const b = e && e.target && e.target.closest ? e.target.closest('[data-snd]') : null; if (!b) return; let a = null; try { a = JSON.parse(b.dataset.arg); } catch (er) {} playSound(b.dataset.snd, a); }); });
      return;
    }
    if (encMode === 'kostum') {
      $('encInfo').textContent = skinCount(save) + '/' + SKINS.length + ' kostum · bonus koleksi +' + skinCount(save) + '% damage';
      card(null, 0, 'Kostum khas hero', '<p>Setiap hero ada 2 kostum: <b>SR</b> dan <b>UR</b> (UR bercahaya & +5% damage tambahan). Kostum menukar rupa hero dan memberi stat. Pendua menaikkan ★ (setiap ★ +20% stat kostum, maksimum ★' + SKIN_MAX_STAR + ').</p><p>Hero bertudung dan berkopiah kekal memakainya dalam setiap kostum.</p><p class="muted">Sumber: Peti Kostum di Kedai, atau 3% peluang daripada boss besar.</p>');
      SKINS.filter(sk => !sk.sup).forEach(sk => { const own = save.skins[sk.id] != null; card(c => { c.save(); c.translate(0, 2); drawHero(c, 32, 32, sk.hero, -Math.PI / 4, 0, 0.95, HEROES[sk.hero].wpn, { t: 0.5, phase: 0, mood: 'main', skin: sk }); c.restore(); }, 56, (sk.rar ? '<span class="rchip" style="background:#C8A020">UR</span> ' : '<span class="rchip" style="background:#8F55DE">SR</span> ') + esc(sk.nama), '<p>' + esc(skinDesc(sk, own ? save.skins[sk.id] : 0)) + '</p><p class="muted">' + (own ? 'Dimiliki ★' + save.skins[sk.id] + (heroSkin(save, sk.hero) === sk ? ' · sedang dipakai' : '') : 'Belum dimiliki') + '</p>', !own); });
      return;
    }
    if (encMode === 'kedai') {
      $('encInfo').textContent = 'Semua barang kedai';
      sec('Naik taraf (gold/gems)');
      SHOP_ORDER.forEach(id => { const s = SHOP[id]; card(ICONS['s_' + id], 48, esc(s.nama) + ' <span class="lv">Lv.' + save.shop[id] + '</span>', '<p>' + esc(s.desc) + '. Tiada had level.</p><p class="muted">Kos asas ' + s.base + ' ' + s.mata + ', naik ×' + s.mult + ' setiap level.</p>'); });
      sec('Booster');
      BOOST_ORDER.forEach(id => { const b = BOOSTS[id]; card(ICONS['b_' + id], 48, esc(b.nama), '<p>' + esc(b.desc) + ' selama ' + b.minit + ' minit. Bertindan bila dibeli lagi.</p><p class="muted">' + b.harga + ' gems</p>'); });
      sec('Peti');
      Object.keys(CHESTS).forEach(id => { const c0 = CHESTS[id]; card(ICONS['c_' + id], 48, esc(c0.nama), '<p>' + esc(c0.desc) + '.</p><p class="muted">' + (c0.mata === 'gold' ? 'Harga gold naik ikut stage' : c0.harga + ' gems') + '</p>'); });
      Object.keys(HERO_CHESTS).forEach(id => { const c0 = HERO_CHESTS[id]; card(ICONS['h_' + id], 48, esc(c0.nama), '<p>' + esc(c0.desc) + '. Hero tier rendah lebih kerap.</p><p class="muted">' + c0.harga + ' gems</p>'); });
      sec('Event bermusim'); EVENTS.forEach(e => card(null, 0, esc(e.nama), '<p>' + esc(e.desc) + '. Peti event harian: 40 gems + 12 shard.</p><p class="muted">' + (e.minggu ? 'Setiap Sabtu & Ahad' : 'Setiap tahun ' + e.mula[1] + '/' + e.mula[0] + ' – ' + e.tamat[1] + '/' + e.tamat[0]) + '</p>'));
      card(ICONS.slot, 48, 'Slot pasukan', '<p>Mula dengan 3 slot, maksimum 6. Slot 4: 50 gems, slot 5: 150 gems, slot 6: 400 gems.</p>');
      return;
    }
    }
    if (encMode === 'hero') {
      $('encInfo').textContent = Object.keys(save.heroes).length + '/' + HERO_ORDER.length + ' hero dibina';
      HERO_ORDER.forEach(id => {
        const d = HEROES[id], T0 = TIERS[d.tier], own = !!save.heroes[id], wd = WEAPONS[d.wpn], el = document.createElement('div'); el.className = 'card enc' + (own ? '' : ' locked');
        el.innerHTML = '<div class="pcol"><canvas width="112" height="112" aria-hidden="true"></canvas><span class="tier" style="background:' + T0.warna + '">' + T0.nama + '</span></div><div class="info"><h3>' + esc(d.nama) + '</h3><p class="lore">' + esc(d.kisah) + '</p><p><b>Kemahiran — ' + esc(SKILLS[id].nama) + ':</b> ' + esc(SKILLS[id].desc) + ' (lebih kuat setiap 10★)</p><p><b>Senjata khas:</b> ' + esc(wd.nama) + ' (' + esc(wd.desc) + ')</p><p><b>Kuasa tier:</b> ×' + T0.mult + ' · <b>Bina:</b> ' + T0.bina + ' shard</p><p>' + (own ? starRow(save.stars[id] || 0) : '<span class="muted">Belum dibina · shard ' + (save.shards[id] || 0) + '/' + T0.bina + '</span>') + '</p></div>';
        const c = el.querySelector('canvas').getContext('2d'); c.scale(2, 2); drawHero(c, 28, 31, id, -Math.PI / 4, 0, 0.92, d.wpn, { t: 0.5, phase: 0, mood: 'main' });
        if (own) { const st = heroStats(save, id, Date.now()), info = el.querySelector('.info'), p = document.createElement('p'); p.className = 'st'; p.textContent = 'Kini Lv.' + save.heroes[id] + ': damage ' + fmt(st.dmg) + ', ' + st.rate.toFixed(2) + '/s, anggaran DPS ' + fmt(st.dmg * st.rate * (WEAPONS[st.wid].n || 1)) + ' (' + WEAPONS[st.wid].nama + ')'; info.appendChild(p);
          const g = document.createElement('canvas'); g.className = 'graph'; g.width = 440; g.height = 120; info.appendChild(g); drawPowerGraph(g.getContext('2d'), save.heroes[id], save.stars[id] || 0, T0.warna); }
        box.appendChild(el);
      });
      $('encPager').hidden = true; return;
    }
    const list = encList(), pages = Math.max(1, Math.ceil(list.length / ENC_PER)); encPage = Math.min(encPage, pages - 1);
    $('encInfo').textContent = seenCount() + '/1000 zombie ditemui';
    $('encPager').hidden = false; $('encPg').textContent = 'Halaman ' + (encPage + 1) + '/' + pages + ' (' + list.length + ')';
    $('encPrev').disabled = encPage <= 0; $('encNext').disabled = encPage >= pages - 1;
    if (!list.length) { box.innerHTML = '<p class="empty">Tiada zombie sepadan.</p>'; return; }
    list.slice(encPage * ENC_PER, encPage * ENC_PER + ENC_PER).forEach(sp => {
      const seen = save.seenZ[sp.id] === '1', zt = ZTYPES[sp.base], el = document.createElement('div'); el.className = 'card enc z' + (seen ? '' : ' locked');
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>#' + String(sp.id + 1).padStart(4, '0') + ' ' + (seen ? esc(sp.nama) : '???') + '</h3>' +
        (seen ? '<p>' + esc(speciesDesc(sp)) + '</p><p class="st">HP ×' + sp.hp.toFixed(2) + ' · laju ×' + sp.spd.toFixed(2) + ' · gold ×' + sp.gold.toFixed(2) + ' · asas HP ' + zt.hp + '</p><p>' + (sp.sifat.length ? sp.sifat.map(traitChip).join(' ') : '<span class="muted">Tiada sifat istimewa</span>') + '</p>'
          : '<p class="muted">Belum ditemui. Mula muncul dari stage ' + sp.stage + '.</p>') + '</div>';
      paintIcon(el.querySelector('canvas'), c => speciesIcon(c, sp.id, seen), 56);
      box.appendChild(el);
    });
  }
  ['hero', 'zombie', 'boss', 'senjata', 'pagar', 'item', 'kostum', 'kuasa', 'sifat', 'tier', 'latar', 'kedai', 'bunyi'].forEach(m => $('enc_' + m).addEventListener('click', () => { encMode = m; encSig = ''; buildEnc(); }));
  ['semua', 'ditemui', 'belum'].forEach(f => $('ef_' + f).addEventListener('click', () => { encFilter = f; encPage = 0; ['semua', 'ditemui', 'belum'].forEach(g => $('ef_' + g).setAttribute('aria-pressed', g === f)); encSig = ''; buildEnc(); }));
  $('encBase').innerHTML = '<option value="">Semua jenis</option>' + ZBASE.map(b => '<option value="' + b.id + '">' + esc(b.nama) + '</option>').join('');
  $('encBase').addEventListener('change', e => { encBase = e.target.value; encPage = 0; encSig = ''; buildEnc(); });
  $('encQ').addEventListener('input', e => { encQuery = e.target.value; encPage = 0; encSig = ''; buildEnc(); });
  $('encPrev').addEventListener('click', () => { encPage--; encSig = ''; buildEnc(); });
  $('encNext').addEventListener('click', () => { encPage++; encSig = ''; buildEnc(); });

  // ---------- tab TROFI ----------
  function drawPowerGraph(c, lvl, stars, col) {
    c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 220, 60); const maxL = Math.max(100, Math.ceil(lvl * 1.5 / 50) * 50), f = l => Math.log10(heroLvlMult(l) * starMult(stars));
    const hi = f(maxL), x = l => 26 + (l - 1) / (maxL - 1) * 186, y = v => 50 - v / hi * 42;
    c.fillStyle = 'rgba(0,0,0,.04)'; c.fillRect(26, 6, 186, 44); c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); for (let l = 1; l <= maxL; l += Math.max(1, Math.floor(maxL / 80))) { l === 1 ? c.moveTo(x(l), y(f(l))) : c.lineTo(x(l), y(f(l))); } c.stroke();
    c.fillStyle = col; circ(c, x(Math.min(lvl, maxL)), y(f(Math.min(lvl, maxL))), 3.5); c.fillStyle = '#5C6B82'; c.font = '700 8px "Nunito", system-ui'; c.textAlign = 'left';
    c.fillText('×' + fmt(heroLvlMult(maxL) * starMult(stars)), 0, 12); c.fillText('×1', 4, 52); c.textAlign = 'center'; c.fillText('Lv.1', 30, 59); c.fillText('Lv.' + maxL, 205, 59); c.fillText('Kuasa ikut level (lonjakan setiap 25 level)', 120, 6);
  }
  function trophyIcon(c, k, locked) {
    const col = k >= 0 ? TROFI[k].warna : '#B8C0CC';
    c.fillStyle = locked ? '#E4E8EE' : '#F4F7FA'; rr(c, 2, 2, 60, 60, 14); c.fill();
    if (k >= 3 && !locked) { glow(c, col, 14); }
    c.fillStyle = locked ? '#C4CAD4' : col;
    c.beginPath(); c.moveTo(18, 12); c.lineTo(46, 12); c.quadraticCurveTo(46, 36, 32, 38); c.quadraticCurveTo(18, 36, 18, 12); c.fill(); noGlow(c);
    c.strokeStyle = locked ? '#C4CAD4' : col; c.lineWidth = 4; c.beginPath(); c.arc(16, 20, 6, Math.PI * 0.5, Math.PI * 1.5); c.stroke(); c.beginPath(); c.arc(48, 20, 6, -Math.PI * 0.5, Math.PI * 0.5); c.stroke();
    c.fillStyle = locked ? '#C4CAD4' : col; c.fillRect(29, 37, 6, 8); rr(c, 20, 45, 24, 8, 3); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(22, 15, 4, 16);
    if (!locked) { c.fillStyle = '#FFFFFF'; star(c, 32, 23, 5, 6, 2.6, -Math.PI / 2); }
    if (k === 4 && !locked) { c.fillStyle = '#FFFFFF'; star(c, 50, 10, 4, 4, 1.5, 0); star(c, 12, 44, 4, 3, 1, 0); }
  }
  function drawShelf(c, counts, lv) {
    c.clearRect(0, 0, 340, 120);
    c.fillStyle = '#8A5A30'; rr(c, 4, 86, 332, 12, 4); c.fill(); c.fillStyle = '#6E4520'; c.fillRect(14, 98, 10, 16); c.fillRect(316, 98, 10, 16);
    for (let k = 0; k < 5; k++) {
      const x = 24 + k * 62; c.save(); c.translate(x + 3, 18); c.scale(0.85, 0.85); trophyIcon(c, k, counts[k] === 0); c.restore();
      label(c, '×' + counts[k], x + 30, 82, 14, counts[k] ? '#FFFFFF' : '#C4CAD4');
      c.fillStyle = '#5C6B82'; c.font = '700 11px "Nunito", system-ui'; c.textAlign = 'center'; c.fillText(TROFI[k].nama, x + 30, 16);
    }
  }
  const achCards = {}; let achFilter = -1, achReadySig = '';
  function buildAch() {
    const box = $('achList'); box.innerHTML = '';
    ACH.forEach(a => {
      const el = document.createElement('div'); el.className = 'card ach';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(a.nama) + ' <span class="lv"></span></h3><p class="ad"></p><div class="sbar"><div class="fill"></div><span></span></div><p class="pips"></p></div><div class="acts"><button class="btn claim"></button></div>';
      el.querySelector('.claim').addEventListener('click', () => { const r = claimAch(save, a.id, Math.random); if (r.ok) { el.dataset.k = ''; } afterChange(r.msg, r.ok); });
      achCards[a.id] = el; box.appendChild(el);
    });
    $('trClaimAll').addEventListener('click', () => { let n = 0; for (const a of ACH) while (achReady(save, a)) { claimAch(save, a.id, Math.random); n++; } Object.values(achCards).forEach(e => e.dataset.k = ''); afterChange(n ? n + ' trofi dituntut!' : 'Tiada trofi sedia dituntut', n > 0); });
    for (let i = -1; i < ACH_KAT.length; i++) $('ak_' + (i < 0 ? 'all' : i)).addEventListener('click', () => { achFilter = i; for (let j = -1; j < ACH_KAT.length; j++) $('ak_' + (j < 0 ? 'all' : j)).setAttribute('aria-pressed', j === i); refreshAch(); });
  }
  function refreshAch() {
    const counts = trophyCounts(save), pts = trophyPoints(save), tl = trophyLevel(pts);
    const shc = $('trShelf').getContext('2d'); shc.setTransform(2, 0, 0, 2, 0, 0); drawShelf(shc, counts, tl.lv);
    $('trSum').innerHTML = '<b>Tahap Trofi ' + tl.lv + '</b> · ' + pts + ' mata · ' + counts.reduce((a, b) => a + b, 0) + '/' + ACH.length * 5 + ' trofi<div class="sbar"><div class="fill" style="width:' + (tl.left / tl.need * 100) + '%"></div><span>' + tl.left + '/' + tl.need + ' ke tahap ' + (tl.lv + 1) + '</span></div>';
    const order = ACH.slice().sort((a, b) => (achReady(save, b) - achReady(save, a)) || (achTier(save, a) >= 5) - (achTier(save, b) >= 5) || (achValue(save, b) / b.t[Math.min(4, achTier(save, b))]) - (achValue(save, a) / a.t[Math.min(4, achTier(save, a))]));
    order.forEach((a, i) => {
      const el = achCards[a.id], k = achTier(save, a), done = k >= 5, v = achValue(save, a), need = a.t[Math.min(k, 4)], ready = achReady(save, a);
      el.style.order = i; el.hidden = achFilter >= 0 && a.kat !== achFilter;
      el.classList.toggle('ready', ready); el.classList.toggle('done', done);
      if (el.dataset.k !== String(k) + ready) { el.dataset.k = String(k) + ready; paintIcon(el.querySelector('canvas'), c => trophyIcon(c, done ? 4 : ready ? k : k - 1, !done && !ready && k === 0), 56); }
      el.querySelector('.lv').textContent = done ? 'Berlian (lengkap)' : k ? TROFI[k - 1].nama : '';
      el.querySelector('.ad').textContent = done ? achDesc(a, 4) + ' ✔' : achDesc(a, k);
      el.querySelector('.sbar .fill').style.width = Math.min(100, v / need * 100) + '%';
      el.querySelector('.sbar span').textContent = a.id === 'play' ? Math.floor(v / 60) + '/' + Math.floor(need / 60) + ' minit' : fmt(Math.min(v, need)) + '/' + fmt(need);
      el.querySelector('.pips').innerHTML = TROFI.map((T0, j) => '<i style="background:' + (j < k ? T0.warna : 'var(--chip)') + ';border-color:' + T0.warna + '"></i>').join('') + ' <span class="muted">' + ACH_KAT[a.kat] + '</span>';
      const b = el.querySelector('.claim'); b.hidden = done;
      if (!done) { const T0 = TROFI[k]; b.innerHTML = 'Tuntut ' + gem + T0.gems + (T0.shard ? ' +' + T0.shard + ' shard' : ''); b.disabled = !ready; }
    });
  }
  function canStar(h) { const sh = save.shards[h] || 0; return save.heroes[h] ? (save.stars[h] || 0) < MAX_STARS && sh >= starCost((save.stars[h] || 0) + 1) : sh >= TIERS[HEROES[h].tier].bina; }
  function betterGear(h) { const e = save.equip[h] || {}; return HERO_SLOTS.some(s => { const cur = itemByUid(save, e[s]), cp = cur ? itemPower(cur) : -1; return save.items.some(x => x.jenis === s && !whoEquips(save, x.uid) && itemPower(x) > cp * 1.05); }); }
  function refreshDots() {
    const gm = save.gems, team = save.team.filter(h => save.heroes[h]);
    const dots = {
      hero: HERO_ORDER.some(canStar) || team.some(betterGear),
      senjata: WEAPON_ORDER.some(w => !save.weapons[w] && WEAPONS[w].harga && gm >= WEAPONS[w].harga),
      kuasa: POWER_ORDER.some(p => !save.powers[p] && gm >= POWERS[p].harga),
      pagar: save.towers.some(t => t && branchAvailable(t) >= 0) || save.towers.some((t, i) => !t && save.gold >= towerBuildCost(i)),
      kedai: false,
      arena: prestigeGain(save) > 0 || PERK_ORDER.some(p => perk(save, p) < PERKS[p].max && save.roh >= Math.ceil(PERKS[p].kos(perk(save, p))))
    };
    Object.keys(dots).forEach(k => $('tab_' + k).classList.toggle('dot', !!dots[k]));
    $('upAll').disabled = save.gold < cheapestUpgrade(save);
    HERO_ORDER.forEach(h => { const el = heroCards[h]; if (el) el.classList.toggle('can', canStar(h) || (team.includes(h) && betterGear(h))); });
  }

  function checkAchReady() {
    const ready = ACH.filter(a => achReady(save, a));
    $('tab_trofi').textContent = ready.length ? 'Trofi (' + ready.length + ')' : 'Trofi';
    $('tab_trofi').classList.toggle('badge', ready.length > 0);
    const sig = ready.map(a => a.id + achTier(save, a)).join(',');
    if (sig !== achReadySig) { const prev = achReadySig.split(','); const fresh = ready.filter(a => !prev.includes(a.id + achTier(save, a))); if (achReadySig !== '' && fresh.length) toast('🏆 Trofi ' + TROFI[achTier(save, fresh[0])].nama + ' sedia: ' + fresh[0].nama, true); achReadySig = sig || ' '; }
  }

