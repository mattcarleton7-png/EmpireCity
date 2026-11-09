// Neon Palace casino floor: all the maths for the walk-in games. No drawing and no game state in here.
// Shared games (Duck Derby, Big Wheel, Moonshot) work out each round from the clock, so everyone
// standing at a machine sees the same race, spin or flight, with or without the server.
(function(root,make){const api=make();if(typeof module==='object'&&module.exports)module.exports=api;else root.PG=api})(this,function(){
'use strict';
function rng(seed){let a=seed>>>0;return function(){a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const seeded=k=>{const r=rng(hash(k));r();r();return r};
const roll=()=>{try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296}catch(e){return Math.random()}};
const cut=(v,d)=>Math.floor(v*d+1e-9)/d;

// ---------- Duck Derby: shared six-duck race ----------
const DUCK={bet:15000,race:14000,end:5000,period:34000,n:6,rtp:.96,
  names:['Sir Quacks','Big Bill','Puddles','Waddles','Mrs Feathers','Lucky Lou'],colors:['#ffd23f','#ff5fb0','#4ff0ff','#9dff4f','#ff8a3d','#b98cff']};
function duckRound(id){
  const r=seeded('duck:'+id),n=DUCK.n,w=[];for(let i=0;i<n;i++)w.push(.6+r()*r()*5);
  const sum=w.reduce((a,b)=>a+b),p=w.map(v=>v/sum),left=p.map((v,i)=>i),order=[];
  while(left.length){let u=r()*left.reduce((a,i)=>a+p[i],0),k=0;for(;k<left.length-1;k++){u-=p[left[k]];if(u<=0)break}order.push(left.splice(k,1)[0])}
  const T=new Array(n);order.forEach((d,rank)=>{T[d]=1+rank*(.02+r()*.014)});
  const wob=p.map(()=>[0,1,2].map(()=>[.02+r()*.05,1+r()*3.5,r()*6.283]));
  return{id,p,odds:p.map(v=>Math.max(1.1,cut(DUCK.rtp/v,20))),win:order[0],order,T,wob};
}
function duckPos(rd,i,u){const x=u/rd.T[i],e=Math.sin(Math.PI*Math.min(1,Math.max(0,x)));let s=0;for(const[a,f,ph]of rd.wob[i])s+=a*Math.sin(f*x*6.283+ph);return Math.max(0,x+e*s)}
function duckNow(now){const id=Math.floor(now/DUCK.period),t=now-id*DUCK.period;return{id,t,phase:t<DUCK.bet?'bet':t<DUCK.bet+DUCK.race?'race':'end',u:t<DUCK.bet?0:Math.min(1.14,(t-DUCK.bet)/DUCK.race),left:(t<DUCK.bet?DUCK.bet-t:DUCK.period-t)}}

// ---------- Big Wheel: shared wheel, 50 segments ----------
const WHEEL={bet:15000,spin:8000,end:4500,period:27500,keys:['x2','x3','x6','x24'],pays:{x2:2,x3:3,x6:6,x24:24},cols:{x2:'#2f6bff',x3:'#19c6b4',x6:'#ff8a3d',x24:'#ff3d9a'},
  counts:{x2:24,x3:16,x6:8,x24:2}};
WHEEL.segs=(()=>{const a=[];for(const k of WHEEL.keys)for(let i=0;i<WHEEL.counts[k];i++)a.push(k);const r=seeded('wheel-layout');for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a})();
function wheelRound(id){const r=seeded('wheel:'+id),seg=Math.floor(r()*WHEEL.segs.length);return{id,seg,key:WHEEL.segs[seg],turns:5+Math.floor(r()*3),off:(r()-.5)*.7}}
function wheelNow(now){const id=Math.floor(now/WHEEL.period),t=now-id*WHEEL.period;return{id,t,phase:t<WHEEL.bet?'bet':t<WHEEL.bet+WHEEL.spin?'spin':'end',u:t<WHEEL.bet?0:Math.min(1,(t-WHEEL.bet)/WHEEL.spin),left:(t<WHEEL.bet?WHEEL.bet-t:WHEEL.period-t)}}

// ---------- Moonshot: shared rocket, cash out before it blows ----------
const CRASH={bet:8000,end:3500,cycle:300000,k:.18,cap:30,rtp:.97};
const crashPoint=r=>Math.max(1,Math.min(CRASH.cap,cut(CRASH.rtp/(1-r),100)));
const flightMs=m=>Math.log(m)/CRASH.k*1000;
function crashNow(now){
  const cyc=Math.floor(now/CRASH.cycle),end=(cyc+1)*CRASH.cycle;let t=cyc*CRASH.cycle,i=0;
  for(;;){const m=crashPoint(seeded('crash:'+cyc+':'+i)()),b=t+CRASH.bet,e=b+flightMs(m),n=e+CRASH.end;
    if(n>end)return{id:null,phase:'wait',left:end-now,m:1,mult:1};
    if(now<n){const phase=now<b?'bet':now<e?'fly':'end';return{id:cyc+':'+i,phase,m,left:phase==='bet'?b-now:n-now,mult:phase==='bet'?1:phase==='fly'?Math.min(m,cut(Math.exp(CRASH.k*(now-b)/1000),100)):m,orbit:m>=CRASH.cap}}
    t=n;i++}
}

// ---------- Lucky Reels: three-reel slot ----------
const SLOT={syms:['7','GEM','BELL','BAR','CHERRY','LEMON'],weights:[2,3,5,6,8,10],pays:[250,100,40,20,10,6],twoCherry:2.5};
function slotSpin(r){r=r||roll;const tot=SLOT.weights.reduce((a,b)=>a+b),one=()=>{let u=r()*tot;for(let i=0;i<6;i++){u-=SLOT.weights[i];if(u<0)return i}return 5};return[one(),one(),one()]}
function slotPay(a){if(a[0]===a[1]&&a[1]===a[2])return SLOT.pays[a[0]];if(a.filter(x=>x===4).length===2)return SLOT.twoCherry;return 0}

// ---------- Minefield ----------
const MINES={cells:25,rtp:.97};
function minesMult(mines,safe){let m=MINES.rtp;for(let i=0;i<safe;i++)m*=(MINES.cells-i)/(MINES.cells-mines-i);return safe?cut(m,100):1}
function minesLayout(mines,r){r=r||roll;const a=[...Array(MINES.cells).keys()];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return new Set(a.slice(0,mines))}

// ---------- Skull Tower: climb, one wrong tile and you drop ----------
const TOWER={rows:8,rtp:.97,modes:{Easy:{tiles:4,traps:1},Medium:{tiles:3,traps:1},Hard:{tiles:2,traps:1}}};
function towerMult(mode,row){const c=TOWER.modes[mode],p=(c.tiles-c.traps)/c.tiles;return row?cut(TOWER.rtp/Math.pow(p,row),100):1}
function towerTrap(mode,r){r=r||roll;const c=TOWER.modes[mode];return Math.floor(r()*c.tiles)}

// ---------- Plinko ----------
const PLINKO={rows:12,tables:{Low:[9.8,3,1.6,1.4,1.1,1,.5,1,1.1,1.4,1.6,3,9.8],Medium:[32,11,4,2,1.1,.6,.3,.6,1.1,2,4,11,32],High:[165,24,8,2,.7,.2,.2,.2,.7,2,8,24,165]}};
function plinkoPath(r){r=r||roll;const p=[];for(let i=0;i<PLINKO.rows;i++)p.push(r()<.5?0:1);return p}
const plinkoSlot=p=>p.reduce((a,b)=>a+b,0);

// ---------- Hi-Lo Dial: set the dial, call higher or lower ----------
const DIAL={rtp:.97,min:4,max:96};
function dialChance(mark,side){return(side==='hi'?100-mark:mark)/100}
function dialMult(mark,side){return cut(DIAL.rtp/dialChance(mark,side),100)}
function dialRoll(r){r=r||roll;return Math.floor(r()*10000)/100}
const dialWin=(n,mark,side)=>side==='hi'?n>=mark:n<mark;

// ---------- Keno: 40 tiles, 10 drawn ----------
const KENO={tiles:40,draw:10,maxPick:10,rtp:.95};
function choose(n,k){if(k<0||k>n)return 0;let v=1;for(let i=1;i<=k;i++)v=v*(n-k+i)/i;return v}
function kenoChance(pick,hit){return choose(pick,hit)*choose(KENO.tiles-pick,KENO.draw-hit)/choose(KENO.tiles,KENO.draw)}
function kenoTable(pick){
  const min=pick<=3?1:pick<=6?2:3,raw=[];for(let h=0;h<=pick;h++)raw.push(h<min?0:Math.pow(3.2,h-min+1)/(1+Math.max(0,pick-h)*.25));
  let ev=0;raw.forEach((v,h)=>ev+=v*kenoChance(pick,h));const s=KENO.rtp/ev;return raw.map(v=>v?cut(v*s,10):0);
}
function kenoDraw(r){r=r||roll;const a=[...Array(KENO.tiles).keys()];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,KENO.draw)}

// ---------- Street Dice: pass-line craps ----------
function diceStep(point,a,b){const t=a+b;
  if(!point){if(t===7||t===11)return{res:'win',point:0,t};if(t===2||t===3||t===12)return{res:'lose',point:0,t};return{res:'point',point:t,t}}
  if(t===point)return{res:'win',point:0,t};if(t===7)return{res:'lose',point:0,t};return{res:'again',point,t}}
const die=r=>1+Math.floor((r||roll)()*6);

// ---------- Video Poker: 9/6 Jacks or Better ----------
const VP={names:['Royal Flush','Straight Flush','Four of a Kind','Full House','Flush','Straight','Three of a Kind','Two Pair','Jacks or Better'],pays:[800,50,25,9,6,4,3,2,1]};
// a card is 0-51: rank = c%13 (0 is a two, 12 is an ace), suit = c>>2 of the 13s
const rankOf=c=>c%13,suitOf=c=>Math.floor(c/13);
function deck(r){r=r||roll;const a=[...Array(52).keys()];for(let i=51;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function vpEval(h){
  const rs=h.map(rankOf).sort((a,b)=>a-b),fl=h.every(c=>suitOf(c)===suitOf(h[0])),cnt={};rs.forEach(x=>cnt[x]=(cnt[x]||0)+1);
  const gs=Object.values(cnt).sort((a,b)=>b-a),uniq=gs.length===5;
  const wheel=rs.join()==='0,1,2,3,12',st=uniq&&(rs[4]-rs[0]===4||wheel);
  if(fl&&st&&rs[0]===8)return 0;if(fl&&st)return 1;if(gs[0]===4)return 2;if(gs[0]===3&&gs[1]===2)return 3;if(fl)return 4;if(st)return 5;if(gs[0]===3)return 6;if(gs[0]===2&&gs[1]===2)return 7;
  if(gs[0]===2){const p=+Object.keys(cnt).find(k=>cnt[k]===2);if(p>=9)return 8}
  return -1;
}
return{rng,hash,seeded,roll,DUCK,duckRound,duckPos,duckNow,WHEEL,wheelRound,wheelNow,CRASH,crashPoint,crashNow,flightMs,SLOT,slotSpin,slotPay,MINES,minesMult,minesLayout,TOWER,towerMult,towerTrap,PLINKO,plinkoPath,plinkoSlot,DIAL,dialChance,dialMult,dialRoll,dialWin,KENO,kenoChance,kenoTable,kenoDraw,diceStep,die,VP,rankOf,suitOf,deck,vpEval};
});
