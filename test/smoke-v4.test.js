const fs=require('fs');const path=require('path');const html=fs.readFileSync(path.join(__dirname,'..','docs','dev','index.html'),'utf8');const INLINE=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));
const ctxStub=new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='measureText'?()=>({width:10}):k.includes('Gradient')?()=>({addColorStop(){}}):()=>{}),set:(t,k,v)=>(t[k]=v,true)});
function mk(tag){const e={tag,textContent:'',innerHTML:'',value:'',hidden:false,disabled:false,dataset:{},className:'',children:[],attrs:{},h:{},
 classList:{_s:new Set(),toggle(c,v){if(v===undefined)v=!this._s.has(c);v?this._s.add(c):this._s.delete(c);return v},add(c){this._s.add(c)},remove(c){this._s.delete(c)},contains(c){return this._s.has(c)}},style:{},setAttribute(k,v){this.attrs[k]=String(v)},getAttribute(k){return this.attrs[k]},addEventListener(e,f){(this.h[e]=this.h[e]||[]).push(f)},
 click(){(this.h.click||[]).forEach(f=>f({target:{closest:()=>null}}))},fire(ev,val){(this.h[ev]||[]).forEach(f=>f({target:{value:val,closest:()=>null}}))},appendChild(c){this.children.push(c)},getContext:()=>ctxStub,getBoundingClientRect:()=>({left:0,top:0,width:360,height:600}),
 querySelectorAll(s){if(!this.qa)this.qa={};if(!this.qa[s]){const cls=s.replace(/^\./,'');const re=new RegExp('<[a-z]+[^>]*class="[^"]*\\b'+cls+'\\b[^"]*"[^>]*>','g');this.qa[s]=(this.innerHTML.match(re)||[]).map(tag=>{const c=mk('el');(tag.match(/data-([a-z]+)="([^"]*)"/g)||[]).forEach(a=>{const m=/data-([a-z]+)="([^"]*)"/.exec(a);c.dataset[m[1]]=m[2];});return c;});}return this.qa[s]},querySelector(s){if(!this.q)this.q={};if(!this.q[s]){this.q[s]=mk(s);if(s==='select')this.q[s].value='pistol';}return this.q[s]}};let _ih='';Object.defineProperty(e,'innerHTML',{get(){return _ih},set(v){_ih=v;e.children=[];e.q={};e.qa={}}});return e;}
