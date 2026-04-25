/* ============================================
   NutriPlan - Fat Loss Roadmap: tablas estáticas
   Datos de referencia del método Precision Nutrition.
   Sin side effects, sin lógica — puros datos.
   ============================================ */

// ─── Protocolo de plateau (6 pasos escalonados) ───
const PLATEAU_PROTOCOL = [
  {
    paso: 1,
    accion: 'Auditoría de calorías',
    detalle: 'Trackear TODO lo que comés durante 7 días. Buscar calorías ocultas: aceites de cocina, salsas, cremas, "bocados" mientras cocinás. La mayoría de mesetas se explican acá.',
    duracion: '7 días',
    ajusteCalorias: 0,
    ajustePasos: 0
  },
  {
    paso: 2,
    accion: 'Aumentar pasos diarios',
    detalle: 'Sumar +1.500-2.000 pasos/día. Sin añadir cardio formal todavía. Los pasos no elevan el apetito (el cardio intenso sí). Usar treadmill en inclinación suave 10-15 min/día.',
    duracion: '10-14 días',
    ajusteCalorias: 0,
    ajustePasos: 1500
  },
  {
    paso: 3,
    accion: 'Reducir carbohidratos −30g',
    detalle: 'Cambiar 30g de carbos por verduras extra. Proteína y grasas intactas. Reduce ~120 kcal sin comprometer masa muscular ni hormonas.',
    duracion: '10-14 días',
    ajusteCalorias: -120,
    ajustePasos: 0
  },
  {
    paso: 4,
    accion: 'Diet Break 2 semanas',
    detalle: 'Subir a TDEE (~2.500 kcal en tu caso) por 14 días exactos. Restaura leptina, reduce cortisol, mejora adherencia. Subida de peso (0.5-1.5 kg) es glucógeno + agua, no grasa.',
    duracion: '14 días exactos',
    ajusteCalorias: 'tdee',
    ajustePasos: 0
  },
  {
    paso: 5,
    accion: 'Reducir calorías −100 kcal',
    detalle: 'Bajar a caloriasCorte − 100. Solo si los pasos anteriores no rompieron la meseta. Revisar si hay adaptación metabólica real o problema de tracking.',
    duracion: '2-3 semanas antes de evaluar',
    ajusteCalorias: -100,
    ajustePasos: 0
  },
  {
    paso: 6,
    accion: 'Cardio formal estructurado',
    detalle: 'Añadir 20-30 min de rowing o treadmill inclinado × 3/semana. Último recurso. No desperdiciar antes de tiempo.',
    duracion: 'Hasta nuevo progreso',
    ajusteCalorias: 0,
    ajustePasos: 0,
    activaCardio: true
  }
];

// ─── Impacto del alcohol ───
const ALCOHOL_IMPACTO = [
  {
    escenario: '1-2 copas de vino/semana',
    kcalMin: 80, kcalMax: 150,
    horasPausaOxidacion: 6,
    impactoSintesisProteica: '−5% × 48h',
    nivel: 'minimo',
    estrategia: 'Incluir en calorías del día — sin problema.'
  },
  {
    escenario: '3-5 tragos en una ocasión',
    kcalMin: 300, kcalMax: 500,
    horasPausaOxidacion: 12,
    impactoSintesisProteica: '−15% × 48h',
    nivel: 'moderado',
    estrategia: 'OK ocasional. Ajustar calorías el día anterior.'
  },
  {
    escenario: 'Noche de copas + snacks',
    kcalMin: 600, kcalMax: 1200,
    horasPausaOxidacion: 24,
    impactoSintesisProteica: '−20% × 48h',
    nivel: 'alto',
    estrategia: 'Aceptar el impacto. Retomar el plan al día siguiente. No usar como "día de castigo".'
  },
  {
    escenario: '4+ veces/semana',
    kcalMin: 2000, kcalMax: 5000,
    horasPausaOxidacion: 168,
    impactoSintesisProteica: 'crónico −20%+',
    nivel: 'critico',
    estrategia: 'Incompatible con alcanzar el objetivo en el plazo planificado.'
  }
];

