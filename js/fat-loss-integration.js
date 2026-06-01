/* ============================================
   Calibrate — Fat Loss Integration (orquestador)
   Conecta el motor de roadmap con el perfil persistido
   y expone helpers de UI para banner, calorías efectivas y proteína target.
   ============================================ */

// ─── Activar Fat Loss Mode (desde wizard) ───
function activarFatLossMode(wizardInputs) {
  if (!window.NP_Roadmap || !window.NP_Roadmap.generar) {
    throw new Error('NP_Roadmap no disponible. Verificar orden de carga en index.html.');
  }

  const roadmap = window.NP_Roadmap.generar(wizardInputs);
  const perfilPrevio = (typeof cargarPerfil === 'function') ? (cargarPerfil() || {}) : {};

  const perfilActualizado = Object.assign({}, perfilPrevio, {
    fatLossMode: true,
    roadmap: roadmap,
    fechaInicio: roadmap.fechaInicio,
    complementoPreferido: wizardInputs.complementoPreferido || perfilPrevio.complementoPreferido || 'whey',
    // Datos corporales persistidos en el perfil base
    peso: wizardInputs.peso,
    altura: wizardInputs.altura,
    edad: wizardInputs.edad,
    genero: wizardInputs.genero,
    cintura: wizardInputs.cintura,
    cuello: wizardInputs.cuello,
    cadera: wizardInputs.cadera || null,
    bfOverride: wizardInputs.bfOverride != null && wizardInputs.bfOverride !== '' ? Number(wizardInputs.bfOverride) : null,
    // nivelActividad se preserva tal cual (key de FACTORES_ACTIVIDAD: "sedentario" | "ligera" | "moderada" | "activa" | "muyActiva")
    // El factor numérico sale de FACTORES_ACTIVIDAD[key].valor en el generador vía factorActividad
    // Fat loss impone calorías de la fase 1 como default
    caloriasManual: roadmap.fases[0].calorias,
    proteinaFloor: roadmap.calculados.proteinaTarget,
    // Macros basados en LBM (Helms 2014: LBM × 2.63). Split 57/43 carb/fat del remanente.
    // Los porcentajes son aproximados; los gramos son los valores exactos a seguir.
    macros: {
      proteinas:      roadmap.calculados.macrosGramos ? Math.round((roadmap.calculados.macrosGramos.proteina * 4 / roadmap.calculados.caloriasCorte) * 100) : 33,
      carbohidratos:  roadmap.calculados.macrosGramos ? Math.round((roadmap.calculados.macrosGramos.carbohidratos * 4 / roadmap.calculados.caloriasCorte) * 100) : 38,
      grasas:         roadmap.calculados.macrosGramos ? Math.round((roadmap.calculados.macrosGramos.grasas * 9 / roadmap.calculados.caloriasCorte) * 100) : 29
    },
    macrosGramos: roadmap.calculados.macrosGramos || null
  });

  if (typeof guardarPerfil === 'function') guardarPerfil(perfilActualizado);
  return perfilActualizado;
}

// ─── Desactivar (mantiene roadmap para poder reactivar) ───
function desactivarFatLossMode() {
  if (typeof cargarPerfil !== 'function') return null;
  const perfil = cargarPerfil() || {};
  perfil.fatLossMode = false;
  if (typeof guardarPerfil === 'function') guardarPerfil(perfil);
  return perfil;
}

// ─── Recalcular fases (conserva fechaInicio original) ───
function recalcularRoadmap(overrides) {
  if (typeof cargarPerfil !== 'function') return null;
  const perfil = cargarPerfil();
  if (!perfil || !perfil.roadmap) return null;

  const fechaInicioOriginal = perfil.roadmap.fechaInicio;
  const inputsPrevios = perfil.roadmap.inputs;
  const nuevosInputs = Object.assign({}, inputsPrevios, overrides || {}, {
    fechaInicio: fechaInicioOriginal
  });

  // El generador espera pesoTarget/bfTarget, los nombres en inputs son con sufijo Input
  if (nuevosInputs.pesoTargetInput && !nuevosInputs.pesoTarget) nuevosInputs.pesoTarget = nuevosInputs.pesoTargetInput;
  if (nuevosInputs.bfTargetInput && !nuevosInputs.bfTarget) nuevosInputs.bfTarget = nuevosInputs.bfTargetInput;

  const roadmap = window.NP_Roadmap.generar(nuevosInputs);
  perfil.roadmap = roadmap;
  perfil.proteinaFloor = roadmap.calculados.proteinaTarget;
  perfil.macrosGramos = roadmap.calculados.macrosGramos || null;

  // Aplicar calorías de la fase actual (puede haber avanzado en el tiempo), incluyendo
  // el ajuste por pasos objetivo real. Sin este ajuste, el plan se generaría con la kcal
  // sin ajustar y la tarjeta marcaría "Plan desincronizado" apenas se regenera.
  const fase = window.NP_Roadmap.faseActual(roadmap);
  if (fase && fase.calorias) {
    const pesoRef = perfil.peso != null ? perfil.peso : (nuevosInputs.peso || null);
    const kcalAjustada = Math.max(800, fase.calorias + _kcalDeltaPasos(fase.targetPasos, pesoRef));
    perfil.caloriasManual  = kcalAjustada;
    perfil.caloriasObjetivo = kcalAjustada;
  }

  if (typeof guardarPerfil === 'function') guardarPerfil(perfil);
  return roadmap;
}

