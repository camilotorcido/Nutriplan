/* ============================================
   NutriPlan - Sistema de adherencia
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
      return true;
    } catch (e) {
      console.error('[Adherencia] Error guardando:', e);
      return false;
    }
  }

  function fechaISO(date) {
    return date.toISOString().split('T')[0];
  }

  // Obtener la fecha correspondiente al día de la semana activo
  // Devuelve la fecha del último día coincidente (hoy si es ese día, o el más reciente)
  function fechaParaDia(diaNombre, numSemana) {
    const DIAS_NUM = { Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Domingo: 0 };
    const hoy = new Date();
    const diaActual = hoy.getDay();
    const diaObj = DIAS_NUM[diaNombre];
    if (diaObj === undefined) return fechaISO(hoy);

    // Calcular offset: el día objetivo respecto a hoy (semana actual)
    let offset = diaObj - diaActual;
    if (diaObj === 0) offset = 7 - diaActual; // Domingo al final de la semana
    if (offset > 0) offset -= 7; // mover a la semana pasada si aún no ha pasado esta semana

    // Semanas adicionales
    if (numSemana && numSemana > 1) {
      offset += (numSemana - 1) * 7;
    }

    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + offset);
    return fechaISO(fecha);
  }

  function marcarComida(dia, tipoComida, comido, datosExtra, numSemana) {
    const data = cargar();
    const fecha = fechaParaDia(dia, numSemana);
    if (!data[fecha]) data[fecha] = {};
    const key = `${dia}:${tipoComida}`;
    data[fecha][key] = {
      comido: comido,
      timestamp: Date.now(),
      kcal_plan: datosExtra?.kcal_plan || 0,
      proteinas_plan: datosExtra?.proteinas_plan || 0,
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

  function calcularAdherenciaSemanal(numSemana) {
    const data = cargar();
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
        porcentaje: total > 0 ? Math.round((cumplidos / total) * 100) : null
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
    fechaParaDia: fechaParaDia
  };

  console.log('[Adherencia] Sistema de registro cargado');
})();
