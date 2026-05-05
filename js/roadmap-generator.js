// ─── Fecha local (fallback si app-bundle no cargó primero) ───────────────
var _localDate = window._localDate || function(d) {
  var dt = d || new Date();
  return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
};
/* ============================================
   Calibrate — Motor de generación de Fat Loss Roadmap
   Puro: inputs del wizard → array de fases dinámicas
   Sin side effects, sin dependencias de otros módulos.
   ============================================ */

// ─── Cálculos base ───

function calcularBMRFatLoss(peso, altura, edad, genero) {
  // Mifflin-St Jeor
  const base = 10 * peso + 6.25 * altura - 5 * edad;
  return genero === 'F' ? base - 161 : base + 5;
}

function calcularTDEEFatLoss(bmr, factorActividad) {
  // Redondeo a múltiplos de 50 para limpieza visual
  const raw = bmr * factorActividad;
  return Math.round(raw / 50) * 50;
}

// Navy method para % grasa corporal
// Hombres: 495 / (1.0324 - 0.19077 × log10(cintura − cuello) + 0.15456 × log10(altura)) − 450
// Mujeres: 495 / (1.29579 - 0.35004 × log10(cintura + cadera − cuello) + 0.22100 × log10(altura)) − 450
function calcularBFNavy(genero, altura, cintura, cuello, cadera) {
  if (!altura || !cintura || !cuello) return null;
  try {
    if (genero === 'M') {
      const denom = 1.0324 - 0.19077 * Math.log10(cintura - cuello) + 0.15456 * Math.log10(altura);
      return 495 / denom - 450;
    } else {
      if (!cadera) return null;
      const denom = 1.29579 - 0.35004 * Math.log10(cintura + cadera - cuello) + 0.22100 * Math.log10(altura);
      return 495 / denom - 450;
    }
  } catch (e) {
    return null;
  }
}

// ─── Presets de tasa de pérdida ───
const TASA_PERDIDA_PRESETS_FL = {
  conservadora: { kgPorSemana: 0.4, deficitKcal: 300, etiqueta: 'Conservadora', desc: 'Lenta y segura. Cero pérdida muscular.' },
  moderada:     { kgPorSemana: 0.6, deficitKcal: 450, etiqueta: 'Moderada',     desc: 'Balance óptimo. Recomendada por default.' },
  agresiva:     { kgPorSemana: 0.8, deficitKcal: 600, etiqueta: 'Agresiva',     desc: 'Rápida. Exige disciplina alta y más riesgo muscular.' }
};

// ─── Nombres y focos de fases según cantidad de bloques ───
function _bloqueNombre(indice, total) {
  if (total === 1) return 'Fase Única';
  if (total === 2) return ['Fase 1: Fundación', 'Fase 2: Cierre'][indice];
  if (total === 3) return ['Fase 1: Fundación', 'Fase 2: Profundizar', 'Fase 3: Last Mile'][indice];
  return 'Fase ' + (indice + 1);
}

function _bloqueFoco(indice, total) {
  if (total === 1) return 'Sostener el déficit y los hábitos durante todo el proceso.';
  const focos = [
    'Establecer hábitos, calibrar hambre y pasos. Proteína innegociable todos los días.',
    'Momentum sostenido. Ajustar pasos al alza. Primeros signos de definición.',
    'Paciencia máxima. Los últimos puntos de BF son los más lentos. Aumentar cardio y disciplina.'
  ];
  return focos[Math.min(indice, focos.length - 1)];
}

