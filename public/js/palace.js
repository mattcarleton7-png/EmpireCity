// Neon Palace: the walk-in casino. A hall you walk around, with every game as a real thing in the room.
// The room shell is the original Empire City casino, rebuilt around a new game floor.
const PALT=()=>Date.now()+(window.PAL_OFFSET||0);
const LINE={slots:'Spin and match three',bj:'Beat the dealer to 21',bac:'Player, Banker or Tie',roul:'Bet on the spin',dice:'Roll 7 or hit your point',poker:'Keep the best five cards',plinko:'Drop a ball, edges pay most',crash:'Cash out before it blows',mines:'Find gems, dodge mines',duck:'Bet on the winning duck',wheel:'Bet on where it stops',tower:'Climb, avoid the skulls',dial:'Call higher or lower',keno:'Pick numbers, watch the draw'};
const GN={slots:'Lucky Reels',bj:'Blackjack',bac:'Baccarat',roul:'Roulette',dice:'Street Dice',poker:'Video Poker',plinko:'Plinko',crash:'Moonshot',mines:'Minefield',duck:'Duck Derby',wheel:'Big Wheel',tower:'Skull Tower',dial:'Hi-Lo Dial',keno:'Keno'};
const ST=[{k:'slots',x:-37,z:3,c:'#ffd23f',t:'SLOTS',o:1,sx:-43,sz:3},{k:'bj',x:-18,z:-6,c:'#4fd37a',t:'21',tb:[9,5,0x0b8a4a,0x053a20]},{k:'bac',x:-30,z:-14,c:'#b98cff',t:'BACCARAT',tb:[9,5,0x2a2fa0,0x12154a]},{k:'roul',x:0,z:-12,c:'#ff4fa8',t:'SPIN',tb:[11,5,0x9b1b30,0x3a0810]},
{k:'dice',x:18,z:-6,c:'#4ff0ff',t:'DICE',tb:[9,5,0x1b4a9b,0x0a1a3a]},{k:'poker',x:37,z:8,c:'#b14dff',t:'POKER',o:2,sx:43,sz:8},{k:'plinko',x:-24,z:-29,c:'#ff8a3d',t:'PLINKO',sx:-24,sz:-34.4,y:11.5},
{k:'crash',x:24,z:-29,c:'#ff3d71',t:'MOONSHOT',sx:24,sz:-34.4,y:11.5},{k:'mines',x:38,z:-14,c:'#9dff4f',t:'MINES',o:2,sx:43,sz:-14},{k:'duck',x:0,z:9,c:'#ffd23f',t:'DUCKS'},{k:'wheel',x:0,z:-27,c:'#ff5fb0',t:'WHEEL'},{k:'tower',x:-14,z:-24,c:'#9dff4f',t:'TOWER'},{k:'dial',x:-20,z:17,c:'#4ff0ff',t:'DIAL'},{k:'keno',x:20,z:17,c:'#9dff4f',t:'KENO'}];
const CAS=(function(){
const PAL=[0xff3d9a,0xffd23f,0x4ff0ff,0x9dff4f],GC={},MC={},BT=new Map(),MQ=[],DL=[],CH=[],GEMS=[],MK=[];
const RM=new T.Group();RM.position.set(OX,0,OZ);sc.add(RM);
const OLM=new T.MeshBasicMaterial({color:0x160a2c,side:T.BackSide});
const Mt=(c,o)=>{const k=c+(o?JSON.stringify(o):'');return MC[k]||(MC[k]=new T.MeshStandardMaterial(Object.assign({color:c,flatShading:true,roughness:.72,metalness:0,envMapIntensity:.3},o||{})))};
const Gl=c=>MC['g'+c]||(MC['g'+c]=new T.MeshBasicMaterial({color:c,toneMapped:false}));
const GOLD=Mt(0xd9a441,{metalness:.55,roughness:.38,envMapIntensity:.8});
const gk=(k,f)=>GC[k]||(GC[k]=f());
const Bx=(w,h,d)=>gk('b'+[w,h,d],()=>new T.BoxGeometry(w,h,d));
const Cy=(a,b,h,n)=>gk('c'+[a,b,h,n],()=>new T.CylinderGeometry(a,b,h,n||8));
const Ic=(r,d)=>gk('i'+[r,d],()=>new T.IcosahedronGeometry(r,d||0));
const Oc=r=>gk('o'+r,()=>new T.OctahedronGeometry(r,0));
const Cn=(r,h,n)=>gk('n'+[r,h,n],()=>new T.ConeGeometry(r,h,n||6));
const Tr=(r,t,a,b)=>gk('t'+[r,t,a,b],()=>new T.TorusGeometry(r,t,a||5,b||12));
const Pl=(w,h)=>gk('p'+[w,h],()=>new T.PlaneGeometry(w,h));
const Rg=(a,b)=>gk('r'+[a,b],()=>new T.RingGeometry(a,b,20));
function CB(w,h,d,r){return gk('x'+[w,h,d,r],()=>{r=Math.min(r,w/2-.02,h/2-.02);const b=Math.min(r*.5,d/2-.01),iw=w-2*b,ih=h-2*b,c=Math.max(r-b,.01),x=-iw/2,y=-ih/2,s=new T.Shape();
s.moveTo(x+c,y);s.lineTo(x+iw-c,y);s.lineTo(x+iw,y+c);s.lineTo(x+iw,y+ih-c);s.lineTo(x+iw-c,y+ih);s.lineTo(x+c,y+ih);s.lineTo(x,y+ih-c);s.lineTo(x,y+c);s.closePath();
const g=new T.ExtrudeGeometry(s,{depth:Math.max(d-2*b,.02),bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:1,curveSegments:1});g.center();return g})}
function Arch(w,h,d,b){return gk('a'+[w,h,d,b],()=>{const r=w/2-b,s=new T.Shape();s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h);s.absarc(0,h,r,0,PI,false);s.lineTo(-r,0);
const g=new T.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:1,curveSegments:6});g.translate(0,0,-(d-2*b)/2);return g})}
function Star(r1,r2,n,d){return gk('s'+[r1,r2,n,d],()=>{const s=new T.Shape();for(let i=0;i<n*2;i++){const a=i*PI/n-PI/2,r=i%2?r2:r1;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}s.closePath();const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});g.center();return g})}
function Ban(w,h){return gk('n'+[w,h],()=>{const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,-h);s.lineTo(0,-h+.9);s.lineTo(-w/2,-h);s.closePath();return new T.ExtrudeGeometry(s,{depth:.1,bevelEnabled:false})})}
// ---- static batching: parts are merged per material, so ~1000 props cost few draw calls
const BM=new T.Matrix4(),LM=new T.Matrix4(),p3=new T.Vector3(),s3=new T.Vector3(),qq=new T.Quaternion(),ee=new T.Euler();
function at(x,y,z,ry,fn,s){BM.compose(p3.set(x,y,z),qq.setFromEuler(ee.set(0,ry||0,0)),s3.set(s||1,s||1,s||1));fn();BM.identity()}
function bp(geo,m,mx){const g2=geo.index?geo.toNonIndexed():geo.clone();g2.applyMatrix4(mx);let a=BT.get(m);if(!a)BT.set(m,a=[]);a.push(g2)}
function S(geo,m,x,y,z,o){o=o||{};if(o.q)qq.copy(o.q);else qq.setFromEuler(ee.set(o.rx||0,o.ry||0,o.rz||0));
LM.compose(p3.set(x||0,y||0,z||0),qq,s3.set(o.sx||1,o.sy||1,o.sz||1));LM.premultiply(BM);bp(geo,m,LM);
if(o.ol){geo.computeBoundingBox();const b=geo.boundingBox,c=b.getCenter(new T.Vector3()),z3=b.getSize(new T.Vector3()),k=new T.Matrix4().makeTranslation(c.x,c.y,c.z).multiply(new T.Matrix4().makeScale(1+2*o.ol/Math.max(z3.x,.25),1+2*o.ol/Math.max(z3.y,.25),1+2*o.ol/Math.max(z3.z,.25))).multiply(new T.Matrix4().makeTranslation(-c.x,-c.y,-c.z));bp(geo,OLM,new T.Matrix4().multiplyMatrices(LM,k))}}
function flush(sh){BT.forEach((arr,m)=>{let n=0;arr.forEach(g=>n+=g.attributes.position.count);const PA=new Float32Array(n*3),NA=new Float32Array(n*3),UA=new Float32Array(n*2);let o=0;
arr.forEach(g=>{PA.set(g.attributes.position.array,o*3);NA.set(g.attributes.normal.array,o*3);if(g.attributes.uv)UA.set(g.attributes.uv.array,o*2);o+=g.attributes.position.count});
const G=new T.BufferGeometry();G.setAttribute('position',new T.BufferAttribute(PA,3));G.setAttribute('normal',new T.BufferAttribute(NA,3));G.setAttribute('uv',new T.BufferAttribute(UA,2));
const me=new T.Mesh(G,m);me.castShadow=sh&&!m.isMeshBasicMaterial;me.receiveShadow=!m.isMeshBasicMaterial;RM.add(me)});BT.clear()}
// animated (non-merged) part with optional outline shell
function PT(p,geo,m,x,y,z,ol,o){o=o||{};const me=new T.Mesh(geo,m);me.position.set(x,y,z);if(o.rx)me.rotation.x=o.rx;if(o.rz)me.rotation.z=o.rz;if(o.ry)me.rotation.y=o.ry;if(o.s)me.scale.set(o.s[0],o.s[1],o.s[2]);me.castShadow=!m.isMeshBasicMaterial;p.add(me);
if(ol){geo.computeBoundingBox();const b=geo.boundingBox,om=new T.Mesh(geo,OLM);om.scale.set(1+2*ol/Math.max(b.max.x-b.min.x,.25),1+2*ol/Math.max(b.max.y-b.min.y,.25),1+2*ol/Math.max(b.max.z-b.min.z,.25));me.add(om)}return me}
const colr=(a,b,c,d)=>bl.push([OX+a,OX+b,OZ+c,OZ+d]);
const hex=s=>parseInt(s.slice(1),16),css=n=>'#'+n.toString(16).padStart(6,'0');
// ---- textures
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function mqTex(txt,col,w,h,ph){const t=cvs(512,Math.round(512*h/w),(g,W,H)=>{const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#2e1068');gr.addColorStop(1,'#14082e');g.fillStyle=gr;g.fillRect(0,0,W,H);
const n=Math.round(W/30);for(let i=0;i<n;i++){const x=14+i*(W-28)/(n-1);for(const y of[11,H-11]){g.fillStyle=(i+ph)%2?'#ffe27a':'#6a5a40';g.beginPath();g.arc(x,y,6,0,7);g.fill()}}
const m=Math.round(H/30);for(let i=1;i<m;i++){const y=11+i*(H-22)/m;for(const x of[11,W-11]){g.fillStyle=(i+ph)%2?'#ffe27a':'#6a5a40';g.beginPath();g.arc(x,y,6,0,7);g.fill()}}
let fs=H*.6;g.textAlign='center';g.textBaseline='middle';g.font='900 '+fs+'px "Trebuchet MS",Arial,sans-serif';while(g.measureText(txt).width>W-80&&fs>20){fs-=4;g.font='900 '+fs+'px "Trebuchet MS",Arial,sans-serif'}
g.lineJoin='round';g.lineWidth=fs*.2;g.strokeStyle='#160a2c';g.strokeText(txt,W/2,H/2+2);g.shadowColor=col;g.shadowBlur=18;g.fillStyle=col;g.fillText(txt,W/2,H/2+2);g.shadowBlur=0;g.fillStyle='rgba(255,255,255,.35)';g.fillText(txt,W/2,H/2-fs*.04)});t.wrapS=t.wrapT=T.ClampToEdgeWrapping;return t}
function Marq(txt,col,w,h,x,y,z,ry){const A=mqTex(txt,col,w,h,0),B=mqTex(txt,col,w,h,1),m=new T.MeshBasicMaterial({map:A,toneMapped:false});MQ.push({m,A,B});
at(x,y,z,ry,()=>{S(CB(w+.7,h+.7,.5,.28),GOLD,0,0,0,{ol:.08});S(Pl(w,h),m,0,0,.27)})}
function sym(g,k,x,y,s){g.save();g.translate(x,y);
if(k===0){g.font='900 '+s*1.5+'px Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=s*.14;g.strokeStyle='#fff';g.strokeText('7',0,2);g.fillStyle='#e8123f';g.fillText('7',0,2)}
else if(k===1){g.fillStyle='#e8123f';g.beginPath();g.arc(-s*.28,s*.3,s*.3,0,7);g.fill();g.beginPath();g.arc(s*.28,s*.36,s*.3,0,7);g.fill();g.strokeStyle='#2a9d3f';g.lineWidth=s*.12;g.beginPath();g.moveTo(-s*.28,s*.1);g.quadraticCurveTo(0,-s*.5,s*.1,-s*.6);g.moveTo(s*.28,s*.16);g.quadraticCurveTo(s*.2,-s*.4,s*.1,-s*.6);g.stroke()}
else if(k===2){g.fillStyle='#111';rr(g,-s*.6,-s*.3,s*1.2,s*.6,6);g.fill();g.fillStyle='#fff';g.font='900 '+s*.5+'px Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('BAR',0,2)}
else if(k===3){g.fillStyle='#35e0ff';g.beginPath();g.moveTo(0,-s*.6);g.lineTo(s*.5,0);g.lineTo(0,s*.6);g.lineTo(-s*.5,0);g.closePath();g.fill();g.strokeStyle='#fff';g.lineWidth=s*.08;g.stroke()}
else{g.fillStyle='#ffc94a';g.beginPath();g.arc(0,-s*.05,s*.42,0,7);g.fill();g.fillStyle='#b8860b';g.fillRect(-s*.12,s*.3,s*.24,s*.16)}g.restore()}
function reelTex(a,b,c){return cvs(256,160,(g,w,h)=>{g.fillStyle='#0d0633';g.fillRect(0,0,w,h);[a,b,c].forEach((k,i)=>{const x=14+i*80;g.fillStyle='#fffdf2';rr(g,x,14,72,132,10);g.fill();sym(g,k,x+36,80,40)});g.strokeStyle='#ff3d71';g.lineWidth=3;g.beginPath();g.moveTo(6,80);g.lineTo(250,80);g.stroke()})}
function cardsTex(){return cvs(256,160,(g,w,h)=>{g.fillStyle='#0b2a5a';g.fillRect(0,0,w,h);[['A','#111'],['K','#d4203f'],['Q','#111'],['J','#d4203f'],['10','#111']].forEach((c,i)=>{const x=8+i*49;g.fillStyle='#fff';rr(g,x,22,44,100,6);g.fill();g.fillStyle=c[1];g.font='900 26px Arial,sans-serif';g.textAlign='center';g.fillText(c[0],x+22,62);g.font='26px Arial,sans-serif';g.fillText(i%2?'':'',x+22,100)})})}
function topTex(txt,col){return cvs(256,90,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#3a1480');gr.addColorStop(1,'#180a38');g.fillStyle=gr;g.fillRect(0,0,w,h);g.font='900 52px "Trebuchet MS",Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=9;g.strokeStyle='#160a2c';g.lineJoin='round';g.strokeText(txt,128,48);g.shadowColor=col;g.shadowBlur=14;g.fillStyle=col;g.fillText(txt,128,48)})}
// ---- shell: ceiling & high decor (no shadow casting)
const ceilT=cvs(128,128,(g)=>{g.fillStyle='#120b22';g.fillRect(0,0,128,128);g.fillStyle='#181030';g.fillRect(12,12,104,104);g.strokeStyle='rgba(217,164,65,.28)';g.lineWidth=2;g.strokeRect(12,12,104,104)});ceilT.repeat.set(92/8,72/8);
S(Pl(92,72),Mt(0xffffff,{map:ceilT,emissive:0xffffff,emissiveMap:ceilT,emissiveIntensity:.35,side:T.DoubleSide}),0,14,0,{rx:PI/2});
for(let z=-30;z<=30;z+=12)S(Bx(92,.5,.8),Mt(0x1b1230),0,13.75,z);
for(let x=-36;x<=36;x+=12)S(Bx(.8,.5,72),Mt(0x1b1230),x,13.7,0);
for(let i=0;i<7;i++)for(let j=0;j<5;j++)S(Cy(.55,.55,.1,10),Gl(0xffe2b0),(i-3)*13,13.86,(j-2)*14);
[[0,-36,92,2],[0,36,92,2],[-46,0,2,72],[46,0,2,72]].forEach(([x,z,w,d])=>{S(Bx(w,14,d),Mt(0x2d1250),x,7,z);colr(x-w/2,x+w/2,z-d/2,z+d/2)});
flush(false);
// ---- floor, carpet, rug
const floorT=cvs(256,256,(g)=>{g.fillStyle='#17123a';g.fillRect(0,0,256,256);g.fillStyle='#1c1644';g.fillRect(0,0,128,128);g.fillRect(128,128,128,128);g.strokeStyle='rgba(217,164,65,.34)';g.lineWidth=3;[[64,64],[192,192]].forEach(([x,y])=>{g.beginPath();g.moveTo(x,y-34);g.lineTo(x+34,y);g.lineTo(x,y+34);g.lineTo(x-34,y);g.closePath();g.stroke()});g.fillStyle='rgba(217,164,65,.42)';[[64,64],[192,192]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,5,0,7);g.fill()})});floorT.repeat.set(92/9,72/9);floorT.anisotropy=8;
S(Pl(92,72),Mt(0xffffff,{map:floorT,roughness:.5,envMapIntensity:.25}),0,.02,0,{rx:-PI/2});
const carT=cvs(64,64,(g)=>{g.fillStyle='#6e1230';g.fillRect(0,0,64,64);g.fillStyle='#b8893f';g.fillRect(3,0,2,64);g.fillRect(59,0,2,64);g.fillStyle='#7f1a3b';g.beginPath();g.moveTo(32,14);g.lineTo(44,32);g.lineTo(32,50);g.lineTo(20,32);g.closePath();g.fill()});carT.repeat.set(1,26/6.4);
S(Pl(6.4,26),Mt(0xffffff,{map:carT}),0,.04,22,{rx:-PI/2});
// ---- walls
const wallT=cvs(128,256,(g)=>{g.fillStyle='#260d28';g.fillRect(0,0,128,256);g.fillStyle='#2c1030';g.fillRect(0,0,64,256);g.fillStyle='rgba(217,164,65,.35)';g.fillRect(63,0,2,256);[[32,70],[96,190]].forEach(([x,y])=>{g.fillStyle='rgba(217,164,65,.14)';g.beginPath();g.moveTo(x,y-18);g.lineTo(x+14,y);g.lineTo(x,y+18);g.lineTo(x-14,y);g.closePath();g.fill()})});
const wm=r=>{const t=wallT.clone();t.needsUpdate=true;t.repeat.set(r,1);return new T.MeshStandardMaterial({map:t,roughness:.9,flatShading:true})};
S(Pl(90,14),wm(90/8),0,7,-34.98);S(Pl(90,14),wm(90/8),0,7,34.98,{ry:PI});S(Pl(70,14),wm(70/8),-44.98,7,0,{ry:PI/2});S(Pl(70,14),wm(70/8),44.98,7,0,{ry:-PI/2});
function band(len){S(Bx(len,3.4,.5),Mt(0x170a26),0,1.7,.25);for(let x=-len/2+3;x<len/2;x+=6)S(CB(5.2,2.3,.3,.3),Mt(0x2a1440),x,1.75,.55,{ol:.05});
S(Bx(len,.3,.9),GOLD,0,3.55,.45);S(Bx(len,.55,.8),Mt(0x1b0a38),0,.28,.4);S(Bx(len,.5,.9),GOLD,0,13.6,.45);S(Bx(len,.18,.3),Gl(0xff3d9a),0,13.1,.2);S(Bx(len,.12,.2),Gl(0x4ff0ff),0,3.85,.25)}
at(0,0,-35,0,()=>band(90));at(0,0,35,PI,()=>band(90));at(-45,0,0,PI/2,()=>band(70));at(45,0,0,-PI/2,()=>band(70));
function pil(){S(Cy(.95,1.05,13.9,8),Mt(0x2c1b40),0,7,.55,{ol:.05});S(Cy(1.35,1.5,.7,8),GOLD,0,.35,.5);S(Cy(1.5,1.1,.9,8),GOLD,0,13.2,.5);S(Cy(1.1,1.1,.3,8),GOLD,0,4.2,.55);S(Cy(1.1,1.1,.14,8),Gl(0xff3d9a),0,7,.55)}
[-36,-12,12,36].forEach(x=>at(x,0,-35,0,pil));[-36,-12,12,36].forEach(x=>at(x,0,35,PI,pil));[-28,28].forEach(z=>{at(-45,0,z,PI/2,pil);at(45,0,z,-PI/2,pil)});
const BC=[0x7a1530,0x1f2f78,0x125a54,0x8a4a14];
function banner(x,z,ry,i){at(x,0,z,ry,()=>{S(Cy(.07,.07,3,6),GOLD,0,12.6,.15,{rz:PI/2});S(Ban(2.4,5),Mt(BC[i%4],{side:T.DoubleSide}),0,12.5,.15,{ol:.05});S(Cy(.6,.6,.12,5),GOLD,0,10.2,.25,{rx:PI/2})})}
[-24,24].forEach((z,i)=>banner(-44.6,z,PI/2,i));[-26,27].forEach((z,i)=>banner(44.6,z,-PI/2,i+1));
// pillars
[[-30,22],[30,22],[-30,-22],[30,-22]].forEach(([x,z])=>{at(x,0,z,0,()=>{S(CB(3.2,.7,3.2,.5),Mt(0x2a1260),0,.35,0,{ol:.07});S(Cy(1.15,1.3,.5,8),GOLD,0,.95,0);S(Cy(1,1.1,11.8,8),Mt(0x2c1b40),0,7,0,{ol:.07});
for(const y of[3.2,7,10.8])S(Cy(1.18,1.18,.35,8),GOLD,0,y,0);S(Cy(1.12,1.12,.12,8),Gl(0xff3d9a),0,5.1,0);S(Cy(1.12,1.12,.12,8),Gl(0x4ff0ff),0,8.9,0);S(Cy(1.8,1.2,1,8),GOLD,0,13.4,0);S(CB(3.6,.4,3.6,.3),Mt(0x2a1260),0,13.8,0)});colr(x-1.5,x+1.5,z-1.5,z+1.5)});
// ---- props
const SCR=[reelTex(0,0,0),reelTex(1,3,0),reelTex(2,4,1),reelTex(4,0,3)].map(t=>new T.MeshBasicMaterial({map:t,toneMapped:false}));
const POKS=new T.MeshBasicMaterial({map:cardsTex(),toneMapped:false});
const TOPS=[['777','#ffd23f'],['JACKPOT','#ff5fb0'],['LUCKY','#4ff0ff'],['WILD','#9dff4f']].map(a=>new T.MeshBasicMaterial({map:topTex(a[0],a[1]),toneMapped:false}));
const POKT=new T.MeshBasicMaterial({map:topTex('POKER','#b14dff'),toneMapped:false});
const MC2=[0xff3d9a,0x2f6bff,0x19c6b4,0xff8a3d,0x9b5cff,0xe8334a,0x4fd37a];
function stool(x,z,c){S(Cy(.5,.5,.1,8),Mt(0x1b0f33),x,.05,z);S(Cy(.12,.12,.9,6),Mt(0x9aa3bd,{metalness:.6}),x,.5,z);S(Cy(.55,.5,.3,8),Mt(c),x,1.05,z,{ol:.06});S(Cy(.56,.56,.06,8),GOLD,x,.9,z)}
function slotM(x,z,ry,col,i,poker){at(x,0,z,ry,()=>{
S(CB(2.6,.5,2.5,.2),Mt(0x2a1250),0,.25,0,{ol:.07});S(CB(2.3,2.4,2.1,.4),Mt(col),0,1.7,-.05,{ol:.09});
S(Bx(.1,2.2,2),GOLD,-1.18,1.7,-.05);S(Bx(.1,2.2,2),GOLD,1.18,1.7,-.05);
S(CB(2,1.35,.5,.2),Mt(0x1b0f33),0,2.55,.95,{rx:-.28,ol:.06});S(Pl(1.7,1.05),poker?POKS:SCR[i%4],0,2.625,1.21,{rx:-.28});
S(CB(2.1,.9,.35,.12),Mt(0x28124d),0,1.5,1.05,{rx:-.55});
[[-.6,0xe8334a],[0,0xffd23f],[.6,0x2ee66b]].forEach(a=>S(Cy(.16,.16,.14,8),Mt(a[1],{emissive:a[1],emissiveIntensity:.5}),a[0],1.61,1.24,{rx:1.02}));
S(Bx(1.4,.35,.5),Mt(0x0e0820),0,.9,1.15);[-.3,.1,.4].forEach(c=>S(Cy(.16,.16,.05,8),GOLD,c,1.1,1.2));
S(CB(2.4,1,.9,.28),GOLD,0,3.4,-.15,{ol:.08});S(Pl(2,.7),poker?POKT:TOPS[i%4],0,3.4,.32);
for(let k=-2;k<=2;k++)S(Ic(.12,0),Gl(PAL[(k+i+8)%4]),k*.45,4.05,-.1);
S(Cy(.07,.07,1.1,6),Mt(0xcfd3e6,{metalness:.5}),1.3,2.1,.1,{rz:-.25});S(Ic(.22,1),Mt(0xff2d55),1.44,2.7,.1,{ol:.04});
stool(0,2.7,poker?0x7b3fe0:0xe8334a)});}
function feltTex(k,w,d,fc){return cvs(512,Math.round(512*d/w),(g,W,H)=>{g.fillStyle=css(fc);g.fillRect(0,0,W,H);g.strokeStyle='rgba(255,241,201,.85)';g.fillStyle='rgba(255,241,201,.9)';g.lineWidth=4;g.textAlign='center';g.textBaseline='middle';
if(k==='bj'){g.font='900 28px Arial,sans-serif';g.fillText('BLACKJACK PAYS 3 TO 2',W/2,H*.3);g.font='700 16px Arial,sans-serif';g.fillText('DEALER STANDS ON 17',W/2,H*.42);for(let i=0;i<5;i++){const a=PI*(.2+.15*i);g.beginPath();g.arc(W/2+Math.cos(a)*W*.36,H*.1+Math.sin(a)*H*.68,24,0,7);g.stroke()}}
else if(k==='roul'){const x0=W*.42,cw=(W*.96-x0)/12,ch=H*.17,y0=H*.14,rd=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];g.font='700 15px Arial,sans-serif';
for(let c=0;c<12;c++)for(let r=0;r<3;r++){const n=c*3+(2-r)+1;g.fillStyle=rd.includes(n)?'#d0213d':'#16161c';g.fillRect(x0+c*cw+1,y0+r*ch+1,cw-2,ch-2);g.fillStyle='#fff';g.fillText(n,x0+c*cw+cw/2,y0+r*ch+ch/2)}
g.fillStyle='#1a9e4f';g.fillRect(x0-cw*1.1,y0,cw*1.05,ch*3);g.fillStyle='#fff';g.fillText('0',x0-cw*.55,y0+ch*1.5);for(let i=0;i<3;i++){g.strokeRect(x0+i*cw*4+2,y0+ch*3+8,cw*4-4,ch*.8);g.fillText(['1st 12','2nd 12','3rd 12'][i],x0+i*cw*4+cw*2,y0+ch*3.4+8)}}
else if(k==='bac'){g.font='900 26px Arial,sans-serif';g.fillText('BACCARAT',W/2,H*.2);[['PLAYER','#4ff0ff'],['BANKER','#ff5fb0'],['TIE','#9dff4f']].forEach((a,i)=>{g.strokeStyle=a[1];g.strokeRect(40+i*(W-80)/3,H*.38,(W-80)/3-10,H*.46);g.fillStyle=a[1];g.font='800 20px Arial,sans-serif';g.fillText(a[0],40+i*(W-80)/3+((W-80)/3-10)/2,H*.61)});g.strokeStyle='rgba(255,241,201,.85)';g.fillStyle='rgba(255,241,201,.9)'}
else{g.font='900 22px Arial,sans-serif';g.fillText('STREET DICE',W/2,H*.82);g.font='700 18px Arial,sans-serif';['4','5','SIX','8','NINE','10'].forEach((t,i)=>{g.strokeRect(30+i*80,H*.12,70,H*.3);g.fillText(t,65+i*80,H*.27)});g.strokeRect(24,H*.6,W-48,H*.3)}})}
function dealer(x,z,ry,coat,skin,hat){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=ry;RM.add(g);const dk=Mt(0x1b1b2a),sk=Mt(skin);
PT(g,Cy(.22,.2,1.1,6),dk,-.28,.55,0,.05);PT(g,Cy(.22,.2,1.1,6),dk,.28,.55,0,.05);
const b=new T.Group();b.position.y=1.1;g.add(b);PT(b,Cy(.62,.8,1.4,8),Mt(coat),0,.7,0,.07);PT(b,Bx(.5,.9,.06),Mt(0xffffff),0,.85,.73);
PT(b,Cn(.16,.3,4),Mt(0xe8334a),-.17,1.3,.76,0,{rz:PI/2});PT(b,Cn(.16,.3,4),Mt(0xe8334a),.17,1.3,.76,0,{rz:-PI/2});
PT(b,Ic(.62,1),sk,0,1.95,0,.07);PT(b,Ic(.07,0),Mt(0x111111),-.2,2,.57);PT(b,Ic(.07,0),Mt(0x111111),.2,2,.57);PT(b,Ic(.09,0),Mt(0xd9946a),0,1.9,.62);PT(b,Bx(.2,.04,.04),Mt(0x7a1f1f),0,1.72,.58);
PT(b,Cy(.68,.68,.12,8),Mt(hat),0,2.5,0,.05);PT(b,Cy(.45,.5,.4,8),Mt(hat),0,2.72,0,.05);
const arms=[-1,1].map(s=>{const a=new T.Group();a.position.set(s*.78,1.25,0);a.rotation.x=-1.1;b.add(a);PT(a,Cy(.16,.14,.9,6),Mt(coat),0,-.4,0,.05);PT(a,Ic(.2,0),sk,0,-.9,0,.04);return a});
DL.push({b,arms,ph:R()*6})}
function plant(x,z,s){at(x,0,z,0,()=>{S(Cy(.9,.65,1,8),Mt(0xc0603a),0,.5,0,{ol:.06});S(Cy(.85,.85,.1,8),Mt(0x4a2a14),0,1,0);S(Ic(.9,0),Mt(0x2fa84f),0,1.9,0,{sy:1.2,ol:.05});S(Ic(.7,0),Mt(0x4fd37a),.2,2.7,.1,{ol:.05});S(Ic(.5,0),Mt(0x9dff4f),-.1,3.35,0,{ol:.04})},s||1);colr(x-.9,x+.9,z-.9,z+.9)}
function door(x,z,ry,dc){at(x,0,z,ry,()=>{S(Arch(8,4.4,.8,.25),GOLD,0,.1,.1,{ol:.08});S(Arch(6.4,4.2,.5,.2),Mt(dc,{emissive:dc,emissiveIntensity:.3}),0,.1,.35,{ol:.05});
S(Bx(.12,7.2,.2),Mt(0x1b0f33),0,3.9,.65);[-1.5,1.5].forEach(sx=>{S(Cy(.9,.9,.15,10),Gl(0xbfffe0),sx,5.8,.65,{rx:PI/2});S(Ic(.18,0),GOLD,sx*.3,3.2,.75)})})}
// ---- build room contents
for(let k=0;k<7;k++)slotM(-43,-12+k*5,PI/2,MC2[k%7],k,0);
for(let k=0;k<6;k++)slotM(43,-2+k*5,-PI/2,MC2[(k+3)%7],k,1);
colr(-44.4,-41.6,-14.6,22.6);colr(41.6,44.4,-4.6,24.6);
let WHL=null,BALL=null;const DICE=[];
ST.forEach(s=>{if(!s.tb)return;const[w,d,fc]=s.tb,x=s.x,z=s.z,rc={bj:0x5b1f14,bac:0x241a5a,roul:0x3a2412,dice:0x4a2a14}[s.k];
at(x,0,z,0,()=>{S(CB(w-1.2,.95,d-1,.3),Mt(0x5a2f1a),0,.5,0,{ol:.08});S(CB(w,.55,d,.28),Mt(rc),0,1,0,{ol:.09});
S(Pl(w-1.1,d-1.1),Mt(0xffffff,{map:feltTex(s.k,w,d,fc),roughness:1}),0,1.29,0,{rx:-PI/2});
for(let i=-3;i<=3;i++)S(Ic(.14,0),GOLD,i*w/8,1,d/2+.05);
[[w*.3,.6,0xe8334a,4],[w*.3+.7,.9,0x2f6bff,3],[-w*.3,.7,0xffd23f,5],[-w*.3-.7,.5,0x4fd37a,2]].forEach(c=>S(Cy(.3,.3,.12*c[3],10),Mt(c[2]),c[0],1.29+.06*c[3],c[1]*(d/5),{ol:.04}));
if(s.k==='bj')[[-1.5,.6],[0,.8],[1.5,.6]].forEach(c=>{S(Bx(.55,.03,.78),Mt(0xffffff),c[0],1.31,c[1],{ry:.3});S(Bx(.2,.04,.2),Mt(0xe8334a),c[0],1.33,c[1],{ry:.3})});
for(let k=-1;k<=1;k++)stool(k*w*.3,d/2+1.2,0xc23b5a)});
colr(x-w/2,x+w/2,z-d/2-1.8,z+d/2+.3);
dealer(x,z-d/2-1.2,0,{bj:0x2f6bff,bac:0x9b5cff,roul:0xff3d9a,dice:0x19c6b4}[s.k],[0xffd2a8,0xc98f64,0x8d5a3b][s.k.length%3],{bj:0x1b1b2a,bac:0xffc94a,roul:0x7b3fe0,dice:0xffc94a}[s.k]);
if(s.k==='roul'){WHL=new T.Group();WHL.position.set(x-3,1.3,z);RM.add(WHL);PT(RM,Cy(2.1,1.7,.5,12),Mt(0x6a3a1c),x-3,1.35,z,.07);
for(let i=0;i<12;i++){const m=new T.Mesh(new T.CylinderGeometry(1.5,1.5,.14,1,1,false,i*PI/6,PI/6),Mt(i===0?0x1a9e4f:i%2?0xe8334a:0x16161c));m.position.y=.2;WHL.add(m)}
PT(WHL,Cy(.5,.7,.5,8),GOLD,0,.45,0,.04);for(let i=0;i<4;i++)PT(WHL,Bx(2.6,.08,.12),GOLD,0,.62,0,0,{ry:i*PI/4+.2});
BALL=new T.Group();WHL.add(BALL);PT(BALL,Ic(.12,0),Mt(0xffffff),1.2,.3,0)}
if(s.k==='dice')[-1,1].forEach((dx,i)=>{const m=PT(RM,new T.BoxGeometry(.9,.9,.9),DM(),x+dx*1.3,1.8,z,.05);DICE.push(m)})});
function DM(){const faces=[1,6,2,5,3,4].map(n=>new T.MeshStandardMaterial({map:cvs(64,64,(g)=>{g.fillStyle='#fffdf2';g.fillRect(0,0,64,64);g.fillStyle='#e8123f';const P={1:[[32,32]],2:[[16,16],[48,48]],3:[[16,16],[32,32],[48,48]],4:[[16,16],[48,16],[16,48],[48,48]],5:[[16,16],[48,16],[32,32],[16,48],[48,48]],6:[[16,14],[48,14],[16,32],[48,32],[16,50],[48,50]]};P[n].forEach(p=>{g.beginPath();g.arc(p[0],p[1],6,0,7);g.fill()})}),flatShading:true}));return faces}
// duck race pond is built below
// plinko
at(-24,6.15,-34.3,0,()=>{S(CB(10.4,10.4,.5,.3),Mt(0x1d1a5e),0,0,0,{ol:.08});S(CB(11,.6,.8,.22),GOLD,0,5.4,.1);S(CB(11,.6,.8,.22),GOLD,0,-5.4,.1);S(CB(.6,10.4,.8,.22),GOLD,-5.4,0,.1);S(CB(.6,10.4,.8,.22),GOLD,5.4,0,.1);
for(let r=0;r<9;r++)for(let c=0;c<=r+1;c++)S(Ic(.15,0),Gl(0xffe9a0),(c-(r+1)/2)*1.05,4.4-r*.95,.4);
for(let i=0;i<10;i++)S(CB(.8,1.1,.4,.15),Mt([0xff3d71,0xffb02e,0x4a4a7a,0x4a4a7a,0x2f6bff][Math.abs(i-4.5)>4?0:Math.abs(i-4.5)>3?1:Math.abs(i-4.5)>2?2:Math.abs(i-4.5)>1?3:4]),(i-4.5)*.98,-4.4,.4)});
colr(-29.4,-18.6,-36,-33.4);Marq('PLINKO','#ff8a3d',6.5,1.6,-24,12.5,-34.4,0);
const PB_=[0,1,2].map(i=>PT(RM,Ic(.3,1),Gl(0xff8a3d),-24,6,-33.7));
// crash
const crT=cvs(512,280,()=>{});const crG=crT.image.getContext('2d');
at(24,7.3,-34.4,0,()=>{S(CB(12.4,7.4,.7,.35),GOLD,0,0,0,{ol:.1});S(Pl(11.4,6.2),new T.MeshBasicMaterial({map:crT,toneMapped:false}),0,0,.38);for(let i=0;i<28;i++){const a=i/28,p=a<.25?[-5.9+a*4*11.8,3.5]:a<.5?[5.9,3.5-(a-.25)*4*7]:a<.75?[5.9-(a-.5)*4*11.8,-3.5]:[-5.9,-3.5+(a-.75)*4*7];S(Ic(.16,0),Gl(PAL[i%4]),p[0],p[1],.4)}});
colr(18.4,29.6,-36,-33.4);Marq('MOONSHOT','#ff3d71',6.5,1.6,24,12.5,-34.4,0);
const RK=new T.Group();RK.position.set(33,0,-30);RM.add(RK);PT(RK,Cy(1,1.1,4,8),Mt(0xf4f4ff),0,4,0,.08);PT(RK,Cn(1,2.2,8),Mt(0xe8334a),0,7.1,0,.08);PT(RK,Ic(.45,0),Mt(0x4ff0ff,{emissive:0x2a8fb0}),0,4.6,.95,.05);
[0,1,2,3].forEach(i=>PT(RK,Bx(.2,1.6,1.1),Mt(0xe8334a),Math.cos(i*PI/2)*1.1,2.3,Math.sin(i*PI/2)*1.1,.05,{ry:-i*PI/2}));const FL=PT(RK,Cn(.7,2,7),Gl(0xffa030),0,.6,0,0,{rx:PI});
at(33,0,-30,0,()=>{S(Cy(1.8,2,.5,8),Mt(0x2a1260),0,.25,0,{ol:.07})});colr(31.2,34.8,-31.8,-28.2);
// mines
at(44.3,0,-14,-PI/2,()=>{[-2.6,2.6].forEach(px=>S(CB(.9,7.2,.9,.25),Mt(0x8a5430),px,3.7,.2,{ol:.07}));S(CB(6.8,.9,.9,.25),Mt(0x8a5430),0,7.4,.2,{ol:.07});S(Bx(4.4,6.6,.3),Mt(0x0a0518),0,3.4,-.5);
[[-1.5,1.2],[1.4,2.8],[-.6,4.6],[1.2,5.6],[-1.6,3.4]].forEach((c,i)=>S(Oc(.45),Gl([0x4fffd0,0xff5fb0,0xb14dff,0x9dff4f,0x4ff0ff][i]),c[0],c[1],-.3,{sy:1.7,ry:i}));
[-.8,.8].forEach(x=>S(Bx(.2,.15,6),Mt(0x9aa3bd,{metalness:.6}),x,.1,3.3));for(let k=0;k<6;k++)S(Bx(2.2,.12,.35),Mt(0x6a4224),0,.05,.6+k*1);
S(CB(2.6,1.5,2.2,.3),Mt(0x6c7a99,{metalness:.4}),0,1.2,3.2,{ol:.08});S(CB(2.9,.3,2.5,.12),GOLD,0,2,3.2);[[-1.2,2.5],[1.2,2.5],[-1.2,3.9],[1.2,3.9]].forEach(w=>S(Cy(.35,.35,.2,8),Mt(0x1b1b2a),w[0],.4,w[1],{rz:PI/2}));
[[-.6,0x4fffd0],[.5,0xff5fb0],[0,0xb14dff]].forEach((g,i)=>S(Oc(.5),Gl(g[1]),g[0],2.3,3.2+(i-1)*.3,{sy:1.3,ry:i}));S(Ic(.25,0),Gl(0xffd27a),0,6.3,.3)});
colr(40,42.4,-15.5,-12.5);Marq('MINES','#9dff4f',6,1.6,44.4,9.8,-14,-PI/2);
[[44.4,8.6,3,PI/2,'SLOTS','#ffd23f'],[44.4,8.6,8,-PI/2,'POKER','#b14dff']].forEach(a=>Marq(a[4],a[5],6.5,1.8,a[0]*(a[3]>0?-1:1),a[1],a[2],a[3]));
// bar (front-left) & cashier (front-right)
at(-26,0,30.5,0,()=>{S(CB(22,2.6,2.6,.5),Mt(0x8a4a2a),0,1.3,0,{ol:.09});S(CB(22.6,.35,3.2,.14),GOLD,0,2.7,0,{ol:.06});S(Bx(21,.14,.1),Gl(0xff3d9a),0,.5,1.32)});
at(-26,0,34.4,0,()=>{S(Pl(22,4.6),Mt(0x9fd6ff,{emissive:0x4a7aa8,emissiveIntensity:.6}),0,5.4,-.02,{ry:PI});[3.2,5.2].forEach(y=>S(Bx(22,.2,.9),GOLD,0,y,-.3,{ry:PI}));
for(let i=0;i<18;i++){const c=[0xe8334a,0x19c6b4,0xffc94a,0x9b5cff,0x4fd37a][i%5],x=-10+i*1.15;[3.6,5.6].forEach(y=>{S(Cy(.22,.26,.9,6),Mt(c,{emissive:c,emissiveIntensity:.25}),x,y+.5,-.3);S(Cy(.1,.12,.4,6),Mt(c),x,y+1.1,-.3)})}});
[-6,-3.6,-1.2,1.2,3.6,6].forEach(k=>stool(-26+k*1.6,27.8,0x19c6b4));Marq('BAR','#4ff0ff',5,1.6,-26,11.2,34.4,PI);
[-9,-5,-2,2,5,9].forEach(x=>S(Cy(.2,.16,.4,6),Mt(0xffffff),-26+x,3.05,30.5));
colr(-37.6,-14.4,26.8,35);dealer(-26,32.7,PI,0xff8a3d,0xffd2a8,0xe8334a);
at(26,0,30.5,0,()=>{S(CB(22,2.6,2.6,.5),Mt(0x1f7a55),0,1.3,0,{ol:.09});S(CB(22.6,.35,3.2,.14),GOLD,0,2.7,0,{ol:.06});
for(let i=0;i<22;i++)S(Cy(.08,.08,3.6,5),GOLD,-10.5+i*.96,4.7,0);S(Bx(22,.3,.4),GOLD,0,6.6,0);S(Bx(22,.2,.4),GOLD,0,2.95,0);
[[-8,5],[-4,3],[3,6],[7,4]].forEach(c=>S(Cy(.5,.5,.12*c[1],10),GOLD,c[0],2.9+.06*c[1],.2,{ol:.04}));[-1,5].forEach(x=>S(Ic(.55,1),Mt(0x5ac26a),x,3.3,.3,{sy:.9,ol:.05}))});
Marq('CASHIER','#ffd23f',7,1.8,26,11.2,34.4,PI);colr(14.4,37.6,28.8,35);dealer(26,32.7,PI,0x2f6bff,0x8d5a3b,0xffc94a);
// trophy
at(-33,0,-30,0,()=>{S(CB(3,.8,3,.3),Mt(0x2a1260),0,.4,0,{ol:.07});S(Cy(.5,.9,2,8),GOLD,0,1.8,0);S(Cy(1.7,.9,1.8,8),GOLD,0,3.7,0,{ol:.07});S(Cy(1.4,1.4,.05,8),Mt(0xb8860b),0,4.6,0);S(Tr(.7,.15,5,8),GOLD,-1.7,3.8,0);S(Tr(.7,.15,5,8),GOLD,1.7,3.8,0);S(Star(.7,.3,5,.2),Gl(0xffe27a),0,5.5,0)});colr(-34.6,-31.4,-31.6,-28.4);
// doors, plants
door(0,34.6,PI,0x1f9d6a);Marq('EXIT','#55ff88',5,1.5,0,11.6,34.4,PI);
[[-9.5,32.5],[9.5,32.5],[-41,-31],[41,-31],[-41,30],[41,30],[-5,-33],[5,-33]].forEach(p=>plant(p[0],p[1],1));

// ---- new floor games
// duck race pond: low, so you can see the whole race
at(0,0,9,0,()=>{S(CB(17,.7,9,.4),Mt(0x2a1730),0,.35,0,{ol:.09});S(CB(17.6,.22,9.6,.18),GOLD,0,.72,0,{ol:.06});S(Pl(16,8),Mt(0x1766d6,{emissive:0x0f4fb8,emissiveIntensity:.8,roughness:.2}),0,.86,0,{rx:-PI/2});
for(let i=1;i<6;i++)S(Bx(16,.08,.07),Gl(0xfff1c9),0,.9,-4+i*8/6);for(let i=0;i<8;i++){S(Bx(.5,.05,1),Mt(i%2?0xffffff:0x160a2c),7.6,.92,-3.5+i);S(Bx(.5,.05,1),Mt(i%2?0x160a2c:0xffffff),7.1,.92,-3.5+i)}
[[0,4.85,17.6,.09],[0,-4.85,17.6,.09]].forEach(a=>S(Bx(a[2],.07,a[3]),Gl(0x4ff0ff),a[0],.1,a[1]));[-8.85,8.85].forEach(x=>S(Bx(.09,.07,9.7),Gl(0x4ff0ff),x,.1,0))});
colr(-8.8,8.8,4.2,13.8);Marq('DUCK DERBY','#ffd23f',8.5,1.5,0,10.3,3.4,0);[-3.4,3.4].forEach(x=>at(x,0,3.4,0,()=>S(Cy(.05,.05,3,5),GOLD,0,12.5,0)));
// big wheel
at(0,0,-27,0,()=>{S(CB(12.4,.8,3.2,.3),Mt(0x1a0e2c),0,.4,0,{ol:.07});[-5.9,5.9].forEach(x=>S(CB(.8,9.6,.8,.2),Mt(0x2c1b40),x,5,0,{ol:.06}));S(Cy(5.85,5.85,.6,40),GOLD,0,7.6,0,{rx:PI/2,ol:.06});S(Cn(.5,.9,4),Gl(0xff3d9a),0,12.95,.55,{rz:PI});for(let i=0;i<32;i++){const a=i/32*PI*2;S(Ic(.13,0),Gl(i%2?0xfff1c9:0xffb45a),Math.cos(a)*5.58,7.6+Math.sin(a)*5.58,.38)}});
colr(-6.4,6.4,-28.7,-25.3);
// skull tower
at(-14,0,-24,0,()=>{for(let i=0;i<8;i++){S(CB(3.6-.13*i,1.2,3.6-.13*i,.2),Mt([0x3a3350,0x2c2740][i%2]),0,.7+i*1.3,0,{ol:.07});S(Bx(3.7-.13*i,.09,3.7-.13*i),Gl(0x9dff4f),0,1.37+i*1.3,0)}S(Ic(1.1,1),Mt(0xfff1c9),0,11.8,0,{ol:.08});[-.4,.4].forEach(x=>S(Ic(.28,0),Mt(0x160a2c),x,11.9,.95));S(Bx(.5,.2,.1),Mt(0x160a2c),0,11.3,1.08)});
colr(-16,-12,-26,-22);
// hi-lo dial and keno machines
slotM(-20,17,0,0x2f6bff,2,0);colr(-21.5,-18.5,15.6,18.4);
slotM(20,17,0,0x19c6b4,3,0);colr(18.5,21.5,15.6,18.4);
// station floor spots
const SPOT={slots:[-37.3,3],poker:[37.3,8],mines:[37.5,-14],plinko:[-24,-28.5],crash:[24,-28.5],duck:[0,15.8],bj:[-18,-.2],bac:[-30,-8.2],roul:[0,-6.2],dice:[18,-.2],wheel:[0,-22.8],tower:[-14,-19.6],dial:[-20,21],keno:[20,21]};
ST.forEach(s=>{const p=SPOT[s.k],c=hex(s.c);S(Rg(.9,1.15),Gl(c),p[0],.1,p[1],{rx:-PI/2})});
// painted-in light: soft pools on the floor and warm lamps over the tables (costs almost nothing on phones)
const poolT=cvs(128,128,(g,W)=>{const r=g.createRadialGradient(W/2,W/2,0,W/2,W/2,W/2);r.addColorStop(0,'rgba(255,255,255,.9)');r.addColorStop(.55,'rgba(255,255,255,.34)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,W,W)});
const PMT=c=>MC['pl'+c]||(MC['pl'+c]=new T.MeshBasicMaterial({map:poolT,color:c,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,opacity:.5}));
const pool=(x,z,r,c)=>S(Pl(r*2,r*2),PMT(c),x,.13,z,{rx:-PI/2});
const SHM=new T.MeshBasicMaterial({color:0xffdca0,transparent:true,opacity:.055,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
function lamp(x,z,w,d){S(Bx(.06,5.8,.06),GOLD,x-w*.3,10.9,z);S(Bx(.06,5.8,.06),GOLD,x+w*.3,10.9,z);S(CB(w*.82,.36,d*.82,.1),Mt(0x170c26),x,7.9,z,{ol:.05});S(Bx(w*.84,.08,d*.84),GOLD,x,7.68,z);S(Bx(w*.74,.04,d*.74),Gl(0xffe2b0),x,7.62,z);
S(new T.CylinderGeometry(.56,1,1,4,1,true),SHM,x,4.3,z,{ry:PI/4,sx:w*.9,sy:6.6,sz:d*.9});pool(x,z+1,Math.max(w,d)*.9,0xffc98a)}
ST.filter(s=>s.tb).forEach(s=>lamp(s.x,s.z,s.tb[0],s.tb[1]));
pool(0,9,13,0x2f7bff);pool(0,-22,10,0xffb070);pool(-14,-20,6,0x9dff4f);pool(-20,20,5.5,0x4ff0ff);pool(20,20,5.5,0x9dff4f);pool(-24,-29,8,0xff8a3d);pool(24,-29,8,0xff3d71);pool(-39,3,8,0xffc98a);pool(39,8,8,0xb14dff);pool(38,-14,6,0x9dff4f);
flush(true);
// ---- animated bits: chandeliers, light strings, confetti
function chand(x,z,sc2){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(sc2);RM.add(g);const cr=Mt(0x9fe8ff,{emissive:0x2a8fb0,emissiveIntensity:.5,transparent:true,opacity:.88,roughness:.2});
PT(g,Cy(.08,.08,3.6,5),GOLD,0,12.2,0);PT(g,Ic(.55,0),GOLD,0,10.4,0,.05);PT(g,Tr(2.6,.16,5,12),GOLD,0,10.4,0,0,{rx:PI/2});PT(g,Tr(1.4,.12,5,10),GOLD,0,9.7,0,0,{rx:PI/2});
for(let k=0;k<6;k++){const a=k*PI/3;PT(g,Bx(2.6,.1,.12),GOLD,Math.cos(a)*1.3,10.4,Math.sin(a)*1.3,0,{ry:-a})}
for(let k=0;k<8;k++){const a=k*PI/4,px=Math.cos(a)*2.6,pz=Math.sin(a)*2.6;PT(g,Cy(.12,.12,.55,6),Mt(0xfff1c9),px,10.8,pz);PT(g,Cn(.12,.3,5),Gl(0xffd27a),px,11.2,pz);PT(g,Oc(.22),cr,px,9.8,pz,0,{s:[1,2.2,1]})}
for(let k=0;k<6;k++){const a=k*PI/3+.5;PT(g,Oc(.2),cr,Math.cos(a)*1.4,9.1,Math.sin(a)*1.4,0,{s:[1,2,1]})}PT(g,Ic(.5,0),cr,0,8.9,0,0,{s:[1,1.6,1]});CH.push(g)}
chand(0,20,1);
const WARM=[0xffe2a8,0xffb45a];const BN=68,bulbs=new T.InstancedMesh(Ic(.22,0),new T.MeshBasicMaterial({color:0xffffff,toneMapped:false}),BN),od=new T.Object3D(),wp=[];let bi=0;
[-2,27].forEach(z=>{const pts=[];for(let i=0;i<34;i++){const u=i/33,x=-44+u*88,y=12.95-1.1*Math.sin(PI*u);pts.push(new T.Vector3(x,y,z));od.position.set(x,y-.2,z);od.updateMatrix();bulbs.setMatrixAt(bi,od.matrix);bulbs.setColorAt(bi,new T.Color(WARM[bi%2]));bi++}
RM.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x120a20})))});bulbs.frustumCulled=false;RM.add(bulbs);
const CN=0,cp=new Float32Array(CN*3),cc=new Float32Array(CN*3),cgeo=new T.BufferGeometry();for(let i=0;i<CN;i++){cp[i*3]=(R()-.5)*88;cp[i*3+1]=R()*13;cp[i*3+2]=(R()-.5)*68;const c=new T.Color(PAL[i%4]);cc.set([c.r,c.g,c.b],i*3)}
cgeo.setAttribute('position',new T.BufferAttribute(cp,3));cgeo.setAttribute('color',new T.BufferAttribute(cc,3));const conf=new T.Points(cgeo,new T.PointsMaterial({size:.3,vertexColors:true,transparent:true,opacity:.85,depthWrite:false,blending:T.AdditiveBlending,fog:false}));conf.frustumCulled=false;RM.add(conf);
// lights (only visible while inside, so the city pays nothing for them)
const LT=[[0xffd9a8,1.25,0,11,14],[0xffb0d0,1,-24,10,-12],[0xb0d8ff,1,24,10,-12]].map(a=>{const l=new T.PointLight(a[0],a[1],70,1.4);l.position.set(a[2],a[3],a[4]);l.visible=false;RM.add(l);return l});
// ---- per-frame
let TT=0,mqT=0,mqP=0,bT=0,bP=0,crT2=0;
function drawCrash(){const g=crG,W=512,H=280,s=PG.crashNow(PALT()),boom=s.phase==='end'&&!s.orbit,fly=s.phase==='fly'||s.phase==='end';const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#2b0f5a');gr.addColorStop(1,'#14082e');g.fillStyle=gr;g.fillRect(0,0,W,H);
g.strokeStyle='rgba(255,255,255,.1)';g.lineWidth=1;for(let i=1;i<6;i++){g.beginPath();g.moveTo(0,i*H/6);g.lineTo(W,i*H/6);g.moveTo(i*W/6,0);g.lineTo(i*W/6,H);g.stroke()}
if(fly){const T_=Math.log(Math.max(1,s.mult))/PG.CRASH.k,sp=Math.max(5,T_),top=Math.max(2,s.mult);g.strokeStyle=boom?'#ff3d71':'#4fff9a';g.lineWidth=7;g.lineJoin='round';g.beginPath();for(let k=0;k<=30;k++){const t=T_*k/30,x=30+440*t/sp,y=250-190*(Math.exp(PG.CRASH.k*t)-1)/(top-1);k?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
g.font='900 66px "Trebuchet MS",Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=10;g.lineJoin='round';g.strokeStyle='#160a2c';const tx=s.phase==='bet'?'BET NOW':s.phase==='wait'?'REFUEL':boom?'BOOM':s.mult.toFixed(2)+'x';g.strokeText(tx,W/2,90);g.fillStyle=boom?'#ff3d71':'#ffd23f';g.fillText(tx,W/2,90);crT.needsUpdate=true}
function anim(dt){TT+=dt;if(WHL){WHL.rotation.y+=dt*1.2;BALL.rotation.y-=dt*3.5}
DICE.forEach((d,i)=>{d.rotation.x+=dt*(.8+i*.3);d.rotation.y+=dt*1.1;d.position.y=1.85+Math.sin(TT*2.5+i*2)*.12});
DL.forEach(d=>{d.b.position.y=1.1+Math.sin(TT*2+d.ph)*.04;d.arms[0].rotation.x=-1.1+Math.sin(TT*2.5+d.ph)*.14;d.arms[1].rotation.x=-1.1+Math.cos(TT*2.2+d.ph)*.14});
CH.forEach((c,i)=>c.rotation.y+=dt*(.25+i*.05));
RK.position.y=Math.sin(TT*1.6)*.15;FL.scale.set(1,.8+Math.sin(TT*18)*.25,1);
PB_.forEach((b,i)=>{const t=(TT*.35+i/3)%1;b.position.set(-24+Math.sin(t*34+i*2.1)*(.5+3.4*t),11-t*8.6,-33.7)});
mqT+=dt;if(mqT>.5){mqT=0;mqP^=1;MQ.forEach(m=>m.m.map=mqP?m.B:m.A)}
bT+=dt;if(bT>.4){bT=0;bP++;const c=new T.Color();for(let i=0;i<BN;i++){c.setHex(WARM[(i+bP)%2]);bulbs.setColorAt(i,c)}bulbs.instanceColor.needsUpdate=true}
const a=cgeo.attributes.position.array;for(let i=0;i<CN;i++){a[i*3+1]-=dt*(.6+i%3*.3);a[i*3]+=Math.sin(TT+i)*dt*.3;if(a[i*3+1]<.3)a[i*3+1]=13}cgeo.attributes.position.needsUpdate=true;
crT2+=dt;if(crT2>.1){crT2=0;drawCrash()}
syncFloor(TT)}
function on(v){const sh=sun.shadow.camera,e=v?52:95;sh.left=-e;sh.right=e;sh.top=e;sh.bottom=-e;sh.updateProjectionMatrix();LT.forEach(l=>l.visible=!!v);
if(v){sun.intensity=.2;hemi.intensity=.62;hemi.color.set(0xd8cce8);hemi.groundColor.set(0x4a3a58)}else{sun.intensity=1.5;hemi.intensity=.45;hemi.color.set(0xc9bcff);hemi.groundColor.set(0x6a5a62)}}
drawCrash();

// ---- live shared games in the room: same rounds as the screens, driven by the clock
const DUK=PG.DUCK.colors.map((c,i)=>{const g=new T.Group(),col=Mt(parseInt(c.slice(1),16));PT(g,Ic(.55,1),col,0,.15,0,.05,{s:[1.25,.8,.85]});PT(g,Ic(.34,1),col,.45,.7,0,.04);PT(g,Cn(.13,.4,5),Mt(0xff8a3d),.92,.66,0,.02,{rz:-PI/2});PT(g,Ic(.06,0),Mt(0x160a2c),.62,.82,.22);PT(g,Ic(.06,0),Mt(0x160a2c),.62,.82,-.22);g.position.set(-6.9,.95,5+(i+.5)*8/6);g.scale.setScalar(1.5);RM.add(g);return g});
const whT=cvs(512,512,(g,W)=>{const c=W/2,r=c-2,n=PG.WHEEL.segs.length,st=2*PI/n;g.translate(c,c);PG.WHEEL.segs.forEach((k,i)=>{const a0=i*st-PI/2-st/2;g.fillStyle=PG.WHEEL.cols[k];g.beginPath();g.moveTo(0,0);g.arc(0,0,r,a0,a0+st);g.closePath();g.fill();g.strokeStyle='#160a2c';g.lineWidth=2;g.stroke();g.save();g.rotate(a0+st/2);g.fillStyle='#fff';g.font='900 22px Arial';g.textAlign='right';g.textBaseline='middle';g.fillText(k.slice(1),r-12,0);g.restore()});g.fillStyle='#ffc94a';g.beginPath();g.arc(0,0,58,0,7);g.fill();g.strokeStyle='#160a2c';g.lineWidth=5;g.stroke()});
const LBL=ST.map(s=>{const p=SPOT[s.k],t=cvs(512,128,(g,W,H)=>{g.font='800 58px "Empire Display","Trebuchet MS",Arial,sans-serif';const name=GN[s.k],tw=Math.min(W-40,g.measureText(name).width+64),x=(W-tw)/2;g.fillStyle='rgba(18,10,36,.92)';g.strokeStyle=s.c;g.lineWidth=6;rr(g,x,10,tw,84,22);g.fill();g.stroke();g.fillStyle=s.c;g.beginPath();g.moveTo(W/2-16,94);g.lineTo(W/2+16,94);g.lineTo(W/2,118);g.closePath();g.fill();g.fillStyle='#fff4dc';g.textAlign='center';g.textBaseline='middle';g.fillText(name,W/2,54,W-90)});const m=new T.SpriteMaterial({map:t,transparent:true,depthWrite:false,toneMapped:false,opacity:0});m.fog=false;const sp=new T.Sprite(m);sp.position.set(p[0],3.8,p[1]);sp.scale.set(4.8,1.2,1);RM.add(sp);return{m,x:p[0],z:p[1]}});
const WHD=new T.Mesh(new T.CircleGeometry(5.3,50),new T.MeshBasicMaterial({map:whT,toneMapped:false}));WHD.position.set(0,7.6,-26.62);RM.add(WHD);
function wheelAng(s){const n=PG.WHEEL.segs.length,seg=2*PI/n,land=r=>-(r.seg*seg)+r.off*seg,rd=PG.wheelRound(s.id),pr=PG.wheelRound(s.id-1),a0=land(pr);if(s.phase==='bet')return a0;const a1=land(rd);if(s.phase==='end')return a1;const e=1-Math.pow(1-s.u,3);let d=a1-a0;d-=Math.ceil(d/(2*PI))*2*PI;return a0+e*(d-rd.turns*2*PI)}
function syncFloor(t){const now=PALT(),d=PG.duckNow(now),rd=PG.duckRound(d.id);DUK.forEach((g,i)=>{const p=d.phase==='bet'?0:PG.duckPos(rd,i,d.u);g.position.x=-6.9+13.4*Math.min(1.08,p);g.position.y=.95+Math.abs(Math.sin(t*5+i))*.18*(d.phase==='race'?1:.3);g.rotation.z=Math.sin(t*8+i)*.08});WHD.rotation.z=-wheelAng(PG.wheelNow(now));const px=(+P.x||0)-OX,pz=(+P.z||0)-OZ;LBL.forEach(l=>{const d=Math.hypot(l.x-px,l.z-pz);l.m.opacity=Math.max(0,Math.min(1,(25-d)/5))})}
return{anim,on,spot:SPOT}})();
function casinoAnim(dt){if(IN)CAS.anim(dt)}
function palFade(fn){const f=$('fade');f.style.opacity=1;setTimeout(()=>{fn();f.style.opacity=0},380)}
const palVis=v=>{$('mm').style.visibility=$('wp').style.visibility=$('quest').style.visibility=$('lvl').style.visibility=v};
window.PAL={
 enter(){if(S.q<5){toast('Finish the starter quest first');return}if(IN)return;palFade(()=>{IN=1;P.x=OX;P.z=OZ+27;P.y=.02;P.yaw=PI;P.vy=0;CY=PI;CAS.on(1);palVis('hidden');st.classList.add('inpal')});toast('Welcome to the Neon Palace')},
 exit(){if(!IN)return;palFade(()=>{IN=0;const p=POIS[0];P.x=p.x;P.z=p.z+11;P.y=.65;P.yaw=0;P.vy=0;CY=0;CAS.on(0);palVis('visible');st.classList.remove('inpal')})},
 tick:casinoAnim,closed(){},
 list:()=>ST.map(g=>({k:g.k,name:GN[g.k],c:g.c,line:LINE[g.k]})),
 play(k){const sp=CAS.spot[k];P.x=OX+sp[0];P.z=OZ+sp[1];P.vy=0;(PLAY[k]||(()=>PALUI.open(k)))()}};
const PLAY={bj:()=>palTable('bj'),bac:()=>palTable('bac'),roul:()=>palTable('rou'),crash:()=>PALUI.open('moon')};
function palTable(v){palBack=1;casOpen(v)}
const SR={slots:7,poker:7,mines:6,plinko:6,crash:6};
ST.forEach(g=>{const sp=CAS.spot[g.k];ITEMS.push({x:OX+sp[0],z:OZ+sp[1],r:SR[g.k]||4.6,in:1,act:'Play',label:'Play '+GN[g.k],fn:PLAY[g.k]||(()=>PALUI.open(g.k))})});
ITEMS.push({x:OX,z:OZ+31,r:5,in:1,act:'Leave',label:'Leave the Neon Palace',fn:()=>PAL.exit()});
