/* ============================================
   NutriPlan - Modo Batch Cooking
   Analiza el plan semanal y sugiere cocción en lote
   ============================================ */

(function cargarBatchCooking() {

  // Agrupa ingredientes que se repiten y suma cantidades
  function analizarPlanSemana(planSemanaObj) {
    const agrupado = {};
    const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const TIPOS = ['almuerzo', 'cena'];

    DIAS.forEach(dia => {
      const comidasDia = planSemanaObj[dia] || {};
      TIPOS.forEach(tipo => {
        const comida = comidasDia[tipo];
        if (!comida || !Array.isArray(comida.ingredientes_escalados || comida.ingredientes)) return;
        const ings = comida.ingredientes_escalados || comida.ingredientes;
        const factor = comida.factor_escala || 1;

        ings.forEach(ing => {
          const key = ing.nombre_normalizado;
          if (!key) return;
          const cantidad = ing.cantidad_escalada != null ? ing.cantidad_escalada : ing.cantidad_base * factor;

          if (!agrupado[key]) {
            agrupado[key] = {
              nombre_normalizado: key,
              nombre_display: ing.nombre_display || ing.nombre,
              unidad: ing.unidad,
              cantidad_total: 0,
              apariciones: [],
              unidad_compra: ing.unidad_compra,
              factor_conversion: ing.factor_conversion,
              descripcion_compra: ing.descripcion_compra
            };
          }
          agrupado[key].cantidad_total += cantidad;
          agrupado[key].apariciones.push({ dia, tipo, cantidad, nombre_receta: comida.nombre });
        });
      });
    });

    return agrupado;
  }

  // Clasifica por tipo (proteína, carbohidrato, vegetal) para estrategia de batch
  const CATEGORIAS = {
    proteina: ['pechuga_pollo', 'muslos_pollo', 'pollo_entero', 'carne_molida', 'posta_rosada', 'lomo_vetado', 'cerdo_magro', 'cerdo', 'salmon', 'merluza', 'reineta', 'atun_lata', 'camarones', 'huevo', 'huevos', 'tofu', 'pavo'],
    legumbre: ['lentejas', 'lentejas_cocidas', 'lentejas_carbo', 'garbanzos', 'garbanzos_cocidos', 'porotos', 'porotos_negros'],
    carbohidrato: ['arroz', 'arroz_blanco', 'arroz_integral', 'quinoa', 'quinoa_cocida', 'fideos', 'fideos_integrales', 'fideos_arroz', 'papa', 'papas', 'camote', 'pan_integral', 'pan_pita', 'tortillas_maiz', 'tortilla_maiz', 'cuscus', 'polenta', 'harina_maiz'],
    vegetal: ['brocoli', 'coliflor', 'zapallo_italiano', 'espinaca', 'pimenton', 'pimenton_rojo', 'champinones', 'esparragos', 'berenjena', 'porotos_verdes', 'repollo', 'repollo_chino', 'choclo', 'kale', 'betarraga', 'zanahoria', 'zapallo', 'rucula']
  };

  function clasificar(nombre_normalizado) {
    for (const [categoria, lista] of Object.entries(CATEGORIAS)) {
      if (lista.includes(nombre_normalizado)) return categoria;
    }
    return 'otro';
  }

  // Genera plan de batch: identifica candidatos con ≥2 apariciones
  function generarPlanBatch(planSemanaObj, opciones) {
    opciones = opciones || {};
    const minApariciones = opciones.minApariciones || 2;
    
    const agrupado = analizarPlanSemana(planSemanaObj);
    const bases = [];

    Object.values(agrupado).forEach(ing => {
      if (ing.apariciones.length < minApariciones) return;
      const categoria = clasificar(ing.nombre_normalizado);
      if (categoria === 'otro') return; // solo sugerimos batch para proteína/carbo/legumbre/vegetal

      bases.push({
        ...ing,
        categoria,
        num_usos: ing.apariciones.length,
        tiempo_batch_min: estimarTiempoBatch(ing.nombre_normalizado, ing.cantidad_total),
        instrucciones_batch: generarInstruccionesBatch(ing.nombre_normalizado, ing.cantidad_total, categoria)
      });
    });

    // Ordenar por # usos desc, luego por categoría (proteínas primero por relevancia)
    const ordenCat = { proteina: 0, legumbre: 1, carbohidrato: 2, vegetal: 3, otro: 4 };
    bases.sort((a, b) => {
      if (b.num_usos !== a.num_usos) return b.num_usos - a.num_usos;
      return ordenCat[a.categoria] - ordenCat[b.categoria];
    });

    // Cálculos globales
    const tiempoTotalBatch = bases.reduce((s, b) => s + b.tiempo_batch_min, 0);
    const tiempoTotalSinBatch = contarTiempoSinBatch(planSemanaObj);
    const ahorroEstimado = Math.max(0, tiempoTotalSinBatch - tiempoTotalBatch - 60); // descuenta 60 min por cortar en lote

    return {
      bases,
      total_bases: bases.length,
      tiempo_batch_min: tiempoTotalBatch,
      tiempo_sin_batch_min: tiempoTotalSinBatch,
      ahorro_min: ahorroEstimado,
      ahorro_porcentaje: tiempoTotalSinBatch > 0 ? Math.round((ahorroEstimado / tiempoTotalSinBatch) * 100) : 0
    };
  }

  function contarTiempoSinBatch(planSemanaObj) {
    let total = 0;
    Object.values(planSemanaObj).forEach(comidasDia => {
      if (!comidasDia || typeof comidasDia !== 'object') return;
      Object.values(comidasDia).forEach(comida => {
        if (comida && typeof comida === 'object' && comida.tiempo_total_min) {
          total += comida.tiempo_total_min;
        }
      });
    });
    return total;
  }

  function estimarTiempoBatch(id, cantidadTotal) {
    // Cocinar N porciones junto toma ~1.3x el tiempo de 1 porción (no Nx)
    const cat = clasificar(id);
    const tiemposBase = {
      proteina: 30,
      legumbre: 40, // remojo no cuenta, solo cocción
      carbohidrato: 20,
      vegetal: 15
    };
    return tiemposBase[cat] || 20;
  }

  function generarInstruccionesBatch(id, cantidadTotal, categoria) {
    const instr = [];
    if (categoria === 'proteina') {
      if (id === 'pechuga_pollo') {
        instr.push(
          `Cocinar ${Math.round(cantidadTotal)}g de pechuga de pollo en 2 tandas grandes.`,
          `Sazonar con sal, pimienta y 10 g de ajo picado. Marinar 15 min.`,
          `Sellar a la plancha 4 min por lado en sartén amplia caliente con 10 ml de aceite.`,
          `Terminar al horno 10 min a 180°C hasta llegar a 74°C internos.`,
          `Enfriar 10 min, cortar en cubos o tiras según las recetas de la semana.`,
          `Guardar en contenedor hermético en refrigerador hasta 4 días. Congelar porciones sin usar al día 3.`
        );
      } else if (id === 'muslos_pollo') {
        instr.push(
          `Cocinar ${Math.round(cantidadTotal)}g de muslos en 2 tandas.`,
          `Dorar con piel en sartén 5 min por lado a fuego alto.`,
          `Transferir a bandeja y asar al horno 25 min a 190°C.`,
          `Deshuesar y desmenuzar mientras entibia.`,
          `Refrigerar en contenedor 4 días máx.`
        );
      } else if (id === 'carne_molida') {
        instr.push(
          `Sofreír ${Math.round(cantidadTotal)}g de carne molida en olla amplia 8 min hasta dorar.`,
          `Añadir 1 cebolla y 2 dientes de ajo picados. Cocinar 6 min.`,
          `Sazonar base: sal, comino, paprika. No añadir salsas específicas aún (se personalizan por receta).`,
          `Dividir en 3-4 porciones: cada una se termina el día de uso con salsa distinta (boloñesa, pastel de papa, tacos).`,
          `Refrigerar 3 días máx o congelar hasta 2 meses.`
        );
      } else if (['salmon', 'merluza', 'reineta'].includes(id)) {
        instr.push(
          `El pescado se deteriora rápido: cocinar máximo para 2 días.`,
          `Marinar con aceite, limón y ajo 30 min.`,
          `Al horno 12-15 min a 180°C en papel vegetal.`,
          `Usar dentro de 48 horas. No congelar si ya fue descongelado.`
        );
      } else {
        instr.push(
          `Cocinar ${Math.round(cantidadTotal)}g de ${id.replace(/_/g, ' ')} en una sola tanda.`,
          `Sazonar de manera neutra para adaptar a recetas de la semana.`,
          `Enfriar rápidamente y refrigerar en contenedores individuales.`
        );
      }
    } else if (categoria === 'legumbre') {
      instr.push(
        `Remojar ${Math.round(cantidadTotal * 0.4)}g de legumbres secas 8 horas (o noche anterior).`,
        `Escurrir, enjuagar y cocinar en olla con 4 veces el agua, 1 hoja de laurel y sin sal, 35-45 min hasta blandas.`,
        `Sazonar al final con sal para evitar endurecimiento.`,
        `Dividir en 3 porciones: refrigerar 4 días o congelar hasta 3 meses.`,
        `Reservar el caldo de cocción: base perfecta para sopas o guisos.`
      );
    } else if (categoria === 'carbohidrato') {
      if (id.includes('arroz')) {
        instr.push(
          `Cocinar ${Math.round(cantidadTotal)}g de ${id.replace(/_/g, ' ')} en 1 tanda grande.`,
          `Lavar bajo agua fría hasta que salga clara.`,
          `Hervir con 2x agua, sal y 1 hoja de laurel, según tipo (blanco 15 min, integral 35 min).`,
          `Extender en bandeja 10 min para enfriar rápido y evitar que se apelmace.`,
          `Refrigerar en porciones de 150g. Recalentar con unas gotas de agua 1 min.`
        );
      } else if (id.includes('quinoa')) {
        instr.push(
          `Lavar bien ${Math.round(cantidadTotal)}g de quinoa hasta que el agua salga limpia (elimina saponinas amargas).`,
          `Cocinar en 2x agua 15 min. Reposar tapado 5 min, esponjar con tenedor.`,
          `Enfriar en bandeja y refrigerar en contenedor hasta 5 días.`
        );
      } else if (id.includes('papa') || id === 'camote') {
        instr.push(
          `Lavar y cortar ${Math.round(cantidadTotal)}g en cubos de 2 cm.`,
          `Hervir 10-12 min o asar al horno 25 min a 200°C con aceite y sal.`,
          `Enfriar 20 min antes de refrigerar. Durabilidad 3 días.`,
          `Para recalentar: al horno 8 min a 180°C recuperan textura crujiente.`
        );
      } else {
        instr.push(
          `Cocinar ${Math.round(cantidadTotal)}${id.includes('pan') || id.includes('tortilla') ? ' unidades' : 'g'} de ${id.replace(/_/g, ' ')}.`,
          `Enfriar completamente antes de almacenar.`,
          `Refrigerar en contenedor hermético 3-5 días.`
        );
      }
    } else if (categoria === 'vegetal') {
      instr.push(
        `Lavar y cortar ${Math.round(cantidadTotal)}g de ${id.replace(/_/g, ' ')} en tamaño uniforme.`,
        `Asar al horno a 200°C por 15-20 min con 10 ml de aceite, sal y pimienta (caramelización realza sabor).`,
        `Alternativamente: escaldar 3 min y enfriar en agua con hielo para conservar color y textura.`,
        `Refrigerar en contenedor 4 días máx. Recalentar 3 min en sartén o 1 min al microondas.`
      );
    }

    return instr;
  }

  window.batchCooking = {
    analizar: analizarPlanSemana,
    generarPlan: generarPlanBatch,
    regenerarInstrucciones: generarInstruccionesBatch
  };

  console.log('[Batch Cooking] Motor cargado');
})();
