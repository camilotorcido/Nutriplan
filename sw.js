/* ============================================
   NutriPlan - Service Worker (Fase 5.2)
   Estrategia:
   - Cache-first para JS/CSS/iconos (assets versionados con ?v=)
   - Stale-while-revalidate para index.html
   - Network-first para peticiones externas (TheMealDB, etc.)
   ============================================ */

const VERSION = 'nutriplan-v20260425jj';
const CACHE_STATIC = 'nutriplan-static-' + VERSION;
const CACHE_RUNTIME = 'nutriplan-runtime-' + VERSION;

// Assets mínimos para el shell (Fase 6.2: recipes-extra y upgrades son lazy)
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
  './js/app-bundle.js'
];

// ─── Install: pre-cachear shell ───
// FIX: skipWaiting() se llama SIEMPRE, aunque falle algún asset del precache.
// Un fallo parcial no debe bloquear al nuevo SW indefinidamente.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then((cache) => {
        // addAll con fallback individual: si un asset falla, los demás siguen
        return Promise.allSettled(
          PRECACHE_URLS.map((u) =>
            cache.add(new Request(u, { cache: 'reload' })).catch((e) => {
              console.warn('[SW] No se pudo pre-cachear:', u, e);
            })
          )
        );
      })
      .then(() => self.skipWaiting()) // ← siempre se activa
  );
});

// ─── Activate: limpiar cachés viejos ───
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((k) => k.startsWith('nutriplan-') && k !== CACHE_STATIC && k !== CACHE_RUNTIME)
        .map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// ─── Fetch: enrutar según tipo de recurso ───
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const esMismoOrigen = url.origin === self.location.origin;

  // 1) API externa (TheMealDB, etc.): network-first con fallback a caché
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

  // 2) Navegación HTML: stale-while-revalidate sobre index.html
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

  // 3) Assets estáticos mismo origen
  // Estrategia: cache-first para hit exacto; network-first para miss.
  // FIX: eliminado el fallback ignoreSearch que devolvía versiones antiguas
  // cuando cambiaba el ?v= de versionado. Ahora el miss va directo a red.
  event.respondWith(
    caches.match(req).then((cached) => {
      // Hit exacto: servir del caché + revalidar en background
      if (cached && cached.ok) {
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
        // Sin red: último recurso — buscar sin query string (solo offline)
        return caches.match(req, { ignoreSearch: true })
          .then((fb) => fb || new Response('', { status: 503, statusText: 'Offline' }));
      });
    })
  );
});

// ─── Mensaje para forzar actualización ───
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// ─── Fase 5.3: click en notificación → abrir/enfocar la app ───
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