// ─── Kcal por bebida (primeros 6 = frecuentes en AlcoholCard) ───
const ALCOHOL_BEBIDAS = [
  { nombre: 'Vino tinto', ml: 150, kcal: 125, alcohol_pct: 12 },
  { nombre: 'Vino blanco', ml: 150, kcal: 120, alcohol_pct: 12 },
  { nombre: 'Cerveza estándar', ml: 355, kcal: 150, alcohol_pct: 5 },
  { nombre: 'Piscola (zero)', ml: 250, kcal: 110, alcohol_pct: 8 },
  { nombre: 'Pisco sour', ml: 200, kcal: 280, alcohol_pct: 15 },
  { nombre: 'Gin tonic', ml: 250, kcal: 180, alcohol_pct: 10 },
  { nombre: 'Cerveza IPA/artesanal', ml: 355, kcal: 210, alcohol_pct: 7 },
  { nombre: 'Whisky solo', ml: 45, kcal: 100, alcohol_pct: 40 },
  { nombre: 'Whisky + coca', ml: 250, kcal: 200, alcohol_pct: 7 },
  { nombre: 'Margarita', ml: 200, kcal: 280, alcohol_pct: 12 },
  { nombre: 'Ron + coca', ml: 250, kcal: 220, alcohol_pct: 8 },
  { nombre: 'Champagne/Espumante', ml: 120, kcal: 90, alcohol_pct: 12 },
  { nombre: 'Tequila shot', ml: 45, kcal: 100, alcohol_pct: 40 },
  { nombre: 'Vodka soda', ml: 200, kcal: 100, alcohol_pct: 10 }
];

// ─── Equipamiento disponible ───
const EQUIPOS_DISPONIBLES = [
  { id: 'peso_corporal',  nombre: 'Peso corporal',       icono: '🤸', siempre: true },
  { id: 'speediance',     nombre: 'Speediance',           icono: '🏋️', siempre: false },
  { id: 'treadmill_plano',nombre: 'Treadmill (plano)',    icono: '🏃', siempre: false },
  { id: 'remadora',       nombre: 'Remadora',             icono: '🚣', siempre: false },
  { id: 'barra',          nombre: 'Barra de dominadas',   icono: '⬆️', siempre: false }
];

