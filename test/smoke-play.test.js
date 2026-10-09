const fs=require('fs');const path=require('path');const html=fs.readFileSync(path.join(__dirname,'..','docs','index.html'),'utf8');const INLINE=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));
const ctxStub=new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='measureText'?()=>({width:10}):k.includes('Gradient')?()=>({addColorStop(){}}):()=>{}),set:(t,k,v)=>(t[k]=v,true)});
function mk(tag){const e={tag,textContent:'',innerHTML:'',value:'',hidden:false,disabled:false,dataset:{},className:'',children:[],attrs:{},h:{},
 classList:{_s:new Set(),toggle(c,v){if(v===undefined)v=!this._s.has(c);v?this._s.add(c):this._s.delete(c);return v},add(c){this._s.add(c)},remove(c){this._s.delete(c)},contains(c){return this._s.has(c)}},style:{},setAttribute(k,v){this.attrs[k]=String(v)},getAttribute(k){return this.attrs[k]},addEventListener(e,f){(this.h[e]=this.h[e]||[]).push(f)},
 click(){(this.h.click||[]).forEach(f=>f({target:{closest:()=>null}}))},fire(ev,val){(this.h[ev]||[]).forEach(f=>f({target:{value:val,closest:()=>null}}))},appendChild(c){this.children.push(c)},getContext:()=>ctxStub,getBoundingClientRect:()=>({left:0,top:0,width:360,height:600}),
 querySelectorAll(s){if(!this.qa)this.qa={};if(!this.qa[s]){const cls=s.replace(/^\./,'');const re=new RegExp('<[a-z]+[^>]*class="[^"]*\\b'+cls+'\\b[^"]*"[^>]*>','g');this.qa[s]=(this.innerHTML.match(re)||[]).map(tag=>{const c=mk('el');(tag.match(/data-([a-z]+)="([^"]*)"/g)||[]).forEach(a=>{const m=/data-([a-z]+)="([^"]*)"/.exec(a);c.dataset[m[1]]=m[2];});return c;});}return this.qa[s]},querySelector(s){if(!this.q)this.q={};if(!this.q[s]){this.q[s]=mk(s);if(s==='select')this.q[s].value='pistol';}return this.q[s]}};let _ih='';Object.defineProperty(e,'innerHTML',{get(){return _ih},set(v){_ih=v;e.children=[];e.q={};e.qa={}}});return e;}
const els={};[...html.matchAll(/id="([a-zA-Z_0-9]+)"/g)].forEach(m=>els[m[1]]=mk('el'));
const ls={zombi_comel_save_v1:JSON.stringify({v:3,dev:true,gold:5000,gems:300,stage:3,best:4,cleared:[1,2,3],heroes:{pistol:6,shotgun:2},team:['pistol','shotgun'],slots:3,shop:{damage:2,speed:0,wall:1,tap:0,magnet:0,luck:0},items:[{uid:1,jenis:'senjata',rar:4,ilvl:3,base:0}],equip:{pistol:{senjata:1}},boost:{},nextUid:2,last:Date.now(),kills:100})};
global.localStorage={getItem:k=>k in ls?ls[k]:null,setItem:(k,v)=>ls[k]=String(v),removeItem:k=>delete ls[k]};
global.window={addEventListener(){},devicePixelRatio:1};let T=0;global.performance={now:()=>T};
let frameFn=null;global.requestAnimationFrame=f=>frameFn=f;global.confirm=()=>false;global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.document={getElementById:i=>els[i],createElement:t=>mk(t),addEventListener(){},querySelectorAll:()=>[],hidden:false,body:{dataset:{},classList:{toggle(){},add(){},remove(){}}}};
require('vm').runInThisContext(INLINE);
// ================= Ujian binaan Google Play =================
const A=require('assert');const sv=()=>JSON.parse(ls.zombi_comel_save_v1);const step=n=>{for(let i=0;i<n;i++){T+=33;frameFn(T)}};
const VM=require('vm');
// 1) tiada elemen trainer dalam HTML
['trainerBox','devToggle','trGold1','trGems1','trHero','trStage','trItem','trGod','trSkins','trGive'].forEach(id=>A.ok(!new RegExp('id="'+id+'"').test(html),'masih ada: '+id));
A.ok(INLINE.includes('const PLAY_BUILD = true;'));console.log('✓ HTML binaan Play tiada trainer / Mod Pembangun');
// 2) save yang cuba hidupkan dev → dipaksa mati
step(3);
// 3) tekan teks versi 10 kali → tiada apa-apa
for(let i=0;i<10;i++)els.verText.click();A.ok(!/Mod Pembangun/.test(els.toast.textContent||''));console.log('✓ tekan teks versi 10× tidak membuka Mod Pembangun');
// 4) game masih berfungsi penuh: mula pertempuran & bertempur
if(els.tContinue)els.tContinue.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();
els.hubStart.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();
const b=global.window.ZC_DEBUG();A.ok(b&&b.state==='main');step(30*20);A.ok(b.clock>5);console.log('✓ pertempuran berjalan (jam '+b.clock.toFixed(1)+' s, '+b.zombies.length+' zombie)');
els.btnPlay.click();A.strictEqual(sv().dev,false);console.log('✓ save dengan dev:true dipaksa dev:false (disahkan dalam storan)');
// 5) ciri pemain biasa tetap ada: dompet, kedai, ekspedisi
els.goldChip.click();A.strictEqual(els.mTitle.textContent,'💰 Tambah gold & gems');els.mBtns.children[0].click();
els.navTeam.click();els.pc_ekspedisi.click();step(15);A.strictEqual(els.expList.children.length,3);els.pageBack.click();console.log('✓ dompet, ekspedisi & halaman lain berfungsi');
// 5b) versi web (tiada Play Billing): pembelian tidak boleh dibuat, tiada simulasi
els.navShop.click();els.kc_beli.click();step(15);A.strictEqual(els.iapList.children.length,5);A.ok(els.iapStatus.textContent.includes('hanya dalam aplikasi'));const gB=sv().gems;els.iapList.children[1].querySelector('.buy').click();A.strictEqual(els.mTitle.textContent,'🛒 Pembelian');A.ok(els.mBody.innerHTML.includes('Versi web kekal percuma'));els.mBtns.children[0].click();A.strictEqual(sv().gems,gB);els.pageBack.click();console.log('✓ versi web: pembelian hanya dalam aplikasi Play, tiada simulasi');
// 6) fail sokongan Play
const fs2=require('fs'),P=require('path');const priv=fs2.readFileSync(P.join(__dirname,'..','docs','privasi.html'),'utf8');
['tidak mengumpul','does not collect','Kanak-kanak','Children','localStorage'].forEach(k=>A.ok(priv.includes(k),'privasi tiada: '+k));A.ok(!priv.includes('{{VERSI}}'));
if(priv.includes('[EMEL ANDA DI SINI]'))console.log('⚠ privasi.html: isi e-mel anda sebelum dihantar ke Google Play');
const man=JSON.parse(fs2.readFileSync(P.join(__dirname,'..','docs','manifest.webmanifest'),'utf8'));A.strictEqual(man.orientation,'portrait');A.ok(man.icons.some(i=>i.sizes==='512x512'&&i.purpose==='maskable'));
const dev=fs2.readFileSync(P.join(__dirname,'..','docs','dev','index.html'),'utf8');A.ok(dev.includes('id="trainerBox"')&&dev.includes("zombi_comel_dev_save_v1")&&!dev.includes('rel="manifest"'));
console.log('✓ privasi.html, manifest (potret, ikon maskable 512) & binaan dev/ berasingan');
console.log('Ujian binaan Play lulus');
