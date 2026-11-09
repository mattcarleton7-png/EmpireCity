// Loads the 3D engine (with a backup CDN), the fonts, then the game, and shows honest progress.
(function(){
  var bar=document.getElementById('bootBar'),msg=document.getElementById('bootMsg'),retry=document.getElementById('bootRetry');
  function step(p,t){bar.style.width=p+'%';if(t)msg.textContent=t}
  function load(srcs){return new Promise(function(ok,no){(function next(i){if(i>=srcs.length)return no(new Error('load failed'));var s=document.createElement('script');s.src=srcs[i];s.async=false;s.onload=ok;s.onerror=function(){s.remove();next(i+1)};document.head.appendChild(s)})(0)})}
  var R='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',J='https://cdn.jsdelivr.net/npm/three@0.128.0/',U='https://unpkg.com/three@0.128.0/';
  var ex=['shaders/CopyShader.js','shaders/LuminosityHighPassShader.js','postprocessing/EffectComposer.js','postprocessing/RenderPass.js','postprocessing/ShaderPass.js','postprocessing/UnrealBloomPass.js'];
  var nap=function(){return new Promise(function(r){setTimeout(r,30)})};
  (async function(){
    try{
      step(8,'Loading the engine');
      await load([R,J+'build/three.min.js',U+'build/three.min.js']);
      step(35);
      for(var i=0;i<ex.length;i++){try{await load([J+'examples/js/'+ex[i],U+'examples/js/'+ex[i]])}catch(e){}}
      step(55,'Loading fonts');
      try{await Promise.race([Promise.all(['12px "Empire Glyphs"','700 12px "Empire Display"','500 12px "Empire Text"','600 12px "Empire Text"','700 12px "Empire Text"','800 12px "Empire Text"'].map(function(f){return document.fonts.load(f,'A')})),new Promise(function(r){setTimeout(r,4000)})])}catch(e){}
      step(70,'Building the city');await nap();
      await load(['js/gfx.js']);await load(['js/ui.js']);await load(['js/game.js']);await load(['js/floor-games.js']);await load(['js/palace-ui.js']);await load(['js/palace.js']);
      step(100);
    }catch(e){
      msg.textContent='The game could not load. Check your connection and try again.';bar.parentNode.style.display='none';retry.style.display='block';
    }
  })();
  window.bootDone=function(){var b=document.getElementById('boot');b.classList.add('out');setTimeout(function(){b.remove()},600)};
})();
