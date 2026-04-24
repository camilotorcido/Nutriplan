/* ============================================
   NutriPlan - Búsqueda inversa
   "Tengo estos ingredientes, qué puedo cocinar"
   ============================================ */

(function cargarBusquedaInversa() {
  // Palabras vacías a ignorar
  const IGNORAR = new Set(['sal', 'pimienta', 'agua', 'aceite_vegetal']);

  function normalizarBusqueda(texto) {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z_\s]/g, '')
      .trim();
  }

  // Match por substring bidireccional (ej. "pollo" ↔ "pechuga_pollo")
  // pero evitando falsos positivos cortos (ej. "ajo" ≠ "zanahoria"/"ajonjoli")
  function esMatch(userToken, recetaToken) {
    if (userToken === recetaToken) return true;
    if (userToken.length < 3 || recetaToken.length < 3) return false;
    // userToken contenido en recetaToken o viceversa, rodeado por límites de palabra/guión bajo
    const pat = new RegExp('(^|_)' + userToken + '(_|$)');
    if (pat.test(recetaToken)) return true;
    const pat2 = new RegExp('(^|_)' + recetaToken + '(_|$)');
    if (pat2.test(userToken)) return true;
    return false;
  }

  // Score = % de ingredientes DEL USUARIO que aparecen en la receta
  // (no al revés). Esto responde mejor a "¿qué tan bien aprovecho lo que tengo?"
  // También requiere un mínimo absoluto de coincidencias.
  function buscarRecetasPorIngredientes(ingredientesUsuario, opciones) {
    opciones = opciones || {};
    const minimoMatch = opciones.minimoMatch != null ? opciones.minimoMatch : 0.5;
    const tiposComida = opciones.tiposComida || null;
    const maxResultados = opciones.maxResultados || 30;

    if (typeof RECETAS_DB === 'undefined') return [];

    // Normalizar entrada del usuario
    const setUsuario = new Set();
    ingredientesUsuario.forEach(ing => {
      const normalizado = normalizarBusqueda(ing).replace(/\s+/g, '_');
      if (normalizado) setUsuario.add(normalizado);
    });

    if (setUsuario.size === 0) return [];

    const resultados = [];

    RECETAS_DB.forEach(receta => {
      if (tiposComida && !tiposComida.includes(receta.tipo_comida)) return;
      if (!Array.isArray(receta.ingredientes)) return;

      const ingredientesRelevantes = receta.ingredientes.filter(ing => {
        return ing.nombre_normalizado && !IGNORAR.has(ing.nombre_normalizado);
      });

      if (ingredientesRelevantes.length === 0) return;

      const encontrados = [];
      const faltantes = [];
      const usadosDelUsuario = new Set(); // tokens del usuario que matchearon

      ingredientesRelevantes.forEach(ing => {
        let match = false;
        for (const u of setUsuario) {
          if (esMatch(u, ing.nombre_normalizado)) {
            match = true;
            usadosDelUsuario.add(u);
            break;
          }
        }
        if (match) {
          encontrados.push(ing.nombre_display || ing.nombre);
        } else {
          faltantes.push(ing.nombre_display || ing.nombre);
        }
      });

      const coincidencias = encontrados.length;
      if (coincidencias === 0) return;

      // Dos métricas:
      // - ratioUsuario: % de ingredientes del usuario que la receta usa (0-1)
      // - ratioReceta: % de ingredientes de la receta que el usuario tiene (0-1)
      const ratioUsuario = usadosDelUsuario.size / setUsuario.size;
      const ratioReceta = coincidencias / ingredientesRelevantes.length;

      // Score compuesto con sesgo hacia aprovechar lo que el usuario tiene:
      // 70% ratioUsuario + 30% ratioReceta
      const scoreCompuesto = (0.7 * ratioUsuario) + (0.3 * ratioReceta);

      if (scoreCompuesto >= minimoMatch) {
        resultados.push({
          receta: receta,
          coincidencias: coincidencias,
          total: ingredientesRelevantes.length,
          ratio: scoreCompuesto,
          porcentaje: Math.round(scoreCompuesto * 100),
          ratio_usuario: ratioUsuario,
          ratio_receta: ratioReceta,
          encontrados: encontrados,
          faltantes: faltantes
        });
      }
    });

    // Ordenar: primero por ratioUsuario (aprovecha todo lo tuyo),
    // desempate por # coincidencias, luego por ratioReceta.
    resultados.sort((a, b) => {
      if (b.ratio_usuario !== a.ratio_usuario) return b.ratio_usuario - a.ratio_usuario;
      if (b.coincidencias !== a.coincidencias) return b.coincidencias - a.coincidencias;
      return b.ratio_receta - a.ratio_receta;
    });

    return resultados.slice(0, maxResultados);
  }

  // Autocomplete: sugerir ingredientes conocidos mientras escribe
  function sugerirIngredientes(query) {
    if (typeof RECETAS_DB === 'undefined') return [];
    const q = normalizarBusqueda(query);
    if (q.length < 2) return [];

    const todos = new Map(); // normalizado → display
    RECETAS_DB.forEach(r => {
      (r.ingredientes || []).forEach(ing => {
        if (ing.nombre_normalizado && !IGNORAR.has(ing.nombre_normalizado)) {
          todos.set(ing.nombre_normalizado, ing.nombre_display || ing.nombre);
        }
      });
    });

    const matches = [];
    todos.forEach((display, normalizado) => {
      const displayNorm = normalizarBusqueda(display);
      if (displayNorm.includes(q) || normalizado.includes(q.replace(/\s/g, '_'))) {
        matches.push({ normalizado, display });
      }
    });

    return matches.sort((a, b) => a.display.length - b.display.length).slice(0, 10);
  }

  window.buscarRecetasPorIngredientes = buscarRecetasPorIngredientes;
  window.sugerirIngredientes = sugerirIngredientes;

  console.log('[Búsqueda Inversa] Motor cargado');
})();
