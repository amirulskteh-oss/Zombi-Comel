  // ---------- zombie dengan animasi berjalan, menyerang, terbakar, beku ----------
  function mixCol(a, b, k) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
  function zCol(z) { if (z._col) return z._col; z._col = z.tint ? mixCol(z.warna, z.tint, 0.55) : z.warna; return z._col; }
  // Sprite animasi 8 bingkai bagi 11 hero. Imej potret kekal sebagai bingkai sedia/standby.
  const HERO_ANIM_FILES = {
    ninja: 'hero-01-ninja-amir', askar: 'hero-02-sarjan-rahim', saintis: 'hero-03-dr-lina',
    jurutera: 'hero-04-jurutera-wei', ratu_ais: 'hero-05-ratu-salju', pahlawan: 'hero-06-hang-kilat',
    komander: 'hero-07-komander-zara', pistol: 'hero-08-pak-usu', budak: 'hero-09-budak-lastik',
    shotgun: 'hero-10-kak-long', mesingan: 'hero-11-abang-jo'
  };
  const HERO_ANIMS = {};
  if (typeof Image !== 'undefined') Object.entries(HERO_ANIM_FILES).forEach(([id, base]) => {
    HERO_ANIMS[id] = {};
    const idle = new Image(); idle.src = 'heroes/' + base + '.png'; HERO_ANIMS[id].idle = idle;
    ['attack', 'walk', 'ultimate'].forEach(state => { const img = new Image(); img.src = 'heroes/' + base + '-' + state + '.png'; HERO_ANIMS[id][state] = img; });
  });
  function drawBattleHero(m, y, sc, phase, runK, b, sv) {
    const id = m.id, sheets = HERO_ANIMS[id];
    const ultimate = b.fx && b.fx.find(f => f.kind === 'ult' && f.h === id && f.t < f.life);
    const state = ultimate ? 'ultimate' : runK > 0.04 ? 'walk' : m.recoil > 0 ? 'attack' : 'idle';
    const img = sheets && (state ? sheets[state] : null);
    if (heroWeapon(sv, id) !== HEROES[id].wpn || !img || !img.complete || !img.naturalWidth) {
      drawHero(ctx, m.x, y, id, m.aim, m.recoil, sc, heroWeapon(sv, id), { t: ANIM, phase, mood: b.state === 'main' ? 'main' : b.state, gear: gearOf(sv, id), skin: heroSkin(sv, id), hurt: m.hurtT > 0 ? m.hurtT : 0, rage: !!b.act.amuk, spin: (m.shots || 0) * 0.9 + ANIM * (m.recoil > 0 ? 20 : 2) });
      return;
    }
    const frame = state === 'idle' ? 0 : ultimate ? Math.min(7, Math.floor(ultimate.t / Math.max(0.01, ultimate.life) * 8)) :
      state === 'attack' ? Math.min(7, Math.floor((1 - m.recoil / 0.1) * 8)) :
      Math.floor(ANIM * (state === 'walk' ? 10 : 3) + phase) % 8;
    const size = 58 * sc;
    ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(img, frame * 128, 0, 128, 128, m.x - size / 2, y - size + 20 * sc, size, size);
    if (m.hurtT > 0) { ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = 'rgba(229,72,77,.35)'; ctx.fillRect(m.x - size / 2, y - size + 20 * sc, size, size); }
    ctx.restore();
  }
  function drawZombie(z) {
    if (z.fly) { drawFlyZ(z); return; }
    if (z.hop > 0 && z._jd == null) z._jd = Math.max(0, Math.min(90, z.y - (z._py == null ? z.y : z._py))); else if (!(z.hop > 0)) z._jd = null;
    const pyKeep = z.y; z._py = z.y;
    if (z.hop > 0 && z._jd > 4 && !LOWFX) { const k = 1 - z.hop / 0.35, back = (1 - k) * z._jd, lift = Math.sin(k * Math.PI) * 26;
      ctx.save(); ctx.fillStyle = 'rgba(0,0,0,' + (0.22 - lift / 200) + ')'; ctx.beginPath(); ctx.ellipse(z.x, z.y - back + z.r * 0.9, z.r * (1 - lift / 70), z.r * 0.3, 0, 0, TAU); ctx.fill(); ctx.translate(0, -back - lift); drawZombie0(z); ctx.restore(); return; }
    if ((z.type === 'peludah' || z.traits.includes('penembak')) && z.atkT > 0 && z.atkT < 0.35 && !LOWFX) { const q = 1 - z.atkT / 0.35, sc = 1 + 0.12 * q; ctx.save(); ctx.translate(z.x, z.y + z.r); ctx.scale(sc, 2 - sc); ctx.translate(-z.x, -z.y - z.r); drawZombie0(z); ctx.restore(); return; }
    drawZombie0(z);
  }
  // v9.2: zombie udara — bayang di tanah, badan terapung, sayap / belon
  function drawFlyZ(z) {
    const t = ANIM * (z.fly === 'kelawar' ? 18 : z.fly === 'gagak' ? 12 : 2) + z.id, lift = z.fly === 'belon' ? 22 : z.fly === 'boss' ? 20 : 14, bob = Math.sin(t * (z.fly === 'belon' ? 1 : 0.5)) * 3, r = z.r;
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(z.x, z.y + r * 0.9, r * 0.8, r * 0.25, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(0, -lift + bob);
    if (z.fly === 'belon') { ctx.strokeStyle = '#E8E0D0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(z.x, z.y - r); ctx.lineTo(z.x + Math.sin(t) * 2, z.y - r - 16); ctx.stroke();
      const g = ctx.createRadialGradient(z.x - 5, z.y - r - 30, 2, z.x, z.y - r - 26, 15); g.addColorStop(0, '#FFB0C8'); g.addColorStop(1, '#C0305A'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(z.x + Math.sin(t) * 2, z.y - r - 27, 12, 14, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(20,24,34,.5)'; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(z.x - 4, z.y - r - 32, 3, 5, -0.4, 0, TAU); ctx.fill(); ctx.fillStyle = '#C0305A'; ctx.beginPath(); ctx.moveTo(z.x - 2, z.y - r - 13); ctx.lineTo(z.x + 2, z.y - r - 13); ctx.lineTo(z.x, z.y - r - 16); ctx.fill(); }
    else if (z.fly !== 'boss') { const fl = Math.sin(t) * 0.6, col = z.fly === 'kelawar' ? '#3A2E48' : '#22222A';
      for (const s of [-1, 1]) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(z.x + s * r * 0.5, z.y - r * 0.2);
        if (z.fly === 'kelawar') { ctx.quadraticCurveTo(z.x + s * r * 1.5, z.y - r * (1.1 + fl), z.x + s * r * 2.0, z.y - r * (0.1 + fl)); ctx.quadraticCurveTo(z.x + s * r * 1.5, z.y + r * 0.1, z.x + s * r * 1.2, z.y + r * 0.2); ctx.quadraticCurveTo(z.x + s * r * 0.9, z.y, z.x + s * r * 0.5, z.y + r * 0.3); }
        else { for (let i = 0; i < 4; i++) ctx.lineTo(z.x + s * r * (1.0 + i * 0.3), z.y - r * (0.6 + fl * (1 - i * 0.2)) + i * r * 0.25); ctx.lineTo(z.x + s * r * 0.6, z.y + r * 0.3); }
        ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1; ctx.stroke(); } }
    const keep = z.fly; z.fly = null; drawZombie(z); z.fly = keep;
    if (keep === 'gagak') { ctx.fillStyle = '#F2C230'; ctx.beginPath(); ctx.moveTo(z.x - 3, z.y + r * 0.2); ctx.lineTo(z.x + 3, z.y + r * 0.2); ctx.lineTo(z.x, z.y + r * 0.55); ctx.fill(); }
    if (keep === 'kelawar') { ctx.fillStyle = z.warna; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(z.x + s * r * 0.25, z.y - r * 0.8); ctx.lineTo(z.x + s * r * 0.5, z.y - r * 1.35); ctx.lineTo(z.x + s * r * 0.7, z.y - r * 0.6); ctx.fill(); } }
    ctx.restore();
  }
  function drawZombie0(z) {
    if (z.under > 0) { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(z.x, z.y + z.r * .5, z.r * 1.1, z.r * .35, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#7A5A3A'; ctx.beginPath(); ctx.ellipse(z.x, z.y + z.r * .3, z.r * .9, z.r * .45 + Math.sin(ANIM * 14) * 2, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#5A4028'; for (let i = 0; i < 4; i++) circ(ctx, z.x - z.r * .6 + i * z.r * .4, z.y + z.r * .1 - (i % 2) * 5, 3); ctx.restore(); if (!LOWFX && Math.random() < 0.5) emit(z.x + (Math.random() - .5) * z.r, z.y + z.r * .2, 1, { a: -Math.PI / 2, spread: 1.2, spd: 70, warna: ['#7A5A3A', '#A08060'], size: 3, life: 0.5, grav: 300, shape: 'sq' }); return; }
    if (z.type === 'boss' && z._ph && !CALM()) { ctx.save(); ctx.globalAlpha = 0.35 + 0.2 * Math.sin(ANIM * 9); ctx.fillStyle = '#FF3A3A'; circ(ctx, z.x, z.y, z.r * 1.35); ctx.restore(); }
    const age = CUR_CLOCK - (z.born == null ? -9 : z.born);
    if (age >= 0 && age < 0.45 && z.y > 30 && !LOWFX) { const k = age / 0.45; if (!z._dirt) { z._dirt = 1; sfx('zDirt', null, z.x); emit(z.x, z.y + z.r, 10, { a: -Math.PI / 2, spread: 1.6, spd: 90, warna: ['#8A6A4A', '#C8A878'], size: 3, life: 0.5, grav: 300, shape: 'sq' }); } ctx.save(); ctx.beginPath(); ctx.rect(z.x - z.r * 3, z.y - z.r * 6, z.r * 6, z.r * 7); ctx.clip(); ctx.translate(0, (1 - k) * z.r * 2.4); drawZombieInner(z); ctx.restore(); return; }
    drawZombieInner(z);
  }
  function drawZombieInner(z) {
    if (z.type !== 'boss') { ctx.save(); ctx.translate(z.x, z.y); ctx.scale(1.1, 1.1); ctx.translate(-z.x, -z.y); drawZombieInner0(z); ctx.restore(); return; }
    drawZombieInner0(z);
  }
  function drawZombieInner0(z) {
    const zw = z.warna; z.warna = zCol(z);
    if (z.type === 'hantu' || z.traits.includes('hantu')) { ctx.save(); ctx.globalAlpha = 0.62 + 0.15 * Math.sin(z.wob); drawZombieBody(z); ctx.restore(); } else drawZombieBody(z);
    z.warna = zw;
  }
  function drawZombieCore(z, noSway) {
    const atk = Math.max(0, z.atkAnim || 0) / 0.3, r = z.r, walk = z.wob;
    const x = z.x + (noSway ? 0 : Math.sin(walk * 0.5) * 2), y = z.y + Math.abs(Math.sin(walk)) * -2 + atk * 5 - (z.hitT > 0 ? 3 * z.hitT / 0.12 : 0);
    const frozen = z.slowT > 0, tint = frozen ? 0.6 : 0;
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(z.x, z.y + r * .95, r * .9, r * .3, 0, 0, TAU); ctx.fill();
    // kaki melangkah
    ctx.strokeStyle = '#4A5A3A'; ctx.lineWidth = r * .28; ctx.lineCap = 'round';
    const ls = Math.sin(walk) * r * .25;
    ctx.beginPath(); ctx.moveTo(x - r * .35, y + r * .6); ctx.lineTo(x - r * .4 + ls, y + r * 1.0); ctx.moveTo(x + r * .35, y + r * .6); ctx.lineTo(x + r * .4 - ls, y + r * 1.0); ctx.stroke();
    // tangan menghulur, naik bila menyerang
    ctx.strokeStyle = z.warna; ctx.lineWidth = r * .3;
    const armY = atk > 0 ? -r * .4 * atk : Math.sin(walk) * 2;
    ctx.beginPath(); ctx.moveTo(x - r * .6, y + r * .1); ctx.lineTo(x - r * .7, y + r * .95 + armY); ctx.moveTo(x + r * .6, y + r * .1); ctx.lineTo(x + r * .7, y + r * .95 - armY); ctx.stroke();
    ctx.fillStyle = z.warna; circ(ctx, x - r * .7, y + r * .95 + armY, r * .2); circ(ctx, x + r * .7, y + r * .95 - armY, r * .2);
    // badan/kepala
    const sq = 1 + Math.sin(walk * 2) * 0.04 + (z.hitT > 0 ? 0.08 : 0);
    ctx.save(); ctx.translate(x, y); ctx.scale(sq, 2 - sq);
    ctx.fillStyle = z.warna; circ(ctx, 0, 0, r); ctx.strokeStyle = 'rgba(20,24,34,.45)'; ctx.lineWidth = Math.max(1.2, r * 0.07); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.12)'; circ(ctx, r * .35, -r * .4, r * .25); circ(ctx, -r * .45, r * .3, r * .15);
    // mata (satu besar, satu kecil, bergoyang)
    const look = Math.sin(walk * 0.7) * r * .05;
    ctx.fillStyle = '#FFFFFF'; circ(ctx, -r * .35, -r * .1, r * .3); circ(ctx, r * .35, -r * .05, r * .2);
    ctx.fillStyle = z.evo >= 3 ? '#E5302A' : '#2B2B33'; circ(ctx, -r * .3 + look, -r * .05, r * .12); circ(ctx, r * .37 + look, 0, r * .09);
    // mulut (terbuka bila menyerang)
    if (atk > 0) { ctx.fillStyle = '#3A2A2A'; ctx.beginPath(); ctx.ellipse(0, r * .45, r * .25, r * .18 * (0.5 + atk), 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-r * .12, r * .3, r * .08, r * .1); ctx.fillRect(r * .04, r * .3, r * .08, r * .1); }
    else { ctx.strokeStyle = '#3A3F2E'; ctx.lineWidth = Math.max(1.5, r * .08); ctx.beginPath(); for (let i = 0; i <= 4; i++) { const px = -r * .3 + i * r * .15, py = r * .42 + (i % 2 ? -r * .08 : 0); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    if (tint) { ctx.fillStyle = 'rgba(150,220,255,.35)'; circ(ctx, 0, 0, r); }
    if (z.hitT > 0) { ctx.fillStyle = 'rgba(255,255,255,' + (z.hitT / 0.12 * 0.7) + ')'; circ(ctx, 0, 0, r); }
    ctx.restore();
    if (!LITE || BAKING) drawGear(z, x, y, r);
    if (z.type === 'topi') { ctx.fillStyle = '#F2C230'; ctx.beginPath(); ctx.arc(x, y - r * .45, r * .85, Math.PI, 0); ctx.fill(); ctx.fillRect(x - r, y - r * .5, r * 2, r * .18); }
    return { x, y, r, frozen };
  }
  function drawZombieOverlay(z, x, y, r, frozen) {
    if (z.bossKind) drawBossKind(z, x, y, r);
    if (z.type === 'boss' && !z.bossKind) {
      const cy = y - r * .8 + (z.rage ? Math.sin(ANIM * 20) * 1.5 : 0);
      ctx.fillStyle = '#F5B82E'; ctx.beginPath(); ctx.moveTo(x - r * .5, cy); ctx.lineTo(x - r * .5, cy - r * .45); ctx.lineTo(x - r * .25, cy - r * .2); ctx.lineTo(x, cy - r * .55); ctx.lineTo(x + r * .25, cy - r * .2); ctx.lineTo(x + r * .5, cy - r * .45); ctx.lineTo(x + r * .5, cy); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#E5484D'; circ(ctx, x, cy - r * .15, r * .07);
      if (z.rage) { ctx.strokeStyle = 'rgba(255,80,80,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r + 6 + Math.sin(ANIM * 12) * 3, 0, TAU); ctx.stroke(); }
    }
    if (z.evo > 0) {
      ctx.strokeStyle = EVO_COLORS[Math.min(4, z.evo)]; ctx.globalAlpha = 0.5 + 0.3 * Math.sin(ANIM * 5 + z.id); ctx.lineWidth = 2 + z.evo;
      ctx.setLineDash([6, 5]); ctx.lineDashOffset = -ANIM * 20; ctx.beginPath(); ctx.arc(x, y, r + 5, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = EVO_COLORS[Math.min(4, z.evo)]; rr(ctx, x - r - 4, y - r - 4, 18, 13, 6); ctx.fill(); ctx.fillStyle = '#1C2333'; ctx.font = '800 10px "Nunito", system-ui'; ctx.textAlign = 'center'; ctx.fillText(EVO_NAMES[Math.min(4, z.evo)], x - r + 5, y - r + 6);
    }
    if (z.traits.includes('perisai')) { ctx.fillStyle = 'rgba(150,160,175,.9)'; rr(ctx, x - r * .55, y + r * .05, r * 1.1, r * .55, 4); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(x - r * .45, y + r * .12, r * .9, r * .08); }
    if (z.traits.includes('pecut')) { ctx.strokeStyle = 'rgba(242,194,48,.7)'; ctx.lineWidth = 2; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(x + i * r * .4, y - r - 4 - ((ANIM * 60) % 10)); ctx.lineTo(x + i * r * .4, y - r - 14 - ((ANIM * 60) % 10)); ctx.stroke(); } }
    if (z.traits.includes('pemulih') && Math.random() < 0.05) emit(x + (Math.random() - .5) * r, y, 1, { a: -Math.PI / 2, spread: 0.3, spd: 30, warna: '#4FD07A', size: 3, life: 0.8, shape: 'plus', drag: 0.5 });
    if (!LITE) z.traits.forEach((tr, i) => { const im = traitBadge(tr); if (im) ctx.drawImage(im, x + r - 2 - i * 13 - 7, y - r - 2 - 7, 14, 14); else traitIcon(ctx, tr, x + r - 2 - i * 13, y - r - 2, 6.5); });
    // kesan status
    if (z.burnT > 0) {
      if (POISON.includes(z.burnW)) { ctx.fillStyle = 'rgba(140,220,90,.35)'; circ(ctx, x, y, r * 1.05); if (Math.random() < 0.15) emit(x + (Math.random() - .5) * r, y - r * .5, 1, { a: -Math.PI / 2, spread: 0.5, spd: 25, warna: '#B2F06A', size: 2.5, life: 0.7, drag: 0.5 }); }
      else for (let i = 0; i < 3; i++) { const fx = x + (i - 1) * r * .45, fh = r * (.45 + .2 * Math.sin(ANIM * 18 + i * 2)); ctx.fillStyle = i % 2 ? 'rgba(255,200,60,.85)' : 'rgba(255,100,30,.85)'; ctx.beginPath(); ctx.moveTo(fx - r * .18, y - r * .55); ctx.quadraticCurveTo(fx, y - r * .55 - fh * 2, fx + r * .18, y - r * .55); ctx.fill(); }
    }
    if (frozen) { ctx.fillStyle = 'rgba(220,245,255,.9)'; for (let i = 0; i < 3; i++) star(ctx, x + (i - 1) * r * .6, y + r * .85, 4, 4, 1.5, i); }
    if (z.hp < z.maxHp) { const w = r * 2, by = z.y - r - (z.type === 'boss' ? 30 : 12); ctx.fillStyle = 'rgba(0,0,0,.35)'; rr(ctx, x - w / 2, by, w, 5, 2.5); ctx.fill(); ctx.fillStyle = '#E5484D'; rr(ctx, x - w / 2, by, w * Math.max(0, z.hp / z.maxHp), 5, 2.5); ctx.fill(); }
  }

  // ================= v8.2: KESAN DI TANAH (lopak lendir, bekas hangus, jejak boss, percikan hujan) =================
  function addDecal(b, d) { if (LOWFX) return; const L = b._decals || (b._decals = []); L.push(Object.assign({ t: 0, life: 7, s: Math.random() }, d)); if (L.length > 40) L.shift(); }
  function drawDecals(b) {
    const L = b._decals;
    if (L && L.length) { for (const d of L) { d.t += 1 / 60; const a = Math.max(0, Math.min(1, (d.life - d.t) / 2)); if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a;
      if (d.kind === 'goo') { const r = d.r, k = Math.min(1, d.t / 0.25); ctx.fillStyle = 'rgba(110,190,80,.55)'; ctx.beginPath(); ctx.ellipse(d.x, d.y, r * 1.1 * k, r * 0.42 * k, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(140,215,95,.6)'; for (let i = 0; i < 3; i++) { const an = d.s * 6 + i * 2.1; circ(ctx, d.x + Math.cos(an) * r * 1.35 * k, d.y + Math.sin(an) * r * 0.5 * k, r * 0.16 * k); }
        ctx.fillStyle = 'rgba(220,255,200,.45)'; ctx.beginPath(); ctx.ellipse(d.x - r * 0.3, d.y - r * 0.1, r * 0.3 * k, r * 0.1 * k, 0, 0, TAU); ctx.fill(); }
      else if (d.kind === 'scorch') { const g = ctx.createRadialGradient(d.x, d.y, 2, d.x, d.y, d.r); g.addColorStop(0, 'rgba(30,22,18,.55)'); g.addColorStop(1, 'rgba(30,22,18,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r, d.r * 0.55, 0, 0, TAU); ctx.fill(); }
      else if (d.kind === 'print') { ctx.fillStyle = 'rgba(40,32,26,.35)'; ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r, d.r * 1.5, 0, 0, TAU); ctx.fill(); for (let i = -1; i <= 1; i++) circ(ctx, d.x + i * d.r * 0.7, d.y - d.r * 1.7, d.r * 0.35); }
      ctx.restore(); }
      b._decals = L.filter(d => d.t < d.life); }
    // percikan hujan (gelang kecil)
    if (b._rain && !LOWFX) { const S = b._spl || (b._spl = []); if (Math.random() < 0.6 && S.length < 8) S.push({ x: Math.random() * W, y: 40 + Math.random() * (WALL_Y - 60), t: 0 });
      ctx.strokeStyle = 'rgba(210,230,255,.5)'; ctx.lineWidth = 1; for (const s of S) { s.t += 1 / 60; const k = s.t / 0.35; ctx.globalAlpha = Math.max(0, 1 - k); ctx.beginPath(); ctx.ellipse(s.x, s.y, 2 + k * 9, (2 + k * 9) * 0.4, 0, 0, TAU); ctx.stroke(); } ctx.globalAlpha = 1; b._spl = S.filter(s => s.t < 0.35); }
  }
  // kelongsong peluru & asap muncung
  let lastCasing = 0;
  function isGun(w) { const d = WEAPONS[w] || {}; return !ICE.includes(w) && !ZAPS[w] && !POISON.includes(w) && w !== 'api' && w !== 'napalm' && w !== 'plasma' && !d.splash && !(d.pierce >= 99); }
  function shotFx(m, w) { if (LOWFX || ANIM - lastCasing < 0.07) return; lastCasing = ANIM; const a0 = m.aim == null ? -Math.PI / 2 : m.aim, n = (battle && battle.team) ? battle.team.length : 1, mz = heroMuzzle(m, n, w, a0), pv = heroPivot(m, n);
    if (isGun(w)) emit(pv.x + Math.cos(a0) * 8, pv.y + Math.sin(a0) * 8, 1, { a: a0 - Math.PI / 2 - 0.4, spread: 0.4, spd: 95, warna: ['#E8B94A', '#C89A30'], size: 2.2, life: 0.55, grav: 560, shape: 'sq' });
    emit(mz.x, mz.y, 1, { a: a0, spread: 0.5, spd: 14, warna: ['#C8C8CC', '#E0E0E4'], size: 4, life: 0.45, grav: -25, shape: 'smoke' }); }
  // langkah boss gergasi: gegaran + debu + jejak
  function bossSteps(b) { for (const z of b.zombies) { if (z.type !== 'boss' || z.r < 26 || z.hp <= 0 || z.slowT > 0) continue; const ph = Math.floor(z.wob / Math.PI);
      if (z._stp == null) { z._stp = ph; continue; } if (ph === z._stp) continue; z._stp = ph; const sd = ph % 2 ? 1 : -1;
      if (!CALM()) b.fx.push({ kind: 'shake', t: 0, mag: Math.min(3.5, z.r / 15) });
      if (!LOWFX) emit(z.x + sd * z.r * 0.4, z.y + z.r * 0.95, 4, { a: -Math.PI / 2, spread: 1.6, spd: 35, warna: ['#A89A88', '#C8BCA8'], size: 5, life: 0.7, grav: -10, shape: 'smoke' });
      addDecal(b, { kind: 'print', x: z.x + sd * z.r * 0.35, y: z.y + z.r * 0.95, r: Math.max(3, z.r * 0.14), life: 5 }); sfx('step', null, z.x); } }

  // ---------- v7.6: animasi zombie mati & kemunculan boss ----------
  function deathStyle(z) { const w = z.lastWid || ''; return ICE.includes(w) || z.freezeT > 0 ? 'ais' : ZAPS[w] ? 'elektrik' : POISON.includes(w) ? 'racun' : (w === 'api' || w === 'napalm' || z.burnT > 0) ? 'api' : 'biasa'; }
  function drawDeath(f) {
    const z = f.z, k = Math.min(1, f.t / f.life), zz = Object.assign({}, z, { atkAnim: 0, slowT: 0, hitT: 0 }); zz.warna = zCol(z);
    let s; try { s = bakeZombie(zz); } catch (e) { return; }
    const st = f.st || (f.st = LOWFX ? 'biasa' : deathStyle(z)), sx = s.fw * BAKE, sy = s.fh * BAKE;
    if (st !== 'biasa') {
      if (!f._em) { f._em = 1;
        if (st === 'ais') { emit(z.x, z.y, 16, { spd: 150, warna: ['#BFF0FF', '#FFFFFF', '#7FD0F0'], size: 4, life: 0.7, grav: 300, shape: 'shard' }); sfx('shatter', null, z.x); }
        else if (st === 'api') { emit(z.x, z.y, 10, { a: -Math.PI / 2, spread: 0.9, spd: 40, warna: ['#4A4440', '#6E6660', '#2E2A28'], size: 5, life: 0.9, grav: -40, shape: 'smoke' }); emit(z.x, z.y, 9, { a: -Math.PI / 2, spread: 1.3, spd: 55, warna: ['#FF8A3A', '#FFC24A', '#FF5A2A'], size: 2, life: 1.1, grav: -70 }); }
        else if (st === 'elektrik') emit(z.x, z.y, 12, { spd: 170, warna: ['#FFF27A', '#8FE8FF', '#FFFFFF'], size: 2, life: 0.3, grav: 0, shape: 'sq' });
        else emit(z.x, z.y + z.r * 0.6, 8, { a: -Math.PI / 2, spread: 0.6, spd: 30, warna: ['#9BE05A', '#6AB040'], size: 3, life: 0.6, grav: -30 }); }
      ctx.save();
      if (st === 'ais') { if (k < 0.18) { ctx.globalAlpha = 1 - k / 0.18; ctx.drawImage(s.cv, 0, 0, sx, sy, z.x - s.ax, z.y - s.ay, s.fw, s.fh); ctx.fillStyle = 'rgba(190,240,255,.6)'; circ(ctx, z.x, z.y, z.r * 1.05); } }
      else if (st === 'api') { ctx.globalAlpha = Math.max(0, 1 - k); ctx.translate(z.x, z.y + z.r); ctx.scale(1 - k * 0.3, 1 - k * 0.6); ctx.drawImage(s.cv, 0, 0, sx, sy, -s.ax, -s.ay - z.r, s.fw, s.fh); ctx.fillStyle = 'rgba(40,30,25,' + Math.min(0.85, 0.3 + k) + ')'; circ(ctx, 0, -z.r, z.r * 1.02); }
      else if (st === 'racun') { ctx.globalAlpha = Math.max(0, 1 - k * 0.8); ctx.translate(z.x, z.y + z.r); ctx.scale(1 + k * 0.4, Math.max(0.12, 1 - k)); ctx.drawImage(s.cv, 0, 0, sx, sy, -s.ax, -s.ay - z.r, s.fw, s.fh); ctx.fillStyle = 'rgba(120,200,70,.45)'; circ(ctx, 0, -z.r, z.r); }
      else { if (Math.floor(f.t * 30) % 2 === 0 && k < 0.5) { ctx.globalAlpha = 1 - k * 2; ctx.drawImage(s.cv, 0, 0, sx, sy, z.x - s.ax, z.y - s.ay, s.fw, s.fh); } else if (k < 0.5) { ctx.fillStyle = 'rgba(220,245,255,' + (0.8 - k) + ')'; circ(ctx, z.x, z.y, z.r); } }
      ctx.restore();
      if (st === 'racun') { ctx.save(); ctx.globalAlpha = 0.5 * (1 - k); ctx.fillStyle = '#7CC040'; ctx.beginPath(); ctx.ellipse(z.x, z.y + z.r * 0.95, z.r * (1 + k), z.r * 0.35, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      return;
    }
    const dir = z.id % 2 ? 1 : -1;
    ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k * 1.1); ctx.translate(z.x, z.y + z.r * 0.9); ctx.rotate(dir * k * 1.35); ctx.scale(1 - k * 0.15, 1 - k * 0.35);
    ctx.drawImage(s.cv, 0, 0, s.fw * BAKE, s.fh * BAKE, -s.ax, -s.ay - z.r * 0.9, s.fw, s.fh); ctx.restore();
    if (k > 0.25 && !LOWFX) { const g = (k - 0.25) / 0.75; ctx.save(); ctx.globalAlpha = 0.75 * (1 - g); ctx.fillStyle = '#F4F7FA'; const gx = z.x + Math.sin(g * 9) * 4, gy = z.y - g * 46; ctx.beginPath(); ctx.arc(gx, gy, 7, Math.PI, 0); ctx.lineTo(gx + 7, gy + 8); ctx.lineTo(gx + 3.5, gy + 6); ctx.lineTo(gx, gy + 8); ctx.lineTo(gx - 3.5, gy + 6); ctx.lineTo(gx - 7, gy + 8); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2B2B33'; circ(ctx, gx - 2.5, gy - 1, 1.3); circ(ctx, gx + 2.5, gy - 1, 1.3); ctx.restore(); }
  }
  function drawBossProj(b) {
    const P = b.bproj || []; if (!P.length) return; const c = ctx;
    for (const p of P) { if (p.dead) continue; const k = Math.min(1, p.t / p.dur);
      c.save(); c.globalAlpha = 0.35 + 0.4 * k; c.strokeStyle = p.hero ? '#E8E8F0' : '#FF3A3A'; c.lineWidth = 2; c.setLineDash([4, 3]); c.lineDashOffset = -ANIM * 20; c.beginPath(); c.ellipse(p.tx, p.ty, 14 + 8 * (1 - k), 5 + 3 * (1 - k), 0, 0, TAU); c.stroke(); c.setLineDash([]); c.restore();
      const a = Math.atan2(p.ty - p.sy - Math.cos(k * Math.PI) * p.arc * Math.PI / p.dur * 0.3, p.tx - p.sx);
      c.save(); c.translate(p.x, p.y);
      if (p.kind === 'batu') { c.rotate(p.t * 8); c.fillStyle = '#8A8A90'; circ(c, 0, 0, p.r); c.fillStyle = '#6A6A70'; circ(c, -p.r * .3, -p.r * .2, p.r * .35); c.fillStyle = '#A8A8B0'; circ(c, p.r * .35, p.r * .25, p.r * .25); }
      else if (p.kind === 'bom') { c.fillStyle = '#2B2B33'; circ(c, 0, 0, p.r); c.fillStyle = Math.sin(ANIM * 20) > 0 ? '#FF5A3A' : '#FFE07A'; circ(c, p.r * .5, -p.r * .8, 3); c.fillStyle = 'rgba(255,255,255,.35)'; circ(c, -p.r * .35, -p.r * .35, p.r * .3); }
      else if (p.kind === 'panah') { c.rotate(a); c.fillStyle = '#B98A4A'; c.fillRect(-12, -1, 14, 2); c.fillStyle = '#8A8A8A'; c.beginPath(); c.moveTo(2, -3); c.lineTo(7, 0); c.lineTo(2, 3); c.fill(); c.fillStyle = '#E8E0D0'; c.fillRect(-13, -3, 3, 6); }
      else if (p.kind === 'apiS') { glow(c, '#FF6A2B', 14); c.fillStyle = '#FF6A2B'; circ(c, 0, 0, p.r); c.fillStyle = '#FFE07A'; circ(c, 0, 0, p.r * .55); if (!LOWFX && Math.random() < 0.6) emit(p.x, p.y, 1, { spd: 20, warna: ['#FFB04A', '#FF6A2B'], size: 3, life: 0.4 }); }
      else if (p.kind === 'jaring') { c.rotate(p.t * 4); c.strokeStyle = '#F4F7FA'; c.lineWidth = 1.5; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(i * Math.PI / 3) * p.r * 1.3, Math.sin(i * Math.PI / 3) * p.r * 1.3); c.stroke(); } c.beginPath(); c.arc(0, 0, p.r * .6, 0, TAU); c.stroke(); c.beginPath(); c.arc(0, 0, p.r * 1.1, 0, TAU); c.stroke(); }
      c.restore(); }
  }
  function drawBossOver(b) {
    const c = ctx;
    for (const m of b.team) if (m.webT > 0) { c.save(); c.globalAlpha = Math.min(1, m.webT * 2) * 0.9;
      if (m.iceT > 0) { c.fillStyle = 'rgba(170,230,255,.55)'; rr(c, m.x - 20, m.y - 44, 40, 52, 8); c.fill(); c.strokeStyle = '#FFFFFF'; c.lineWidth = 1.5; c.stroke(); }
      else { c.strokeStyle = '#F4F7FA'; c.lineWidth = 1.4; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(m.x, m.y - 18); c.lineTo(m.x + Math.cos(i * Math.PI / 4) * 26, m.y - 18 + Math.sin(i * Math.PI / 4) * 26); c.stroke(); } for (const rr0 of [9, 17, 25]) { c.beginPath(); c.arc(m.x, m.y - 18, rr0, 0, TAU); c.stroke(); } }
      c.restore(); label(c, (m.iceT > 0 ? '❄ ' : '🕸 ') + Math.ceil(m.webT), m.x, m.y - 50, 10, '#FFFFFF'); }
    for (const t of b.towers || []) if (t.frozenT > 0) { c.save(); c.globalAlpha = Math.min(1, t.frozenT * 2) * 0.8; c.fillStyle = 'rgba(170,230,255,.6)'; rr(c, t.x - 20, t.y - 30, 40, 52, 8); c.fill(); c.strokeStyle = '#FFFFFF'; c.lineWidth = 1.5; c.stroke(); c.restore(); }
  }
  function drawBossIntro(b) {
    for (const f of b.fx) { if (f.kind !== 'bossIntro') continue; const k = f.t / f.life, a = k < 0.15 ? k / 0.15 : k > 0.8 ? (1 - k) / 0.2 : 1, sc = k < 0.15 ? 1.5 - 0.5 * (k / 0.15) : 1;
      ctx.save(); ctx.globalAlpha = Math.max(0, a); const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(90,20,40,0)'); g.addColorStop(0.2, 'rgba(120,30,50,.88)'); g.addColorStop(0.8, 'rgba(120,30,50,.88)'); g.addColorStop(1, 'rgba(90,20,40,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 146, W, f.sub ? (f.tr ? 98 : 84) : 54); ctx.save(); ctx.translate(W / 2, 176); ctx.scale(sc, sc); label(ctx, (f.big ? '👑 ' : '💀 ') + String(f.txt).toUpperCase() + '!', 0, 0, f.big ? 19 : 16, f.warna || '#FFE07A'); ctx.restore();
      if (f.sub) { label(ctx, (f.tier || '') + '  ' + (f.big ? 'BOSS BESAR' : 'BOSS'), W / 2, 198, 11, '#FFE07A'); let y0 = 214; if (f.tr) { label(ctx, f.tr, W / 2, y0, 10.5, '#FFB08A'); y0 += 14; } const sub = String(f.sub), cut = sub.length > 52 ? sub.lastIndexOf(' ', 52) : -1; label(ctx, cut > 0 ? sub.slice(0, cut) : sub, W / 2, y0, 10, '#F4F7FA'); if (cut > 0) label(ctx, sub.slice(cut + 1), W / 2, y0 + 12, 10, '#F4F7FA'); }
      ctx.restore(); }
  }
  // syiling terbang ke kaunter gold
  const coins = []; let coinBump = 0;
  function stepCoins(dt) {
    for (const c of coins) c.t += dt * 1.7;
    for (let i = coins.length - 1; i >= 0; i--) if (coins[i].t >= 1) { coins.splice(i, 1); if (ANIM - coinBump > 0.12) { coinBump = ANIM; const el = $('gold'); const ch = el && el.parentElement; if (ch && ch.classList) { ch.classList.remove('bump'); void ch.offsetWidth; ch.classList.add('bump'); } } }
  }
  function drawCoins() { for (const c of coins) { const k = c.t, e = k * k, x = c.x + (W * 0.6 - c.x) * e, y = c.y + (-30 - c.y) * e - Math.sin(k * Math.PI) * 60; coinAt(ctx, x, y, 5 - k * 2); } }

  // ---------- v7.6: sprite zombie dibakar (8 bingkai berjalan) ----------
  // Badan zombie dilukis SEKALI ke atlas sprite; setiap bingkai hanya menyalin imej (lebih pantas).
  // Untuk menggantikan dengan seni PNG kemudian: ZC_registerSprite('zombie:biasa', url, fw, fh, n, ax, ay)
  // (bingkai mendatar, saiz rujukan jejari 22 px).
  const SPR = new Map(), SPR_MAX = 260, BAKE = 2, ZF = 8, SPRITE_PNG = {}; let BAKING = false, CUR_CLOCK = 0;
  function registerSpriteSheet(key, url, fw, fh, n, ax, ay) { try { const img = new Image(); img.onload = () => { SPRITE_PNG[key] = { img, fw, fh, n, ax, ay }; }; img.src = url; } catch (e) {} }
  try { window.ZC_registerSprite = registerSpriteSheet; } catch (e) {}
  function zKey(z) { return z.type + '|' + z.warna + '|' + Math.round(z.r) + '|' + (z.evo >= 3 ? 1 : 0) + '|' + (z.gear || ''); }
  function bakeZombie(z) {
    const key = zKey(z); let s = SPR.get(key); if (s) { SPR.delete(key); SPR.set(key, s); return s; }
    const r = Math.round(z.r), fw = Math.ceil(r * 3.4) + 10, fh = Math.ceil(r * 3.8) + 10, ax = fw / 2, ay = Math.ceil(r * 2) + 6;
    const cv = document.createElement('canvas'); cv.width = fw * ZF * BAKE; cv.height = fh * BAKE; const c = cv.getContext('2d');
    const old = ctx, clone = Object.assign({}, z, { x: 0, y: 0, atkAnim: 0, slowT: 0, hitT: 0, rage: false }); ctx = c; BAKING = true;
    try { for (let k = 0; k < ZF; k++) { c.setTransform(BAKE, 0, 0, BAKE, (k * fw + ax) * BAKE, ay * BAKE); clone.wob = k * TAU / ZF; drawZombieCore(clone, true); } } finally { ctx = old; BAKING = false; }
    s = { cv, fw, fh, ax, ay }; SPR.set(key, s); if (SPR.size > SPR_MAX) SPR.delete(SPR.keys().next().value); return s;
  }
  function zFrame(walk) { return Math.floor(((walk % TAU) + TAU) % TAU / TAU * ZF) % ZF; }
  function drawZombieBody(z) {
    const atk = Math.max(0, z.atkAnim || 0) / 0.3, r = z.r, walk = z.wob, sway = Math.sin(walk * 0.5) * 2, knock = z.hitT > 0 ? 3 * z.hitT / 0.12 : 0;
    const canBake = !z.bossKind && z.type !== 'boss' && atk <= 0 && !(z.slowT > 0) && !(z.hitT > 0) && typeof document !== 'undefined';
    let p;
    const png = SPRITE_PNG['zombie:' + z.type];
    if (canBake && png) { const f = zFrame(walk) % png.n, k = r / 22; ctx.drawImage(png.img, f * png.fw, 0, png.fw, png.fh, z.x + sway - png.ax * k, z.y - png.ay * k, png.fw * k, png.fh * k); p = { x: z.x + sway, y: z.y + Math.abs(Math.sin(walk)) * -2, r, frozen: false }; }
    else if (canBake) { const s = bakeZombie(z); ctx.drawImage(s.cv, zFrame(walk) * s.fw * BAKE, 0, s.fw * BAKE, s.fh * BAKE, z.x + sway - s.ax, z.y - s.ay, s.fw, s.fh); p = { x: z.x + sway, y: z.y + Math.abs(Math.sin(walk)) * -2 - knock, r, frozen: false }; }
    else p = drawZombieCore(z, false);
    drawZombieOverlay(z, p.x, p.y, p.r, p.frozen);
  }


  function drawGear(z, x, y, r) {
    const t = z.type;
    if (t === 'kesatria') { ctx.fillStyle = '#8C96A4'; ctx.beginPath(); ctx.arc(x, y - r * .2, r * .95, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#2B2B33'; ctx.fillRect(x - r * .6, y - r * .2, r * 1.2, r * .14); ctx.fillStyle = '#C8302A'; ctx.beginPath(); ctx.moveTo(x, y - r * 1.15); ctx.quadraticCurveTo(x + r * .6, y - r * 1.5, x + r * .3, y - r * .9); ctx.fill(); }
    if (t === 'peludah') { ctx.fillStyle = '#7AC040'; ctx.beginPath(); ctx.ellipse(x, y + r * .5, r * .32, r * .22, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(160,230,80,.8)'; circ(ctx, x + r * .1, y + r * .85 + Math.sin(z.wob * 2) * 2, r * .1); }
    if (t === 'beku') { ctx.fillStyle = 'rgba(220,245,255,.9)'; [[-.6, -.7], [.1, -1.05], [.65, -.6]].forEach(([dx, dy], i) => { ctx.beginPath(); ctx.moveTo(x + dx * r - 3, y + dy * r + 6); ctx.lineTo(x + dx * r, y + dy * r - 4 - i); ctx.lineTo(x + dx * r + 3, y + dy * r + 6); ctx.fill(); }); }
    if (t === 'pengebom' || z.gear === 'bom') { ctx.fillStyle = '#5A4A2A'; ctx.fillRect(x - r * .7, y + r * .05, r * 1.4, r * .35); ctx.fillStyle = '#C8302A'; for (let i = -1; i <= 1; i++) { rr(ctx, x + i * r * .4 - r * .12, y - r * .02, r * .24, r * .48, 2); ctx.fill(); } ctx.fillStyle = Math.sin(ANIM * 20 + z.id) > 0 ? '#FFE07A' : '#FF6A2B'; circ(ctx, x + r * .45, y - r * .1, 2.5); }
    if (t === 'penyembuh') { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x, y - r * .55, r * .55, Math.PI, 0); ctx.fill(); ctx.fillRect(x - r * .55, y - r * .58, r * 1.1, r * .2); ctx.fillStyle = '#E5484D'; ctx.fillRect(x - r * .07, y - r * .95, r * .14, r * .36); ctx.fillRect(x - r * .18, y - r * .84, r * .36, r * .14); }
    if (t === 'melompat') { ctx.strokeStyle = '#8A8A8A'; ctx.lineWidth = 2; for (const s of [-1, 1]) { ctx.beginPath(); for (let i = 0; i <= 6; i++) ctx.lineTo(x + s * r * .4 + (i % 2 ? 3 : -3), y + r * .7 + i * r * .08); ctx.stroke(); } }
    if (t === 'gergasi') { ctx.strokeStyle = 'rgba(80,30,30,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - r * .5, y - r * .5); ctx.lineTo(x - r * .1, y - r * .2); ctx.moveTo(x - r * .45, y - r * .25); ctx.lineTo(x - r * .2, y - r * .45); ctx.stroke(); ctx.fillStyle = '#5A4030'; ctx.fillRect(x - r * .7, y + r * .45, r * 1.4, r * .2); }
    if (t === 'hantu') { ctx.fillStyle = zCol(z); for (let i = 0; i < 4; i++) circ(ctx, x - r * .6 + i * r * .4, y + r * .85 + Math.sin(ANIM * 6 + i) * 2, r * .22); }
    switch (z.gear) {
      case 'keledar': ctx.fillStyle = '#7A8090'; ctx.beginPath(); ctx.arc(x, y - r * .35, r * .9, Math.PI * 1.05, -0.05); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x - r * .5, y - r * 1.0, r * .3, r * .12); break;
      case 'besi': ctx.fillStyle = 'rgba(140,150,164,.95)'; rr(ctx, x - r * .65, y + r * .02, r * 1.3, r * .6, 4); ctx.fill(); ctx.fillStyle = '#E8ECF4'; for (let i = 0; i < 3; i++) circ(ctx, x - r * .4 + i * r * .4, y + r * .3, 1.5); break;
      case 'perisai': ctx.fillStyle = '#A8703E'; rr(ctx, x - r * 1.15, y - r * .2, r * .55, r * 1.1, 3); ctx.fill(); ctx.fillStyle = '#6E4520'; ctx.fillRect(x - r * 1.15, y + r * .25, r * .55, r * .12); ctx.fillStyle = '#C8CED8'; circ(ctx, x - r * .87, y + r * .05, 2); break;
      case 'tong': ctx.fillStyle = '#8A5A30'; rr(ctx, x - r * .8, y - r * .05, r * 1.6, r * .95, 5); ctx.fill(); ctx.fillStyle = '#5A3A20'; ctx.fillRect(x - r * .8, y + r * .15, r * 1.6, r * .12); ctx.fillRect(x - r * .8, y + r * .6, r * 1.6, r * .12); break;
      case 'mahkota': ctx.fillStyle = '#F5B82E'; ctx.beginPath(); ctx.moveTo(x - r * .4, y - r * .85); ctx.lineTo(x - r * .4, y - r * 1.2); ctx.lineTo(x - r * .2, y - r * 1.0); ctx.lineTo(x, y - r * 1.28); ctx.lineTo(x + r * .2, y - r * 1.0); ctx.lineTo(x + r * .4, y - r * 1.2); ctx.lineTo(x + r * .4, y - r * .85); ctx.closePath(); ctx.fill(); break;
    }
  }
  // ikon sifat (vektor, tidak bergantung pada fon)
  function traitIcon(c, t, x, y, r) {
    c.fillStyle = TRAITS[t].warna; circ(c, x, y, r); const k = r / 6.5, d = '#1C2333'; c.fillStyle = d; c.strokeStyle = d; c.lineWidth = 1.4 * k; c.lineCap = 'round';
    switch (t) {
      case 'perisai': c.beginPath(); c.moveTo(x, y - 4 * k); c.lineTo(x + 3.5 * k, y - 2.5 * k); c.quadraticCurveTo(x + 3.5 * k, y + 2.5 * k, x, y + 4.5 * k); c.quadraticCurveTo(x - 3.5 * k, y + 2.5 * k, x - 3.5 * k, y - 2.5 * k); c.closePath(); c.fill(); break;
      case 'pemulih': case 'penyembuh': c.fillRect(x - 1 * k, y - 4 * k, 2 * k, 8 * k); c.fillRect(x - 4 * k, y - 1 * k, 8 * k, 2 * k); break;
      case 'pecut': c.beginPath(); c.moveTo(x - 4 * k, y - 3 * k); c.lineTo(x - 1 * k, y); c.lineTo(x - 4 * k, y + 3 * k); c.moveTo(x, y - 3 * k); c.lineTo(x + 3 * k, y); c.lineTo(x, y + 3 * k); c.stroke(); break;
      case 'kebal_ais': case 'pembeku': for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; c.beginPath(); c.moveTo(x - Math.cos(a) * 4 * k, y - Math.sin(a) * 4 * k); c.lineTo(x + Math.cos(a) * 4 * k, y + Math.sin(a) * 4 * k); c.stroke(); } break;
      case 'kebal_api': c.beginPath(); c.moveTo(x - 3 * k, y + 3.5 * k); c.quadraticCurveTo(x - 4 * k, y - 1 * k, x, y - 4.5 * k); c.quadraticCurveTo(x + 4 * k, y - 1 * k, x + 3 * k, y + 3.5 * k); c.closePath(); c.fill(); break;
      case 'pembelah': c.beginPath(); c.moveTo(x, y + 4 * k); c.lineTo(x, y); c.lineTo(x - 3.5 * k, y - 3.5 * k); c.moveTo(x, y); c.lineTo(x + 3.5 * k, y - 3.5 * k); c.stroke(); break;
      case 'penembak': c.beginPath(); c.moveTo(x - 4 * k, y + 4 * k); c.lineTo(x + 3 * k, y - 3 * k); c.stroke(); c.beginPath(); c.moveTo(x + 4 * k, y - 4 * k); c.lineTo(x, y - 3.5 * k); c.lineTo(x + 3.5 * k, y); c.closePath(); c.fill(); break;
      case 'hantu': c.beginPath(); c.arc(x, y - 0.5 * k, 3.2 * k, Math.PI, 0); c.lineTo(x + 3.2 * k, y + 3.5 * k); c.lineTo(x + 1.6 * k, y + 2.5 * k); c.lineTo(x, y + 3.5 * k); c.lineTo(x - 1.6 * k, y + 2.5 * k); c.lineTo(x - 3.2 * k, y + 3.5 * k); c.closePath(); c.fill(); break;
      case 'pengebom': circ(c, x - 0.5 * k, y + 1 * k, 3.2 * k); c.beginPath(); c.moveTo(x + 1.5 * k, y - 1.5 * k); c.lineTo(x + 3.5 * k, y - 4 * k); c.stroke(); break;
      case 'melompat': c.beginPath(); c.moveTo(x, y + 4 * k); c.lineTo(x, y - 3 * k); c.stroke(); c.beginPath(); c.moveTo(x - 3.5 * k, y - 0.5 * k); c.lineTo(x, y - 4.5 * k); c.lineTo(x + 3.5 * k, y - 0.5 * k); c.closePath(); c.fill(); break;
    }
  }
  const BADGE = {};
  function traitBadge(t) {
    if (BADGE[t] !== undefined) return BADGE[t];
    try { const cv0 = document.createElement('canvas'); cv0.width = 28; cv0.height = 28; const c0 = cv0.getContext('2d'); c0.scale(2, 2); traitIcon(c0, t, 7, 7, 6.5); BADGE[t] = cv0; } catch (e) { BADGE[t] = null; }
    return BADGE[t];
  }
  const TRAIT_IMG = {};
  function traitImg(t) {
    if (TRAIT_IMG[t] !== undefined) return TRAIT_IMG[t];
    const cv0 = document.createElement('canvas'); paintIcon(cv0, c => traitIcon(c, t, 32, 32, 30), 20);
    TRAIT_IMG[t] = typeof cv0.toDataURL === 'function' ? cv0.toDataURL() : ''; return TRAIT_IMG[t];
  }
  function traitChip(t) { const src = traitImg(t); return '<span class="trc">' + (src ? '<img src="' + src + '" alt="">' : '') + esc(TRAITS[t].nama) + '</span>'; }
  // lukis spesies untuk ensiklopedia (siluet jika belum ditemui)
  function speciesIcon(c, id, seen) {
    const sp = SPECIES[id], zt = ZTYPES[sp.base];
    c.fillStyle = seen ? '#EAF5EF' : '#2B3340'; rr(c, 2, 2, 60, 60, 12); c.fill();
    const r = Math.min(20, zt.r * (sp.base === 'gergasi' ? 0.8 : 1.15));
    const z = { id: 1, type: sp.base, x: 32, y: 32, r, hp: 1, maxHp: 1, warna: zt.kulit, tint: ZELEM[sp.ei].tint, gear: ZGEAR[sp.gi].id, traits: sp.sifat.slice(), wob: 0.8, evo: 0, slowT: 0, burnT: 0, hitT: 0, atkAnim: 0 };
    if (seen) { const old = ctx; ctx = c; drawZombie(z); ctx = old; return; }
    const off = document.createElement('canvas'); off.width = 128; off.height = 128; const oc = off.getContext('2d'); oc.setTransform(2, 0, 0, 2, 0, 0);
    z.traits = []; const old = ctx; ctx = oc; drawZombie(z); ctx = old;
    oc.globalCompositeOperation = 'source-in'; oc.fillStyle = '#5A6478'; oc.fillRect(0, 0, 64, 64);
    c.drawImage(off, 0, 0, 64, 64); label(c, '?', 32, 38, 18, '#C8D0DC');
  }

  // ---------- peluru: setiap senjata ada rupa sendiri ----------
  function drawBullet(b, dt) {
    const wd = WEAPONS[b.wid], a = Math.atan2(b.vy, b.vx), age = b.age || 0, col = wd.peluru;
    ctx.save(); ctx.translate(b.x, b.y); ctx.scale(1.5, 1.5);
    const trail = (o) => { if (Math.random() < (o.rate || 0.6)) emit(b.x - Math.cos(a) * 6, b.y - Math.sin(a) * 6, 1, o); };
    if (BUL_HD[b.wid]) { BUL_HD[b.wid](b, a, age, trail); ctx.restore(); return; }
    switch (b.wid) {
      case 'laser': case 'railgun': {
        const len = b.wid === 'railgun' ? 70 : 46, th = b.wid === 'railgun' ? 7 : 4;
        ctx.rotate(a); glow(ctx, col, 16); ctx.fillStyle = col; ctx.globalAlpha = 0.6; ctx.fillRect(-len, -th, len, th * 2); ctx.globalAlpha = 1; ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-len, -th / 3, len, th / 1.5); noGlow(ctx); break;
      }
      case 'plasma': glow(ctx, col, 14); ctx.fillStyle = col; circ(ctx, 0, 0, 5 + Math.sin(age * 30)); ctx.fillStyle = '#FFFFFF'; circ(ctx, 0, 0, 2.5); noGlow(ctx); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, 8 + Math.sin(age * 20) * 2, 0, TAU); ctx.stroke(); trail({ spd: 10, warna: col, size: 2.5, life: 0.25, rate: 0.8 }); break;
      case 'shuriken': ctx.rotate(age * 25); ctx.fillStyle = '#D8DDE6'; star(ctx, 0, 0, 4, 7, 2.2, 0); ctx.fillStyle = '#5A6070'; circ(ctx, 0, 0, 1.5); break;
      case 'bumerang': ctx.rotate(age * 18); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-7, 5); ctx.lineTo(0, -3); ctx.lineTo(7, 5); ctx.stroke(); break;
      case 'gergaji': ctx.rotate(age * 30); ctx.fillStyle = '#B8C2CC'; star(ctx, 0, 0, 10, 8, 5.5, 0); ctx.fillStyle = '#5A6070'; circ(ctx, 0, 0, 2); trail({ spd: 60, warna: '#FFE07A', size: 1.5, life: 0.2, rate: 0.4 }); break;
      case 'silang': case 'api': ctx.rotate(a); ctx.fillStyle = '#B98A4A'; ctx.fillRect(-14, -1, 14, 2); ctx.fillStyle = '#8A8A8A'; ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(5, 0); ctx.lineTo(0, 3); ctx.fill(); ctx.fillStyle = '#E8E0D0'; ctx.fillRect(-15, -3, 3, 6);
        if (b.wid === 'api') { ctx.fillStyle = Math.sin(age * 40) > 0 ? '#FFE07A' : '#FF6A2B'; star(ctx, 2, 0, 5, 5, 2, age * 10); trail({ spd: 20, warna: ['#FFB04A', '#FF6A2B'], size: 3, life: 0.3, up: 30, rate: 0.9 }); } break;
      case 'roket': case 'peluru_p': ctx.rotate(a); ctx.fillStyle = b.wid === 'roket' ? '#6E7B3A' : '#C8CED8'; ctx.fillRect(-9, -3, 12, 6); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(3, -3); ctx.lineTo(9, 0); ctx.lineTo(3, 3); ctx.fill(); ctx.fillStyle = '#4A4A4A'; ctx.beginPath(); ctx.moveTo(-9, -3); ctx.lineTo(-12, -6); ctx.lineTo(-6, -3); ctx.moveTo(-9, 3); ctx.lineTo(-12, 6); ctx.lineTo(-6, 3); ctx.fill();
        ctx.fillStyle = Math.sin(age * 50) > 0 ? '#FFE07A' : '#FF6A2B'; circ(ctx, -11, 0, 3 + Math.random() * 2);
        trail({ spd: 15, warna: '#BDBDBD', size: 4, life: 0.6, shape: 'smoke', rate: 1, drag: 2 }); break;
      case 'meriam': case 'mortar': case 'bom': ctx.fillStyle = '#2E2E2E'; circ(ctx, 0, 0, b.wid === 'bom' ? 5 : 6.5); ctx.fillStyle = 'rgba(255,255,255,.35)'; circ(ctx, -2, -2, 2);
        if (b.wid === 'bom') { ctx.fillStyle = Math.sin(age * 40) > 0 ? '#FFE07A' : '#FF6A2B'; star(ctx, 3, -6, 4, 3, 1, age * 12); } else trail({ spd: 10, warna: '#9A9A9A', size: 3, life: 0.4, shape: 'smoke', rate: 0.5 }); break;
      case 'frost': case 'nitrogen': case 'ais_g': ctx.rotate(a + age * (b.wid === 'frost' ? 0 : 8)); glow(ctx, '#9FE6FF', 10); ctx.fillStyle = '#DFF6FF'; ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(0, -4); ctx.lineTo(-8, 0); ctx.lineTo(0, 4); ctx.fill(); noGlow(ctx);
        trail({ spd: 15, warna: ['#FFFFFF', '#9FE6FF'], size: 2, life: 0.35, shape: 'star', rate: 0.7 }); break;
      case 'napalm': glow(ctx, '#FF6A2B', 12); ctx.fillStyle = '#FF6A2B'; circ(ctx, 0, 0, 6); ctx.fillStyle = '#FFE07A'; circ(ctx, 0, 0, 3); noGlow(ctx); trail({ spd: 20, warna: ['#FFB04A', '#E5302A'], size: 4, life: 0.4, up: 20, rate: 1 }); break;
      case 'racun': case 'tongkat_r': ctx.fillStyle = col; circ(ctx, 0, 0, 5 + Math.sin(age * 25) * 1); ctx.fillStyle = 'rgba(255,255,255,.5)'; circ(ctx, -1.5, -1.5, 1.6); trail({ spd: 10, warna: ['#B2F06A', '#5DBB63'], size: 2.5, life: 0.5, rate: 0.6 }); break;
      case 'petir': case 'tesla': case 'tukul': { const c2 = ZAPS[b.wid]; glow(ctx, c2, 14); ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) { const aa = i * TAU / 6 + age * 20, rr2 = 4 + Math.random() * 4; i ? ctx.lineTo(Math.cos(aa) * rr2, Math.sin(aa) * rr2) : ctx.moveTo(Math.cos(aa) * rr2, Math.sin(aa) * rr2); } ctx.closePath(); ctx.stroke(); ctx.fillStyle = '#FFFFFF'; circ(ctx, 0, 0, 3); noGlow(ctx); break; }
      case 'doktor': ctx.rotate(a); ctx.fillStyle = 'rgba(200,240,255,.9)'; ctx.fillRect(-7, -1.5, 9, 3); ctx.fillStyle = '#7FF0C8'; ctx.fillRect(-6, -1, 6, 2); ctx.fillStyle = '#9AA0A8'; ctx.fillRect(2, -0.5, 5, 1); break;
      case 'lastik': ctx.fillStyle = '#8A7A6A'; circ(ctx, 0, 0, 3.5); ctx.fillStyle = 'rgba(255,255,255,.3)'; circ(ctx, -1, -1, 1.2); break;
      default: {
        ctx.rotate(a); const len = wd.pierce > 1 ? 14 : 9;
        ctx.globalAlpha = 0.45; ctx.fillStyle = col; ctx.fillRect(-len, -1.5, len, 3); ctx.globalAlpha = 1;
        ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, 4.5, 2.6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(1, 0, 2, 1.1, 0, 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
  }

  // ---------- kesan (fx) yang dilukis terus ----------
  function zapPath(x1, y1, x2, y2, seed, jag) {
    const pts = [[x1, y1]], n = 6, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    for (let i = 1; i < n; i++) { const k = i / n, off = (Math.sin(seed + i * 12.9898 + ANIM * 40) * 43758.5453 % 1) * jag; pts.push([x1 + dx * k + nx * off, y1 + dy * k + ny * off]); }
    pts.push([x2, y2]); return pts;
  }
  function drawFx(b) {
    let txtLeft = 24;
    for (let i = b.fx.length - 1; i >= 0; i--) { const f = b.fx[i]; if (f.kind === 'txt') { f._hide = txtLeft <= 0; txtLeft--; } }
    for (const f of b.fx) {
      const k = f.t / 0.9;
      if (f._hide) continue;
      if (f.kind === 'ult' || f.kind === 'ushot' || f.kind === 'uslash' || f.kind === 'ubeam') { drawUltFx(b, f); continue; }
      if (f.kind === 'loot') { drawLoot(f); continue; }
      if (f.kind === 'die') { drawDeath(f); if (f.st === 'elektrik' && f.t < 0.3 && Math.floor(f.t * 22) % 2 === 0 && !CALM()) { const z = f.z, r = z.r; ctx.save(); ctx.fillStyle = 'rgba(255,255,240,.95)'; circ(ctx, z.x, z.y - r * 0.25, r * 0.55); ctx.fillStyle = '#2B2B33'; circ(ctx, z.x - r * 0.2, z.y - r * 0.3, r * 0.13); circ(ctx, z.x + r * 0.2, z.y - r * 0.3, r * 0.13); ctx.fillRect(z.x - r * 0.15, z.y - r * 0.05, r * 0.3, r * 0.06); ctx.strokeStyle = 'rgba(255,255,240,.95)'; ctx.lineWidth = Math.max(1.5, r * 0.09); ctx.beginPath(); ctx.moveTo(z.x, z.y + r * 0.25); ctx.lineTo(z.x, z.y + r * 0.95); for (let k = 0; k < 3; k++) { const yy = z.y + r * (0.4 + k * 0.18); ctx.moveTo(z.x - r * 0.35, yy); ctx.lineTo(z.x + r * 0.35, yy); } ctx.stroke(); ctx.restore(); } continue; }
      if (f.kind === 'dn') { const k = f.t / f.life; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k * k); label(ctx, fmt(Math.max(1, Math.round(f.v))) + (f.crit ? '!' : ''), f.x, f.y - 8 - k * 30 - (f.crit ? Math.sin(Math.min(1, k * 4) * Math.PI) * 6 : 0), f.crit ? 15 : 11, f.crit ? '#FFD24A' : '#FFFFFF'); ctx.restore(); continue; }
      if (f.kind === 'skill') { const k = f.t / f.life, sk = SKILLS[f.h]; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k); ctx.strokeStyle = '#FFE07A'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y - 6, 16 + k * 16, 0, TAU); ctx.stroke(); if (sk) label(ctx, '✨ ' + sk.nama, f.x, f.y - 42 - k * 16, 11, '#FFE07A'); ctx.restore(); continue; }
      if (f.kind === 'heal') { const k = f.t / (f.life || 0.9); ctx.save(); ctx.globalAlpha = Math.max(0, 0.85 - k); ctx.strokeStyle = '#7CF0A8'; ctx.lineWidth = 3; ctx.setLineDash([5, 4]); ctx.lineDashOffset = -ANIM * 30; for (const [tx, ty] of f.tg || []) { ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(tx, ty); ctx.stroke(); label(ctx, '+', tx, ty - 14 - k * 12, 14, '#7CF0A8'); } ctx.setLineDash([]); ctx.restore(); continue; }
      if (f.kind === 'clank') continue;
      if (f.kind === 'bwarn') { const z = f.z, k = f.t / f.life; if (z.hp > 0) { ctx.save(); ctx.strokeStyle = 'rgba(229,72,77,' + (0.9 - k * 0.5) + ')'; ctx.lineWidth = 4; ctx.setLineDash([8, 6]); ctx.lineDashOffset = ANIM * 40; ctx.beginPath(); ctx.arc(z.x, z.y, z.r + 14 + Math.sin(ANIM * 20) * 3, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); label(ctx, '❗', z.x, z.y - z.r - 26 - Math.abs(Math.sin(ANIM * 12)) * 6, 26, '#FF5A5A'); } continue; }
      if (f.kind === 'bossIntro') continue;
      if (f.kind === 'repair') { const k = f.t / 0.8; if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = '#7CE08A'; ctx.font = '800 13px "Nunito", system-ui'; ctx.textAlign = 'center'; ctx.fillText('+ baiki', f.x, WALL_Y - 34 - k * 18); ctx.restore(); if (!f._e && !LOWFX) { f._e = 1; emit(f.x, WALL_Y - 10, 6, { spd: 60, warna: ['#9BFFB8', '#FFF6A8'], size: 2.4, life: 0.6, grav: -60, shape: 'plus' }); } } continue; }
      if (f.kind === 'gust') { const k = f.t / 0.35; if (k < 1 && !CALM()) { ctx.save(); ctx.globalAlpha = 0.7 * (1 - k); ctx.strokeStyle = '#EAF6FF'; ctx.lineWidth = 2; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(f.x + i * 9, f.y + 10 - k * 18, 8 + k * 10, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } ctx.restore(); } continue; }
      if (f.kind === 'tapHit' || f.kind === 'tapMiss' || f.kind === 'stomp' || f.kind === 'tapZap') { drawTapFx(f, f.t / (f.life || 0.9)); continue; }
      ctx.globalAlpha = Math.max(0, 1 - k);
      if (f.kind === 'txt') {
        const big = f.txt === 'KRITIKAL' || f.txt.indexOf('!') >= 0, pop = big ? 1 + Math.max(0, 0.4 - k) * 1.5 : 1;
        ctx.save(); ctx.translate(f.x, f.y - 30 * k); ctx.scale(pop, pop);
        ctx.font = '800 ' + Math.round((big ? 16 : 14) * TXT()) + 'px "Baloo 2", system-ui'; ctx.textAlign = 'center'; if (!LOWFX) { ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.strokeText(f.txt, 0, 0); } ctx.fillStyle = f.warna; ctx.fillText(f.txt, 0, 0); ctx.restore();
      } else if (f.kind === 'boom') {
        const ice = ICE.includes(f.wid), nap = f.wid === 'napalm' || f.wid === 'meteor' || f.wid === 'bom_g', el = f.wid === 'tukul', e = Math.min(1, k * 4);
        if (f.wid === 'lubang') { ctx.strokeStyle = '#C08CF0'; ctx.lineWidth = 5 * (1 - k); ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (0.3 + k), 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; continue; }
        if (k < 0.12 && !CALM()) { ctx.fillStyle = '#FFFFFF'; circ(ctx, f.x, f.y, f.r * 0.6); }
        ctx.fillStyle = ice ? 'rgba(170,230,255,.55)' : el ? 'rgba(255,240,120,.5)' : nap ? 'rgba(255,90,30,.55)' : 'rgba(255,150,60,.55)'; circ(ctx, f.x, f.y, f.r * e);
        ctx.fillStyle = ice ? 'rgba(255,255,255,.6)' : 'rgba(255,230,140,.7)'; circ(ctx, f.x, f.y, f.r * e * 0.5 * (1 - k));
        ctx.strokeStyle = ice ? '#DFF6FF' : '#FFE9B0'; ctx.lineWidth = 3 * (1 - k); ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (0.6 + k * 1.2), 0, TAU); ctx.stroke();
        if (nap && k < 0.8) { ctx.fillStyle = 'rgba(255,120,30,.5)'; for (let i = 0; i < 5; i++) { const fx = f.x + Math.cos(i * 1.3) * f.r * 0.6, fy = f.y + Math.sin(i * 1.3) * f.r * 0.4; ctx.beginPath(); ctx.moveTo(fx - 4, fy); ctx.quadraticCurveTo(fx, fy - 14 - Math.sin(ANIM * 20 + i) * 5, fx + 4, fy); ctx.fill(); } }
      } else if (f.kind === 'zap') {
        const col = ZAPS[f.wid] || '#FFF27A', pts = zapPath(f.x, f.y, f.x2, f.y2, f.seed || 1, 14);
        glow(ctx, col, 14); ctx.strokeStyle = col; ctx.lineWidth = 4 * (1 - k) + 1; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
        ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1.5; ctx.stroke(); noGlow(ctx);
        if (k < 0.3) { const mid = pts[3]; ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mid[0], mid[1]); ctx.lineTo(mid[0] + 10, mid[1] - 8); ctx.lineTo(mid[0] + 6, mid[1] - 16); ctx.stroke(); }
      } else if (f.kind === 'pop') { ctx.strokeStyle = '#E8F7C8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 + k), 0, TAU); ctx.stroke(); }
      else if (f.kind === 'evo') { glow(ctx, f.warna, 20); ctx.strokeStyle = f.warna; ctx.lineWidth = 5 * (1 - k) + 1; ctx.beginPath(); ctx.arc(f.x, f.y, f.r + 34 * k, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(f.x, f.y, f.r + 16 * k, 0, TAU); ctx.stroke(); noGlow(ctx); }
      else if (f.kind === 'spit') { const p = Math.min(1, k * 2), sx = f.x, sy = f.y + (WALL_Y - f.y) * p - Math.sin(p * Math.PI) * 40; ctx.fillStyle = '#8BE04A'; circ(ctx, sx, sy, 5); ctx.fillStyle = 'rgba(139,224,74,.4)'; circ(ctx, sx, sy - 6, 3); if (p >= 1 && k < 0.6) { ctx.fillStyle = 'rgba(139,224,74,.6)'; circ(ctx, sx, WALL_Y - 10, 10 * (1 - k)); } }
      else if (f.kind === 'wskill') { const pop = 1 + Math.max(0, 0.3 - k) * 2; ctx.save(); ctx.globalAlpha = Math.min(1, (1 - k) * 3); ctx.translate(W / 2, WALL_Y - 70 - k * 20); ctx.scale(pop, pop); label(ctx, '✋ ' + WALL_SKILL[f.mat].nama + '!', 0, 0, 22, WALLS[f.mat * 5].warna); ctx.restore(); }
      else if (f.kind === 'power') { const pop = 1 + Math.max(0, 0.3 - k) * 2; ctx.save(); ctx.translate(W / 2, 120 - k * 20); ctx.scale(pop, pop); label(ctx, POWERS[f.id].nama + '!', 0, 0, 26, '#FFE07A'); ctx.restore(); }
      else if (f.kind === 'strike') { if (k < 0.35) { const pts = zapPath(f.x + 20, -10, f.x, f.y, f.x * 7, 22); glow(ctx, '#FFF27A', 20); ctx.strokeStyle = '#FFF27A'; ctx.lineWidth = 6; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke(); noGlow(ctx); if (!CALM()) { ctx.fillStyle = 'rgba(255,255,220,.5)'; circ(ctx, f.x, f.y, 24 * (1 - k)); } } }
      else if (f.kind === 'cloud') { const k2 = f.t / f.life; ctx.globalAlpha = Math.min(1, (1 - k2) * 2) * 0.55; ctx.fillStyle = '#A040C0'; for (let i = 0; i < 9; i++) circ(ctx, (i * 47 + Math.sin(ANIM * 2 + i) * 10) % W, WALL_Y + 30 + Math.sin(ANIM * 3 + i * 2) * 12, 26 + (i % 3) * 8); ctx.globalAlpha = 1; }
      else if (f.kind === 'blaser') { for (const lx of f.xs || []) { ctx.save(); ctx.globalAlpha = 0.35 + 0.45 * Math.abs(Math.sin(ANIM * (10 + k * 20))); ctx.strokeStyle = '#FF3A3A'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(lx, WALL_Y - 6); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(255,58,58,.35)'; circ(ctx, lx, WALL_Y - 6, 10 + k * 8); ctx.restore(); } }
      else if (f.kind === 'bbeam') { ctx.save(); ctx.globalAlpha = 1 - k; glow(ctx, '#FF3A3A', 22); ctx.strokeStyle = '#FF5A5A'; ctx.lineWidth = 10 * (1 - k) + 2; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.tx, WALL_Y - 6); ctx.stroke(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3 * (1 - k) + 1; ctx.stroke(); ctx.restore(); }
      else if (f.kind === 'bfreeze') { if (!CALM()) { ctx.save(); ctx.globalAlpha = 0.35 * (1 - k); ctx.fillStyle = '#BFF4FF'; ctx.fillRect(0, 0, W, H); ctx.restore(); } }
      else if (f.kind === 'ring') { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k); ctx.strokeStyle = 'rgba(' + f.col + ',1)'; ctx.lineWidth = (f.w || 3) * (1 - k) + 0.8; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (0.25 + 0.75 * k), 0, TAU); ctx.stroke(); ctx.restore(); }
      else if (f.kind === 'pdown') { ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#FFE07A'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 6 + k * 22, 0, TAU); ctx.stroke(); ctx.restore(); label(ctx, 'Tembak jatuh!', f.x, f.y - 16 - k * 14, 11, '#FFE07A'); }
      else if (f.kind === 'breath') { const k2 = f.t / f.life; ctx.globalAlpha = 1 - k2; const gr = ctx.createLinearGradient(f.x, f.y, f.x, WALL_Y); gr.addColorStop(0, 'rgba(255,230,120,.9)'); gr.addColorStop(1, 'rgba(255,80,30,.6)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(f.x - 10, f.y + 20); ctx.lineTo(f.x - 60 - k2 * 30, WALL_Y); ctx.lineTo(f.x + 60 + k2 * 30, WALL_Y); ctx.lineTo(f.x + 10, f.y + 20); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
      else if (f.kind === 'bonk') { ctx.fillStyle = '#FFE08A'; ctx.font = '800 13px "Baloo 2", system-ui'; ctx.textAlign = 'center'; ctx.fillText('bam!', f.x, f.y - 22 - 10 * k); }
      else if (f.kind === 'tap') { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 10 + 20 * k, 0, TAU); ctx.stroke(); }
      else if (f.kind === 'hit' && k < 0.2) { ctx.fillStyle = '#FFFFFF'; circ(ctx, f.x, f.y, 8 * (1 - k * 5)); ctx.strokeStyle = (WEAPONS[f.wid] || {}).peluru || '#FFD54A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 6 + k * 50, 0, TAU); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
  }
  function drawHud(b) {
    drawBag();
    ctx.fillStyle = 'rgba(30,40,60,.55)'; rr(ctx, 10, 10, 168 * TXT(), 28, 14); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.font = '700 ' + Math.round(14 * TXT()) + 'px "Baloo 2", system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Gelombang ' + b.wave + '/' + b.maxWave + (b.wave === b.maxWave ? (isBigBoss(b.stage) ? ' · BOSS BESAR' : ' · BOSS') : ''), 22, 29);
    const bw = W - 40, p = b.wall / b.wallMax;
    ctx.fillStyle = 'rgba(30,40,60,.55)'; rr(ctx, 20, H - 22, bw, 12, 6); ctx.fill();
    ctx.fillStyle = p > .5 ? '#5CC46E' : p > .25 ? '#F2B43A' : '#E5484D'; rr(ctx, 20, H - 22, Math.max(0, bw * p), 12, 6); ctx.fill();
    if (p < 0.2 && b.state === 'main' && !CALM()) { ctx.strokeStyle = 'rgba(229,72,77,' + (0.45 + 0.45 * Math.sin(ANIM * 9)) + ')'; ctx.lineWidth = 2.5; rr(ctx, 18, H - 24, bw + 4, 16, 8); ctx.stroke(); }
    ctx.fillStyle = '#FFFFFF'; ctx.font = '700 ' + Math.round(10 * TXT()) + 'px "Nunito", system-ui'; ctx.textAlign = 'center'; ctx.fillText('Pagar ' + fmt(Math.ceil(b.wall)) + '/' + fmt(b.wallMax) + (b.god ? ' (kebal)' : ''), W / 2, H - 13);
  }
  // render penuh; sv = save yang dipakai (game sebenar atau pratonton)
  let LITE = false;
  function render(b, sv, hideHud) {
    LITE = LOWFX && b.zombies.length > 25; CUR_CLOCK = b.clock || 0;
    const sh = shakeOffset(b); ctx.save(); if (sh) ctx.translate((Math.random() - 0.5) * sh * 2, (Math.random() - 0.5) * sh * 2);
    drawBg(b.stage); b._rain = ambKindFor(b.stage) === 'hujan'; drawDecals(b);
    drawEventDecor(activeEvent(Date.now(), sv.eventForce));
    drawPowersUnder(b);
    for (const z of b.zombies) drawZombie(z);
    drawWall(b); drawWallActs(b);
    drawTowers(b);
    // kilauan pemulihan Doktor
    if (b.team.some(m => WEAPONS[heroWeapon(sv, m.id)].heal) && b.wall < b.wallMax && Math.random() < 0.25) emit(Math.random() * W, WALL_Y - 10, 1, { a: -Math.PI / 2, spread: 0.4, spd: 30, warna: '#7FF0C8', size: 3, life: 0.9, shape: 'plus', drag: 0.5 });
    if (!hideHud) drawUltRings(b);
    for (const bl of b.bullets) drawBullet(bl);
    drawBossProj(b);
    const mood = b.state === 'main' ? 'main' : b.state;
    b.team.forEach((m, i) => { if (m.hurtT > 0) m.hurtT -= 1 / 60; }); const runK = running && !hideHud && b.clock < 0.9 && b.wave <= 1 && !LOWFX ? Math.pow(1 - b.clock / 0.9, 2) : 0; b.team.forEach((m, i) => drawBattleHero(m, m.y - 4 + runK * (80 + i * 6) - (runK ? Math.abs(Math.sin(ANIM * 14 + i)) * 4 : 0), b.team.length > 5 ? 1.2 : 1.32, i * 1.7, runK, b, sv));
    drawBossOver(b);
    drawPowersOver(b);
    drawParts();
    drawFx(b);
    if (!hideHud) { drawCoins(); drawBossIntro(b); if (FLASH > 0 && !CALM()) { ctx.fillStyle = 'rgba(255,255,255,' + Math.min(0.7, FLASH * 2) + ')'; ctx.fillRect(0, 0, W, H); } }
    if (!hideHud) { drawRange(b, sv); drawDps(b); if (drag && drag.moved) { ctx.globalAlpha = 0.6; drawHero(ctx, drag.x, Math.min(H - 30, Math.max(WALL_Y, drag.y)), drag.id, -Math.PI / 2, 0, 1.3, heroWeapon(sv, drag.id), { t: ANIM, phase: 0, mood: 'main' }); ctx.globalAlpha = 1; } }
    ctx.restore();
    if (!hideHud) { drawPembantuField(b); drawHud(b); drawTapHud(b); }
  }
  function renderTo(c, b, sv, hideHud) { const old = ctx; ctx = c; render(b, sv, hideHud); ctx = old; }

