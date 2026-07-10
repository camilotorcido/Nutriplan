// ─── Fecha local (fallback si app-bundle no cargó primero) ───────────────
var _localDate = window._localDate || function(d) {
  var dt = d || new Date();
  return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
};
/* ============================================
   Calibrate — Body Composition Tracking (v20260418aa)
   Log diario de peso + log semanal de medidas.
   Calcula Navy BF%, promedio 7 días, tendencia vs peso inicial.
   ============================================ */

const BODY_COMP_KEY = 'nutriplan_body_comp';

// ─── Entrada: { fecha: 'YYYY-MM-DD', peso?, cintura?, cuello?, cadera?, muslo?, bf? } ───
function cargarBodyComp() {
  try {
    const raw = localStorage.getItem(BODY_COMP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function guardarBodyComp(entries) {
  try {
    localStorage.setItem(BODY_COMP_KEY, JSON.stringify(entries));
    return true;
  } catch (e) { return false; }
}

// ─── Registrar entrada del día (upsert: sobrescribe si ya existe para esa fecha) ───
function registrarEntrada(entrada) {
  const fecha = entrada.fecha || _localDate();
  const entries = cargarBodyComp();
  const idx = entries.findIndex(e => e.fecha === fecha);

  const nueva = Object.assign({}, idx >= 0 ? entries[idx] : {}, entrada, { fecha });
  // Auto-calcular Navy BF% si hay cintura + cuello y sabemos genero+altura
  if (nueva.cintura && nueva.cuello && nueva._genero && nueva._altura) {
    const bfCalc = calcularBFNavy(nueva._genero, nueva._altura, nueva.cintura, nueva.cuello, nueva.cadera);
    if (bfCalc != null) {
      nueva.bfCalculado = Math.round(bfCalc * 10) / 10;
      // Si el usuario no puso bf manual, usar el calculado
      if (nueva.bf == null) nueva.bf = nueva.bfCalculado;
    }
  }
  // Limpiar campos transitorios usados solo para el cálculo
  delete nueva._genero;
  delete nueva._altura;

  if (idx >= 0) entries[idx] = nueva;
  else entries.push(nueva);

  entries.sort((a, b) => a.fecha.localeCompare(b.fecha));
  guardarBodyComp(entries);
  return nueva;
}

function eliminarEntrada(fecha) {
  const entries = cargarBodyComp().filter(e => e.fecha !== fecha);
  guardarBodyComp(entries);
  return entries;
}

// ─── Navy BF% (duplicado de roadmap-generator.js para independencia) ───
function calcularBFNavy(genero, altura, cintura, cuello, cadera) {
  if (!altura || !cintura || !cuello) return null;
  const g = (genero === 'F' || genero === 'femenino') ? 'F' : 'M';
  let bf = null;
  try {
    if (g === 'M') {
      if (cintura - cuello <= 0) return null; // log10 de ≤0 daría NaN silencioso
      const denom = 1.0324 - 0.19077 * Math.log10(cintura - cuello) + 0.15456 * Math.log10(altura);
      bf = 495 / denom - 450;
    } else {
      if (!cadera) return null;
      if (cintura + cadera - cuello <= 0) return null;
      const denom = 1.29579 - 0.35004 * Math.log10(cintura + cadera - cuello) + 0.22100 * Math.log10(altura);
      bf = 495 / denom - 450;
    }
  } catch (e) { return null; }
  return (Number.isFinite(bf) && bf > 1 && bf < 75) ? bf : null;
}

// ─── Promedio móvil de N días sobre un campo ───
function promedioMovil(entries, campo, dias) {
  const ahora = new Date();
  const limite = new Date(ahora);
  limite.setDate(limite.getDate() - dias);
  const limiteIso = _localDate(limite);

  const filtradas = entries.filter(e => e.fecha >= limiteIso && e[campo] != null);
  if (filtradas.length === 0) return null;
  const suma = filtradas.reduce((s, e) => s + e[campo], 0);
  return Math.round((suma / filtradas.length) * 10) / 10;
}

// ─── Días desde epoch de una fecha ISO (para promediar fechas) ───
function _epochDia(fechaIso) {
  return Math.round(new Date(fechaIso + 'T00:00:00').getTime() / 86400000);
}

// ─── Tendencia: promedio últimos 7d vs promedio ventana 14-21d atrás ───
// La tasa semanal se calcula con la distancia REAL entre los puntos medios de las
// ventanas (según las fechas de los registros usados), no asumiendo 14 días fijos.
function tendencia(entries, campo) {
  const avgActual = promedioMovil(entries, campo, 7);
  if (avgActual == null) return null;

  const ahora = new Date();
  const hace21 = new Date(ahora);
  hace21.setDate(hace21.getDate() - 21);
  const hace14 = new Date(ahora);
  hace14.setDate(hace14.getDate() - 14);
  const hace7 = new Date(ahora);
  hace7.setDate(hace7.getDate() - 7);
  const iso21 = _localDate(hace21);
  const iso14 = _localDate(hace14);
  const iso7 = _localDate(hace7);

  const actuales = entries.filter(e => e.fecha >= iso7 && e[campo] != null);
  const anteriores = entries.filter(e => e.fecha >= iso21 && e.fecha < iso14 && e[campo] != null);
  if (anteriores.length === 0) {
    return { actual: avgActual, delta: null, deltaSemanal: null, nActual: actuales.length, nAnterior: 0 };
  }
  const avgAnterior = anteriores.reduce((s, e) => s + e[campo], 0) / anteriores.length;
  const delta = avgActual - avgAnterior;

  // Punto medio real de cada ventana (promedio de fechas de los registros)
  const midActual = actuales.length > 0
    ? actuales.reduce((s, e) => s + _epochDia(e.fecha), 0) / actuales.length
    : _epochDia(_localDate(ahora));
  const midAnterior = anteriores.reduce((s, e) => s + _epochDia(e.fecha), 0) / anteriores.length;
  const diasEntre = midActual - midAnterior;
  // Con menos de 4 días de separación real, la tasa semanal no es confiable
  const deltaSemanal = diasEntre >= 4 ? (delta / diasEntre) * 7 : null;

  return {
    actual: avgActual,
    anterior: Math.round(avgAnterior * 10) / 10,
    delta: Math.round(delta * 100) / 100,
    deltaSemanal: deltaSemanal != null ? Math.round(deltaSemanal * 100) / 100 : null,
    diasEntreVentanas: Math.round(diasEntre * 10) / 10,
    nActual: actuales.length,
    nAnterior: anteriores.length
  };
}

// ─── Última entrada con un campo específico ───
function ultimaEntrada(entries, campo) {
  if (!entries || entries.length === 0) return null;
  if (!campo) return entries[entries.length - 1];
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i][campo] != null) return entries[i];
  }
  return null;
}

