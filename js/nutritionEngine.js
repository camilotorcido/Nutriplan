/* ============================================
   NutriPlan - Motor de Cálculos Nutricionales
   Incluye: TDEE (Mifflin-St Jeor), escalado de 
   recetas, distribución de macros, generación 
   de plan semanal, historial 14 días, swap
   individual, consolidación con unidades de compra.
   ============================================ */

// ─── Factores de actividad para cálculo de TDEE ───
const FACTORES_ACTIVIDAD = {
  sedentario: { valor: 1.2, label: "Sedentario (poco o nada de ejercicio)" },
  ligera: { valor: 1.375, label: "Actividad ligera (1-3 días/semana)" },
  moderada: { valor: 1.55, label: "Actividad moderada (3-5 días/semana)" },
  muy_activo: { valor: 1.725, label: "Muy activo (6-7 días/semana)" },
  extremo: { valor: 1.9, label: "Extremadamente activo (atleta/trabajo físico)" }
};

// ─── Ajustes calóricos según objetivo ───
const AJUSTES_OBJETIVO = {
  perdida: { valor: -500, label: "Pérdida de peso" },
  mantenimiento: { valor: 0, label: "Mantenimiento" },
  volumen: { valor: 500, label: "Volumen / Ganancia muscular" }
};

// ─── Macros predeterminados (editables) por objetivo ───
const MACROS_PREDETERMINADOS = {
  perdida: { proteinas: 35, carbohidratos: 35, grasas: 30 },
  mantenimiento: { proteinas: 25, carbohidratos: 45, grasas: 30 },
  volumen: { proteinas: 25, carbohidratos: 50, grasas: 25 }
};

// ─── Distribución calórica por comida del día ───
const DISTRIBUCION_COMIDAS = {
  desayuno: 0.25,   // 25%
  snack_am: 0.10,   // 10%
  almuerzo: 0.35,   // 35%
  snack_pm: 0.10,   // 10%
  cena: 0.20         // 20%
};

const NOMBRES_COMIDAS = {
  desayuno: "Desayuno",
  snack_am: "Snack AM",
  almuerzo: "Almuerzo",
  snack_pm: "Snack PM",
  cena: "Cena"
};

const DIAS_SEMANA = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

// ─── Obtener el día de la semana actual en español ───
function obtenerDiaActual() {
  const diasJS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return diasJS[new Date().getDay()];
}

// ─── Cálculo BMR con ecuación Mifflin-St Jeor ───
function calcularBMR(peso, altura, edad, genero) {
  const base = (10 * peso) + (6.25 * altura) - (5 * edad);
  return genero === "masculino" ? base + 5 : base - 161;
}

// ─── Cálculo TDEE = BMR × Factor de Actividad ───
function calcularTDEE(peso, altura, edad, genero, nivelActividad) {
  const bmr = calcularBMR(peso, altura, edad, genero);
  const factor = FACTORES_ACTIVIDAD[nivelActividad].valor;
  return Math.round(bmr * factor);
}

// ─── Calorías objetivo = TDEE + ajuste por objetivo ───
function calcularCaloriasObjetivo(tdee, objetivo) {
  const ajuste = AJUSTES_OBJETIVO[objetivo].valor;
  return Math.max(1200, Math.round(tdee + ajuste));
}

// ─── Cálculo de gramos de macros basado en calorías y porcentajes ───
function calcularMacrosEnGramos(calorias, macrosPorcentaje) {
  return {
    proteinas_g: Math.round((calorias * macrosPorcentaje.proteinas / 100) / 4),
    carbohidratos_g: Math.round((calorias * macrosPorcentaje.carbohidratos / 100) / 4),
    grasas_g: Math.round((calorias * macrosPorcentaje.grasas / 100) / 9)
  };
}

