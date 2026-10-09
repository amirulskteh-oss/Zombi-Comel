  // ---------- input ----------
  const toXY = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
  cv.addEventListener('pointerdown', e => {
    if (!battle) return; const [x, y] = toXY(e);
    if (Math.hypot(x - BAG.x, y - BAG.y) < 20) { showBagSummary(); return; }
    if (Math.hypot(x - (W - 26), y - 64) < 20) { showTapakInfo(); sfx('click'); return; }
    const m = heroAt(battle, x, y); if (m) { drag = { id: m.id, x0: x, y0: y, x, y, moved: false }; return; }
    const tw = towerAt(battle, x, y); if (tw) { rangeSel = { kind: 'tower', slot: tw.slot, t: 3 }; sfx('click'); return; }
    if (running) battle.tap(x, y);
  });
  cv.addEventListener('pointermove', e => { if (!drag) return; const [x, y] = toXY(e); drag.x = x; drag.y = y; if (Math.hypot(x - drag.x0, y - drag.y0) > 14) drag.moved = true; });
  const endDrag = () => {
    if (!drag) return; const d = drag; drag = null;
    if (!d.moved) { rangeSel = { kind: 'hero', id: d.id, t: 3 }; sfx('click'); return; }
    const tgt = battle.team.filter(m => m.id !== d.id).sort((a, b) => Math.abs(a.x - d.x) - Math.abs(b.x - d.x))[0];
    if (tgt && Math.abs(tgt.x - d.x) < 40 && swapTeam(save, d.id, tgt.id)) { battle.syncTeam(); persist(); refreshAll(); sfx('up'); toast(HEROES[d.id].nama + ' ⇄ ' + HEROES[tgt.id].nama, true); }
  };
  cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', () => { drag = null; });
  $('btnPlay').addEventListener('click', () => { if (!$('overlay').hidden) return; running = !running; updateControls(); });
  $('btnSpeed').addEventListener('click', () => { speed = speed === 1 ? 2 : speed === 2 ? 3 : 1; save.settings.speed = speed; persist(); updateControls(); });
  $('btnAuto').addEventListener('click', () => { auto = !auto; save.settings.auto = auto; persist(); updateControls(); toast(auto ? 'Auto main: hidup' : 'Auto main: mati', true); });
  $('stagePrev').addEventListener('click', () => { newBattle(Math.max(1, battle.stage - 1)); running = false; updateControls(); introOverlay(); });
  $('stageNext').addEventListener('click', () => { newBattle(Math.min(save.best, battle.stage + 1)); running = false; updateControls(); introOverlay(); });
  TABS.forEach(n => $('tab_' + n).addEventListener('click', () => setTab(n)));
  ['ganjaran', 'lagi'].forEach(g => $('tab_' + g).addEventListener('click', () => setTab(lastSub[g])));
  $('btnReset').addEventListener('click', () => { if (resetNoAsk) doReset(); else askYes('Padam progress?', '<p>Padam <b>semua</b> progress dan mula semula? Tindakan ini tidak boleh dibatalkan.</p><p class="muted">Pembelian dengan wang sebenar (Pek Penyokong, Tangan Pembantu) tidak akan dipadam.</p>', 'Padam', doReset); });
  function doReset() {
    store.del(SAVE_KEY); save = resetSave(save, Date.now()); persist(); refreshInfo(); showTut(); newBattle(1); running = false; updateControls(); portraitSig = {}; wselSig = ''; encSig = ''; misiSig = ''; wallSlotSig = ''; wallSumK = -1; pbarSig = ''; for (const k in powerCd) delete powerCd[k]; buildInv(); refreshAll(); refreshWeapons(); refreshWalls(); introOverlay(); toast('Progress direset', true);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { persist(); if (running) { running = false; updateControls(); } } });
  window.addEventListener('pagehide', persist);

  // ---------- trainer ----------
  function tr(msg) { if (!save.dev) return; persist(); battle.syncTeam(); refreshAll(); updateStageBar(); toast(msg, true); }
  const addCur = (k, n) => { if (!save.dev) return; save[k] += n; tr((k === 'gold' ? 'Gold' : 'Gems') + ' +' + fmt(n)); };
  $('trGold1').addEventListener('click', () => addCur('gold', 1e6));
  $('trGold2').addEventListener('click', () => addCur('gold', 1e12));
  $('trGems1').addEventListener('click', () => addCur('gems', 1000));
  $('trGems2').addEventListener('click', () => addCur('gems', 100000));
  $('trSet').addEventListener('click', () => { if (!save.dev) return;
    const g = Number($('trGoldIn').value), m = Number($('trGemsIn').value);
    if ($('trGoldIn').value !== '' && isFinite(g) && g >= 0) save.gold = Math.floor(g);
    if ($('trGemsIn').value !== '' && isFinite(m) && m >= 0) save.gems = Math.floor(m);
    tr('Nilai ditetapkan');
  });
  $('trHero').addEventListener('click', () => { if (!save.dev) return; HERO_ORDER.forEach(id => { if (!save.heroes[id]) { save.heroes[id] = 1; save.stars[id] = save.stars[id] || 0; } const w = HEROES[id].wpn; if (!save.weapons[w]) save.weapons[w] = 1; }); autoArm(save); save.slots = MAX_SLOTS; while (save.team.length < save.slots) { const nx = HERO_ORDER.find(h => !save.team.includes(h)); if (!nx) break; save.team.push(nx); } tr('Semua hero dan slot dibuka'); });
  $('trStage').addEventListener('click', () => { if (!save.dev) return; save.best += 50; tr('Stage sehingga ' + save.best + ' dibuka'); });
  $('trItem').addEventListener('click', () => { if (!save.dev) return; const r = addItem(save, makeItem(save, Math.random, 9)); tr(r.ok ? 'Dapat Abadi: ' + itemName(r.it) : 'Beg penuh'); });
  $('trWpn').addEventListener('click', () => { if (!save.dev) return; WEAPON_ORDER.forEach(w => { if (!save.weapons[w]) save.weapons[w] = 1; }); tr('Semua 32 senjata dibuka'); });
  $('trShard').addEventListener('click', () => { if (!save.dev) return; HERO_ORDER.forEach(h => addShards(save, h, 100)); tr('+100 shard untuk semua hero'); });
  $('trSeen').addEventListener('click', () => { if (!save.dev) return; save.seenZ = '1'.repeat(1000); encSig = ''; tr('Semua 1000 zombie ditemui'); });
  $('trPow').addEventListener('click', () => { if (!save.dev) return; POWER_ORDER.forEach(p => { if (!save.powers[p]) save.powers[p] = 1; }); tr('Semua 9 kuasa dibuka'); });
  $('trCd').addEventListener('click', () => { if (!save.dev) return; for (const k in powerCd) powerCd[k] = 0; toast('Semua kuasa sedia', true); });
  $('trWall').addEventListener('click', () => { if (!save.dev) return; save.wallsOwned = WALLS.length; save.wallActive = WALLS.length - 1; tr('Semua 50 pagar dibuka'); });
  $('trBoost').addEventListener('click', () => { if (!save.dev) return; const now = Date.now(); BOOST_ORDER.forEach(id => { save.boost[id] = Math.max(now, save.boost[id] || 0) + 600000; }); tr('Semua booster +10 minit'); });
  $('trGod').addEventListener('click', () => { if (!save.dev) return; god = !god; battle.god = god; $('trGod').setAttribute('aria-pressed', god); $('trGod').textContent = god ? 'Pagar kebal: hidup' : 'Pagar kebal: mati'; toast($('trGod').textContent, true); });
  $('trKill').addEventListener('click', () => { if (!save.dev) return; if (battle.state !== 'main') return; battle.killAll(); tr('Semua zombie di skrin ditewaskan'); });

  function buildPedia() {
    $('pedia').innerHTML = '<p>Zombie yang hidup terlalu lama akan berevolusi (I hingga IV): lebih besar, lebih kuat, dan memberi lebih banyak gold serta peluang item. Had evolusi naik setiap 10 stage. Pada evolusi II dan IV, zombie mendapat sifat baharu. Boss mengamuk bila HP tinggal separuh.</p>' +
      TRAIT_ORDER.map(t => '<p>' + traitChip(t) + ' (evolusi dari stage ' + TRAITS[t].stage + '): ' + esc(TRAITS[t].desc) + '</p>').join('');
  }

  // ---------- tab ARENA: Kebangkitan, Kedai Roh, Mod Cabaran ----------
  const AICON = {
    roh: c => { iconBg(c, '#FFE0C0', '#C8302A'); glow(c, '#FFB04A', 16); c.fillStyle = '#FFB04A'; c.beginPath(); c.moveTo(32, 8); c.quadraticCurveTo(50, 28, 42, 46); c.quadraticCurveTo(38, 56, 32, 56); c.quadraticCurveTo(26, 56, 22, 46); c.quadraticCurveTo(14, 28, 32, 8); c.fill(); noGlow(c); c.fillStyle = '#FFE07A'; c.beginPath(); c.moveTo(32, 24); c.quadraticCurveTo(42, 38, 36, 48); c.quadraticCurveTo(32, 52, 28, 48); c.quadraticCurveTo(22, 38, 32, 24); c.fill(); c.fillStyle = '#FFFFFF'; star(c, 32, 42, 4, 4, 1.5, 0); },
    permulaan: c => { iconBg(c, '#D6F5C8', '#3E9E58'); c.fillStyle = '#6E4520'; c.fillRect(18, 12, 3, 42); c.fillStyle = '#E5484D'; c.beginPath(); c.moveTo(21, 12); c.lineTo(46, 20); c.lineTo(21, 28); c.fill(); label(c, '+5', 40, 52, 14); },
    warisan: c => { iconBg(c, '#FFF4C0', '#E7A71E'); [0, 1, 2, 3].forEach(i => { c.fillStyle = i % 2 ? '#E7A71E' : '#F5B82E'; rr(c, 14, 48 - i * 7, 36, 8, 3); c.fill(); }); coinAt(c, 32, 18, 9); label(c, '×3', 50, 22, 12); },
    latihan: c => { iconBg(c, '#E0F0FF', '#3B82C4'); c.fillStyle = '#2B3A55'; c.fillRect(14, 30, 36, 5); c.fillRect(10, 22, 7, 21); c.fillRect(47, 22, 7, 21); c.fillRect(6, 26, 5, 13); c.fillRect(53, 26, 5, 13); },
    berkat: c => { iconBg(c, '#FFD0C2', '#C8302A'); c.save(); c.translate(32, 32); c.rotate(-0.78); glow(c, '#FFE07A', 12); c.fillStyle = '#E8ECF4'; c.fillRect(-3, -22, 6, 32); c.beginPath(); c.moveTo(-3, -22); c.lineTo(0, -28); c.lineTo(3, -22); c.fill(); noGlow(c); c.fillStyle = '#B08A20'; c.fillRect(-10, 10, 20, 4); c.fillStyle = '#6E4520'; c.fillRect(-2.5, 14, 5, 10); c.restore(); },
    rezeki: c => { iconBg(c, '#EADCFF', '#8F55DE'); c.fillStyle = '#A066E8'; c.beginPath(); c.moveTo(20, 18); c.lineTo(44, 18); c.lineTo(52, 28); c.lineTo(32, 52); c.lineTo(12, 28); c.closePath(); c.fill(); c.strokeStyle = '#E8D8FF'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(12, 28); c.lineTo(52, 28); c.moveTo(20, 18); c.lineTo(32, 52); c.lineTo(44, 18); c.stroke(); },
    rapuh: c => { iconBg(c, '#F3E3CC', '#A8703E'); for (let i = 0; i < 4; i++) { c.fillStyle = '#C98B4E'; rr(c, 8 + i * 12.5, 18, 11, 34, 3); c.fill(); } c.strokeStyle = '#2B2B33'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(30, 16); c.lineTo(26, 28); c.lineTo(34, 34); c.lineTo(28, 46); c.lineTo(32, 54); c.stroke(); label(c, '15%', 46, 58, 12, '#FFE07A'); },
    pantas: c => { iconBg(c, '#FFF0B0', '#F2A33A'); c.fillStyle = '#8DC95B'; circ(c, 38, 32, 13); c.fillStyle = '#FFFFFF'; circ(c, 34, 30, 4); circ(c, 42, 30, 3); c.fillStyle = '#2B2B33'; circ(c, 35, 30, 1.8); circ(c, 43, 30, 1.4); c.strokeStyle = '#E5484D'; c.lineWidth = 3; c.lineCap = 'round'; [22, 32, 42].forEach(y => { c.beginPath(); c.moveTo(6, y); c.lineTo(18, y); c.stroke(); }); label(c, '2×', 46, 56, 12); },
    tunggal: c => { iconBg(c, '#E0F0FF', '#2B4BA0'); c.fillStyle = '#F2C28E'; circ(c, 32, 22, 9); c.fillStyle = '#3B82C4'; c.beginPath(); c.moveTo(18, 52); c.quadraticCurveTo(18, 32, 32, 32); c.quadraticCurveTo(46, 32, 46, 52); c.fill(); c.fillStyle = '#2B3A55'; c.beginPath(); c.arc(32, 19, 9, Math.PI, 0); c.fill(); label(c, '1', 52, 18, 14, '#FFE07A'); },
    gerombolan: c => { iconBg(c, '#D6F5C8', '#4E8A4A'); [[18, 36], [32, 28], [46, 36], [25, 46], [40, 46]].forEach(([x, y]) => { c.fillStyle = '#8DC95B'; circ(c, x, y, 9); c.fillStyle = '#FFFFFF'; circ(c, x - 3, y - 1, 2.5); c.fillStyle = '#2B2B33'; circ(c, x - 2.6, y - 1, 1.2); }); label(c, '×3', 50, 16, 12); },
    boss: c => { iconBg(c, '#E8D8FF', '#5A3A8A'); c.fillStyle = '#8C6BC2'; circ(c, 32, 38, 16); c.fillStyle = '#F5B82E'; c.beginPath(); c.moveTo(20, 26); c.lineTo(20, 12); c.lineTo(26, 20); c.lineTo(32, 8); c.lineTo(38, 20); c.lineTo(44, 12); c.lineTo(44, 26); c.closePath(); c.fill(); c.fillStyle = '#FFFFFF'; circ(c, 26, 36, 4); circ(c, 38, 37, 3); c.fillStyle = '#2B2B33'; circ(c, 27, 37, 2); circ(c, 38, 37, 1.5); },
    evolusi: c => { iconBg(c, '#3A2A4A', '#E5484D'); c.strokeStyle = '#FF5A5A'; c.lineWidth = 4; c.setLineDash([6, 4]); c.beginPath(); c.arc(32, 34, 18, 0, TAU); c.stroke(); c.setLineDash([]); c.fillStyle = '#6E9A58'; circ(c, 32, 34, 12); c.fillStyle = '#FF5A5A'; rr(c, 6, 6, 24, 15, 6); c.fill(); label(c, 'IV', 18, 18, 11, '#1C2333'); }
  };
  const perkCards = {}, chalCards = {};
  function buildArena() {
    paintIcon($('rohIco'), AICON.roh, 56);
    const pl = $('perkList'); pl.innerHTML = '';
    PERK_ORDER.forEach(id => { const p = PERKS[id], el = document.createElement('div'); el.className = 'card shop';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(p.nama) + ' <span class="lv"></span></h3><p>' + esc(p.desc) + '</p></div><button class="btn buy roh"></button>';
      paintIcon(el.querySelector('canvas'), AICON[id], 48);
      el.querySelector('button').addEventListener('click', () => { const r = buyPerk(save, id); afterChange(r.msg, r.ok); });
      perkCards[id] = el; pl.appendChild(el); });
    const cl = $('chalList'); cl.innerHTML = '';
    CHALLENGES.forEach(c => { const el = document.createElement('div'); el.className = 'card chal';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(c.nama) + ' <span class="lv"></span></h3><p>' + esc(c.desc) + '</p><p class="pips"></p><p class="st"></p></div><div class="acts"><button class="btn go"></button></div>';
      paintIcon(el.querySelector('canvas'), AICON[c.id], 56);
      el.querySelector('.go').addEventListener('click', () => { const lv = Math.min(CHAL_LEVELS, chalNext(save, c)); startChallenge(c, lv); });
      chalCards[c.id] = el; cl.appendChild(el); });
    $('prestigeBtn').addEventListener('click', () => {
      const g = prestigeGain(save); if (!g) { toast('Sampai stage ' + PRESTIGE_MIN + ' untuk Kebangkitan', false); return; }
      askYes('✨ Kebangkitan', '<p>Dapat <b>' + g + ' Roh Pahlawan</b>.</p><p><b>DI-RESET:</b> stage, gold, level hero, level senjata, level kuasa, pagar, naik taraf gold.</p><p><b>KEKAL:</b> hero, bintang, shard, gems, item, trofi, ensiklopedia, Roh.</p>', 'Bangkit!', () => {
        const r = doPrestige(save); persist(); newBattle(save.stage); running = false; updateControls(); portraitSig = {}; wselSig = ''; wallSumK = -1; pbarSig = ''; encSig = '';
        refreshAll(); introOverlay(); sfx('trophy'); toast(r.msg, true); });
    });
  }
  let raidSig = '';
  function refreshRaid() {
    const box = $('raidBox'); if (!box) return; const now = Date.now(), r = raidEnsure(save, now), sig = r.wk + '|' + r.step + '|' + r.rekod + '|' + Math.floor((raidWeekEnd(now) - now) / 3600000) + (save.bossDex || '').length;
    if (sig === raidSig) return; raidSig = sig;
    const left = raidWeekEnd(now) - now, d = Math.floor(left / 86400000), h = Math.floor(left % 86400000 / 3600000), done = r.step >= RAID_STEPS;
    const cur = done ? null : bossById(r.list[r.step]);
    box.innerHTML = '<div class="raidtop"><canvas id="raidIco" aria-hidden="true"></canvas><div><b>' + (done ? '🏆 Semua 10 boss minggu ini ditewaskan!' : 'Boss ' + (r.step + 1) + '/' + RAID_STEPS + ': ' + esc(cur.nama)) + '</b><small>' + (done ? 'Senarai baharu dalam ' : '⏳ Tamat dalam ') + d + ' hari ' + h + ' jam · Rekod peribadi: ' + (r.rekod || 0) + '/' + RAID_STEPS + '</small>' + (done ? '' : '<small>Stage ' + raidStage(save, r.step) + ' · 🎁 ' + raidReward(r.step).gems + ' gems</small><small>' + bossTraits(cur.id).map(k => BTRAIT[k].ikon + ' ' + esc(BTRAIT[k].nama)).join(' · ') + '</small><small>💡 ' + esc(bossAdvice(bossTraits(cur.id))) + '</small>') + '</div></div>' +
      '<div class="raidrow">' + r.list.map((id, i) => '<span class="rd' + (i < r.step ? ' ok' : i === r.step ? ' now' : '') + '" title="' + esc(bossById(id).nama) + '">' + (i < r.step ? '✓' : i + 1) + '</span>').join('') + '</div>' +
      (done ? '' : '<button class="btn big wide" id="raidGo">⚔ Lawan ' + esc(cur.form.nama) + '</button>') + '<p class="muted" style="margin:6px 0 0">Satu gelombang: boss besar + pengiring. Kalah? Cuba lagi bila-bila — kemajuan kekal sepanjang minggu. Senarai baharu setiap Isnin, utamakan boss yang belum ditewaskan.</p>';
    if (!done) { const cv = $('raidIco'); if (cv) paintIcon(cv, c => bossIconHD(c, cur.form, cur.t, cur.elem.id, false), 56); const go = $('raidGo'); if (go) go.addEventListener('click', () => startRaid()); }
  }
  function startRaid() {
    const r = raidEnsure(save, Date.now()); if (r.step >= RAID_STEPS) return; const i = r.step, B = bossById(r.list[i]);
    battle = new Battle(save, raidStage(save, i), undefined, { id: 'serbuan', raid: i, bossId: B.id }); battle.god = god; battle.now = Date.now(); battle.pcd = powerCd; battle.autoPower = save.autoPow; shownEnd = false;
    running = false; updateControls(); updateStageBar(); pageFrom = null; closePage(); showScreen('battle');
    showOverlay('👑 Serbuan Boss ' + (i + 1) + '/' + RAID_STEPS, B.elem.ikon + ' ' + B.nama + ' (' + B.tier.bin + '). Sifat: ' + bossTraits(B.id).map(k => BTRAIT[k].ikon + ' ' + BTRAIT[k].nama).join(', ') + '. 💡 ' + bossAdvice(bossTraits(B.id)) + '. Stage ' + battle.stage + '. 🎁 ' + raidReward(i).gems + ' gems.', [['Lawan!', startBattle, 'btn big'], ['Kembali', () => { newBattle(save.stage); goHub(); }, 'btn ghost']]);
  }
  function chalLabel(ch) { return ch.raid != null ? '👑 Serbuan ' + (ch.raid + 1) + '/' + RAID_STEPS : '⚔ ' + CHALLENGES.find(x => x.id === ch.id).nama + ' Lv.' + ch.lvl; }
  function refreshArena() {
    refreshRaid();
    const g = prestigeGain(save);
    $('rohInfo').innerHTML = '<b>Roh Pahlawan: ' + fmt(save.roh) + '</b> (terkumpul ' + fmt(save.rohTotal) + ')<br>Bonus kekal: damage & gold <b>×' + rohMult(save).toFixed(2) + '</b>' + (save.stats.prestige ? ' · Kebangkitan ' + save.stats.prestige + ' kali' : '') + '<br>' + (g ? 'Bangkit sekarang: <b>+' + g + ' Roh</b> (stage ' + save.best + ')' : 'Kebangkitan dibuka di stage ' + PRESTIGE_MIN + ' (kini ' + save.best + ')') + '<br><span class="muted">Selepas bangkit, menang sempurna di stage rendah melompat +3 stage.</span>';
    $('prestigeBtn').disabled = !g; $('prestigeBtn').textContent = g ? 'Bangkit (+' + g + ' Roh)' : 'Belum boleh bangkit';
    PERK_ORDER.forEach(id => { const p = PERKS[id], el = perkCards[id], l = perk(save, id), b = el.querySelector('button'); el.querySelector('.lv').textContent = 'Lv.' + l + (p.max < 999 ? '/' + p.max : '');
      if (l >= p.max) { b.textContent = 'Maksimum'; b.disabled = true; } else { const c = Math.ceil(p.kos(l)); b.textContent = c + ' Roh'; b.disabled = save.roh < c; } });
    CHALLENGES.forEach(c => { const el = chalCards[c.id], done = save.chal[c.id] || 0, open = chalUnlocked(save, c), lv = Math.min(CHAL_LEVELS, done + 1), b = el.querySelector('.go');
      el.classList.toggle('locked', !open); el.querySelector('.lv').textContent = done + '/' + CHAL_LEVELS;
      el.querySelector('.pips').innerHTML = Array.from({ length: CHAL_LEVELS }, (_, i) => '<i style="background:' + (i < done ? '#F2C230' : 'var(--chip)') + ';border-color:#F2C230"></i>').join('');
      const r = chalReward(lv);
      el.querySelector('.st').textContent = !open ? 'Dibuka di stage ' + c.buka : done >= CHAL_LEVELS ? 'Lengkap! Boleh dimain semula untuk keseronokan.' : 'Lv.' + lv + ' · stage ' + chalStage(save, c, lv) + ' · ganjaran ' + r.gems + ' gems, ' + r.shard + ' shard' + (r.item >= 0 ? ', item ' + RARITY[r.item].nama + '+' : '');
      b.disabled = !open; b.textContent = !open ? 'Terkunci' : done >= CHAL_LEVELS ? 'Main Lv.10' : 'Mula Lv.' + lv; });
  }
  function startChallenge(c, lv) {
    battle = new Battle(save, chalStage(save, c, lv), undefined, { id: c.id, lvl: lv }); battle.god = god; battle.now = Date.now(); battle.pcd = powerCd; battle.autoPower = save.autoPow; shownEnd = false;
    running = false; updateControls(); updateStageBar(); pageFrom = null; closePage(); showScreen('battle');
    const rw = chalReward(lv), tm = (c.mods && c.mods.solo ? save.team.slice(0, 1) : save.team).filter(h => save.heroes[h]).map(h => HEROES[h].nama).join(', ');
    showOverlay('⚔ Cabaran: ' + c.nama + ' Lv.' + lv, '📜 ' + c.desc + '. ' + CHAL_WAVES + ' gelombang di stage ' + battle.stage + '. 🦸 Pasukan: ' + tm + '. 🎁 Ganjaran: ' + rw.gems + ' gems, ' + rw.shard + ' shard' + (rw.item >= 0 ? ', item ' + RARITY[rw.item].nama + '+' : '') + '.', [['⚔ Mula cabaran', startBattle, 'btn big'], ['Batal', () => { newBattle(save.stage); introOverlay(); goHub(); }, 'btn ghost']]);
  }

  // ---------- v6: menara (tab Pagar), event, DPS, getaran ----------
  const towerCards = [];
  function buildTowers() {
    const box = $('towerList'); box.innerHTML = '';
    [0, 1, 2, 3].forEach(i => { const el = document.createElement('div'); el.className = 'card tower';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>Slot ' + (i + 1) + ' <span class="lv"></span></h3><p class="td"></p><div class="row2 types">' + TOWER_ORDER.map(t => '<button class="btn ghost tt" data-t="' + t + '"><span class="tn">' + (TOWERS[t].udara || t === 'tukang' ? '' : '⬇') + TOWERS[t].nama.replace('Menara ', '') + '</span><small class="tl">' + (TOWERS[t].stage ? '🔒 St.' + TOWERS[t].stage : '') + '</small></button>').join('') + '</div></div><div class="acts"><button class="btn up"></button><button class="btn ghost x10">×10</button></div>';
      el.querySelectorAll('.tt').forEach(b => b.addEventListener('click', () => { const r = buildTower(save, i, b.dataset.t); afterChange(r.msg, r.ok); el.dataset.k = ''; }));
      const brw = document.createElement('div'); brw.className = 'brrow'; el.querySelector('.info').appendChild(brw);
      brw.addEventListener('click', e => { const bt = e && e.target && e.target.closest ? e.target.closest('button[data-b]') : null; if (!bt) return; const r = chooseBranch(save, i, bt.dataset.b); afterChange(r.msg, r.ok); });
      el.querySelector('.up').addEventListener('click', () => { const r = upgradeTower(save, i, 1); afterChange(r.msg, r.ok); });
      el.querySelector('.x10').addEventListener('click', () => { const r = upgradeTower(save, i, 10); afterChange(r.msg, r.ok); });
      towerCards.push(el); box.appendChild(el); });
  }
  function refreshTowers() {
    [0, 1, 2, 3].forEach(i => { const el = towerCards[i]; if (i >= save.towers.length) { el.hidden = true; return; } el.hidden = false; const t = save.towers[i], up = el.querySelector('.up'), x10 = el.querySelector('.x10');
      const brw = el.querySelector('.brrow'), tier = branchAvailable(t), bsig = t ? t.type + (t.br || []).join() + tier : '';
      if (brw && brw.dataset.k !== bsig) { brw.dataset.k = bsig; brw.innerHTML = !t ? '' : (t.br || []).map((k, j) => { const B = TOWER_BRANCH[t.type][j].find(x => x.id === k); return '<span class="brchip">' + (j ? '★★ ' : '★ ') + esc(B.nama) + '</span>'; }).join('') + (tier >= 0 ? '<p class="brh">Pilih cabang Lv.' + BRANCH_LV[tier] + ':</p>' + TOWER_BRANCH[t.type][tier].map(B => '<button class="btn ghost brb" data-b="' + B.id + '"><b>' + esc(B.nama) + '</b><small>' + esc(B.desc) + '</small></button>').join('') : (t && (t.br || []).length < 2 ? '<p class="brh muted">Cabang seterusnya di Lv.' + BRANCH_LV[(t.br || []).length] + '</p>' : '')); }
      const key = t ? t.type : 'none'; if (el.dataset.k !== key) { el.dataset.k = key; paintIcon(el.querySelector('canvas'), c => t ? towerIcon(c, t.type) : (iconBg(c, '#EEF2F8', '#B8C2CC'), label(c, '+', 32, 42, 30, '#FFFFFF')), 56); }
      el.querySelector('.lv').textContent = t ? TOWERS[t.type].nama + ' Lv.' + t.lvl : 'Kosong';
      el.querySelector('.td').textContent = t ? TOWERS[t.type].desc + ' · jarak ' + (TOWERS[t.type].range + towerMods(t).range) + ' · DPS ≈ ' + fmt(towerDps(save, t)) + ' · kuasa ×' + towerLvlMult(t.lvl).toFixed(1) + '. Tekan jenis lain untuk tukar (percuma).' : 'Pilih jenis untuk membina (' + fmt(towerBuildCost(i)) + ' gold).';
      el.querySelectorAll('.tt').forEach(b => { const un = towerUnlocked(save, b.dataset.t); b.disabled = !un || (!t && save.gold < towerBuildCost(i)) || (t && t.type === b.dataset.t); if (b.classList) b.classList.toggle('lk', !un); const tl = b.querySelector && b.querySelector('.tl'); if (tl) tl.hidden = un; });
      up.hidden = !t; x10.hidden = !t; if (t) { const c = towerUpCost(t.lvl); up.innerHTML = 'Naik ' + coin + fmt(c); up.disabled = save.gold < c; x10.disabled = save.gold < c; } });
  }
  function refreshEvent() {
    const ev = activeEvent(Date.now(), save.eventForce);
    $('evChip').hidden = !ev; if (ev) $('evName').textContent = ev.nama;
    $('evBox').hidden = !ev;
    if (ev) { $('evInfo').innerHTML = '<b>' + esc(ev.nama) + '</b>: ' + esc(ev.desc) + '.'; const av = eventChestAvailable(save, Date.now()); $('evBtn').disabled = !av; $('evBtn').textContent = av ? 'Tuntut Peti Event (40 gems + 12 shard)' : 'Peti event hari ini sudah dituntut'; }
    return ev && eventChestAvailable(save, Date.now()) ? 1 : 0;
  }
  $('evBtn').addEventListener('click', () => { const r = claimEventChest(save, Date.now(), Math.random); afterChange(r.msg, r.ok); refreshEvent(); });
  $('evChip').addEventListener('click', () => setTab('harian'));
  $('bestTeamBtn').addEventListener('click', () => { const r = bestTeam(save); portraitSig = {}; wselSig = ''; afterChange(r.msg, r.ok); });
  $('upAll').addEventListener('click', () => { const r = upgradeAll(save); afterChange(r.msg, r.ok); });
  $('btnDps').addEventListener('click', () => { showDps = !showDps; $('btnDps').setAttribute('aria-pressed', showDps); toast(showDps ? 'Meter DPS: hidup' : 'Meter DPS: mati', true); });
  $('calmBtn').addEventListener('click', () => { save.settings.calm = !save.settings.calm; persist(); refreshInfo(); document.body.classList.toggle('calm', !!save.settings.calm); toast(save.settings.calm ? 'Mod tenang: kilatan & gegaran dikurangkan' : 'Mod tenang dimatikan', true); });
  $('bigBtn').addEventListener('click', () => { save.settings.bigText = !save.settings.bigText; persist(); refreshInfo(); document.body.classList.toggle('bigtext', !!save.settings.bigText); toast(save.settings.bigText ? 'Teks besar hidup' : 'Teks biasa', true); });
  $('gearViewBtn').addEventListener('click', () => { const o = ['penuh', 'ringkas', 'tiada'], i = o.indexOf(save.settings.gearView); save.settings.gearView = o[(i + 1) % 3]; persist(); refreshGearBtn(); portraitSig = {}; hubSig = ''; hsSig = ''; toast('Papar peralatan: ' + save.settings.gearView, true); });
  function refreshGearBtn() { $('gearViewBtn').textContent = 'Papar peralatan: ' + save.settings.gearView; }
  refreshGearBtn();
  $('vibBtn').addEventListener('click', () => { save.settings.vib = save.settings.vib === false; persist(); $('vibBtn').textContent = 'Getaran: ' + (save.settings.vib === false ? 'mati' : 'hidup'); if (save.settings.vib !== false) vib(60); });
  $('evForce').innerHTML = '<option value="">Event ikut tarikh</option>' + EVENTS.map(e => '<option value="' + e.id + '">' + esc(e.nama) + '</option>').join('');
  $('evForce').addEventListener('change', e => { if (!save.dev) return; save.eventForce = e.target.value; persist(); refreshEvent(); toast(save.eventForce ? 'Event dipaksa: ' + EVENTS.find(x => x.id === save.eventForce).nama : 'Event ikut tarikh', true); });

  // ---------- tab HARIAN ----------
  let misiSig = '';
  function refreshHarian() {
    const now = Date.now(); rollMissions(save, now);
    const st = save.daily.streak, today = st % 7, avail = loginAvailable(save, now);
    $('loginCal').innerHTML = LOGIN_REWARDS.map((r, i) => { const got = i < today || (i === today && !avail && st > 0 && today !== 0) || (!avail && i === (st - 1) % 7); const cur = avail && i === today; return '<div class="lday' + (got ? ' got' : '') + (cur ? ' cur' : '') + '"><b>Hari ' + (i + 1) + '</b><span>' + esc(r.nama) + '</span>' + (got ? '<i>✔</i>' : '') + '</div>'; }).join('');
    $('loginBtn').disabled = !avail; $('loginBtn').textContent = avail ? 'Tuntut ganjaran Hari ' + (today + 1) : 'Kembali esok untuk Hari ' + (today + 1);
    const ms = save.daily.missions, sig = JSON.stringify(ms) + ms.map(m => missionInfo(save, m).v).join(',');
    if (sig !== misiSig) {
      misiSig = sig; const box = $('misiList'); box.innerHTML = '';
      ms.forEach((m, i) => { const inf = missionInfo(save, m), el = document.createElement('div'); el.className = 'card misi' + (m.done ? ' done' : inf.ready ? ' ready' : '');
        el.innerHTML = '<div class="info"><h3>' + esc(inf.nama) + (m.done ? ' ✔' : '') + '</h3><div class="sbar"><div class="fill" style="width:' + (inf.v / inf.need * 100) + '%"></div><span>' + fmt(inf.v) + '/' + fmt(inf.need) + '</span></div><p class="muted">Ganjaran: ' + inf.gems + ' gems, ' + fmt(inf.gold) + ' gold</p></div><button class="btn"' + (inf.ready ? '' : ' disabled') + '>' + (m.done ? 'Selesai' : 'Tuntut') + '</button>';
        el.querySelector('button').addEventListener('click', () => { const r = claimMission(save, i); misiSig = ''; afterChange(r.msg, r.ok); });
        box.appendChild(el); });
    }
    const all = ms.length && ms.every(m => m.done); $('misiBonus').disabled = !all || save.daily.bonus; $('misiBonus').textContent = save.daily.bonus ? 'Bonus harian sudah dituntut' : 'Bonus semua misi: 50 gems + 15 shard';
    const mid = new Date(now); mid.setHours(24, 0, 0, 0); const left = Math.max(0, mid - now); $('misiReset').textContent = 'Set semula dalam ' + Math.floor(left / 3600000) + ' jam ' + Math.floor(left % 3600000 / 60000) + ' minit';
  }
  function dailyReady() { rollMissions(save, Date.now()); return (loginAvailable(save, Date.now()) ? 1 : 0) + save.daily.missions.filter(m => missionInfo(save, m).ready).length + (save.daily.missions.length && save.daily.missions.every(m => m.done) && !save.daily.bonus ? 1 : 0); }
  $('loginBtn').addEventListener('click', () => { const r = claimLogin(save, Date.now(), Math.random); afterChange(r.msg, r.ok); refreshHarian(); });
  $('misiBonus').addEventListener('click', () => { const r = claimMissionBonus(save, Math.random); afterChange(r.msg, r.ok); refreshHarian(); });

