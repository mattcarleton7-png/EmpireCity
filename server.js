// Empire City server: zero dependencies. Serves /public, stores accounts + saves on disk,
// and runs the multiplayer WebSocket relay (see multiplayer.js).
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto'),zlib=require('zlib');
const PORT=process.env.PORT||3000,DATA=process.env.DATA_DIR||path.join(__dirname,'data'),PUB=path.join(__dirname,'public');
const ADMINS=(process.env.ADMIN_USERS||'matt6769').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
const OKN=/^[A-Za-z0-9_]{3,16}$/,MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.json':'application/json','.webmanifest':'application/manifest+json','.woff':'font/woff','.woff2':'font/woff2'};
const TEXT=new Set(['.html','.js','.css','.svg','.json','.webmanifest']),gz=new Map();
fs.mkdirSync(path.join(DATA,'saves'),{recursive:true});
const fileOf=n=>path.join(DATA,'saves',n.toLowerCase()+'.json');
const read=n=>{try{return JSON.parse(fs.readFileSync(fileOf(n),'utf8'))}catch(e){return null}};
function write(n,o){const f=fileOf(n),b1=f+'.bak1';
  // rolling backups: keep the last 5 snapshots, one every 10+ minutes
  if(fs.existsSync(f)&&(!fs.existsSync(b1)||Date.now()-fs.statSync(b1).mtimeMs>6e5)){for(let i=4;i>=1;i--)if(fs.existsSync(f+'.bak'+i))fs.renameSync(f+'.bak'+i,f+'.bak'+(i+1));fs.copyFileSync(f,b1)}
  fs.writeFileSync(f+'.tmp',JSON.stringify(o));fs.renameSync(f+'.tmp',f)}
const same=(a,b)=>{a=Buffer.from(String(a));b=Buffer.from(String(b));return a.length===b.length&&crypto.timingSafeEqual(a,b)};
const hits=new Map();function limited(k,max){const n=Date.now(),a=(hits.get(k)||[]).filter(t=>n-t<6e4);a.push(n);hits.set(k,a);return a.length>max}
setInterval(()=>hits.clear(),3.6e6);
const send=(res,c,o,t)=>{res.writeHead(c,{'Content-Type':t||'application/json','Cache-Control':'no-store'});res.end(typeof o==='string'?o:JSON.stringify(o))};
const body=req=>new Promise((ok,no)=>{let d='';req.on('data',c=>{d+=c;if(d.length>2e6){no(new Error('big'));req.destroy()}});req.on('end',()=>{try{ok(JSON.parse(d||'{}'))}catch(e){no(e)}});req.on('error',no)});
async function api(req,res,u){
  const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim(),p=u.pathname.split('/').filter(Boolean);
  if(limited(ip+'|'+p[1],p[1]==='save'?240:30))return send(res,429,{error:'slow down'});
  if(p[1]==='salt'&&req.method==='GET'){const r=OKN.test(p[2]||'')&&read(p[2]);return r?send(res,200,{salt:r.salt}):send(res,404,{})}
  const b=req.method==='GET'?{}:await body(req);
  if(p[1]==='login'&&req.method==='POST'){const r=OKN.test(b.name||'')&&read(b.name);if(!r)return send(res,404,{});
    return same(b.h,r.h)?send(res,200,r):send(res,200,{name:r.name,salt:r.salt,h:'',t:0,s:''})}
  if(p[1]==='admin'&&req.method==='POST'){const r=OKN.test(b.name||'')&&read(b.name);return send(res,200,{admin:!!(r&&same(b.h,r.h)&&ADMINS.includes(b.name.toLowerCase()))})}
  if(p[1]==='save'&&req.method==='PUT'){const n=p[2]||'';if(!OKN.test(n)||typeof b.h!=='string'||b.h.length<8||b.h.length>80||typeof b.s!=='string'||b.s.length>1.5e6)return send(res,400,{error:'bad'});
    const r=read(n);if(r&&!same(b.h,r.h))return send(res,403,{error:'auth'});
    write(n,{name:r?r.name:n,t:+b.t||Date.now(),h:r?r.h:b.h,salt:r?r.salt:String(b.salt||'').slice(0,64),s:b.s});return send(res,200,{ok:1})}
  send(res,404,{error:'nf'})}
const srv=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://x');
  if(u.pathname==='/healthz')return send(res,200,'ok','text/plain');
  if(u.pathname==='/api/online')return send(res,200,{online:mp.online()});
  if(u.pathname.startsWith('/api/'))return await api(req,res,u);
  let f=path.normalize(path.join(PUB,decodeURIComponent(u.pathname)));if(f!==PUB&&!f.startsWith(PUB+path.sep))return send(res,403,'no','text/plain');
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){if(path.extname(f))return send(res,404,'not found','text/plain');f=path.join(PUB,'index.html')}
  // every asset is revalidated, so a new deploy reaches players on their next load; unchanged files answer 304
  const x=path.extname(f),st=fs.statSync(f),tag='"'+st.size.toString(36)+'-'+Math.round(st.mtimeMs).toString(36)+'"',head={'Content-Type':MIME[x]||'application/octet-stream','Cache-Control':'no-cache',ETag:tag,'X-Content-Type-Options':'nosniff',Vary:'Accept-Encoding'};
  if(req.headers['if-none-match']===tag){res.writeHead(304,head);return res.end()}
  if(TEXT.has(x)&&/\bgzip\b/.test(req.headers['accept-encoding']||'')){let c=gz.get(f);if(!c||c.tag!==tag){c={tag,buf:zlib.gzipSync(fs.readFileSync(f),{level:9})};gz.set(f,c)}head['Content-Encoding']='gzip';res.writeHead(200,head);return res.end(c.buf)}
  res.writeHead(200,head);fs.createReadStream(f).pipe(res)}
  catch(e){send(res,500,{error:'server'})}}).listen(PORT,'0.0.0.0',()=>console.log('Empire City on :'+PORT+' data:'+DATA));
const mp=require('./multiplayer')(srv,{read,same,OKN});
