/* ============================================
   NutriPlan - Service Worker (Fase 5.2)
   Estrategia:
   - Cache-first para JS/CSS/iconos (assets versionados con ?v=)
   - Stale-while-revalidate para index.html
   - Network-first para peticiones externas (TheMealDB, etc.)
   ============================================ */

const VERSION = 'nutriplan-v20260418ay';
const CACHE_STATIC = 'nutriplan-static-' + VERSION;
const CACHE_RUNTIME = 'nutriplan-runtime-' + VERSION;

// Assets mÃ­nimos para el shell (Fase 6.2: recipes-extra y upgrades son lazy)
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './css/tailwind-compiled.css',
  './icons/icon.svg',
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
  './js/app-bundle.js'
];

// Assets que se cachean al primer uso (runtime cache)
// recipes-extra.js (212 KB), recipes-thermomix-upgrade.js, recipes-metadata-upgrade.js

// â”€â”€â”€ Install: pre-cachear shell â”€â”€â”€
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then((cache) => cache.addAll(PRECACHE_URLS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
      .catch((e) => console.warn('[SW] precache fallÃ³:', e))
  );
});

// â”€â”€â”€ Activate: limpiar cachÃ©s viejos â”€â”€â”€
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((k) => k.startsWith('nutriplan-') && k !== CACHE_STATIC && k !== CACHE_RUNTIME)
        .map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// â”€â”€â”€ Fetch: enrutar segÃºn tipo de recurso â”€â”€â”€
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const esMismoOrigen = url.origin === self.location.origin;

  // 1) API externa (TheMealDB, etc.): network-first con fallback a cachÃ©
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

  // 2) NavegaciÃ³n HTML: stale-while-revalidate sobre index.html
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      caches.match('./index.html').then((cached) => {
        const fetchPromise = fetch(req)
          .then((resp) => {
            caches.open(CACHE_STATIC).then((c) => c.put('./index.html', resp.clone())).catch(() => {});
            return resp;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 3) Assets estÃ¡ticos mismo origen: cache-first con fallback a URL sin query
  event.respondWith(
    caches.match(req).then((cached) => {
      // Solo servir del cachÃ© si es una respuesta vÃ¡lida (no 404)
      if (cached && cached.ok) {
        fetch(req).then((resp) => {
          if (resp && resp.ok && resp.status !== 404) {
            caches.open(CACHE_STATIC).then((c) => c.put(req, resp.clone())).catch(() => {});
          }
        }).catch(() => {});
        return cached;
      }
      // Si no estÃ¡ o es 404, intentar sin query string
      return caches.match(req, { ignoreSearch: true }).then((cachedNoQuery) => {
        if (cachedNoQuery && cachedNoQuery.ok) return cachedNoQuery;
        // Network fallback
        return fetch(req).then((resp) => {
          if (resp && resp.ok && resp.status !== 404) {
            const copia = resp.clone();
            caches.open(CACHE_STATIC).then((c) => c.put(req, copia)).catch(() => {});
          }
          return resp;
        }).catch(() => {
          // Ãšltimo intento: fetch sin query string
          const urlLimpia = req.url.split('?')[0];
          return fetch(urlLimpia).catch(() => cached || new Response('', { status: 404 }));
        });
      });
    })
  );
});

// â”€â”€â”€ Mensaje para forzar actualizaciÃ³n (opcional) â”€â”€â”€
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// â”€â”€â”€ Fase 5.3: click en notificaciÃ³n â†’ abrir/enfocar la app â”€â”€â”€
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

