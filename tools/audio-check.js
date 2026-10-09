#!/usr/bin/env node
// Semakan bunyi luar talian: rakam setiap bunyi dalam SOUND_LIST, ukur puncak/RMS/tempoh, tulis WAV.
// Perlu pakej pilihan 'node-web-audio-api' (npm i node-web-audio-api). Tanpa pakej: dilangkau.
let WA; try { WA = require('node-web-audio-api'); } catch (e) { console.log('⏭ node-web-audio-api tiada — semakan bunyi dilangkau'); process.exit(0); }
const OUTDIR = process.argv[2] || require('path').join(__dirname, '..', 'bunyi-wav');
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
let frameFn=null;global.requestAnimationFrame=f=>frameFn=f;global.confirm=()=>true;global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.document={getElementById:i=>els[i],createElement:t=>mk(t),addEventListener(){},querySelectorAll:()=>[],hidden:false,body:{dataset:{},classList:{toggle(){},add(){},remove(){}}}};
require('vm').runInThisContext(INLINE);
const fs2 = require('fs'), P2 = require('path'); fs2.mkdirSync(OUTDIR, { recursive: true });
const wav = (buf, file) => { const n = buf.length, ch = buf.numberOfChannels, sr = buf.sampleRate, b = Buffer.alloc(44 + n * ch * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * ch * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(ch, 22); b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * ch * 2, 28); b.writeUInt16LE(ch * 2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * ch * 2, 40);
  const d = [...Array(ch)].map((_, c) => buf.getChannelData(c)); let o = 44; for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(d[c][i] * 32767))), o); o += 2; } fs2.writeFileSync(file, b); };
(async () => {
  const hook = global.window.ZC_AUDIO_TEST; if (!hook) { console.error('✗ ZC_AUDIO_TEST tiada (binaan dev diperlukan)'); process.exit(1); }
  let SL; hook(new WA.OfflineAudioContext(2, 100, 44100), a => { SL = a.SOUND_LIST; });
  const rows = [], bad = []; let k = 0;
  for (const [grp, list] of SL) for (const [n, arg, lab] of list) {
    const isAmb = n === 'amb', dur = isAmb ? 4 : 2.6, sr = 44100, c = new WA.OfflineAudioContext(2, Math.round(sr * dur), sr);
    hook(c, a => { if (isAmb) a.ambSet(arg); else a.sfx(n, arg, n === 'zGroan' ? 60 : undefined); });
    const buf = await c.startRendering(); const L = buf.getChannelData(0), R = buf.getChannelData(1);
    let pk = 0, last = 0, ss = 0, cnt = 0, pl = 0, pr = 0;
    for (let i = 0; i < L.length; i++) { const v = Math.max(Math.abs(L[i]), Math.abs(R[i])); if (v > pk) pk = v; if (v > 0.001) { last = i; ss += v * v; cnt++; } pl += Math.abs(L[i]); pr += Math.abs(R[i]); }
    const len = last / sr, rms = cnt ? Math.sqrt(ss / cnt) : 0, pan = pl + pr > 0 ? (pr - pl) / (pr + pl) : 0;
    const flags = []; if (pk < 0.01) flags.push('SENYAP'); if (pk > 0.98) flags.push('PECAH'); if (!isAmb && len > 2.45 && !/^(roar|bossDie)$/.test(n)) flags.push('PANJANG');
    const fname = String(++k).padStart(2, '0') + '-' + lab.replace(/[^\w\u00C0-\u024F]+/g, '-').replace(/-+$/, '').toLowerCase() + '.wav';
    wav(buf, P2.join(OUTDIR, fname));
    rows.push({ grp, lab, n, pk, rms, len, pan, flags }); if (flags.length) bad.push(lab + ': ' + flags.join(','));
  }
  let g0 = ''; for (const r of rows) { if (r.grp !== g0) { g0 = r.grp; console.log('\n' + g0); } console.log('  ' + (r.flags.length ? '✗' : '✓') + ' ' + r.lab.padEnd(26) + ' puncak ' + r.pk.toFixed(2) + ' · RMS ' + r.rms.toFixed(3) + ' · ' + r.len.toFixed(2) + ' s' + (Math.abs(r.pan) > 0.15 ? ' · stereo ' + (r.pan > 0 ? 'kanan' : 'kiri') : '') + (r.flags.length ? '  ⚠ ' + r.flags.join(', ') : '')); }
  console.log('\n' + rows.length + ' bunyi dirakam ke ' + OUTDIR + (bad.length ? ' · MASALAH: ' + bad.join(' | ') : ' · tiada masalah teknikal'));
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
