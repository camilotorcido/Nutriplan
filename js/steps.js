/* ============================================
   NutriPlan - Step Tracker (v20260418aa)
   Log manual de pasos diarios. Target dinámico según fase activa.
   ============================================ */

const STEPS_KEY = 'nutriplan_steps';

function cargarSteps() {
  try {
    const raw = localStorage.getItem(STEPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function guardarSteps(entries) {
  try {
    localStorage.setItem(STEPS_KEY, JSON.stringify(entries));
    return true;
  } catch (e) { return false; }
}

// ─── Registrar pasos del día (upsert) ───
function registrarPasos(fecha, pasos, target) {
  const f = fecha || new Date().toISOString().split('T')[0];
  const entries = cargarSteps();
  const idx = entries.findIndex(e => e.fecha === f);
  const nueva = { fecha: f, pasos: Number(pasos) || 0, target: target || null };
  if (idx >= 0) entries[idx] = nueva;
  else entries.push(nueva);
  entries.sort((a, b) => a.fecha.localeCompare(b.fecha));
  guardarSteps(entries);
  return nueva;
}

function eliminarPasos(fecha) {
  const entries = cargarSteps().filter(e => e.fecha !== fecha);
  guardarSteps(entries);
  return entries;
}

// ─── Sumar al contador de hoy ───
function sumarPasos(cantidad, target) {
  const hoy = new Date().toISOString().split('T')[0];
  const entries = cargarSteps();
  const actual = entries.find(e => e.fecha === hoy);
  const nuevos = (actual ? actual.pasos : 0) + (Number(cantidad) || 0);
  return registrarPasos(hoy, nuevos, target);
}

// ─── Target según fase activa del roadmap ───
function targetHoy() {
  if (!window.NP_FatLoss || !window.NP_FatLoss.faseActual) return null;
  const fase = window.NP_FatLoss.faseActual();
  return fase ? fase.targetPasos : null;
}

// ─── Entrada de hoy ───
function pasosDeHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  const entries = cargarSteps();
  const e = entries.find(x => x.fecha === hoy);
  return e || { fecha: hoy, pasos: 0, target: targetHoy() };
}

// ─── Promedio 7 días ───
function promedio7Dias() {
  const ahora = new Date();
  const hace7 = new Date(ahora);
  hace7.setDate(hace7.getDate() - 7);
  const limite = hace7.toISOString().split('T')[0];
  const filtradas = cargarSteps().filter(e => e.fecha >= limite);
  if (filtradas.length === 0) return 0;
  const suma = filtradas.reduce((s, e) => s + (e.pasos || 0), 0);
  return Math.round(suma / filtradas.length);
}

// ─── Racha: días consecutivos cumpliendo target (desde hoy hacia atrás) ───
function rachaActual() {
  const target = targetHoy();
  if (!target) return 0;
  const entries = cargarSteps().slice().reverse();
  let racha = 0;
  const hoy = new Date();
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const fechaEntrada = new Date(e.fecha + 'T00:00:00');
    const diasAtras = Math.floor((hoy - fechaEntrada) / 86400000);
    if (diasAtras !== racha) break;  // hay un gap
    if (e.pasos >= target) racha++;
    else break;
  }
  return racha;
}

// ─── Últimos N días para gráfico ───
function ultimosNDias(n) {
  n = n || 30;
  const ahora = new Date();
  const hace = new Date(ahora);
  hace.setDate(hace.getDate() - n);
  const limite = hace.toISOString().split('T')[0];
  return cargarSteps().filter(e => e.fecha >= limite);
}

if (typeof window !== 'undefined') {
  window.NP_Steps = {
    cargar: cargarSteps,
    registrar: registrarPasos,
    sumar: sumarPasos,
    eliminar: eliminarPasos,
    targetHoy,
    hoy: pasosDeHoy,
    promedio7: promedio7Dias,
    racha: rachaActual,
    ultimos: ultimosNDias
  };
}
