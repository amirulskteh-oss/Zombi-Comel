  // ================= v7: SKRIN — muka depan, rumah, pertempuran, halaman =================
  let pageFrom = null, screen = 'title', booting = true, pageOpenFlag = false, curTab = 'hero', pendingOffline = null, resetNoAsk = false, deferredInstall = null, wakeLock = null, verTaps = 0, hubSig = '', fitT = 0, wakeT = 0, demo = null;
  const GROUPS = { pasukan: ['hero', 'senjata', 'kuasa', 'beg', 'ekspedisi'], kubu: ['pagar'], kedai: ['kedai'], lagi: ['arena', 'harian', 'trofi', 'ensiklo', 'info'] };
  const GNAME = { pasukan: 'Pasukan', kubu: 'Kubu', kedai: 'Kedai', lagi: 'Lagi' };
  const NAVG = { pasukan: 'navTeam', kubu: 'navFort', kedai: 'navShop', lagi: 'navMore' };
  const lastInGroup = { pasukan: 'hero', lagi: 'arena' };
  const ALLPAGES = ['hero', 'senjata', 'kuasa', 'beg', 'ekspedisi', 'pagar', 'kedai', 'arena', 'harian', 'trofi', 'ensiklo', 'info'];
  function groupOf(t) { return Object.keys(GROUPS).find(g => GROUPS[g].includes(t)) || (t === 'ganjaran' || t === 'lagi' ? 'lagi' : 'pasukan'); }
  function hintEl(tab) { return $(NAVG[groupOf(tab)]) || $('tab_' + tab); }
  function showScreen(s) {
    if (s !== 'battle' && $('qPanel')) $('qPanel').hidden = true;
    screen = s; document.body.dataset.screen = s;
    $('titleScreen').hidden = s !== 'title'; $('hub').hidden = s !== 'hub'; $('battle').hidden = s !== 'battle';
    $('hud').hidden = s === 'title'; $('nav').hidden = s !== 'hub'; $('pauseBtn').hidden = s !== 'battle';
    if (s === 'title') { closePage(); refreshTitle(); }
    if (s === 'hub') { hubSig = ''; refreshHub(); }
    if (s === 'battle') fitStage();
    refreshNav(); updateWake();
  }
  function setTab(t) { if (!booting && t !== curTab) sfx('swish'); setPane(t); curTab = t; if (!booting) openPageView(t); }
  function openPageView(t) {
    const g = groupOf(t); if (GROUPS[g].includes(t)) lastInGroup[g] = t;
    $('pageView').hidden = false; $('pageTitle').textContent = GNAME[g]; $('pageChips').hidden = GROUPS[g].length === 1;
    ALLPAGES.forEach(k => { const b = $('pc_' + k); b.hidden = !GROUPS[g].includes(k); b.setAttribute('aria-selected', k === t); });
    if (!pageOpenFlag) { try { if (typeof history !== 'undefined' && history.pushState) history.pushState({ zcPage: 1 }, ''); } catch (e) {} }
    pageOpenFlag = true; refreshNav();
  }
  function closePage() { if (!pageOpenFlag) return; pageOpenFlag = false; $('pageView').hidden = true; closeHeroSheet(); closeInvSheet(); refreshNav(); if (pageFrom === 'title') { pageFrom = null; showScreen('title'); return; } if (screen === 'hub') { hubSig = ''; refreshHub(); } if (screen === 'battle') fitStage(); }
  function refreshNav() {
    const g = pageOpenFlag ? groupOf(curTab) : null;
    [['navHome', null], ['navTeam', 'pasukan'], ['navFort', 'kubu'], ['navShop', 'kedai'], ['navMore', 'lagi']].forEach(([id, gg]) => $(id).setAttribute('aria-current', gg === g));
    const has = ks => ks.some(k => { const e = $('tab_' + k); return !!(e && e.classList && e.classList.contains && (e.classList.contains('dot') || e.classList.contains('badge'))); });
    $('navTeam').classList.toggle('dot', has(['hero', 'senjata', 'kuasa', 'beg', 'ekspedisi'])); $('navFort').classList.toggle('dot', has(['pagar']));
    $('navShop').classList.toggle('dot', has(['kedai'])); $('navMore').classList.toggle('dot', has(['arena', 'ganjaran', 'lagi']));
  }
  // ---------- rumah ----------
  function drawStageCard(cv, st) {
    const c = cv.getContext('2d'), w = cv.width, h = cv.height; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h);
    if (st < 1) { c.fillStyle = '#9AA6B4'; c.fillRect(0, 0, w, h); return; }
    const bg = BACKGROUNDS[bgIndex(st)], s = w / W;
    c.save(); c.scale(s, s); c.translate(0, -(H - h / s) / 2 - 30); drawBiome(c, bg.bi, mulberry(bgIndex(st) * 977 + 13)); if (SUASANA_TINT[bg.si]) { c.fillStyle = SUASANA_TINT[bg.si]; c.fillRect(0, 0, W, H); }
    const old = ctx; ctx = c; const BI = bossOf(st, diffOf(save).off, bossDay(Date.now())), bb = BI.big ? BI.form : null;
    const mk = (x, y, type, r, extra) => Object.assign({ id: x, type, x, y, r, hp: 1, maxHp: 1, warna: (ZTYPES[type] || ZTYPES.biasa).kulit, traits: [], wob: x * 0.1, evo: 0, slowT: 0, burnT: 0, hitT: 0, atkAnim: 0, gear: 'tiada' }, extra || {});
    if (bb) drawZombie(mk(W / 2, H / 2 - 20, 'boss', 44, { bossKind: bb.id, warna: bb.warna, btier: BI.t, belem: BI.elem.id })); else { drawZombie(mk(W / 2 - 60, H / 2 - 40, 'biasa', 22)); drawZombie(mk(W / 2 + 50, H / 2 + 10, 'gemuk', 26)); }
    ctx = old; c.restore();
  }
  function airCover(sv) { const w = sv.team.filter(h => sv.heroes[h]).map(h => heroWeapon(sv, h)), air = w.filter(x => WEAPONS[x].udara).length, tw = (sv.towers || []).filter(t => t && TOWERS[t.type].udara).length; return { air, n: w.length, tw }; }
  const PADAN_HTML = '<p><b>⭐ Pakar</b> (jenis kepakaran hero): +30% damage, +10% laju.<br><b>✅ Sekelas</b> (3 jenis kelas hero): +10% damage.<br><b>⚠ Luar kelas</b>: boleh dipakai, tetapi −40% damage dan −20% laju.</p><p>Lencana ⭐ / ✅ / ⚠ ada pada kad hero dan pilihan senjata. Butang <b>Susun terbaik</b> memilih padanan terbaik untuk anda.</p>';
  $('hubAir').addEventListener('click', e => { if (!e || !e.target || !e.target.closest || !e.target.closest('#bossArm')) return; const st0 = battle && !battle.chal ? battle.stage : save.stage, B = bossOf(st0, diffOf(save).off, bossDay(Date.now())), tr = st0 + diffOf(save).off < 10 ? [] : bossTraits(B.id), ac = airCover(save), t2 = tr.slice(); if (flyChance(st0 + diffOf(save).off) > 0 && ac.air + ac.tw <= 1 && !t2.includes('terbang')) t2.push('terbang'); const r = bossArm(save, t2, B.elem.id); if (battle && battle.syncTeam) battle.syncTeam(); persist(); afterChange(r.msg, r.ok); $('hubAir')._sig = ''; });
  function kelasNoticeCheck() { if (!$('modal').hidden) return;
    if (save.kelasNotice) { save.kelasNotice = false; save.tips.padan97 = true; persist();
      showModal('🆕 Sistem hero baharu', '<p>Hero kini <b>tidak membawa senjata</b>. Senjata dibeli atau dikumpul melalui shard, kemudian dipasang pada hero.</p><p>Setiap hero ada <b>kelas</b> (3 jenis senjata), <b>peranan</b> (bonus pasukan) dan <b>kepakaran</b>.</p>' + PADAN_HTML + '<p>✅ Semua senjata anda kekal.</p>', [['Faham', null, 'btn big']]); return; }
    if (!save.tips.padan97 && Object.keys(save.heroes).length > 1 && save.tut >= 99) { save.tips.padan97 = true; persist();
      showModal('🆕 Padanan hero & senjata', '<p>Semua hero kini <b>boleh memakai semua senjata</b>, dan ada 5 jenis senjata baharu: 💨 Angin, 🪨 Bumi, 💧 Air, ✨ Cahaya, 🌑 Bayang (senjatanya akan datang).</p>' + PADAN_HTML, [['Faham', null, 'btn big']]); } }
  function refreshHub() {
    if (typeof setTimeout === 'function') setTimeout(kelasNoticeCheck, 600);
    { const st0 = battle && !battle.chal ? battle.stage : save.stage, s = st0 + diffOf(save).off, ac = airCover(save), el = $('hubAir'); if (el) { const airW = flyChance(s) > 0 && ac.air + ac.tw <= 1, BI2 = bossOf(st0, diffOf(save).off, bossDay(Date.now())), tr2 = s < 10 ? [] : bossTraits(BI2.id), zel = BOSS_ZEL[BI2.elem.id] || null, ctr = zel ? elemCounters(zel) : [], sig = [airW, ac.air, ac.tw, tr2.join(), zel].join('|'); el.hidden = !airW && !tr2.length && !zel; if (el._sig !== sig) { el._sig = sig; el.innerHTML = (airW ? '<span class="btip warn"><b>⚠ Zombie udara</b><i>Pasukan hanya ' + ac.air + ' senjata udara' + (ac.tw ? ' + ' + ac.tw + ' menara' : '') + ' — pasang ⬆⬇</i></span>' : '') + (zel ? '<span class="btip el"><b>' + ZEL_IKON[zel] + ' Boss ' + zel + '</b><i>Kuat: ' + ctr.map(e => ELEMEN[e].ikon + ' ' + ELEMEN[e].nama).join(', ') + '</i></span>' : '') + tr2.map(k => '<span class="btip"><b>' + BTRAIT[k].ikon + ' ' + esc(BTRAIT[k].nama) + '</b><i>' + esc(BTRAIT[k].lawan) + '</i></span>').join('') + (tr2.length || airW || zel ? '<button class="btn" id="bossArm">🎯 Pasang untuk boss</button>' : ''); } } }
    if (!battle) return; refreshHubInfo(); $('hubBackup').hidden = !needBackup(save, Date.now());
    const st = battle.stage, sig = st + '|' + save.best + '|' + save.team.join() + '|' + save.team.map(h => heroWeapon(save, h) + (save.stars[h] || 0) + gearSig(save, h)).join();
    if (sig === hubSig) return; hubSig = sig;
    drawStageCard($('hubCurCv'), st); drawStageCard($('hubPrevCv'), st - 1); drawStageCard($('hubNextCv'), st + 1);
    $('hubPrevN').textContent = st > 1 ? 'Stage ' + (st - 1) : '—'; $('hubNextN').textContent = 'Stage ' + (st + 1);
    $('hubLock').hidden = st + 1 <= save.best; { const BI = bossOf(st, diffOf(save).off, bossDay(Date.now())); $('hubBoss').hidden = false; const btr = st + diffOf(save).off < 10 ? [] : bossTraits(BI.id); $('hubBoss').textContent = (BI.big ? '👑 ' : '💀 ') + BI.nama + (btr.length ? ' ' + btr.map(k => BTRAIT[k].ikon).join('') : '') + (bossDexGet(save, BI.id) >= 2 ? ' ✓' : ''); $('hubBoss').title = btr.map(k => BTRAIT[k].nama + ': ' + BTRAIT[k].desc).join('\n'); }
    const box = $('hubTeam'); box.innerHTML = '';
    save.team.forEach(h => { const c0 = document.createElement('canvas'); c0.width = 104; c0.height = 104; c0.setAttribute('aria-label', HEROES[h].nama); const c = c0.getContext('2d'); c.scale(2, 2); drawHero(c, 26, 30, h, -Math.PI / 4, 0, 0.85, heroWeapon(save, h), { t: 0.5, phase: 0, mood: 'main', gear: gearOf(save, h), skin: heroSkin(save, h) }); box.appendChild(c0); });
  }
  // ================= v8.4: 5 MOD KESUKARAN =================
  function modeGridHtml() {
    return DIFFS.map(d => { const un = modeUnlocked(save, d.id), cur = (save.mode || 'normal') === d.id, b = modeBest(save, d.id), i = DIFFS.indexOf(d);
      return '<button class="mcard' + (cur ? ' on' : '') + (un ? '' : ' lock') + '" data-mode="' + d.id + '" style="--mc:' + d.warna + '"><span class="mi">' + (un ? d.ikon : '🔒') + '</span><b>' + esc(d.nama) + '</b><small>' + (un ? (b > 1 ? 'Stage ' + (b - 1) + ' tamat' : 'Belum dimulakan') : 'Tamat stage ' + MODE_UNLOCK + ' ' + esc(DIFFS[i - 1].nama)) + '</small>' + (cur ? '<em>Dimainkan</em>' : '') + '</button>'; }).join('');
  }
  function paintModeIcons() {}
  function pickMode(id, fromTitle) {
    const d = DIFF_BY[id]; if (!d) return;
    if ((save.mode || 'normal') === id) { if (fromTitle) $('tContinue').click(); else { toast(d.ikon + ' Sedang bermain mod ' + d.nama, true); } return; }
    const r = switchMode(save, id); if (!r.ok) { toast(r.msg, false); sfx('bad'); return; }
    sfx('swish'); persist(); newBattle(save.stage); running = false; updateControls(); hubSig = ''; refreshAll(); refreshTitle(); refreshModeChip(); toast(r.msg + ' · ' + d.desc, true);
    if (fromTitle) $('tContinue').click();
  }
  function refreshModeChip() { const D = diffOf(save); $('hubMode').innerHTML = D.ikon + ' ' + esc(D.nama) + ' <span>▾</span>'; $('hubMode').style.cssText = '--mc:' + D.warna; document.body.dataset.mode = D.id; }
  function openModePicker() { sfx('popup'); showModal('🎮 Pilih mod', '<p class="muted" style="margin:0 0 8px">Setiap mod ada kemajuan stage sendiri. Hero, item, gold & gems dikongsi. Mod lebih sukar = zombie lebih kuat, gold, gems & item lebih baik.</p><div class="mgrid" id="mPick">' + modeGridHtml() + '</div><div class="mtab">' + DIFFS.map(d => '<p><b style="color:' + d.warna + '">' + d.ikon + ' ' + esc(d.nama) + '</b>: ' + esc(d.desc) + (d.off ? ' · zombie setara stage +' + d.off + ' · gems ×' + d.gems : '') + '</p>').join('') + '</div>', [['Tutup', null, 'btn ghost']]); }
  $('tModes').addEventListener('click', e => { const b = e && e.target && e.target.closest ? e.target.closest('[data-mode]') : null; if (b) { auInit(); pickMode(b.dataset.mode, true); } });
  $('mBody').addEventListener('click', e => { const b = e && e.target && e.target.closest ? e.target.closest('#mPick [data-mode]') : null; if (b) { $('modal').hidden = true; pickMode(b.dataset.mode, false); } });
  $('hubMode').addEventListener('click', () => openModePicker());
  function goHub() {
    running = false; updateControls(); hideOverlay();
    if (battle.chal || battle.state !== 'main' || (battle.clock || 0) > 0) newBattle(battle.chal ? save.stage : battle.state === 'menang' ? save.stage : battle.stage);
    introOverlay(); showScreen('hub'); if (pendingOffline) showOffline();
  }
  function goTitle() { running = false; updateControls(); hideOverlay(); showScreen('title'); }
  // v8.6: ketik logo = muka depan (dari Rumah); tekan lama 3 s = mod trainer (binaan dev sahaja)
  { const hb = $('hudBrand'); let lpT = null, lpFired = false;
    const lpStop = () => { if (lpT) { clearTimeout(lpT); lpT = null; } };
    hb.addEventListener('pointerdown', () => { lpFired = false; lpStop(); if (PLAY_BUILD) return; lpT = setTimeout(() => { lpT = null; lpFired = true; const dt = $('devToggle'); if (dt) { document.body.classList.add('devshow'); dt.click(); vib(80); } }, 3000); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => hb.addEventListener(ev, lpStop));
    hb.addEventListener('click', () => { if (lpFired) { lpFired = false; return; } if (screen === 'hub') { sfx('tap'); closePage(); goTitle(); } }); }
  // ---------- modal, penafian, offline ----------
  const DISC = '<ul><li><b>Karya asal untuk hiburan.</b> Semua nama, watak dan grafik direka khas, dan tiada kaitan dengan mana-mana game, syarikat atau individu sebenar.</li>' +
    '<li><b>Tiada wang sebenar.</b> Tiada iklan dan tiada pembelian. Gold, gems, shard dan Roh hanya diperoleh dalam game dan tiada nilai wang.</li>' +
    '<li><b>Data anda.</b> Progress disimpan dalam peranti ini sahaja. Tiada akaun dan tiada data peribadi dikumpul. Fon teks dimuat daripada Google Fonts, jadi peranti anda menghubungi pelayan Google ketika memuat fon.</li>' +
    '<li><b>Amaran kilatan.</b> Game ini mempunyai kilatan, letupan dan gegaran skrin. Jika anda sensitif kepada cahaya berkelip, hidupkan "Kurangkan kilatan &amp; gegaran" di Pilihan, dan berhenti bermain jika berasa tidak selesa.</li>' +
    '<li><b>Rehat secukupnya.</b> Rehatkan mata dan badan secara berkala.</li>' +
    '<li><b>Disediakan seadanya.</b> Progress boleh hilang jika data pelayar dipadam. Simpan sandaran (Eksport) dari semasa ke semasa.</li></ul>' +
    '<p class="muted" style="margin:8px 0 0">Dibina oleh Zuuussss · Versi ' + VERSION + '</p>';
  function showModal(title, html, btns) {
    $('mTitle').textContent = title; $('mBody').innerHTML = html; const b = $('mBtns'); b.innerHTML = '';
    btns.forEach(([l, f, cls, keep]) => { const e = document.createElement('button'); e.className = cls || 'btn'; e.textContent = l; e.addEventListener('click', () => { if (!keep) { $('modal').hidden = true; sfx('popdown'); } if (f) f(); }); b.appendChild(e); });
    $('modal').hidden = false; sfx('popup');
  }
  // v8.7: pengesahan dalam game (kotak 'confirm' browser disekat dalam sesetengah paparan, contohnya artifak Claude)
  function askYes(title, html, yesLabel, f) { showModal(title, html, [['Batal', null, 'btn ghost'], [yesLabel || 'Ya', f, 'btn']]); }
  function showDisclaimer(after) { showModal('Penafian', DISC, after ? [['Saya faham', () => { save.discOk = true; persist(); after(); }, 'btn big']] : [['Tutup', null, 'btn']]); }
  function showOffline() {
    const p = pendingOffline; pendingOffline = null; if (!p) return; const nS = Object.values(p.offR.shards).reduce((a, b) => a + b, 0);
    showModal('Selamat kembali!', '<p>Semasa tiada (' + Math.floor(Math.min(p.away, OFFLINE_CAP) / 60) + ' minit), hero mengutip <b>' + fmt(p.og) + ' gold</b>' + (nS ? ', <b>' + nS + ' shard</b>' : '') + (p.offR.items.length ? ' dan <b>' + p.offR.items.length + ' item</b>' : '') + '.</p>',
      [['Ambil semua', () => { applyOffline(save, p.offR); persist(); refreshAll(); sfx('chest'); }, 'btn big']]);
  }
  // ---------- muka depan ----------
  function drawLogo(cv) {
    const c = cv.getContext('2d'), s = cv.width / 64; c.setTransform(s, 0, 0, s, 0, 0); c.clearRect(0, 0, 64, 64);
    const old = ctx; ctx = c; drawZombie({ id: 1, type: 'boss', x: 32, y: 38, r: 20, hp: 1, maxHp: 1, warna: '#8DC95B', traits: [], wob: 0.6, evo: 0, slowT: 0, burnT: 0, hitT: 0, atkAnim: 0, gear: 'tiada' }); ctx = old;
  }
  function hasProgress() { return save.best > 1 || save.tut >= 99 || Object.keys(save.heroes).some(h => !GENERATED_HEROES.includes(h)) || (save.stats.battles || 0) > 0; }
  function refreshTitle() { const p = hasProgress(), D = diffOf(save); $('tContinue').textContent = p ? '▶ Sambung · ' + (D.id === 'normal' ? '' : D.nama + ' ') + 'Stage ' + save.stage : '▶ Mula main'; $('tModes').innerHTML = modeGridHtml(); paintModeIcons($('tModes')); $('tNew').hidden = !p; $('tFoot').textContent = 'Dibina oleh Zuuussss · Versi ' + VERSION; }
  function makeDemo() {
    const ds = migrate(null, 0); ['pistol', 'shotgun', 'frost', 'bom'].forEach(h => { ds.heroes[h] = 40; ds.weapons[HEROES[h].wpn] = 1; });
    ds.team = ['pistol', 'shotgun', 'frost', 'bom']; ds.slots = 4; ds.settings = save.settings; ds.eventForce = save.eventForce;
    const b = new Battle(ds, Math.max(1, save.stage), Math.random); b.god = true; b.queue = []; b.pause = 1e9; demo = { b, s: ds, parts: [], t: 0 };
  }
  function stepTitle(dt) {
    if (!demo) makeDemo(); const b = demo.b; b.now = Date.now(); demo.t -= dt;
    if (demo.t <= 0 && b.zombies.length < 7) { const z = b.spawn(['biasa', 'gemuk', 'topi', 'laju'][Math.floor(Math.random() * 4)]); z.hp = z.maxHp = z.maxHp * 8; demo.t = 1.1; }
    for (const z of b.zombies) if (z.y > WALL_Y - z.r - 2) z.hp = 0;
    b.update(dt); b.drops.length = 0; b.shardLog = []; b.newSeen = [];
    const cvT = $('titleCv'), dpr = Math.min(2, window.devicePixelRatio || 1), cw = cvT.clientWidth || 360, ch = cvT.clientHeight || 640;
    if (cvT.width !== Math.round(cw * dpr) || cvT.height !== Math.round(ch * dpr)) { cvT.width = Math.round(cw * dpr); cvT.height = Math.round(ch * dpr); }
    const tc = cvT.getContext('2d'), sc = Math.max(cw / W, ch / H) * dpr; tc.setTransform(sc, 0, 0, sc, (cw * dpr - W * sc) / 2, (ch * dpr - H * sc) / 2);
    const keep = parts; parts = demo.parts; spawnFromFx(b, true); updateParts(dt); renderTo(tc, b, demo.s, true); demo.parts = parts; parts = keep;
  }
  // ---------- saiz medan & skrin sentiasa hidup ----------
  function fitStage() {
    const bt = $('battle'), sb = $('stageBox'); if (!bt || !sb || !bt.clientHeight || screen !== 'battle') return;
    let used = 0; for (const e of bt.children) if (e !== sb && !e.hidden) used += (e.offsetHeight || 0) + 6;
    const avail = bt.clientHeight - used - 14, w = Math.floor(Math.max(180, Math.min(bt.clientWidth - 8, avail * 0.6))) + 'px';
    if (sb.style.width !== w) sb.style.width = w;
  }
  async function updateWake() {
    const want = screen === 'battle' && running && save.settings.awake !== false && !document.hidden;
    try {
      if (want && !wakeLock && typeof navigator !== 'undefined' && navigator.wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); }
      else if (!want && wakeLock) { const w = wakeLock; wakeLock = null; await w.release(); }
    } catch (e) { wakeLock = null; }
  }
  // ---------- keputusan pertempuran ----------
  function resultExtras() {
    const sN = battleStars(battle); if (sN) { stat(save, 'stars' + sN); ovAnim = { base: $('ovTitle').textContent + '  ', n: sN, t: 0, shown: 0, gold: battle.earnedGold, body: $('ovBody').textContent, tk: 0 }; $('ovTitle').textContent = ovAnim.base + '☆☆☆'; }
    const ids = Object.keys(battle.dmgBy).filter(k => HEROES[k]);
    if (ids.length) { const best = ids.sort((a, b) => battle.dmgBy[b] - battle.dmgBy[a])[0]; $('ovBody').textContent += ' ⭐ Hero terbaik: ' + HEROES[best].nama + ' (' + fmt(battle.dmgBy[best] / Math.max(1, battle.clock || 1)) + ' DPS).'; }
    const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = '🏠 Ke Rumah'; b.addEventListener('click', () => goHub()); $('ovBtns').appendChild(b);
  }
  function endOverlay() { endOverlay0(); resultExtras(); }
  // ---------- pendengar ----------
  ALLPAGES.forEach(k => $('pc_' + k).addEventListener('click', () => setTab(k)));
  $('pageBack').addEventListener('click', () => { closePage(); try { if (typeof history !== 'undefined' && history.state && history.state.zcPage) history.back(); } catch (e) {} });
  window.addEventListener('popstate', () => { if (pageOpenFlag) closePage(); });
  $('navHome').addEventListener('click', () => { pageFrom = null; closePage(); if (screen !== 'hub') goHub(); });
  $('navTeam').addEventListener('click', () => setTab(lastInGroup.pasukan));
  $('navFort').addEventListener('click', () => setTab('pagar'));
  $('navShop').addEventListener('click', () => setTab('kedai'));
  $('navMore').addEventListener('click', () => setTab(lastInGroup.lagi));
  $('gearBtn').addEventListener('click', () => setTab('info'));
  $('menuBtn').addEventListener('click', () => setTab(lastInGroup.pasukan));
  $('quickUp').addEventListener('click', () => { if ($('qPanel').hidden) openQuick(); else $('qPanel').hidden = true; });
  $('hubBkBtn').addEventListener('click', () => { setTab('info'); $('exportBtn').click(); $('hubBackup').hidden = true; });
  $('hubUp').addEventListener('click', () => { const r = upgradeAll(save); afterChange(r.msg, r.ok); });
  $('hubHarian').addEventListener('click', () => setTab('harian'));
  $('hubCabaran').addEventListener('click', () => setTab('arena'));
  $('hubTrofi').addEventListener('click', () => setTab('trofi'));
  $('hubPrev').addEventListener('click', () => { if (battle.stage > 1) $('stagePrev').click(); });
  $('hubNext').addEventListener('click', () => { if (battle.stage < save.best) $('stageNext').click(); else toast('Lepasi stage ' + battle.stage + ' dahulu', false); });
  $('hubStart').addEventListener('click', () => {
    const go = () => { if (battle.state !== 'main' || (battle.clock || 0) > 0) newBattle(battle.stage); startBattle(); };
    if (!save.discOk) showDisclaimer(go); else go();
  });
  $('pauseBtn').addEventListener('click', () => {
    if (battle.state !== 'main' || !running) return; running = false; updateControls(); sfx('click');
    showOverlay('Jeda', (battle.chal ? (battle.chal.raid != null ? 'Serbuan Boss' : 'Cabaran') : 'Stage ' + battle.stage) + ' · gelombang ' + battle.wave + '/' + battle.maxWave, [
      ['▶ Sambung', () => { hideOverlay(); running = true; updateControls(); updateWake(); }, 'btn big'], ['⚙ Pilihan', () => setTab('info'), 'btn ghost'],
      ['🏠 Ke Rumah (tamatkan pertempuran)', () => goHub(), 'btn ghost'], ['Muka depan', () => goTitle(), 'btn ghost']]);
  });
  $('tContinue').addEventListener('click', () => { auInit(); sfx('click'); if (!save.discOk) showDisclaimer(() => goHub()); else goHub(); });
  $('tNew').addEventListener('click', () => {
    askYes('Mula baharu?', '<p>Mula baharu akan memadam <b>SEMUA</b> progress (tetapan dikekalkan).</p>', 'Mula baharu', () => {
      resetNoAsk = true; $('btnReset').click(); resetNoAsk = false; save.tut = 0; persist(); showTut();
      if (!save.discOk) showDisclaimer(() => goHub()); else goHub(); });
  });
  $('tOptions').addEventListener('click', () => { auInit(); showScreen('hub'); setTab('info'); pageFrom = 'title'; });
  $('tDisc').addEventListener('click', () => showDisclaimer(null));
  $('discBtn2').addEventListener('click', () => showDisclaimer(null));
  $('verText').addEventListener('click', () => { if (PLAY_BUILD) return; if (++verTaps === 7) { document.body.classList.add('devshow'); toast('Butang Mod Pembangun kini kelihatan', true); } });
  $('awakeBtn').addEventListener('click', () => { save.settings.awake = save.settings.awake === false; persist(); $('awakeBtn').textContent = 'Skrin sentiasa hidup: ' + (save.settings.awake === false ? 'mati' : 'hidup'); updateWake(); });
  window.addEventListener('resize', () => fitStage());
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; $('tInstall').hidden = false; });
  window.addEventListener('appinstalled', () => { $('tInstall').hidden = true; toast('Aplikasi dipasang!', true); });
  $('tInstall').addEventListener('click', async () => {
    if (deferredInstall) { deferredInstall.prompt(); try { await deferredInstall.userChoice; } catch (e) {} deferredInstall = null; $('tInstall').hidden = true; }
    else toast('iPhone: buka di Safari, tekan butang Kongsi ⬆, kemudian "Tambah ke Skrin Utama"', true);
  });
  function initScreens() {
    speed = save.settings.speed || 1; auto = !!save.settings.auto; updateControls();
    booting = false; drawLogo($('logoCv')); drawLogo($('splashCv')); if (save.dev) document.body.classList.add('devshow');
    $('awakeBtn').textContent = 'Skrin sentiasa hidup: ' + (save.settings.awake === false ? 'mati' : 'hidup');
    let standalone = false; try { standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) {}
    try { if (!standalone && /iPhone|iPad|iPod/.test(navigator.userAgent || '')) $('tInstall').hidden = false; } catch (e) {}
    showScreen('title');
    setTimeout(() => { $('splash').classList.add('out'); setTimeout(() => { $('splash').hidden = true; }, 500); }, 900);
  }

  // ---------- gelung utama ----------
  let lastT = performance.now(), saveT = 0, uiT = 0;
  function frame(now) {
    const realDt = (now - lastT) / 1000, dt = Math.min(0.05, realDt); lastT = now;
    // mod grafik ringan automatik: jika bingkai kerap melebihi ~30 ms selama 2 saat
    if (!LOWFX && running) { slowT = realDt > 0.032 ? slowT + realDt : Math.max(0, slowT - realDt); if (slowT > 2) { LOWFX = true; $('gfxMode').textContent = 'Mod prestasi: hidup'; toast('Mod prestasi dihidupkan supaya game lebih lancar', true); } }
    battle.now = Date.now();
    if (running && battle.state === 'main') { const dts = SLOWMO > 0 ? dt * 0.3 : dt; for (let i = 0; i < speed; i++) battle.update(dts); }
    else battle.updateFx(dt);
    if (battle.shardLog && battle.shardLog.length) battle.shardLog.splice(0).forEach(e => { notiAgg.sh[e.h] = (notiAgg.sh[e.h] || 0) + e.n; });
    if (battle.newSeen && battle.newSeen.length) { const ns = battle.newSeen.splice(0); if (ns.length) toast('Ensiklopedia: ' + SPECIES[ns[ns.length - 1]].nama + (ns.length > 1 ? ' +' + (ns.length - 1) + ' lagi' : '') + ' ditemui!', true); }
    while (battle.drops.length) { const d = battle.drops.shift(); battle.lootN = (battle.lootN || 0) + 1; (battle.lootL = battle.lootL || []).push(d.ok ? d.it.rar : -1); if (!d.ok) { notiAgg.full++; notiAgg.sold += d.sold || 0; } else if (d.it.rar >= 3) toast('Dapat ' + RARITY[d.it.rar].nama + ': ' + itemName(d.it), true); }
    notiAgg.t += realDt;
    if (notiAgg.t > 5 && Object.keys(notiAgg.sh).length) { const ks = Object.keys(notiAgg.sh); toast('+' + ks.reduce((a, h) => a + notiAgg.sh[h], 0) + ' shard: ' + ks.slice(0, 3).map(h => HEROES[h].nama).join(', ') + (ks.length > 3 ? ' +' + (ks.length - 3) : ''), true); notiAgg.sh = {}; }
    if (notiAgg.t > 10 && notiAgg.full) { toast('🎒 Beg penuh: ' + notiAgg.full + ' item dijual +' + fmt(notiAgg.sold) + ' gold' + (save.autoSell < 0 ? '. Hidupkan Auto-jual di Beg' : ''), false); notiAgg.full = 0; notiAgg.sold = 0; }
    if (notiAgg.t > 10) notiAgg.t = 0;
    if (battle.state === 'kalah') battle._lostT = (battle._lostT || 0) + Math.min(realDt, 0.1);
    if (battle.state !== 'main' && !shownEnd && !(battle.state === 'kalah' && !CALM() && !LOWFX && (battle._lostT || 0) < 1.3)) endOverlay();
    if (auto && shownEnd && autoT > 0) { autoT -= dt; if (autoT <= 0) { newBattle(battle.chal ? save.stage : battle.state === 'menang' ? save.stage : battle.stage); startBattle(); } }
    if (running && battle.state === 'main') stat(save, 'playSec', Math.min(0.1, realDt));
    saveT += dt; if (saveT > 3) { saveT = 0; persist(); }
    uiT += dt; if (uiT > 0.3) { uiT = 0; refreshAll(); updateStageBar(); }
    ANIM += dt;
    spawnFromFx(battle); bossSteps(battle); updateParts(dt); stepCoins(dt); stepVoices(battle, realDt); trackThaw(battle); sampleDps(battle);
    if (battle.state === 'menang' && !battle._conf) { battle._conf = true; if (!CALM()) for (let i = 0; i < 4; i++) emit(W * (0.15 + i * 0.23), 40, 22, { a: Math.PI / 2, spread: 1.6, spd: 160, warna: ['#E5484D', '#F2C230', '#4CAF7A', '#3B82C4', '#A066E8', '#FF9EC8'], size: 3.5, life: 1.8, grav: 220, shape: 'sq', drag: 0.6 }); }
    for (const m of battle.team) { if ((m.shots || 0) !== (m._ps || 0)) { if (m._ps != null) { const w0 = heroWeapon(save, m.id); sfx('shot', w0); shotFx(m, w0); } m._ps = m.shots || 0; } }
    const hasBoss = battle.zombies.some(z => z.type === 'boss'); AU.track = BIOME_TRACK[BACKGROUNDS[bgIndex(battle.stage)].bi]; if (hasBoss && !battle._roar) { battle._roar = true; sfx('boss'); vib([120, 60, 120]); } AU.boss = hasBoss;
    if (screen === 'title') stepTitle(dt);
    if (SLOWMO > 0) SLOWMO -= realDt; if (FLASH > 0) FLASH -= realDt;
    trainT += Math.min(realDt, 1); if (trainT >= 5) { if (trainBench(save, trainT)) hubSig = ''; trainT = 0; }
    stepChestFx(dt); stepCp(dt); stepExpScenes(); stepOvAnim(realDt);
    fitT += dt; if (fitT > 0.25) { fitT = 0; fitStage(); }
    wakeT += dt; if (wakeT > 1) { wakeT = 0; updateWake(); }
    if (screen === 'battle' && !pageOpenFlag) render(battle, save);
    if (pv && !$('pane_senjata').hidden) stepPreview(dt);
    refreshPowerBar(); refreshUltBar();
    requestAnimationFrame(frame);
  }

  // ---------- mula ----------
  buildHeroes(); buildWeapons(); buildPowers(); buildWalls(); buildShop(); buildHeroShop(); buildWpnShop(); buildInv(); buildPedia(); buildAch(); buildArena(); buildTowers(); buildHeroGrid(); setPane('hero'); showKedai('up');
  paintIcon($('slotIco'), ICONS.slot, 28);
  newBattle(save.stage);
  const away = (Date.now() - save.last) / 1000, offR = offlineRewards(save, away, Math.random), og = offR.gold;
  refreshAll(); updateControls();
  introOverlay(); if (og > 0) pendingOffline = { offR, away, og };
  { const tg = trainBench(save, away); if (tg > 0) setTimeout(() => toast('📈 Latihan simpanan: +' + tg + ' level untuk hero luar pasukan', true), 2500); }
  persist();
  document.body.classList.toggle('calm', !!save.settings.calm); document.body.classList.toggle('bigtext', !!save.settings.bigText);
  if (!clockCheck(save, Date.now())) setTimeout(() => toast('⏰ Jam peranti nampaknya diundurkan. Ganjaran harian ditahan sehingga jam betul.', false), 2500);
  showTut(); refreshInfo(); if (loginAvailable(save, Date.now()) && save.tut >= 99) setTimeout(() => toast('🎁 Ganjaran log masuk harian sedia di Lagi → Harian!', true), 1500);
  initScreens();
  window.ZC_DEBUG = () => battle; // untuk ujian automatik
  requestAnimationFrame(frame);
})();
