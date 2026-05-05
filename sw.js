/* ============================================
   Calibrate — Service Worker
   Estrategia:
   - Cache-first para JS/CSS/iconos (assets versionados con ?v=)
   - Network-first para index.html (siempre fresco, SW se actualiza en 1 apertura)
   - Network-first para peticiones externas (TheMealDB, etc.)
   - Network-only para version.json (detección de actualización)
   ============================================ */

// Versión leída desde la URL de registro (sw.js?v=xxx)
const VERSION = (function () {
  try {
    var v = new URL(self.location.href).searchParams.get('v');
    return v ? ('calibrate-v' + v) : 'calibrate-v-dev';
  } catch (e) { return 'calibrate-v-dev'; }
})();
const CACHE_STATIC  = 'calibrate-static-'  + VERSION;
const CACHE_RUNTIME = 'calibrate-runtime-' + VERSION;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './css/tailwind-compiled.css',
  './icons/icon.svg',
  './js/firebase-config.js',
  './js/auth.js',
  './js/cloud-storage.js',
  './js/precios-clp.js',
  './js/recipes.js',
  './js/nutritionEngine.js',
  './js/storage.js',
  './js/roadmap-data.js',
  './js/roadmap-generator.js',
  './js/protein-complement.js',
  './js/fat-loss-integration.js',
  './js/body-comp.js',
  './js/steps.js',
  './js/entrenamiento.js',
  './js/plateau-detector.js',
  './js/alcohol-calc.js',
  './js/recipeAPI.js',
  './js/recipes-thermomix-upgrade.js',
  './js/lazy-recipes-loader.js',
  './js/equivalencias-ingredientes.js',
  './js/adherencia.js',
  './js/busqueda-inversa.js',
  './js/generador-recetas.js',
  './js/batch-cooking.js',
  './js/perfiles.js',
  './js/exports.js',
  './js/recetas-guardadas-loader.js',
  './js/app-bundle.compiled.js'
];

// --- Install ---
// skipWaiting() se llama INMEDIATAMENTE — el nuevo SW toma control en segundos,
// sin esperar a que el precache de 30+ URLs complete (que en mobile lento = 15-30s).
// event.waitUntil mantiene el SW vivo para que el precache continue en background.
self.addEventListener('install', (event) => {
  self.skipWaiting(); // activar ya, sin bloquear en el precache
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return Promise.allSettled(
        PRECACHE_URLS.map((u) =>
          cache.add(new Request(u, { cache: 'reload' })).catch((e) => {
            console.warn('[SW] No se pudo pre-cachear:', u, e);
          })
        )
      );
    })
  );
});

// --- Activate: limpiar cachés viejos ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((k) => (k.startsWith('calibrate-') || k.startsWith('nutriplan-')) && k !== CACHE_STATIC && k !== CACHE_RUNTIME)
        .map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// --- Fetch ---
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const esMismoOrigen = url.origin === self.location.origin;

  // 0) version.json: SIEMPRE de red, nunca del caché — usado para detección de updates
  if (esMismoOrigen && url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(req, { cache: 'no-store' }).catch(() => new Response('{}', { status: 200 })));
    return;
  }

  // 1) API externa: network-first con fallback al caché
  if (!esMismoOrigen) {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(CACHE_RUNTIME).then((c) => c.put(req, copia)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 2) Navegación HTML: network-first para que index.html sea siempre fresco.
  // El APP_VERSION actualizado permite registrar el SW correcto en 1 apertura.
  // Fallback al caché solo si sin red (offline).
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            caches.open(CACHE_STATIC).then((c) => c.put('./index.html', resp.clone())).catch(() => {});
          }
          return resp;
        })
        .catch(() => caches.match('./index.html').then((fb) => fb || new Response('', { status: 503, statusText: 'Offline' })))
    );
    return;
  }

  // 3) Assets estáticos mismo origen: cache-first para hit exacto; network para miss.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached && cached.ok) {
        // Revalidar en background
        fetch(req).then((resp) => {
          if (resp && resp.ok && resp.status !== 404) {
            caches.open(CACHE_STATIC).then((c) => c.put(req, resp.clone())).catch(() => {});
          }
        }).catch(() => {});
        return cached;
      }
      // Miss: red primero
      return fetch(req).then((resp) => {
        if (resp && resp.ok && resp.status !== 404) {
          const copia = resp.clone();
          caches.open(CACHE_STATIC).then((c) => c.put(req, copia)).catch(() => {});
        }
        return resp;
      }).catch(() => {
        return caches.match(req, { ignoreSearch: true })
          .then((fb) => fb || new Response('', { status: 503, statusText: 'Offline' }));
      });
    })
  );
});

// --- Mensaje para forzar actualización ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// --- Click en notificación → abrir/enfocar la app ---
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        if ('focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
