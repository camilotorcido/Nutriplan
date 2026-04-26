/* ============================================
   NutriPlan - Metadata Upgrade (Fase 1)
   Añade tiempo_prep_min, tiempo_coccion_min y costo_clp
   a todas las recetas locales (RECETAS_DB) mediante heurística.
   
   Se ejecuta una sola vez al cargar, después de recipes-extra.js
   y recipes-thermomix-upgrade.js.
   ============================================ */

(function aplicarMetadataRecetas() {
  if (typeof RECETAS_DB === 'undefined') {
    console.warn('[Metadata Upgrade] RECETAS_DB no disponible');
    return;
  }
  if (typeof window.PRECIOS_CLP === 'undefined') {
    console.warn('[Metadata Upgrade] PRECIOS_CLP no disponible, costos quedarán en 0');
  }

  // ───────────────────────────────────────────────
  // Tiempos base por tipo de comida (min)
  // ───────────────────────────────────────────────
  const TIEMPOS_BASE = {
    desayuno:  { prep: 5,  coccion: 8 },
    snack_am:  { prep: 3,  coccion: 2 },
    almuerzo:  { prep: 12, coccion: 20 },
    snack_pm:  { prep: 3,  coccion: 2 },
    cena:      { prep: 12, coccion: 20 }
  };

  // Palabras clave que ajustan tiempos (se aplican sobre instrucciones)
  const AJUSTES_TECNICA = [
    { kw: /horno|asar|rostizar|hornear/i,        prep: 5,  coccion: 20 },
    { kw: /legumbre|porotos|lentejas|garbanzos/i, prep: 5,  coccion: 25 },
    { kw: /marinar/i,                             prep: 15, coccion: 0  },
    { kw: /overnight|noche anterior|refriger/i,   prep: 5,  coccion: 0  },
    { kw: /reposar|enfriar/i,                     prep: 0,  coccion: 5  },
    { kw: /licuar|batir|mezcla/i,                 prep: -2, coccion: -3 },
    { kw: /crudo|sin cocción|sin cocinar/i,       prep: 0,  coccion: -10 },
    { kw: /arroz|quinoa/i,                        prep: 0,  coccion: 5  },
    { kw: /guiso|estofado/i,                      prep: 3,  coccion: 15 }
  ];

  function calcularTiempos(receta) {
    const base = TIEMPOS_BASE[receta.tipo_comida] || TIEMPOS_BASE.almuerzo;
    let prep = base.prep;
    let coccion = base.coccion;

    const textoInstrucciones = (receta.instrucciones || []).join(' ').toLowerCase();
    for (const ajuste of AJUSTES_TECNICA) {
      if (ajuste.kw.test(textoInstrucciones)) {
        prep += ajuste.prep;
        coccion += ajuste.coccion;
      }
    }

    // Ajuste por número de ingredientes (más ingredientes = más prep)
    const numIng = Array.isArray(receta.ingredientes) ? receta.ingredientes.length : 0;
    if (numIng >= 10) prep += 3;
    else if (numIng >= 7) prep += 2;
    else if (numIng <= 3) prep -= 2;

    // Límites razonables
    prep = Math.max(2, Math.min(30, prep));
    coccion = Math.max(0, Math.min(60, coccion));

    return { prep, coccion };
  }

  // ───────────────────────────────────────────────
  // Cálculo de costo en CLP
  // ───────────────────────────────────────────────
  function calcularCostoCLP(receta) {
    if (!window.PRECIOS_CLP || !Array.isArray(receta.ingredientes)) return 0;

    let total = 0;
    for (const ing of receta.ingredientes) {
      const precio = window.PRECIOS_CLP[ing.nombre_normalizado];
      if (!precio) continue;

      // precio viene como { clp_por_unidad_base: N, unidad_base: "g"|"ml"|"unidad" }
      // cantidad_base está en la unidad de la receta
      let cantidadNormalizada = ing.cantidad_base || 0;
      
      // Si la unidad de la receta no coincide con unidad_base, intentamos convertir
      const unidadReceta = (ing.unidad || '').toLowerCase();
      const unidadPrecio = precio.unidad_base.toLowerCase();
      
      if (unidadReceta !== unidadPrecio) {
        // Casos de conversión básicos
        if (unidadReceta === 'unidad' || unidadReceta === 'unidades') {
          // No convertir, usar cantidad directa si el precio es por unidad
          if (unidadPrecio !== 'unidad') continue;
        } else if ((unidadReceta === 'ml' && unidadPrecio === 'g') ||
                   (unidadReceta === 'g' && unidadPrecio === 'ml')) {
          // Aproximación 1:1 para líquidos comunes
        } else {
          // Sin conversión fiable, omitir
          continue;
        }
      }

      total += cantidadNormalizada * precio.clp_por_unidad_base;
    }

    return Math.ceil(total);
  }

  // ───────────────────────────────────────────────
  // Aplicar a todas las recetas
  // ───────────────────────────────────────────────
  let conTiempos = 0;
  let conCosto = 0;

  RECETAS_DB.forEach(receta => {
    if (typeof receta.tiempo_prep_min === 'undefined' || typeof receta.tiempo_coccion_min === 'undefined') {
      const t = calcularTiempos(receta);
      receta.tiempo_prep_min = t.prep;
      receta.tiempo_coccion_min = t.coccion;
      receta.tiempo_total_min = t.prep + t.coccion;
      conTiempos++;
    } else {
      receta.tiempo_total_min = (receta.tiempo_prep_min || 0) + (receta.tiempo_coccion_min || 0);
    }

    if (typeof receta.costo_clp === 'undefined' || receta.costo_clp === 0) {
      receta.costo_clp = calcularCostoCLP(receta);
      if (receta.costo_clp > 0) conCosto++;
    }
  });

  console.log(`[Metadata Upgrade] ${conTiempos} recetas con tiempos, ${conCosto} con costo CLP calculado`);

  // Exponer helpers para uso runtime (recetas online)
  window.calcularTiemposReceta = calcularTiempos;
  window.calcularCostoRecetaCLP = calcularCostoCLP;

  // ───────────────────────────────────────────────
  // MIGRACIÓN: enriquecer plan semanal guardado en localStorage
  // (los planes creados antes del upgrade no tienen tiempo_*, costo_clp)
  // ───────────────────────────────────────────────
  try {
    const planGuardado = localStorage.getItem('nutriplan_plan_semanal');
    if (!planGuardado) {
      console.log('[Metadata Upgrade] No hay plan guardado para migrar');
      return;
    }

    const plan = JSON.parse(planGuardado);
    let comidasEnriquecidas = 0;

    function enriquecerComida(comida) {
      if (!comida || typeof comida !== 'object') return false;
      let cambio = false;
      
      // Buscar receta original en RECETAS_DB por id para obtener tiempo/costo base
      const recetaBase = RECETAS_DB.find(r => r.id === comida.id);
      
      if (typeof comida.tiempo_prep_min === 'undefined') {
        if (recetaBase && typeof recetaBase.tiempo_prep_min !== 'undefined') {
          comida.tiempo_prep_min = recetaBase.tiempo_prep_min;
          comida.tiempo_coccion_min = recetaBase.tiempo_coccion_min;
          comida.tiempo_total_min = recetaBase.tiempo_total_min;
        } else {
          // Recetas online o no encontradas: calcular con heurística
          const t = calcularTiempos(comida);
          comida.tiempo_prep_min = t.prep;
          comida.tiempo_coccion_min = t.coccion;
          comida.tiempo_total_min = t.prep + t.coccion;
        }
        cambio = true;
      }

      // Always sync cost from the base recipe so price updates propagate to stored plans
      if (recetaBase && recetaBase.costo_clp > 0) {
        comida.costo_clp = recetaBase.costo_clp;
        cambio = true;
      } else if (typeof comida.costo_clp === 'undefined' || comida.costo_clp === 0) {
        comida.costo_clp = calcularCostoCLP(comida);
        cambio = true;
      }

      return cambio;
    }

    // Plan multi-semana: { semana_1: { Lunes: {...}, ... }, semana_2: {...} }
    // Plan legacy: { Lunes: {...}, ... }
    Object.entries(plan).forEach(([k1, v1]) => {
      if (k1.startsWith('_') || !v1 || typeof v1 !== 'object') return;
      
      if (k1.startsWith('semana_')) {
        // Multi-semana
        Object.entries(v1).forEach(([dia, comidasDia]) => {
          if (dia.startsWith('_') || !comidasDia || typeof comidasDia !== 'object') return;
          Object.values(comidasDia).forEach(comida => {
            if (enriquecerComida(comida)) comidasEnriquecidas++;
          });
        });
      } else {
        // Plan legacy (día directo en raíz)
        Object.values(v1).forEach(comida => {
          if (enriquecerComida(comida)) comidasEnriquecidas++;
        });
      }
    });

    if (comidasEnriquecidas > 0) {
      localStorage.setItem('nutriplan_plan_semanal', JSON.stringify(plan));
      console.log(`[Metadata Upgrade] Plan guardado migrado: ${comidasEnriquecidas} comidas enriquecidas con tiempo+costo`);
    } else {
      console.log('[Metadata Upgrade] Plan guardado ya tiene metadata, sin cambios');
    }
  } catch (e) {
    console.error('[Metadata Upgrade] Error migrando plan guardado:', e);
  }
})();
