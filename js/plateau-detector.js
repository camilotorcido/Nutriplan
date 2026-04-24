/* ============================================
   NutriPlan - Plateau Detector (v20260418af)
   Detecta estancamiento de peso (≥14d con delta semanal <0.25 kg)
   y orquesta el protocolo de 6 pasos de Precision Nutrition.
   Depende de NP_BodyComp + NP_RoadmapData.PLATEAU_PROTOCOL.
   ============================================ */

const PLATEAU_KEY = 'nutriplan_plateau';
// Threshold: <|0.25 kg/sem| durante ≥14d se considera meseta (Precision Nutrition)
const PLATEAU_UMBRAL_KG_SEM = 0.25;
const PLATEAU_DIAS_MIN = 14;

function cargarEstado() {
  try {
    const raw = localStorage.getItem(PLATEAU_KEY);
    if (!raw) return defaultEstado();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultEstado(), parsed);
  } catch (e) { return defaultEstado(); }
}

function defaultEstado() {
  return {
    pasoActual: 0,            // 0 = sin paso activo; 1-6 = paso PLATEAU_PROTOCOL
    inicioPaso: null,         // YYYY-MM-DD cuando se aplicó el paso actual
    ultimoCambio: null,       // YYYY-MM-DD del último cambio real de peso (deltaSemanal > umbral)
    historial: []             // [{paso, inicio, fin, resultado: 'funciono'|'escalado'}]
  };
}

function guardarEstado(estado) {
  try {
    localStorage.setItem(PLATEAU_KEY, JSON.stringify(estado));
    return true;
  } catch (e) { return false; }
}

// ─── Detección pura: mira body-comp, reporta si hay plateau ───
// Retorna: { plateau: bool, deltaSemanal, diasVentana, promActual, promAnterior, datosSuficientes }
function detectar() {
  if (!window.NP_BodyComp || !window.NP_BodyComp.cargar) {
    return { plateau: false, datosSuficientes: false, razon: 'body-comp no disponible' };
  }
  const entries = window.NP_BodyComp.cargar();
  const conPeso = entries.filter(e => e.peso != null);
  if (conPeso.length < 4) {
    return { plateau: false, datosSuficientes: false, razon: 'menos de 4 registros de peso' };
  }

  const tend = window.NP_BodyComp.tendencia(entries, 'peso');
  if (!tend || tend.deltaSemanal == null) {
    return { plateau: false, datosSuficientes: false, razon: 'no hay ventana de comparación 7d vs 14-21d' };
  }

  // Ventana temporal real: primer registro vs último
  const primero = conPeso[0].fecha;
  const ultimo = conPeso[conPeso.length - 1].fecha;
  const diasVentana = Math.round((new Date(ultimo) - new Date(primero)) / 86400000);

  const plateau = Math.abs(tend.deltaSemanal) < PLATEAU_UMBRAL_KG_SEM && diasVentana >= PLATEAU_DIAS_MIN;

  return {
    plateau,
    datosSuficientes: true,
    deltaSemanal: tend.deltaSemanal,
    promActual: tend.actual,
    promAnterior: tend.anterior,
    diasVentana,
    umbral: PLATEAU_UMBRAL_KG_SEM
  };
}

// ─── Protocolo de 6 pasos (desde roadmap-data) ───
function protocolo() {
  const d = window.NP_RoadmapData && window.NP_RoadmapData.PLATEAU_PROTOCOL;
  return Array.isArray(d) ? d : [];
}

function pasoPorNumero(n) {
  const p = protocolo();
  return p.find(x => x.paso === n) || null;
}