// ─── Protocolo de entrenamiento 4 días ───
// Hardcoded del roadmap HTML de Camilo. Editable si Camilo cambia equipo.
const ENTRENO_PROTOCOLO = {
  // Día → tipo default (Lun/Mar/Mié/Jue/Vie/Sáb/Dom = 1-7)
  scheduleDefault: { 1: 'A', 2: 'B', 3: 'descanso', 4: 'C', 5: 'descanso', 6: 'D', 0: 'descanso' },

  dias: {
    A: {
      nombre: 'Día A — EMPUJE',
      foco: 'Pecho, Hombros, Tríceps + Core',
      equipamiento: 'Speediance + peso corporal',
      duracionMin: 50,
      ejercicios: [
        { nombre: 'Press pecho cables (bajo-arriba)', sets: 4, reps: '8-10', equipo: 'Speediance', nota: 'Excéntrico 3 seg',
          descripcion: 'Cable en polea baja, empuja diagonal hacia arriba. Activa el pectoral superior con tensión constante en todo el rango.',
          youtube: 'https://www.youtube.com/results?search_query=press+pecho+cable+bajo+arriba+tutorial' },
        { nombre: 'Aperturas cable chest fly', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Rango completo',
          descripcion: 'Poleas a la altura del pecho, arco amplio juntando las manos al centro. Máximo estiramiento y contracción del pectoral.',
          youtube: 'https://www.youtube.com/results?search_query=cable+chest+fly+apertura+pecho+tutorial' },
        { nombre: 'Press hombros cables bilateral', sets: 3, reps: '10-12', equipo: 'Speediance', nota: '',
          descripcion: 'Empuje vertical con ambos brazos simultáneos. Mantén el core apretado para no arquear la espalda baja.',
          youtube: 'https://www.youtube.com/results?search_query=press+hombros+cable+bilateral+tutorial' },
        { nombre: 'Elevaciones laterales cable', sets: 3, reps: '15', equipo: 'Speediance', nota: 'Técnica limpia',
          descripcion: 'Polea baja, eleva el brazo hasta la horizontal con codo ligeramente doblado. Aísla el deltoides medial.',
          youtube: 'https://www.youtube.com/results?search_query=elevaciones+laterales+cable+tutorial+deltoides' },
        { nombre: 'Tríceps pushdown cable', sets: 3, reps: '12-15', equipo: 'Speediance', nota: '',
          descripcion: 'Codos fijos al costado del torso. Extiende completamente el codo en cada repetición para máxima activación del tríceps.',
          youtube: 'https://www.youtube.com/results?search_query=triceps+pushdown+cable+tutorial' },
        { nombre: 'Pike pushups', sets: 2, reps: 'máx', equipo: 'Peso corporal', nota: 'Complemento hombros',
          descripcion: 'Caderas elevadas en V invertida, baja la cabeza hacia el suelo. Activa deltoides anterior como un press de hombros inclinado.',
          youtube: 'https://www.youtube.com/results?search_query=pike+pushups+tutorial+hombros' },
        { nombre: 'Plancha frontal', sets: 3, reps: '40 seg', equipo: 'Peso corporal', nota: '',
          descripcion: 'Apoyado en antebrazos y puntillas. Cuerpo recto de cabeza a talones, sin dejar caer ni elevar la cadera.',
          youtube: 'https://www.youtube.com/results?search_query=plancha+frontal+correcta+tutorial+core' },
        { nombre: 'Plancha lateral alternada', sets: 2, reps: '30 seg c/lado', equipo: 'Peso corporal', nota: '',
          descripcion: 'Apoyo en un antebrazo, cuerpo alineado lateralmente. Estabiliza el oblicuo y el cuadrado lumbar.',
          youtube: 'https://www.youtube.com/results?search_query=plancha+lateral+alternada+tutorial' }
      ]
    },
    B: {
      nombre: 'Día B — PIERNAS',
      foco: 'Squat, Hip Hinge, Glúteos',
      equipamiento: 'Speediance + peso corporal',
      duracionMin: 55,
      ejercicios: [
        { nombre: 'Squat con cable frontal', sets: 4, reps: '10-12', equipo: 'Speediance', nota: 'Espalda neutra',
          descripcion: 'Cable frontal obliga al torso a mantenerse vertical. Activa cuádriceps y requiere core constante para no inclinarse.',
          youtube: 'https://www.youtube.com/results?search_query=squat+cable+frontal+tutorial' },
        { nombre: 'Romanian Deadlift cable', sets: 3, reps: '10-12', equipo: 'Speediance', nota: 'Hip hinge limpio',
          descripcion: 'Bisagra de cadera pura con espalda neutra. Baja hasta sentir el estiramiento en isquiotibiales, sin doblar rodillas.',
          youtube: 'https://www.youtube.com/results?search_query=romanian+deadlift+cable+tutorial+isquiotibiales' },
        { nombre: 'Bulgarian split squat', sets: 3, reps: '10 c/pierna', equipo: 'Peso corporal', nota: 'Alta dificultad',
          descripcion: 'Pie trasero elevado en banco. Baja controlado hasta 90° en la rodilla delantera, sin que la rodilla supere la punta del pie.',
          youtube: 'https://www.youtube.com/results?search_query=bulgarian+split+squat+tutorial+correcto' },
        { nombre: 'Glute kickbacks cable', sets: 3, reps: '15 c/lado', equipo: 'Speediance', nota: 'Activación glúteo',
          descripcion: 'Polea baja con tobillera. Extiende la cadera hacia atrás apretando el glúteo al final del movimiento, sin balancear el torso.',
          youtube: 'https://www.youtube.com/results?search_query=glute+kickback+cable+tutorial+gluteo' },
        { nombre: 'Curl de pierna cable', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Isquiotibiales',
          descripcion: 'De pie con tobillera en polea baja, flexiona la rodilla llevando el talón al glúteo. Mantén la cadera estable.',
          youtube: 'https://www.youtube.com/results?search_query=curl+pierna+cable+de+pie+tutorial+isquiotibiales' },
        { nombre: 'Hip thrust en el suelo', sets: 3, reps: '15-20', equipo: 'Peso corporal', nota: 'Glúteo',
          descripcion: 'Espalda apoyada en el suelo, empuja la cadera hacia arriba apretando el glúteo en la cima. Pausa 1 seg arriba.',
          youtube: 'https://www.youtube.com/results?search_query=hip+thrust+suelo+tutorial+gluteo' },
        { nombre: 'Lunges alternados caminando', sets: 3, reps: '12 c/pierna', equipo: 'Peso corporal', nota: '',
          descripcion: 'Paso largo hacia adelante, rodilla delantera a 90°, torso recto. Alterna piernas avanzando con cada repetición.',
          youtube: 'https://www.youtube.com/results?search_query=lunges+caminando+alternados+tutorial' },
        { nombre: 'Sentadilla sumo amplia', sets: 2, reps: '20', equipo: 'Peso corporal', nota: 'Warm-down',
          descripcion: 'Pies muy separados y pies rotados hacia afuera. Enfoca el aductor y el glúteo más que el cuádriceps.',
          youtube: 'https://www.youtube.com/results?search_query=sentadilla+sumo+amplia+tutorial+aductor' }
      ]
    },
    C: {
      nombre: 'Día C — JALAR / ESPALDA',
      foco: 'Espalda, Rowing, Bíceps',
      equipamiento: 'Speediance modo remo + cables',
      duracionMin: 50,
      ejercicios: [
        { nombre: 'Rowing Speediance (modo remo)', sets: 1, reps: '10-15 min', equipo: 'Speediance', nota: 'Calentamiento fuerza-resistencia',
          descripcion: 'Arranque con piernas, apertura de cadera y tirón de brazos en secuencia. Mantén la espalda recta y el core activo durante todo el stroke.',
          youtube: 'https://www.youtube.com/results?search_query=tecnica+remo+indoor+rowing+tutorial+correcto' },
        { nombre: 'Cable row sentado', sets: 4, reps: '10-12', equipo: 'Speediance', nota: 'Codos pegados al cuerpo',
          descripcion: 'Tira el agarre hacia el abdomen con codos cerca del torso. Junta las escápulas al final y controla el excéntrico.',
          youtube: 'https://www.youtube.com/results?search_query=cable+row+sentado+espalda+tutorial' },
        { nombre: 'Lat pulldown cable', sets: 3, reps: '10-12', equipo: 'Speediance', nota: 'Agarre ancho',
          descripcion: 'Agarre prono ancho, tira la barra al pecho mientras los codos apuntan al suelo. Imagina "partir la barra" para activar el dorsal.',
          youtube: 'https://www.youtube.com/results?search_query=lat+pulldown+cable+tutorial+dorsal' },
        { nombre: 'Remo unilateral cable', sets: 3, reps: '12 c/lado', equipo: 'Speediance', nota: 'Anti-rotación core',
          descripcion: 'Un brazo por vez, tira hacia la cadera con rotación controlada del torso. El core resiste la rotación excesiva.',
          youtube: 'https://www.youtube.com/results?search_query=remo+unilateral+cable+tutorial+espalda' },
        { nombre: 'Face pulls cable', sets: 3, reps: '15', equipo: 'Speediance', nota: 'Salud manguito rotador',
          descripcion: 'Polea alta con cuerda, tira hacia la cara separando las manos. Activa el manguito rotador y el deltoides posterior.',
          youtube: 'https://www.youtube.com/results?search_query=face+pulls+cable+manguito+rotador+tutorial' },
        { nombre: 'Curl bíceps cable supinado', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Supinación completa',
          descripcion: 'Gira la palma hacia arriba (supinación) durante la subida para máxima contracción del bíceps. Codos fijos.',
          youtube: 'https://www.youtube.com/results?search_query=curl+biceps+cable+supinado+tutorial' },
        { nombre: 'Superman extensión espalda', sets: 3, reps: '15', equipo: 'Peso corporal', nota: 'Erector spinae',
          descripcion: 'Boca abajo en el suelo, eleva simultáneamente brazos y piernas. Activa el erector espinal y los glúteos.',
          youtube: 'https://www.youtube.com/results?search_query=superman+extension+espalda+tutorial+erector' },
        { nombre: 'Dead hang / inverted row', sets: 2, reps: '30 seg', equipo: 'Barra/Speediance', nota: 'Agarre y espalda alta',
          descripcion: 'Dead hang: cuelga de la barra sin balanceo para descomprimir la columna. Inverted row: tirar el pecho a la barra bajo ella.',
          youtube: 'https://www.youtube.com/results?search_query=dead+hang+inverted+row+tutorial+espalda' }
      ]
    },
    D: {
      nombre: 'Día D — FULL BODY CIRCUITO',
      foco: 'Circuito metabólico + cardio optativo',
      equipamiento: 'Peso corporal + Treadmill',
      duracionMin: 45,
      ejercicios: [
        { nombre: 'Burpees (o half-burpee)', sets: 4, reps: '10 rondas', equipo: 'Peso corporal', nota: 'Modificar si dolor articular',
          descripcion: 'Salto, descenso a plancha, flexión de brazos (opcional), salto de vuelta. El half-burpee omite el salto final para cuidar las rodillas.',
          youtube: 'https://www.youtube.com/results?search_query=burpees+correctamente+tutorial+half+burpee' },
        { nombre: 'Sentadillas con salto', sets: 4, reps: '12 rondas', equipo: 'Peso corporal', nota: 'Box squat si rodillas',
          descripcion: 'Squat profundo y explosivo al subir. Aterriza suave con rodillas flexionadas para absorber el impacto.',
          youtube: 'https://www.youtube.com/results?search_query=sentadillas+con+salto+jump+squat+tutorial' },
        { nombre: 'Mountain climbers', sets: 4, reps: '30 seg rondas', equipo: 'Peso corporal', nota: 'Core + cardio',
          descripcion: 'Plancha alta, alterna llevando las rodillas al pecho rápidamente. La cadera se mantiene baja y estable.',
          youtube: 'https://www.youtube.com/results?search_query=mountain+climbers+tutorial+core' },
        { nombre: 'Rowing explosivo', sets: 4, reps: '30s sprint / 30s fácil', equipo: 'Speediance', nota: '',
          descripcion: 'Intervalos de alta intensidad en el remo. 30 seg al máximo esfuerzo, 30 seg recuperación activa a ritmo suave.',
          youtube: 'https://www.youtube.com/results?search_query=rowing+interval+sprint+tutorial+remo+explosivo' },
        { nombre: 'Flexiones de brazos', sets: 4, reps: 'máx rondas', equipo: 'Peso corporal', nota: 'Torso recto',
          descripcion: 'Manos al ancho de hombros, cuerpo perfectamente recto. El pecho debe rozar el suelo en cada repetición.',
          youtube: 'https://www.youtube.com/results?search_query=flexiones+brazos+correctas+tecnica+tutorial' },
        { nombre: 'Lunges con rotación', sets: 4, reps: '10 c/pierna rondas', equipo: 'Peso corporal', nota: 'Movilidad',
          descripcion: 'Lunge hacia adelante y rota el torso hacia la pierna delantera. Mejora movilidad de caderas y columna torácica.',
          youtube: 'https://www.youtube.com/results?search_query=lunges+con+rotacion+movilidad+tutorial' },
        { nombre: 'Dead bug / hollow body', sets: 4, reps: '30 seg rondas', equipo: 'Peso corporal', nota: 'Core profundo',
          descripcion: 'Espalda pegada al suelo en todo momento. Baja brazo y pierna contraria alternando sin perder el contacto lumbar.',
          youtube: 'https://www.youtube.com/results?search_query=dead+bug+hollow+body+core+tutorial' },
        { nombre: 'Treadmill plano (ritmo moderado)', sets: 1, reps: '20-30 min', equipo: 'Treadmill', nota: 'Cardio suave — ritmo conversacional, sin inclinación',
          descripcion: 'Caminata/trote ligero a 6-8 km/h en plano. 20 min queman ~90-110 kcal (vs ~150 kcal con inclinación 10%). Aumenta duración para compensar la diferencia calórica.',
          youtube: 'https://www.youtube.com/results?search_query=treadmill+plano+caminata+fat+loss+ritmo+moderado' }
      ]
    }
  },

  principios: [
    { titulo: 'Mantener cargas', texto: 'Igualar o superar los pesos de la semana anterior. La fuerza es la señal de retención muscular.' },
    { titulo: 'Rango 8-15 reps', texto: 'Óptimo para hipertrofia sin exceso de estrés articular en déficit.' },
    { titulo: 'Descanso 60-90 seg', texto: 'Suficiente para recuperar fuerza sin enfriar el metabolismo.' },
    { titulo: 'Si baja la fuerza >10%', texto: 'Señal de déficit muy agresivo o poco descanso — no es falta de esfuerzo.' },
    { titulo: 'No añadir volumen "para quemar más"', texto: 'Más volumen en déficit = más catabolismo muscular.' }
  ]
};

