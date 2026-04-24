/* ============================================
   NutriPlan - Motor de generación de Fat Loss Roadmap
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
      foco: _bloqueFoco(b, bloques)
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
        foco: 'Restaurar leptina y adherencia. 2 semanas exactas a mantenimiento. Subida de peso esperada 0.5-1.5 kg (glucógeno + agua, NO grasa).'
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
  // Proteína: 2.2 g/kg bodyweight (≈ 1g/lb, estándar Precision Nutrition)
  const proteinaTarget = Math.round(input.peso * 2.2);

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
    fechaInicio: input.fechaInicio || new Date().toISOString().split('T')[0],
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

// ─── Exponer a window (convención del proyecto) ───
if (typeof window !== 'undefined') {
  window.NP_Roadmap = {
    generar: generarRoadmapFatLoss,
    faseActual: faseActualFatLoss,
    progreso: progresoRoadmap,
    calcularBMR: calcularBMRFatLoss,
    calcularTDEE: calcularTDEEFatLoss,
    calcularBFNavy: calcularBFNavy,
    TASA_PERDIDA_PRESETS: TASA_PERDIDA_PRESETS_FL
  };
}
