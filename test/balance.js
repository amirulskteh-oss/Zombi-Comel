require('vm').runInThisContext(require('fs').readFileSync(require('path').join(__dirname,'..','src','logic.js'),'utf8'));
const MAXB=+process.argv[2]||260, rng=mulberry(7);const s=defaultSave(0);let battles=0,evo=0;const log=[];
const wscore=w=>{const d=WEAPONS[w];return d.dmg*d.rate*(d.n||1)*(1+Math.min(3,(d.pierce||1)-1)*0.3)*(d.splash?1.8:1)*(d.chain?1+d.chain*0.4:1)*wpnLvlMult(s.weapons[w])};
function spend(){
  let loop=true;while(loop){loop=false;
    HERO_ORDER.forEach(h=>{if(!s.heroes[h]&&unlockHero(s,h).ok)loop=true;});
    HERO_ORDER.forEach(h=>{if(s.heroes[h])while(starUp(s,h).ok)loop=true;});
    const np=POWER_ORDER.find(p=>!s.powers[p]);
    {const nw=HERO_ORDER.filter(h=>s.heroes[h]&&heroWeapon(s,h)==='batu').sort((a,b)=>HEROES[b].tier-HEROES[a].tier)[0];if(nw){const cs=WEAPON_ORDER.filter(w=>!s.weapons[w]&&inClass(nw,w)).sort((a,b)=>WEAPONS[a].rar-WEAPONS[b].rar),c=cs.find(w=>canBuyWeapon(w));if(c&&unlockWeapon(s,c).ok){autoArm(s);loop=true;}else if(!c&&cs[0]){if(s.wtarget!==cs[0])setWTarget(s,cs[0]);if(s.gems>=100&&openWChest(s,'emas',rng,battles*6e5).ok){autoArm(s);loop=true;}}}}
    while(s.wpeti.leg>0||s.wpeti.kayu>0||wFreeKayu(s,battles*6e5)){if(!openWChest(s,s.wpeti.leg>0?'legenda':'kayu',rng,battles*6e5).ok)break;autoArm(s);}
    Object.keys(s.weapons).forEach(w=>{while(wStarUp(s,w).ok)loop=true;});
    if(s.slots<MAX_SLOTS&&s.team.length>=s.slots&&s.gems>=SLOT_COST[s.slots+1]){buySlot(s);loop=true;}
    else if(np&&s.gems>=POWERS[np].harga+30){unlockPower(s,np);loop=true;}
    else if(s.gems>=80){openHeroChest(s,'hero',rng);loop=true;}
  }
  const own=HERO_ORDER.filter(id=>s.heroes[id]);own.sort((a,b)=>heroStats(s,b,0).dmg*WEAPONS[heroWeapon(s,b)].rate-heroStats(s,a,0).dmg*WEAPONS[heroWeapon(s,a)].rate);s.team=own.slice(0,s.slots);
  {const used=new Set();s.heroWpn={};s.team.forEach(h=>{const w=Object.keys(s.weapons).filter(x=>!used.has(x)&&canEquip(h,x)).sort((a,b)=>weaponScore(s,h,b)-weaponScore(s,h,a))[0];if(w){s.heroWpn[h]=w;used.add(w);}});autoArm(s);}
  autoEquipBest(s);sellAllBelow(s,1);
  for(let k=0;k<3000;k++){const opts=[];s.team.forEach(h=>opts.push([upCost(s.heroes[h]),()=>upgradeHero(s,h,1)]));
    [...new Set(s.team.map(h=>heroWeapon(s,h)))].forEach(w=>opts.push([wpnCost(w,s.weapons[w]),()=>upgradeWeapon(s,w,1)]));
    ['damage','wall','speed'].forEach(id=>opts.push([shopCost(id,s.shop[id]),()=>buyShop(s,id)]));
    Object.keys(s.powers).forEach(p=>opts.push([powCost(p,s.powers[p])*2,()=>upgradePower(s,p,1)]));
    if(s.wallsOwned<50)opts.push([wallCost(s.wallsOwned),()=>buyWall(s)]);
    s.items.filter(i=>whoEquips(s,i.uid)).forEach(i=>opts.push([forgeCost(i)*1.5,()=>forgeItem(s,i.uid)]));
    opts.sort((a,b)=>a[0]-b[0]);if(s.gold<opts[0][0])break;opts[0][1]();}
}
const t0=Date.now();
while(battles<MAXB&&Date.now()-t0<55000){spend();const st=s.best;const b=new Battle(s,st,rng);b.autoPower=true;const r=b.simulate(1200);battles++;evo+=b.evolved;
  if(r==='menang'&&st%10===0)log.push(`s${st}@${battles}`);}
console.log(log.join('  '));console.log('hero',Object.keys(s.heroes).length,'bintang',JSON.stringify(s.stars));console.log('akhir best',s.best,'pertempuran',battles,'evolusi',evo,'pagar',WALLS[s.wallActive].nama,'senjata',Object.keys(s.weapons).length,'item',s.items.length,'rar max',Math.max(...s.items.map(i=>i.rar)));
