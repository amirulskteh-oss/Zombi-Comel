// ================= PAPARAN & KAWALAN v2 =================
(function () {
  const mem = {};
  const store = {
    get(k) { try { const v = localStorage.getItem(k); if (v !== null) return v; } catch (e) {} return mem[k] ?? null; },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { delete mem[k]; try { localStorage.removeItem(k); } catch (e) {} }
  };
  const PLAY_BUILD = false; // ditukar kepada true oleh tools/build.js untuk binaan Google Play
  const GHOST = {}; // binaan Play: elemen trainer tidak wujud; rujukan JS menerima elemen 'hantu' yang tidak dipaparkan
  const $ = id => document.getElementById(id) || (PLAY_BUILD ? (GHOST[id] || (GHOST[id] = document.createElement('div'))) : null);
  const fmt = fmtNum;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const BK_KEY = 'zombi_comel_backups';
  function getBackups() { try { const a = JSON.parse(store.get(BK_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function addBackup(raw, note) { try { const o = JSON.parse(raw); if (!o || !o.heroes) return; const a = getBackups(); a.unshift({ t: Date.now(), v: o.v || 1, best: o.best || 1, note, data: raw }); store.set(BK_KEY, JSON.stringify(a.slice(0, 3))); } catch (e) {} }
  let save; try { const raw0 = store.get(SAVE_KEY); try { const o0 = JSON.parse(raw0); if (o0 && o0.heroes && o0.v !== SAVE_V) addBackup(raw0, 'Sebelum kemas kini ke versi ' + VERSION); } catch (e) {} save = migrate(JSON.parse(raw0), Date.now()); } catch (e) { save = migrate(null, Date.now()); }
  if (PLAY_BUILD) save.dev = false; // trainer tidak boleh dihidupkan dalam binaan Play
  const persist = () => { save.last = Date.now(); store.set(SAVE_KEY, JSON.stringify(save)); };

  // ---------- kanvas ----------
  const cv = $('game'), gctx = cv.getContext('2d'); let ctx = gctx;
  function fitCanvas() { const dpr = Math.min(2.5, window.devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr; gctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  fitCanvas(); window.addEventListener('resize', fitCanvas);

  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  // ---------- v8.3: retak realistik ----------
  // Retak bermula dari titik hentakan (rawak tetapi tetap bagi setiap tiang), bercabang & menirus, tumbuh ikut kerosakan.
  // kayu: terbelah ikut ira · batu: sarang labah-labah + sumbing · kristal: bintang bercahaya · logam: tiada retak (kemek & calar)
  function postPath(st, h, mat) {
    ctx.beginPath();
    if (st >= 3) { ctx.moveTo(-10, 0); ctx.lineTo(-10, -h + 3); ctx.lineTo(-6, -h - 3); ctx.lineTo(-2, -h + 2); ctx.lineTo(3, -h - 4); ctx.lineTo(7, -h + 1); ctx.lineTo(10, -h - 2); ctx.lineTo(10, 0); ctx.closePath(); }
    else rr(ctx, -10, -h, 20, h, mat === 1 ? 9 : 5);
  }
  const CRK = {};
  function crackSet(G, i, h, mat) {
    const key = G + i + '|' + h + '|' + mat; if (CRK[key]) return CRK[key];
    const r = mulberry(i * 7919 + mat * 131 + 17), lines = [], ix = (r() - 0.5) * 9, iy = -h * (0.4 + r() * 0.35);
    const walk = (x, y, a, len, w0, lv) => {
      const pts = [[x, y]], n = Math.max(2, Math.round(len / 3.2)), jit = G === 'kayu' ? 0.28 : G === 'kristal' ? 0.15 : 0.75;
      for (let k = 0; k < n; k++) { a += (r() - 0.5) * jit; x += Math.cos(a) * 3.2; y += Math.sin(a) * 3.2; pts.push([x, y]); }
      lines.push({ pts, w0, lv });
      if (lv < 2) { const nb = G === 'kayu' ? (r() < 0.6 ? 1 : 0) : G === 'kristal' ? 0 : 1 + (r() < 0.5 ? 1 : 0);
        for (let q = 0; q < nb; q++) { const at = 1 + Math.floor(r() * Math.max(1, pts.length - 2)), p = pts[Math.min(at, pts.length - 1)]; walk(p[0], p[1], a + (r() < 0.5 ? -1 : 1) * (0.45 + r() * 0.6), len * (0.35 + r() * 0.25), w0 * 0.6, lv + 1); } }
    };
    if (G === 'kayu') { walk(ix, iy, -Math.PI / 2 + (r() - 0.5) * 0.25, h * (0.45 + r() * 0.2), 1.9, 0); walk(ix, iy, Math.PI / 2 + (r() - 0.5) * 0.25, h * (0.35 + r() * 0.2), 1.6, 0); }
    else if (G === 'batu') { const n = 4 + Math.floor(r() * 3); for (let k = 0; k < n; k++) walk(ix, iy, (k / n) * TAU + r() * 0.6, 8 + r() * 12, 1.7, k < 2 ? 0 : 1); }
    else { for (let k = 0; k < 6; k++) walk(ix, iy, (k / 6) * TAU + (r() - 0.5) * 0.3, 7 + r() * 11, 1.4, k < 3 ? 0 : 1); }
    return (CRK[key] = { ix, iy, lines });
  }
  function drawCracks(G, i, d, h, st, w) {
    const cs = crackSet(G, i, h, w.mat), glow = G === 'kristal';
    ctx.save(); postPath(st, h, w.mat); ctx.clip(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const pass of [0, 1]) for (const L of cs.lines) {   // 0: tepi cerah (kedalaman), 1: teras gelap
      const g = Math.max(0, Math.min(1, (d - (0.12 + 0.18 * L.lv)) / 0.4)); if (g <= 0) continue;
      const P = L.pts, n = Math.min(P.length - 1, Math.max(1, Math.ceil(g * (P.length - 1)))), o = pass ? 0 : 0.7;
      for (let k = 0; k < n; k++) { const lw = Math.max(0.5, L.w0 * (1 - (k / (P.length - 1)) * 0.85));
        ctx.beginPath(); ctx.moveTo(P[k][0] + o, P[k][1] + o); ctx.lineTo(P[k + 1][0] + o, P[k + 1][1] + o);
        if (!pass) { ctx.strokeStyle = glow ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.28)'; ctx.lineWidth = lw * 0.8; }
        else { ctx.strokeStyle = glow ? 'rgba(150,230,255,.95)' : 'rgba(28,18,12,' + (0.55 + 0.35 * g).toFixed(2) + ')'; ctx.lineWidth = lw; if (glow && !LOWFX) { ctx.shadowColor = '#BFF6FF'; ctx.shadowBlur = 5; } }
        ctx.stroke(); } }
    if (st >= 2 && !glow) { const r = mulberry(i * 31 + 7); ctx.fillStyle = 'rgba(20,14,10,.45)'; for (let q = 0; q < (G === 'batu' ? 3 : 2); q++) { const ax = cs.ix + (r() - 0.5) * 6, ay = cs.iy + (r() - 0.5) * 6, s = 1.5 + r() * 2; ctx.beginPath(); ctx.moveTo(ax, ay - s); ctx.lineTo(ax + s, ay + s * 0.6); ctx.lineTo(ax - s, ay + s * 0.5); ctx.closePath(); ctx.fill(); } }
    if (glow && st >= 2) { ctx.fillStyle = 'rgba(220,250,255,.6)'; circ(ctx, cs.ix, cs.iy, 2.2); }
    ctx.restore();
  }
  function drawWallActs(b) {
    const a = b.act || {}; if (!(a.wkebal || a.wbata || a.wduri || a.wslow)) return; const c = ctx; c.save();
    if (a.wslow) { c.globalAlpha = 0.35; c.fillStyle = '#8E8A80'; for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(20 + i * 40, WALL_Y - 40 - (i % 3) * 22, 26, 9, 0, 0, TAU); c.fill(); } c.globalAlpha = 1; }
    if (a.wduri) { c.fillStyle = '#C9D2DE'; c.strokeStyle = '#4E5866'; c.lineWidth = 1.5; for (let x = 6; x < W; x += 14) { c.beginPath(); c.moveTo(x - 5, WALL_Y - 22); c.lineTo(x, WALL_Y - 36 - Math.sin(ANIM * 6 + x) * 2); c.lineTo(x + 5, WALL_Y - 22); c.closePath(); c.fill(); c.stroke(); } }
    if (a.wbata || a.wkebal) { const col = a.wkebal ? '255,224,122' : '120,190,255', p = 0.5 + 0.5 * Math.sin(ANIM * 5); c.fillStyle = 'rgba(' + col + ',' + (0.12 + 0.08 * p) + ')'; c.fillRect(0, WALL_Y - 46, W, 50); c.strokeStyle = 'rgba(' + col + ',' + (0.6 + 0.3 * p) + ')'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, WALL_Y - 46); c.quadraticCurveTo(W / 2, WALL_Y - 70, W, WALL_Y - 46); c.stroke(); }
    c.restore();
  }
  function drawWall(b) {
    const p = Math.max(0, b.wall / b.wallMax), w = b.ws.w, G = wallMatGroup(w.mat), dm = wallSegDamage(b.wallSeg, p), SW = W / WALL_SEGS, BASE = WALL_Y + 16;
    // tiang yang pulih: kilauan
    if (!b._pd) b._pd = dm.slice();
    for (let i = 0; i < WALL_SEGS; i++) { if (b._pd[i] - dm[i] > 0.12) { b._pd[i] = dm[i]; if (!LOWFX) emit(i * SW + SW / 2, WALL_Y - 14, 5, { spd: 50, warna: ['#FFF6A8', '#9BFFB8', '#FFFFFF'], size: 2.6, life: 0.6, grav: -50, shape: 'star' }); } else if (dm[i] > b._pd[i]) b._pd[i] = dm[i]; }
    if (w.regen) { ctx.fillStyle = 'rgba(120,255,170,' + (0.12 + 0.08 * Math.sin(performance.now() / 300)) + ')'; ctx.fillRect(0, WALL_Y - 40, W, 60); }
    const wob = b._segWob || (b._segWob = new Array(WALL_SEGS).fill(0)), lost = b.state === 'kalah', ck = lost ? Math.min(1.6, b._lostT || 0) : 0;
    // palang mendatar (di belakang tiang): patah & melendut di tiang yang hancur
    ctx.fillStyle = w.gelap;
    for (let i = 0; i < WALL_SEGS; i++) { const x = i * SW, d = dm[i]; if (lost && ck > 0.3) continue;
      if (d < 0.8) { ctx.fillRect(x, WALL_Y - 18, SW + 0.5, 6); ctx.fillRect(x, WALL_Y + 2, SW + 0.5, 6); }
      else { ctx.save(); ctx.translate(x, WALL_Y - 15); ctx.rotate(0.35 * (i % 2 ? 1 : -1)); ctx.fillRect(0, -3, SW * 0.7, 5); ctx.restore(); ctx.fillRect(x, WALL_Y + 4, SW * 0.5, 5); } }
    for (let i = 0; i < WALL_SEGS; i++) {
      const x = i * SW, d = dm[i], st = d < 0.1 ? 0 : d < 0.3 ? 1 : d < 0.55 ? 2 : d < 0.8 ? 3 : 4, sgn = i % 2 ? 1 : -1;
      const h = st === 4 ? 18 : st === 3 ? 32 : 46, delay = Math.abs(i - WALL_SEGS / 2) / WALL_SEGS * 0.6, fall = lost ? Math.max(0, Math.min(1, (ck - delay) / 0.5)) : 0;
      const lean = (st >= 3 ? sgn * (d - 0.5) * 0.22 : 0) + (wob[i] > 0 ? Math.sin(wob[i] * 45) * wob[i] * 0.3 : 0) + fall * sgn * 1.45;
      ctx.save(); ctx.translate(x + SW / 2, BASE); ctx.rotate(lean);
      // badan tiang (atas bergerigi bila patah)
      ctx.fillStyle = w.warna; postPath(st, h, w.mat); ctx.fill();
      if (G === 'batu') { ctx.fillStyle = w.gelap; for (const yy of [-34, -22, -10]) if (-yy < h) ctx.fillRect(-10, yy, 20, 1.6); ctx.fillRect(-1, -h + 4, 1.4, Math.min(10, h - 6)); }
      ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(-6, -h + 4, 3, h - 8);
      if (w.thorns && st < 3) { ctx.fillStyle = w.gelap; ctx.beginPath(); ctx.moveTo(-8, -h); ctx.lineTo(-4, -h - 12); ctx.lineTo(0, -h); ctx.moveTo(0, -h); ctx.lineTo(4, -h - 12); ctx.lineTo(8, -h); ctx.fill(); }
      // kesan rosak ikut bahan
      if (G !== 'logam') { if (d > 0.12) drawCracks(G, i, d, h, st, w); }
      else { if (st >= 1) { ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 0.9; const r9 = mulberry(i * 53 + 3); ctx.beginPath(); for (let q = 0; q < 3; q++) { const sx = -8 + r9() * 12, sy = -h * (0.2 + r9() * 0.6); ctx.moveTo(sx, sy); ctx.lineTo(sx + 4 + r9() * 5, sy - 1 - r9() * 3); } ctx.stroke(); }
        if (st >= 2) { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(-2, -h * 0.55, 4, 2.6, 0.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(3, -h * 0.3, 3, 2, -0.4, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(160,82,40,.75)'; circ(ctx, 5, -h * 0.7, 1.8); circ(ctx, -6, -h * 0.25, 1.4); circ(ctx, 2, -8, 1.6); } }
      if (st >= 3) {
        if (G === 'kayu') { ctx.strokeStyle = 'rgba(255,240,210,.85)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5, -h - 1); ctx.lineTo(-7, -h - 7); ctx.moveTo(4, -h - 2); ctx.lineTo(6, -h - 8); ctx.moveTo(0, -h); ctx.lineTo(1, -h - 5); ctx.stroke(); ctx.fillStyle = '#9AA0A8'; ctx.fillRect(6, -h * 0.5, 6, 1.6); }
        else if (G === 'kristal') { ctx.fillStyle = 'rgba(220,250,255,.8)'; ctx.beginPath(); ctx.moveTo(-6, -h - 3); ctx.lineTo(-4, -h - 9); ctx.lineTo(-2, -h + 2); ctx.fill(); }
        else if (G === 'logam') { ctx.fillStyle = w.gelap; circ(ctx, -6, -h + 6, 1.3); circ(ctx, 6, -h + 6, 1.3); }
      }
      ctx.restore();
      // serpihan di tanah (tiang hancur)
      if (st === 4 && fall === 0) { ctx.save(); ctx.translate(x + SW / 2 + sgn * 9, BASE + 3); ctx.rotate(sgn * 1.35); ctx.fillStyle = w.warna; rr(ctx, -4, -12, 8, 14, 2); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(-4, -3, 8, 2); ctx.restore();
        if (G === 'batu') { ctx.fillStyle = w.gelap; circ(ctx, x + 4, BASE + 4, 2.4); circ(ctx, x + 18, BASE + 5, 1.8); } }
      if (wob[i] > 0) wob[i] = Math.max(0, wob[i] - 1 / 60);
    }
    if (G === 'logam' && w.mat === 5 || w.mat >= 7) { ctx.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < WALL_SEGS; i += 2) if (dm[i] < 0.55) { ctx.beginPath(); ctx.arc(i * SW + SW / 2, WALL_Y - 22, 2.5, 0, 7); ctx.fill(); } }
    // kritikal: asap nipis dari tiang paling rosak
    if (p < 0.2 && !lost && !LOWFX && Math.random() < 0.07) { let mi = 0; dm.forEach((v, i) => { if (v > dm[mi]) mi = i; }); emit(mi * SW + SW / 2 + (Math.random() - 0.5) * 10, WALL_Y - 10, 1, { a: -Math.PI / 2, spread: 0.4, spd: 18, warna: ['#7A7A80', '#9A9AA0'], size: 7, life: 1.8, grav: -12, shape: 'smoke' }); }
    // runtuh bila kalah: debu sekali
    if (lost && !b._dust && ck > 0.2) { b._dust = 1; if (!CALM()) { for (let i = 0; i < 6; i++) emit(30 + i * 60, BASE, 6, { a: -Math.PI / 2, spread: 1.4, spd: 60, warna: ['#A89A88', '#C8BCA8'], size: 6, life: 1.2, grav: -20, shape: 'smoke' }); b.fx.push({ kind: 'shake', t: 0, mag: 6 }); } sfx(G === 'logam' ? 'clangW' : G === 'batu' ? 'crunch' : G === 'kristal' ? 'glassW' : 'thud'); }
  }

  // ================= GRAFIK & ANIMASI =================
  const TAU = Math.PI * 2;
  let ANIM = 0; // masa animasi (saat)
  const ICE = ['nitrogen', 'ais_g', 'frost'], POISON = ['racun', 'tongkat_r'], ZAPS = { petir: '#FFF27A', tesla: '#8FE8FF', tongkat_r: '#B2F06A', tukul: '#FFF06A' };
  let LOWFX = false, slowT = 0;
  function glow(c, color, blur) { if (LOWFX) return; c.shadowColor = color; c.shadowBlur = blur; }
  function noGlow(c) { c.shadowBlur = 0; }
  function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  function star(c, x, y, n, ro, ri, rot) { c.beginPath(); for (let i = 0; i < n * 2; i++) { const r = i % 2 ? ri : ro, a = rot + i * Math.PI / n; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); c.fill(); }

  // ---------- zarah ----------
  let parts = [];
  function emit(x, y, n, o) {
    if (LOWFX) n = Math.ceil(n / 2);
    for (let i = 0; i < n && parts.length < (LOWFX ? 300 : 700); i++) {
      const a = (o.a != null ? o.a + (Math.random() - 0.5) * (o.spread ?? TAU) : Math.random() * TAU), s = (o.spd || 60) * (0.4 + Math.random() * 0.8);
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (o.up || 0), life: (o.life || 0.6) * (0.6 + Math.random() * 0.6), t: 0, size: (o.size || 3) * (0.6 + Math.random() * 0.8), warna: Array.isArray(o.warna) ? o.warna[Math.floor(Math.random() * o.warna.length)] : o.warna, grav: o.grav || 0, shape: o.shape || 'c', shrink: o.shrink !== false, drag: o.drag ?? 1.5, rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 10 });
    }
  }
  function updateParts(dt) {
    for (const p of parts) { p.t += dt; p.vy += p.grav * dt; const k = Math.max(0, 1 - p.drag * dt); p.vx *= k; p.vy *= k; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; }
    parts = parts.filter(p => p.t < p.life);
  }
  function drawParts() {
    for (const p of parts) {
      const k = p.t / p.life, s = p.shrink ? p.size * (1 - k * 0.7) : p.size;
      ctx.globalAlpha = Math.max(0, 1 - k); ctx.fillStyle = p.warna;
      if (p.shape === 'sq') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-s, -s, s * 2, s * 2); ctx.restore(); }
      else if (p.shape === 'plus') { ctx.fillRect(p.x - s, p.y - s * .3, s * 2, s * .6); ctx.fillRect(p.x - s * .3, p.y - s, s * .6, s * 2); }
      else if (p.shape === 'star') star(ctx, p.x, p.y, 4, s * 1.4, s * .5, p.rot);
      else if (p.shape === 'shard') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath(); ctx.moveTo(0, -s * 1.6); ctx.lineTo(s * .8, s); ctx.lineTo(-s * .8, s); ctx.closePath(); ctx.fill(); ctx.restore(); }
      else if (p.shape === 'smoke') { ctx.globalAlpha *= 0.5; circ(ctx, p.x, p.y, s * (1 + k * 1.5)); }
      else if (p.shape === 'coin') { ctx.save(); ctx.translate(p.x, p.y); ctx.scale(Math.abs(Math.cos(p.rot)), 1); circ(ctx, 0, 0, s); ctx.restore(); }
      else if (p.shape === 'ghost') { ctx.globalAlpha *= 0.8; circ(ctx, p.x, p.y, s); ctx.fillRect(p.x - s, p.y, s * 2, s * .9); ctx.fillStyle = '#2B2B33'; circ(ctx, p.x - s * .35, p.y - s * .1, s * .18); circ(ctx, p.x + s * .35, p.y - s * .1, s * .18); }
      else circ(ctx, p.x, p.y, s);
    }
    ctx.globalAlpha = 1;
  }
  // tukar peristiwa logik (fx) kepada zarah, sekali sahaja setiap peristiwa
  function spawnFromFx(b, quiet) {
    for (const f of b.fx) {
      if (f._s) continue; f._s = true;
      if (!quiet && f.kind === 'pop' && !f.boss && !LOWFX && coins.length < 24) coins.push({ x: f.x, y: f.y, t: 0 });
      if (f.kind === 'die' && f.z) { const ds = deathStyle(f.z); if (ds === 'racun' || Math.random() < 0.45) addDecal(b, { kind: 'goo', x: f.z.x, y: f.z.y + f.z.r * 0.8, r: f.z.r * (ds === 'racun' ? 1.3 : 0.9) }); }
      if (f.kind === 'boom' && (f.r || 0) > 30) addDecal(b, { kind: 'scorch', x: f.x, y: f.y + 6, r: Math.min(70, f.r * 0.55), life: 6 });
      if (!quiet && f.kind === 'bossIntro' && f.big) b.fx.push({ kind: 'shake', t: 0, mag: 7 });
      if (!quiet) { const k1 = f.kind, X = f.x;
        if (k1 === 'wallHit') { const G = wallMatGroup(b.ws.w.mat); sfx(G === 'logam' ? 'clangW' : G === 'batu' ? 'crunch' : G === 'kristal' ? 'glassW' : 'thud', null, X); } else if (k1 === 'bonk') sfx('thud', null, X); else if (k1 === 'spit') sfx('spit', null, X); else if (k1 === 'zap') sfx('zap', null, X); else if (k1 === 'breath') sfx('whoosh', null, X); else if (k1 === 'cloud') sfx('hiss'); else if (k1 === 'heal') { sfx('zHeal', null, X); f.tg = b.zombies.filter(o => o.hp > 0 && Math.hypot(o.x - f.x, o.y - f.y) < 90 && Math.hypot(o.x - f.x, o.y - f.y) > 1).slice(0, 5).map(o => [o.x, o.y]); }
        else if (k1 === 'clank') { sfx('clank', null, X); if (!LOWFX) emit(f.x, f.y, 6, { spd: 140, warna: ['#FFE07A', '#FFFFFF'], size: 2, life: 0.25, grav: 200, shape: 'sq' }); }
        else if (k1 === 'skill') sfx('skill', f.h, X); else if (k1 === 'bossIntro') { sfx('roar', f.bk); duck(0.35, 1.6); } else if (k1 === 'bwarn') sfx('warn', null, f.z && f.z.x);
        else if (k1 === 'pop' && f.boss) { sfx('bossDie'); duck(0.3, 1.8); SLOWMO = 0.75; FLASH = 0.35; if (!LOWFX) { emit(f.x, f.y, 60, { spd: 260, warna: ['#FFE07A', '#FF9A3C', '#FFFFFF', f.warna || '#8DC95B'], size: 5, life: 1.2, grav: 160, shape: 'sq' }); for (let i = 0; i < 14; i++) coins.push({ x: f.x + (Math.random() - 0.5) * 60, y: f.y + (Math.random() - 0.5) * 40, t: -i * 0.04 }); } } }
      if (!quiet) { const k0 = f.kind; if (k0 === 'pop') sfx('kill'); else if (k0 === 'boom') sfx(f.wid === 'bom_g' || f.r > 100 ? 'big' : 'boom'); else if (k0 === 'hit') sfx('hit'); else if (k0 === 'power' || k0 === 'ult') sfx('power'); else if (k0 === 'strike') sfx('strike'); else if (k0 === 'evo') sfx('evo'); else if (k0 === 'loot') sfx(f.sub === 'shard' ? 'shard' : 'chest'); else if (k0 === 'tapHit') sfx(f.ground ? 'tampar' : f.crit ? 'crit' : 'tap'); else if (k0 === 'stomp') sfx('big'); }
      if (f.kind === 'pop') {
        emit(f.x, f.y, f.boss ? 40 : 14, { spd: f.boss ? 200 : 110, warna: [f.warna || '#8DC95B', '#6A9A45', '#E8F7C8'], size: f.boss ? 6 : 3.5, life: 0.7, grav: 260, shape: 'sq' });
        emit(f.x, f.y, 3, { spd: 30, warna: '#FFFFFF', size: f.boss ? 18 : 9, life: 0.5, shape: 'smoke', drag: 3 });
        emit(f.x, f.y - 6, 1, { a: -Math.PI / 2, spread: 0.3, spd: 40, warna: '#F4F7FF', size: f.boss ? 12 : 7, life: 1.2, shape: 'ghost', shrink: false, drag: 0.5 });
        emit(f.x, f.y, f.boss ? 8 : 2, { a: -Math.PI / 2, spread: 1.2, spd: 120, up: 40, warna: '#F5B82E', size: 3.5, life: 0.8, grav: 300, shape: 'coin' });
      } else if (f.kind === 'boom' && boomHD(b, f)) {
      } else if (f.kind === 'boom') {
        const ice = ICE.includes(f.wid), nap = f.wid === 'napalm' || f.wid === 'meteor' || f.wid === 'bom_g', el = f.wid === 'tukul', vo = f.wid === 'lubang';
        if (vo) { emit(f.x, f.y, 30, { spd: f.r * 4, warna: ['#C08CF0', '#FFFFFF', '#5A3A8A'], size: 5, life: 0.7, drag: 3, shape: 'star' }); continue; }
        if (f.wid === 'meteor' || f.wid === 'bom_g') emit(f.x, f.y, f.wid === 'bom_g' ? 40 : 10, { spd: f.r * 3, warna: ['#7A4A2A', '#5A3A20'], size: 4, life: 0.9, grav: 400, shape: 'sq', up: 120 });
        const col = ice ? ['#FFFFFF', '#BFF4FF', '#5AC8FF'] : el ? ['#FFFFFF', '#FFF27A', '#8FE8FF'] : nap ? ['#FFE07A', '#FF6A1F', '#E5302A'] : ['#FFF2B0', '#FFB04A', '#FF6A2B'];
        emit(f.x, f.y, Math.min(40, 12 + f.r * 0.35), { spd: f.r * 4, warna: col, size: 5.5, life: 0.5, drag: 4, shape: ice ? 'star' : 'c' });
        emit(f.x, f.y, 6, { spd: f.r * 1.2, warna: ice ? '#DFF6FF' : '#7A7A7A', size: f.r * 0.25, life: 0.9, shape: 'smoke', drag: 2.5, up: 20 });
        if (!ice) emit(f.x, f.y, 6, { spd: f.r * 4, warna: '#4A3A2A', size: 2.2, life: 0.7, grav: 400, shape: 'sq', up: 80 });
      } else if (f.kind === 'hit' && hitHD(b, f)) {
      } else if (f.kind === 'hit') {
        const wd = WEAPONS[f.wid] || {}, back = f.a + Math.PI;
        if (ICE.includes(f.wid)) emit(f.x, f.y, 5, { a: back, spread: 2, spd: 90, warna: ['#FFFFFF', '#9FE6FF'], size: 2.5, life: 0.35, shape: 'star' });
        else if (POISON.includes(f.wid)) emit(f.x, f.y, 5, { a: back, spread: 2.4, spd: 60, warna: ['#B2F06A', '#5DBB63'], size: 3, life: 0.5, grav: 120 });
        else if (f.wid === 'api' || f.wid === 'napalm') emit(f.x, f.y, 6, { a: -Math.PI / 2, spread: 1.4, spd: 70, warna: ['#FFE07A', '#FF6A2B'], size: 3, life: 0.4 });
        else if (wd.pierce >= 99 || f.wid === 'plasma') emit(f.x, f.y, 6, { a: back, spread: 2.2, spd: 140, warna: [wd.peluru, '#FFFFFF'], size: 2, life: 0.3 });
        else emit(f.x, f.y, 5, { a: back, spread: 1.6, spd: 150, warna: ['#FFFFFF', wd.peluru || '#FFD54A'], size: 2.6, life: 0.3, drag: 3 });
      } else if (f.kind === 'evo') {
        emit(f.x, f.y, 18, { spd: 150, warna: [f.warna, '#FFFFFF'], size: 3, life: 0.7, shape: 'star', drag: 2.5 });
      } else if (f.kind === 'bthrow') { if (!quiet) sfx('bthrow', f.k, f.x);
      } else if (f.kind === 'pdown') { if (!quiet) sfx('pdown', null, f.x); emit(f.x, f.y, 12, { spd: 130, warna: ['#FFE07A', '#FFFFFF', '#8A8A90'], size: 3, life: 0.45, shape: 'star', drag: 2 });
      } else if (f.kind === 'bbeam') { if (!quiet) sfx('zap', null, f.tx); emit(f.tx, WALL_Y - 8, 14, { a: -Math.PI / 2, spread: 2, spd: 150, warna: ['#FF5A5A', '#FFFFFF'], size: 2.5, life: 0.4 });
      } else if (f.kind === 'bfreeze') { if (!quiet) sfx('shatter'); for (const t of b.towers || []) emit(t.x, t.y, 10, { spd: 80, warna: ['#FFFFFF', '#BFF4FF'], size: 3, life: 0.6, shape: 'shard' });
      } else if (f.kind === 'wskill') {
        if (!quiet) sfx('wskill', f.mat); vib(40); const w0 = WALLS[f.mat * 5];
        for (let i = 0; i < 26; i++) emit(Math.random() * W, WALL_Y - 6, 1, { a: -Math.PI / 2, spread: 0.7, spd: 90 + Math.random() * 90, warna: [w0.warna, '#FFFFFF', w0.gelap], size: 3.2, life: 0.8, grav: 120, shape: f.mat === 7 ? 'shard' : f.mat === 0 || f.mat === 9 ? 'plus' : 'star' });
      } else if (f.kind === 'power' && f.id === 'ais') {
        for (let i = 0; i < 40; i++) emit(Math.random() * W, Math.random() * WALL_Y, 1, { spd: 60, warna: ['#FFFFFF', '#BFEFFF', '#7FD0F0'], size: 4, life: 0.9, shape: 'shard', drag: 2 }); vib(60);
      } else if (f.kind === 'wallHit') {
        for (const m of b.team) if (Math.abs(m.x - f.x) < 90) m.hurtT = 0.35; { const G = wallMatGroup(b.ws.w.mat), w = b.ws.w, si = wallSegIndex(f.x); (b._segWob || (b._segWob = new Array(WALL_SEGS).fill(0)))[si] = 0.32;
          if (G === 'logam') emit(f.x, WALL_Y - 16, 7, { a: -Math.PI / 2, spread: 2.4, spd: 190, warna: ['#FFE07A', '#FFFFFF', '#FFB040'], size: 2, life: 0.28, grav: 380, shape: 'sq' });
          else if (G === 'kristal') emit(f.x, WALL_Y - 16, 6, { a: -Math.PI / 2, spread: 2, spd: 130, warna: [w.warna, '#FFFFFF', '#DFF8FF'], size: 3, life: 0.6, grav: 320, shape: 'shard' });
          else { emit(f.x, WALL_Y - 16, 4, { a: -Math.PI / 2, spread: 2, spd: 100, warna: [w.warna, w.gelap, '#E8D0A8'], size: 2.6, life: 0.55, grav: 320, shape: 'sq' }); if (!LOWFX) emit(f.x, WALL_Y + 14, 2, { a: -Math.PI / 2, spread: 1.2, spd: 25, warna: G === 'batu' ? ['#B8B4AC', '#9A968E'] : ['#C8B8A0', '#A89880'], size: 6, life: 0.8, grav: -10, shape: 'smoke' }); }
          if (!LOWFX) emit(f.x, WALL_Y - 20, 1, { spd: 0, warna: ['#FFFFFF'], size: 9, life: 0.1, grav: 0 }); }
      } else if (f.kind === 'stomp') { vib([40, 30, 80]);
        emit(f.x, f.y, 30, { spd: 220, warna: ['#C8A878', '#8A6A4A', '#FFE07A'], size: 4, life: 0.8, grav: 300, shape: 'sq', up: 80 });
      } else if (f.kind === 'tapHit' && f.ground) { vib(12);
        emit(f.x, f.y + 6, 8, { spd: 90, warna: ['rgba(210,190,160,.85)', 'rgba(255,255,255,.8)'], size: 4, life: 0.45, shape: 'smoke', drag: 3 });
      } else if (f.kind === 'tapHit') {
        emit(f.x, f.y, f.crit ? 14 : 6, { spd: f.crit ? 180 : 110, warna: f.crit ? ['#FFE07A', '#FFFFFF'] : ['#FFFFFF', '#E8F7C8'], size: 2.6, life: 0.4, shape: 'star' }); if (f.combo === 10 || f.combo === 25 || f.combo === 50) vib(25);
      } else if (f.kind === 'tapMiss') {
        emit(f.x, f.y, 5, { spd: 50, warna: 'rgba(200,190,170,.8)', size: 4, life: 0.4, shape: 'smoke', drag: 3 });
      } else if (f.kind === 'strike') {
        emit(f.x, f.y, 10, { spd: 140, warna: ['#FFFFFF', '#FFF27A'], size: 2.5, life: 0.35, shape: 'star' });
      } else if (f.kind === 'tap') {
        emit(f.x, f.y, 8, { spd: 120, warna: ['#FFFFFF', '#FFE07A'], size: 2.5, life: 0.35, shape: 'star' });
      } else if (f.kind === 'bonk') {
        emit(f.x, f.y - 20, 4, { a: -Math.PI / 2, spread: 2, spd: 90, warna: ['#C98B4E', '#8A5A30'], size: 2.5, life: 0.5, grav: 300, shape: 'sq' });
      }
    }
  }

  // ---------- senjata: setiap satu dilukis berbeza ----------
  // asal = genggaman, laras menghala ke +x. fire = 0..1 (baru menembak)
  function drawWeapon(c, wid, t, fire, spin, lv) {
    const wd = WEAPONS[wid], L = wd.laras, dark = '#2E323C', metal = '#5A6070', wood = '#8A5A30';
    c.lineCap = 'round'; c.lineJoin = 'round';
    if (lv == null) lv = (save && save.weapons && save.weapons[wid]) || 1;
    if (WPN_HD[wid]) { WPN_HD[wid](c, L, t, fire, spin); drawWpnEvo(c, wid, L, t, wpnEvo(lv)); return; }
    drawWeapon0(c, wid, t, fire, spin, wd, L, dark, metal, wood); drawWpnEvo(c, wid, L, t, wpnEvo(lv));
  }
  function drawWeapon0(c, wid, t, fire, spin, wd, L, dark, metal, wood) {
    const barrel = (len, th, col, y0) => { c.fillStyle = col || dark; c.fillRect(0, (y0 || 0) - th / 2, len, th); };
    switch (wid) {
      case 'pistol': barrel(L, 5); c.fillStyle = metal; c.fillRect(2, -4, 10, 3); c.fillStyle = dark; c.fillRect(-1, 0, 4, 7); break;
      case 'revolver': barrel(L, 4); c.fillStyle = metal; circ(c, 6, 0, 4.5); c.fillStyle = dark; c.fillRect(-1, 1, 4, 7); c.fillStyle = '#B8BCC8'; circ(c, 6, 0, 1.5); break;
      case 'smg': barrel(L, 6); c.fillStyle = metal; c.fillRect(6, 3, 4, 8); c.fillStyle = dark; c.fillRect(-4, -2, 5, 4); break;
      case 'mesingan': barrel(L, 6); c.fillStyle = metal; circ(c, 8, 5, 5); c.fillStyle = dark; c.fillRect(L - 4, -1, 6, 2); break;
      case 'minigun': {
        c.fillStyle = metal; c.fillRect(-2, -6, 10, 12);
        for (let i = 0; i < 3; i++) { const yy = Math.sin(spin + i * TAU / 3) * 4; c.fillStyle = Math.cos(spin + i * TAU / 3) > 0 ? '#7A8090' : dark; c.fillRect(8, yy - 1.5, L - 8, 3); }
        c.fillStyle = '#C9A040'; c.fillRect(0, 6, 4, 6); break;
      }
      case 'shotgun': barrel(L, 3, dark, -1.6); barrel(L, 3, dark, 1.6); c.fillStyle = wood; c.fillRect(-6, -3, 9, 6); break;
      case 'lima': for (let i = -2; i <= 2; i++) { c.save(); c.rotate(i * 0.08); barrel(L, 2.4, i % 2 ? metal : dark); c.restore(); } c.fillStyle = wood; c.fillRect(-6, -3, 8, 6); break;
      case 'sniper': barrel(L, 3.5); c.fillStyle = metal; c.fillRect(4, -7, 12, 3.5); c.fillStyle = '#9FE6FF'; circ(c, 16, -5.3, 1.6); c.fillStyle = wood; c.fillRect(-7, -2.5, 9, 5); break;
      case 'railgun': {
        c.fillStyle = metal; c.fillRect(0, -5, L, 3); c.fillRect(0, 2, L, 3);
        const p = 0.5 + 0.5 * Math.sin(t * 8); glow(c, '#9AA8FF', 10); c.fillStyle = 'rgba(154,168,255,' + (0.5 + 0.5 * p) + ')'; for (let i = 4; i < L; i += 6) c.fillRect(i, -2, 3, 4); noGlow(c);
        c.fillStyle = dark; c.fillRect(-5, -3, 7, 6); break;
      }
      case 'laser': c.fillStyle = '#C9C9D8'; c.fillRect(0, -3, L, 6); c.fillStyle = '#E8C547'; c.fillRect(4, -3, 4, 6); glow(c, wd.peluru, 12); c.fillStyle = wd.peluru; circ(c, L, 0, 2.5 + Math.sin(t * 10)); noGlow(c); break;
      case 'plasma': c.fillStyle = '#B8C2CC'; c.fillRect(0, -3, L, 6); glow(c, wd.peluru, 14); c.fillStyle = wd.peluru; circ(c, 8, 0, 4 + Math.sin(t * 6)); c.fillRect(L - 3, -2, 4, 4); noGlow(c); break;
      case 'frost': barrel(L, 5, '#5A7A90'); c.fillStyle = '#9FE6FF'; star(c, L, 0, 4, 4, 1.5, t * 2); c.fillStyle = dark; c.fillRect(-1, 0, 4, 7); break;
      case 'nitrogen': case 'ais_g': { const big = wid === 'ais_g'; c.fillStyle = '#7AA8C0'; c.fillRect(0, -(big ? 5 : 4), L, big ? 10 : 8); c.fillStyle = '#DFF6FF'; c.fillRect(L - 4, -(big ? 6 : 5), 5, big ? 12 : 10); c.fillStyle = '#5A8AA8'; circ(c, 4, 6, big ? 5 : 4); c.fillStyle = 'rgba(255,255,255,.8)'; star(c, L - 1, -(big ? 6 : 5), 4, 2.5, 1, t * 3); break; }
      case 'bom': c.fillStyle = '#3A3A3A'; circ(c, 6, 0, 6); c.fillStyle = '#7A7A7A'; c.fillRect(4, -9, 4, 4); c.fillStyle = Math.sin(t * 30) > 0 ? '#FFE07A' : '#FF6A2B'; star(c, 6, -11, 4, 3, 1, t * 10); break;
      case 'shuriken': c.fillStyle = '#C8CED8'; star(c, 6, 0, 4, 7, 2.4, t * 2); c.fillStyle = dark; circ(c, 6, 0, 1.5); break;
      case 'bumerang': c.save(); c.translate(6, 0); c.rotate(Math.sin(t * 2) * 0.2); c.strokeStyle = '#E0A050'; c.lineWidth = 4; c.beginPath(); c.moveTo(-6, 6); c.lineTo(0, -2); c.lineTo(8, 4); c.stroke(); c.restore(); break;
      case 'silang': barrel(L, 3, wood); c.strokeStyle = '#5A3A20'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(L - 6, -9); c.quadraticCurveTo(L - 2, 0, L - 6, 9); c.stroke(); c.strokeStyle = '#EDE6D6'; c.lineWidth = 1; c.beginPath(); c.moveTo(L - 6, -9); c.lineTo(4 - fire * 3, 0); c.lineTo(L - 6, 9); c.stroke(); c.fillStyle = '#B98A4A'; c.fillRect(4, -1, L - 4, 2); break;
      case 'api': c.strokeStyle = '#7A1E22'; c.lineWidth = 2.5; c.beginPath(); c.arc(2, 0, 11, -1.2, 1.2); c.stroke(); c.strokeStyle = '#EDE6D6'; c.lineWidth = 1; c.beginPath(); c.moveTo(2 + Math.cos(-1.2) * 11, Math.sin(-1.2) * 11); c.lineTo(-2 - fire * 3, 0); c.lineTo(2 + Math.cos(1.2) * 11, Math.sin(1.2) * 11); c.stroke();
        if (fire < 0.5) { c.fillStyle = '#B98A4A'; c.fillRect(-2, -1, 18, 2); c.fillStyle = Math.sin(t * 25) > 0 ? '#FFE07A' : '#FF6A2B'; star(c, 17, 0, 5, 4, 1.8, t * 8); } break;
      case 'lastik': c.strokeStyle = wood; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 6); c.lineTo(4, 0); c.lineTo(10, -6); c.moveTo(4, 0); c.lineTo(10, 6); c.stroke(); c.strokeStyle = '#C04A3A'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(10, -6); c.lineTo(2 - fire * 4, 0); c.lineTo(10, 6); c.stroke(); break;
      case 'petir': case 'tongkat_r': { const col = ZAPS[wid]; c.strokeStyle = wid === 'petir' ? '#5A4A8A' : '#2F6B33'; c.lineWidth = 3; c.beginPath(); c.moveTo(-4, 0); c.lineTo(L, 0); c.stroke(); glow(c, col, 14); c.fillStyle = col; circ(c, L + 2, 0, 4 + Math.sin(t * 9) * 1.2); noGlow(c);
        if (Math.sin(t * 13) > 0.6) { c.strokeStyle = col; c.lineWidth = 1.2; c.beginPath(); c.moveTo(L + 2, 0); c.lineTo(L + 8, -5); c.lineTo(L + 6, 2); c.lineTo(L + 12, 4); c.stroke(); } break; }
      case 'tesla': c.fillStyle = metal; c.fillRect(0, -3, L - 4, 6); c.strokeStyle = '#C08040'; c.lineWidth = 2; for (let i = 2; i < L - 4; i += 3) { c.beginPath(); c.moveTo(i, -5); c.lineTo(i + 1.5, 5); c.stroke(); } glow(c, '#8FE8FF', 14); c.fillStyle = '#8FE8FF'; circ(c, L, 0, 4 + Math.sin(t * 12)); noGlow(c); break;
      case 'tukul': c.strokeStyle = wood; c.lineWidth = 3; c.beginPath(); c.moveTo(-4, 0); c.lineTo(L - 2, 0); c.stroke(); c.fillStyle = '#8C96A4'; c.fillRect(L - 4, -7, 8, 14); glow(c, '#FFF06A', 10 + Math.sin(t * 10) * 5); c.fillStyle = '#FFF06A'; c.fillRect(L - 2, -2, 4, 4); noGlow(c); break;
      case 'doktor': c.fillStyle = 'rgba(200,240,255,.8)'; c.fillRect(0, -3, L - 2, 6); c.fillStyle = '#7FF0C8'; c.fillRect(1, -2, (L - 4) * (0.4 + 0.6 * (1 - fire)), 4); c.fillStyle = '#9AA0A8'; c.fillRect(L - 2, -0.6, 6, 1.2); c.fillRect(-3, -4, 3, 8); break;
      case 'roket': case 'peluru_p': c.fillStyle = wid === 'roket' ? '#6E7B3A' : '#4A5A6A'; c.fillRect(-6, -4.5, L, 9); c.fillStyle = dark; c.fillRect(-8, -5.5, 3, 11);
        if (fire < 0.4) { c.fillStyle = wd.peluru; c.beginPath(); c.moveTo(L - 6, -3); c.lineTo(L + 2, 0); c.lineTo(L - 6, 3); c.fill(); } if (wid === 'peluru_p') { c.fillStyle = '#E5484D'; circ(c, 2, -6, 2 * (0.5 + 0.5 * Math.sin(t * 8))); } break;
      case 'meriam': c.fillStyle = '#3A3F4B'; c.beginPath(); c.moveTo(0, -6); c.lineTo(L, -5); c.lineTo(L, 5); c.lineTo(0, 6); c.fill(); c.fillStyle = '#5A6070'; c.fillRect(L - 3, -6.5, 4, 13); c.fillStyle = wood; circ(c, 2, 7, 4); break;
      case 'mortar': c.save(); c.rotate(-0.5); c.fillStyle = '#5A5A40'; c.fillRect(0, -5, L, 10); c.fillStyle = '#3E3E2A'; c.fillRect(L - 2, -6, 3, 12); c.restore(); c.fillStyle = '#3E3E2A'; c.fillRect(-4, 4, 12, 3); break;
      case 'racun': case 'napalm': { const col = wid === 'racun' ? '#5DBB63' : '#E5484D'; c.fillStyle = col; rr(c, -8, -2, 9, 12, 3); c.fill(); c.fillStyle = metal; c.fillRect(0, -2.5, L, 5); c.fillStyle = dark; c.fillRect(L - 2, -3.5, 4, 7);
        if (wid === 'napalm') { c.fillStyle = Math.sin(t * 20) > 0 ? '#FFB04A' : '#FF6A2B'; circ(c, L + 3, 0, 2); } else { c.fillStyle = 'rgba(178,240,106,.7)'; circ(c, -4 + Math.sin(t * 5), 3 - ((t * 6) % 5), 1.3); } break; }
      case 'gergaji': c.fillStyle = metal; c.fillRect(-2, -4, L - 6, 8); c.save(); c.translate(L - 4, 0); c.rotate(spin * 2); c.fillStyle = '#B8C2CC'; star(c, 0, 0, 8, 6, 4, 0); c.fillStyle = dark; circ(c, 0, 0, 1.5); c.restore(); break;
      default: barrel(L, 5); c.fillStyle = dark; c.fillRect(-1, 0, 4, 7);
    }
  }
  // kilatan muncung ikut jenis senjata
  function drawMuzzle(c, wid, k) {
    const wd = WEAPONS[wid], L = wd.laras + 2; if (k <= 0) return;
    if (MUZ_HD[wid]) { c.globalAlpha = Math.min(1, k * 1.6); MUZ_HD[wid](c, wd.laras, k); c.globalAlpha = 1; return; }
    c.globalAlpha = Math.min(1, k * 1.6);
    if (ICE.includes(wid)) { c.fillStyle = '#DFF6FF'; star(c, L + 4, 0, 6, 8 * k + 3, 2, ANIM * 5); }
    else if (wid === 'napalm' || wid === 'api') { c.fillStyle = '#FFB04A'; star(c, L + 5, 0, 5, 9 * k + 3, 3, ANIM * 9); }
    else if (POISON.includes(wid)) { c.fillStyle = 'rgba(178,240,106,.85)'; circ(c, L + 5, 0, 6 * k + 2); }
    else if (ZAPS[wid]) { glow(c, ZAPS[wid], 16); c.fillStyle = ZAPS[wid]; star(c, L + 4, 0, 6, 10 * k + 3, 2, ANIM * 12); noGlow(c); }
    else if (wd.pierce >= 99 || wid === 'plasma') { glow(c, wd.peluru, 18); c.fillStyle = '#FFFFFF'; circ(c, L + 2, 0, 5 * k + 2); noGlow(c); }
    else if (wd.splash) { c.fillStyle = '#FFE07A'; star(c, L + 5, 0, 7, 11 * k + 4, 4, ANIM * 7); c.fillStyle = 'rgba(160,160,160,.6)'; circ(c, L + 8, -4, 6 * k + 2); }
    else if (['bom', 'shuriken', 'bumerang', 'lastik', 'silang', 'doktor'].includes(wid)) { /* senjata senyap */ }
    else { c.fillStyle = '#FFE07A'; star(c, L + 4, 0, 5, 8 * k + 3, 2.5, ANIM * 11); c.fillStyle = '#FFFFFF'; circ(c, L + 3, 0, 2.5 * k + 1); }
    c.globalAlpha = 1;
  }

  // ---------- hero dengan animasi ----------
  // st: { t, shooting(0..1), mood: 'main'|'menang'|'kalah', phase }
  // palet & gaya 6 set item (Perintis, Pemburu, Pahlawan, Bayang, Besi, Diraja); tahap = permata kecil
  const SETPAL = [{ m: '#F07A2E', a: '#E8ECF4', d: '#B85418' }, { m: '#7A4A2A', a: '#C8A070', d: '#4E2E18' }, { m: '#C8302A', a: '#F2C230', d: '#8A1E1A' }, { m: '#2E2E40', a: '#7A7A98', d: '#18182A' }, { m: '#8C96A4', a: '#D8DEE6', d: '#5E6672' }, { m: '#6A2A8A', a: '#F2C230', d: '#46185E' }];
  // v9.9: item Senjata kelihatan pada senjata yang dipegang — jalur warna tahap, permata, kilauan; T6+ aura berdenyut
  function wpnGear(c, wid, g, t) { const L = (WEAPONS[wid] || WEAPONS.pistol).laras, col = RARITY[g.r].warna;
    if (g.r >= 5 && !CALM()) { c.save(); c.globalAlpha = 0.22 + 0.14 * Math.sin(t * 4); const gr = c.createRadialGradient(L * 0.45, 0, 1, L * 0.45, 0, L * 0.7 + 5); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; circ(c, L * 0.45, 0, L * 0.7 + 5); c.restore(); }
    c.save(); c.strokeStyle = col; c.lineWidth = 1.3; c.globalAlpha = 0.95; c.beginPath(); c.moveTo(L * 0.25, -3.8); c.lineTo(L * 0.25, 3.2); c.moveTo(L * 0.6, -3.4); c.lineTo(L * 0.6, 2.8); c.stroke(); c.restore();
    c.fillStyle = '#FFFFFF'; circ(c, L * 0.42, -4.4, 1.9); c.fillStyle = col; if (g.r >= 3 && !LOWFX) { c.shadowColor = col; c.shadowBlur = 5; } circ(c, L * 0.42, -4.4, 1.4); c.shadowBlur = 0;
    if (g.r >= 4 && !CALM()) { const k = (t * 0.9 + L * 0.01) % 1, x = -2 + k * (L + 4); c.globalAlpha = Math.sin(k * Math.PI); c.fillStyle = '#FFFFFF'; star(c, x, -2.8, 4, 1.8, 0.5, t * 6); c.globalAlpha = 1; } }
  function gearGem(c, x, y, g) { c.fillStyle = '#FFFFFF'; circ(c, x, y, 3.1); c.fillStyle = RARITY[g.r].warna; if (g.r >= 5 && !LOWFX) { c.shadowColor = RARITY[g.r].warna; c.shadowBlur = 6; } circ(c, x, y, 2.3); c.shadowBlur = 0; }
  function gearOf(sv, h) { const e = sv.equip[h] || {}, g = {}, gv = (sv.settings && sv.settings.gearView) || 'penuh'; if (gv === 'tiada') return g; ['helm', 'baju', 'tangan', 'but', 'beg', 'senjata'].forEach(s => { if (gv === 'ringkas' && (s === 'helm' || s === 'baju' || s === 'beg')) return; const it = itemByUid(sv, e[s]); if (it) g[s] = { r: it.rar, b: (it.base || 0) % 6 }; }); return g; }
  function gearSig(sv, h) { const g = gearOf(sv, h), sk = heroSkin(sv, h); return ['helm', 'baju', 'tangan', 'but', 'beg', 'senjata'].map(s => g[s] == null ? '-' : g[s].r + '.' + g[s].b).join('') + (sk ? sk.id : '') + ((sv.settings && sv.settings.gearView) || ''); }
  function drawHero(c, x, y, id, aim, recoil, sc, wid, st) {
    st = st || { t: 0, phase: 0, mood: 'main' }; const d0 = HEROES[id], SK = st.skin, d = SK ? Object.assign({}, d0, { baju: SK.theme.baju, topi: SK.theme.topi, gaya: KEEP_GAYA.includes(d0.gaya) ? d0.gaya : SK.theme.gaya }) : d0; wid = wid || id; sc = sc || 1;
    const t = st.t, ph = st.phase || 0, fire = Math.max(0, recoil / 0.1);
    let bob = Math.sin(t * 3 + ph) * 1.4, jump = 0, shake = 0;
    if (st.mood === 'menang') jump = -Math.abs(Math.sin(t * 6 + ph)) * 12;
    if (st.mood === 'kalah') shake = Math.sin(t * 30 + ph) * 1.2;
    if (st.hurt) { shake = Math.sin(t * 60) * 2.5 * (st.hurt / 0.35); }
    const squash = 1 + fire * 0.06, blink = ((t + ph * 3) % 3.4) < 0.12;
    c.save(); c.translate(x + shake, y + jump); c.scale(sc, sc);
    if (st.hurt && !CALM()) { c.fillStyle = 'rgba(229,72,77,' + (0.35 * st.hurt / 0.35) + ')'; circ(c, 0, -2, 24); }
    if (SK && SK.rar === 1) { for (let i = 0; i < 4; i++) { const an = t * 1.5 + i * 1.57 + ph; c.fillStyle = 'rgba(255,224,122,' + (0.55 + 0.35 * Math.sin(t * 4 + i)) + ')'; star(c, Math.cos(an) * 20, -4 + Math.sin(an) * 14, 4, 3, 1.2, an); } }
    if (st.rage) { c.fillStyle = 'rgba(255,70,50,' + (0.25 + 0.15 * Math.sin(t * 12 + ph)) + ')'; circ(c, 0, 0, 26); for (let i = 0; i < 3; i++) { c.fillStyle = i % 2 ? 'rgba(255,200,60,.8)' : 'rgba(255,90,30,.8)'; const fx2 = (i - 1) * 10, fh = 10 + Math.sin(t * 20 + i * 2) * 4; c.beginPath(); c.moveTo(fx2 - 5, 22); c.quadraticCurveTo(fx2, 22 - fh * 2, fx2 + 5, 22); c.fill(); } }
    c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(0, 21 - jump * 0.0, 16 + jump * 0.3, 5, 0, 0, TAU); c.fill();
    const G = st.gear || {}, gc = g => RARITY[g.r].warna, SP = g => SETPAL[g.b];
    // kaki
    c.fillStyle = '#3A3340'; const step = st.mood === 'menang' ? 0 : Math.sin(t * 3 + ph) * 0.8;
    c.beginPath(); c.ellipse(-6, 19 + step, 5, 3, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(6, 19 - step, 5, 3, 0, 0, TAU); c.fill();
    if (G.but) { c.fillStyle = SP(G.but).m; c.beginPath(); c.ellipse(-6, 18.5 + step, 6, 3.6, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(6, 18.5 - step, 6, 3.6, 0, 0, TAU); c.fill(); c.fillStyle = SP(G.but).a; c.fillRect(-11, 20 + step, 10, 1.6); c.fillRect(1, 20 - step, 10, 1.6); }
    c.save(); c.translate(0, bob); c.scale(1 / squash, squash);
    if (d.gaya === 'rambut') { c.fillStyle = d.topi; c.beginPath(); c.ellipse(0, -6, 14, 16 + Math.sin(t * 3 + ph), 0, 0, TAU); c.fill(); }
    if (G.beg) { const P = SP(G.beg); c.fillStyle = P.m; rr(c, -19, -6, 11, 19, 4); c.fill(); rr(c, -13, -9, 12, 6, 3); c.fill(); c.fillStyle = P.a; rr(c, -18, 2, 9, 7, 2); c.fill(); c.fillStyle = P.d; c.fillRect(-19, 0, 11, 1.6); if (G.beg.r >= 3) gearGem(c, -13.5, 5.5, G.beg); }
    // badan
    c.fillStyle = d.baju; c.beginPath(); c.moveTo(-14, 18); c.quadraticCurveTo(-15, -2, 0, -2); c.quadraticCurveTo(15, -2, 14, 18); c.closePath(); c.fill();
    c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(-13, 11, 26, 3);
    if (G.baju) { const P = SP(G.baju), b0 = G.baju.b, vest = () => { c.beginPath(); c.moveTo(-12, 17); c.quadraticCurveTo(-13, 1, -5, 0); c.lineTo(0, 7); c.lineTo(5, 0); c.quadraticCurveTo(13, 1, 12, 17); c.closePath(); };
      if (b0 === 0) { c.fillStyle = P.m; vest(); c.fill(); c.fillStyle = P.a; c.fillRect(-11.5, 9, 9, 2.2); c.fillRect(2.5, 9, 9, 2.2); c.fillRect(-11.5, 13, 9, 2.2); c.fillRect(2.5, 13, 9, 2.2); }
      else if (b0 === 1) { c.fillStyle = P.m; vest(); c.fill(); c.fillStyle = d.baju; c.fillRect(-2.5, 6, 5, 11); c.fillStyle = P.a; c.beginPath(); c.moveTo(-5, 0); c.lineTo(-1, 9); c.lineTo(-7, 6); c.fill(); c.beginPath(); c.moveTo(5, 0); c.lineTo(1, 9); c.lineTo(7, 6); c.fill(); }
      else if (b0 === 2) { c.fillStyle = P.m; rr(c, -12, 0, 24, 17, 6); c.fill(); c.fillStyle = P.a; c.fillRect(-12, 10, 24, 4.5); c.fillStyle = P.d; for (let k = -10; k < 12; k += 4) { c.beginPath(); c.moveTo(k, 10); c.lineTo(k + 2, 14.5); c.lineTo(k + 4, 10); c.fill(); } }
      else if (b0 === 3) { c.fillStyle = P.m; c.beginPath(); c.moveTo(-14, 18); c.quadraticCurveTo(-14, -1, -5, -1); c.lineTo(5, -1); c.quadraticCurveTo(14, -1, 14, 18); c.closePath(); c.fill(); c.fillStyle = P.d; c.beginPath(); c.ellipse(0, 0, 8, 3.5, 0, 0, TAU); c.fill(); c.fillStyle = P.a; c.fillRect(-0.8, 3, 1.6, 14); }
      else if (b0 === 4) { c.fillStyle = P.m; vest(); c.fill(); c.strokeStyle = P.d; c.lineWidth = 1.2; for (const yy of [6, 10, 14]) { c.beginPath(); c.moveTo(-11, yy); c.lineTo(11, yy); c.stroke(); } c.fillStyle = P.a; for (const xx of [-8, 8]) for (const yy of [4, 8, 12]) circ(c, xx, yy, 0.9); }
      else { c.fillStyle = P.m; vest(); c.fill(); c.strokeStyle = P.a; c.lineWidth = 1.8; vest(); c.stroke(); c.fillStyle = P.a; for (const [xx, yy] of [[-7, 8], [7, 8], [-6, 13], [6, 13]]) star(c, xx, yy, 4, 1.8, 0.8, 0); }
      gearGem(c, 0, 10, G.baju); }
    if (G.beg != null) { c.strokeStyle = 'rgba(40,30,30,.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-8, -1); c.lineTo(-6, 14); c.moveTo(8, -1); c.lineTo(6, 14); c.stroke(); }
    if (id === 'doktor') { c.fillStyle = '#E5484D'; c.fillRect(-2, 3, 4, 9); c.fillRect(-5, 5.5, 10, 4); }
    // tangan belakang
    c.fillStyle = G.tangan ? SP(G.tangan).m : d.kulit; circ(c, -12, 8 + Math.sin(t * 3 + ph + 1) * 1.5, G.tangan ? 4.2 : 3.5); if (G.tangan) { c.fillStyle = SP(G.tangan).a; c.fillRect(-15.5, 9.5 + Math.sin(t * 3 + ph + 1) * 1.5, 7, 1.6); }
    // kepala
    const hx = Math.cos(aim) * 1.5, hy = -12 + (st.mood === 'menang' ? -1 : 0);
    c.fillStyle = d.kulit; circ(c, hx, hy, 12);
    // mata (ikut arah sasaran, berkelip)
    const ex = Math.cos(aim) * 1.6, ey = Math.sin(aim) * 1.2;
    c.fillStyle = '#2B2B33';
    if (st.hurt) { c.strokeStyle = '#2B2B33'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(hx - 6, hy - 2); c.lineTo(hx - 2, hy); c.lineTo(hx - 6, hy + 2); c.moveTo(hx + 6, hy - 2); c.lineTo(hx + 2, hy); c.lineTo(hx + 6, hy + 2); c.stroke(); }
    else if (blink || st.mood === 'menang') { c.lineWidth = 1.6; c.strokeStyle = '#2B2B33'; c.beginPath(); c.arc(hx - 4, hy + (st.mood === 'menang' ? 1 : 0), 2, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.beginPath(); c.arc(hx + 4, hy + (st.mood === 'menang' ? 1 : 0), 2, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
    else { c.fillStyle = '#FFFFFF'; circ(c, hx - 4, hy, 3); circ(c, hx + 4, hy, 3); c.fillStyle = '#2B2B33'; circ(c, hx - 4 + ex, hy + ey, 1.8); circ(c, hx + 4 + ex, hy + ey, 1.8); }
    if (st.mood === 'kalah') { c.fillStyle = '#7FC8FF'; circ(c, hx + 8, hy + 2 + ((t * 20) % 6), 1.6); }
    if (st.rage) { c.strokeStyle = '#2B2B33'; c.lineWidth = 2; c.beginPath(); c.moveTo(hx - 8, hy - 6); c.lineTo(hx - 2, hy - 3); c.moveTo(hx + 8, hy - 6); c.lineTo(hx + 2, hy - 3); c.stroke(); }
    c.fillStyle = st.rage ? 'rgba(240,60,60,.6)' : 'rgba(240,110,110,.45)'; circ(c, hx - 7, hy + 4, 2.4); circ(c, hx + 7, hy + 4, 2.4);
    // mulut: 'O' semasa menembak, senyum biasa, sedih bila kalah
    c.strokeStyle = '#7A4A3A'; c.lineWidth = 1.4;
    if (fire > 0.3) { c.fillStyle = '#7A3A3A'; circ(c, hx, hy + 4.5, 2); }
    else if (st.mood === 'kalah') { c.beginPath(); c.arc(hx, hy + 7, 3, Math.PI * 1.2, Math.PI * 1.8); c.stroke(); }
    else { c.beginPath(); c.arc(hx, hy + 3, st.mood === 'menang' ? 4 : 3, 0.2, Math.PI - 0.2); c.stroke(); }
    // topi
    c.fillStyle = d.topi;
    switch (d.gaya) {
      case 'tudung': c.beginPath(); c.arc(hx, hy - 1, 14, Math.PI * 1.02, -0.02); c.fill(); c.beginPath(); c.arc(hx - 12, hy + 7, 5, 0, TAU); c.arc(hx + 12, hy + 7, 5, 0, TAU); c.fill(); break;
      case 'bandana': c.fillRect(hx - 12, hy - 10, 24, 6); c.beginPath(); c.moveTo(hx + 11, hy - 8); c.lineTo(hx + 18, hy - 12 + Math.sin(t * 6 + ph) * 2); c.lineTo(hx + 17, hy - 3 + Math.sin(t * 6 + ph) * 2); c.fill(); break;
      case 'topi': c.fillRect(hx - 14, hy - 9, 28, 4); c.beginPath(); c.arc(hx, hy - 8, 9, Math.PI, 0); c.fill(); break;
      case 'ketayap': c.beginPath(); c.arc(hx, hy - 3, 12, Math.PI, 0); c.fill(); c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(hx, hy + 10, 7, 0, Math.PI); c.fill(); break;
      case 'rambut': c.beginPath(); c.arc(hx, hy - 3, 12.5, Math.PI, 0); c.fill(); c.beginPath(); c.arc(hx - 9, hy - 7, 5, 0, TAU); c.fill(); break;
      case 'hardhat': c.beginPath(); c.arc(hx, hy - 3, 12.5, Math.PI, 0); c.fill(); c.fillRect(hx - 15, hy - 4, 30, 3.5); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(hx - 2, hy - 15, 4, 10); break;
      case 'helmet': c.beginPath(); c.arc(hx, hy - 2, 13.5, Math.PI * 1.05, -0.05); c.fill(); c.fillRect(hx - 14, hy - 3, 28, 3); c.strokeStyle = '#2B2B33'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(hx - 10, hy); c.quadraticCurveTo(hx, hy + 13, hx + 10, hy); c.stroke(); break;
      case 'koboi': c.beginPath(); c.ellipse(hx, hy - 6, 19, 4.5, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(hx, hy - 7, 9, Math.PI, 0); c.fill(); c.fillRect(hx - 9, hy - 10, 18, 4); c.fillStyle = '#C8302A'; c.fillRect(hx - 9, hy - 9, 18, 2); break;
      case 'ninja': c.beginPath(); c.arc(hx, hy - 1, 13, Math.PI, 0); c.fill(); c.fillRect(hx - 13, hy + 2, 26, 9); c.fillStyle = d.kulit; c.fillRect(hx - 10, hy - 4, 20, 7); c.fillStyle = '#FFFFFF'; circ(c, hx - 4, hy - 0.5, 2.2); circ(c, hx + 4, hy - 0.5, 2.2); c.fillStyle = '#2B2B33'; circ(c, hx - 4 + ex, hy - 0.5 + ey, 1.3); circ(c, hx + 4 + ex, hy - 0.5 + ey, 1.3); c.fillStyle = '#C8302A'; c.beginPath(); c.moveTo(hx + 12, hy - 4); c.lineTo(hx + 20, hy - 8 + Math.sin(t * 7 + ph) * 3); c.lineTo(hx + 18, hy - 1 + Math.sin(t * 7 + ph) * 3); c.fill(); break;
      case 'goggles': c.beginPath(); c.arc(hx, hy - 3, 12.5, Math.PI, 0); c.fill(); c.fillStyle = '#2B2B33'; c.fillRect(hx - 12, hy - 8, 24, 3); c.fillStyle = '#9FE6FF'; circ(c, hx - 5, hy - 7, 3.6); circ(c, hx + 5, hy - 7, 3.6); c.fillStyle = 'rgba(255,255,255,.7)'; circ(c, hx - 6, hy - 8, 1.2); circ(c, hx + 4, hy - 8, 1.2); break;
      case 'mahkota': c.beginPath(); c.ellipse(hx, hy - 1, 14, 16, 0, Math.PI, 0); c.fill(); c.fillRect(hx - 14, hy - 1, 5, 18); c.fillRect(hx + 9, hy - 1, 5, 18); c.fillStyle = '#9FE6FF'; c.beginPath(); c.moveTo(hx - 8, hy - 9); c.lineTo(hx - 6, hy - 17); c.lineTo(hx - 2, hy - 11); c.lineTo(hx, hy - 20); c.lineTo(hx + 2, hy - 11); c.lineTo(hx + 6, hy - 17); c.lineTo(hx + 8, hy - 9); c.closePath(); c.fill(); c.fillStyle = '#FFFFFF'; circ(c, hx, hy - 16, 1.5); break;
      case 'tengkolok': c.beginPath(); c.moveTo(hx - 13, hy - 4); c.lineTo(hx - 10, hy - 14); c.lineTo(hx + 4, hy - 18); c.lineTo(hx + 14, hy - 8); c.lineTo(hx + 13, hy - 4); c.closePath(); c.fill(); c.fillStyle = '#C8302A'; c.fillRect(hx - 13, hy - 6, 26, 3); c.fillStyle = '#FFE07A'; star(c, hx + 2, hy - 11, 4, 3, 1.2, 0); break;
      case 'beret': c.beginPath(); c.ellipse(hx + 2, hy - 8, 14, 6, -0.15, 0, TAU); c.fill(); c.fillStyle = '#F5B82E'; circ(c, hx - 6, hy - 8, 2.2); break;
      default: c.beginPath(); c.arc(hx, hy - 4, 11, Math.PI, 0); c.fill(); c.fillRect(hx, hy - 6, 15, 4);
    }
    if (G.helm) { const P = SP(G.helm), b0 = G.helm.b;
      if (b0 === 0) { c.fillStyle = P.m; c.beginPath(); c.arc(hx, hy - 2, 13.5, Math.PI * 1.04, -0.04); c.fill(); c.fillRect(hx - 15.5, hy - 3, 31, 3.4); c.fillStyle = P.d; c.fillRect(hx - 1, hy - 15, 2, 12); c.fillStyle = '#FFF6C8'; if (!LOWFX) { c.shadowColor = '#FFF0A0'; c.shadowBlur = 8; } circ(c, hx, hy - 8, 3.2); c.shadowBlur = 0; gearGem(c, hx + 8, hy - 6, G.helm); }
      else if (b0 === 1) { c.fillStyle = P.m; c.beginPath(); c.ellipse(hx, hy - 4, 20, 4.5, 0, 0, TAU); c.fill(); rr(c, hx - 9, hy - 17, 18, 14, 5); c.fill(); c.fillStyle = P.d; c.fillRect(hx - 9, hy - 8, 18, 3); gearGem(c, hx + 5, hy - 6.5, G.helm); }
      else if (b0 === 2) { c.fillStyle = P.m; c.beginPath(); c.arc(hx, hy - 3, 13, Math.PI * 1.05, -0.05); c.fill(); c.beginPath(); c.moveTo(hx + 2, hy - 15); c.lineTo(hx + 15, hy - 22); c.lineTo(hx + 11, hy - 9); c.fill(); c.fillStyle = P.a; c.fillRect(hx - 13.5, hy - 5, 27, 2.6); c.strokeStyle = P.a; c.lineWidth = 1.2; c.beginPath(); c.moveTo(hx - 6, hy - 13); c.lineTo(hx + 4, hy - 6); c.stroke(); gearGem(c, hx - 4, hy - 9, G.helm); }
      else if (b0 === 3) { c.fillStyle = P.m; c.beginPath(); c.arc(hx, hy - 2, 14.5, Math.PI, 0); c.lineTo(hx + 14.5, hy + 8); c.lineTo(hx + 9, hy + 8); c.lineTo(hx + 9, hy - 1); c.lineTo(hx - 9, hy - 1); c.lineTo(hx - 9, hy + 8); c.lineTo(hx - 14.5, hy + 8); c.closePath(); c.fill(); c.beginPath(); c.moveTo(hx - 14, hy - 4); c.lineTo(hx - 24, hy - 8 + Math.sin(t * 6 + ph) * 2); c.lineTo(hx - 14, hy + 1); c.fill(); gearGem(c, hx, hy - 9, G.helm); }
      else if (b0 === 4) { c.fillStyle = P.m; c.beginPath(); c.arc(hx, hy - 2, 14, Math.PI * 1.02, -0.02); c.fill(); c.fillRect(hx - 15, hy - 3, 30, 3.4); c.fillStyle = P.d; c.fillRect(hx - 1.2, hy - 16, 2.4, 13); c.fillStyle = P.a; for (const xx of [-10, -5, 5, 10]) circ(c, hx + xx, hy - 1.4, 1); gearGem(c, hx - 7, hy - 8, G.helm); }
      else { c.fillStyle = P.a; c.beginPath(); c.moveTo(hx - 12, hy - 4); c.lineTo(hx - 12, hy - 15); c.lineTo(hx - 6, hy - 9); c.lineTo(hx, hy - 18); c.lineTo(hx + 6, hy - 9); c.lineTo(hx + 12, hy - 15); c.lineTo(hx + 12, hy - 4); c.closePath(); c.fill(); c.fillStyle = P.m; c.fillRect(hx - 12, hy - 6, 24, 3); c.fillStyle = '#E5484D'; circ(c, hx - 12, hy - 15, 1.6); circ(c, hx + 12, hy - 15, 1.6); gearGem(c, hx, hy - 11, G.helm); } }
    // tangan depan + senjata (berpaling ke sasaran, tolak ke belakang bila menembak)
    c.save(); c.translate(HERO_ARM.x, HERO_ARM.y); c.rotate(aim); c.translate(-fire * 4, 0);
    if (G.senjata && G.senjata.r >= 3 && !LOWFX) { c.shadowColor = gc(G.senjata); c.shadowBlur = 5 + G.senjata.r * 1.5; } c.scale(WPN_SC, WPN_SC); drawWeapon(c, wid, t, fire, st.spin || t * 3, st.wlv); c.shadowBlur = 0; if (G.senjata) wpnGear(c, wid, G.senjata, t);
    c.fillStyle = G.tangan ? SP(G.tangan).m : d.kulit; circ(c, 1, 0, G.tangan ? 4.6 : 4); if (G.tangan) { c.fillStyle = SP(G.tangan).a; c.fillRect(-2.5, 2.4, 7, 1.6); }
    drawMuzzle(c, wid, fire);
    c.restore();
    c.restore();
    c.restore();
  }