// ─── Prescripción de entrenamiento por fase (basada en evidencia) ─────────
// Investigación: D:\Claude\04 - Outputs\Calibrate\investigacion_ejercicio_deficit_calorico.md
// Fuentes:
//   Lafontant et al. (2025) — modalidad RT/AT/CT, meta-análisis 36 RCTs
//   Helms, Aragon & Fitschen (2014) — volumen/intensidad/tasa pérdida atletas naturales
//   Trexler, Smith-Ryan & Norton (2014) — adaptación metabólica, NEAT, refeeds
//   Mikulic et al. (2021) — sRPE como métrica de fatiga (vs HR)
//   Melin et al. — Energy Availability (umbrales LEA subclínica/clínica)
function _prescripcionEntrenamiento(indice, total, esDietBreak) {
  if (esDietBreak) {
    return {
      modalidad: 'CT',
      modalidadLabel: 'Mantenimiento (sin cut)',
      volumenSets: '10-12 sets/grupo muscular/sesión',
      frecuenciaSemanal: 4,
      intensidadPct1RM: '70-80%',
      rpeObjetivo: '8-10',
      cardioMinSemana: 60,
      cardioTipo: 'Opcional · LISS preferente',
      eaMinKcalKgFFM: 45,
      foco: 'Glucógeno lleno permite sesiones más pesadas. Aprovechar para acumular volumen sin fatiga del déficit.',
      redFlags: ['Subida de peso > 2 kg en 14 días (revisar superávit, no debería pasar de mantenimiento)']
    };
  }

  const esFundacion = indice === 0;
  const esLastMile = total > 1 && indice === total - 1;

  if (esFundacion && total === 1) {
    // Fase única — balance entre los tres extremos
    return {
      modalidad: 'CT',
      modalidadLabel: 'Concurrente (fuerza + cardio)',
      volumenSets: '6-9 sets/grupo muscular/sesión',
      frecuenciaSemanal: 4,
      intensidadPct1RM: '70-80%',
      rpeObjetivo: '7-8',
      cardioMinSemana: 90,
      cardioTipo: 'LISS o HIIT · igual eficacia si gasto se iguala',
      eaMinKcalKgFFM: 40,
      foco: 'CT maximiza pérdida de grasa sin canibalizar masa magra. Cardio: timing libre (mismo día o separado, da igual).',
      redFlags: [
        'Caída > 5% en lifts clave en 2 semanas seguidas',
        'sRPE subiendo > 1 punto sin cambios en programa',
        'Pasos diarios cayendo > 20% sin razón (NEAT crashing)'
      ]
    };
  }

  if (esFundacion) {
    return {
      modalidad: 'CT',
      modalidadLabel: 'Concurrente (fuerza + cardio)',
      volumenSets: '6-9 sets/grupo muscular/sesión',
      frecuenciaSemanal: 4,
      intensidadPct1RM: '70-80%',
      rpeObjetivo: '7-8',
      cardioMinSemana: 90,
      cardioTipo: 'LISS o HIIT · igual eficacia si gasto se iguala',
      eaMinKcalKgFFM: 40,
      foco: 'Establecer base. CT supera a RT puro en pérdida de grasa absoluta y mantiene FFM si el RT está bien programado.',
      redFlags: [
        'Caída > 5% en lifts clave en 2 semanas',
        'sRPE subiendo > 1 punto sin cambios',
        'Pasos diarios cayendo > 20% (NEAT crashing)'
      ]
    };
  }

  if (esLastMile) {
    return {
      modalidad: 'RT',
      modalidadLabel: 'Fuerza pura (RT prioritario)',
      volumenSets: '5-7 sets/grupo (taper −25 a −30%)',
      frecuenciaSemanal: 4,
      intensidadPct1RM: '70-80% (mantener cargas)',
      rpeObjetivo: '7-8 (evitar fallo crónico, controla cortisol)',
      cardioMinSemana: 30,
      cardioTipo: 'Mínimo · solo LISS si peso se estanca',
      eaMinKcalKgFFM: 35,
      foco: 'A baja grasa el AT canibaliza FFM. RT puro preserva masa magra. Antes de subir cardio: subir carbos para reducir el déficit.',
      redFlags: [
        'EA estimada < 30 kcal/kg FFM (LEA clínica)',
        'Bradicardia, hipotensión, libido caída, sueño deteriorado',
        'Caída > 10% en lifts → forzar diet break o pausar fase'
      ]
    };
  }

  // Bloque intermedio — déficit más profundo
  return {
    modalidad: 'CT-RT',
    modalidadLabel: 'Concurrente con RT prioritario',
    volumenSets: '6-9 sets/grupo (bajar 20-30% si sRPE sube)',
    frecuenciaSemanal: 4,
    intensidadPct1RM: '70-80%',
    rpeObjetivo: '7-8',
    cardioMinSemana: 60,
    cardioTipo: 'LISS preferente (menos interference)',
    eaMinKcalKgFFM: 38,
    foco: 'Migrar hacia RT-prioritario. Reducir cardio si fatiga sube. Aumentar minutos solo si peso se estanca.',
    redFlags: [
      'sRPE en aumento sostenido (fatiga acumulada)',
      'Pérdida de fuerza en lifts clave',
      'Pasos diarios cayendo > 20%'
    ]
  };
}

