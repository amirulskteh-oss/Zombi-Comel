  // ================= ANIMASI RAMPASAN: peti item & kristal shard =================
  const BAG = { x: W - 26, y: 26 };
  let bagBump = 0;
  const ease = k => 1 - Math.pow(1 - k, 3);
  function lootChest(c, x, y, s, rar, open, shake) {
    const R0 = RARITY[rar], fancy = rar >= 4, body = rar >= 6 ? '#3A3F8A' : fancy ? '#F2C230' : rar >= 2 ? '#3B82C4' : '#B8763E', band = rar >= 6 ? '#9AA8FF' : fancy ? '#B08A20' : rar >= 2 ? '#1E3A6A' : '#6E4520';
    c.save(); c.translate(x + (shake ? Math.sin(ANIM * 60) * shake : 0), y); c.scale(s, s);
    c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(0, 12, 14, 4, 0, 0, TAU); c.fill();
    if (open > 0) { c.save(); c.globalAlpha = Math.min(1, open * 2); glow(c, R0.warna, 20); c.fillStyle = R0.warna; c.beginPath(); for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.28 + Math.sin(ANIM * 3) * .05; c.moveTo(0, -2); c.lineTo(Math.cos(a - .06) * 46 * open, -2 + Math.sin(a - .06) * 46 * open); c.lineTo(Math.cos(a + .06) * 46 * open, -2 + Math.sin(a + .06) * 46 * open); } c.fill(); noGlow(c); c.restore(); }
    c.fillStyle = body; rr(c, -13, -4, 26, 16, 3); c.fill();
    c.fillStyle = band; c.fillRect(-13, -4, 26, 3); c.fillRect(-7, -4, 3, 16); c.fillRect(4, -4, 3, 16);
    c.save(); c.translate(-13, -4); c.rotate(-open * 1.6); c.fillStyle = body; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(13, -14, 26, 0); c.closePath(); c.fill(); c.fillStyle = band; c.fillRect(6, -8, 3, 8); c.fillRect(17, -8, 3, 8); c.restore();
    c.fillStyle = '#FFE07A'; rr(c, -3, -2, 6, 6, 1.5); c.fill();
    c.restore();
  }
  function crystal(c, x, y, s, col, spin) {
    c.save(); c.translate(x, y); c.scale(s * Math.max(0.25, Math.abs(Math.cos(spin))), s);
    glow(c, col, 14); c.fillStyle = col; c.beginPath(); c.moveTo(0, -12); c.lineTo(7, -3); c.lineTo(4, 11); c.lineTo(-4, 11); c.lineTo(-7, -3); c.closePath(); c.fill(); noGlow(c);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.moveTo(0, -12); c.lineTo(-3, -3); c.lineTo(0, 8); c.lineTo(2, -3); c.closePath(); c.fill();
    c.restore();
  }
  function rarChip(r) { return '<span class="rchip" style="background:' + RARITY[r].warna + '" title="Tahap ' + (r + 1) + ' daripada 10">T' + (r + 1) + '</span>'; }
  function itemGlyph(c, x, y, s, jenis, col) {
    c.save(); c.translate(x, y); c.scale(s, s); glow(c, col, 12); c.fillStyle = col; circ(c, 0, 0, 9); noGlow(c); c.fillStyle = '#FFFFFF'; c.strokeStyle = '#FFFFFF'; c.lineWidth = 2;
    if (jenis === 'senjata') { c.fillRect(-5, -1.5, 9, 3); c.fillRect(-5, -1.5, 3, 6); }
    else if (jenis === 'helm') { c.beginPath(); c.arc(0, 2, 6, Math.PI, 0); c.fill(); c.fillRect(-7, 1.5, 14, 2.5); }
    else if (jenis === 'baju') { c.beginPath(); c.moveTo(-6, -4); c.lineTo(-2, -5); c.lineTo(0, -2); c.lineTo(2, -5); c.lineTo(6, -4); c.lineTo(5, 6); c.lineTo(-5, 6); c.closePath(); c.fill(); }
    else if (jenis === 'tangan') { rr(c, -4, -2, 8, 8, 2.5); c.fill(); for (let i = 0; i < 4; i++) { rr(c, -4 + i * 2.2, -6, 1.8, 5, 0.9); c.fill(); } }
    else if (jenis === 'but') { c.beginPath(); c.moveTo(-3, -6); c.lineTo(2, -6); c.lineTo(2, 2); c.lineTo(7, 3); c.lineTo(7, 6); c.lineTo(-3, 6); c.closePath(); c.fill(); }
    else if (jenis === 'beg') { rr(c, -5, -3, 10, 9, 2.5); c.fill(); c.lineWidth = 1.6; c.beginPath(); c.arc(0, -3, 3, Math.PI, 0); c.stroke(); }
    else { c.beginPath(); c.moveTo(0, -5); c.lineTo(5, -3); c.quadraticCurveTo(5, 3, 0, 6); c.quadraticCurveTo(-5, 3, -5, -3); c.closePath(); c.fill(); }
    c.restore();
  }
  // laluan: lantun keluar (0–0.4), buka/tunjuk (0.4–1.0), terbang ke beg (1.0–hujung)
  function drawLoot(f) {
    const L = f.life, t = f.t, hopEnd = 0.4, showEnd = L - 0.6;
    const gx = f.x + f.dir * 26, gy = Math.min(WALL_Y - 30, f.y + 6);
    let x, y, s = 1;
    if (t < hopEnd) { const k = t / hopEnd; x = f.x + (gx - f.x) * k; y = f.y + (gy - f.y) * k - Math.sin(k * Math.PI) * 34; s = 0.6 + 0.4 * k; }
    else if (t < showEnd) { x = gx; y = gy - Math.abs(Math.sin((t - hopEnd) * 14)) * 4 * (1 - (t - hopEnd) / (showEnd - hopEnd)); }
    else { const k = ease((t - showEnd) / 0.6); x = gx + (BAG.x - gx) * k; y = gy + (BAG.y - gy) * k - Math.sin(k * Math.PI) * 40; s = 1 - 0.55 * k; }
    if (f.sub === 'item') {
      const R0 = RARITY[f.rar];
      if (t < showEnd) {
        const open = t < hopEnd + 0.15 ? 0 : Math.min(1, (t - hopEnd - 0.15) / 0.25), shake = t > hopEnd && t < hopEnd + 0.15 ? 2 : 0;
        if (open > 0 && !f._burst) { f._burst = true; emit(x, y - 6, 10 + f.rar * 3, { a: -Math.PI / 2, spread: 2.2, spd: 120, up: 40, warna: [R0.warna, '#FFFFFF', '#FFE07A'], size: 3, life: 0.7, grav: 160, shape: 'star' }); }
        lootChest(ctx, x, y, 1.5, f.rar, open, shake);
        if (open > 0.5) { itemGlyph(ctx, x, y - 28 - open * 8, 1.3, f.jenis, R0.warna); label(ctx, 'T' + (f.rar + 1) + ' ' + R0.nama, x, y - 56, 14, R0.warna); }
      } else { lootChest(ctx, gx, gy, 1.5 * (1 - (t - showEnd) / 0.6), f.rar, 1, 0); itemGlyph(ctx, x, y, 1.3 * s, f.jenis, R0.warna); if (Math.random() < 0.6) emit(x, y, 1, { spd: 20, warna: R0.warna, size: 2.2, life: 0.4, shape: 'star' }); }
    } else {
      const col = TIERS[f.tier].warna;
      if (t < 0.05 && !f._burst) { f._burst = true; emit(f.x, f.y, 10, { spd: 100, warna: [col, '#FFFFFF'], size: 2.5, life: 0.5, shape: 'star' }); }
      crystal(ctx, x, y, 1.45 * s, col, ANIM * 5 + f.x);
      if (t < showEnd) label(ctx, '+' + f.n + ' shard', x, y - 28, 14, col);
      else if (Math.random() < 0.6) emit(x, y, 1, { spd: 15, warna: col, size: 2, life: 0.35, shape: 'star' });
    }
    if (t >= L - 0.04 && !f._bag) { f._bag = true; bagBump = 0.35; emit(BAG.x, BAG.y, 8, { spd: 80, warna: ['#FFE07A', '#FFFFFF'], size: 2.5, life: 0.4, shape: 'star' }); }
  }
  function drawBag() {
    if (bagBump > 0) bagBump -= 1 / 60;
    const s = 1 + Math.max(0, bagBump) * 0.8;
    ctx.save(); ctx.translate(BAG.x, BAG.y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(30,40,60,.55)'; circ(ctx, 0, 0, 17);
    ctx.fillStyle = '#C98B4E'; rr(ctx, -9, -5, 18, 14, 4); ctx.fill(); ctx.fillStyle = '#8A5A30'; ctx.fillRect(-9, -2, 18, 2.5); ctx.strokeStyle = '#8A5A30'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -5, 5, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#FFE07A'; rr(ctx, -2, 0, 4, 4, 1); ctx.fill();
    const ln = battle && battle.lootN || 0; if (ln > 0) { const tx = String(Math.min(99, ln)); ctx.fillStyle = '#E5484D'; circ(ctx, 12, -11, 8); ctx.fillStyle = '#FFFFFF'; ctx.font = '800 10px "Nunito", system-ui'; ctx.textAlign = 'center'; ctx.fillText(tx, 12, -7.5); }
    ctx.restore();
  }

  // ================= BUNYI & MUZIK (Web Audio, dijana dengan kod) =================
  const AU = { ctx: null, sfx: null, mus: null, noise: null, last: {}, step: 0, nextT: 0, timer: null, boss: false };
  function auInit() {
    if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try {
      auAttach(new AC());
      auVolume(); AU.nextT = AU.ctx.currentTime + 0.1; AU.timer = setInterval(musicTick, 90);
    } catch (e) { AU.ctx = null; }
  }
  function auAttach(c) {
    AU.ctx = c; AU.sfx = c.createGain(); AU.mus = c.createGain(); AU.vox = c.createGain(); AU.amb = c.createGain();
    // v9.17: semua bunyi → kuat keseluruhan (boleh sehingga 300%) → pemampat/penghad (elak bunyi pecah) → pembesar suara
    AU.master = c.createGain(); let out = c.destination; try { const k = c.createDynamicsCompressor(); k.threshold.value = -16; k.knee.value = 8; k.ratio.value = 10; k.attack.value = 0.003; k.release.value = 0.2; k.connect(c.destination); out = k; } catch (e) {} AU.master.connect(out);
    AU.sfx.connect(AU.master); AU.mus.connect(AU.master); AU.vox.connect(AU.sfx); AU.amb.connect(AU.master);
    const len = c.sampleRate * 0.5, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; AU.noise = buf;
    AU.live = []; AU.ambKind = null; AU.ambNodes = [];
  }
  function auVolume() { if (!AU.ctx) return; if (AU.master) AU.master.gain.value = save.settings.master == null ? 2 : save.settings.master; AU.sfx.gain.value = save.settings.sfx * 0.6; AU.mus.gain.value = save.settings.music * 0.25; if (AU.vox) AU.vox.gain.value = save.settings.voice === false ? 0 : 1; if (AU.amb) AU.amb.gain.value = (save.settings.amb == null ? 0.4 : save.settings.amb) * 0.5; }
  // kurangkan muzik seketika (boss muncul / letupan besar)
  function duck(level, sec) { if (!AU.ctx || !AU.mus) return; const g = AU.mus.gain, t = AU.ctx.currentTime, full = save.settings.music * 0.25; try { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(full * level, t + 0.08); g.setValueAtTime(full * level, t + sec); g.linearRampToValueAtTime(full, t + sec + 0.6); } catch (e) {} }
  let CUR_DEST = null;
  function panTo(x, base) { const c = AU.ctx; if (x == null || !c.createStereoPanner) return base; const p = c.createStereoPanner(); p.pan.value = Math.max(-0.8, Math.min(0.8, (x / W) * 2 - 1)) * 0.75; p.connect(base); return p; }
  // suara 'vokal' (sintesis forman): gergaji → 2 penapis jalur ikut vokal; geram = modulasi amplitud
  const VOWEL = { u: [330, 820], o: [480, 960], a: [760, 1220], e: [430, 1880], i: [300, 2300], h: [1400, 2700] };
  function voice(f0, vw, dur, vol, o) {
    o = o || {}; const c = AU.ctx, t = o.when || c.currentTime, out = o.dest || CUR_DEST || AU.vox || AU.sfx;
    const src = c.createOscillator(); src.type = 'sawtooth'; src.frequency.setValueAtTime(f0, t); if (o.f1) src.frequency.exponentialRampToValueAtTime(Math.max(30, o.f1), t + dur);
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = o.vib || 5.5; lg.gain.value = f0 * (o.vibAmt || 0.025); lfo.connect(lg); lg.connect(src.frequency);
    const am = c.createGain(); am.gain.value = 1; let gr = null;
    if (o.growl) { gr = c.createOscillator(); const gg = c.createGain(); gr.type = 'square'; gr.frequency.value = o.growl; gg.gain.value = 0.4; gr.connect(gg); gg.connect(am.gain); }
    const env = c.createGain(), pk = vol * 6; env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(pk, t + (o.att || 0.05)); env.gain.setValueAtTime(pk, t + dur * 0.55); env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(am); (VOWEL[vw] || VOWEL.o).forEach((fr, i) => { const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fr * (o.fm || 1); bp.Q.value = 6; const g = c.createGain(); g.gain.value = i ? 0.55 : 1; am.connect(bp); bp.connect(g); g.connect(env); });
    if (o.echo && c.createDelay) { const dl = c.createDelay(1), fb = c.createGain(); dl.delayTime.value = o.echo; fb.gain.value = 0.38; env.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(out); }
    env.connect(out); src.start(t); lfo.start(t); src.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05); if (gr) { gr.start(t); gr.stop(t + dur + 0.05); }
  }
  // bunyi baharu v8.1 (zombie, boss, hero, menara, antara muka)
  const SFX2 = {
    zGroan(a, t) { const r = (a && a.r) || 14, f0 = Math.max(70, Math.min(210, 250 - r * 5)), vw = Math.random() < 0.5 ? 'u' : 'o', d = 0.45 + Math.random() * 0.35; voice(f0, vw, d, 0.02, { f1: f0 * 0.82, growl: 22 + Math.random() * 10, vib: 4 }); },
    zDirt(a, t) { noise(0.28, 0.12, 'lowpass', 700, 180); tone('sine', 120, 70, 0.16, 0.08); },
    zHup() { voice(300, 'e', 0.16, 0.028, { f1: 470, att: 0.02 }); },
    zWhisper() { const c = AU.ctx, t = c.currentTime; noise(0.55, 0.05, 'bandpass', 2400, 1600); voice(160, 'h', 0.55, 0.025, { f1: 120, echo: 0.19, vibAmt: 0.06 }); },
    zHeal() { tone('sine', 1320, 1320, 0.3, 0.035); tone('sine', 1760, 1760, 0.35, 0.03, AU.ctx.currentTime + 0.07); tone('sine', 2093, 2093, 0.3, 0.02, AU.ctx.currentTime + 0.14); },
    spit() { noise(0.06, 0.08, 'bandpass', 1900); tone('triangle', 520, 170, 0.13, 0.06, AU.ctx.currentTime + 0.03); },
    clank() { tone('triangle', 2350, 2200, 0.09, 0.045); tone('square', 3150, 3000, 0.05, 0.018); noise(0.04, 0.04, 'highpass', 4200); },
    tick() { tone('square', 2100, 2100, 0.025, 0.035); },
    thud() { noise(0.18, 0.13, 'lowpass', 420, 110); tone('sine', 115, 58, 0.18, 0.12); },
    step() { tone('sine', 70, 42, 0.18, 0.09); noise(0.12, 0.06, 'lowpass', 500, 120); },
    crunch() { noise(0.22, 0.16, 'lowpass', 1400, 300); noise(0.08, 0.06, 'highpass', 3500, null, AU.ctx.currentTime + 0.03); tone('sine', 95, 55, 0.16, 0.09); },
    clangW() { tone('triangle', 640, 600, 0.35, 0.05); tone('square', 960, 930, 0.18, 0.016); tone('sine', 150, 90, 0.18, 0.1); noise(0.05, 0.05, 'highpass', 3000); },
    glassW() { [2350, 3140, 2790].forEach((f, i) => tone('sine', f, f * 0.98, 0.25, 0.03, AU.ctx.currentTime + i * 0.035)); noise(0.1, 0.05, 'highpass', 5000); },
    roar(k) { const P = { lendir: [105, 'o', 16, 1.2, 0.8], jeneral: [82, 'a', 30, 1.3, 1], ratu: [210, 'e', 0, 1.2, 1.1], besi: [68, 'o', 26, 1.4, 0.9], naga: [92, 'a', 34, 1.6, 1], gorila: [75, 'o', 28, 1.4, 1], badut: [260, 'a', 8, 1.0, 1.2], pemanah: [120, 'e', 18, 1.0, 1], sihir: [150, 'u', 12, 1.3, 1.1], labah: [190, 'i', 20, 1.0, 1.2], ais: [70, 'u', 10, 1.5, 0.8], robot: [110, 'a', 40, 1.1, 1], ular: [130, 'h', 0, 1.3, 1], kelawar: [300, 'i', 14, 0.9, 1.3], ketam: [95, 'o', 22, 1.1, 1] }[k] || [100, 'u', 24, 1, 1];
      voice(P[0], P[1], P[3], 0.075, { f1: P[0] * 0.7, growl: P[2], fm: P[4], vib: 3, att: 0.12 }); voice(P[0] * 1.5, P[1], P[3] * 0.9, 0.035, { f1: P[0], growl: P[2] ? P[2] + 4 : 0, fm: P[4] });
      noise(P[3], 0.07, 'lowpass', 900, 150);
      if (k === 'jeneral') for (let i = 0; i < 6; i++) noise(0.03, 0.05, 'bandpass', 3200, 0, AU.ctx.currentTime + 0.15 + i * 0.12);
      if (k === 'ratu') noise(1, 0.05, 'highpass', 3000, 6000);
      if (k === 'besi') { tone('triangle', 900, 700, 0.5, 0.04); tone('triangle', 1350, 1100, 0.4, 0.025); }
      if (k === 'naga') noise(1.2, 0.09, 'bandpass', 300, 1800, AU.ctx.currentTime + 0.3);
      if (k === 'lendir') for (let i = 0; i < 5; i++) tone('sine', 300 + i * 70, 600 + i * 90, 0.08, 0.04, AU.ctx.currentTime + 0.2 + i * 0.16); },
    warn() { const t = AU.ctx.currentTime; tone('square', 880, 880, 0.08, 0.05, t); tone('square', 880, 880, 0.08, 0.05, t + 0.16); },
    rage() { voice(95, 'a', 0.8, 0.07, { f1: 140, growl: 30, att: 0.1 }); noise(0.8, 0.06, 'bandpass', 300, 2400); },
    bossDie() { noise(1.2, 0.3, 'lowpass', 1100, 50); tone('sine', 80, 30, 1, 0.3); const t = AU.ctx.currentTime; [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, 0.45, 0.06, t + 0.5 + i * 0.1)); },
    cheer() { const t = AU.ctx.currentTime; [[330, 0], [392, 0.03], [440, 0.06]].forEach(([f, d]) => voice(f, 'a', 0.45, 0.03, { f1: f * 1.18, when: t + d, vib: 7, vibAmt: 0.04, att: 0.03 })); },
    ouch() { voice(430, 'a', 0.22, 0.045, { f1: 300, att: 0.02 }); },
    skill(h) { const k = String(h || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % 7, b = 523 * Math.pow(2, k / 12), t = AU.ctx.currentTime; tone('triangle', b, b, 0.12, 0.05, t); tone('triangle', b * 1.5, b * 1.5, 0.16, 0.045, t + 0.07); noise(0.25, 0.03, 'highpass', 5000, 0, t + 0.05); },
    bthrow(k) { const t = AU.ctx.currentTime; if (k === 'panah') { noise(0.08, 0.05, 'highpass', 3000); return; } if (k === 'jaring') { tone('sine', 900, 300, 0.2, 0.03); noise(0.12, 0.04, 'bandpass', 2000); return; } noise(0.25, 0.08, 'bandpass', k === 'apiS' ? 900 : 500, 200); tone('sine', 180, 90, 0.2, 0.05, t); },
    pdown() { const t = AU.ctx.currentTime; tone('square', 880, 1320, 0.07, 0.04, t); tone('triangle', 1320, 1760, 0.12, 0.035, t + 0.05); noise(0.06, 0.05, 'highpass', 3000); },
    wskill(m) { const t = AU.ctx.currentTime; noise(0.22, 0.12, 'lowpass', 600, 200); tone('sine', 110, 60, 0.25, 0.1, t);
      const b = [392, 440, 494, 523, 587, 659, 698, 784, 880, 988][m || 0] || 523; tone('triangle', b, b, 0.14, 0.05, t + 0.08); tone('triangle', b * 1.5, b * 1.5, 0.2, 0.045, t + 0.18); tone('sine', b * 2, b * 2, 0.3, 0.03, t + 0.28); },
    wpost(m) { const t = AU.ctx.currentTime, metal = m >= 4 && m !== 6; if (metal) { tone('triangle', 900, 860, 0.12, 0.04, t); tone('square', 1800, 1750, 0.05, 0.012, t); } noise(0.07, 0.09, 'lowpass', metal ? 1600 : 800, 300); tone('sine', 150 + (m || 0) * 12, 70, 0.12, 0.09, t); },
    wbuilt() { const t = AU.ctx.currentTime; [523, 659, 784, 1046].forEach((f, i) => tone('triangle', f, f, 0.22, 0.045, t + i * 0.08)); },
    tower(ty) {
      if (ty === 'petir') { noise(0.08, 0.07, 'bandpass', 3200, 1500); tone('square', 700, 1300, 0.05, 0.02); return; }
      if (ty === 'api') { noise(0.18, 0.1, 'bandpass', 900, 500); return; }
      if (ty === 'racun') { noise(0.14, 0.06, 'bandpass', 1500, 700); tone('sine', 320, 260, 0.1, 0.02); return; }
      if (ty === 'tepat') { noise(0.05, 0.12, 'highpass', 1800); tone('sine', 180, 60, 0.18, 0.1); return; }
      if (ty === 'laser') { tone('sawtooth', 1600, 600, 0.16, 0.025); tone('sine', 2400, 1200, 0.12, 0.02); return; }
      if (ty === 'angin') { noise(0.3, 0.12, 'bandpass', 500, 1600); return; }
      if (ty === 'tukang') { tone('triangle', 1250, 1200, 0.07, 0.05); tone('triangle', 1650, 1600, 0.06, 0.035, AU.ctx.currentTime + 0.08); return; }
      if (ty === 'meriam') { noise(0.16, 0.1, 'lowpass', 700, 120); tone('sine', 140, 60, 0.15, 0.09); } else if (ty === 'ais') tone('sine', 1500, 900, 0.1, 0.04); else { tone('triangle', 720, 340, 0.08, 0.05); noise(0.04, 0.03, 'highpass', 3500); } },
    zap() { noise(0.12, 0.07, 'bandpass', 3200, 1400); tone('square', 900, 1800, 0.06, 0.025); },
    whoosh() { noise(0.35, 0.22, 'bandpass', 400, 2200); tone('sawtooth', 90, 140, 0.3, 0.025); },
    hiss() { noise(0.6, 0.04, 'highpass', 2500, 5000); },
    swish() { noise(0.12, 0.1, 'bandpass', 900, 3200); },
    popup() { tone('sine', 520, 880, 0.08, 0.05); },
    popdown() { tone('sine', 700, 420, 0.08, 0.04); },
    equip() { const t = AU.ctx.currentTime; tone('square', 1400, 1400, 0.03, 0.035, t); tone('square', 1000, 1000, 0.04, 0.035, t + 0.05); },
    fuse() { tone('sine', 300, 900, 0.25, 0.05); tone('triangle', 1568, 1568, 0.3, 0.05, AU.ctx.currentTime + 0.25); },
    count() { tone('sine', 1800, 1800, 0.04, 0.07); tone('sine', 2700, 2700, 0.03, 0.025); }
  };
  const VOICE_SFX = { zGroan: 1, zHup: 1, zWhisper: 1, roar: 1, rage: 1, cheer: 1, ouch: 1 };
  const SFX_IMPORTANT = { roar: 1, warn: 1, bossDie: 1, win: 1, lose: 1, chest: 1, trophy: 1, click: 1, cheer: 1, rage: 1, up: 1, star: 1, popup: 1, popdown: 1, swish: 1, equip: 1, fuse: 1, bad: 1 };
  const SFX_GAP2 = { zGroan: 0.9, zWhisper: 0.6, zHup: 0.15, zHeal: 0.4, spit: 0.12, clank: 0.09, tick: 0.2, thud: 0.12, tower: 0.06, count: 0.05, skill: 0.25, zDirt: 0.15, ouch: 3 };
  // suasana latar ikut tempat & masa
  function ambKindFor(stage) { const bg = BACKGROUNDS[bgIndex(stage)]; return bg.si === 3 ? 'hujan' : bg.si === 2 ? 'malam' : bg.bi === 9 ? 'api' : bg.si === 4 ? 'salji' : 'angin'; }
  function ambSet(kind) {
    if (!AU.ctx || !AU.amb || AU.ambKind === kind) return; const c = AU.ctx, t = c.currentTime;
    AU.ambNodes.forEach(n => { try { n.g.gain.setTargetAtTime(0.0001, t, 0.4); n.s.stop(t + 2); } catch (e) {} }); AU.ambNodes = []; AU.ambKind = kind; if (!kind) return;
    const bed = (filt, f, q, vol, lfoHz) => { const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = AU.noise; s.loop = true; fl.type = filt; fl.frequency.value = f; fl.Q.value = q || 0.7; g.gain.setValueAtTime(0.0001, t); g.gain.setTargetAtTime(vol, t, 0.8); s.connect(fl); fl.connect(g); g.connect(AU.amb);
      if (lfoHz) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = lfoHz; lg.gain.value = f * 0.5; l.connect(lg); lg.connect(fl.frequency); l.start(t); } s.start(t); AU.ambNodes.push({ s, g }); };
    if (kind === 'hujan') { bed('highpass', 1100, 0.5, 0.22); bed('lowpass', 450, 0.6, 0.12); }
    else if (kind === 'malam') bed('lowpass', 320, 0.7, 0.35, 0.1);
    else if (kind === 'api') bed('lowpass', 180, 0.9, 0.7, 0.2);
    else if (kind === 'salji') bed('lowpass', 260, 0.8, 0.4, 0.12);
    else bed('lowpass', 480, 0.7, 0.42, 0.15);
  }
  // peristiwa suasana rawak (dipanggil oleh penjadual muzik setiap ~90 ms)
  function ambTick() {
    if (!AU.ctx || !AU.ambKind || !(save.settings.amb > 0)) return; const c = AU.ctx, t = c.currentTime, k = AU.ambKind, r = Math.random();
    if (k === 'malam' && r < 0.08) for (let i = 0; i < 3; i++) tone('sine', 4300, 4300, 0.025, 0.03, t + i * 0.05, AU.amb);
    else if (k === 'api' && r < 0.25) noise(0.015 + Math.random() * 0.02, 0.08, 'highpass', 2500 + Math.random() * 2500, 0, t, AU.amb);
    else if (k === 'hujan' && r < 0.18) tone('sine', 2600 + Math.random() * 800, 1300, 0.025, 0.025, t, AU.amb);
  }
  function tone(type, f0, f1, dur, vol, when, dest) {
    const c = AU.ctx, t = when || c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || CUR_DEST || AU.sfx); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol, filt, f0, f1, when, dest) {
    const c = AU.ctx, t = when || c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = AU.noise; f.type = filt; f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || CUR_DEST || AU.sfx); s.start(t); s.stop(t + dur + 0.02);
  }
  function sfx(name, arg, x) {
    if (!AU.ctx || save.settings.sfx <= 0) return;
    if (VOICE_SFX[name] && save.settings.voice === false) return;
    const now = AU.ctx.currentTime, gap = SFX_GAP2[name] || { shot: 0.045, hit: 0.05, kill: 0.06, boom: 0.08, coin: 0.07, tap: 0.04, shatter: 0.15 }[name] || 0.03;
    if (AU.last[name] && now - AU.last[name] < gap) return;
    if (!SFX_IMPORTANT[name]) { AU.live = (AU.live || []).filter(e => e > now); if (AU.live.length >= 26) return; AU.live.push(now + 0.35); }
    AU.last[name] = now;
    CUR_DEST = x != null ? panTo(x, VOICE_SFX[name] ? AU.vox : AU.sfx) : (VOICE_SFX[name] ? AU.vox : null);
    try { if (SFX2[name]) { SFX2[name](arg); return; } sfxOld(name, arg, now); } finally { CUR_DEST = null; }
  }
  function sfxOld(name, arg, now) {
    switch (name) {
      case 'shot': {
        const w = WEAPONS[arg] || {}, D = 0.92 + Math.random() * 0.16;
        if (ICE.includes(arg)) tone('sine', (1800) * D, 900 * D, 0.09, 0.05);
        else if (ZAPS[arg]) { noise(0.08, 0.06, 'bandpass', 3000, 1500); tone('square', (600) * D, 1200 * D, 0.05, 0.02); }
        else if (w.pierce >= 99 || arg === 'plasma') tone('sine', (1600) * D, 500 * D, 0.12, 0.05);
        else if (w.splash) { noise(0.12, 0.08, 'lowpass', 900, 200); tone('triangle', (160) * D, 60 * D, 0.12, 0.08); }
        else if (arg === 'api' || arg === 'napalm' || POISON.includes(arg)) { noise(0.12, 0.12, 'bandpass', 1200, 600); tone('triangle', 220 * D, 120 * D, 0.08, 0.025); }
        else tone('square', (880 + Math.random() * 120) * D, 260 * D, 0.06, 0.035);
        break;
      }
      case 'hit': noise(0.03, 0.03, 'highpass', 2500); break;
      case 'kill': tone('triangle', 420, 160, 0.09, 0.05); noise(0.06, 0.03, 'lowpass', 1500, 400); break;
      case 'boom': noise(0.45, 0.22, 'lowpass', 1200, 60); tone('sine', 120, 40, 0.35, 0.18); break;
      case 'big': noise(0.9, 0.35, 'lowpass', 900, 40); tone('sine', 90, 30, 0.8, 0.3); break;
      case 'coin': tone('sine', 988, 988, 0.06, 0.06); tone('sine', 1319, 1319, 0.1, 0.06, now + 0.06); break;
      case 'chest': [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, 0.14, 0.07, now + i * 0.07)); break;
      case 'shard': [1047, 1397, 1760].forEach((f, i) => tone('sine', f, f, 0.12, 0.05, now + i * 0.05)); break;
      case 'up': [392, 523, 659].forEach((f, i) => tone('square', f, f, 0.08, 0.035, now + i * 0.05)); break;
      case 'star': [523, 659, 784, 1047, 1319].forEach((f, i) => tone('triangle', f, f, 0.16, 0.07, now + i * 0.06)); break;
      case 'power': noise(0.5, 0.12, 'highpass', 300, 4000); [262, 330, 392].forEach(f => tone('sawtooth', f, f * 1.5, 0.4, 0.03)); break;
      case 'strike': noise(0.3, 0.18, 'bandpass', 4000, 300); break;
      case 'evo': tone('sawtooth', 200, 600, 0.25, 0.04); break;
      case 'boss': tone('sawtooth', 110, 55, 0.8, 0.12); tone('sawtooth', 116, 58, 0.8, 0.08); noise(0.7, 0.08, 'lowpass', 600, 100); break;
      case 'win': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone('square', f, f, i === 5 ? 0.4 : 0.13, 0.05, now + i * 0.11)); break;
      case 'lose': [392, 349, 311, 262].forEach((f, i) => tone('triangle', f, f * 0.98, 0.3, 0.07, now + i * 0.22)); break;
      case 'click': tone('sine', 1200, 900, 0.03, 0.03); break;
      case 'tap': noise(0.07, 0.32, 'bandpass', 2200, 500); tone('sine', 170, 55, 0.09, 0.32); tone('triangle', 420, 180, 0.05, 0.08); break;
      case 'tampar': noise(0.09, 0.26, 'lowpass', 1400, 300); tone('sine', 120, 45, 0.12, 0.3); break;
      case 'crit': noise(0.08, 0.12, 'bandpass', 3000, 900); tone('square', 660, 1320, 0.08, 0.05); break;
      case 'shatter': [2400, 3100, 2700, 3600].forEach((f, i) => tone('sine', f, f * 0.9, 0.12, 0.03, now + i * 0.03)); noise(0.15, 0.05, 'highpass', 4000); break;
      case 'bad': tone('triangle', 230, 150, 0.13, 0.06); break;
      case 'trophy': [784, 988, 1175, 1568].forEach((f, i) => tone('triangle', f, f, 0.22, 0.07, now + i * 0.09)); break;
    }
  }
  // muzik: gelung 16 langkah, C–Am–F–G (biasa) atau Am–F–E (boss)
  const MEL = [0, 4, 7, 9, 7, 4, 2, 4, 0, 2, 4, 7, 4, 2, 0, -3];
  // 5 lagu ikut tempat (skala pentatonik supaya sentiasa harmoni) + lagu boss
  const TRACKS = [
    { nama: 'Riang Kampung', bpm: 108, roots: [48, 45, 41, 43], mel: MEL, lead: 'square' },
    { nama: 'Bandar Ceria', bpm: 118, roots: [50, 47, 43, 45], mel: [0, 2, 4, 7, 9, 7, 4, 2, 4, 7, 9, 12, 9, 7, 4, 2], lead: 'square' },
    { nama: 'Hutan Misteri', bpm: 96, roots: [45, 41, 43, 40], mel: [0, -2, 0, 3, 5, 3, 0, -2, 0, 3, 7, 5, 3, 0, -2, -5], lead: 'triangle' },
    { nama: 'Bayang Malam', bpm: 90, roots: [44, 41, 39, 43], mel: [0, 3, 7, 3, 0, -2, 0, 3, 5, 3, 0, -4, -2, 0, 3, 0], lead: 'sine' },
    { nama: 'Bara Gunung', bpm: 132, roots: [47, 47, 43, 45], mel: [0, 0, 3, 5, 7, 5, 3, 0, 10, 7, 5, 3, 5, 3, 0, -2], lead: 'sawtooth' }
  ];
  const BIOME_TRACK = [0, 1, 0, 1, 0, 1, 2, 4, 3, 4];
  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function musicTick() {
    ambTick();
    if (!AU.ctx || save.settings.music <= 0) return;
    const TR = TRACKS[AU.track || 0], spb = 60 / (AU.boss ? 128 : TR.bpm) / 2;
    while (AU.nextT < AU.ctx.currentTime + 0.25) {
      const s = AU.step % 16, bar = Math.floor(AU.step / 16) % 4, t = AU.nextT;
      const roots = AU.boss ? [57, 53, 52, 57] : TR.roots, root = roots[bar];
      if (s % 4 === 0) tone('triangle', midi(root - 12), midi(root - 12), spb * 3.5, 0.18, t, AU.mus);
      if (s % 2 === 0) tone('triangle', midi(root + 7 - 12), midi(root + 7 - 12), spb * 0.9, 0.06, t, AU.mus);
      if (s % 4 === 0) { tone('sine', 150, 45, 0.18, AU.boss ? 0.3 : 0.2, t, AU.mus); }
      if (s % 2 === 1) noise(0.04, 0.025, 'highpass', 7000, null, t, AU.mus);
      if (AU.boss && s % 8 === 4) noise(0.12, 0.08, 'bandpass', 1800, 800, t, AU.mus);
      const pat = (AU.step >> 4) % 2 ? TR.mel.slice().reverse() : TR.mel;
      if (s % 2 === 0 || AU.boss) { const n = root + 12 + (AU.boss ? [0, 3, 7, 10, 7, 3, 5, 3][s % 8] : pat[s]); tone(AU.boss ? 'square' : TR.lead, midi(n), midi(n), spb * 0.8, TR.lead === 'sawtooth' ? 0.022 : TR.lead === 'sine' ? 0.05 : 0.035, t, AU.mus); }
      AU.step++; AU.nextT += spb;
    }
  }
  document.addEventListener('pointerdown', auInit, { once: false });

  // ---------- rupa boss: 15 bentuk + tahap + elemen ----------
  const ELEM_COL = { api: '#FF6A2B', ais: '#8FE0FF', racun: '#8BE04A', elektrik: '#FFE07A', bayang: '#6A5A8A', emas: '#F2C230' };
  function drawBossTier(z, x, y, r) {
    const t = z.btier || 0, e = z.belem;
    if (e && !LOWFX) {
      ctx.save(); ctx.globalAlpha = 0.18 + 0.08 * Math.sin(ANIM * 4 + z.id); ctx.fillStyle = ELEM_COL[e]; circ(ctx, x, y, r * 1.08); ctx.restore();
      const q = Math.random();
      if (e === 'api' && q < 0.35) emit(x + (Math.random() - .5) * r * 1.4, y - r * .5, 1, { a: -Math.PI / 2, spread: 0.4, spd: 50, warna: ['#FFB04A', '#FF6A2B'], size: 3, life: 0.5 });
      else if (e === 'ais' && q < 0.15) emit(x + (Math.random() - .5) * r * 2, y - r * .3, 1, { a: Math.PI / 2, spread: 1, spd: 20, warna: '#FFFFFF', size: 2.5, life: 1, shape: 'star' });
      else if (e === 'racun' && q < 0.2) emit(x + (Math.random() - .5) * r, y + r * .6, 1, { a: Math.PI / 2, spread: 0.3, spd: 25, warna: '#8BE04A', size: 3, life: 0.7, grav: 80 });
      else if (e === 'elektrik' && q < 0.12) { ctx.save(); ctx.strokeStyle = '#FFF27A'; ctx.lineWidth = 2; ctx.beginPath(); const a = Math.random() * TAU; ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.lineTo(x + Math.cos(a) * r * 1.3 + 6, y + Math.sin(a) * r * 1.3 - 4); ctx.lineTo(x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5); ctx.stroke(); ctx.restore(); }
      else if (e === 'bayang' && q < 0.25) emit(x + (Math.random() - .5) * r * 1.6, y + (Math.random() - .5) * r, 1, { spd: 10, warna: '#2A2238', size: 6, life: 0.8, shape: 'smoke', drag: 1 });
      else if (e === 'emas' && q < 0.12) emit(x + (Math.random() - .5) * r * 1.6, y + (Math.random() - .5) * r * 1.4, 1, { spd: 5, warna: '#FFF2A0', size: 3, life: 0.6, shape: 'star' });
    }
    if (t >= 1) { ctx.fillStyle = t >= 2 ? '#3A2A2A' : '#F2E8D0'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * r * .45, y - r * .78); ctx.quadraticCurveTo(x + s * r * .95, y - r * 1.2, x + s * r * .8, y - r * 1.45); ctx.lineTo(x + s * r * .62, y - r * .85); ctx.fill(); } }
    if (t >= 2) { ctx.save(); glow(ctx, '#FF3A3A', 8); ctx.fillStyle = '#FF5A3A'; circ(ctx, x - r * .32, y - r * .05, r * .06); circ(ctx, x + r * .35, y, r * .05); ctx.restore(); }
    if (t >= 3) { const cy = y - r * 1.05; ctx.fillStyle = '#F2C230'; ctx.beginPath(); ctx.moveTo(x - r * .45, cy + r * .2); for (let i = 0; i <= 4; i++) ctx.lineTo(x - r * .45 + i * r * .225, cy - (i % 2 ? 0 : r * .3)); ctx.lineTo(x + r * .45, cy + r * .2); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#E5302A'; circ(ctx, x, cy + r * .02, r * .06);
      ctx.save(); ctx.strokeStyle = 'rgba(242,194,48,' + (0.35 + 0.25 * Math.sin(ANIM * 3)) + ')'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -ANIM * 30; ctx.beginPath(); ctx.arc(x, y, r + 10, 0, TAU); ctx.stroke(); ctx.restore(); }
    if (z.btr && z.btr.length && z.hp > 0) { const s = z.btr.map(k => BTRAIT[k].ikon).join(''); label(ctx, s, x, y - r - 16 - (t >= 3 ? 14 : 0), 10, '#FFFFFF');
      if (z.btr.includes('giliran') || z.btr.includes('kfiz') || z.btr.includes('kmag')) { const ph = z.btr.includes('giliran') ? (Math.floor((CUR_CLOCK || 0) / 6) % 2 ? 'm' : 'f') : z.btr.includes('kfiz') ? 'f' : 'm'; ctx.save(); ctx.globalAlpha = 0.45 + 0.2 * Math.sin(ANIM * 6); ctx.strokeStyle = ph === 'f' ? '#C8D0DC' : '#B48CFF'; ctx.lineWidth = 3; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(x, y, r + 7, 0, TAU); ctx.stroke(); ctx.restore(); } }
    if (z.p2 && !CALM()) { ctx.save(); ctx.strokeStyle = 'rgba(255,90,90,' + (0.4 + 0.3 * Math.sin(ANIM * 14)) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, TAU); ctx.stroke(); ctx.restore(); }
  }
  function drawBossKind(z, x, y, r) {
    drawBossKind0(z, x, y, r); drawBossTier(z, x, y, r);
  }
  function drawBossKind0(z, x, y, r) {
    switch (z.bossKind) {
      case 'lendir':
        ctx.fillStyle = 'rgba(160,240,120,.35)'; circ(ctx, x - r * .4, y - r * .45, r * .25); circ(ctx, x + r * .5, y + r * .2, r * .15);
        ctx.fillStyle = z.warna; for (let i = 0; i < 4; i++) { const dx = -r * .6 + i * r * .4; ctx.beginPath(); ctx.ellipse(x + dx, y + r * .9 + Math.sin(ANIM * 3 + i) * 3, r * .1, r * .22, 0, 0, TAU); ctx.fill(); }
        break;
      case 'jeneral':
        ctx.fillStyle = '#EDE6D6'; ctx.beginPath(); ctx.ellipse(x, y - r * .05, r * .62, r * .52, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#2B2B33'; circ(ctx, x - r * .25, y - r * .1, r * .14); circ(ctx, x + r * .25, y - r * .1, r * .14); ctx.fillRect(x - r * .3, y + r * .2, r * .6, r * .08);
        ctx.fillStyle = '#E5484D'; circ(ctx, x - r * .25, y - r * .1, r * .05); circ(ctx, x + r * .25, y - r * .1, r * .05);
        ctx.fillStyle = '#5A6070'; ctx.beginPath(); ctx.arc(x, y - r * .35, r * .8, Math.PI * 1.05, -0.05); ctx.fill();
        ctx.fillStyle = '#C8302A'; ctx.beginPath(); ctx.moveTo(x, y - r * 1.1); ctx.quadraticCurveTo(x + r * .9, y - r * 1.5, x + r * .6, y - r * .7); ctx.fill();
        ctx.strokeStyle = '#B8C2CC'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + r * .9, y + r * .6); ctx.lineTo(x + r * 1.3, y - r * .4); ctx.stroke(); ctx.fillStyle = '#8A5A30'; ctx.fillRect(x + r * .8, y + r * .45, r * .3, r * .1);
        break;
      case 'ratu':
        ctx.fillStyle = 'rgba(80,20,100,.5)'; ctx.beginPath(); ctx.moveTo(x - r * .9, y - r * .3); ctx.quadraticCurveTo(x, y - r * 1.2, x + r * .9, y - r * .3); ctx.lineTo(x + r, y + r * .6); ctx.lineTo(x - r, y + r * .6); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#F2C230'; ctx.beginPath(); for (let i = 0; i < 5; i++) { const px = x - r * .45 + i * r * .225; ctx.lineTo(px, y - r * (i % 2 ? .95 : 1.15)); } ctx.lineTo(x + r * .45, y - r * .8); ctx.lineTo(x - r * .45, y - r * .8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#B2F06A'; for (let i = 0; i < 3; i++) circ(ctx, x - r * .2 + i * r * .2, y + r * .55 + ((ANIM * 30 + i * 9) % 14), 2.5);
        break;
      case 'besi':
        ctx.fillStyle = 'rgba(140,150,164,.9)'; rr(ctx, x - r * .75, y - r * .1, r * 1.5, r * .8, 6); ctx.fill(); ctx.fillStyle = '#5A6070'; ctx.beginPath(); ctx.arc(x, y - r * .3, r * .85, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#FF5A3A'; ctx.fillRect(x - r * .5, y - r * .35, r, r * .1);
        ctx.fillStyle = '#E8ECF4'; for (let i = 0; i < 5; i++) { circ(ctx, x - r * .6 + i * r * .3, y + r * .05, 2); circ(ctx, x - r * .6 + i * r * .3, y + r * .55, 2); }
        if (z.invT > 0) { ctx.save(); glow(ctx, '#8FE8FF', 20); ctx.strokeStyle = 'rgba(143,232,255,' + (0.6 + 0.3 * Math.sin(ANIM * 20)) + ')'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r + 12, 0, TAU); ctx.stroke(); noGlow(ctx); ctx.fillStyle = 'rgba(143,232,255,.18)'; circ(ctx, x, y, r + 12); ctx.restore(); }
        break;
      case 'gorila': {
        const lift = z.abT < 1 ? 1 - z.abT : 0;
        ctx.fillStyle = '#3E322E'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * r * .95, y + r * .25 - (s > 0 ? lift * r * .9 : 0), r * .32, r * .62, s * .3, 0, TAU); ctx.fill(); }
        ctx.fillStyle = '#8A766A'; ctx.beginPath(); ctx.ellipse(x, y + r * .35, r * .5, r * .38, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#2A221E'; ctx.fillRect(x - r * .62, y - r * .38, r * 1.24, r * .16);
        if (lift > 0) { ctx.fillStyle = '#8A8A90'; circ(ctx, x + r * .95, y - r * .7 - lift * r * .5, r * .3); ctx.fillStyle = '#6A6A70'; circ(ctx, x + r * .88, y - r * .78 - lift * r * .5, r * .08); }
        break; }
      case 'badut':
        ctx.fillStyle = '#FFFFFF'; for (let i = 0; i < 7; i++) { const a = Math.PI * .15 + i * Math.PI * .7 / 6; circ(ctx, x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .75 + r * .2, r * .22); }
        ctx.fillStyle = '#E5302A'; circ(ctx, x, y + r * .12, r * .16);
        ctx.fillStyle = '#4A9AF0'; ctx.beginPath(); ctx.moveTo(x - r * .5, y - r * .7); ctx.lineTo(x + r * .1, y - r * 1.7); ctx.lineTo(x + r * .5, y - r * .7); ctx.fill();
        ctx.fillStyle = '#FFE07A'; for (let i = 0; i < 3; i++) circ(ctx, x - r * .25 + i * r * .2, y - r * (.85 + i * .25), r * .07); circ(ctx, x + r * .1, y - r * 1.75, r * .12);
        ctx.fillStyle = '#2B2B33'; circ(ctx, x + r * 1.05, y - r * .2 + Math.sin(ANIM * 6) * 4, r * .22); ctx.strokeStyle = '#FFB04A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + r * 1.1, y - r * .4); ctx.lineTo(x + r * 1.2, y - r * .55); ctx.stroke();
        break;
      case 'pemanah':
        ctx.fillStyle = '#EDE6D6'; ctx.beginPath(); ctx.ellipse(x, y - r * .1, r * .55, r * .48, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#2B2B33'; circ(ctx, x - r * .2, y - r * .15, r * .13); circ(ctx, x + r * .2, y - r * .15, r * .13); for (let i = 0; i < 4; i++) ctx.fillRect(x - r * .22 + i * r * .13, y + r * .12, r * .07, r * .12);
        ctx.fillStyle = '#7A5A30'; ctx.fillRect(x - r * 1.05, y - r * .9, r * .28, r * 1.1); ctx.fillStyle = '#E8E0D0'; for (let i = 0; i < 3; i++) ctx.fillRect(x - r * 1.0 + i * r * .08, y - r * 1.1, r * .05, r * .25);
        ctx.strokeStyle = '#8A5A30'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + r * .75, y, r * .75, -1.1, 1.1); ctx.stroke(); ctx.strokeStyle = '#EDE6D6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + r * .75 + Math.cos(-1.1) * r * .75, y + Math.sin(-1.1) * r * .75); ctx.lineTo(x + r * .75 + Math.cos(1.1) * r * .75, y + Math.sin(1.1) * r * .75); ctx.stroke();
        break;
      case 'sihir':
        ctx.fillStyle = '#3A2460'; ctx.beginPath(); ctx.moveTo(x - r * .8, y - r * .55); ctx.lineTo(x + r * .15, y - r * 1.9); ctx.lineTo(x + r * .8, y - r * .55); ctx.fill(); ctx.fillRect(x - r * .95, y - r * .62, r * 1.9, r * .14);
        ctx.fillStyle = '#FFE07A'; circ(ctx, x - r * .1, y - r * 1.1, r * .07); circ(ctx, x + r * .15, y - r * 1.45, r * .05);
        ctx.strokeStyle = '#7A5A30'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - r * 1.05, y + r * .9); ctx.lineTo(x - r * 1.05, y - r * .8); ctx.stroke();
        ctx.save(); glow(ctx, '#C08CF0', 14); ctx.fillStyle = 'rgba(192,140,240,' + (0.7 + 0.3 * Math.sin(ANIM * 8)) + ')'; circ(ctx, x - r * 1.05, y - r * .9, r * .2); ctx.restore();
        ctx.fillStyle = '#EDE6D6'; ctx.beginPath(); ctx.moveTo(x - r * .3, y + r * .4); ctx.lineTo(x, y + r * 1.1); ctx.lineTo(x + r * .3, y + r * .4); ctx.fill();
        break;
      case 'labah':
        ctx.strokeStyle = '#2A2230'; ctx.lineWidth = Math.max(2, r * .09); ctx.lineCap = 'round';
        for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const a0 = -0.6 + i * 0.4, wob = Math.sin(ANIM * 10 + i * 1.7 + (s > 0 ? 1 : 0)) * 0.12, kx = x + s * r * (0.9 + 0.3 * Math.cos(a0)), ky = y + r * (a0 * 0.8) - r * .35;
          ctx.beginPath(); ctx.moveTo(x + s * r * .7, y + r * a0 * .5); ctx.lineTo(kx, ky + wob * r); ctx.lineTo(kx + s * r * .35, y + r * (a0 + 0.9) + wob * r); ctx.stroke(); }
        ctx.lineCap = 'butt'; ctx.fillStyle = '#E5302A'; for (let i = 0; i < 6; i++) circ(ctx, x - r * .3 + (i % 3) * r * .3, y - r * .35 + Math.floor(i / 3) * r * .2, r * (i % 3 === 1 ? .09 : .06));
        ctx.fillStyle = '#C8302A'; ctx.beginPath(); ctx.moveTo(x - r * .15, y + r * .5); ctx.lineTo(x, y + r * .8); ctx.lineTo(x + r * .15, y + r * .5); ctx.fill();
        break;
      case 'ais':
        ctx.fillStyle = 'rgba(220,245,255,.95)'; for (let i = 0; i < 5; i++) { const px = x - r * .7 + i * r * .35, h = r * (i % 2 ? .55 : .8); ctx.beginPath(); ctx.moveTo(px - r * .12, y - r * .7); ctx.lineTo(px, y - r * .7 - h); ctx.lineTo(px + r * .12, y - r * .7); ctx.fill(); }
        ctx.fillStyle = 'rgba(160,220,255,.35)'; circ(ctx, x, y, r * .95); ctx.fillStyle = '#5AB4E0'; circ(ctx, x - r * .3, y - r * .1, r * .1); circ(ctx, x + r * .3, y - r * .1, r * .1);
        if (Math.random() < 0.15) emit(x + (Math.random() - .5) * r * 2, y, 1, { a: Math.PI / 2, spread: 1, spd: 20, warna: '#FFFFFF', size: 2.5, life: 1, shape: 'star' });
        break;
      case 'robot':
        ctx.fillStyle = '#6A7688'; rr(ctx, x - r * .75, y - r * .75, r * 1.5, r * 1.2, 8); ctx.fill(); ctx.fillStyle = '#2B3340'; rr(ctx, x - r * .55, y - r * .35, r * 1.1, r * .3, 5); ctx.fill();
        ctx.save(); const chg = z.laserT > 0 ? 1 - z.laserT / 1.2 : 0; glow(ctx, '#FF3A3A', 10 + chg * 20); ctx.fillStyle = 'rgba(255,58,58,' + (0.6 + 0.4 * (chg || Math.abs(Math.sin(ANIM * 3)))) + ')'; ctx.fillRect(x - r * .5 + (Math.sin(ANIM * 2) * .5 + .5) * r * .7, y - r * .3, r * .3, r * .2); ctx.restore();
        ctx.strokeStyle = '#B8C2CC'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - r * .75); ctx.lineTo(x, y - r * 1.15); ctx.stroke(); ctx.fillStyle = Math.sin(ANIM * 8) > 0 ? '#FF5A5A' : '#5A2020'; circ(ctx, x, y - r * 1.18, r * .08);
        ctx.fillStyle = '#C8D0DC'; for (const s of [-1, 1]) for (const t of [-1, 1]) circ(ctx, x + s * r * .62, y + t * r * .6 - r * .1, 2.2);
        break;
      case 'ular':
        for (let i = 4; i >= 1; i--) { const k = i / 4, sx = x + Math.sin(ANIM * 4 - i * 0.9) * r * .5, sy = y - r * .55 - i * r * .42; ctx.fillStyle = i % 2 ? '#5A7A2E' : z.warna; circ(ctx, sx, sy, r * (0.75 - k * 0.35)); }
        ctx.fillStyle = '#E8D86A'; for (let i = 0; i < 3; i++) circ(ctx, x - r * .35 + i * r * .35, y + r * .35, r * .1);
        if (Math.sin(ANIM * 5) > 0.3) { ctx.strokeStyle = '#E5302A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + r * .55); ctx.lineTo(x, y + r * .85); ctx.lineTo(x - 4, y + r * .95); ctx.moveTo(x, y + r * .85); ctx.lineTo(x + 4, y + r * .95); ctx.stroke(); }
        break;
      case 'kelawar': {
        const fl = Math.sin(ANIM * 12) * 0.35; ctx.fillStyle = '#2E2238';
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * r * .6, y - r * .2); ctx.quadraticCurveTo(x + s * r * 1.6, y - r * (1.1 + fl), x + s * r * 2.0, y - r * (.2 + fl)); for (let i = 0; i < 3; i++) ctx.quadraticCurveTo(x + s * r * (1.75 - i * .4), y + r * (.15 - fl * .5), x + s * r * (1.6 - i * .4), y + r * (.35 - fl * .4)); ctx.lineTo(x + s * r * .6, y + r * .3); ctx.fill(); }
        ctx.fillStyle = z.warna; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * r * .2, y - r * .8); ctx.lineTo(x + s * r * .55, y - r * 1.45); ctx.lineTo(x + s * r * .7, y - r * .6); ctx.fill(); }
        ctx.fillStyle = '#FFFFFF'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * r * .12, y + r * .4); ctx.lineTo(x + s * r * .2, y + r * .62); ctx.lineTo(x + s * r * .28, y + r * .4); ctx.fill(); }
        break; }
      case 'ketam': {
        const open = z.openT > 0 ? 1 : 0;
        ctx.strokeStyle = 'rgba(120,30,20,.5)'; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x, y + r * .2, r * (.4 + i * .2), Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
        if (!open) { ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(x - r * .3, y - r * .45, r * .3, r * .12, -0.4, 0, TAU); ctx.fill(); }
        for (const s of [-1, 1]) { const cx = x + s * r * 1.05, cy = y + r * .55; ctx.fillStyle = '#B8402A'; circ(ctx, cx, cy, r * .38); ctx.fillStyle = '#D0583A'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r * .42, -Math.PI / 2 - s * (0.25 + open * 0.6), -Math.PI / 2 + s * 0.25, s < 0); ctx.fill(); ctx.fillStyle = '#F2E8D0'; circ(ctx, cx, cy - r * .3, r * .06); }
        ctx.strokeStyle = z.warna; ctx.lineWidth = 3; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * r * .25, y - r * .7); ctx.lineTo(x + s * r * .35, y - r * 1.15); ctx.stroke(); ctx.fillStyle = '#FFFFFF'; circ(ctx, x + s * r * .35, y - r * 1.2, r * .13); ctx.fillStyle = '#2B2B33'; circ(ctx, x + s * r * .35, y - r * 1.2, r * .06); }
        break; }
      case 'naga':
        ctx.fillStyle = '#8A2A1A'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * r * .5, y - r * .2); ctx.quadraticCurveTo(x + s * r * 1.9, y - r * (1.2 + .2 * Math.sin(ANIM * 6)), x + s * r * 1.6, y + r * .4); ctx.quadraticCurveTo(x + s * r * 1.1, y + r * .1, x + s * r * .5, y + r * .3); ctx.fill(); }
        ctx.fillStyle = '#F2E8D0'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * r * .35, y - r * .75); ctx.lineTo(x + s * r * .6, y - r * 1.35); ctx.lineTo(x + s * r * .55, y - r * .7); ctx.fill(); }
        ctx.fillStyle = '#FFB04A'; circ(ctx, x - r * .3, y - r * .1, r * .12); circ(ctx, x + r * .35, y - r * .05, r * .1);
        if (Math.random() < 0.4) emit(x, y + r * .5, 1, { a: Math.PI / 2, spread: 0.4, spd: 40, warna: ['#FFB04A', '#FF6A2B'], size: 3, life: 0.4 });
        break;
    }
  }

  // ================= v6: JARAK, TEKAN, AIS, MENARA, DPS, EVENT =================
  function vib(p) { try { if (save.settings.vib !== false && navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  // ---------- pilihan hero/menara untuk paparan jarak ----------
  let rangeSel = null, drag = null, showDps = false;
  const dpsHist = [];
  function heroAt(b, x, y) { const sc = b.team.length > 5 ? 1.2 : 1.32; for (const m of b.team) if (Math.abs(x - m.x) < 17 * sc && y > m.y - 34 * sc && y < m.y + 22 * sc) return m; return null; }
  function towerAt(b, x, y) { for (const t of b.towers || []) if (Math.abs(x - t.x) < 18 && Math.abs(y - t.y) < 22) return t; return null; }
  function drawRange(b, sv) {
    if (!rangeSel) return; if (rangeSel.until == null) rangeSel.until = ANIM + 3; rangeSel.t = rangeSel.until - ANIM; if (rangeSel.t <= 0) { rangeSel = null; return; }
    let x, y, R, col, lines;
    if (rangeSel.kind === 'hero') {
      const m = b.team.find(h => h.id === rangeSel.id); if (!m) return; const st = heroStats(sv, m.id, b.now), wd = WEAPONS[st.wid];
      x = m.x; y = m.y - 10; R = wd.range; col = wd.peluru;
      lines = [HEROES[m.id].nama + ' · ' + wd.nama, 'Damage ' + fmt(st.dmg) + ' · ' + st.rate.toFixed(2) + '/s', 'Jarak ' + wd.range + (dpsOf(m.id) ? ' · DPS ' + fmt(dpsOf(m.id)) : '')];
    } else {
      const t = b.towers.find(q => q.slot === rangeSel.slot); if (!t) return; const T = TOWERS[t.type];
      x = t.x; y = t.y; R = T.range; col = WEAPONS[T.wid].peluru; lines = [T.nama + ' Lv.' + t.lvl, T.desc, 'Jarak ' + T.range + (dpsOf('menara' + t.slot) ? ' · DPS ' + fmt(dpsOf('menara' + t.slot)) : '')];
    }
    const a = Math.min(1, rangeSel.t * 2);
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = col; ctx.globalAlpha = 0.09 * a; circ(ctx, x, y, R); ctx.globalAlpha = a;
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.setLineDash([12, 8]); ctx.lineDashOffset = -ANIM * 40; ctx.beginPath(); ctx.arc(x, y, R * (1 + 0.01 * Math.sin(ANIM * 6)), 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    for (const z of b.zombies) if (z.hp > 0 && Math.hypot(z.x - x, z.y - y) <= R) { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(z.x, z.y, z.r + 5, 0, TAU); ctx.stroke(); }
    const bw = 178 * TXT(), bx = Math.max(6, Math.min(W - bw - 6, x - bw / 2)), by = Math.max(100, WALL_Y - 150);
    ctx.fillStyle = 'rgba(28,36,52,.88)'; rr(ctx, bx, by, bw, 54, 10); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(bx, by, 5, 54);
    ctx.textAlign = 'left'; ctx.fillStyle = '#FFFFFF'; ctx.font = '800 ' + Math.round(12 * TXT()) + 'px "Nunito", system-ui'; ctx.fillText(lines[0], bx + 12, by + 17);
    ctx.font = '700 ' + Math.round(11 * TXT()) + 'px "Nunito", system-ui'; ctx.fillStyle = '#C8D4E4'; ctx.fillText(lines[1], bx + 12, by + 33); ctx.fillText(lines[2], bx + 12, by + 48);
    ctx.restore();
  }
  // ---------- DPS ----------
  function sampleDps(b) { const now = ANIM; if (!dpsHist.length || now - dpsHist[dpsHist.length - 1].t >= 0.5) { dpsHist.push({ t: now, d: Object.assign({}, b.dmgBy), b }); while (dpsHist.length > 12) dpsHist.shift(); } }
  function dpsOf(id) { if (dpsHist.length < 2) return 0; const a = dpsHist[0], z = dpsHist[dpsHist.length - 1]; if (a.b !== z.b || z.t - a.t <= 0) return 0; return ((z.d[id] || 0) - (a.d[id] || 0)) / (z.t - a.t); }
  function drawDps(b) {
    if (!showDps) return; let tot = 0;
    for (const m of b.team) { const d = dpsOf(m.id); tot += d; label(ctx, fmt(d) + '/s', m.x, m.y - 46, 11, '#FFE07A'); }
    for (const t of b.towers || []) { const d = dpsOf('menara' + t.slot); tot += d; label(ctx, fmt(d) + '/s', t.x, t.y - 26, 10, '#9FE6FF'); }
    ctx.fillStyle = 'rgba(30,40,60,.6)'; rr(ctx, 10, 42, 130, 22, 11); ctx.fill(); ctx.fillStyle = '#FFE07A'; ctx.font = '800 ' + Math.round(12 * TXT()) + 'px "Nunito", system-ui'; ctx.textAlign = 'left'; ctx.fillText('DPS pasukan ' + fmt(tot), 20, 57);
  }
  // ---------- menara ----------
  function drawTowerShape(c, x, y, type, aim, recoil, lvl, brN) {
    const T = TOWERS[type], col = T.warna || (type === 'ais' ? '#9FD8F0' : type === 'meriam' ? '#8C96A4' : '#B98A5A');
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(0, 22, 18, 5, 0, 0, TAU); c.fill();
    c.fillStyle = '#7A7E86'; rr(c, -14, -4, 28, 28, 4); c.fill(); c.fillStyle = '#9AA0A8';
    for (let r = 0; r < 3; r++) for (let i = 0; i < 2; i++) { rr(c, -13 + i * 13 + (r % 2 ? 6 : 0) - (r % 2 && i ? 6 : 0), -2 + r * 8, 12, 6, 1.5); c.fill(); }
    c.fillStyle = col; rr(c, -17, -12, 34, 10, 3); c.fill(); for (let i = -2; i <= 2; i++) c.fillRect(-15 + (i + 2) * 7, -17, 5, 6);
    // hiasan jenis menara baharu
    if (type === 'petir') { c.strokeStyle = '#8A7A3A'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -17); c.lineTo(0, -30); c.stroke(); c.fillStyle = '#FFF27A'; circ(c, 0, -31, 2.6 + Math.sin(ANIM * 9) * 0.6); }
    else if (type === 'api') { c.fillStyle = 'rgba(255,140,60,.9)'; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 15, -12); c.quadraticCurveTo(s * 19, -20 - Math.sin(ANIM * 8 + s) * 3, s * 14, -24); c.quadraticCurveTo(s * 12, -18, s * 15, -12); c.fill(); } }
    else if (type === 'racun') { c.fillStyle = 'rgba(126,200,80,.55)'; for (let i = 0; i < 3; i++) { const k = (ANIM * 0.7 + i / 3) % 1; circ(c, -8 + i * 8, -18 - k * 14, 2 + k * 2); } }
    else if (type === 'tepat') { c.strokeStyle = '#2E3A24'; c.lineWidth = 1.2; c.beginPath(); c.arc(12, -22, 4, 0, TAU); c.moveTo(8, -22); c.lineTo(16, -22); c.moveTo(12, -26); c.lineTo(12, -18); c.stroke(); }
    else if (type === 'laser') { c.fillStyle = '#FFB0F0'; c.save(); if (!LOWFX) { c.shadowColor = '#E04FC8'; c.shadowBlur = 8; } circ(c, 0, -20, 3); c.restore(); }
    else if (type === 'angin') { c.save(); c.translate(0, -24); c.rotate(ANIM * 6); c.fillStyle = '#FFFFFF'; for (let i = 0; i < 3; i++) { c.rotate(TAU / 3); c.beginPath(); c.ellipse(0, -5, 2.5, 5.5, 0, 0, TAU); c.fill(); } c.fillStyle = '#7A8A9A'; circ(c, 0, 0, 1.8); c.restore(); }
    if (type === 'tukang') { c.save(); c.translate(0, -18); c.rotate(-0.6 + (recoil > 0 ? Math.sin(recoil * 40) * 0.6 : 0)); c.fillStyle = '#7A5230'; c.fillRect(-1.5, -2, 3, 14); c.fillStyle = '#9AA0A8'; rr(c, -6, -6, 12, 6, 2); c.fill(); c.restore(); c.fillStyle = '#E5484D'; c.fillRect(-2, -26, 4, 8); c.fillRect(-4, -24, 8, 4); }
    else { c.save(); c.translate(0, -12); c.rotate(aim); c.translate(-(recoil > 0 ? 3 : 0), 0); c.scale(1.05, 1.05); drawWeapon(c, T.wid, ANIM, recoil > 0 ? 1 : 0, ANIM * 3); drawMuzzle(c, T.wid, Math.max(0, recoil / 0.12)); c.restore(); }
    if (brN >= 1) { c.strokeStyle = '#5A3A20'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-15, -17); c.lineTo(-15, -32); c.stroke(); c.fillStyle = col; c.beginPath(); c.moveTo(-15, -32); c.lineTo(-4 + Math.sin(ANIM * 5) * 1.5, -28); c.lineTo(-15, -24); c.fill(); }
    if (brN >= 2) { c.fillStyle = '#F2C230'; for (let i = -2; i <= 2; i++) c.fillRect(-15 + (i + 2) * 7, -19, 5, 3); c.fillStyle = '#FFFFFF'; star(c, 13, -24, 5, 4.5, 2, -Math.PI / 2); }
    if (lvl) { c.fillStyle = '#23324A'; rr(c, -11, 14, 22, 11, 5); c.fill(); c.fillStyle = '#FFE07A'; c.font = '800 8px "Nunito", system-ui'; c.textAlign = 'center'; c.fillText('Lv' + lvl, 0, 22.5); }
    c.restore();
  }
  function drawTowers(b) { for (const t of b.towers || []) drawTowerShape(ctx, t.x, t.y, t.type, t.aim, t.recoil, t.lvl, (t.br || []).length); }
  function towerIcon(c, type) { iconBg(c, '#E8EEF4', TOWERS[type].warna || (type === 'ais' ? '#5AB4E0' : type === 'meriam' ? '#5A6070' : '#A8703E')); drawTowerShape(c, 32, 30, type, -Math.PI / 4, 0, 0); }
  // ---------- animasi tekanan ----------
  function drawTapFx(f, k) {
    if (f.kind === 'tapHit') {
      const big = f.crit, s = big ? 1.5 : 1, id = f.tapak || 'biasa', small = f.auto || f.kecil, hs = (small ? 0.62 : 1.1) * (big ? 1.25 : 1);
      if (!CALM() || k > 0.1) palmPrint(ctx, f.x, f.y + 8, hs * 1.15, id, 0.42 * Math.max(0, 1 - k));
      if (f.ground && k > 0.08 && k < 0.6) { const e = (k - 0.08) / 0.52; ctx.save(); ctx.globalAlpha = 0.7 * (1 - e); ctx.strokeStyle = id === 'biasa' ? '#FFF2C8' : (TAPAK[id] || TAPAK.biasa).warna; ctx.lineWidth = 4 * (1 - e) + 1; ctx.beginPath(); ctx.ellipse(f.x, f.y + 8, (f.r || 70) * (0.25 + 0.75 * e), (f.r || 70) * (0.25 + 0.75 * e) * 0.55, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      if (k < 0.32) { const dn = k < 0.1 ? 1 - k / 0.1 : 0, sq = k < 0.1 ? 0 : Math.max(0, 1 - (k - 0.1) / 0.2); ctx.save(); ctx.globalAlpha = k < 0.22 ? 1 : Math.max(0, 1 - (k - 0.22) / 0.1); ctx.translate(f.x, f.y - 6 - 38 * hs * dn); ctx.rotate(Math.sin(f.a) * 0.25); drawTapakHand(ctx, 0, 0, hs, id, ANIM, sq); ctx.restore(); }
      if (k > 0.08 && k < 0.28 && !CALM()) { const kk = (k - 0.08) / 0.2; ctx.fillStyle = big ? 'rgba(255,224,122,.9)' : 'rgba(255,255,255,.85)'; star(ctx, f.x, f.y, 8, 20 * s * (1 - kk) * (small ? 0.6 : 1), 8 * s * (1 - kk) * (small ? 0.6 : 1), f.a); }
      ctx.globalAlpha = Math.max(0, 1 - k); const pop = 1 + Math.max(0, 0.25 - k) * (big ? 4 : 2);
      const ox = (((f.combo || 0) % 3) - 1) * 26, oy = ((f.combo || 0) % 2) * 14;
      if (f.ground) { if (f.n && k < 0.8) label(ctx, 'TAMPAR! ×' + f.n, f.x, f.y - 30 - 26 * k, 13, '#FFE07A'); ctx.globalAlpha = 1; return; }
      ctx.save(); ctx.translate(f.x + ox, f.y - 24 - oy - 34 * k); ctx.scale(pop, pop); if (big) label(ctx, 'KRITIKAL', 0, -15, 11, '#FF8A3A'); label(ctx, fmt(f.dmg), 0, 0, small ? 11 : big ? 18 : 14, big ? '#FFD23A' : small ? '#DDEBFF' : '#FFFFFF'); ctx.restore();
      if (!small && (f.combo === 10 || f.combo === 25 || f.combo === 50) && k < 0.9) { const J = f.combo === 10 ? '👋 TAMPAR BERGANDA!' : f.combo === 25 ? '✨ TAPAK BERANGKAI!' : '💪 TAPAK GERGASI BERKUASA!'; ctx.globalAlpha = Math.max(0, 1 - k); label(ctx, J, W / 2, 112 - 10 * k, 15, '#FFB040'); }
      ctx.globalAlpha = 1;
    } else if (f.kind === 'tapZap') {
      const kk = f.t / (f.life || 0.25); ctx.save(); ctx.globalAlpha = Math.max(0, 1 - kk); glow(ctx, '#8FE8FF', 10); ctx.strokeStyle = '#E8FBFF'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(f.x, f.y); for (let i = 1; i < 6; i++) { const q = i / 6; ctx.lineTo(f.x + (f.x2 - f.x) * q + Math.sin(i * 7 + f.t * 90) * 7, f.y + (f.y2 - f.y) * q + Math.cos(i * 5 + f.t * 70) * 7); } ctx.lineTo(f.x2, f.y2); ctx.stroke(); noGlow(ctx); ctx.restore();
    } else if (f.kind === 'tapMiss') {
      ctx.globalAlpha = Math.max(0, 1 - k * 1.5); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 6 + 20 * k, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
    } else if (f.kind === 'stomp') {
      const L = f.life, id = f.tapak || 'biasa', TT = TAPAK[id] || TAPAK.biasa;
      if (f.t < 0.25) { const dy = (1 - f.t / 0.25) * 160; ctx.save(); ctx.fillStyle = 'rgba(0,0,0,' + (0.1 + 0.2 * f.t / 0.25) + ')'; ctx.beginPath(); ctx.ellipse(f.x, f.y + 14, 50, 14, 0, 0, TAU); ctx.fill(); ctx.restore(); drawTapakHand(ctx, f.x, f.y - dy - 10, 2.7, id, ANIM, 0); }
      else { const e = (f.t - 0.25) / (L - 0.25);
        palmPrint(ctx, f.x, f.y + 10, 2.9, id, 0.55 * Math.max(0, 1 - e));
        ctx.globalAlpha = Math.max(0, 1 - e); ctx.strokeStyle = id === 'biasa' ? '#FFE07A' : TT.warna; ctx.lineWidth = 8 * (1 - e) + 1; ctx.beginPath(); ctx.arc(f.x, f.y, 20 + 110 * e, 0, TAU); ctx.stroke();
        ctx.strokeStyle = 'rgba(80,50,30,.7)'; ctx.lineWidth = 3; for (let i = 0; i < 7; i++) { const an = i * 0.9 + 0.3; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x + Math.cos(an) * 60, f.y + Math.sin(an) * 40); ctx.stroke(); }
        if (e < 0.35) drawTapakHand(ctx, f.x, f.y - 10, 2.7, id, ANIM, 1 - e / 0.35);
        ctx.globalAlpha = 1; if (e < 0.4) label(ctx, 'TAPAK GERGASI!' + (f.kuat ? ' ×1.5' : ''), f.x, f.y - 70 - e * 20, 18, '#FFE07A'); }
    }
  }
  function drawTapHud(b) {
    const c0 = b.tapCharge || 0, R0 = 14, x = W - 26, y = 64;
    if (c0 >= STOMP_EVERY * 0.8 && !CALM()) { ctx.fillStyle = 'rgba(255,224,122,' + (0.25 + 0.2 * Math.sin(ANIM * 8)) + ')'; circ(ctx, x, y, R0 + 8); }
    ctx.fillStyle = 'rgba(30,40,60,.6)'; rr(ctx, x - 17, y + 19, 34, 13, 6.5); ctx.fill(); ctx.fillStyle = c0 >= STOMP_EVERY * 0.8 ? '#FFE07A' : '#FFFFFF'; ctx.font = '800 9px "Nunito", system-ui'; ctx.textAlign = 'center'; ctx.fillText(c0 + '/' + STOMP_EVERY, x, y + 28.5);
    ctx.fillStyle = 'rgba(30,40,60,.55)'; circ(ctx, x, y, R0 + 3); ctx.strokeStyle = '#FFE07A'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, R0, -Math.PI / 2, -Math.PI / 2 + TAU * c0 / STOMP_EVERY); ctx.stroke();
    drawTapakHand(ctx, x, y + 2, 0.4, tapakPakai(save), ANIM, 0);
    if ((b.combo || 0) >= 2 && b.comboT > 0) { const p = 1 + 0.15 * Math.max(0, b.comboT - tapWindow(save) + 0.15) / 0.15; ctx.save(); ctx.translate(W / 2, 80); ctx.scale(p, p); label(ctx, 'KOMBO ×' + b.combo, 0, 0, 16 + Math.min(10, b.combo / 5), b.combo >= 20 ? '#FF8A3A' : '#FFE07A'); ctx.restore();
      ctx.fillStyle = 'rgba(255,224,122,.8)'; ctx.fillRect(W / 2 - 40, 88, 80 * (b.comboT / tapWindow(save)), 3); }
  }
