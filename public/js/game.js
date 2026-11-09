// Empire City game logic. UI lives in ui.js, rendering helpers in gfx.js.
// ===== online (Railway) mode: server-backed accounts + saves =====
async function srvInit(){try{const r=await fetch('/healthz',{cache:'no-store'});if(!r.ok||(await r.text()).trim()!=='ok')return false}catch(e){return false}
const J=(u,m,b)=>fetch(u,{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});
return{col:{doc:id=>{const n=id.slice(3);return{
async set(o){const r=await J('/api/save/'+n,'PUT',o);if(!r.ok)throw new Error('save '+r.status)},
async get(){const sr=await fetch('/api/salt/'+n);if(sr.status===404)return{exists:false};const{salt}=await sr.json(),a=acc()[n.toLowerCase()],pw=$('lgPass')&&$('lgPass').value;
let h=a&&a.salt===salt?a.h:pw?await hashPw(pw,salt):'';const r=await J('/api/login','POST',{name:n,h}),d=await r.json();return{exists:true,data:()=>d}}}}}}}
const T=THREE,C=74,R=Math.random,PI=Math.PI,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),$=id=>document.getElementById(id);
let PR=GFX.startPR();const rd=new T.WebGLRenderer({canvas:$('c'),antialias:!document.createElement('canvas').getContext('webgl2'),powerPreference:'high-performance'});rd.setPixelRatio(PR);
rd.shadowMap.enabled=true;rd.shadowMap.type=T.PCFSoftShadowMap;rd.toneMapping=T.ACESFilmicToneMapping;rd.toneMappingExposure=1.2;
const sc=new T.Scene(),cam=new T.PerspectiveCamera(65,1,.3,1200),st=$('st');let SW,SH,PORT,comp=null,bloom;
let JX=91,JY=0;function lay(){const w=innerWidth,h=innerHeight;PORT=h>w;SW=PORT?h:w;SH=PORT?w:h;{const cs=getComputedStyle(document.documentElement),px=n=>parseFloat(cs.getPropertyValue(n))||0,t=px('--env-t'),r=px('--env-r'),b=px('--env-b'),l=px('--env-l'),a=PORT?[r,b,l,t]:[t,r,b,l],s=document.documentElement.style;s.setProperty('--st',a[0]+'px');s.setProperty('--sr',a[1]+'px');s.setProperty('--sb',a[2]+'px');s.setProperty('--sl',a[3]+'px');JX=a[3]+26+65;JY=SH-a[2]-20-65}st.style.width=SW+'px';st.style.height=SH+'px';
st.style.transformOrigin='0 0';st.style.transform=PORT?`translateX(${w}px) rotate(90deg)`:'none';rd.setSize(SW,SH,false);$('c').style.width=SW+'px';$('c').style.height=SH+'px';cam.aspect=SW/SH;cam.updateProjectionMatrix();if(comp)GFX.fit()}
addEventListener('resize',lay);lay();
const sp2=e=>PORT?{x:e.clientY,y:innerWidth-e.clientX}:{x:e.clientX,y:e.clientY};
let g=null,gr=null;
sc.fog=new T.Fog(0xf4b08e,230,950);
const hemi=new T.HemisphereLight(0xc9bcff,0x6a5a62,.45);sc.add(hemi);
const sun=new T.DirectionalLight(0xffd9a0,1.5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0004;sun.shadow.normalBias=.3;
Object.assign(sun.shadow.camera,{left:-95,right:95,top:95,bottom:-95,far:600});sc.add(sun,sun.target);
const headl=new T.SpotLight(0xfff2cc,0,80,.55,.6,1);sc.add(headl,headl.target);
const mats={},M=(c,e)=>mats[c+'_'+e]||(mats[c+'_'+e]=Object.assign(new T.MeshStandardMaterial({color:c,emissive:e||0,roughness:.6,envMapIntensity:.7}),{_paint:!e}));
// rounded box with real bevels
function RB(w,h,d,r){r=Math.max(.004,Math.min(r,w/2-.01,h/2-.01,d/2-.01));const gm=new T.BoxGeometry(w,h,d,4,4,4),p=gm.attributes.position,n=gm.attributes.normal,hw=w/2-r,hh=h/2-r,hd=d/2-r,v=new T.Vector3(),q=new T.Vector3();
const mp=(c,half)=>{const a=Math.abs(c)/half,s=c<0?-1:1;return s*(a>.99?half:a>.6?half-r*.3:a>.3?half-r*.9:a*half*.3)};
for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);v.set(mp(v.x,w/2),mp(v.y,h/2),mp(v.z,d/2));q.set(cl(v.x,-hw,hw),cl(v.y,-hh,hh),cl(v.z,-hd,hd));const o=v.clone().sub(q);if(o.lengthSq()>1e-8){o.normalize();v.copy(q).addScaledVector(o,r);n.setXYZ(i,o.x,o.y,o.z)}p.setXYZ(i,v.x,v.y,v.z)}return gm}
const add=(geo,m,x,y,z,p,sh)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;if(sh)o.receiveShadow=true;(p||sc).add(o);return o};
const rbx=(w,h,d,r,c,x,y,z,p,e)=>add(RB(w,h,d,r),typeof c==='object'?c:M(c,e),x,y,z,p);
const glow=c=>new T.MeshBasicMaterial({color:c,toneMapped:false});
const cvs=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t};
function inst(geo,mat,arr){const m=new T.InstancedMesh(geo,mat,arr.length),o=new T.Object3D();arr.forEach((a,i)=>{o.position.set(a[0],a[1],a[2]);o.scale.set(a[3]||1,a[4]||1,a[5]||1);o.rotation.y=a[6]||0;o.updateMatrix();m.setMatrixAt(i,o.matrix);if(a[7]!=null)m.setColorAt(i,new T.Color(a[7]))});m.frustumCulled=false;sc.add(m);return m}
// ground + roads
const grT=GFX.grassTex();grT.repeat.set(160,160);
const gnd=new T.Mesh(new T.PlaneGeometry(2800,2800),new T.MeshStandardMaterial({map:grT,roughness:1}));gnd.rotation.x=-PI/2;gnd.receiveShadow=true;sc.add(gnd);
const SD=new T.Vector3(40,55,-120).normalize(),sunS=new T.Sprite(new T.SpriteMaterial({map:cvs(128,128,(g)=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.12,'rgba(255,240,200,.95)');r.addColorStop(.35,'rgba(255,190,120,.35)');r.addColorStop(1,'rgba(255,150,90,0)');g.fillStyle=r;g.fillRect(0,0,128,128)}),blending:T.AdditiveBlending,fog:false,depthWrite:false,toneMapped:false}));sunS.visible=false;
const L=560,RX=[-260,-190,-112,-46,46,112,190,260],RZ=[-266,-194,-126,-46,46,126,194,266],RXf=a=>RX[a+4],RZf=a=>RZ[a+4],rwx=a=>a===0?26:a===-3?20:14,rwz=b=>b===-1?26:b===2?20:14;
const roadT=GFX.roadTex();roadT.repeat.set(1,L/32);
const roadM=new T.MeshStandardMaterial({map:roadT,roughness:.62,metalness:.04,envMapIntensity:.7});
for(let a=-4;a<4;a++){const m=new T.Mesh(new T.PlaneGeometry(rwx(a),L),roadM);m.rotation.x=-PI/2;m.position.set(RXf(a),.02,0);m.receiveShadow=true;sc.add(m)}
for(let b=-4;b<4;b++){const m=new T.Mesh(new T.PlaneGeometry(rwz(b),L),roadM);m.rotation.x=-PI/2;m.rotation.z=PI/2;m.position.set(0,.022,RZf(b));m.receiveShadow=true;sc.add(m)}
const zb=[];for(let a=-4;a<4;a++)for(let b=-4;b<4;b++){const X=RXf(a),Z=RZf(b),k1=Math.floor((rwx(a)/2-.6)/2),k2=Math.floor((rwz(b)/2-.6)/2);for(const s of[-1,1]){for(let k=-k1;k<=k1;k++)zb.push([X+k*2,.06,Z+s*(rwz(b)/2+2.6),1.1,1,4]);for(let k=-k2;k<=k2;k++)zb.push([X+s*(rwx(a)/2+2.6),.06,Z+k*2,4,1,1.1])}}
inst(new T.BoxGeometry(1,.04,1),new T.MeshStandardMaterial({color:0xD6D3C9,roughness:.7}),zb);
{const asT=GFX.asphaltTex();asT.repeat.set(3,3);const ip=[],pg_=new T.PlaneGeometry(1,1);pg_.rotateX(-PI/2);const stops=[];for(let a=-4;a<4;a++)for(let b=-4;b<4;b++){const X=RXf(a),Z=RZf(b),w=rwx(a),d=rwz(b);ip.push([X,.03,Z,w+.1,1,d+.1]);for(const s of[-1,1]){stops.push([X-s*w/4,.058,Z+s*(d/2+5.2),w/2-.8,1,.5]);stops.push([X+s*(w/2+5.2),.058,Z+s*d/4,.5,1,d/2-.8])}}const im=inst(pg_,new T.MeshStandardMaterial({map:asT,roughness:.62,metalness:.04,envMapIntensity:.7}),ip);im.receiveShadow=true;inst(new T.BoxGeometry(1,.03,1),new T.MeshStandardMaterial({color:0xD6D3C9,roughness:.7}),stops)}
const pvT=GFX.paveTex();pvT.repeat.set(5,5);
const pvM=new T.MeshStandardMaterial({map:pvT,roughness:.9}),curbG=RB(61,.7,61,.3),curbM=M(0x8F8B84);
// buildings
const zoneOf=(i,j)=>Math.abs(i)<=1&&Math.abs(j)<=1?'Downtown':i>=2&&j<=-1?'Casino District':i<=-2&&j>=1?'Industrial Area':i<=-2&&j<=-1?'Luxury Hills':'Suburbs';
const bl=[],ZC={'Downtown':[0x8fb4ff,0xa8d8ff,0xc9c6ff],'Casino District':[0xff5fb0,0xa86bff,0xffc94a],'Industrial Area':[0xa3acbd,0xb99a7a,0x8a929c],'Luxury Hills':[0xf6ecdc,0xeccfa6,0xdff5e6],'Suburbs':[0xffb9a8,0xcdeac0,0xfff1a8]};
const EM={'Downtown':0xffe2a8,'Casino District':0xff7ad9,'Industrial Area':0xffd08a,'Luxury Hills':0xfff0c8,'Suburbs':0xffe0a0};
const TR=[],TF=[],PALMS=[],palmAt=(x,z,s)=>{s=s||1;PALMS.push([x,.62,z,s,s*(.9+R()*.3),s,R()*PI*2])};
const treeAt=(x,z,s)=>{s=s||1;const c=[0x4F8A4A,0x5E9A50,0x3F7A48,0x6FA458,0x4A8E5A][(R()*5)|0];TR.push([x,1.4*s,z,s,s]);TF.push([x,4.4*s,z,2.1*s,1.9*s,2.1*s,0,c],[x+1.1*s,3.6*s,z+.5*s,1.4*s,1.3*s,1.4*s,0,c],[x-.9*s,3.7*s,z-.6*s,1.5*s,1.3*s,1.5*s,0,c])};
const LP=[],SG=new T.SphereGeometry(1,14,10);
const AOT=cvs(64,64,(g)=>{const r=g.createRadialGradient(32,32,2,32,32,32);r.addColorStop(0,'rgba(0,0,0,.6)');r.addColorStop(.6,'rgba(0,0,0,.28)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64)}),AOM=new T.MeshBasicMaterial({map:AOT,transparent:true,depthWrite:false,toneMapped:false});AOT.wrapS=AOT.wrapT=T.ClampToEdgeWrapping;
const POIS=[{n:'Neon Palace Casino',k:'casino',e:'',c:0xffc94a,i:3,j:-2},{n:'Prestige Motors',k:'deal',e:'',c:0x4ff0ff,i:2,j:1},{n:'Pull Zone Cards',k:'card',e:'',c:0xff4fa8,i:-1,j:2},{n:'Coin Exchange',k:'crypto',e:'',c:0x9dff4f,i:1,j:-1},{n:'Turbo Garage',k:'garage',e:'',c:0xff8a3d,i:-3,j:2},{n:'Club Pulse',k:'club',e:'',c:0xb14dff,i:2,j:-3},{n:'Skyline Penthouses',k:'home',e:'',c:0xffffff,i:-2,j:-2}],DEAL=[];
function plaza(bx,bz){const gl=new T.Mesh(new T.PlaneGeometry(56,56),M(0x4B7D45));gl.rotation.x=-PI/2;gl.position.set(bx,.67,bz);gl.receiveShadow=true;sc.add(gl);
add(new T.CylinderGeometry(9,9.5,1.4,32),M(0xCFC8B8),bx,1.3,bz);add(new T.CylinderGeometry(8,8,1.2,32),new T.MeshStandardMaterial({color:0x2C8FA6,metalness:.75,roughness:.12,envMapIntensity:2}),bx,1.5,bz);
add(new T.CylinderGeometry(.8,1.2,6,12),M(0xCFC8B8),bx,4,bz);add(SG,glow(0xFFE6AE),bx,7.4,bz).scale.setScalar(1.2);bl.push([bx-9.5,bx+9.5,bz-9.5,bz+9.5]);
for(let a=0;a<14;a++){const r=a<7?18:24,an=a*.9;treeAt(bx+Math.cos(an)*r,bz+Math.sin(an)*r,1)}
for(let a=0;a<4;a++)add(RB(5,.6,1.4,.2),M(0xa06a3a),bx+Math.cos(a*PI/2)*14,1.2,bz+Math.sin(a*PI/2)*14).rotation.y=-a*PI/2}
const SLB=[],hy=[],bn=[],bc=[];
function park(bx,bz,sw,sd){const g=new T.Mesh(new T.PlaneGeometry(sw-3,sd-3),M(0x477A41));g.rotation.x=-PI/2;g.position.set(bx,.67,bz);g.receiveShadow=true;sc.add(g);
const pd=new T.Mesh(new T.CircleGeometry(11,28),new T.MeshStandardMaterial({color:0x2C7FA0,metalness:.5,roughness:.1,envMapIntensity:1.4}));pd.rotation.x=-PI/2;pd.position.set(bx+8,.72,bz-4);sc.add(pd);
for(const r of[0,1]){const p=new T.Mesh(new T.PlaneGeometry(r?3:sw-3,r?sd-3:3),M(0xBDAE8C));p.rotation.x=-PI/2;p.position.set(bx,.69,bz);sc.add(p)}
for(let n=0;n<24;n++){const x=bx+(R()-.5)*(sw-10),z=bz+(R()-.5)*(sd-10);if(Math.hypot(x-bx-8,z-bz+4)>13&&Math.abs(x-bx)>3&&Math.abs(z-bz)>3)treeAt(x,z,.9+R()*.6)}
for(const s of[-1,1])add(RB(4,.6,1.3,.2),M(0xa06a3a),bx+s*6,1.2,bz+3.5);bl.push([bx+8-10,bx+8+10,bz-14,bz+6])}
for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const z=zoneOf(i,j),x0=RXf(i-1)+rwx(i-1)/2,x1=RXf(i)-rwx(i)/2,z0=RZf(j-1)+rwz(j-1)/2,z1=RZf(j)-rwz(j)/2,sw=x1-x0,sd=z1-z0,bx=(x0+x1)/2,bz=(z0+z1)/2;SLB.push([x0,x1,z0,z1,z]);if(z==='Casino District'||z==='Luxury Hills'){for(const cx_ of[x0+2.2,x1-2.2])for(const cz_ of[z0+2.2,z1-2.2])palmAt(cx_,cz_,1)}
add(RB(sw+1,.7,sd+1,.3),curbM,bx,.3,bz).castShadow=false;const sl=new T.Mesh(new T.PlaneGeometry(sw,sd),pvM);sl.rotation.x=-PI/2;sl.position.set(bx,.655,bz);sl.receiveShadow=true;sc.add(sl);
for(let n=0;n<5;n++){const t=(n+.5)/5;LP.push([x0+1.3+t*(sw-2.6),0,z0+1.2],[x0+1.3+t*(sw-2.6),0,z1-1.2],[x0+1.2,0,z0+1.3+t*(sd-2.6)],[x1-1.2,0,z0+1.3+t*(sd-2.6)])}
for(let n=0;n<6;n++){const e=R()<.5,sg=R()<.5?-1:1,t=(R()-.5)*(e?sd:sw)*.9,k=R(),x=e?(sg>0?x1-1:x0+1):bx+t,zz=e?bz+t:(sg>0?z1-1:z0+1);if(k<.3)hy.push([x,1.15,zz]);else if(k<.65)bn.push([x,1.25,zz]);else bc.push([x,1.1,zz,1,1,1,e?PI/2:0])}
const poi=POIS.find(p=>p.i===i&&p.j===j);if(poi){landmark(poi,bx,bz);continue}if(i===0&&j===0){plaza(bx,bz);continue}
if((i*7+j*13+99)%9===0||(z==='Suburbs'&&R()<.2)){park(bx,bz,sw,sd);continue}
for(const ox of[-.25,.25])for(const oz of[-.25,.25]){let w=Math.min(sw/2-3,14+R()*8),d=Math.min(sd/2-3,14+R()*8),h=z==='Downtown'?36+R()*74:z==='Casino District'?22+R()*30:z==='Industrial Area'?10+R()*8:7+R()*3;
if(z==='Industrial Area'){w+=2;d+=2}const cx=bx+ox*sw,cz=bz+oz*sd;
if(z==='Suburbs'||z==='Luxury Hills'){w*=.62;d*=.62;house(cx,cz,w,d,z==='Luxury Hills'?h+2:h-1,z);treeAt(cx+(R()<.5?-9:9),cz+(R()<.5?-9:9),1);continue}
bld(cx,cz,w,d,h,z,ox*sw,oz*sd)}}
{const ag=new T.PlaneGeometry(1,1);ag.rotateX(-PI/2);inst(ag,AOM,bl.map(b=>[(b[0]+b[1])/2,.7,(b[2]+b[3])/2,b[1]-b[0]+9,1,b[3]-b[2]+9]))}
inst(new T.CylinderGeometry(.25,.3,1,8),M(0xd8353a),hy);inst(new T.CylinderGeometry(.4,.35,1.2,10),M(0x4a5568),bn);inst(RB(2.2,.9,.6,.2),M(0x9a6a3a),bc);
inst(new T.CylinderGeometry(.09,.16,6,6),M(0x2C2E38),LP.map(p=>[p[0],3.6,p[2]]));
const LAMPM=new T.MeshBasicMaterial({color:0xffe9a0,toneMapped:false});inst(new T.SphereGeometry(.42,10,8),LAMPM,LP.map(p=>[p[0],6.8,p[2]]));
const POOLM=new T.MeshBasicMaterial({map:cvs(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,.9)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64)}),color:0xffc780,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),pg=new T.PlaneGeometry(1,1);pg.rotateX(-PI/2);const POOL=inst(pg,POOLM,LP.map(p=>[p[0],.72,p[2],8,1,8]));
const TLm=[];for(let a=-4;a<4;a++)for(let b=-4;b<4;b++){const X=RXf(a),Z=RZf(b);for(const sx of[-1,1])for(const sz of[-1,1])TLm.push([X+sx*(rwx(a)/2+1.6),0,Z+sz*(rwz(b)/2+1.6),sx,sz])}
inst(new T.CylinderGeometry(.1,.14,7,6),M(0x2C2E38),TLm.map(p=>[p[0],3.8,p[2]]));
const TLI=inst(new T.SphereGeometry(.28,8,6),glow(0xffffff),TLm.map((p,i)=>[p[0],7.4,p[2],1,1,1,0,0xff3355]));let TLP=0,tlLast=-1;
// boulevard medians
{const mz=[],mx=[];const ok=(v,arr,w)=>{for(let k=-4;k<4;k++)if(Math.abs(v-arr(k))<w(k)/2+5)return 0;return 1};
for(let t=-250;t<=250;t+=12){if(ok(t,RZf,rwz)){mz.push([RXf(0),.5,t,3,.9,9]);palmAt(RXf(0),t,.95);}if(ok(t,RXf,rwx)){mx.push([t,.5,RZf(-1),9,.9,3]);palmAt(t,RZf(-1),.95)}}
inst(new T.BoxGeometry(1,1,1),M(0x477A41),mz.concat(mx))}
// bay, beach, pier, lighthouse, boats
const BOATS=[];{const wm=new T.Mesh(new T.PlaneGeometry(2800,1100),GFX.waterMat());wm.rotation.x=-PI/2;wm.position.set(0,.05,322+550);sc.add(wm);
for(let x=-310;x<=310;x+=19+R()*14)if(Math.abs(x-100)>14)palmAt(x,292+R()*20,1.05+R()*.3);const sd2=new T.Mesh(new T.PlaneGeometry(2800,34),M(0xC6AE84));sd2.rotation.x=-PI/2;sd2.position.set(0,.03,305);sc.add(sd2);
bl.push([-1500,92,324,1500],[108,1500,324,1500]);
add(RB(14,.14,92,.04),M(0xa5774a),100,.12,370);for(let n=0;n<9;n++){add(new T.CylinderGeometry(.4,.4,2,8),M(0x6b4a2a),93,.1,332+n*10);add(new T.CylinderGeometry(.4,.4,2,8),M(0x6b4a2a),107,.1,332+n*10)}
add(new T.CylinderGeometry(2.4,3.4,22,14),M(0xf4f0ff),100,11,414);add(new T.CylinderGeometry(2.6,2.6,3,14),glow(0xffe28a),100,23.5,414);add(new T.ConeGeometry(3.2,3,14),M(0xd8353a),100,26.5,414);bl.push([96,104,410,418]);
for(let n=0;n<5;n++){const b=new T.Group();add(RB(3,1.2,8,.5),M(0xf3f3f3),0,.3,0,b);add(RB(2,1.2,3,.3),M([0xff3d71,0x4ff0ff,0xffd23f][n%3]),0,1.4,-.6,b);b.position.set(-160+n*70+R()*20,0,350+R()*90);b.rotation.y=R()*PI;sc.add(b);BOATS.push(b)}}
// elevated monorail loop
const TRN=[],HX=305,PL=8*HX;{const tm=M(0x77787E);add(RB(2*HX,1,3,.2),tm,0,15,-HX);add(RB(2*HX,1,3,.2),tm,0,15,HX);add(RB(3,1,2*HX,.2),tm,-HX,15,0);add(RB(3,1,2*HX,.2),tm,HX,15,0);
const pp=[];for(let t=-HX;t<=HX;t+=38){pp.push([t,7.5,-HX],[t,7.5,HX],[-HX,7.5,t],[HX,7.5,t])}inst(new T.CylinderGeometry(.55,.75,15,8),M(0x77787E),pp);
for(let n=0;n<5;n++){const g=new T.Group();add(RB(9,3,3.2,1),M(n===0?0xff3d71:0xe8e8f4),0,0,0,g);add(RB(8,.8,3.3,.2),glow(0xffe9a0),0,.6,0,g);g.scale.setScalar(1);sc.add(g);TRN.push(g)}}
const trainAt=(s)=>{s=((s%PL)+PL)%PL;const q=s/(2*HX),k=Math.floor(q),f=(q-k)*2*HX;return k===0?[-HX+f,-HX,0]:k===1?[HX,-HX+f,PI/2]:k===2?[HX-f,HX,PI]:[-HX,HX-f,-PI/2]};
inst(new T.CylinderGeometry(.3,.5,2.8,7),M(0x5E4630),TR.map(a=>[a[0],a[1]+.35,a[2],a[3],a[4]])).castShadow=true;
inst(GFX.crownG(),new T.MeshStandardMaterial({roughness:.85,flatShading:true,envMapIntensity:.35}),TF.map(a=>[a[0],a[1]+.35,a[2],a[3],a[4],a[5],R()*6,a[7]])).castShadow=true;
{const pg_=GFX.palm();inst(pg_.trunk,M(0x8A6F4E),PALMS).castShadow=true;inst(pg_.fronds,new T.MeshStandardMaterial({flatShading:true,side:T.DoubleSide,roughness:.8,envMapIntensity:.3}),PALMS.map(a=>a.concat([[0x4F8E4A,0x5E9A50,0x457F48][(R()*3)|0]]))).castShadow=true}
sc.add(GFX.ridges());
const CM=new T.MeshBasicMaterial(),CLD=[];
{const st_=GFX.bakeCity(sc,150);console.info('[city] '+st_.parts+' parts into '+st_.batches+' batches')}
GFX.skidInit();
function push(o,r){let hit=0;for(const b of bl){const cx=cl(o.x,b[0],b[1]),cz=cl(o.z,b[2],b[3]);let dx=o.x-cx,dz=o.z-cz,d=Math.hypot(dx,dz);if(d<r){hit=1;if(d<1e-4){dx=1;dz=0;d=1}o.x=cx+dx/d*r;o.z=cz+dz/d*r}}return hit}
const gY=(x,z)=>{for(const q of SLB)if(x>q[0]-.5&&x<q[1]+.5&&z>q[2]-.5&&z<q[3]+.5)return .65;return 0};
// people: capsule body, big head, face
function cap(r,l){const p=[];for(let i=0;i<=6;i++){const a=-PI/2+i/6*PI/2;p.push(new T.Vector2(Math.cos(a)*r,Math.sin(a)*r-l/2))}for(let i=0;i<=6;i++){const a=i/6*PI/2;p.push(new T.Vector2(Math.cos(a)*r,Math.sin(a)*r+l/2))}return new T.LatheGeometry(p,14)}
const sk=[0xf1c27d,0xc68642,0x8d5524,0xffdbac],GT=cap(.3,.5),GL=cap(.12,.55),GA=cap(.085,.5);
function person(shirt){const o=new T.Group(),s=sk[(R()*4)|0],mk=(geo,c,x,y,z,p,sx,sy,sz)=>{const m=add(geo,M(c),x,y,z,p);if(sx)m.scale.set(sx,sy,sz);return m};
mk(GT,shirt,0,1.35,0,o);mk(SG,s,0,2.12,0,o,.3,.32,.3);mk(SG,[0x222222,0x6b3e1f,0xd4a017,0xc23b22,0xf3f3f3][(R()*5)|0],0,2.24,-.04,o,.31,.27,.31);
for(const x of[-.11,.11])mk(SG,0x111111,x,2.14,.27,o,.04,.05,.03);
o.lim=[];for(const x of[-.17,.17]){const l=new T.Group();l.position.set(x,.88,0);mk(GL,0x2d3a6b,0,-.4,0,l);mk(SG,0xf5f5f5,0,-.82,.07,l,.13,.08,.21);o.add(l);o.lim.push(l)}
for(const x of[-.4,.4]){const a=new T.Group();a.position.set(x,1.72,0);mk(GA,shirt,0,-.3,0,a);mk(SG,s,0,-.64,0,a,.09,.09,.09);o.add(a);o.lim.push(a)}GFX.bakeParts(o);o.lim.forEach(GFX.bakeParts);return o}
const swing=(o,v,t)=>{const a=Math.sin(t)*v;o.lim[0].rotation.x=a;o.lim[1].rotation.x=-a;o.lim[2].rotation.x=-a;o.lim[3].rotation.x=a};
const P={x:28.5,z:5,y:.65,vy:0,yaw:0,t:0,m:person(0xff3d71),car:null};sc.add(P.m);
const peds=[];for(let n=0;n<(matchMedia('(pointer:coarse)').matches?34:50);n++){const m=person([0x4ff0c8,0xffd23f,0x8a6bff,0xff8a3d,0xffffff,0x3d8bff][(R()*6)|0]);const a=((R()*8)|0)-4,b=((R()*8)|0)-4;
const q={m,a,b,sx:R()<.5?-1:1,sz:R()<.5?-1:1,t:R()*9,sp:1.8+R()*1.4};q.x=RXf(a)+q.sx*(rwx(a)/2+1.5);q.z=RZf(b)+q.sz*(rwz(b)/2+1.5);q.tx=q.x;q.tz=q.z;sc.add(m);peds.push(q)}
function nextP(q){const r=R();if(r<.25&&q.a<3)q.a++;else if(r<.5&&q.a>-4)q.a--;else if(r<.7&&q.b<3)q.b++;else if(r<.9&&q.b>-4)q.b--;else if(r<.95)q.sx*=-1;else q.sz*=-1;q.tx=RXf(q.a)+q.sx*(rwx(q.a)/2+1.5);q.tz=RZf(q.b)+q.sz*(rwz(q.b)/2+1.5)}
// cars: rounded bodies
// ===== cars: distinct silhouettes per model, buy at the dealership =====
const TY=[
{n:'Sedan',ico:'',d:'Reliable daily driver. Easy to handle.',price:4500,c:0x4361ee,w:2,l:4.6,h:1.2,wr:.46,tws:.38,wb:.31,cw:.88,r:1.8,max:42,acc:17,grip:7,st:1.8,sa:45,brake:34,mass:1,drag:.0016,df:0,rl:.007,pt:.035,rs:7,ef:105,pil:1,
 hull:[[0,0,.15],[1,0,.15],[1,.35,.18],[.86,.49,.3],[.56,.5,.2],[.14,.5,.2],[0,.42,.18]],cab:[[.62,.49,.05],[.5,1,.12],[.31,1,.12],[.18,.49,.05]],hx:.34,hy:.3,hs:[.26,.13,.08],tl:[.55,.1,.38]},
{n:'Sport',ico:'',d:'Lightweight coupe. Sharp turn-in, quick launch.',price:12000,c:0xff3d71,w:2,l:4.3,h:1,wr:.44,tws:.4,wb:.31,cw:.84,r:1.75,max:50,acc:24,grip:7.5,st:1.95,sa:48,brake:38,mass:.95,drag:.0014,df:.2,rl:.005,pt:.04,rs:9,ef:115,sp:1,
 hull:[[0,0,.12],[1,0,.12],[1,.34,.14],[.88,.5,.22],[.56,.54,.3],[.2,.58,.25],[0,.5,.14]],cab:[[.57,.53,.04],[.45,1,.18],[.28,1,.18],[.05,.56,.04]],hx:.36,hy:.34,hs:[.3,.09,.08],tl:[.7,.07,.44]},
{n:'SUV',ico:'',d:'Tall and roomy. Stable, a bit leany in corners.',price:15000,c:0x2ec4b6,w:2.3,l:4.8,h:1.65,wr:.56,tws:.44,wb:.31,cw:.9,r:2,max:38,acc:16,grip:5.6,st:1.55,sa:38,brake:30,mass:1.4,drag:.0022,df:0,rl:.011,pt:.05,rs:5,ef:90,pil:1,bh:.28,
 hull:[[0,0,.1],[1,0,.12],[1,.3,.14],[.9,.44,.16],[.62,.45,.08],[.05,.46,.08],[0,.4,.08]],cab:[[.64,.45,.04],[.56,1,.1],[.07,1,.1],[.02,.46,.04]],hx:.36,hy:.3,hs:[.22,.18,.08],tl:[.2,.5,.3],tx:.42},
{n:'Truck',ico:'',d:'Heavy pickup. Slow to launch, hard to stop, tough.',price:18000,c:0xd9a441,w:2.35,l:6,h:1.75,wr:.66,tws:.5,wb:.3,cw:.9,r:2.4,max:35,acc:14.5,grip:5,st:1.3,sa:34,brake:28,mass:1.8,drag:.0026,df:0,rl:.013,pt:.06,rs:4.5,ef:70,pil:1,bh:.3,
 hull:[[0,0,.06],[1,0,.1],[1,.4,.12],[.92,.56,.14],[.55,.56,.06],[.55,.43,.03],[0,.42,.05]],cab:[[.68,.55,.04],[.62,1,.12],[.40,1,.12],[.37,.55,.04]],hx:.36,hy:.33,hs:[.2,.2,.1],tl:[.18,.4,.46],tx:.42},
{n:'Muscle',ico:'',d:'Big power, loose rear. Burns rubber off the line.',price:22000,c:0xf77f00,w:2.1,l:4.8,h:1.1,wr:.5,tws:.44,wb:.31,cw:.84,r:1.9,max:52,acc:28,grip:4.2,st:1.7,sa:44,brake:33,mass:1.2,drag:.0015,df:0,rl:.009,pt:.06,rs:6,ef:80,spin:1,sp:1,
 hull:[[0,0,.12],[1,0,.12],[1,.4,.15],[.92,.55,.2],[.5,.58,.2],[.1,.62,.2],[0,.55,.14]],cab:[[.5,.57,.04],[.42,1,.14],[.22,1,.14],[.13,.62,.04]],hx:.32,hy:.38,hs:[.2,.2,.08],tl:[.6,.14,.45]},
{n:'Luxury',ico:'',d:'Long, smooth and quiet. Floaty, soft suspension.',price:40000,c:0xe0e0ff,w:2.1,l:5,h:1.2,wr:.48,tws:.42,wb:.31,cw:.88,r:2,max:46,acc:20,grip:6.5,st:1.55,sa:42,brake:36,mass:1.25,drag:.0016,df:0,rl:.009,pt:.03,rs:4.5,ef:90,pil:1,
 hull:[[0,0,.15],[1,0,.15],[1,.36,.2],[.88,.5,.3],[.5,.52,.2],[.12,.52,.2],[0,.45,.2]],cab:[[.66,.51,.05],[.55,1,.15],[.26,1,.15],[.12,.52,.05]],hx:.34,hy:.3,hs:[.28,.12,.08],tl:[.7,.1,.4]},
{n:'Supercar',ico:'',d:'Mid-engine monster. Huge grip and downforce.',price:95000,c:0xffd23f,w:2.15,l:4.5,h:.85,wr:.44,tws:.46,wb:.31,cw:.82,r:1.8,max:66,acc:34,grip:9.5,st:1.75,sa:55,brake:46,mass:.85,drag:.0012,df:.45,rl:.003,pt:.03,rs:11,ef:135,sp:1,
 hull:[[0,0,.1],[1,0,.1],[1,.34,.12],[.9,.5,.2],[.62,.56,.3],[.3,.62,.3],[.04,.62,.12],[0,.5,.1]],cab:[[.62,.56,.04],[.47,1,.25],[.3,1,.25],[.12,.64,.04]],hx:.38,hy:.36,hs:[.34,.07,.08],tl:[.8,.06,.5]}];