// ─── Construir array de fases (cortes + diet breaks intercalados) ───
function _construirFases(params) {
  const {
    semanasActivas, cantDietBreaks, caloriasCorte, tdee,
    pesoInicial, bfInicial, pesoTarget, bfTarget
  } = params;

  const fases = [];
  const bloques = cantDietBreaks + 1;
  const semanasPorBloque = Math.ceil(semanasActivas / bloques);

  // Calorías escalonadas: cada bloque subsiguiente baja 50 kcal (ajuste por adaptación)
  const kcalPorBloque = [caloriasCorte];
  for (let i = 1; i < bloques; i++) {
    // Piso: no bajar más de 800 kcal debajo de TDEE (protege hormonas)
    kcalPorBloque.push(Math.max(tdee - 800, caloriasCorte - i * 50));
  }

  const pasosPorBloque = [8000, 10000, 12000, 14000];
  const cardioPorBloque = ['no', 'si_plateau', 'si', 'si'];

  const kgPorBloque = (pesoInicial - pesoTarget) / bloques;
  const puntosBFPorBloque = (bfInicial - bfTarget) / bloques;

  let pesoActual = pesoInicial;
  let bfActualFase = bfInicial;
  let mesActual = 1;
  let numeroFase = 1;

  for (let b = 0; b < bloques; b++) {
    const semanasBloque = (b === bloques - 1)
      ? semanasActivas - semanasPorBloque * (bloques - 1)
      : semanasPorBloque;
    const mesesBloque = Math.max(1, Math.ceil(semanasBloque / 4.33));

    fases.push({
      numero: numeroFase++,
      tipo: 'corte',
      nombre: _bloqueNombre(b, bloques),
      mesInicio: mesActual,
      mesFin: mesActual + mesesBloque - 1,
      semanas: semanasBloque,
      calorias: kcalPorBloque[b],
      pesoInicio: Math.round(pesoActual * 10) / 10,
      pesoFin: Math.round((pesoActual - kgPorBloque) * 10) / 10,
      bfInicio: Math.round(bfActualFase * 10) / 10,
      bfFin: Math.round((bfActualFase - puntosBFPorBloque) * 10) / 10,
      targetPasos: pasosPorBloque[Math.min(b, pasosPorBloque.length - 1)],
      cardioFormal: cardioPorBloque[Math.min(b, cardioPorBloque.length - 1)],
      foco: _bloqueFoco(b, bloques),
      entrenamiento: _prescripcionEntrenamiento(b, bloques, false)
    });

    mesActual += mesesBloque;
    pesoActual -= kgPorBloque;
    bfActualFase -= puntosBFPorBloque;

    // Diet break después del bloque (excepto el último)
    if (b < bloques - 1) {
      fases.push({
        numero: numeroFase++,
        tipo: 'dietBreak',
        nombre: 'Diet Break ' + (b + 1),
        mesInicio: mesActual,
        mesFin: mesActual,
        semanas: 2,
        calorias: tdee,
        pesoInicio: Math.round(pesoActual * 10) / 10,
        // Diet break sube 0.5-1.5 kg (glucógeno + agua, no grasa)
        pesoFin: Math.round((pesoActual + 0.8) * 10) / 10,
        bfInicio: Math.round(bfActualFase * 10) / 10,
        bfFin: Math.round(bfActualFase * 10) / 10,
        targetPasos: pasosPorBloque[Math.min(b, pasosPorBloque.length - 1)],
        cardioFormal: 'no',
        foco: 'Restaurar leptina y adherencia. 2 semanas exactas a mantenimiento. Subida de peso esperada 0.5-1.5 kg (glucógeno + agua, NO grasa).',
        entrenamiento: _prescripcionEntrenamiento(b, bloques, true)
      });
      mesActual += 1;
    }
  }

  return fases;
}

