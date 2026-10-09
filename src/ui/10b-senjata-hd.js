
  // ================= v8.9: SENJATA HD (contoh: Pistol, Minigun, Tesla, Roket) + evolusi + pameran =================
  // Koordinat: pemegang di (0,0), laras ke arah +x sepanjang L. Semua dilukis dengan kecerunan, garis luar & kilauan.
  const WPN_EVO = [0, 11, 25, 50];
  function wpnEvo(lv) { lv = lv || 1; return lv >= 50 ? 3 : lv >= 25 ? 2 : lv >= 11 ? 1 : 0; }
  const WPN_EVO_NAMA = ['Asas', 'Emas', 'Rune', 'Legenda'];
  function vgrad(c, y0, y1, a, b, m) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); if (m) g.addColorStop(0.45, m); g.addColorStop(1, b); return g; }
  function outl(c, w) { c.strokeStyle = 'rgba(12,16,24,.85)'; c.lineWidth = w || 0.9; c.stroke(); }
  function poly(c, pts) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); }
  const WPN_HD = {
    pistol(c, L, t, fire) {
      const sl = fire * 3.2; // gelangsar ke belakang bila menembak
      // pemegang (getah bertekstur)
      poly(c, [[-2, 0], [4, 0], [3, 9], [-3.5, 9.5]]); c.fillStyle = vgrad(c, 0, 10, '#3A2E26', '#1E1814'); c.fill(); outl(c);
      c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 0.5; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-2.4 + i * 0.2, 2 + i * 2); c.lineTo(3 - i * 0.2, 2 + i * 2); c.stroke(); }
      // pengadang picu
      c.strokeStyle = '#2A2E36'; c.lineWidth = 1.1; c.beginPath(); c.arc(6, 2.6, 2.4, 0, Math.PI); c.stroke(); c.fillStyle = '#C9A040'; c.fillRect(5.6, 1.2, 0.9, 2.4);
      // rangka bawah
      poly(c, [[-2, -1], [L - 1, -1], [L - 1, 2], [-2, 2]]); c.fillStyle = vgrad(c, -1, 2, '#3A404C', '#22262E'); c.fill(); outl(c);
      // laras
      c.fillStyle = vgrad(c, -2.4, 0.4, '#9AA2B0', '#3A404C'); c.fillRect(L - 3, -2.4, 3.6, 2.8);
      // gelangsar
      c.save(); c.translate(-sl, 0);
      poly(c, [[-3, -5], [L - 0.5, -5], [L, -3.6], [L, -0.6], [-3, -0.6]]); c.fillStyle = vgrad(c, -5, -0.6, '#D8DEE8', '#5A6272', '#8A92A2'); c.fill(); outl(c);
      c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(-2, -4.6, L - 3, 0.7);
      c.strokeStyle = 'rgba(20,24,32,.6)'; c.lineWidth = 0.5; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-1.6 + i * 1.1, -4.4); c.lineTo(-1.6 + i * 1.1, -1.2); c.stroke(); }
      c.fillStyle = '#1A1E26'; c.fillRect(L * 0.45, -2.8, 3.2, 1.1); // tingkap kelongsong
      c.fillStyle = '#FFFFFF'; circ(c, L - 1.4, -5.5, 0.55); c.fillStyle = '#7CF0A8'; circ(c, -1.8, -5.5, 0.55); // bidikan bertitik
      c.restore();
    },
    minigun(c, L, t, fire, spin) {
      // kotak peluru + tali peluru berayun
      rr(c, -4, 4, 10, 8, 1.5); c.fillStyle = vgrad(c, 4, 12, '#6E7B3A', '#3E4620'); c.fill(); outl(c);
      c.fillStyle = '#F2C230'; c.fillRect(-3, 6.5, 8, 1); c.fillStyle = '#2B2B33'; c.font = '700 3px sans-serif';
      for (let i = 0; i < 6; i++) { const sw = Math.sin(t * 6 + i * 0.7) * (0.6 + fire), x = 5 + i * 1.6, y = 4 - i * 0.9 + sw; c.fillStyle = '#C9A040'; rr(c, x, y - 1, 1.3, 2.4, 0.5); c.fill(); c.fillStyle = '#E8C870'; c.fillRect(x + 0.2, y - 0.9, 0.4, 2); }
      // rumah enjin
      rr(c, -3, -6, 13, 11, 2.5); c.fillStyle = vgrad(c, -6, 5, '#AAB2C0', '#3A404C', '#6A7282'); c.fill(); outl(c);
      c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-1.5, -5.2, 10, 0.8);
      c.strokeStyle = '#2A2E36'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(0, -6); c.quadraticCurveTo(4, -11, 8, -6); c.stroke(); // pemegang atas
      // 6 laras berpusing (disusun ikut kedalaman)
      const heat = Math.min(1, fire * 1.2), bars = [];
      for (let i = 0; i < 6; i++) { const a = spin * 1.6 + i * TAU / 6; bars.push({ y: Math.sin(a) * 3.6, z: Math.cos(a) }); }
      bars.sort((p, q) => p.z - q.z);
      for (const b of bars) { const sh = 0.45 + 0.55 * (b.z * 0.5 + 0.5); c.fillStyle = 'rgb(' + Math.round(70 + 110 * sh) + ',' + Math.round(76 + 108 * sh) + ',' + Math.round(88 + 110 * sh) + ')'; c.fillRect(9, b.y - 1.05, L - 7, 2.1);
        if (heat > 0.05) { const g = c.createLinearGradient(L - 6, 0, L + 2, 0); g.addColorStop(0, 'rgba(255,90,40,0)'); g.addColorStop(1, 'rgba(255,' + Math.round(120 + 100 * (1 - heat)) + ',60,' + (0.8 * heat) + ')'); c.fillStyle = g; c.fillRect(L - 6, b.y - 1.05, 8, 2.1); } }
      // gelang pengapit
      for (const x of [12, L - 2]) { rr(c, x - 1.2, -5, 2.4, 10, 1); c.fillStyle = vgrad(c, -5, 5, '#C8D0DC', '#4A5060'); c.fill(); outl(c, 0.6); }
      c.fillStyle = '#E5302A'; circ(c, 4, -2, 0.9); // lampu sedia
    },
    tesla(c, L, t, fire) {
      // pemegang & badan
      poly(c, [[-3, 0], [3, 0], [2, 8], [-3.5, 8.5]]); c.fillStyle = vgrad(c, 0, 9, '#4A3A60', '#241A30'); c.fill(); outl(c);
      rr(c, -3, -4, L - 3, 8, 2); c.fillStyle = vgrad(c, -4, 4, '#A0A8B8', '#3A404C', '#6A7282'); c.fill(); outl(c);
      // gegelung tembaga
      const cg = vgrad(c, -5.5, 5.5, '#FFD08A', '#7A4A1A', '#C8803A');
      rr(c, 2, -5.5, L - 8, 11, 2.5); c.fillStyle = cg; c.fill(); outl(c, 0.7);
      c.strokeStyle = 'rgba(60,30,10,.7)'; c.lineWidth = 0.6; for (let x = 3; x < L - 6; x += 1.4) { c.beginPath(); c.moveTo(x, -5.3); c.lineTo(x + 0.6, 5.3); c.stroke(); }
      c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(2.5, -4.6, L - 9, 1);
      // kapasitor berkelip
      for (let i = 0; i < 3; i++) { const on = Math.sin(t * 8 - i * 1.3) > 0; c.fillStyle = on ? '#8FE8FF' : '#2A4A5A'; circ(c, -1 + i * 2.2, -5.2, 0.8); }
      // dua serampang + orb
      c.fillStyle = vgrad(c, -6, 6, '#E8ECF4', '#5A6272'); c.fillRect(L - 6, -6, 2, 3); c.fillRect(L - 6, 3, 2, 3); c.fillRect(L - 4, -6, 4, 1.4); c.fillRect(L - 4, 4.6, 4, 1.4);
      const p = 0.5 + 0.5 * Math.sin(t * 12), ch = Math.max(p * 0.6, fire);
      glow(c, '#8FE8FF', 10 + ch * 16); const og = c.createRadialGradient(L, 0, 0.3, L, 0, 4.5 + ch * 1.5); og.addColorStop(0, '#FFFFFF'); og.addColorStop(0.4, '#BFF4FF'); og.addColorStop(1, 'rgba(90,200,255,0)'); c.fillStyle = og; circ(c, L, 0, 4.5 + ch * 1.5); noGlow(c);
      // arka antara serampang
      c.strokeStyle = 'rgba(200,245,255,' + (0.5 + 0.5 * ch) + ')'; c.lineWidth = 0.7; for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(L, -5.3); for (let i = 1; i < 6; i++) c.lineTo(L + Math.sin(t * 50 + i * 2.3 + k * 4) * 1.6, -5.3 + i * 1.8); c.stroke(); }
    },
    roket(c, L, t, fire) {
      // pemegang & picu
      poly(c, [[2, 3], [6, 3], [5, 10], [1.5, 10]]); c.fillStyle = vgrad(c, 3, 10, '#3A3A2A', '#1E1E14'); c.fill(); outl(c);
      poly(c, [[L * 0.55, 3], [L * 0.55 + 3, 3], [L * 0.55 + 2.5, 8], [L * 0.55 - 0.5, 8]]); c.fill(); outl(c);
      // tiub
      rr(c, -8, -5, L + 6, 10, 2); c.fillStyle = vgrad(c, -5, 5, '#9AA860', '#3E4620', '#6E7B3A'); c.fill(); outl(c);
      c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(-7, -4.3, L + 3, 1);
      // jalur amaran
      c.save(); c.beginPath(); c.rect(L - 6, -5, 4, 10); c.clip(); c.fillStyle = '#F2C230'; c.fillRect(L - 6, -5, 4, 10); c.fillStyle = '#1E1E14'; for (let i = -3; i < 4; i++) { c.beginPath(); c.moveTo(L - 6 + i * 2.4, -5); c.lineTo(L - 4.8 + i * 2.4, -5); c.lineTo(L - 2.8 + i * 2.4, 5); c.lineTo(L - 4 + i * 2.4, 5); c.fill(); } c.restore();
      // corong belakang (mengembang)
      poly(c, [[-8, -5], [-12, -7], [-12, 7], [-8, 5]]); c.fillStyle = vgrad(c, -7, 7, '#6A7040', '#2A2E18'); c.fill(); outl(c);
      // muncung + kepala peledak bila berisi
      rr(c, L - 2, -6, 3, 12, 1); c.fillStyle = vgrad(c, -6, 6, '#C8D0A0', '#4A5028'); c.fill(); outl(c, 0.7);
      if (fire < 0.4) { c.beginPath(); c.moveTo(L + 1, -3.4); c.quadraticCurveTo(L + 8, -2.4, L + 9, 0); c.quadraticCurveTo(L + 8, 2.4, L + 1, 3.4); c.closePath(); c.fillStyle = vgrad(c, -3.4, 3.4, '#FF8A6A', '#A01E1A', '#E5302A'); c.fill(); outl(c, 0.7); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(L + 2, -2.4, 4, 0.7); }
      // kotak bidikan
      rr(c, 4, -9.5, 7, 4.5, 1); c.fillStyle = vgrad(c, -9.5, -5, '#5A6070', '#22262E'); c.fill(); outl(c, 0.7); c.fillStyle = '#E5302A'; circ(c, 9.6, -7.2, 0.9 + 0.3 * Math.sin(t * 6));
      c.fillStyle = '#9FE6FF'; c.fillRect(4.8, -8.6, 2.6, 2.6);
    }
  };
  // hiasan evolusi untuk SEMUA senjata (berdasarkan level)
  function drawWpnEvo(c, wid, L, t, ev) {
    if (!ev) return;
    c.save();
    // 1+: hiasan emas sepanjang laras + gelang emas pada pemegang
    c.strokeStyle = '#F2C230'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(-1, -2.6); c.lineTo(L - 2, -2.6); c.stroke();
    c.fillStyle = '#F2C230'; c.fillRect(-2.2, 1.2, 4.4, 1); c.fillStyle = '#FFF2A0'; circ(c, L * 0.4, -2.6, 0.9);
    if (ev >= 2) { // rune bercahaya berdenyut
      glow(c, '#B48CFF', 8); for (let i = 0; i < 4; i++) { const k = 0.5 + 0.5 * Math.sin(t * 5 - i * 0.9); c.fillStyle = 'rgba(200,170,255,' + (0.35 + 0.65 * k) + ')'; c.fillRect(1 + i * (L - 4) / 4, -0.6, 1.6, 1.2); } noGlow(c);
    }
    if (ev >= 3) { // aura legenda
      c.globalAlpha = 0.35 + 0.2 * Math.sin(t * 4); c.strokeStyle = '#FFE07A'; c.lineWidth = 1.4; glow(c, '#FFB040', 14); c.beginPath(); c.ellipse(L / 2, 0, L / 2 + 5, 8, 0, 0, TAU); c.stroke(); noGlow(c); c.globalAlpha = 1;
      for (let i = 0; i < 3; i++) { const a = t * 2.5 + i * TAU / 3; c.fillStyle = '#FFF6C0'; star(c, L / 2 + Math.cos(a) * (L / 2 + 5), Math.sin(a) * 8, 4, 1.8, 0.6, a); }
    }
    c.restore();
  }
  // kilatan muncung HD
  const MUZ_HD = {
    pistol(c, L, k) { glow(c, '#FFB040', 14); c.fillStyle = '#FFE07A'; star(c, L + 4, -2.4, 4, 9 * k + 2, 2, 0.4); c.fillStyle = '#FFFFFF'; circ(c, L + 2, -2.4, 2.6 * k + 0.8); c.fillStyle = 'rgba(255,200,90,.8)'; c.beginPath(); c.moveTo(L + 1, -2.4); c.lineTo(L + 4, -2.4 - 6 * k); c.lineTo(L + 5, -2.4); c.lineTo(L + 4, -2.4 + 6 * k); c.fill(); noGlow(c); },
    minigun(c, L, k) { glow(c, '#FF8A3A', 16); const r = ANIM * 40; c.fillStyle = 'rgba(255,170,60,.9)'; star(c, L + 5, 0, 6, 10 * k + 4, 3, r); c.fillStyle = '#FFF6C0'; star(c, L + 4, 0, 4, 5 * k + 2, 1.5, -r); noGlow(c); },
    tesla(c, L, k) { glow(c, '#8FE8FF', 20); c.strokeStyle = '#E8FBFF'; c.lineWidth = 1.2; for (let j = 0; j < 4; j++) { const a = (j - 1.5) * 0.45; c.beginPath(); c.moveTo(L, 0); let x = L, y = 0; for (let i = 0; i < 4; i++) { x += 3.5 * Math.cos(a); y += 3.5 * Math.sin(a) + (Math.random() - 0.5) * 3; c.lineTo(x, y); } c.stroke(); } c.fillStyle = 'rgba(190,245,255,.8)'; circ(c, L, 0, 6 * k + 2); noGlow(c); },
    roket(c, L, k) { glow(c, '#FF6A2B', 18); c.fillStyle = '#FFE07A'; star(c, L + 5, 0, 7, 12 * k + 4, 4, ANIM * 7); c.fillStyle = 'rgba(255,255,255,.9)'; circ(c, L + 3, 0, 3 * k + 1); noGlow(c);
      c.fillStyle = 'rgba(180,180,180,' + (0.7 * k) + ')'; circ(c, -14 - (1 - k) * 6, 0, 5 + (1 - k) * 4); circ(c, -18 - (1 - k) * 8, -3, 4 + (1 - k) * 3); c.fillStyle = 'rgba(255,170,60,' + (0.8 * k) + ')'; star(c, -13, 0, 5, 7 * k + 2, 2.5, ANIM * 9); }
  };
  // peluru HD (dilukis dalam ruang peluru: sudah ditranslate ke b.x,b.y dan diskala 1.5)
  const BUL_HD = {
    pistol(b, a, age, trail) { ctx.rotate(a); const g = ctx.createLinearGradient(-16, 0, 0, 0); g.addColorStop(0, 'rgba(255,200,80,0)'); g.addColorStop(1, 'rgba(255,220,120,.9)'); ctx.fillStyle = g; ctx.fillRect(-16, -1.3, 16, 2.6); glow(ctx, '#FFC040', 8); ctx.fillStyle = '#FFF6D0'; ctx.beginPath(); ctx.ellipse(0, 0, 3.2, 1.6, 0, 0, TAU); ctx.fill(); noGlow(ctx); },
    minigun(b, a, age) { ctx.rotate(a); const tr = (b._n || (b._n = Math.random() < 0.34 ? 2 : 1)) === 2; ctx.globalAlpha = tr ? 0.95 : 0.6; const g = ctx.createLinearGradient(tr ? -22 : -12, 0, 0, 0); g.addColorStop(0, 'rgba(255,140,60,0)'); g.addColorStop(1, tr ? '#FFB060' : '#FFE0A0'); ctx.fillStyle = g; ctx.fillRect(tr ? -22 : -12, -0.9, tr ? 22 : 12, 1.8); ctx.globalAlpha = 1; ctx.fillStyle = '#FFFFFF'; circ(ctx, 0, 0, 1.1); },
    tesla(b, a, age, trail) { ctx.rotate(a); glow(ctx, '#8FE8FF', 16); ctx.strokeStyle = '#BFF4FF'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(-18, 0); for (let i = 1; i <= 6; i++) ctx.lineTo(-18 + i * 3.4, (Math.random() - 0.5) * 6); ctx.stroke(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 0.9; ctx.stroke();
      ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(190,245,255,.8)'; ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-5, -5 - Math.random() * 3); ctx.lineTo(-2, -7); ctx.stroke(); noGlow(ctx);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 6); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, 'rgba(143,232,255,.8)'); g.addColorStop(1, 'rgba(143,232,255,0)'); ctx.fillStyle = g; circ(ctx, 0, 0, 6);
      trail({ spd: 30, warna: ['#FFFFFF', '#8FE8FF'], size: 1.6, life: 0.25, shape: 'star', rate: 0.6 }); },
    roket(b, a, age, trail) { ctx.rotate(a); ctx.rotate(Math.sin(age * 30) * 0.04);
      const fl = 7 + Math.random() * 5; const g = ctx.createLinearGradient(-10 - fl, 0, -9, 0); g.addColorStop(0, 'rgba(255,90,30,0)'); g.addColorStop(0.5, '#FF8A3A'); g.addColorStop(1, '#FFF6C0'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-9, -2.4); ctx.lineTo(-9 - fl, 0); ctx.lineTo(-9, 2.4); ctx.fill();
      ctx.fillStyle = '#4A5028'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-9, s * 2.6); ctx.lineTo(-11.5, s * 5.5); ctx.lineTo(-6, s * 2.6); ctx.fill(); }
      rr(ctx, -9, -2.8, 13, 5.6, 1.5); ctx.fillStyle = vgrad(ctx, -2.8, 2.8, '#C8D090', '#4A5028', '#7E8A46'); ctx.fill();
      ctx.fillStyle = '#F2C230'; ctx.fillRect(-4, -2.8, 1.6, 5.6); ctx.beginPath(); ctx.moveTo(4, -2.8); ctx.quadraticCurveTo(10, -2, 11, 0); ctx.quadraticCurveTo(10, 2, 4, 2.8); ctx.fillStyle = vgrad(ctx, -2.8, 2.8, '#FF8A6A', '#A01E1A', '#E5302A'); ctx.fill();
      trail({ spd: 12, warna: ['#D8D8D8', '#A8A8A8', '#C8C8C8'], size: 4.5, life: 0.8, shape: 'smoke', rate: 1, drag: 2, grav: -10 }); trail({ spd: 40, warna: ['#FFE07A', '#FF8A3A'], size: 1.8, life: 0.25, rate: 0.7 }); }
  };
  // hentaman HD (dipanggil dari pemancar zarah 'hit')
  function hitHD(b, f) {
    const back = f.a + Math.PI;
    if (f.wid === 'pistol' || f.wid === 'minigun') { emit(f.x, f.y, f.wid === 'pistol' ? 6 : 3, { a: back, spread: 1.5, spd: 170, warna: ['#FFFFFF', '#FFE07A', '#FFB040'], size: 2, life: 0.25, drag: 3, shape: 'star' }); if (f.wid === 'pistol') b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.22, r: 10, col: '255,224,122' }); return true; }
    if (f.wid === 'tesla') { emit(f.x, f.y, 8, { spd: 150, warna: ['#FFFFFF', '#8FE8FF', '#5AC8FF'], size: 2.2, life: 0.35, shape: 'star', drag: 2 }); b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.3, r: 18, col: '143,232,255' }); return true; }
    return hitHD2(b, f);
  }
  function boomHD(b, f) {
    if (f.wid !== 'roket') return boomHD2(b, f);
    b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.45, r: (f.r || 60) * 1.4, col: '255,230,180', w: 5 });
    emit(f.x, f.y, 26, { spd: (f.r || 60) * 4.5, warna: ['#FFFFFF', '#FFE07A', '#FF8A3A', '#E5302A'], size: 5, life: 0.55, drag: 3.5 });
    emit(f.x, f.y, 10, { spd: (f.r || 60) * 1.4, warna: ['#5A5A5A', '#7A7A7A', '#3A3A3A'], size: (f.r || 60) * 0.3, life: 1.2, shape: 'smoke', drag: 2, up: 30 });
    emit(f.x, f.y, 12, { spd: 220, warna: ['#4A3A2A', '#6A5A40', '#FFB040'], size: 2.6, life: 0.9, grav: 500, shape: 'sq', up: 160 });
    return true;
  }

  // ================= PAMERAN SENJATA (skrin penuh) =================
  let SHOW = null;
  function openShowcase(wid, banner) {
    const w = WEAPONS[wid], lv = save.weapons[wid] || 1;
    showModal((banner ? banner + ' · ' : '') + w.nama, '<canvas id="scCv" width="720" height="460" style="width:100%;border-radius:14px;background:#141A26;touch-action:manipulation" aria-label="Pameran ' + esc(w.nama) + '"></canvas>' +
      '<div class="scev" id="scEv">' + WPN_EVO.map((v, i) => '<button class="btn ghost sce' + (i === wpnEvo(lv) ? ' on' : '') + '" data-ev="' + i + '">' + ['⚪', '🟡', '🟣', '🌟'][i] + ' ' + WPN_EVO_NAMA[i] + '<small>Lv ' + Math.max(1, v) + '+</small></button>').join('') + '</div>' +
      '<p class="scst">' + wTag(wid) + '</p><p class="scst">💥 ' + fmt(w.dmg) + ' damage · ⚡ ' + w.rate + '/s · 🎯 ' + w.range + (w.splash ? ' · 💣 letupan ' + w.splash : '') + (w.chain ? ' · ⛓ lompat ' + w.chain : '') + (w.pierce >= 99 ? ' · ➶ tembus' : '') + '</p><p class="muted">' + esc(w.desc) + (WPN_HD[wid] ? '' : ' · <i>Rupa HD akan datang</i>') + '</p>',
      [['🔫 Tembak!', () => showFire(), 'btn', true], ['Tutup', null, 'btn ghost']]);
    const cv = $('scCv'); if (!cv || !cv.getContext) return;
    SHOW = { wid, ev: wpnEvo(lv), t: 0, last: Date.now(), shots: [], parts: [], fire: 0, spin: 0, dummy: 0, nums: [], cv };
    const evb = $('scEv'); if (evb) evb.addEventListener('click', e => { const t = e.target && e.target.closest ? e.target.closest('[data-ev]') : null; if (!t) return; SHOW.ev = +t.dataset.ev; (evb.querySelectorAll ? evb.querySelectorAll('.sce') : []).forEach(x => x.classList.toggle('on', x === t)); sfx('tap'); });
    cv.addEventListener('click', () => showFire());
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(showFrame); else showFrame();
  }
  function showFire() {
    if (!SHOW) return; const w = WEAPONS[SHOW.wid], n = w.n || 1;
    SHOW.fire = 1; sfx('shot', SHOW.wid);
    for (let i = 0; i < Math.min(5, n + (SHOW.wid === 'minigun' ? 4 : 0)); i++) SHOW.shots.push({ x: 300, y: 214, vx: 900, vy: (i - (n - 1) / 2) * 60 + (SHOW.wid === 'minigun' ? (Math.random() - 0.5) * 120 : 0), t: -i * 0.06, wid: SHOW.wid });
    if (SHOW.wid !== 'roket' && SHOW.wid !== 'tesla') for (let i = 0; i < 2; i++) SHOW.parts.push({ x: 190, y: 200, vx: -40 - Math.random() * 60, vy: -160 - Math.random() * 80, g: 700, life: 0.8, t: 0, col: '#E8B94A', s: 3, sq: 1 });
  }
  function showFrame() {
    if (!SHOW) return; const cv = SHOW.cv; if (!cv || $('scCv') !== cv || $('modal').hidden) { SHOW = null; return; }
    const now = Date.now(), dt = Math.min(0.05, (now - SHOW.last) / 1000); SHOW.last = now; SHOW.t += dt; SHOW.fire = Math.max(0, SHOW.fire - dt * 6); SHOW.spin += dt * (2 + SHOW.fire * 20);
    const c = cv.getContext('2d'), Wc = cv.width, Hc = cv.height, t = SHOW.t, wid = SHOW.wid, w = WEAPONS[wid];
    c.setTransform(1, 0, 0, 1, 0, 0);
    const bg = c.createRadialGradient(Wc * 0.4, Hc * 0.48, 10, Wc * 0.4, Hc * 0.48, Wc * 0.7); bg.addColorStop(0, '#2E3E5E'); bg.addColorStop(1, '#0E121C'); c.fillStyle = bg; c.fillRect(0, 0, Wc, Hc);
    // sinar cahaya berputar
    if (!CALM()) { c.save(); c.translate(Wc * 0.4, Hc * 0.48); c.rotate(t * 0.25); for (let i = 0; i < 12; i++) { c.rotate(TAU / 12); c.fillStyle = 'rgba(255,255,255,' + (0.035 + 0.02 * (i % 2)) + ')'; c.beginPath(); c.moveTo(0, 0); c.lineTo(Wc, -60); c.lineTo(Wc, 60); c.fill(); } c.restore(); }
    // lantai pentas
    const fg = c.createRadialGradient(Wc * 0.4, Hc * 0.82, 10, Wc * 0.4, Hc * 0.82, 260); fg.addColorStop(0, 'rgba(120,180,255,.35)'); fg.addColorStop(1, 'rgba(120,180,255,0)'); c.fillStyle = fg; c.beginPath(); c.ellipse(Wc * 0.4, Hc * 0.82, 250, 40, 0, 0, TAU); c.fill();
    // patung sasaran
    const dx = 620 + Math.sin(SHOW.dummy * 30) * SHOW.dummy * 20; SHOW.dummy = Math.max(0, SHOW.dummy - dt * 2);
    c.fillStyle = '#6A4A2A'; c.fillRect(dx - 4, 250, 8, 120); c.fillStyle = '#C8A070'; c.beginPath(); c.arc(dx, 214, 34, 0, TAU); c.fill(); c.strokeStyle = '#E5302A'; c.lineWidth = 6; c.beginPath(); c.arc(dx, 214, 22, 0, TAU); c.stroke(); c.fillStyle = '#E5302A'; c.beginPath(); c.arc(dx, 214, 8, 0, TAU); c.fill();
    // senjata besar: kesan pusingan "3D" + kilauan bergerak
    const L = w.laras, sc = Math.min(11, 300 / (L + 16)), turn = Math.cos(t * 0.9), sy = 0.86 + 0.14 * Math.abs(turn);
    c.save(); c.translate(Wc * 0.4 - (L * sc) / 2 + 20, Hc * 0.48 + Math.sin(t * 1.6) * 6); c.scale(sc, sc * sy); c.rotate(-0.06 + Math.sin(t * 0.7) * 0.05); c.translate(-SHOW.fire * 2.5, 0);
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(L / 2, 18, L / 2 + 6, 3, 0, 0, TAU); c.fill();
    drawWeapon(c, wid, t, SHOW.fire, SHOW.spin, WPN_EVO[SHOW.ev] || 1);
    drawMuzzle(c, wid, SHOW.fire);
    c.restore();
    // jalur kilauan
    if (!CALM()) { const sx = ((t * 260) % (Wc + 400)) - 200; c.save(); c.globalCompositeOperation = 'lighter'; const sg = c.createLinearGradient(sx - 60, 0, sx + 60, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,.10)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sg; c.fillRect(sx - 60, 120, 120, 200); c.restore(); }
    // peluru demo
    for (const s of SHOW.shots) { s.t += dt; if (s.t < 0) continue; s.x += s.vx * dt; s.y += s.vy * dt;
      c.save(); c.translate(s.x, s.y); c.scale(3, 3); const old = ctx; ctx = c; const tr = () => {}; if (BUL_HD[wid]) BUL_HD[wid]({}, Math.atan2(s.vy, s.vx), s.t, tr); else { c.rotate(Math.atan2(s.vy, s.vx)); c.fillStyle = w.peluru; c.fillRect(-8, -1.5, 10, 3); } ctx = old; c.restore();
      if (s.x > dx - 30 && !s.hit) { s.hit = 1; SHOW.dummy = 0.35; const big = wid === 'roket'; SHOW.nums.push({ x: dx, y: 160, t: 0, v: w.dmg * (WPN_EVO[SHOW.ev] || 1) });
        for (let i = 0; i < (big ? 40 : 14); i++) { const a = Math.random() * TAU, sp = (big ? 420 : 220) * Math.random(); SHOW.parts.push({ x: dx - 20, y: s.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: big ? 200 : 0, life: big ? 0.8 : 0.4, t: 0, col: wid === 'tesla' ? (i % 2 ? '#8FE8FF' : '#FFFFFF') : (i % 3 ? '#FFE07A' : '#FF8A3A'), s: big ? 6 : 3 }); }
        if (big) SHOW.parts.push({ ring: 1, x: dx - 20, y: s.y, t: 0, life: 0.5, r: 120 }); } }
    SHOW.shots = SHOW.shots.filter(s => !s.hit && s.x < Wc + 40);
    for (const p of SHOW.parts) { p.t += dt; if (p.ring) { const k = p.t / p.life; c.strokeStyle = 'rgba(255,230,180,' + (1 - k) + ')'; c.lineWidth = 6 * (1 - k) + 1; c.beginPath(); c.arc(p.x, p.y, p.r * k, 0, TAU); c.stroke(); continue; }
      p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; c.globalAlpha = Math.max(0, 1 - p.t / p.life); c.fillStyle = p.col; if (p.sq) c.fillRect(p.x, p.y, p.s, p.s * 1.6); else { c.beginPath(); c.arc(p.x, p.y, p.s, 0, TAU); c.fill(); } c.globalAlpha = 1; }
    SHOW.parts = SHOW.parts.filter(p => p.t < p.life);
    for (const n of SHOW.nums) { n.t += dt; c.globalAlpha = Math.max(0, 1 - n.t); c.fillStyle = '#FFE07A'; c.font = '900 34px "Baloo 2", system-ui'; c.textAlign = 'center'; c.fillText('-' + fmt(n.v), n.x, n.y - n.t * 50); c.globalAlpha = 1; }
    SHOW.nums = SHOW.nums.filter(n => n.t < 1);
    // label evolusi
    c.fillStyle = ['#C8D0DC', '#F2C230', '#C8A8FF', '#FFE07A'][SHOW.ev]; c.font = '800 22px "Baloo 2", system-ui'; c.textAlign = 'left'; c.fillText(['⚪', '🟡', '🟣', '🌟'][SHOW.ev] + ' ' + WPN_EVO_NAMA[SHOW.ev] + ' · Lv ' + Math.max(1, WPN_EVO[SHOW.ev]) + '+', 22, 40);
    c.fillStyle = 'rgba(255,255,255,.6)'; c.font = '600 16px "Nunito", system-ui'; c.fillText('Ketik untuk menembak', 22, Hc - 20);
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(showFrame);
  }