// ─── Aplicar override manual de una fase ───
function aplicarOverrideFase(numeroFase, override) {
  // override: { calorias?, targetPasos? }
  if (typeof cargarPerfil !== 'function') return null;
  const perfil = cargarPerfil();
  if (!perfil || !perfil.roadmap) return null;

  if (!perfil.roadmap.ajustesManuales) perfil.roadmap.ajustesManuales = {};
  perfil.roadmap.ajustesManuales[numeroFase] = Object.assign(
    {},
    perfil.roadmap.ajustesManuales[numeroFase] || {},
    override
  );

  if (typeof guardarPerfil === 'function') guardarPerfil(perfil);
  return perfil.roadmap;
}

// ─── Override de pasos objetivo (target realista del usuario) ─────────────
// Si el usuario sabe que en la práctica logra 3500 pasos en lugar de los 8000
// del default de la fase, guarda esa cifra acá. Reduce TDEE proporcionalmente
// (heurística estándar: ~0.0005 kcal/paso por kg de peso corporal).
const _PASOS_OBJ_KEY = 'nutriplan_pasos_objetivo_real';

function _kcalPorPaso(peso) {
  const p = Number(peso) > 0 ? Number(peso) : 75;
  return p * 0.0005; // ≈0.04 kcal/step para 80kg
}

function getPasosObjetivoReal() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(_PASOS_OBJ_KEY);
    if (raw == null || raw === '') return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  } catch (e) { return null; }
}

function _kcalDeltaPasos(faseDefaultPasos, peso) {
  const override = getPasosObjetivoReal();
  if (override == null) return 0;
  const def = Number(faseDefaultPasos) > 0 ? Number(faseDefaultPasos) : 0;
  return Math.round((override - def) * _kcalPorPaso(peso));
}

// Persiste el override y re-sincroniza perfil (caloriasManual + caloriasObjetivo).
// Pasar null/'' borra el override y vuelve al phase default.
function setPasosObjetivoReal(n) {
  let saneado = null;
  try {
    if (n == null || n === '' || Number(n) <= 0) {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(_PASOS_OBJ_KEY);
    } else {
      saneado = Math.max(0, Math.round(Number(n)));
      if (typeof localStorage !== 'undefined') localStorage.setItem(_PASOS_OBJ_KEY, String(saneado));
    }
  } catch (e) { /* noop */ }
  if (typeof cargarPerfil === 'function' && typeof guardarPerfil === 'function') {
    const perfil = cargarPerfil();
    if (perfil && perfil.fatLossMode) {
      const kcal = caloriasObjetivoEfectivas();
      if (kcal && Number.isFinite(kcal)) {
        perfil.caloriasManual = kcal;
        perfil.caloriasObjetivo = kcal;
        guardarPerfil(perfil);
        if (typeof window !== 'undefined') {
          try { window.dispatchEvent(new CustomEvent('calibrate_perfil_updated')); } catch (e) { /* noop */ }
          // Llamada directa primero (sin depender de eventos), evento como respaldo
          if (typeof window._NP_regenerarPlanAuto === 'function') {
            try { window._NP_regenerarPlanAuto(); }
            catch (e) { console.warn('[NP_FatLoss] regen directo falló:', e); }
          } else {
            try { window.dispatchEvent(new CustomEvent('calibrate_regenerate_plan', { detail: { reason: 'pasos_objetivo' } })); } catch (e) { /* noop */ }
          }
        }
      }
    }
  }
  return saneado;
}