const glass=new T.MeshStandardMaterial({color:0x0e1626,metalness:.95,roughness:.05,envMapIntensity:2}),tire=M(0x15151c),rim=new T.MeshStandardMaterial({color:0xe6ebf5,metalness:.95,roughness:.15,envMapIntensity:1.5}),dark=M(0x15151c),white=M(0xf3f3f3),hlM=glow(0xffffff),tlM=glow(0xff1133);
function rpoly(pts,L,CH){const q=pts.map(p=>({x:(p[0]-.5)*L,y:p[1]*CH,r:p[2]||.1})),n=q.length,sh=new T.Shape();
for(let i=0;i<n;i++){const p0=q[(i+n-1)%n],p1=q[i],p2=q[(i+1)%n],d1=Math.hypot(p0.x-p1.x,p0.y-p1.y),d2=Math.hypot(p2.x-p1.x,p2.y-p1.y),r=Math.min(p1.r,d1/2.05,d2/2.05),ax=p1.x+(p0.x-p1.x)*r/d1,ay=p1.y+(p0.y-p1.y)*r/d1,bx=p1.x+(p2.x-p1.x)*r/d2,bz=p1.y+(p2.y-p1.y)*r/d2;if(i==0)sh.moveTo(ax,ay);else sh.lineTo(ax,ay);sh.quadraticCurveTo(p1.x,p1.y,bx,bz)}
sh.closePath();return sh}
function ext(sh,w,m,y,b){const bt=.1,g2=new T.ExtrudeGeometry(sh,{depth:Math.max(.05,w-2*bt),bevelEnabled:true,bevelThickness:bt,bevelSize:bt*.7,bevelSegments:2,curveSegments:5});g2.translate(0,0,-(w-2*bt)/2);g2.rotateY(-PI/2);return add(g2,m,0,y,0,b)}
const HLB=new T.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,side:T.DoubleSide,fog:false}),HLG=new T.ConeGeometry(1.8,14,12,1,true);HLG.rotateX(-PI/2);
function mkCar(ty,col,lite){const o=new T.Group(),b=new T.Group();o.add(b);const bm2=new T.MeshPhysicalMaterial({color:col,metalness:.6,roughness:.25,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.6}),W=ty.w,L=ty.l,CH=ty.h,wr=ty.wr,by=wr*.88,k=ty.n,yy=f=>by+CH*f,zz=f=>(f-.5)*L,ca=ty.cab,cw=W*ty.cw;
ext(rpoly(ty.hull,L,CH),W,bm2,by,b);ext(rpoly(ca,L,CH),cw,glass,by,b);
const top=ca.filter(p=>p[1]>=.99),x0=Math.min(...top.map(p=>p[0])),x1=Math.max(...top.map(p=>p[0])),zc=zz((ca[0][0]+ca[ca.length-1][0])/2);
add(RB(cw*.94,.1,Math.max(.3,(x1-x0)*L-.1),.05),bm2,0,by+CH,zz((x0+x1)/2),b);
for(const s of[-1,1]){if(ty.pil)add(RB(.1,CH*.5,.16,.04),bm2,s*(cw/2-.02),yy(.76),zc,b);
add(RB(.16,.13,.3,.05),bm2,s*(W/2+.02),yy(ca[0][1])+.12,zz(ca[0][0])-.15,b);
add(RB(.03,CH*.34,.025,.01),dark,s*(W/2+.005),yy(.3),zz(ca[0][0]-.02),b);add(RB(.03,CH*.34,.025,.01),dark,s*(W/2+.005),yy(.3),zz(ca[ca.length-1][0]+.05),b);
add(RB(.04,.1,L*.5,.03),dark,s*(W/2+.005),by+.08,0,b);
add(SG,hlM,s*W*ty.hx,yy(ty.hy),L/2-.02,b).scale.set(ty.hs[0],ty.hs[1],ty.hs[2]);
add(RB(ty.tl[0],ty.tl[1],.08,.04),tlM,s*W*(ty.tx||.33),yy(ty.tl[2]),-L/2-.02,b)}
const bh=ty.bh||.22;add(RB(W*1.01,bh,.35,.1),dark,0,by+bh*.36,L/2-.05,b);add(RB(W*1.01,bh,.35,.1),dark,0,by+bh*.36,-L/2+.05,b);
add(RB(W*.5,CH*.09,.07,.03),dark,0,yy(.22),L/2+.01,b);
// model-specific details
if(k==='Sedan'){add(RB(W*.78,.07,.35,.03),bm2,0,yy(.55),zz(.04),b);for(const s of[-1,1])add(RB(.03,.04,L*.62,.02),rim,s*(W/2+.01),yy(.34),zz(.45),b);const e=add(new T.CylinderGeometry(.06,.06,.22,10),rim,W*.3,by+.12,-L/2-.06,b);e.rotation.x=PI/2}
if(k==='Sport'){add(RB(W,.05,.4,.02),dark,0,by+.03,L/2+.08,b);add(RB(W*.8,.06,.55,.03),dark,0,yy(.7),zz(.03),b);for(const s of[-1,1]){add(RB(.08,.2,.1,.03),dark,s*W*.3,yy(.6),zz(.03),b);add(RB(.04,.18,.5,.03),dark,s*(W/2+.005),yy(.28),zz(.45),b);add(RB(W*.2,.03,.5,.02),dark,s*W*.22,yy(.5),zz(.72),b);const e=add(new T.CylinderGeometry(.06,.06,.2,10),rim,s*W*.26,by+.16,-L/2-.05,b);e.rotation.x=PI/2}}
if(k==='Supercar'){add(RB(W,.05,.45,.02),dark,0,by+.03,L/2+.08,b);add(RB(W*.95,.06,.6,.03),dark,0,yy(1.02),zz(.04),b);for(const s of[-1,1]){add(RB(.08,.4,.14,.03),dark,s*W*.3,yy(.8),zz(.04),b);add(RB(.05,.2,.9,.04),dark,s*(W/2+.005),yy(.3),zz(.45),b);const e=add(new T.CylinderGeometry(.07,.07,.2,10),rim,s*W*.12,by+.2,-L/2-.05,b);e.rotation.x=PI/2}add(RB(W*.8,.14,.5,.03),dark,0,by+.1,-L/2+.1,b)}
if(k==='Muscle'){add(RB(W*.34,.14,1.1,.06),bm2,0,yy(.6)+.04,zz(.75),b);add(RB(W*.26,.06,.1,.02),dark,0,yy(.6)+.08,zz(.75)+.56,b);add(RB(W*1.02,.12,.3,.05),rim,0,by+.14,L/2,b);add(RB(W*.85,.05,.4,.02),dark,0,yy(.7),zz(.03),b);for(const s of[-1,1]){add(RB(.015,.1,L*.7,.01),white,s*(W/2+.012),yy(.22),zz(.5),b);add(RB(.1,.1,.12,.03),dark,s*W*.3,yy(.62)-.06,zz(.04)-.05,b);const e=add(new T.CylinderGeometry(.09,.09,.26,10),rim,s*W*.3,by+.13,-L/2-.08,b);e.rotation.x=PI/2}}
if(k==='Luxury'){add(RB(W*.4,CH*.34,.06,.03),rim,0,yy(.26),L/2+.01,b);add(SG,rim,0,yy(.55)+.08,zz(.9),b).scale.setScalar(.07);for(const s of[-1,1])add(RB(.03,.05,L*.7,.02),rim,s*(W/2+.01),yy(.33),zz(.5),b)}
if(k==='SUV'){for(const s of[-1,1]){add(RB(.06,.06,Math.max(.5,(x1-x0)*L*.9),.02),dark,s*cw*.42,by+CH+.06,zz((x0+x1)/2),b);add(RB(.1,CH*.5,.7,.04),bm2,s*(cw/2-.02),yy(.72),zz(.14),b);add(RB(.22,.06,L*.4,.03),dark,s*(W/2+.1),by+.02,zz(.45),b);add(RB(.06,.3,.06,.02),rim,s*W*.3,by+.3,L/2+.14,b)}
for(const z of[.35,.6])add(RB(cw*.9,.04,.06,.02),dark,0,by+CH+.09,zz(z),b);add(RB(W*.7,.12,.1,.04),rim,0,by+.5,L/2+.15,b);
const sp=add(new T.CylinderGeometry(.46,.46,.3,18),tire,0,yy(.7),-L/2-.18,b);sp.rotation.x=PI/2;const sr=add(new T.CylinderGeometry(.24,.24,.32,12),rim,0,yy(.7),-L/2-.18,b);sr.rotation.x=PI/2}
if(k==='Truck'){add(RB(W*.99,CH*.14,(.68-.37)*L,.06),bm2,0,yy(.49),zz(.525),b);
for(const s of[-1,1]){add(RB(.12,CH*.26,L*.37,.04),bm2,s*(W/2-.08),yy(.42)+CH*.13,zz(.185),b);add(RB(.55,CH*.2,1.5,.15),bm2,s*(W/2-.3),yy(.42)+CH*.1,-L*.3,b);add(RB(.1,.1,.4,.03),rim,s*W*.3,by+.15,L/2+.1,b)}
add(RB(W-.1,CH*.26,.12,.04),bm2,0,yy(.42)+CH*.13,-L/2+.06,b);add(RB(W-.35,.03,L*.34,.01),dark,0,yy(.42)+.015,zz(.2),b);
add(RB(W*.7,CH*.2,.08,.03),rim,0,yy(.34),L/2,b);add(RB(W*1.02,.3,.3,.08),rim,0,by+.14,L/2+.04,b);add(RB(.14,.14,.4,.03),dark,0,by+.2,-L/2-.1,b);
add(RB(W*.6,.1,.18,.04),dark,0,by+CH+.08,zz(.55),b);for(let i=-1.5;i<=1.5;i++)add(SG,hlM,i*W*.14,by+CH+.08,zz(.55)+.1,b).scale.setScalar(.07)}
for(const s of[-1,1]){const cn=new T.Mesh(HLG,HLB);cn.position.set(s*W*.3,by+CH*.3,L/2+7);b.add(cn)}
o.wh=[];const tw=ty.tws,wx=W/2-tw/2+.12;
for(const[x,z]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const p=new T.Group();p.position.set(x*wx,wr,z*L*ty.wb);const w=add(new T.CylinderGeometry(wr,wr,tw,lite?14:22),tire,0,0,0,p);w.rotation.z=PI/2;
const r2=add(new T.CylinderGeometry(wr*.64,wr*.64,tw+.03,12),rim,0,0,0,p);r2.rotation.z=PI/2;
if(!lite)for(let q=0;q<3;q++){const sp=add(new T.BoxGeometry(.07,.02,wr*1.15),dark,0,-x*(tw/2+.02),0,r2);sp.rotation.y=q*PI/3;sp.castShadow=false}
o.add(p);o.wh.push([p,w,z>0,r2])}
const sh=new T.Mesh(new T.PlaneGeometry(W*1.5,L*1.25),AOM);sh.rotation.x=-PI/2;sh.position.y=.06;o.add(sh);GFX.bakeParts(b);o.body=b;o.bm=bm2;return o}
const cars=[],mkc=(ty,x,z,h,ai,col)=>{const cc=ai?new T.Color().setHSL(R(),.7,.55):col!=null?col:ty.c,m=mkCar(ty,cc,ai);sc.add(m);const c={ty,m,x,z,h,vx:0,vz:0,hp:0,sp:0,roll:0,pit:0,ai,col:cc};cars.push(c);return c};
// showroom display cars (locked - you have to buy them)
DEAL.forEach(([bx,bz])=>TY.forEach((t,n)=>{const c=mkc(t,bx-24+n*8,bz+22,(n%2?.4:-.4));c.show=1;c.m.traverse(q_=>{if(q_.material===HLB)q_.visible=false})}));
const D4=[[1,0],[-1,0],[0,1],[0,-1]],nodeOK=(a,b)=>a>=-4&&a<=3&&b>=-4&&b<=3;
for(let n=0;n<20;n++){const c=mkc(TY[(R()*TY.length)|0],0,0,0,1);c.a=((R()*8)|0)-4;c.b=((R()*8)|0)-4;c.d=D4[(R()*4)|0];c.t=R();c.x=RXf(c.a);c.z=RZf(c.b)}
function aiCar(c,dt){let na=c.a+c.d[0],nb=c.b+c.d[1];if(!nodeOK(na,nb)){c.d=D4.filter(d=>nodeOK(c.a+d[0],c.b+d[1]))[0];na=c.a+c.d[0];nb=c.b+c.d[1]}
const sl=Math.abs(RXf(na)-RXf(c.a))+Math.abs(RZf(nb)-RZf(c.b)),red=c.t>.82&&c.t<.99&&(c.d[1]!==0?TLP!==0:TLP!==1);if(!red)c.t+=dt*13/sl;
if(c.t>=1){c.t=0;c.a=na;c.b=nb;const o=D4.filter(d=>nodeOK(c.a+d[0],c.b+d[1])&&!(d[0]==-c.d[0]&&d[1]==-c.d[1]));if(R()<.6&&nodeOK(c.a+c.d[0],c.b+c.d[1]))o.push(c.d,c.d);c.d=o[(R()*o.length)|0];return}
const tx=RXf(c.a)+(RXf(na)-RXf(c.a))*c.t+c.d[1]*-3.6,tz=RZf(c.b)+(RZf(nb)-RZf(c.b))*c.t+c.d[0]*3.6;
c.x+=(tx-c.x)*Math.min(1,dt*5);c.z+=(tz-c.z)*Math.min(1,dt*5);const th=Math.atan2(c.d[0],c.d[1]);let dh=th-c.h;dh=Math.atan2(Math.sin(dh),Math.cos(dh));c.h+=dh*Math.min(1,dt*6)}
// smoke
const SM=[],smT=GFX.smokeTex();for(let i=0;i<30;i++){const m=new T.Sprite(new T.SpriteMaterial({map:smT,color:0xCFC9C2,transparent:true,opacity:0,depthWrite:false}));m.visible=false;m.life=0;sc.add(m);SM.push(m)}let si=0,fr=0;
const puff=(x,z)=>{const m=SM[si++%30];m.position.set(x,.7,z);m.life=.9;m.visible=true;m.scale.set(1.6,1.6,1)};
// ===== day / night: 3 real minutes = 24h =====
const PLs=[];let plf=0,lastLook='x';const amb=new T.AmbientLight(0x6a78d0,0);sc.add(amb);
// ===== player customization (Schedule-1 style low-poly characters) =====
const LK={skin:[0xf6d2b0,0xe0a878,0xc68642,0x9a6236,0x6b3f26,0x45291a],hair:[0x16161a,0x4a2c17,0x8a5a2b,0xd9a441,0xc23b22,0xe9e9ef,0x4ff0ff,0xb14dff],top:[0xff3d71,0xffd23f,0x2ec4b6,0x3d8bff,0x8a6bff,0xff8a3d,0xf3f3f3,0x16161e,0x4a6a3a,0x7a2030],bot:[0x2d3a6b,0x16161e,0x6b5a3a,0x7a2030,0xdcdce6,0x3a6b4a,0x555566,0xc9b078],shoe:[0xf3f3f3,0x16161e,0xff3d71,0xffd23f,0x4ff0ff,0x7a4a2a]},
OPT={hs:['Bald','Buzz','Short','Spiky','Long','Mohawk','Afro'],beard:['None','Stubble','Full','Goatee'],top:['Tee','Hoodie','Jacket','Tank','Suit'],bot:['Jeans','Shorts','Joggers','Slacks'],shoeT:['Sneakers','Boots'],hat:['None','Cap','Beanie','Bucket','Top hat','Crown'],gl:['None','Shades','Round','Visor'],build:['Slim','Average','Stocky']},
LD={skin:0,hair:1,hs:2,beard:0,top:0,tc:0,bot:0,bc:0,shoeT:0,shoe:0,hat:0,hc:7,gl:0,bp:0,ch:0,mask:0,build:1};
const PLMc={},PLM=c=>PLMc[c]||(PLMc[c]=new T.MeshStandardMaterial({color:c,roughness:.85,flatShading:true,envMapIntensity:.4}));
function applyLook(){buildLook(P.m,S.look)}
function buildLook(o,lk){const l=Object.assign({},LD,lk||{});while(o.children.length)o.remove(o.children[0]);o.lim=[];
const bw=[.88,1,1.18][l.build],sk=LK.skin[l.skin],hc=LK.hair[l.hair],tc=LK.top[l.tc],bc=LK.bot[l.bot===undefined?0:l.bc],shc=LK.shoe[l.shoe],ac=LK.top[l.hc]!==undefined?LK.top[l.hc]:0x16161e;
const A=(g,c,x,y,z,p)=>add(g,PLM(c),x,y,z,p||o),B=(w,h,d,r,c,x,y,z,p)=>A(RB(w,h,d,r),c,x,y,z,p),ball=(c,x,y,z,p,sx,sy,sz)=>{const m=A(SG,c,x,y,z,p);m.scale.set(sx,sy||sx,sz||sx);return m};
const long=l.top===1||l.top===2||l.top===4,tcol=tc;
for(const s of[-1,1]){const g=new T.Group();g.position.set(s*.17*bw,.98,0);o.add(g);B(.27*bw,.5,.3,.11,bc,0,-.25,0,g);B(.24*bw,.48,.27,.1,l.bot===1?sk:bc,0,-.72,0,g);if(l.bot===2)B(.28*bw,.08,.31,.04,0x22222c,0,-.92,0,g);
B(.29*bw,l.shoeT?.3:.17,.52,.08,l.shoeT?0x3a2a1c:shc,0,l.shoeT?-.84:-.9,.08,g);B(.31*bw,.06,.55,.03,l.shoeT?0x16161e:0xf3f3f3,0,-.97,.08,g);o.lim.push(g)}
for(const s of[-1,1]){const g=new T.Group();g.position.set(s*(.4*bw+.12),1.9,0);o.add(g);B(.2,.45,.23,.08,l.top===3?sk:tcol,0,-.22,0,g);B(.18,.42,.21,.07,long?tcol:sk,0,-.64,0,g);ball(sk,0,-.9,0,g,.11);o.lim.push(g)}
B(.64*bw,.28,.36,.1,bc,0,1.04,0);B(.74*bw,.8,.42,.14,l.top===4?0x1a1a24:tcol,0,1.56,0);A(new T.CylinderGeometry(.1,.12,.16,10),sk,0,2.02,0);
if(l.top===1){B(.52*bw,.24,.2,.1,tcol,0,1.98,-.2);B(.46*bw,.2,.05,.06,tcol,0,1.3,.22);B(.04,.18,.03,.01,0xf3f3f3,-.07,1.8,.22);B(.04,.18,.03,.01,0xf3f3f3,.07,1.8,.22)}
if(l.top===2){B(.74*bw,.1,.46,.05,tcol,0,1.95,0);B(.03,.7,.03,.01,0x22222c,0,1.56,.22);B(.12,.1,.05,.02,0xdcdce6,0,1.9,.22)}
if(l.top===4){B(.2,.5,.05,.02,0xf3f3f3,0,1.68,.22);B(.07,.4,.04,.02,0xd8353a,0,1.62,.24);B(.14,.34,.05,.02,0x1a1a24,-.22*bw,1.7,.22);B(.14,.34,.05,.02,0x1a1a24,.22*bw,1.7,.22)}
const hg=new T.Group();hg.position.set(0,2.36,0);o.add(hg);B(.48,.52,.48,.19,sk,0,0,0,hg);for(const s of[-1,1]){ball(sk,s*.25,0,0,hg,.06,.09,.05);const e=B(.1,.09,.04,.03,0xffffff,s*.11,.05,.235,hg);B(.045,.06,.03,.015,0x14141c,s*.11,.05,.255,hg);B(.12,.025,.03,.01,hc===0xe9e9ef?0x888890:0x2a1a12,s*.11,.14,.24,hg)}
B(.07,.1,.06,.03,sk,0,-.04,.26,hg);B(.14,.025,.03,.01,0x7a2f2f,0,-.14,.245,hg);
const hs=l.hs;if(hs===1)B(.5,.14,.5,.12,hc,0,.2,0,hg);if(hs===2){B(.52,.2,.52,.14,hc,0,.2,-.02,hg);B(.5,.3,.1,.05,hc,0,.06,-.22,hg)}
if(hs===3){B(.5,.14,.5,.1,hc,0,.2,0,hg);for(let n=0;n<5;n++)A(new T.ConeGeometry(.07,.22,5),hc,-.18+n*.09,.38,(n%2?.05:-.05),hg)}
if(hs===4){B(.52,.2,.52,.14,hc,0,.2,-.02,hg);B(.52,.62,.12,.06,hc,0,-.08,-.24,hg);for(const s of[-1,1])B(.07,.4,.3,.04,hc,s*.27,0,-.04,hg)}
if(hs===5)B(.1,.22,.5,.04,hc,0,.28,-.02,hg);if(hs===6)ball(hc,0,.14,-.02,hg,.4,.34,.4);
if(l.beard===1)B(.46,.17,.1,.06,0x4a3a30,0,-.15,.2,hg);if(l.beard===2){B(.5,.24,.16,.07,hc,0,-.14,.18,hg);for(const s of[-1,1])B(.06,.3,.2,.03,hc,s*.24,-.04,.05,hg)}if(l.beard===3)B(.15,.15,.1,.04,hc,0,-.19,.22,hg);
if(l.mask)B(.44,.24,.1,.05,0x9fd8ff,0,-.12,.22,hg);
if(l.hat===1){B(.52,.17,.52,.08,ac,0,.3,0,hg);B(.42,.04,.28,.02,ac,0,.22,.32,hg)}
if(l.hat===2){ball(ac,0,.22,0,hg,.3,.22,.3);B(.5,.07,.5,.03,ac,0,.14,0,hg)}
if(l.hat===3){A(new T.CylinderGeometry(.26,.31,.22,12),ac,0,.34,0,hg);A(new T.CylinderGeometry(.44,.44,.04,16),ac,0,.24,0,hg)}
if(l.hat===4){A(new T.CylinderGeometry(.27,.27,.5,14),0x16161e,0,.5,0,hg);A(new T.CylinderGeometry(.42,.42,.05,16),0x16161e,0,.27,0,hg)}
if(l.hat===5)add(new T.CylinderGeometry(.34,.24,.3,5),new T.MeshStandardMaterial({color:0xffc94a,metalness:.8,roughness:.25,flatShading:true}),0,.42,0,hg);
if(l.gl===1)B(.5,.1,.07,.03,0x0a0a10,0,.05,.255,hg);if(l.gl===3)B(.52,.1,.2,.04,0x4ff0ff,0,.08,.25,hg);
if(l.gl===2)for(const s of[-1,1])add(new T.TorusGeometry(.07,.016,6,14),PLM(0x16161e),s*.11,.05,.26,hg);
if(l.ch){const t=add(new T.TorusGeometry(.2,.02,6,16),new T.MeshStandardMaterial({color:0xffc94a,metalness:.9,roughness:.2}),0,1.95,.04,o);t.rotation.x=PI/2;ball(0xffc94a,0,1.76,.23,o,.06)}
if(l.bp)B(.5*bw,.62,.24,.1,ac,0,1.58,-.32)}
function setLook(k,i){S.look=Object.assign({},LD,S.look||{});S.look[k]=i;applyLook();save();rStyle()}
function rndLook(){const r=n=>(R()*n)|0;S.look={skin:r(6),hair:r(8),hs:r(7),beard:r(4),top:r(5),tc:r(10),bot:r(4),bc:r(8),shoeT:r(2),shoe:r(6),hat:r(6),hc:r(10),gl:r(4),bp:r(2),ch:r(2),mask:0,build:r(3)};applyLook();save();rStyle()}
const clk=$('clk');let NIGHT=0,envT=99,envRT=null,T0=performance.now()-248760,lastMin=-1;
const skyU={top:{value:new T.Color()},hor:{value:new T.Color()},sunD:{value:new T.Vector3()},sunC:{value:new T.Color()}};
const skyG=new T.SphereGeometry(1000,32,20),skyN=skyG.attributes.position.count,skyD=new Float32Array(skyN*3);{const p=skyG.attributes.position;for(let i=0;i<skyN;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),l=Math.hypot(x,y,z);skyD[i*3]=x/l;skyD[i*3+1]=y/l;skyD[i*3+2]=z/l}}
skyG.setAttribute('color',new T.BufferAttribute(new Float32Array(skyN*3),3));
const skyMat=new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,depthWrite:false,fog:false,toneMapped:false});
function paintSky(){const c=skyG.attributes.color.array,tp=skyU.top.value,hr=skyU.hor.value,sc3=skyU.sunC.value,sd=skyU.sunD.value;
for(let i=0;i<skyN;i++){const x=skyD[i*3],y=skyD[i*3+1],z=skyD[i*3+2];let r,g,b;
if(y<0){r=hr.r*.7;g=hr.g*.7;b=hr.b*.7}else{const h=Math.pow(y,.5);r=hr.r+(tp.r-hr.r)*h;g=hr.g+(tp.g-hr.g)*h;b=hr.b+(tp.b-hr.b)*h;const d=Math.max(0,x*sd.x+y*sd.y+z*sd.z),k=Math.pow(d,6)*.4+Math.pow(d,180)*1.2;r+=sc3.r*k;g+=sc3.g*k;b+=sc3.b*k}
c[i*3]=r;c[i*3+1]=g;c[i*3+2]=b}skyG.attributes.color.needsUpdate=true}
const dome=GFX.skyMesh();sc.add(dome);sc.background=new T.Color(0x2a3772);
const skyScene=new T.Scene();{const sm=new T.Mesh(skyG,skyMat);sm.scale.setScalar(.05);skyScene.add(sm)};const pmg=new T.PMREMGenerator(rd);
function updEnv(){try{const t=pmg.fromScene(skyScene,0,1,200);if(envRT)envRT.dispose();envRT=t;sc.environment=t.texture}catch(e){}}
const stP=new Float32Array(1500);for(let i=0;i<500;i++){const a=R()*PI*2,y=.05+R()*.95,r=Math.sqrt(1-y*y);stP.set([Math.cos(a)*r*900,y*900,Math.sin(a)*r*900],i*3)}
const stG=new T.BufferGeometry();stG.setAttribute('position',new T.BufferAttribute(stP,3));const stM=new T.PointsMaterial({size:1.7,sizeAttenuation:false,color:0xffffff,transparent:true,opacity:0,fog:false,depthWrite:false}),stars=new T.Points(stG,stM);stars.frustumCulled=false;sc.add(stars);
const moonS=new T.Sprite(new T.SpriteMaterial({map:cvs(128,128,(g)=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'#fff');r.addColorStop(.42,'#e8eeff');r.addColorStop(.46,'rgba(190,210,255,.35)');r.addColorStop(1,'rgba(150,180,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128)}),fog:false,depthWrite:false,toneMapped:false,transparent:true}));moonS.scale.set(120,120,1);sc.add(moonS);
const moonL=new T.DirectionalLight(0xA2B0D8,0);sc.add(moonL,moonL.target);
const ss=(a,b,x)=>{x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)},K_={ch:new T.Color(),cl:new T.Color(),cd1:new T.Color(0xFFFFFF),cd2:new T.Color(0x98ACC6),ct1:new T.Color(0xFFC9A0),ct2:new T.Color(0x6B4F86),cn1:new T.Color(0x2A3560),cn2:new T.Color(0x10162E),nz:new T.Color(0x060A20),nh:new T.Color(0x1A2450),dz:new T.Color(0x2763C4),dh:new T.Color(0xBFDCF4),tz:new T.Color(0x38307A),th:new T.Color(0xFF8A4C),w:new T.Color(0xffffff),sw:new T.Color(0xffd9a0),so:new T.Color(0xff9a55),gd:new T.Color(0x6a5a62),gn:new T.Color(0x34346a),nb:new T.Color(0x8088AE),cn:new T.Color(0x1c2040),cp:new T.Color(0xffb0a8)};
const TL0=new T.Color(0xff3355),TL1=new T.Color(0x33ff66),pad2=n=>String(n).padStart(2,'0');
function dayNight(dt){if(INTRO)T0=performance.now()-248760;const u=GFX.dayU(performance.now()-T0),th=(u-.25)*PI*2,e=Math.sin(th);SD.set(Math.cos(th)*.75,e,-.45).normalize();
const df=ss(-.12,.3,e),tw=Math.exp(-Math.pow(e/.2,2));NIGHT=1-ss(-.14,.18,e);
skyU.top.value.copy(K_.nz).lerp(K_.dz,df).lerp(K_.tz,tw*.55);skyU.hor.value.copy(K_.nh).lerp(K_.dh,df).lerp(K_.th,tw*.9);skyU.sunD.value.copy(SD);skyU.sunC.value.setRGB(1,.72+.24*(1-tw),.42+.48*(1-tw)).multiplyScalar(df*(.42+tw*.75));
dome.position.copy(cam.position);stars.position.copy(cam.position);stM.opacity=NIGHT*NIGHT;moonS.position.copy(cam.position).addScaledVector(SD,-850);moonS.material.opacity=NIGHT;sunS.material.opacity=ss(-.1,.08,e);
sc.fog.color.copy(skyU.hor.value).lerp(skyU.top.value,.14+.3*tw).multiplyScalar(.92-.4*NIGHT);sc.background.copy(skyU.hor.value);amb.intensity=IN?0:.1*NIGHT;
GFX.gradeTick(NIGHT,tw,window._sp||0,IN);
if(!IN){sun.intensity=(1.3-.48*Math.max(0,e))*ss(-.06,.09,e);sun.color.copy(K_.sw).lerp(K_.so,tw).lerp(K_.w,df*.6);moonL.intensity=.3*NIGHT;moonL.position.copy(cam.position).addScaledVector(SD,-100);moonL.target.position.copy(cam.position);
hemi.intensity=.2+.2*df+.16*tw*(1-NIGHT*.5);hemi.color.setHex(0xe0d8ff).lerp(K_.nb,NIGHT*.8);hemi.groundColor.copy(K_.gn).lerp(K_.gd,df)}
GFX.night(NIGHT,performance.now()/1000);
LAMPM.color.setRGB(1,.9,.66).multiplyScalar(.2+NIGHT*2.1);POOLM.opacity=.3*NIGHT;POOL.visible=NIGHT>.03;hlM.color.setScalar(1+NIGHT*3);tlM.color.setRGB(1,.07,.2).multiplyScalar(1+NIGHT*2.5);
if(bloom){bloom.strength=IN?.48:.2+NIGHT*.42;const bt_=IN?.74:.9-.08*NIGHT;bloom.threshold=bt_;if(bloom.highPassUniforms)bloom.highPassUniforms.luminosityThreshold.value=bt_}K_.ch.copy(K_.cd1).lerp(K_.ct1,tw).lerp(K_.cn1,NIGHT);K_.cl.copy(K_.cd2).lerp(K_.ct2,tw).lerp(K_.cn2,NIGHT);GFX.skyTick(skyU,NIGHT,performance.now()/1000,K_.ch,K_.cl,sc.fog.color);
HLB.opacity=.07*NIGHT;PLs.forEach(l=>l.intensity=IN?0:NIGHT*90);
{const lk=JSON.stringify(S.look||{});if(lk!==lastLook){lastLook=lk;applyLook()}}
envT+=dt;if(envT>6){envT=0;paintSky();updEnv()}
const ph=Math.floor(performance.now()/7000)%2;if(ph!==TLP||tlLast<0){TLP=ph;tlLast=1;TLm.forEach((p,i)=>TLI.setColorAt(i,((p[3]*p[4]>0)===(TLP===0))?TL1:TL0));TLI.instanceColor.needsUpdate=true}
const t=performance.now()/1000;BOATS.forEach((b,i)=>{b.position.y=.1+Math.sin(t*1.3+i)*.14;b.rotation.z=Math.sin(t*.9+i)*.05});
const ts=t*22;TRN.forEach((g,i)=>{const q=trainAt(ts-i*10);g.position.set(q[0],16.9,q[1]);g.rotation.y=-q[2]});
const hh=u*24,mm=Math.floor(hh*60);if(mm!==lastMin){lastMin=mm;clk.innerHTML=`<span class="g ti">${EG[e>0?'sun':'moon']}</span>${pad2(Math.floor(hh))}:${pad2(mm%60)}`}}
// post fx: MSAA + bloom + filmic grade
try{const hf=rd.capabilities.isWebGL2&&(rd.extensions.has('EXT_color_buffer_float')||rd.extensions.has('EXT_color_buffer_half_float'));
if(rd.capabilities.isWebGL2){rd.extensions.get('EXT_color_buffer_float');rd.extensions.get('EXT_color_buffer_half_float')}
if(!(T.EffectComposer&&T.UnrealBloomPass&&T.ShaderPass&&T.RenderPass))throw 0;
const rt=new T.WebGLMultisampleRenderTarget(SW*PR,SH*PR,{type:hf?T.HalfFloatType:T.UnsignedByteType,format:T.RGBAFormat});rt.samples=GFX.samples();
comp=new T.EffectComposer(rd,rt);comp.setSize(SW*PR,SH*PR);comp.addPass(new T.RenderPass(sc,cam));bloom=new T.UnrealBloomPass(new T.Vector2(SW/2,SH/2),.3,.6,hf?.9:.82);comp.addPass(bloom);GFX.applyStart();
{const gp_=new T.ShaderPass(GFX.gradeShader());comp.addPass(gp_);GFX.setGrade(gp_)}
rd.toneMapping=T.NoToneMapping}catch(e){comp=null;rd.toneMapping=T.ACESFilmicToneMapping}
// input
const K={},B={},J={x:0,y:0};let started=0,look=0,fp=0,CY=0,CP=.3;
addEventListener('keydown',e=>{K[e.code]=1;if(e.code==='KeyE')B.act=1;if(e.code==='Space')B.jump=1;if(e.code==='KeyC')B.cam=1;go()});addEventListener('keyup',e=>K[e.code]=0);
document.querySelectorAll('.b').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.stopPropagation();B[k]=1;B['h'+k]=1;go()});const up=()=>B['h'+k]=0;b.addEventListener('pointerup',up);b.addEventListener('pointerleave',up)});
const joy=$('joy'),kn=$('knob');let jid=null;
const mv=e=>{const p=sp2(e);let x=(p.x-JX)/45,y=(JY-p.y)/45,l=Math.hypot(x,y);if(l>1){x/=l;y/=l}J.x=x;J.y=y;kn.style.transform=`translate(${x*40}px,${-y*40}px)`};
joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);mv(e);go()});joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)mv(e)});
const rel=e=>{if(e.pointerId===jid){jid=null;J.x=J.y=0;kn.style.transform=''}};joy.addEventListener('pointerup',rel);joy.addEventListener('pointercancel',rel);
let lx,ly,lid=null;$('c').addEventListener('pointerdown',e=>{lid=e.pointerId;const p=sp2(e);lx=p.x;ly=p.y;go()});
addEventListener('pointermove',e=>{if(e.pointerId===lid){const p=sp2(e);CY-=(p.x-lx)*.006;CP=cl(CP+(p.y-ly)*.004,-.1,.9);lx=p.x;ly=p.y;look=1.5}});
addEventListener('pointerup',e=>{if(e.pointerId===lid)lid=null});
let AC,osc,eg;function go(){if(started)return;started=1;$('help').style.display='none';try{AC=new AudioContext();osc=AC.createOscillator();osc.type='sawtooth';eg=AC.createGain();eg.gain.value=0;const lp_=AC.createBiquadFilter();lp_.type='lowpass';lp_.frequency.value=760;lp_.Q.value=.8;osc.connect(lp_).connect(eg).connect(AC.destination);osc.start()}catch(e){}}
addEventListener('visibilitychange',()=>{if(AC)document.hidden?AC.suspend():AC.resume()});
const mc=$('mc').getContext('2d');
// ===== economy, phone, map =====
const DEF=()=>({coins:5000,xp:0,cards:{},own:{},q:0,lxp:0,t:0}),S=DEF();let ACC=null;
const skey=n=>'ec5:'+n.toLowerCase(),save=()=>{if(!ACC)return;S.t=Date.now();try{localStorage.setItem(skey(ACC),JSON.stringify(S))}catch(e){}cloudQ()};
function loadProfile(d){Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,DEF(),d||{});if(S.q<6&&Object.keys(S.own||{}).length)S.q=6;
// old crypto holdings are paid back at what the player put in, since that market no longer exists
const back=Math.round(Object.values(S.cost||{}).reduce((a,b)=>a+(+b||0),0));delete S.hold;delete S.cost;if(back>0){S.coins+=back;setTimeout(()=>{toast('Your old crypto was cashed out for '+fm(back)+' coins.');save()},1800)}
if(casApi)casApi.cityReload()}
// ===== levels (cosmetic only - no gameplay perks) =====
const lvOf=x=>Math.min(100,Math.floor((1+Math.sqrt(1+x/12.5))/2)),lvAt=L=>50*L*(L-1);
let lvShown=0;
function addXp(n){n=Math.round(n);if(n<=0||!ACC&&false)return;const o=lvOf(S.lxp||0);S.lxp=(S.lxp||0)+n;const L=lvOf(S.lxp);lvRender();if(L>o){toast('Level up. You are now level '+L+'.');const f=$('flash');f.classList.remove('lit');void f.offsetWidth;f.classList.add('lit');save()}}
const fm=n=>Math.round(n).toLocaleString(),VIP=[['Rookie',0],['Bronze',5e3],['Silver',25e3],['Gold',1e5],['Platinum',3e5],['Emerald',1e6],['Diamond',3e6],['Obsidian',1e7]];
const vipOf=()=>{let l=0;VIP.forEach((v,i)=>{if(S.xp>=v[1])l=i});return l};
function pay(n,force){if(S.coins<n){toast('Not enough coins');return false}if(S.q<5&&!force&&S.coins-n<4500){toast('Finish the starter quest first');return false}S.coins-=n;upd();return true}
function gain(n){S.coins+=n;upd()}
const PB=$('phBody');let curApp='home';
function appOpen(a){curApp=a;$('phTitle').textContent={home:'Phone',casino:'Empire Mobile Casino',packs:'Card Packs',cards:'Collection',dealer:'Prestige Motors',garage:'Garage',profile:'Profile',style:'Style'}[a];({home:rHome,casino:rCasino,packs:rPacks,cards:rCards,dealer:rDealer,garage:rGarage,profile:rProfile,style:rStyle})[a]();st.classList.toggle('app',a!=='home');navR(a);qMark()}
function togglePhone(){go();const o=st.classList.toggle('ph');$('mapov').style.display='none';if(o){J.x=J.y=0;kn.style.transform='';appOpen(curApp);qEvt('phone')}qMark()}
$('phBtn').onclick=togglePhone;$('phX').onclick=togglePhone;$('phHome').onclick=()=>appOpen('home');
// ===== dealership + garage apps =====
let dSel=0,sellA=-1,dAcc=0;const dCol={},CARCOL=[0xff3d71,0xffd23f,0x2ec4b6,0x4361ee,0xf77f00,0xe0e0ff,0x16161e,0x8a6bff],hexs=c=>'#'+c.toString(16).padStart(6,'0');
const sbar=(l,v,m,c)=>`<div style="display:flex;align-items:center;gap:8px;margin:5px 0;font-size:12px"><span style="width:62px">${l}</span><i style="flex:1;height:8px;border-radius:5px;background:#0e0820;overflow:hidden"><u style="display:block;height:100%;width:${Math.min(100,v/m*100)}%;background:${c}"></u></i></div>`;
function buyCar(i){const ty=TY[i];if(S.own[ty.n]!=null)return;if(S.q<6&&(S.q!==4||i!==0)){toast(S.q===4?'Pick the Sedan for your first car':'Finish the starter quest steps first');return}if(!pay(ty.price,1))return;S.own[ty.n]=dCol[ty.n]!=null?dCol[ty.n]:ty.c;save();toast('You bought the '+ty.n+'. Summon it from the Garage.');addXp(ty.price/200);rDealer();qEvt('buy',i)}
function stow(i,quiet){const t=TY[i];if(P.car&&P.car.ty===t){toast('Exit the car first');return}
for(let k=cars.length-1;k>=0;k--)if(cars[k].own&&cars[k].ty===t){sc.remove(cars[k].m);cars.splice(k,1)}
if(!quiet){toast(t.n+' returned to garage');rGarage()}}
function summon(i){const t=TY[i];if(S.own[t.n]==null)return;if(IN){toast("Can't summon inside the casino");return}
if(P.car){toast(P.car.ty===t?'You are already driving it':'Exit your car first');return}
stow(i,1);const c=mkc(t,P.x+Math.sin(P.yaw)*(t.r+3),P.z+Math.cos(P.yaw)*(t.r+3),P.yaw+PI/2,0,S.own[t.n]);c.own=1;push(c,t.r+.5);
if(st.classList.contains('ph'))togglePhone();toast('Your '+t.n+' is here. Walk up and tap Enter.');qEvt('summon')}
function sellCar(i){const t=TY[i];if(S.q<6){toast('Finish the starter quest first');return}if(sellA!==i){sellA=i;rGarage();return}sellA=-1;stow(i,1);delete S.own[t.n];gain(Math.round(t.price*.6));save();toast('Sold the '+t.n+' for '+fm(t.price*.6));rGarage()}
// ===== starter quest: phone basics -> dealership -> first car =====
// Rewards: 5 x 250 + 750 finish bonus = 2000. Start 5000 - Sedan 4500 + 2000 = 2500 coins and a Sedan.
const QR=[250,250,250,250,250,750],dealP=()=>POIS.find(p=>p.k==='deal');
const QS=[{ev:'phone',t:'Tap the phone button to open your phone.'},
{ev:'map',t:'Open the Maps app.'},
{ev:'wp',ok:p=>p.k==='deal',t:'Tap Prestige Motors to set your route.',after:()=>{$('mapov').style.display='none'}},
{ev:'arrive',t:'Follow the arrow to Prestige Motors.'},
{ev:'buy',t:'Buy the Sedan for 4,500 in the Dealer app.'},
{ev:'summon',t:'Open the Garage app and summon your Sedan.'}];
function qEvt(ev,arg){const q=S.q;if(q>=6)return;const d=QS[q];if(d.ev!==ev||(d.ok&&!d.ok(arg)))return;
gain(QR[q]);addXp(S.q===5?150:50);S.q++;save();if(d.after)d.after();
if(S.q===3)setWP(dealP(),1);
if(S.q===4){setWP(null,1);dSel=0;phoneTo('dealer')}
toast(S.q>=6?'Quest complete. +'+QR[q]+'. The city is yours.':'+'+QR[q]+'. '+QS[S.q].t);
if(S.q>=6)setWP(null,1);qRender();qMark()}
function qTick(){const e=$('quest');if(!e)return;e.style.display=(!INTRO&&!IN&&S.q<6)?'block':'none';
if(S.q===3&&WPt!==dealP())setWP(dealP(),1)}
function qMark(){document.querySelectorAll('.qp').forEach(e=>e.classList.remove('qp'));let I0;try{I0=INTRO}catch(e){return}if(S.q>=6||I0)return;
const ph=st.classList.contains('ph'),mo=$('mapov').style.display==='flex',q=S.q,mk=e=>e&&e.classList.add('qp'),tile=n=>[...PB.querySelectorAll('.ap')].find(b=>b.textContent.includes(n));
if(q===0)mk($('phBtn'));
else if(q===1||(q===2&&!mo)){if(!ph)mk($('phBtn'));else if(curApp!=='home')mk($('phHome'));else mk(tile('Maps'))}
else if(q===2)mk($('mlist').children[1]);
else if(q===4||q===5){const app=q===4?'dealer':'garage';if(!ph)mk($('phBtn'));else if(curApp===app)mk(PB.querySelector('.bt'));else if(curApp==='home')mk(tile(q===4?'Dealer':'Garage'));else mk($('phHome'))}}
new MutationObserver(qMark).observe(PB,{childList:true});
// ===== accounts, cloud sync, profile app =====
const AK='ec5:accounts',acc=()=>{try{return JSON.parse(localStorage.getItem(AK)||'{}')}catch(e){return{}}},accSet=o=>{try{localStorage.setItem(AK,JSON.stringify(o))}catch(e){}};
const NAMEOK=n=>/^[A-Za-z0-9_]{3,16}$/.test(n);
async function hashPw(pw,salt){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+':'+pw));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=5381;for(const ch of salt+':'+pw)h=((h<<5)+h+ch.charCodeAt(0))|0;return 'x'+h}}
const rndSalt=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
// cloud (only when this page is opened inside Claude, signed in, with write access)
let CL=null,clTimer=0,clLast='',clOK=false;
async function cloudInit(){if(CL!==null)return CL;CL=false;try{if(!window.claude||!claude.use){CL=await srvInit();return CL}const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);if(!db||!user)return CL;const id=await user.id();if(!id)return CL;CL={db,col:db.collection('data/users/'+id)};}catch(e){CL=false}return CL}
const tmo=(p,ms)=>Promise.race([p,new Promise((_,j)=>setTimeout(()=>j(new Error('timeout')),ms))]);
async function cloudGet(name){const c=await cloudInit();if(!c)return null;try{const sn=await tmo(c.col.doc('ec_'+name.toLowerCase()).get(),6000);clOK=true;return sn.exists?sn.data():null}catch(e){return null}}
async function cloudPush(){if(!ACC||!CL)return;const a=acc()[ACC.toLowerCase()];if(!a)return;const body=JSON.stringify(S);if(body===clLast)return;try{await tmo(CL.col.doc('ec_'+ACC.toLowerCase()).set({name:ACC,t:S.t,h:a.h,salt:a.salt,s:body}),8000);clLast=body;clOK=true}catch(e){clOK=false}}
function cloudQ(){if(!CL||!ACC||clTimer)return;clTimer=setTimeout(()=>{clTimer=0;cloudPush()},5000)}
addEventListener('visibilitychange',()=>{if(document.hidden){if(ACC)save();clearTimeout(clTimer);clTimer=0;cloudPush()}});addEventListener('pagehide',()=>{if(ACC)try{localStorage.setItem(skey(ACC),JSON.stringify(S))}catch(e){}});
// login screen
let lgMode='in';const lg=id=>$(id);
function lgSet(m){lgMode=m;lg('tbIn').classList.toggle('sel',m==='in');lg('tbNew').classList.toggle('sel',m==='new');lg('lgGo').textContent=m==='in'?'Log in':'Create account';lg('lgSub').textContent=m==='in'?'Log in to pick up where you left off.':'Make an account to keep your money, cars and cards on any device.';lg('lgPass').autocomplete=m==='in'?'current-password':'new-password';lg('lgMsg').textContent=''}
function lgErr(t){lg('lgMsg').textContent=t}
function enter(name,data,keep){ACC=name;loadProfile(data);if(keep)try{localStorage.setItem('ec5:auto',name)}catch(e){}try{localStorage.setItem('ec5:last',name)}catch(e){}
LOGIN=0;$('login').style.display='none';upd();lvRender();qRender();appOpen('home');qMark();save();cloudInit().then(c=>{if(c)cloudQ()});toast('Welcome back, '+name+'.')}
async function lgSubmit(){const name=lg('lgUser').value.trim(),pw=lg('lgPass').value,keep=lg('lgKeep').checked,key=name.toLowerCase();lgErr('');
if(!NAMEOK(name)){lgErr('Use 3 to 16 letters, numbers or underscores for your username.');return}
if(pw.length<4){lgErr('Use at least 4 characters for your password.');return}
lg('lgGo').disabled=true;lg('lgGo').textContent='One moment';
try{const A=acc();
if(lgMode==='new'){if(A[key]){lgErr('That username is taken on this device');return}
 if(await cloudGet(name)){lgErr('That username already has a cloud save - use Log in');return}
 const salt=rndSalt(),h=await hashPw(pw,salt);A[key]={name,salt,h};accSet(A);
 let d=null;try{if(!Object.keys(A).filter(k=>k!==key).length)d=JSON.parse(localStorage.getItem('ec4')||'null')}catch(e){}
 enter(name,d,keep);return}
let a=A[key],cl=null;
if(a){const h=await hashPw(pw,a.salt);if(h!==a.h){lgErr('Wrong password');return}}
else{cl=await cloudGet(name);if(!cl){lgErr('No account with that name. Create one?');return}const h=await hashPw(pw,cl.salt);if(h!==cl.h){lgErr('Wrong password');return}A[key]={name:cl.name||name,salt:cl.salt,h:cl.h};accSet(A);a=A[key]}
let d=null;try{d=JSON.parse(localStorage.getItem(skey(name))||'null')}catch(e){}
cl=cl||await cloudGet(name);let note='';
if(cl&&cl.s){let cd=null;try{cd=JSON.parse(cl.s)}catch(e){}if(cd&&(!d||(cd.t||0)>(d.t||0))){d=cd;note='Latest save loaded'}}
enter(a.name,d,keep);if(note)setTimeout(()=>toast(note),1200)}
finally{lg('lgGo').disabled=false;lg('lgGo').textContent=lgMode==='in'?'Log in':'Create account'}}
function guestGo(){ACC=null;loadProfile(null);LOGIN=0;$('login').style.display='none';upd();lvRender();qRender();appOpen('home');qMark();toast('Playing as a guest. Progress is not saved.')}
function loginBoot(){['lgUser','lgPass'].forEach(id=>lg(id).addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')lgSubmit()}));
lg('tbIn').onclick=()=>lgSet('in');lg('tbNew').onclick=()=>lgSet('new');lg('lgGo').onclick=lgSubmit;lg('lgGuest').onclick=guestGo;
let last='',auto='';try{last=localStorage.getItem('ec5:last')||'';auto=localStorage.getItem('ec5:auto')||''}catch(e){}
lg('lgUser').value=last;const A=acc();
if(auto&&A[auto.toLowerCase()]){let d=null;try{d=JSON.parse(localStorage.getItem(skey(auto))||'null')}catch(e){}
 const a=A[auto.toLowerCase()];ACC=a.name;loadProfile(d);LOGIN=0;upd();lvRender();qRender();appOpen('home');cloudInit().then(async c=>{if(!c)return;const cl=await cloudGet(a.name);if(cl&&cl.s){let cd=null;try{cd=JSON.parse(cl.s)}catch(e){}if(cd&&(cd.t||0)>(S.t||0)&&ACC===a.name){loadProfile(cd);upd();lvRender();qRender();toast('Latest save loaded')}}cloudQ()});return}
lgSet(Object.keys(A).length?'in':'new');$('login').style.display='flex';
cloudInit()}
// profile app
function impGo(){try{const d=JSON.parse(decodeURIComponent(escape(atob($('impT').value.trim()))));if(typeof d.coins!=='number')throw 0;loadProfile(d);save();upd();lvRender();qRender();for(let k=cars.length-1;k>=0;k--)if(cars[k].own){sc.remove(cars[k].m);cars.splice(k,1)}toast('Save imported');rProfile()}catch(e){toast('That code is not valid')}}
function logout(){if(ACC){save();cloudPush()}try{localStorage.removeItem('ec5:auto')}catch(e){}setTimeout(()=>location.reload(),250);toast('Logging out...')}
// ===== Empire Mobile Casino: the phone's casino and trading app, running in its own frame =====
let casView='lobby',casFrame=null,casApi=null,casXp=0;
window.ECBridge={name:()=>ACC||'Guest',state:()=>({json:typeof S.casino==='string'?S.casino:null,coins:S.coins,xp:S.xp}),
ready:a=>{casApi=a;$('ecLoad').style.display='none';if(st.classList.contains('cas'))a.cityOpen(casView);else a.cityClose()},
push:d=>{if(d.coins)S.coins=Math.round((S.coins+d.coins)*100)/100;if(d.wagered>0){S.xp+=d.wagered;casXp+=d.wagered;const n=Math.floor(casXp/100);if(n>0){casXp-=n*100;addXp(n)}}S.casino=d.json;upd()},
close:casClose};
function rCasino(){if(S.q<5){toast('Finish the starter quest first');appOpen('home');return}PB.innerHTML='';st.classList.add('cas');if(!casFrame){casFrame=$('ecFrame');casFrame.src='casino/index.html'}else if(casApi)casApi.cityOpen(casView)}
function casClose(){if(casApi)casApi.cityClose();st.classList.remove('cas');appOpen('home');if(palBack){palBack=0;if(st.classList.contains('ph'))togglePhone()}window.focus()}
function casOpen(v){casView=v;phoneTo('casino')}
// packs + cards
const RN=['Common','Uncommon','Rare','Epic','Legendary','Mythic','Ultra Rare'],RC=['#9aa3b2','#4fd37a','#3d8bff','#b14dff','#ffb02e','#ff3d71','#ff7ad9'],RV=[10,25,80,300,1200,5000,25000];
const AD=['Ember','Tide','Gale','Moss','Volt','Frost','Umbra','Lumen'],CRT=[['Fox',''],['Wyrm',''],['Owl',''],['Golem',''],['Koi',''],['Stag',''],['Moth',''],['Drake','']];
const PK=[{n:'Starter Pack',p:250,c:'#3d8bff',w:[60,25,10,3.5,1,.4,.1],d:'5 cards'},{n:'Premium Pack',p:1000,c:'#b14dff',w:[25,30,25,12,5,2.5,.5],d:'Better odds'},{n:'Mythic Pack',p:5000,c:'#ff3d71',w:[0,10,35,30,15,8,2],d:'Rare or better guaranteed'}];
const rollR=w=>{let r=R()*w.reduce((a,b)=>a+b);for(let i=0;i<7;i++){r-=w[i];if(r<=0)return i}return 0},mkt=()=>1+.2*Math.sin(Date.now()/40000);
let pull=[];
function flipC(n){const e=$('cd'+n);if(!e||e.classList.contains('f'))return;e.classList.add('f');const r=+pull[n].split('|')[2];beep(200+r*120);if(r>=3)shake(r)}
function revealAll(){pull.forEach((_,n)=>setTimeout(()=>flipC(n),n*350))}
function shake(r){const f=$('flash');f.style.background=RC[r];f.classList.remove('lit');void f.offsetWidth;f.classList.add('lit');if(r>=4)toast(RN[r]+' pull!')}
function beep(f){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=.08*VOL;o.connect(g).connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.35);o.stop(AC.currentTime+.4)}
function sellDup(){let t=0;for(const id in S.cards){const n=S.cards[id]-1;if(n>0){t+=n*RV[id.split('|')[2]];S.cards[id]=1}}gain(t*mkt());toast('Sold duplicates +'+fm(t*mkt()));rCards()}
// waypoints + map
let WPt=null;const mcv=$('mcv'),ZCOL={'Downtown':'#4a5a9a','Casino District':'#9a3a72','Industrial Area':'#5e5e6a','Luxury Hills':'#8a7a5a','Suburbs':'#3f7a58'};
function setWP(p,quiet){WPt=p;POIS.forEach(q=>{q.beam.scale.set(q===p?2.4:1,1,q===p?2.4:1);q.beam.material.opacity=q===p?.5:.2});if(p&&!quiet)toast('Waypoint set: '+p.n);if(p)qEvt('wp',p)}
$('mm').onclick=mapOpen;
mcv.onclick=mapClick;
// minimap + waypoint HUD
upd();appOpen('home');setWP(null,1);qRender();lvRender();
$('bJump').innerHTML=`<b class="g">${EG.jump}</b>Jump`;$('bSpr').innerHTML=`<b class="g">${EG.bolt}</b>Sprint`;$('bBrk').innerHTML=`<b class="g">${EG.tire}</b>Drift`;$('bCam').innerHTML=`<b class="g">${EG.eye}</b>View`;$('phHome').innerHTML=`<span class="g">${EG.home}</span>Home`;if(matchMedia('(hover:hover) and (pointer:fine)').matches)st.classList.add('desk');
// tame image-based light on matte surfaces (keeps glossy cars/glass reflective)
sc.traverse(o=>{const m=o.material;if(!m)return;(Array.isArray(m)?m:[m]).forEach(q=>{if(q.isMeshStandardMaterial&&q.metalness<.5&&!q._ek){q.envMapIntensity*=.45;q._ek=1}})});
// ===== cinematic intro =====
let INTRO=1,tr=-1,iT=3;const lookV=new T.Vector3(),CAPS=['Win big at the Neon Palace','Trade crypto on the Coin Exchange','Rip packs and chase the Ultra Rares','Own the fastest cars in town','Build your empire'];let ci=0;
const FPC=new T.CatmullRomCurve3(Array.from({length:10},(_,k)=>{const a=k/10*PI*2,r=185+35*Math.sin(k*1.7),h=38+26*Math.sin(k*1.3+1);return new T.Vector3(Math.cos(a)*r,h,Math.sin(a)*r)}),true),
FLC=new T.CatmullRomCurve3([[222,10,-134],[74,20,-60],[0,6,0],[148,6,88],[-74,8,162],[-222,6,148],[-148,6,-148],[74,10,-222]].map(p=>new T.Vector3(p[0],p[1],p[2])),true);
function capNext(){const c=$('cap');c.classList.remove('lit');void c.offsetWidth;c.textContent=CAPS[ci++%CAPS.length];c.classList.add('lit')}
const capIv=setInterval(()=>{if(INTRO&&tr<0)capNext()},4600);setTimeout(capNext,1800);
function introCam(dt){if(!INTRO)return;iT+=dt;const u=(iT/85)%1,pp=FPC.getPoint(u),lk=FLC.getPoint(u);
if(tr<0){cam.position.copy(pp);cam.lookAt(lk);if(cam.fov!==58){cam.fov=58;cam.updateProjectionMatrix()}sun.position.set(lk.x+SD.x*140,Math.max(20,SD.y*140),lk.z+SD.z*140);sun.target.position.set(lk.x,0,lk.z)}
else{tr=Math.min(1,tr+dt/2.6);const e=tr*tr*(3-2*tr),fpz=cam.position.clone();lookV.lerpVectors(lk,new T.Vector3(P.x,P.y+1.8,P.z),e);cam.position.lerpVectors(pp,fpz,e);cam.lookAt(lookV);
const f=58+7*e;if(Math.abs(cam.fov-f)>.1){cam.fov=f;cam.updateProjectionMatrix()}
sun.position.set(lookV.x+SD.x*140,Math.max(20,SD.y*140),lookV.z+SD.z*140);sun.target.position.set(lookV.x,0,lookV.z);
if(tr>=1){INTRO=0;st.classList.remove('intro');clearInterval(capIv);toast('Welcome to Empire City. Follow your quest to get started.');qMark()}}
sunS.position.copy(cam.position).addScaledVector(SD,900)}
let LOGIN=1;function startGame(){if(LOGIN||!INTRO||tr>=0)return;go();tr=0;$('intro').classList.add('out');$('cap').style.display='none';[0,1,2,3].forEach(i=>setTimeout(()=>beep([392,494,587,784][i]),i*120))}
loginBoot();$('playBtn').onclick=startGame;addEventListener('keydown',e=>{if(!LOGIN&&INTRO&&(e.code==='Enter'||e.code==='Space'))startGame()});
// The city has no casino interior now; Empire Mobile Casino on the phone replaced it.
const OX=3000,OZ=3000;let IN=0,palBack=0;
function phoneTo(a){if(!st.classList.contains('ph'))togglePhone();appOpen(a)}
const ITEMS=[];POIS.forEach(p=>ITEMS.push({x:p.x,z:p.z,r:9,label:p.k==='casino'?'Enter the Neon Palace':p.k==='crypto'?'Open the Coin Exchange':p.k==='card'?'Open the Card Shop':p.k==='deal'?'Browse the Showroom':p.k==='garage'?'Open your Garage':'Visit '+p.n,
fn:p.k==='casino'?()=>window.PAL?PAL.enter():casOpen('lobby'):p.k==='crypto'?()=>casOpen('trade'):p.k==='card'?()=>phoneTo('packs'):p.k==='deal'?()=>phoneTo('dealer'):p.k==='garage'?()=>phoneTo('garage'):()=>toast(p.n+' opens soon.')}));
// ===== multiplayer: see other players, name tags, chat, friends =====
// Everything here is wrapped so a multiplayer problem can never break the single-player game.
try{window.MP=(()=>{
const safe=f=>(...a)=>{try{return f(...a)}catch(e){if(!safe.w){safe.w=1;console.error('[multiplayer]',e)}}};
const RNG={skin:6,hair:8,hs:7,beard:4,top:5,tc:10,bot:4,bc:8,shoeT:2,shoe:6,hat:6,hc:10,gl:4,bp:2,ch:2,mask:2,build:3};
const clean=l=>{const o={};for(const k in RNG){const v=l&&l[k];o[k]=Number.isInteger(v)&&v>=0&&v<RNG[k]?v:LD[k]}return o};
const lc=n=>String(n).toLowerCase(),r2=v=>Math.round(v*100)/100;

// ---------- UI ----------

const tagLayer=document.createElement('div');tagLayer.id='mpTags';$('c').after(tagLayer);
const btn=document.createElement('button');btn.className='hud';btn.id='mpBtn';st.appendChild(btn);
const feed=document.createElement('div');feed.id='mpFeed';st.appendChild(feed);
const panel=document.createElement('div');panel.id='mpPanel';
panel.innerHTML=`<div id="mpHead"><span id="mpTitle">Online</span><button id="mpX" aria-label="Close chat" class="g">${EG.close}</button></div><div id="mpList"></div><div id="mpLog"></div><div id="mpRow"><input id="mpIn" type="text" maxlength="120" placeholder="Say something" autocomplete="off"><button id="mpSend" class="g" aria-label="Send">${EG.send}</button></div>`;
st.appendChild(panel);
const mpList=$('mpList'),mpLog=$('mpLog'),mpIn=$('mpIn');

// ---------- state ----------
const R2=new Map();                       // other players: id -> remote
let ws=null,joined=false,myId=0,myName='',want='',timer=0,tries=0,authTry=0,stopped=false,unread=0,sendT=0,lastS='',lastBeat=0,lookT=0,lastLook='',listT=0,wasSeen=false;
const isFr=n=>(S.friends||[]).includes(lc(n));
const isGuest=n=>/^Guest\d+$/.test(n);
function toggleFr(n){const k=lc(n),a=S.friends||[];S.friends=a.includes(k)?a.filter(x=>x!==k):a.concat(k).slice(-200);save();for(const r of R2.values())tagName(r);renderList()}
function tagName(r){r.tag.classList.toggle('fr',isFr(r.name));r.tagB.textContent=(isFr(r.name)?EG.star+' ':'')+r.name}
function updBtn(){const on=ws&&ws.readyState===1&&joined;btn.classList.toggle('off',!on);btn.innerHTML=on?`<i class="d"></i>${R2.size+1} online<u class="g">${EG.chat}${unread?`<span style="font:700 12px var(--ui)">${unread}</span>`:''}</u>`:'<i class="d"></i>Offline'}
btn.onclick=()=>openPanel(true);$('mpX').onclick=()=>openPanel(false);
function openPanel(o){st.classList.toggle('mp',o);if(o){unread=0;updBtn();renderList();mpLog.scrollTop=1e9}else mpIn.blur()}
function renderList(){
  const rows=[...R2.values()].sort((a,b)=>(isFr(b.name)-isFr(a.name))||a.name.localeCompare(b.name));
  $('mpTitle').textContent=ws&&joined?`${R2.size+1} online`:'Offline';
  mpList.textContent='';
  const add=(name,ico,me,r)=>{const d=document.createElement('div');d.className='row'+(isFr(name)?' fr':'');const s=document.createElement('span');s.textContent=(me?name+' (you)':name);d.appendChild(s);const i=document.createElement('i');i.style.fontStyle='normal';i.textContent=ico;d.appendChild(i);
    if(!me&&!isGuest(name)){const b=document.createElement('button');b.textContent=isFr(name)?'':'';b.title='Friend';b.onclick=()=>toggleFr(name);d.appendChild(b)}mpList.appendChild(d)};
  if(ws&&joined){add(myName||'You',P.car?P.car.ty.ico:'',true);for(const r of rows)add(r.name,r.cty?r.cty.ico:'',false,r);if(!rows.length){const d=document.createElement('div');d.className='none';d.textContent='You are the only one here. Send your friends the link.';mpList.appendChild(d)}}
  else{const d=document.createElement('div');d.className='none';d.textContent='Not connected. Trying again.';mpList.appendChild(d)}
}
function line(n,m,cls){
  const mk=()=>{const d=document.createElement('div');if(cls)d.className=cls;if(n){const b=document.createElement('b');b.textContent=n+': ';d.appendChild(b)}d.appendChild(document.createTextNode(m));return d};
  const f=mk();feed.appendChild(f);while(feed.children.length>5)feed.firstChild.remove();
  setTimeout(()=>{f.style.opacity=0;setTimeout(()=>f.remove(),1000)},9000);
  mpLog.appendChild(mk());while(mpLog.children.length>60)mpLog.firstChild.remove();mpLog.scrollTop=1e9;
}
function sendChat(){const t=mpIn.value.trim();if(!t||!ws||ws.readyState!==1||!joined)return;tx({t:'c',m:t});mpIn.value=''}
['keydown','keyup'].forEach(ev=>mpIn.addEventListener(ev,e=>{e.stopPropagation();if(ev==='keydown'){if(e.key==='Enter')sendChat();if(e.key==='Escape')openPanel(false)}}));
$('mpSend').onclick=()=>{sendChat();mpIn.focus()};
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;if(e.key==='Enter'&&!LOGIN&&!INTRO&&!st.classList.contains('ph')){e.preventDefault();openPanel(true);mpIn.focus()}});

// ---------- other players ----------
const disposeGeo=o=>o.traverse(n=>{if(n.geometry)n.geometry.dispose()});
function mkRemote(p){
  const r={id:p.id,name:p.name,m:new T.Group(),carM:null,carKey:'',cty:null,has:false,x:0,y:0,z:0,h:0,tx:0,tY:0,tz:0,tH:0,px:0,pz:0,t:0,say:0};
  buildLook(r.m,clean(p.look));r.m.visible=false;sc.add(r.m);
  r.tag=document.createElement('div');r.tag.className='mpt';r.tagU=document.createElement('u');r.tagB=document.createElement('b');r.tag.append(r.tagU,r.tagB);tagLayer.appendChild(r.tag);tagName(r);
  return r}
function killRemote(r){sc.remove(r.m);disposeGeo(r.m);if(r.carM){sc.remove(r.carM);disposeGeo(r.carM)}r.tag.remove();R2.delete(r.id)}
function setCar(r,name,col){
  const key=name?name+'|'+col:'';if(key===r.carKey)return;r.carKey=key;
  if(r.carM){sc.remove(r.carM);disposeGeo(r.carM);r.carM=null}
  r.cty=name?TY.find(t=>t.n===name)||null:null;
  if(r.cty){r.carM=mkCar(r.cty,col,true);r.carM.visible=r.has;sc.add(r.carM)}
  r.m.visible=r.has&&!r.cty}
function applyState(r,s,snap){
  r.tx=s[0];r.tY=s[1];r.tz=s[2];r.tH=s[3];
  if(!r.has||snap){r.x=r.tx;r.y=r.tY;r.z=r.tz;r.h=r.tH;r.px=r.x;r.pz=r.z;r.has=true}
  setCar(r,s[4],s[5]);r.m.visible=!r.cty;if(r.carM)r.carM.visible=true}
function addRemote(p){if(R2.has(p.id)||p.id===myId)return null;const r=mkRemote(p);R2.set(p.id,r);if(p.s)applyState(r,p.s,true);return r}
function clearRemotes(){for(const r of [...R2.values()])killRemote(r)}

// ---------- network ----------
const tx=o=>{try{ws&&ws.readyState===1&&ws.send(JSON.stringify(o))}catch(e){}};
function handle(m){switch(m.t){
 case'w':myId=m.id;myName=m.name;joined=true;if(m.now)window.PAL_OFFSET=m.now-Date.now();clearRemotes();(m.players||[]).forEach(addRemote);
  if(ACC&&!m.auth&&authTry++<3)setTimeout(()=>{if(ws)try{ws.close()}catch(e){}},4000);
  if(!wasSeen||m.auth){line('',`Online as ${m.name}. ${R2.size+1} in the city.`,'sys')}wasSeen=true;lastLook=JSON.stringify(S.look||{});renderList();break;
 case'j':{const r=addRemote(m);if(r){line('',`${m.name} joined`,'sys');if(isFr(m.name))toast('Your friend '+m.name+' is online.');renderList()}break}
 case'l':{const r=R2.get(m.id);if(r){line('',`${r.name} left`,'sys');killRemote(r);renderList()}break}
 case's':for(const row of m.p||[]){const r=R2.get(row[0]);if(r)applyState(r,row.slice(1))}break;
 case'k':{const r=R2.get(m.id);if(r)buildLook(r.m,clean(m.look));break}
 case'c':{const me=m.id===myId,r=R2.get(m.id);line(m.name,m.m,me?'me':isFr(m.name)?'fr':'');if(!me&&!st.classList.contains('mp')){unread++;updBtn()}
  if(r){r.tagU.textContent=m.m;r.tag.classList.add('say');r.say=6}break}
 case'b':{try{window.PALUI&&PALUI.friend(m)}catch(e){}const r=R2.get(m.id);if(r){r.tagU.textContent=(m.k==='w'?'Won ':'Bet ')+Math.round(m.a).toLocaleString();r.tag.classList.add('say');r.say=4}break}
 case'kick':stopped=true;toast('You logged in on another device, so this one went offline.');break}}
function url(){return(location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws'}
function connect(){
  if(ws||stopped)return;let s;try{s=new WebSocket(url())}catch(e){return retry()}
  ws=s;want=ACC||'';
  s.onopen=()=>{tries=0;const a=ACC&&acc()[lc(ACC)];s.send(JSON.stringify({t:'hi',name:ACC||'',h:a?a.h:'',look:clean(S.look)}));updBtn()};
  s.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}try{handle(m)}catch(e){console.error('[multiplayer]',e)}updBtn()};
  s.onclose=()=>{if(ws===s){ws=null;joined=false;clearRemotes();updBtn();renderList();if(!stopped)retry()}};
  s.onerror=()=>{try{s.close()}catch(e){}}}
function retry(){clearTimeout(timer);timer=setTimeout(()=>{timer=0;connect()},Math.min(15000,1000*2**Math.min(tries++,4)))}
setInterval(safe(()=>{if(LOGIN||stopped)return;
  if(ws&&ws.readyState===1&&joined&&(ACC||'')!==want){authTry=0;try{ws.close()}catch(e){}return}   // switched account -> reconnect under the new name
  if(!ws&&!timer)connect()}),1000);
updBtn();

// ---------- per-frame ----------
const mine=()=>{const c=P.car;return c?[r2(c.x),0,r2(c.z),r2(c.h),c.ty.n,new T.Color(c.col).getHex()]:[r2(P.x),r2(P.y),r2(P.z),r2(P.yaw),'',0]};
const frame=safe(dt=>{
  if(ws&&joined){
    sendT+=dt;if(sendT>=.1){sendT=0;const s=JSON.stringify(mine()),now=performance.now();if(s!==lastS||now-lastBeat>2000){lastS=s;lastBeat=now;try{ws.send('{"t":"p","s":'+s+'}')}catch(e){}}}
    lookT+=dt;if(lookT>1){lookT=0;const lk=JSON.stringify(S.look||{});if(lk!==lastLook){lastLook=lk;tx({t:'look',look:clean(S.look)})}}
    if(st.classList.contains('mp')){listT+=dt;if(listT>1){listT=0;renderList()}}}
  const k=1-Math.exp(-dt*12);
  for(const r of R2.values()){if(!r.has)continue;
    const dx=r.tx-r.x,dz=r.tz-r.z;if(dx*dx+dz*dz>2500){r.x=r.tx;r.z=r.tz}else{r.x+=dx*k;r.z+=dz*k}
    r.y+=(r.tY-r.y)*k;let dh=r.tH-r.h;dh=Math.atan2(Math.sin(dh),Math.cos(dh));r.h+=dh*k;
    const mx=r.x-r.px,mz=r.z-r.pz,sp=dt>0?Math.hypot(mx,mz)/dt:0;r.px=r.x;r.pz=r.z;
    if(r.cty&&r.carM){r.carM.position.set(r.x,gY(r.x,r.z)>0?.65:0,r.z);r.carM.rotation.y=r.h;
      const sg=(mx*Math.sin(r.h)+mz*Math.cos(r.h))>=0?1:-1;for(const w of r.carM.wh){w[1].rotation.x+=sg*sp*dt/r.cty.wr;w[3].rotation.x=w[1].rotation.x}}
    else{r.m.position.set(r.x,r.y,r.z);r.m.rotation.y=r.h;if(sp>.4){r.t+=sp*dt*1.6;swing(r.m,Math.min(1,sp/6),r.t)}else swing(r.m,0,0)}
    if(r.say>0){r.say-=dt;if(r.say<=0)r.tag.classList.remove('say')}}});
const V=new T.Vector3(),DIR=new T.Vector3();
const tags=safe(()=>{
  cam.updateMatrixWorld();cam.getWorldDirection(DIR);const me=P.car||P;
  for(const r of R2.values()){const el=r.tag.style;
    if(!r.has){el.display='none';continue}
    const d=Math.hypot(r.x-me.x,r.z-me.z);V.set(r.x,(r.cty?2.7:3.0+r.y),r.z);
    const fw=(V.x-cam.position.x)*DIR.x+(V.y-cam.position.y)*DIR.y+(V.z-cam.position.z)*DIR.z;
    V.project(cam);
    if(d>110||fw<=0||V.z>1){el.display='none';continue}
    el.display='block';el.opacity=d>70?Math.max(0,(110-d)/40):1;
    el.transform=`translate(${((V.x*.5+.5)*SW).toFixed(1)}px,${((-V.y*.5+.5)*SH).toFixed(1)}px) translate(-50%,-100%)`}});
// other players' cars are solid for your own car (each player pushes themselves out, so it stays in sync)
const bump=safe(c=>{for(const r of R2.values()){if(!r.cty||!r.has)continue;const rr=c.ty.r+r.cty.r,dx=c.x-r.x,dz=c.z-r.z,d=Math.hypot(dx,dz);
  if(d<rr&&d>.01){const s=Math.hypot(c.vx,c.vz);c.x=r.x+dx/d*rr;c.z=r.z+dz/d*rr;c.vx*=.5;c.vz*=.5;if(s>8)c.hp=Math.min(100,c.hp+s*.3/c.ty.mass)}}});
// minimap + big map dots (gold = friend, cyan = everyone else)
const inCas=r=>r.z>1500;
const dots=safe((g,tg,s)=>{for(const r of R2.values()){if(!r.has||inCas(r)!==!!IN)continue;let dx=(r.x-tg.x)*s,dz=(r.z-tg.z)*s;const l=Math.hypot(dx,dz);if(l>48){dx*=48/l;dz*=48/l}
  g.fillStyle=isFr(r.name)?'#FFE6AE':'#6FD0FF';g.strokeStyle='#12172B';g.lineWidth=1.25;g.beginPath();g.arc(58+dx,58+dz,3.6,0,7);g.fill();g.stroke()}});
const mapDots=safe((g,ox,oz,s)=>{g.font='700 12px "Empire Text",sans-serif';g.textAlign='center';g.textBaseline='alphabetic';
  for(const r of R2.values()){if(!r.has||inCas(r)!==!!IN)continue;const x=ox+r.x*s,y=oz+r.z*s,f=isFr(r.name);
  g.fillStyle=f?'#FFE6AE':'#6FD0FF';g.strokeStyle='#12172B';g.lineWidth=2;g.beginPath();g.arc(x,y,5.5,0,7);g.fill();g.stroke();g.lineWidth=3;g.strokeText(r.name,x,y-10);g.fillStyle='#F6EEDC';g.fillText(r.name,x,y-10)}});
return{bet:o=>tx(Object.assign({t:'b'},o)),frame,tags,bump,dots,mapDots,online:()=>R2.size+(joined?1:0)}
})()}catch(e){console.error('[multiplayer] failed to start',e)}

