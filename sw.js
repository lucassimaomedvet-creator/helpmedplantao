// Cache offline simples: rede primeiro, cache como reserva.
const CACHE = 'prontuario-v18';
const ARQS = ['./', 'index.html', 'styles.css', 'app.js', 'ia.js', 'calc.js', 'prenatal.js', 'icon.svg', 'manifest.webmanifest',
  'data/remume.js', 'data/medicamentos.js', 'data/sintomas.js', 'data/condicoes.js', 'data/alertas.js', 'data/pediatria.js',
  'data/mesclar.js', 'data/ubs.js', 'data/ps.js', 'data/gest.js', 'data/ped.js', 'data/presc.js', 'data/anamneses.js', 'data/jaguariuna-ubs.js', 'data/cidades.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQS))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).pathname.startsWith('/api/')) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request)));
});