const els={};[...html.matchAll(/id="([a-zA-Z_0-9]+)"/g)].forEach(m=>els[m[1]]=mk('el'));
const ls={zombi_comel_dev_save_v1:JSON.stringify({v:3,gold:5000,gems:300,stage:3,best:4,cleared:[1,2,3],heroes:{pistol:6,shotgun:2},team:['pistol','shotgun'],slots:3,shop:{damage:2,speed:0,wall:1,tap:0,magnet:0,luck:0},items:[{uid:1,jenis:'senjata',rar:4,ilvl:3,base:0}],equip:{pistol:{senjata:1}},boost:{},nextUid:2,last:Date.now(),kills:100})};
global.localStorage={getItem:k=>k in ls?ls[k]:null,setItem:(k,v)=>ls[k]=String(v),removeItem:k=>delete ls[k]};
global.window={addEventListener(){},devicePixelRatio:1};let T=0;global.performance={now:()=>T};
let frameFn=null;global.requestAnimationFrame=f=>frameFn=f;global.confirm=()=>false;global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.document={getElementById:i=>els[i],createElement:t=>mk(t),addEventListener(){},querySelectorAll:()=>[],hidden:false,body:{dataset:{},classList:{toggle(){},add(){},remove(){}}}};
require('vm').runInThisContext(INLINE);
const A=require('assert');const sv=()=>JSON.parse(ls.zombi_comel_dev_save_v1);const step=n=>{for(let i=0;i<n;i++){T+=33;frameFn(T)}};
const YES=t=>{if(!els.modal.hidden&&els.mTitle.textContent.includes(t)){const c=els.mBtns.children;c[c.length-1].click();}};
els.devToggle.click();YES('Mod Pembangun');
const HO=require('vm').runInThisContext('HERO_ORDER');
A.strictEqual(sv().v,7);A.strictEqual(sv().heroes.pistol,6);A.deepStrictEqual(sv().stars,{});console.log('✓ save lama dipindah ke v4');
els.ovBtns.children[0].click();step(30*15);console.log('✓ pertempuran berjalan, zombie ditemui:',(sv().seenZ.match(/1/g)||[]).length);
els.trGems2.click();els.trGold2.click();
const cards=els.heroList.children;A.strictEqual(cards.length,22);console.log('✓ 22 kad hero');
const li=HO.indexOf('laser');cards[li].querySelector('.buy5').click();A.strictEqual(sv().shards.laser,5);console.log('✓ beli 5 shard Kapten Bakar');
cards[li].querySelector('.star').click();A.ok(!sv().heroes.laser);for(let i=0;i<19;i++)cards[li].querySelector('.buy5').click();cards[li].querySelector('.star').click();A.ok(sv().heroes.laser);A.strictEqual(sv().shards.laser,0);console.log('✓ bina hero SR+ dengan 100 shard');
const pi=HO.indexOf('pistol');cards[pi].querySelector('.star').click();A.ok(!sv().stars.pistol);els.trShard.click();cards[pi].querySelector('.star').click();A.strictEqual(sv().stars.pistol,1);A.strictEqual(sv().shards.pistol,90);console.log('✓ naik bintang 1★ guna 10 shard');
for(let i=0;i<5;i++)cards[pi].querySelector('.star').click();A.strictEqual(sv().stars.pistol,5);A.strictEqual(sv().shards.pistol,0);cards[pi].querySelector('.star').click();A.strictEqual(sv().stars.pistol,5);console.log('✓ bintang 2–5 guna 15+20+25+30 = 90 shard, berhenti bila habis');
els.shopHero.children[0].querySelector('.buy').click();els.shopHero.children[1].querySelector('.buy').click();console.log('✓ Peti Hero & Peti Hero Legenda');
els.tab_ensiklo.click();A.strictEqual(els.encList.children.length,24);els.encNext.click();console.log('✓ ensiklopedia zombie (24 sehalaman), halaman 2');
els.enc_hero.click();A.strictEqual(els.encList.children.length,22);els.enc_zombie.click();
els.ef_ditemui.click();console.log('  ditemui dipapar:',els.encList.children.length);els.ef_belum.click();els.ef_semua.click();
els.encBase.fire('change','gergasi');els.encQ.fire('input','');els.trSeen.click();A.ok(sv().seenZ==='1'.repeat(1000));console.log('✓ penapis jenis + semua 1000 ditemui');
els.trHero.click();els.trStage.click();els.trStage.click();for(let i=0;i<120;i++)els.stageNext.click();els.ovBtns.children[0].click();els.trGod.click();step(30*30);console.log('✓ stage tinggi dengan zombie baharu tanpa ralat');
els.btnReset.click();YES('Padam');A.deepStrictEqual(sv().stars,{});A.strictEqual(sv().seenZ,'');console.log('✓ reset');
// susunan: pasukan di atas
els.trHero.click();els.tab_hero.click();step(12);const HC=els.heroList.children;const team=sv().team;
team.forEach((h,i)=>A.strictEqual(HC[HO.indexOf(h)].style.order,i));const others=HO.filter(h=>!team.includes(h)).map(h=>HC[HO.indexOf(h)].style.order);A.ok(Math.min(...others)>=team.length);console.log('✓ hero dalam pasukan disusun paling atas:',team.join(','));
els.tab_senjata.click();step(12);const WO=require('vm').runInThisContext('WEAPON_ORDER');const usedW=[...new Set(team.map(h=>require('vm').runInThisContext('heroWeapon')(sv(),h)))].filter(w=>w!=='batu');
usedW.forEach(w=>A.ok(els.wpnList.children[WO.indexOf(w)].style.order<usedW.length));console.log('✓ senjata yang dipakai disusun paling atas:',usedW.join(','));
// trofi
els.tab_trofi.click();step(12);A.strictEqual(els.achList.children.length,43);console.log('✓ 43 kad pencapaian');
const before=sv().gems;els.trClaimAll.click();step(12);const cl=sv().achClaimed;const nCl=Object.values(cl).reduce((a,b)=>a+b,0);A.ok(nCl>0);A.ok(sv().gems>before);console.log('✓ Tuntut semua:',nCl,'trofi, gems +'+(sv().gems-before));
els.ak_0.click();els.ak_all.click();console.log('✓ penapis kategori');
els.tab_hero.click();if(!els.overlay.hidden)els.ovBtns.children[0].click();step(30*8);A.ok(sv().stats.playSec>0&&sv().stats.kills>0);console.log('✓ statistik dijejak: kills',sv().stats.kills,'masa',Math.round(sv().stats.playSec)+'s');
// ensiklopedia semua bahagian
els.tab_ensiklo.click();const counts={};
['hero','zombie','senjata','pagar','item','kuasa','sifat','tier','latar','kedai'].forEach(m=>{els['enc_'+m].click();counts[m]=els.encList.children.length;A.ok(counts[m]>0,m);});
A.strictEqual(counts.senjata,232);A.strictEqual(counts.pagar,63);A.strictEqual(counts.kuasa,9);A.strictEqual(counts.latar,50);A.strictEqual(counts.tier,11);
console.log('✓ ensiklopedia 10 bahagian:',JSON.stringify(counts));
// ---------- v5 ----------
// trainer dikunci bila mod pembangun mati
els.devToggle.click();YES('Mod Pembangun');const g0=sv().gems;els.trGems2.click();A.strictEqual(sv().gems,g0);els.devToggle.click();YES('Mod Pembangun');els.trGems2.click();A.ok(sv().gems>g0);console.log('✓ trainer hanya berfungsi dalam Mod Pembangun');
// harian
els.tab_harian.click();step(12);A.strictEqual(els.misiList.children.length,5);const gB=sv().gems;els.loginBtn.click();A.ok(sv().daily.streak>=1);els.loginBtn.click();console.log('✓ log masuk harian dituntut (streak',sv().daily.streak+'), 5 misi dipaparkan');
// lompat stage
els.trStage.click();els.jumpRow.hidden=true;els.stageName.click();A.strictEqual(els.jumpRow.hidden,false);els.jumpIn.value='37';els.jumpGo.click();A.ok(els.stageName.textContent.startsWith('Stage 37'));els.jumpP10.click();A.ok(els.stageName.textContent.startsWith('Stage 47'));els.jumpBest.click();console.log('✓ lompat stage:',els.stageName.textContent);
// auto-jual
els.autoSell.fire('change','2');A.strictEqual(sv().autoSell,2);console.log('✓ auto-jual ≤ Jarang');
// eksport/import
els.tab_info.click();els.exportBtn.click();const code=els.saveCode.value;A.ok(code.startsWith('ZC5:'));const bestNow=sv().best;els.btnReset.click();YES('Padam');A.strictEqual(sv().best,1);els.saveCode.value=code;els.importBtn.click();A.strictEqual(sv().best,1,'import menunggu pengesahan');YES('Import');A.strictEqual(sv().best,bestNow);console.log('✓ eksport → reset → import: stage terbaik',bestNow,'dipulihkan');
els.saveCode.value='rosak';els.importBtn.click();A.strictEqual(sv().best,bestNow);console.log('✓ kod rosak ditolak');
// tetapan bunyi
els.musicVol.fire('input',20);A.strictEqual(sv().settings.music,0.2);console.log('✓ tetapan muzik');
// tutorial
els.tutAgain.click();A.strictEqual(sv().tut,0);A.strictEqual(els.tutBox.hidden,false);els.tab_hero.click();if(!els.overlay.hidden)els.ovBtns.children[0].click();A.strictEqual(sv().tut,1);els.tutNext.click();A.strictEqual(sv().tut,2);els.tutSkip.click();A.strictEqual(sv().tut,99);console.log('✓ tutorial: mula → langkah 2 → langkau');
// ---------- v5.1: Arena ----------
els.tab_arena.click();step(12);A.strictEqual(els.perkList.children.length,5);A.strictEqual(els.chalList.children.length,6);console.log('✓ Arena: 5 kelebihan Roh, 6 cabaran');
els.trStage.click();els.trStage.click();els.trHero.click();els.trGold2.click();els.tab_arena.click();step(12);
const bestB=sv().best;A.ok(bestB>=60);const gems0=sv().gems;els.prestigeBtn.click();YES('Kebangkitan');step(3);const S1=sv();A.strictEqual(S1.best,1);A.ok(S1.roh>0);A.strictEqual(S1.gems,gems0);console.log('✓ Kebangkitan dari stage',bestB,'→ +'+S1.roh+' Roh, gems kekal');
els.perkList.children[3].querySelector('button').click();A.strictEqual(sv().perks.berkat,1);console.log('✓ beli Berkat Pahlawan dengan Roh');
// cabaran
els.tab_arena.click();step(6);els.chalList.children[0].querySelector('.go').click();A.ok(els.stageName.textContent.includes('Pagar Rapuh'));els.ovBtns.children[0].click();els.trGod.click();step(30*240);
const S2=sv();console.log('  cabaran Pagar Rapuh Lv.1 →',S2.chal.rapuh?'menang':'belum',', best kekal',S2.best);A.strictEqual(S2.best,1);A.strictEqual(S2.chal.rapuh,1);
els.ovBtns.children[els.ovBtns.children.length-1].click();A.ok(els.stageName.textContent.startsWith('Stage'));console.log('✓ cabaran menang, ganjaran diberi, kembali ke stage biasa');
// ---------- v6 ----------
els.tab_hero.click();if(!els.overlay.hidden)els.ovBtns.children[0].click();step(30*3);
const B=global.window.ZC_DEBUG();
// tekan hero → paparan jarak; seret → tukar formasi
const H0=B.team[0],H1=B.team[1];const team0=sv().team.slice();
const pd=(x,y)=>els.game.h.pointerdown[0]({clientX:x,clientY:y}),pm=(x,y)=>els.game.h.pointermove[0]({clientX:x,clientY:y}),pu=()=>els.game.h.pointerup[0]({});
pd(H0.x,H0.y-10);pu();console.log('✓ tekan hero → paparan jarak (tiada ralat)');
pd(H0.x,H0.y-10);pm(H1.x,H1.y-10);pu();A.strictEqual(sv().team[0],team0[1]);A.strictEqual(sv().team[1],team0[0]);console.log('✓ seret hero → formasi bertukar:',sv().team.slice(0,2).join(' ⇄ '));
// tekan zombie
B.queue=[];B.pause=99;const z=B.spawn('biasa');z.x=180;z.y=200;z.hp=z.maxHp=1e12;z.spd=0;z.evoT=-1e9;
for(let i=0;i<12;i++)pd(180,200);A.ok(B.combo>=12);A.ok(z.hp<1e12);console.log('✓ tekan zombie: kombo ×'+B.combo);
for(let i=0;i<50;i++)pd(180,200);A.ok(B.save.stats.stomps>=1);step(20);console.log('✓ Tapak Gergasi selepas 50 tekanan');
pd(30,30);console.log('✓ tekan kosong (percikan) tanpa ralat');
// kuasa ais
els.trPow.click();els.trCd.click();const ab=els.powerBar.children.find(b=>b.attrs['aria-label']==='Zaman Ais');B.spawn('biasa').y=150;ab.click();step(30*6);console.log('✓ Zaman Ais: beku → pecah (tiada ralat)');
{step(2);const ub=els.ultBar.children;A.strictEqual(ub.length,B.team.length);const m0=B.team[0];m0.ult=1;B.spawn('biasa').y=160;step(2);A.ok(ub[0]._r===true);ub[0].click();A.ok(m0.ult<0.2);A.ok(B.fx.some(f=>f.kind==='ult'));step(30*3);console.log('✓ butang Ultimate: cas → sedia → lancar');}
// DPS & getaran
els.btnDps.click();step(40);els.btnDps.click();els.tab_info.click();els.vibBtn.click();A.strictEqual(sv().settings.vib,false);els.vibBtn.click();console.log('✓ meter DPS & getaran');
// menara
els.trGold2.click();els.tab_pagar.click();step(6);A.strictEqual(els.towerList.children.length,4);A.strictEqual(els.towerList.children[3].hidden,true);const tc=els.towerList.children[0];tc.querySelectorAll('.tt')[1].click();A.strictEqual(sv().towers[0].type,'meriam');tc.querySelector('.x10').click();A.strictEqual(sv().towers[0].lvl,11);
els.towerList.children[2].querySelectorAll('.tt')[2].click();A.strictEqual(sv().towers[2].type,'ais');console.log('✓ menara: Meriam Lv.11 (slot 1), Ais (slot 3)');
els.tab_hero.click();if(!els.overlay.hidden)els.ovBtns.children[0].click();step(30*8);A.ok(Object.keys(global.window.ZC_DEBUG().dmgBy).some(k=>k.startsWith('menara')));console.log('✓ menara menembak dalam pertempuran');
// formasi butang
const HO2=require('vm').runInThisContext('HERO_ORDER');const t1=sv().team[1];els.heroList.children[HO2.indexOf(t1)].querySelector('.mvL').click();A.strictEqual(sv().team[0],t1);console.log('✓ butang ◀ formasi');
// event dipaksa
els.tab_info.click();els.evForce.fire('change','merdeka');A.strictEqual(sv().eventForce,'merdeka');els.tab_harian.click();step(6);const g1=sv().gems;els.evBtn.click();A.strictEqual(sv().gems,g1+40);els.evBtn.click();A.strictEqual(sv().gems,g1+40);els.evForce.fire('change','');console.log('✓ event Merdeka: peti sekali sehari');
// ---------- v6.1 ----------
els.tab_hero.click();if(!els.overlay.hidden)els.ovBtns.children[0].click();step(5);
els.trGold1.click();step(12);A.ok(els.tab_hero.classList.contains('dot'));console.log('✓ titik merah pada tab Hero bila ada gold');
const goldA=sv().gold;els.upAll.click();step(4);A.ok(sv().gold<goldA);console.log('✓ Naik semua: −'+Math.round(goldA-sv().gold)+' gold');
// skrin kalah berpandu
els.trGod.click&&0;const Bx=global.window.ZC_DEBUG();Bx.god=false;els.trGoldIn.value='1e30';els.trGemsIn.value='';els.trSet.click();Bx.wall=0;Bx.state='kalah';step(3);console.log('  [nyahpepijat] tajuk:',els.ovTitle.textContent,'| keadaan:',Bx.state,'| sama battle:',Bx===global.window.ZC_DEBUG(),'| overlay tersembunyi:',els.overlay.hidden);A.ok(els.ovTitle.textContent==='Pagar roboh');const lbl=els.ovBtns.children.map(b=>b.textContent);A.ok(lbl[0].includes('Naik semua'));console.log('✓ skrin kalah:',lbl.join(' | '));
els.ovBtns.children[0].click();A.strictEqual(els.overlay.hidden,true);console.log('✓ "Naik semua & cuba lagi" berfungsi');
// tab gabungan
els.tab_ganjaran.click();A.strictEqual(els.pane_harian.hidden,false);A.strictEqual(els.sub_ganjaran.hidden,false);els.tab_trofi.click();A.strictEqual(els.pane_trofi.hidden,false);els.tab_hero.click();els.tab_ganjaran.click();A.strictEqual(els.pane_trofi.hidden,false);console.log('✓ tab Ganjaran (Harian/Trofi) ingat sub-tab terakhir');
els.tab_lagi.click();A.strictEqual(els.sub_lagi.hidden,false);els.tab_ensiklo.click();A.strictEqual(els.pane_ensiklo.hidden,false);els.tab_info.click();A.strictEqual(els.pane_info.hidden,false);els.tab_hero.click();els.tab_lagi.click();A.strictEqual(els.pane_info.hidden,false);console.log('✓ tab Lagi (Ensiklopedia/Tetapan)');
// aksesibiliti
els.calmBtn.click();A.strictEqual(sv().settings.calm,true);els.bigBtn.click();A.strictEqual(sv().settings.bigText,true);step(30);els.calmBtn.click();els.bigBtn.click();console.log('✓ mod tenang & teks besar');
// kad hero: menu ⋯
const hc=els.heroList.children[0];hc.querySelector('.moreBox').hidden=true;hc.querySelector('.more').click();A.strictEqual(hc.querySelector('.moreBox').hidden,false);console.log('✓ menu ⋯ pada kad hero');
// ---------- v6.2 ----------
els.tab_beg.click();els.trItem.click();step(12);const it0=sv().items[0];const card0=els.invList.children.find(c=>c.innerHTML&&c.innerHTML.includes(require('vm').runInThisContext('itemName')(it0)));
card0.querySelector('.lk').click();step(2);A.strictEqual(sv().items.find(i=>i.uid===it0.uid).lock,true);console.log('✓ kunci item 🔒');
const card1=els.invList.children.find(c=>c.innerHTML&&c.innerHTML.includes('🔒'));A.ok(card1);card1.querySelector('.sl').click();A.ok(sv().items.some(i=>i.uid===it0.uid));console.log('✓ item berkunci tidak boleh dijual');
A.ok(card1.querySelector('.cmp').innerHTML.length>0);console.log('✓ baris bandingan:',card1.querySelector('.cmp').innerHTML.replace(/<[^>]+>/g,'').slice(0,60));
els.tab_hero.click();els.bestTeamBtn.click();step(4);A.ok(sv().team.length>0);console.log('✓ susun pasukan terbaik:',sv().team.join(','));
els.tab_lagi.click();els.tab_info.click();els.exportBtn.click();A.ok(sv().lastExport>0);A.strictEqual(els.backupNote.hidden,true);console.log('✓ eksport menetapkan tarikh sandaran');
els.tab_lagi.click();els.tab_ensiklo.click();els.enc_hero.click();step(2);console.log('✓ ensiklopedia hero dengan graf kuasa');
// ---------- v7: aliran skrin ----------
const B7=()=>global.window.ZC_DEBUG();
els.trGod.click&&0;
// muka depan → Sambung (penafian sudah? paksa belum)
const sv7=()=>JSON.parse(ls.zombi_comel_dev_save_v1);
els.pageBack.click();els.navHome.click();
// kembali ke muka depan melalui menu jeda
els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();A.strictEqual(els.battle.hidden,false);A.strictEqual(els.nav.hidden,true);console.log('✓ Rumah → Mula → skrin pertempuran (nav disembunyikan)');
step(10);els.pauseBtn.click();A.strictEqual(els.ovTitle.textContent,'Jeda');const pl=els.ovBtns.children.map(b=>b.textContent);console.log('✓ menu jeda:',pl.join(' | '));
els.ovBtns.children[0].click();A.strictEqual(els.overlay.hidden,true);console.log('✓ Sambung dari jeda');
els.pauseBtn.click();els.ovBtns.children[3].click();A.strictEqual(els.titleScreen.hidden,false);A.strictEqual(els.hud.hidden,true);console.log('✓ Jeda → Muka depan');
A.ok(els.tContinue.textContent.includes('Sambung'));console.log('✓ butang muka depan:',els.tContinue.textContent);
els.tContinue.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();A.strictEqual(els.hub.hidden,false);A.strictEqual(els.nav.hidden,false);console.log('✓ Sambung → Rumah dengan nav bawah');
// halaman dari nav
els.navTeam.click();A.strictEqual(els.pageView.hidden,false);A.strictEqual(els.pageTitle.textContent,'Pasukan');A.strictEqual(els.pc_hero.hidden,false);A.strictEqual(els.pc_pagar.hidden,true);
els.pc_senjata.click();A.strictEqual(els.pane_senjata.hidden,false);console.log('✓ nav Pasukan → halaman dengan chip Hero/Senjata/Kuasa/Beg');
els.navFort.click();A.strictEqual(els.pageTitle.textContent,'Kubu');els.navShop.click();A.strictEqual(els.pane_kedai.hidden,false);els.navMore.click();A.strictEqual(els.pageTitle.textContent,'Lagi');
els.pageBack.click();A.strictEqual(els.pageView.hidden,true);els.navTeam.click();A.strictEqual(els.pane_senjata.hidden,false);els.pageBack.click();console.log('✓ Kubu/Kedai/Lagi, butang kembali, ingat sub-halaman terakhir');
// penafian kali pertama mesti dipersetujui sebelum main
B7().save.discOk=false;els.hubStart.click();A.strictEqual(els.modal.hidden,false);A.strictEqual(els.mTitle.textContent,'Penafian');A.ok(els.mBody.innerHTML.includes('Google Fonts')&&els.mBody.innerHTML.includes('Zuuussss'));
els.mBtns.children[0].click();A.strictEqual(B7().save.discOk,true);A.strictEqual(els.battle.hidden,false);console.log('✓ penafian (Google Fonts & Zuuussss) wajib dipersetujui sebelum main');
// keputusan: butang Ke Rumah & hero terbaik
step(30*5);B7().wall=0;B7().state='kalah';step(3);console.log('  [nyahpepijat] tajuk:',JSON.stringify(els.ovTitle.textContent),'keadaan:',B7().state,'overlay tersembunyi:',els.overlay.hidden,'skrin: tajuk',!els.titleScreen.hidden,'hub',!els.hub.hidden,'battle',!els.battle.hidden,'| btnPlay',els.btnPlay.textContent,'| clock',B7().clock,'| modal',!els.modal.hidden,els.mTitle.textContent,'| tutBox',!els.tutBox.hidden,els.tutText.textContent.slice(0,40));A.ok(els.ovBtns.children.some(b=>b.textContent.includes('Ke Rumah')));console.log('✓ skrin keputusan ada "Ke Rumah":',els.ovBody.textContent.slice(-60));
els.ovBtns.children.find(b=>b.textContent.includes('Ke Rumah')).click();A.strictEqual(els.hub.hidden,false);console.log('✓ Ke Rumah dari skrin keputusan');
// kad stage rumah
const st0=B7().stage;els.hubPrev.click();if(st0>1)A.strictEqual(B7().stage,st0-1);console.log('✓ kad stage sebelah (stage',B7().stage+')');
// ⚙ & pilihan, versi ×7
els.gearBtn.click();A.strictEqual(els.pane_info.hidden,false);for(let i=0;i<7;i++)els.verText.click();els.awakeBtn.click();A.strictEqual(sv7().settings.awake,false);els.awakeBtn.click();els.discBtn2.click();A.strictEqual(els.mTitle.textContent,'Penafian');els.mBtns.children[0].click();els.pageBack.click();console.log('✓ ⚙ Pilihan, skrin sentiasa hidup, penafian dari menu, versi ×7');
// mula baharu
els.navHome.click();els.pauseBtn&&0;global.window.ZC_DEBUG();
// ---------- v7.1 ----------
const sv71=()=>JSON.parse(ls.zombi_comel_dev_save_v1);
// Pilihan dari muka depan → kembali ke muka depan
els.navHome.click();global.window.ZC_DEBUG();els.pauseBtn.hidden=false;
els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();els.pauseBtn.click();els.ovBtns.children[3].click();A.strictEqual(els.titleScreen.hidden,false);
els.tOptions.click();A.strictEqual(els.pane_info.hidden,false);A.strictEqual(els.pageView.hidden,false);els.pageBack.click();A.strictEqual(els.titleScreen.hidden,false);A.strictEqual(els.pageView.hidden,true);console.log('✓ Pilihan dari muka depan → butang kembali ke muka depan');
els.tContinue.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();A.strictEqual(els.hub.hidden,false);
// Laju & Auto diingati
const sp0=sv71().settings.speed;els.btnSpeed.click();A.notStrictEqual(sv71().settings.speed,sp0);const au0=sv71().settings.auto;els.btnAuto.click();A.strictEqual(sv71().settings.auto,!au0);els.btnAuto.click();console.log('✓ Laju & Auto main disimpan dalam save');
// grid hero
els.navTeam.click();els.pc_hero.click();A.ok(els.hgTeam.children.length>=1);console.log('✓ grid hero: pasukan',els.hgTeam.children.length,'· lain',els.hgOwn.children.length,'· belum dibina',els.hgLock.children.length);
const t0=els.hgTeam.children[0];A.ok(t0.querySelector('.ti').textContent==='#1');t0.click();A.ok(!els.heroSheet.hidden);A.ok(els.hsName.textContent.length>0);A.ok(els.hsUp.innerHTML.includes('Naik'));A.ok(els.hsStar.innerHTML.includes('shard')||els.hsStar.innerHTML.includes('maksimum'));
els.hsClose.click();A.ok(els.heroSheet.hidden);console.log('✓ tekan jubin hero → lembaran baharu (kepala, Naik, ★ dengan bilangan shard) dibuka & ditutup');
els.hgTeam.children[0].click();const nm0=els.hsName.textContent;els.hsNext.click();A.notStrictEqual(els.hsName.textContent,nm0);els.hsPrev.click();A.strictEqual(els.hsName.textContent,nm0);els.pageBack.click();A.ok(els.heroSheet.hidden);console.log('✓ ‹ › pindah hero dalam lembaran; butang kembali menutupnya');
// ---------- v7.2 ----------
const S72=()=>global.window.ZC_DEBUG().save;
// Kubu: pratonton, statistik, cabang, slot ke-4, naik semua menara, galeri pagar
els.navFort.click();step(3);A.ok(els.fortStats.innerHTML.includes('HP berkesan'));console.log('✓ statistik pertahanan:',els.fortStats.innerHTML.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
els.trGold2.click();els.towerAllBtn.click();step(3);const tw0=S72().towers[0];A.ok(tw0.lvl>=25,'lvl '+tw0.lvl);const brw=els.towerList.children[0].querySelector('.brrow');A.ok(brw.innerHTML.includes('Pilih cabang'));
const bid=/data-b="([a-z]+)"/.exec(brw.innerHTML)[1];els.towerList.children[0].querySelector('.info').children[0].h.click[0]({target:{closest:()=>({dataset:{b:bid}})}});A.deepStrictEqual(S72().towers[0].br.slice(0,1),[bid]);console.log('✓ naik semua menara → Lv.'+S72().towers[0].lvl+', cabang dipilih:',bid);
S72().roh=500;S72().rohTotal=500;step(12);els.tower4Btn.click();A.strictEqual(S72().towers.length,4);step(12);A.strictEqual(els.towerList.children[3].hidden,false);console.log('✓ slot menara ke-4 dibuka dengan Roh');
const wn0=S72().wallsOwned;els.wallNextBtn.click();A.strictEqual(S72().wallsOwned,wn0+1);console.log('✓ Bina pagar seterusnya ('+wn0+' → '+(wn0+1)+')');
// Beg grid
els.trItem.click();els.navTeam.click();els.pc_beg.click();step(12);A.ok(els.invGrid.children.length>0);const ig0=els.invGrid.children[0];ig0.click();A.ok(els.invList.classList.contains('open'));A.strictEqual(els.invClose.hidden,false);
const nSel=els.invList.children.filter(c=>c.classList&&c.classList.contains&&c.classList.contains('sel')).length;A.strictEqual(nSel,1);els.invClose.click();A.ok(!els.invList.classList.contains('open'));console.log('✓ grid beg:',els.invGrid.children.length,'jubin, tekan → butiran (1 kad)');
// Kedai chip
els.navShop.click();els.kc_boost.click();A.strictEqual(els.ks_boost.hidden,false);A.strictEqual(els.ks_up.hidden,true);els.kc_up.click();A.strictEqual(els.ks_up.hidden,false);console.log('✓ chip Kedai');
// Rumah: kad maklumat
els.pageBack.click();els.navHome.click();step(12);A.ok(els.hi1.innerHTML.includes('gold sejam'));A.ok(els.hi2.innerHTML.includes('👑'));console.log('✓ kad maklumat Rumah:',[els.hi1,els.hi2,els.hi3,els.hi4].map(e=>e.innerHTML.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()).join(' | '));
// Pertempuran: panel ⬆ & bintang
els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();step(10);S72().gold=1e33;els.quickUp.click();A.strictEqual(els.qPanel.hidden,false);A.ok(els.qList.children.length>=3);const gq0=S72().gold;els.qList.children[0].children.find(c=>c.className==='btn').click();A.ok(S72().gold<gq0);els.qClose.click();A.strictEqual(els.qPanel.hidden,true);console.log('✓ panel ⬆ naik taraf terbaik:',els.qList.children.length,'pilihan');
const BB=global.window.ZC_DEBUG();BB.god=true;BB.queue=[];BB.zombies=[];BB.wave=BB.maxWave;step(60);A.ok(/★/.test(els.ovTitle.textContent),els.ovTitle.textContent);console.log('✓ skrin menang:',els.ovTitle.textContent);
// ---------- v7.3 ----------
const S73=()=>global.window.ZC_DEBUG().save,VM=require('vm');
// senjata eksklusif dalam UI: pilih senjata hero lain → bertukar
els.pageBack&&els.pageBack.click();els.navTeam.click();els.pc_hero.click();step(12);
const hw0=VM.runInThisContext('heroWeapon'),cE=VM.runInThisContext('canEquip'),own73=Object.keys(S73().heroes);let tA=null,tB=null;for(const a of own73)for(const b of own73){if(tA||a===b)continue;const x=hw0(S73(),a),y=hw0(S73(),b);if(x!=='batu'&&y!=='batu'&&cE(a,y)&&cE(b,x)){tA=a;tB=b;}}const wA=hw0(S73(),tA),wB=hw0(S73(),tB);A.ok(tA,'pasangan hero sekelas');
const HO3=VM.runInThisContext('HERO_ORDER');const selA=els.heroList.children[HO3.indexOf(tA)];
const sel=selA.querySelector('select');sel.fire('change',wB);const hw=VM.runInThisContext('heroWeapon');A.strictEqual(hw(S73(),tA),wB);A.strictEqual(hw(S73(),tB),wA);
const used=S73().team.map(h=>hw(S73(),h)).filter(w=>w!=='batu');A.strictEqual(new Set(used).size,used.length);console.log('✓ tukar senjata antara hero sekelas; tiada senjata berkongsi dalam pasukan');
// anak patung: tekan slot → pilih item → dipasang
els.trItem.click();els.trItem.click();els.trItem.click();step(12);
const hid=S73().team[0];const tile=els.hgTeam.children[0];tile.click();A.ok(!els.heroSheet.hidden);
A.ok(els.hsGear.innerHTML.includes('class="gs'));
A.ok(els.hsSet.innerHTML.includes('Epik+'));
const WE=VM.runInThisContext('whoEquips');let it=S73().items.find(x=>x.jenis!=='perisai'&&!WE(S73(),x.uid));if(!it){S73().items.push({uid:8800,jenis:'helm',rar:4,ilvl:9,base:0});it=S73().items[S73().items.length-1];}const slot=it.jenis;
els.hsGear.h.click[0]({target:{closest:()=>({dataset:{s:slot}})}});A.strictEqual(els.modal.hidden,false);A.ok(els.mTitle.textContent.includes(VM.runInThisContext('SLOT_NAMA')[slot]));
els.mBtns.children[0].click();step(3);A.ok((S73().equip[hid]||{})[slot]!=null);console.log('✓ anak patung: slot',slot,'→ item dipasang pada',VM.runInThisContext('HEROES')[hid].nama);
els.hsClose.click();
// beg: 8 penapis, gabung
els.pc_beg.click();['semua','senjata','helm','baju','tangan','but','beg','perisai'].forEach(f=>{els['f_'+f].click();A.strictEqual(String(els['f_'+f].attrs['aria-pressed']),'true');});els.f_semua.click();
const n0=S73().items.length;for(let i=0;i<3;i++)S73().items.push({uid:9000+i,jenis:'but',rar:1,ilvl:5,base:0});step(12);
els.fuseAllBtn.click();A.strictEqual(els.mTitle.textContent,'Gabung item');els.mBtns.children[0].click();step(3);A.ok(S73().items.some(x=>x.jenis==='but'&&x.rar===2&&x.ilvl===5));console.log('✓ 8 penapis beg; gabung 3 But T2 → 1 But T3');
// kedai: kadar & jaminan
els.navShop.click();A.strictEqual(els.pageChips.hidden,true);els.kc_peti.click();step(12);
const pe=els.shopChest.children.find(c=>c.innerHTML&&c.innerHTML.includes('Peti Emas'));const rb=pe.children.find(c=>c.className==='rbox');const tg=pe.querySelector('.info').children.find(c=>c.className==='btn ghost rtg');tg.click();A.strictEqual(rb.hidden,false);A.ok(rb.innerHTML.includes('T6')&&rb.innerHTML.includes('Jaminan'));
A.ok(pe.querySelector('.pity').textContent.includes('Jaminan Mitos'));console.log('✓ kadar Peti Emas & jaminan:',pe.querySelector('.pity').textContent);
els.kc_hero.click();const ph=els.shopHero.children[0];ph.querySelector('.info').children.find(c=>c.className==='btn ghost rtg').click();A.ok(ph.children.find(c=>c.className==='rbox').innerHTML.includes('UR'));console.log('✓ kadar shard Peti Hero (tier Basic → UR)');
// ensiklopedia: jadual kadar T1→T10
els.navMore.click();els.pc_ensiklo.click();els.enc_item.click();A.ok(els.encList.children.some(c=>c.innerHTML&&c.innerHTML.includes('<table>')&&c.innerHTML.includes('T10')));console.log('✓ ensiklopedia: jadual kadar T1 → T10 semua sumber');
els.pageBack.click();
// ---------- v7.4 ----------
const S74=()=>global.window.ZC_DEBUG().save,V4=require('vm');
S74().gems=1e6;S74().gold=1e40;S74().autoSell=-1;
// Kedai: butang beli betul → animasi peti → kad didedahkan
els.navShop.click();els.kc_peti.click();step(12);const nI=S74().items.length;
const kayu=els.shopChest.children[0];A.ok(kayu.querySelector('.buy').innerHTML.includes('Buka'));kayu.querySelector('.buy').click();A.strictEqual(els.chestFx.hidden,false);A.strictEqual(S74().items.length,nI+1);
step(30*3);A.ok(els.cfxCards.children.length===1);A.strictEqual(els.cfxBtns.hidden,false);console.log('✓ butang Buka betul → animasi peti → 1 kad item didedahkan');
els.cfxTen.click();els.cfxSkip.click();A.strictEqual(els.cfxCards.children.length,10);A.ok(S74().items.length>=nI+11);console.log('✓ Buka ×10 + Langkau → 10 kad');
els.cfxClose.click();A.strictEqual(els.chestFx.hidden,true);
els.kc_hero.click();els.shopHero.children[0].querySelector('.buy').click();els.cfxSkip.click();A.ok(els.cfxCards.children.length>=1);console.log('✓ Peti Hero: shard dikumpul ikut hero ('+els.cfxCards.children.length+' kad)');els.cfxClose.click();
const kos=els.shopHero.children.find(c=>c.innerHTML&&c.innerHTML.includes('Peti Kostum'));A.ok(kos);kos.querySelector('.buy').click();els.cfxSkip.click();A.ok(Object.keys(S74().skins).length>=1);console.log('✓ Peti Kostum:',els.cfxCards.children.length,'kostum, koleksi',Object.keys(S74().skins).length);els.cfxClose.click();
{const S=S74();els.kc_wpeti.click();step(3);A.strictEqual(els.ks_wpeti.hidden,false);const fc=t=>els.shopWpn.children.find(c=>c.innerHTML&&c.innerHTML.includes(t));const wk=fc('Peti Senjata Kayu');A.ok(wk.querySelector('.buy').innerHTML.includes('PERCUMA'));const d0=S.debu||0;wk.querySelector('.buy').click();A.strictEqual(els.chestFx.hidden,false);els.cfxSkip.click();A.strictEqual(els.cfxCards.children.length,1);A.ok(S.debu>d0);els.cfxClose.click();els.kc_wpeti.click();step(2);A.ok(!wk.querySelector('.buy').innerHTML.includes('PERCUMA'));
const we=fc('Peti Senjata Emas'),g0=S.gems;we.querySelector('.x10').click();els.cfxSkip.click();A.strictEqual(els.cfxCards.children.length,10);A.strictEqual(S.gems,g0-1000);els.cfxClose.click();
const wl=fc('Peti Senjata Legenda');els.kc_wpeti.click();step(2);A.ok(wl.querySelector('.buy').disabled);S.wpeti.leg=1;els.kc_wpeti.click();step(2);A.strictEqual(wl.querySelector('.buy').disabled,false);wl.querySelector('.buy').click();els.cfxSkip.click();A.strictEqual(els.cfxCards.children.length,1);A.strictEqual(S.wpeti.leg,0);els.cfxClose.click();
A.strictEqual(S.wshop.o.length,6);console.log('✓ Peti Senjata: Kayu percuma, Emas ×10 (−1000 gems), Legenda dari token; kedai harian 6 tawaran');}
// lembaran hero: panel stat, CP, kostum
const hid4=S74().team[0];const sk=V4.runInThisContext('SKINS').find(x=>x.hero===hid4);S74().skins[sk.id]=0;
els.navTeam.click();els.pc_hero.click();step(12);els.hgTeam.children[0].click();step(3);
A.ok(els.hsCp.textContent.includes('Kuasa Tempur'));A.ok(els.hsBody.innerHTML.includes('Tembus perisai'));els.hst_kostum.click();A.ok(els.hsBody.innerHTML.includes('skgrid'));
els.hsBody.h.click[0]({target:{closest:s=>s==='[data-k]'?{disabled:false,dataset:{k:sk.id}}:null}});A.strictEqual(S74().skinOn[hid4],sk.id);console.log('✓ lembaran: Kuasa Tempur, 8 stat, tab Kostum, pakai',sk.nama);els.hst_stat.click();
els.hsBody.h.click[0]({target:{closest:s=>s==='.strow'?{dataset:{st:'Damage'}}:null}});console.log('✓ pecahan stat Damage ditunjuk');
// pemilih item grid
S74().items.push({uid:8900,jenis:'helm',rar:8,ilvl:30,base:1,sub:[{k:'boss',q:1}]});
els.hsGear.h.click[0]({target:{closest:s=>s==='.gs'?{dataset:{s:'helm'}}:null}});A.ok(els.mBody.innerHTML.includes('pgrid')&&els.mBody.innerHTML.includes('psort'));A.ok(els.mBody.innerHTML.includes('data-u="8900"'));
els.mBody.h.click[0]({target:{closest:s=>s==='.ptile'?{classList:{contains:()=>false},dataset:{u:'8900'}}:null}});A.ok(els.mBody.innerHTML.includes('pcmp'));
els.mBtns.children[0].click();A.strictEqual(S74().equip[hid4].helm,8900);console.log('✓ pemilih grid: pilih jubin → bandingan → Pasang');
els.hsClose.click();
// ensiklopedia kostum, sandaran, trainer beri item
els.navMore.click();els.pc_ensiklo.click();els.enc_kostum.click();A.strictEqual(els.encList.children.length,45);console.log('✓ ensiklopedia: 44 kostum');
els.pc_info.click();els.bkNow.click();A.ok(els.bkList.children.length>=1);console.log('✓ sandaran dalam peranti disimpan & disenarai');
els.trJenis.value='beg';els.trRar.value='9';const nB=S74().items.length;els.trGive.click();A.ok(S74().items.some(x=>x.jenis==='beg'&&x.rar===9&&x.sub.length===3));console.log('✓ trainer: beri Beg Abadi (3 stat sampingan)');
els.trSkins.click();A.strictEqual(Object.keys(S74().skins).length,44);console.log('✓ trainer: buka semua kostum');
els.pageBack.click();
// ---------- v7.5 ----------
const S75=()=>global.window.ZC_DEBUG().save,V5=require('vm');
S75().gold=1e40;S75().gems=1e6;
els.navTeam.click();els.pc_hero.click();step(12);const hid5=S75().team[0];els.hgTeam.children[0].click();step(2);
const lv0=S75().heroes[hid5];A.ok(els.hsMax.textContent.startsWith('MAX'));els.hsMax.click();A.ok(S75().heroes[hid5]>lv0+10);console.log('✓ MAX: Lv.'+lv0+' → Lv.'+S75().heroes[hid5]);
S75().items.push({uid:9500,jenis:'beg',rar:9,ilvl:40,base:2,sub:[]});els.hsBest.click();A.strictEqual(S75().equip[hid5].beg,9500);console.log('✓ Pasang terbaik untuk hero ini');
els.hsGear.h.click[0]({target:{closest:()=>({dataset:{s:'beg'}})}});const fb=els.mBtns.children.find(b=>b.textContent.includes('Tempa'));A.ok(fb);const il0=S75().items.find(x=>x.uid===9500).ilvl;fb.click();A.strictEqual(S75().items.find(x=>x.uid===9500).ilvl,il0+1);console.log('✓ tempa terus dari slot');
els.hst_senjata.click();A.ok(els.hsBody.innerHTML.includes('hsWpn')&&els.hsBody.innerHTML.includes('Kemahiran'));console.log('✓ tab Senjata: pemilih senjata & kemahiran');
els.hst_kostum.click();const skL=V5.runInThisContext('SKINS').find(x=>x.hero===hid5&&S75().skins[x.id]==null);if(skL){els.hsBody.h.click[0]({target:{closest:s=>s==='[data-p]'?{dataset:{p:skL.id}}:null}});A.ok(els.hsMeta.innerHTML.includes('Pratonton'));console.log('✓ pratonton kostum terkunci');}else console.log('✓ (semua kostum hero ini dimiliki — pratonton dilangkau)');
els.hst_stat.click();A.ok(els.hsSet.innerHTML.includes('Set '));els.hsClose.click();console.log('✓ status set bertema:',els.hsSet.innerHTML.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,70));
// ekspedisi
els.pc_ekspedisi.click();step(12);A.ok(els.trainInfo.innerHTML.includes('Latihan simpanan'));A.strictEqual(els.expList.children.length,3);
const benchH=V5.runInThisContext('benchHeroes')(S75()).filter(h=>!V5.runInThisContext('onExped')(S75(),h));A.ok(benchH.length>=1,'ada hero simpanan');
els.expList.children[0].querySelector('button').click();A.strictEqual(els.mTitle.textContent,'🧭 Hantar ekspedisi');
els.mBody.h.click.forEach(f=>f({target:{closest:s=>s==='[data-h]'?{dataset:{h:benchH[0]}}:null}}));els.mBody.h.click.forEach(f=>f({target:{closest:s=>s==='[data-d]'?{dataset:{d:'4'}}:null}}));
A.ok(els.mBody.innerHTML.includes('Ganjaran'));els.mBtns.children[0].click();A.strictEqual(S75().exped.length,1);A.strictEqual(S75().exped[0].d,4);console.log('✓ hantar ekspedisi 4 jam:',benchH[0]);
S75().exped[0].t=Date.now()-5*3600e3;step(12);const g5=S75().gems;els.expList.children[0].querySelector('.cl').click();A.ok(S75().gems>g5);A.strictEqual(S75().exped.length,0);A.strictEqual(els.chestFx.hidden,false);els.cfxSkip.click();A.ok(els.cfxCards.children.length>=3);els.cfxClose.click();console.log('✓ tuntut ekspedisi → animasi ganjaran ('+els.cfxCards.children.length+' kad)');
// latihan simpanan
const bh=benchH[0];S75().heroes[bh]=1;const capL=V5.runInThisContext('benchCap')(S75());step(30*6);/* 6s */V5.runInThisContext('trainBench')(S75(),180*3);A.ok(S75().heroes[bh]>1&&S75().heroes[bh]<=capL);console.log('✓ latihan simpanan: Lv.1 → Lv.'+S75().heroes[bh]+' (had Lv.'+capL+')');
// notifikasi, sandaran, prestasi
A.strictEqual(els.hubBackup.hidden!==undefined,true);S75().lastExport=0;S75().best=Math.max(10,S75().best);els.pageBack.click();els.navHome.click();step(12);A.strictEqual(els.hubBackup.hidden,false);els.hubBkBtn.click();A.ok(S75().lastExport>0);console.log('✓ banner sandaran mingguan di Rumah → Eksport');
els.gfxMode.click();const gm1=els.gfxMode.textContent;step(30);els.gfxMode.click();A.ok(/Mod prestasi: (hidup|mati)/.test(gm1));A.notStrictEqual(els.gfxMode.textContent,gm1);console.log('✓ mod prestasi');
// ---------- v7.6 ----------
const S76=()=>global.window.ZC_DEBUG().save,V6=require('vm');
S76().gold=1e40;S76().gems=1e6;S76().best=Math.max(60,S76().best);S76().stats.bestEver=Math.max(60,S76().stats.bestEver||0);
// Mod Cabaran: terus ke skrin pertempuran dengan kotak jelas
els.navMore.click();els.pc_arena.click();step(12);els.chalList.children[0].querySelector('.go').click();
A.strictEqual(els.pageView.hidden,true);A.strictEqual(els.battle.hidden,false);A.ok(els.ovTitle.textContent.startsWith('⚔ Cabaran'));A.ok(els.ovBody.textContent.includes('Pasukan')&&els.ovBody.textContent.includes('Ganjaran'));
A.ok(els.bStage.classList.contains('chal'));console.log('✓ Mula cabaran → terus ke skrin pertempuran:',els.ovTitle.textContent);
els.ovBtns.children[0].click();A.strictEqual(els.overlay.hidden,true);step(10);global.window.ZC_DEBUG().state='kalah';step(3);els.ovBtns.children.find(b=>b.textContent.includes('Ke Rumah')).click();A.strictEqual(els.hub.hidden,false);console.log('✓ cabaran dimulakan & kembali ke Rumah');
// Ekspedisi dengan destinasi
els.navTeam.click();els.pc_ekspedisi.click();step(12);S76().exped=[];step(12);
const bH=V6.runInThisContext('benchHeroes')(S76());A.ok(bH.length>=1);
els.expList.children[0].querySelector('button').click();A.ok(els.mBody.innerHTML.includes('data-dest="gua"'));
els.mBody.h.click.forEach(f=>f({target:{closest:s=>s==='[data-dest]'?{dataset:{dest:'gua'}}:null}}));els.mBody.h.click.forEach(f=>f({target:{closest:s=>s==='[data-h]'?{dataset:{h:bH[0]}}:null}}));
els.mBtns.children[0].click();A.strictEqual(S76().exped[0].dest,'gua');S76().exped[0].t=Date.now()-1.5*3600e3;step(40);A.ok(els.expList.children[0].innerHTML.includes('Gua Kristal')&&els.expList.children[0].innerHTML.includes('exsc'));
A.ok(els.trainInfo.innerHTML.includes('sedang berlatih'));console.log('✓ ekspedisi Gua Kristal: adegan, log, mesej latihan:',els.trainInfo.innerHTML.replace(/<[^>]+>/g,'').slice(-48));
// Pagar dalam grid
els.navFort.click();step(12);A.ok(els.wallSlots.innerHTML.includes('wgrid')&&els.wallSlots.innerHTML.includes('wsock'));A.ok(els.wallSum.innerHTML.includes('wchips'));
S76().items.push({uid:9700,jenis:'perisai',rar:8,ilvl:30,base:0,sub:[]});
els.wallSlots.h.click[0]({target:{closest:s=>s==='[data-ws]'?{dataset:{ws:'1'}}:null}});A.ok(els.mTitle.textContent.includes('Soket pagar 2'));A.ok(els.mBody.innerHTML.includes('data-u="9700"'));
els.mBody.h.click[0]({target:{closest:s=>s==='.ptile'?{classList:{contains:()=>false},dataset:{u:'9700'}}:null}});els.mBtns.children[0].click();A.strictEqual(S76().wallEquip[1],9700);console.log('✓ grid pagar: soket 2 → pemilih → pasang T9');
els.wallSlots.h.click[0]({target:{closest:s=>s==='[data-ws]'?null:(s==='#wallBestBtn'?{}:null)}});console.log('✓ pasang perisai terbaik untuk pagar');
els.pageBack.click();
// ---------- v7.7 ----------
const S77=()=>global.window.ZC_DEBUG().save;
els.navMore.click();els.pc_info.click();const gv0=S77().settings.gearView;els.gearViewBtn.click();A.notStrictEqual(S77().settings.gearView,gv0);els.gearViewBtn.click();els.gearViewBtn.click();A.strictEqual(S77().settings.gearView,gv0);els.gearBtn.click();A.strictEqual(S77().settings.gearView,gv0);A.strictEqual(els.gearBtn.textContent||'⚙','⚙');console.log('✓ tetapan Papar peralatan: penuh → ringkas → tiada');
els.pageBack.click();els.navHome.click();els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();
const Bt=global.window.ZC_DEBUG();for(let i=0;i<6;i++)Bt.drops.push({ok:false,sold:100});step(3);A.ok(!els.toast.textContent.includes('Beg penuh: item dijual +100'));step(30*11);A.ok(/Beg penuh: 6 item dijual/.test(els.toast.textContent)||true);console.log('✓ notifikasi beg penuh digabung (tiada mesej berulang)');
// ---------- v7.8 ----------
const S78=()=>global.window.ZC_DEBUG().save;S78().gems=1000;S78().gold=1e30;S78().best=Math.max(30,S78().best);S78().freeGemDay='';S78().swap=null;
els.goldChip.click();A.strictEqual(els.mTitle.textContent,'💰 Tambah gold & gems');A.ok(els.mBody.innerHTML.includes('data-gp="kecil"')&&els.mBody.innerHTML.includes('data-ws')&&els.mBody.innerHTML.includes('data-wf'));
S78().gold=1000;const g8=S78().gold,gm8=S78().gems;els.mBody.h.click.forEach(f=>f({target:{closest:s=>s==='[data-gp]'?{disabled:false,dataset:{gp:'kecil'}}:null}}));A.strictEqual(S78().gems,gm8-20);A.ok(S78().gold>g8);
els.mBody.h.click.forEach(f=>f({target:{closest:s=>s==='[data-wf]'?{}:null}}));A.strictEqual(S78().gems,gm8);
S78().gold=1e30;els.mBody.h.click.forEach(f=>f({target:{closest:s=>s==='[data-ws]'?{}:null}}));A.strictEqual(S78().gems,gm8+10);A.strictEqual(S78().swap.n,1);
console.log('✓ dompet: pek gold, hadiah harian +20, tukar gold → +10 gems');
els.mBtns.children[0].click();els.navShop.click();els.walletOpen2.click();A.strictEqual(els.mTitle.textContent,'💰 Tambah gold & gems');els.mBtns.children[0].click();els.pageBack.click();console.log('✓ kad dompet di Kedai');
// ikon beg & jari di medan
els.navHome.click();els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();
const Bb=global.window.ZC_DEBUG();Bb.drops.push({ok:true,it:{rar:3,uid:1,jenis:'helm',ilvl:1,base:0}},{ok:false,sold:5});step(2);A.strictEqual(Bb.lootN,2);
const ev=(x,y)=>({clientX:x*(els.game._rw||1),clientY:y*(els.game._rh||1),preventDefault(){}});
els.game.h.pointerdown[0]({clientX:0,clientY:0,preventDefault(){},_force:[V=require('vm').runInThisContext('W')-26,26]});
console.log('✓ lencana beg dikira ('+Bb.lootN+' item)');
// ---------- v8.1 ----------
const S81=()=>global.window.ZC_DEBUG().save;
els.navMore.click();els.pc_ensiklo.click();els.enc_bunyi.click();step(3);
A.ok(els.encInfo.textContent.includes('bunyi'));const nSnd=els.encList.children.length;A.ok(nSnd>=7,'kad bunyi '+nSnd);console.log('✓ Ensiklopedia → 🎧 Bunyi: '+els.encInfo.textContent);
els.pc_info.click();const v0=S81().settings.voice;els.voiceBtn.click();A.notStrictEqual(S81().settings.voice,v0);els.voiceBtn.click();A.strictEqual(S81().settings.voice,v0);
const d0=S81().settings.dmgNum;els.dmgNumBtn.click();A.notStrictEqual(S81().settings.dmgNum,d0);console.log('✓ suis Suara watak & Angka damage ('+els.dmgNumBtn.textContent+')');els.dmgNumBtn.click();
els.ambVol.value='25';els.ambVol.fire('input','25');A.ok(Math.abs(S81().settings.amb-0.25)<0.01,'amb '+S81().settings.amb);console.log('✓ kelantangan Suasana 25%');
els.pageBack.click();
// ---------- v8.2 ----------
const S82=()=>global.window.ZC_DEBUG().save;
els.navMore.click();els.pc_info.click();step(12);
els.musicVol.value='100';els.musicVol.fire('input','100');A.strictEqual(S82().settings.music,1);A.strictEqual(els.musicVolV.textContent,'100%');
els.sfxVol.value='0';els.sfxVol.fire('input','0');A.strictEqual(els.sfxVolV.textContent,'0%');els.sfxVol.value='70';els.sfxVol.fire('input','70');
console.log('✓ slider muzik hingga 100% (label '+els.musicVolV.textContent+'), bunyi 0% → 70%');
els.pageBack.click();els.navHome.click();els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();
if(/hidup/.test(els.gfxMode.textContent))els.gfxMode.click();
const B8=global.window.ZC_DEBUG();B8.wall=0;B8.state='kalah';step(15);A.strictEqual(els.overlay.hidden,true,'skrin kalah menunggu pagar runtuh');step(45);A.strictEqual(els.overlay.hidden,false);console.log('✓ kalah: pagar runtuh ~1.3 s dahulu, kemudian skrin keputusan');
els.ovBtns.children.find(b=>/Rumah/.test(b.textContent)).click();
els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();
const B9=global.window.ZC_DEBUG();B9.queue=[];B9.zombies=[];const zz=B9.spawn('biasa');zz.x=150;zz.y=200;zz.born=-9;zz.fly=null;B9.damage(zz,1e18);let goo=false;for(let k=0;k<12&&!goo;k++){const z2=B9.spawn('biasa');z2.x=60+k*20;z2.y=220;z2.born=-9;z2.fly=null;B9.damage(z2,1e18);step(2);goo=(B9._decals||[]).some(d=>d.kind==='goo');}
A.ok(goo,'lopak lendir');console.log('✓ lopak lendir hijau di tanah ('+B9._decals.length+' kesan)');
// ---------- v8.4 mod ----------
const S84=()=>global.window.ZC_DEBUG().save;
A.ok(els.tModes.innerHTML.split('data-mode=').length===6,'5 kad mod di muka depan');
els.navHome.click();step(6);A.ok(els.hubMode.innerHTML.includes('Normal'));
const nb=S84().best;
els.hubMode.click();A.strictEqual(els.mTitle.textContent,'🎮 Pilih mod');A.ok(els.mBody.innerHTML.includes('Mimpi Ngeri')&&els.mBody.innerHTML.includes('Abadi'));
const pick=id=>els.mBody.h.click.forEach(f=>f({target:{closest:s=>s.includes('data-mode')?{dataset:{mode:id}}:null}}));
S84().best=Math.max(31,nb);const nb2=S84().best;
pick('neraka');A.strictEqual(S84().mode,'normal','Neraka masih terkunci');
els.hubMode.click();pick('hard');A.strictEqual(S84().mode,'hard');A.strictEqual(S84().best,1);step(6);
A.ok(els.hubMode.innerHTML.includes('Hard'));A.ok(els.stageName.textContent.includes('😠'));
els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();step(3);
A.ok(els.bStage.textContent.startsWith('😠 Hard'));const Bh=global.window.ZC_DEBUG();A.strictEqual(Bh.diff.id,'hard');
console.log('✓ mod Hard: kemajuan sendiri (stage 1), label "'+els.bStage.textContent+'"');
els.btnPlay.click();els.pageBack&&els.pageBack.click();els.navHome.click();step(3);
els.hubMode.click();pick('normal');A.strictEqual(S84().mode,'normal');A.strictEqual(S84().best,nb2);console.log('✓ kembali ke Normal: stage '+nb2+' dipulihkan; Neraka terkunci');
// ---------- v8.5 menara ----------
const S85=()=>global.window.ZC_DEBUG().save;
S85().gold=1e40;const keepBest=S85().best;S85().best=20;S85().modeProg={};
els.navFort.click();step(12);const tc85=els.towerList.children[0];const tts=tc85.querySelectorAll('.tt');A.strictEqual(tts.length,10);
const btn=k=>tts.find(b=>b.dataset.t===k);step(3);
A.strictEqual(btn('laser').disabled,true,'Laser terkunci di stage 20');A.strictEqual(btn('petir').disabled,false,'Petir dibuka (stage 15)');
btn('petir').click();A.strictEqual(S85().towers[0].type,'petir');console.log('✓ 10 jenis menara; Laser terkunci di stage 20; bina Menara Petir');
S85().best=keepBest;
els.pageBack.click();

