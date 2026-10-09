// ===== Tiruan Google Play Billing (ikut dokumentasi Chrome: Digital Goods API + PaymentRequest) =====
const TQ=[],CALLS=[];let PENDING=[{itemId:'gems_850',purchaseToken:'OLD-1'}],SHOW_MODE='ok';
const SVC={
  async getDetails(ids){CALLS.push('details:'+ids.join(','));const P={penyokong:'3.90',gems_300:'3.90',gems_850:'9.90',gems_1800:'19.90',tangan_pembantu:'19.90'};return ids.map(id=>({itemId:id,title:id,price:{currency:'MYR',value:P[id]}}));},
  async listPurchases(){CALLS.push('list');return PENDING.slice();},
  async consume(tok){CALLS.push('consume:'+tok);const sv=JSON.parse(globalThis.__LS.zombi_comel_save_v1||'{}');CONSUME_SAVED[tok]=!!(sv.iap&&sv.iap.tok&&sv.iap.tok.includes(tok));PENDING=PENDING.filter(p=>p.purchaseToken!==tok);}
};
const CONSUME_SAVED={};
global.PaymentRequest=class{constructor(m,d){this.m=m;CALLS.push('pr:'+m[0].supportedMethods+'|'+m[0].data.sku);}
  show(){if(SHOW_MODE==='abort'){const e=new Error('batal');e.name='AbortError';return Promise.reject(e);}const sku=this.m[0].data.sku;return Promise.resolve({details:{purchaseToken:'TOK-'+sku+'-'+CALLS.length},complete:async s=>{CALLS.push('complete:'+s);}});}};
const fs=require('fs');const path=require('path');const html=fs.readFileSync(path.join(__dirname,'..','docs','index.html'),'utf8');const INLINE=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));
const ctxStub=new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='measureText'?()=>({width:10}):k.includes('Gradient')?()=>({addColorStop(){}}):()=>{}),set:(t,k,v)=>(t[k]=v,true)});
function mk(tag){const e={tag,textContent:'',innerHTML:'',value:'',hidden:false,disabled:false,dataset:{},className:'',children:[],attrs:{},h:{},
 classList:{_s:new Set(),toggle(c,v){if(v===undefined)v=!this._s.has(c);v?this._s.add(c):this._s.delete(c);return v},add(c){this._s.add(c)},remove(c){this._s.delete(c)},contains(c){return this._s.has(c)}},style:{},setAttribute(k,v){this.attrs[k]=String(v)},getAttribute(k){return this.attrs[k]},addEventListener(e,f){(this.h[e]=this.h[e]||[]).push(f)},
 click(){(this.h.click||[]).forEach(f=>f({target:{closest:()=>null}}))},fire(ev,val){(this.h[ev]||[]).forEach(f=>f({target:{value:val,closest:()=>null}}))},appendChild(c){this.children.push(c)},getContext:()=>ctxStub,getBoundingClientRect:()=>({left:0,top:0,width:360,height:600}),
 querySelectorAll(s){if(!this.qa)this.qa={};if(!this.qa[s]){const cls=s.replace(/^\./,'');const re=new RegExp('<[a-z]+[^>]*class="[^"]*\\b'+cls+'\\b[^"]*"[^>]*>','g');this.qa[s]=(this.innerHTML.match(re)||[]).map(tag=>{const c=mk('el');(tag.match(/data-([a-z]+)="([^"]*)"/g)||[]).forEach(a=>{const m=/data-([a-z]+)="([^"]*)"/.exec(a);c.dataset[m[1]]=m[2];});return c;});}return this.qa[s]},querySelector(s){if(!this.q)this.q={};if(!this.q[s]){this.q[s]=mk(s);if(s==='select')this.q[s].value='pistol';}return this.q[s]}};let _ih='';Object.defineProperty(e,'innerHTML',{get(){return _ih},set(v){_ih=v;e.children=[];e.q={};e.qa={}}});return e;}
