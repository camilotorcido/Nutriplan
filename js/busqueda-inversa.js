/* ============================================
   Calibrate — Búsqueda inversa
   "Tengo estos ingredientes, qué puedo cocinar"
   ============================================ */

(function cargarBusquedaInversa() {
  // Palabras vacías a ignorar
  const IGNORAR = new Set(['sal', 'pimienta', 'agua', 'aceite_vegetal']);

  // Familias de ingredientes: cuando el usuario elige el token clave,
  // la búsqueda se expande a todos los miembros equivalentes.
  // NO incluye cosas distintas comercialmente (ej. carne_res ≠ carne_molida).
  const FAMILIAS = {
    carne_res: {
      display: 'Carne de res (todos los cortes)',
      sinonimos: ['carne_res', 'lomo_liso', 'lomo_vetado', 'asado_tira', 'posta_negra', 'sobrecostilla', 'plateada', 'punta_paleta', 'huachalomo', 'filete_res', 'bife']
    },
    pollo: {
      display: 'Pollo (todos los cortes)',
      sinonimos: ['pollo', 'pechuga_pollo', 'muslo_pollo', 'contramuslo_pollo', 'alas_pollo', 'pollo_entero']
    },
    cerdo: {
      display: 'Cerdo (todos los cortes)',
      sinonimos: ['cerdo', 'pulpa_cerdo', 'lomo_cerdo', 'filete_cerdo', 'chuleta_cerdo', 'costilla_cerdo', 'cerdo_molido', 'panceta']
    },
    pescado_blanco: {
      display: 'Pescado blanco (merluza, reineta, congrio, corvina)',
      sinonimos: ['merluza', 'reineta', 'congrio', 'corvina', 'dorado', 'pescado_blanco']
    },
    pescado_graso: {
      display: 'Pescado graso (salmón, atún)',
      sinonimos: ['salmon', 'atun', 'sardina', 'jurel', 'sierra', 'albacora']
    },
    mariscos: {
      display: 'Mariscos (mezcla)',
      sinonimos: ['camaron', 'choros', 'choro', 'almeja', 'calamar', 'pulpo', 'mariscos']
    }
  };

  // Devuelve el set de tokens a buscar para un token del usuario.
  // Si es clave de familia, retorna todos los sinónimos. Sino el token tal cual.
  function tokensExpandidos(userToken) {
    if (FAMILIAS[userToken]) return FAMILIAS[userToken].sinonimos;
    return [userToken];
  }

  function normalizarBusqueda(texto) {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z_\s]/g, '')
      .trim();
  }

  // Match por substring bidireccional con límite de palabra/guión bajo.
  // Esto permite "pollo" ↔ "pechuga_pollo" pero mantiene "carne_res" ≠ "carne_molida"
  // (son ingredientes distintos comercialmente). Para "ajo" ≠ "ajonjoli" usa el límite.
  function esMatch(userToken, recetaToken) {
    if (userToken === recetaToken) return true;
    if (userToken.length < 3 || recetaToken.length < 3) return false;
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

    // Pre-computar la expansión por familia de cada token de usuario,
    // así no se recalcula por cada receta/ingrediente.
    const expansionPorUsuario = new Map();
    setUsuario.forEach(u => expansionPorUsuario.set(u, tokensExpandidos(u)));

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
      const usadosDelUsuario = new Set(); // tokens originales del usuario que matchearon

      ingredientesRelevantes.forEach(ing => {
        let match = false;
        for (const u of setUsuario) {
          const sinonimos = expansionPorUsuario.get(u);
          for (const tk of sinonimos) {
            if (esMatch(tk, ing.nombre_normalizado)) {
              match = true;
              usadosDelUsuario.add(u); // contamos el token original, no el expandido
              break;
            }
          }
          if (match) break;
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

  // Autocomplete: sugerir ingredientes conocidos mientras escribe.
  // Inyecta entradas sintéticas de "familia" cuando la query coincide con la familia
  // o cualquiera de sus miembros (ej. "carne", "lomo", "asado" muestran "Carne de res (todos los cortes)").
  function sugerirIngredientes(query) {
    if (typeof RECETAS_DB === 'undefined') return [];
    const q = normalizarBusqueda(query);
    if (q.length < 2) return [];
    const qSubrayado = q.replace(/\s/g, '_');

    const todos = new Map(); // normalizado → display
    RECETAS_DB.forEach(r => {
      (r.ingredientes || []).forEach(ing => {
        if (ing.nombre_normalizado && !IGNORAR.has(ing.nombre_normalizado)) {
          todos.set(ing.nombre_normalizado, ing.nombre_display || ing.nombre);
        }
      });
    });

    const matches = [];

    // Entradas sintéticas de familia: aparecen primero si la query coincide con
    // el nombre de la familia, su display o cualquier sinónimo.
    const familiasAgregadas = new Set();
    Object.entries(FAMILIAS).forEach(([key, fam]) => {
      const displayNorm = normalizarBusqueda(fam.display);
      const hitSinonimo = fam.sinonimos.some(s => s.includes(qSubrayado));
      if (key.includes(qSubrayado) || displayNorm.includes(q) || hitSinonimo) {
        matches.push({ normalizado: key, display: fam.display, _familia: true });
        familiasAgregadas.add(key);
      }
    });

    // Entradas regulares del DB
    todos.forEach((display, normalizado) => {
      const displayNorm = normalizarBusqueda(display);
      if (displayNorm.includes(q) || normalizado.includes(qSubrayado)) {
        // Si ya hay una familia con este normalizado como clave, no duplicar
        if (familiasAgregadas.has(normalizado)) return;
        matches.push({ normalizado, display });
      }
    });

    // Ordenar: familias arriba, después por largo de display (más corto = más específico al match).
    return matches.sort((a, b) => {
      if (a._familia && !b._familia) return -1;
      if (!a._familia && b._familia) return 1;
      return a.display.length - b.display.length;
    }).slice(0, 12);
  }

  window.buscarRecetasPorIngredientes = buscarRecetasPorIngredientes;
  window.sugerirIngredientes = sugerirIngredientes;
  window.FAMILIAS_INGREDIENTES = FAMILIAS;

  console.log('[Búsqueda Inversa] Motor cargado · familias:', Object.keys(FAMILIAS).length);
})();