// ─── Estado completo para UI ───
function estado() {
  const deteccion = detectar();
  const raw = cargarEstado();
  const pasoDef = raw.pasoActual > 0 ? pasoPorNumero(raw.pasoActual) : null;
  let diasEnPaso = null;
  if (raw.inicioPaso) {
    const hoy = new Date();
    const inicio = new Date(raw.inicioPaso + 'T00:00:00');
    diasEnPaso = Math.floor((hoy - inicio) / 86400000);
  }
  return {
    deteccion,
    pasoActual: raw.pasoActual,
    pasoDef,
    inicioPaso: raw.inicioPaso,
    diasEnPaso,
    historial: raw.historial || [],
    // Si detecta plateau y no hay paso activo → sugerir paso 1
    sugerenciaInicio: deteccion.plateau && raw.pasoActual === 0
  };
}

// ─── Aplicar paso N (arranca o salta) ───
function aplicarPaso(n) {
  const p = pasoPorNumero(n);
  if (!p) return null;
  const hoy = new Date().toISOString().split('T')[0];
  const raw = cargarEstado();
  // Si había paso anterior sin cerrar, lo archivamos como "escalado"
  if (raw.pasoActual > 0 && raw.pasoActual !== n && raw.inicioPaso) {
    raw.historial = raw.historial || [];
    raw.historial.push({
      paso: raw.pasoActual,
      inicio: raw.inicioPaso,
      fin: hoy,
      resultado: 'escalado'
    });
  }
  raw.pasoActual = n;
  raw.inicioPaso = hoy;
  guardarEstado(raw);
  return raw;
}

function avanzarPaso() {
  const raw = cargarEstado();
  const siguiente = Math.min(6, (raw.pasoActual || 0) + 1);
  return aplicarPaso(siguiente);
}

// ─── Marcar que el paso actual rompió la meseta ───
function marcarResuelto() {
  const hoy = new Date().toISOString().split('T')[0];
  const raw = cargarEstado();
  if (raw.pasoActual > 0 && raw.inicioPaso) {
    raw.historial = raw.historial || [];
    raw.historial.push({
      paso: raw.pasoActual,
      inicio: raw.inicioPaso,
      fin: hoy,
      resultado: 'funciono'
    });
  }
  raw.pasoActual = 0;
  raw.inicioPaso = null;
  raw.ultimoCambio = hoy;
  guardarEstado(raw);
  return raw;
}

// ─── Cancelar seguimiento (vuelve a estado inicial sin marcar éxito) ───
function cancelar() {
  const raw = cargarEstado();
  raw.pasoActual = 0;
  raw.inicioPaso = null;
  guardarEstado(raw);
  return raw;
}

// ─── Sugerencia de ajuste concreto para aplicar al plan ───
// Retorna { tipo: 'calorias'|'pasos'|'dietBreak'|'cardio'|'tracking', delta, descripcion }
function ajusteSugerido(n) {
  const p = pasoPorNumero(n);
  if (!p) return null;
  const roadmap = (typeof cargarPerfil === 'function') ? (cargarPerfil() || {}).roadmap : null;
  const tdee = roadmap ? roadmap.calculados.tdee : null;

  if (p.ajusteCalorias === 'tdee') {
    return { tipo: 'dietBreak', caloriasObjetivo: tdee, duracion: p.duracion, descripcion: p.detalle };
  }
  if (p.ajustePasos > 0) {
    return { tipo: 'pasos', delta: p.ajustePasos, duracion: p.duracion, descripcion: p.detalle };
  }
  if (p.ajusteCalorias && p.ajusteCalorias !== 0) {
    return { tipo: 'calorias', delta: p.ajusteCalorias, duracion: p.duracion, descripcion: p.detalle };
  }
  if (p.activaCardio) {
    return { tipo: 'cardio', duracion: p.duracion, descripcion: p.detalle };
  }
  return { tipo: 'tracking', duracion: p.duracion, descripcion: p.detalle };
}

if (typeof window !== 'undefined') {
  window.NP_Plateau = {
    detectar,
    estado,
    protocolo,
    pasoPorNumero,
    aplicarPaso,
    avanzarPaso,
    marcarResuelto,
    cancelar,
    ajusteSugerido,
    UMBRAL_KG_SEM: PLATEAU_UMBRAL_KG_SEM,
    DIAS_MIN: PLATEAU_DIAS_MIN
  };
}
