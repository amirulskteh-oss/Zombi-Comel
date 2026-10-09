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
// ================= Ujian teknikal bunyi (memerlukan: npm i --no-save node-web-audio-api) =================
// Menjana setiap bunyi dalam senarai Uji Bunyi ke memori & mengukur: tidak senyap, tidak pecah, tempoh munasabah.
// Ini TIDAK menilai sama ada bunyi sedap didengar — itu perlu telinga manusia (halaman Ensiklopedia → Bunyi).
let WA; try { WA = require('node-web-audio-api'); } catch (e) { try { WA = require('/tmp/aud/node_modules/node-web-audio-api'); } catch (e2) { console.log('⚠ node-web-audio-api tiada; ujian bunyi dilangkau'); process.exit(0); } }
const ZA = global.window.ZC_AUDIO; if (!ZA) { console.error('ZC_AUDIO tiada (binaan DEV?)'); process.exit(1); }
const SR = 22050, MASTER = 0.6 * 0.7; // kelantangan lalai: sfx 0.7 × 0.6
(async () => {
  const rows = [], bad = [];
  for (const [grp, items] of ZA.list) for (const [name, arg, label] of items) {
    if (name === 'amb') continue;
    const c = new WA.OfflineAudioContext(2, Math.floor(SR * 3), SR); ZA.attach(c); ZA.AU.last = {};
    try { ZA.sfx(name, arg); } catch (e) { bad.push(label + ': RALAT ' + e.message); continue; }
    const buf = await c.startRendering(); let peak = 0, sum = 0, last = 0; const L = buf.getChannelData(0), Rr = buf.getChannelData(1);
    for (let i = 0; i < L.length; i++) { const v = Math.max(Math.abs(L[i]), Math.abs(Rr[i])); if (v > peak) peak = v; sum += v * v; if (v > 0.002) last = i; }
    const rms = Math.sqrt(sum / L.length), dur = last / SR, out = peak * MASTER;
    rows.push([grp.replace(/^\S+ /, ''), label, out, dur]);
    if (peak < 0.005) bad.push(label + ': SENYAP'); else if (out > 0.98) bad.push(label + ': PECAH (puncak ' + out.toFixed(2) + ')'); else if (dur > 2.9) bad.push(label + ': terlalu panjang (' + dur.toFixed(1) + ' s)');
  }
  const loud = rows.slice().sort((a, b) => b[2] - a[2]);
  console.log('Bunyi diuji: ' + rows.length + ' · paling kuat: ' + loud.slice(0, 3).map(r => r[1] + ' ' + r[2].toFixed(2)).join(', ') + ' · paling perlahan: ' + loud.slice(-3).map(r => r[1] + ' ' + r[2].toFixed(3)).join(', '));
  console.log('Tempoh terpanjang: ' + rows.slice().sort((a, b) => b[3] - a[3]).slice(0, 3).map(r => r[1] + ' ' + r[3].toFixed(2) + ' s').join(', '));
  if (bad.length) { console.error('✗ ' + bad.join('\n✗ ')); process.exit(1); }
  console.log('✓ semua ' + rows.length + ' bunyi: tidak senyap, tidak pecah (puncak < 0.98 pada kelantangan lalai), tempoh < 3 s');
  console.log('Ujian bunyi lulus');
})().catch(e => { console.error(e); process.exit(1); });
