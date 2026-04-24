/* ============================================
   NutriPlan - Fat Loss Integration (orquestador)
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
    // Macros forzados a 33/38/29: proteína dominante para preservar masa magra
    // Coincide con roadmap.calculados.proteinaTarget (2.2 g/kg peso).
    // Se aplica siempre en FL — ignora macros personalizados previos.
    macros: { proteinas: 33, carbohidratos: 38, grasas: 29 }
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

  // Aplicar calorías de la fase actual (puede haber avanzado en el tiempo)
  const fase = window.NP_Roadmap.faseActual(roadmap);
  if (fase && fase.calorias) perfil.caloriasManual = fase.calorias;

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

// ─── Fase activa hoy ───
function faseActualPerfil() {
  if (typeof cargarPerfil !== 'function') return null;
  const perfil = cargarPerfil();
  if (!perfil || !perfil.fatLossMode || !perfil.roadmap) return null;
  if (!window.NP_Roadmap || !window.NP_Roadmap.faseActual) return null;
  return window.NP_Roadmap.faseActual(perfil.roadmap);
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
// (ej: usuario entró en diet break pero el plan sigue a calorías de corte)
function planDesincronizado() {
  if (typeof cargarPerfil !== 'function') return false;
  const perfil = cargarPerfil();
  if (!perfil || !perfil.fatLossMode || !perfil.roadmap) return false;

  const fase = faseActualPerfil();
  if (!fase) return false;

  const caloriasFase = fase.calorias;
  const caloriasPerfil = perfil.caloriasManual;

  // Tolerancia de ±50 kcal para no disparar por rounding
  if (Math.abs(caloriasFase - caloriasPerfil) > 50) {
    return {
      desincronizado: true,
      caloriasActuales: caloriasPerfil,
      caloriasNuevaFase: caloriasFase,
      nombreFase: fase.nombre
    };
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

  perfil.caloriasManual = fase.calorias;
  if (typeof guardarPerfil === 'function') guardarPerfil(perfil);
  return perfil;
}

// ─── Exponer a window ───
if (typeof window !== 'undefined') {
  window.NP_FatLoss = {
    activar: activarFatLossMode,
    desactivar: desactivarFatLossMode,
    recalcular: recalcularRoadmap,
    overrideFase: aplicarOverrideFase,
    faseActual: faseActualPerfil,
    caloriasEfectivas: caloriasObjetivoEfectivas,
    proteinaTarget: proteinaTargetEfectiva,
    banner: informacionBanner,
    desincronizado: planDesincronizado,
    sincronizar: sincronizarConFaseActual
  };
}
