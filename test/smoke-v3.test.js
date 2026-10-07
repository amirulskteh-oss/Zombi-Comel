const fs=require('fs');const path=require('path');const html=fs.readFileSync(path.join(__dirname,'..','docs','index.html'),'utf8');const INLINE=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));
const ctxStub=new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='measureText'?()=>({width:10}):k.includes('Gradient')?()=>({addColorStop(){}}):()=>{}),set:(t,k,v)=>(t[k]=v,true)});
function mk(tag){const e={tag,textContent:'',innerHTML:'',value:'',hidden:false,disabled:false,dataset:{},className:'',children:[],attrs:{},h:{},
 classList:{toggle(){},add(){},remove(){}},style:{},setAttribute(k,v){this.attrs[k]=String(v)},getAttribute(k){return this.attrs[k]},addEventListener(e,f){(this.h[e]=this.h[e]||[]).push(f)},
 click(){(this.h.click||[]).forEach(f=>f({target:{closest:()=>null}}))},fire(ev,val){(this.h[ev]||[]).forEach(f=>f({target:{value:val,closest:()=>null}}))},appendChild(c){this.children.push(c)},getContext:()=>ctxStub,getBoundingClientRect:()=>({left:0,top:0,width:360,height:600}),
 querySelectorAll(s){if(!this.qa)this.qa={};if(!this.qa[s]){const cls=s.replace(/^\./,'');const re=new RegExp('<[a-z]+[^>]*class="[^"]*\\b'+cls+'\\b[^"]*"[^>]*>','g');this.qa[s]=(this.innerHTML.match(re)||[]).map(tag=>{const c=mk('el');(tag.match(/data-([a-z]+)="([^"]*)"/g)||[]).forEach(a=>{const m=/data-([a-z]+)="([^"]*)"/.exec(a);c.dataset[m[1]]=m[2];});return c;});}return this.qa[s]},querySelector(s){if(!this.q)this.q={};if(!this.q[s]){this.q[s]=mk(s);if(s==='select')this.q[s].value='pistol';}return this.q[s]}};return e;}
const els={};[...html.matchAll(/id="([a-zA-Z_0-9]+)"/g)].forEach(m=>els[m[1]]=mk('el'));
const ls={zombi_comel_save_v1:JSON.stringify({v:2,gold:5000,gems:300,stage:3,best:4,cleared:[1,2,3],heroes:{pistol:6,shotgun:2},team:['pistol','shotgun'],slots:3,shop:{damage:2,speed:0,wall:1,tap:0,magnet:0,luck:0},items:[{uid:1,jenis:'senjata',rar:4,ilvl:3,base:0}],equip:{pistol:{senjata:1}},boost:{},nextUid:2,last:Date.now(),kills:100})};
global.localStorage={getItem:k=>k in ls?ls[k]:null,setItem:(k,v)=>ls[k]=String(v),removeItem:k=>delete ls[k]};
global.window={addEventListener(){},devicePixelRatio:1};let T=0;global.performance={now:()=>T};
let frameFn=null;global.requestAnimationFrame=f=>frameFn=f;global.confirm=()=>true;global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.document={getElementById:i=>els[i],createElement:t=>mk(t),addEventListener(){},querySelectorAll:()=>[],hidden:false,body:{dataset:{},classList:{toggle(){},add(){},remove(){}}}};
require('vm').runInThisContext(INLINE);
const A=require('assert');const sv=()=>JSON.parse(ls.zombi_comel_save_v1);const step=n=>{for(let i=0;i<n;i++){T+=33;frameFn(T)}};
els.devToggle.click();
A.strictEqual(sv().v,6);A.strictEqual(sv().items[0].rar,5);A.strictEqual(sv().heroes.pistol,6);A.ok(sv().weapons.shotgun);console.log('✓ save v2 dipindah ke v3 (Legenda lama → Mitos baharu, progress kekal)');
els.ovBtns.children[0].click();step(30*20);A.ok(sv().kills>100);console.log('✓ pertempuran berjalan');
els.trGems2.click();els.trGold2.click();console.log('✓ trainer gold/gems');
// Senjata
els.tab_senjata.click();A.strictEqual(els.pane_senjata.hidden,false);A.strictEqual(els.wpnList.children.length,32);console.log('✓ tab Senjata: 32 kad');
els.wpnList.children[31].querySelector('.up').click();A.ok(sv().weapons.tukul);console.log('✓ beli Tukul Halilintar');
els.wpnList.children[31].querySelector('.x10').click();A.strictEqual(sv().weapons.tukul,11);console.log('✓ naik senjata ×10');
els.heroList.children[0].querySelector('select').fire('change','tukul');A.strictEqual(sv().heroWpn.pistol,'tukul');console.log('✓ Pak Usu pasang Tukul Halilintar');
// Pagar
els.tab_pagar.click();A.strictEqual(els.wallList.children.length,50);console.log('✓ tab Pagar: 50 kad');
els.wallList.children[1].querySelector('.use').click();A.strictEqual(sv().wallsOwned,2);A.strictEqual(sv().wallActive,1);console.log('✓ bina pagar ke-2:',WALLS[1].nama);
els.wallList.children[0].querySelector('.use').click();A.strictEqual(sv().wallActive,0);console.log('✓ tukar pagar aktif');
els.trWall.click();A.strictEqual(sv().wallsOwned,50);console.log('✓ trainer buka 50 pagar, aktif:',WALLS[sv().wallActive].nama);
// Item & perisai
for(let i=0;i<5;i++)els.shopChest.children[3].querySelector('button').click();A.ok(sv().items.filter(i=>i.rar>=7).length>=5);console.log('✓ peti Kosmik × 5');
els.trItem.click();A.ok(sv().items.some(i=>i.rar===9));console.log('✓ item Abadi');
for(let i=0;i<8;i++)els.shopChest.children[2].querySelector('button').click();
els.autoEquip.click();const s=sv();console.log('✓ pasang terbaik — slot pagar:',s.wallEquip.join(','),'| perisai dalam beg:',s.items.filter(i=>i.jenis==='perisai').length);
A.ok(s.wallEquip.some(x=>x!=null)||s.items.filter(i=>i.jenis==='perisai').length===0);
els.f_perisai.click();els.f_semua.click();console.log('✓ penapis beg');
els.trWpn.click();A.strictEqual(Object.keys(sv().weapons).length,32);els.trHero.click();A.strictEqual(sv().team.length,6);console.log('✓ trainer semua senjata & hero');
els.trStage.click();els.stageNext.click();for(let i=0;i<60;i++)els.stageNext.click();els.ovBtns.children[0].click();
step(30*40);console.log('  40s di stage',sv().best-1,'— pertempuran tanpa ralat (dengan evolusi)');
els.trKill.click();els.trGod.click();step(30*10);console.log('✓ bunuh semua / pagar kebal');
els.btnReset.click();A.strictEqual(sv().wallsOwned,1);A.deepStrictEqual(sv().weapons,{pistol:1});console.log('✓ reset');
console.log('Ujian asap UI v3 lulus');
