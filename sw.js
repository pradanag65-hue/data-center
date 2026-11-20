// Service worker: shell aplikasi tersimpan di perangkat, data tetap segar.
const V = "portal-v1";
const SHELL = ["./", "index.html", "style.css", "app.js", "features.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  const fresh = u.pathname.endsWith("apps.json");           // data: utamakan jaringan
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(r);
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
    return fresh ? net.then(res => res || hit) : (hit || net);  // aset: cache dulu, perbarui di belakang
  }));
});
