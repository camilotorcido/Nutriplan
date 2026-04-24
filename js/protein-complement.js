/* ============================================
   NutriPlan - Complemento proteico automático
   Calcula déficit vs target del día y sugiere batido/fuente proteica.
   Se activa solo si Fat Loss Mode está ON.
   ============================================ */

// ─── Sumar proteína consumida en las comidas de un día ───
function sumarProteinaDia(comidasDelDia) {
  if (!comidasDelDia || typeof comidasDelDia !== 'object') return 0;
  let total = 0;
  Object.entries(comidasDelDia).forEach(function(entry) {
    const key = entry[0], receta = entry[1];
    // Saltar claves meta (_numSemanas, etc.)
    if (key.charAt(0) === '_') return;
    if (receta && receta.macros && typeof receta.macros.proteinas === 'number') {
      total += receta.macros.proteinas;
    }
  });
  return total;
}

// ─── Sumar kcal consumidas en las comidas de un día ───
function sumarKcalDia(comidasDelDia) {
  if (!comidasDelDia || typeof comidasDelDia !== 'object') return 0;
  let total = 0;
  Object.entries(comidasDelDia).forEach(function(entry) {
    const key = entry[0], receta = entry[1];
    if (key.charAt(0) === '_') return;
    if (receta && typeof receta.calorias === 'number') {
      total += receta.calorias;
    }
  });
  return total;
}

// ─── Calcular complemento necesario ───
function calcularComplementoDiario(comidasDelDia, proteinaTargetG, fuenteKey) {
  const FUENTES = (window.NP_RoadmapData && window.NP_RoadmapData.FUENTES_PROTEICAS) || {};
  const fuente = FUENTES[fuenteKey] || FUENTES.whey || {
    nombre: 'Whey protein (1 scoop)', porcion: '30g',
    proteina: 25, kcal: 120, carbs: 3, grasas: 2
  };

  const proteinaConsumida = sumarProteinaDia(comidasDelDia);
  const kcalConsumidas = sumarKcalDia(comidasDelDia);
  const deficit = proteinaTargetG - proteinaConsumida;

  // Umbral mínimo: si el déficit es < 15g, no vale la pena agregar complemento
  if (deficit < 15) {
    return {
      proteinaConsumida: Math.round(proteinaConsumida),
      proteinaTarget: proteinaTargetG,
      deficit: Math.round(deficit),
      porcentajeTarget: Math.round((proteinaConsumida / proteinaTargetG) * 100),
      kcalConsumidas: Math.round(kcalConsumidas),
      complemento: null,
      razon: deficit <= 0 ? 'target_cumplido' : 'deficit_menor_15g'
    };
  }

  // Calcular porciones necesarias
  const porcionesExactas = deficit / fuente.proteina;
  const porcionesRedondeadas = Math.min(3, Math.ceil(porcionesExactas)); // cap a 3

  return {
    proteinaConsumida: Math.round(proteinaConsumida),
    proteinaTarget: proteinaTargetG,
    deficit: Math.round(deficit),
    porcentajeTarget: Math.round((proteinaConsumida / proteinaTargetG) * 100),
    kcalConsumidas: Math.round(kcalConsumidas),
    complemento: {
      fuenteKey: fuenteKey || 'whey',
      fuenteNombre: fuente.nombre,
      porcion: fuente.porcion,
      porciones: porcionesRedondeadas,
      proteinaAgregada: Math.round(fuente.proteina * porcionesRedondeadas),
      kcalAgregadas: Math.round(fuente.kcal * porcionesRedondeadas),
      carbsAgregados: Math.round((fuente.carbs || 0) * porcionesRedondeadas),
      grasasAgregadas: Math.round((fuente.grasas || 0) * porcionesRedondeadas),
      proteinaTotalDespues: Math.round(proteinaConsumida + fuente.proteina * porcionesRedondeadas),
      kcalTotalDespues: Math.round(kcalConsumidas + fuente.kcal * porcionesRedondeadas)
    },
    razon: 'deficit_proteico'
  };
}

// ─── Calcular complemento para toda la semana ───
function calcularComplementoSemana(semanaComidas, proteinaTargetG, fuenteKey) {
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const resultado = {};
  dias.forEach(function(dia) {
    if (semanaComidas[dia]) {
      resultado[dia] = calcularComplementoDiario(semanaComidas[dia], proteinaTargetG, fuenteKey);
    }
  });

  // Métricas agregadas
  const diasConComplemento = Object.values(resultado).filter(function(r) {
    return r.complemento !== null;
  }).length;

  const proteinaMediaDiaria = Object.values(resultado).reduce(function(sum, r) {
    return sum + r.proteinaConsumida;
  }, 0) / Math.max(1, Object.keys(resultado).length);

  return {
    dias: resultado,
    resumen: {
      diasConComplemento,
      diasTotales: Object.keys(resultado).length,
      proteinaMediaDiaria: Math.round(proteinaMediaDiaria),
      proteinaTarget: proteinaTargetG,
      adherencia: Math.round(((Object.keys(resultado).length - diasConComplemento) / Math.max(1, Object.keys(resultado).length)) * 100)
    }
  };
}

// ─── Verificar si el usuario tiene Fat Loss Mode activo ───
function fatLossModeActivo() {
  try {
    const perfil = (typeof cargarPerfil === 'function') ? cargarPerfil() : null;
    return !!(perfil && perfil.fatLossMode === true);
  } catch (e) {
    return false;
  }
}

// ─── Exponer a window ───
if (typeof window !== 'undefined') {
  window.NP_Protein = {
    calcularComplementoDiario,
    calcularComplementoSemana,
    sumarProteinaDia,
    sumarKcalDia,
    fatLossModeActivo
  };
}
