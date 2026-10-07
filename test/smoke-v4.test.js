const fs=require('fs');const path=require('path');const html=fs.readFileSync(path.join(__dirname,'..','docs','index.html'),'utf8');const INLINE=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));
const ctxStub=new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='measureText'?()=>({width:10}):k.includes('Gradient')?()=>({addColorStop(){}}):()=>{}),set:(t,k,v)=>(t[k]=v,true)});
function mk(tag){const e={tag,textContent:'',innerHTML:'',value:'',hidden:false,disabled:false,dataset:{},className:'',children:[],attrs:{},h:{},
 classList:{_s:new Set(),toggle(c,v){if(v===undefined)v=!this._s.has(c);v?this._s.add(c):this._s.delete(c);return v},add(c){this._s.add(c)},remove(c){this._s.delete(c)},contains(c){return this._s.has(c)}},style:{},setAttribute(k,v){this.attrs[k]=String(v)},getAttribute(k){return this.attrs[k]},addEventListener(e,f){(this.h[e]=this.h[e]||[]).push(f)},
 click(){(this.h.click||[]).forEach(f=>f({target:{closest:()=>null}}))},fire(ev,val){(this.h[ev]||[]).forEach(f=>f({target:{value:val,closest:()=>null}}))},appendChild(c){this.children.push(c)},getContext:()=>ctxStub,getBoundingClientRect:()=>({left:0,top:0,width:360,height:600}),
 querySelectorAll(s){if(!this.qa)this.qa={};if(!this.qa[s]){const cls=s.replace(/^\./,'');const re=new RegExp('<[a-z]+[^>]*class="[^"]*\\b'+cls+'\\b[^"]*"[^>]*>','g');this.qa[s]=(this.innerHTML.match(re)||[]).map(tag=>{const c=mk('el');(tag.match(/data-([a-z]+)="([^"]*)"/g)||[]).forEach(a=>{const m=/data-([a-z]+)="([^"]*)"/.exec(a);c.dataset[m[1]]=m[2];});return c;});}return this.qa[s]},querySelector(s){if(!this.q)this.q={};if(!this.q[s]){this.q[s]=mk(s);if(s==='select')this.q[s].value='pistol';}return this.q[s]}};let _ih='';Object.defineProperty(e,'innerHTML',{get(){return _ih},set(v){_ih=v;e.children=[];e.q={};e.qa={}}});return e;}