// ─── Generador principal ───
function generarRoadmapFatLoss(input) {
  /*
    input esperado: {
      peso, altura, edad, genero,
      cintura, cuello, cadera?,
      bfOverride?,       // si null/undefined, calcula Navy
      factorActividad,   // 1.2 - 1.9
      pesoTarget?, bfTarget?,    // al menos uno de los dos
      tasaPerdida,       // 'conservadora' | 'moderada' | 'agresiva'
      timelineMesesDeseado?,     // si está, el motor ajusta el déficit para cumplirlo
      fechaInicio?       // ISO; si no, hoy
    }
  */

  const bmr = calcularBMRFatLoss(input.peso, input.altura, input.edad, input.genero);
  const tdee = calcularTDEEFatLoss(bmr, input.factorActividad);

  // BF% actual: override manual tiene prioridad
  const bfCalculado = calcularBFNavy(input.genero, input.altura, input.cintura, input.cuello, input.cadera);
  const bfActual = (input.bfOverride != null && input.bfOverride !== '')
    ? Number(input.bfOverride)
    : (bfCalculado != null ? Math.round(bfCalculado * 10) / 10 : null);

  if (bfActual == null) {
    throw new Error('No se pudo calcular BF%. Ingresa cintura y cuello, o un BF% override manual.');
  }

  const lbmActual = input.peso * (1 - bfActual / 100);
  const masaGrasaActual = input.peso * (bfActual / 100);

  // Derivar target faltante asumiendo LBM preservada
  let pesoTarget, bfTarget;
  if (input.pesoTarget && input.bfTarget) {
    pesoTarget = Number(input.pesoTarget);
    bfTarget = Number(input.bfTarget);
  } else if (input.pesoTarget) {
    pesoTarget = Number(input.pesoTarget);
    const masaGrasaTargetPeso = pesoTarget - lbmActual;
    bfTarget = Math.max(5, (masaGrasaTargetPeso / pesoTarget) * 100);
  } else if (input.bfTarget) {
    bfTarget = Number(input.bfTarget);
    pesoTarget = lbmActual / (1 - bfTarget / 100);
  } else {
    bfTarget = input.genero === 'F' ? 20 : 15;
    pesoTarget = lbmActual / (1 - bfTarget / 100);
  }

  const masaGrasaTarget = pesoTarget * (bfTarget / 100);
  const grasaAPerder = Math.max(0, masaGrasaActual - masaGrasaTarget);

  // Déficit y tasa según preset
  const preset = TASA_PERDIDA_PRESETS_FL[input.tasaPerdida] || TASA_PERDIDA_PRESETS_FL.moderada;
  let deficitDiario = preset.deficitKcal;
  let tasaSemanal = preset.kgPorSemana;

  // Semanas activas estimadas (con buffer 15% para variabilidad real)
  let semanasActivas = Math.ceil(grasaAPerder / tasaSemanal * 1.15);

  // Si el usuario pidió timeline específico, ajustar déficit
  if (input.timelineMesesDeseado && input.timelineMesesDeseado > 0) {
    const semanasTotalesDeseadas = input.timelineMesesDeseado * 4.33;
    // Reserva ~20% para diet breaks
    semanasActivas = Math.max(4, Math.round(semanasTotalesDeseadas / 1.2));
    tasaSemanal = grasaAPerder / semanasActivas;
    // 7700 kcal ≈ 1 kg de grasa
    deficitDiario = Math.round((tasaSemanal * 7700) / 7);
    // Clamp a rangos sanos: 200-800 kcal déficit
    deficitDiario = Math.max(200, Math.min(800, deficitDiario));
    // Recalcular la tasa real con el déficit clampeado
    tasaSemanal = (deficitDiario * 7) / 7700;
    semanasActivas = Math.ceil(grasaAPerder / tasaSemanal);
  }

  const caloriasCorte = tdee - deficitDiario;
  // Proteína basada en LBM (Helms et al. 2014 · 2.63 g/kg LBM ≈ 1.2 g/lb LBM)
  // Floor: nunca bajar de 1.6 g/kg peso total (protección hormonal)
  const proteinaTarget = Math.max(
    Math.round(lbmActual * 2.63),
    Math.round(input.peso * 1.6)
  );
  // Macros en gramos exactos (split 57% carbos / 43% grasas del remanente)
  const _kcalRestantes = caloriasCorte - proteinaTarget * 4;
  const macrosGramos = {
    proteina:      proteinaTarget,
    carbohidratos: Math.round((_kcalRestantes * 0.572) / 4),
    grasas:        Math.round((_kcalRestantes * 0.428) / 9)
  };

  // Diet breaks: cada ~10 semanas activas, 2 semanas a TDEE
  const cantDietBreaks = Math.max(0, Math.floor(semanasActivas / 10));
  const semanasDietBreak = cantDietBreaks * 2;
  const semanasTotales = semanasActivas + semanasDietBreak;
  const mesesTotales = Math.ceil(semanasTotales / 4.33);

  const fases = _construirFases({
    semanasActivas, cantDietBreaks, caloriasCorte, tdee,
    pesoInicial: input.peso, bfInicial: bfActual, pesoTarget, bfTarget
  });

  return {
    fechaGeneracion: new Date().toISOString(),
    fechaInicio: input.fechaInicio || _localDate(),
    inputs: {
      peso: input.peso, altura: input.altura, edad: input.edad, genero: input.genero,
      cintura: input.cintura, cuello: input.cuello, cadera: input.cadera || null,
      bfOverride: input.bfOverride != null && input.bfOverride !== '' ? Number(input.bfOverride) : null,
      factorActividad: input.factorActividad,
      pesoTargetInput: input.pesoTarget || null,
      bfTargetInput: input.bfTarget || null,
      tasaPerdida: input.tasaPerdida || 'moderada',
      timelineMesesDeseado: input.timelineMesesDeseado || null
    },
    calculados: {
      bmr: Math.round(bmr),
      tdee,
      bfActual: Math.round(bfActual * 10) / 10,
      bfCalculadoNavy: bfCalculado != null ? Math.round(bfCalculado * 10) / 10 : null,
      lbmActual: Math.round(lbmActual * 10) / 10,
      masaGrasaActual: Math.round(masaGrasaActual * 10) / 10,
      masaGrasaTarget: Math.round(masaGrasaTarget * 10) / 10,
      grasaAPerder: Math.round(grasaAPerder * 10) / 10,
      pesoTarget: Math.round(pesoTarget * 10) / 10,
      bfTarget: Math.round(bfTarget * 10) / 10,
      deficitDiario,
      caloriasCorte,
      proteinaTarget,
      macrosGramos,
      macrosKcal: {
        proteina:      proteinaTarget * 4,
        carbohidratos: macrosGramos.carbohidratos * 4,
        grasas:        macrosGramos.grasas * 9
      },
      tasaSemanal: Math.round(tasaSemanal * 100) / 100,
      semanasActivas,
      semanasTotales,
      mesesTotales,
      cantDietBreaks
    },
    fases,
    ajustesManuales: {}  // overrides por fase: { [numeroFase]: { calorias?, targetPasos? } }
  };
}

