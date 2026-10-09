  // ---------- tab KUASA ----------
  const powCards = {};
  function buildPowers() {
    const box = $('powList'); box.innerHTML = '';
    POWER_ORDER.forEach(id => {
      const p = POWERS[id], el = document.createElement('div'); el.className = 'card pow';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(p.nama) + ' <span class="lv"></span></h3><p>' + esc(p.desc) + '</p><p class="st"></p></div><div class="acts"><button class="btn up"></button><button class="btn ghost x10">×10</button></div>';
      paintIcon(el.querySelector('canvas'), ICONS['p_' + id], 56);
      el.querySelector('.up').addEventListener('click', () => { const r = save.powers[id] ? upgradePower(save, id, 1) : unlockPower(save, id); afterChange(r.msg, r.ok); });
      el.querySelector('.x10').addEventListener('click', () => { const r = upgradePower(save, id, 10); afterChange(r.msg, r.ok); });
      powCards[id] = el; box.appendChild(el);
    });
    buildTapakUI();
    $('autoPow').addEventListener('click', () => { save.autoPow = !save.autoPow; battle.autoPower = save.autoPow; persist(); refreshPowers(); toast(save.autoPow ? 'Auto kuasa: hidup' : 'Auto kuasa: mati', true); });
  }
  function refreshPowers() {
    refreshTapak(); $('autoPow').setAttribute('aria-pressed', save.autoPow); $('autoPow').textContent = save.autoPow ? 'Auto kuasa: hidup' : 'Auto kuasa: mati';
    POWER_ORDER.forEach(id => {
      const p = POWERS[id], el = powCards[id], lvl = save.powers[id], up = el.querySelector('.up'), x10 = el.querySelector('.x10');
      el.classList.toggle('locked', !lvl);
      el.querySelector('.lv').textContent = lvl ? 'Lv.' + lvl : 'Terkunci';
      const l2 = lvl || 1;
      el.querySelector('.st').textContent = 'Bertenang ' + Math.round(powCd(id, l2)) + 's' + (p.dur ? ', tempoh ' + powDur(id, l2).toFixed(1) + 's' : '') + ', kuasa ×' + powLvlMult(l2).toFixed(1);
      if (lvl) { const c = powCost(id, lvl); up.innerHTML = 'Naik ' + coin + fmt(c); up.disabled = save.gold < c; x10.hidden = false; x10.disabled = save.gold < c; }
      else { up.innerHTML = 'Buka ' + gem + p.harga; up.disabled = save.gems < p.harga; x10.hidden = true; }
    });
  }
  // bar kuasa di bawah medan
  let powerCd = {}, pbarSig = '';
  const pbBtns = {};
  function buildPowerBar() {
    const owned = POWER_ORDER.filter(p => save.powers[p]), sig = owned.join(',') + '|w' + save.wallActive;
    if (sig === pbarSig) return; pbarSig = sig;
    const bar = $('powerBar'); bar.innerHTML = '';
    { const wk = save.wallActive, SK = WALL_SKILL[WALLS[wk].mat], b = document.createElement('button'); b.className = 'pbtn wsk'; b.setAttribute('aria-label', 'Kemahiran pagar: ' + SK.nama);
      b.innerHTML = '<canvas aria-hidden="true"></canvas><span class="cdv"></span><span class="cdt"></span>'; paintIcon(b.querySelector('canvas'), c => wallIcon(c, wk), 44);
      b.addEventListener('click', () => { if (!running) { toast('Mulakan pertempuran dahulu', false); return; } if (!battle.useWallSkill()) toast(SK.nama + ' belum sedia', false); });
      pbBtns.wall = b; bar.appendChild(b); }
    owned.forEach(id => {
      const b = document.createElement('button'); b.className = 'pbtn'; b.setAttribute('aria-label', POWERS[id].nama);
      b.innerHTML = '<canvas aria-hidden="true"></canvas><span class="cdv"></span><span class="cdt"></span>';
      paintIcon(b.querySelector('canvas'), ICONS['p_' + id], 44);
      b.addEventListener('click', () => { if (!running) { toast('Mulakan pertempuran dahulu', false); return; } if (!battle.usePower(id)) toast(POWERS[id].nama + ' belum sedia', false); });
      pbBtns[id] = b; bar.appendChild(b);
    });
  }
  function refreshPowerBar() {
    for (const id in pbBtns) {
      if (id !== 'wall' && !save.powers[id]) continue;
      const b = pbBtns[id], left = Math.max(0, powerCd[id] || 0), tot = id === 'wall' ? WALL_SKILL_CD : powCd(id, save.powers[id]);
      b.querySelector('.cdv').style.height = (left > 0 ? left / tot * 100 : 0) + '%';
      b.querySelector('.cdt').textContent = left > 0 ? Math.ceil(left) : '';
      b.classList.toggle('ready', left <= 0 && running);
      b.classList.toggle('on', !!battle.act[id]);
    }
  }

  // ---------- v8.6: animasi bina pagar ----------
  function playWallBuild(k) {
    const w = WALLS[k]; if (!w) return; const TR = MAT_TRAIT[w.mat], SK = WALL_SKILL[w.mat];
    showModal('🧱 ' + w.nama + ' siap dibina!', '<canvas id="wbCv" width="720" height="250" style="width:100%;border-radius:12px;background:#1B2433" aria-hidden="true"></canvas><p class="wtr"><b>' + TR.ikon + ' ' + esc(TR.nama) + '</b>: ' + esc(TR.desc) + '</p><p class="wtr"><b>✋ ' + esc(SK.nama) + '</b>: ' + esc(SK.desc) + '</p>', [['Hebat!', null, 'btn big']]);
    const cv = $('wbCv'); if (!cv || !cv.getContext) return; const c = cv.getContext('2d'), s = cv.width / W, top = WALL_Y - 95, hh = cv.height / s;
    const fake = { wall: 1, wallMax: 1, ws: wallStats(save) }, N = WALL_SEGS, seg = W / N, t0 = Date.now(), done = new Array(N).fill(false); let ended = false;
    const RAF = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null;
    function frame() {
      const t = (Date.now() - t0) / 1000, old = ctx; c.setTransform(s, 0, 0, s, 0, 0); c.clearRect(0, 0, W, hh);
      const g = c.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, '#2A3A55'); g.addColorStop(1, '#1B2433'); c.fillStyle = g; c.fillRect(0, 0, W, hh);
      c.fillStyle = '#3A4A3A'; c.fillRect(0, hh - 34, W, 34);
      ctx = c;
      for (let i = 0; i < N; i++) {
        const p = RAF ? Math.max(0, Math.min(1, (t - i * 0.07) / 0.28)) : 1; if (p <= 0) continue;
        const e = 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2);
        if (p >= 1 && !done[i]) { done[i] = true; if (RAF && i % 2 === 0) sfx('wpost', w.mat); }
        c.save(); c.beginPath(); c.rect(i * seg - 1, 0, seg + 2, hh); c.clip(); c.translate(0, -top + (1 - e) * 70); drawWall(fake); c.restore();
      }
      ctx = old;
      const fin = RAF ? Math.max(0, t - (N * 0.07 + 0.3)) : 1;
      if (fin > 0) { if (!ended) { ended = true; if (RAF) sfx('wbuilt'); }
        c.save(); c.globalAlpha = Math.min(1, fin * 3); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + fin * 2, r = 20 + fin * 120; c.fillStyle = i % 2 ? '#FFE07A' : '#FFFFFF'; c.beginPath(); c.arc(W / 2 + Math.cos(a) * r * 1.6, 40 + Math.sin(a) * r * 0.35, Math.max(0, 3.5 - fin * 2), 0, TAU); c.fill(); } c.restore(); }
      if (RAF && t < 3 && !$('modal').hidden && $('wbCv') === cv) RAF(frame);
    }
    frame();
  }
  // ---------- tab PAGAR ----------
  const wallCards = [];
  function buildWalls() {
    const box = $('wallList'); box.innerHTML = '';
    WALLS.forEach((w, k) => {
      const el = document.createElement('div'); el.className = 'card wall';
      const TR = MAT_TRAIT[w.mat], SK = WALL_SKILL[w.mat];
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + (k + 1) + '. ' + esc(w.nama) + ' <span class="lv"></span></h3><p>' + esc(wallDesc(w)) + '</p><p class="wtr"><b>' + TR.ikon + ' ' + esc(TR.nama) + '</b> · ' + esc(TR.desc) + '</p><p class="wtr"><b>✋ ' + esc(SK.nama) + '</b> · ' + esc(SK.desc) + '</p></div><button class="btn use"></button><button class="btn ghost lvb" hidden></button>';
      el.querySelector('.lvb').addEventListener('click', () => { const r = upgradeWallLv(save, k); afterChange(r.msg, r.ok); });
      paintIcon(el.querySelector('canvas'), c => wallIcon(c, k), 48);
      el.querySelector('.use').addEventListener('click', () => { const isNew = k >= save.wallsOwned, r = isNew ? buyWall(save) : setWall(save, k); afterChange(r.msg, r.ok); if (r.ok && isNew) playWallBuild(save.wallActive); });
      wallCards.push(el); box.appendChild(el);
    });
    }
  let wallSlotSig = '', wallSumK = -1;
  function refreshWalls() {
    refreshTowers(); refreshFort();
    if (wallScrollK !== save.wallActive) { wallScrollK = save.wallActive; const wl = $('wallList'); if (wl && wl.scrollTo) wl.scrollTo({ left: Math.max(0, save.wallActive * 178 - 40), behavior: 'smooth' }); }
    const ws = wallStats(save);
    if (wallSumK !== save.wallActive) { wallSumK = save.wallActive; paintIcon($('wallSumIco'), c => wallIcon(c, save.wallActive), 56); }
    $('wallSum').innerHTML = '<b class="wsn">' + esc(ws.w.nama) + '</b><span class="wchips"><span>❤ ' + fmt(ws.max) + '</span><span>🛡 ' + ws.armor + '%</span>' + (ws.thorns ? '<span>🌵 ' + (ws.thorns * 100).toFixed(1) + '%</span>' : '') + (ws.regen ? '<span>💚 ' + (ws.regen * 100).toFixed(1) + '%/s</span>' : '') + '<span>⭐ Lv.' + ws.lv + '</span><span>📚 +' + ws.coll + '% koleksi</span></span><small class="wtr2">' + MAT_TRAIT[ws.mat].ikon + ' <b>' + esc(MAT_TRAIT[ws.mat].nama) + '</b>: ' + esc(MAT_TRAIT[ws.mat].desc) + '</small><small class="wtr2">✋ <b>' + esc(WALL_SKILL[ws.mat].nama) + '</b> (butang dalam pertempuran, ' + WALL_SKILL_CD + ' s): ' + esc(WALL_SKILL[ws.mat].desc) + '</small><small class="muted">Dimiliki ' + save.wallsOwned + '/50 · setiap pagar dimiliki +' + WALL_COLL_PCT + '% HP</small>';
    const sig = save.wallEquip.join(',') + '|' + save.items.filter(i => save.wallEquip.includes(i.uid)).map(i => i.ilvl).join(',');
    if (sig !== wallSlotSig) {
      wallSlotSig = sig;
      $('wallSlots').innerHTML = '<div class="wgrid">' + save.wallEquip.map((u, i) => { const it = itemByUid(save, u), s = it ? itemStats(it) : null; return '<button class="wsock' + (it ? ' on' : '') + '" data-ws="' + i + '" style="' + (it ? 'border-color:' + RARITY[it.rar].warna + ';background:linear-gradient(180deg,' + RARITY[it.rar].warna + '30,var(--card) 75%)' : '') + '"><canvas aria-hidden="true"></canvas><b>' + (it ? 'T' + (it.rar + 1) + ' +' + it.ilvl : 'Soket ' + (i + 1)) + '</b><small>' + (it ? '❤+' + s.hp + '% 🛡' + s.armor + '%' + (s.thorns ? ' 🌵' + s.thorns + '%' : '') + (s.regen ? ' 💚' + s.regen.toFixed(1) : '') : 'Kosong · tekan') + '</small></button>'; }).join('') + '</div><button class="btn ghost wide" id="wallBestBtn">✨ Pasang perisai terbaik untuk pagar</button>';
      (($('wallSlots').querySelectorAll && $('wallSlots').querySelectorAll('.wsock')) || []).forEach(b => { const it = itemByUid(save, save.wallEquip[+b.dataset.ws]), cv = b.querySelector('canvas'); if (cv) paintIcon(cv, c => { iconBg(c, '#EEF2F8', it ? RARITY[it.rar].warna : '#B8C2CC'); itemGlyph(c, 32, 32, 2.3, 'perisai', it ? RARITY[it.rar].warna : '#9AA6B4'); }, 40); });
    }
    WALLS.forEach((w, k) => {
      const el = wallCards[k], b = el.querySelector('.use'), owned = k < save.wallsOwned;
      el.classList.toggle('locked', !owned); el.classList.toggle('inteam', k === save.wallActive);
      const lv = wallLvOf(save, k); el.querySelector('.lv').textContent = (k === save.wallActive ? 'Aktif' : owned ? 'Dimiliki' : '') + (owned && lv ? ' · Lv.' + lv : '');
      const lb = el.querySelector('.lvb'); lb.hidden = !owned; if (owned) { if (lv >= WALL_LV_MAX) { lb.textContent = '⭐ Lv. maksimum'; lb.disabled = true; } else { const c = wallLvCost(k, lv); lb.innerHTML = '⬆ Lv.' + (lv + 1) + ' (+5% HP) ' + coin + fmt(c); lb.disabled = save.gold < c; } }
      if (owned) { b.textContent = k === save.wallActive ? 'Digunakan' : 'Guna'; b.disabled = k === save.wallActive; }
      else if (k === save.wallsOwned) { const c = wallCost(k); b.innerHTML = 'Bina ' + coin + fmt(c); b.disabled = save.gold < c; }
      else { b.textContent = 'Terkunci'; b.disabled = true; }
    });
  }

  // ---------- tab BEG ----------
  let invSig = '';
  let invFilter = 'semua', invCards = {}, invSheetUid = null;
  function openInvSheet(uid, quiet) { Object.keys(invCards).forEach(k => invCards[k].classList.toggle('sel', +k === +uid)); $('invList').classList.add('open'); $('invClose').hidden = false; invSheetUid = uid; if (!quiet) sfx('click'); }
  function closeInvSheet() { $('invList').classList.remove('open'); $('invClose').hidden = true; invSheetUid = null; }
  function invSignature() { return invFilter + '|' + save.items.map(i => i.uid + ':' + i.ilvl + (i.lock ? 'L' : '')).join(',') + '|' + JSON.stringify(save.equip) + '|' + save.wallEquip.join(',') + '|' + Object.keys(save.heroes).join(','); }
  function buildInv() {
    invSig = invSignature();
    const box = $('invList'); box.innerHTML = ''; const grid = $('invGrid'); grid.innerHTML = ''; invCards = {};
    $('invCount').textContent = save.items.length + '/' + INV_CAP + ' item';
    if (!save.items.length) { grid.innerHTML = '<p class="empty">Beg kosong. Item jatuh daripada zombie dan boss, atau buka peti di Kedai.</p>'; closeInvSheet(); return; }
    const owned = HERO_ORDER.filter(h => save.heroes[h]);
    const items = save.items.filter(i => invFilter === 'semua' || i.jenis === invFilter).sort((a, b) => itemPower(b) - itemPower(a));
    if (!items.length) { grid.innerHTML = '<p class="empty">Tiada item jenis ini.</p>'; closeInvSheet(); return; }
    for (const it of items) {
      const w = whoEquips(save, it.uid), el = document.createElement('div'); el.className = 'card item'; el.style.borderLeftColor = RARITY[it.rar].warna;
      const onWall = it.jenis === 'perisai', where = w ? (w.hero === '__pagar' ? 'pagar (slot ' + (w.slot + 1) + ')' : HEROES[w.hero].nama) : '';
      el.innerHTML = '<div class="info"><h3 style="color:' + RARITY[it.rar].warna + '">' + rarChip(it.rar) + ' ' + (it.lock ? '🔒 ' : '') + esc(itemName(it)) + '</h3><p class="cmp"></p><p>' + RARITY[it.rar].nama + ' ' + it.jenis + ': ' + esc(itemDescFull(it)) + '</p><p class="st">' + (w ? 'Dipasang pada ' + esc(where) : 'Tidak dipasang') + '</p>' +
        (onWall ? '<div class="row2"><button class="btn eq">Pasang pada pagar</button></div>' : '<div class="row2"><select aria-label="Pilih hero">' + owned.map(h => '<option value="' + h + '"' + (w && w.hero === h ? ' selected' : '') + '>' + esc(HEROES[h].nama) + '</option>').join('') + '</select><button class="btn eq">Pasang</button></div>') +
        '<div class="row2"><button class="btn ghost fu">🔀 Gabung</button><button class="btn ghost lk">' + (it.lock ? '🔓 Buka' : '🔒 Kunci') + '</button><button class="btn ghost fg" data-uid="' + it.uid + '"></button><button class="btn ghost sl">Jual ' + coin + fmt(sellValue(it)) + '</button>' + (w ? '<button class="btn ghost ue">Tanggal</button>' : '') + '</div></div>';
      el.querySelector('.eq').addEventListener('click', () => { const r = onWall ? equipWallItem(save, it.uid) : equipItem(save, it.uid, el.querySelector('select').value); afterChange(r.msg, r.ok); });
      el.querySelector('.lk').addEventListener('click', () => { const r = toggleLock(save, it.uid); invSig = ''; afterChange(r.msg, r.ok); });
      el.querySelector('.fu').addEventListener('click', () => { const r = fuseItem(save, it.uid); invSig = ''; afterChange(r.msg, r.ok); if (r.ok) sfx('fuse'); if (r.ok) { invSheetUid = r.it.uid; } });
      const showCmp = () => { const sel = el.querySelector('select'), hid = sel ? sel.value : null, c = compareItem(save, it.uid, hid || save.team[0]), p = el.querySelector('.cmp');
        if (!c || c.same) { p.innerHTML = c && c.same ? '<span class="muted">Sedang dipasang</span>' : ''; return; }
        p.innerHTML = (c.cur ? 'Banding <b>' + esc(itemName(c.cur)) + '</b>: ' : 'Slot kosong: ') + (c.diff.length ? c.diff.map(d => '<span class="' + (d.d > 0 ? 'up' : 'dn') + '">' + (d.d > 0 ? '▲ +' : '▼ ') + d.d + d.n + '</span>').join(' ') : 'sama');
      };
      showCmp(); const selC = el.querySelector('select'); if (selC) selC.addEventListener('change', showCmp);
      el.querySelector('.fg').addEventListener('click', () => { const r = forgeItem(save, it.uid); afterChange(r.ok ? 'Ditempa: ' + r.msg : r.msg, r.ok); });
      el.querySelector('.sl').addEventListener('click', () => { const r = sellItem(save, it.uid); afterChange(r.msg, r.ok); });
      const ue = el.querySelector('.ue'); if (ue) ue.addEventListener('click', () => { const r = unequipItem(save, it.uid); afterChange(r.msg, r.ok); });
      box.appendChild(el); invCards[it.uid] = el;
      const tl = document.createElement('button'); tl.className = 'itile' + (it.rar >= 5 ? ' shine' : ''); tl.style.borderColor = RARITY[it.rar].warna; tl.setAttribute('aria-label', itemName(it));
      tl.innerHTML = '<canvas class="ig" aria-hidden="true"></canvas><span class="it">T' + (it.rar + 1) + '</span><span class="il">+' + it.ilvl + '</span>' + (it.lock ? '<span class="ik">🔒</span>' : '') + (!w && (it.jenis === 'perisai' ? (compareItem(save, it.uid, save.team[0]) || {}).better : save.team.some(h => (compareItem(save, it.uid, h) || {}).better)) ? '<span class="iu">▲</span>' : '') + (w ? '<span class="iw">' + (w.hero === '__pagar' ? '🛡' : esc(HEROES[w.hero].nama.split(' ').map(x => x[0]).join('').slice(0, 2))) + '</span>' : '') + '<span class="in">' + esc(itemName(it)) + '</span>';
      tl.style.background = 'linear-gradient(180deg,' + RARITY[it.rar].warna + '33, var(--card) 70%)';
      paintIcon(tl.querySelector('.ig'), c => itemGlyph(c, 32, 32, 2.2, it.jenis, RARITY[it.rar].warna), 40);
      tl.addEventListener('click', () => openInvSheet(it.uid)); grid.appendChild(tl);
    }
    if (invSheetUid != null) { if (invCards[invSheetUid]) openInvSheet(invSheetUid, true); else closeInvSheet(); }
  }
  function refreshInv() {
    if (invSignature() !== invSig) buildInv();
    document.querySelectorAll('#invList .fg').forEach(b => { const it = save.items.find(x => x.uid === Number(b.dataset.uid)); if (!it) return; const c = forgeCost(it); b.innerHTML = 'Tempa ' + coin + fmt(c); b.disabled = save.gold < c; });
  }
  $('sell0').addEventListener('click', () => { const r = sellAllBelow(save, 0); afterChange(r.msg, r.ok); });
  $('sell1').addEventListener('click', () => { const r = sellAllBelow(save, 1); afterChange(r.msg, r.ok); });
  $('autoEquip').addEventListener('click', () => { const n = autoEquipBest(save); afterChange(n ? n + ' item terbaik dipasang pada pasukan dan pagar' : 'Sudah memakai item terbaik', true); });
  const INVF = ['semua'].concat(ITEM_JENIS); INVF.forEach(f => $('f_' + f).addEventListener('click', () => { invFilter = f; INVF.forEach(g => $('f_' + g).setAttribute('aria-pressed', g === f)); refreshInv(); }));
  $('fuseAllBtn').addEventListener('click', () => showModal('Gabung item', '<p>3 item <b>jenis &amp; tahap sama</b> (tidak dipasang, tidak berkunci 🔒) → 1 item tahap seterusnya. Level tertinggi dikekalkan.</p>', [['Gabung hingga Epik (T4)', () => { const r = fuseAll(save, 2); invSig = ''; afterChange(r.msg, r.ok); }, 'btn'], ['Gabung hingga Mitos (T6)', () => { const r = fuseAll(save, 4); invSig = ''; afterChange(r.msg, r.ok); }, 'btn ghost'], ['Gabung semua tahap', () => { const r = fuseAll(save, 8); invSig = ''; afterChange(r.msg, r.ok); }, 'btn ghost'], ['Batal', null, 'btn ghost']]));


  // ---------- v7.3: jadual kadar ----------
  function rarRatesHtml(minRar) {
    const d = rarityDist(minRar, save.shop.luck);
    return '<div class="rates">' + RARITY.map((r, i) => d[i] > 0 ? '<span style="--rc:' + r.warna + '"><b>T' + (i + 1) + '</b> ' + r.nama + '<i>' + pctTxt(d[i]) + '</i></span>' : '').join('') + '</div>' + (save.shop.luck ? '<p class="muted rnote">Termasuk Jimat Tuah Lv.' + save.shop.luck + '.</p>' : '');
  }
  function tierRatesHtml(minTier) { const d = shardTierDist(minTier); return '<div class="rates">' + TIERS.map((T0, i) => d[i] > 0 ? '<span style="--rc:' + T0.warna + '"><b>' + T0.nama + '</b><i>' + pctTxt(d[i]) + '</i></span>' : '').join('') + '</div><p class="muted rnote">Peluang setiap shard. Hero tier rendah lebih kerap.</p>'; }
  function pctTxt(p) { return (p * 100).toFixed(p < 0.001 ? 3 : p < 0.01 ? 2 : 1) + '%'; }
  function addRateToggle(el, html) { const b = document.createElement('button'); b.className = 'btn ghost rtg'; b.textContent = 'ⓘ Kadar'; const box = document.createElement('div'); box.className = 'rbox'; box.hidden = true; b.addEventListener('click', () => { box.hidden = !box.hidden; if (!box.hidden) box.innerHTML = html(); b.textContent = box.hidden ? 'ⓘ Kadar' : '✕ Tutup kadar'; }); el.querySelector('.info').appendChild(b); el.appendChild(box); return box; }

  // ---------- tab KEDAI ----------
  const shopEls = {};
  function buildHeroShop() {
    const box = $('shopHero'); box.innerHTML = '';
    Object.keys(HERO_CHESTS).forEach(id => {
      const c = HERO_CHESTS[id], el = document.createElement('div'); el.className = 'card shop';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(c.nama) + '</h3><p>' + esc(c.desc) + '</p></div><button class="btn buy gemb">' + gem + c.harga + '</button>';
      paintIcon(el.querySelector('canvas'), ICONS['h_' + id], 48);
      el.querySelector('.buy').addEventListener('click', () => openChestFx('hero', id, 1));
      addRateToggle(el, () => tierRatesHtml(c.minTier));
      shopEls['h_' + id] = el; box.appendChild(el);
    });
    { const el = document.createElement('div'); el.className = 'card shop';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(SKIN_CHEST.nama) + '</h3><p>' + esc(SKIN_CHEST.desc) + '.</p><p class="kc muted"></p></div><button class="btn buy gemb">' + gem + SKIN_CHEST.harga + '</button>';
      paintIcon(el.querySelector('canvas'), c => { iconBg(c, '#FFE0F0', '#C8508A'); c.save(); c.translate(0, 4); drawHero(c, 32, 30, 'pahlawan', -Math.PI / 4, 0, 0.9, 'pistol', { t: 0.5, phase: 0, mood: 'main', skin: SKINS.find(s => s.hero === 'pahlawan' && s.rar === 1) }); c.restore(); label(c, 'UR', 50, 16, 11, '#FFE07A'); }, 48);
      el.querySelector('.buy').addEventListener('click', () => openChestFx('skin', 'kostum', 1));
      addRateToggle(el, () => '<div class="rates"><span style="--rc:#A066E8"><b>SR</b>' + SKINS.filter(s => !s.rar).length + ' kostum<i>80%</i></span><span style="--rc:#F2C230"><b>UR</b>' + SKINS.filter(s => s.rar).length + ' kostum<i>20%</i></span></div><p class="muted rnote">Setiap kostum sama peluang dalam tahapnya. Pendua menaikkan ★ (maksimum ' + SKIN_MAX_STAR + '); selepas itu +50 gems. Boss besar: 3% peluang kostum.</p>');
      shopEls.k_kostum = el; box.appendChild(el); }
  }
  function buildShop() {
    const up = $('shopUp'); up.innerHTML = '';
    SHOP_ORDER.forEach(id => {
      const s = SHOP[id], el = document.createElement('div'); el.className = 'card shop';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(s.nama) + ' <span class="lv"></span></h3><p>' + esc(s.desc) + '</p></div><button class="btn buy"></button>';
      paintIcon(el.querySelector('canvas'), ICONS['s_' + id], 48);
      el.querySelector('button').addEventListener('click', () => { const r = buyShop(save, id); if (r.ok && id === 'wall' && !running) { persist(); newBattle(battle.stage); introOverlay(); } afterChange(r.msg, r.ok); });
      shopEls['s_' + id] = el; up.appendChild(el);
    });
    const bo = $('shopBoost'); bo.innerHTML = '';
    BOOST_ORDER.forEach(id => {
      const b = BOOSTS[id], el = document.createElement('div'); el.className = 'card shop';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(b.nama) + ' <span class="lv"></span></h3><p>' + esc(b.desc) + ' selama ' + b.minit + ' minit (bertindan)</p></div><button class="btn buy gemb">' + gem + b.harga + '</button>';
      paintIcon(el.querySelector('canvas'), ICONS['b_' + id], 48);
      el.querySelector('button').addEventListener('click', () => { const r = buyBoost(save, id, Date.now()); afterChange(r.msg, r.ok); });
      shopEls['b_' + id] = el; bo.appendChild(el);
    });
    const ch = $('shopChest'); ch.innerHTML = '';
    Object.keys(CHESTS).forEach(id => {
      const c = CHESTS[id], el = document.createElement('div'); el.className = 'card shop';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(c.nama) + '</h3><p>' + esc(c.desc) + '</p></div><button class="btn buy"></button>';
      paintIcon(el.querySelector('canvas'), ICONS['c_' + id], 48);
      el.querySelector('.buy').addEventListener('click', () => openChestFx('item', id, 1));
      addRateToggle(el, () => rarRatesHtml(c.minRar) + (id === 'emas' ? '<p class="rnote"><b>Jaminan:</b> jika ' + PITY_N + ' Peti Emas berturut-turut tiada Mitos (T6+), peti seterusnya pasti Mitos ke atas.</p>' : ''));
      if (id === 'emas') { const p = document.createElement('p'); p.className = 'pity'; el.querySelector('.info').appendChild(p); }
      shopEls['c_' + id] = el; ch.appendChild(el);
    });
  }
  const mmss = ms => { const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  function refreshShop() {
    const now = Date.now();
    SHOP_ORDER.forEach(id => { const s = SHOP[id], el = shopEls['s_' + id], lvl = save.shop[id], c = shopCost(id, lvl), b = el.querySelector('button'); el.querySelector('.lv').textContent = 'Lv.' + lvl; b.innerHTML = 'Beli ' + cur(s.mata) + fmt(c); b.disabled = save[s.mata] < c; });
    BOOST_ORDER.forEach(id => { const el = shopEls['b_' + id], left = (save.boost[id] || 0) - now; el.querySelector('.lv').textContent = left > 0 ? 'aktif ' + mmss(left) : ''; el.querySelector('button').disabled = save.gems < BOOSTS[id].harga; });
    Object.keys(HERO_CHESTS).forEach(id => { shopEls['h_' + id].querySelector('.buy').disabled = save.gems < HERO_CHESTS[id].harga; }); if (shopEls.k_kostum) { shopEls.k_kostum.querySelector('.buy').disabled = save.gems < SKIN_CHEST.harga; shopEls.k_kostum.querySelector('.kc').textContent = 'Koleksi ' + skinCount(save) + '/' + SKINS.length + ' · +' + skinCount(save) + '% damage semua hero'; }
    { const pe = shopEls.c_emas && shopEls.c_emas.querySelector('.pity'); if (pe) pe.textContent = '🎯 Jaminan Mitos dalam ' + (PITY_N - (save.pity.emas || 0)) + ' peti lagi'; }
    Object.keys(CHESTS).forEach(id => { const c = CHESTS[id], cost = chestCost(id, effBest(save)), b = shopEls['c_' + id].querySelector('.buy'); b.innerHTML = 'Buka ' + cur(c.mata) + fmt(cost); b.disabled = save[c.mata] < cost; });
  }
  function refreshBoostChips() {
    const now = Date.now(), on = BOOST_ORDER.filter(id => boostOn(save, id, now));
    $('boostChips').innerHTML = on.map(id => '<span class="chip">' + esc(BOOSTS[id].nama) + ' ' + mmss(save.boost[id] - now) + '</span>').join('');
  }

  function refreshAll() {
    $('gold').textContent = fmt(save.gold); $('gems').textContent = fmt(save.gems);
    refreshHeroes(); refreshInv(); refreshShop(); refreshWpnShop(); refreshBoostChips(); tapakWatch();
    if (!$('pane_senjata').hidden) refreshWeapons();
    if (!$('pane_kuasa').hidden) refreshPowers();
    if (!$('pane_ensiklo').hidden) buildEnc();
    if (!$('pane_trofi').hidden) refreshAch();
    if (!$('pane_harian').hidden) refreshHarian();
    if (!$('pane_arena').hidden) refreshArena();
    $('rohChip').hidden = !save.rohTotal; $('roh').textContent = fmt(save.roh);
    $('gemChip').classList.toggle('dot', freeGemsReady(save, Date.now())); refreshIapShop(); $('supBadge').hidden = !save.supporter; checkAchReady(); refreshDots(); refreshExped(); checkTips(); refreshHub(); refreshNav(); refreshHeroGrid(); $('tab_lagi').classList.toggle('dot', needBackup(save, Date.now()));
    const evR = refreshEvent(); const dr = dailyReady() + evR; const arN = ACH.filter(a => achReady(save, a)).length; $('tab_ganjaran').textContent = dr + arN ? 'Ganjaran (' + (dr + arN) + ')' : 'Ganjaran'; $('tab_ganjaran').classList.toggle('badge', dr + arN > 0); $('tab_harian').textContent = dr ? 'Harian (' + dr + ')' : 'Harian'; $('tab_harian').classList.toggle('badge', dr > 0);
    buildPowerBar();
    if (!$('pane_pagar').hidden) refreshWalls();
    $('stats').textContent = 'Stage tertinggi dibuka: ' + save.best + '. Zombie ditewaskan: ' + fmt(save.kills) + '. Gold semasa offline: ' + fmt(idleRate(save.best) * (1 + 0.15 * save.shop.magnet) * 60) + ' seminit (had 8 jam).';
  }
  const TABS = ['hero', 'senjata', 'kuasa', 'pagar', 'beg', 'ekspedisi', 'kedai', 'arena', 'harian', 'trofi', 'ensiklo', 'info'];
  const GROUP = { harian: 'ganjaran', trofi: 'ganjaran', ensiklo: 'lagi', info: 'lagi' }, lastSub = { ganjaran: 'harian', lagi: 'ensiklo' };
  function setPane(t) { TABS.forEach(n => { const on = n === t; $('tab_' + n).setAttribute('aria-selected', on); $('pane_' + n).hidden = !on; });
    const grp = GROUP[t]; if (grp) lastSub[grp] = t; ['ganjaran', 'lagi'].forEach(g => { $('tab_' + g).setAttribute('aria-selected', grp === g); $('sub_' + g).hidden = grp !== g; }); if (t === 'senjata') refreshWeapons(); if (t === 'pagar') refreshWalls(); if (t === 'kuasa') refreshPowers(); if (t === 'ensiklo') { encSig = ''; buildEnc(); } if (t === 'trofi') refreshAch(); if (t === 'harian') refreshHarian(); if (t === 'arena') refreshArena(); if (t === 'info') refreshInfo(); }
  let toastT = null;
  const toastQ = [], notiAgg = { t: 0, sh: {}, full: 0, sold: 0 };
  function toast(msg, ok) { if (toastQ.some(m => m.msg === msg)) return; toastQ.push({ msg, ok }); while (toastQ.length > 3) toastQ.shift(); if (!toastT) nextToast(); }
  function nextToast() { const el = $('toast'), m = toastQ.shift(); if (!m) { toastT = null; el.className = 'toast'; return; } el.textContent = m.msg; el.className = 'toast show ' + (m.ok ? 'ok' : 'bad'); toastT = setTimeout(() => { el.className = 'toast'; toastT = setTimeout(nextToast, 230); }, 1900); }