const els={};[...html.matchAll(/id="([a-zA-Z_0-9]+)"/g)].forEach(m=>els[m[1]]=mk('el'));
const ls={zombi_comel_save_v1:JSON.stringify({v:3,gold:5000,gems:300,stage:3,best:4,cleared:[1,2,3],heroes:{pistol:6,shotgun:2},team:['pistol','shotgun'],slots:3,shop:{damage:2,speed:0,wall:1,tap:0,magnet:0,luck:0},items:[{uid:1,jenis:'senjata',rar:4,ilvl:3,base:0}],equip:{pistol:{senjata:1}},boost:{},nextUid:2,last:Date.now(),kills:100})};
global.localStorage={getItem:k=>k in ls?ls[k]:null,setItem:(k,v)=>ls[k]=String(v),removeItem:k=>delete ls[k]};
global.window={addEventListener(){},devicePixelRatio:1};let T=0;global.performance={now:()=>T};
let frameFn=null;global.requestAnimationFrame=f=>frameFn=f;global.confirm=()=>true;global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.document={getElementById:i=>els[i],createElement:t=>mk(t),addEventListener(){},querySelectorAll:()=>[],hidden:false,body:{dataset:{},classList:{toggle(){},add(){},remove(){}}}};
require('vm').runInThisContext(INLINE);
const A=require('assert');const sv=()=>JSON.parse(ls.zombi_comel_save_v1);const step=n=>{for(let i=0;i<n;i++){T+=33;frameFn(T)}};
els.devToggle.click();
const HO=require('vm').runInThisContext('HERO_ORDER');
A.strictEqual(sv().v,6);A.strictEqual(sv().heroes.pistol,6);A.deepStrictEqual(sv().stars,{});console.log('✓ save lama dipindah ke v4');
els.ovBtns.children[0].click();step(30*15);console.log('✓ pertempuran berjalan, zombie ditemui:',(sv().seenZ.match(/1/g)||[]).length);
els.trGems2.click();els.trGold2.click();
const cards=els.heroList.children;A.strictEqual(cards.length,22);console.log('✓ 22 kad hero');
const li=HO.indexOf('laser');cards[li].querySelector('.buy5').click();A.strictEqual(sv().shards.laser,5);console.log('✓ beli 5 shard Kapten Bakar');
cards[li].querySelector('.star').click();A.ok(!sv().heroes.laser);for(let i=0;i<19;i++)cards[li].querySelector('.buy5').click();cards[li].querySelector('.star').click();A.ok(sv().heroes.laser);A.strictEqual(sv().shards.laser,0);console.log('✓ bina hero SR+ dengan 100 shard');
const pi=HO.indexOf('pistol');cards[pi].querySelector('.star').click();A.ok(!sv().stars.pistol);els.trShard.click();cards[pi].querySelector('.star').click();A.strictEqual(sv().stars.pistol,1);A.strictEqual(sv().shards.pistol,90);console.log('✓ naik bintang 1★ guna 10 shard');
for(let i=0;i<5;i++)cards[pi].querySelector('.star').click();A.strictEqual(sv().stars.pistol,5);A.strictEqual(sv().shards.pistol,0);cards[pi].querySelector('.star').click();A.strictEqual(sv().stars.pistol,5);console.log('✓ bintang 2–5 guna 15+20+25+30 = 90 shard, berhenti bila habis');
els.shopHero.children[0].querySelector('button').click();els.shopHero.children[1].querySelector('button').click();console.log('✓ Peti Hero & Peti Hero Legenda');
els.tab_ensiklo.click();A.strictEqual(els.encList.children.length,24);els.encNext.click();console.log('✓ ensiklopedia zombie (24 sehalaman), halaman 2');
els.enc_hero.click();A.strictEqual(els.encList.children.length,22);els.enc_zombie.click();
els.ef_ditemui.click();console.log('  ditemui dipapar:',els.encList.children.length);els.ef_belum.click();els.ef_semua.click();
els.encBase.fire('change','gergasi');els.encQ.fire('input','');els.trSeen.click();A.ok(sv().seenZ==='1'.repeat(1000));console.log('✓ penapis jenis + semua 1000 ditemui');
els.trHero.click();els.trStage.click();els.trStage.click();for(let i=0;i<120;i++)els.stageNext.click();els.ovBtns.children[0].click();els.trGod.click();step(30*30);console.log('✓ stage tinggi dengan zombie baharu tanpa ralat');
els.btnReset.click();A.deepStrictEqual(sv().stars,{});A.strictEqual(sv().seenZ,'');console.log('✓ reset');
// susunan: pasukan di atas
els.trHero.click();els.tab_hero.click();step(12);const HC=els.heroList.children;const team=sv().team;
team.forEach((h,i)=>A.strictEqual(HC[HO.indexOf(h)].style.order,i));const others=HO.filter(h=>!team.includes(h)).map(h=>HC[HO.indexOf(h)].style.order);A.ok(Math.min(...others)>=team.length);console.log('✓ hero dalam pasukan disusun paling atas:',team.join(','));
els.tab_senjata.click();step(12);const WO=require('vm').runInThisContext('WEAPON_ORDER');const usedW=[...new Set(team.map(h=>require('vm').runInThisContext('heroWeapon')(sv(),h)))];
usedW.forEach(w=>A.ok(els.wpnList.children[WO.indexOf(w)].style.order<usedW.length));console.log('✓ senjata yang dipakai disusun paling atas:',usedW.join(','));
// trofi
els.tab_trofi.click();step(12);A.strictEqual(els.achList.children.length,39);console.log('✓ 39 kad pencapaian');
const before=sv().gems;els.trClaimAll.click();step(12);const cl=sv().achClaimed;const nCl=Object.values(cl).reduce((a,b)=>a+b,0);A.ok(nCl>0);A.ok(sv().gems>before);console.log('✓ Tuntut semua:',nCl,'trofi, gems +'+(sv().gems-before));
els.ak_0.click();els.ak_all.click();console.log('✓ penapis kategori');
els.tab_hero.click();if(!els.overlay.hidden)els.ovBtns.children[0].click();step(30*8);A.ok(sv().stats.playSec>0&&sv().stats.kills>0);console.log('✓ statistik dijejak: kills',sv().stats.kills,'masa',Math.round(sv().stats.playSec)+'s');
// ensiklopedia semua bahagian
els.tab_ensiklo.click();const counts={};
['hero','zombie','senjata','pagar','item','kuasa','sifat','tier','latar','kedai'].forEach(m=>{els['enc_'+m].click();counts[m]=els.encList.children.length;A.ok(counts[m]>0,m);});
A.strictEqual(counts.senjata,32);A.strictEqual(counts.pagar,56);A.strictEqual(counts.kuasa,9);A.strictEqual(counts.latar,50);A.strictEqual(counts.tier,11);
console.log('✓ ensiklopedia 10 bahagian:',JSON.stringify(counts));
// ---------- v5 ----------
// trainer dikunci bila mod pembangun mati
els.devToggle.click();const g0=sv().gems;els.trGems2.click();A.strictEqual(sv().gems,g0);els.devToggle.click();els.trGems2.click();A.ok(sv().gems>g0);console.log('✓ trainer hanya berfungsi dalam Mod Pembangun');
// harian
els.tab_harian.click();step(12);A.strictEqual(els.misiList.children.length,5);const gB=sv().gems;els.loginBtn.click();A.ok(sv().daily.streak>=1);els.loginBtn.click();console.log('✓ log masuk harian dituntut (streak',sv().daily.streak+'), 5 misi dipaparkan');
// lompat stage
els.trStage.click();els.jumpRow.hidden=true;els.stageName.click();A.strictEqual(els.jumpRow.hidden,false);els.jumpIn.value='37';els.jumpGo.click();A.ok(els.stageName.textContent.startsWith('Stage 37'));els.jumpP10.click();A.ok(els.stageName.textContent.startsWith('Stage 47'));els.jumpBest.click();console.log('✓ lompat stage:',els.stageName.textContent);
// auto-jual
els.autoSell.fire('change','2');A.strictEqual(sv().autoSell,2);console.log('✓ auto-jual ≤ Jarang');
// eksport/import
els.tab_info.click();els.exportBtn.click();const code=els.saveCode.value;A.ok(code.startsWith('ZC5:'));const bestNow=sv().best;els.btnReset.click();A.strictEqual(sv().best,1);els.saveCode.value=code;els.importBtn.click();A.strictEqual(sv().best,bestNow);console.log('✓ eksport → reset → import: stage terbaik',bestNow,'dipulihkan');
els.saveCode.value='rosak';els.importBtn.click();A.strictEqual(sv().best,bestNow);console.log('✓ kod rosak ditolak');
// tetapan bunyi
els.musicVol.fire('input',20);A.strictEqual(sv().settings.music,0.2);console.log('✓ tetapan muzik');
// tutorial
els.tutAgain.click();A.strictEqual(sv().tut,0);A.strictEqual(els.tutBox.hidden,false);els.tab_hero.click();if(!els.overlay.hidden)els.ovBtns.children[0].click();A.strictEqual(sv().tut,1);els.tutNext.click();A.strictEqual(sv().tut,2);els.tutSkip.click();A.strictEqual(sv().tut,99);console.log('✓ tutorial: mula → langkah 2 → langkau');
// ---------- v5.1: Arena ----------
els.tab_arena.click();step(12);A.strictEqual(els.perkList.children.length,5);A.strictEqual(els.chalList.children.length,6);console.log('✓ Arena: 5 kelebihan Roh, 6 cabaran');
els.trStage.click();els.trStage.click();els.trHero.click();els.trGold2.click();els.tab_arena.click();step(12);
const bestB=sv().best;A.ok(bestB>=60);const gems0=sv().gems;els.prestigeBtn.click();step(3);const S1=sv();A.strictEqual(S1.best,1);A.ok(S1.roh>0);A.strictEqual(S1.gems,gems0);console.log('✓ Kebangkitan dari stage',bestB,'→ +'+S1.roh+' Roh, gems kekal');
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
// DPS & getaran
els.btnDps.click();step(40);els.btnDps.click();els.tab_info.click();els.vibBtn.click();A.strictEqual(sv().settings.vib,false);els.vibBtn.click();console.log('✓ meter DPS & getaran');
// menara
els.trGold2.click();els.tab_pagar.click();step(6);A.strictEqual(els.towerList.children.length,3);const tc=els.towerList.children[0];tc.querySelectorAll('.tt')[1].click();A.strictEqual(sv().towers[0].type,'meriam');tc.querySelector('.x10').click();A.strictEqual(sv().towers[0].lvl,11);
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
els.trGod.click&&0;const Bx=global.window.ZC_DEBUG();Bx.god=false;els.trGoldIn.value='1e30';els.trGemsIn.value='';els.trSet.click();Bx.wall=0;step(3);console.log('  [nyahpepijat] tajuk:',els.ovTitle.textContent,'| keadaan:',Bx.state,'| sama battle:',Bx===global.window.ZC_DEBUG(),'| overlay tersembunyi:',els.overlay.hidden);A.ok(els.ovTitle.textContent==='Pagar roboh');const lbl=els.ovBtns.children.map(b=>b.textContent);A.ok(lbl[0].includes('Naik semua'));console.log('✓ skrin kalah:',lbl.join(' | '));
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
console.log('Ujian asap UI v4 lulus');