// ─── Fuentes proteicas para el complemento ───
const FUENTES_PROTEICAS = {
  whey: { nombre: 'Whey protein (1 scoop)', porcion: '30g', proteina: 25, kcal: 120, carbs: 3, grasas: 2, saciedad: 'media' },
  yogur_griego: { nombre: 'Yogur griego 0%', porcion: '200g', proteina: 20, kcal: 110, carbs: 8, grasas: 0, saciedad: 'alta' },
  cottage: { nombre: 'Queso cottage light', porcion: '150g', proteina: 18, kcal: 120, carbs: 5, grasas: 2, saciedad: 'alta' },
  claras: { nombre: 'Claras de huevo (6)', porcion: '180g', proteina: 22, kcal: 100, carbs: 2, grasas: 0, saciedad: 'media' },
  atun: { nombre: 'Atún en agua', porcion: '1 lata 130g', proteina: 30, kcal: 130, carbs: 0, grasas: 1, saciedad: 'alta' }
};

// ─── Alimentos de alto volumen (anti-hambre) ───
const ALIMENTOS_ALTO_VOLUMEN = [
  { nombre: 'Espinaca / lechuga / rúcula', porcion: '300g', kcal: 60, uso: 'Base de almuerzo y cena — volumen ilimitado' },
  { nombre: 'Pepino / apio / zapallo italiano', porcion: '300g', kcal: 45, uso: 'Snack entre comidas, sin límite' },
  { nombre: 'Brócoli / coliflor cocido', porcion: '250g', kcal: 80, uso: 'Acompañamiento en cena — llena el plato' },
  { nombre: 'Avena en agua', porcion: '50g seco', kcal: 185, uso: 'Desayuno base — fibra alta + liberación lenta' },
  { nombre: 'Caldo de huesos o vegetales', porcion: '500ml', kcal: 30, uso: 'Tarde cuando hay hambre — señal calórica mínima' },
  { nombre: 'Popcorn natural (sin aceite)', porcion: '30g seco', kcal: 110, uso: 'Snack nocturno — 4 tazas por ~110 kcal' },
  { nombre: 'Berries (frutillas, arándanos)', porcion: '200g', kcal: 90, uso: 'Post-comida, dulce, fibra alta' }
];