// ─── Filtrar recetas según restricciones y exclusiones ───
function filtrarRecetas(recetas, perfil) {
  return recetas.filter(receta => {
    if (perfil.sinGluten && !receta.es_sin_gluten) return false;
    if (perfil.sinLactosa && !receta.es_sin_lactosa) return false;
    if (perfil.vegetariano && !receta.es_vegetariana) return false;

    // Fase 4: filtro "solo rápidas" (≤ X min totales). Desayunos y snacks normalmente son rápidos,
    // solo filtra almuerzo/cena para no quedarse sin opciones.
    if (perfil.soloRapidas && (receta.tipo_comida === 'almuerzo' || receta.tipo_comida === 'cena')) {
      const maxMin = perfil.maxTiempoMin || 25;
      const tiempoTotal = receta.tiempo_total_min || ((receta.tiempo_prep_min || 0) + (receta.tiempo_coccion_min || 0));
      if (tiempoTotal > 0 && tiempoTotal > maxMin) return false;
    }

    if (perfil.ingredientesExcluidos && perfil.ingredientesExcluidos.length > 0) {
      const excluidos = perfil.ingredientesExcluidos.map(e => e.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
      const tieneExcluido = receta.ingredientes.some(ing => {
        // Revisar en nombre, nombre_normalizado, y nombre_display
        const textos = [
          (ing.nombre || '').toLowerCase(),
          (ing.nombre_normalizado || '').toLowerCase().replace(/_/g, ' '),
          (ing.nombre_display || '').toLowerCase()
        ].map(t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        return excluidos.some(exc => textos.some(t => t.includes(exc)));
      });
      if (tieneExcluido) return false;
    }
    // También verificar el nombre de la receta (ej: "Cerdo al horno")
    if (perfil.ingredientesExcluidos && perfil.ingredientesExcluidos.length > 0) {
      const excluidos = perfil.ingredientesExcluidos.map(e => e.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
      const nombreReceta = receta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (excluidos.some(exc => nombreReceta.includes(exc))) return false;
    }

    return true;
  });
}

// ─── Obtener recetas filtradas por tipo de comida ───
function obtenerRecetasPorTipo(recetas, tipoComida) {
  return recetas.filter(r => r.tipo_comida === tipoComida);
}

// ─── FÓRMULA DE ESCALADO (CRÍTICO) ───
function escalarReceta(receta, caloriasObjetivoComida) {
  const factorEscala = caloriasObjetivoComida / receta.calorias_base;

  const recetaEscalada = {
    ...receta,
    calorias_escaladas: Math.round(caloriasObjetivoComida),
    proteinas_escaladas: Math.round(receta.proteinas_g * factorEscala * 10) / 10,
    carbohidratos_escalados: Math.round(receta.carbohidratos_g * factorEscala * 10) / 10,
    grasas_escaladas: Math.round(receta.grasas_g * factorEscala * 10) / 10,
    factor_escala: Math.round(factorEscala * 100) / 100,
    ingredientes_escalados: receta.ingredientes.map(ing => ({
      ...ing,
      cantidad_escalada: Math.round(ing.cantidad_base * factorEscala * 100) / 100
    }))
  };

  return recetaEscalada;
}

// ─── Selección aleatoria sin repetición ───
function seleccionarAleatorio(array, cantidad) {
  const copia = [...array];
  const resultado = [];
  const max = Math.min(cantidad, copia.length);
  
  for (let i = 0; i < max; i++) {
    const idx = Math.floor(Math.random() * copia.length);
    resultado.push(copia[idx]);
    copia.splice(idx, 1);
  }
  
  return resultado;
}

// ─── Fase 4 - Punto 16: aplicar modo sobras a una semana ya generada ───
function _aplicarModoSobras(planSemana, caloriasObjetivo) {
  const kcalAlmuerzo = Math.round(caloriasObjetivo * DISTRIBUCION_COMIDAS.almuerzo);
  for (let i = 1; i < DIAS_SEMANA.length; i++) {
    const diaAnterior = DIAS_SEMANA[i - 1];
    const diaActual = DIAS_SEMANA[i];
    const cenaAnterior = planSemana[diaAnterior] && planSemana[diaAnterior].cena;
    if (!cenaAnterior) continue;
    const sobra = escalarReceta(cenaAnterior, kcalAlmuerzo);
    sobra.es_sobra = true;
    sobra.sobra_origen = { dia: diaAnterior, tipo: 'cena' };
    sobra.nombre = 'Sobras: ' + (sobra.nombre || '').replace(/^Sobras: /, '');
    // Marcar cena origen también
    if (!cenaAnterior._sobra_hija_de_ayer) {
      cenaAnterior.genera_sobra = true;
      cenaAnterior.sobra_destino = { dia: diaActual, tipo: 'almuerzo' };
    }
    planSemana[diaActual].almuerzo = sobra;
  }
  return planSemana;
}

// ─── MEJORA 4: Generar plan semanal con historial de 14 días ───
function generarPlanSemanal(perfil, caloriasObjetivo) {
  const numSemanas = Math.min(4, Math.max(1, perfil.numSemanas || 1));
  
  // 1. Filtrar recetas según restricciones del perfil
  const recetasFiltradas = filtrarRecetas(RECETAS_DB, perfil);

  // 2. Obtener recetas usadas en los últimos 14 días
  const recetasUsadas14 = obtenerRecetasUsadas14Dias();

  // 3. Separar por tipo de comida
  const porTipo = {
    desayuno: obtenerRecetasPorTipo(recetasFiltradas, "desayuno"),
    snack_am: obtenerRecetasPorTipo(recetasFiltradas, "snack_am"),
    almuerzo: obtenerRecetasPorTipo(recetasFiltradas, "almuerzo"),
    snack_pm: obtenerRecetasPorTipo(recetasFiltradas, "snack_pm"),
    cena: obtenerRecetasPorTipo(recetasFiltradas, "cena")
  };

  // 4. Mensaje de advertencia si pocas recetas disponibles
  let advertenciaRecetas = null;
  const recetasUsadasGlobal = new Set(); // Para evitar repeticiones entre semanas

  // 5. Generar plan para N semanas
  const planMulti = { _numSemanas: numSemanas };

  for (let s = 1; s <= numSemanas; s++) {
    const planSemana = {};
    
    DIAS_SEMANA.forEach(dia => {
      planSemana[dia] = {};
      
      Object.keys(DISTRIBUCION_COMIDAS).forEach(tipoComida => {
        const caloriasComida = Math.round(caloriasObjetivo * DISTRIBUCION_COMIDAS[tipoComida]);
        const recetasDisponibles = porTipo[tipoComida];
        
        if (recetasDisponibles.length > 0) {
          // Preferir recetas no usadas en 14 días ni en todo el plan multi-semana
          let candidatas = recetasDisponibles.filter(r => 
            !recetasUsadas14.has(r.id) && !recetasUsadasGlobal.has(r.id)
          );
          
          // Relajar: solo excluir las del plan global
          if (candidatas.length === 0) {
            candidatas = recetasDisponibles.filter(r => !recetasUsadasGlobal.has(r.id));
          }
          
          // Si aún no hay, usar cualquiera
          if (candidatas.length === 0) {
            candidatas = recetasDisponibles;
            if (!advertenciaRecetas) {
              advertenciaRecetas = `Pocas recetas de "${NOMBRES_COMIDAS[tipoComida]}" disponibles. Se reutilizaron algunas.`;
            }
          }
          
          const idx = Math.floor(Math.random() * candidatas.length);
          const recetaSeleccionada = candidatas[idx];
          recetasUsadasGlobal.add(recetaSeleccionada.id);
          
          planSemana[dia][tipoComida] = escalarReceta(recetaSeleccionada, caloriasComida);
        } else {
          planSemana[dia][tipoComida] = null;
        }
      });
    });

    // Fase 4 - Punto 16: modo sobras (cena día N → almuerzo día N+1)
    if (perfil.modoSobras) _aplicarModoSobras(planSemana, caloriasObjetivo);

    planMulti['semana_' + s] = planSemana;
  }

  // 6. Guardar historial (usa semana 1 para compatibilidad)
  agregarAlHistorial(planMulti.semana_1);

  // 7. Metadata
  planMulti._advertencia = advertenciaRecetas;

  return planMulti;
}

// Helper: normalizar plan viejo (sin _numSemanas) al formato multi-semana
function _normalizarPlanMulti(plan) {
  if (!plan) return plan;
  if (plan._numSemanas) return plan; // Ya es formato multi
  // Plan viejo: las keys son días directamente
  const planMulti = { _numSemanas: 1, semana_1: {} };
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  DIAS.forEach(dia => {
    if (plan[dia]) planMulti.semana_1[dia] = plan[dia];
  });
  if (plan._advertencia) planMulti._advertencia = plan._advertencia;
  if (plan._buscoOnline) planMulti._buscoOnline = plan._buscoOnline;
  if (plan._recetasOnlineUsadas) planMulti._recetasOnlineUsadas = plan._recetasOnlineUsadas;
  return planMulti;
}

// Helper: obtener semana específica del plan multi
function _obtenerSemana(planMulti, numSemana) {
  if (!planMulti) return {};
  const p = _normalizarPlanMulti(planMulti);
  return p['semana_' + numSemana] || {};
}

// ─── MEJORA 3: Cambiar una receta individual (multi-semana compatible) ───
function cambiarRecetaIndividual(planMulti, dia, tipoComida, perfil, caloriasObjetivo, numSemana) {
  numSemana = numSemana || 1;
  const plan = _normalizarPlanMulti(planMulti);
  const semanaKey = 'semana_' + numSemana;
  const semanaActual = plan[semanaKey];
  if (!semanaActual) return plan;

  const recetasFiltradas = filtrarRecetas(RECETAS_DB, perfil);
  const recetasDelTipo = obtenerRecetasPorTipo(recetasFiltradas, tipoComida);
  
  if (recetasDelTipo.length === 0) return plan;
  
  // Recopilar IDs de recetas ya en uso en TODAS las semanas
  const idsEnUso = new Set();
  for (let s = 1; s <= (plan._numSemanas || 1); s++) {
    const sem = plan['semana_' + s];
    if (!sem) continue;
    Object.values(sem).forEach(comidasDia => {
      if (typeof comidasDia !== 'object' || comidasDia === null) return;
      Object.values(comidasDia).forEach(comida => {
        if (comida && comida.id) idsEnUso.add(comida.id);
      });
    });
  }
  
  const recetasUsadas14 = obtenerRecetasUsadas14Dias();
  
  let candidatas = recetasDelTipo.filter(r => !idsEnUso.has(r.id) && !recetasUsadas14.has(r.id));
  if (candidatas.length === 0) {
    candidatas = recetasDelTipo.filter(r => !idsEnUso.has(r.id));
  }
  if (candidatas.length === 0) {
    const recetaActual = semanaActual[dia]?.[tipoComida];
    candidatas = recetasDelTipo.filter(r => !recetaActual || r.id !== recetaActual.id);
  }
  
  if (candidatas.length === 0) return plan;
  
  const caloriasComida = Math.round(caloriasObjetivo * DISTRIBUCION_COMIDAS[tipoComida]);
  const idx = Math.floor(Math.random() * candidatas.length);
  const nuevaReceta = escalarReceta(candidatas[idx], caloriasComida);
  
  // Actualizar plan multi-semana
  const nuevoPlan = { ...plan };
  nuevoPlan[semanaKey] = { ...semanaActual, [dia]: { ...semanaActual[dia], [tipoComida]: nuevaReceta } };
  
  const historial = cargarHistorialRecetas();
  const hoy = new Date().toISOString().split('T')[0];
  const yaExiste = historial.some(h => h.fecha === hoy && h.receta_id === nuevaReceta.id);
  if (!yaExiste) {
    historial.push({ fecha: hoy, receta_id: nuevaReceta.id });
    guardarHistorialRecetas(historial);
  }
  
  return nuevoPlan;
}

// ─── Calcular resumen diario de macros + tiempo + costo ───
function calcularResumenDiario(comidasDia) {
  let totalCalorias = 0, totalProteinas = 0, totalCarbohidratos = 0, totalGrasas = 0;
  let totalPrep = 0, totalCoccion = 0, totalCostoCLP = 0;

  Object.entries(comidasDia).forEach(([key, comida]) => {
    if (key.startsWith('_')) return;
    if (comida) {
      totalCalorias += comida.calorias_escaladas || 0;
      totalProteinas += comida.proteinas_escaladas || 0;
      totalCarbohidratos += comida.carbohidratos_escalados || 0;
      totalGrasas += comida.grasas_escaladas || 0;
      totalPrep += comida.tiempo_prep_min || 0;
      totalCoccion += comida.tiempo_coccion_min || 0;
      const factor = comida.factor_escala || 1;
      totalCostoCLP += (comida.costo_clp || 0) * factor;
    }
  });

  return {
    calorias: Math.round(totalCalorias),
    proteinas: Math.round(totalProteinas * 10) / 10,
    carbohidratos: Math.round(totalCarbohidratos * 10) / 10,
    grasas: Math.round(totalGrasas * 10) / 10,
    tiempo_prep_min: Math.round(totalPrep),
    tiempo_coccion_min: Math.round(totalCoccion),
    tiempo_total_min: Math.round(totalPrep + totalCoccion),
    costo_clp: Math.round(totalCostoCLP)
  };
}

// ─── Mapa de lookup: nombre de ingrediente → datos canónicos ───
// Se construye una sola vez desde RECETAS_DB para resolver cualquier
// variante de nombre ("huevos", "huevo", "plátano congelado") a su
// nombre_normalizado canónico y datos de compra.
let _INGREDIENTE_LOOKUP = {};
function _reconstruirLookupIngredientes() {
  const mapa = {};
  if (typeof RECETAS_DB !== 'undefined') {
    RECETAS_DB.forEach(receta => {
      receta.ingredientes.forEach(ing => {
        const key = ing.nombre.toLowerCase().trim();
        if (!mapa[key]) {
          mapa[key] = {
            nombre_normalizado: ing.nombre_normalizado,
            nombre_display: ing.nombre_display,
            unidad_compra: ing.unidad_compra,
            factor_conversion: ing.factor_conversion,
            descripcion_compra: ing.descripcion_compra
          };
        }
      });
    });
  }
  _INGREDIENTE_LOOKUP = mapa;
  return mapa;
}
_reconstruirLookupIngredientes();
// Fase 6.2: exponer para que el lazy-loader pueda regenerar el lookup
if (typeof window !== 'undefined') {
  window.reconstruirLookupIngredientes = _reconstruirLookupIngredientes;
}

// ─── Mapa de consolidación: variantes → clave canónica ───
// Resuelve duplicados como "diente de ajo"→"ajo", "nueces"→"nuez", "crema doble"→"crema"
const _CONSOLIDAR_NOMBRE = {
  // Ajo (todas las presentaciones → ajo)
  'diente_de_ajo': 'ajo', 'diente_ajo': 'ajo', 'ajo_picado': 'ajo', 'ajo_minced': 'ajo',
  // Frutos secos (plurales → singular)
  'nueces': 'nuez', 'almendras': 'almendra', 'pasas': 'pasa', 'datiles': 'datil',
  // Crema (todas las variantes → crema)
  'crema_doble': 'crema', 'crema_ligera': 'crema', 'crema_fresca': 'crema',
  // Porotos verdes (chileno) — ejotes/judías verdes
  'ejotes': 'poroto_verde', 'ejote': 'poroto_verde',
  'judias_verdes': 'poroto_verde', 'judia_verde': 'poroto_verde',
  'porotos_verdes': 'poroto_verde', 'green_bean': 'poroto_verde',
  // Legumbres (frijol→poroto en Chile)
  'frijoles_negros': 'poroto_negro', 'porotos_negros': 'poroto_negro', 'frijol_negro': 'poroto_negro', 'frijol': 'poroto_negro',
  'frijoles_rojos': 'poroto_rojo', 'porotos_rojos': 'poroto_rojo', 'frijol_rojo': 'poroto_rojo',
  'lentejas_rojas': 'lenteja_roja', 'lentejas': 'lenteja',
  'garbanzos': 'garbanzo', 'garbanzos_cocidos': 'garbanzo',
  // Verduras (plurales y variantes)
  'esparragos': 'esparrago', 'esparrago': 'esparrago',
  'champinones': 'champiñon', 'champiñones': 'champiñon', 'champignon': 'champiñon', 'champiñones': 'champiñon', 'champin': 'champiñon',
  'cebollines': 'cebollin', 'cebolleta': 'cebollin',
  'pimientos': 'pimenton', 'pimenton': 'pimenton', 'pimiento': 'pimenton',
  'zanahorias': 'zanahoria', 'papas': 'papa', 'camotes': 'camote',
  'pepinos': 'pepino', 'berenjenas': 'berenjena', 'calabacines': 'calabacin',
  // Frutas (fresa→frutilla en Chile)
  'fresas': 'frutilla', 'fresa': 'frutilla', 'frutillas': 'frutilla',
  'arandanos': 'arandano', 'uvas': 'uva',
  'tomates_cherry': 'tomate_cherry',
  'pina': 'piña', 'platanos': 'platano', 'naranjas': 'naranja', 'limones': 'limon',
  // Proteínas (plurales)
  'camarones': 'camaron', 'huevos': 'huevo',
  // Pasta / granos
  'fideos': 'fideo',
  // Semillas
  'semillas_calabaza': 'semilla_calabaza', 'semillas_girasol': 'semilla_girasol',
  'semillas_chia': 'chia',
  // Aceitunas (variantes)
  'aceitunas_negras': 'aceituna', 'aceitunas_verdes': 'aceituna', 'aceitunas': 'aceituna',
  // Quesos (variantes → clave genérica si idéntico uso)
  'queso_laminas': 'queso_laminado',
  // Caldos (variantes de nombre)
  'caldo_de_carne': 'caldo_carne', 'caldo_de_pollo': 'caldo_pollo', 'caldo_de_verduras': 'caldo_verduras',
  'caldo_de_pescado': 'caldo_pescado',
  // Pure/pasta de tomate → salsa_tomate
  'pure_de_tomate': 'salsa_tomate', 'pasta_de_tomate': 'salsa_tomate', 'pure_tomate': 'salsa_tomate',
  // Ingredientes exóticos → equivalentes chilenos
  'yam': 'camote', 'white_yam': 'camote', 'cassava': 'yuca', 'plantain': 'platano',
  // Hierbas/condimentos que vienen en inglés de la API
  'cabbage': 'repollo', 'parsley': 'perejil', 'cilantro_fresh': 'cilantro', 'basil': 'albahaca',
  'mint': 'menta'
};

// ─── Nombres de display preferidos por clave normalizada ───
// Cuando se consolida, el primer nombre que se encuentra puede ser genérico;
// esta tabla asegura que se muestre el nombre más descriptivo y en español chileno.
const _DISPLAY_PREFERIDO = {
  'ajo': 'Ajo', 'cebolla': 'Cebolla', 'cebollin': 'Cebollín', 'tomate': 'Tomate',
  'poroto_verde': 'Porotos verdes', 'esparrago': 'Espárragos', 'champiñon': 'Champiñones',
  'aceituna': 'Aceitunas', 'repollo': 'Repollo', 'zanahoria': 'Zanahoria',
  'papa': 'Papa', 'camote': 'Camote', 'pepino': 'Pepino', 'berenjena': 'Berenjena',
  'calabacin': 'Calabacín', 'pimenton': 'Pimentón', 'brocoli': 'Brócoli',
  'coliflor': 'Coliflor', 'espinaca': 'Espinaca', 'albahaca': 'Albahaca',
  'cilantro': 'Cilantro', 'perejil': 'Perejil', 'romero': 'Romero', 'tomillo': 'Tomillo',
  'eneldo': 'Eneldo', 'oregano': 'Orégano', 'comino': 'Comino',
  'nuez': 'Nueces', 'almendra': 'Almendras', 'mani': 'Maní', 'pasa': 'Pasas',
  'frutilla': 'Frutillas', 'arandano': 'Arándanos', 'uva': 'Uvas', 'piña': 'Piña',
  'platano': 'Plátano', 'mango': 'Mango', 'naranja': 'Naranja', 'limon': 'Limón',
  'poroto_negro': 'Porotos negros', 'poroto_rojo': 'Porotos rojos',
  'garbanzo': 'Garbanzos', 'lenteja': 'Lentejas', 'lenteja_roja': 'Lentejas rojas',
  'camaron': 'Camarones', 'huevo': 'Huevos', 'fideo': 'Fideos',
  'crema': 'Crema', 'queso_laminado': 'Queso laminado',
  'semilla_calabaza': 'Semillas de calabaza', 'semilla_girasol': 'Semillas de girasol',
  'chia': 'Semillas de chía', 'datil': 'Dátiles',
  'merluza': 'Merluza', 'salmon': 'Salmón', 'atun': 'Atún',
  'salsa_tomate': 'Salsa de tomate', 'caldo_carne': 'Caldo de carne',
  'caldo_pollo': 'Caldo de pollo', 'caldo_verduras': 'Caldo de verduras',
  'menta': 'Menta', 'mozzarella': 'Queso Mozzarella', 'gruyere': 'Queso Gruyère',
  'chorizo': 'Chorizo', 'tocino': 'Tocino', 'salchicha': 'Salchichas',
  'hummus': 'Hummus', 'quesillo': 'Quesillo'
};

// Resuelve un ingrediente (posiblemente de un plan guardado viejo)
// a su nombre_normalizado canónico usando el lookup de RECETAS_DB
function _resolverIngrediente(ing) {
  // 1. Si ya tiene nombre_normalizado, consolidar variantes
  if (ing.nombre_normalizado) {
    const claveConsolidada = _CONSOLIDAR_NOMBRE[ing.nombre_normalizado] || ing.nombre_normalizado;
    return {
      clave: claveConsolidada,
      display: _DISPLAY_PREFERIDO[claveConsolidada] || ing.nombre_display || ing.nombre,
      unidad_compra: ing.unidad_compra || ing.unidad,
      factor_conversion: ing.factor_conversion || 1,
      descripcion_compra: ing.descripcion_compra || ""
    };
  }
  
  // 2. Buscar por nombre exacto en el mapa
  const nombreLower = (ing.nombre || "").toLowerCase().trim();
  const found = _INGREDIENTE_LOOKUP[nombreLower];
  if (found) {
    const claveF = _CONSOLIDAR_NOMBRE[found.nombre_normalizado] || found.nombre_normalizado;
    return {
      clave: claveF,
      display: _DISPLAY_PREFERIDO[claveF] || found.nombre_display,
      unidad_compra: found.unidad_compra || ing.unidad,
      factor_conversion: found.factor_conversion || 1,
      descripcion_compra: found.descripcion_compra || ""
    };
  }
  
  // 3. Buscar mejor coincidencia parcial: el nombre del ingrediente
  //    podría ser una variante (e.g. "plátano congelado" → "plátano")
  //    Usamos el match más largo para evitar falsos positivos como "sal" → "salsa"
  let mejorMatch = null;
  let mejorLargo = 0;
  for (const [key, data] of Object.entries(_INGREDIENTE_LOOKUP)) {
    // Solo considerar matches con al menos 4 caracteres para evitar "sal"→"salsa"
    if (key.length < 4 && nombreLower.length < 4) continue;
    
    // El nombre buscado contiene al key completo (ej: "plátano congelado" contiene "plátano")
    if (nombreLower.includes(key) && key.length > mejorLargo) {
      mejorMatch = data;
      mejorLargo = key.length;
    }
    // El key contiene al nombre buscado (ej: "huevos" contiene "huevo")
    if (key.includes(nombreLower) && nombreLower.length > 3 && nombreLower.length > mejorLargo) {
      mejorMatch = data;
      mejorLargo = nombreLower.length;
    }
  }
  if (mejorMatch) {
    const claveM = _CONSOLIDAR_NOMBRE[mejorMatch.nombre_normalizado] || mejorMatch.nombre_normalizado;
    return {
      clave: claveM,
      display: _DISPLAY_PREFERIDO[claveM] || mejorMatch.nombre_display,
      unidad_compra: mejorMatch.unidad_compra || ing.unidad,
      factor_conversion: mejorMatch.factor_conversion || 1,
      descripcion_compra: mejorMatch.descripcion_compra || ""
    };
  }
  
  // 4. Último recurso: normalizar manualmente (misma lógica que _normalizarIngrediente en recipeAPI)
  let normalizado = nombreLower
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/\s+(en\s+)?(polvo|fresco|fresca|seco|seca|cocido|cocida|congelado|congelada|maduro|madura|natural|integral|grande|pequeño|mediano|tostado|tostada|deshidratado|deshidratada|precocida|baby|molido|molida|laminado|laminada|picado|picada|rallado|rallada|fino|fina|grueso|gruesa|entero|entera|enlatado|enlatada|cherry|rojo|roja|verde|negro|negra|blanco|blanca|amarillo|amarilla|morado|morada)/gi, ''); // quitar modificadores
  // Despluralizar
  normalizado = normalizado.trim();
  if (normalizado.endsWith('ces') && normalizado.length > 4) {
    normalizado = normalizado.slice(0, -3) + 'z'; // nueces → nuez
  } else if (normalizado.endsWith('es') && normalizado.length > 4) {
    normalizado = normalizado.slice(0, -2); // tomates → tomat
    if (normalizado.length < 3) normalizado = nombreLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/s$/, '');
  } else if (normalizado.endsWith('s') && normalizado.length > 3) {
    normalizado = normalizado.slice(0, -1); // huevos → huevo
  }
  normalizado = normalizado.trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  
  // Aplicar consolidación incluso en fallback
  const claveFinal = _CONSOLIDAR_NOMBRE[normalizado] || normalizado;
  
  return {
    clave: claveFinal,
    display: _DISPLAY_PREFERIDO[claveFinal] || ing.nombre,
    unidad_compra: ing.unidad,
    factor_conversion: 1,
    descripcion_compra: ""
  };
}

// ─── MEJORA 1: Consolidar ingredientes con unidades de compra ───
// Usa resolución robusta para agrupar variantes del mismo ingrediente
function consolidarIngredientes(planInput) {
  const consolidado = {};
  
  // Soportar formato multi-semana y formato legacy
  const plan = _normalizarPlanMulti(planInput);
  const numSemanas = plan._numSemanas || 1;
  
  for (let s = 1; s <= numSemanas; s++) {
    const semana = plan['semana_' + s];
    if (!semana) continue;
    
    Object.entries(semana).forEach(([dia, comidasDia]) => {
      if (dia.startsWith('_')) return;
      Object.values(comidasDia).forEach(comida => {
        // Fase 4 - Punto 16: las sobras ya se cuentan en la cena origen
        if (comida && comida.es_sobra) return;
        if (comida && comida.ingredientes_escalados) {
          // Si la cena genera sobra, duplicar sus ingredientes (2 porciones cocinadas, 1 comida)
          const multiplicador = comida.genera_sobra ? 2 : 1;
          comida.ingredientes_escalados.forEach(ing => {
            const _origCantidad = ing.cantidad_escalada;
            ing = Object.assign({}, ing, { cantidad_escalada: _origCantidad * multiplicador });
            const resuelto = _resolverIngrediente(ing);
            const clave = resuelto.clave;
            
            if (consolidado[clave]) {
              consolidado[clave].cantidad_total_interna += ing.cantidad_escalada;
            } else {
              consolidado[clave] = {
                nombre_normalizado: clave,
                nombre_display: resuelto.display,
                nombre: resuelto.display,
                unidad_interna: ing.unidad,
                cantidad_total_interna: ing.cantidad_escalada,
                unidad_compra: resuelto.unidad_compra,
                factor_conversion: resuelto.factor_conversion,
                descripcion_compra: resuelto.descripcion_compra
              };
            }
          });
        }
      });
    });
  }

  // Convertir a array con cálculo de unidades de compra
  return Object.values(consolidado).map(ing => {
    const cantidadTotal = Math.round(ing.cantidad_total_interna * 100) / 100;
    const unidadesCompra = Math.ceil(cantidadTotal / ing.factor_conversion);
    
    return {
      id: ing.nombre_normalizado,
      nombre: ing.nombre_display,
      nombre_normalizado: ing.nombre_normalizado,
      unidad_interna: ing.unidad_interna,
      cantidad_total: cantidadTotal,
      unidad_compra: ing.unidad_compra,
      factor_conversion: ing.factor_conversion,
      descripcion_compra: ing.descripcion_compra,
      unidades_compra: unidadesCompra,
      enDespensa: false
    };
  }).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

// ─── Obtener días restantes de la semana (desde mañana en adelante) ───
// Retorna un array con los nombres de los días desde mañana hasta el domingo
function obtenerDiasRestantes() {
  const DIAS_ORDEN = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const hoy = obtenerDiaActual();
  const idxHoy = DIAS_ORDEN.indexOf(hoy);
  // Si hoy es Domingo (último día), no queda ningún día restante
  if (idxHoy === -1 || idxHoy >= DIAS_ORDEN.length - 1) return [];
  return DIAS_ORDEN.slice(idxHoy + 1);
}

// ─── Filtrar plan para incluir solo dias desde manana (multi-semana compatible) ───
function filtrarPlanDesdaManana(planInput) {
  if (!planInput) return { _numSemanas: 1, semana_1: {} };
  const plan = _normalizarPlanMulti(planInput);
  const diasRestantes = obtenerDiasRestantes();
  const numSemanas = plan._numSemanas || 1;
  const planFiltrado = { _numSemanas: numSemanas };
  
  for (let s = 1; s <= numSemanas; s++) {
    const semana = plan['semana_' + s];
    if (!semana) { planFiltrado['semana_' + s] = {}; continue; }
    
    if (s === 1) {
      // Solo semana 1 se filtra por días restantes
      const semFiltrada = {};
      diasRestantes.forEach(dia => {
        if (semana[dia]) semFiltrada[dia] = semana[dia];
      });
      planFiltrado['semana_' + s] = semFiltrada;
    } else {
      // Semanas futuras se incluyen completas
      planFiltrado['semana_' + s] = semana;
    }
  }
  return planFiltrado;
}

// ─── Consolidar ingredientes con opción de filtrar por días restantes ───
function consolidarIngredientesFiltrado(planInput, soloRestantes) {
  const planAUsar = soloRestantes ? filtrarPlanDesdaManana(planInput) : planInput;
  return consolidarIngredientes(planAUsar);
}

// ─── Tabla de densidades y equivalencias para conversión a medidas caseras ───
// 1 taza = 240 ml, 1 cucharada (cda) = 15 ml, 1 cucharadita (cdta) = 5 ml
const DENSIDADES_G_POR_ML = {
  // Harinas y polvos (g por ml)
  avena: 0.37,          // 1 taza ≈ 90g
  harina: 0.52,         // 1 taza ≈ 125g
  harina_maiz: 0.52,
  harina_trigo: 0.52,
  azucar: 0.85,         // 1 taza ≈ 200g
  cacao: 0.42,          // 1 taza ≈ 100g
  canela: 0.56,
  polvo_hornear: 0.69,
  proteina_suero: 0.4,
  granola: 0.42,        // 1 taza ≈ 100g
  
  // Granos y legumbres secas
  arroz: 0.75,          // 1 taza ≈ 180g
  arroz_integral: 0.75,
  arroz_blanco: 0.75,
  arroz_basmati: 0.75,
  quinoa: 0.71,         // 1 taza ≈ 170g
  lenteja: 0.77,
  lentejas_rojas: 0.77,
  poroto: 0.75, frijol: 0.75,
  poroto: 0.75,
  garbanzo: 0.72,
  
  // Yogur y lácteos espesos (se miden en tazas)
  yogur_griego: 1.03,    // 1 taza ≈ 245g
  yogur_natural: 1.02,   // 1 taza ≈ 245g
  yogur: 1.02,
  queso_crema: 0.96,
  
  // Frutos secos y semillas
  mani: 0.6,            // 1 taza ≈ 145g
  almendra: 0.58,
  nuez: 0.42,
  chia: 0.65,
  semilla_calabaza: 0.55,
  sesamo: 0.6,
  semilla_girasol: 0.55,
  semillas_calabaza: 0.55,  // alias
  coco_rallado: 0.33,
  pasas: 0.6,
  mantequilla_mani: 1.07,   // muy densa, 1 cda ≈ 16g
  mantequilla_almendras: 1.07,
  
  // Quesos
  queso_mozzarella: 0.45,
  queso_blanco: 0.45,
  parmesano: 0.42,
  queso_parmesano: 0.42,
  queso_gruyere: 0.42,
  
  // Frutas y verduras (picadas/cortadas)
  espinaca: 0.12,       // muy liviana
  arandanos: 0.6,
  frutilla: 0.55,
  tomate_cherry: 0.55,
  champiñon: 0.3,
  champinones: 0.3,      // alias sin acento
  pinones: 0.6,           // piñones
  albahaca: 0.12,         // fresca, muy liviana
  brocoli: 0.35,
  
  // Legumbres cocidas (más densas que secas)
  poroto_negro: 0.75,     // cocidos, 1 taza ≈ 180g
  porotos_negros: 0.75,
  garbanzos_cocidos: 0.72,
  
  // Harinas adicionales
  harina_integral: 0.52,  // similar a harina normal
  
  // Frutas cortadas
  frutillas: 0.55,        // 1 taza ≈ 130g cortadas
  frutilla: 0.55,
  manzana: 0.55,
  piña: 0.6,
  
  // Condimentos secos
  pimienta: 0.5,
  comino: 0.45,
  oregano: 0.2,
  paprika: 0.46,
  chile_hojuelas: 0.3,
  nuez_moscada: 0.5,
  curry: 0.45,
  ajo_polvo: 0.56,
  jengibre: 0.56,         // rallado
  romero: 0.2,            // fresco, muy liviano
  sal: 1.2,
  cilantro: 0.15,        // fresco, muy liviano como espinaca
  cilantro_seco: 0.25,
  perejil: 0.15,         // fresco
  perejil_seco: 0.2,
  lechuga: 0.18,         // 1 taza ≈ 45g
  
  // Chips y snacks
  chocolate_chip: 0.6,
  chips_chocolate: 0.6,     // alias
  palomita: 0.2,
  maiz_palomitas: 0.72,     // maíz seco para palomitas
  aceitunas: 0.65,          // cortadas
  aceituna: 0.65,
  
  // Aliases plurales (las recetas usan nombre_normalizado plural)
  almendras: 0.58,          // alias de almendra
  nueces: 0.42,             // alias de nuez
  garbanzos: 0.72,          // alias de garbanzo
  lentejas: 0.77,           // alias de lenteja
  frijoles_rojos: 0.75, porotos_rojos: 0.75,
  edamame: 0.65,            // edamame cocido
  arvejas: 0.7,             // guisantes/arvejas
  choclo: 0.72,             // granos de maíz
  arandanos_deshid: 0.6,    // arándanos deshidratados
  
  // Quesos adicionales
  quesillo: 0.45,
  queso_cheddar: 0.45,
  queso_fresco: 0.45,
  queso_laminas: 0.45,
  
  // Lácteos espesos adicionales
  crema_agria: 0.96,        // similar a queso crema
  hummus: 0.96,             // pasta espesa
  
  // Verduras cortadas adicionales
  repollo: 0.35,            // repollo rallado/picado
  uvas: 0.6,                // uvas enteras
  
  // Condimentos secos adicionales
  chile_polvo: 0.45,
  pimenton_polvo: 0.46,
  eneldo: 0.15,             // fresco, como cilantro
  tomillo: 0.15,            // fresco
  
  // Semillas adicionales
  semillas_girasol: 0.55,
  
  // Arroz adicional
  arroz_arborio: 0.75,      // similar a arroz blanco
  
  // Alias con acento faltante
  pina: 0.6                 // piña sin acento
};

// Ingredientes que son líquidos (densidad ≈ 1 g/ml, usan medidas de volumen directamente)
const INGREDIENTES_LIQUIDOS = new Set([
  'aceite_oliva', 'aceite_coco', 'aceite_sesamo', 'aceite_girasol', 'aceite', 'aceite_vegetal',
  'miel', 'miel_maple', 'maple',
  'salsa_soya', 'salsa_soja', 'vinagre', 'vinagre_manzana', 'vinagre_balsamico',
  'limón', 'limon', 'jugo_limon', 'jugo_naranja',
  'leche', 'leche_almendras', 'leche_coco', 'leche_descremada', 'leche_avena',
  'yogur', 'yogur_griego', 'yogur_natural',
  'crema', 'crema_leche', 'crema_coco',
  'caldo', 'caldo_pollo', 'caldo_verduras', 'caldo_carne',
  'salsa_tomate', 'salsa_pesto', 'salsa_sriracha', 'salsa_picante', 'salsa_verde', 'tahini',
  'agua'
]);

// Ingredientes que SIEMPRE se miden en gramos (proteínas, tubérculos, verduras enteras, etc.)
const INGREDIENTES_SIEMPRE_GRAMOS = new Set([
  'pechuga_pollo', 'pollo', 'carne_molida', 'carne', 'cerdo', 'pavo', 'pechuga_pavo',
  'salmon', 'atun', 'pescado', 'camaron', 'tofu',
  'camarones', 'carne_res', 'pescado_blanco', 'jamon_pavo',
  'camote', 'papa', 'yuca',
  'zapallo', 'calabaza', 'zanahoria', 'calabacin', 'zucchini',
  'esparrago', 'esparragos',
  'brocoli', 'coliflor', 'berenjena', 'poroto_verde',
  'mango', 'piña', 'pina', 'melon',  
  'fideo', 'fideos', 'pasta', 'espagueti', 'pasta_penne',
  'pan_integral', 'tortilla_maiz', 'tortilla_trigo'
]);

// ─── Función principal: convertir g/ml a medida casera ───
function convertirAMedidaCasera(cantidad, unidad, nombreNormalizado) {
  // Si ya es unidad/rebanada/etc, no convertir
  if (!unidad || unidad === 'unidad' || unidad === 'unidades' || unidad === 'rebanadas' || unidad === 'rebanada' || unidad === 'dientes' || unidad === 'diente' || unidad === 'hojas' || unidad === 'hoja' || unidad === 'rodajas') {
    return { cantidad, unidad };
  }
  
  // Ingredientes que siempre se pesan (proteínas, tubérculos, etc.) — mantener en gramos
  if (unidad === 'g' && nombreNormalizado && INGREDIENTES_SIEMPRE_GRAMOS.has(nombreNormalizado)) {
    return { cantidad, unidad };
  }
  
  let cantidadML;
  
  if (unidad === 'ml') {
    cantidadML = cantidad;
  } else if (unidad === 'g') {
    // Convertir g a ml usando densidad
    if (INGREDIENTES_LIQUIDOS.has(nombreNormalizado)) {
      cantidadML = cantidad; // líquidos: 1g ≈ 1ml
    } else {
      const densidad = DENSIDADES_G_POR_ML[nombreNormalizado];
      if (densidad) {
        cantidadML = cantidad / densidad;
      } else {
        // Sin densidad conocida y no es líquido → dejar en gramos
        return { cantidad, unidad };
      }
    }
  } else {
    return { cantidad, unidad }; // unidad desconocida, no convertir
  }
  
  // Convertir ml a la mejor medida casera
  const tazas = cantidadML / 240;
  const cucharadas = cantidadML / 15;
  const cucharaditas = cantidadML / 5;
  
  // >= 0.8 tazas → expresar en tazas
  if (tazas >= 0.8) {
    return _fraccionLegible(tazas, 'taza', 'tazas');
  }
  // >= 0.8 cucharadas → expresar en cucharadas
  if (cucharadas >= 0.8) {
    return _fraccionLegible(cucharadas, 'cucharada', 'cucharadas');
  }
  // >= 0.4 cucharaditas → expresar en cucharaditas
  if (cucharaditas >= 0.4) {
    return _fraccionLegible(cucharaditas, 'cucharadita', 'cucharaditas');
  }
  // Muy poquito → pizca
  return { cantidad: 1, unidad: 'pizca' };
}

// ─── Redondear a fracciones legibles (¼, ⅓, ½, ¾, etc.) ───
function _fraccionLegible(valor, singular, plural) {
  const fracciones = [
    { val: 0.25, texto: '¼' },
    { val: 0.33, texto: '⅓' },
    { val: 0.5,  texto: '½' },
    { val: 0.67, texto: '⅔' },
    { val: 0.75, texto: '¾' }
  ];
  
  const entero = Math.floor(valor);
  const decimal = valor - entero;
  
  // Si es prácticamente entero
  if (decimal < 0.12) {
    const cant = Math.max(1, entero);
    return { cantidad: cant, unidad: cant === 1 ? singular : plural, texto: `${cant} ${cant === 1 ? singular : plural}` };
  }
  
  // Buscar la fracción más cercana
  let mejorFrac = fracciones[0];
  let mejorDist = Math.abs(decimal - fracciones[0].val);
  for (const f of fracciones) {
    const dist = Math.abs(decimal - f.val);
    if (dist < mejorDist) { mejorDist = dist; mejorFrac = f; }
  }
  
  if (entero === 0) {
    return { cantidad: mejorFrac.val, unidad: singular, texto: `${mejorFrac.texto} ${singular}` };
  }
  return { cantidad: entero + mejorFrac.val, unidad: plural, texto: `${entero} ${mejorFrac.texto} ${plural}` };
}

// ─── Diccionario para deducir nombre_normalizado desde texto de ingrediente ───
const _NOMBRE_A_NORMALIZADO = {
  'avena': 'avena', 'avena en hojuelas': 'avena',
  'harina': 'harina', 'harina de maíz': 'harina_maiz', 'harina de maíz precocida': 'harina_maiz', 'harina de trigo': 'harina_trigo',
  'arroz': 'arroz', 'arroz integral': 'arroz_integral', 'arroz blanco': 'arroz',
  'quinoa': 'quinoa', 'quinua': 'quinoa',
  'lenteja': 'lenteja', 'lentejas': 'lenteja',
  'frijol': 'poroto_negro', 'frijoles': 'poroto_negro', 'frijoles negros': 'poroto_negro',
  'poroto': 'poroto_negro', 'porotos': 'poroto_negro', 'porotos negros': 'poroto_negro',
  'poroto': 'poroto', 'porotos': 'poroto', 'porotos negros': 'poroto',
  'porotos negros cocidos': 'poroto_negro', 'frijoles negros cocidos': 'poroto_negro',
  'garbanzo': 'garbanzo', 'garbanzos': 'garbanzo',
  'maní': 'mani', 'maní tostado': 'mani', 'maní picado': 'mani',
  'almendra': 'almendra', 'almendras': 'almendra',
  'nuez': 'nuez', 'nueces': 'nuez',
  'semillas de chía': 'chia', 'chía': 'chia',
  'semillas de calabaza': 'semilla_calabaza', 'pepitas': 'semilla_calabaza',
  'semillas de sésamo': 'sesamo', 'sésamo': 'sesamo', 'ajonjolí': 'sesamo',
  'semillas de girasol': 'semilla_girasol',
  'coco rallado': 'coco_rallado',
  'pasas': 'pasas',
  'canela': 'canela', 'canela en polvo': 'canela',
  'sal': 'sal', 'sal de mar': 'sal',
  'pimienta': 'pimienta', 'pimienta negra': 'pimienta',
  'comino': 'comino', 'comino en polvo': 'comino', 'comino molido': 'comino',
  'orégano': 'oregano', 'oregano': 'oregano',
  'pimentón en polvo': 'paprika', 'paprika': 'paprika', 'pimentón': 'paprika',
  'hojuelas de chile': 'chile_hojuelas', 'chile en hojuelas': 'chile_hojuelas',
  'curry': 'curry', 'curry en polvo': 'curry',
  'polvo para hornear': 'polvo_hornear',
  'cacao en polvo': 'cacao', 'cacao': 'cacao',
  'chocolate': 'chocolate_chip', 'chips de chocolate': 'chocolate_chip', 'chispas de chocolate': 'chocolate_chip',
  'aceite de oliva': 'aceite_oliva', 'aceite oliva': 'aceite_oliva',
  'aceite de coco': 'aceite_coco',
  'aceite de sésamo': 'aceite_sesamo',
  'miel': 'miel', 'miel de abeja': 'miel',
  'miel de maple': 'miel_maple', 'maple': 'miel_maple', 'jarabe de maple': 'miel_maple',
  'salsa de soya': 'salsa_soya', 'salsa soya': 'salsa_soya', 'salsa de soja': 'salsa_soja',
  'vinagre': 'vinagre', 'vinagre de manzana': 'vinagre_manzana', 'vinagre balsámico': 'vinagre_balsamico',
  'limón': 'limon', 'jugo de limón': 'limon',
  'leche': 'leche', 'leche descremada': 'leche',
  'leche de almendras': 'leche_almendras',
  'leche de coco': 'leche_coco',
  'leche de avena': 'leche_avena',
  'yogur griego': 'yogur_griego', 'yogur': 'yogur', 'yogur natural': 'yogur_natural',
  'crema de leche': 'crema_leche', 'crema': 'crema',
  'caldo de pollo': 'caldo_pollo', 'caldo de verduras': 'caldo_verduras', 'caldo': 'caldo',
  'salsa de tomate': 'salsa_tomate',
  'tahini': 'tahini', 'tahina': 'tahini',
  'proteína de suero': 'proteina_suero', 'proteína': 'proteina_suero',
  'granola': 'granola',
  'espinaca': 'espinaca', 'espinaca fresca': 'espinaca', 'espinacas': 'espinaca',
  'arándanos': 'arandanos', 'arándanos frescos': 'arandanos',
  'frutillas': 'frutilla', 'frutilla': 'frutilla', 'fresas': 'frutilla', 'fresa': 'frutilla',
  'tomates cherry': 'tomate_cherry',
  'champiñones': 'champiñon', 'champiñón': 'champiñon', 'hongos': 'champiñon',
  'brócoli': 'brocoli', 'brocoli': 'brocoli',
  'queso mozzarella': 'queso_mozzarella', 'mozzarella': 'queso_mozzarella',
  'queso blanco': 'queso_blanco', 'queso fresco': 'queso_blanco',
  'queso parmesano': 'queso_parmesano', 'parmesano': 'queso_parmesano',
  'queso crema': 'queso_crema',
  'mango': 'mango', 'mango congelado': 'mango',
  'cilantro': 'cilantro', 'cilantro fresco': 'cilantro',
  'perejil': 'perejil', 'perejil fresco': 'perejil',
  'ajo en polvo': 'ajo_polvo',
  'lechuga': 'lechuga', 'lechuga romana': 'lechuga',
  'arroz blanco': 'arroz_blanco', 'arroz': 'arroz',
  'agua': 'agua',
  'salsa pesto': 'salsa_pesto', 'pesto': 'salsa_pesto',
  'sriracha': 'salsa_sriracha', 'salsa sriracha': 'salsa_sriracha',
  'mantequilla de almendras': 'almendra', 'mantequilla de maní': 'mani', 'mantequilla de maní natural': 'mani',
  'yogur griego natural': 'yogur_griego', 'yogur griego': 'yogur_griego',
  'queso blanco rallado': 'queso_blanco', 'queso blanco': 'queso_blanco',
  'queso mozzarella rallado': 'queso_mozzarella', 'queso parmesano rallado': 'queso_parmesano',
  'harina integral': 'harina_integral',
  'frutillas frescas': 'frutilla', 'fresas frescas': 'frutilla',
  'arroz basmati': 'arroz_basmati',
  'arroz integral': 'arroz_integral',
  'jengibre': 'jengibre', 'jengibre fresco': 'jengibre',
  'aceite vegetal': 'aceite_vegetal',
  'nuez moscada': 'nuez_moscada',
  'semillas de calabaza': 'semillas_calabaza', 'pepitas de calabaza': 'semillas_calabaza',
  'aceitunas': 'aceitunas', 'aceitunas negras': 'aceitunas', 'aceituna': 'aceituna',
  'garbanzos cocidos': 'garbanzo',
  'champiñones': 'champinones', 'champiñón': 'champinones', 'hongos': 'champinones',
  'queso gruyère rallado': 'queso_gruyere', 'queso gruyère': 'queso_gruyere',
  'albahaca': 'albahaca', 'albahaca fresca': 'albahaca',
  'piñones': 'pinones',
  'pasta penne': 'pasta_penne',
  'lentejas rojas': 'lentejas_rojas', 'lentejas': 'lenteja',
  'romero': 'romero', 'romero fresco': 'romero',
  'dátiles': 'pasas', 'dátil': 'pasas',
  'edamame': 'frijol', 'edamames': 'frijol',
  'hummus': 'garbanzo',
  'maíz': 'arroz', 'palomitas': 'palomita', 'maíz para palomitas': 'palomita'
};

// ─── Buscar nombre_normalizado desde texto libre de ingrediente ───
function _buscarNormalizado(textoIngrediente) {
  const t = textoIngrediente.toLowerCase().trim();
  // Intentar match exacto primero, luego parciales desde los más largos
  if (_NOMBRE_A_NORMALIZADO[t]) return _NOMBRE_A_NORMALIZADO[t];
  // Buscar la clave más larga que esté contenida en el texto
  let mejor = null;
  let mejorLen = 0;
  for (const [clave, norm] of Object.entries(_NOMBRE_A_NORMALIZADO)) {
    if (t.includes(clave) && clave.length > mejorLen) {
      mejor = norm;
      mejorLen = clave.length;
    }
  }
  return mejor;
}

// ─── Convertir instrucciones de g/ml a medidas caseras automáticamente ───
function convertirInstruccionesAMedidasCaseras(instrucciones) {
  if (!instrucciones || !Array.isArray(instrucciones)) return instrucciones;
  
  // Función auxiliar: dado un ingrediente capturado, encontrar el nombre limpio
  // para buscar en el diccionario de normalización
  const _limpiarIngrediente = (txt) => {
    return txt.replace(/\s+/g, ' ').trim();
  };
  
  // Función auxiliar: generar reemplazo con artículo correcto
  const _generarReemplazo = (articulo, cantidad, unidad, ingredienteStr) => {
    const ingrediente = _limpiarIngrediente(ingredienteStr);
    const normalizado = _buscarNormalizado(ingrediente);
    const conv = convertirAMedidaCasera(cantidad, unidad, normalizado);
    
    if (!conv.texto) return null;
    
    const art = articulo ? articulo.trim() : '';
    let nuevoArt = '';
    if (art) {
      if (conv.texto.includes('taza')) nuevoArt = conv.cantidad > 1 ? 'las ' : 'la ';
      else if (conv.texto.includes('cucharada') && !conv.texto.includes('cucharadita')) nuevoArt = conv.cantidad > 1 ? 'las ' : 'la ';
      else if (conv.texto.includes('cucharadita')) nuevoArt = conv.cantidad > 1 ? 'las ' : 'la ';
      else if (conv.texto.includes('pizca')) nuevoArt = 'una ';
      else nuevoArt = art + ' ';
    }
    return `${nuevoArt}${conv.texto} de ${ingrediente}`;
  };
  
  return instrucciones.map(paso => {
    let resultado = paso;
    
    // Patrón principal con artículo: "los/las/la/el 80 g de avena en hojuelas"
    // También captura "los 5 ml restantes de aceite de oliva"
    resultado = resultado.replace(
      /((?:los|las|la|el|un|una)\s+)(\d+(?:\.\d+)?)\s*(g|ml|gramos|mililitros)\s*(restantes?\s+)?de\s+([^.,;:()\n]+)/gi,
      (match, articulo, numStr, unidadStr, restantesStr, ingredienteRaw) => {
        const cantidad = parseFloat(numStr);
        const unidad = (unidadStr.toLowerCase() === 'g' || unidadStr.toLowerCase() === 'gramos') ? 'g' : 'ml';
        const esRestante = restantesStr && restantesStr.trim().length > 0;
        
        const ingredienteClean = _extraerNombreIngrediente(ingredienteRaw);
        const resto = ingredienteRaw.substring(ingredienteClean.length);
        
        const reemplazo = _generarReemplazo(articulo, cantidad, unidad, ingredienteClean);
        if (reemplazo) {
          if (esRestante) {
            // Insertar "restante(s)" después de la medida: "la cucharadita restante de aceite"
            const partes = reemplazo.match(/^(.+\s(?:tazas?|cucharadas?|cucharaditas?|pizca))(\s+de\s+.+)$/);
            if (partes) return partes[1] + ' restante' + partes[2] + resto;
          }
          return reemplazo + resto;
        }
        return match;
      }
    );
    
    // Patrón sin artículo: "80 g de avena en hojuelas", "5 ml restantes de aceite"
    resultado = resultado.replace(
      /(?<![a-záéíóúñ])(\d+(?:\.\d+)?)\s*(g|ml|gramos|mililitros)\s*(restantes?\s+)?de\s+([^.,;:()\n]+)/gi,
      (match, numStr, unidadStr, restantesStr, ingredienteRaw) => {
        const cantidad = parseFloat(numStr);
        const unidad = (unidadStr.toLowerCase() === 'g' || unidadStr.toLowerCase() === 'gramos') ? 'g' : 'ml';
        const esRestante = restantesStr && restantesStr.trim().length > 0;
        
        const ingredienteClean = _extraerNombreIngrediente(ingredienteRaw);
        const resto = ingredienteRaw.substring(ingredienteClean.length);
        
        const reemplazo = _generarReemplazo(null, cantidad, unidad, ingredienteClean);
        if (reemplazo) {
          if (esRestante) {
            const partes = reemplazo.match(/^(.+\s(?:tazas?|cucharadas?|cucharaditas?|pizca))(\s+de\s+.+)$/);
            if (partes) return partes[1] + ' restante' + partes[2] + resto;
          }
          return reemplazo + resto;
        }
        return match;
      }
    );
    
    // Patrón para cantidades entre paréntesis: "(80 g)" → "(1 taza)", "(3 g en total)" → "(¾ cucharadita en total)"
    resultado = resultado.replace(
      /\((\d+(?:\.\d+)?)\s*(g|ml)([^)]*)\)/gi,
      (match, numStr, unidadStr, restParentesis) => {
        const cantidad = parseFloat(numStr);
        const unidad = unidadStr.toLowerCase() === 'g' ? 'g' : 'ml';
        const conv = convertirAMedidaCasera(cantidad, unidad, null);
        if (conv.texto) return `(${conv.texto}${restParentesis})`;
        return match;
      }
    );
    
    return resultado;
  });
}

// ─── Extraer nombre de ingrediente desde texto greedy capturado ───
// "avena en hojuelas a la leche caliente" → "avena en hojuelas"
// "miel de abeja en zigzag" → "miel de abeja"
// "leche de almendras en una olla" → "leche de almendras"
function _extraerNombreIngrediente(textoRaw) {
  const texto = textoRaw.trim();
  const MODIFICADORES_VALIDOS = /^(?:en hojuelas|en polvo|en rodajas|en cubos|en trozos|en láminas|en mitades|en juliana|de abeja|de maple|de suero|de coco|de almendras|de oliva|de sésamo|de girasol|de maíz|de trigo|de avena|de manzana|de soya|de soja|de tomate|de chile|para hornear|para palomitas|de mar|de pollo|de verduras|de leche|de arroz|rallado|rallada|rallados|fresco|fresca|frescos|frescas|tostado|tostada|tostados|molido|molida|congelado|congelada|precocida|integral|descremada|negra|negros|negro|blanco|blanca|cherry|maduro|madura|morada|crema|picado|picada|picados|cortado|cortada|cortados|cocido|cocida|cocidos|seco|seca|secos|secas|sabor vainilla|natural|griego|balsámico)\b/i;
  
  // Intentar matchear contra el diccionario: buscar la coincidencia más larga
  const textoLower = texto.toLowerCase();
  let mejorMatch = '';
  for (const clave of Object.keys(_NOMBRE_A_NORMALIZADO)) {
    if (textoLower.startsWith(clave) && clave.length > mejorMatch.length) {
      // Verificar que termina en límite de palabra
      const siguiente = texto[clave.length];
      if (!siguiente || /[\s.,;:()]/.test(siguiente)) {
        mejorMatch = texto.substring(0, clave.length);
      }
    }
  }
  
  // Si encontramos match en diccionario, extender con modificadores que sigan
  if (mejorMatch) {
    const despues = texto.substring(mejorMatch.length).trimStart();
    if (despues) {
      const modMatch = despues.match(MODIFICADORES_VALIDOS);
      if (modMatch) {
        // El modificador sigue al nombre del diccionario → incluirlo
        const espacioAntes = texto.substring(mejorMatch.length).match(/^\s*/)[0];
        mejorMatch = mejorMatch + espacioAntes + modMatch[0];
      }
    }
    return mejorMatch;
  }
  
  // Fallback: capturar palabras hasta encontrar una que no es parte del ingrediente
  const palabras = texto.split(/\s+/);
  let resultado = palabras[0];
  
  for (let i = 1; i < palabras.length; i++) {
    const restante = palabras.slice(i).join(' ');
    if (MODIFICADORES_VALIDOS.test(restante)) {
      resultado += ' ' + palabras[i];
      const modMatch = restante.match(MODIFICADORES_VALIDOS);
      if (modMatch) {
        const modPalabras = modMatch[0].split(/\s+/);
        for (let j = 1; j < modPalabras.length && (i + j) < palabras.length; j++) {
          resultado += ' ' + palabras[i + j];
        }
        i += modPalabras.length - 1;
      }
    } else {
      break;
    }
  }
  
  return resultado;
}

// ─── Unidades discretas (indivisibles) — se redondean al entero más cercano ───
// Ej: 2.6 unidades → 3 unidades  /  1.3 diente → 1 diente
var _UNIDADES_DISCRETAS = new Set([
  'unidad','unidades','ud','ud.',
  'diente','dientes',
  'rebanada','rebanadas',
  'tajada','tajadas',
  'porcion','porciones','porción','porciones',
  'pieza','piezas',
  'lata','latas',
  'sobre','sobres',
  'tarro','tarros',
  'filete','filetes',
  'rodaja','rodajas',
  'hoja','hojas',
  'ramita','ramitas',
  'trozo','trozos',
]);

// ─── Formatear cantidad para mostrar — AHORA CON MEDIDAS CASERAS ───
function formatearCantidad(cantidad, unidad, nombreNormalizado) {
  // Redondear al entero más cercano para unidades indivisibles
  var _uLower = (unidad || '').toLowerCase().trim();
  if (_UNIDADES_DISCRETAS.has(_uLower)) {
    var redondeado = Math.round(cantidad);
    if (redondeado === 0) redondeado = 1; // mínimo 1 unidad
    return redondeado + ' ' + unidad;
  }
  // Si tenemos nombre normalizado, intentar convertir a medida casera
  if (nombreNormalizado && (unidad === 'g' || unidad === 'ml')) {
    const conv = convertirAMedidaCasera(cantidad, unidad, nombreNormalizado);
    if (conv.texto) return conv.texto;
    // Fallback: mostrar número + unidad convertida
    const cantShow = conv.cantidad === Math.floor(conv.cantidad) ? conv.cantidad : conv.cantidad.toFixed(1);
    return `${cantShow} ${conv.unidad}`;
  }
  // Unidades que no son g/ml — mostrar tal cual
  if (cantidad === Math.floor(cantidad)) {
    return `${cantidad} ${unidad}`;
  }
  return `${cantidad.toFixed(1)} ${unidad}`;
}

// ─── MEJORA 1: Formatear para lista de compras con unidades reales ───
function formatearCompra(ing) {
  if (ing.unidades_compra <= 0) return formatearCantidad(ing.cantidad_total, ing.unidad_interna);
  
  const unidad = ing.unidades_compra === 1 
    ? ing.unidad_compra.replace(/es$/, '').replace(/s$/, '') // singularizar
    : ing.unidad_compra;
  
  if (ing.descripcion_compra) {
    return `${ing.unidades_compra} ${unidad} de ${ing.nombre} (${ing.descripcion_compra} c/u)`;
  }
  return `${ing.unidades_compra} ${unidad}`;
}

// Versión corta para despensa (sin duplicar nombre)
function formatearCompraCorto(ing) {
  if (ing.unidades_compra <= 0) return formatearCantidad(ing.cantidad_total, ing.unidad_interna);
  
  const unidad = ing.unidades_compra === 1 
    ? ing.unidad_compra.replace(/es$/, '').replace(/s$/, '') // singularizar
    : ing.unidad_compra;
  
  return `${ing.unidades_compra} ${unidad} (${ing.descripcion_compra})`;
}

// ═══════════════════════════════════════════════════
// BÚSQUEDA EN VIVO: Versiones asíncronas que nunca
// se quedan sin recetas. Combinan base local + API.
// ═══════════════════════════════════════════════════

// Generar plan semanal con fallback online cuando la base local no alcanza
async function generarPlanSemanalAsync(perfil, caloriasObjetivo, onProgreso) {
  const numSemanas = Math.min(4, Math.max(1, perfil.numSemanas || 1));
  
  // 1. Filtrar recetas locales según restricciones
  const recetasFiltradas = filtrarRecetas(RECETAS_DB, perfil);
  const recetasUsadas14 = obtenerRecetasUsadas14Dias();
  
  // Incluir recetas online cacheadas (SOLO para almuerzo y cena)
  const cacheOnline = typeof _cargarCacheOnline === 'function' ? _cargarCacheOnline() : [];
  const onlineFiltradas = filtrarRecetas(cacheOnline, perfil);
  const todasConOnline = [...recetasFiltradas, ...onlineFiltradas];
  
  // 2. Separar por tipo de comida
  const porTipo = {
    desayuno: obtenerRecetasPorTipo(recetasFiltradas, "desayuno"),
    snack_am: obtenerRecetasPorTipo(recetasFiltradas, "snack_am"),
    almuerzo: obtenerRecetasPorTipo(todasConOnline, "almuerzo"),
    snack_pm: obtenerRecetasPorTipo(recetasFiltradas, "snack_pm"),
    cena: obtenerRecetasPorTipo(todasConOnline, "cena")
  };

  // 3. Identificar tipos que necesitan más recetas (ajustar para multi-semana)
  const tiposConPocas = [];
  const MINIMO_RECETAS_POR_TIPO = 7 * numSemanas;
  
  const TIPOS_ONLINE_PERMITIDOS = ["almuerzo", "cena"];
  for (const [tipo, recetas] of Object.entries(porTipo)) {
    if (!TIPOS_ONLINE_PERMITIDOS.includes(tipo)) continue;
    const sinRepetir = recetas.filter(r => !recetasUsadas14.has(r.id));
    if (sinRepetir.length < MINIMO_RECETAS_POR_TIPO) {
      tiposConPocas.push(tipo);
    }
  }

  // 4. Buscar online si hay tipos con pocas recetas
  let recetasOnlineNuevas = [];
  let buscoOnline = false;
  
  if (tiposConPocas.length > 0 && typeof buscarRecetasOnline === 'function') {
    buscoOnline = true;
    if (onProgreso) onProgreso("Buscando recetas en internet...");
    
    for (const tipo of tiposConPocas) {
      try {
        const necesarias = MINIMO_RECETAS_POR_TIPO - porTipo[tipo].filter(r => !recetasUsadas14.has(r.id)).length;
        const online = await buscarRecetasOnline(tipo, perfil, Math.max(necesarias, 5));
        const nuevas = online.filter(r => !porTipo[tipo].some(l => l.id === r.id));
        recetasOnlineNuevas.push(...nuevas);
        porTipo[tipo] = [...porTipo[tipo], ...nuevas];
        if (onProgreso) onProgreso(`Encontradas ${nuevas.length} recetas online para ${NOMBRES_COMIDAS[tipo]}...`);
      } catch (e) {
        console.warn(`Error buscando recetas online para ${tipo}:`, e);
      }
    }
  }

  // 5. Generar plan para N semanas
  let advertenciaRecetas = null;
  const recetasUsadasGlobal = new Set();
  const planMulti = { _numSemanas: numSemanas };

  for (let s = 1; s <= numSemanas; s++) {
    if (onProgreso && numSemanas > 1) onProgreso(`Generando semana ${s} de ${numSemanas}...`);
    const planSemana = {};
    
    DIAS_SEMANA.forEach(dia => {
      planSemana[dia] = {};
      
      Object.keys(DISTRIBUCION_COMIDAS).forEach(tipoComida => {
        const caloriasComida = Math.round(caloriasObjetivo * DISTRIBUCION_COMIDAS[tipoComida]);
        const recetasDisponibles = porTipo[tipoComida];
        
        if (recetasDisponibles.length > 0) {
          let candidatas = recetasDisponibles.filter(r => 
            !recetasUsadas14.has(r.id) && !recetasUsadasGlobal.has(r.id)
          );
          
          if (candidatas.length === 0) {
            candidatas = recetasDisponibles.filter(r => !recetasUsadasGlobal.has(r.id));
          }
          
          if (candidatas.length === 0) {
            candidatas = recetasDisponibles;
            if (!advertenciaRecetas) {
              advertenciaRecetas = `Pocas recetas de "${NOMBRES_COMIDAS[tipoComida]}" disponibles. Se reutilizaron algunas.`;
            }
          }
          
          const idx = Math.floor(Math.random() * candidatas.length);
          const recetaSeleccionada = candidatas[idx];
          recetasUsadasGlobal.add(recetaSeleccionada.id);
          
          planSemana[dia][tipoComida] = escalarReceta(recetaSeleccionada, caloriasComida);
        } else {
          planSemana[dia][tipoComida] = null;
        }
      });
    });

    // Fase 4 - Punto 16: modo sobras
    if (perfil.modoSobras) _aplicarModoSobras(planSemana, caloriasObjetivo);

    planMulti['semana_' + s] = planSemana;
  }

  // 6. Guardar historial (usa semana 1)
  agregarAlHistorial(planMulti.semana_1);
  planMulti._advertencia = advertenciaRecetas;
  planMulti._buscoOnline = buscoOnline;
  planMulti._recetasOnlineUsadas = recetasOnlineNuevas.length;

  return planMulti;
}

// Cambiar una receta individual con fallback online (multi-semana compatible)
async function cambiarRecetaIndividualAsync(planMulti, dia, tipoComida, perfil, caloriasObjetivo, onProgreso, numSemana) {
  numSemana = numSemana || 1;
  const plan = _normalizarPlanMulti(planMulti);
  const semanaKey = 'semana_' + numSemana;
  const semanaActual = plan[semanaKey];
  if (!semanaActual) return plan;

  const esSoloLocal = tipoComida === 'snack_am' || tipoComida === 'snack_pm' || tipoComida === 'desayuno';
  const recetasFiltradas = filtrarRecetas(RECETAS_DB, perfil);
  const recetasDelTipo = obtenerRecetasPorTipo(recetasFiltradas, tipoComida);
  
  let todasDelTipo;
  if (esSoloLocal) {
    todasDelTipo = recetasDelTipo;
  } else {
    const cacheOnline = typeof _cargarCacheOnline === 'function' ? _cargarCacheOnline() : [];
    const onlineFiltradas = filtrarRecetas(cacheOnline, perfil)
      .filter(r => r.tipo_comida === tipoComida);
    todasDelTipo = [...recetasDelTipo, ...onlineFiltradas];
  }
  
  // Recopilar IDs de recetas en uso en TODAS las semanas
  const idsEnUso = new Set();
  for (let s = 1; s <= (plan._numSemanas || 1); s++) {
    const sem = plan['semana_' + s];
    if (!sem) continue;
    Object.values(sem).forEach(comidasDia => {
      if (typeof comidasDia !== 'object' || comidasDia === null) return;
      Object.values(comidasDia).forEach(comida => {
        if (comida && comida.id) idsEnUso.add(comida.id);
      });
    });
  }
  
  const recetasUsadas14 = obtenerRecetasUsadas14Dias();
  
  let candidatas = todasDelTipo.filter(r => !idsEnUso.has(r.id) && !recetasUsadas14.has(r.id));
  
  if (candidatas.length === 0) {
    candidatas = todasDelTipo.filter(r => !idsEnUso.has(r.id));
  }
  
  if (candidatas.length === 0 && !esSoloLocal && typeof buscarUnaRecetaOnline === 'function') {
    if (onProgreso) onProgreso("Buscando receta en internet...");
    try {
      const recetaOnline = await buscarUnaRecetaOnline(tipoComida, perfil, Array.from(idsEnUso));
      if (recetaOnline) {
        candidatas = [recetaOnline];
      }
    } catch (e) {
      console.warn("Error buscando receta online para swap:", e);
    }
  }
  
  if (candidatas.length === 0) {
    const recetaActual = semanaActual[dia]?.[tipoComida];
    candidatas = todasDelTipo.filter(r => !recetaActual || r.id !== recetaActual.id);
  }
  
  if (candidatas.length === 0) return plan;
  
  const caloriasComida = Math.round(caloriasObjetivo * DISTRIBUCION_COMIDAS[tipoComida]);
  const idx = Math.floor(Math.random() * candidatas.length);
  const nuevaReceta = escalarReceta(candidatas[idx], caloriasComida);
  
  // Actualizar plan multi-semana
  const nuevoPlan = { ...plan };
  nuevoPlan[semanaKey] = { ...semanaActual, [dia]: { ...semanaActual[dia], [tipoComida]: nuevaReceta } };
  
  const historial = cargarHistorialRecetas();
  const hoy = new Date().toISOString().split('T')[0];
  const yaExiste = historial.some(h => h.fecha === hoy && h.receta_id === nuevaReceta.id);
  if (!yaExiste) {
    historial.push({ fecha: hoy, receta_id: nuevaReceta.id });
    guardarHistorialRecetas(historial);
  }
  
  return nuevoPlan;
}