// ─── Fase activa hoy ───
function faseActualPerfil() {
  if (typeof cargarPerfil !== 'function') return null;
  const perfil = cargarPerfil();
  if (!perfil || !perfil.fatLossMode || !perfil.roadmap) return null;
  if (!window.NP_Roadmap || !window.NP_Roadmap.faseActual) return null;
  const fase = window.NP_Roadmap.faseActual(perfil.roadmap);
  if (!fase) return fase;
  const override = getPasosObjetivoReal();
  if (override == null) return fase;
  const peso = (perfil.peso != null) ? perfil.peso
    : (perfil.roadmap && perfil.roadmap.inputs ? perfil.roadmap.inputs.peso : null);
  const defaultPasos = fase.targetPasos;
  const delta = Math.round((override - (defaultPasos || 0)) * _kcalPorPaso(peso));
  // Piso de seguridad: nunca calorías por debajo de 800 (protege hormonas)
  const caloriasAjust = Math.max(800, (fase.calorias || 0) + delta);
  return Object.assign({}, fase, {
    _targetPasosDefault: defaultPasos,
    _caloriasOriginal: fase.calorias,
    _kcalDeltaPasos: delta,
    targetPasos: override,
    calorias: caloriasAjust
  });
}

// ─── Calorías efectivas (sobrescribe caloriasManual cuando FL está ON) ───
function caloriasObjetivoEfectivas() {
  const fase = faseActualPerfil();
  return fase ? fase.calorias : null;
}

// ─── Proteína target efectiva ───
function proteinaTargetEfectiva() {
  if (typeof cargarPerfil !== 'function') return null;
  const perfil = cargarPerfil();
  if (!perfil || !perfil.fatLossMode || !perfil.roadmap) return null;
  return perfil.roadmap.calculados.proteinaTarget;
}

// ─── Info para el banner del plan ───
function informacionBanner() {
  const fase = faseActualPerfil();
  if (!fase) return null;

  // ¿Próximo hito? Buscar el próximo diet break o fin de fase
  let proximoHito = null;
  if (fase.siguiente) {
    if (fase.siguiente.tipo === 'dietBreak') {
      proximoHito = { tipo: 'dietBreak', nombre: fase.siguiente.nombre, enDias: fase.diasRestantesEnFase };
    } else if (fase.tipo === 'dietBreak') {
      proximoHito = { tipo: 'finDietBreak', nombre: 'Retomar corte', enDias: fase.diasRestantesEnFase };
    } else {
      proximoHito = { tipo: 'cambioFase', nombre: fase.siguiente.nombre, enDias: fase.diasRestantesEnFase };
    }
  }

  return {
    nombreFase: fase.nombre,
    tipoFase: fase.tipo, // 'corte' | 'dietBreak'
    numeroFase: fase.numero,
    calorias: fase.calorias,
    targetPasos: fase.targetPasos,
    diaDentroDeFase: fase.diaDentroDeFase,
    diasRestantesEnFase: fase.diasRestantesEnFase,
    mesInicio: fase.mesInicio,
    mesFin: fase.mesFin,
    foco: fase.foco,
    proximoHito,
    completado: fase.estado === 'completado',
    porEmpezar: fase.estado === 'por_empezar'
  };
}

