/* Sintaxis 3.º: funciona sin conexión. Subí el número de versión para forzar la actualización. */
const V='sx3-v6';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const fonts=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(u.origin!==location.origin&&!fonts)return;
  if(fonts){ // tipografías: del caché y se actualizan de fondo
    e.respondWith(caches.open(V).then(c=>c.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok||x.type==='opaque')c.put(r,x.clone());return x;}).catch(()=>h);return h||n;})));
    return;
  }
  // la app: primero la red (así llegan las correcciones), y si no hay conexión, la copia guardada
  e.respondWith(fetch(r).then(x=>{const k=x.clone();caches.open(V).then(c=>c.put(r,k));return x;}).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));
});