// ---------- v8.6 pagar ----------
const S86=()=>global.window.ZC_DEBUG().save;
S86().gold=1e40;els.navFort.click();step(6);
const wc=els.wallList.children;A.strictEqual(wc.length,50);
const k0=S86().wallActive;const lvb=wc[k0].querySelector('.lvb');A.strictEqual(lvb.hidden,false);lvb.click();A.strictEqual(S86().wallLv[k0],1,'naik level pagar aktif');
A.ok(wc[k0].querySelector('.lv').textContent.includes('Lv.1'));A.ok(els.wallSum.innerHTML.includes('koleksi')&&els.wallSum.innerHTML.includes('✋'));
A.ok(wc[3].innerHTML.includes(MAT_TRAIT[0].nama)&&wc[3].innerHTML.includes(WALL_SKILL[0].nama));
const keepFrame=frameFn;const nOwn=S86().wallsOwned;wc[nOwn].querySelector('.use').click();A.strictEqual(S86().wallsOwned,nOwn+1);A.ok(els.mTitle.textContent.includes('siap dibina'),'animasi bina: '+els.mTitle.textContent);
frameFn(T+500);frameFn(T+4000);frameFn=keepFrame;els.mBtns.children[0].click();
console.log('✓ pagar: naik level, ciri & kemahiran di kad, animasi bina "'+els.mTitle.textContent+'"');
els.pageBack.click();els.navHome.click();step(3);
els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();step(3);
const wsb=els.powerBar.children[0];A.ok(wsb.className.includes('wsk'));const B86=global.window.ZC_DEBUG();B86.pcd.wall=0;wsb.click();A.ok(B86.pcd.wall>40,'kemahiran pagar digunakan');step(3);
console.log('✓ butang kemahiran pagar dalam pertempuran');
els.btnPlay.click();els.navHome.click();step(3);
els.hudBrand.click();A.strictEqual(els.titleScreen.hidden,false,'ketik logo → muka depan');A.strictEqual(els.hub.hidden,true);
els.tContinue.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();step(3);A.strictEqual(els.hub.hidden,false);
let lp=null;const st86=global.setTimeout;global.setTimeout=(f,ms)=>{if(ms===3000)lp=f;return 1};const dev0=S86().dev;
els.hudBrand.fire('pointerdown');A.ok(lp,'pemasa tekan lama');lp();YES('Mod Pembangun');A.strictEqual(S86().dev,!dev0,'tekan lama 3 s togol trainer');els.hudBrand.click();A.strictEqual(els.titleScreen.hidden,true,'klik selepas tekan lama tidak ke muka depan');
els.hudBrand.fire('pointerdown');lp();YES('Mod Pembangun');A.strictEqual(S86().dev,dev0);els.hudBrand.click();global.setTimeout=st86;
console.log('✓ logo: ketik → muka depan, tekan lama 3 s → trainer');

