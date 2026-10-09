  // ================= v9.16: SISTEM TAPAK TANGAN — lukisan, kesan, sub-tab Kuasa → ✋ Tapak =================
  // tapak dilihat dari atas: tapak tangan + 4 jari + ibu jari; s = skala (1 ≈ 40 px)
  function drawTapakHand(c, x, y, s, id, t, sq) {
    const T = TAPAK[id] || TAPAK.biasa, A = T.warna, D = T.gelap; t = t || 0; sq = sq || 0;
    c.save(); c.translate(x, y); c.scale(s * (1 + sq * 0.12), s * (1 - sq * 0.12));
    if (id === 'cahaya' || id === 'raja') { glow(c, id === 'raja' ? '#E0B8FF' : '#FFF2A0', 14); }
    const fill = (y0, y1) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.12, A); g.addColorStop(1, D); return g; };
    // ibu jari
    c.save(); c.translate(-13, 5); c.rotate(-0.7); c.fillStyle = fill(-8, 8); c.beginPath(); c.ellipse(0, -2, 4, 8, 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(30,20,10,.55)'; c.lineWidth = 1.4; c.stroke(); c.restore();
    // 4 jari
    for (let i = 0; i < 4; i++) { const fx = -11.4 + i * 6.3, fh = [13, 16, 15.4, 12][i]; c.fillStyle = fill(-6 - fh, 0); rr(c, fx, -5 - fh, 5.6, fh + 6, 2.8); c.fill(); c.strokeStyle = 'rgba(30,20,10,.55)'; c.lineWidth = 1.3; c.stroke(); }
    // tapak
    c.fillStyle = fill(-8, 15); rr(c, -13, -8, 26, 22, 9); c.fill(); c.strokeStyle = 'rgba(30,20,10,.55)'; c.lineWidth = 1.4; c.stroke(); noGlow(c);
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-8, 2); c.quadraticCurveTo(0, -1, 9, 3); c.moveTo(-6, 7); c.quadraticCurveTo(2, 5, 8, 9); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-5, -3, 4.5, 2, -0.3, 0, TAU); c.fill();
    if (id !== 'biasa') { c.fillStyle = D; rr(c, -13, 10, 26, 5, 2.4); c.fill(); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-11, 11, 22, 1); }   // gelang sarung
    // hiasan ikut jenis
    if (id === 'api') { for (let i = 0; i < 4; i++) { const fx = -8.6 + i * 6.3, fh = [13, 16, 15.4, 12][i]; flame(c, fx, -5 - fh, 0.28 + 0.04 * Math.sin(t * 9 + i), t + i, ['#E8401A', '#FF9A2B', '#FFF0A0']); } }
    else if (id === 'ais') { c.strokeStyle = '#FFFFFF'; c.lineWidth = 1; for (const [fx, fy] of [[-4, 2], [5, 6]]) { c.save(); c.translate(fx, fy); c.rotate(t * 0.6); for (let k = 0; k < 3; k++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-3, 0); c.lineTo(3, 0); c.stroke(); } c.restore(); } }
    else if (id === 'petir') { c.fillStyle = '#FFFFFF'; poly(c, [[1.5, -5], [-3, 3], [0, 3], [-2, 10], [4, 0], [1, 0]]); c.fill(); c.strokeStyle = 'rgba(120,90,10,.7)'; c.lineWidth = 0.8; c.stroke(); if (Math.sin(t * 13) > 0.2) { glow(c, '#8FE8FF', 8); c.strokeStyle = '#8FE8FF'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(13, -4); c.lineTo(17, -7); c.lineTo(16, -2); c.lineTo(20, -4); c.stroke(); noGlow(c); } }
    else if (id === 'angin') { c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.3; for (let k = 0; k < 2; k++) { c.beginPath(); c.arc(0, 3, 4 + k * 3.4, t * 5 + k * 2, t * 5 + k * 2 + 3.6); c.stroke(); } }
    else if (id === 'batu') { c.strokeStyle = 'rgba(40,30,20,.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-9, -4); c.lineTo(-4, 1); c.lineTo(-6, 7); c.moveTo(3, -6); c.lineTo(6, 0); c.lineTo(10, 2); c.stroke(); c.fillStyle = 'rgba(255,255,255,.25)'; circ(c, 6, 7, 1.6); circ(c, -8, 9, 1.2); }
    else if (id === 'air') { for (let k = 0; k < 3; k++) { const kk = (t * 0.9 + k / 3) % 1; c.globalAlpha = 1 - kk; c.fillStyle = '#D8F2FF'; c.beginPath(); c.ellipse(-8 + k * 8, 15 + kk * 8, 1.4, 2 + kk, 0, 0, TAU); c.fill(); } c.globalAlpha = 1; c.fillStyle = '#FFFFFF'; c.beginPath(); c.moveTo(0, -4); c.quadraticCurveTo(-4.5, 3, 0, 6); c.quadraticCurveTo(4.5, 3, 0, -4); c.fill(); }
    else if (id === 'racun') { c.fillStyle = '#FFFFFF'; circ(c, 0, 1, 4.2); c.fillRect(-2.4, 4, 4.8, 3); c.fillStyle = '#2A3A1A'; circ(c, -1.5, 0.6, 1.1); circ(c, 1.5, 0.6, 1.1); for (let k = 0; k < 2; k++) { const kk = (t + k / 2) % 1; c.globalAlpha = 1 - kk; c.fillStyle = '#B8FF6A'; circ(c, -10 + k * 18, -8 - kk * 9, 1.6); } c.globalAlpha = 1; }
    else if (id === 'emas') { c.fillStyle = '#FFF6C8'; circ(c, 0, 2, 5); c.strokeStyle = '#A87A10'; c.lineWidth = 1.2; c.stroke(); c.fillStyle = '#A87A10'; c.font = '900 7px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', 0, 2.4); if (Math.sin(t * 3) > 0.6) { c.fillStyle = '#FFFFFF'; star(c, 9, -6, 4, 3, 1, 0); } }
    else if (id === 'bayang') { c.fillStyle = '#E8D8FF'; c.beginPath(); c.arc(0, 2, 5, Math.PI * 0.5, Math.PI * 1.5); c.quadraticCurveTo(-2, 2, 0, 7); c.fill(); for (let k = 0; k < 3; k++) { const kk = (t * 0.8 + k / 3) % 1; c.globalAlpha = 0.6 * (1 - kk); c.fillStyle = '#4A2A80'; circ(c, 12 + kk * 6, 6 - kk * 8 + k, 2 + kk * 2); } c.globalAlpha = 1; }
    else if (id === 'cahaya') { c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 1.2; for (let k = 0; k < 8; k++) { const a = k * TAU / 8 + t; c.beginPath(); c.moveTo(Math.cos(a) * 3, 2 + Math.sin(a) * 3); c.lineTo(Math.cos(a) * 6, 2 + Math.sin(a) * 6); c.stroke(); } c.fillStyle = '#FFFFFF'; circ(c, 0, 2, 2.4); }
    else if (id === 'raja') { c.fillStyle = '#FFD24A'; poly(c, [[-7, 5], [-7, -3], [-3.5, 1], [0, -5], [3.5, 1], [7, -3], [7, 5]]); c.fill(); c.strokeStyle = '#8A5A10'; c.lineWidth = 0.9; c.stroke(); c.fillStyle = '#FF5AA0'; circ(c, 0, 2.4, 1.6); c.fillStyle = '#7AE8FF'; circ(c, -4.4, 3, 1); circ(c, 4.4, 3, 1); }
    c.restore();
  }
  // kesan tapak di tanah
  function palmPrint(c, x, y, s, id, a) { const T = TAPAK[id] || TAPAK.biasa; c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s * 0.55); c.fillStyle = id === 'biasa' ? 'rgba(90,60,30,.55)' : T.gelap; rr(c, -12, -7, 24, 19, 8); c.fill(); for (let i = 0; i < 4; i++) { rr(c, -10.6 + i * 6.1, -5 - [12, 15, 14, 11][i], 5, [12, 15, 14, 11][i], 2.5); c.fill(); } c.beginPath(); c.ellipse(-14, 3, 3, 6, -0.7, 0, TAU); c.fill(); c.restore(); }
  // Tangan Pembantu: tangan kecil bersayap dengan mata comel
  function drawPembantu(c, x, y, s, t, id) {
    c.save(); c.translate(x, y + Math.sin(t * 4) * 2 * s); c.scale(s, s);
    for (const d of [-1, 1]) { c.save(); c.translate(d * 9, -2); c.rotate(d * (0.35 + Math.sin(t * 18) * 0.35)); c.fillStyle = 'rgba(255,255,255,.92)'; c.beginPath(); c.ellipse(d * 6, -3, 7, 4, d * -0.4, 0, TAU); c.fill(); c.strokeStyle = 'rgba(80,120,180,.7)'; c.lineWidth = 0.9; c.stroke(); c.restore(); }
    drawTapakHand(c, 0, 0, 0.5, id || 'biasa', t, 0);
    c.fillStyle = '#FFFFFF'; circ(c, -2.6, 2, 2.3); circ(c, 2.6, 2, 2.3); c.fillStyle = '#1A1E26'; circ(c, -2.3, 2.4, 1.2); circ(c, 2.9, 2.4, 1.2); c.fillStyle = '#FFFFFF'; circ(c, -1.9, 1.9, 0.45); circ(c, 3.3, 1.9, 0.45);
    c.strokeStyle = '#1A1E26'; c.lineWidth = 0.8; c.beginPath(); c.arc(0.2, 4.6, 1.4, 0.2, Math.PI - 0.2); c.stroke(); c.fillStyle = 'rgba(255,120,150,.5)'; circ(c, -5, 4.4, 1.1); circ(c, 5.4, 4.4, 1.1);
    c.restore();
  }
  // lukisan Tangan Pembantu di medan (terbang ke sasaran terakhir)
  const PB_DRAW = { x: W - 60, y: WALL_Y - 120 };
  function drawPembantuField(b) {
    const P = save.tpb; if (!P || !P.own || !P.on || !b || b.state !== 'main') return;
    const tg = b.pbPos || { x: W - 60, y: WALL_Y - 120 }; PB_DRAW.x += (tg.x + 26 - PB_DRAW.x) * 0.12; PB_DRAW.y += (tg.y - 34 - PB_DRAW.y) * 0.12;
    drawPembantu(ctx, PB_DRAW.x, PB_DRAW.y, 1.15, ANIM, tapakPakai(save));
  }

  // ---------- sub-tab Kuasa → ✋ Tapak ----------
  let tapakSig = '', tapakKnown = null; const tapakEls = {};
  function showKuasaSub(k) { ['pow', 'tapak'].forEach(x => { $('kqs_' + x).hidden = x !== k; $('kq_' + x).setAttribute('aria-selected', x === k); }); if (k === 'tapak') { tapakSig = ''; refreshTapak(); } }
  function tapakDapatTxt(id, own) { const d = TAPAK[id].dapat; if (own) return ''; if (d.j === 'gems') return 'Beli dengan ' + d.n + ' gems'; if (d.j === 'stat') return '🔒 ' + d.t + ' (' + fmt(Math.min(d.n, save.stats[d.k] || 0)) + '/' + fmt(d.n) + ')'; return '🔒 ' + d.t; }
  function buildTapakUI() {
    ['pow', 'tapak'].forEach(k => $('kq_' + k).addEventListener('click', () => showKuasaSub(k)));
    const box = $('tapakBox'); box.innerHTML = '';
    const top = document.createElement('div'); top.className = 'panelbox tapaktop'; top.innerHTML = '<div class="wsum"><canvas class="tpbig" aria-hidden="true"></canvas><div class="tpinfo"></div></div><div class="row2"><button class="btn" id="tapakBoss">🎯 Pasang untuk boss</button><button class="btn ghost" id="tapakHelp">❓ Jurus kombo</button></div>'; box.appendChild(top); tapakEls.top = top;
    const pb = document.createElement('div'); pb.className = 'card shop tpbcard'; pb.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>🤖 Tangan Pembantu</h3><p class="tpbtxt"></p></div><button class="btn tpbbtn"></button>'; box.appendChild(pb); tapakEls.pb = pb;
    paintIcon(pb.querySelector('canvas'), c => { iconBg(c, '#DDF2FF', '#3A84D0'); drawPembantu(c, 32, 34, 1.5, 0.4, 'biasa'); }, 48);
    pb.querySelector('.tpbbtn').addEventListener('click', () => { if (save.tpb.own) { save.tpb.on = !save.tpb.on; persist(); tapakSig = ''; refreshTapak(); toast('🤖 Tangan Pembantu: ' + (save.tpb.on ? 'hidup' : 'mati'), true); sfx('click'); } else { setTab('kedai'); showKedai('beli'); } });
    const h = document.createElement('h3'); h.className = 'sec'; h.textContent = '🧤 12 Sarung Tapak'; box.appendChild(h);
    const list = document.createElement('div'); box.appendChild(list);
    TAPAK_ORDER.forEach(id => { const T = TAPAK[id], el = document.createElement('div'); el.className = 'card shop tpc' + (T.mitos ? ' mitos' : '');
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + T.ikon + ' ' + esc(T.nama) + ' <span class="lv"></span></h3><p>' + ELEMEN[T.el].ikon + ' ' + ELEMEN[T.el].nama + ' · ' + esc(T.desc) + '</p><p class="muted st"></p></div><div class="acts"><button class="btn up"></button><button class="btn ghost pk"></button></div>';
      paintIcon(el.querySelector('canvas'), c => { iconBg(c, '#FFF6EA', T.gelap); drawTapakHand(c, 32, 36, 0.95, id, 0.5, 0); }, 48);
      el.querySelector('.up').addEventListener('click', () => { const r = tapakOk(save, id) ? upgradeTapak(save, id) : buyTapak(save, id); if (r.ok) sfx('up'); afterChange(r.msg, r.ok); tapakSig = ''; });
      el.querySelector('.pk').addEventListener('click', () => { const r = equipTapak(save, id); if (r.ok) sfx('click'); afterChange(r.msg, r.ok); tapakSig = ''; });
      tapakEls[id] = el; list.appendChild(el); });
    $('tapakBoss').addEventListener('click', () => { const st0 = battle && !battle.chal ? battle.stage : save.stage, B = bossOf(st0, diffOf(save).off, bossDay(Date.now())), tr = st0 + diffOf(save).off < 10 ? [] : bossTraits(B.id), id = tapakForBoss(save, BOSS_ZEL[B.elem && B.elem.id] || null, tr), r = equipTapak(save, id); afterChange(r.ok ? '🎯 ' + r.msg + ' untuk boss ' + B.nama : r.msg, r.ok); tapakSig = ''; });
    $('tapakHelp').addEventListener('click', () => showModal('✋ Jurus kombo', '<p><b>×10 Tampar Berganda</b>: setiap tekanan juga kena 1 zombie berdekatan (50% damage).</p><p><b>×25 Tapak Berangkai</b>: kesan elemen sarung tapak jadi 2 kali ganda.</p><p><b>×50 Tapak Gergasi Berkuasa</b>: bila bar ✋ penuh (' + STOMP_EVERY + ' tekanan) semasa kombo ×50 ke atas, Tapak Gergasi ×1.5 lebih kuat.</p><p class="muted">Elemen sarung tapak ikut carta elemen: KUAT ×1.5, LEMAH ×0.6. Boss 👆 Tahan Ketik tetap tidak boleh ditekan. Bonus sarung tapak (level × elemen) dihadkan ×' + TAPAK_CAP + '.</p>', [['OK', null, 'btn']]));
  }
  function tapakWatch() { tapakSync(save); const k = TAPAK_ORDER.filter(id => save.tapak.own[id]).join(','); if (tapakKnown !== null && k !== tapakKnown) { const old = tapakKnown.split(','); TAPAK_ORDER.filter(id => save.tapak.own[id] && !old.includes(id)).forEach(id => { toast('🧤 Sarung tapak baharu: ' + TAPAK[id].ikon + ' ' + TAPAK[id].nama + '! Pakai di Kuasa → ✋ Tapak', true); sfx('trophy'); }); persist(); } tapakKnown = k; }
  function refreshTapak() {
    tapakWatch(); if (!tapakEls.top || $('kqs_tapak').hidden || $('pane_kuasa').hidden) return;
    const cur = tapakPakai(save), sig = [cur, save.gold >= 0 ? Math.floor(Math.log10(save.gold + 1) * 20) : 0, save.gems, JSON.stringify(save.tapak), save.tpb.own, save.tpb.on, save.stats.taps, save.stats.maxCombo, save.stats.stomps, save.best].join('|'); if (sig === tapakSig) return; tapakSig = sig;
    const T = TAPAK[cur], E = ELEMEN[T.el];
    paintIcon(tapakEls.top.querySelector('canvas'), c => { iconBg(c, '#FFF6EA', T.gelap); drawTapakHand(c, 32, 36, 1, cur, 0.5, 0); }, 72);
    tapakEls.top.querySelector('.tpinfo').innerHTML = '<p><b>Dipakai: ' + T.ikon + ' ' + esc(T.nama) + '</b> · Lv.' + tapakLvl(save, cur) + '</p><p>' + E.ikon + ' ' + E.nama + (E.kuat.length ? ' · Kuat lawan: ' + E.kuat.map(z => (ZEL_IKON[z] || '') + z).join(', ') : '') + '</p><p>Damage tekan ×' + tapakMult(save, cur).toFixed(2) + ' · ' + esc(T.desc) + '</p><p class="muted">Bar ✋ di medan: ' + (battle && battle.tapCharge || 0) + '/' + STOMP_EVERY + ' menuju Tapak Gergasi</p>';
    { const own = save.tpb.own, b = tapakEls.pb.querySelector('.tpbbtn'); tapakEls.pb.querySelector('.tpbtxt').textContent = own ? 'Menekan zombie paling hampir dengan pagar 3 kali sesaat, memakai sarung tapak anda. Tidak dikira untuk misi & trofi tekan.' : 'Tekan zombie automatik 3 kali sesaat. Pembelian sekali (' + iapPrice(IAP.find(p => p.id === 'tangan_pembantu')) + ') di Kedai → Beli, dengan pintu ibu bapa.'; b.textContent = own ? (save.tpb.on ? '🤖 Hidup' : '💤 Mati') : 'Lihat di Kedai'; b.className = 'btn tpbbtn' + (own && !save.tpb.on ? ' ghost' : ''); b.setAttribute('aria-pressed', own ? String(save.tpb.on) : 'false'); }
    TAPAK_ORDER.forEach(id => { const el = tapakEls[id], ok = tapakOk(save, id), l = tapakLvl(save, id), up = el.querySelector('.up'), pk = el.querySelector('.pk'), D = TAPAK[id].dapat;
      el.classList.toggle('locked', !ok); el.classList.toggle('on', id === cur); el.querySelector('.lv').textContent = ok ? 'Lv.' + l : '';
      el.querySelector('.st').textContent = ok ? 'Damage ×' + tapakMult(save, id).toFixed(2) + (l < TAPAK_MAX ? ' → ×' + ((TAPAK[id].dmg || 1) * (1 + 0.05 * l)).toFixed(2) : ' (maksimum)') : tapakDapatTxt(id, false);
      if (ok) { if (l >= TAPAK_MAX) { up.textContent = 'MAKS'; up.disabled = true; } else { const c = tapakCost(id, l); up.innerHTML = 'Naik ' + coin + fmt(c); up.disabled = save.gold < c; } up.hidden = false; pk.hidden = false; pk.textContent = id === cur ? '✔ Dipakai' : 'Pakai'; pk.disabled = id === cur; }
      else if (D.j === 'gems') { up.hidden = false; up.innerHTML = 'Beli ' + gem + D.n; up.disabled = save.gems < D.n; pk.hidden = true; }
      else { up.hidden = true; pk.hidden = true; } });
  }
  if (typeof window !== 'undefined') window.__TAPAK_DRAW = { drawTapakHand, drawPembantu, palmPrint };   // untuk lembaran semakan lukisan
  // v9.17: tekan ikon ✋ di medan → kad ringkas (ganti toast panjang)
  function tapakImg(id, px) { try { const cv = document.createElement('canvas'); cv.width = cv.height = px; const c = cv.getContext('2d'); if (!c || !cv.toDataURL) return ''; drawTapakHand(c, px / 2, px * 0.56, px / 46, id, 0.5, 0); return cv.toDataURL(); } catch (e) { return ''; } }
  function showTapakInfo() {
    const id = tapakPakai(save), T = TAPAK[id], E = ELEMEN[T.el], ch = (battle && battle.tapCharge) || 0, src = tapakImg(id, 128);
    showModal('✋ Tapak Tangan', '<div class="tpinfo2">' + (src ? '<img src="' + src + '" width="64" height="64" alt="">' : '') + '<div><p style="margin:0"><b>' + T.ikon + ' ' + esc(T.nama) + '</b> · Lv.' + tapakLvl(save, id) + '</p><p class="muted" style="margin:2px 0 0">' + E.ikon + ' ' + E.nama + ' · ' + esc(T.desc) + '</p></div></div>' +
      '<p style="margin:10px 0 0"><b>Tapak Gergasi</b> ' + ch + '/' + STOMP_EVERY + '</p><div class="tpbar"><i style="width:' + Math.round(100 * ch / STOMP_EVERY) + '%"></i></div>' +
      '<ul class="tpjurus"><li>👆 Tekan <b>di mana-mana</b> pada medan. Kena zombie = damage penuh + kombo. Tekan tanah = gelombang kecil 50%.</li><li>👋 Kombo ×10: tampar zombie kedua</li><li>✨ Kombo ×25: kesan elemen ganda</li><li>💪 Kombo ×50: Tapak Gergasi ×1.5</li></ul>',
      [['🧤 Tukar tapak', () => { setTab('kuasa'); showKuasaSub('tapak'); }, 'btn'], ['Tutup', null, 'btn ghost']]);
  }
