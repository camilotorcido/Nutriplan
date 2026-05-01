// ─── Fecha local (fallback si app-bundle no cargó primero) ───────────────
var _localDate = window._localDate || function(d) {
  var dt = d || new Date();
  return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
};
/* ============================================
   Calibrate — Gestión de LocalStorage
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
  _idbPut(STORAGE_KEYS.PLAN_SEMANAL, plan); // backup async fire-and-forget
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
  const hoy = _localDate();
  
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
  const limite = _localDate(hace14Dias);
  const historialFiltrado = historial.filter(h => h.fecha >= limite);
  
  guardarHistorialRecetas(historialFiltrado);
  return historialFiltrado;
}

// Obtener IDs de recetas usadas en los últimos 14 días
function obtenerRecetasUsadas14Dias() {
  const historial = cargarHistorialRecetas();
  const hace14Dias = new Date();
  hace14Dias.setDate(hace14Dias.getDate() - 14);
  const limite = _localDate(hace14Dias);
  
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

// ─── Migración UTF-8: reparar strings con encoding Latin-1 roto (one-shot) ───
// Ocurre cuando el archivo JS fue servido con Content-Type: text/plain (no UTF-8)
// y los chars multibyte del nombre se guardaron como bytes Latin-1 individuales.
// Ejemplo: 'proteína' → 'proteÃ­na' (Ã=0xC3, soft-hyphen=0xAD).
// Algoritmo: si todos los char codes ≤ 255, tratarlos como bytes y decodificar
// como UTF-8. Si el resultado no tiene chars de reemplazo (U+FFFD), es válido.
(function() {
  try {
    if (localStorage.getItem('nutriplan_utf8_repair_v1')) return; // ya corrido

    function _repararVal(v) {
      if (typeof v === 'string') {
        // Sólo actuar si hay chars en el rango Latin-1 extendido (0x80-0xFF)
        if (!/[-ÿ]/.test(v)) return v;
        try {
          const bytes = new Uint8Array(v.length);
          for (let i = 0; i < v.length; i++) {
            const c = v.charCodeAt(i);
            if (c > 255) return v; // char Unicode real → no es Latin-1 misread
            bytes[i] = c;
          }
          const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
          return decoded.includes('�') ? v : decoded;
        } catch { return v; }
      }
      if (Array.isArray(v)) return v.map(_repararVal);
      if (v && typeof v === 'object') {
        const r = {};
        for (const k in v) r[k] = _repararVal(v[k]);
        return r;
      }
      return v;
    }

    const CLAVES = [
      'nutriplan_comidas_externas',
      'nutriplan_adherencia',
      'nutriplan_plan_semanal',
      'nutriplan_perfil',
      'nutriplan_historial_recetas',
      'nutriplan_recetas_generadas'
    ];

    CLAVES.forEach(function(key) {
      var raw = localStorage.getItem(key);
      if (!raw || !/[-ÿ]/.test(raw)) return; // nada que reparar
      try {
        var fixed = _repararVal(JSON.parse(raw));
        localStorage.setItem(key, JSON.stringify(fixed));
      } catch (e) {}
    });

    localStorage.setItem('nutriplan_utf8_repair_v1', '1');
  } catch (e) {}
})();

// ─── Recetas vetadas (no mostrar nunca más) ───
var KEY_VETADAS = 'nutriplan_recetas_vetadas';
function cargarRecetasVetadas() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY_VETADAS) || '[]')); }
  catch (e) { return new Set(); }
}
function guardarRecetasVetadas(set) {
  try { localStorage.setItem(KEY_VETADAS, JSON.stringify(Array.from(set))); } catch (e) {}
}
function vetoReceta(id) {
  var s = cargarRecetasVetadas();
  s.add(id);
  guardarRecetasVetadas(s);
}
function quitarVetoReceta(id) {
  var s = cargarRecetasVetadas();
  s.delete(id);
  guardarRecetasVetadas(s);
}

// ─── Historial de alternativas por slot (dropdown "volver a esta opción") ───
var KEY_HISTORIAL_SLOTS = 'nutriplan_historial_slots';
function cargarHistorialSlots() {
  try { return JSON.parse(localStorage.getItem(KEY_HISTORIAL_SLOTS) || '{}'); }
  catch (e) { return {}; }
}
function guardarHistorialSlots(hist) {
  try { localStorage.setItem(KEY_HISTORIAL_SLOTS, JSON.stringify(hist)); } catch (e) {}
}
function pushHistorialSlot(dia, tipoComida, numSemana, receta) {
  if (!receta || !receta.id) return;
  var hist = cargarHistorialSlots();
  var key = dia + '_' + tipoComida + '_' + (numSemana || 1);
  var arr = hist[key] || [];
  if (arr.some(function(r) { return r.id === receta.id; })) return; // no duplicar
  arr.unshift(receta);
  hist[key] = arr.slice(0, 8);
  guardarHistorialSlots(hist);
}

// ─── IndexedDB: backup del plan semanal (fire-and-forget) ───
var _IDB_NAME = 'nutriplan_idb';
var _IDB_VER  = 1;
var _idbDb    = null;

function _idbOpen() {
  return new Promise(function(resolve, reject) {
    if (_idbDb) { resolve(_idbDb); return; }
    var req = indexedDB.open(_IDB_NAME, _IDB_VER);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
    };
    req.onsuccess = function(e) { _idbDb = e.target.result; resolve(_idbDb); };
    req.onerror   = function(e) { reject(e.target.error); };
  });
}

function _idbPut(key, value) {
  _idbOpen().then(function(db) {
    var tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(value, key);
  }).catch(function() {}); // silencioso — localStorage es el primario
}

// ─── Recuperar plan desde IDB si localStorage está vacío ───
function recuperarPlanDesdeIDB() {
  return _idbOpen().then(function(db) {
    return new Promise(function(resolve) {
      var tx  = db.transaction('kv', 'readonly');
      var req = tx.objectStore('kv').get(STORAGE_KEYS.PLAN_SEMANAL);
      req.onsuccess = function(e) { resolve(e.target.result || null); };
      req.onerror   = function()  { resolve(null); };
    });
  }).catch(function() { return null; });
}

// ─── Ratings de recetas (1–5 estrellas) ───
var KEY_RATINGS = 'nutriplan_ratings';
function cargarRatings() {
  try { return JSON.parse(localStorage.getItem(KEY_RATINGS) || '{}'); }
  catch (e) { return {}; }
}
function guardarRating(recetaId, estrellas) {
  var r = cargarRatings();
  r[recetaId] = Number(estrellas);
  try { localStorage.setItem(KEY_RATINGS, JSON.stringify(r)); } catch (e) {}
}

// ─── Comprimir historial de adherencia (retener sólo 30 días) ───
function trimirHistorialAdherencia() {
  try {
    var KEY_ADH = 'nutriplan_adherencia';
    var raw = localStorage.getItem(KEY_ADH);
    if (!raw) return;
    var data = JSON.parse(raw);
    var hace30 = new Date();
    hace30.setDate(hace30.getDate() - 30);
    var limite = _localDate(hace30);
    var trimmed = {};
    Object.keys(data).forEach(function(fecha) {
      if (fecha >= limite) trimmed[fecha] = data[fecha];
    });
    localStorage.setItem(KEY_ADH, JSON.stringify(trimmed));
  } catch (e) {}
}

// ─── Limpiar todo ───
function limpiarTodo() {
  Object.values(STORAGE_KEYS).forEach(clave => {
    if (clave !== STORAGE_KEYS.DARK_MODE) {
      eliminarDatos(clave);
    }
  });
  try { localStorage.removeItem(KEY_VETADAS); } catch(e) {}
  try { localStorage.removeItem(KEY_HISTORIAL_SLOTS); } catch(e) {}
  try { localStorage.removeItem(KEY_RATINGS); } catch(e) {}
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
  window.cargarRecetasVetadas = cargarRecetasVetadas;
  window.guardarRecetasVetadas = guardarRecetasVetadas;
  window.vetoReceta = vetoReceta;
  window.quitarVetoReceta = quitarVetoReceta;
  window.cargarHistorialSlots = cargarHistorialSlots;
  window.guardarHistorialSlots = guardarHistorialSlots;
  window.pushHistorialSlot = pushHistorialSlot;
  window.recuperarPlanDesdeIDB = recuperarPlanDesdeIDB;
  window.cargarRatings = cargarRatings;
  window.guardarRating = guardarRating;
  window.trimirHistorialAdherencia = trimirHistorialAdherencia;
}