// ─── Progreso vs roadmap ───
function progresoVsRoadmap() {
  const perfil = typeof cargarPerfil === 'function' ? cargarPerfil() : null;
  if (!perfil || !perfil.roadmap) return null;

  const entries = cargarBodyComp();
  const pesoActual = promedioMovil(entries, 'peso', 7);

  const roadmap = perfil.roadmap;
  const pesoInicial = roadmap.inputs.peso;
  const pesoTarget = roadmap.calculados.pesoTarget;
  const bfInicial = roadmap.calculados.bfActual;
  const bfTarget = roadmap.calculados.bfTarget;

  const ultimaBF = ultimaEntrada(entries, 'bf');
  const bfActual = ultimaBF ? ultimaBF.bf : null;

  const peso = pesoActual != null ? pesoActual : pesoInicial;
  const kgPerdidos = pesoInicial - peso;
  const kgTotal = pesoInicial - pesoTarget;
  const pctPeso = kgTotal > 0 ? Math.max(0, Math.min(100, (kgPerdidos / kgTotal) * 100)) : 0;

  let pctBF = null;
  if (bfActual != null) {
    const puntosBFPerdidos = bfInicial - bfActual;
    const puntosBFTotal = bfInicial - bfTarget;
    pctBF = puntosBFTotal > 0 ? Math.max(0, Math.min(100, (puntosBFPerdidos / puntosBFTotal) * 100)) : 0;
  }

  return {
    pesoInicial,
    pesoTarget,
    pesoActual: peso,
    pesoActualEsReal: pesoActual != null,
    kgPerdidos: Math.round(kgPerdidos * 10) / 10,
    kgRestantes: Math.round((peso - pesoTarget) * 10) / 10,
    pctPeso: Math.round(pctPeso),
    bfInicial,
    bfTarget,
    bfActual,
    pctBF: pctBF != null ? Math.round(pctBF) : null,
    tendencia: tendencia(entries, 'peso')
  };
}

// ─── Exponer a window ───
if (typeof window !== 'undefined') {
  window.NP_BodyComp = {
    cargar: cargarBodyComp,
    registrar: registrarEntrada,
    eliminar: eliminarEntrada,
    promedio: promedioMovil,
    tendencia,
    ultima: ultimaEntrada,
    progreso: progresoVsRoadmap,
    calcularBFNavy
  };
}
