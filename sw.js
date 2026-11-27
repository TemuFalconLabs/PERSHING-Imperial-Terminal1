const name='pershing-duty-v2.19';
const shell=['./','./index.html','./station.css','./station.mjs','./session.mjs','./engine.mjs','./content.mjs','./easter-eggs.mjs','./crisis-art.mjs','./voice-selection.mjs','./station-presentation.mjs'];
self.addEventListener('install',e=>e.waitUntil(caches.open(name).then(c=>c.addAll(shell)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==location.origin)return;
 if(e.request.mode==='navigate')e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));
 else if(shell.some(x=>new URL(x,self.registration.scope).pathname===url.pathname))
   e.respondWith(fetch(e.request).then(async r=>{if(r.ok)await (await caches.open(name)).put(e.request,r.clone());return r}).catch(()=>caches.match(e.request)));
});
