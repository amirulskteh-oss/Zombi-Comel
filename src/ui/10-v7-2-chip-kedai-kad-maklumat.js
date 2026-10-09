  // ---------- v7.2: chip kedai, kad maklumat rumah, panel naik pantas ----------
  const KS = ['up', 'hero', 'wpeti', 'boost', 'peti', 'beli']; let kedaiSec = 'up';
  function showKedai(k) { kedaiSec = k; KS.forEach(x => { $('ks_' + x).hidden = x !== k; $('kc_' + x).setAttribute('aria-selected', x === k); }); if (k === 'wpeti') { wshSig = ''; refreshWpnShop(); } }
  KS.forEach(k => $('kc_' + k).addEventListener('click', () => showKedai(k)));
  function refreshHubInfo() {
    const st = battle.stage, nb = Math.ceil(st / 10) * 10, bb = bossOf(nb, diffOf(save).off, bossDay(Date.now())), ms = save.daily.missions || [], done = ms.filter(m => m.done).length, ready = ACH.filter(a => achReady(save, a)).length;
    $('hi1').innerHTML = '<b>💰 ' + fmt(offlineGold(save, 3600)) + '</b><small>gold sejam ketika offline</small>';
    $('hi2').innerHTML = '<b>👑 ' + (bb ? esc(bb.nama) : 'Boss') + '</b><small>' + (nb === st ? 'Di stage ini!' : 'Stage ' + nb + ' · lagi ' + (nb - st) + ' stage') + '</small>';
    $('hi3').innerHTML = '<b>📅 Misi ' + done + '/' + (ms.length || 5) + '</b><small>' + (loginAvailable(save, Date.now()) ? 'Ganjaran log masuk sedia!' : 'Log masuk: hari ' + ((save.daily.streak % 7) || 7)) + '</small>';
    $('hi4').innerHTML = '<b>🏆 ' + (ready ? ready + ' trofi sedia' : 'Tahap trofi ' + trophyLevel(trophyPoints(save)).lv) + '</b><small>' + trophyCounts(save).reduce((a, b) => a + b, 0) + '/' + ACH.length * 5 + ' trofi</small>';
  }
  function openQuick() {
    const box = $('qList'); box.innerHTML = '';
    upgradeChoices(save).slice(0, 4).forEach(o => { const r = document.createElement('div'); r.className = 'qrow'; r.innerHTML = '<span>' + esc(o.label) + '</span>'; const b = document.createElement('button'); b.className = 'btn'; b.innerHTML = coin + fmt(o.cost); b.disabled = save.gold < o.cost; b.addEventListener('click', () => { const res = o.f(); afterChange(res.msg, res.ok); openQuick(); }); r.appendChild(b); box.appendChild(r); });
    $('qPanel').hidden = false;
  }
  $('qClose').addEventListener('click', () => { $('qPanel').hidden = true; });
  $('qAll').addEventListener('click', () => { const r = upgradeAll(save); afterChange(r.msg, r.ok); openQuick(); });
  ['hi1', 'hi2', 'hi3', 'hi4'].forEach((id, i) => $(id).addEventListener('click', () => { if (i === 0) setTab('kedai'); else if (i === 1) { const st = battle.stage, nb = Math.ceil(st / 10) * 10; if (nb <= save.best) { newBattle(nb); introOverlay(); hubSig = ''; refreshHub(); } else toast('👑 Boss di stage ' + nb + ': lepasi stage ' + (nb - 1) + ' untuk ke sana', false); } else if (i === 2) setTab('harian'); else setTab('trofi'); }));
  $('fortCv').addEventListener('click', fortClick);
  $('wallSlots').addEventListener('click', e => { if (!e || !e.target || !e.target.closest) return; const b = e.target.closest('[data-ws]'); if (b) { pickWall(+b.dataset.ws); return; } if (e.target.closest('#wallBestBtn')) { const r = equipBestWall(save); wallSlotSig = ''; afterChange(r.msg, r.ok); } });
  $('tower4Btn').addEventListener('click', () => { const r = buyTowerSlot(save); afterChange(r.msg, r.ok); if (r.ok) { battle.syncTeam(); } });
  $('towerAllBtn').addEventListener('click', () => { const r = upgradeAllTowers(save); afterChange(r.msg, r.ok); });
  $('wallNextBtn').addEventListener('click', () => { const r = buyWall(save); afterChange(r.msg, r.ok); });
  $('invClose').addEventListener('click', () => closeInvSheet());
  $('invList').addEventListener('click', e => { if (e && e.target && e.target.id === 'invList') closeInvSheet(); });







  // ================= v8.1: SENARAI BUNYI (halaman Uji Bunyi & ujian automatik) =================
  const SOUND_LIST = [
    ['🧟 Zombie', [['zGroan', { r: 9 }, 'Rintihan zombie kecil'], ['zGroan', { r: 16 }, 'Rintihan zombie biasa'], ['zGroan', { r: 30 }, 'Rintihan zombie gergasi'], ['zDirt', null, 'Bangkit dari tanah'], ['zHup', null, 'Pelompat'], ['zWhisper', null, 'Hantu berbisik'], ['zHeal', null, 'Penyembuh'], ['spit', null, 'Peludah'], ['clank', null, 'Perisai ditembak'], ['tick', null, 'Pengebom berdetik'], ['thud', null, 'Pagar kayu dipukul'], ['crunch', null, 'Pagar batu dipukul'], ['step', null, 'Langkah boss gergasi'], ['clangW', null, 'Pagar besi dipukul'], ['glassW', null, 'Pagar kristal dipukul'], ['kill', null, 'Zombie tumpas'], ['shatter', null, 'Pecah ais'], ['evo', null, 'Evolusi']]],
    ['👑 Boss', [['roar', 'lendir', 'Raja Lendir'], ['roar', 'jeneral', 'Jeneral Tengkorak'], ['roar', 'ratu', 'Ratu Racun'], ['roar', 'besi', 'Gergasi Besi'], ['roar', 'naga', 'Naga Zombi'], ['roar', '', 'Boss biasa'], ['warn', null, 'Amaran ❗'], ['rage', null, 'Mengamuk (50% HP)'], ['bossDie', null, 'Boss tumpas']]],
    ['🦸 Hero', [['cheer', null, 'Sorakan menang'], ['ouch', null, 'Aduh! (pagar teruk)'], ['skill', 'pistol', 'Kemahiran: Pak Usu'], ['skill', 'petir', 'Kemahiran: Petir'], ['skill', 'ratu_ais', 'Kemahiran: Ratu Ais'], ['strike', null, 'Petir Halilintar'], ['crit', null, 'Kritikal'], ['tap', null, 'Tekan zombie']]],
    ['🔫 Senjata & menara', [['shot', 'pistol', 'Pistol'], ['shot', 'shotgun', 'Shotgun'], ['shot', 'frost', 'Senjata ais'], ['shot', 'petir', 'Senjata elektrik'], ['shot', 'api', 'Senjata api'], ['tower', 'panah', 'Menara panah'], ['tower', 'meriam', 'Menara meriam'], ['tower', 'ais', 'Menara ais'], ['tower', 'petir', 'Menara petir'], ['tower', 'api', 'Menara api'], ['tower', 'racun', 'Menara racun'], ['tower', 'tepat', 'Menara penembak tepat'], ['tower', 'laser', 'Menara laser'], ['tower', 'angin', 'Menara angin'], ['tower', 'tukang', 'Menara tukang (baiki)'], ['wskill', 0, 'Kemahiran pagar'], ['wpost', 2, 'Tiang pagar dibina'], ['wbuilt', null, 'Pagar siap'], ['boom', null, 'Letupan'], ['big', null, 'Letupan besar'], ['zap', null, 'Renjatan'], ['whoosh', null, 'Semburan api'], ['hiss', null, 'Awan racun'], ['power', null, 'Kuasa']]],
    ['🖱 Antara muka', [['click', null, 'Klik'], ['swish', null, 'Tukar halaman'], ['popup', null, 'Buka kotak'], ['popdown', null, 'Tutup kotak'], ['up', null, 'Naik level'], ['star', null, 'Naik bintang'], ['equip', null, 'Pasang item'], ['fuse', null, 'Gabung item'], ['bad', null, 'Tak cukup / ralat'], ['count', null, 'Kiraan ganjaran'], ['coin', null, 'Syiling'], ['chest', null, 'Peti'], ['shard', null, 'Shard'], ['trophy', null, 'Trofi'], ['win', null, 'Menang'], ['lose', null, 'Kalah']]],
    ['🌧 Suasana (4 saat)', [['amb', 'angin', 'Angin'], ['amb', 'hujan', 'Hujan'], ['amb', 'malam', 'Malam (cengkerik)'], ['amb', 'api', 'Gunung Berapi'], ['amb', 'salji', 'Salji']]]
  ];
  if (!PLAY_BUILD) { try { window.ZC_AUDIO = { list: SOUND_LIST, attach: auAttach, sfx, AU }; } catch (e) {} } // cangkuk ujian bunyi (binaan DEV sahaja)

  let ambPrevT = null;
  function playSound(n, a) { auInit(); if (!AU.ctx) { toast('Bunyi belum tersedia. Tekan sekali lagi.', false); return; } if (n === 'amb') { ambSet(null); ambSet(a); clearTimeout(ambPrevT); ambPrevT = setTimeout(() => ambSet(null), 4000); return; } AU.last[n] = 0; sfx(n, a); }
  if (!PLAY_BUILD) try { window.ZC_AUDIO_TEST = (c, fn) => { const keep = Object.assign({}, AU); auAttach(c); AU.sfx.gain.value = 0.6; AU.vox.gain.value = 1; AU.amb.gain.value = 0.2; AU.last = {}; try { fn({ sfx, ambSet, ambTick, SOUND_LIST }); } finally { Object.keys(AU).forEach(k => delete AU[k]); Object.assign(AU, keep); } }; } catch (e) {}

  // ================= v8.1: SKRIN KEPUTUSAN BERANIMASI =================
  let ovAnim = null;
  function stepOvAnim(dt) {
    const a = ovAnim; if (!a) return; if ($('overlay').hidden) { ovAnim = null; return; }
    a.t += dt; const sh = Math.min(a.n, Math.max(0, Math.floor((a.t - 0.2) / 0.32) + 1));
    if (sh !== a.shown) { a.shown = sh; $('ovTitle').textContent = a.base + '★'.repeat(sh) + '☆'.repeat(3 - sh); if (sh) sfx('star'); }
    const p = Math.min(1, a.t / 1.1), e = 1 - Math.pow(1 - p, 3), g0 = fmt(a.gold);
    if (a.gold > 0 && a.body.includes(g0)) { $('ovBody').textContent = a.body.replace(g0, fmt(Math.round(a.gold * e))); a.tk += dt; if (p < 1 && a.tk > 0.07) { a.tk = 0; sfx('count'); } }
    if (p >= 1 && sh >= a.n) { $('ovTitle').textContent = a.base + '★'.repeat(a.n) + '☆'.repeat(3 - a.n); $('ovBody').textContent = a.body; ovAnim = null; }
  }

  // ================= v8.1: SUARA MEDAN, MENARA, SORAKAN, SUASANA =================
  let SLOWMO = 0, FLASH = 0, wallPrev = null, repairT = 0;
  function stepVoices(b, dt) {
    if (!b || screen !== 'battle') return;
    if (running) for (const z of b.zombies) {
      if (z.hp <= 0 || z.y < 10) continue;
      if (z._vt == null) z._vt = 2 + Math.random() * 9; z._vt -= dt;
      if (z._vt <= 0) { z._vt = 6 + Math.random() * 10; if (z.type === 'hantu' || z.traits.includes('hantu')) sfx('zWhisper', null, z.x); else if (z.type === 'boss') { if (Math.random() < 0.35) sfx('zGroan', { r: 34 }, z.x); } else sfx('zGroan', z, z.x); }
      if (z.hop > 0.3 && !z._hupS) { z._hupS = 1; sfx('zHup', null, z.x); } else if (!(z.hop > 0)) z._hupS = 0;
      if (z.traits.includes('pengebom') && !z.boomed && z.y > WALL_Y - 90) { z._tk = (z._tk || 0) - dt; if (z._tk <= 0) { z._tk = 0.45; sfx('tick', null, z.x); } }
      if (z.type === 'boss' && !z._ph && z.hp < z.maxHp * 0.5) { z._ph = 1; sfx('rage', null, z.x); b.fx.push({ kind: 'txt', x: z.x, y: z.y - z.r - 30, t: 0, txt: 'MENGAMUK!', warna: '#FF5A5A' }); }
    }
    for (const t of b.towers || []) { if (t.recoil > 0.1 && !t._snd) { t._snd = 1; sfx('tower', t.type, t.x); } else if (!(t.recoil > 0.04)) t._snd = 0; }
    const wl = b.wall; if (wallPrev != null && b === lastVoxB) { if (wallPrev - wl > b.wallMax * 0.08) sfx('ouch'); else if (wl - wallPrev > b.wallMax * 0.004 && wl < b.wallMax) { repairT += dt; if (repairT > 0.35 && !LOWFX) { repairT = 0; emit(Math.random() * W, WALL_Y - 10, 5, { a: -Math.PI / 2, spread: 0.8, spd: 50, warna: ['#7CF0A8', '#FFFFFF'], size: 2.5, life: 0.6, grav: -20, shape: 'star' }); } } }
    wallPrev = wl; lastVoxB = b;
    if (b.state === 'menang' && !b._cheer) { b._cheer = 1; sfx('cheer'); }
    ambSet(save.settings.amb > 0 ? ambKindFor(b.stage) : null);
  }
  let lastVoxB = null;

  // ================= v8.0: PEMBELIAN DALAM APLIKASI (Google Play Billing via Digital Goods API) =================
  // Ikut dokumentasi Chrome: getDigitalGoodsService → getDetails (harga) → PaymentRequest (beli) → consume (akui).
  // Tiada pelayan: produk gems di-consume selepas ganjaran disimpan (consume juga memenuhi syarat 'acknowledge').
  // v9.16: produk SEKALI BELI (Penyokong, Tangan Pembantu) TIDAK di-consume supaya Google Play mengingatnya —
  // listPurchases memulihkannya di telefon baharu. Ia di-acknowledge jika API menyediakan acknowledge();
  // pembelian yang tidak diakui dipulangkan wang oleh Google selepas 3 hari (SEMAK dalam ujian tertutup).
  const PLAY_BILLING = 'https://play.google.com/billing';
  const PG = { svc: null, ready: false, prices: {}, err: '' };
  let gateCtx = null;
  async function iapInit() {
    if (typeof window === 'undefined' || !('getDigitalGoodsService' in window)) { PG.err = 'web'; return; }
    try { PG.svc = await window.getDigitalGoodsService(PLAY_BILLING); if (!PG.svc) throw new Error('tiada'); } catch (e) { PG.err = 'nobilling'; return; }
    try { const d = await PG.svc.getDetails(IAP.map(p => p.id)); (d || []).forEach(it => { try { PG.prices[it.itemId] = new Intl.NumberFormat('ms-MY', { style: 'currency', currency: it.price.currency }).format(Number(it.price.value)); } catch (e) {} }); PG.ready = true; } catch (e) { PG.err = 'details'; }
    await iapRestore(); iapSig = ''; refreshAll();
  }
  // pulihkan pembelian yang belum di-consume (contohnya aplikasi tertutup semasa pembayaran)
  async function iapRestore(manual) {
    if (!PG.svc) { if (manual) toast('Pemulihan hanya dalam aplikasi Google Play', false); return; }
    try { const ps = await PG.svc.listPurchases(); let n = 0;
      for (const p of ps || []) { const r = iapGrant(save, p.itemId, p.purchaseToken); persist(); if (r.ok && !r.dup) { n++; toast(r.msg, true); } await iapSettle(p.itemId, p.purchaseToken); }
      if (manual) toast(n ? n + ' pembelian dipulihkan' : 'Tiada pembelian baharu untuk dipulihkan. Pembelian sekali beli (Penyokong, Tangan Pembantu) dipulihkan automatik daripada akaun Google Play anda.', true);
      if (n) refreshAll();
    } catch (e) { if (manual) toast('Gagal menyemak pembelian. Cuba lagi.', false); }
  }
  // gems: consume. Sekali beli: jangan consume; acknowledge jika API ada (Digital Goods API v1)
  async function iapSettle(id, tok) { if (!PG.svc || !tok) return; try { if (!iapSekali(id)) await PG.svc.consume(tok); else if (typeof PG.svc.acknowledge === 'function') await PG.svc.acknowledge(tok, 'onetime'); } catch (e) {} }
  function iapPrice(p) { return PG.prices[p.id] || p.harga; }
  // langkah 1: pintu ibu bapa
  function iapBuy(id) {
    const p = IAP.find(x => x.id === id); if (!p) return;
    if (!iapCanBuy(save, id)) { toast('Anda sudah memiliki ' + p.nama, true); return; }
    if (!PG.ready && PLAY_BUILD) { showModal('🛒 Pembelian', '<p>Pembelian hanya boleh dibuat dalam aplikasi <b>Zombi Comel</b> daripada Google Play.</p><p class="muted">Versi web kekal percuma sepenuhnya.</p>', [['OK', null, 'btn']]); return; }
    const g = gateQ(Math.random); gateCtx = { id, ans: g.ans };
    showModal('🔒 Untuk ibu bapa / penjaga', '<p>Pembelian ini menggunakan <b>wang sebenar</b> (' + esc(iapPrice(p)) + ').</p><p>Minta ibu bapa atau penjaga menjawab:</p><p class="gateq">' + g.q + ' = ?</p><input id="gateIn" class="gatein" inputmode="numeric" autocomplete="off" aria-label="Jawapan">' + (PG.ready ? '' : '<p class="muted">[DEV] Google Play Billing tiada di sini, pembelian akan disimulasi.</p>'),
      [['Teruskan', () => iapGatePass(), 'btn'], ['Batal', () => { gateCtx = null; }, 'btn ghost']]);
    setTimeout(() => { const el = document.getElementById('gateIn'); if (el && el.focus) el.focus(); }, 60);
  }
  // langkah 2: semak jawapan → terus buka pembayaran Google (dalam klik yang sama, syarat PaymentRequest)
  function iapGatePass() {
    const c = gateCtx; gateCtx = null; if (!c) return; const el = document.getElementById('gateIn'), v = el ? String(el.value || '').trim() : '';
    if (Number(v) !== c.ans) { toast('Jawapan salah. Pembelian dibatalkan.', false); sfx('bad'); return; }
    if (!PG.ready) { if (PLAY_BUILD) return; const r = iapGrant(save, c.id, 'dev-sim-' + Date.now()); afterChange('[DEV simulasi] ' + r.msg, r.ok); iapCelebrate(r); return; }
    let req; try { req = new PaymentRequest([{ supportedMethods: PLAY_BILLING, data: { sku: c.id } }], { total: { label: 'Jumlah', amount: { currency: 'MYR', value: '0' } } }); } catch (e) { toast('Pembayaran tidak disokong pada peranti ini', false); return; }
    req.show().then(async res => {
      const tok = res && res.details && res.details.purchaseToken; const r = iapGrant(save, c.id, tok); persist();   // simpan DAHULU, baru consume
      if (r.ok) await iapSettle(c.id, tok);
      try { await res.complete(r.ok ? 'success' : 'fail'); } catch (e) {}
      afterChange(r.msg, r.ok); iapCelebrate(r);
    }).catch(e => { if (!e || e.name !== 'AbortError') toast('Pembelian tidak berjaya. Tiada caj dibuat.', false); });
  }
  function iapCelebrate(r) { if (!r || !r.ok || r.dup) return; sfx(r.sup || r.tpb ? 'trophy' : 'shard'); bumpCur('gems'); iapSig = ''; }
  let iapSig = '';
  function refreshIapShop() {
    if ($('ks_beli').hidden) return; const sig = [save.supporter, save.tpb && save.tpb.own, save.iap.n, PG.ready, PG.err, JSON.stringify(PG.prices)].join('|'); if (sig === iapSig) return; iapSig = sig;
    const box = $('iapList'); box.innerHTML = '';
    $('iapStatus').textContent = PG.ready ? 'Pembayaran melalui Google Play.' : PLAY_BUILD ? 'Pembelian hanya dalam aplikasi Google Play. Versi web kekal percuma sepenuhnya.' : '[DEV] Tiada Google Play Billing di sini; pembelian disimulasi untuk ujian.';
    IAP.forEach(p => { const el = document.createElement('div'); el.className = 'card shop iapc' + (p.sekali ? ' sup' : ''); const owned = p.sekali && iapOwned(save, p.id);
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(p.nama) + (p.sekali ? ' <span class="rchip" style="background:#E5486A">sekali beli</span>' : '') + '</h3><p>' + esc(p.gems ? p.gems.toLocaleString() + ' gems untuk peti, kostum & booster' : p.desc) + '</p></div><button class="btn buy' + (owned ? ' ghost' : '') + '"' + (owned ? ' disabled' : '') + '>' + (owned ? (p.id === 'tangan_pembantu' ? 'Dimiliki 🤖' : 'Dimiliki ❤') : esc(iapPrice(p))) + '</button>';
      paintIcon(el.querySelector('canvas'), c => { if (p.id === 'tangan_pembantu') { iconBg(c, '#DDF2FF', '#3A84D0'); drawPembantu(c, 32, 34, 1.5, 0.4, 'biasa'); } else if (p.sekali) { iconBg(c, '#FFE0EA', '#E5486A'); c.save(); c.translate(0, 4); drawHero(c, 32, 30, 'pistol', -Math.PI / 4, 0, 0.9, 'pistol', { t: 0.5, phase: 0, mood: 'main', skin: SKIN_BY_ID.pistol_penyokong }); c.restore(); } else { iconBg(c, '#F0E6FF', '#A066E8'); const n = p.gems >= 1800 ? 3 : p.gems >= 850 ? 2 : 1; for (let k = 0; k < n; k++) { const x = 32 + (k - (n - 1) / 2) * 13, y = 34 - (k === 1 ? 5 : 0); c.fillStyle = '#A066E8'; c.beginPath(); c.moveTo(x - 9, y - 6); c.lineTo(x + 9, y - 6); c.lineTo(x + 13, y); c.lineTo(x, y + 13); c.lineTo(x - 13, y); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(x - 6, y - 4, 5, 3); } } }, 48);
      if (!owned) el.querySelector('.buy').addEventListener('click', () => iapBuy(p.id));
      box.appendChild(el); });
  }
  $('iapRestore').addEventListener('click', () => iapRestore(true));
  setTimeout(() => { iapInit(); }, 400);

  // ================= v7.8: DOMPET (gold & gems) + ringkasan beg =================
  let walletOpen = false;
  function showBagSummary() {
    const L0 = battle.lootL || [], sold = L0.filter(r => r < 0).length, by = {}; L0.filter(r => r >= 0).forEach(r => { by[r] = (by[r] || 0) + 1; });
    const parts = Object.keys(by).sort((a, b) => b - a).map(r => '<span style="color:' + RARITY[r].warna + ';font-weight:800">' + by[r] + ' ' + RARITY[r].nama + '</span>');
    sfx('click');
    showModal('🎒 Item pertempuran ini', L0.length ? '<p>' + (L0.length - sold) + ' item masuk beg' + (parts.length ? ': ' + parts.join(', ') : '') + '.</p>' + (sold ? '<p class="muted">' + sold + ' item dijual kerana beg penuh (' + save.items.length + '/' + INV_CAP + ').</p>' : '') : '<p class="muted">Belum ada item dalam pertempuran ini. Item jatuh daripada zombie (lebih kerap daripada zombie berevolusi) dan pasti daripada boss.</p>',
      [['Buka Beg', () => setTab('beg'), 'btn'], ['Tutup', null, 'btn ghost']]);
  }
  function walletHtml() {
    const now = Date.now(), sl = swapLeft(save, now), sc = swapCost(save), fr = freeGemsReady(save, now);
    return '<h4 class="wh">🎁 Hadiah harian</h4>' + (fr ? '<button class="btn wide" data-wf="1">Tuntut ' + gem + FREE_GEMS + ' percuma</button>' : '<p class="muted">Sudah dituntut hari ini. Datang esok untuk ' + FREE_GEMS + ' gems lagi.</p>') +
      '<h4 class="wh">💰 Beli gold dengan gems</h4><div class="wpacks">' + GOLD_PACKS.map(p => '<button class="wpack" data-gp="' + p.id + '"' + (save.gems < p.gems ? ' disabled' : '') + '><b>' + esc(p.nama) + '</b><span>' + coin + fmt(goldPackAmount(save, p)) + '</span><small>' + esc(p.label) + '</small><em>' + gem + p.gems + '</em></button>').join('') + '</div>' +
      '<h4 class="wh">💎 Tukar gold → gems</h4><button class="btn ghost wide" data-ws="1"' + (sl <= 0 || save.gold < sc ? ' disabled' : '') + '>' + coin + fmt(sc) + ' → ' + gem + GEM_SWAP.gems + ' · ' + sl + '/' + GEM_SWAP.perDay + ' hari ini</button><p class="muted" style="margin:2px 0 0">Gold 2 jam = ' + GEM_SWAP.gems + ' gems. Had ' + GEM_SWAP.perDay + ' kali sehari.</p>' +
      '<h4 class="wh">💳 Beli gems</h4><button class="btn ghost wide" data-wbuy="1">💎 Pek gems &amp; Pek Penyokong (Google Play)</button>' +
      '<h4 class="wh">🧭 Sumber gems lain</h4><div class="wsrc"><button data-wg="harian">📅 Misi harian</button><button data-wg="trofi">🏆 Trofi</button><button data-wg="ekspedisi">🌋 Ekspedisi Gunung Berapi</button><button data-wg="arena">⚔ Mod Cabaran</button></div>' +
      '<p class="muted" style="margin:8px 0 0">Boss memberi gems setiap kali dikalahkan; stage baharu memberi gems First Pass.</p>';
  }
  function openWallet() { walletOpen = true; sfx('click'); showModal('💰 Tambah gold & gems', walletHtml(), [['Tutup', () => { walletOpen = false; }, 'btn ghost']]); }
  $('mBody').addEventListener('click', e => {
    if (!walletOpen || !e || !e.target || !e.target.closest) return; let r = null;
    const gp = e.target.closest('[data-gp]'); if (gp && !gp.disabled) r = buyGoldPack(save, gp.dataset.gp);
    if (e.target.closest('[data-ws]')) r = swapGoldForGems(save, Date.now());
    if (e.target.closest('[data-wf]')) r = claimFreeGems(save, Date.now());
    const go = e.target.closest('[data-wg]'); if (go) { walletOpen = false; $('modal').hidden = true; setTab(go.dataset.wg); return; }
    if (e.target.closest('[data-wbuy]')) { walletOpen = false; $('modal').hidden = true; setTab('kedai'); $('kc_beli').click(); return; }
    if (r) { afterChange(r.msg, r.ok); if (r.ok) { sfx(r.gold ? 'chest' : 'shard'); bumpCur(r.gold ? 'gold' : 'gems'); } $('mBody').innerHTML = walletHtml(); }
  });
  function bumpCur(id) { const ch = $(id) && $(id).parentElement; if (ch && ch.classList) { ch.classList.remove('bump'); void ch.offsetWidth; ch.classList.add('bump'); } }
  $('goldChip').addEventListener('click', openWallet); $('gemChip').addEventListener('click', openWallet); $('walletOpen2').addEventListener('click', openWallet);

  // ================= v7.5: LEMBARAN HERO BAHARU =================
  let hsId = null, hsTab = 'stat', hsPreview = null, hsSig = '', hsCpV = 0, hsCpT = 0, hsCpId = null;
  function stepCp(dt) { if (!hsId || Math.abs(hsCpT - hsCpV) < 0.5) return; hsCpV += (hsCpT - hsCpV) * Math.min(1, dt * 7); if (Math.abs(hsCpT - hsCpV) < Math.max(1, hsCpT * 0.002)) hsCpV = hsCpT; $('hsCp').textContent = '⚡ Kuasa Tempur ' + fmt(Math.round(hsCpV)); }
  function sheetOrder() { const t = save.team.filter(h => save.heroes[h]); return t.concat(HERO_ORDER.filter(h => save.heroes[h] && !t.includes(h)), HERO_ORDER.filter(h => !save.heroes[h])); }
  function openHeroSheet(id) { hsId = id; hsPreview = null; hsSig = ''; $('heroSheet').hidden = false; renderSheet(); sfx('click'); }
  function closeHeroSheet() { if (!hsId) return; hsId = null; hsPreview = null; $('heroSheet').hidden = true; }
  function maxAffordable(lvl) { let k = 0, c = 0; while (k < 2000 && save.gold >= c + upCost(lvl + k)) { c += upCost(lvl + k); k++; } return k; }
  function renderSheet(force) {
    const id = hsId; if (!id) return;
    const d = HEROES[id], T0 = TIERS[d.tier], lvl = save.heroes[id], stars = save.stars[id] || 0, sh = save.shards[id] || 0, st = lvl ? heroStats(save, id, Date.now()) : null;
    const sig = [id, lvl, stars, sh, save.gold >= upCost(lvl || 1) ? 1 : 0, maxAffordable(lvl || 1), save.gems >= T0.sGem ? 1 : 0, JSON.stringify(save.equip[id] || {}), heroWeapon(save, id), save.skinOn[id] || '', JSON.stringify(save.skins), save.team.join(), hsTab, hsPreview, st ? heroCP(st) : 0, onExped(save, id) ? 1 : 0, save.items.length].join('|');
    if (!force && sig === hsSig) return; hsSig = sig;
    const pv = hsPreview ? SKIN_BY_ID[hsPreview] : heroSkin(save, id), pc = $('hsPor').getContext('2d');
    pc.setTransform(1, 0, 0, 1, 0, 0); pc.clearRect(0, 0, 160, 160); pc.scale(2.5, 2.5); drawHero(pc, 32, 36, id, -Math.PI / 4, 0, 1.15, heroWeapon(save, id), { t: 0.5, phase: 0, mood: 'main', gear: gearOf(save, id), skin: pv });
    $('hsName').textContent = d.nama;
    const ti = save.team.indexOf(id);
    $('hsMeta').innerHTML = '<span class="rchip" style="background:' + T0.warna + '">' + T0.nama + '</span> ' + (lvl ? 'Lv.' + lvl : 'Belum dibina') + (ti >= 0 ? ' · <b class="tagT">Pasukan #' + (ti + 1) + '</b>' : onExped(save, id) ? ' · 🧭 Ekspedisi' : '') + (hsPreview ? ' · <b style="color:#C8508A">Pratonton kostum</b>' : '');
    $('hsStars').innerHTML = lvl ? starRow(stars) : ''; { const K = KELAS[d.kelas], R = PERANAN[d.peranan]; $('hsKp').innerHTML = '<span class="wtg">' + K.ikon + ' ' + K.nama + ': ' + K.fam.map(f => FAM[f].ikon + ' ' + FAM[f].nama).join(' / ') + '</span><span class="wtg f" title="' + esc(R.desc) + '">' + R.ikon + ' ' + R.nama + '</span><span class="wtg u">⭐ Pakar ' + FAM[d.pakar].ikon + ' ' + FAM[d.pakar].nama + ' +30%</span>' + (lvl && heroWeapon(save, id) === 'batu' ? '<span class="wtg warnw">⚠ Tiada senjata</span>' : ''); }
    { const tgt = lvl ? heroCP(st) : 0; if (hsCpId !== id || !lvl) { hsCpV = tgt; hsCpId = id; } hsCpT = tgt; $('hsCp').textContent = lvl ? '⚡ Kuasa Tempur ' + fmt(Math.round(hsCpV)) : ''; }
    // tindakan utama
    ['hsUp', 'hsX10', 'hsMax'].forEach(k => { $(k).hidden = !lvl; });
    if (lvl) { const c = upCost(lvl), m = maxAffordable(lvl); $('hsUp').innerHTML = 'Naik ' + coin + fmt(c); $('hsUp').disabled = save.gold < c; $('hsX10').disabled = save.gold < c; $('hsMax').textContent = m > 1 ? 'MAX +' + m : 'MAX'; $('hsMax').disabled = !m; }
    const need = lvl ? (stars >= MAX_STARS ? 0 : starCost(stars + 1)) : T0.bina;
    $('hsStar').innerHTML = !lvl ? '✨ Bina hero · ' + sh + '/' + need + ' shard' : stars >= MAX_STARS ? '★ Bintang maksimum' : '★ Naik bintang ' + (stars + 1) + ' · ' + sh + '/' + need + ' shard' + (sh < need ? ' (perlu ' + (need - sh) + ' lagi)' : '');
    $('hsStar').disabled = !need || sh < need;
    // peralatan
    $('hsGearBox').hidden = !lvl;
    if (lvl) { const e = save.equip[id] || {};
      $('hsGear').innerHTML = HERO_SLOTS.map(s => { const it = itemByUid(save, e[s]); return '<button class="gs' + (it ? ' on' : '') + '" data-s="' + s + '" style="' + (it ? 'border-color:' + RARITY[it.rar].warna : '') + '" aria-label="' + SLOT_NAMA[s] + '"><canvas aria-hidden="true"></canvas><small>' + (it ? 'T' + (it.rar + 1) + ' +' + it.ilvl : SLOT_NAMA[s].split(' ')[0]) + '</small></button>'; }).join('');
      (($('hsGear').querySelectorAll && $('hsGear').querySelectorAll('.gs')) || []).forEach(b => { const it = itemByUid(save, e[b.dataset.s]); const cv = b.querySelector('canvas'); if (cv) paintIcon(cv, cc => { iconBg(cc, '#EEF2F8', it ? RARITY[it.rar].warna : '#B8C2CC'); itemGlyph(cc, 32, 32, 2.2, b.dataset.s, it ? RARITY[it.rar].warna : '#9AA6B4'); }, 34); });
      const epic = HERO_SLOTS.filter(s => { const it = itemByUid(save, e[s]); return it && it.rar >= 3; }).length, cnt = heroSetCounts(save, id), act = setBonuses(save, id);
      $('hsSet').innerHTML = '<span class="' + (st.setOn ? 'ok' : '') + '">Epik+ ' + epic + '/6' + (st.setOn ? ' ✔ +10%' : '') + '</span>' + cnt.map((n, i) => n ? '<span class="' + (n >= 2 ? 'ok' : '') + '" title="' + esc(setDesc(i)) + '">Set ' + ITEM_SETS[i].nama + ' ' + n + '/6</span>' : '').join('') + (act.length ? '<em>' + act.map(b => '+' + b.v + '% ' + SET_STAT_NAMA[b.k]).join(' · ') + '</em>' : '');
    }
    ['stat', 'kostum', 'senjata'].forEach(k => $('hst_' + k).setAttribute('aria-selected', k === hsTab));
    // kandungan tab
    let html = '';
    if (hsTab === 'stat') {
      if (!lvl) html = '<p class="muted">Bina hero ini untuk melihat stat. Shard: ' + sh + '/' + T0.bina + '. Shard jatuh daripada zombie & boss, Peti Hero, dan ekspedisi.</p>';
      else { const row = (k, v) => '<button class="strow" data-st="' + k + '"><span>' + k + '</span><b>' + v + '</b></button>';
        html = '<div class="stgrid">' + row('Damage', fmt(st.dmg)) + row('Laju', st.rate.toFixed(2) + '/s') + row('Kritikal', Math.round(st.crit * 100) + '%') + row('D. kritikal', '×' + st.critMul.toFixed(2)) + row('D. boss', '+' + st.boss + '%') + row('Tembus perisai', st.pen + '%') + row('Ketepatan', st.acc + '%') + row('Gold', '+' + st.goldPct + '%') + '</div><p class="muted" style="margin:6px 0 0">Tekan stat untuk melihat sumbernya.</p>'; }
    } else if (hsTab === 'kostum') {
      const sks = SKINS.filter(x => x.hero === id), on = heroSkin(save, id);
      html = '<div class="skgrid">' + [null].concat(sks).map(x => { const own = !x || save.skins[x.id] != null, using = x ? on === x : !on, prev = x && hsPreview === x.id;
        return '<div class="skc' + (using ? ' on' : '') + (own ? '' : ' lock') + '"><canvas data-sk="' + (x ? x.id : '') + '" aria-hidden="true"></canvas><b>' + (x ? (x.rar ? 'UR ' : 'SR ') + esc(x.theme.nama) : 'Asal') + (x && own ? ' ★' + save.skins[x.id] : '') + '</b><small>' + (x ? esc(skinDesc(x, own ? save.skins[x.id] : 0)) : 'Rupa asal') + '</small>' +
          (own ? '<button class="btn' + (using ? ' ghost' : '') + '" data-k="' + (x ? x.id : '') + '"' + (using ? ' disabled' : '') + '>' + (using ? 'Dipakai' : 'Pakai') + '</button>' : '<button class="btn ghost" data-p="' + x.id + '">' + (prev ? '✕ Tamat pratonton' : '👁 Pratonton') + '</button><small>🔒 Peti Kostum (Kedai) atau boss besar 3%</small>') + '</div>'; }).join('') + '</div>';
    } else {
      const wid = heroWeapon(save, id), wd = WEAPONS[wid], holder = {}; HERO_ORDER.forEach(h => { if (save.heroes[h]) holder[heroWeapon(save, h)] = h; });
      const sk = SKILLS[id];
      html = (lvl ? '<label class="muted" for="hsWpn">Senjata (satu senjata untuk seorang hero)</label><select id="hsWpn"><option value="batu"' + (wid === 'batu' ? ' selected' : '') + '>🪨 Tiada senjata (Baling Batu)</option>' + wpnChoices(save, id).map(w => '<option value="' + w + '"' + (w === wid ? ' selected' : '') + '>' + AFF[wAff(id, w)].ikon + ' ' + esc(WEAPONS[w].nama) + ' Lv.' + save.weapons[w] + (holder[w] && holder[w] !== id ? ' · dipakai ' + esc(HEROES[holder[w]].nama) : '') + '</option>').join('') + '</select>' : '') +
        (lvl ? (() => { const a = wAff(id, wid), A0 = AFF[a]; return '<p class="affb aff_' + a + '" style="margin:4px 0">' + A0.ikon + ' ' + A0.nama + ': ' + A0.desc + '</p><p class="muted small" style="margin:2px 0">⭐ Pakar ' + FAM[d.pakar].ikon + ' ' + FAM[d.pakar].nama + ' (+30% damage, +10% laju) · ✅ Sekelas ' + KELAS[d.kelas].fam.map(f => FAM[f].ikon + ' ' + FAM[f].nama).join(' / ') + ' (+10%) · ⚠ jenis lain −40% damage, −20% laju</p>'; })() : '') + '<p><b>' + esc(wd.nama) + '</b>: ' + esc(wd.desc) + '. Damage asas ' + wd.dmg + ', ' + wd.rate + '/s, jarak ' + wd.range + '.</p>' +
        (sk ? '<p><b>Kemahiran: ' + esc(sk.nama) + '</b> Lv.' + skillLvl(save, id) + ': ' + esc(sk.desc) + ' <span class="muted">(lebih kuat setiap 10★)</span></p>' : '') + (ULTS[id] ? '<p class="ultp"><b>' + ULTS[id].ikon + ' Ultimate: ' + esc(ULTS[id].nama) + '</b>: ' + esc(ultDesc(save, id)) + '. <span class="muted">Dicas dengan membunuh ' + ULTS[id].cas + ' zombie (boss = 10). Tekan butang bulat hero semasa bertempur, atau hidupkan Auto kuasa.</span></p>' : '');
    }
    $('hsBody').innerHTML = html;
    if (hsTab === 'kostum') (($('hsBody').querySelectorAll && $('hsBody').querySelectorAll('canvas[data-sk]')) || []).forEach(cv => { cv.width = 120; cv.height = 120; const c = cv.getContext('2d'); c.scale(1.9, 1.9); drawHero(c, 32, 34, id, -Math.PI / 4, 0, 1, heroWeapon(save, id), { t: 0.5, phase: 0, mood: 'main', gear: gearOf(save, id), skin: cv.dataset.sk ? SKIN_BY_ID[cv.dataset.sk] : null }); });
    // pilihan kecil
    $('hsMisc').hidden = !lvl;
    if (lvl) { $('hsTeam').textContent = ti >= 0 ? 'Keluar pasukan' : onExped(save, id) ? '🧭 Sedang ekspedisi' : 'Masuk pasukan'; $('hsTeam').disabled = ti < 0 && onExped(save, id); $('hsL').disabled = ti <= 0; $('hsR').disabled = ti < 0 || ti >= save.team.length - 1; }
    $('hsBuy5').innerHTML = '+5 shard ' + gem + T0.sGem; $('hsBuy5').disabled = save.gems < T0.sGem;
  }
  const hsDo = r => { afterChange(r.msg, r.ok); renderSheet(true); };
  $('hsClose').addEventListener('click', () => closeHeroSheet());
  $('heroSheet').addEventListener('click', e => { if (e && e.target && e.target.id === 'heroSheet') closeHeroSheet(); });
  $('hsPrev').addEventListener('click', () => { const o = sheetOrder(), i = o.indexOf(hsId); hsId = o[(i - 1 + o.length) % o.length]; hsPreview = null; renderSheet(true); });
  $('hsNext').addEventListener('click', () => { const o = sheetOrder(), i = o.indexOf(hsId); hsId = o[(i + 1) % o.length]; hsPreview = null; renderSheet(true); });
  $('hsUp').addEventListener('click', () => hsDo(upgradeHero(save, hsId, 1)));
  $('hsX10').addEventListener('click', () => hsDo(upgradeHero(save, hsId, 10)));
  $('hsMax').addEventListener('click', () => hsDo(upgradeHero(save, hsId, 2000)));
  $('hsStar').addEventListener('click', () => hsDo(save.heroes[hsId] ? starUp(save, hsId) : unlockHero(save, hsId)));
  $('hsBest').addEventListener('click', () => { const r = equipBestFor(save, hsId); invSig = ''; hsDo(r); if (r.ok) sfx('equip'); });
  $('hsGear').addEventListener('click', e => { const b = e && e.target && e.target.closest ? e.target.closest('.gs') : null; if (b) pickSlot(hsId, b.dataset.s); });
  ['stat', 'kostum', 'senjata'].forEach(k => $('hst_' + k).addEventListener('click', () => { hsTab = k; renderSheet(true); }));
  $('hsBody').addEventListener('click', e => { if (!e || !e.target || !e.target.closest) return;
    const k = e.target.closest('[data-k]'); if (k && !k.disabled) { hsPreview = null; hsDo(equipSkin(save, hsId, k.dataset.k)); sfx('equip'); return; }
    const p = e.target.closest('[data-p]'); if (p) { hsPreview = hsPreview === p.dataset.p ? null : p.dataset.p; renderSheet(true); return; }
    const sr = e.target.closest('.strow'); if (sr) toast(statSource(hsId, sr.dataset.st), true); });
  $('hsBody').addEventListener('change', e => { if (e && e.target && e.target.id === 'hsWpn') hsDo(equipWeapon(save, hsId, e.target.value)); });
  $('hsTeam').addEventListener('click', () => hsDo(toggleTeam(save, hsId)));
  $('hsL').addEventListener('click', () => hsDo(moveTeam(save, hsId, -1)));
  $('hsR').addEventListener('click', () => hsDo(moveTeam(save, hsId, 1)));
  $('hsBuy5').addEventListener('click', () => hsDo(buyShards(save, hsId)));

  // ================= v7.5: EKSPEDISI & LATIHAN SIMPANAN =================
  let expSig = '', expCtx = null, trainT = 0, expCanvases = [];
  const expBg = {};
  function expBackground(D) { if (expBg[D.id]) return expBg[D.id]; const cv = document.createElement('canvas'); cv.width = 640; cv.height = 170; const c = cv.getContext('2d'); c.scale(640 / W, 640 / W); c.translate(0, -120); try { drawBiome(c, D.bi, mulberry(D.bi * 31 + 7)); } catch (e) {}
    if (D.id === 'gua') { c.fillStyle = 'rgba(30,20,50,.55)'; c.fillRect(0, 0, W, H); const r = mulberry(77); for (let i = 0; i < 14; i++) { const x = r() * W, y = 140 + r() * 180, s = 8 + r() * 14, col = ['#9AA8FF', '#C080E0', '#7FD8E0'][i % 3]; c.save(); c.shadowColor = col; c.shadowBlur = 12; c.fillStyle = col; c.beginPath(); c.moveTo(x, y - s * 1.6); c.lineTo(x + s * 0.5, y); c.lineTo(x, y + s * 0.3); c.lineTo(x - s * 0.5, y); c.closePath(); c.fill(); c.restore(); } }
    return (expBg[D.id] = cv); }
  function stepExpScenes() {
    if (!expCanvases.length || $('pane_ekspedisi').hidden || !pageOpenFlag) return; const now = Date.now();
    expCanvases.forEach(cv => { const ex = save.exped[+cv.dataset.i]; if (!ex || !cv.getContext) return; const c = cv.getContext('2d'), w = 320, h = 85, D = expedDest(ex), p = Math.min(1, 1 - expedLeft(ex, now) / (ex.d * 3600000));
      c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, w, h); try { c.drawImage(expBackground(D), 0, 0, w, h); } catch (e) {}
      c.fillStyle = 'rgba(20,26,36,.25)'; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(18, 66); c.quadraticCurveTo(w / 2, 50, w - 26, 62); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#6E4520'; c.fillRect(w - 26, 34, 2.5, 30); c.fillStyle = '#E5484D'; c.beginPath(); c.moveTo(w - 23.5, 34); c.lineTo(w - 10 + Math.sin(ANIM * 5) * 1.5, 39); c.lineTo(w - 23.5, 44); c.fill();
      const done = p >= 1, x0 = 18 + p * (w - 60);
      if (done) { const o = ctx; ctx = c; lootChest(c, w - 46, 62, 1.1, 3, 0.6 + 0.4 * Math.sin(ANIM * 3), 0); ctx = o; }
      ex.h.forEach((hid, k) => { const bob = done ? -Math.abs(Math.sin(ANIM * 6 + k)) * 5 : -Math.abs(Math.sin(ANIM * 9 + k * 1.3)) * 2.5; drawHero(c, x0 - k * 16, 62 + bob, hid, done ? -Math.PI / 2 : 0, 0, 0.55, heroWeapon(save, hid), { t: ANIM, phase: k, mood: done ? 'menang' : 'main', gear: gearOf(save, hid), skin: heroSkin(save, hid) }); });
      c.fillStyle = 'rgba(20,26,36,.6)'; rr(c, 6, 6, 120, 16, 8); c.fill(); c.fillStyle = '#fff'; c.font = '800 9px "Nunito", system-ui'; c.textAlign = 'left'; c.fillText(D.ikon + ' ' + D.nama + ' · ' + Math.floor(p * 100) + '%', 12, 17); });
  }
  const dur = ms => { const m = Math.ceil(ms / 60000); return m >= 60 ? Math.floor(m / 60) + 'j ' + (m % 60) + 'm' : m + 'm'; };
  function refreshExped() {
    const now = Date.now(), done = save.exped.filter(ex => expedLeft(ex, now) <= 0).length;
    $('tab_ekspedisi').classList.toggle('dot', done > 0);
    if ($('pane_ekspedisi').hidden) return;
    const bench = benchHeroes(save), cap = benchCap(save), trainL = bench.filter(h => save.heroes[h] < cap), inEx = trainL.filter(h => onExped(save, h)).length;
    $('trainInfo').innerHTML = '📈 <b>Latihan simpanan:</b> setiap 3 minit (termasuk ketika offline), hero luar pasukan naik 1 level sehingga <b>Lv.' + cap + '</b> (50% purata pasukan). <b>' + trainL.length + ' hero sedang berlatih</b>' + (inEx ? ' (' + inEx + ' sambil ekspedisi)' : '') + '.';
    const sig = JSON.stringify(save.exped) + Math.floor(now / 30000) + save.best;
    if (sig === expSig) return; expSig = sig;
    const box = $('expList'); box.innerHTML = ''; expCanvases = [];
    for (let i = 0; i < expedSlots(save); i++) { const ex = save.exped[i], el = document.createElement('div'); el.className = 'card expc';
      if (!ex) { el.innerHTML = '<div class="info"><h3>Slot ' + (i + 1) + ' · kosong</h3><p class="muted">Hantar 1–3 hero simpanan selama 1–8 jam.</p></div><button class="btn">🧭 Hantar</button>'; el.querySelector('button').addEventListener('click', () => openExpedPick()); }
      else { const left = expedLeft(ex, now), pr = expedPreview(save, ex), pct = 100 - left / (ex.d * 36000), D = expedDest(ex), ev = expedEvents(ex).filter(e => e.at * 100 <= pct);
        el.innerHTML = '<canvas class="exsc" width="640" height="170" data-i="' + i + '" aria-hidden="true"></canvas><div class="info"><h3>' + D.ikon + ' ' + esc(D.nama) + ' · ' + ex.h.map(h => esc(HEROES[h].nama)).join(', ') + '</h3>' + (ev.length ? '<ul class="exlog">' + ev.slice(-3).map(e => '<li><b>' + dur(e.at * ex.d * 3600000) + '</b> ' + esc(e.txt) + '</li>').join('') + '</ul>' : '') + '<p>' + ex.d + ' jam · ' + (left > 0 ? 'tinggal ' + dur(left) : '<b style="color:#2E9E6A">Selesai!</b>') + '</p><div class="sbar"><div class="fill" style="width:' + Math.min(100, pct) + '%"></div><span>' + Math.floor(Math.min(100, pct)) + '%</span></div><p class="muted">Ganjaran: ' + coin + fmt(pr.gold) + ' · ' + gem + pr.gems + ' · ' + (ex.h.length * pr.shardOwn + pr.shardRand) + ' shard' + (pr.items ? ' · ' + pr.items + ' item ' + RARITY[pr.minRar].nama + '+' : '') + '</p></div><div class="acts"><button class="btn cl"' + (left > 0 ? ' disabled' : '') + '>Tuntut</button><button class="btn ghost cx">Batal</button></div>';
        el.querySelector('.cl').addEventListener('click', () => { const r = claimExped(save, i, Date.now(), Math.random); if (!r.ok) { afterChange(r.msg, false); return; } expSig = ''; persist(); refreshAll();
          playRewards('🧭 Ekspedisi selesai', [{ type: 'cur', k: 'gold', n: r.got.gold }, { type: 'cur', k: 'gems', n: r.got.gems }].concat(Object.keys(r.got.shards).map(h => ({ type: 'shard', h, n: r.got.shards[h] })), r.got.items.map(it => ({ type: 'item', it, sold: !save.items.includes(it) }))), 4); });
        el.querySelector('.cx').addEventListener('click', () => { askYes('Batalkan ekspedisi?', '<p>Tiada ganjaran akan diberi.</p>', 'Batalkan', () => { expSig = ''; afterChange(cancelExped(save, i).msg, true); }); }); }
      box.appendChild(el); const cv = ex && el.querySelector ? el.querySelector('.exsc') : null; if (cv) { cv.dataset.i = i; expCanvases.push(cv); } }
  }
  function expedPickHtml() {
    const bench = benchHeroes(save).filter(h => !onExped(save, h)), ex = { h: expCtx.sel, d: expCtx.d, dest: expCtx.dest }, pr = expedPreview(save, ex);
    return '<p class="muted" style="margin:0 0 6px">Pilih hingga 3 hero simpanan (bukan dalam pasukan). Tier lebih tinggi = ganjaran lebih besar.</p>' +
      (bench.length ? '<div class="pgrid">' + bench.map(h => '<button class="ptile ehero' + (expCtx.sel.includes(h) ? ' sel' : '') + '" data-h="' + h + '" style="border-color:' + TIERS[HEROES[h].tier].warna + '"><b>' + TIERS[HEROES[h].tier].nama + '</b><s>' + esc(HEROES[h].nama) + '</s><s>Lv.' + save.heroes[h] + '</s></button>').join('') + '</div>' : '<p>Tiada hero simpanan. Bina lebih banyak hero, atau keluarkan hero daripada pasukan.</p>') +
      '<p class="muted" style="margin:4px 0">Destinasi:</p><div class="exdest">' + EXPED_DEST.map(D => '<button data-dest="' + D.id + '"' + (D.id === expCtx.dest ? ' class="on"' : '') + '><b>' + D.ikon + ' ' + esc(D.nama) + '</b><small>' + esc(D.desc) + '</small></button>').join('') + '</div><p class="muted" style="margin:4px 0">Tempoh:</p>' +
      '<div class="psort">' + EXPED_DUR.map(d => '<button data-d="' + d + '"' + (d === expCtx.d ? ' class="on"' : '') + '>' + d + ' jam</button>').join('') + '</div>' +
      (expCtx.sel.length ? '<p><b>Ganjaran:</b> ' + coin + fmt(pr.gold) + ' · ' + gem + pr.gems + ' · ' + (expCtx.sel.length * pr.shardOwn + pr.shardRand) + ' shard' + (pr.items ? ' · ' + pr.items + ' item ' + RARITY[pr.minRar].nama + '+' : '') + '</p>' : '');
  }
  function openExpedPick() {
    expCtx = { sel: [], d: 2, dest: 'hutan' };
    showModal('🧭 Hantar ekspedisi', '', [['Mula ekspedisi', () => { const c = expCtx; expCtx = null; const r = startExped(save, c.sel, c.d, Date.now(), c.dest); expSig = ''; afterChange(r.msg, r.ok); }, 'btn'], ['Batal', () => { expCtx = null; }, 'btn ghost']]);
    $('mBody').innerHTML = expedPickHtml();
  }
  $('mBody').addEventListener('click', e => {
    if (!expCtx || !e || !e.target || !e.target.closest) return;
    const h = e.target.closest('[data-h]'); if (h) { const k = h.dataset.h, i = expCtx.sel.indexOf(k); if (i >= 0) expCtx.sel.splice(i, 1); else if (expCtx.sel.length < EXPED_MAX_HERO) expCtx.sel.push(k); $('mBody').innerHTML = expedPickHtml(); sfx('click'); return; }
    const d = e.target.closest('[data-d]'); if (d) { expCtx.d = +d.dataset.d; $('mBody').innerHTML = expedPickHtml(); return; }
    const ds = e.target.closest('[data-dest]'); if (ds) { expCtx.dest = ds.dataset.dest; $('mBody').innerHTML = expedPickHtml(); sfx('click'); }
  });

  // ================= v7.4: ANIMASI BUKA PETI =================
  let cfx = null;
  const TIER_RAR = [0, 1, 1, 2, 3, 4, 5, 6, 7, 9];   // warna tier hero → warna tahap
  function openChestFx(kind, id, n) {
    let res = [];
    if (kind === 'item') res = openChestN(save, id, n, Math.random).map(r => ({ type: 'item', it: r.it, sold: !save.items.includes(r.it) }));
    else if (kind === 'hero') { const all = openHeroChestN(save, id, n, Math.random), got = {}; all.forEach(r => Object.keys(r.got).forEach(h => { got[h] = (got[h] || 0) + r.got[h]; })); if (all.length) res = Object.keys(got).sort((a, b) => HEROES[b].tier - HEROES[a].tier).map(h => ({ type: 'shard', h, n: got[h] })); }
    else if (kind === 'wpn') { const all = openWChestN(save, id, n, Math.random, Date.now()); if (all.length && !all[0].ok) { toast(all[0].msg, false); sfx('bad'); return; } res = all.map(r => Object.assign({ type: 'wshard' }, r)); }
    else res = openSkinChestN(save, n, Math.random).map(r => ({ type: 'skin', sk: r.sk, baru: r.baru, stars: save.skins[r.sk.id], refund: r.refund }));
    if (!res.length) { const c = kind === 'item' ? CHESTS[id] : kind === 'hero' ? HERO_CHESTS[id] : SKIN_CHEST; toast((kind === 'item' && c.mata === 'gold' ? 'Gold' : 'Gems') + ' tak cukup', false); sfx('bad'); return; }
    const best = Math.max(...res.map(r => r.type === 'item' ? r.it.rar : r.type === 'shard' ? TIER_RAR[HEROES[r.h].tier] : r.type === 'wshard' ? W2RAR[r.rar] : (r.sk.rar ? 8 : 4)));
    const chestRar = kind === 'wpn' ? WCH_FX_RAR[id] : kind === 'item' ? Math.min(9, CHESTS[id].minRar + 1) : kind === 'hero' ? (id === 'legenda' ? 6 : 3) : 7;
    cfx = { kind, id, n, res, best, chestRar, t: 0, phase: 'drop', shown: 0, parts: [] }; $('cfxAgain').hidden = false; $('cfxTen').hidden = false;
    $('cfxCards').innerHTML = ''; $('chestFx').hidden = false; $('cfxBtns').hidden = true; $('cfxTitle').textContent = (kind === 'wpn' ? WCHESTS[id].nama : kind === 'item' ? CHESTS[id].nama : kind === 'hero' ? HERO_CHESTS[id].nama : SKIN_CHEST.nama) + (res.length > 1 && kind !== 'hero' ? ' ×' + res.length : '');
    persist(); refreshAll();
  }
  function playRewards(title, res, chestRar) {
    const best = Math.max(0, ...res.map(r => r.type === 'item' ? r.it.rar : r.type === 'shard' ? TIER_RAR[HEROES[r.h].tier] : 2));
    cfx = { kind: 'reward', res, best, chestRar, t: 0, phase: 'drop', shown: 0, parts: [] };
    $('cfxCards').innerHTML = ''; $('chestFx').hidden = false; $('cfxBtns').hidden = true; $('cfxTitle').textContent = title; $('cfxAgain').hidden = true; $('cfxTen').hidden = true;
  }
  function cfxCard(r) {
    const el = document.createElement('div'); el.className = 'cfxc';
    if (r.type === 'cur') { const col = r.k === 'gold' ? '#F2C230' : '#A066E8'; el.style.cssText = '--rc:' + col; el.innerHTML = '<canvas aria-hidden="true"></canvas><b>+' + fmt(r.n) + '</b><span>' + (r.k === 'gold' ? 'Gold' : 'Gems') + '</span>'; paintIcon(el.querySelector('canvas'), c => { iconBg(c, '#FFF4C0', col); if (r.k === 'gold') coinAt(c, 32, 32, 14); else { c.fillStyle = '#A066E8'; c.beginPath(); c.moveTo(20, 22); c.lineTo(44, 22); c.lineTo(52, 30); c.lineTo(32, 52); c.lineTo(12, 30); c.closePath(); c.fill(); } }, 52); return el; }
    if (r.type === 'wshard') { const w = WEAPONS[r.wid], R = W_RAR_NAMA[r.rar], own = save.weapons[r.wid], sh = wShards(save, r.wid), need = wNeed(save, r.wid);
      el.style.cssText = '--rc:' + R.warna; el.classList.toggle('hi', r.rar >= 3);
      el.innerHTML = '<canvas aria-hidden="true"></canvas><b>' + R.ikon + ' ' + R.nama + ' · +' + r.n + ' shard</b><span>' + (r.sasaran ? '🎯 ' : '') + esc(w.nama) + '</span>' + (need ? '<div class="sbar"><div class="fill" style="width:' + Math.min(100, sh / need * 100) + '%"></div><span>' + sh + '/' + need + '</span></div>' : '<small>★' + W_STAR_MAX + ' — shard jadi Debu</small>') + (r.baru ? '<em>✨ SENJATA BARU!' + (r.hero ? ' Dipasang pada ' + esc(HEROES[r.hero].nama) : '') + '</em>' : own && need && sh >= need ? '<em>★ Boleh naik bintang!</em>' : '') + '<small>+' + r.debu + ' 🧪 Debu' + (r.free ? ' · percuma hari ini' : '') + '</small>';
      paintIcon(el.querySelector('canvas'), c => weaponIcon(c, r.wid, own || 1), 52); return el; }
    if (r.type === 'item') { const it = r.it, col = RARITY[it.rar].warna; el.style.cssText = '--rc:' + col; el.classList.toggle('hi', it.rar >= 5);
      el.innerHTML = '<canvas aria-hidden="true"></canvas><b>T' + (it.rar + 1) + ' ' + esc(RARITY[it.rar].nama) + '</b><span>' + esc(itemName(it)) + '</span><small>' + esc(itemDescFull(it)) + (r.sold ? ' · beg penuh, dijual' : '') + '</small>';
      paintIcon(el.querySelector('canvas'), c => { iconBg(c, '#F4F7FA', col); itemGlyph(c, 32, 32, 2.4, it.jenis, col); }, 52); }
    else if (r.type === 'shard') { const h = r.h, T0 = TIERS[HEROES[h].tier], own = save.heroes[h], sh = save.shards[h] || 0, need = own ? starCost((save.stars[h] || 0) + 1) : T0.bina, ok = sh >= need;
      el.style.cssText = '--rc:' + T0.warna; el.classList.toggle('hi', HEROES[h].tier >= 7);
      el.innerHTML = '<canvas aria-hidden="true"></canvas><b>' + T0.nama + ' · +' + r.n + ' shard</b><span>' + esc(HEROES[h].nama) + '</span><div class="sbar"><div class="fill" style="width:' + Math.min(100, sh / need * 100) + '%"></div><span>' + sh + '/' + need + '</span></div>' + (ok ? '<em>' + (own ? '★ Boleh naik bintang!' : '✨ Hero baharu boleh dibina!') + '</em>' : '');
      const c = el.querySelector('canvas').getContext('2d'); el.querySelector('canvas').width = 104; el.querySelector('canvas').height = 104; c.scale(2, 2); drawHero(c, 26, 30, h, -Math.PI / 4, 0, 0.85, HEROES[h].wpn, { t: 0.5, phase: 0, mood: 'main' }); }
    else { const sk = r.sk, col = sk.rar ? '#F2C230' : '#A066E8'; el.style.cssText = '--rc:' + col; el.classList.toggle('hi', sk.rar === 1);
      el.innerHTML = '<canvas aria-hidden="true"></canvas><b>' + (sk.rar ? 'UR' : 'SR') + ' · ' + esc(sk.theme.nama) + '</b><span>' + esc(sk.nama) + '</span><small>' + esc(skinDesc(sk, r.stars)) + '</small><em>' + (r.baru ? '✨ BARU!' : r.refund ? '+' + r.refund + ' gems' : '★' + r.stars) + '</em>';
      const c = el.querySelector('canvas').getContext('2d'); el.querySelector('canvas').width = 104; el.querySelector('canvas').height = 104; c.scale(2, 2); drawHero(c, 26, 30, sk.hero, -Math.PI / 4, 0, 0.85, HEROES[sk.hero].wpn, { t: 0.5, phase: 0, mood: 'main', skin: sk }); }
    return el;
  }
  function cfxSkip() { if (!cfx) return; if (cfx.phase !== 'reveal') { cfx.phase = 'reveal'; cfx.t = 0; cfx.burst = true; sfx('chest'); } while (cfx.shown < cfx.res.length) $('cfxCards').appendChild(cfxCard(cfx.res[cfx.shown++])); $('cfxBtns').hidden = false; }
  function stepChestFx(dt) {
    if (!cfx) return; cfx.t += dt; const cv = $('cfxCv'), c = cv.getContext('2d'), w = 360, h = 260; c.setTransform(cv.width / w, 0, 0, cv.width / w, 0, 0); c.clearRect(0, 0, w, h);
    const R0 = RARITY[cfx.best], glowA = cfx.phase === 'reveal' ? 1 : cfx.phase === 'open' ? Math.min(1, cfx.t * 2) : 0;
    if (glowA) { const g = c.createRadialGradient(w / 2, 150, 10, w / 2, 150, 200); g.addColorStop(0, R0.warna); g.addColorStop(1, 'rgba(0,0,0,0)'); c.globalAlpha = 0.55 * glowA; c.fillStyle = g; c.fillRect(0, 0, w, h); c.globalAlpha = 1;
      c.save(); c.translate(w / 2, 150); c.rotate(ANIM * 0.4); c.fillStyle = R0.warna; c.globalAlpha = 0.25 * glowA; for (let i = 0; i < 12; i++) { c.rotate(Math.PI / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(-14, -230); c.lineTo(14, -230); c.fill(); } c.restore(); c.globalAlpha = 1; }
    let y = 150, open = 0, shake = 0;
    if (cfx.phase === 'drop') { const k = Math.min(1, cfx.t / 0.45); y = -60 + 210 * (1 - Math.pow(1 - k, 3)) + (k >= 1 ? 0 : 0); if (cfx.t > 0.45) { cfx.phase = 'shake'; cfx.t = 0; sfx('boom'); } }
    else if (cfx.phase === 'shake') { shake = 3 + cfx.t * 6; if (cfx.t > 0.9) { cfx.phase = 'open'; cfx.t = 0; sfx(cfx.best >= 5 ? 'trophy' : 'chest'); if (cfx.best >= 5) vib([60, 40, 120]); for (let i = 0; i < 40; i++) cfx.parts.push({ x: w / 2, y: 140, vx: (Math.random() - 0.5) * 320, vy: -Math.random() * 300 - 60, l: 1 + Math.random() * 0.6, col: Math.random() < 0.5 ? R0.warna : '#FFE07A' }); } }
    else { open = Math.min(1, cfx.t * 3); if (cfx.phase === 'open' && cfx.t > 0.5) { cfx.phase = 'reveal'; cfx.t = 0; } }
    if (cfx.phase === 'reveal') { cfx.rt = (cfx.rt || 0) + dt; while (cfx.shown < cfx.res.length && cfx.rt > 0.13 * cfx.shown) $('cfxCards').appendChild(cfxCard(cfx.res[cfx.shown++])); if (cfx.shown >= cfx.res.length) $('cfxBtns').hidden = false; }
    lootChest(c, w / 2, y, 4.2, cfx.chestRar, open, shake);
    for (const p of cfx.parts) { p.l -= dt; p.vy += 420 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.l > 0) { c.globalAlpha = Math.min(1, p.l); c.fillStyle = p.col; star(c, p.x, p.y, 4, 4, 1.6, p.l * 5); } }
    c.globalAlpha = 1; cfx.parts = cfx.parts.filter(p => p.l > 0);
    if (cfx.phase !== 'reveal') { c.fillStyle = 'rgba(255,255,255,.75)'; c.font = '800 13px "Nunito", system-ui'; c.textAlign = 'center'; c.fillText('Tekan untuk percepat', w / 2, h - 8); }
  }
  function closeChestFx() { cfx = null; $('chestFx').hidden = true; refreshAll(); }
  $('cfxCv').addEventListener('click', () => cfxSkip());
  $('cfxSkip').addEventListener('click', () => cfxSkip());
  $('cfxClose').addEventListener('click', () => closeChestFx());
  $('cfxAgain').addEventListener('click', () => { const k = cfx; if (k) openChestFx(k.kind, k.id, 1); });
  $('cfxTen').addEventListener('click', () => { const k = cfx; if (k) openChestFx(k.kind, k.id, 10); });

