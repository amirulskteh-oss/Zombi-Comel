  // ---------- TUTORIAL ----------
  const TUT = [
    { t: 'Selamat datang ke Zombi Comel! Tekan butang Mula untuk mempertahankan kampung.', tab: null, auto: true },
    { t: 'Hero menembak zombie secara automatik. Tekan zombie untuk memberi serangan tambahan!', tab: null },
    { t: 'Gold daripada zombie digunakan untuk naik level hero. Buka Pasukan (butang di bawah, atau ☰ semasa bertempur) dan tekan Naik.', tab: 'hero' },
    { t: 'Kumpul shard daripada zombie dan boss untuk membina hero baharu dan menaikkan bintang (sehingga 50★).', tab: 'hero' },
    { t: 'Tekan ikon kuasa di bawah medan semasa bertempur. Hujan Meteor sudah sedia!', tab: null, bar: true },
    { t: 'Tuntut ganjaran log masuk, misi harian dan trofi di Lagi → Harian & Trofi.', tab: 'ganjaran' },
    { t: 'Butang Lagi: Ensiklopedia, Pilihan dan sandaran save. Tekan hero di medan untuk lihat jarak senjata. Selamat bermain!', tab: 'lagi' }
  ];
  const TIPS = [
    { id: 'tekan', ok: () => save.stats.battles >= 1, t: 'Petua: tekan zombie berturut-turut untuk KOMBO (sehingga ×2 damage). Setiap 50 tekanan melancarkan Tapak Gergasi!' },
    { id: 'ultimate', ok: () => save.stats.battles >= 2, t: 'Baharu! Setiap hero ada ⚡ ULTIMATE. Bunuh zombie untuk mengecas gelang di bawah hero, kemudian tekan butang bulat hero di bawah medan. Auto kuasa turut melancarkannya.' },
    { id: 'jarak', ok: () => save.team.length >= 2, t: 'Petua: tekan hero di medan untuk lihat jarak senjatanya. Seret hero ke hero lain untuk tukar kedudukan.' },
    { id: 'bina', ok: () => HERO_ORDER.some(h => !save.heroes[h] && (save.shards[h] || 0) >= TIERS[HEROES[h].tier].bina), t: 'Petua: ada hero yang boleh dibina dengan shard! Buka tab Hero.', tab: 'hero' },
    { id: 'menara', ok: () => save.gold >= towerBuildCost(0) && !save.towers[0], t: 'Petua: Menara Pagar boleh dibina di tab Pagar. Menara menembak sendiri dari atas pagar.', tab: 'pagar' },
    { id: 'peralatan', ok: () => save.items.some(x => x.jenis !== 'perisai' && !whoEquips(save, x.uid)), t: 'Petua: tekan hero di Pasukan untuk membuka 6 slot peralatan. Tekan slot untuk pilih item; ▲ bermaksud lebih baik.', tab: 'hero' },
    { id: 'gabung', ok: () => ITEM_JENIS.some(j => RARITY.some((r, i) => save.items.filter(x => x.jenis === j && x.rar === i && !x.lock && !whoEquips(save, x.uid)).length >= 3)), t: 'Petua: 3 item jenis & tahap sama boleh digabung menjadi tahap seterusnya. Buka Beg → 🔀 Gabung.', tab: 'beg' },
    { id: 'kostum', ok: () => skinCount(save) > 0 && !Object.keys(save.skinOn).length, t: 'Petua: anda ada kostum! Buka lembaran hero dan pilih kostum di bahagian 👘 Kostum.', tab: 'hero' },
    { id: 'beg', ok: () => save.items.length >= 100, t: 'Petua: beg hampir penuh. Gunakan Auto-jual dan kunci 🔒 item kegemaran di tab Beg.', tab: 'beg' },
    { id: 'cabaran', ok: () => chalUnlocked(save, CHALLENGES[0]), t: 'Petua: Mod Cabaran dibuka di tab Arena: peraturan khas dengan ganjaran gems, shard & item!', tab: 'arena' },
    { id: 'bangkit', ok: () => prestigeGain(save) > 0, t: 'Petua: Kebangkitan dibuka di tab Arena! Reset stage untuk Roh Pahlawan dan bonus kekal.', tab: 'arena' }
  ];
  let curTip = null;
  function checkTips() {
    if (save.tut < 99 || curTip || !$('tutBox').hidden) return;
    const tp = TIPS.find(x => !save.tips[x.id] && x.ok()); if (!tp) return;
    curTip = tp; $('tutBox').hidden = false; $('tutText').textContent = '💡 ' + tp.t; $('tutNext').hidden = false; $('tutSkip').hidden = true; if (tp.tab) hintEl(tp.tab).classList.add('hint');
  }
  function closeTip() { if (!curTip) return false; save.tips[curTip.id] = true; if (curTip.tab) hintEl(curTip.tab).classList.remove('hint'); curTip = null; $('tutBox').hidden = true; $('tutSkip').hidden = false; persist(); return true; }
  function showTut() {
    const box = $('tutBox'); document.querySelectorAll('.hint').forEach(e => e.classList.remove('hint'));
    if (save.tut >= TUT.length) { box.hidden = true; return; }
    const s = TUT[save.tut]; box.hidden = false; $('tutText').textContent = (save.tut + 1) + '/' + TUT.length + ' · ' + s.t;
    $('tutNext').hidden = !!s.auto; if (s.tab) hintEl(s.tab).classList.add('hint'); if (s.bar) $('powerBar').classList.add('hint');
  }
  function tutAdvance(from) { if (save.tut === from) { save.tut = from + 1 >= TUT.length ? 99 : from + 1; persist(); showTut(); } }
  $('tutNext').addEventListener('click', () => { sfx('click'); if (closeTip()) return; tutAdvance(save.tut); });
  $('tutSkip').addEventListener('click', () => { save.tut = 99; persist(); showTut(); });
  $('tutAgain').addEventListener('click', () => { if (curTip) { if (curTip.tab) hintEl(curTip.tab).classList.remove('hint'); curTip = null; } $('tutSkip').hidden = false; save.tut = 0; persist(); showTut(); toast('Tutorial dimulakan semula', true); });

  // ---------- LOMPAT STAGE ----------
  $('stageName').addEventListener('click', () => { $('jumpRow').hidden = !$('jumpRow').hidden; $('jumpIn').value = battle.stage; });
  const jumpTo = n => { n = Math.max(1, Math.min(save.best, Math.floor(+n || 1))); newBattle(n); running = false; updateControls(); introOverlay(); $('jumpIn').value = n; };
  $('jumpM10').addEventListener('click', () => jumpTo(battle.stage - 10));
  $('jumpP10').addEventListener('click', () => jumpTo(battle.stage + 10));
  $('jumpGo').addEventListener('click', () => jumpTo($('jumpIn').value));
  $('jumpBest').addEventListener('click', () => jumpTo(save.best));

  // ---------- AUTO-JUAL ----------
  $('autoSell').innerHTML = '<option value="-1">Auto-jual: mati</option>' + RARITY.slice(0, 5).map((r, i) => '<option value="' + i + '">Auto-jual ≤ ' + r.nama + '</option>').join('');
  $('autoSell').addEventListener('change', e => { save.autoSell = +e.target.value; persist(); toast(save.autoSell < 0 ? 'Auto-jual dimatikan' : 'Item ' + RARITY[save.autoSell].nama + ' ke bawah akan dijual automatik', true); });

  // ---------- MOD PEMBANGUN, SANDARAN, TETAPAN ----------
  function refreshInfo() {
    $('trainerBox').hidden = !save.dev; $('devToggle').textContent = save.dev ? 'Matikan Mod Pembangun' : 'Mod Pembangun (trainer)';
    $('backupNote').hidden = !needBackup(save, Date.now()); refreshBackups();
    $('calmBtn').textContent = 'Kurangkan kilatan & gegaran: ' + (save.settings.calm ? 'hidup' : 'mati'); $('bigBtn').textContent = 'Teks besar: ' + (save.settings.bigText ? 'hidup' : 'mati');
    $('vibBtn').textContent = 'Getaran: ' + (save.settings.vib === false ? 'mati' : 'hidup'); $('evForce').value = save.eventForce;
    volLabels(); $('musicVol').value = Math.round(save.settings.music * 100); $('sfxVol').value = Math.round(save.settings.sfx * 100); $('autoSell').value = save.autoSell;
  }
  $('devToggle').addEventListener('click', () => {
    const flip = () => { save.dev = !save.dev; if (!save.dev) { god = false; battle.god = false; } else document.body.classList.add('devshow'); persist(); refreshInfo(); if (save.dev) { const tb = $('trainerBox'); if (tb && typeof tb.scrollIntoView === 'function') try { tb.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} } toast(save.dev ? 'Mod Pembangun hidup — trainer di bawah butang ini' : 'Mod Pembangun mati', true); };
    if (save.dev) flip(); else askYes('🛠 Mod Pembangun', '<p>Mod Pembangun membuka trainer (gold, gems, hero, trofi percuma). Ia untuk menguji game.</p>', 'Hidupkan', flip);
  });
  function refreshBackups() { const a = getBackups(), box = $('bkList'); box.innerHTML = a.length ? '' : '<p class="muted">Tiada sandaran automatik lagi. Sandaran dibuat sebelum setiap kemas kini besar (3 terkini disimpan).</p>';
    a.forEach((b, i) => { const r = document.createElement('div'); r.className = 'bkrow'; const d = new Date(b.t); r.innerHTML = '<span>' + d.toLocaleDateString() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' · stage ' + b.best + '<small>' + esc(b.note || '') + '</small></span>'; const bt = document.createElement('button'); bt.className = 'btn ghost'; bt.textContent = 'Pulihkan'; bt.addEventListener('click', () => { $('saveCode').value = 'ZC5:' + btoa(unescape(encodeURIComponent(b.data))); $('importBtn').click(); }); r.appendChild(bt); box.appendChild(r); }); }
  $('bkNow').addEventListener('click', () => { persist(); addBackup(store.get(SAVE_KEY), 'Sandaran manual'); refreshBackups(); toast('Sandaran disimpan dalam peranti', true); });
  $('trGive').addEventListener('click', () => { if (!save.dev) return; const j = $('trJenis').value, r0 = +$('trRar').value, it = makeItem(save, Math.random, r0, j); it.rar = r0; it.sub = rollSubs(j, r0, it.uid * 7919 + r0); const r = addItem(save, it); invSig = ''; tr(r.ok ? 'Dapat ' + itemName(it) : 'Beg penuh'); });
  $('trSkins').addEventListener('click', () => { if (!save.dev) return; SKINS.filter(s => !s.sup).forEach(s => { if (save.skins[s.id] == null) save.skins[s.id] = 0; }); encSig = ''; tr('Semua 44 kostum dibuka'); });
  $('trJenis').innerHTML = ITEM_JENIS.map(j => '<option value="' + j + '">' + SLOT_NAMA[j] + '</option>').join(''); $('trRar').innerHTML = RARITY.map((r, i) => '<option value="' + i + '">T' + (i + 1) + ' ' + r.nama + '</option>').join('');
  $('exportBtn').addEventListener('click', () => {
    save.lastExport = Date.now(); persist(); const code = encodeSave(save); $('saveCode').value = code; $('backupNote').hidden = true;
    try { if (navigator.clipboard) navigator.clipboard.writeText(code).then(() => toast('Kod save disalin. Simpan di tempat selamat (contohnya WhatsApp atau nota).', true), () => toast('Kod save dipaparkan. Salin dan simpan.', true)); else toast('Kod save dipaparkan. Salin dan simpan.', true); } catch (e) { toast('Kod save dipaparkan. Salin dan simpan.', true); }
  });
  $('importBtn').addEventListener('click', () => {
    let s2; try { s2 = decodeSave($('saveCode').value, Date.now()); } catch (e) { toast(e.message, false); return; }
    askYes('Import save?', '<p>Gantikan progress sekarang dengan save ini?</p><p>Stage tertinggi <b>' + s2.best + '</b> · <b>' + Object.keys(s2.heroes).length + '</b> hero</p>', 'Import', () => {
      save = s2; persist(); newBattle(save.stage); running = false; updateControls(); portraitSig = {}; wselSig = ''; wallSlotSig = ''; wallSumK = -1; pbarSig = ''; encSig = ''; misiSig = '';
      buildInv(); refreshAll(); refreshInfo(); introOverlay(); toast('Save berjaya diimport!', true); });
  });
  function volLabels() { $('musicVolV').textContent = Math.round(save.settings.music * 100) + '%'; $('sfxVolV').textContent = Math.round(save.settings.sfx * 100) + '%'; $('ambVolV').textContent = Math.round((save.settings.amb == null ? 0.4 : save.settings.amb) * 100) + '%'; if ($('masterVolV')) $('masterVolV').textContent = Math.round((save.settings.master == null ? 2 : save.settings.master) * 100) + '%'; }
  $('musicVol').addEventListener('input', e => { save.settings.music = e.target.value / 100; auVolume(); persist(); volLabels(); });
  $('sfxVol').addEventListener('input', e => { save.settings.sfx = e.target.value / 100; auVolume(); persist(); volLabels(); });
  $('ambVol').value = Math.round((save.settings.amb == null ? 0.4 : save.settings.amb) * 100);
  if ($('masterVol')) { $('masterVol').value = Math.round((save.settings.master == null ? 2 : save.settings.master) * 100); $('masterVol').addEventListener('input', e => { save.settings.master = e.target.value / 100; auVolume(); persist(); volLabels(); }); $('masterVol').addEventListener('change', () => sfx('tap')); }
  $('ambVol').addEventListener('input', e => { save.settings.amb = e.target.value / 100; auVolume(); persist(); volLabels(); if (!(save.settings.amb > 0)) ambSet(null); });
  const refreshSndBtns = () => { $('voiceBtn').textContent = 'Suara watak: ' + (save.settings.voice === false ? 'mati' : 'hidup'); $('dmgNumBtn').textContent = 'Angka damage: ' + (save.settings.dmgNum === false ? 'mati' : 'hidup'); };
  $('voiceBtn').addEventListener('click', () => { save.settings.voice = save.settings.voice === false; auVolume(); persist(); refreshSndBtns(); if (save.settings.voice) { auInit(); sfx('cheer'); } });
  $('dmgNumBtn').addEventListener('click', () => { save.settings.dmgNum = save.settings.dmgNum === false; if (battle) battle.dmgNums = save.settings.dmgNum && !CALM(); persist(); refreshSndBtns(); });
  refreshSndBtns();



  // ---------- v7.3: anak patung peralatan dalam lembaran hero ----------
  const dollSig = {};
  function statSource(id, k) {
    const st = heroStats(save, id, Date.now()), wid = heroWeapon(save, id), eq = save.equip[id] || {}, sk = heroSkin(save, id);
    const items = HERO_SLOTS.map(s => itemByUid(save, eq[s])).filter(Boolean);
    const subOf = key => Math.round(items.reduce((a, it) => a + itemSubs(it).filter(x => x.k === key).reduce((p, x) => p + x.v, 0), 0) * 10) / 10;
    const skv = key => { if (!sk) return 0; const ss = skinStats(sk, save.skins[sk.id]); return ss[key] || 0; };
    if (k === 'Damage') return 'Damage: senjata ' + WEAPONS[wid].dmg + ' · level ×' + heroLvlMult(save.heroes[id] || 1).toFixed(1) + ' · tier ×' + TIERS[HEROES[id].tier].mult + ' · ★ ×' + starMult(save.stars[id] || 0).toFixed(2) + ' · Lv senjata ×' + wpnLvlMult(save.weapons[wid] || 1).toFixed(1) + ' · item/set/kostum/koleksi +' + Math.round(st.dmgPct) + '% · Roh ×' + rohMult(save).toFixed(2);
    if (k === 'Laju') return 'Laju: senjata ' + WEAPONS[wid].rate + '/s · Kedai +' + Math.round(6 * save.shop.speed) + '% · item/kostum +' + Math.round(st.ratePct) + '%';
    if (k === 'D. boss') return 'Damage boss: stat sampingan +' + subOf('boss') + '% · kostum +' + skv('boss') + '%';
    if (k === 'Tembus perisai') return 'Tembus perisai (zombie berperisai biasa tahan 35%): stat sampingan ' + subOf('pen') + '% · kostum ' + skv('pen') + '%';
    if (k === 'Ketepatan') return 'Ketepatan (zombie hantu elak 25%): stat sampingan ' + subOf('acc') + '% · kostum ' + skv('acc') + '%';
    if (k === 'Kritikal' || k === 'D. kritikal') return 'Kritikal: senjata, topi keledar, kostum & stat sampingan. Damage kritikal asas ×2';
    return 'Gold: but, kostum & stat sampingan';
  }
  function refreshDoll(id) {
    const card = heroCards[id]; if (!card) return; let dl = card.querySelector('.doll');
    const eq = save.equip[id] || {}, k = HERO_SLOTS.map(s => { const it = itemByUid(save, eq[s]); return it ? it.uid + ':' + it.ilvl : '-'; }).join() + heroWeapon(save, id) + gearSig(save, id) + JSON.stringify(save.skins) + heroCP(heroStats(save, id, 0));
    if (dollSig[id] === k) return; dollSig[id] = k;
    const slotBtn = s => { const it = itemByUid(save, eq[s]); return '<button class="dslot' + (it ? ' on' : '') + '" data-s="' + s + '" style="' + (it ? 'border-color:' + RARITY[it.rar].warna : '') + '"><canvas class="dg" aria-hidden="true"></canvas><b>' + SLOT_NAMA[s] + '</b><small>' + (it ? 'T' + (it.rar + 1) + ' +' + it.ilvl : 'Kosong · tekan') + '</small></button>'; };
    const st = heroStats(save, id, Date.now()), epic = HERO_SLOTS.filter(s => { const it = itemByUid(save, eq[s]); return it && it.rar >= 3; }).length;
    const sks = SKINS.filter(x => x.hero === id), skOn = heroSkin(save, id);
    const skinRow = '<div class="skrow"><b>👘 Kostum</b><button class="skb' + (!skOn ? ' on' : '') + '" data-k="">Asal</button>' + sks.map(x => { const own = save.skins[x.id] != null; return '<button class="skb' + (skOn && skOn.id === x.id ? ' on' : '') + (own ? '' : ' lock') + '" data-k="' + x.id + '"' + (own ? '' : ' disabled') + '>' + (x.rar ? 'UR ' : 'SR ') + esc(x.theme.nama) + (own ? ' ★' + save.skins[x.id] : ' 🔒') + '</button>'; }).join('') + '</div>';
    const row = (k, v, src) => '<button class="strow" data-st="' + k + '"><span>' + k + '</span><b>' + v + '</b></button>';
    const statP = '<div class="stpanel"><div class="cp">⚡ Kuasa Tempur <b>' + fmt(heroCP(st)) + '</b></div><div class="stgrid">' +
      row('Damage', fmt(st.dmg)) + row('Laju', st.rate.toFixed(2) + '/s') + row('Kritikal', Math.round(st.crit * 100) + '%') + row('D. kritikal', '×' + st.critMul.toFixed(2)) +
      row('D. boss', '+' + st.boss + '%') + row('Tembus perisai', st.pen + '%') + row('Ketepatan', st.acc + '%') + row('Gold', '+' + st.goldPct + '%') + '</div>' + skinRow + '</div>';
    dl.innerHTML = '<div class="dcol">' + ['helm', 'baju', 'beg'].map(slotBtn).join('') + '</div><div class="dmid"><canvas class="dpor" width="220" height="220" aria-hidden="true"></canvas><p class="dset ' + (st.setOn ? 'on' : '') + '">Bonus set ' + epic + '/6' + (st.setOn ? ' ✔ +10% damage' : ' (Epik+)') + '</p></div><div class="dcol">' + ['senjata', 'tangan', 'but'].map(slotBtn).join('') + '</div>' + statP;
    const c = dl.querySelector('.dpor').getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 220, 220); c.scale(3.5, 3.5); drawHero(c, 31, 34, id, -Math.PI / 4, 0, 1.15, heroWeapon(save, id), { t: 0.5, phase: 0, mood: 'main', gear: gearOf(save, id), skin: heroSkin(save, id) });
    (dl.querySelectorAll('.dslot') || []).forEach(b => { const s = b.dataset.s, it = itemByUid(save, eq[s]); paintIcon(b.querySelector('.dg'), cc => { iconBg(cc, '#EEF2F8', it ? RARITY[it.rar].warna : '#B8C2CC'); itemGlyph(cc, 32, 32, 2.2, s, it ? RARITY[it.rar].warna : '#9AA6B4'); }, 30); });
  }
  let pickCtx = null;
  function pickGridHtml() {
    const { id, s, sort, sel } = pickCtx, cur = id === '__pagar' ? itemByUid(save, save.wallEquip[pickCtx.idx]) : itemByUid(save, (save.equip[id] || {})[s]);
    const keyf = { kuasa: it => itemPower(it), tahap: it => it.rar * 1000 + it.ilvl, level: it => it.ilvl };
    const list = save.items.filter(x => x.jenis === s && (!cur || x.uid !== cur.uid)).sort((a, b) => keyf[sort](b) - keyf[sort](a));
    const tile = (it, isCur) => { const cmp = isCur ? null : id === '__pagar' ? { better: !cur || itemPower(it) > itemPower(cur), diff: [] } : compareItem(save, it.uid, id), w = whoEquips(save, it.uid);
      return '<button class="ptile' + (it.uid === sel ? ' sel' : '') + (isCur ? ' cur' : '') + '" data-u="' + it.uid + '" style="border-color:' + RARITY[it.rar].warna + ';background:linear-gradient(180deg,' + RARITY[it.rar].warna + '33,var(--card) 70%)"><i class="pg" data-j="' + it.jenis + '" data-c="' + RARITY[it.rar].warna + '"></i><b>T' + (it.rar + 1) + ' +' + it.ilvl + '</b>' + (cmp ? '<em class="' + (cmp.better ? 'up' : 'dn') + '">' + (cmp.better ? '▲' : '▼') + '</em>' : '') + (it.sub && it.sub.length ? '<u>' + '◆'.repeat(it.sub.length) + '</u>' : '') + (w && w.hero !== '__pagar' && w.hero !== id ? '<s>' + esc(HEROES[w.hero].nama.split(' ')[0]) + '</s>' : '') + (isCur ? '<s>Dipakai</s>' : '') + '</button>'; };
    const selIt = itemByUid(save, sel);
    let cmpH = '';
    if (selIt) { const c = id === '__pagar' ? null : compareItem(save, selIt.uid, id); cmpH = '<div class="pcmp"><b style="color:' + RARITY[selIt.rar].warna + '">' + esc(itemName(selIt)) + '</b><small>' + esc(itemDescFull(selIt)) + '</small>' + (c && c.diff && c.diff.length ? '<p>' + c.diff.map(d => '<span class="' + (d.d > 0 ? 'up' : 'dn') + '">' + (d.d > 0 ? '▲ +' : '▼ ') + d.d + d.n + '</span>').join(' ') + '</p>' : '') + '</div>'; }
    return (cur ? '<p class="muted" style="margin:0 0 4px">Sedang dipakai:</p><div class="pgrid">' + tile(cur, true) + '</div>' : '') +
      '<div class="psort">' + [['kuasa', 'Kuasa'], ['tahap', 'Tahap'], ['level', 'Level']].map(([k, n]) => '<button data-sort="' + k + '"' + (k === sort ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div>' +
      (list.length ? '<div class="pgrid">' + list.map(it => tile(it, false)).join('') + '</div>' : '<p class="muted">Tiada ' + SLOT_NAMA[s].toLowerCase() + ' lain dalam beg. Item jatuh daripada zombie & boss, atau buka peti di Kedai.</p>') + cmpH;
  }
  function paintPickGlyphs() { (($('mBody').querySelectorAll && $('mBody').querySelectorAll('.pg')) || []).forEach(el => { if (!el.dataset || el.firstChild) return; const cv = document.createElement('canvas'); el.appendChild(cv); paintIcon(cv, c => { iconBg(c, '#F4F7FA', el.dataset.c); itemGlyph(c, 32, 32, 2.3, el.dataset.j, el.dataset.c); }, 34); }); }
  function renderPick() { $('mBody').innerHTML = pickGridHtml(); paintPickGlyphs(); }
  function pickWall(idx) {
    const cur = itemByUid(save, save.wallEquip[idx]), first = save.items.filter(x => x.jenis === 'perisai' && !save.wallEquip.includes(x.uid)).sort((a, b) => itemPower(b) - itemPower(a))[0];
    pickCtx = { id: '__pagar', s: 'perisai', idx, sort: 'kuasa', sel: first ? first.uid : null };
    const btns = [['✔ Pasang pada soket ' + (idx + 1), () => { const u = pickCtx && pickCtx.sel; pickCtx = null; if (u == null) { toast('Pilih item dahulu', false); return; } const r = equipWallItem(save, u, idx); wallSlotSig = ''; afterChange(r.msg, r.ok); }, 'btn']];
    if (cur) btns.push(['⚒ Tempa (+1 level) · ' + fmt(forgeCost(cur)) + ' gold', () => { pickCtx = null; const r = forgeItem(save, cur.uid); wallSlotSig = ''; afterChange(r.msg, r.ok); }, 'btn ghost'], ['Tanggal', () => { pickCtx = null; const r = unequipItem(save, cur.uid); wallSlotSig = ''; afterChange(r.msg, r.ok); }, 'btn ghost']);
    btns.push(['Tutup', () => { pickCtx = null; }, 'btn ghost']);
    showModal('🛡 Soket pagar ' + (idx + 1), '', btns); renderPick();
  }
  function pickSlot(id, s) {
    const cur = itemByUid(save, (save.equip[id] || {})[s]), first = save.items.filter(x => x.jenis === s && (!cur || x.uid !== cur.uid)).sort((a, b) => itemPower(b) - itemPower(a))[0];
    pickCtx = { id, s, sort: 'kuasa', sel: first ? first.uid : null };
    const btns = [['✔ Pasang item terpilih', () => { const u = pickCtx && pickCtx.sel; pickCtx = null; if (u == null) { toast('Pilih item dahulu', false); return; } const r = equipItem(save, u, id); afterChange(r.msg, r.ok); if (r.ok) sfx('equip'); }, 'btn']];
    if (cur) btns.push(['⚒ Tempa ' + SLOT_NAMA[s].toLowerCase() + ' (+1 level) · ' + fmt(forgeCost(cur)) + ' gold', () => { pickCtx = null; const r = forgeItem(save, cur.uid); afterChange(r.msg, r.ok); invSig = ''; }, 'btn ghost']);
    if (cur) btns.push(['Tanggal ' + SLOT_NAMA[s].toLowerCase(), () => { pickCtx = null; const r = unequipItem(save, cur.uid); afterChange(r.msg, r.ok); }, 'btn ghost']);
    btns.push(['Tutup', () => { pickCtx = null; }, 'btn ghost']);
    showModal(SLOT_NAMA[s] + ' · ' + HEROES[id].nama, '', btns); renderPick();
  }
  $('mBody').addEventListener('click', e => {
    if (!pickCtx || !e || !e.target || !e.target.closest) return;
    const so = e.target.closest('[data-sort]'); if (so) { pickCtx.sort = so.dataset.sort; renderPick(); return; }
    const t = e.target.closest('.ptile'); if (t && !t.classList.contains('cur')) { pickCtx.sel = +t.dataset.u; renderPick(); sfx('click'); }
  });


  // ---------- v7.1: grid hero + lembaran butiran ----------
  const tiles = {}; let sheetHero = null;
  function buildHeroGrid() {
    HERO_ORDER.forEach(id => {
      const d = HEROES[id], T0 = TIERS[d.tier], b = document.createElement('button'); b.className = 'htile'; b.setAttribute('aria-label', d.nama);
      b.innerHTML = '<canvas class="hp" width="128" height="128" aria-hidden="true"></canvas><span class="tb" style="background:' + T0.warna + '">' + T0.nama + '</span><span class="ti"></span><span class="hn">' + esc(d.nama) + '</span><span class="hl"></span><span class="hcp"></span><div class="heq"><canvas class="hw" aria-hidden="true"></canvas><span class="ex">' + HERO_SLOTS.map(s => '<i data-s="' + s + '"></i>').join('') + '</span></div><div class="hsh"><i></i></div>';
      b.addEventListener('click', () => openHeroSheet(id)); tiles[id] = b;
    });
  }
  function itemChip(el, it, slotName) {
    if (it) { el.classList.add('on'); el.style.background = RARITY[it.rar].warna; el.textContent = 'T' + (it.rar + 1); el.title = itemName(it); }
    else { el.classList.remove('on'); el.style.background = ''; el.textContent = ''; el.title = slotName + ' kosong'; }
  }
  const tileSig = {}, tileLv = {};
  function refreshHeroGrid() {
    if (!tiles.pistol) return;
    const team = save.team.filter(h => save.heroes[h]), own = HERO_ORDER.filter(h => save.heroes[h] && !team.includes(h)).sort((a, b) => HEROES[b].tier - HEROES[a].tier || (save.heroes[b] - save.heroes[a])), lock = HERO_ORDER.filter(h => !save.heroes[h]).sort((a, b) => ((save.shards[b] || 0) / TIERS[HEROES[b].tier].bina) - ((save.shards[a] || 0) / TIERS[HEROES[a].tier].bina));
    const place = (box, list) => { const cur = box.children ? [...box.children] : []; if (cur.length === list.length && list.every((h, i) => cur[i] === tiles[h])) return; box.innerHTML = ''; list.forEach(h => box.appendChild(tiles[h])); };
    place($('hgTeam'), team); place($('hgOwn'), own); place($('hgLock'), lock);
    if (hsId) renderSheet();
    $('hgTeamH').textContent = 'Pasukan ' + team.length + '/' + save.slots + ' · ikut susunan formasi'; $('hgOwnH').hidden = !own.length; $('hgLockH').hidden = !lock.length;
    HERO_ORDER.forEach(id => {
      const b = tiles[id], lvl = save.heroes[id], st = save.stars[id] || 0, wid = heroWeapon(save, id), eq = save.equip[id] || {}, ti = team.indexOf(id);
      const sig = wid + (lvl ? 1 : 0) + gearSig(save, id); if (tileSig[id] !== sig) { tileSig[id] = sig; const c = b.querySelector('.hp').getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 128, 128); c.scale(2, 2); drawHero(c, 32, 38, id, -Math.PI / 4, 0, 1.1, wid, { t: 0.5, phase: 0, mood: 'main', gear: gearOf(save, id), skin: heroSkin(save, id) }); paintIcon(b.querySelector('.hw'), cc => weaponIcon(cc, wid), 22); }
      b.classList.toggle('team', ti >= 0); b.classList.toggle('locked', !lvl);
      const can = heroCards[id] && heroCards[id].classList.contains && heroCards[id].classList.contains('can'); b.classList.toggle('can', !!can);
      b.querySelector('.ti').textContent = ti >= 0 ? '#' + (ti + 1) : ''; b.querySelector('.ti').hidden = ti < 0;
      if (tileLv[id] != null && lvl > tileLv[id] && b.classList) { b.classList.remove('lvup'); void b.offsetWidth; b.classList.add('lvup'); } tileLv[id] = lvl;
      b.querySelector('.hcp').textContent = lvl ? '⚡ ' + fmt(heroCP(heroStats(save, id, 0))) : ''; b.querySelector('.hcp').hidden = !lvl;
      const tr0 = lvl && !save.team.includes(id) ? (onExped(save, id) ? ' 🧭' : lvl < benchCap(save) ? ' 📈' : '') : '';
      b.querySelector('.hl').textContent = lvl ? 'Lv.' + lvl + ' · ★' + st + tr0 : 'Shard ' + (save.shards[id] || 0) + '/' + TIERS[HEROES[id].tier].bina;
      const need = lvl ? (st >= MAX_STARS ? 0 : starCost(st + 1)) : TIERS[HEROES[id].tier].bina; b.querySelector('.hsh i').style.width = (need ? Math.min(100, (save.shards[id] || 0) / need * 100) : 100) + '%';
      b.querySelector('.heq').hidden = !lvl; if (lvl) { const ex = b.querySelector('.ex'), es = HERO_SLOTS.map(s => { const it = itemByUid(save, eq[s]); return it ? it.rar : -1; }), k = es.join(); if (ex.dataset.k !== k) { ex.dataset.k = k; ex.innerHTML = es.map((r, j) => '<i class="' + (r >= 0 ? 'on' : '') + '" style="' + (r >= 0 ? 'background:' + RARITY[r].warna : '') + '" title="' + SLOT_NAMA[HERO_SLOTS[j]] + '"></i>').join(''); } }
    });
  }
  $('heroClose').addEventListener('click', () => closeHeroSheet());
  $('heroList').addEventListener('click', e => { if (e && e.target && e.target.id === 'heroList') closeHeroSheet(); });


  // ---------- v7.2: pratonton kubu ----------
  const FORT_TOP = WALL_Y - 120, SOCK_X = [90, 180, 270];
  function drawFort() {
    const cv = $('fortCv'); if (!cv || !cv.getContext) return; const c = cv.getContext('2d'), s = cv.width / W, hh = cv.height / s;
    c.setTransform(s, 0, 0, s, 0, 0); c.clearRect(0, 0, W, hh); c.save(); c.translate(0, -FORT_TOP);
    const bg = BACKGROUNDS[bgIndex(save.stage)]; drawBiome(c, bg.bi, mulberry(bgIndex(save.stage) * 977 + 13)); if (SUASANA_TINT[bg.si]) { c.fillStyle = SUASANA_TINT[bg.si]; c.fillRect(0, 0, W, H); }
    const old = ctx; ctx = c; drawWall({ wall: 1, wallMax: 1, ws: wallStats(save) });
    const team = save.team.filter(h => save.heroes[h]); team.forEach((h, i) => drawHero(c, W * (i + 1) / (team.length + 1), WALL_Y + 40, h, -Math.PI / 2, 0, 0.9, heroWeapon(save, h), { t: ANIM, phase: i, mood: 'main', gear: gearOf(save, h), skin: heroSkin(save, h) }));
    SOCK_X.forEach((x, i) => { const it = itemByUid(save, save.wallEquip[i]); c.fillStyle = it ? RARITY[it.rar].warna : 'rgba(20,26,36,.45)'; c.beginPath(); c.arc(x, WALL_Y - 4, 11, 0, TAU); c.fill(); c.strokeStyle = '#FFFFFF'; c.lineWidth = 2; if (!it) c.setLineDash([3, 3]); c.stroke(); c.setLineDash([]); label(c, it ? 'T' + (it.rar + 1) : '+', x, WALL_Y, it ? 9 : 13); });
    const xs = towerXs(save.towers.length);
    save.towers.forEach((t, i) => { if (t) drawTowerShape(c, xs[i], TOWER_Y, t.type, -Math.PI / 2 + Math.sin(ANIM + i) * 0.4, 0, t.lvl, (t.br || []).length); else { c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 2; c.setLineDash([4, 3]); rr(c, xs[i] - 15, TOWER_Y - 14, 30, 36, 6); c.stroke(); c.setLineDash([]); label(c, '+', xs[i], TOWER_Y + 10, 18); } });
    ctx = old; c.restore();
  }
  function fortClick(e) {
    const cv = $('fortCv'), r = cv.getBoundingClientRect(), s = cv.width / W, hh = cv.height / s, x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * hh + FORT_TOP;
    const xs = towerXs(save.towers.length);
    for (let i = 0; i < save.towers.length; i++) if (Math.abs(x - xs[i]) < 22 && Math.abs(y - TOWER_Y) < 30) { const el = towerCards[i]; if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (el) { el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 900); } sfx('click'); return; }
    for (let i = 0; i < 3; i++) if (Math.hypot(x - SOCK_X[i], y - (WALL_Y - 4)) < 16) { setTab('beg'); $('f_perisai').click(); sfx('click'); return; }
  }
  function refreshFort() {
    const d = defenseStats(save);
    $('fortStats').innerHTML = '<span>❤ HP berkesan <b>' + fmt(d.effHp) + '</b></span><span>🛡 Perisai <b>' + d.armor + '%</b></span><span>🏹 DPS menara <b>' + fmt(d.towerDps) + '</b></span><span>⏱ Tahan ≈ <b>' + (d.holdSec > 999 ? '999+' : Math.round(d.holdSec)) + ' s</b></span>';
    $('tower4Btn').hidden = save.towers.length >= 4 || !save.rohTotal; $('tower4Btn').textContent = '🔓 Buka slot menara ke-4 (' + TOWER4_ROH + ' Roh)';
    const nx = save.wallsOwned < WALLS.length ? save.wallsOwned : -1; $('wallNextBtn').hidden = nx < 0;
    if (nx >= 0) { const c0 = wallCost(nx); $('wallNextBtn').innerHTML = '⬆ Bina seterusnya: ' + esc(WALLS[nx].nama) + ' · ' + coin + fmt(c0); $('wallNextBtn').disabled = save.gold < c0; }
    if (!$('pane_pagar').hidden && pageOpenFlag) drawFort();
  }
  let wallScrollK = -1;


