  // ================= v9.8: RUPA 200 SENJATA BAHARU =================
  // 179 senjata dijana daripada 25 bentuk asas + palet jenis + hiasan kelangkaan + variasi (hash nama).
  // 21 senjata Mitos dilukis satu demi satu (MITOS_HD). Konvensyen sama: pemegang (0,0), muncung di (L+2, 0).
  const GPAL = {
    biasa: [PAL.steel, PAL.dark], serak: [PAL.wood, PAL.steel], tepat: [PAL.olive, PAL.dark], letup: [PAL.olive, PAL.red], lontar: [PAL.wood, PAL.steel],
    ais: [PAL.ice, PAL.white], api: [PAL.red, PAL.dark], racun: [PAL.green, PAL.dark], elektrik: [PAL.dark, PAL.brass], tenaga: [PAL.white, PAL.purple], sokong: [PAL.white, PAL.green],
    angin: [['#E8FFFB', '#2E7A74', '#86D8CC'], PAL.white], bumi: [['#E2D2B0', '#4E3C26', '#9A8462'], PAL.wood], air: [['#D8F2FF', '#18508E', '#4A9AE0'], PAL.white],
    cahaya: [['#FFF8D0', '#8A5E0E', '#E8C04A'], PAL.white], bayang: [['#C8B0F0', '#160E26', '#46366C'], PAL.dark]
  };
  const FAM_BG = { biasa: ['#EEF2F8', '#8C9AB0'], serak: ['#FFE4D0', '#C87A4A'], tepat: ['#EAF2D0', '#7A8A40'], letup: ['#FFD0C2', '#E5584D'], lontar: ['#F4E6D0', '#A87A48'], ais: ['#CFF3FF', '#5AB4E0'],
    api: ['#FFD9A0', '#F07A2E'], racun: ['#DDF7B4', '#5DBB63'], elektrik: ['#FFF5B0', '#B48AF0'], tenaga: ['#F8D8FF', '#B05AD8'], sokong: ['#D2FAEC', '#2EAE8E'], angin: ['#DFFBF6', '#4AB8A8'],
    bumi: ['#EADCC0', '#8A6A44'], air: ['#D6EEFF', '#3A84D0'], cahaya: ['#FFF6C8', '#E0A82A'], bayang: ['#E2D6F6', '#5A4488'] };
  function ghash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
  function gEye(c, x, y, r, col) { glow(c, col, 6); c.fillStyle = col; circ(c, x, y, r); c.fillStyle = 'rgba(255,255,255,.85)'; circ(c, x - r * 0.3, y - r * 0.3, r * 0.35); noGlow(c); }
  function gBand(c, x, y0, y1, col) { c.fillStyle = col; c.fillRect(x, y0, 1.4, y1 - y0); }
  function flame(c, x, y, s, t, cols) { glow(c, cols[1], 10); for (let i = 0; i < 3; i++) { const k = 1 - i * 0.28, w = Math.sin(t * 14 + i) * 0.8; c.fillStyle = cols[i]; c.beginPath(); c.moveTo(x - 3 * s * k, y); c.quadraticCurveTo(x - 2 * s * k + w, y - 6 * s * k, x + w, y - 9 * s * k); c.quadraticCurveTo(x + 2 * s * k + w, y - 6 * s * k, x + 3 * s * k, y); c.closePath(); c.fill(); } noGlow(c); }

  // ---------- 25 bentuk asas: (c, L, t, fire, P badan, S kedua, A warna tenaga, v variasi 0–7, w data) ----------
  const GSHAPE = {
    pistol(c, L, t, fire, P, S, A, v) { gripHD(c, -2, 0, 5, 8, S, 2.5); trig(c, 4); box(c, -3, -3.6, L - 3, 5.6, 1.6, P); tube(c, L - 5, L + 2, 3, S, -1); if (v & 1) { c.fillStyle = A; c.fillRect(2, -2, L - 7, 1.2); } if (v & 2) box(c, L - 4, -5.4, 2, 1.8, 0.5, S); gEye(c, 1, -1, 1, A); },
    smg(c, L, t, fire, P, S, A, v) { gripHD(c, -2, 1, 4.5, 7.5, S, 2); trig(c, 4.5); box(c, 6, 2, 3.6, 9 + (v & 1) * 2, 1, S); box(c, -7, -2.6, 6, 3.6, 1, S); box(c, -1, -3.6, L - 2, 6.4, 1.6, P); c.fillStyle = 'rgba(20,24,32,.55)'; for (let i = 0; i < 4; i++) c.fillRect(L * 0.45 + i * 1.6, -2.6, 0.9, 3.6); tube(c, L - 3, L + 2, 2.4, S, 0); gEye(c, 2, -4, 0.8, A); },
    senapang(c, L, t, fire, P, S, A, v, w) { poly(c, [[-13, -2], [-3, -3], [-3, 2.5], [-12, 4]]); c.fillStyle = vgrad(c, -3, 4, S[0], S[1], S[2]); c.fill(); outl(c, 0.7); gripHD(c, 0, 1.5, 4, 7, S, 2); trig(c, 5);
      box(c, -3, -3.6, L * 0.62, 6.4, 1.8, P); if (v & 1) { box(c, 6, 2.4, 3.4, 7, 1, S); } tube(c, L * 0.55, L + 2, 2.8, S, -0.4); if (v & 2) box(c, 2, -6.4, 8, 2.4, 0.8, PAL.dark);
      if (w.jenis === 'm') { glow(c, A, 8); c.fillStyle = A; c.fillRect(0, -1.2, L * 0.55, 1.4); c.fillRect(L - 1, -2.6, 1.6, 4.4); noGlow(c); } else shine(c, 0, L * 0.5, -3); },
    gatling(c, L, t, fire, P, S, A, v, w, spin) { gripHD(c, -5, 1, 4, 7, S, 2); box(c, -6, -5, 12, 10, 2.4, P); const r = (spin || 0) * 25 + t * 2; for (let i = 0; i < 3; i++) { const y = Math.sin(r + i * 2.09) * 2.6; tube(c, 5, L + 2, 2, i === 1 ? S : PAL.steel, y); }
      box(c, 5, -4.2, 2.2, 8.4, 1, S); box(c, L - 1.5, -4, 2, 8, 1, S); gEye(c, 0, 0, 1.4, A); },
    patah(c, L, t, fire, P, S, A, v, w) { poly(c, [[-12, -1.6], [-2, -2.8], [-2, 2.8], [-11, 4.4]]); c.fillStyle = vgrad(c, -3, 4, PAL.wood[0], PAL.wood[1], PAL.wood[2]); c.fill(); outl(c, 0.7); gripHD(c, -1, 1.5, 4, 7, PAL.wood, 2); trig(c, 4);
      box(c, -2, -3.4, 9, 6.2, 1.6, P); const n = w.n >= 5 ? 3 : 2; for (let i = 0; i < n; i++) tube(c, 6, L + 2, 2.2, S, -1.8 + i * (3.6 / Math.max(1, n - 1)) - (n === 3 ? 0 : 0)); box(c, L * 0.5 - fire * 3, 1.6, 6, 3, 1, PAL.wood);
      if (n === 3) { c.fillStyle = A; c.fillRect(L - 3, -3.8, 1.4, 7.6); } },
    sniper(c, L, t, fire, P, S, A, v) { poly(c, [[-14, -2], [-3, -2.6], [-3, 2.6], [-13, 4.6], [-15, 3]]); c.fillStyle = vgrad(c, -3, 4, P[0], P[1], P[2]); c.fill(); outl(c, 0.7); gripHD(c, -1, 1.5, 3.6, 6.5, S, 2); trig(c, 3.6);
      box(c, -3, -2.8, 12, 5.2, 1.4, P); tube(c, 8, L + 2, 2, S, -0.4); box(c, L - 1, -2.2, 3, 3.6, 0.8, S); box(c, 0, -8, 11, 3.4, 1.4, PAL.dark); c.fillStyle = A; glow(c, A, 6); circ(c, 11, -6.3, 1.4); noGlow(c);
      if (v & 1) { c.strokeStyle = '#3A404C'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(L * 0.6, 1); c.lineTo(L * 0.6 - 2, 8); c.moveTo(L * 0.6, 1); c.lineTo(L * 0.6 + 2, 8); c.stroke(); } },
    pelancar(c, L, t, fire, P, S, A, v) { gripHD(c, 2, 3, 4, 7, S, 2); trig(c, 7); box(c, -8, -4.2, L + 6, 8.4, 3.4, P); for (let x = -4; x < L - 2; x += 7) gBand(c, x, -4.2, 4.2, 'rgba(20,24,32,.5)');
      poly(c, [[L - 2, -5], [L + 2, -4], [L + 2, 4], [L - 2, 5]]); c.fillStyle = vgrad(c, -5, 5, S[0], S[1], S[2]); c.fill(); outl(c, 0.7); box(c, 0, -7, 6, 2.6, 1, S); c.fillStyle = A; circ(c, 3, -5.8, 0.9);
      if (v & 1) { c.fillStyle = A; poly(c, [[L + 2, -2.4], [L + 4.5, 0], [L + 2, 2.4]]); c.fill(); } },
    meriam(c, L, t, fire, P, S, A, v) { gripHD(c, -2, 3, 4, 6, S, 2); poly(c, [[-6, -5.5], [L + 1, -3.8], [L + 1, 3.8], [-6, 5.5]]); c.fillStyle = vgrad(c, -5.5, 5.5, P[0], P[1], P[2]); c.fill(); outl(c, 0.8);
      for (const x of [2, L * 0.5, L - 2]) box(c, x, -5.2 + x * 0.05, 2.2, 10.4 - x * 0.1, 1, S); c.fillStyle = S[1]; circ(c, -6.5, 0, 3.4); c.fillStyle = '#14161C'; c.beginPath(); c.ellipse(L + 1.6, 0, 1.4, 3, 0, 0, TAU); c.fill();
      if (v & 1) gEye(c, L * 0.3, -1, 1.4, A); },
    bom(c, L, t, fire, P, S, A, v) { c.fillStyle = '#F2C8A0'; circ(c, 0, 2, 3.2); outl(c, 0.5); const g = c.createRadialGradient(L - 4, -2, 0.6, L - 3, 0, 6); g.addColorStop(0, P[0]); g.addColorStop(0.6, P[2]); g.addColorStop(1, P[1]); c.fillStyle = g; circ(c, L - 3, 0, 5.2); outl(c, 0.6);
      c.fillStyle = 'rgba(255,255,255,.5)'; circ(c, L - 5, -2, 1.3); box(c, L - 4.6, -6.6, 3.2, 2, 0.6, S); c.strokeStyle = '#6A5A40'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(L - 3, -6.6); c.quadraticCurveTo(L - 1, -9, L + 1, -8.4); c.stroke();
      glow(c, A, 8); c.fillStyle = Math.sin(t * 30) > 0 ? '#FFE07A' : A; star(c, L + 1, -8.4, 4, 2.2, 0.8, t * 9); noGlow(c); },
    lastik(c, L, t, fire, P, S, A, v) { c.lineCap = 'round'; c.strokeStyle = S[1]; c.lineWidth = 3.2; c.beginPath(); c.moveTo(-1, 6); c.lineTo(3, 0); c.stroke(); c.strokeStyle = P[2]; c.lineWidth = 2.4; c.beginPath(); c.moveTo(3, 0); c.lineTo(L - 1, -5); c.moveTo(3, 0); c.lineTo(L - 1, 5); c.stroke();
      c.strokeStyle = A; c.lineWidth = 1; const pull = fire * 4; c.beginPath(); c.moveTo(L - 1, -5); c.lineTo(L - 3 - pull, 0); c.lineTo(L - 1, 5); c.stroke(); c.fillStyle = P[0]; circ(c, L - 3 - pull, 0, 1.8); outl(c, 0.4); },
    cakera(c, L, t, fire, P, S, A, v, w, spin) { gripHD(c, -2, 0, 4.5, 7, S, 2); box(c, -2, -2.4, L - 6, 4, 1.4, S); c.save(); c.translate(L - 3, 0); c.rotate((spin || 0) * 6 + t * 3); const g = c.createRadialGradient(-1, -1, 0.5, 0, 0, 6); g.addColorStop(0, P[0]); g.addColorStop(1, P[1]); c.fillStyle = g;
      star(c, 0, 0, w.nama.includes('Bumerang') ? 3 : 10, 5.6, w.nama.includes('Bumerang') ? 2 : 4.4, 0); outl(c, 0.5); c.fillStyle = A; circ(c, 0, 0, 1.4); c.restore(); },
    busur(c, L, t, fire, P, S, A, v) { const pull = fire * 3; c.lineCap = 'round'; c.strokeStyle = vgrad(c, -11, 11, P[0], P[1], P[2]); c.lineWidth = 2.6; c.beginPath(); c.moveTo(1, -11); c.quadraticCurveTo(L * 0.7, 0, 1, 11); c.stroke(); c.strokeStyle = 'rgba(12,16,24,.6)'; c.lineWidth = 0.6; c.stroke();
      c.strokeStyle = '#F2EEE6'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(1, -11); c.lineTo(-1 - pull, 0); c.lineTo(1, 11); c.stroke(); box(c, 2, -2, 3, 4, 1, S);
      c.fillStyle = vgrad(c, -0.6, 0.6, '#E0B070', '#7A4A1A'); c.fillRect(-1 - pull, -0.6, L + 1 + pull, 1.2); glow(c, A, 6); c.fillStyle = A; poly(c, [[L + 2, 0], [L - 1.5, -2], [L - 1.5, 2]]); c.fill(); noGlow(c);
      if (v & 1) { c.fillStyle = A; poly(c, [[1, -11], [-1, -13], [2, -12]]); c.fill(); poly(c, [[1, 11], [-1, 13], [2, 12]]); c.fill(); } },
    bintang(c, L, t, fire, P, S, A, v, w, spin) { gripHD(c, -2, 0, 4, 6, S, 1.5); c.save(); c.translate(L - 2, 0); c.rotate((spin || 0) * 8); const g = c.createLinearGradient(-5, -5, 5, 5); g.addColorStop(0, P[0]); g.addColorStop(1, P[1]); c.fillStyle = g;
      if (w.nama.includes('Kerambit')) { c.beginPath(); c.arc(0, 2, 5, -Math.PI * 0.9, -0.1); c.arc(1, 2, 3, -0.1, -Math.PI * 0.9, true); c.closePath(); c.fill(); outl(c, 0.5); } else { star(c, 0, 0, 4, 5.2, 1.6, 0); outl(c, 0.5); } c.fillStyle = A; circ(c, 0, 0, 1); c.restore(); },
    tongkat(c, L, t, fire, P, S, A, v, w) { c.lineCap = 'round'; c.strokeStyle = vgrad(c, -2, 2, S[0], S[1], S[2]); c.lineWidth = 2.6; c.beginPath(); c.moveTo(-7, 2.4); c.lineTo(L - 3, 0); c.stroke(); c.strokeStyle = 'rgba(12,16,24,.55)'; c.lineWidth = 0.5; c.stroke();
      for (const x of [0, L * 0.5]) box(c, x, -1.8, 1.8, 3.6, 0.6, P); c.strokeStyle = P[2]; c.lineWidth = 1.2; c.beginPath(); c.moveTo(L - 4, -1); c.quadraticCurveTo(L - 2, -5, L + 1, -3); c.moveTo(L - 4, 1); c.quadraticCurveTo(L - 2, 5, L + 1, 3); c.stroke();
      if (w.nama.includes('Payung')) { c.fillStyle = vgrad(c, -8, 0, P[0], P[1], P[2]); c.beginPath(); c.arc(L - 2, 0, 7, Math.PI * 0.5, Math.PI * 1.5, true); c.closePath(); c.fill(); outl(c, 0.5); }
      orb(c, L - 0.5, 0, 3.6 + Math.sin(t * 6) * 0.4 + fire, A, fire); },
    penyembur(c, L, t, fire, P, S, A, v) { box(c, -10, -1, 8, 10, 3.6, P); gBand(c, -7, -1, 9, 'rgba(255,255,255,.35)'); c.strokeStyle = '#3A404C'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-6, -1); c.quadraticCurveTo(-4, -6, 2, -2); c.stroke();
      gripHD(c, 1, 1, 4, 7, S, 2); trig(c, 5); box(c, 0, -3.4, 8, 5.6, 1.6, S); tube(c, 7, L + 1, 2.6, P, -0.6); poly(c, [[L, -2.4], [L + 2.6, -3.6], [L + 2.6, 2.4], [L, 1.2]]); c.fillStyle = vgrad(c, -3.6, 2.4, S[0], S[1], S[2]); c.fill(); outl(c, 0.5);
      if (fire > 0.2) { c.fillStyle = A; c.globalAlpha = 0.6 * fire; circ(c, L + 4, -0.6, 2.4 * fire); c.globalAlpha = 1; } },
    gegelung(c, L, t, fire, P, S, A, v) { gripHD(c, -2, 1, 4, 7, S, 2); box(c, -4, -4, 9, 8, 2, S); tube(c, 4, L + 1, 2, P, 0); for (let i = 0; i < 4; i++) { const x = 6 + i * (L - 6) / 4; c.strokeStyle = PAL.brass[2]; c.lineWidth = 1.3; c.beginPath(); c.ellipse(x, 0, 1.1, 3.6 - i * 0.3, 0, 0, TAU); c.stroke(); }
      orb(c, L + 1, 0, 2.6 + fire * 1.5, A, 0.5 + fire); if (Math.sin(t * 15) > 0.3) { c.strokeStyle = A; c.lineWidth = 0.6; c.beginPath(); c.moveTo(L + 1, 0); c.lineTo(L + 3, -3); c.lineTo(L + 2, -5); c.stroke(); } },
    tukul(c, L, t, fire, P, S, A, v, w) { c.lineCap = 'round'; c.strokeStyle = vgrad(c, -2, 2, S[0], S[1], S[2]); c.lineWidth = 2.6; c.beginPath(); c.moveTo(-6, 3); c.lineTo(L - 4, 0); c.stroke();
      const big = w.nama.includes('Gada') || w.nama.includes('Penumbuk') || w.nama.includes('Golem');
      if (w.nama.includes('Penyodok')) { poly(c, [[L - 6, -4], [L + 2, -3], [L + 2, 3], [L - 6, 4]]); c.fillStyle = vgrad(c, -4, 4, PAL.steel[0], PAL.steel[1], PAL.steel[2]); c.fill(); outl(c, 0.6); return; }
      if (big) { const g = c.createRadialGradient(L - 3, -2, 1, L - 2, 0, 7); g.addColorStop(0, P[0]); g.addColorStop(1, P[1]); c.fillStyle = g; circ(c, L - 2, 0, 5.6); outl(c, 0.6); c.fillStyle = S[2]; for (let i = 0; i < 6; i++) { const a = i * TAU / 6; poly(c, [[L - 2 + Math.cos(a) * 5, Math.sin(a) * 5], [L - 2 + Math.cos(a) * 7.4, Math.sin(a) * 7.4], [L - 2 + Math.cos(a + 0.4) * 5, Math.sin(a + 0.4) * 5]]); c.fill(); } }
      else { box(c, L - 7, -6, 9, 12, 2, P); shine(c, L - 6, L + 1, -5); }
      gEye(c, L - 2, 0, 1.4, A); },
    tombak(c, L, t, fire, P, S, A, v, w) { c.lineCap = 'round'; c.strokeStyle = vgrad(c, -1.5, 1.5, S[0], S[1], S[2]); c.lineWidth = 2; c.beginPath(); c.moveTo(-10, 0.6); c.lineTo(L - 5, 0); c.stroke(); box(c, -1, -1.6, 4, 3.2, 1, P);
      const head = (dy, s) => { poly(c, [[L - 6, dy - 2.6 * s], [L + 2, dy], [L - 6, dy + 2.6 * s], [L - 4.5, dy]]); c.fillStyle = vgrad(c, dy - 3, dy + 3, P[0], P[1], P[2]); c.fill(); outl(c, 0.5); };
      if (w.nama.includes('Trisula')) { head(0, 1); c.strokeStyle = P[2]; c.lineWidth = 1.2; c.beginPath(); c.moveTo(L - 6, 0); c.lineTo(L - 6, -4.6); c.lineTo(L - 1, -4.6); c.moveTo(L - 6, 0); c.lineTo(L - 6, 4.6); c.lineTo(L - 1, 4.6); c.stroke(); } else head(0, 1);
      c.fillStyle = A; glow(c, A, 6); c.fillRect(L - 7, -2.4, 1.2, 4.8); noGlow(c); if (v & 1) { c.strokeStyle = A; c.lineWidth = 0.8; c.beginPath(); c.moveTo(L - 8, 0); c.quadraticCurveTo(L - 12, 4 + Math.sin(t * 8) * 2, L - 16, 3); c.stroke(); } },
    kipas(c, L, t, fire, P, S, A, v, w, spin) { gripHD(c, -2, 0, 4, 7, S, 2); box(c, -2, -2, L - 6, 4, 1.4, S); c.save(); c.translate(L - 4, 0); const r = (spin || 0) * 20 + t * 4 + fire * 6;
      for (let i = 0; i < 5; i++) { c.save(); c.rotate(r + i * TAU / 5); c.fillStyle = vgrad(c, -1, 6, P[0], P[1], P[2]); c.beginPath(); c.ellipse(0, 3.4, 1.8, 3.6, 0, 0, TAU); c.fill(); outl(c, 0.4); c.restore(); } c.fillStyle = A; circ(c, 0, 0, 1.6); c.restore();
      c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 0.6; c.beginPath(); c.arc(L - 4, 0, 6.4, -0.6, 0.6); c.stroke(); },
    sabit(c, L, t, fire, P, S, A, v) { c.lineCap = 'round'; c.strokeStyle = vgrad(c, -2, 2, S[0], S[1], S[2]); c.lineWidth = 2.4; c.beginPath(); c.moveTo(-6, 3); c.lineTo(L - 6, 0); c.stroke();
      c.fillStyle = vgrad(c, -10, 2, P[0], P[1], P[2]); c.beginPath(); c.moveTo(L - 7, 0); c.quadraticCurveTo(L + 4, -2, L + 2, -10); c.quadraticCurveTo(L + 1, -4, L - 6, -2.2); c.closePath(); c.fill(); outl(c, 0.5); glow(c, A, 8); c.strokeStyle = A; c.lineWidth = 0.6; c.stroke(); noGlow(c); },
    obor(c, L, t, fire, P, S, A, v, w) { c.lineCap = 'round'; c.strokeStyle = vgrad(c, -2, 2, S[0], S[1], S[2]); c.lineWidth = 2.6; c.beginPath(); c.moveTo(-5, 2); c.lineTo(L - 4, 0); c.stroke();
      if (w.nama === 'Obor' || w.fam === 'api') { box(c, L - 5, -2.4, 4, 4.8, 1, P); flame(c, L, 0, 0.6 + fire * 0.2, t, ['#FF6A2B', '#FFB04A', '#FFF2A0']); return; }
      const gx = L - 2.5; glow(c, '#FFE07A', 10 + fire * 8); c.fillStyle = 'rgba(255,240,170,.75)'; c.beginPath(); c.ellipse(gx, 0, 3.6, 4.6, 0, 0, TAU); c.fill(); noGlow(c);
      if (w.nama.includes('Lilin')) { c.fillStyle = '#FFF8E8'; c.fillRect(gx - 1, -1, 2, 5); flame(c, gx, -1, 0.35, t, ['#FFB04A', '#FFE07A', '#FFFFFF']); }
      else { orb(c, gx, 0, 1.8 + Math.sin(t * 7) * 0.3 + fire, '#FFFFFF', 0.5 + fire); c.strokeStyle = '#7A4A12'; c.lineWidth = 0.9; c.beginPath(); c.ellipse(gx, 0, 3.6, 4.6, 0, 0, TAU); c.moveTo(gx, -4.6); c.lineTo(gx, 4.6); c.stroke(); }
      box(c, gx - 3, -6.2, 6, 1.8, 0.6, PAL.brass); box(c, gx - 3, 4.4, 6, 1.8, 0.6, PAL.brass); c.strokeStyle = '#7A4A12'; c.lineWidth = 0.8; c.beginPath(); c.arc(gx, -6.6, 1.6, Math.PI, 0); c.stroke(); },
    cermin(c, L, t, fire, P, S, A, v) { gripHD(c, -2, 0, 4, 7, S, 2); box(c, -2, -1.8, L - 7, 3.6, 1.2, S); c.save(); c.translate(L - 3, 0); c.rotate(Math.sin(t * 2) * 0.15); poly(c, [[0, -6], [5, 0], [0, 6], [-4, 0]]); const g = c.createLinearGradient(-4, -6, 5, 6); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, P[2]); g.addColorStop(1, A); c.fillStyle = g; c.fill(); outl(c, 0.6);
      c.globalAlpha = 0.5 + 0.5 * Math.sin(t * 5); ['#FF6A6A', '#FFE07A', '#7AF07A', '#6AB8FF'].forEach((col, i) => { c.fillStyle = col; c.fillRect(-1 + i, -0.6 + i * 0.4, 1, 1); }); c.globalAlpha = 1; c.restore(); },
    gerudi(c, L, t, fire, P, S, A, v, w, spin) { gripHD(c, -1, 1, 4.5, 7, S, 2); trig(c, 4.5); box(c, -5, -4, 12, 8, 2.4, P); box(c, -8, -2.6, 4, 5.2, 1, S); const r = ((spin || 0) * 10 + t * 3) % 1;
      poly(c, [[6, -3.4], [L + 2, 0], [6, 3.4]]); c.fillStyle = vgrad(c, -3.4, 3.4, PAL.steel[0], PAL.steel[1], PAL.steel[2]); c.fill(); outl(c, 0.5); c.strokeStyle = 'rgba(20,24,32,.6)'; c.lineWidth = 0.7; for (let i = 0; i < 4; i++) { const x = 7 + ((i + r) / 4) * (L - 6); const h = 3.4 * (1 - (x - 6) / (L - 4)); c.beginPath(); c.moveTo(x, -h); c.lineTo(x + 1.6, h); c.stroke(); } gEye(c, 0, 0, 1.2, A); },
    sumpit(c, L, t, fire, P, S, A, v) { tube(c, -6, L + 2, 2.2, P, 0); for (let x = -2; x < L; x += 6) gBand(c, x, -1.6, 1.6, S[1]); box(c, -7, -1.8, 2.4, 3.6, 0.8, S); c.fillStyle = A; circ(c, L + 1.4, 0, 0.7); },
    botol(c, L, t, fire, P, S, A, v, w) { c.fillStyle = '#F2C8A0'; circ(c, 0, 2, 3); outl(c, 0.5); if (w.nama.includes('Picagari')) { box(c, 0, -2, L - 2, 4, 1.4, PAL.white); c.fillStyle = A; c.fillRect(1.2, -1, (L - 5) * (0.5 + 0.4 * Math.sin(t * 3)), 2); box(c, -3, -2.6, 2, 5.2, 0.6, PAL.brass); c.strokeStyle = '#B8C2CC'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(L - 2, 0); c.lineTo(L + 2, 0); c.stroke(); return; }
      c.save(); c.translate(L - 3, 0); c.fillStyle = 'rgba(230,245,255,.5)'; circ(c, 0, 1, 4.6); outl(c, 0.6); c.fillStyle = A; c.beginPath(); c.arc(0, 1, 4, 0.2, Math.PI - 0.2); c.fill(); box(c, -1.4, -6, 2.8, 3.4, 0.6, PAL.white); box(c, -1.8, -7.2, 3.6, 1.6, 0.6, PAL.wood); c.fillStyle = 'rgba(255,255,255,.7)'; circ(c, -1.6, -0.6, 0.9); c.restore(); }
  };
  // hiasan kelangkaan (Jarang jalur, Epik permata, Legenda bingkai emas)
  function gOrn(c, L, rar, t) {
    if (rar === 1) { c.fillStyle = '#4FB06A'; c.fillRect(L * 0.32, -4.6, 1.6, 2); }
    if (rar >= 2) { const gc = rar === 2 ? '#3B9BE0' : '#A066E8'; glow(c, gc, 5); c.fillStyle = gc; poly(c, [[1, -6.4], [2.6, -5], [1, -3.6], [-0.6, -5]]); c.fill(); noGlow(c); c.fillStyle = 'rgba(255,255,255,.8)'; circ(c, 0.8, -5.4, 0.5); }
    if (rar === 3) { c.strokeStyle = '#F2C230'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-2, -4.4); c.lineTo(L * 0.6, -4.4); c.stroke(); c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 4); c.fillStyle = '#FFF2A0'; star(c, L * 0.6, -4.4, 4, 1.6, 0.5, t * 2); c.globalAlpha = 1; }
  }
  function mitosAura(c, L, t, col) { if (CALM()) return; c.save(); c.globalAlpha = 0.28 + 0.12 * Math.sin(t * 3); const g = c.createRadialGradient(L * 0.45, 0, 2, L * 0.45, 0, L * 0.75 + 6); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; circ(c, L * 0.45, 0, L * 0.75 + 6); c.globalAlpha = 1;
    for (let i = 0; i < 3; i++) { const a = t * 2 + i * TAU / 3, x = L * 0.45 + Math.cos(a) * (L * 0.5 + 3), y = Math.sin(a) * 7; c.fillStyle = i ? col : '#FFFFFF'; star(c, x, y, 4, 1.6, 0.6, a); } c.restore(); }

  // ---------- 21 senjata Mitos dilukis satu demi satu ----------
  const MITOS_HD = {
    w_gatling_naga_emas(c, L, t, fire, spin) { GSHAPE.gatling(c, L - 4, t, fire, PAL.brass, PAL.red, '#FFE07A', 0, {}, spin); // kepala naga di muncung
      c.save(); c.translate(L - 2, 0); poly(c, [[-2, -5], [4, -4], [6, -1.2], [4, 0], [6, 1.2], [4, 4], [-2, 5]]); c.fillStyle = vgrad(c, -5, 5, '#FFE6A0', '#8A5A10', '#E8B040'); c.fill(); outl(c, 0.6);
      c.fillStyle = '#E5302A'; circ(c, 1.6, -2.4, 0.9); c.fillStyle = '#FFFFFF'; poly(c, [[3, -1], [4.4, -0.4], [3, 0]]); c.fill(); poly(c, [[3, 1], [4.4, 0.4], [3, 0]]); c.fill(); c.strokeStyle = '#E5302A'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-2, -5); c.quadraticCurveTo(-4, -9, -1, -8); c.stroke();
      if (fire > 0.3) flame(c, 7, 0.5, 0.5, t, ['#FF6A2B', '#FFB04A', '#FFF2A0']); c.restore(); },
    w_senapang_petala_langit(c, L, t, fire) { GSHAPE.patah(c, L, t, fire, [ '#9AB0FF', '#0E1A4A', '#2E4A9A'], PAL.brass, '#FFE07A', 0, { n: 5 });
      c.save(); for (let i = 0; i < 6; i++) { const x = 2 + i * (L - 2) / 6, y = -2.6 + (i % 2) * 2; c.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4 + i); c.fillStyle = '#FFFFFF'; star(c, x, y, 4, 1.2, 0.4, t + i); } c.restore();
      c.fillStyle = vgrad(c, -6, 6, '#FFE6A0', '#8A5A10'); poly(c, [[L - 1, -5.5], [L + 2, -6.5], [L + 2, 6.5], [L - 1, 5.5]]); c.fill(); outl(c, 0.6); },
    w_sniper_bintang_kejora(c, L, t, fire) { GSHAPE.sniper(c, L, t, fire, PAL.white, PAL.brass, '#FFF2A0', 1);
      c.save(); c.translate(11, -6.3); c.rotate(t * 1.5); glow(c, '#FFF2A0', 10); c.fillStyle = '#FFF2A0'; star(c, 0, 0, 5, 3.4, 1.3, 0); noGlow(c); c.restore(); c.strokeStyle = '#F2C230'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(-3, -3); c.lineTo(L, -3); c.stroke(); },
    w_meriam_gunung_berapi(c, L, t, fire) { gripHD(c, -2, 3, 4, 6, PAL.dark, 2); poly(c, [[-8, 6], [L - 4, -3], [L + 2, -3.6], [L + 2, 3.6], [L - 4, 4], [-8, 7]]); c.fillStyle = vgrad(c, -4, 7, '#8A6A5A', '#2A1A14', '#5A3E30'); c.fill(); outl(c, 0.8);
      c.strokeStyle = '#FF6A2B'; c.lineWidth = 0.9; glow(c, '#FF6A2B', 8); c.beginPath(); c.moveTo(0, 5); c.lineTo(4, 2); c.lineTo(7, 3); c.lineTo(L - 4, -1); c.moveTo(6, 4.6); c.lineTo(9, 2); c.stroke(); noGlow(c);
      c.fillStyle = '#FF8A3A'; c.beginPath(); c.ellipse(L + 2, 0, 1.4, 3.4, 0, 0, TAU); c.fill(); flame(c, L - 1, -3.4, 0.5 + fire * 0.4, t, ['#E5302A', '#FF8A3A', '#FFE07A']); emitSmoke(c, L - 2, -8, t); },
    w_panah_seribu_bulan(c, L, t, fire) { const pull = fire * 3; c.lineCap = 'round'; c.strokeStyle = vgrad(c, -12, 12, '#FFFFFF', '#6A7AB0', '#C8D0F0'); c.lineWidth = 3; c.beginPath(); c.arc(-6, 0, 13, -1.0, 1.0); c.stroke(); glow(c, '#D8E0FF', 8); c.strokeStyle = '#EAF0FF'; c.lineWidth = 1; c.stroke(); noGlow(c);
      const tipX = -6 + 13 * Math.cos(1), tipY = 13 * Math.sin(1); c.strokeStyle = '#F2EEE6'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(tipX, -tipY); c.lineTo(-2 - pull, 0); c.lineTo(tipX, tipY); c.stroke();
      for (let i = 0; i < 3; i++) { const y = (i - 1) * 2.2; c.fillStyle = '#E8ECFF'; c.fillRect(-2 - pull, y - 0.4, L + 2 + pull, 0.8); c.fillStyle = '#B8C8FF'; poly(c, [[L + 2, y], [L - 1, y - 1.4], [L - 1, y + 1.4]]); c.fill(); }
      c.fillStyle = '#FFF6C8'; glow(c, '#FFF6C8', 8); c.beginPath(); c.arc(1, 0, 3, Math.PI * 0.5, Math.PI * 1.5); c.arc(2, 0, 2.2, Math.PI * 1.5, Math.PI * 0.5, true); c.fill(); noGlow(c); },
    w_mahkota_zaman_ais(c, L, t, fire) { GSHAPE.tongkat(c, L - 4, t, fire, PAL.ice, PAL.white, '#BFF4FF', 0, { nama: '' }); c.save(); c.translate(L - 2, 0);
      const g = c.createLinearGradient(0, -8, 0, 4); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#5AB4E0'); c.fillStyle = g; poly(c, [[-4, 4], [-5, -3], [-2.5, 0], [0, -7], [2.5, 0], [5, -3], [4, 4]]); c.fill(); outl(c, 0.6);
      glow(c, '#BFF4FF', 10); c.fillStyle = '#E8FAFF'; circ(c, 0, -1, 1.6); noGlow(c); for (let i = 0; i < 4; i++) { const a = t * 1.5 + i * TAU / 4; c.fillStyle = 'rgba(255,255,255,.85)'; star(c, Math.cos(a) * 7, Math.sin(a) * 5, 6, 1.2, 0.4, a); } c.restore(); },
    w_sayap_feniks(c, L, t, fire) { const flap = Math.sin(t * 6) * 0.25; c.save(); c.translate(2, 0); for (const s of [-1, 1]) { c.save(); c.scale(1, s); c.rotate(-flap); for (let i = 0; i < 4; i++) { c.fillStyle = ['#FFE07A', '#FFB04A', '#FF6A2B', '#E5302A'][i]; c.beginPath(); c.moveTo(0, -1); c.quadraticCurveTo(-4 - i * 2, -6 - i * 2.4, -9 - i * 2.6, -4 - i * 1.4); c.quadraticCurveTo(-5, -2, 0, -1); c.fill(); } c.restore(); } c.restore();
      GSHAPE.busur(c, L, t, fire, PAL.red, PAL.brass, '#FFE07A', 0); flame(c, L + 1, -1, 0.35, t, ['#E5302A', '#FFB04A', '#FFF2A0']); },
    w_jantung_hutan_beracun(c, L, t, fire) { GSHAPE.tongkat(c, L - 5, t, fire, PAL.green, PAL.wood, '#A6F05A', 0, { nama: '' }); c.save(); c.translate(L - 1, 0); const beat = 1 + 0.12 * Math.sin(t * 8);
      c.scale(beat, beat); glow(c, '#7AD050', 12); c.fillStyle = vgrad(c, -5, 5, '#C8F59A', '#2F6B33', '#5DBB63'); c.beginPath(); c.moveTo(0, 4.6); c.bezierCurveTo(-6, 0, -4, -5.6, 0, -2.4); c.bezierCurveTo(4, -5.6, 6, 0, 0, 4.6); c.fill(); noGlow(c); outl(c, 0.6);
      c.strokeStyle = '#3E8A2E'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-4, -2); c.quadraticCurveTo(-8, 0, -7, 4); c.moveTo(4, -2); c.quadraticCurveTo(8, 1, 6, 5); c.stroke(); c.restore(); },
    w_mahkota_halilintar(c, L, t, fire) { GSHAPE.tongkat(c, L - 4, t, fire, PAL.brass, PAL.dark, '#FFF27A', 0, { nama: '' }); c.save(); c.translate(L - 2, 0);
      c.fillStyle = vgrad(c, -7, 4, '#FFE6A0', '#7A4A12', '#E8B040'); poly(c, [[-4, 4], [-5, -4], [-2, -1], [0, -6], [2, -1], [5, -4], [4, 4]]); c.fill(); outl(c, 0.6);
      if (Math.sin(t * 12) > -0.2 || fire > 0.2) { glow(c, '#FFF27A', 12); c.strokeStyle = '#FFF27A'; c.lineWidth = 0.9; for (const a of [-1.2, 0, 1.2]) { c.beginPath(); c.moveTo(0, -3); let x = 0, y = -3; for (let i = 0; i < 3; i++) { x += 2.4 * Math.sin(a) + (Math.random() - 0.5) * 1.5; y -= 2.4 * Math.cos(a); c.lineTo(x, y); } c.stroke(); } noGlow(c); } c.restore(); },
    w_teras_bintang(c, L, t, fire) { gripHD(c, -2, 1, 4.5, 7, PAL.dark, 2); trig(c, 4.5); box(c, -4, -4.4, 10, 8.8, 2.4, PAL.purple); tube(c, 5, L - 6, 3, PAL.white, 0);
      c.save(); c.translate(L - 2, 0); for (let i = 0; i < 2; i++) { c.save(); c.rotate(t * (i ? -2 : 2.6)); c.strokeStyle = i ? '#FF4FD8' : '#7AF0FF'; c.lineWidth = 0.9; c.beginPath(); c.ellipse(0, 0, 5.4, 2.2, 0, 0, TAU); c.stroke(); c.restore(); } orb(c, 0, 0, 3 + fire, '#FFFFFF', 1); c.fillStyle = '#FF4FD8'; circ(c, 0, 0, 1.2); c.restore(); },
    w_pohon_kehidupan(c, L, t, fire) { c.lineCap = 'round'; c.strokeStyle = vgrad(c, -2, 2, '#D8A060', '#5A3418', '#9A6434'); c.lineWidth = 3; c.beginPath(); c.moveTo(-7, 3); c.quadraticCurveTo(L * 0.4, 2, L - 3, 0); c.stroke(); c.lineWidth = 1.2; c.beginPath(); c.moveTo(L - 6, 0); c.quadraticCurveTo(L - 4, -6, L, -7); c.moveTo(L - 6, 0); c.quadraticCurveTo(L - 4, 6, L, 7); c.stroke();
      for (const [x, y] of [[L, -7], [L + 1, 7], [L - 6, -5], [L - 6, 5], [L + 2, -2]]) { c.fillStyle = '#5DBB63'; c.beginPath(); c.ellipse(x, y, 2.6, 1.5, 0.5, 0, TAU); c.fill(); } orb(c, L, 0, 2.6 + Math.sin(t * 4) * 0.4 + fire, '#7FF0C8', 0.6); },
    w_mata_taufan(c, L, t, fire) { GSHAPE.tongkat(c, L - 5, t, fire, ['#E8FFFB', '#2E7A74', '#86D8CC'], PAL.white, '#C8F4F0', 0, { nama: '' }); c.save(); c.translate(L - 1, 0);
      for (let i = 0; i < 3; i++) { c.save(); c.rotate(t * (3 + i) + i); c.strokeStyle = ['#FFFFFF', '#86D8CC', '#2E7A74'][i]; c.lineWidth = 1.1; c.beginPath(); c.arc(0, 0, 3 + i * 1.6, 0, Math.PI * 1.3); c.stroke(); c.restore(); } c.fillStyle = '#163E3A'; circ(c, 0, 0, 1.6); c.fillStyle = '#FFFFFF'; circ(c, -0.5, -0.5, 0.5); c.restore(); },
    w_tombak_angin_utara(c, L, t, fire) { GSHAPE.tombak(c, L, t, fire, PAL.white, ['#E8FFFB', '#2E7A74', '#86D8CC'], '#C8F4F0', 0, { nama: '' }); c.strokeStyle = 'rgba(200,244,240,.9)'; c.lineWidth = 0.9;
      for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(L - 8, 0); c.bezierCurveTo(L - 12, -3 - i * 2 + Math.sin(t * 6 + i) * 1.5, L - 16, 3 + i, L - 22 - i * 2, -1 + Math.sin(t * 5 + i) * 2); c.stroke(); } },
    w_jantung_gunung(c, L, t, fire) { c.fillStyle = '#F2C8A0'; circ(c, 0, 2, 3); box(c, 0, -5, L - 2, 10, 3, [ '#E2D2B0', '#4E3C26', '#9A8462']); for (let x = 3; x < L - 2; x += 4) { c.strokeStyle = 'rgba(40,28,16,.6)'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(x, -5); c.lineTo(x + 1, 5); c.stroke(); }
      const p = 0.7 + 0.3 * Math.sin(t * 5); glow(c, '#FF6A2B', 10 * p); c.fillStyle = '#FF8A3A'; poly(c, [[L - 6, 0], [L - 3, -3], [L, 0], [L - 3, 3]]); c.fill(); c.fillStyle = '#FFE07A'; circ(c, L - 3, 0, 1.2 * p); noGlow(c); },
    w_gada_teras_bumi(c, L, t, fire) { GSHAPE.tukul(c, L, t, fire, ['#E2D2B0', '#4E3C26', '#9A8462'], PAL.dark, '#7AF0C8', 0, { nama: 'Gada' }); c.save(); c.translate(L - 2, 0); glow(c, '#7AF0C8', 8); c.fillStyle = vgrad(c, -4, 4, '#E8FFF6', '#2EAE8E', '#7AF0C8'); poly(c, [[0, -4], [2.6, 0], [0, 4], [-2.6, 0]]); c.fill(); noGlow(c); outl(c, 0.5); c.restore(); },
    w_mutiara_lautan(c, L, t, fire) { GSHAPE.tongkat(c, L - 5, t, fire, ['#D8F2FF', '#18508E', '#4A9AE0'], PAL.white, '#D8F2FF', 0, { nama: '' }); c.save(); c.translate(L - 1, 0);
      c.fillStyle = vgrad(c, -6, 6, '#FFD8E8', '#B85A8A', '#F0A0C0'); c.beginPath(); c.moveTo(-4, 0); c.quadraticCurveTo(-2, -7, 4, -5); c.lineTo(0, 0); c.closePath(); c.fill(); outl(c, 0.5); c.beginPath(); c.moveTo(-4, 0); c.quadraticCurveTo(-2, 7, 4, 5); c.lineTo(0, 0); c.closePath(); c.fill(); outl(c, 0.5);
      const g = c.createRadialGradient(0.4, -0.6, 0.3, 1, 0, 3); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#C8D8F0'); glow(c, '#FFFFFF', 8 + 4 * Math.sin(t * 4)); c.fillStyle = g; circ(c, 1.2, 0, 2.6); noGlow(c); c.restore(); },
    w_tombak_raja_laut(c, L, t, fire) { GSHAPE.tombak(c, L, t, fire, PAL.brass, ['#D8F2FF', '#18508E', '#4A9AE0'], '#5AB8FF', 0, { nama: 'Trisula' }); c.fillStyle = '#5AB8FF'; glow(c, '#5AB8FF', 8); circ(c, L - 7, 0, 1.6); noGlow(c);
      c.strokeStyle = 'rgba(90,184,255,.8)'; c.lineWidth = 0.8; for (let i = 0; i < 2; i++) { c.beginPath(); for (let x = -8; x < L - 8; x += 1) c.lineTo(x, 3.2 + i * 1.6 + Math.sin(x * 0.6 + t * 6 + i) * 0.8); c.stroke(); } },
    w_matahari_kecil(c, L, t, fire) { c.lineCap = 'round'; c.strokeStyle = vgrad(c, -2, 2, '#FFE6A0', '#7A4A12', '#C8963A'); c.lineWidth = 2.6; c.beginPath(); c.moveTo(-6, 2.4); c.lineTo(L - 6, 0); c.stroke(); c.save(); c.translate(L - 2, 0); c.rotate(t * 0.8);
      glow(c, '#FFD24A', 16); c.fillStyle = '#FFB830'; for (let i = 0; i < 10; i++) { c.save(); c.rotate(i * TAU / 10); poly(c, [[3.6, -1], [6.4 + (i % 2) * 1.4, 0], [3.6, 1]]); c.fill(); c.restore(); } const g = c.createRadialGradient(-1, -1, 0.5, 0, 0, 4); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, '#FFE07A'); g.addColorStop(1, '#FF9A2A'); c.fillStyle = g; circ(c, 0, 0, 4 + fire); noGlow(c); c.restore(); },
    w_bintang_pagi_abadi(c, L, t, fire) { c.lineCap = 'round'; c.strokeStyle = vgrad(c, -2, 2, '#FFFFFF', '#9AA6B4', '#D8DEE6'); c.lineWidth = 2; c.beginPath(); c.moveTo(-6, 2); c.lineTo(L - 4, 0); c.stroke(); c.strokeStyle = '#F2C230'; c.lineWidth = 0.6; for (let x = -3; x < L - 4; x += 3) { c.beginPath(); c.moveTo(x, -1.4); c.lineTo(x + 1.5, 1.4); c.stroke(); }
      c.save(); c.translate(L - 1, 0); c.rotate(Math.sin(t * 2) * 0.3); glow(c, '#FFF6C8', 14); c.fillStyle = '#FFF6C8'; star(c, 0, 0, 5, 5 + fire * 1.5, 2, -Math.PI / 2); c.fillStyle = '#FFFFFF'; star(c, 0, 0, 5, 2.4, 1, -Math.PI / 2); noGlow(c); c.restore(); },
    w_lubang_hitam_mini(c, L, t, fire) { gripHD(c, -2, 1, 4.5, 7, PAL.dark, 2); trig(c, 4.5); box(c, -4, -4, 10, 8, 2.4, [ '#C8B0F0', '#160E26', '#46366C']); for (const s of [-1, 1]) { c.strokeStyle = '#46366C'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(5, s * 3); c.quadraticCurveTo(L - 6, s * 7, L - 3, s * 4); c.stroke(); }
      c.save(); c.translate(L - 2, 0); c.rotate(t * 3); c.strokeStyle = '#FF9A50'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(0, 0, 6, 2, 0.3, 0, TAU); c.stroke(); c.strokeStyle = '#B48AF5'; c.lineWidth = 0.7; c.beginPath(); c.ellipse(0, 0, 4.6, 1.5, 0.3, 0, TAU); c.stroke(); c.restore();
      c.fillStyle = '#000000'; circ(c, L - 2, 0, 3 + fire * 0.6); c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 0.4; c.beginPath(); c.arc(L - 2, 0, 3.2, 0, TAU); c.stroke(); },
    w_mahkota_bayang(c, L, t, fire) { GSHAPE.tongkat(c, L - 4, t, fire, [ '#C8B0F0', '#160E26', '#46366C'], PAL.dark, '#A070E0', 0, { nama: '' }); c.save(); c.translate(L - 2, 0);
      c.fillStyle = vgrad(c, -7, 4, '#8A6AC0', '#100A1C', '#3A2A5A'); poly(c, [[-4, 4], [-5, -5], [-2.4, -1.4], [0, -7], [2.4, -1.4], [5, -5], [4, 4]]); c.fill(); outl(c, 0.6); glow(c, '#A070E0', 8); c.fillStyle = '#E0C8FF'; circ(c, 0, 0, 1.3); noGlow(c);
      for (let i = 0; i < 3; i++) { const y = -6 - ((t * 6 + i * 3) % 8); c.globalAlpha = Math.max(0, 1 - (-y - 6) / 8) * 0.7; c.fillStyle = '#6A4AA0'; circ(c, (i - 1) * 2.4 + Math.sin(t * 4 + i), y, 1.6); } c.globalAlpha = 1; c.restore(); }
  };
  function emitSmoke(c, x, y, t) { for (let i = 0; i < 3; i++) { const k = ((t * 0.8 + i / 3) % 1); c.globalAlpha = 0.5 * (1 - k); c.fillStyle = '#7A6A60'; circ(c, x + Math.sin(t * 2 + i) * 1.5, y - k * 8, 1.4 + k * 2.4); } c.globalAlpha = 1; }

  // ---------- daftar lukisan untuk semua senjata jana ----------
  const GVAR = {};
  WEAPON_ORDER.forEach(wid => { const w = WEAPONS[wid]; if (!w.gen) return; GVAR[wid] = ghash(w.nama) % 8; const pal = GPAL[w.fam] || GPAL.biasa;
    if (w.bentuk === 'mitos') { const f = MITOS_HD[wid]; WPN_HD[wid] = (c, L, t, fire, spin) => { mitosAura(c, L, t, w.peluru); f(c, L, t, fire || 0, spin); }; }
    else { const f = GSHAPE[w.bentuk]; WPN_HD[wid] = (c, L, t, fire, spin) => { f(c, L, t || 0, fire || 0, pal[0], pal[1], w.peluru, GVAR[wid], w, spin); gOrn(c, L, w.rar, t || 0); }; }
  });

  // ---------- kilatan muncung, peluru & hentaman untuk senjata jana ----------
  Object.assign(MUZ_FAM, {
    wind: (c, L, k) => { c.strokeStyle = 'rgba(200,244,240,.9)'; c.lineWidth = 1.2; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(L + 4 + i * 2, 0, 3 + i * 2 * k, -0.9, 0.9); c.stroke(); } },
    rock: (c, L, k) => { c.fillStyle = 'rgba(160,130,90,.8)'; for (let i = 0; i < 5; i++) { const a = (i - 2) * 0.5; c.fillRect(L + 3 + Math.cos(a) * 6 * k, Math.sin(a) * 6 * k - 1, 2, 2); } },
    water: (c, L, k) => { c.fillStyle = 'rgba(140,210,255,.85)'; circ(c, L + 4, 0, 3 * k + 1); circ(c, L + 7, -2, 1.6 * k + 0.6); circ(c, L + 7, 2, 1.4 * k + 0.6); },
    light: (c, L, k) => { glow(c, '#FFF2A0', 18); c.fillStyle = '#FFFFFF'; star(c, L + 4, 0, 8, 9 * k + 3, 1.4, ANIM * 2); noGlow(c); },
    shadow: (c, L, k) => { c.fillStyle = 'rgba(70,40,110,' + (0.7 * k + 0.2) + ')'; circ(c, L + 4, 0, 4 * k + 2); c.fillStyle = 'rgba(180,140,240,.8)'; star(c, L + 4, 0, 4, 5 * k + 2, 1, ANIM * 5); }
  });
  const GMUZ = { biasa: 'gun', serak: 'spread', tepat: 'snipe', letup: 'boom', lontar: 'none', ais: 'ice', api: 'fire', racun: 'poison', elektrik: 'zap', tenaga: 'beam', sokong: 'none', angin: 'wind', bumi: 'rock', air: 'water', cahaya: 'light', bayang: 'shadow' };
  const THROWN = ['busur', 'bintang', 'cakera', 'lastik', 'bom', 'tombak', 'tukul', 'sabit', 'kipas', 'botol', 'sumpit'];
  function gArrow(col, fl) { ctx.fillStyle = vgrad(ctx, -1, 1, '#E0B070', '#7A4A1A'); ctx.fillRect(-14, -0.8, 15, 1.6); glow(ctx, col, 6); ctx.fillStyle = col; poly(ctx, [[5, 0], [1, -2.2], [1, 2.2]]); ctx.fill(); noGlow(ctx); ctx.fillStyle = fl || col; poly(ctx, [[-14, 0], [-17, -2.6], [-12, -0.6]]); ctx.fill(); poly(ctx, [[-14, 0], [-17, 2.6], [-12, 0.6]]); ctx.fill(); }
  const GBUL = {
    busur: (w) => (b, a) => { ctx.rotate(a); gArrow(w.peluru); },
    tombak: (w) => (b, a) => { ctx.rotate(a); ctx.fillStyle = '#8A6434'; ctx.fillRect(-18, -0.9, 18, 1.8); ctx.fillStyle = w.peluru; poly(ctx, [[7, 0], [0, -2.6], [0, 2.6]]); ctx.fill(); outl(ctx, 0.4); },
    bintang: (w) => (b, a, age) => { ctx.rotate(age * 25); ctx.fillStyle = vgrad(ctx, -6, 6, '#FFFFFF', '#4A4060'); star(ctx, 0, 0, 4, 6.5, 2, 0); outl(ctx, 0.5); ctx.fillStyle = w.peluru; circ(ctx, 0, 0, 1.4); },
    cakera: (w) => (b, a, age) => { ctx.rotate(age * 28); ctx.fillStyle = vgrad(ctx, -7, 7, '#FFFFFF', '#5A6272'); star(ctx, 0, 0, 10, 7, 5.4, 0); outl(ctx, 0.5); ctx.fillStyle = w.peluru; circ(ctx, 0, 0, 1.8); },
    lastik: (w) => (b) => { const g = ctx.createRadialGradient(-1, -1, 0.3, 0, 0, 3.6); g.addColorStop(0, '#F0E8D8'); g.addColorStop(1, w.peluru); ctx.fillStyle = g; circ(ctx, 0, 0, 3.4); outl(ctx, 0.4); },
    bom: (w) => (b, a, age, trail) => { ctx.rotate(age * 10); const g = ctx.createRadialGradient(-2, -2, 0.5, 0, 0, 6); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, w.peluru); ctx.fillStyle = g; circ(ctx, 0, 0, 5.4); outl(ctx, 0.5); trail({ spd: 15, warna: [w.peluru, '#FFFFFF'], size: 1.6, life: 0.3, rate: 0.6 }); },
    angin: (w) => (b, a, age, trail) => { ctx.rotate(a); ctx.strokeStyle = 'rgba(220,250,245,.95)'; ctx.lineWidth = 1.6; for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(-i * 5, 0, 5 + i * 2, -1.1, 1.1); ctx.stroke(); } trail({ spd: 10, warna: ['#E8FFFB', '#86D8CC'], size: 2, life: 0.35, rate: 0.6, drag: 3 }); },
    bumi: (w) => (b, a, age, trail) => { ctx.rotate(age * 8); ctx.fillStyle = vgrad(ctx, -5, 5, '#D8C8A8', '#4E3C26', '#9A8462'); poly(ctx, [[-5, -2], [-2, -5], [4, -4], [5, 1], [1, 5], [-4, 3]]); ctx.fill(); outl(ctx, 0.5); trail({ spd: 8, warna: ['#A88A5A', '#7A6A50'], size: 2, life: 0.4, rate: 0.5, grav: 200 }); },
    air: (w) => (b, a, age, trail) => { ctx.rotate(a); const g = ctx.createRadialGradient(1, -1, 0.5, 0, 0, 5); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, w.peluru); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(6, 0); ctx.quadraticCurveTo(0, -4.4, -5, 0); ctx.quadraticCurveTo(0, 4.4, 6, 0); ctx.fill(); trail({ spd: 15, warna: ['#D8F2FF', '#5AB8FF'], size: 2, life: 0.35, rate: 0.8, grav: 120 }); },
    cahaya: (w) => (b, a) => { ctx.rotate(a); glow(ctx, '#FFF2A0', 14); ctx.fillStyle = 'rgba(255,242,160,.55)'; ctx.fillRect(-30, -2.6, 30, 5.2); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-30, -0.9, 30, 1.8); noGlow(ctx); },
    bayang: (w) => (b, a, age, trail) => { ctx.rotate(a); ctx.fillStyle = 'rgba(40,20,70,.85)'; ctx.beginPath(); ctx.moveTo(7, 0); ctx.quadraticCurveTo(-2, -5, -10, -1); ctx.quadraticCurveTo(-2, -1, 7, 0); ctx.fill(); glow(ctx, '#A070E0', 8); ctx.strokeStyle = '#C8A8FF'; ctx.lineWidth = 0.6; ctx.stroke(); noGlow(ctx); trail({ spd: 6, warna: ['#46366C', '#160E26'], size: 3, life: 0.4, shape: 'smoke', rate: 0.6 }); }
  };
  const GBUL_FAM = { biasa: 'smg', serak: 'shotgun', tepat: 'sniper', letup: 'meriam', ais: 'frost', api: 'napalm', racun: 'racun', elektrik: 'petir', tenaga: 'plasma', sokong: 'doktor', lontar: 'shuriken' };
  Object.assign(HIT_FAM, {
    wind: (b, f) => { emit(f.x, f.y, 6, { spd: 110, warna: ['#FFFFFF', '#C8F4F0', '#86D8CC'], size: 2.4, life: 0.35, drag: 3 }); b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.25, r: 14, col: '200,244,240' }); },
    rock: (b, f) => { emit(f.x, f.y, 7, { a: -Math.PI / 2, spread: 2.2, spd: 130, warna: ['#D8C8A8', '#9A8462', '#5A4630'], size: 2.4, life: 0.5, grav: 400, shape: 'sq' }); },
    water: (b, f) => { emit(f.x, f.y, 9, { a: -Math.PI / 2, spread: 2.4, spd: 120, warna: ['#FFFFFF', '#8AD8FF', '#3A84D0'], size: 2.2, life: 0.45, grav: 360 }); b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.3, r: 12, col: '138,216,255' }); },
    light: (b, f) => { emit(f.x, f.y, 7, { spd: 140, warna: ['#FFFFFF', '#FFF2A0', '#FFE07A'], size: 2.4, life: 0.35, shape: 'star', drag: 2 }); b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.25, r: 16, col: '255,242,160', w: 3 }); },
    shadow: (b, f) => { emit(f.x, f.y, 7, { spd: 70, warna: ['#46366C', '#A070E0', '#160E26'], size: 3.4, life: 0.5, shape: 'smoke', drag: 1.5 }); }
  });
  const GHIT = { biasa: 'gun', serak: 'gun', tepat: 'gun', letup: 'gun', lontar: 'thrown', ais: 'ice', api: 'fire', racun: 'poison', elektrik: 'zap', tenaga: 'beam', sokong: 'heal', angin: 'wind', bumi: 'rock', air: 'water', cahaya: 'light', bayang: 'shadow' };
  WEAPON_ORDER.forEach(wid => { const w = WEAPONS[wid]; if (!w.gen) return;
    const mf = MUZ_FAM[THROWN.includes(w.bentuk) && !w.splash ? 'none' : GMUZ[w.fam]]; MUZ_HD[wid] = (c, L, k) => mf(c, L, k, w.peluru);
    const bs = THROWN.includes(w.bentuk) && GBUL[w.bentuk] ? GBUL[w.bentuk](w) : GBUL[w.fam] ? GBUL[w.fam](w) : null;
    if (bs) BUL_HD[wid] = bs; else { const base = BUL_HD[GBUL_FAM[w.fam]]; if (base) BUL_HD[wid] = base; }
    HIT_OF[wid] = GHIT[w.fam];
  });
  // letupan kawasan senjata jana: warna ikut jenis
  const BOOM_COL = { letup: ['255,230,180', ['#FFFFFF', '#FFE07A', '#FF8A3A']], ais: ['220,245,255', ['#FFFFFF', '#CFF4FF']], api: ['255,150,80', ['#FFE07A', '#FF6A2B', '#E5302A']], racun: ['178,240,106', ['#E0FFB0', '#A6F05A', '#3E8A2E']],
    angin: ['200,244,240', ['#FFFFFF', '#C8F4F0']], bumi: ['200,170,120', ['#D8C8A8', '#9A8462', '#5A4630']], air: ['138,216,255', ['#FFFFFF', '#8AD8FF', '#3A84D0']], cahaya: ['255,242,160', ['#FFFFFF', '#FFF2A0']], bayang: ['160,112,224', ['#A070E0', '#46366C']] };
  function boomGen(b, f) { const w = WEAPONS[f.wid]; if (!w || !w.gen) return false; const C = BOOM_COL[w.fam] || BOOM_COL.letup, r = f.r || 50;
    b.fx.push({ kind: 'ring', x: f.x, y: f.y, t: 0, life: 0.42, r: r * 1.3, col: C[0], w: 5 }); emit(f.x, f.y, 18, { spd: r * 4, warna: C[1], size: 4, life: 0.5, drag: 3.5, shape: w.fam === 'ais' ? 'shard' : w.fam === 'bumi' ? 'sq' : 'c' });
    if (w.fam === 'letup' || w.fam === 'api' || w.fam === 'bumi') emit(f.x, f.y, 6, { spd: r * 1.2, warna: ['#5A5A5A', '#7A7A7A'], size: r * 0.25, life: 1, shape: 'smoke', drag: 2, up: 30 }); return true; }
