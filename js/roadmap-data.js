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
  { nombre: 'Piscola', ml: 250, kcal: 195, alcohol_pct: 8 },
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
        { nombre: 'Press pecho cables (bajo-arriba)', sets: 4, reps: '8-10', equipo: 'Speediance', nota: 'Excéntrico 3 seg' },
        { nombre: 'Aperturas cable chest fly', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Rango completo' },
        { nombre: 'Press hombros cables bilateral', sets: 3, reps: '10-12', equipo: 'Speediance', nota: '' },
        { nombre: 'Elevaciones laterales cable', sets: 3, reps: '15', equipo: 'Speediance', nota: 'Técnica limpia' },
        { nombre: 'Tríceps pushdown cable', sets: 3, reps: '12-15', equipo: 'Speediance', nota: '' },
        { nombre: 'Pike pushups', sets: 2, reps: 'máx', equipo: 'Peso corporal', nota: 'Complemento hombros' },
        { nombre: 'Plancha frontal', sets: 3, reps: '40 seg', equipo: 'Peso corporal', nota: '' },
        { nombre: 'Plancha lateral alternada', sets: 2, reps: '30 seg c/lado', equipo: 'Peso corporal', nota: '' }
      ]
    },
    B: {
      nombre: 'Día B — PIERNAS',
      foco: 'Squat, Hip Hinge, Glúteos',
      equipamiento: 'Speediance + peso corporal',
      duracionMin: 55,
      ejercicios: [
        { nombre: 'Squat con cable frontal', sets: 4, reps: '10-12', equipo: 'Speediance', nota: 'Espalda neutra' },
        { nombre: 'Romanian Deadlift cable', sets: 3, reps: '10-12', equipo: 'Speediance', nota: 'Hip hinge limpio' },
        { nombre: 'Bulgarian split squat', sets: 3, reps: '10 c/pierna', equipo: 'Peso corporal', nota: 'Alta dificultad' },
        { nombre: 'Glute kickbacks cable', sets: 3, reps: '15 c/lado', equipo: 'Speediance', nota: 'Activación glúteo' },
        { nombre: 'Curl de pierna cable', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Isquiotibiales' },
        { nombre: 'Hip thrust en el suelo', sets: 3, reps: '15-20', equipo: 'Peso corporal', nota: 'Glúteo' },
        { nombre: 'Lunges alternados caminando', sets: 3, reps: '12 c/pierna', equipo: 'Peso corporal', nota: '' },
        { nombre: 'Sentadilla sumo amplia', sets: 2, reps: '20', equipo: 'Peso corporal', nota: 'Warm-down' }
      ]
    },
    C: {
      nombre: 'Día C — JALAR / ESPALDA',
      foco: 'Espalda, Rowing, Bíceps',
      equipamiento: 'Speediance modo remo + cables',
      duracionMin: 50,
      ejercicios: [
        { nombre: 'Rowing Speediance (modo remo)', sets: 1, reps: '10-15 min', equipo: 'Speediance', nota: 'Calentamiento fuerza-resistencia' },
        { nombre: 'Cable row sentado', sets: 4, reps: '10-12', equipo: 'Speediance', nota: 'Codos pegados al cuerpo' },
        { nombre: 'Lat pulldown cable', sets: 3, reps: '10-12', equipo: 'Speediance', nota: 'Agarre ancho' },
        { nombre: 'Remo unilateral cable', sets: 3, reps: '12 c/lado', equipo: 'Speediance', nota: 'Anti-rotación core' },
        { nombre: 'Face pulls cable', sets: 3, reps: '15', equipo: 'Speediance', nota: 'Salud manguito rotador' },
        { nombre: 'Curl bíceps cable supinado', sets: 3, reps: '12-15', equipo: 'Speediance', nota: 'Supinación completa' },
        { nombre: 'Superman extensión espalda', sets: 3, reps: '15', equipo: 'Peso corporal', nota: 'Erector spinae' },
        { nombre: 'Dead hang / inverted row', sets: 2, reps: '30 seg', equipo: 'Barra/Speediance', nota: 'Agarre y espalda alta' }
      ]
    },
    D: {
      nombre: 'Día D — FULL BODY CIRCUITO',
      foco: 'Circuito metabólico + cardio optativo',
      equipamiento: 'Peso corporal + Treadmill',
      duracionMin: 45,
      ejercicios: [
        { nombre: 'Burpees (o half-burpee)', sets: 4, reps: '10 rondas', equipo: 'Peso corporal', nota: 'Modificar si dolor articular' },
        { nombre: 'Sentadillas con salto', sets: 4, reps: '12 rondas', equipo: 'Peso corporal', nota: 'Box squat si rodillas' },
        { nombre: 'Mountain climbers', sets: 4, reps: '30 seg rondas', equipo: 'Peso corporal', nota: 'Core + cardio' },
        { nombre: 'Rowing explosivo', sets: 4, reps: '30s sprint / 30s fácil', equipo: 'Speediance', nota: '' },
        { nombre: 'Flexiones de brazos', sets: 4, reps: 'máx rondas', equipo: 'Peso corporal', nota: 'Torso recto' },
        { nombre: 'Lunges con rotación', sets: 4, reps: '10 c/pierna rondas', equipo: 'Peso corporal', nota: 'Movilidad' },
        { nombre: 'Dead bug / hollow body', sets: 4, reps: '30 seg rondas', equipo: 'Peso corporal', nota: 'Core profundo' },
        { nombre: 'Treadmill inclinado (10%)', sets: 1, reps: '10-20 min', equipo: 'Treadmill', nota: 'Cardio suave — ritmo conversacional' }
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

// ─── Exponer a window ───
if (typeof window !== 'undefined') {
  window.NP_RoadmapData = {
    PLATEAU_PROTOCOL,
    ALCOHOL_IMPACTO,
    ALCOHOL_BEBIDAS,
    ENTRENO_PROTOCOLO,
    FUENTES_PROTEICAS,
    ALIMENTOS_ALTO_VOLUMEN,
    FACTORES_ACTIVIDAD: FACTORES_ACTIVIDAD_FL
  };
}