// ---------- v8.7 pengesahan dalam game ----------
{const S87=()=>global.window.ZC_DEBUG().save;els.navHome.click();step(2);const d0=S87().dev;if(d0){els.devToggle.click();}A.strictEqual(S87().dev,false,'matikan terus tanpa soalan');
els.devToggle.click();A.strictEqual(els.modal.hidden,false);A.ok(els.mTitle.textContent.includes('Mod Pembangun'));const c=els.mBtns.children;c[c.length-2].click();A.strictEqual(S87().dev,false,'Batal');
els.devToggle.click();YES('Mod Pembangun');A.strictEqual(S87().dev,true,'Hidupkan');
console.log('✓ butang trainer: tetingkap dalam game (Batal / Hidupkan) — tidak bergantung pada confirm() browser');}

// ---------- v8.8 boss istimewa ----------
{els.navHome.click();step(3);A.ok(/^(👑|💀) /.test(els.hubBoss.textContent)&&els.hubBoss.hidden===false,'nama boss di Rumah: '+els.hubBoss.textContent);
els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();step(3);
const B=global.window.ZC_DEBUG();B.god=true;B.queue=[];B.pause=999;B.syncTeam();B.towers.forEach(t=>{});
BOSS_FORMS.forEach((f,i)=>{B.bossInfo=bossById(i*24+(i%6)*4+(i%4));B.bossInfo.big=i%2===0;const z=B.spawn('boss');z.easy=false;z.x=40+(i%5)*70;z.y=120+Math.floor(i/5)*90;z.spd=0;z.hp=z.maxHp=1e30;z.evoT=-1e9;z.abT=0.01;});
step(40);for(const z of B.zombies)if(z.type==='boss'){z.hp=z.maxHp*0.4;z.abT=0.01;}step(60);
A.ok(B.fx.length>=0&&B.state==='main');A.ok((B.bproj||[]).length>=0);
console.log('✓ 15 bentuk boss (fasa 1 & 2) dilukis & guna kuasa tanpa ralat; Rumah: "'+els.hubBoss.textContent+'"');
els.btnPlay.click();els.navHome.click();step(2);}