// ─── Detectar si el plan actual está desincronizado con la fase ───
// (ej: usuario entró en diet break pero el plan sigue a calorías de corte,
//      o el plan se generó con un kcal target distinto al actual)
//
// `planSemanal` opcional: si se pasa, valida también la suma real de kcal
// del plan vs el target esperado (detecta plans "stale" generados con base
// distinta a la actual).
function planDesincronizado(planSemanal) {
  if (typeof cargarPerfil !== 'function') return false;
  const perfil = cargarPerfil();
  if (!perfil || !perfil.fatLossMode || !perfil.roadmap) return false;

  const fase = faseActualPerfil();
  if (!fase) return false;

  const caloriasFase = fase.calorias;
  const caloriasPerfil = perfil.caloriasManual;

  // Check 1: metadata desync (caloriasManual ≠ fase.calorias)
  if (Math.abs(caloriasFase - caloriasPerfil) > 50) {
    return {
      desincronizado: true,
      razon: 'metadata',
      caloriasActuales: caloriasPerfil,
      caloriasNuevaFase: caloriasFase,
      nombreFase: fase.nombre
    };
  }

  // Check 2: plan real desync (suma de recetas ≠ target esperado)
  if (planSemanal && typeof planSemanal === 'object') {
    const semanaKey = Object.keys(planSemanal).filter(k => k.startsWith('semana_')).sort()[0];
    const semana = semanaKey ? planSemanal[semanaKey] : null;
    if (semana && typeof semana === 'object') {
      const dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
      const slots = ['desayuno','snack_am','almuerzo','snack_pm','cena'];
      let totalKcal = 0;
      let count = 0;
      dias.forEach(d => {
        const dataDia = semana[d];
        if (!dataDia || typeof dataDia !== 'object') return;
        let kcalDia = 0;
        slots.forEach(s => {
          const r = dataDia[s];
          if (r) kcalDia += (r.calorias_escaladas || r.calorias || 0);
        });
        if (kcalDia > 0) { totalKcal += kcalDia; count++; }
      });
      if (count >= 3) {
        // promedio diario del plan vs caloriasFase
        const promedio = totalKcal / count;
        // El plan tiene multiplicador ~1.0 promedio (1.05 entreno, 0.95 descanso),
        // así que promedio ≈ caloriasFase. Tolerancia 80 kcal por redondeos.
        if (Math.abs(promedio - caloriasFase) > 80) {
          return {
            desincronizado: true,
            razon: 'plan_real',
            caloriasActuales: Math.round(promedio),
            caloriasNuevaFase: caloriasFase,
            nombreFase: fase.nombre
          };
        }
      }
    }
  }

  return { desincronizado: false };
}

// ─── Sincronizar calorías del perfil con la fase actual (dispara regenerar plan) ───
function sincronizarConFaseActual() {
  if (typeof cargarPerfil !== 'function') return null;
  const perfil = cargarPerfil();
  if (!perfil || !perfil.fatLossMode) return null;

  const fase = faseActualPerfil();
  if (!fase) return null;

  // faseActualPerfil ya incluye el ajuste por pasos objetivo real. Sincronizar AMBOS
  // campos: caloriasManual (lo que compara la detección) y caloriasObjetivo (con lo que
  // se regenera el plan). Si solo se actualiza caloriasManual, el plan se regenera con el
  // caloriasObjetivo viejo y vuelve a marcar "Plan desincronizado".
  perfil.caloriasManual = fase.calorias;
  perfil.caloriasObjetivo = fase.calorias;
  if (typeof guardarPerfil === 'function') guardarPerfil(perfil);
  return perfil;
}

// ─── Activar Mantenimiento Mode ───
function activarMantenimientoMode(wizardInputs) {
  if (!window.NP_Roadmap || !window.NP_Roadmap.generarMantenimiento) {
    throw new Error('NP_Roadmap.generarMantenimiento no disponible.');
  }
  const roadmap = window.NP_Roadmap.generarMantenimiento(wizardInputs);
  const perfilPrevio = typeof cargarPerfil === 'function' ? (cargarPerfil() || {}) : {};
  const { calculados } = roadmap;

  const perfilActualizado = Object.assign({}, perfilPrevio, {
    objetivo: 'mantenimiento',
    fatLossMode: false,
    mantenimientoMode: true,
    roadmapMantenimiento: roadmap,
    peso: wizardInputs.peso,
    altura: wizardInputs.altura,
    edad: wizardInputs.edad,
    genero: wizardInputs.genero,
    cintura: wizardInputs.cintura || null,
    cuello: wizardInputs.cuello || null,
    cadera: wizardInputs.cadera || null,
    bfOverride: wizardInputs.bfOverride != null && wizardInputs.bfOverride !== '' ? Number(wizardInputs.bfOverride) : null,
    tdee: calculados.tdee,
    caloriasObjetivo: calculados.caloriasObjetivo,
    proteinaFloor: calculados.proteinaTarget,
    macros: {
      proteinas: calculados.pctProteina,
      carbohidratos: calculados.pctCarbos,
      grasas: calculados.pctGrasas
    },
    macrosGramos: calculados.macrosGramos
  });

  if (typeof guardarPerfil === 'function') guardarPerfil(perfilActualizado);
  return perfilActualizado;
}

