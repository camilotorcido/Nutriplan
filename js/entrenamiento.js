/* ============================================
   NutriPlan - Training Log (v20260418ad)
   Registro de sesiones de entreno (A/B/C/D) con cargas por ejercicio.
   Depende de window.NP_RoadmapData.ENTRENO_PROTOCOLO.
   ============================================ */

const TRAINING_KEY = 'nutriplan_training';

// ─── Entrada: { fecha, dia_tipo: 'A'|'B'|'C'|'D', ejercicios: [...], completado, notas? } ───
function cargarSesiones() {
  try {
    const raw = localStorage.getItem(TRAINING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function guardarSesiones(sesiones) {
  try {
    localStorage.setItem(TRAINING_KEY, JSON.stringify(sesiones));
    return true;
  } catch (e) { return false; }
}

// ─── Protocolo y scheduler ───
function tipoDiaSugerido(fecha) {
  const d = fecha ? new Date(fecha + 'T12:00:00') : new Date();
  const dow = d.getDay(); // 0=dom, 1=lun, ..., 6=sáb
  const ep = window.NP_RoadmapData && window.NP_RoadmapData.ENTRENO_PROTOCOLO;
  if (!ep || !ep.scheduleDefault) return 'descanso';
  return ep.scheduleDefault[dow] || 'descanso';
}

function protocoloDia(tipoDia) {
  const ep = window.NP_RoadmapData && window.NP_RoadmapData.ENTRENO_PROTOCOLO;
  if (!ep || !ep.dias || !ep.dias[tipoDia]) return null;
  return ep.dias[tipoDia];
}

function ejerciciosBase(tipoDia) {
  const d = protocoloDia(tipoDia);
  if (!d) return [];
  return d.ejercicios.map(e => ({
    nombre: e.nombre,
    equipo: e.equipo,
    nota: e.nota,
    setsEsperado: e.sets,
    repsEsperado: e.reps,
    peso: null,
    repsReales: null,
    done: false
  }));
}

// ─── Obtener o crear sesión para (fecha, tipo) ───
function obtenerSesion(fecha, tipoDia) {
  const f = fecha || new Date().toISOString().split('T')[0];
  const t = tipoDia || tipoDiaSugerido(f);
  if (t === 'descanso') return null;
  const sesiones = cargarSesiones();
  const existente = sesiones.find(s => s.fecha === f && s.dia_tipo === t);
  if (existente) {
    // Re-sincronizar con protocolo por si se agregaron ejercicios
    const base = ejerciciosBase(t);
    if (existente.ejercicios.length !== base.length) {
      const nombresExistentes = new Set(existente.ejercicios.map(e => e.nombre));
      base.forEach(b => {
        if (!nombresExistentes.has(b.nombre)) existente.ejercicios.push(b);
      });
    }
    return existente;
  }
  return {
    fecha: f,
    dia_tipo: t,
    ejercicios: ejerciciosBase(t),
    completado: false,
    notas: ''
  };
}

function guardarSesion(sesion) {
  if (!sesion || !sesion.fecha || !sesion.dia_tipo) return null;
  const sesiones = cargarSesiones();
  const idx = sesiones.findIndex(s => s.fecha === sesion.fecha && s.dia_tipo === sesion.dia_tipo);
  const total = sesion.ejercicios.length;
  const hechos = sesion.ejercicios.filter(e => e.done).length;
  const nueva = Object.assign({}, sesion, {
    completado: total > 0 && hechos === total
  });
  if (idx >= 0) sesiones[idx] = nueva;
  else sesiones.push(nueva);
  sesiones.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.dia_tipo.localeCompare(b.dia_tipo));
  guardarSesiones(sesiones);
  return nueva;
}

function eliminarSesion(fecha, tipoDia) {
  const filtradas = cargarSesiones().filter(s => !(s.fecha === fecha && s.dia_tipo === tipoDia));
  guardarSesiones(filtradas);
  return filtradas;
}

// ─── Progresión: último peso registrado para un ejercicio ───
function ultimoPeso(nombreEjercicio, fechaExcluida) {
  const sesiones = cargarSesiones().slice().reverse();
  for (const s of sesiones) {
    if (fechaExcluida && s.fecha === fechaExcluida) continue;
    const ej = s.ejercicios.find(e => e.nombre === nombreEjercicio && e.peso != null && Number(e.peso) > 0);
    if (ej) return { peso: ej.peso, fecha: s.fecha, tipoDia: s.dia_tipo, reps: ej.repsReales || ej.repsEsperado };
  }
  return null;
}

// ─── Histórico de pesos (últimas N entradas con peso) ───
function historicoEjercicio(nombreEjercicio, n) {
  const limite = n || 8;
  const out = [];
  const sesiones = cargarSesiones().slice().reverse();
  for (const s of sesiones) {
    const ej = s.ejercicios.find(e => e.nombre === nombreEjercicio && e.peso != null && Number(e.peso) > 0);
    if (ej) out.push({ fecha: s.fecha, peso: Number(ej.peso), reps: ej.repsReales || ej.repsEsperado });
    if (out.length >= limite) break;
  }
  return out.reverse();
}

// ─── Últimas N sesiones registradas ───
function ultimasSesiones(n) {
  const limite = n || 10;
  const s = cargarSesiones();
  return s.slice(-limite).reverse();
}

// ─── Resumen últimos 7 días ───
function resumen7Dias() {
  const ahora = new Date();
  const hace7 = new Date(ahora);
  hace7.setDate(hace7.getDate() - 7);
  const limite = hace7.toISOString().split('T')[0];
  const filtradas = cargarSesiones().filter(s => s.fecha >= limite);
  const completadas = filtradas.filter(s => s.completado).length;
  const porTipo = { A: 0, B: 0, C: 0, D: 0 };
  filtradas.forEach(s => { if (porTipo[s.dia_tipo] != null) porTipo[s.dia_tipo]++; });
  return {
    entrenos: filtradas.length,
    completados: completadas,
    porTipo,
    cumplimiento: filtradas.length > 0 ? Math.round((completadas / filtradas.length) * 100) : 0
  };
}

// ─── Delta de fuerza: compara peso promedio últimas 2 sesiones con 2 previas ───
function tendenciaFuerza(nombreEjercicio) {
  const hist = historicoEjercicio(nombreEjercicio, 6);
  if (hist.length < 3) return null;
  const recientes = hist.slice(-2);
  const previas = hist.slice(0, -2);
  if (previas.length === 0) return null;
  const avgRec = recientes.reduce((s, h) => s + h.peso, 0) / recientes.length;
  const avgPrev = previas.reduce((s, h) => s + h.peso, 0) / previas.length;
  const delta = avgRec - avgPrev;
  const pct = avgPrev > 0 ? (delta / avgPrev) * 100 : 0;
  return {
    avgReciente: Math.round(avgRec * 10) / 10,
    avgPrevio: Math.round(avgPrev * 10) / 10,
    delta: Math.round(delta * 10) / 10,
    pct: Math.round(pct * 10) / 10
  };
}

if (typeof window !== 'undefined') {
  window.NP_Training = {
    cargar: cargarSesiones,
    tipoDiaSugerido,
    protocoloDia,
    obtener: obtenerSesion,
    guardar: guardarSesion,
    eliminar: eliminarSesion,
    ultimoPeso,
    historico: historicoEjercicio,
    ultimas: ultimasSesiones,
    resumen7: resumen7Dias,
    tendenciaFuerza
  };
}
