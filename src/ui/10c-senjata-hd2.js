
  // ================= v9.0: 28 SENJATA HD LAGI (gaya sama seperti contoh v8.9) =================
  // Konvensyen: pemegang di (0,0), laras ke +x, hujung laras (muncung) di (L+2, 0) — sama dengan muzzleLen() dalam logik.
  const PAL = {
    steel: ['#E2E8F0', '#3A404C', '#8A92A2'], dark: ['#6A7282', '#1A1E26', '#3A404C'], wood: ['#D8A060', '#5A3418', '#9A6434'],
    brass: ['#FFE6A0', '#7A4A12', '#C8963A'], olive: ['#A8B470', '#3E4620', '#6E7B3A'], ice: ['#F2FCFF', '#4A8AB0', '#9FD8F0'],
    red: ['#FF9A8A', '#8A1E1A', '#D0402E'], green: ['#C8F59A', '#2F6B33', '#5DBB63'], purple: ['#D8B8FF', '#3A2460', '#7A4AB0'], white: ['#FFFFFF', '#9AA6B4', '#D8DEE6']
  };
  // kotak berkecerunan + garis luar + garis kilauan atas
  function box(c, x, y, w, h, r, p) { rr(c, x, y, w, h, Math.min(r, h / 2, w / 2)); c.fillStyle = vgrad(c, y, y + h, p[0], p[1], p[2]); c.fill(); outl(c, 0.7); c.fillStyle = 'rgba(255,255,255,.38)'; c.fillRect(x + Math.min(r, w / 3), y + 0.45, Math.max(0, w - 2 * Math.min(r, w / 3)), Math.max(0.4, Math.min(0.9, h * 0.14))); }
  function tube(c, x0, x1, th, p, y) { box(c, x0, (y || 0) - th / 2, x1 - x0, th, th / 2.4, p); }
  function gripHD(c, x, y, w, h, p, slant) { const s = slant == null ? 2.5 : slant; poly(c, [[x, y], [x + w, y], [x + w - s, y + h], [x - s, y + h]]); c.fillStyle = vgrad(c, y, y + h, p[0], p[1], p[2]); c.fill(); outl(c, 0.8);
    c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 0.45; for (let i = 1; i < 4; i++) { const yy = y + i * h / 4; c.beginPath(); c.moveTo(x - s * i / 4 + 0.6, yy); c.lineTo(x + w - s * i / 4 - 0.6, yy); c.stroke(); } }
  function orb(c, x, y, r, col, pulse) { glow(c, col, 8 + 10 * (pulse || 0)); const g = c.createRadialGradient(x, y, 0.2, x, y, r); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.45, col); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; circ(c, x, y, r); noGlow(c); }
  function trig(c, x) { c.strokeStyle = '#22262E'; c.lineWidth = 0.9; c.beginPath(); c.arc(x, 2.6, 2.2, 0, Math.PI); c.stroke(); c.fillStyle = '#C9A040'; c.fillRect(x - 0.4, 1.4, 0.8, 2); }
  function shine(c, x0, x1, y) { c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 0.5; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); }

  Object.assign(WPN_HD, {
    // ---------- api biasa ----------
    revolver(c, L, t, fire) {
      gripHD(c, -3, 0, 6, 9, PAL.wood, 3); c.fillStyle = '#F2C230'; circ(c, -1.5, 5, 0.7);
      trig(c, 5); box(c, -3, -3.2, 10, 5, 1.5, PAL.steel);
      tube(c, 6, L + 2, 3, PAL.steel, -1.2); c.fillStyle = '#22262E'; c.fillRect(L + 0.8, -2.2, 1.2, 2);
      c.save(); c.translate(6.5, -0.6); c.rotate((fire > 0.5 ? (1 - fire) : 0) * 1.05); const cg = c.createRadialGradient(-1, -1, 0.5, 0, 0, 4.4); cg.addColorStop(0, '#F2F6FA'); cg.addColorStop(1, '#4A505C'); c.fillStyle = cg; circ(c, 0, 0, 4.2); outl(c, 0.6);
      c.fillStyle = '#1A1E26'; for (let i = 0; i < 6; i++) circ(c, Math.cos(i * Math.PI / 3) * 2.4, Math.sin(i * Math.PI / 3) * 2.4, 0.8); c.restore();
      c.fillStyle = '#3A404C'; poly(c, [[-3, -3.2], [-5.5 - fire * 1.5, -5.5 + fire * 2], [-4, -2]]); c.fill(); // tukul picu
      c.fillStyle = '#FFE07A'; c.fillRect(L - 1, -4.4, 1, 1.2);
    },
    smg(c, L, t, fire) {
      gripHD(c, -2, 1, 4.5, 7.5, PAL.dark, 2); trig(c, 4.5); box(c, 6, 2, 3.6, 10, 1, PAL.dark); c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(6.6, 3, 0.6, 8); // magazin
      box(c, -6, -2.6, 6, 3.6, 1, PAL.dark); // popor
      box(c, -1, -3.6, L - 2, 6.4, 1.6, PAL.steel); c.fillStyle = '#22262E'; for (let i = 0; i < 4; i++) c.fillRect(L * 0.45 + i * 1.6, -2.6, 0.9, 3.6); // lubang pendingin
      tube(c, L - 3, L + 2, 2.4, PAL.dark, 0); c.fillStyle = '#7CF0A8'; circ(c, 2, -4, 0.6);
    },
    mesingan(c, L, t, fire) {
      // tali peluru berayun dari kotak
      box(c, -2, 3, 8, 7, 1.2, PAL.olive); for (let i = 0; i < 5; i++) { const sw = Math.sin(t * 5 + i * 0.8) * (0.5 + fire); c.fillStyle = vgrad(c, 0, 3, '#FFE6A0', '#8A5A1A'); rr(c, 6 + i * 1.5, 4 - i * 0.7 + sw, 1.2, 2.6, 0.5); c.fill(); }
      gripHD(c, -5, 0, 4, 7, PAL.wood, 2); box(c, -9, -2.4, 5, 4, 1, PAL.wood);
      box(c, -5, -4, 14, 7, 2, PAL.dark); shine(c, -3, 7, -3.2);
      tube(c, 9, L + 2, 3.2, PAL.steel, 0); for (let x = 11; x < L - 3; x += 2.4) { c.fillStyle = 'rgba(20,24,32,.55)'; c.fillRect(x, -1.6, 1, 3.2); } // penyejuk berlubang
      box(c, 9, -5.2, 3, 2, 0.8, PAL.dark); c.fillStyle = '#22262E'; c.fillRect(L - 4, -3.4, 1, 2); // bidikan
      if (fire > 0.2) { c.fillStyle = 'rgba(200,200,205,' + (0.35 * fire) + ')'; circ(c, L + 3, -2 - (1 - fire) * 4, 1.6 + (1 - fire) * 2); }
    },
    shotgun(c, L, t, fire) {
      gripHD(c, -5, 0.4, 5, 7, PAL.wood, 3); box(c, -10, -2.6, 7, 5, 1.6, PAL.wood);
      box(c, -4, -3.6, 9, 6.2, 1.6, PAL.dark); trig(c, 1.5);
      tube(c, 4, L + 2, 2.8, PAL.steel, -1.6); tube(c, 4, L + 2, 2.8, PAL.steel, 1.6);
      const pump = fire > 0.4 ? (1 - fire) * 3.5 : 0; box(c, 7 - pump, -3.6, 7, 7.4, 2, PAL.wood); c.strokeStyle = 'rgba(40,20,8,.5)'; c.lineWidth = 0.5; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(8.5 - pump + i * 2, -3); c.lineTo(8.5 - pump + i * 2, 3.2); c.stroke(); }
      c.fillStyle = '#1A1E26'; circ(c, L + 2, -1.6, 0.9); circ(c, L + 2, 1.6, 0.9);
    },
    lima(c, L, t, fire) {
      gripHD(c, -5, 0.6, 5, 7, PAL.wood, 3); box(c, -10, -2.8, 7, 5.4, 1.8, PAL.wood);
      for (let i = -2; i <= 2; i++) { c.save(); c.rotate(i * 0.085); tube(c, 3, L + 2, 2, i % 2 ? PAL.steel : PAL.dark, 0); c.fillStyle = '#FF8EB8'; c.fillRect(L - 1, -1, 1.2, 2); c.restore(); }
      box(c, -4, -4.6, 10, 9, 2.2, PAL.purple); shine(c, -2, 4, -3.8); c.fillStyle = '#FFE07A'; for (let i = 0; i < 5; i++) circ(c, -1.6 + i * 1.6, 2.6, 0.5); trig(c, 2);
    },
    sniper(c, L, t, fire) {
      box(c, -11, -2.4, 9, 5.6, 2, PAL.wood); c.fillStyle = '#3A2414'; c.fillRect(-11, 2, 3, 1.2); gripHD(c, -3, 0.6, 4.5, 7, PAL.wood, 2.5); trig(c, 3);
      box(c, -3, -3.2, 12, 5.6, 1.5, PAL.dark);
      tube(c, 8, L + 2, 2.4, PAL.steel, -0.4); box(c, L - 2.5, -2.2, 3, 3.6, 0.8, PAL.dark); // penekan bunyi
      // teropong berkilau
      box(c, 0, -8.5, 13, 3.6, 1.8, PAL.dark); box(c, -1, -9.2, 2.4, 5, 1, PAL.dark); box(c, 11.6, -9.4, 2.6, 5.4, 1, PAL.dark);
      const sp = 0.5 + 0.5 * Math.sin(t * 3); c.fillStyle = 'rgba(160,240,255,' + (0.6 + 0.4 * sp) + ')'; circ(c, 14, -6.7, 1.4); c.fillStyle = '#FFFFFF'; circ(c, 13.6, -7.2, 0.5);
      const bolt = fire > 0.3 ? (1 - fire) * 3 : 0; c.fillStyle = '#C8D0DC'; c.fillRect(2 - bolt, -4.6, 1, 2); circ(c, 2.5 - bolt, -5, 1.1); // bolt
      c.fillStyle = '#B6F27A'; circ(c, 4, 2.2, 0.6);
    },
    // ---------- tenaga ----------
    laser(c, L, t, fire) {
      gripHD(c, -2, 0.6, 4.5, 7.4, PAL.white, 2); trig(c, 4);
      box(c, -4, -4, L - 4, 7.4, 3, PAL.white); c.fillStyle = '#E8C547'; c.fillRect(2, -4, 2, 7.4);
      const p = 0.5 + 0.5 * Math.sin(t * 7); c.fillStyle = 'rgba(255,79,216,' + (0.5 + 0.5 * p) + ')'; for (let i = 0; i < 4; i++) c.fillRect(6 + i * 3, -1, 2, 2); // garis tenaga
      box(c, L - 6, -3, 7, 6, 2, PAL.purple); orb(c, L + 1.5, 0, 3 + p * 0.8 + fire * 2, '#FF4FD8', p);
      c.fillStyle = vgrad(c, -6.5, -4, '#FFB8F0', '#B03A90'); poly(c, [[3, -4], [6, -7], [9, -7], [10, -4]]); c.fill(); outl(c, 0.5); // kristal teras
    },
    railgun(c, L, t, fire) {
      gripHD(c, -3, 0.6, 5, 7.4, PAL.dark, 2.5); trig(c, 4); box(c, -9, -2.6, 7, 5, 1.6, PAL.dark);
      box(c, -3, -3.4, 10, 6.8, 2, PAL.steel);
      box(c, 6, -5.6, L - 4, 2.6, 1, PAL.steel); box(c, 6, 3, L - 4, 2.6, 1, PAL.steel); // dua rel
      const ch = Math.max(0.35 + 0.35 * Math.sin(t * 9), fire); glow(c, '#9AA8FF', 6 + ch * 14);
      for (let x = 8; x < L; x += 3.2) { c.fillStyle = 'rgba(154,168,255,' + (0.35 + 0.65 * ch * (0.6 + 0.4 * Math.sin(t * 20 - x))) + ')'; c.fillRect(x, -2.6, 1.6, 5.2); } noGlow(c);
      c.strokeStyle = 'rgba(210,220,255,' + ch + ')'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(8, 0); for (let x = 9; x <= L + 2; x += 1.6) c.lineTo(x, Math.sin(t * 40 + x) * 1.4); c.stroke();
      c.fillStyle = '#9AA8FF'; circ(c, 0, -4.4, 0.7);
    },
    plasma(c, L, t, fire) {
      gripHD(c, -2, 0.6, 4.5, 7.4, PAL.steel, 2); trig(c, 4); box(c, -7, -2.6, 6, 5, 2, PAL.steel);
      box(c, -2, -3.6, L - 2, 7, 3, PAL.steel); c.fillStyle = '#2A3440'; rr(c, 3, -3, 9, 6, 2.5); c.fill();
      const p = 0.5 + 0.5 * Math.sin(t * 6); orb(c, 7.5, 0, 3.4 + p * 0.8 + fire * 1.5, '#7AF0FF', p); // teras bergelora
      c.strokeStyle = 'rgba(122,240,255,.8)'; c.lineWidth = 0.5; c.beginPath(); c.arc(7.5, 0, 2.2 + p, t * 6, t * 6 + 2); c.stroke();
      tube(c, L - 4, L + 2, 4.2, PAL.dark, 0); for (const x of [L - 2.6, L - 0.6]) { c.fillStyle = 'rgba(122,240,255,' + (0.4 + 0.6 * p) + ')'; c.fillRect(x, -2.1, 0.8, 4.2); }
    },
    // ---------- ais ----------
    frost(c, L, t, fire) {
      gripHD(c, -2, 0, 4.5, 8, PAL.ice, 2.5); trig(c, 4);
      box(c, -3, -3.4, L - 1, 5.6, 1.8, PAL.ice); c.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 3; i++) star(c, 3 + i * 4, -0.6, 4, 1.2, 0.4, t + i);
      const p = 0.5 + 0.5 * Math.sin(t * 4); glow(c, '#9FE6FF', 8 + p * 8); c.fillStyle = vgrad(c, -4, 4, '#FFFFFF', '#5AB4E0'); poly(c, [[L - 2, -3], [L + 2.5, 0], [L - 2, 3], [L - 3.2, 0]]); c.fill(); noGlow(c); outl(c, 0.5);
    },
    nitrogen(c, L, t, fire) { WPN_HD_ICE(c, L, t, fire, false); },
    ais_g(c, L, t, fire) { WPN_HD_ICE(c, L, t, fire, true); },
    // ---------- api & racun ----------
    api(c, L, t, fire) {
      const pull = fire > 0.3 ? 0 : 1; // tali ditarik semasa sedia
      c.strokeStyle = vgrad(c, -12, 12, '#C04A3A', '#5A1410', '#8A2A1E'); c.lineWidth = 2.4; c.beginPath(); c.moveTo(3, -12); c.quadraticCurveTo(10, 0, 3, 12); c.stroke(); c.strokeStyle = 'rgba(12,16,24,.8)'; c.lineWidth = 0.6; c.stroke();
      c.fillStyle = '#F2C230'; c.fillRect(4.4, -1.6, 2.2, 3.2);
      c.strokeStyle = '#F4EEDF'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(3, -12); c.lineTo(-3 * pull - 1, 0); c.lineTo(3, 12); c.stroke();
      if (pull) { c.fillStyle = vgrad(c, -1, 1, '#E0B070', '#7A4A1A'); c.fillRect(-4, -0.6, L + 2, 1.2); c.fillStyle = '#E8E0D0'; poly(c, [[-4, 0], [-6, -2], [-3, -0.4]]); c.fill(); poly(c, [[-4, 0], [-6, 2], [-3, 0.4]]); c.fill();
        glow(c, '#FF6A2B', 10); c.fillStyle = Math.sin(t * 25) > 0 ? '#FFE07A' : '#FF8A3A'; star(c, L + 1, 0, 5, 3.6 + Math.sin(t * 30), 1.6, t * 8); noGlow(c); }
    },
    napalm(c, L, t, fire) {
      box(c, -10, -1, 8, 11, 3.5, PAL.red); c.fillStyle = '#F2C230'; c.fillRect(-9, 3, 6, 1.2); c.fillStyle = '#1E1E14'; c.font = '700 3px sans-serif'; // tangki
      gripHD(c, 0, 1, 4, 7, PAL.dark, 2); trig(c, 5);
      box(c, -2, -3, 12, 5.6, 1.6, PAL.steel); tube(c, 9, L + 2, 3, PAL.dark, -0.4);
      c.strokeStyle = '#3A404C'; c.lineWidth = 1; c.beginPath(); c.moveTo(-6, -1); c.quadraticCurveTo(-4, -6, 2, -3); c.stroke(); // hos
      glow(c, '#FF6A2B', 8); c.fillStyle = Math.sin(t * 22) > 0 ? '#FFB04A' : '#FF6A2B'; star(c, L + 2.5, -0.4, 5, 2 + Math.sin(t * 30) * 0.6, 1, t * 9); noGlow(c); // nyalaan pandu
    },
    racun(c, L, t, fire) {
      box(c, -10, -1.4, 8, 11, 3.5, PAL.green); const lv = 0.55 + 0.1 * Math.sin(t * 3); c.fillStyle = 'rgba(178,240,106,.55)'; rr(c, -9, -1.4 + 11 * (1 - lv), 6, 11 * lv - 0.6, 2.5); c.fill(); // cecair beralun
      for (let i = 0; i < 2; i++) { c.fillStyle = 'rgba(255,255,255,.7)'; circ(c, -7 + i * 3, 7 - ((t * 5 + i * 2.3) % 7), 0.6); }
      gripHD(c, 0, 1, 4, 7, PAL.dark, 2); trig(c, 5);
      box(c, -2, -3, 12, 5.6, 1.6, PAL.steel); tube(c, 9, L + 2, 2.6, PAL.dark, -0.4); c.fillStyle = '#5DBB63'; c.fillRect(L - 1, -1.8, 2, 2.8);
      c.fillStyle = '#2F6B33'; c.beginPath(); c.arc(-6, 0, 1.6, 0, TAU); c.fill(); c.fillStyle = '#C8F59A'; circ(c, -6.5, -0.4, 0.5); circ(c, -5.5, -0.4, 0.5); // tengkorak kecil
    },
    tongkat_r(c, L, t, fire) { WPN_HD_STAFF(c, L, t, fire, '#B2F06A', PAL.green, true); },
    // ---------- elektrik ----------
    petir(c, L, t, fire) { WPN_HD_STAFF(c, L, t, fire, '#FFF27A', PAL.purple, false); },
    tukul(c, L, t, fire) {
      tube(c, -6, L - 3, 2.6, PAL.wood, 0); for (let x = -4; x < L - 6; x += 3) { c.fillStyle = '#3A2414'; c.fillRect(x, -1.3, 0.8, 2.6); } // balutan
      box(c, L - 6, -8, 9, 16, 2, PAL.steel); c.fillStyle = '#F2C230'; c.fillRect(L - 6, -2, 9, 4); // kepala tukul
      const p = 0.5 + 0.5 * Math.sin(t * 10); glow(c, '#FFF06A', 8 + 12 * Math.max(p, fire)); c.fillStyle = 'rgba(255,240,106,' + (0.6 + 0.4 * p) + ')'; poly(c, [[L - 2, -6], [L, -2.5], [L - 1.6, -2.5], [L + 0.4, 1.5], [L - 2.6, -1.4], [L - 1, -1.4]]); c.fill(); noGlow(c);
      if (Math.sin(t * 13) > 0.5 || fire > 0.3) { c.strokeStyle = '#FFF6B0'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(L + 3, -6); c.lineTo(L + 6, -4); c.lineTo(L + 4, -2); c.lineTo(L + 7, 0); c.stroke(); }
    },
    // ---------- letupan ----------
    bom(c, L, t, fire) {
      if (fire > 0.5) return; // bom sudah dibaling
      const g = c.createRadialGradient(4, -2, 0.5, 6, 0, 6.5); g.addColorStop(0, '#8A8A8A'); g.addColorStop(1, '#1E1E1E'); c.fillStyle = g; circ(c, 6, 0, 6); outl(c, 0.7);
      c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 0.6; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(1, i * 3); c.lineTo(11, i * 3); c.stroke(); }
      box(c, 4, -8.2, 4, 3, 0.8, PAL.steel); c.strokeStyle = '#8A6A3A'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(6, -8.2); c.quadraticCurveTo(8, -11, 10, -11); c.stroke();
      glow(c, '#FFB040', 10); c.fillStyle = Math.sin(t * 30) > 0 ? '#FFE07A' : '#FF6A2B'; star(c, 10, -11, 5, 2.6 + Math.random(), 1, t * 10); noGlow(c);
    },
    peluru_p(c, L, t, fire) {
      gripHD(c, 3, 3, 4, 7, PAL.dark, 2); box(c, -8, -5, L + 6, 10, 2, PAL.steel); shine(c, -6, L - 4, -4.2);
      for (const x of [-2, 6, L - 6]) { c.fillStyle = '#3A404C'; c.fillRect(x, -5, 1.4, 10); }
      box(c, L - 2, -6, 4, 12, 1.2, PAL.dark);
      if (fire < 0.4) { c.beginPath(); c.moveTo(L + 2, -3); c.quadraticCurveTo(L + 6, -2.4, L + 7, 0); c.quadraticCurveTo(L + 6, 2.4, L + 2, 3); c.closePath(); c.fillStyle = vgrad(c, -3, 3, '#FFB0A0', '#A01E1A', '#E5302A'); c.fill(); outl(c, 0.6); }
      box(c, 2, -10, 8, 4.6, 1.2, PAL.dark); const bl = Math.sin(t * 8) > 0; glow(c, '#FF5A5A', bl ? 10 : 0); c.fillStyle = bl ? '#FF5A5A' : '#5A2020'; circ(c, 8.4, -7.7, 1.1); noGlow(c);
      c.strokeStyle = 'rgba(255,90,90,.6)'; c.lineWidth = 0.5; c.beginPath(); c.arc(4.6, -7.7, 1.3, 0, TAU); c.moveTo(3, -7.7); c.lineTo(6.2, -7.7); c.stroke(); // skrin sasaran
    },
    meriam(c, L, t, fire) {
      const g = c.createLinearGradient(0, -6, 0, 6); g.addColorStop(0, '#7A808C'); g.addColorStop(0.45, '#2A2E36'); g.addColorStop(1, '#14161C');
      c.beginPath(); c.moveTo(-2, -6.5); c.lineTo(L, -5); c.lineTo(L, 5); c.lineTo(-2, 6.5); c.closePath(); c.fillStyle = g; c.fill(); outl(c, 0.8);
      for (const x of [3, L * 0.55]) { box(c, x, -6.4, 2.2, 12.8, 0.8, PAL.brass); }
      box(c, L - 1, -6.6, 3.4, 13.2, 1, PAL.dark); c.fillStyle = '#0E1014'; c.beginPath(); c.ellipse(L + 2, 0, 1.2, 4, 0, 0, TAU); c.fill();
      c.fillStyle = vgrad(c, 4, 12, '#C8935A', '#5A3418'); circ(c, 4, 8, 4.4); outl(c, 0.7); c.fillStyle = '#3A2414'; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + t * 0.5; c.fillRect(4 + Math.cos(a) * 2 - 0.3, 8 + Math.sin(a) * 2 - 0.3, 0.6, 0.6); } circ(c, 4, 8, 1);
      if (fire > 0.1) { c.fillStyle = 'rgba(180,180,180,' + (0.5 * fire) + ')'; circ(c, L + 4 + (1 - fire) * 6, -2, 3 + (1 - fire) * 3); }
    },
    mortar(c, L, t, fire) {
      c.save(); c.rotate(-0.35 - fire * 0.12); tube(c, -2, L + 2, 8, PAL.olive, 0); box(c, L - 1, -5, 3.4, 10, 1, PAL.dark);
      for (const x of [2, 8]) { c.fillStyle = '#F2C230'; c.fillRect(x, -4, 1.4, 8); } c.fillStyle = '#0E1014'; c.beginPath(); c.ellipse(L + 2.4, 0, 0.9, 3.2, 0, 0, TAU); c.fill(); c.restore();
      c.strokeStyle = '#3E3E2A'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(4, 2); c.lineTo(0, 9); c.moveTo(4, 2); c.lineTo(9, 9); c.stroke(); box(c, -3, 8.4, 14, 2.4, 1, PAL.dark); // kaki & tapak
    },
    // ---------- lontar & senyap ----------
    shuriken(c, L, t, fire) {
      if (fire > 0.5) return; c.save(); c.translate(6, 0); c.rotate(t * 2);
      const g = c.createLinearGradient(-7, -7, 7, 7); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, '#9AA6B4'); g.addColorStop(1, '#4A5260'); c.fillStyle = g; star(c, 0, 0, 4, 7.5, 2.2, 0); outl(c, 0.6);
      c.fillStyle = '#2A2E36'; circ(c, 0, 0, 1.6); c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(-0.3, -7, 0.6, 4); c.restore();
      if (Math.sin(t * 4) > 0.9) { c.fillStyle = '#FFFFFF'; star(c, 9, -4, 4, 2, 0.4, 0); }
    },
    bumerang(c, L, t, fire) {
      if (fire > 0.5) return; c.save(); c.translate(5, 0); c.rotate(Math.sin(t * 2) * 0.2);
      c.beginPath(); c.moveTo(-7, 7); c.quadraticCurveTo(-3, -2, 0, -3); c.quadraticCurveTo(4, -2, 9, 5); c.lineTo(7, 7); c.quadraticCurveTo(3, 0, 0, 0); c.quadraticCurveTo(-3, 1, -5, 8.5); c.closePath();
      c.fillStyle = vgrad(c, -3, 8, '#F2C080', '#8A5A20', '#E0A050'); c.fill(); outl(c, 0.7);
      c.strokeStyle = '#C04A3A'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-5, 5); c.lineTo(-2, 0.5); c.moveTo(3, 0.5); c.lineTo(6.5, 4.5); c.stroke(); c.fillStyle = '#FFFFFF'; for (const p of [[-3.4, 2.8], [4.8, 2.6]]) circ(c, p[0], p[1], 0.5); c.restore();
    },
    lastik(c, L, t, fire) {
      c.strokeStyle = vgrad(c, -8, 8, '#D8A060', '#5A3418'); c.lineWidth = 2.6; c.beginPath(); c.moveTo(0, 7); c.lineTo(4, 0.5); c.lineTo(L + 1, -6.5); c.moveTo(4, 0.5); c.lineTo(L + 1, 6.5); c.stroke(); c.strokeStyle = 'rgba(12,16,24,.7)'; c.lineWidth = 0.5; c.stroke();
      const pull = fire > 0.4 ? 0 : 1; c.strokeStyle = '#D0402E'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(L + 1, -6.5); c.lineTo(2 - pull * 4, 0); c.lineTo(L + 1, 6.5); c.stroke();
      if (pull) { c.fillStyle = vgrad(c, -2, 2, '#B8A898', '#5A4A3A'); circ(c, 1.6 - pull * 4, 0, 1.8); outl(c, 0.5); }
    },
    silang(c, L, t, fire) {
      box(c, -7, -2.2, L + 2, 4.4, 1.2, PAL.wood); c.strokeStyle = 'rgba(60,30,10,.5)'; c.lineWidth = 0.4; for (let x = -5; x < L - 6; x += 2.4) { c.beginPath(); c.moveTo(x, -1.6); c.lineTo(x + 1.6, 1.6); c.stroke(); } // ukiran
      gripHD(c, -2, 1.6, 4, 6.4, PAL.wood, 2); trig(c, 4);
      c.strokeStyle = vgrad(c, -11, 11, '#8A92A2', '#3A404C'); c.lineWidth = 2; c.beginPath(); c.moveTo(L - 7, -11); c.quadraticCurveTo(L - 1, 0, L - 7, 11); c.stroke();
      const pull = fire > 0.3 ? 0 : 1; c.strokeStyle = '#F4EEDF'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(L - 7, -11); c.lineTo(2 - pull * 2, 0); c.lineTo(L - 7, 11); c.stroke();
      if (pull) { c.fillStyle = '#B98A4A'; c.fillRect(1, -0.6, L + 1, 1.2); c.fillStyle = '#C8D0DC'; poly(c, [[L + 2, 0], [L - 1, -1.6], [L - 1, 1.6]]); c.fill(); }
    },
    gergaji(c, L, t, fire, spin) {
      gripHD(c, -2, 0.6, 4.5, 7.4, PAL.dark, 2); trig(c, 4); box(c, -4, -4, L - 6, 8, 2.2, PAL.olive); c.fillStyle = '#F2C230'; c.fillRect(2, -4, 1.4, 8);
      c.save(); c.translate(L - 4, 0); c.rotate((spin || t) * 3 + fire * 4); const g = c.createRadialGradient(-2, -2, 0.5, 0, 0, 8); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#6A7282'); c.fillStyle = g; star(c, 0, 0, 10, 7.4, 5.6, 0); outl(c, 0.5);
      c.fillStyle = '#2A2E36'; circ(c, 0, 0, 1.6); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 0.6; c.beginPath(); c.arc(0, 0, 4, 0, 1.4); c.stroke(); c.restore();
    },
    doktor(c, L, t, fire) {
      c.fillStyle = 'rgba(220,245,255,.65)'; rr(c, 0, -3, L - 2, 6, 2); c.fill(); outl(c, 0.6);
      const lv = 0.35 + 0.6 * (1 - fire); const g = c.createLinearGradient(0, -2, 0, 2); g.addColorStop(0, '#C8FFE8'); g.addColorStop(1, '#3AB88A'); c.fillStyle = g; rr(c, 0.8, -2.2, (L - 3.6) * lv, 4.4, 1.6); c.fill();
      c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(1.5, -2, L - 6, 0.6); for (let x = 3; x < L - 3; x += 2.5) { c.fillStyle = 'rgba(40,80,90,.6)'; c.fillRect(x, 1, 0.4, 1.6); }
      box(c, -4, -4.4, 3.6, 8.8, 1, PAL.white); c.fillStyle = '#9AA0A8'; c.fillRect(L - 2, -0.5, 4, 1); c.fillStyle = '#E5484D'; c.fillRect(L * 0.45 - 1.6, -0.4, 3.2, 0.8); c.fillRect(L * 0.45 - 0.4, -1.6, 0.8, 3.2);
    }
  });
  function WPN_HD_ICE(c, L, t, fire, big) {
    const h = big ? 12 : 9; box(c, -6, -h / 2 + 3, 8, h, 3.5, PAL.ice); c.fillStyle = '#DFF6FF'; c.fillRect(-5, 3, 6, 1.1); // tangki
    gripHD(c, 1, 1.4, 4, 7, PAL.dark, 2); trig(c, 6);
    box(c, -2, -(big ? 5.5 : 4.2), L - 2, big ? 11 : 8.4, big ? 3 : 2.4, PAL.ice); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 0.5; for (let x = 2; x < L - 4; x += 3.5) { c.beginPath(); c.moveTo(x, -3); c.lineTo(x + 1.2, 3); c.stroke(); }
    box(c, L - 4, -(big ? 6.5 : 5), 6, big ? 13 : 10, 1.6, PAL.white);
    const p = 0.5 + 0.5 * Math.sin(t * 3); glow(c, '#BFF4FF', 6 + p * 10); c.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < (big ? 4 : 3); i++) { const a = i * 2.1 + t * 0.8; star(c, L + Math.cos(a) * 2, Math.sin(a) * (big ? 4 : 3), 6, 1.5, 0.5, a); } noGlow(c);
    if (big) { c.fillStyle = 'rgba(220,245,255,.9)'; for (let i = 0; i < 5; i++) poly(c, [[2 + i * 4, -5.5], [3.2 + i * 4, -8 - (i % 2) * 1.6], [4.4 + i * 4, -5.5]]), c.fill(); } // ais tumbuh
  }
  function WPN_HD_STAFF(c, L, t, fire, col, P, skull) {
    c.strokeStyle = vgrad(c, -2, 2, P[0], P[1]); c.lineWidth = 2.6; c.beginPath(); c.moveTo(-6, 0); c.lineTo(L - 3, 0); c.stroke(); c.strokeStyle = 'rgba(12,16,24,.8)'; c.lineWidth = 0.5; c.stroke();
    for (const x of [-2, L * 0.5]) { c.fillStyle = '#F2C230'; c.fillRect(x, -1.6, 1.4, 3.2); }
    c.strokeStyle = '#F2C230'; c.lineWidth = 1; c.beginPath(); c.moveTo(L - 4, -1.5); c.quadraticCurveTo(L - 1, -6, L + 2, -4); c.moveTo(L - 4, 1.5); c.quadraticCurveTo(L - 1, 6, L + 2, 4); c.stroke(); // cakar pemegang
    if (skull) { c.fillStyle = vgrad(c, -3.5, 3.5, '#F2EEE0', '#9A9480'); circ(c, L - 2.4, 0, 2.6); c.fillStyle = '#2F6B33'; circ(c, L - 3.2, -0.4, 0.6); circ(c, L - 1.6, -0.4, 0.6); }
    const p = 0.5 + 0.5 * Math.sin(t * 9); orb(c, L + 2, 0, 3.6 + p + fire * 2, col, Math.max(p, fire));
    if (Math.sin(t * 13) > 0.4 || fire > 0.3) { c.strokeStyle = col; c.lineWidth = 0.7; for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(L + 2, 0); let x = L + 2, y = 0; for (let i = 0; i < 3; i++) { x += 2.6; y += (Math.random() - 0.5) * 4 + (k ? 1.2 : -1.2); c.lineTo(x, y); } c.stroke(); } }
  }

  // ---------- kilatan muncung ikut keluarga ----------
  const MUZ_FAM = {
    gun: (c, L, k, col) => { glow(c, '#FFB040', 12); c.fillStyle = '#FFE07A'; star(c, L + 4, 0, 4, 8 * k + 2, 2, 0.4 + ANIM * 3); c.fillStyle = '#FFFFFF'; circ(c, L + 2.5, 0, 2.2 * k + 0.8); c.fillStyle = 'rgba(255,200,90,.75)'; poly(c, [[L + 2, 0], [L + 4, -5 * k], [L + 5, 0], [L + 4, 5 * k]]); c.fill(); noGlow(c); },
    spread: (c, L, k) => { glow(c, '#FFB040', 14); c.fillStyle = 'rgba(255,190,80,.85)'; for (let i = -2; i <= 2; i++) { c.save(); c.translate(L + 2, 0); c.rotate(i * 0.16); poly(c, [[0, -1], [9 * k + 3, 0], [0, 1]]); c.fill(); c.restore(); } c.fillStyle = '#FFFFFF'; circ(c, L + 3, 0, 2.6 * k + 1); noGlow(c); },
    snipe: (c, L, k) => { glow(c, '#FFF6C0', 16); c.fillStyle = 'rgba(255,240,180,.95)'; poly(c, [[L + 2, -1.2], [L + 18 * k + 4, 0], [L + 2, 1.2]]); c.fill(); c.fillStyle = '#FFE07A'; star(c, L + 3, 0, 4, 6 * k + 2, 1.4, 0); noGlow(c); },
    beam: (c, L, k, col) => { glow(c, col, 20); c.fillStyle = '#FFFFFF'; circ(c, L + 2, 0, 3.4 * k + 1.4); c.strokeStyle = col; c.lineWidth = 1.2; c.beginPath(); c.arc(L + 2, 0, 5 * k + 3, 0, TAU); c.stroke(); noGlow(c); },
    ice: (c, L, k) => { glow(c, '#BFF4FF', 14); c.fillStyle = '#FFFFFF'; star(c, L + 4, 0, 6, 8 * k + 3, 2, ANIM * 4); c.fillStyle = 'rgba(220,245,255,.6)'; circ(c, L + 7, -2, 5 * k + 2); noGlow(c); },
    fire: (c, L, k) => { glow(c, '#FF6A2B', 14); c.fillStyle = 'rgba(255,140,50,.9)'; star(c, L + 5, 0, 6, 10 * k + 3, 3.4, ANIM * 9); c.fillStyle = '#FFE07A'; circ(c, L + 4, 0, 3 * k + 1); noGlow(c); },
    poison: (c, L, k) => { c.fillStyle = 'rgba(178,240,106,.85)'; circ(c, L + 5, 0, 5 * k + 2); c.fillStyle = 'rgba(93,187,99,.7)'; circ(c, L + 8, -3, 3 * k + 1); circ(c, L + 8, 3, 2.4 * k + 1); },
    zap: (c, L, k, col) => { glow(c, col, 18); c.strokeStyle = col; c.lineWidth = 1.1; for (let j = 0; j < 5; j++) { const a = (j - 2) * 0.5; c.beginPath(); c.moveTo(L + 2, 0); let x = L + 2, y = 0; for (let i = 0; i < 3; i++) { x += 3 * Math.cos(a); y += 3 * Math.sin(a) + (Math.random() - 0.5) * 3; c.lineTo(x, y); } c.stroke(); } c.fillStyle = '#FFFFFF'; circ(c, L + 2, 0, 3 * k + 1.2); noGlow(c); },
    boom: (c, L, k) => { glow(c, '#FF6A2B', 18); c.fillStyle = '#FFE07A'; star(c, L + 5, 0, 7, 12 * k + 4, 4.5, ANIM * 7); c.fillStyle = 'rgba(255,255,255,.9)'; circ(c, L + 3, 0, 3 * k + 1); c.fillStyle = 'rgba(160,160,160,' + 0.6 * k + ')'; circ(c, L + 9, -3, 6 * k + 2); noGlow(c); },
    none: () => {}
  };
  const WPN_FAM = { revolver: 'gun', smg: 'gun', mesingan: 'gun', shotgun: 'spread', lima: 'spread', sniper: 'snipe', laser: 'beam', railgun: 'beam', plasma: 'beam', frost: 'ice', nitrogen: 'ice', ais_g: 'ice', api: 'none', napalm: 'fire', racun: 'poison', tongkat_r: 'zap', petir: 'zap', tukul: 'zap', bom: 'none', peluru_p: 'boom', meriam: 'boom', mortar: 'boom', shuriken: 'none', bumerang: 'none', lastik: 'none', silang: 'none', gergaji: 'none', doktor: 'none' };
  Object.keys(WPN_FAM).forEach(w => { const f = MUZ_FAM[WPN_FAM[w]]; MUZ_HD[w] = (c, L, k) => f(c, L, k, WEAPONS[w].peluru); });
  MUZ_HD.mortar = (c, L, k) => { c.save(); c.rotate(-0.35); MUZ_FAM.boom(c, L, k); c.restore(); };

  // ---------- peluru HD ----------
  function tracer(len, th, col, core) { const g = ctx.createLinearGradient(-len, 0, 0, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, col); ctx.fillStyle = g; ctx.fillRect(-len, -th / 2, len, th); glow(ctx, col, 6); ctx.fillStyle = core || '#FFFFFF'; ctx.beginPath(); ctx.ellipse(0, 0, th * 1.1, th * 0.6, 0, 0, TAU); ctx.fill(); noGlow(ctx); }
  Object.assign(BUL_HD, {
    revolver(b, a) { ctx.rotate(a); tracer(18, 2.8, '#FFE07A', '#FFF6D0'); },
    smg(b, a) { ctx.rotate(a); tracer(10, 1.6, '#FFC36A'); },
    mesingan(b, a) { ctx.rotate(a); const red = (b._n || (b._n = Math.random() < 0.25 ? 2 : 1)) === 2; tracer(red ? 20 : 12, red ? 2.2 : 1.8, red ? '#FF6A4A' : '#FFB04A'); },
    shotgun(b, a) { ctx.rotate(a); tracer(8, 2.4, '#FF9EC8', '#FFE8F2'); },
    lima(b, a) { ctx.rotate(a); tracer(8, 2.2, '#FF8EB8', '#FFE8F2'); },
    sniper(b, a, age, trail) { ctx.rotate(a); tracer(46, 2, '#D8FFB0', '#FFFFFF'); trail({ spd: 4, warna: 'rgba(220,255,200,.6)', size: 1.6, life: 0.35, rate: 0.8, drag: 4 }); },
    laser(b, a) { ctx.rotate(a); glow(ctx, '#FF4FD8', 16); ctx.fillStyle = 'rgba(255,79,216,.55)'; ctx.fillRect(-46, -3.4, 46, 6.8); ctx.fillStyle = '#FFB8F0'; ctx.fillRect(-46, -1.6, 46, 3.2); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-46, -0.6, 46, 1.2); noGlow(ctx); },
    railgun(b, a, age) { ctx.rotate(a); glow(ctx, '#9AA8FF', 22); ctx.fillStyle = 'rgba(154,168,255,.45)'; ctx.fillRect(-80, -6, 80, 12); ctx.fillStyle = '#C8D0FF'; ctx.fillRect(-80, -2.6, 80, 5.2); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-80, -1, 80, 2); noGlow(ctx);
      ctx.strokeStyle = 'rgba(210,220,255,.8)'; ctx.lineWidth = 0.8; ctx.beginPath(); for (let x = -80; x <= 0; x += 4) ctx.lineTo(x, Math.sin(x * 0.5 + age * 60) * 5); ctx.stroke(); },
    plasma(b, a, age, trail) { glow(ctx, '#7AF0FF', 16); orb(ctx, 0, 0, 7 + Math.sin(age * 30), '#7AF0FF', 1); ctx.strokeStyle = 'rgba(122,240,255,.8)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(0, 0, 9, 4, age * 12, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, 9, 4, -age * 12, 0, TAU); ctx.stroke(); noGlow(ctx); trail({ spd: 10, warna: ['#7AF0FF', '#FFFFFF'], size: 2.4, life: 0.3, rate: 0.7 }); },
    frost(b, a, age, trail) { ctx.rotate(a); glow(ctx, '#9FE6FF', 12); ctx.fillStyle = vgrad(ctx, -4, 4, '#FFFFFF', '#5AB4E0'); poly(ctx, [[9, 0], [0, -4], [-9, 0], [0, 4]]); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.9)'; poly(ctx, [[5, 0], [0, -1.6], [-4, 0], [0, 1.6]]); ctx.fill(); noGlow(ctx); trail({ spd: 15, warna: ['#FFFFFF', '#9FE6FF'], size: 2, life: 0.4, shape: 'star', rate: 0.7 }); },
    nitrogen(b, a, age, trail) { glow(ctx, '#CFF4FF', 12); ctx.fillStyle = 'rgba(220,245,255,.75)'; circ(ctx, 0, 0, 7); ctx.fillStyle = '#FFFFFF'; star(ctx, 0, 0, 6, 5, 1.6, age * 6); noGlow(ctx); trail({ spd: 12, warna: ['#FFFFFF', '#CFF4FF'], size: 4, life: 0.6, shape: 'smoke', rate: 0.9, drag: 2 }); },
    ais_g(b, a, age, trail) { ctx.rotate(age * 4); glow(ctx, '#B8ECFF', 14); ctx.fillStyle = vgrad(ctx, -9, 9, '#FFFFFF', '#5AB4E0', '#B8ECFF'); poly(ctx, [[0, -10], [7, -4], [8, 5], [0, 10], [-8, 4], [-6, -6]]); ctx.fill(); outl(ctx, 0.6); ctx.fillStyle = 'rgba(255,255,255,.8)'; poly(ctx, [[0, -7], [3, -3], [0, 0], [-3, -3]]); ctx.fill(); noGlow(ctx); trail({ spd: 30, warna: ['#FFFFFF', '#B8ECFF'], size: 2.4, life: 0.4, shape: 'shard', rate: 0.8 }); },
    api(b, a, age, trail) { ctx.rotate(a); ctx.fillStyle = vgrad(ctx, -1, 1, '#E0B070', '#7A4A1A'); ctx.fillRect(-15, -0.8, 15, 1.6); ctx.fillStyle = '#E8E0D0'; poly(ctx, [[-15, 0], [-18, -2.6], [-13, -0.6]]); ctx.fill(); poly(ctx, [[-15, 0], [-18, 2.6], [-13, 0.6]]); ctx.fill();
      glow(ctx, '#FF6A2B', 14); ctx.fillStyle = Math.sin(age * 40) > 0 ? '#FFE07A' : '#FF8A3A'; star(ctx, 2, 0, 6, 5.5, 2.2, age * 10); noGlow(ctx); trail({ spd: 20, warna: ['#FFB04A', '#FF6A2B', '#E5302A'], size: 3, life: 0.35, up: 30, rate: 1 }); },
    napalm(b, a, age, trail) { glow(ctx, '#FF6A2B', 16); orb(ctx, 0, 0, 8 + Math.sin(age * 25), '#FF6A2B', 1); ctx.fillStyle = '#FFE07A'; circ(ctx, 0, 0, 3); noGlow(ctx); trail({ spd: 20, warna: ['#FFB04A', '#E5302A', '#FF6A2B'], size: 4.5, life: 0.45, up: 20, rate: 1 }); trail({ spd: 8, warna: '#6A5A50', size: 4, life: 0.6, shape: 'smoke', rate: 0.4 }); },
    racun(b, a, age, trail) { const r = 5.5 + Math.sin(age * 25); const g = ctx.createRadialGradient(-1.5, -1.5, 0.5, 0, 0, r); g.addColorStop(0, '#F0FFD8'); g.addColorStop(0.5, '#A6F05A'); g.addColorStop(1, '#3E8A2E'); ctx.fillStyle = g; circ(ctx, 0, 0, r); outl(ctx, 0.5); ctx.fillStyle = 'rgba(255,255,255,.7)'; circ(ctx, -2, -2, 1.4); trail({ spd: 10, warna: ['#B2F06A', '#5DBB63'], size: 2.6, life: 0.6, rate: 0.7, grav: 60 }); },
    tongkat_r(b, a, age, trail) { BUL_HD.racun(b, a, age, trail); glow(ctx, '#B2F06A', 10); ctx.strokeStyle = '#E0FFB0'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(0, 0, 8, age * 8, age * 8 + 2); ctx.stroke(); noGlow(ctx); },
    petir(b, a, age, trail) { ZAP_BUL(a, '#FFF27A', trail); },
    tukul(b, a, age, trail) { ZAP_BUL(a, '#FFF06A', trail, 1.6); },
    bom(b, a, age, trail) { ctx.rotate(age * 10); const g = ctx.createRadialGradient(-2, -2, 0.5, 0, 0, 6); g.addColorStop(0, '#8A8A8A'); g.addColorStop(1, '#1E1E1E'); ctx.fillStyle = g; circ(ctx, 0, 0, 5.5); outl(ctx, 0.5); glow(ctx, '#FFB040', 8); ctx.fillStyle = Math.sin(age * 40) > 0 ? '#FFE07A' : '#FF6A2B'; star(ctx, 3, -6, 4, 3, 1, age * 12); noGlow(ctx); trail({ spd: 20, warna: ['#FFE07A', '#FF8A3A'], size: 1.4, life: 0.25, rate: 0.6 }); },
    peluru_p(b, a, age, trail) { ctx.rotate(a); const fl = 6 + Math.random() * 4; glow(ctx, '#5AC8FF', 10); ctx.fillStyle = '#BFF4FF'; poly(ctx, [[-8, -1.8], [-8 - fl, 0], [-8, 1.8]]); ctx.fill(); noGlow(ctx);
      rr(ctx, -8, -2.4, 12, 4.8, 1.6); ctx.fillStyle = vgrad(ctx, -2.4, 2.4, '#F2F6FA', '#6A7282'); ctx.fill(); ctx.fillStyle = '#E5302A'; poly(ctx, [[4, -2.4], [9, 0], [4, 2.4]]); ctx.fill(); ctx.fillStyle = '#3A404C'; for (const s of [-1, 1]) poly(ctx, [[-8, s * 2.2], [-10, s * 4.6], [-5, s * 2.2]]), ctx.fill();
      trail({ spd: 10, warna: ['#E8ECF4', '#B8C2CC'], size: 3.6, life: 0.7, shape: 'smoke', rate: 1, drag: 2 }); },
    meriam(b, a, age, trail) { const g = ctx.createRadialGradient(-2, -2, 0.5, 0, 0, 7); g.addColorStop(0, '#7A808C'); g.addColorStop(1, '#14161C'); ctx.fillStyle = g; circ(ctx, 0, 0, 6.5); outl(ctx, 0.5); ctx.fillStyle = 'rgba(255,255,255,.4)'; circ(ctx, -2.2, -2.2, 1.6); trail({ spd: 8, warna: ['#A8A8A8', '#888888'], size: 3.6, life: 0.5, shape: 'smoke', rate: 0.7 }); },
    mortar(b, a, age, trail) { ctx.rotate(a); rr(ctx, -6, -3, 10, 6, 2.4); ctx.fillStyle = vgrad(ctx, -3, 3, '#A8B470', '#3E4620'); ctx.fill(); outl(ctx, 0.5); ctx.fillStyle = '#F2C230'; ctx.fillRect(-1, -3, 1.2, 6); ctx.fillStyle = '#3E3E2A'; for (const s of [-1, 1]) poly(ctx, [[-6, s * 2.6], [-9, s * 4.6], [-4, s * 2.6]]), ctx.fill(); trail({ spd: 8, warna: '#9A9A8A', size: 3, life: 0.5, shape: 'smoke', rate: 0.6 }); },
    shuriken(b, a, age, trail) { ctx.rotate(age * 25); const g = ctx.createLinearGradient(-7, -7, 7, 7); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#5A6272'); ctx.fillStyle = g; star(ctx, 0, 0, 4, 7.5, 2.2, 0); outl(ctx, 0.5); ctx.fillStyle = '#2A2E36'; circ(ctx, 0, 0, 1.4);
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 8, 0, 1.2); ctx.stroke(); },
    bumerang(b, a, age) { ctx.rotate(age * 18); ctx.strokeStyle = 'rgba(224,160,80,.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 9, -0.6, 0.8); ctx.stroke(); ctx.lineCap = 'round'; ctx.strokeStyle = vgrad(ctx, -4, 6, '#F2C080', '#8A5A20'); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-7, 5); ctx.quadraticCurveTo(0, -5, 7, 5); ctx.stroke(); ctx.strokeStyle = '#C04A3A'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-4, 1.4); ctx.lineTo(-2.4, -0.4); ctx.stroke(); },
    lastik(b, a) { const g = ctx.createRadialGradient(-1, -1, 0.3, 0, 0, 3.6); g.addColorStop(0, '#E0D8C8'); g.addColorStop(1, '#5A4A3A'); ctx.fillStyle = g; circ(ctx, 0, 0, 3.4); outl(ctx, 0.4); ctx.rotate(a); ctx.fillStyle = 'rgba(200,180,150,.35)'; ctx.fillRect(-9, -1.2, 7, 2.4); },
    silang(b, a) { ctx.rotate(a); ctx.fillStyle = vgrad(ctx, -1, 1, '#E0B070', '#7A4A1A'); ctx.fillRect(-14, -0.8, 15, 1.6); ctx.fillStyle = '#C8D0DC'; poly(ctx, [[5, 0], [1, -2.2], [1, 2.2]]); ctx.fill(); outl(ctx, 0.4); ctx.fillStyle = '#E5484D'; poly(ctx, [[-14, 0], [-17, -2.6], [-12, -0.6]]); ctx.fill(); poly(ctx, [[-14, 0], [-17, 2.6], [-12, 0.6]]); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-26, -0.5, 10, 1); },
    gergaji(b, a, age, trail) { ctx.rotate(age * 30); const g = ctx.createRadialGradient(-2, -2, 0.5, 0, 0, 9); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#6A7282'); ctx.fillStyle = g; star(ctx, 0, 0, 10, 8.5, 6, 0); outl(ctx, 0.5); ctx.fillStyle = '#2A2E36'; circ(ctx, 0, 0, 2); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0, 0, 10, 0, 1.4); ctx.stroke(); trail({ spd: 70, warna: ['#FFE07A', '#FFFFFF'], size: 1.5, life: 0.2, rate: 0.6, shape: 'star' }); },
    doktor(b, a) { ctx.rotate(a); ctx.fillStyle = 'rgba(220,245,255,.85)'; rr(ctx, -8, -1.8, 9, 3.6, 1.2); ctx.fill(); ctx.fillStyle = '#3AB88A'; ctx.fillRect(-7, -1.1, 6, 2.2); ctx.fillStyle = '#C8CED8'; ctx.fillRect(1, -0.4, 6, 0.8); glow(ctx, '#7FF0C8', 8); ctx.fillStyle = '#7FF0C8'; ctx.fillRect(-12, -0.7, 4, 1.4); noGlow(ctx); }
  });
  function ZAP_BUL(a, col, trail, w) { ctx.rotate(a); glow(ctx, col, 16); ctx.strokeStyle = col; ctx.lineWidth = 2.2 * (w || 1); ctx.beginPath(); ctx.moveTo(-18, 0); for (let i = 1; i <= 6; i++) ctx.lineTo(-18 + i * 3.4, (Math.random() - 0.5) * 6); ctx.stroke(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 0.9 * (w || 1); ctx.stroke(); noGlow(ctx); orb(ctx, 0, 0, 5 * (w || 1), col, 1); trail({ spd: 30, warna: ['#FFFFFF', col], size: 1.6, life: 0.25, shape: 'star', rate: 0.6 }); }

  // ---------- hentaman HD ikut keluarga ----------
  const HIT_FAM = {
    gun: (b, f, big) => { emit(f.x, f.y, big ? 7 : 4, { a: f.a + Math.PI, spread: 1.5, spd: 170, warna: ['#FFFFFF', '#FFE07A', '#FFB040'], size: 2, life: 0.25, drag: 3, shape: 'star' }); if (big) b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.22, r: big * 10, col: '255,224,122' }); },
    beam: (b, f) => { const c = WEAPONS[f.wid].peluru; emit(f.x, f.y, 8, { spd: 120, warna: ['#FFFFFF', c], size: 2.2, life: 0.35, shape: 'star', drag: 2 }); b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.3, r: f.wid === 'railgun' ? 26 : 16, col: f.wid === 'laser' ? '255,79,216' : f.wid === 'railgun' ? '154,168,255' : '122,240,255', w: f.wid === 'railgun' ? 5 : 3 }); },
    ice: (b, f) => { emit(f.x, f.y, f.wid === 'frost' ? 7 : 12, { spd: 140, warna: ['#FFFFFF', '#BFF4FF', '#5AC8FF'], size: 3, life: 0.5, shape: 'shard', drag: 2.5, grav: 120 }); b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.3, r: 14, col: '191,244,255' }); },
    fire: (b, f) => { emit(f.x, f.y, 9, { a: -Math.PI / 2, spread: 1.6, spd: 90, warna: ['#FFE07A', '#FF8A3A', '#E5302A'], size: 3.2, life: 0.45, up: 40 }); },
    poison: (b, f) => { emit(f.x, f.y, 9, { spd: 90, warna: ['#E0FFB0', '#A6F05A', '#3E8A2E'], size: 3, life: 0.5, grav: 200, drag: 1.5 }); },
    zap: (b, f) => { const c = WEAPONS[f.wid].peluru; emit(f.x, f.y, 8, { spd: 150, warna: ['#FFFFFF', c], size: 2.2, life: 0.35, shape: 'star', drag: 2 }); b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.28, r: f.wid === 'tukul' ? 24 : 16, col: '255,242,122', w: f.wid === 'tukul' ? 5 : 3 }); },
    thrown: (b, f) => { emit(f.x, f.y, 5, { a: f.a + Math.PI, spread: 1.8, spd: 120, warna: ['#FFFFFF', '#E8E0D0', WEAPONS[f.wid].peluru], size: 2, life: 0.3, shape: 'sq', drag: 2, grav: 200 }); },
    heal: (b, f) => { emit(f.x, f.y, 6, { a: -Math.PI / 2, spread: 1.2, spd: 60, warna: ['#7FF0C8', '#FFFFFF'], size: 3, life: 0.6, shape: 'plus', drag: 1 }); }
  };
  const HIT_OF = { revolver: 'gun', smg: 'gun', mesingan: 'gun', shotgun: 'gun', lima: 'gun', sniper: 'gun', laser: 'beam', railgun: 'beam', plasma: 'beam', frost: 'ice', nitrogen: 'ice', ais_g: 'ice', api: 'fire', napalm: 'fire', racun: 'poison', tongkat_r: 'poison', petir: 'zap', tukul: 'zap', shuriken: 'thrown', bumerang: 'thrown', lastik: 'thrown', silang: 'thrown', gergaji: 'thrown', doktor: 'heal' };
  function hitHD2(b, f) { const k = HIT_OF[f.wid]; if (!k) return false; HIT_FAM[k](b, f, f.wid === 'sniper' ? 2 : f.wid === 'revolver' ? 1 : 0); return true; }
  function boomHD2(b, f) {
    if (WEAPONS[f.wid] && WEAPONS[f.wid].gen) return boomGen(b, f);
    const W0 = { peluru_p: ['191,244,255', ['#FFFFFF', '#BFF4FF', '#5AC8FF', '#FF8A3A']], meriam: ['255,230,180', ['#FFFFFF', '#FFE07A', '#FF8A3A']], mortar: ['230,220,180', ['#FFE07A', '#C8A060', '#8A6A3A']], bom: ['255,230,180', ['#FFFFFF', '#FFE07A', '#FF8A3A', '#E5302A']], napalm: ['255,150,80', ['#FFE07A', '#FF6A2B', '#E5302A']], nitrogen: ['220,245,255', ['#FFFFFF', '#CFF4FF']], ais_g: ['220,245,255', ['#FFFFFF', '#B8ECFF', '#5AC8FF']], tukul: ['255,242,122', ['#FFFFFF', '#FFF06A']] }[f.wid];
    if (!W0) return false; const r = f.r || 50;
    b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.42, r: r * 1.35, col: W0[0], w: 5 });
    emit(f.x, f.y, 22, { spd: r * 4.2, warna: W0[1], size: 4.5, life: 0.5, drag: 3.5, shape: f.wid === 'ais_g' || f.wid === 'nitrogen' ? 'shard' : 'c' });
    if (f.wid !== 'nitrogen' && f.wid !== 'ais_g') emit(f.x, f.y, 8, { spd: r * 1.3, warna: ['#5A5A5A', '#7A7A7A'], size: r * 0.28, life: 1.1, shape: 'smoke', drag: 2, up: 30 });
    if (f.wid === 'meriam' || f.wid === 'mortar') emit(f.x, f.y, 12, { spd: 220, warna: ['#4A3A2A', '#6A5A40'], size: 2.6, life: 0.9, grav: 500, shape: 'sq', up: 160 });
    return true;
  }
