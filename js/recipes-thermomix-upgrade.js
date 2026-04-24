/* ============================================
   NutriPlan - Upgrade Thermomix para recetas locales
   Aplica el generador profesional _generarThermomixDesdeInstrucciones
   (expuesto en recipeAPI.js como window.generarThermomixProfesional)
   a todas las recetas de ALMUERZO y CENA de RECETAS_DB.
   
   Se ejecuta una sola vez al cargar la página, antes de que
   cualquier componente consulte RECETAS_DB.
   ============================================ */

(function aplicarThermomixProfesionalAComidasLocales() {
  if (typeof RECETAS_DB === 'undefined') {
    console.warn('[Thermomix Upgrade] RECETAS_DB no disponible, saltando');
    return;
  }
  if (typeof window.generarThermomixProfesional !== 'function') {
    console.warn('[Thermomix Upgrade] Generador profesional no disponible, saltando');
    return;
  }

  let regeneradas = 0;
  let saltadas = 0;

  RECETAS_DB.forEach(receta => {
    // Solo almuerzo y cena tienen instrucciones Thermomix
    if (receta.tipo_comida !== 'almuerzo' && receta.tipo_comida !== 'cena') {
      return;
    }

    // Requisito: ingredientes con nombre_normalizado
    if (!Array.isArray(receta.ingredientes) || receta.ingredientes.length === 0) {
      saltadas++;
      return;
    }
    const todosConNormalizado = receta.ingredientes.every(i => i && typeof i.nombre_normalizado === 'string');
    if (!todosConNormalizado) {
      saltadas++;
      return;
    }

    try {
      const nuevasInstrucciones = window.generarThermomixProfesional(receta.ingredientes, receta.tipo_comida);
      if (Array.isArray(nuevasInstrucciones) && nuevasInstrucciones.length >= 3) {
        receta.instrucciones_thermomix = nuevasInstrucciones;
        regeneradas++;
      } else {
        saltadas++;
      }
    } catch (err) {
      console.error(`[Thermomix Upgrade] Error en receta "${receta.nombre}":`, err);
      saltadas++;
    }
  });

  console.log(`[Thermomix Upgrade] ${regeneradas} recetas locales con instrucciones Thermomix profesionales${saltadas > 0 ? ' (' + saltadas + ' saltadas)' : ''}`);
})();