// ─── Fase actual según fecha de hoy ───
function faseActualFatLoss(roadmap, fechaHoy) {
  if (!roadmap || !roadmap.fases || !roadmap.fechaInicio) return null;

  const inicio = new Date(roadmap.fechaInicio + 'T00:00:00');
  const hoy = fechaHoy ? new Date(fechaHoy) : new Date();
  hoy.setHours(0, 0, 0, 0);
  const diasDesdeInicio = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));

  if (diasDesdeInicio < 0) {
    return { ...roadmap.fases[0], indice: 0, estado: 'por_empezar', diasParaEmpezar: -diasDesdeInicio };
  }

  let diasAcumulados = 0;
  for (let i = 0; i < roadmap.fases.length; i++) {
    const fase = roadmap.fases[i];
    const diasFase = fase.semanas * 7;
    if (diasDesdeInicio < diasAcumulados + diasFase) {
      const override = roadmap.ajustesManuales && roadmap.ajustesManuales[fase.numero];
      return {
        ...fase,
        // aplicar overrides manuales si existen
        calorias: override && override.calorias != null ? override.calorias : fase.calorias,
        targetPasos: override && override.targetPasos != null ? override.targetPasos : fase.targetPasos,
        indice: i,
        estado: 'activa',
        diaDentroDeFase: diasDesdeInicio - diasAcumulados + 1,
        diasRestantesEnFase: diasAcumulados + diasFase - diasDesdeInicio,
        siguiente: roadmap.fases[i + 1] || null
      };
    }
    diasAcumulados += diasFase;
  }

  // Pasó el roadmap entero
  const ultima = roadmap.fases[roadmap.fases.length - 1];
  return {
    ...ultima,
    indice: roadmap.fases.length - 1,
    estado: 'completado',
    diaDentroDeFase: ultima.semanas * 7,
    diasRestantesEnFase: 0,
    siguiente: null
  };
}

