  // ---------- Zaman Ais baharu ----------
  function iceBlock(z, k) {
    const x = z.x, y = z.y, r = z.r + 6, h = r * 1.15;
    ctx.save(); ctx.globalAlpha = Math.min(1, k);
    const g = ctx.createLinearGradient(x - r, y - h, x + r, y + h); g.addColorStop(0, 'rgba(235,250,255,.78)'); g.addColorStop(0.5, 'rgba(160,220,250,.55)'); g.addColorStop(1, 'rgba(110,190,240,.7)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - r * .7, y - h); ctx.lineTo(x + r * .6, y - h * 1.05); ctx.lineTo(x + r, y - h * .3); ctx.lineTo(x + r * .9, y + h * .8); ctx.lineTo(x - r * .2, y + h); ctx.lineTo(x - r, y + h * .6); ctx.lineTo(x - r * 1.05, y - h * .4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - r * .7, y - h); ctx.lineTo(x - r * .1, y - h * .2); ctx.lineTo(x + r, y - h * .3); ctx.moveTo(x - r * .1, y - h * .2); ctx.lineTo(x - r * .2, y + h); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.moveTo(x - r * .55, y - h * .85); ctx.lineTo(x - r * .3, y - h * .85); ctx.lineTo(x - r * .65, y - h * .1); ctx.lineTo(x - r * .85, y - h * .1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(x, y - h * 1.02, r * .75, r * .2, -0.05, Math.PI, 0); ctx.fill();
    if (Math.sin(ANIM * 3 + z.id) > 0.9) { ctx.fillStyle = '#FFFFFF'; star(ctx, x + r * .5, y - h * .5, 4, 5, 1.2, ANIM); }
    ctx.restore();
  }
  function drawIceAge(b) {
    const a = b.act.ais; if (!a) return; const dur = powDur('ais', b.save.powers.ais || 1), grow = Math.min(1, (dur - a.t) * 2.5), fade = Math.min(1, a.t * 2), k = grow * fade;
    const g = ctx.createRadialGradient(W / 2, WALL_Y / 2, 175, W / 2, WALL_Y / 2, 330); g.addColorStop(0, 'rgba(200,240,255,0)'); g.addColorStop(1, 'rgba(210,245,255,' + (0.42 * k) + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, WALL_Y); ctx.fillStyle = 'rgba(170,225,255,' + 0.04 * k + ')'; ctx.fillRect(0, 0, W, WALL_Y);
    ctx.fillStyle = 'rgba(235,250,255,' + 0.9 * k + ')';
    for (let i = 0; i < 18; i++) { const x = i * 20 + 6, h = (10 + (i * 37 % 7) * 4) * grow; ctx.beginPath(); ctx.moveTo(x - 5, 0); ctx.lineTo(x, h); ctx.lineTo(x + 5, 0); ctx.fill(); }
    ctx.strokeStyle = 'rgba(255,255,255,' + 0.55 * k + ')'; ctx.lineWidth = 1.5;
    for (const [cx, cy, s] of [[0, 0, 1], [W, 0, -1], [0, WALL_Y, 1], [W, WALL_Y, -1]]) for (let j = 0; j < 4; j++) { ctx.beginPath(); let px = cx, py = cy; ctx.moveTo(px, py); for (let q = 0; q < 5; q++) { px += s * (8 + j * 3) * grow; py += (cy ? -1 : 1) * (6 + q * 2 + j * 4) * grow; ctx.lineTo(px, py); } ctx.stroke(); }
    if (Math.random() < 0.8 * k) emit(Math.random() * W, -6, 1, { a: Math.PI / 2, spread: 0.4, spd: 50, warna: '#FFFFFF', size: 2.4, life: 3, drag: 0, shape: 'star', shrink: false });
  }
  function trackThaw(b) {
    for (const z of b.zombies) { const f = z.freezeT > 0; if (z._fz && !f) { emit(z.x, z.y, 14, { spd: 150, warna: ['#FFFFFF', '#BFEFFF', '#7FD0F0'], size: 3.5, life: 0.6, grav: 300, shape: 'shard', up: 60 }); sfx('shatter'); } z._fz = f; }
  }
  // ---------- hiasan event ----------
  function drawEventDecor(ev) {
    if (!ev) return;
    if (ev.hias === 'merdeka' || ev.hias === 'pesta') {
      for (let row = 0; row < 2; row++) { const y0 = 10 + row * 70; ctx.strokeStyle = 'rgba(80,60,40,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, y0); ctx.quadraticCurveTo(W / 2, y0 + 24, W, y0); ctx.stroke();
        for (let i = 0; i < 12; i++) { const t = (i + 0.5) / 12, x = t * W, y = y0 + 24 * 4 * t * (1 - t) * 0.5 + Math.sin(ANIM * 2 + i) * 1.5;
          if (ev.hias === 'merdeka') { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x - 7, y, 14, 10); ctx.fillStyle = '#CC0001'; for (let s = 0; s < 5; s += 2) ctx.fillRect(x - 7, y + s * 2, 14, 2); ctx.fillStyle = '#010066'; ctx.fillRect(x - 7, y, 7, 6); ctx.fillStyle = '#FFCC00'; circ(ctx, x - 3.6, y + 3, 1.6); }
          else { ctx.fillStyle = ['#E5484D', '#F2C230', '#4CAF7A', '#3B82C4', '#A066E8'][i % 5]; ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x + 7, y); ctx.lineTo(x, y + 12); ctx.fill(); } } }
    } else if (ev.hias === 'bungaapi') {
      if (Math.random() < 0.04) { const x = 40 + Math.random() * (W - 80), y = 40 + Math.random() * 160; emit(x, y, 30, { spd: 140, warna: [['#FFE07A', '#FF6A2B'], ['#9FE6FF', '#FFFFFF'], ['#FF9EC8', '#A066E8']][Math.floor(Math.random() * 3)], size: 2.6, life: 1.2, grav: 40, drag: 1.2, shape: 'star' }); }
    } else if (ev.hias === 'guru') {
      ctx.fillStyle = 'rgba(40,70,50,.8)'; rr(ctx, W / 2 - 92, 44, 184, 26, 6); ctx.fill(); ctx.strokeStyle = '#8A5A30'; ctx.lineWidth = 3; ctx.strokeRect(W / 2 - 92, 44, 184, 26);
      ctx.fillStyle = '#F4F7F8'; ctx.font = '700 13px "Baloo 2", system-ui'; ctx.textAlign = 'center'; ctx.fillText('Selamat Hari Guru!', W / 2, 62);
      for (let i = 0; i < 4; i++) { const x = (i * 97 + ANIM * 20) % (W + 40) - 20, y = 110 + i * 70 + Math.sin(ANIM + i) * 10; ctx.save(); ctx.translate(x, y); ctx.rotate(0.6); ctx.fillStyle = '#F2C230'; ctx.fillRect(-10, -2.5, 18, 5); ctx.fillStyle = '#F2D0A4'; ctx.beginPath(); ctx.moveTo(8, -2.5); ctx.lineTo(13, 0); ctx.lineTo(8, 2.5); ctx.fill(); ctx.fillStyle = '#E5484D'; ctx.fillRect(-12, -2.5, 3, 5); ctx.restore(); }
    }
  }

  // ---------- keadaan permainan ----------
  let god = false, battle = null, running = false, speed = 1, auto = false, autoT = 0, shownEnd = false;
  function newBattle(stage) { battle = new Battle(save, stage); battle.dmgNums = save.settings.dmgNum !== false && !CALM(); battle.god = god; battle.now = Date.now(); battle.pcd = powerCd; battle.autoPower = save.autoPow; shownEnd = false; updateStageBar(); }
  function startBattle() { hideOverlay(); running = true; updateControls(); auInit(); tutAdvance(0); showScreen('battle'); }
  function updateStageBar() {
    $('bStage').classList.toggle('chal', !!battle.chal);
    $('bStage').textContent = battle.chal ? chalLabel(battle.chal) : (battle.diff.id === 'normal' ? '' : battle.diff.ikon + ' ' + battle.diff.nama + ' · ') + 'Stage ' + battle.stage + ' · ' + stageName(battle.stage);
    if (battle.chal && battle.chal.raid != null) { $('stageName').textContent = chalLabel(battle.chal); $('fp').textContent = 'Serbuan Boss · stage ' + battle.stage; }
    else if (battle.chal) { const c = CHALLENGES.find(x => x.id === battle.chal.id); $('stageName').textContent = '⚔ ' + c.nama + ' Lv.' + battle.chal.lvl; $('fp').textContent = 'Cabaran · ' + battle.maxWave + ' gelombang · stage ' + battle.stage; $('stagePrev').disabled = false; $('stageNext').disabled = false; return; }
    $('stageName').textContent = (diffOf(save).id === 'normal' ? '' : diffOf(save).ikon + ' ') + 'Stage ' + battle.stage + ': ' + stageName(battle.stage); refreshModeChip();
    $('stagePrev').disabled = battle.stage <= 1;
    $('stageNext').disabled = battle.stage >= save.best;
    $('fp').textContent = save.cleared.includes(battle.stage) ? 'First Pass sudah dituntut' : 'First Pass: +' + firstPassGems(battle.stage) + ' gems';
  }
  function updateControls() { $('btnPlay').textContent = running ? 'Jeda' : 'Mula'; $('btnSpeed').textContent = 'Laju ' + speed + 'x'; $('btnAuto').setAttribute('aria-pressed', auto); }

  // ---------- overlay ----------
  function showOverlay(title, body, btns) {
    $('ovTitle').textContent = title; $('ovBody').textContent = body;
    const box = $('ovBtns'); box.innerHTML = '';
    btns.forEach(([label, fn, cls]) => { const b = document.createElement('button'); b.textContent = label; b.className = cls || 'btn'; b.addEventListener('click', fn); box.appendChild(b); });
    $('overlay').hidden = false;
  }
  function hideOverlay() { $('overlay').hidden = true; }
  function introOverlay() {
    showOverlay('Stage ' + battle.stage + ': ' + stageName(battle.stage), (isBigBoss(battle.stage) ? 'Stage boss besar! ' : '') + battle.maxWave + ' gelombang, boss di gelombang terakhir. Hero menembak sendiri. Tekan zombie untuk bantu.', [['Mula', startBattle, 'btn big']]);
  }
  function endOverlay0() {
    shownEnd = true; running = false; updateControls(); persist(); refreshAll(); sfx(battle.state === 'menang' ? 'win' : 'lose'); if (battle.state !== 'menang') vib(300);
    if (battle.chal && battle.chal.raid != null) {
      const i = battle.chal.raid;
      if (battle.state === 'menang') { const r = raidWin(save, i, Date.now()); persist(); raidSig = ''; refreshAll(); sfx('trophy');
        const rd = save.raid, more = rd.step < RAID_STEPS;
        showOverlay(more ? '👑 Boss ditewaskan!' : '🏆 Serbuan selesai!', r.msg, (more ? [['Boss ' + (rd.step + 1) + ' seterusnya', () => startRaid(), 'btn big']] : []).concat([['Kembali ke stage ' + save.stage, () => { newBattle(save.stage); introOverlay(); }, 'btn ghost']]));
      } else showOverlay('Serbuan gagal', 'Boss masih berdiri. Kuatkan pasukan dan cuba lagi — kemajuan minggu ini kekal.', [['Cuba lagi', () => startRaid(), 'btn big'], ['Kembali ke stage ' + save.stage, () => { newBattle(save.stage); introOverlay(); }, 'btn ghost']]);
      return;
    }
    if (battle.chal) {
      const c = CHALLENGES.find(x => x.id === battle.chal.id), lv = battle.chal.lvl;
      if (battle.state === 'menang') { const r = winChallenge(save, c.id, lv, Math.random); persist(); refreshAll();
        const nx = Math.min(CHAL_LEVELS, chalNext(save, c)), more = (save.chal[c.id] || 0) < CHAL_LEVELS;
        showOverlay('Cabaran menang!', r.msg, (more ? [['Lv.' + nx + ' seterusnya', () => startChallenge(c, nx), 'btn big']] : []).concat([['Kembali ke stage ' + save.stage, () => { newBattle(save.stage); introOverlay(); }, 'btn ghost']]));
      } else showOverlay('Cabaran gagal', 'Sampai gelombang ' + battle.wave + '/' + battle.maxWave + '. Kuatkan pasukan dan cuba lagi.', [['Cuba lagi', () => startChallenge(c, lv), 'btn big'], ['Kembali ke stage ' + save.stage, () => { newBattle(save.stage); introOverlay(); }, 'btn ghost']]);
      return;
    }
    if (battle.state === 'menang') {
      if (battle.skipped) toast('🚀 Menang mudah! Lompat terus ke stage ' + save.stage + ' (+' + battle.skipped + ' stage, First Pass dikutip)', true);
      showOverlay(battle.skipped ? '🚀 Lompatan +' + battle.skipped + '!' : 'Stage lepas!', 'Gold +' + fmt(battle.earnedGold) + (battle.earnedGems ? ', gems +' + battle.earnedGems : '') + '.', [['Stage seterusnya', () => { newBattle(save.stage); startBattle(); }, 'btn big'], ['Main semula', () => { newBattle(battle.stage); startBattle(); }, 'btn ghost']]);
    } else {
      const can = save.gold >= cheapestUpgrade(save), tips = [];
      if (can) tips.push('Ada gold untuk naik taraf!');
      if (HERO_ORDER.some(h => !save.heroes[h] && (save.shards[h] || 0) >= TIERS[HEROES[h].tier].bina)) tips.push('Ada hero boleh dibina dengan shard.');
      if (save.team.length < save.slots && Object.keys(save.heroes).length > save.team.length) tips.push('Slot pasukan masih kosong.');
      if (!tips.length) tips.push('Main stage lebih rendah untuk kumpul gold, atau guna kuasa semasa bertempur.');
      const btns = [];
      if (can) btns.push(['⬆ Naik semua & cuba lagi', () => { const r = upgradeAll(save); persist(); refreshAll(); toast(r.msg, r.ok); sfx('up'); newBattle(battle.stage); startBattle(); }, 'btn big']);
      btns.push(['Cuba lagi', () => { newBattle(battle.stage); startBattle(); }, can ? 'btn' : 'btn big']);
      if (battle.stage > 1) btns.push(['Main stage ' + (battle.stage - 1) + ' (kumpul gold)', () => { newBattle(battle.stage - 1); startBattle(); }, 'btn ghost']);
      btns.push(['Naik taraf sendiri', () => { hideOverlay(); newBattle(battle.stage); setTab('hero'); introOverlay(); }, 'btn ghost']);
      showOverlay('Pagar roboh', 'Sampai gelombang ' + battle.wave + '/' + battle.maxWave + '. Gold +' + fmt(battle.earnedGold) + ' disimpan. 💡 ' + tips.join(' '), btns);
    }
    if (auto && !battle.chal) autoT = 2.2;
  }

  // ---------- ikon ----------
  const coin = '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#F5B82E"/><circle cx="10" cy="10" r="6" fill="none" stroke="#C98A12" stroke-width="2"/></svg>';
  const gem = '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3h10l4 5-9 10L1 8z" fill="#A066E8"/><path d="M5 3l5 15 5-15M1 8h18" fill="none" stroke="#D7BDFB" stroke-width="1.2"/></svg>';
  const cur = m => (m === 'gold' ? coin : gem);
  $('icGold').innerHTML = coin; $('icGems').innerHTML = gem;

  // ---------- tab HERO ----------
  const heroCards = {};
  function afterChange(msg, ok) { sfx(ok ? (/★|bintang|menyertai|Trofi|trofi|dituntut/.test(msg) ? 'star' : /Misi|Hari|Bonus/.test(msg) ? 'coin' : 'up') : 'bad'); toast(msg, ok); if (ok) { persist(); battle.syncTeam(); portraitSig = {}; } refreshAll(); }
  function buildHeroes() {
    initHeroFilters();
    const box = $('heroList'); box.innerHTML = '';
    HERO_ORDER.forEach(id => {
      const d = HEROES[id], el = document.createElement('div'); el.className = 'card hero';
      const T0 = TIERS[d.tier];
      el.innerHTML = '<div class="pcol"><canvas width="112" height="112" aria-hidden="true"></canvas><span class="tier" style="background:' + T0.warna + '">' + T0.nama + '</span></div><div class="info"><h3>' + esc(d.nama) + ' <span class="lv"></span> <span class="tagT" hidden>Dalam pasukan</span></h3><p class="stars"></p><p class="kp">' + (() => { const K = KELAS[d.kelas], R = PERANAN[d.peranan]; return '<span class="wtg">' + K.ikon + ' ' + K.nama + ': ' + K.fam.map(f => FAM[f].ikon + ' ' + FAM[f].nama).join(' / ') + '</span><span class="wtg f" title="' + esc(R.desc) + '">' + R.ikon + ' ' + R.nama + '</span><span class="wtg u">⭐ Pakar ' + FAM[d.pakar].ikon + ' ' + FAM[d.pakar].nama + ' +30%</span>'; })() + '</p><p class="sk"></p><div class="sbar"><div class="fill"></div><span></span></div><p class="wl"></p><p class="st"></p><p class="eq"></p><label class="wsel"><canvas class="mini" aria-hidden="true"></canvas><select aria-label="Senjata ' + esc(d.nama) + '"></select></label></div><div class="acts"><button class="btn up"></button><button class="btn ghost x10">×10</button><button class="btn star">★</button><button class="btn ghost more" aria-label="Lagi pilihan">⋯</button><div class="moreBox" hidden><button class="btn ghost tm"></button><div class="row2 fm"><button class="btn ghost mvL" aria-label="Alih ke kiri">◀</button><button class="btn ghost mvR" aria-label="Alih ke kanan">▶</button></div><button class="btn ghost buy5"></button></div></div>';
      el.querySelector('select').addEventListener('change', e => { if (e.target.value === 'batu') { delete save.heroWpn[id]; afterChange(HEROES[id].nama + ' kini tanpa senjata', true); return; } const r = equipWeapon(save, id, e.target.value); afterChange(r.msg, r.ok); });
      el.querySelector('.up').addEventListener('click', () => { const r = save.heroes[id] ? upgradeHero(save, id, 1) : unlockHero(save, id); afterChange(r.msg, r.ok); });
      el.querySelector('.more').addEventListener('click', () => { const mb = el.querySelector('.moreBox'); mb.hidden = !mb.hidden; el.querySelector('.more').textContent = mb.hidden ? '⋯' : '✕'; });
      el.querySelector('.mvL').addEventListener('click', () => { const r = moveTeam(save, id, -1); afterChange(r.msg, r.ok); });
      el.querySelector('.mvR').addEventListener('click', () => { const r = moveTeam(save, id, 1); afterChange(r.msg, r.ok); });
      el.querySelector('.star').addEventListener('click', () => { const r = save.heroes[id] ? starUp(save, id) : unlockHero(save, id); afterChange(r.msg, r.ok); });
      el.querySelector('.buy5').addEventListener('click', () => { const r = buyShards(save, id); afterChange(r.msg, r.ok); });
      el.querySelector('.x10').addEventListener('click', () => { const r = upgradeHero(save, id, 10); afterChange(r.msg, r.ok); });
      el.querySelector('.tm').addEventListener('click', () => { const r = toggleTeam(save, id); afterChange(r.msg, r.ok); });
      const dl = document.createElement('div'); dl.className = 'doll'; el.insertBefore ? el.insertBefore(dl, el.firstChild) : el.appendChild(dl);
      dl.addEventListener('click', e => { if (!e || !e.target || !e.target.closest) return; const b = e.target.closest('.dslot'); if (b) { pickSlot(id, b.dataset.s); return; }
        const k = e.target.closest('.skb'); if (k && !k.disabled) { const r = equipSkin(save, id, k.dataset.k); afterChange(r.msg, r.ok); return; }
        const sr = e.target.closest('.strow'); if (sr) toast(statSource(id, sr.dataset.st), true); });
      heroCards[id] = el; box.appendChild(el);
    });
    $('btnSlot').addEventListener('click', () => { const r = buySlot(save); afterChange(r.msg, r.ok); });
  }
  const STAR_COL = ['#C08A50', '#AEB8C6', '#F2C230', '#A066E8', '#E5484D'];
  function starRow(s) {
    if (s >= MAX_STARS) return '<span class="srow" style="color:#E5484D">★★★★★★★★★★</span> <b>50/50</b>';
    const band = Math.floor(s / 10), fill = s % 10, col = STAR_COL[band];
    let h = '<span class="srow">'; for (let i = 0; i < 10; i++) h += '<i style="color:' + (i < fill ? col : (band ? STAR_COL[band - 1] : 'var(--line)')) + '">★</i>'; return h + '</span> <b>' + s + '/50</b>';
  }
  function eqLine(id) {
    const e = save.equip[id] || {}, parts = [];
    HERO_SLOTS.forEach(s => { const it = e[s] != null ? save.items.find(x => x.uid === e[s]) : null; if (it) parts.push('<span style="color:' + RARITY[it.rar].warna + '">' + esc(itemName(it)) + '</span>'); });
    return parts.length ? parts.join(' · ') : '<span class="muted">Tiada item dipasang</span>';
  }
  let portraitSig = {};
  const HERO_ART = {
    ninja: 'hero-01-ninja-amir.png', askar: 'hero-02-sarjan-rahim.png',
    saintis: 'hero-03-dr-lina.png', jurutera: 'hero-04-jurutera-wei.png',
    ratu_ais: 'hero-05-ratu-salju.png', pahlawan: 'hero-06-hang-kilat.png',
    komander: 'hero-07-komander-zara.png', pistol: 'hero-08-pak-usu.png',
    budak: 'hero-09-budak-lastik.png', shotgun: 'hero-10-kak-long.png',
    mesingan: 'hero-11-abang-jo.png'
  };
  const heroArtImages = {};
  Object.entries(HERO_ART).forEach(([id, file]) => {
    const img = new Image();
    img.onload = () => { portraitSig[id] = ''; if (heroCards[id]) paintPortrait(id); };
    img.src = 'heroes/' + file;
    heroArtImages[id] = img;
  });
  let heroFilter = 'semua', heroQuery = '';
  function applyHeroFilters() {
    const q = heroQuery.trim().toLocaleLowerCase();
    let shown = 0;
    HERO_ORDER.forEach(id => {
      const el = heroCards[id]; if (!el) return;
      const owned = !!save.heroes[id], inTeam = save.team.includes(id);
      const statusOK = heroFilter === 'pasukan' ? inTeam :
        heroFilter === 'milik' ? owned && !inTeam :
        heroFilter === 'belum' ? !owned : true;
      el.hidden = !(statusOK && (!q || (HEROES[id].nama + ' ' + id + ' ' + el.textContent).toLocaleLowerCase().includes(q)));
      if (!el.hidden) shown++;
    });
    const count = $('heroResult'); if (count) count.textContent = shown + ' / ' + HERO_ORDER.length + ' hero';
  }
  function initHeroFilters() {
    const search = $('heroSearch'), filters = $('heroFilters');
    if (!search || search._ready) return;
    search._ready = true;
    search.addEventListener('input', () => { heroQuery = search.value; applyHeroFilters(); });
    filters.addEventListener('click', e => {
      const b = e.target.closest('[data-hero-filter]'); if (!b) return;
      heroFilter = b.dataset.heroFilter;
      filters.querySelectorAll('[data-hero-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      applyHeroFilters();
    });
  }
  function paintPortrait(id) {
    const wid = heroWeapon(save, id), key = wid + (save.heroes[id] ? 1 : 0) + gearSig(save, id);
    if (portraitSig[id] === key) return; portraitSig[id] = key;
    const cvs = heroCards[id].querySelector('canvas'), c = cvs.getContext('2d');
    paintIcon(heroCards[id].querySelector('.mini'), cc => weaponIcon(cc, wid), 30);
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 112, 112);
    const art = heroArtImages[id];
    if (art && art.complete && art.naturalWidth) {
      c.imageSmoothingEnabled = false; c.drawImage(art, 0, 0, 112, 112);
    } else {
      c.scale(2, 2); drawHero(c, 28, 31, id, -Math.PI / 4, 0, 0.92, wid, { t: 0.5, phase: 0, mood: 'main', gear: gearOf(save, id), skin: heroSkin(save, id) });
    }
  }
  let wselSig = '';
  function refreshHeroes() {
    const ownedW = WEAPON_ORDER.filter(w => save.weapons[w]), holder = {}; HERO_ORDER.forEach(h => { if (save.heroes[h]) holder[heroWeapon(save, h)] = h; }); const sig = ownedW.map(w => w + save.weapons[w] + (holder[w] || '')).join(',');
    const rebuildSel = sig !== wselSig; wselSig = sig;
    $('slotInfo').textContent = 'Pasukan ' + save.team.length + '/' + save.slots + ' slot';
    const sb = $('btnSlot');
    if (save.slots >= MAX_SLOTS) { sb.textContent = 'Slot maksimum'; sb.disabled = true; } else { sb.innerHTML = 'Buka slot ' + (save.slots + 1) + ' ' + gem + SLOT_COST[save.slots + 1]; sb.disabled = save.gems < SLOT_COST[save.slots + 1]; }
    const now = Date.now();
    const rank = id => { const ti = save.team.indexOf(id); if (ti >= 0) return ti; if (save.heroes[id]) return 100 - HEROES[id].tier * 5 - Math.min(4, (save.stars[id] || 0) / 12); const T0 = TIERS[HEROES[id].tier]; return 300 - Math.round(Math.min(1, (save.shards[id] || 0) / T0.bina) * 100); };
    HERO_ORDER.slice().sort((a, b) => rank(a) - rank(b)).forEach((id, i) => { heroCards[id].style.order = i; });
    HERO_ORDER.forEach(id => {
      const el = heroCards[id], lvl = save.heroes[id], up = el.querySelector('.up'), x10 = el.querySelector('.x10'), tm = el.querySelector('.tm');
      const inTeam = save.team.includes(id);
      el.classList.toggle('locked', !lvl); el.classList.toggle('inteam', inTeam);
      el.querySelector('.tagT').hidden = !inTeam; el.querySelector('.tagT').textContent = inTeam ? 'Pasukan #' + (save.team.indexOf(id) + 1) : ''; el.querySelector('.fm').hidden = !inTeam; el.querySelector('.mvL').disabled = save.team.indexOf(id) <= 0; el.querySelector('.mvR').disabled = save.team.indexOf(id) >= save.team.length - 1;
      paintPortrait(id);
      const sel = el.querySelector('select'), wid = heroWeapon(save, id), wd = WEAPONS[wid];
      if (rebuildSel || sel.dataset.v !== wid) { const okW = wpnChoices(save, id); sel.innerHTML = '<option value="batu">🪨 Tiada senjata (Baling Batu)</option>' + okW.map(w => '<option value="' + w + '">' + AFF[wAff(id, w)].ikon + ' ' + esc(WEAPONS[w].nama) + ' Lv.' + save.weapons[w] + (holder[w] && holder[w] !== id ? ' · dipakai ' + esc(HEROES[holder[w]].nama) : '') + '</option>').join(''); sel.value = wid; sel.dataset.v = wid; }
      el.classList.toggle('nowpn', !!lvl && wid === 'batu');
      el.querySelector('.wsel').hidden = !lvl;
      el.querySelector('.wl').innerHTML = wid === 'batu' && lvl ? '<b class="warnw">🔫 Pasang senjata!</b> Beli senjata ' + KELAS[HEROES[id].kelas].fam.map(f => FAM[f].ikon + ' ' + FAM[f].nama).join(' / ') + ' di tab Senjata.' : (() => { const A0 = AFF[wAff(id, wid)]; return '<b>' + esc(wd.nama) + '</b> <span class="affb aff_' + wAff(id, wid) + '">' + A0.ikon + ' ' + A0.nama + ' · ' + A0.desc + '</span><br>' + esc(wd.desc); })();
      el.querySelector('.lv').textContent = lvl ? 'Lv.' + lvl : 'Belum dibina';
      const sh = save.shards[id] || 0, stars = save.stars[id] || 0, need = lvl ? (stars >= MAX_STARS ? 0 : starCost(stars + 1)) : TIERS[HEROES[id].tier].bina;
      el.querySelector('.sk').innerHTML = '<b>' + esc(SKILLS[id].nama) + '</b> Lv.' + skillLvl(save, id) + ': ' + esc(SKILLS[id].desc) + '<br><b class="ultn">' + ULTS[id].ikon + ' Ultimate: ' + esc(ULTS[id].nama) + '</b> — ' + esc(ultDesc(save, id));
      el.querySelector('.stars').innerHTML = lvl ? starRow(stars) : '<span class="muted">Kumpul shard untuk membina hero ini</span>';
      el.querySelector('.sbar .fill').style.width = (need ? Math.min(100, sh / need * 100) : 100) + '%';
      el.querySelector('.sbar span').textContent = need ? 'Shard ' + sh + '/' + need : 'Shard ' + sh + ' (bintang penuh)';
      const sbtn = el.querySelector('.star'), b5 = el.querySelector('.buy5');
      if (lvl) { sbtn.innerHTML = stars >= MAX_STARS ? '★ Maksimum' : '★ Naik bintang'; sbtn.disabled = !need || sh < need; }
      else { sbtn.innerHTML = 'Bina hero'; sbtn.disabled = sh < need; }
      b5.innerHTML = '+5 shard ' + gem + TIERS[HEROES[id].tier].sGem; b5.disabled = save.gems < TIERS[HEROES[id].tier].sGem;
      if (lvl) {
        const st = heroStats(save, id, now);
        el.querySelector('.st').textContent = 'Damage ' + fmt(st.dmg) + ', ' + st.rate.toFixed(2) + '/s' + (st.crit ? ', kritikal ' + Math.round(st.crit * 100) + '%' : '');
        el.querySelector('.eq').innerHTML = eqLine(id);
        const c = upCost(lvl); up.hidden = false; up.innerHTML = 'Naik ' + coin + fmt(c); up.disabled = save.gold < c;
        x10.hidden = false; x10.disabled = save.gold < c; tm.hidden = false; el.querySelector('.more').hidden = false;
        tm.textContent = inTeam ? 'Keluar' : 'Masuk'; tm.disabled = !inTeam && save.team.length >= save.slots;
      } else {
        el.querySelector('.st').textContent = ''; el.querySelector('.eq').textContent = '';
        up.hidden = true; x10.hidden = true; tm.hidden = true; el.querySelector('.more').hidden = false;
      }
    });
    applyHeroFilters();
  }

  // ---------- tab SENJATA ----------
  const wpnCards = {};
  let wpnF = 'semua', wpnJ = 'semua', wpnR = -1, wpnO = false, wpnIO = null;
  // v9.8: lukis ikon hanya bila kad kelihatan (232 kad)
  function wpnPaint(el) { if (el._painted) return; el._painted = true; paintIcon(el.querySelector('canvas'), c => weaponIcon(c, el._id, save.weapons[el._id] || 1), 56); }
  function wpnWatch(el) { if (!wpnIO && typeof IntersectionObserver === 'function') wpnIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { wpnPaint(e.target); wpnIO.unobserve(e.target); } }), { rootMargin: '300px' }); if (wpnIO) wpnIO.observe(el); else wpnPaint(el); }
  // v9.9: grafik bar stat + banding ▲▼ dengan senjata yang sedang dipakai
  const WBAR = [['dmg', '⚔ Damage', '#FF7A5A'], ['rate', '⚡ Laju', '#FFC34A'], ['range', '🎯 Jarak', '#5AB8FF'], ['dps', '💥 DPS', '#B48AF5']];
  function wpnCmpRef(id) { const team = save.team.filter(h => save.heroes[h]); if (!team.length) return null; const h = team.find(x => inClass(x, id) && heroWeapon(save, x) !== id) || team.find(x => heroWeapon(save, x) !== id); if (!h) return null; const w = heroWeapon(save, h); return w === 'batu' ? null : { wid: w, h }; }
  function wbarVal(k, v) { return k === 'rate' ? v.toFixed(2) + '/s' : k === 'range' ? Math.round(v) + '' : fmt(v); }
  function wpnBarsHtml(id, ref) { const S = wpnBarStats(save, id), M = wpnBarMax(), lv1 = wpnBarStats(null, id), R = ref ? wpnBarStats(save, ref.wid) : null;
    return '<div class="wbars">' + WBAR.map(([k, nm, col]) => { const p = Math.max(3, Math.min(100, lv1[k] / M[k] * 100)); let d = '';
      if (R && R[k] > 0) { const r = S[k] / R[k] - 1; if (Math.abs(r) >= 0.01) d = '<em class="' + (r > 0 ? 'up' : 'dn') + '">' + (r > 0 ? '▲' : '▼') + Math.round(Math.abs(r) * 100) + '%</em>'; }
      return '<div class="wbar"><span>' + nm + '</span><div class="tr"><div class="fl" style="width:' + p.toFixed(1) + '%;background:' + col + '"></div></div><b>' + wbarVal(k, S[k]) + '</b>' + d + '</div>'; }).join('') +
      (R ? '<small class="muted">▲▼ berbanding ' + esc(WEAPONS[ref.wid].nama) + ' (' + esc(HEROES[ref.h].nama) + ')</small>' : '') + '</div>'; }
  let wpnCmp = [];
  function wpnCmpToggle(id) { const i = wpnCmp.indexOf(id); if (i >= 0) wpnCmp.splice(i, 1); else { wpnCmp.push(id); if (wpnCmp.length > 2) wpnCmp.shift(); } refreshWeapons(); if (wpnCmp.length === 2) wpnCmpShow(); }
  function wpnCmpShow() { const [a, b] = wpnCmp, Sa = wpnBarStats(save, a), Sb = wpnBarStats(save, b), M = wpnBarMax();
    const col = (id, S, O) => '<div class="cmpcol"><canvas data-ci="' + id + '" width="96" height="96" aria-hidden="true"></canvas><b>' + esc(WEAPONS[id].nama) + '</b><small>' + W_RAR_NAMA[WEAPONS[id].rar].ikon + ' ' + W_RAR_NAMA[WEAPONS[id].rar].nama + ' · ' + FAM[W_FAM[id]].ikon + ' ' + FAM[W_FAM[id]].nama + (save.weapons[id] ? ' · Lv.' + save.weapons[id] : ' · belum dimiliki') + '</small>' +
      WBAR.map(([k, nm, c]) => { const win = S[k] > O[k] * 1.005; return '<div class="wbar' + (win ? ' win' : '') + '"><span>' + nm + '</span><div class="tr"><div class="fl" style="width:' + Math.max(3, Math.min(100, S[k] / Math.max(S[k], O[k]) * 100)).toFixed(1) + '%;background:' + c + '"></div></div><b>' + wbarVal(k, S[k]) + (win ? ' ✔' : '') + '</b></div>'; }).join('') +
      '<small class="wpk">' + esc(wDesc(id)) + '</small></div>';
    showModal('⚖ Bandingkan senjata', '<div class="cmpgrid">' + col(a, Sa, Sb) + col(b, Sb, Sa) + '</div><p class="muted small">Termasuk level dan ★ senjata anda. Padanan hero (⭐ / ✅ / ⚠) belum dikira.</p>', [['Tutup', () => { wpnCmp = []; refreshWeapons(); }, 'btn big']]);
    ((($('mBody').querySelectorAll && $('mBody').querySelectorAll('canvas[data-ci]')) || [])).forEach(cv => paintIcon(cv, c => weaponIcon(c, cv.dataset.ci, save.weapons[cv.dataset.ci] || 1), 96)); }
  function wDesc(id) { const w = WEAPONS[id], p = wPerkText(id); return w.desc + (p ? ' · ' + p : ''); }
  function buildWeapons() {
    { const r2 = $('wpnFilt2'); if (r2 && !r2._b) { r2._b = 1; $('wpnJenis').innerHTML = '<option value="semua">Semua jenis</option>' + Object.keys(FAM).map(f => '<option value="' + f + '">' + FAM[f].ikon + ' ' + esc(FAM[f].nama) + ' (' + FAM_OF[f].length + ')</option>').join(''); $('wpnRar').innerHTML = '<option value="-1">Semua kelangkaan</option>' + W_RAR_NAMA.map((R, i) => '<option value="' + i + '">' + R.ikon + ' ' + R.nama + '</option>').join('');
      $('wpnJenis').addEventListener('change', e => { wpnJ = e.target.value; refreshWeapons(); }); $('wpnRar').addEventListener('change', e => { wpnR = +e.target.value; refreshWeapons(); }); $('wpnOwn').addEventListener('click', () => { wpnO = !wpnO; $('wpnOwn').setAttribute('aria-pressed', wpnO); refreshWeapons(); }); } }
    const wf = $('wpnFilt'); if (wf && !wf._b) { wf._b = 1; wf.addEventListener('click', e => { const b = e && e.target && e.target.closest ? e.target.closest('[data-wf]') : null; if (!b) return; wpnF = b.dataset.wf; (wf.querySelectorAll ? wf.querySelectorAll('[data-wf]') : []).forEach(x => x.setAttribute('aria-pressed', x === b)); refreshWeapons(); }); }
    const box = $('wpnList'); box.innerHTML = '';
    WEAPON_ORDER.forEach(id => {
      const w = WEAPONS[id], el = document.createElement('div'); el.className = 'card wpn';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(w.nama) + ' <span class="lv"></span></h3><p><span class="wtg" style="border-color:' + W_RAR_NAMA[w.rar].warna + '">' + W_RAR_NAMA[w.rar].ikon + ' ' + W_RAR_NAMA[w.rar].nama + '</span><span class="wtg">' + FAM[W_FAM[id]].ikon + ' ' + FAM[W_FAM[id]].nama + '</span><span class="wtg ' + w.jenis + '">' + JENIS_NAMA[w.jenis] + '</span><span class="wtg ' + (w.udara ? 'u' : 'd') + '">' + (w.udara ? '⬆⬇ Udara+Darat' : '⬇ Darat') + '</span>' + (w.aa > 1 ? '<span class="wtg u">+50% udara</span>' : '') + (w.bossB ? '<span class="wtg f">+30% boss</span>' : '') + (id === 'railgun' ? '<span class="wtg f">tembus perisai</span>' : '') + '</p><p class="muted wcls wel">' + (() => { const E = ELEMEN[wElem(id)]; return E.ikon + ' ' + E.nama + (E.kuat.length ? ' · <b class="ku">Kuat: ' + E.kuat.map(z => ZEL_IKON[z] + ' ' + z).join(', ') + '</b>' : ' · neutral') + (E.lemah.length ? ' · <b class="le">Lemah: ' + E.lemah.map(z => ZEL_IKON[z] + ' ' + z).join(', ') + '</b>' : ''); })() + '</p><p class="muted wcls">✅ Sekelas untuk: ' + Object.keys(KELAS).filter(k => KELAS[k].fam.includes(W_FAM[id])).map(k => KELAS[k].ikon + ' ' + KELAS[k].nama).join(', ') + '</p><p>' + esc(w.desc) + '</p><p class="st"></p><p class="wshb muted"></p><div class="sbar wsb"><div class="fill"></div><span></span></div><p class="who muted"></p></div><div class="acts"><button class="btn up"></button><div class="row2"><button class="btn ghost x10">×10</button><button class="btn ghost try">Uji</button></div><div class="row2 ws"><button class="btn star wsu">★</button><button class="btn ghost wdu">🧪</button></div><button class="btn ghost wtgt">🎯 Sasaran</button><button class="btn ghost wcmp">⚖ Banding</button></div>';
      el._ev = wpnEvo(save.weapons[id] || 1); el._id = id; wpnWatch(el); el._bars = document.createElement('div'); el._bars.className = 'wfull'; el.appendChild(el._bars); { const pt = wPerkText(id); if (pt) { const q = document.createElement('p'); q.className = 'wpk'; q.textContent = pt; const st = el.querySelector('.st'); if (st && st.parentNode && st.parentNode.insertBefore) st.parentNode.insertBefore(q, st); } }
      el.querySelector('canvas').addEventListener('click', () => openShowcase(id));
      el.querySelector('.try').addEventListener('click', () => startPreview(id));
      const evCheck = (had, ev0) => { const lv = save.weapons[id] || 0; if (!had && lv) { openShowcase(id, '🎉 Senjata baharu'); sfx('trophy'); } else if (wpnEvo(lv) > ev0) { openShowcase(id, '✨ EVOLUSI ' + WPN_EVO_NAMA[wpnEvo(lv)].toUpperCase()); sfx('trophy'); } };
      el.querySelector('.up').addEventListener('click', () => { const had = !!save.weapons[id], ev0 = wpnEvo(save.weapons[id] || 1), r = had ? upgradeWeapon(save, id, 1) : canBuyWeapon(id) ? unlockWeapon(save, id) : null; if (!r) { setTab('kedai'); showKedai('wpeti'); return; } afterChange(r.msg, r.ok); if (r.ok) evCheck(had, ev0); });
      el.querySelector('.x10').addEventListener('click', () => { const ev0 = wpnEvo(save.weapons[id] || 1), r = upgradeWeapon(save, id, 10); afterChange(r.msg, r.ok); if (r.ok) evCheck(true, ev0); });
      el.querySelector('.wsu').addEventListener('click', () => { const r = wStarUp(save, id); afterChange(r.msg, r.ok); if (r.ok && wStars(save, id) >= 3) { openShowcase(id, '★' + wStars(save, id) + ' ' + WEAPONS[id].nama); sfx('trophy'); } });
      el.querySelector('.wcmp').addEventListener('click', () => wpnCmpToggle(id));
      el.querySelector('.wtgt').addEventListener('click', () => { const r = setWTarget(save, id); afterChange(r.msg, r.ok); });
      el.querySelector('.wdu').addEventListener('click', () => { const had = !!save.weapons[id], r = wDustBuy(save, id, 1); afterChange(r.msg, r.ok); if (r.ok && !had && save.weapons[id]) { openShowcase(id, '🎉 Senjata baharu'); sfx('trophy'); } });
      wpnCards[id] = el; box.appendChild(el);
    });
  }
  function refreshWeapons() {
    const used = {}; save.team.forEach((h, i) => { const w = heroWeapon(save, h); if (used[w] == null) used[w] = i; });
    const wrank = id => used[id] != null ? used[id] : save.weapons[id] ? 50 - Math.min(40, save.weapons[id] / 5) : 100 + WEAPON_ORDER.indexOf(id);
    WEAPON_ORDER.slice().sort((a, b) => wrank(a) - wrank(b)).forEach((id, i) => { wpnCards[id].style.order = i; wpnCards[id].classList.toggle('inteam', used[id] != null); const w = WEAPONS[id]; wpnCards[id].hidden = !(wpnF === 'semua' || (wpnF === 'u' ? w.udara : w.jenis === wpnF)) || (wpnJ !== 'semua' && W_FAM[id] !== wpnJ) || (wpnR >= 0 && w.rar !== wpnR) || (wpnO && !save.weapons[id]); });
    $('wpnCount').textContent = Object.keys(save.weapons).length + '/' + WEAPON_ORDER.length + ' senjata dimiliki';
    WEAPON_ORDER.forEach(id => {
      const w = WEAPONS[id], el = wpnCards[id], lvl = save.weapons[id], up = el.querySelector('.up'), x10 = el.querySelector('.x10');
      if (el._ev !== wpnEvo(lvl || 1)) { el._ev = wpnEvo(lvl || 1); if (el._painted) paintIcon(el.querySelector('canvas'), c => weaponIcon(c, id, lvl || 1), 56); }
      el.classList.toggle('locked', !lvl);
      { const st = wStars(save, id), sh = wShards(save, id), need = wNeed(save, id), dc = W_DUST_SHARD[w.rar || 0], mx = lvl && st >= W_STAR_MAX;
        el.querySelector('.lv').innerHTML = (lvl ? 'Lv.' + lvl : 'Belum dimiliki') + (st ? ' <span class="wst">' + '★'.repeat(st) + '</span>' : '') + (save.wtarget === id ? ' <span class="wtg u">🎯 Sasaran</span>' : '');
        { const cb = el.querySelector('.wcmp'), on = wpnCmp.includes(id); cb.textContent = on ? '✓ Dipilih (' + wpnCmp.length + '/2)' : '⚖ Banding'; cb.setAttribute('aria-pressed', on); }
        { const tb = el.querySelector('.wtgt'); tb.hidden = !!mx; tb.textContent = save.wtarget === id ? '🎯 Buang sasaran' : '🎯 Jadikan sasaran'; tb.setAttribute('aria-pressed', save.wtarget === id); }
        el.querySelector('.wshb').textContent = mx ? '★' + W_STAR_MAX + ' maksimum · damage ×' + wStarMult(save, id).toFixed(1) + ', laju +10%, aura pasukan +5%' : lvl ? 'Shard ' + sh + '/' + need + ' untuk ★' + (st + 1) + (st ? ' · damage ×' + wStarMult(save, id).toFixed(1) + (st >= 3 ? ', laju +10%' : '') : '') : 'Shard ' + sh + '/' + need + ' untuk buka (dari ⚔ Peti Senjata)';
        el.querySelector('.wsb').hidden = !!mx; el.querySelector('.wsb .fill').style.width = (need ? Math.min(100, sh / need * 100) : 100) + '%'; el.querySelector('.wsb span').textContent = need ? sh + '/' + need : '';
        const su = el.querySelector('.wsu'), du = el.querySelector('.wdu'); su.hidden = !lvl || mx; su.disabled = sh < need; su.textContent = '★' + (st + 1);
        du.hidden = !!mx; du.textContent = '🧪 +1 (' + dc + ')'; du.disabled = (save.debu || 0) < dc; du.title = 'Tukar ' + dc + ' Debu kepada 1 shard ' + w.nama; }
      { const ref = wpnCmpRef(id), sg = [lvl, wStars(save, id), ref ? ref.wid + (save.weapons[ref.wid] || 0) + wStars(save, ref.wid) : ''].join('|'); if (el._bsig !== sg) { el._bsig = sg; el._bars.innerHTML = wpnBarsHtml(id, ref); } el.querySelector('.st').textContent = ''; }
      const users = save.team.filter(h => heroWeapon(save, h) === id).map(h => HEROES[h].nama);
      el.querySelector('.who').textContent = users.length ? 'Dipakai: ' + save.team.filter(h => heroWeapon(save, h) === id).map(h => HEROES[h].nama + ' ' + AFF[wAff(h, id)].ikon).join(', ') : '';
      if (lvl) { const c = wpnCost(id, lvl); up.innerHTML = 'Naik ' + coin + fmt(c); up.disabled = save.gold < c; x10.hidden = false; x10.disabled = save.gold < c; }
      else if (!canBuyWeapon(id)) { up.innerHTML = '⚔ Peti senjata'; up.disabled = false; up.title = W_RAR_NAMA[w.rar].nama + ': hanya melalui shard'; x10.hidden = true; }
      else { const P = weaponPrice(id); up.innerHTML = 'Beli ' + (P.gold ? coin + fmt(P.gold) : gem + P.gems); up.disabled = P.gold ? save.gold < P.gold : save.gems < P.gems; x10.hidden = true; }
    });
  }

  // ---------- pratonton senjata (cuba sebelum beli) ----------
  let pv = null;
  const pvCv = $('pvCv'), pctx = pvCv.getContext('2d');
  function startPreview(wid) {
    const ps = JSON.parse(JSON.stringify(save));
    ps.weapons[wid] = Math.max(1, save.weapons[wid] || 1); ps.heroes = { pistol: Math.max(10, save.heroes.pistol || 1) }; ps.team = ['pistol']; ps.heroWpn = { pistol: wid };
    ps.boost = {}; ps.items = []; ps.equip = {}; ps.wallEquip = [null, null, null]; ps.gold = 0; ps.gems = 0;
    const b = new Battle(ps, 3, Math.random); b.god = true; b.queue = []; b.pause = 1e9;
    pv = { save: ps, battle: b, wid, spawnT: 0, parts: [] };
    const w = WEAPONS[wid];
    $('pvName').innerHTML = '<b>' + esc(w.nama) + '</b>: ' + esc(w.desc) + (save.weapons[wid] ? '' : ' <span class="muted">(belum dimiliki, ini pratonton)</span>');
    $('pvBox').hidden = false;
  }
  function stepPreview(dt) {
    const b = pv.battle; b.now = Date.now();
    pv.spawnT -= dt;
    if (pv.spawnT <= 0 && b.zombies.length < 5) {
      const types = ['biasa', 'biasa', 'gemuk', 'topi', 'laju'], z = b.spawn(types[Math.floor(Math.random() * types.length)]);
      z.y = 300 + Math.random() * 50; z.spd *= 0.5; pv.spawnT = 0.7;
    }
    for (const z of b.zombies) if (z.y > WALL_Y - z.r - 2) z.hp = 0; // jangan tersekat di pagar
    b.update(dt); b.drops.length = 0;
    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    if (pvCv.width !== Math.round(W * dpr)) { pvCv.width = Math.round(W * dpr); pvCv.height = Math.round(350 * dpr); }
    const keep = parts; parts = pv.parts;
    spawnFromFx(b, true); updateParts(dt);
    pctx.setTransform(dpr, 0, 0, dpr, 0, -250 * dpr);
    renderTo(pctx, b, pv.save, true);
    pv.parts = parts; parts = keep;
  }
  $('gfxMode').addEventListener('click', () => { LOWFX = !LOWFX; slowT = -9999; $('gfxMode').textContent = LOWFX ? 'Mod prestasi: hidup' : 'Mod prestasi: mati'; toast(LOWFX ? 'Mod prestasi: kurang zarah, cahaya & animasi latar' : 'Grafik penuh', true); });
  $('pvClose').addEventListener('click', () => { pv = null; $('pvBox').hidden = true; });

