  // ---------- v9.6: Peti Senjata, Kedai Senjata Harian, Debu ----------
  const WCH_ICON = {
    kayu: c => { iconBg(c, '#F3E3CC', '#B98A5A'); chest(c, '#B8763E', '#6E4520'); label(c, '⚔', 50, 16, 13, '#FFFFFF'); },
    emas: c => { iconBg(c, '#FFF4C0', '#E7A71E'); chest(c, '#F2C230', '#B08A20', '#FFE07A'); label(c, '⚔', 50, 16, 13, '#FFFFFF'); },
    legenda: c => { iconBg(c, '#EBDDFF', '#7A44C8'); chest(c, '#A066E8', '#4A2A80', '#E0C8FF'); c.fillStyle = '#FFFFFF'; star(c, 14, 14, 4, 5, 2, 0); label(c, '⚔', 50, 16, 13, '#FFFFFF'); }
  };
  WCH_ICON.jenis = c => { iconBg(c, '#D8F0FF', '#3A84D0'); chest(c, '#4A9AE0', '#18508E', '#BFE6FF'); label(c, '⚔', 50, 16, 13, '#FFFFFF'); label(c, '🎯', 14, 16, 11, '#FFFFFF'); };
  const WCH_FX_RAR = { kayu: 1, emas: 4, jenis: 5, legenda: 7 };
  const wshEls = {}; let wshSig = '', wpetiLast = null, wDustEl = null, wResetEl = null, wListEl = null;
  function wOddsHtml(id) {
    const c = WCHESTS[id];
    return '<div class="rates">' + W_RAR_NAMA.map((R, i) => c.odds[i] ? '<span style="--rc:' + R.warna + '"><b>' + R.ikon + ' ' + R.nama + '</b><i>' + c.odds[i] + '%</i></span>' : '').join('') + '</div>' +
      '<p class="muted rnote">' + c.shard + ' shard untuk satu senjata rawak dalam kelangkaan itu (semua senjata sama peluang) + ' + c.debu + ' 🧪 Debu.' + (c.pity ? ' <b>Jaminan:</b> jika ' + (c.pity.n - 1) + ' peti berturut-turut tiada ' + W_RAR_NAMA[c.pity.rar].nama + ' ke atas, peti ke-' + c.pity.n + ' pasti ' + W_RAR_NAMA[c.pity.rar].nama + ' ke atas.' : '') + '</p>';
  }
  function buildWpnShop() {
    const box = $('shopWpn'); box.innerHTML = '';
    const top = document.createElement('div'); top.className = 'panelbox wdust'; wDustEl = top; box.appendChild(top);
    WCHEST_ORDER.forEach(id => {
      const c = WCHESTS[id], el = document.createElement('div'); el.className = 'card shop';
      el.innerHTML = '<canvas class="ico" aria-hidden="true"></canvas><div class="info"><h3>' + esc(c.nama) + '</h3><p>' + esc(c.desc) + '.</p>' + (id === 'jenis' ? '<label class="wjsel">Jenis: <select aria-label="Jenis senjata untuk Peti Jenis">' + Object.keys(FAM).map(f => '<option value="' + f + '">' + FAM[f].ikon + ' ' + esc(FAM[f].nama) + '</option>').join('') + '</select></label>' : '') + '<p class="pity"></p></div><div class="acts"><button class="btn buy"></button>' + (id === 'emas' || id === 'jenis' ? '<button class="btn ghost x10"></button>' : '') + '</div>';
      paintIcon(el.querySelector('canvas'), WCH_ICON[id], 48);
      el.querySelector('.buy').addEventListener('click', () => openChestFx('wpn', id, 1));
      if (id === 'emas' || id === 'jenis') el.querySelector('.x10').addEventListener('click', () => openChestFx('wpn', id, 10));
      if (id === 'jenis') el.querySelector('select').addEventListener('change', e => { const r = setWJenis(save, e.target.value); persist(); wshSig = ''; afterChange(r.msg, r.ok); });
      addRateToggle(el, () => wOddsHtml(id));
      wshEls[id] = el; box.appendChild(el);
    });
    const h = document.createElement('h3'); h.className = 'sec wsec'; h.textContent = '🛒 Kedai Senjata Harian '; wResetEl = document.createElement('small'); wResetEl.className = 'muted'; h.appendChild(wResetEl); box.appendChild(h);
    const g = document.createElement('div'); g.className = 'wshop'; wListEl = g; box.appendChild(g);
    g.addEventListener('click', e => { const b = e && e.target && e.target.closest ? e.target.closest('[data-wo]') : null; if (!b) return; const had = save.weapons[save.wshop.o[+b.dataset.wo].w], r = wshopBuy(save, +b.dataset.wo, Date.now()); afterChange(r.msg, r.ok); if (r.ok && r.res && r.res.baru && !had) { openShowcase(r.res.wid, '🎉 Senjata baharu'); sfx('trophy'); } });
    const n = document.createElement('p'); n.className = 'muted iapnote'; n.textContent = '🎲 Kadar setiap peti dipaparkan pada butang ⓘ Kadar. Senjata Epik, Legenda dan Mitos hanya diperoleh melalui shard. Peti Senjata Legenda tidak dijual — hanya dari Serbuan Boss (langkah 5 & 10) dan lulus pertama stage 50, 100, 150… Setiap boss besar (stage 10, 20…) memberi 1 Peti Senjata Kayu.'; box.appendChild(n);
  }
  function wpetiWatch() {
    const P = save.wpeti; if (!P) return;
    if (wpetiLast) { if (P.leg > wpetiLast.leg) toast('🟣 +' + (P.leg - wpetiLast.leg) + ' Peti Senjata Legenda! Buka di Kedai → ⚔ Peti senjata', true); else if (P.kayu > wpetiLast.kayu) toast('🪵 +' + (P.kayu - wpetiLast.kayu) + ' Peti Senjata Kayu (hadiah boss)', true); }
    wpetiLast = { leg: P.leg, kayu: P.kayu };
  }
  function refreshWpnShop() {
    wpetiWatch();
    const now = Date.now(), P = save.wpeti, free = wFreeKayu(save, now), S = wshopEnsure(save, now);
    { const ch = $('kc_wpeti'); if (ch) ch.textContent = '⚔ Peti senjata' + (free || P.kayu || P.leg ? ' •' : ''); }
    if ($('ks_wpeti').hidden || !wDustEl) return;
    const sig = [save.gold >= wchestCost('kayu', effBest(save)) ? 1 : 0, Math.floor(save.gems / 100), P.jenis, P.pj, save.team.join(), save.debu, save.wtarget, free, P.kayu, P.leg, P.pe, P.pl, S.day, S.o.map(o => o.beli ? 1 : 0).join(''), save.gold >= S.o[0].harga, save.gems >= S.o[1].harga, save.debu >= S.o[2].harga, save.gems >= S.o[3].harga, JSON.stringify(save.wsh), JSON.stringify(save.wst), Object.keys(save.weapons).length].join('|');
    if (sig === wshSig) return; wshSig = sig;
    wDustEl.innerHTML = '<p><b>🧪 Debu Senjata: ' + fmt(save.debu || 0) + '</b></p><p class="muted">Debu didapati daripada setiap peti senjata dan shard berlebihan senjata ★5. Guna Debu untuk beli shard senjata pilihan di tab Senjata (butang 🧪).</p><p class="muted">Peti dari permainan: 🪵 Kayu ×' + P.kayu + ' · 🟣 Legenda ×' + P.leg + '</p>' + (save.wtarget && WEAPONS[save.wtarget] ? '<p><b>🎯 Sasaran: ' + esc(WEAPONS[save.wtarget].nama) + '</b> (' + W_RAR_NAMA[WEAPONS[save.wtarget].rar].nama + ') · shard ' + wShards(save, save.wtarget) + '/' + wNeed(save, save.wtarget) + '<br><span class="muted">Bila peti keluar ' + W_RAR_NAMA[WEAPONS[save.wtarget].rar].nama + ', 50% peluang shard masuk ke sasaran.</span></p>' : '<p class="muted">🎯 Tiada Senjata Sasaran. Pilih satu di tab Senjata (butang 🎯) supaya peti lebih kerap memberi shard senjata idaman.</p>');
    { const b = wshEls.kayu.querySelector('.buy'), cost = wchestCost('kayu', effBest(save)); b.innerHTML = free ? '🎁 PERCUMA' : P.kayu ? 'Buka 🪵 ×' + P.kayu : 'Buka ' + coin + fmt(cost); b.disabled = !free && !P.kayu && save.gold < cost; wshEls.kayu.querySelector('.pity').textContent = free ? '🎁 1 peti percuma hari ini' : 'Percuma lagi esok'; }
    { const el = wshEls.emas; el.querySelector('.buy').innerHTML = 'Buka ' + gem + WCHESTS.emas.harga; el.querySelector('.buy').disabled = save.gems < WCHESTS.emas.harga; el.querySelector('.x10').innerHTML = '×10 ' + gem + WCHESTS.emas.harga * 10; el.querySelector('.x10').disabled = save.gems < WCHESTS.emas.harga * 10; el.querySelector('.pity').textContent = '🎯 Legenda dijamin dalam ' + wPityLeft(save, 'emas') + ' peti lagi'; }
    { const el = wshEls.jenis, H = WCHESTS.jenis.harga, j = wJenisPick(save); el.querySelector('.buy').innerHTML = 'Buka ' + gem + H; el.querySelector('.buy').disabled = save.gems < H; el.querySelector('.x10').innerHTML = '×10 ' + gem + H * 10; el.querySelector('.x10').disabled = save.gems < H * 10; const sl = el.querySelector('select'); if (sl.value !== j) sl.value = j; el.querySelector('.pity').textContent = '🎯 ' + FAM[j].ikon + ' ' + FAM[j].nama + ' · Legenda dijamin dalam ' + wPityLeft(save, 'jenis') + ' peti lagi'; }
    { const el = wshEls.legenda; el.querySelector('.buy').innerHTML = P.leg ? 'Buka (×' + P.leg + ')' : 'Tiada peti'; el.querySelector('.buy').disabled = !P.leg; el.querySelector('.pity').textContent = '🎯 Mitos dijamin dalam ' + wPityLeft(save, 'legenda') + ' peti lagi'; }
    { const ms = new Date(now); ms.setHours(24, 0, 0, 0); const left = Math.max(0, ms - now), hh = Math.floor(left / 3600000), mm = Math.floor(left / 60000) % 60; wResetEl.textContent = '· bertukar dalam ' + hh + 'j ' + mm + 'm'; }
    wListEl.innerHTML = S.o.map((o, i) => { const w = WEAPONS[o.w], R = W_RAR_NAMA[w.rar], own = save.weapons[o.w], k = o.mata, have = save[k] || 0, mx = own && wStars(save, o.w) >= W_STAR_MAX;
      return '<div class="card shop wso" style="--rc:' + R.warna + '"><canvas class="ico" data-wi="' + o.w + '" aria-hidden="true"></canvas><div class="info"><h3>' + esc(w.nama) + ' <span class="wtg" style="border-color:' + R.warna + '">' + R.ikon + ' ' + R.nama + '</span></h3><p>+' + o.n + ' shard · ' + (own ? 'dimiliki ★' + wStars(save, o.w) : 'belum dimiliki') + '</p><p class="muted">Shard ' + wShards(save, o.w) + '/' + (wNeed(save, o.w) || '—') + '</p></div><button class="btn buy' + (k === 'gems' ? ' gemb' : '') + '" data-wo="' + i + '"' + (o.beli || mx || have < o.harga ? ' disabled' : '') + '>' + (o.beli ? '✔ Dibeli' : (k === 'gold' ? coin : k === 'gems' ? gem : '🧪') + fmt(o.harga)) + '</button></div>'; }).join('');
    ((wListEl.querySelectorAll && wListEl.querySelectorAll('canvas[data-wi]')) || []).forEach(cv => paintIcon(cv, c => weaponIcon(c, cv.dataset.wi, save.weapons[cv.dataset.wi] || 1), 48));
  }