// ─── Factores de actividad con descripción ───
const FACTORES_ACTIVIDAD_FL = [
  { valor: 1.2, label: 'Sedentario', desc: 'Oficina, poco movimiento, sin entreno' },
  { valor: 1.375, label: 'Ligera', desc: 'Entreno 1-3x/semana o trabajo con movimiento moderado' },
  { valor: 1.45, label: 'Moderada (home office + 4 entrenos)', desc: 'Default para Camilo' },
  { valor: 1.55, label: 'Activa', desc: 'Entreno 4-5x/semana + trabajo físico ligero' },
  { valor: 1.725, label: 'Muy activa', desc: 'Entreno 5-6x/semana intenso' },
  { valor: 1.9, label: 'Extrema', desc: 'Atleta, doble sesión diaria' }
];

// ─── Motor de rotación semanal ─────────────────────────────────────────────
// Los ejercicios "core" (compuestos principales) siempre aparecen.
// Los accesorios + extras rotan semana a semana usando un shuffle seeded,
// de modo que cada semana se ven ejercicios distintos sin repetir el patrón.

const _SEED_REF = new Date('2024-01-01T12:00:00').getTime();

function semanaActual(fecha) {
  const d = fecha ? new Date(fecha + 'T12:00:00') : new Date();
  return Math.floor((d.getTime() - _SEED_REF) / (7 * 24 * 60 * 60 * 1000));
}