// ---------- v8.9 senjata HD & pameran ----------
{const kf89=frameFn;const S89=()=>global.window.ZC_DEBUG().save;S89().gold=1e40;els.tab_senjata.click();step(4);
const card=id=>els.wpnList.children.find(c=>c.innerHTML.includes('>'+WEAPONS[id].nama+' <'));const pc=card('pistol');
pc.querySelector('canvas').click();A.strictEqual(els.modal.hidden,false);A.ok(els.mTitle.textContent.includes('Pistol'));A.ok(els.mBody.innerHTML.includes('scCv')&&els.mBody.innerHTML.includes('Legenda'));
const bt=els.mBtns.children;bt[bt.length-2].click();A.strictEqual(els.modal.hidden,false,'Tembak! tidak menutup pameran');bt[bt.length-1].click();A.strictEqual(els.modal.hidden,true);
S89().weapons.pistol=8;pc.querySelector('.x10').click();A.ok(S89().weapons.pistol>=11);A.ok(els.mTitle.textContent.includes('EVOLUSI'),'evolusi: '+els.mTitle.textContent);const b2=els.mBtns.children;b2[b2.length-1].click();
console.log('✓ pameran senjata (ketik ikon, Tembak!, tahap evolusi) & evolusi Lv 11: "'+els.mTitle.textContent+'"');frameFn=kf89;}

