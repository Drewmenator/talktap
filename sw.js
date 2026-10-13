const CACHE="talktap-v16";
const ASSETS=["./","./index.html","./manifest.json","./voice_jessica.mp3","./voice_dad.mp3","./voice_mum.mp3","./icon-180.png","./icon-192.png","./icon-512.png","./progress.html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Audio uses range requests on iOS; serve full cached file for those, otherwise cache-first with network fallback.
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET"||new URL(req.url).pathname.includes("/api/"))return;
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(async hit=>{
    const range=req.headers.get("range");
    if(hit&&range){
      const buf=await hit.arrayBuffer();const m=/bytes=(\d+)-(\d*)/.exec(range);
      const start=+m[1],end=m[2]?+m[2]:buf.byteLength-1;
      return new Response(buf.slice(start,end+1),{status:206,headers:{"Content-Type":hit.headers.get("Content-Type")||"audio/mpeg","Content-Range":`bytes ${start}-${end}/${buf.byteLength}`,"Content-Length":String(end-start+1),"Accept-Ranges":"bytes"}});
    }
    if(hit)return hit;
    try{const res=await fetch(req);const h=new URL(req.url).hostname;if((res.ok||res.type==="opaque")&&(h===location.hostname||h.endsWith("blob.vercel-storage.com"))){const c=await caches.open(CACHE);c.put(req,res.clone())}return res}catch(err){return hit||Response.error()}
  }));
});