function _seededShuffle(arr, seed) {
  const a = arr.slice();
  let s = Math.abs(seed % 2147483647) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// ─── Ejercicios extra por día (rotan junto con los accesorios del protocolo base) ───
// Los nombres NO deben duplicar los de ENTRENO_PROTOCOLO.
const EJERCICIOS_POOL = {
  A: {
    totalSesion: 8,
    core: ['Press pecho cables (bajo-arriba)', 'Press hombros cables bilateral', 'Tríceps pushdown cable'],
    extra: [
      { nombre: 'Cable crossover (alto-abajo)', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Pectoral inferior',
        descripcion: 'Poleas altas, cruza los brazos hacia abajo y al centro. Activa el pectoral inferior y el esternal con máxima contracción.',
        youtube: 'https://www.youtube.com/results?search_query=cable+crossover+alto+abajo+pectoral+inferior+tutorial' },
      { nombre: 'Tríceps overhead cable', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Cabeza larga',
        descripcion: 'Polea alta, codos apuntando al techo, extiende los brazos sobre la cabeza. Máximo estiramiento de la cabeza larga del tríceps.',
        youtube: 'https://www.youtube.com/results?search_query=triceps+overhead+cable+extension+tutorial' },
      { nombre: 'Fondos en banco (triceps dip)', sets: 3, reps: '12-15', equipo: 'Peso corporal', nota: 'Codos hacia atrás',
        descripcion: 'Manos en el borde del banco, codos hacia atrás, baja el cuerpo hasta 90° y empuja. Activa tríceps y pectoral inferior.',
        youtube: 'https://www.youtube.com/results?search_query=fondos+banco+triceps+dips+tutorial' },
      { nombre: 'Rotación externa cable (hombro)', sets: 3, reps: '15 c/lado', equipo: 'Speediance', nota: 'Salud manguito rotador',
        descripcion: 'Polea a altura de codo, rotación externa con codo fijo al costado. Prevención y rehabilitación del manguito rotador.',
        youtube: 'https://www.youtube.com/results?search_query=rotacion+externa+cable+manguito+rotador+tutorial' },
      { nombre: 'Flexiones declinadas', sets: 3, reps: '10-15', equipo: 'Peso corporal', nota: 'Pectoral superior',
        descripcion: 'Pies elevados en banco, manos en el suelo. Activa el pectoral superior y el deltoides anterior más que las flexiones planas.',
        youtube: 'https://www.youtube.com/results?search_query=flexiones+declinadas+pies+elevados+pectoral+tutorial' }
    ]
  },
  B: {
    totalSesion: 8,
    core: ['Squat con cable frontal', 'Romanian Deadlift cable'],
    extra: [
      { nombre: 'Step-ups (cajón/silla)', sets: 3, reps: '12 c/pierna', equipo: 'Peso corporal', nota: 'Glúteo + cuádriceps',
        descripcion: 'Sube al cajón impulsando exclusivamente con el talón del pie delantero. No uses el pie trasero para empujar.',
        youtube: 'https://www.youtube.com/results?search_query=step+ups+cajon+glúteo+cuádriceps+tutorial' },
      { nombre: 'Abductores cable (de pie)', sets: 3, reps: '15 c/lado', equipo: 'Speediance', nota: 'Glúteo medio',
        descripcion: 'Tobillera en polea baja, eleva la pierna hacia afuera. Activa el glúteo medio y el tensor de la fascia lata.',
        youtube: 'https://www.youtube.com/results?search_query=abductores+cable+de+pie+glúteo+medio+tutorial' },
      { nombre: 'Sentadilla goblet', sets: 3, reps: '15-20', equipo: 'Peso corporal', nota: 'Movilidad + cuádriceps',
        descripcion: 'Manos unidas al pecho simulando sostener un peso. Squat profundo con torso perfectamente vertical. Ideal para movilidad de cadera.',
        youtube: 'https://www.youtube.com/results?search_query=sentadilla+goblet+squat+tutorial+movilidad' },
      { nombre: 'Frog pumps', sets: 3, reps: '25', equipo: 'Peso corporal', nota: 'Glúteo alto volumen',
        descripcion: 'Boca arriba, plantas de los pies juntas. Eleva la cadera apretando el glúteo. Alta activación con muy bajo impacto articular.',
        youtube: 'https://www.youtube.com/results?search_query=frog+pumps+gluteos+ejercicio+tutorial' },
      { nombre: 'Sentadilla pistol asistida', sets: 3, reps: '8 c/pierna', equipo: 'Peso corporal', nota: 'Fuerza unilateral',
        descripcion: 'Sentadilla en una sola pierna sujetándote de algo fijo. Trabaja la asimetría de fuerza entre piernas.',
        youtube: 'https://www.youtube.com/results?search_query=sentadilla+pistol+asistida+tutorial+pierna' }
    ]
  },
  C: {
    totalSesion: 8,
    core: ['Rowing Speediance (modo remo)', 'Cable row sentado', 'Lat pulldown cable'],
    extra: [
      { nombre: 'Curl martillo cable', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Braquial + bíceps',
        descripcion: 'Agarre neutro (palma hacia el cuerpo), curla el brazo. Activa el braquial y el braquirradial además del bíceps.',
        youtube: 'https://www.youtube.com/results?search_query=curl+martillo+cable+hammer+curl+tutorial' },
      { nombre: 'Pullover cable', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Dorsal + expansión torácica',
        descripcion: 'Polea alta, brazos extendidos, jala hacia las caderas describiendo un arco. Máximo estiramiento del dorsal ancho.',
        youtube: 'https://www.youtube.com/results?search_query=pullover+cable+dorsal+ancho+tutorial' },
      { nombre: 'High row cable', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Espalda alta y romboides',
        descripcion: 'Polea alta, tira hacia la frente con codos hacia afuera. Activa romboides, trapecio medio y deltoides posterior.',
        youtube: 'https://www.youtube.com/results?search_query=high+row+cable+espalda+alta+romboides+tutorial' },
      { nombre: 'Shrug cable', sets: 3, reps: '15', equipo: 'Speediance', nota: 'Trapecio superior',
        descripcion: 'De pie con cables a los lados, encoge los hombros hacia las orejas. Pausa 1 seg arriba para máxima contracción del trapecio.',
        youtube: 'https://www.youtube.com/results?search_query=shrug+cable+trapecio+superior+tutorial' },
      { nombre: 'Rowing remadora calentamiento', sets: 1, reps: '10-15 min', equipo: 'Remadora', nota: 'Técnica: piernas → cadera → brazos',
        descripcion: 'En remadora: arranque con piernas, apertura de cadera y tirón de brazos en secuencia. Espalda recta durante todo el stroke.',
        youtube: 'https://www.youtube.com/results?search_query=remadora+tecnica+correcta+rowing+machine+tutorial' }
    ]
  },
  D: {
    totalSesion: 8,
    core: ['Burpees (o half-burpee)', 'Mountain climbers'],
    extra: [
      { nombre: 'Bear crawl (20m)', sets: 4, reps: '4 largos', equipo: 'Peso corporal', nota: 'Core total + coordinación',
        descripcion: 'A 4 apoyos con rodillas a centímetros del suelo, avanza 20m manteniendo la espalda plana. Coordinación y core profundo.',
        youtube: 'https://www.youtube.com/results?search_query=bear+crawl+ejercicio+core+coordinacion+tutorial' },
      { nombre: 'Plank toque de hombros', sets: 3, reps: '30 seg', equipo: 'Peso corporal', nota: 'Antirotación',
        descripcion: 'Plancha alta, alterna tocando el hombro contrario con cada mano. Las caderas no deben rotar ni oscilar.',
        youtube: 'https://www.youtube.com/results?search_query=plank+toque+hombros+antirotacion+core+tutorial' },
      { nombre: 'Skipping en sitio (intervals)', sets: 4, reps: '30 seg', equipo: 'Peso corporal', nota: 'Cardio HIIT',
        descripcion: 'Carrera en el lugar elevando rodillas al máximo a ritmo rápido. Alta demanda cardiovascular sin desplazamiento ni impacto.',
        youtube: 'https://www.youtube.com/results?search_query=skipping+en+sitio+cardio+hiit+tutorial' },
      { nombre: 'V-ups', sets: 3, reps: '15', equipo: 'Peso corporal', nota: 'Core completo',
        descripcion: 'Boca arriba, sube simultáneamente piernas y torso formando una V. Activa el recto abdominal superior e inferior.',
        youtube: 'https://www.youtube.com/results?search_query=v+ups+abdominales+core+completo+tutorial' },
      { nombre: 'Remadora intervalos (HIIT)', sets: 4, reps: '20s sprint / 40s suave', equipo: 'Remadora', nota: 'Cardio bajo impacto',
        descripcion: 'Sprints en remadora: 20 seg al máximo, 40 seg palada suave de recuperación. Preserva articulaciones mejor que saltos.',
        youtube: 'https://www.youtube.com/results?search_query=remadora+hiit+intervalos+rowing+machine+tutorial' }
    ]
  }
};

// ─── Genera el protocolo del día para la semana actual ───
// • Ejercicios core siempre presentes.
// • Accesorios del protocolo base + extras del pool rotan seeded por semana.
// • Filtra por equipamiento disponible.
function generarProtocoloDia(tipoDia, semanaNum, equiposDisp) {
  const diaBase = ENTRENO_PROTOCOLO.dias[tipoDia];
  if (!diaBase) return null;
  const pool = EJERCICIOS_POOL[tipoDia];
  if (!pool) return diaBase;

  const equipos = equiposDisp || ['peso_corporal', 'speediance', 'treadmill_plano'];

  function _equipoId(equipo) {
    if (!equipo) return 'peso_corporal';
    const e = equipo.toLowerCase();
    if (e.includes('remadora')) return 'remadora';
    if (e.includes('speediance') || e.includes('barra/speediance')) return 'speediance';
    if (e.includes('treadmill')) return 'treadmill_plano';
    if (e === 'barra') return 'barra';
    return 'peso_corporal';
  }

  function _disponible(ej) {
    const id = _equipoId(ej.equipo);
    return id === 'peso_corporal' || equipos.includes(id);
  }

  const coreSet = new Set(pool.core);
  const coreEj = diaBase.ejercicios.filter(e => coreSet.has(e.nombre));
  const accesoriosBase = diaBase.ejercicios.filter(e => !coreSet.has(e.nombre) && _disponible(e));
  const extrasDisp = pool.extra.filter(_disponible);

  const todoAccesorios = [...accesoriosBase, ...extrasDisp];
  const seed = semanaNum * 1000 + tipoDia.charCodeAt(0);
  const shuffled = _seededShuffle(todoAccesorios, seed);

  const nAccesorios = pool.totalSesion - coreEj.length;
  const seleccionados = shuffled.slice(0, nAccesorios);

  return Object.assign({}, diaBase, {
    ejercicios: [...coreEj, ...seleccionados],
    semana: semanaNum,
    variante: (Math.abs(seed) % 99) + 1   // número de variante 1-99 para UI
  });
}

// ─── Busca metadatos de un ejercicio (descripcion, youtube) ───
// Busca primero en ENTRENO_PROTOCOLO, luego en EJERCICIOS_POOL.extra
function buscarEjercicio(nombre) {
  for (const k of Object.keys(ENTRENO_PROTOCOLO.dias)) {
    const ej = ENTRENO_PROTOCOLO.dias[k].ejercicios.find(e => e.nombre === nombre);
    if (ej) return ej;
  }
  for (const k of Object.keys(EJERCICIOS_POOL)) {
    const ej = EJERCICIOS_POOL[k].extra.find(e => e.nombre === nombre);
    if (ej) return ej;
  }
  return null;
}

// ─── Exponer a window ───
if (typeof window !== 'undefined') {
  window.NP_RoadmapData = {
    PLATEAU_PROTOCOL,
    ALCOHOL_IMPACTO,
    ALCOHOL_BEBIDAS,
    EQUIPOS_DISPONIBLES,
    ENTRENO_PROTOCOLO,
    EJERCICIOS_POOL,
    FUENTES_PROTEICAS,
    ALIMENTOS_ALTO_VOLUMEN,
    FACTORES_ACTIVIDAD: FACTORES_ACTIVIDAD_FL,
    semanaActual,
    generarProtocoloDia,
    buscarEjercicio
  };
}