// ─── Progreso global del roadmap ───
function progresoRoadmap(roadmap, pesoActualReal, fechaHoy) {
  if (!roadmap) return null;
  const fase = faseActualFatLoss(roadmap, fechaHoy);
  if (!fase) return null;

  const pesoInicial = roadmap.inputs.peso;
  const pesoTarget = roadmap.calculados.pesoTarget;
  const pesoHoy = pesoActualReal != null ? pesoActualReal : fase.pesoInicio;
  const kgPerdidos = pesoInicial - pesoHoy;
  const kgTotal = pesoInicial - pesoTarget;
  const porcentaje = kgTotal > 0 ? Math.max(0, Math.min(100, (kgPerdidos / kgTotal) * 100)) : 0;

  return {
    pesoInicial,
    pesoHoy: Math.round(pesoHoy * 10) / 10,
    pesoTarget,
    kgPerdidos: Math.round(kgPerdidos * 10) / 10,
    kgRestantes: Math.round((pesoHoy - pesoTarget) * 10) / 10,
    porcentaje: Math.round(porcentaje),
    faseActual: fase.nombre,
    estado: fase.estado
  };
}

// ─── Presets tasa de ganancia (Volumen) ───
const TASA_GANANCIA_PRESETS = {
  conservadora: { surplusKcal: 200, kgMuscPorMes: 0.2, etiqueta: 'Conservadora', desc: 'Lean bulk. Mínima grasa acumulada.' },
  moderada:     { surplusKcal: 300, kgMuscPorMes: 0.3, etiqueta: 'Moderada',     desc: 'Balance óptimo. Recomendado.' },
  agresiva:     { surplusKcal: 400, kgMuscPorMes: 0.5, etiqueta: 'Agresiva',     desc: 'Mayor volumen y fuerza. Requiere entrenamiento intenso.' }
};

// ─── Generador Mantenimiento ───
function generarRoadmapMantenimiento(input) {
  /*
    input: { peso, altura, edad, genero, factorActividad,
             bfOverride?, cintura?, cuello?, cadera? }
  */
  const bmr = calcularBMRFatLoss(input.peso, input.altura, input.edad, input.genero);
  const tdee = calcularTDEEFatLoss(bmr, input.factorActividad);

  const bfCalculado = calcularBFNavy(input.genero, input.altura, input.cintura, input.cuello, input.cadera);
  const bfActual = (input.bfOverride != null && input.bfOverride !== '')
    ? Number(input.bfOverride)
    : (bfCalculado != null ? Math.round(bfCalculado * 10) / 10 : null);

  const lbmActual = bfActual != null ? input.peso * (1 - bfActual / 100) : null;

  // Proteína: 2.0 g/kg LBM (mantenimiento). Floor: 1.6 g/kg peso
  const proteinaTarget = lbmActual != null
    ? Math.max(Math.round(lbmActual * 2.0), Math.round(input.peso * 1.6))
    : Math.round(input.peso * 1.6);

  // Restante: 45% carbos / 55% grasas (split equilibrado)
  const kcalRestantes = tdee - proteinaTarget * 4;
  const carbohidratos = Math.round((kcalRestantes * 0.45) / 4);
  const grasas        = Math.round((kcalRestantes * 0.55) / 9);

  const macrosGramos = { proteina: proteinaTarget, carbohidratos, grasas };
  const totalKcalCheck = proteinaTarget * 4 + carbohidratos * 4 + grasas * 9;

  return {
    tipo: 'mantenimiento',
    fechaGeneracion: new Date().toISOString(),
    inputs: {
      peso: input.peso, altura: input.altura, edad: input.edad, genero: input.genero,
      cintura: input.cintura || null, cuello: input.cuello || null, cadera: input.cadera || null,
      bfOverride: input.bfOverride != null && input.bfOverride !== '' ? Number(input.bfOverride) : null,
      factorActividad: input.factorActividad
    },
    calculados: {
      bmr: Math.round(bmr), tdee,
      bfActual,
      bfCalculadoNavy: bfCalculado != null ? Math.round(bfCalculado * 10) / 10 : null,
      lbmActual: lbmActual ? Math.round(lbmActual * 10) / 10 : null,
      caloriasObjetivo: tdee,
      proteinaTarget,
      macrosGramos,
      macrosKcal: { proteina: proteinaTarget * 4, carbohidratos: carbohidratos * 4, grasas: grasas * 9 },
      pctProteina:      Math.round((proteinaTarget * 4 / tdee) * 100),
      pctCarbos:        Math.round((carbohidratos * 4 / tdee) * 100),
      pctGrasas:        Math.round((grasas * 9 / tdee) * 100),
      verificacionKcal: totalKcalCheck
    }
  };
}

