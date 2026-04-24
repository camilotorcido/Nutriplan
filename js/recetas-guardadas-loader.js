/* ============================================
   NutriPlan - Loader de recetas generadas guardadas
   Inyecta en RECETAS_DB las recetas que el usuario creó con el generador
   paramétrico y persistió en localStorage.
   Se ejecuta al final del bootstrap.
   ============================================ */

(function cargarRecetasGuardadas() {
  if (typeof RECETAS_DB === 'undefined') return;
  try {
    const raw = localStorage.getItem('nutriplan_recetas_generadas');
    if (!raw) return;
    const recetas = JSON.parse(raw);
    if (!Array.isArray(recetas)) return;

    let añadidas = 0;
    recetas.forEach(r => {
      if (r && r.id && !RECETAS_DB.find(existente => existente.id === r.id)) {
        RECETAS_DB.push(r);
        añadidas++;
      }
    });

    if (añadidas > 0) {
      console.log(`[Recetas Guardadas] +${añadidas} recetas del usuario incorporadas al catálogo`);
    }
  } catch (e) {
    console.error('[Recetas Guardadas] Error cargando:', e);
  }
})();
