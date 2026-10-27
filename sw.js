const VERSION='20261027054608';const SHELL='shell-'+VERSION,AUDIO='audio-v1';
const PRE=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==SHELL&&k!==AUDIO).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin!==location.origin){ if(/fonts\.(googleapis|gstatic)\.com|i\.ytimg\.com/.test(u.host)){e.respondWith(caches.open(SHELL).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}))))}return}
 if(u.pathname.includes('/audio/')&&u.pathname.endsWith('.mp3')){e.respondWith(caches.open(AUDIO).then(c=>c.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))));return}
 if(r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')||u.pathname.endsWith('manifest.json')){
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res.ok){const cl=res.clone();caches.open(SHELL).then(c=>c.put(r.mode==='navigate'?'index.html':r,cl))}return res}).catch(()=>caches.match(r.mode==='navigate'?'index.html':r).then(m=>m||caches.match('./'))));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r)))});