// ─── Generador Volumen / Ganancia muscular ───
function generarRoadmapVolumen(input) {
  /*
    input: { peso, altura, edad, genero, factorActividad,
             bfOverride?, cintura?, cuello?, cadera?,
             tasaGanancia: 'conservadora'|'moderada'|'agresiva',
             pesoObjetivo? }
  */
  const bmr = calcularBMRFatLoss(input.peso, input.altura, input.edad, input.genero);
  const tdee = calcularTDEEFatLoss(bmr, input.factorActividad);

  const bfCalculado = calcularBFNavy(input.genero, input.altura, input.cintura, input.cuello, input.cadera);
  const bfActual = (input.bfOverride != null && input.bfOverride !== '')
    ? Number(input.bfOverride)
    : (bfCalculado != null ? Math.round(bfCalculado * 10) / 10 : null);

  const lbmActual = bfActual != null ? input.peso * (1 - bfActual / 100) : null;

  const preset = TASA_GANANCIA_PRESETS[input.tasaGanancia || 'moderada'];
  const surplus = preset.surplusKcal;
  const caloriasObjetivo = tdee + surplus;

  // Proteína: 2.4 g/kg LBM (síntesis muscular). Floor: 1.8 g/kg peso
  const proteinaTarget = lbmActual != null
    ? Math.max(Math.round(lbmActual * 2.4), Math.round(input.peso * 1.8))
    : Math.round(input.peso * 1.8);

  // Restante: 60% carbos / 40% grasas (dominio de carbos para glucógeno y rendimiento)
  const kcalRestantes = caloriasObjetivo - proteinaTarget * 4;
  const carbohidratos = Math.round((kcalRestantes * 0.60) / 4);
  const grasas        = Math.round((kcalRestantes * 0.40) / 9);

  const macrosGramos = { proteina: proteinaTarget, carbohidratos, grasas };

  // Timeline estimado
  const kgMuscPorMes = preset.kgMuscPorMes;
  const pesoObjetivo = input.pesoObjetivo ? Number(input.pesoObjetivo) : null;
  const mesesEstimados = pesoObjetivo && pesoObjetivo > input.peso
    ? Math.ceil((pesoObjetivo - input.peso) / kgMuscPorMes)
    : null;

  return {
    tipo: 'volumen',
    fechaGeneracion: new Date().toISOString(),
    inputs: {
      peso: input.peso, altura: input.altura, edad: input.edad, genero: input.genero,
      cintura: input.cintura || null, cuello: input.cuello || null, cadera: input.cadera || null,
      bfOverride: input.bfOverride != null && input.bfOverride !== '' ? Number(input.bfOverride) : null,
      factorActividad: input.factorActividad,
      tasaGanancia: input.tasaGanancia || 'moderada',
      pesoObjetivo: pesoObjetivo
    },
    calculados: {
      bmr: Math.round(bmr), tdee, surplus,
      bfActual,
      bfCalculadoNavy: bfCalculado != null ? Math.round(bfCalculado * 10) / 10 : null,
      lbmActual: lbmActual ? Math.round(lbmActual * 10) / 10 : null,
      caloriasObjetivo,
      proteinaTarget,
      macrosGramos,
      macrosKcal: { proteina: proteinaTarget * 4, carbohidratos: carbohidratos * 4, grasas: grasas * 9 },
      pctProteina:      Math.round((proteinaTarget * 4 / caloriasObjetivo) * 100),
      pctCarbos:        Math.round((carbohidratos * 4 / caloriasObjetivo) * 100),
      pctGrasas:        Math.round((grasas * 9 / caloriasObjetivo) * 100),
      kgMuscPorMes,
      mesesEstimados,
      tasaGanancia: input.tasaGanancia || 'moderada'
    }
  };
}

// ─── Exponer a window (convención del proyecto) ───
if (typeof window !== 'undefined') {
  window.NP_Roadmap = {
    generar: generarRoadmapFatLoss,
    generarMantenimiento: generarRoadmapMantenimiento,
    generarVolumen: generarRoadmapVolumen,
    faseActual: faseActualFatLoss,
    progreso: progresoRoadmap,
    calcularBMR: calcularBMRFatLoss,
    calcularTDEE: calcularTDEEFatLoss,
    calcularBFNavy: calcularBFNavy,
    TASA_PERDIDA_PRESETS: TASA_PERDIDA_PRESETS_FL,
    TASA_GANANCIA_PRESETS: TASA_GANANCIA_PRESETS
  };
}
