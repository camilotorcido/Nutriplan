// ─── Fecha local (fallback si app-bundle no cargó primero) ───────────────
var _localDate = window._localDate || function(d) {
  var dt = d || new Date();
  return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
};
/* ============================================
   Calibrate — Sistema de adherencia
   Registro "comí/no comí" + dashboard histórico
   ============================================ */

(function cargarAdherencia() {
  const STORAGE_KEY = 'nutriplan_adherencia';

  // Estructura:
  // {
  //   "2026-04-17": {
  //     "Lunes:desayuno": { comido: true, timestamp: 1681..., kcal_plan: 450, nombre: "..." },
  //     "Lunes:almuerzo": { comido: false, ... }
  //   },
  //   "2026-04-18": {...}
  // }

  function cargar() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function guardar(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      _subirAdherencia();
      return true;
    } catch (e) {
      console.error('[Adherencia] Error guardando:', e);
      return false;
    }
  }

  function fechaISO(date) {
    return _localDate(date);
  }

  function _lunesDeFecha(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }

  function _planGuardado() {
    try {
      var raw = localStorage.getItem('nutriplan_plan_semanal');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // Única fórmula de fecha del plan: lunes de creación + (semana - 1) * 7 + día.
  // Sin fecha de creación, la semana 1 es la semana calendario actual.
  // Una semana 0 (o menor) cae en la semana anterior: Hoy, al retroceder 7 días, no escribe hoy.
  function fechaParaDia(diaNombre, numSemana, planNorm) {
    var DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    var idx = DIAS.indexOf(diaNombre);
    if (idx < 0) return fechaISO(new Date());
    var plan = planNorm || _planGuardado();
    var sem = (numSemana === 0 || numSemana) ? numSemana : 1;
    if (plan && plan._fechaCreacion) {
      var lunesInicio = _lunesDeFecha(new Date(plan._fechaCreacion + 'T00:00:00'));
      var fecha = new Date(lunesInicio);
      fecha.setDate(lunesInicio.getDate() + (sem - 1) * 7 + idx);
      return fechaISO(fecha);
    }
    var hoy = new Date();
    var idxHoy = (hoy.getDay() + 6) % 7;
    var fechaCal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    fechaCal.setDate(fechaCal.getDate() + (idx - idxHoy) + (sem - 1) * 7);
    return fechaISO(fechaCal);
  }

  function _subirAdherencia() {
    try {
      if (window.NP_CloudStorage && typeof window.NP_CloudStorage.syncNow === 'function') {
        window.NP_CloudStorage.syncNow(STORAGE_KEY);
      }
    } catch (e) {}
  }

  function marcarComida(dia, tipoComida, comido, datosExtra, numSemana) {
    const data = cargar();
    const fecha = fechaParaDia(dia, numSemana);
    if (!data[fecha]) data[fecha] = {};
    const key = `${dia}:${tipoComida}`;
    data[fecha][key] = {
      comido: comido,
      timestamp: Date.now(),
      // id de la receta del plan: necesario para que el push de cierre del día
      // (sendEveningPush) pueda cruzar contra nutriplan_ratings
      id: datosExtra?.id || null,
      kcal_plan: datosExtra?.kcal_plan || 0,
      proteinas_plan: datosExtra?.proteinas_plan || 0,
      // Macros completos del plan (base del TDEE adaptativo: lo comido = lo planificado
      // salvo registro externo que lo reemplace)
      carbohidratos_plan: datosExtra?.carbohidratos_plan || 0,
      grasas_plan: datosExtra?.grasas_plan || 0,
      nombre: datosExtra?.nombre || '',
      semana: numSemana || 1
    };
    guardar(data);
    return data;
  }

  function obtenerEstado(dia, tipoComida, numSemana) {
    const data = cargar();
    const fecha = fechaParaDia(dia, numSemana);
    const key = `${dia}:${tipoComida}`;
    return data[fecha]?.[key] || null;
  }

  // ─── Días libres (B2): un día puntual sin conteo estricto ni castigo ───
  // Estructura: { "YYYY-MM-DD": { tipo: 'libre'|'restaurante', timestamp } }
  const DIAS_LIBRES_KEY = 'nutriplan_dias_libres';

  function cargarDiasLibres() {
    try {
      const raw = localStorage.getItem(DIAS_LIBRES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function esDiaLibre(fecha) {
    const f = fecha || fechaISO(new Date());
    return !!cargarDiasLibres()[f];
  }

  // tipo: 'libre' | 'restaurante' | null (null lo desactiva)
  function setDiaLibre(fecha, tipo) {
    const f = fecha || fechaISO(new Date());
    const data = cargarDiasLibres();
    if (tipo) data[f] = { tipo: tipo, timestamp: Date.now() };
    else delete data[f];
    try { localStorage.setItem(DIAS_LIBRES_KEY, JSON.stringify(data)); } catch (e) {}
    return data;
  }

  function calcularAdherenciaSemanal(numSemana) {
    const data = cargar();
    const libres = cargarDiasLibres();
    const hoy = new Date();
    const diaActual = hoy.getDay();
    const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Rango: semana actual (o pasada si numSemana > 1)
    let registros = 0;
    let cumplidos = 0;
    let kcalPlan = 0;
    let kcalCumplidas = 0;

    for (let i = 6; i >= 0; i--) {
      const f = new Date(hoy);
      f.setDate(hoy.getDate() - i);
      if (numSemana && numSemana > 1) f.setDate(f.getDate() - (numSemana - 1) * 7);
      const fechaStr = fechaISO(f);
      if (libres[fechaStr]) continue; // día libre: fuera del conteo, ni suma ni castiga
      const dia = data[fechaStr];
      if (!dia) continue;

      Object.values(dia).forEach(entry => {
        registros++;
        if (entry.comido) {
          cumplidos++;
          kcalCumplidas += entry.kcal_plan || 0;
        }
        kcalPlan += entry.kcal_plan || 0;
      });
    }

    return {
      registros_total: registros,
      cumplidos: cumplidos,
      no_cumplidos: registros - cumplidos,
      porcentaje: registros > 0 ? Math.round((cumplidos / registros) * 100) : 0,
      kcal_plan: Math.round(kcalPlan),
      kcal_cumplidas: Math.round(kcalCumplidas),
      kcal_perdidas: Math.round(kcalPlan - kcalCumplidas)
    };
  }

  function obtenerHistorialDias(dias) {
    dias = dias || 7;
    const data = cargar();
    const libres = cargarDiasLibres();
    const hoy = new Date();
    const resultado = [];

    for (let i = dias - 1; i >= 0; i--) {
      const f = new Date(hoy);
      f.setDate(hoy.getDate() - i);
      const fechaStr = fechaISO(f);
      const dia = data[fechaStr] || {};

      let total = 0, cumplidos = 0;
      Object.values(dia).forEach(e => {
        total++;
        if (e.comido) cumplidos++;
      });

      resultado.push({
        fecha: fechaStr,
        dia_semana: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][f.getDay()],
        total: total,
        cumplidos: cumplidos,
        diaLibre: !!libres[fechaStr],
        porcentaje: libres[fechaStr] ? null : (total > 0 ? Math.round((cumplidos / total) * 100) : null)
      });
    }

    return resultado;
  }

  function limpiarAdherencia() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Exponer a window
  window.adherencia = {
    marcar: marcarComida,
    estado: obtenerEstado,
    semanal: calcularAdherenciaSemanal,
    historial: obtenerHistorialDias,
    limpiar: limpiarAdherencia,
    fechaParaDia: fechaParaDia,
    esDiaLibre: esDiaLibre,
    setDiaLibre: setDiaLibre,
    diasLibres: cargarDiasLibres
  };

  console.log('[Adherencia] Sistema de registro cargado');
})();