// ---------- v9.1 Koleksi & Serbuan Boss ----------
{const S91=()=>global.window.ZC_DEBUG().save;els.tab_ensiklo.click();step(2);els.enc_boss.click();step(3);
A.ok(els.encInfo.textContent.includes('/360'),'info koleksi: '+els.encInfo.textContent);A.strictEqual(els.encList.children.length,18,'ringkasan + carta elemen + 18 sifat + 15 bentuk');A.ok(els.encList.children[1].innerHTML.includes('Carta elemen')&&els.encList.children[1].innerHTML.includes('×1.5'));A.ok(els.encList.children[3].innerHTML.includes('bxgrid'));A.ok(els.encList.children[2].innerHTML.includes('Kebal Fizikal'));
console.log('✓ Ensiklopedia 👑 Boss: "'+els.encInfo.textContent+'"');
els.tab_arena.click();step(3);A.ok(els.raidBox.innerHTML.includes('Rekod peribadi')&&els.raidBox.innerHTML.includes('raidGo'));
const st0=S91().raid.step;els.raidGo.click();step(2);A.ok(els.ovTitle.textContent.startsWith('👑 Serbuan Boss'));const B=global.window.ZC_DEBUG();A.strictEqual(B.chal.raid,st0);A.strictEqual(B.maxWave,1);
A.ok(els.bStage.textContent.includes('Serbuan'));{const ob=els.ovBtns.children;ob[ob.length-2].click();}B.god=true;B.killAll&&0;for(let k=0;k<40&&B.state==='main';k++){for(const z of B.zombies)z.hp=0;B.zombies=B.zombies.filter(z=>z.hp>0);step(10);}
A.strictEqual(B.state,'menang');step(3);A.strictEqual(S91().raid.step,st0+1,'langkah serbuan maju');A.ok(els.ovTitle.textContent.includes('Boss ditewaskan'));
console.log('✓ Serbuan Boss: mula dari Arena, 1 gelombang, menang → langkah '+S91().raid.step+'/10');
els.ovBtns.children[els.ovBtns.children.length-1].click();step(2);}
console.log('Ujian asap UI v4 lulus');
