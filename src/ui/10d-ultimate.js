  // ---------- v9.5: Ultimate hero — bar butang, kesan visual ----------
  const ULT_WARNA = { sRate: '#FFB04A', tRate: '#7FD8FF', tDmg: '#FF7A5A', lemah: '#9CF07A', perisai: '#B8C8E0', heal: '#7CF0A8', regen: '#7CF0A8', batu: '#C8A070', snipe: '#FF5A5A', smite: '#FFF27A', freeze: '#A8E8FF', emp: '#7FC8FF', carpet: '#FF9A3A', burnAll: '#FF6A2A', poison: '#9CE04A', storm: '#FFF27A', rockets: '#FF8A4A', six: '#FFD24A', beam: '#FF4AD8', slash: '#C8B8FF' };
  function ultCol(h) { const U = ULTS[h]; return (U && ULT_WARNA[U.k]) || '#FFD24A'; }
  let ultSig = ''; const ultBtns = {};
  function buildUltBar() {
    const bar = $('ultBar'); if (!bar) return;
    const ids = battle && battle.team ? battle.team.map(m => m.id) : [], sig = ids.join(',');
    if (sig === ultSig) return; ultSig = sig; bar.innerHTML = ''; for (const k in ultBtns) delete ultBtns[k];
    ids.forEach(id => { const U = ULTS[id]; if (!U) return;
      const b = document.createElement('button'); b.className = 'ubtn'; b.setAttribute('aria-label', 'Ultimate ' + HEROES[id].nama + ': ' + U.nama); b.title = U.nama + ' — ' + U.desc;
      b.innerHTML = '<span class="uf"></span><canvas aria-hidden="true"></canvas><span class="ui">' + U.ikon + '</span>';
      b.setAttribute('style', '--uc:' + ultCol(id));
      paintIcon(b.querySelector('canvas'), c => { c.save(); c.translate(32, 40); c.scale(1.25, 1.25); c.translate(-32, -36); drawHero(c, 32, 40, id, -Math.PI / 2, 0, 1, heroWeapon(save, id), { t: 0.5, phase: 0, mood: 'main', skin: heroSkin(save, id) }); c.restore(); }, 44);
      b.addEventListener('click', () => { if (!running) { toast('Mulakan pertempuran dahulu', false); return; } const m = battle.team.find(t => t.id === id); if (!battle.useUlt(id)) toast(U.nama + ' belum sedia' + (m ? ' (' + Math.floor(m.ult * 100) + '%)' : ''), false); else vib && vib([40, 30, 80]); });
      ultBtns[id] = b; bar.appendChild(b); });
    bar.hidden = !ids.length;
  }
  function refreshUltBar() {
    if (!battle || !$('ultBar')) return; buildUltBar();
    for (const m of battle.team) { const b = ultBtns[m.id]; if (!b) continue; const p = Math.max(0, Math.min(1, m.ult || 0)), r = p >= 1 && running && battle.state === 'main';
      const pk = Math.round(p * 100); if (b._p !== pk) { b._p = pk; b.querySelector('.uf').style.height = pk + '%'; }
      if (b._r !== r) { b._r = r; b.classList.toggle('ready', r); } }
  }
  // kesan visual Ultimate (dipanggil dari drawFx)
  function drawUltFx(b, f) {
    if (f.t < 0) return; const c = ctx;
    if (f.kind === 'ult') { const k = f.t / f.life, col = ultCol(f.h);
      c.save(); if (!CALM() && k < 0.5) { c.globalAlpha = (0.5 - k) * 1.4; const g = c.createRadialGradient(f.x, f.y - 10, 4, f.x, f.y - 10, 30 + k * 260); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.3, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(f.x, f.y - 10, 30 + k * 260, 0, TAU); c.fill();
        c.globalAlpha = (0.5 - k) * 2; c.strokeStyle = col; c.lineWidth = 4; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + k * 2, r0 = 20 + k * 80, r1 = r0 + 26; c.beginPath(); c.moveTo(f.x + Math.cos(a) * r0, f.y - 10 + Math.sin(a) * r0); c.lineTo(f.x + Math.cos(a) * r1, f.y - 10 + Math.sin(a) * r1); c.stroke(); } }
      c.globalAlpha = Math.max(0, Math.min(1, (1 - k) * 2.2)); const pop = 1 + Math.max(0, 0.25 - k) * 2.4, y = 150 - k * 14;
      c.translate(W / 2, y); c.scale(pop, pop); c.fillStyle = 'rgba(15,20,32,.78)'; const tw = Math.min(W - 20, 40 + f.nama.length * 13); c.beginPath(); if (c.roundRect) c.roundRect(-tw / 2, -26, tw, 46, 14); else c.rect(-tw / 2, -26, tw, 46); c.fill(); c.strokeStyle = col; c.lineWidth = 3; c.stroke();
      label(c, f.ikon + ' ' + f.nama + '!', 0, 4, 22, col); label(c, 'ULTIMATE · ' + HEROES[f.h].nama, 0, -14, 10, '#FFFFFF'); c.restore(); return; }
    if (f.kind === 'ushot') { const k = f.t / f.life; c.save(); c.globalAlpha = Math.max(0, 1 - k); glow(c, '#FF5A5A', 18); c.strokeStyle = '#FFE0E0'; c.lineWidth = 6 * (1 - k) + 1; c.beginPath(); c.moveTo(f.x, f.y); c.lineTo(f.x2, f.y2); c.stroke(); c.strokeStyle = '#FF3A3A'; c.lineWidth = 2; c.stroke(); noGlow(c); c.strokeStyle = '#FFFFFF'; c.lineWidth = 2; c.beginPath(); c.arc(f.x2, f.y2, 8 + k * 26, 0, TAU); c.stroke(); c.restore(); return; }
    if (f.kind === 'uslash') { const k = f.t / f.life; c.save(); c.globalAlpha = Math.max(0, 1 - k); c.translate(f.x, f.y); c.strokeStyle = '#E8E0FF'; c.lineWidth = 4 * (1 - k) + 1; const L = 26 + k * 10; c.beginPath(); c.moveTo(-L, -L * 0.6); c.lineTo(L, L * 0.6); c.moveTo(L * 0.6, -L); c.lineTo(-L * 0.6, L); c.stroke(); c.restore(); return; }
    if (f.kind === 'ubeam') { const k = f.t / f.life, x = -40 + k * (W + 80); c.save(); c.globalAlpha = Math.max(0, 1 - k * 0.7); const g = c.createLinearGradient(x - 40, 0, x + 40, 0); g.addColorStop(0, 'rgba(255,74,216,0)'); g.addColorStop(0.5, 'rgba(255,200,250,.9)'); g.addColorStop(1, 'rgba(255,74,216,0)'); c.fillStyle = g; c.fillRect(x - 40, 0, 80, WALL_Y); c.fillStyle = 'rgba(255,255,255,.95)'; c.fillRect(x - 4, 0, 8, WALL_Y); c.restore(); return; }
  }
  // gelang cas Ultimate di bawah hero dalam medan
  function drawUltRings(b) {
    if (!b || !b.team) return;
    for (const m of b.team) { const p = Math.max(0, Math.min(1, m.ult || 0)); if (!ULTS[m.id]) continue; const col = ultCol(m.id);
      ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(m.x, m.y + 22, 18, 6, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = col; if (p >= 1) { ctx.globalAlpha = 0.6 + 0.4 * Math.sin(ANIM * 8); glow(ctx, col, 10); } ctx.beginPath(); ctx.ellipse(m.x, m.y + 22, 18, 6, 0, -Math.PI / 2, -Math.PI / 2 + TAU * p); ctx.stroke(); noGlow(ctx); ctx.restore();
      if (m.aff === 'luar' || m.aff === 'pakar') { ctx.save(); ctx.font = '700 11px system-ui'; ctx.textAlign = 'center'; ctx.globalAlpha = m.aff === 'luar' ? 0.75 + 0.25 * Math.sin(ANIM * 5) : 0.9; ctx.fillText(m.aff === 'luar' ? '⚠' : '⭐', m.x + 21, m.y + 26); ctx.restore(); } }
  }
