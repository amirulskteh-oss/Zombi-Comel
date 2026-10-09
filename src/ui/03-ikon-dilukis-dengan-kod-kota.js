  // ================= IKON (dilukis dengan kod, kotak 64×64) =================
  function iconBg(c, a, b) { const g = c.createLinearGradient(0, 0, 64, 64); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; rr(c, 2, 2, 60, 60, 14); c.fill(); c.fillStyle = 'rgba(255,255,255,.25)'; rr(c, 6, 5, 52, 14, 7); c.fill(); }
  function wcat(wid) {
    const w = WEAPONS[wid];
    if (w.gen && FAM_BG[w.fam]) return FAM_BG[w.fam];
    if (ICE.includes(wid)) return ['#CFF3FF', '#5AB4E0']; if (wid === 'api' || wid === 'napalm') return ['#FFD9A0', '#F07A2E'];
    if (POISON.includes(wid)) return ['#DDF7B4', '#5DBB63']; if (ZAPS[wid]) return ['#FFF5B0', '#B48AF0'];
    if (w.heal) return ['#D2FAEC', '#2EAE8E']; if (w.splash) return ['#FFD0C2', '#E5584D']; if ((w.pierce || 1) >= 3) return ['#EADCFF', '#8A6CE0'];
    return ['#EEF2F8', '#8C9AB0'];
  }
  function weaponIcon(c, wid, lv) {
    const w = WEAPONS[wid], col = wcat(wid), hd = !!WPN_HD[wid], ev = wpnEvo(lv || 1); iconBg(c, col[0], col[1]);
    if (hd) { const g = c.createRadialGradient(32, 32, 2, 32, 32, 30); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; circ(c, 32, 32, 30); }
    if (ev) { c.strokeStyle = ['', '#F2C230', '#B48CFF', '#FFE07A'][ev]; c.lineWidth = ev === 3 ? 3 : 2; rr(c, 3, 3, 58, 58, 12); c.stroke(); }
    const L = w.laras + (hd ? 20 : 10), s = Math.min(hd ? 2.9 : 2.6, (hd ? 54 : 46) / L);
    c.save(); c.translate(32, 35); c.rotate(-0.55); c.scale(s, s); c.translate(-(w.laras / 2 - 2), 0);
    if (hd) { c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(w.laras / 2, 13, w.laras / 2 + 6, 2.6, 0, 0, TAU); c.fill(); }
    drawWeapon(c, wid, 0.4, 0, 0.5, lv || 1); c.restore();
  }
  function coinAt(c, x, y, r) { c.fillStyle = '#F5B82E'; circ(c, x, y, r); c.strokeStyle = '#C98A12'; c.lineWidth = r * 0.25; c.beginPath(); c.arc(x, y, r * 0.62, 0, TAU); c.stroke(); c.fillStyle = 'rgba(255,255,255,.5)'; circ(c, x - r * .35, y - r * .35, r * .22); }
  function TXT() { return save && save.settings && save.settings.bigText ? 1.3 : 1; }
  function CALM() { return !!(save && save.settings && save.settings.calm); }
  function label(c, txt, x, y, size, col) { size = Math.round(size * (c === gctx ? TXT() : 1)); c.font = '800 ' + size + 'px "Baloo 2", system-ui'; c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = 'rgba(0,0,0,.45)'; c.strokeText(txt, x, y); c.fillStyle = col || '#FFFFFF'; c.fillText(txt, x, y); }
  function chest(c, body, band, glow2) {
    if (glow2) { glow(c, glow2, 14); }
    c.fillStyle = body; rr(c, 12, 30, 40, 22, 4); c.fill(); c.beginPath(); c.moveTo(12, 32); c.quadraticCurveTo(32, 12, 52, 32); c.closePath(); c.fill(); noGlow(c);
    c.fillStyle = band; c.fillRect(12, 30, 40, 4); c.fillRect(20, 20, 4, 32); c.fillRect(40, 20, 4, 32); c.fillStyle = '#FFE07A'; rr(c, 28, 32, 8, 9, 2); c.fill(); c.fillStyle = '#5A3A10'; c.fillRect(31, 35, 2, 4);
  }
  function snowflake(c, x, y, r, col) {
    c.strokeStyle = col; c.lineWidth = 3; c.lineCap = 'round';
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3, ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r; c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
      const mx = x + Math.cos(a) * r * .6, my = y + Math.sin(a) * r * .6; c.beginPath(); c.moveTo(mx, my); c.lineTo(mx + Math.cos(a + .7) * r * .3, my + Math.sin(a + .7) * r * .3); c.moveTo(mx, my); c.lineTo(mx + Math.cos(a - .7) * r * .3, my + Math.sin(a - .7) * r * .3); c.stroke(); }
  }
  function bolt(c, x, y, s, col) { c.fillStyle = col; c.beginPath(); c.moveTo(x + 4 * s, y - 14 * s); c.lineTo(x - 6 * s, y + 2 * s); c.lineTo(x, y + 2 * s); c.lineTo(x - 4 * s, y + 14 * s); c.lineTo(x + 7 * s, y - 3 * s); c.lineTo(x + 1 * s, y - 3 * s); c.closePath(); c.fill(); }
  function cloud(c, x, y, s, col) { c.fillStyle = col; circ(c, x - 9 * s, y, 7 * s); circ(c, x, y - 5 * s, 9 * s); circ(c, x + 10 * s, y, 7 * s); c.fillRect(x - 9 * s, y, 19 * s, 7 * s); }
  const ICONS = {
    // naik taraf kedai
    s_damage: c => { iconBg(c, '#FFC9C2', '#E5484D'); c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 3; c.lineCap = 'round'; [22, 32, 42].forEach((y, i) => { c.beginPath(); c.moveTo(6 + i * 3, y); c.lineTo(16 + i * 3, y); c.stroke(); }); c.save(); c.translate(36, 32); c.rotate(Math.PI / 2);
      c.fillStyle = '#D9773A'; c.beginPath(); c.moveTo(-8, -6); c.quadraticCurveTo(-8, -26, 0, -30); c.quadraticCurveTo(8, -26, 8, -6); c.closePath(); c.fill();
      c.fillStyle = '#E8B84A'; c.fillRect(-9, -7, 18, 26); c.fillStyle = '#B98A2A'; c.fillRect(-10, 16, 20, 4); c.fillRect(-9, -7, 18, 3);
      c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(-6, -3, 3, 18); c.beginPath(); c.moveTo(-5, -9); c.quadraticCurveTo(-5, -22, -1, -26); c.lineTo(-2, -9); c.fill(); c.restore();
      c.fillStyle = '#FFFFFF'; star(c, 50, 14, 4, 7, 2.5, 0); star(c, 14, 50, 4, 4, 1.5, 0); },
    s_speed: c => { iconBg(c, '#FFF0B0', '#F2A33A'); c.fillStyle = '#FFFFFF'; circ(c, 32, 36, 17); c.strokeStyle = '#2B3A55'; c.lineWidth = 3; c.beginPath(); c.arc(32, 36, 17, 0, TAU); c.stroke(); c.fillStyle = '#2B3A55'; c.fillRect(28, 13, 8, 5); c.beginPath(); c.moveTo(32, 36); c.lineTo(32, 24); c.moveTo(32, 36); c.lineTo(42, 40); c.stroke(); c.strokeStyle = '#E5484D'; c.lineWidth = 3; [0, 6, 12].forEach(d => { c.beginPath(); c.moveTo(6, 26 + d); c.lineTo(12, 26 + d); c.stroke(); }); },
    s_wall: c => { iconBg(c, '#E8D2B8', '#A8703E'); c.fillStyle = '#C8644A'; for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) { rr(c, 10 + i * 15 + (r % 2 ? 7 : 0) - (r % 2 && i === 2 ? 7 : 0), 30 + r * 9, 13, 7, 2); c.fill(); } c.fillStyle = '#4FD07A'; c.beginPath(); c.moveTo(46, 8); c.lineTo(58, 22); c.lineTo(51, 22); c.lineTo(51, 30); c.lineTo(41, 30); c.lineTo(41, 22); c.lineTo(34, 22); c.closePath(); c.fill(); },
    s_tap: c => { iconBg(c, '#FFD6EC', '#E0569B'); c.fillStyle = '#FFE07A'; star(c, 24, 20, 6, 12, 5, 0.3); c.fillStyle = '#F2C28E'; rr(c, 26, 22, 10, 26, 5); c.fill(); rr(c, 22, 38, 24, 18, 7); c.fill(); c.strokeStyle = '#B07A4A'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(36, 40); c.lineTo(36, 46); c.moveTo(41, 40); c.lineTo(41, 46); c.stroke(); },
    s_magnet: c => { iconBg(c, '#E8D8FF', '#8F55DE'); c.strokeStyle = '#E5484D'; c.lineWidth = 9; c.lineCap = 'butt'; c.beginPath(); c.arc(32, 30, 13, Math.PI, 0); c.moveTo(19, 30); c.lineTo(19, 44); c.moveTo(45, 30); c.lineTo(45, 44); c.stroke(); c.fillStyle = '#D8DDE6'; c.fillRect(14.5, 42, 9, 7); c.fillRect(40.5, 42, 9, 7); coinAt(c, 32, 52, 7); },
    s_luck: c => { iconBg(c, '#D6F5C8', '#3E9E58'); c.fillStyle = '#4CBF5A'; [[0, -9], [9, 0], [0, 9], [-9, 0]].forEach(([dx, dy]) => circ(c, 32 + dx, 30 + dy, 9)); c.fillStyle = '#2F8A3E'; circ(c, 32, 30, 4); c.strokeStyle = '#2F8A3E'; c.lineWidth = 3; c.beginPath(); c.moveTo(32, 34); c.quadraticCurveTo(36, 48, 44, 54); c.stroke(); c.fillStyle = '#FFFFFF'; star(c, 50, 14, 4, 5, 2, 0); },
    s_jariApi: c => { iconBg(c, '#FFD9A0', '#E5584D'); c.fillStyle = 'rgba(255,200,60,.9)'; [[22, 18], [32, 12], [42, 18]].forEach(([x, h]) => { c.beginPath(); c.moveTo(x - 6, 30); c.quadraticCurveTo(x, h - 6, x + 6, 30); c.fill(); }); c.fillStyle = '#F2C28E'; rr(c, 27, 24, 10, 24, 5); c.fill(); rr(c, 22, 40, 22, 16, 7); c.fill(); c.strokeStyle = '#FFFFFF'; c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.arc(32, 40, 24, 0, TAU); c.stroke(); c.setLineDash([]); },
    s_kombo: c => { iconBg(c, '#FFF0B0', '#F07A2E'); label(c, '×20', 32, 30, 18, '#FFE07A'); c.fillStyle = '#FFFFFF'; for (let i = 0; i < 3; i++) { star(c, 14 + i * 18, 46, 4, 6, 2.4, 0.4); } c.strokeStyle = '#FFFFFF'; c.lineWidth = 3; c.beginPath(); c.moveTo(10, 54); c.lineTo(54, 54); c.stroke(); },
    slot: c => { iconBg(c, '#CFF3EA', '#2E9E8A'); c.fillStyle = '#FFFFFF'; circ(c, 26, 26, 9); c.beginPath(); c.arc(26, 50, 15, Math.PI, 0); c.fill(); c.fillStyle = '#FFE07A'; circ(c, 46, 42, 10); c.fillStyle = '#2E9E8A'; c.fillRect(44, 35, 4, 14); c.fillRect(39, 40, 14, 4); },
    // booster
    b_gold: c => { iconBg(c, '#FFF2B8', '#E7A71E'); coinAt(c, 28, 34, 16); label(c, '2×', 44, 54, 18); },
    b_dmg: c => { iconBg(c, '#FFD0C2', '#C8302A'); c.fillStyle = '#FFE07A'; star(c, 30, 32, 8, 20, 9, 0.2); c.fillStyle = '#FF6A2B'; star(c, 30, 32, 8, 12, 6, 0.6); label(c, '2×', 46, 56, 18); },
    b_speed: c => { iconBg(c, '#E0F0FF', '#3B82C4'); bolt(c, 30, 32, 1.6, '#FFE07A'); label(c, '+50%', 40, 58, 13); },
    b_drop: c => { iconBg(c, '#F0DCFF', '#A066E8'); chest(c, '#C98B4E', '#8A5A30'); label(c, '×3', 48, 20, 16, '#FFE07A'); },
    // peti
    h_hero: c => { iconBg(c, '#E0F0FF', '#3B82C4'); chest(c, '#3B82C4', '#1E3A6A'); c.save(); c.translate(32, 18); c.scale(0.55, 0.55); c.fillStyle = '#F2C28E'; circ(c, 0, 0, 14); c.fillStyle = '#2B3A55'; c.beginPath(); c.arc(0, -3, 14, Math.PI, 0); c.fill(); c.fillStyle = '#2B2B33'; circ(c, -5, 2, 2); circ(c, 5, 2, 2); c.restore(); },
    h_legenda: c => { iconBg(c, '#FFE8B0', '#E5484D'); chest(c, '#F2C230', '#B04048', '#FFE07A'); c.fillStyle = '#FFFFFF'; star(c, 32, 14, 5, 9, 4, -Math.PI / 2); label(c, 'SR+', 32, 58, 12, '#FFE07A'); },
    c_kayu: c => { iconBg(c, '#F3E3CC', '#B98A5A'); chest(c, '#B8763E', '#6E4520'); },
    c_emas: c => { iconBg(c, '#FFF4C0', '#E7A71E'); chest(c, '#F2C230', '#B08A20', '#FFE07A'); },
    c_mitos: c => { iconBg(c, '#FFD6D8', '#C8302A'); chest(c, '#E5484D', '#7A1E22', '#FF8A8A'); c.fillStyle = '#FFFFFF'; star(c, 50, 14, 4, 5, 2, 0); },
    c_abadi: c => { iconBg(c, '#1E2A5A', '#5A6CF0'); c.fillStyle = 'rgba(255,255,255,.8)'; [[10, 14], [52, 10], [56, 40], [8, 46]].forEach(([x, y]) => star(c, x, y, 4, 3, 1, 0)); chest(c, '#5A6CF0', '#2A2F70', '#9AA8FF'); },
    // kuasa
    p_meteor: c => { iconBg(c, '#3A2A5A', '#E07A2E'); c.strokeStyle = 'rgba(255,200,80,.8)'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(52, 10); c.lineTo(34, 30); c.stroke(); c.strokeStyle = 'rgba(255,120,40,.7)'; c.lineWidth = 4; c.beginPath(); c.moveTo(56, 20); c.lineTo(38, 36); c.stroke(); c.fillStyle = '#FF8A3A'; circ(c, 28, 38, 13); c.fillStyle = '#7A4A2A'; circ(c, 26, 40, 9); c.fillStyle = '#5A3A20'; circ(c, 23, 38, 2.5); circ(c, 29, 44, 2); },
    p_ais: c => { iconBg(c, '#E6F8FF', '#5AB4E0'); snowflake(c, 32, 33, 19, '#FFFFFF'); c.fillStyle = '#FFFFFF'; circ(c, 32, 33, 4); },
    p_duri: c => { iconBg(c, '#E2F5C8', '#5C8A3A'); c.fillStyle = '#3E6E2A'; c.fillRect(6, 50, 52, 8); [[12, 22], [24, 12], [36, 18], [48, 14]].forEach(([x, h]) => { c.fillStyle = '#6E4520'; c.beginPath(); c.moveTo(x - 6, 52); c.lineTo(x, h + 4); c.lineTo(x + 6, 52); c.fill(); c.fillStyle = '#F2E8D0'; c.beginPath(); c.moveTo(x - 1.5, h + 10); c.lineTo(x, h + 4); c.lineTo(x + 1.5, h + 10); c.fill(); }); },
    p_petir: c => { iconBg(c, '#B8C0D8', '#4A4E6A'); cloud(c, 32, 22, 1.4, '#E8ECF4'); bolt(c, 32, 42, 1.1, '#FFE07A'); },
    p_penawar: c => { iconBg(c, '#D6FAEA', '#2EAE8E'); c.fillStyle = '#FFFFFF'; c.beginPath(); c.moveTo(32, 8); c.lineTo(52, 16); c.quadraticCurveTo(52, 44, 32, 56); c.quadraticCurveTo(12, 44, 12, 16); c.closePath(); c.fill(); c.fillStyle = '#E5484D'; c.fillRect(28, 20, 8, 24); c.fillRect(20, 28, 24, 8); },
    p_amuk: c => { iconBg(c, '#FFD0C2', '#C8302A'); c.fillStyle = 'rgba(255,200,60,.9)'; [[18, 18], [32, 12], [46, 18]].forEach(([x, h]) => { c.beginPath(); c.moveTo(x - 7, 30); c.quadraticCurveTo(x, h - 6, x + 7, 30); c.fill(); }); c.fillStyle = '#F2C28E'; circ(c, 32, 38, 16); c.strokeStyle = '#2B2B33'; c.lineWidth = 3; c.beginPath(); c.moveTo(21, 30); c.lineTo(29, 34); c.moveTo(43, 30); c.lineTo(35, 34); c.stroke(); c.fillStyle = '#2B2B33'; circ(c, 26, 38, 2.2); circ(c, 38, 38, 2.2); c.beginPath(); c.arc(32, 50, 5, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); },
    p_emas: c => { iconBg(c, '#FFF4C0', '#E7A71E'); coinAt(c, 20, 18, 7); coinAt(c, 44, 14, 6); coinAt(c, 34, 30, 8); [0, 1, 2].forEach(i => { c.fillStyle = i % 2 ? '#E7A71E' : '#F5B82E'; rr(c, 14, 50 - i * 6, 36, 7, 3); c.fill(); }); label(c, '×3', 50, 40, 14); },
    p_lubang: c => { iconBg(c, '#5A3A8A', '#120A24'); for (let i = 0; i < 3; i++) { c.strokeStyle = ['#C08CF0', '#8F55DE', '#5A3A8A'][i]; c.lineWidth = 3; c.beginPath(); for (let a = 0; a < 9; a += 0.2) { const r = 4 + a * 2.2, x = 32 + Math.cos(a + i * 2.1) * r, y = 33 + Math.sin(a + i * 2.1) * r * 0.8; a ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); } c.fillStyle = '#000000'; circ(c, 32, 33, 7); },
    p_bom: c => { iconBg(c, '#FFE0B0', '#E5584D'); c.fillStyle = '#2E2E2E'; circ(c, 30, 38, 17); c.fillStyle = 'rgba(255,255,255,.35)'; circ(c, 24, 32, 5); c.fillStyle = '#5A5A5A'; c.fillRect(34, 16, 8, 8); c.strokeStyle = '#8A6A4A'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(38, 16); c.quadraticCurveTo(44, 6, 50, 10); c.stroke(); c.fillStyle = '#FFE07A'; star(c, 51, 10, 5, 6, 2, 0); label(c, '!', 30, 46, 18, '#FFE07A'); }
  };
  function wallIcon(c, k) {
    const w = WALLS[k]; iconBg(c, '#CDEBD8', '#7DBF6E');
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(4, 50, 56, 6);
    if (w.regen) { c.fillStyle = 'rgba(120,255,170,.45)'; rr(c, 6, 14, 52, 40, 10); c.fill(); }
    for (let i = 0; i < 4; i++) {
      const x = 8 + i * 12.5; c.fillStyle = w.warna;
      if (w.mat === 2 || w.mat === 3 || w.mat === 6) { rr(c, x, 22, 11.5, 30, 2); c.fill(); c.fillStyle = w.gelap; c.fillRect(x, 31, 11.5, 1.5); c.fillRect(x, 41, 11.5, 1.5); }
      else { rr(c, x, 22, 11, 30, w.mat === 1 ? 5 : 3); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x + 2.5, 25, 2, 22);
      if (w.thorns) { c.fillStyle = w.gelap; c.beginPath(); c.moveTo(x + 1, 22); c.lineTo(x + 5.5, 12); c.lineTo(x + 10, 22); c.fill(); }
    }
    c.fillStyle = w.gelap; c.fillRect(6, 30, 52, 4); c.fillRect(6, 43, 52, 4);
    if (w.mat >= 7) { c.fillStyle = '#FFFFFF'; star(c, 50, 14, 4, 4, 1.5, 0); }
    // penanda gred
    if (w.grade === 1 || w.grade === 4) { c.fillStyle = '#E8ECF4'; for (let i = 0; i < 4; i++) { circ(c, 13.5 + i * 12.5, 26, 1.6); circ(c, 13.5 + i * 12.5, 48, 1.6); } }
    if (w.grade === 3) { c.fillStyle = '#2EAE6A'; circ(c, 14, 13, 8); c.fillStyle = '#FFFFFF'; c.fillRect(12.5, 8, 3, 10); c.fillRect(9, 11.5, 10, 3); }
    if (w.grade === 4) { c.fillStyle = '#F5B82E'; c.beginPath(); c.moveTo(6, 16); c.lineTo(6, 6); c.lineTo(11, 11); c.lineTo(15, 4); c.lineTo(19, 11); c.lineTo(24, 6); c.lineTo(24, 16); c.closePath(); c.fill(); c.strokeStyle = '#B08A20'; c.lineWidth = 1; c.stroke(); }
    if (w.armor >= 20) { c.fillStyle = '#FFFFFF'; c.beginPath(); c.moveTo(52, 44); c.lineTo(60, 47); c.quadraticCurveTo(60, 57, 52, 61); c.quadraticCurveTo(44, 57, 44, 47); c.closePath(); c.fill(); c.fillStyle = w.gelap; c.fillRect(51, 47, 2, 10); }
  }
  // lukis ikon pada <canvas> mana-mana saiz
  function paintIcon(cvs, fn, size) {
    const s = size || 64, dpr = 2; cvs.width = s * dpr; cvs.height = s * dpr;
    const c = cvs.getContext('2d'); c.setTransform(dpr * s / 64, 0, 0, dpr * s / 64, 0, 0); c.clearRect(0, 0, 64, 64); fn(c);
  }

  // ================= KESAN VISUAL KUASA =================
  function drawPowersUnder(b) {
    const a = b.act;
    if (a.duri) {
      const grow = Math.min(1, (powDur('duri', b.save.powers.duri || 1) - a.duri.t) * 4) * Math.min(1, a.duri.t * 3);
      ctx.fillStyle = 'rgba(80,60,30,.25)'; ctx.fillRect(0, WALL_Y - 125, W, 110);
      for (let row = 0; row < 4; row++) for (let i = 0; i < 13; i++) {
        const x = 8 + i * 28 + (row % 2) * 14, y = WALL_Y - 25 - row * 28, h = (14 + ((i * 7 + row * 3) % 5) * 3) * grow * (1 + 0.08 * Math.sin(ANIM * 6 + i));
        ctx.fillStyle = row % 2 ? '#5C8A3A' : '#6E4520'; ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x, y - h); ctx.lineTo(x + 6, y); ctx.fill();
        ctx.fillStyle = '#F2E8D0'; ctx.beginPath(); ctx.moveTo(x - 1.5, y - h + 6); ctx.lineTo(x, y - h); ctx.lineTo(x + 1.5, y - h + 6); ctx.fill();
      }
    }
    if (a.lubang) {
      const L = a.lubang, k = Math.min(1, (powDur('lubang', b.save.powers.lubang || 1) - L.t) * 3), rot = ANIM * 4;
      ctx.save(); ctx.translate(L.x, L.y);
      for (let i = 0; i < 4; i++) { ctx.strokeStyle = ['rgba(192,140,240,.8)', 'rgba(143,85,222,.7)', 'rgba(90,58,138,.6)', 'rgba(255,255,255,.4)'][i]; ctx.lineWidth = 4; ctx.beginPath();
        for (let t = 0; t < 10; t += 0.25) { const r = (6 + t * 8) * k, x = Math.cos(t + rot + i * 1.57) * r, y = Math.sin(t + rot + i * 1.57) * r * 0.7; t ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
      glow(ctx, '#8F55DE', 30); ctx.fillStyle = '#05010A'; circ(ctx, 0, 0, 22 * k); noGlow(ctx);
      ctx.strokeStyle = '#E8D8FF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 30 * k, 10 * k, rot * 0.3, 0, TAU); ctx.stroke();
      ctx.restore();
      if (Math.random() < 0.6) { const an = Math.random() * TAU, r = 120; emit(L.x + Math.cos(an) * r, L.y + Math.sin(an) * r * 0.7, 1, { a: an + Math.PI, spread: 0.2, spd: 160, warna: ['#C08CF0', '#FFFFFF'], size: 2.5, life: 0.7, drag: 0 }); }
    }
    for (const m of b.bombs) {
      const drop = Math.min(1, (1.2 - m.t) / 0.35), y = m.y - 300 * (1 - drop), pulse = 1 + (m.t < 0.6 ? Math.sin(ANIM * 40) * 0.08 : 0);
      ctx.strokeStyle = 'rgba(229,72,77,' + (0.4 + 0.3 * Math.sin(ANIM * 20)) + ')'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      ctx.save(); ctx.translate(m.x, y); ctx.scale(pulse, pulse);
      ctx.fillStyle = '#2E2E2E'; circ(ctx, 0, 0, 30); ctx.fillStyle = 'rgba(255,255,255,.3)'; circ(ctx, -10, -10, 8); ctx.fillStyle = '#5A5A5A'; ctx.fillRect(-6, -40, 12, 12);
      ctx.fillStyle = Math.sin(ANIM * 30) > 0 ? '#FFE07A' : '#FF6A2B'; star(ctx, 6, -46, 6, 8, 3, ANIM * 10);
      label(ctx, Math.max(0, m.t).toFixed(1), 0, 8, 16, '#FFE07A');
      ctx.restore();
    }
  }
  function drawPowersOver(b) {
    const a = b.act;
    for (const m of b.meteors) {
      if (m.t < 0) { continue; }
      const p = Math.min(1, m.t / m.fall);
      ctx.strokeStyle = 'rgba(229,72,77,' + (0.3 + 0.5 * p) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(m.tx, m.ty, m.r * (1 - p * 0.6), 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,' + (0.1 + 0.2 * p) + ')'; ctx.beginPath(); ctx.ellipse(m.tx, m.ty + 8, 14 * p + 4, 5 * p + 2, 0, 0, TAU); ctx.fill();
      const tail = ctx.createLinearGradient(m.x, m.y, m.x + 50, m.y - 70); tail.addColorStop(0, 'rgba(255,200,80,.9)'); tail.addColorStop(1, 'rgba(255,90,30,0)');
      ctx.strokeStyle = tail; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + 50, m.y - 70); ctx.stroke();
      glow(ctx, '#FF8A3A', 18); ctx.fillStyle = '#FF8A3A'; circ(ctx, m.x, m.y, 13); noGlow(ctx); ctx.fillStyle = '#7A4A2A'; circ(ctx, m.x - 1, m.y + 1, 9); ctx.fillStyle = '#5A3A20'; circ(ctx, m.x - 3, m.y - 1, 2.5); circ(ctx, m.x + 2, m.y + 4, 2);
      if (Math.random() < 0.8) emit(m.x + 6, m.y - 8, 1, { a: -1, spread: 0.6, spd: 40, warna: ['#FFE07A', '#FF6A2B'], size: 4, life: 0.35 });
    }
    drawIceAge(b);
    for (const z of b.zombies) if (z.freezeT > 0) iceBlock(z, Math.min(1, z.freezeT * 3));
    if (a.petir) { ctx.fillStyle = 'rgba(20,24,60,.28)'; ctx.fillRect(0, 0, W, WALL_Y); for (let i = 0; i < 5; i++) cloud(ctx, 30 + i * 75 + Math.sin(ANIM + i) * 6, 22 + (i % 2) * 10, 1.6, 'rgba(70,74,100,.85)'); }
    if (a.penawar) { const k = Math.min(1, a.penawar.t * 2); ctx.save(); ctx.globalAlpha = 0.5 * k; glow(ctx, '#7FF0C8', 20); ctx.strokeStyle = '#7FF0C8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(W / 2, WALL_Y + 10, W * 0.62, 70, 0, Math.PI, 0); ctx.stroke(); noGlow(ctx);
      ctx.fillStyle = 'rgba(127,240,200,.18)'; ctx.beginPath(); ctx.ellipse(W / 2, WALL_Y + 10, W * 0.62, 70, 0, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; for (let i = 0; i < 8; i++) { const x = ((ANIM * 40 + i * 50) % (W + 40)) - 20; ctx.beginPath(); ctx.moveTo(x, WALL_Y - 50); ctx.lineTo(x + 10, WALL_Y - 40); ctx.stroke(); } ctx.restore(); }
    if (a.emas) { if (Math.random() < 0.7) emit(Math.random() * W, -10, 1, { a: Math.PI / 2, spread: 0.3, spd: 120, warna: '#F5B82E', size: 5, life: 2.2, grav: 60, shape: 'coin', drag: 0, shrink: false }); ctx.fillStyle = 'rgba(255,220,100,.08)'; ctx.fillRect(0, 0, W, H); }
  }
  function shakeOffset(b) { if (CALM()) return 0; let m = 0; for (const f of b.fx) if (f.kind === 'shake' && f.t < 0.4) m = Math.max(m, f.mag * (1 - f.t / 0.4)); return m; }

  // ================= 50 LATAR: 10 tempat × 5 suasana =================
  // bahagian statik dilukis sekali ke kanvas cache; cuaca dianimasikan setiap bingkai
  const BIOME_COL = [
    { tanah: '#9ED67A', jalur: '#8BC96A', laluan: '#D9B98A', bawah: '#B99772' },   // Kampung
    { tanah: '#8E949C', jalur: '#868C94', laluan: '#5E646C', bawah: '#7A7A80' },   // Pekan
    { tanah: '#7CC46A', jalur: '#72BA60', laluan: '#7CC46A', bawah: '#B99772' },   // Sekolah
    { tanah: '#5E5A6A', jalur: '#58546A', laluan: '#4A4658', bawah: '#6A6070' },   // Pasar Malam
    { tanah: '#B8764A', jalur: '#A86A40', laluan: '#C88A5A', bawah: '#9A6038' },   // Ladang Sawit
    { tanah: '#F2DCA0', jalur: '#ECD498', laluan: '#E8CC8E', bawah: '#D8B878' },   // Pantai
    { tanah: '#4E8A4A', jalur: '#478244', laluan: '#7A6A48', bawah: '#6A5A3A' },   // Hutan Simpan
    { tanah: '#A8ACB0', jalur: '#9EA2A6', laluan: '#8C9096', bawah: '#7A7E84' },   // Kilang
    { tanah: '#6E6A80', jalur: '#686478', laluan: '#7E788E', bawah: '#5A5668' },   // Kota Hantu
    { tanah: '#4A3A38', jalur: '#443432', laluan: '#5A4440', bawah: '#3A2C2A' }    // Gunung Berapi
  ];
  function tree(c, x, y, s, daun, batang) { c.fillStyle = batang || '#7A5A3A'; c.fillRect(x - 2 * s, y - 2 * s, 4 * s, 12 * s); c.fillStyle = daun; circ(c, x, y - 6 * s, 9 * s); circ(c, x - 6 * s, y - 2 * s, 6 * s); circ(c, x + 6 * s, y - 2 * s, 6 * s); c.fillStyle = 'rgba(255,255,255,.12)'; circ(c, x - 3 * s, y - 9 * s, 3.5 * s); }
  function palm(c, x, y, s) { c.strokeStyle = '#8A6A40'; c.lineWidth = 3.5 * s; c.beginPath(); c.moveTo(x, y + 10 * s); c.quadraticCurveTo(x + 4 * s, y - 6 * s, x + 2 * s, y - 18 * s); c.stroke(); c.fillStyle = '#3E9A3E'; for (let i = 0; i < 6; i++) { const a = i * 1.05 - 0.4; c.beginPath(); c.ellipse(x + 2 * s + Math.cos(a) * 9 * s, y - 18 * s + Math.sin(a) * 4 * s, 10 * s, 3 * s, a, 0, TAU); c.fill(); } c.fillStyle = '#7A5A2A'; circ(c, x + 1 * s, y - 16 * s, 2.2 * s); circ(c, x + 4 * s, y - 16 * s, 2.2 * s); }
  function house(c, x, y, w, col, roof) { c.fillStyle = '#6E4520'; c.fillRect(x + 2, y + 18, 3, 10); c.fillRect(x + w - 5, y + 18, 3, 10); c.fillStyle = col; c.fillRect(x, y, w, 20); c.fillStyle = roof; c.beginPath(); c.moveTo(x - 5, y + 2); c.lineTo(x + w / 2, y - 14); c.lineTo(x + w + 5, y + 2); c.fill(); c.fillStyle = '#5A3A20'; c.fillRect(x + w / 2 - 4, y + 6, 8, 14); c.fillStyle = '#FFE9A8'; c.fillRect(x + 4, y + 6, 7, 6); }
  function drawBiome(c, bi, r) {
    const P = BIOME_COL[bi];
    c.fillStyle = P.tanah; c.fillRect(0, 0, W, H);
    c.fillStyle = P.jalur; for (let y = 0; y < H; y += 48) c.fillRect(0, y, W, 24);
    const scatter = (n, fn) => { for (let i = 0; i < n; i++) fn(r() * W, r() * (WALL_Y - 50), r()); };
    switch (bi) {
      case 0: // Kampung
        c.fillStyle = P.laluan; c.globalAlpha = .6; rr(c, W / 2 - 70, -20, 140, WALL_Y + 40, 40); c.fill(); c.globalAlpha = 1;
        house(c, 14, 30, 50, '#C98B4E', '#8A3A2A'); house(c, W - 66, 150, 48, '#D8A868', '#7A4A2A');
        palm(c, 30, 230, 1.3); palm(c, W - 30, 60, 1.2); palm(c, W - 40, 330, 1.1);
        scatter(14, (x, y, k) => { c.fillStyle = k < .5 ? '#FFF3B0' : '#FF9EC8'; for (let a = 0; a < 5; a++) circ(c, x + Math.cos(a * 1.26) * 3.5, y + Math.sin(a * 1.26) * 3.5, 2.6); c.fillStyle = '#F2A33A'; circ(c, x, y, 2); });
        break;
      case 1: // Pekan
        c.fillStyle = '#B8BCC2'; c.fillRect(0, 0, 70, H); c.fillRect(W - 70, 0, 70, H);
        c.fillStyle = P.laluan; c.fillRect(70, 0, W - 140, H); c.fillStyle = '#F2E8C8'; for (let y = 0; y < WALL_Y; y += 40) c.fillRect(W / 2 - 3, y, 6, 22);
        [[4, 20, '#E8A0A0'], [4, 150, '#A0C8E8'], [4, 290, '#E8D0A0'], [W - 62, 70, '#B8E0A8'], [W - 62, 220, '#E0B8E8'], [W - 62, 360, '#F0C890']].forEach(([x, y, col]) => { c.fillStyle = col; c.fillRect(x, y, 58, 100); c.fillStyle = '#5A6070'; c.fillRect(x, y, 58, 10); c.fillStyle = '#FFF4C8'; for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) c.fillRect(x + 8 + i * 26, y + 20 + j * 26, 16, 16); });
        for (let y = 60; y < WALL_Y; y += 130) { c.fillStyle = '#4A4E58'; c.fillRect(74, y, 3, 40); c.fillRect(W - 77, y + 60, 3, 40); c.fillStyle = '#FFE9A8'; circ(c, 76, y, 4); circ(c, W - 75, y + 60, 4); }
        break;
      case 2: // Sekolah
        c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 3; c.strokeRect(20, 30, W - 40, WALL_Y - 60); c.beginPath(); c.moveTo(20, (WALL_Y - 30) / 2 + 15); c.lineTo(W - 20, (WALL_Y - 30) / 2 + 15); c.stroke();
        c.beginPath(); c.arc(W / 2, (WALL_Y - 30) / 2 + 15, 40, 0, TAU); c.stroke(); c.strokeRect(W / 2 - 60, 30, 120, 50);
        c.strokeStyle = '#FFFFFF'; c.lineWidth = 4; c.strokeRect(W / 2 - 34, 14, 68, 18);
        c.fillStyle = '#9AA0A8'; c.fillRect(W - 14, 80, 3, 90); c.fillStyle = '#E5484D'; c.fillRect(W - 11, 80, 22, 6); c.fillStyle = '#FFFFFF'; c.fillRect(W - 11, 86, 22, 6); c.fillStyle = '#2B4BA0'; c.fillRect(W - 11, 80, 10, 8);
        break;
      case 3: // Pasar Malam
        [[6, '#E5484D'], [W - 66, '#3B82C4']].forEach(([x, col], s) => { for (let y = 20 + s * 40; y < WALL_Y - 40; y += 90) { c.fillStyle = '#6E4520'; c.fillRect(x + 4, y + 20, 52, 30); c.fillStyle = s ? '#F2C230' : '#4CAF7A'; c.fillRect(x + 10, y + 26, 40, 8); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#FFFFFF' : col; c.fillRect(x + i * 10, y, 10, 20); } } });
        break;
      case 4: // Ladang Sawit
        for (let x = 20; x < W; x += 60) { c.fillStyle = 'rgba(120,60,30,.25)'; c.fillRect(x - 10, 0, 20, WALL_Y); }
        for (let y = 40; y < WALL_Y - 40; y += 110) for (let x = 30; x < W; x += 120) palm(c, x + (y % 220 ? 60 : 0), y, 1.4);
        break;
      case 5: // Pantai
        c.fillStyle = '#4EB8D8'; c.fillRect(0, 0, W, 110); c.fillStyle = '#7ED0E8'; c.fillRect(0, 70, W, 40);
        c.fillStyle = '#FFFFFF'; for (let x = 0; x < W; x += 24) circ(c, x + 12, 110, 8);
        palm(c, 30, 200, 1.3); palm(c, W - 28, 330, 1.2);
        c.fillStyle = '#E5484D'; c.beginPath(); c.arc(W - 60, 190, 26, Math.PI, 0); c.fill(); c.fillStyle = '#FFFFFF'; c.beginPath(); c.moveTo(W - 60, 164); c.lineTo(W - 72, 190); c.lineTo(W - 48, 190); c.fill(); c.fillStyle = '#8A6A40'; c.fillRect(W - 61, 164, 2, 50);
        scatter(10, (x, y) => { if (y > 130) { c.fillStyle = '#F7A0A0'; star(c, x, y, 5, 4, 2, 0); } });
        break;
      case 6: // Hutan Simpan
        c.fillStyle = P.laluan; c.globalAlpha = .5; rr(c, W / 2 - 60, -20, 120, WALL_Y + 40, 30); c.fill(); c.globalAlpha = 1;
        for (let i = 0; i < 16; i++) { const x = i % 2 ? 20 + r() * 80 : W - 100 + r() * 80, y = r() * (WALL_Y - 60); tree(c, x, y, 1.3 + r() * .5, ['#2F6B33', '#3E8A3E', '#2A5A2E'][i % 3], '#5A3A20'); }
        scatter(8, (x, y) => { if (Math.abs(x - W / 2) < 60) return; c.fillStyle = '#E5484D'; c.beginPath(); c.arc(x, y, 5, Math.PI, 0); c.fill(); c.fillStyle = '#FFFFFF'; circ(c, x - 2, y - 2, 1.2); c.fillStyle = '#F2E8D0'; c.fillRect(x - 1.5, y, 3, 5); });
        break;
      case 7: // Kilang
        c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 1; for (let x = 0; x < W; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = 0; y < H; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
        for (let y = 0; y < WALL_Y; y += 16) { c.fillStyle = (y / 16) % 2 ? '#2B2B33' : '#F2C230'; c.fillRect(56, y, 8, 16); c.fillRect(W - 64, y, 8, 16); }
        c.fillStyle = '#7A8090'; c.fillRect(0, 140, 56, 14); c.fillRect(W - 56, 300, 56, 14); c.fillStyle = '#5A6070'; c.fillRect(20, 0, 14, 140);
        [[8, 220], [W - 48, 60], [W - 52, 380], [12, 360]].forEach(([x, y]) => { c.fillStyle = '#B8763E'; c.fillRect(x, y, 36, 30); c.strokeStyle = '#7A4A2A'; c.lineWidth = 2; c.strokeRect(x, y, 36, 30); c.beginPath(); c.moveTo(x, y); c.lineTo(x + 36, y + 30); c.stroke(); });
        break;
      case 8: // Kota Hantu
        for (let i = 0; i < 14; i++) { const x = i % 2 ? 14 + r() * 70 : W - 84 + r() * 70, y = 30 + r() * (WALL_Y - 90); c.fillStyle = '#8A8698'; rr(c, x, y, 18, 24, 8); c.fill(); c.fillRect(x, y + 10, 18, 14); c.fillStyle = '#5A566A'; c.fillRect(x + 7, y + 6, 4, 12); c.fillRect(x + 4, y + 9, 10, 3); }
        c.strokeStyle = '#3A3448'; c.lineWidth = 3; [[W / 2 - 110, 120], [W / 2 + 100, 260]].forEach(([x, y]) => { c.beginPath(); c.moveTo(x, y + 40); c.lineTo(x, y); c.lineTo(x - 12, y - 14); c.moveTo(x, y + 8); c.lineTo(x + 14, y - 8); c.stroke(); });
        break;
      case 9: // Gunung Berapi
        c.strokeStyle = '#FF6A1F'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { let x = r() * W, y = r() * (WALL_Y - 40); c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - .5) * 40; y += 10 + r() * 14; c.lineTo(x, y); } c.stroke(); }
        scatter(16, (x, y, k) => { c.fillStyle = k < .5 ? '#2E2422' : '#5A4440'; c.beginPath(); c.ellipse(x, y, 8 + k * 8, 5 + k * 4, 0, 0, TAU); c.fill(); });
        break;
    }
    c.fillStyle = P.bawah; c.fillRect(0, WALL_Y + 14, W, H - WALL_Y);
    c.fillStyle = 'rgba(0,0,0,.07)'; for (let x = 0; x < W; x += 30) c.fillRect(x, WALL_Y + 14, 15, H);
  }
  const SUASANA_TINT = [null, 'rgba(255,130,60,.20)', 'rgba(10,18,60,.48)', 'rgba(60,80,110,.30)', 'rgba(230,236,240,.28)'];
  let bgCache = null;
  function bgCanvas(stage) {
    const idx = bgIndex(stage);
    if (bgCache && bgCache.idx === idx) return bgCache.cv;
    const bg = BACKGROUNDS[idx], cv0 = document.createElement('canvas'); cv0.width = W * 2; cv0.height = H * 2;
    const c = cv0.getContext('2d'); c.scale(2, 2);
    drawBiome(c, bg.bi, mulberry(idx * 977 + 13));
    if (SUASANA_TINT[bg.si]) { c.fillStyle = SUASANA_TINT[bg.si]; c.fillRect(0, 0, W, H); }
    if (bg.si === 1) { const g = c.createLinearGradient(0, 0, 0, 220); g.addColorStop(0, 'rgba(255,170,80,.45)'); g.addColorStop(1, 'rgba(255,170,80,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 220); }
    if (bg.si === 3) { c.fillStyle = 'rgba(120,150,190,.35)'; const r = mulberry(idx); for (let i = 0; i < 8; i++) { c.beginPath(); c.ellipse(r() * W, r() * (WALL_Y - 40), 14 + r() * 16, 5 + r() * 4, 0, 0, TAU); c.fill(); } }
    bgCache = { idx, cv: cv0 }; return cv0;
  }
  function drawBg(stage) {
    const bg = BACKGROUNDS[bgIndex(stage)];
    try { ctx.drawImage(bgCanvas(stage), 0, 0, W, H); } catch (e) { ctx.fillStyle = BIOME_COL[bg.bi].tanah; ctx.fillRect(0, 0, W, H); }
    if (!LOWFX) {
    // animasi tempat
    if (bg.bi === 5) { ctx.fillStyle = 'rgba(255,255,255,.7)'; for (let x = 0; x < W; x += 24) circ(ctx, x + 12 + Math.sin(ANIM * 2) * 6, 112 + Math.sin(ANIM * 2.5 + x * .05) * 3, 7); }
    if (bg.bi === 3) for (let i = 0; i < 12; i++) { const on = Math.sin(ANIM * 3 + i * 1.7) > 0; ctx.fillStyle = on ? ['#FFE07A', '#FF9EC8', '#9FE6FF'][i % 3] : 'rgba(255,255,255,.25)'; circ(ctx, 6 + i * 5 + (i % 2) * 2, 18 + (i % 3) * 90, 2.5); circ(ctx, W - 64 + i * 5, 58 + (i % 3) * 90, 2.5); }
    if (bg.bi === 9) { ctx.fillStyle = 'rgba(255,90,30,' + (0.06 + 0.05 * Math.sin(ANIM * 2)) + ')'; ctx.fillRect(0, 0, W, WALL_Y); if (Math.random() < 0.3) emit(Math.random() * W, WALL_Y - 20, 1, { a: -Math.PI / 2, spread: 0.6, spd: 40, warna: ['#FF8A3A', '#FFE07A'], size: 2, life: 1.2, drag: 0.3 }); }
    if (bg.bi === 8) { ctx.fillStyle = 'rgba(200,200,230,.10)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(((ANIM * 12 + i * 110) % (W + 160)) - 80, 120 + i * 90, 90, 22, 0, 0, TAU); ctx.fill(); } }
    }
    if (!LOWFX) {
    // animasi suasana
    if (bg.si === 2) { for (let i = 0; i < 14; i++) { const a = 0.4 + 0.6 * Math.abs(Math.sin(ANIM * 1.5 + i * 2.3)); ctx.fillStyle = 'rgba(255,240,140,' + a + ')'; circ(ctx, (i * 61 + Math.sin(ANIM * .6 + i) * 20) % W, (i * 97 + Math.cos(ANIM * .5 + i) * 16) % (WALL_Y - 30), 1.8); } }
    if (bg.si === 3) { ctx.strokeStyle = 'rgba(200,220,255,.45)'; ctx.lineWidth = 1.3; ctx.beginPath(); for (let i = 0; i < 40; i++) { const x = (i * 37 + ANIM * 60) % W, y = (i * 53 + ANIM * 520) % H; ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 12); } ctx.stroke(); }
    if (bg.si === 4) { ctx.fillStyle = 'rgba(255,255,255,.16)'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(((ANIM * (8 + i * 3) + i * 140) % (W + 220)) - 110, 60 + i * 95, 120, 30, 0, 0, TAU); ctx.fill(); } }
    }
  }
  function bgThumb(c, idx) { const old = ctx; ctx = c; const st = idx + 1; c.save(); c.scale(64 / W, 64 / W); drawBg(st); c.restore(); ctx = old; }

