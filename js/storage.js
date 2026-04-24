/* ============================================
   NutriPlan - Gestión de LocalStorage
   Persistencia completa de datos de usuario
   MEJORAS: historial 14 días, dark mode
   ============================================ */

const STORAGE_KEYS = {
  PERFIL: "nutriplan_perfil",
  PLAN_SEMANAL: "nutriplan_plan_semanal",
  DESPENSA: "nutriplan_despensa",
  MACROS_CUSTOM: "nutriplan_macros_custom",
  HISTORIAL_RECETAS: "nutriplan_historial_recetas",
  DARK_MODE: "nutriplan_dark_mode"
};

// ─── Guardar datos en localStorage ───
function guardarDatos(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
    return true;
  } catch (e) {
    console.error("Error guardando en localStorage:", e);
    return false;
  }
}

// ─── Cargar datos de localStorage ───
function cargarDatos(clave) {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : null;
  } catch (e) {
    console.error("Error cargando de localStorage:", e);
    return null;
  }
}

// ─── Eliminar datos de localStorage ───
function eliminarDatos(clave) {
  try {
    localStorage.removeItem(clave);
    return true;
  } catch (e) {
    console.error("Error eliminando de localStorage:", e);
    return false;
  }
}

// ─── Guardar perfil de usuario ───
function guardarPerfil(perfil) {
  return guardarDatos(STORAGE_KEYS.PERFIL, perfil);
}

// ─── Cargar perfil de usuario ───
function cargarPerfil() {
  return cargarDatos(STORAGE_KEYS.PERFIL);
}

// ─── Guardar plan semanal ───
function guardarPlanSemanal(plan) {
  return guardarDatos(STORAGE_KEYS.PLAN_SEMANAL, plan);
}

// ─── Cargar plan semanal ───
function cargarPlanSemanal() {
  return cargarDatos(STORAGE_KEYS.PLAN_SEMANAL);
}

// ─── Guardar estado de despensa ───
function guardarDespensa(despensa) {
  return guardarDatos(STORAGE_KEYS.DESPENSA, despensa);
}

// ─── Cargar estado de despensa ───
function cargarDespensa() {
  return cargarDatos(STORAGE_KEYS.DESPENSA) || {};
}

// ─── Guardar macros personalizados ───
function guardarMacrosCustom(macros) {
  return guardarDatos(STORAGE_KEYS.MACROS_CUSTOM, macros);
}

// ─── Cargar macros personalizados ───
function cargarMacrosCustom() {
  return cargarDatos(STORAGE_KEYS.MACROS_CUSTOM);
}

// ─── MEJORA 4: Historial de recetas (14 días) ───
function guardarHistorialRecetas(historial) {
  return guardarDatos(STORAGE_KEYS.HISTORIAL_RECETAS, historial);
}

function cargarHistorialRecetas() {
  return cargarDatos(STORAGE_KEYS.HISTORIAL_RECETAS) || [];
}

// Agregar recetas usadas al historial con fecha
function agregarAlHistorial(planSemanal) {
  const historial = cargarHistorialRecetas();
  const hoy = new Date().toISOString().split('T')[0];
  
  // Recopilar IDs de recetas del plan
  Object.entries(planSemanal).forEach(([key, comidasDia]) => {
    if (key.startsWith('_') || typeof comidasDia !== 'object' || comidasDia === null) return;
    Object.values(comidasDia).forEach(comida => {
      if (comida && comida.id) {
        // Evitar duplicados del mismo día y receta
        const yaExiste = historial.some(h => h.fecha === hoy && h.receta_id === comida.id);
        if (!yaExiste) {
          historial.push({ fecha: hoy, receta_id: comida.id });
        }
      }
    });
  });
  
  // Limpiar entradas de más de 14 días
  const hace14Dias = new Date();
  hace14Dias.setDate(hace14Dias.getDate() - 14);
  const limite = hace14Dias.toISOString().split('T')[0];
  const historialFiltrado = historial.filter(h => h.fecha >= limite);
  
  guardarHistorialRecetas(historialFiltrado);
  return historialFiltrado;
}

// Obtener IDs de recetas usadas en los últimos 14 días
function obtenerRecetasUsadas14Dias() {
  const historial = cargarHistorialRecetas();
  const hace14Dias = new Date();
  hace14Dias.setDate(hace14Dias.getDate() - 14);
  const limite = hace14Dias.toISOString().split('T')[0];
  
  const ids = new Set();
  historial.filter(h => h.fecha >= limite).forEach(h => ids.add(h.receta_id));
  return ids;
}

// ─── MEJORA 5: Dark mode persistence ───
function guardarDarkMode(isDark) {
  return guardarDatos(STORAGE_KEYS.DARK_MODE, isDark);
}

function cargarDarkMode() {
  const val = cargarDatos(STORAGE_KEYS.DARK_MODE);
  return val === true;
}

// ─── Fase 7.2: cleanup one-shot de claves obsoletas (despensa inteligente) ───
try { ['nutriplan_fechas_compra', 'nutriplan_notif_ultima'].forEach(k => localStorage.removeItem(k)); } catch (e) {}

// ─── Limpiar todo ───
function limpiarTodo() {
  Object.values(STORAGE_KEYS).forEach(clave => {
    if (clave !== STORAGE_KEYS.DARK_MODE) {
      eliminarDatos(clave);
    }
  });
}

// ─── Exponer funciones a window para que el bundle compilado siempre las encuentre ───
// Sin esto, si IndexedDB cachea el bundle pero storage.js se carga después o falla,
// el App explota con "cargarPerfil is not defined".
if (typeof window !== 'undefined') {
  window.STORAGE_KEYS = STORAGE_KEYS;
  window.guardarDatos = guardarDatos;
  window.cargarDatos = cargarDatos;
  window.eliminarDatos = eliminarDatos;
  window.guardarPerfil = guardarPerfil;
  window.cargarPerfil = cargarPerfil;
  window.guardarPlanSemanal = guardarPlanSemanal;
  window.cargarPlanSemanal = cargarPlanSemanal;
  window.guardarDespensa = guardarDespensa;
  window.cargarDespensa = cargarDespensa;
  window.guardarMacrosCustom = guardarMacrosCustom;
  window.cargarMacrosCustom = cargarMacrosCustom;
  window.guardarHistorialRecetas = guardarHistorialRecetas;
  window.cargarHistorialRecetas = cargarHistorialRecetas;
  window.agregarAlHistorial = agregarAlHistorial;
  window.obtenerRecetasUsadas14Dias = obtenerRecetasUsadas14Dias;
  window.guardarDarkMode = guardarDarkMode;
  window.cargarDarkMode = cargarDarkMode;
  window.limpiarTodo = limpiarTodo;
}