// ─── Activar Volumen Mode ───
function activarVolumenMode(wizardInputs) {
  if (!window.NP_Roadmap || !window.NP_Roadmap.generarVolumen) {
    throw new Error('NP_Roadmap.generarVolumen no disponible.');
  }
  const roadmap = window.NP_Roadmap.generarVolumen(wizardInputs);
  const perfilPrevio = typeof cargarPerfil === 'function' ? (cargarPerfil() || {}) : {};
  const { calculados } = roadmap;

  const perfilActualizado = Object.assign({}, perfilPrevio, {
    objetivo: 'volumen',
    fatLossMode: false,
    volumenMode: true,
    roadmapVolumen: roadmap,
    peso: wizardInputs.peso,
    altura: wizardInputs.altura,
    edad: wizardInputs.edad,
    genero: wizardInputs.genero,
    cintura: wizardInputs.cintura || null,
    cuello: wizardInputs.cuello || null,
    cadera: wizardInputs.cadera || null,
    bfOverride: wizardInputs.bfOverride != null && wizardInputs.bfOverride !== '' ? Number(wizardInputs.bfOverride) : null,
    tdee: calculados.tdee,
    caloriasObjetivo: calculados.caloriasObjetivo,
    proteinaFloor: calculados.proteinaTarget,
    macros: {
      proteinas: calculados.pctProteina,
      carbohidratos: calculados.pctCarbos,
      grasas: calculados.pctGrasas
    },
    macrosGramos: calculados.macrosGramos
  });

  if (typeof guardarPerfil === 'function') guardarPerfil(perfilActualizado);
  return perfilActualizado;
}

// ─── Auto-migración: regenera roadmaps viejos sin macrosGramos ───
// Se llama al arrancar la app para que perfiles pre-actualización adopten la nueva fórmula.
function migrarPerfilSiStale() {
  if (typeof cargarPerfil !== 'function' || typeof guardarPerfil !== 'function') return false;
  const perfil = cargarPerfil();
  if (!perfil) return false;

  let migrado = false;

  // Pérdida de peso (roadmap principal)
  if (perfil.roadmap && perfil.roadmap.inputs &&
      !(perfil.roadmap.calculados && perfil.roadmap.calculados.macrosGramos)) {
    try {
      if (window.NP_Roadmap && window.NP_Roadmap.generar) {
        console.log('[NP] Migrando roadmap fat-loss a fórmula LBM × 2.63...');
        recalcularRoadmap();   // lee perfil del storage, regenera, guarda
        migrado = true;
      }
    } catch (e) { console.warn('[NP] Migración fat-loss falló:', e); }
  }

  // Mantenimiento
  if (perfil.roadmapMantenimiento && perfil.roadmapMantenimiento.inputs &&
      !(perfil.roadmapMantenimiento.calculados && perfil.roadmapMantenimiento.calculados.macrosGramos)) {
    try {
      if (window.NP_Roadmap && window.NP_Roadmap.generarMantenimiento) {
        console.log('[NP] Migrando roadmap mantenimiento a fórmula LBM × 2.0...');
        activarMantenimientoMode(perfil.roadmapMantenimiento.inputs);
        migrado = true;
      }
    } catch (e) { console.warn('[NP] Migración mantenimiento falló:', e); }
  }

  // Volumen
  if (perfil.roadmapVolumen && perfil.roadmapVolumen.inputs &&
      !(perfil.roadmapVolumen.calculados && perfil.roadmapVolumen.calculados.macrosGramos)) {
    try {
      if (window.NP_Roadmap && window.NP_Roadmap.generarVolumen) {
        console.log('[NP] Migrando roadmap volumen a fórmula LBM × 2.4...');
        activarVolumenMode(perfil.roadmapVolumen.inputs);
        migrado = true;
      }
    } catch (e) { console.warn('[NP] Migración volumen falló:', e); }
  }

  return migrado;
}

// ─── Exponer a window ───
if (typeof window !== 'undefined') {
  window.NP_FatLoss = {
    activar: activarFatLossMode,
    activarMantenimiento: activarMantenimientoMode,
    activarVolumen: activarVolumenMode,
    desactivar: desactivarFatLossMode,
    recalcular: recalcularRoadmap,
    overrideFase: aplicarOverrideFase,
    faseActual: faseActualPerfil,
    caloriasEfectivas: caloriasObjetivoEfectivas,
    proteinaTarget: proteinaTargetEfectiva,
    banner: informacionBanner,
    desincronizado: planDesincronizado,
    sincronizar: sincronizarConFaseActual,
    migrar: migrarPerfilSiStale,
    getPasosObjetivoReal,
    setPasosObjetivoReal,
    kcalDeltaPasos: _kcalDeltaPasos
  };
}
