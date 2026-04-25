/* ============================================
   NutriPlan - Lazy Recipes Loader (Fase 6.2)
   Difiere la carga de recipes-extra.js (212 KB) y los upgrades
   (thermomix + metadata = ~12 KB) hasta el primer uso real.
   
   Ahorro: ~224 KB del first paint. La base RECETAS_DB con 80 recetas
   locales sigue cargando al inicio (necesaria para utilidades).
   ============================================ */

(function cargarLazyLoader() {
  var cargado = false;
  var promesaCarga = null;
  var VERSION = 'v=20260418ax';

  function cargarScript(src) {
    return new Promise(function(resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false; // Mantener orden
      s.onload = function() { resolve(); };
      s.onerror = function() { reject(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  }

  /**
   * Carga recipes-extra + upgrades. Es idempotente — llamadas repetidas
   * devuelven la misma promesa.
   * @returns {Promise<void>}
   */
  function cargarRecetasCompletas() {
    if (cargado) return Promise.resolve();
    if (promesaCarga) return promesaCarga;

    var t0 = performance.now();
    console.log('[Lazy Recipes] Cargando recipes-extra + upgrades...');

    promesaCarga = cargarScript('js/recipes-extra.js?' + VERSION)
      .then(function() { return cargarScript('js/recipes-thermomix-upgrade.js?' + VERSION); })
      .then(function() { return cargarScript('js/recipes-metadata-upgrade.js?' + VERSION); })
      .then(function() {
        cargado = true;
        // Regenerar lookup de ingredientes con las recetas nuevas
        if (typeof window.reconstruirLookupIngredientes === 'function') {
          window.reconstruirLookupIngredientes();
        }
        var ms = Math.round(performance.now() - t0);
        var total = typeof RECETAS_DB !== 'undefined' ? RECETAS_DB.length : 0;
        console.log('[Lazy Recipes] Listo en ' + ms + 'ms · RECETAS_DB total: ' + total);
      })
      .catch(function(err) {
        console.error('[Lazy Recipes] Error:', err);
        promesaCarga = null; // Permitir reintento
        throw err;
      });

    return promesaCarga;
  }

  /**
   * Chequea si las recetas extendidas ya están en memoria.
   */
  function estaCargado() { return cargado; }

  // API global
  window.lazyRecipes = {
    cargar: cargarRecetasCompletas,
    estaCargado: estaCargado
  };

  console.log('[Lazy Recipes] Loader registrado (defer ~224 KB hasta primer uso)');
})();