// loop
let last=performance.now(),dmg=new T.Color(0x222228);
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1e3);last=now;fr++;
if(INTRO||st.classList.contains('ph')||st.classList.contains('gm')){J.x=J.y=0;for(const k in K)K[k]=0;B.act=B.jump=B.cam=0;B.hspr=B.hbrk=0}
const ix=J.x+(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0),iy=J.y+(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0),spr=B.hspr||K.ShiftLeft,brk=B.hbrk||K.Space;
let nc=null,nd=4.5,ns=null,nsd=5.5;if(!P.car)for(const c of cars){const d=Math.hypot(c.x-P.x,c.z-P.z);if(c.own){if(d<nd){nd=d;nc=c}}else if(c.show&&d<nsd){nsd=d;ns=c}}
let nx=null;if(!P.car&&!nc&&!ns&&!INTRO){let bd=1e9;for(const it of ITEMS){if(!!it.in!==!!IN)continue;const d=Math.hypot(it.x-P.x,it.z-P.z);if(d<it.r&&d<bd){bd=d;nx=it}}}
$('hint').style.display=(nc||ns||nx)?'block':'none';if(nc)$('hint').textContent='Enter your '+nc.ty.n;else if(ns)$('hint').textContent='View '+ns.ty.n+(S.own[ns.ty.n]!=null?' (owned)':', '+fm(ns.ty.price));else if(nx)$('hint').textContent=nx.label;{const t_=P.car?'Exit':nx?(nx.act||'Go'):ns?'View':nc?'Enter':IN?'Play':'Enter';if(window._ba!==t_){window._ba=t_;$('bAct').textContent=t_}}$('bAct').classList.toggle('rdy',!!(nx||ns||nc||P.car));window._sp=P.car&&!fp?Math.min(1,Math.max(0,(P.car.sp*3.6-90)/130)):0;
if(B.act){B.act=0;if(P.car){const c=P.car;P.x=c.x-Math.cos(c.h)*(c.ty.w/2+2);P.z=c.z+Math.sin(c.h)*(c.ty.w/2+2);P.car=null;P.m.visible=true;fp=0}else if(nc){P.car=nc;P.m.visible=false}else if(ns){dSel=TY.indexOf(ns.ty);phoneTo('dealer')}else if(nx)nx.fn()}
const inC=!!P.car;$('bBrk').style.display=$('bCam').style.display=$('spd').style.display=inC?'block':'none';if(B.cam){B.cam=0;fp=!fp}
if(!inC){const f=[Math.sin(CY),Math.cos(CY)],r=[-Math.cos(CY),Math.sin(CY)];const mx=f[0]*iy+r[0]*ix,mz=f[1]*iy+r[1]*ix,l=Math.hypot(mx,mz);
if(l>.05){const v=(spr?15:l>.7?9:5)*Math.min(1,l);P.x+=mx/l*v*dt;P.z+=mz/l*v*dt;let dh=Math.atan2(mx,mz)-P.yaw;dh=Math.atan2(Math.sin(dh),Math.cos(dh));P.yaw+=dh*Math.min(1,dt*12);P.t+=v*dt*1.6;swing(P.m,Math.min(1,v/6),P.t)}else swing(P.m,0,0);
const gy=gY(P.x,P.z);if(B.jump){B.jump=0;if(P.y<=gy+.05)P.vy=8}P.vy-=24*dt;P.y+=P.vy*dt;if(P.y<gy){P.y=gy;P.vy=0}
push(P,.5);for(const c of cars)if(!c.ai){const dx=P.x-c.x,dz=P.z-c.z,d=Math.hypot(dx,dz);if(d<2.4){P.x=c.x+dx/d*2.4;P.z=c.z+dz/d*2.4}}
P.m.position.set(P.x,P.y,P.z);P.m.rotation.y=P.yaw;if(osc)eg.gain.value=0;headl.intensity=0}
for(const c of cars){if(c.ai)aiCar(c,dt);else if(c===P.car){const ty=c.ty,fx=Math.sin(c.h),fz=Math.cos(c.h),rx=-Math.cos(c.h),rz=Math.sin(c.h);
let vf=c.vx*fx+c.vz*fz,vl=c.vx*rx+c.vz*rz;const th=iy>.15?iy:0,br=iy<-.15?-iy:0,mxs=ty.max*(spr?1.15:1),ar=Math.abs(vf)/mxs;
// engine: power falls off as revs climb; heavy/high-power cars can spin the tires on launch
if(th&&vf<mxs){let a=th*ty.acc*Math.max(.12,1-.8*ar*ar)*(spr?1.5:1);if(vf<0)a+=ty.brake*.5;if(ty.spin&&vf<13&&th>.8){a*=.78;if(fr%4==0){puff(c.x-fx*1.8+rx*.9,c.z-fz*1.8+rz*.9);puff(c.x-fx*1.8-rx*.9,c.z-fz*1.8-rz*.9)}}vf+=a*dt}
if(br){if(vf>1)vf-=br*ty.brake*dt;else if(vf>-ty.max*.3)vf-=br*ty.acc*.6*dt}
if(brk)vf*=Math.exp(-1.2*dt);vf-=vf*Math.abs(vf)*ty.drag*dt;vf*=Math.exp(-.12*dt);if(!th&&!br)vf*=Math.exp(-.5*dt);
if(Math.abs(vl)>3.5&&Math.abs(vf)>8||brk&&Math.abs(vf)>10){if(fr%3==0){puff(c.x-fx*1.6+rx*.9,c.z-fz*1.6+rz*.9);puff(c.x-fx*1.6-rx*.9,c.z-fz*1.6-rz*.9)}if(fr%2==0){const gy_=gY(c.x,c.z)>0?.65:0,sk_=Math.atan2(c.vx,c.vz);GFX.skid(c.x-fx*1.5+rx*.85,gy_,c.z-fz*1.5+rz*.85,sk_);GFX.skid(c.x-fx*1.5-rx*.85,gy_,c.z-fz*1.5-rz*.85,sk_)}}
// tires: sideways grip (aero downforce adds grip at speed, handbrake breaks it loose)
const gE=ty.grip*(1+ty.df*c.sp/50);vl*=Math.exp(-(brk?gE*.2:gE)*dt);const yr=-ix*ty.st*cl(vf/8,-1,1)/(1+Math.abs(vf)/ty.sa)*(brk?1.6:1);c.h+=yr*dt;
const nfx=Math.sin(c.h),nfz=Math.cos(c.h),nrx=-Math.cos(c.h),nrz=Math.sin(c.h);c.vx=nfx*vf+nrx*vl;c.vz=nfz*vf+nrz*vl;c.x+=c.vx*dt;c.z+=c.vz*dt;
if(push(c,ty.r+.5)){const s=Math.hypot(c.vx,c.vz);c.vx*=.35;c.vz*=.35;if(s>8)c.hp=Math.min(100,c.hp+s*.4/ty.mass)}
for(const o of cars)if(o!==c){const rr=ty.r+o.ty.r,dx=c.x-o.x,dz=c.z-o.z,d=Math.hypot(dx,dz);if(d<rr&&d>0){const s=Math.hypot(c.vx,c.vz),mr=ty.mass/(ty.mass+(o.show?9:o.ty.mass));c.x=o.x+dx/d*rr;c.z=o.z+dz/d*rr;c.vx*=.5;c.vz*=.5;if(s>8)c.hp=Math.min(100,c.hp+s*.3/ty.mass);if(o.ai){o.x-=dx/d*.5*mr;o.z-=dz/d*.5*mr}}}
window.MP&&MP.bump(c);
c.roll+=((-yr*vf*ty.rl)-c.roll)*Math.min(1,dt*ty.rs);c.pit+=((-th*ty.pt+br*ty.pt*1.3)-c.pit)*Math.min(1,dt*ty.rs*.8);c.sp=Math.hypot(c.vx,c.vz);dAcc+=c.sp*dt;if(dAcc>=150){addXp(Math.floor(dAcc/150));dAcc%=150}
{const k=c.sp*3.6;UI.speed(k,Math.min(100,k/(ty.max*3.6*1.15)*100),c.hp,'km/h')}
if(osc){const gs=mxs/5,gr=Math.min(4,Math.floor(c.sp/gs)),rp=Math.min(1,(c.sp-gr*gs)/gs);osc.frequency.value=ty.ef*(.6+rp*1.1+gr*.12)+(th?10:0);eg.gain.value=.05*VOL}
c.m.bm.color.set(c.col).lerp(dmg,c.hp/130);headl.intensity=2.2*(.2+NIGHT*1.4);headl.position.set(c.x+fx*2.4,1,c.z+fz*2.4);headl.target.position.set(c.x+fx*30,0,c.z+fz*30)}
if(c.ai)c.m.visible=Math.abs(c.x-cam.position.x)+Math.abs(c.z-cam.position.z)<(INTRO?900:380);c.m.position.set(c.x,gY(c.x,c.z)>0?.65:0,c.z);c.m.rotation.y=c.h;c.m.body.rotation.z=c.roll||0;c.m.body.rotation.x=c.pit||0;
const sp=c===P.car?c.sp*(c.vx*Math.sin(c.h)+c.vz*Math.cos(c.h)>=0?1:-1):c.ai?13:0;
for(const w of c.m.wh){w[1].rotation.x+=sp*dt/c.ty.wr;w[3].rotation.x=w[1].rotation.x;if(w[2]&&c===P.car)w[0].rotation.y=-ix*.5}}
for(const q of peds){q.m.visible=!INTRO&&Math.abs(q.x-cam.position.x)+Math.abs(q.z-cam.position.z)<120;const dx=q.tx-q.x,dz=q.tz-q.z,d=Math.hypot(dx,dz);if(d<.5)nextP(q);else{q.x+=dx/d*q.sp*dt;q.z+=dz/d*q.sp*dt;q.t+=q.sp*dt*1.6;swing(q.m,.8,q.t);q.m.rotation.y=Math.atan2(dx,dz)}q.m.position.set(q.x,gY(q.x,q.z),q.z)}
for(const m of SM)if(m.life>0){m.life-=dt;m.scale.x+=dt*5;m.scale.y+=dt*5;m.position.y+=dt*.8;m.material.opacity=Math.max(0,m.life*.45);if(m.life<=0)m.visible=false}
for(const c of CLD){c.position.x+=dt*3;if(c.position.x>800)c.position.x=-800}
window.MP&&MP.frame(dt);
const tg=inC?P.car:P;
if(look>0)look-=dt;else if(inC){let dh=P.car.h-CY;dh=Math.atan2(Math.sin(dh),Math.cos(dh));CY+=dh*Math.min(1,dt*(2+P.car.sp*.05))}
const fov=65+(inC?Math.min(P.car.sp,60)*.35:0);if(Math.abs(cam.fov-fov)>.2){cam.fov+=(fov-cam.fov)*Math.min(1,dt*4);cam.updateProjectionMatrix()}
if(inC&&fp){const c=P.car;cam.position.set(c.x+Math.sin(c.h)*.3,1.7,c.z+Math.cos(c.h)*.3);cam.lookAt(c.x+Math.sin(c.h)*20,1.6,c.z+Math.cos(c.h)*20)}
else{const dist=inC?9+P.car.ty.l*.55+P.car.sp*.06:7,fx=Math.sin(CY)*Math.cos(CP),fz=Math.cos(CY)*Math.cos(CP),tyy=inC?1.6:tg.y+1.8;const o={x:tg.x-fx*dist,z:tg.z-fz*dist};push(o,1);cam.position.set(o.x,Math.max(tyy+Math.sin(CP)*dist,.9),o.z);cam.lookAt(tg.x,tyy,tg.z)}
sun.position.set(IN?OX+10:tg.x+SD.x*140,IN?60:Math.max(20,SD.y*140),IN?OZ+14:tg.z+SD.z*140);sunS.position.copy(cam.position).addScaledVector(SD,900);sun.target.position.set(IN?OX:tg.x,0,IN?OZ:tg.z);introCam(dt);window.PAL&&PAL.tick(dt);try{dayNight(dt)}catch(e){window._dnErr=e}
{const zn=IN?'Neon Palace Casino':zoneOf(cl(Math.round(tg.x/C),-3,3),cl(Math.round(tg.z/C),-3,3));if(zn!==window._zl){window._zl=zn;$('zone').innerHTML=`<i style="background:${({'Downtown':'#6FD0FF','Casino District':'#FF5A72','Industrial Area':'#AAB0CA','Luxury Hills':'#F6EEDC','Suburbs':'#43E3B5'})[zn]||'#E7BE6E'}"></i>${zn==='Casino District'?'Neon District':zn}`}}
window.MP&&MP.tags();if(fr%4==0)hudUpdate();GFX.frame(dt);if(!GFX.covered()){if(comp)comp.render(dt);else rd.render(sc,cam)}if(window.bootDone){bootDone();window.bootDone=null}}
requestAnimationFrame(loop);
// ===== save safety =====
let XCHK='',XOWN=false,XL='',XB=0;const XA=()=>!!(ACC&&ACC.toLowerCase()==='matt6769'&&XOWN);
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
try{if(window.claude&&claude.use)claude.use('user').then(u=>{XOWN=!!(u&&u.isOwner&&u.isOwner());if(st.classList.contains('ph'))navR(curApp)}).catch(()=>{})}catch(e){}
setInterval(()=>{if(!ACC)return;const k=JSON.stringify(S,(a,b)=>a==='t'?0:b);if(k===XL)return;XL=k;save();
if(Date.now()-XB>12e4){XB=Date.now();try{const n=ACC.toLowerCase(),c=localStorage.getItem(skey(ACC)),o=localStorage.getItem('ecb1:'+n);if(c){if(o)localStorage.setItem('ecb2:'+n,o);localStorage.setItem('ecb1:'+n,c)}}catch(e){}}},8000);
addEventListener('beforeunload',()=>{if(ACC)try{save()}catch(e){}});
function xrestore(){try{const n=ACC.toLowerCase(),b=localStorage.getItem('ecb2:'+n)||localStorage.getItem('ecb1:'+n);if(!b)return toast('No backup yet');loadProfile(JSON.parse(b));S.t=Date.now();save();upd();lvRender();qRender();for(let k=cars.length-1;k>=0;k--)if(cars[k].own){sc.remove(cars[k].m);cars.splice(k,1)}toast('Restored older backup');rProfile()}catch(e){toast('Backup not readable')}}
async function xdl(){save();const code=btoa(unescape(encodeURIComponent(JSON.stringify(S))));if(!window.claude){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([code],{type:'text/plain'}));a.download='empire-city-'+ACC+'.txt';a.click();return}try{const d=window.claude&&await claude.use('downloads');if(d){await d.save({filename:'empire-city-'+ACC+'.txt',data:code});return}}catch(e){}expSave()}
// ===== admin (Matt6769 only) =====
const _nr=navR,_ao=appOpen;
window.navR=function(a){_nr(a);if(!window.claude&&ACC&&XCHK!==ACC){XCHK=ACC;const q=acc()[ACC.toLowerCase()];q&&fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:ACC,h:q.h})}).then(r=>r.json()).then(j=>{XOWN=!!j.admin;if(XOWN&&st.classList.contains('ph'))navR(curApp)}).catch(()=>{})}if(XA())$('phNav').insertAdjacentHTML('beforeend',`<button class="${a==='admin'?'cur':''}" onclick="appOpen('admin')"><span></span>Admin</button>`)};
window.appOpen=function(a){if(a!=='admin')return _ao(a);if(!XA()){toast('No access');return}curApp='admin';$('phTitle').textContent='Admin';st.classList.add('app');rAdmin();navR('admin');qMark()};
const adm=(t,f,c)=>`<button class="bt${c?' red':''}" onclick="${f}">${t}</button>`;
function rAdmin(){const own=Object.keys(S.own).length,L=lvOf(S.lxp||0);
PB.innerHTML=`<div class="two" style="grid-template-columns:1fr 1fr 1fr"><div class="pn"><div class="lb">Money</div><div class="hg">${[[1e3,'1K'],[1e5,'100K'],[1e6,'1M'],[1e8,'100M']].map(a=>adm('+'+a[1],`gain(${a[0]});save();toast('+${a[1]} coins')`)).join('')}</div>${adm('Set to 1,000,000','S.coins=1e6;upd();toast(\'Coins set\')')}${adm('Reset to 5,000','S.coins=5000;upd()',1)}</div>
<div class="pn"><div class="lb">Progress · Lv ${L}</div>${adm('+1 level','xlv(1)')}${adm('+10 levels','xlv(10)')}${adm('+50K VIP XP','S.xp+=5e4;save();toast(\'VIP XP added\');rAdmin()')}${adm('Skip starter quest','xsq()')}</div>
<div class="pn sc"><div class="lb">Items · ${own}/${TY.length} cars</div>${adm('Unlock all cars','xcars()')}${adm('+10 Ultra Rare cards','xcards()')}${adm('Teleport: Casino','xtp(0)')}${adm('Teleport: Dealer','xtp(1)')}</div></div>`}
function xlv(n){let L=lvOf(S.lxp||0);addXp(Math.max(1,lvAt(Math.min(100,L+n))-(S.lxp||0)));save();rAdmin()}
function xsq(){S.q=6;qRender();setWP(null,1);save();toast('Quest skipped')}
function xcars(){TY.forEach(t=>{if(S.own[t.n]==null)S.own[t.n]=t.c});save();toast('All cars unlocked - summon from Garage');rAdmin()}
function xcards(){for(let i=0;i<10;i++){const id=AD[(R()*8)|0]+'|'+((R()*8)|0)+'|6';S.cards[id]=(S.cards[id]||0)+1}save();toast('+10 Ultra Rare cards')}
function xtp(i){if(IN||P.car){toast('Exit your car / casino first');return}const q=POIS[i];P.x=q.x;P.z=q.z+11;P.y=.65;P.vy=0;togglePhone();toast('Teleported')}
