/* ============================================
   NutriPlan - Alcohol Calculator (v20260418ag)
   Log de bebidas + impacto semanal (oxidación grasa + síntesis proteica).
   Fuente de datos: NP_RoadmapData.ALCOHOL_BEBIDAS + ALCOHOL_IMPACTO.
   ============================================ */

const ALCOHOL_KEY = 'nutriplan_alcohol';

function cargarBebidas() {
  try {
    const raw = localStorage.getItem(ALCOHOL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function guardarBebidas(entries) {
  try {
    localStorage.setItem(ALCOHOL_KEY, JSON.stringify(entries));
    return true;
  } catch (e) { return false; }
}

// ─── Registrar bebida (append, no upsert — puede haber varias por día) ───
function registrar(entrada) {
  const f = entrada.fecha || new Date().toISOString().split('T')[0];
  const nueva = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    fecha: f,
    bebida: entrada.bebida || 'Personalizada',
    ml: Number(entrada.ml) || 0,
    kcal: Number(entrada.kcal) || 0,
    alcohol_pct: entrada.alcohol_pct != null ? Number(entrada.alcohol_pct) : null
  };
  const entries = cargarBebidas();
  entries.push(nueva);
  entries.sort((a, b) => a.fecha.localeCompare(b.fecha));
  guardarBebidas(entries);
  return nueva;
}

function eliminar(id) {
  const entries = cargarBebidas().filter(e => e.id !== id);
  guardarBebidas(entries);
  return entries;
}

function eliminarUltima(fecha) {
  const entries = cargarBebidas();
  // busca la última entrada de esa fecha y la quita
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].fecha === fecha) {
      entries.splice(i, 1);
      break;
    }
  }
  guardarBebidas(entries);
  return entries;
}

// ─── Kcal del alcohol puro (fórmula) ───
// ml × (pct_alcohol/100) × 0.789 g/ml (densidad etanol) × 7 kcal/g
// Nota: no incluye kcal de mezcladores ni azúcares añadidos.
function calcularKcalAlcohol(ml, alcoholPct) {
  const m = Number(ml) || 0;
  const p = Number(alcoholPct) || 0;
  if (m <= 0 || p <= 0) return 0;
  return Math.round(m * (p / 100) * 0.789 * 7);
}

// ─── Resumen últimos 7 días ───
function resumen7Dias() {
  const ahora = new Date();
  const hace7 = new Date(ahora);
  hace7.setDate(hace7.getDate() - 7);
  const limite = hace7.toISOString().split('T')[0];
  const recientes = cargarBebidas().filter(e => e.fecha >= limite);
  const diasConsumidos = new Set(recientes.map(e => e.fecha));
  return {
    tragos: recientes.length,
    kcal: recientes.reduce((s, e) => s + (e.kcal || 0), 0),
    dias: diasConsumidos.size,
    entries: recientes
  };
}

function kcalDelDia(fecha) {
  return cargarBebidas().filter(e => e.fecha === fecha).reduce((s, e) => s + (e.kcal || 0), 0);
}

// ─── Impacto según ALCOHOL_IMPACTO (4 escenarios) ───
// Heurística de clasificación:
//   0 tragos 7d → null
//   ≥ 4 días distintos con alcohol → crítico
//   kcal 7d ≥ 600 → alto
//   tragos 7d ≥ 3 → moderado
//   resto → mínimo
function impactoSemanal() {
  const r = resumen7Dias();
  if (r.tragos === 0) return null;
  const impactos = (window.NP_RoadmapData && window.NP_RoadmapData.ALCOHOL_IMPACTO) || [];
  let nivel;
  if (r.dias >= 4) nivel = 'critico';
  else if (r.kcal >= 600) nivel = 'alto';
  else if (r.tragos >= 3) nivel = 'moderado';
  else nivel = 'minimo';
  const match = impactos.find(i => i.nivel === nivel);
  return match ? Object.assign({}, match, { _resumen: r }) : null;
}

// ─── Horas restantes de pausa de oxidación desde última copa ───
function pausaOxidacionRestante() {
  const entries = cargarBebidas();
  if (entries.length === 0) return 0;
  const ultima = entries[entries.length - 1];
  const impacto = impactoSemanal();
  if (!impacto) return 0;
  const horasTotal = impacto.horasPausaOxidacion;
  // Asumir la última bebida a las 22:00 local del día registrado (heurística razonable)
  const fechaUltima = new Date(ultima.fecha + 'T22:00:00');
  const ahora = new Date();
  const horasPasadas = (ahora - fechaUltima) / 3600000;
  const restante = horasTotal - horasPasadas;
  return Math.max(0, Math.round(restante));
}

// ─── Presets desde la tabla oficial ───
function presets() {
  return (window.NP_RoadmapData && window.NP_RoadmapData.ALCOHOL_BEBIDAS) || [];
}

if (typeof window !== 'undefined') {
  window.NP_Alcohol = {
    cargar: cargarBebidas,
    registrar,
    eliminar,
    eliminarUltima,
    calcularKcalAlcohol,
    kcalDelDia,
    resumen7: resumen7Dias,
    impactoSemanal,
    pausaOxidacionRestante,
    presets
  };
}