const els={};[...html.matchAll(/id="([a-zA-Z_0-9]+)"/g)].forEach(m=>els[m[1]]=mk('el'));
const ls={zombi_comel_save_v1:JSON.stringify({v:3,gold:5000,gems:300,stage:3,best:4,cleared:[1,2,3],heroes:{pistol:6,shotgun:2},team:['pistol','shotgun'],slots:3,shop:{damage:2,speed:0,wall:1,tap:0,magnet:0,luck:0},items:[{uid:1,jenis:'senjata',rar:4,ilvl:3,base:0}],equip:{pistol:{senjata:1}},boost:{},nextUid:2,last:Date.now(),kills:100})};
global.localStorage={getItem:k=>k in ls?ls[k]:null,setItem:(k,v)=>ls[k]=String(v),removeItem:k=>delete ls[k]};
global.window={addEventListener(){},devicePixelRatio:1,getDigitalGoodsService:async m=>{CALLS.push("svc:"+m);return SVC}};let T=0;global.performance={now:()=>T};
let frameFn=null;global.requestAnimationFrame=f=>frameFn=f;global.confirm=()=>false;global.setTimeout=(f)=>{TQ.push(f);return TQ.length};global.clearTimeout=()=>{};
global.document={getElementById:i=>els[i],createElement:t=>mk(t),addEventListener(){},querySelectorAll:()=>[],hidden:false,body:{dataset:{},classList:{toggle(){},add(){},remove(){}}}};
require('vm').runInThisContext(INLINE);
globalThis.__LS=ls;
const A=require('assert');const sv=()=>JSON.parse(ls.zombi_comel_save_v1);const step=n=>{for(let i=0;i<n;i++){T+=33;frameFn(T)}};
const flush=()=>{const q=TQ.splice(0);q.forEach(f=>{try{f()}catch(e){}})};const tick=async(n=6)=>{for(let i=0;i<n;i++)await new Promise(r=>setImmediate(r));};
(async()=>{
step(3);flush();await tick(10);
// 1) mula: perkhidmatan Play, harga, pembelian tertangguh dipulihkan
A.ok(CALLS.includes('svc:https://play.google.com/billing'));A.ok(CALLS.some(c=>c.startsWith('details:penyokong,gems_300')));
A.ok(CALLS.includes('consume:OLD-1'));A.strictEqual(CONSUME_SAVED['OLD-1'],true,'mesti simpan sebelum consume');
const g0=sv().gems;console.log('✓ mula: harga dari Play, pembelian tertangguh dipulihkan & di-consume SELEPAS disimpan (gems '+g0+')');
if(els.tContinue)els.tContinue.click();if(!els.modal.hidden&&els.mBtns.children.length)els.mBtns.children[0].click();
els.navShop.click();els.kc_beli.click();step(12);
A.strictEqual(els.iapList.children.length,5);const c300=els.iapList.children[1];A.ok(/3[.,]90/.test(c300.innerHTML)&&c300.innerHTML.includes('Pek Gems Kecil'));A.ok(els.iapStatus.textContent.includes('Google Play'));
console.log('✓ Kedai → 💎 Beli: 5 produk dengan harga Play ('+c300.innerHTML.match(/RM[^<]*/)+')');
// 2) jawapan ibu bapa SALAH → tiada pembayaran dibuka
const nPR=()=>CALLS.filter(c=>c.startsWith('pr:')).length;
c300.querySelector('.buy').click();A.ok(els.mTitle.textContent.includes('ibu bapa'));let q=els.mBody.innerHTML.match(/(\d+) × (\d+) = \?/);A.ok(q,'soalan');
els.gateIn={value:String(+q[1]*+q[2]+1)};els.mBtns.children[0].click();await tick();A.strictEqual(nPR(),0);A.strictEqual(sv().gems,g0);console.log('✓ jawapan salah → pembayaran tidak dibuka');
// 3) jawapan BETUL → PaymentRequest → simpan → consume → complete
c300.querySelector('.buy').click();q=els.mBody.innerHTML.match(/(\d+) × (\d+) = \?/);els.gateIn={value:String(+q[1]*+q[2])};els.mBtns.children[0].click();await tick(10);
A.ok(CALLS.includes('pr:https://play.google.com/billing|gems_300'));A.strictEqual(sv().gems,g0+300);
const tok=Object.keys(CONSUME_SAVED).find(k=>k.startsWith('TOK-gems_300'));A.ok(tok);A.strictEqual(CONSUME_SAVED[tok],true,'disimpan sebelum consume');
const i1=CALLS.indexOf('consume:'+tok),i2=CALLS.indexOf('complete:success');A.ok(i1>=0&&i2>i1,'consume sebelum complete');console.log('✓ pembelian 300 gems: urutan PaymentRequest → simpan → consume → complete(success)');
// 4) token sama muncul semula dalam listPurchases → tiada gems berganda
PENDING=[{itemId:'gems_300',purchaseToken:tok}];els.iapRestore.click();await tick(10);A.strictEqual(sv().gems,g0+300);console.log('✓ token berulang tidak memberi gems dua kali');
// 5) pengguna batal di skrin Google → tiada perubahan
SHOW_MODE='abort';els.iapList.children[3].querySelector('.buy').click();q=els.mBody.innerHTML.match(/(\d+) × (\d+) = \?/);els.gateIn={value:String(+q[1]*+q[2])};els.mBtns.children[0].click();await tick(10);A.strictEqual(sv().gems,g0+300);SHOW_MODE='ok';console.log('✓ dibatalkan di Google Play → tiada caj, tiada perubahan');
// 6) Pek Penyokong
els.iapList.children[0].querySelector('.buy').click();q=els.mBody.innerHTML.match(/(\d+) × (\d+) = \?/);els.gateIn={value:String(+q[1]*+q[2])};els.mBtns.children[0].click();await tick(10);
A.strictEqual(sv().supporter,true);A.ok(sv().skins.pistol_penyokong!=null&&sv().skins.komander_penyokong!=null);step(12);A.ok(els.iapList.children[0].innerHTML.includes('Dimiliki'));A.strictEqual(els.supBadge.hidden,false);
console.log('✓ Pek Penyokong: kostum eksklusif, lencana ❤, kad "Dimiliki"');
els.pageBack.click();els.navTeam.click();els.pc_ekspedisi.click();step(15);A.strictEqual(els.expList.children.length,4);console.log('✓ slot ekspedisi ke-4 dibuka untuk penyokong');
A.ok(!CALLS.some(c=>c.startsWith('consume:TOK-penyokong')),'Penyokong sekali beli TIDAK di-consume');console.log('✓ Pek Penyokong tidak di-consume (Google Play mengingatnya)');
// 7) v9.16: Tangan Pembantu — sekali beli, tidak di-consume, kad Dimiliki, pemulihan tidak berganda
els.navShop.click();els.kc_beli.click();step(12);const cTP=els.iapList.children[4];A.ok(cTP.innerHTML.includes('Tangan Pembantu'));cTP.querySelector('.buy').click();q=els.mBody.innerHTML.match(/(\d+) × (\d+) = \?/);els.gateIn={value:String(+q[1]*+q[2])};els.mBtns.children[0].click();await tick(10);
A.ok(CALLS.includes('pr:https://play.google.com/billing|tangan_pembantu'));A.strictEqual(sv().tpb.own,true);A.ok(!CALLS.some(c=>c.startsWith('consume:TOK-tangan_pembantu')),'tidak di-consume');step(12);A.ok(els.iapList.children[4].innerHTML.includes('Dimiliki'));
const nIap=sv().iap.n;PENDING=[{itemId:'tangan_pembantu',purchaseToken:'TP-LAIN'}];els.iapRestore.click();await tick(10);A.strictEqual(sv().tpb.own,true);A.ok(!CALLS.includes('consume:TP-LAIN'));console.log('✓ Tangan Pembantu: dibeli, tidak di-consume, pemulihan selamat (iap.n '+nIap+'→'+sv().iap.n+')');
console.log('Ujian Play Billing (tiruan) lulus');
})().catch(e=>{console.error(e);process.exit(1);});
