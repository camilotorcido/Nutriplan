# NutriPlan · Fat Loss Mode — Especificación técnica completa
**Para:** Claude Code / desarrollador de `camilotorcido/Nutriplan`  
**Fecha:** 2026-04-27  
**Autor de referencia:** Conversación de coaching Precision Nutrition con Camilo Crespo

---

## 1. Contexto y objetivo

Este documento especifica exactamente cómo se calculan todos los números del plan de pérdida de grasa de Camilo (y cómo hacerlo dinámico para cualquier usuario). La app en `camilotorcido.github.io/Nutriplan` ya tiene gran parte del motor implementado (`NP_Roadmap`, `NP_Plateau`, `NP_FatLoss`). Este spec corrige un error en el cálculo de proteína y documenta el modelo científico completo para integrarlo nativamente.

---

## 2. Datos de Camilo (caso de referencia)

```
Peso actual:    83 kg
Altura:         180 cm
Edad:           40 años
Género:         Masculino (M)
BF% actual:     22% (override manual — sin medición Navy)
BF% objetivo:   10%
Factor actividad: 1.45 (home office + 4 entrenamientos/semana)
Equipamiento:   Speediance (cable + rowing), treadmill, peso corporal
Tasa de pérdida: moderada (450 kcal déficit)
```

---

## 3. Cálculos base — paso a paso

### 3.1 BMR (Tasa Metabólica Basal) — Mifflin-St Jeor

```
Hombres:  BMR = (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) + 5
Mujeres:  BMR = (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) − 161
```

**Camilo:**
```
BMR = (10 × 83) + (6.25 × 180) − (5 × 40) + 5
    = 830 + 1,125 − 200 + 5
    = 1,760 kcal/día
```

### 3.2 TDEE (Gasto Total Diario de Energía)

```
TDEE = BMR × factor_actividad   →  redondeado a múltiplos de 50
```

| Factor | Nivel | Descripción |
|--------|-------|-------------|
| 1.20 | Sedentario | Oficina, sin entreno |
| 1.375 | Ligera | 1-3 entrenos/semana |
| **1.45** | **Moderada** | **Home office + 4 entrenos (default Camilo)** |
| 1.55 | Activa | 4-5 entrenos + trabajo físico |
| 1.725 | Muy activa | 5-6 entrenos intensos |
| 1.90 | Extrema | Atleta, doble sesión |

**Camilo:**
```
TDEE = 1,760 × 1.45 = 2,552 → redondeado a 2,550 kcal
```
> **Nota**: En las fases de Diet Break y en el plateau-paso-4, se usa TDEE como objetivo calórico (`≈ 2,550 kcal`). En la app, `roadmap.calculados.tdee` debe almacenar este valor exacto.

### 3.3 Déficit calórico y calorías de corte

```
Tasa conservadora: 300 kcal/día déficit → ~0.4 kg/semana
Tasa moderada:     450 kcal/día déficit → ~0.6 kg/semana
Tasa agresiva:     600 kcal/día déficit → ~0.8 kg/semana
```

> La equivalencia es 7,700 kcal ≈ 1 kg de grasa corporal.

**Camilo (moderada):**
```
Calorías de corte = TDEE − déficit = 2,550 − 450 = 2,100 kcal
→ En la app se usa 2,050 kcal (ver nota abajo)
```

> **¿Por qué 2,050 y no 2,100?** En el plan de Camilo se usó TDEE = 2,500 kcal (redondeado hacia abajo a múltiplos de 500 para simplicidad). La diferencia es mínima y ambos son válidos. La fórmula del generador (`caloriasCorte = tdee − deficitDiario`) es correcta; el valor final depende del redondeo del TDEE.

---

## 4. Composición corporal inicial

### 4.1 Masa grasa y masa magra actuales

```
LBM (Lean Body Mass / Masa Magra) = peso × (1 − BF%/100)
Masa grasa                         = peso × (BF%/100)
```

**Camilo:**
```
LBM          = 83 × (1 − 0.22) = 83 × 0.78 = 64.74 kg
Masa grasa   = 83 × 0.22       = 18.26 kg
```

### 4.2 Derivar peso objetivo a partir de BF% objetivo

Asumiendo que la LBM se **preserva completamente** durante el proceso (objetivo del protocolo):

```
Peso objetivo = LBM / (1 − BF_objetivo/100)
```

**Camilo (objetivo 10% BF):**
```
Peso objetivo = 64.74 / (1 − 0.10) = 64.74 / 0.90 = 71.9 kg ≈ 72 kg
```

> Esta fórmula solo es válida si la pérdida es mayoritariamente grasa. La tasa moderada (0.4-0.6 kg/sem) + entrenamiento de fuerza garantiza esto. A tasas agresivas o sin entrenamiento, habría que ajustar LBM.

### 4.3 Grasa a perder

```
Grasa a perder = masa_grasa_actual − masa_grasa_objetivo
               = masa_grasa_actual − (peso_objetivo × BF_objetivo/100)
```

**Camilo:**
```
Masa grasa objetivo = 72 × 0.10 = 7.2 kg
Grasa a perder      = 18.26 − 7.2 = 11.06 kg
```

### 4.4 Timeline estimado

```
Semanas activas = (grasa_a_perder / tasa_semanal) × 1.15  [buffer 15%]
```

**Camilo:**
```
Semanas activas = (11.06 / 0.6) × 1.15 = 21.2 semanas ≈ 22 semanas activas
```

Con 2 diet breaks de 2 semanas cada una (cada ~10 semanas de corte):
```
Semanas totales = 22 + (2 × 2) = 26 semanas ≈ 6 meses
```

---

## 5. Proteína — LA FÓRMULA CORRECTA (diferencia con la app actual)

### ⚠️ Bug en la app actual

El generador en `roadmap-generator.js` usa:
```js
// ACTUAL (incorrecto para fat loss)
const proteinaTarget = Math.round(input.peso * 2.2);
// → Para Camilo: 83 × 2.2 = 182.6 → 183g
```

**Esto es proteína por kg de peso total**, no por masa magra.

### ✅ Fórmula correcta (basada en LBM)

La evidencia científica (Helms et al. 2014, Schoenfeld 2018, Precision Nutrition) indica que durante un déficit calórico con entrenamiento de fuerza, la proteína debe calcularse sobre la **masa magra (LBM)**, no el peso total:

```
Proteína (g) = LBM_kg × 2.63   [equivale a ~1.2 g/lb LBM]
```

> El rango evidence-based es 2.2–3.3 g/kg LBM (1.0–1.5 g/lb LBM). El valor 2.63 g/kg LBM representa el punto medio-alto recomendado para preservar masa muscular en déficit calórico.

**Camilo:**
```
LBM = 64.74 kg
Proteína = 64.74 × 2.63 = 170.3 g → 170 g/día
```

> Comparación: el app actual daría 183g (+13g innecesarios que elevan el costo calórico sin beneficio adicional a masa magra).

### Implementación en el código

En `roadmap-generator.js`, reemplazar:
```js
// ANTES:
const proteinaTarget = Math.round(input.peso * 2.2);

// DESPUÉS:
const lbmActual = input.peso * (1 - bfActual / 100);
const proteinaTarget = Math.round(lbmActual * 2.63);
// Alias también disponible: Math.round(lbmActual * 1.2 * 2.2046) — mismo resultado
```

---

## 6. Distribución de macros — carbohidratos y grasas

### Paso 1: Kcal disponibles tras proteína

```
kcal_proteína = proteinaTarget × 4
kcal_restantes = calorías_corte − kcal_proteína
```

**Camilo:**
```
kcal_proteína  = 170 × 4 = 680 kcal
kcal_restantes = 2,050 − 680 = 1,370 kcal
```

### Paso 2: Split 57% carbs / 43% grasas (del remanente)

```
kcal_carbos = kcal_restantes × 0.572
kcal_grasas = kcal_restantes × 0.428

carbohidratos_g = kcal_carbos / 4
grasas_g        = kcal_grasas / 9
```

**Camilo:**
```
kcal_carbos     = 1,370 × 0.572 = 784 kcal
kcal_grasas     = 1,370 × 0.428 = 587 kcal

carbohidratos_g = 784 / 4 = 196 g
grasas_g        = 587 / 9 = 65.2 → 65 g
```

**Verificación:**
```
680 (P) + 784 (C) + 585 (G) = 2,049 ≈ 2,050 kcal ✓
```

### Distribución porcentual resultante

| Macro | Gramos | Kcal | % del total |
|-------|--------|------|-------------|
| Proteína | 170 g | 680 | 33% |
| Carbohidratos | 196 g | 784 | 38% |
| Grasas | 65 g | 585 | 29% |
| **Total** | | **2,049** | **100%** |

> Esta distribución coincide exactamente con la línea en `fat-loss-integration.js`:  
> `macros: { proteinas: 33, carbohidratos: 38, grasas: 29 }`  
> Los porcentajes están bien. Solo la conversión de % → gramos necesita el fix de LBM.

### Implementación en el código

Agregar en `roadmap-generator.js` dentro de la función `generarRoadmapFatLoss()`:

```js
// Calcular macros exactos en gramos (basados en LBM, no en porcentajes fijos)
function calcularMacrosGramos(caloriasCorte, proteinaTarget) {
  const kcalProteina = proteinaTarget * 4;
  const kcalRestantes = caloriasCorte - kcalProteina;
  const carbohidratosG = Math.round((kcalRestantes * 0.572) / 4);
  const grasasG = Math.round((kcalRestantes * 0.428) / 9);
  return {
    proteina: proteinaTarget,
    carbohidratos: carbohidratosG,
    grasas: grasasG,
    // porcentajes para compatibilidad con la UI existente
    pctProteina: Math.round((proteinaTarget * 4 / caloriasCorte) * 100),
    pctCarbos: Math.round(((carbohidratosG * 4) / caloriasCorte) * 100),
    pctGrasas: Math.round(((grasasG * 9) / caloriasCorte) * 100)
  };
}
```

Y almacenar en `calculados`:
```js
macrosGramos: calcularMacrosGramos(caloriasCorte, proteinaTarget),
```

---

## 7. Estructura de fases (cronograma dinámico)

### Regla general de diet breaks

```
1 diet break por cada 10 semanas de corte activo
Duración de cada diet break: 2 semanas exactas
Calorías en diet break: TDEE (mantenimiento)
```

**Camilo (22 semanas activas → 2 diet breaks):**

| Fase | Tipo | Meses | Semanas | Kcal | BF% rango | Peso rango |
|------|------|-------|---------|------|-----------|------------|
| Fase 1: Fundación | Corte | 1-3 | ~10 sem | 2,050 | 22% → 16.5% | 83→77.5 kg |
| Diet Break #1 | Mantenimiento | 4 | 2 sem | ~2,550 | ~16.5% | ~77.5 kg |
| Fase 2: Profundizar | Corte | 5-7 | ~8 sem | 2,000 | 16.5% → 12% | 77.5→74 kg |
| Diet Break #2 | Mantenimiento | 8 | 2 sem | ~2,550 | ~12% | ~74 kg |
| Fase 3: Last Mile | Corte | 9-10 | ~4 sem | 1,950 | 12% → 10% | 74→72 kg |

### Escalonado de calorías entre fases

Cada bloque de corte subsiguiente baja 50 kcal (adaptación metabólica):
```
Bloque 1: caloriasCorte − 0   = 2,050
Bloque 2: caloriasCorte − 50  = 2,000
Bloque 3: caloriasCorte − 100 = 1,950
Piso mínimo: TDEE − 800 = 2,550 − 800 = 1,750 kcal (nunca bajar de aquí)
```

### Diet Break: lo que pasa fisiológicamente

Durante el corte, la leptina cae ~50% en 7-14 días. La leptina es la hormona que regula el hambre y el metabolismo. Dos semanas a TDEE:
- Restaura leptina al 80-100% de los niveles basales
- Normaliza cortisol (hormona de estrés/catabolismo)
- Recarga glucógeno muscular y hepático
- Permite recuperación psicológica

**Efecto esperado en el peso:** +0.5-1.5 kg en los primeros días del diet break. Esto es **glucógeno + agua**, no grasa. Cada gramo de glucógeno se almacena con 3-4g de agua. Una recarga de ~400g glucógeno añade ~1.6 kg de peso inmediato. Esto se pierde en los primeros 3-5 días de retomar el corte.

---

## 8. Protocolo de Plateau — 6 pasos escalados

Ya implementado en `plateau-detector.js` y `roadmap-data.js`. **No requiere cambios de lógica**. Solo documentación de los umbrales:

```
Plateau = pérdida de peso < 0.25 kg/semana durante ≥ 14 días consecutivos
```

| Paso | Acción | Duración | Δ Calorías | Δ Pasos |
|------|--------|----------|------------|---------|
| 1 | Auditoría de tracking (calorías ocultas) | 7 días | 0 | 0 |
| 2 | +1,500-2,000 pasos/día | 10-14 días | 0 | +1,500 |
| 3 | Reducir carbos −30g (−120 kcal) | 10-14 días | −120 | 0 |
| 4 | Diet Break 2 semanas (subir a TDEE) | 14 días | +TDEE | 0 |
| 5 | Reducir calorías −100 kcal adicionales | 2-3 semanas | −100 | 0 |
| 6 | Cardio formal (20-30 min × 3/semana) | Hasta nuevo progreso | 0 | 0 |

### Regla de implementación del detector

```js
// plateau-detector.js ya implementado correctamente:
const PLATEAU_UMBRAL_KG_SEM = 0.25; // menos de esto = meseta
const PLATEAU_DIAS_MIN = 14;        // durante al menos este tiempo
```

La detección compara el promedio de peso de la última semana vs el promedio de la semana anterior (ventana 7d vs 14-21d). Si el `deltaSemanal` es menor a 0.25 kg durante 14+ días consecutivos → meseta.

---

## 9. Pasos y NEAT (Non-Exercise Activity Thermogenesis)

El NEAT es la variable más poderosa en el déficit porque:
1. Los pasos NO elevan el apetito (el cardio formal sí)
2. 1,000 pasos extra ≈ 40-50 kcal adicionales quemadas
3. Es completamente sostenible en el tiempo

### Targets progresivos por fase

```
Fase 1:        8,000 pasos/día
Fase 2:       10,000 pasos/día  
Fase 3:       12,000 pasos/día
Plateau paso 2: +1,500-2,000 sobre el target actual
```

**Recomendación de implementación:** El `targetPasos` ya existe por fase en el modelo de datos (`ENTRENO_PROTOCOLO`). En la UI, mostrarlo como KPI diario con barra de progreso en la pantalla principal.

---

## 10. Alcohol — Protocolo de impacto

Ya implementado en `roadmap-data.js` como `ALCOHOL_IMPACTO`. El mecanismo:

1. El alcohol bloquea la oxidación de grasa por 6-24h (el hígado prioriza metabolizar el etanol)
2. Inhibe la síntesis de proteína muscular entre 5-20% durante 48h
3. Las calorías del alcohol son "vacías" (7 kcal/g) pero se metabolizan primero

**Regla práctica para integrar en la UI:**

```
Si el usuario registra alcohol en un día:
  → Sugerencia automática: reducir carbos en ese día para compensar calorías
  → No reducir proteína (proteger síntesis muscular)
  → Calcular kcal de alcohol y restarlas del presupuesto de carbos del día
```

---

## 11. Cambios específicos requeridos en el código NutriPlan

### Cambio 1: `roadmap-generator.js` — Fix proteína (CRÍTICO)

**Archivo:** `js/roadmap-generator.js`  
**Función:** `generarRoadmapFatLoss()`  
**Cambio:**

```js
// LÍNEA ACTUAL (~113):
const proteinaTarget = Math.round(input.peso * 2.2);

// REEMPLAZAR POR:
// Proteína basada en LBM (Lean Body Mass), no en peso total
// Referencia: Helms et al. 2014, ~2.63 g/kg LBM = 1.2 g/lb LBM
const proteinaTarget = Math.round(lbmActual * 2.63);
```

**Nota:** `lbmActual` ya está calculado unas líneas antes en la misma función. Solo mover la asignación de `proteinaTarget` a después del cálculo de `lbmActual`.

### Cambio 2: `roadmap-generator.js` — Agregar macros en gramos a `calculados`

Agregar en el bloque `calculados` del objeto retornado:

```js
calculados: {
  // ... campos existentes ...
  proteinaTarget,
  // NUEVO: macros exactos en gramos
  macrosGramos: {
    proteina: proteinaTarget,
    carbohidratos: Math.round(((caloriasCorte - proteinaTarget * 4) * 0.572) / 4),
    grasas: Math.round(((caloriasCorte - proteinaTarget * 4) * 0.428) / 9)
  },
  // NUEVO: calorías desglosadas
  macrosKcal: {
    proteina: proteinaTarget * 4,
    carbohidratos: Math.round((caloriasCorte - proteinaTarget * 4) * 0.572),
    grasas: Math.round((caloriasCorte - proteinaTarget * 4) * 0.428)
  }
}
```

### Cambio 3: `fat-loss-integration.js` — Usar macros en gramos del roadmap

**Archivo:** `js/fat-loss-integration.js`  
**Función:** `activarFatLossMode()`  
**Cambio en la línea de `macros`:**

```js
// ACTUAL:
macros: { proteinas: 33, carbohidratos: 38, grasas: 29 }

// REEMPLAZAR POR (gramos reales + porcentajes como fallback):
macros: {
  // Gramos (calculados con LBM)
  proteinaG: roadmap.calculados.macrosGramos.proteina,
  carbosG: roadmap.calculados.macrosGramos.carbohidratos,
  grasasG: roadmap.calculados.macrosGramos.grasas,
  // Porcentajes (para compatibilidad con UI existente)
  proteinas: roadmap.calculados.macrosGramos.pctProteina || 33,
  carbohidratos: roadmap.calculados.macrosGramos.pctCarbos || 38,
  grasas: roadmap.calculados.macrosGramos.pctGrasas || 29
}
```

### Cambio 4: UI — Mostrar macros en gramos, no solo porcentajes

En el componente/pantalla que muestra los targets de macros del día, priorizar los gramos sobre los porcentajes:

```
Target diario visible en UI:
  📊 2,050 kcal
  🥩 Proteína:      170 g  (680 kcal · 33%)
  🌾 Carbohidratos: 196 g  (784 kcal · 38%)
  🥑 Grasas:         65 g  (585 kcal · 29%)
```

---

## 12. Validaciones y edge cases

### Proteína mínima garantizada

```js
// Siempre asegurar un mínimo de proteína aunque el BF% sea bajo
const PROTEINA_MIN_G_PER_KG_PESO = 1.6;
const proteinaMinimaAbsoluta = Math.round(input.peso * PROTEINA_MIN_G_PER_KG_PESO);
const proteinaTarget = Math.max(
  Math.round(lbmActual * 2.63),
  proteinaMinimaAbsoluta
);
```

### Calorías mínimas de corte

```js
// Nunca bajar de TDEE - 800 kcal (protege hormonas y metabolismo)
const caloriasCorteMinimo = tdee - 800;
const caloriasCorte = Math.max(caloriasCorteMinimo, tdee - deficitDiario);
```

### BF% por debajo del natural

Si el usuario ingresa BF% objetivo muy bajo (< 6% hombres, < 14% mujeres), la app debe mostrar una advertencia y sugerir ajustar el objetivo.

---

## 13. Flujo de datos completo (para referencia)

```
INPUT (wizard):
  peso=83, altura=180, edad=40, genero=M
  bfOverride=22, bfTarget=10
  factorActividad=1.45, tasaPerdida='moderada'

  ↓ roadmap-generator.js → generarRoadmapFatLoss()

CALCULADOS:
  bmr                = 1,760
  tdee               = 2,550  (redondeado a 50)
  bfActual           = 22.0%
  lbmActual          = 64.74 kg
  masaGrasaActual    = 18.26 kg
  pesoTarget         = 71.9 kg
  bfTarget           = 10.0%
  masaGrasaTarget    = 7.2 kg
  grasaAPerder       = 11.06 kg
  deficitDiario      = 450 kcal
  caloriasCorte      = 2,100 (o 2,050 con TDEE=2,500)
  proteinaTarget     = 170 g  ← LBM × 2.63
  macrosGramos       = { proteina:170, carbos:196, grasas:65 }
  semanasActivas     = 22
  cantDietBreaks     = 2
  semanasTotales     = 26
  mesesTotales       = 6

  ↓ fat-loss-integration.js → activarFatLossMode()

PERFIL GUARDADO:
  fatLossMode        = true
  caloriasManual     = 2,050 (fase 1)
  proteinaFloor      = 170
  macros.proteinaG   = 170
  macros.carbosG     = 196
  macros.grasasG     = 65

  ↓ (tiempo pasa) ↓

CADA DÍA:
  faseActualPerfil() → fase 1|2|3|dietBreak
  caloriasObjetivoEfectivas() → 2,050 | 2,000 | 1,950 | 2,550
  
  Cada 14 días sin progreso (<0.25 kg/sem):
  NP_Plateau.detectar() → { plateau: true }
  → Sugerir paso 1 del protocolo
```

---

## 14. Archivos relevantes en el repositorio

| Archivo | Estado | Acción requerida |
|---------|--------|------------------|
| `js/roadmap-generator.js` | ⚠️ Fix necesario | Cambiar `peso × 2.2` → `LBM × 2.63` |
| `js/fat-loss-integration.js` | ✅ OK | Agregar macrosGramos al perfil |
| `js/plateau-detector.js` | ✅ OK | Sin cambios |
| `js/roadmap-data.js` | ✅ OK | Sin cambios |
| `js/body-comp.js` | Revisar | Asegurarse que `tendencia()` retorna deltaSemanal correcto |
| `js/steps.js` | Revisar | Verificar integración con targetPasos de la fase activa |
| `js/nutritionEngine.js` | Revisar | Actualizar para priorizar `macrosGramos.proteina` sobre cálculo propio |

---

## 15. Resumen de fórmulas (cheat sheet)

```
BMR (M)  = 10×P + 6.25×A − 5×E + 5
TDEE     = BMR × FA  (redondeado a 50)
Déficit  = 300 | 450 | 600 kcal/día según tasa
LBM      = P × (1 − BF/100)
Proteína = LBM × 2.63  [g]   ← KEY FIX
Carbos   = (TDEE_corte − Prot×4) × 0.572 / 4  [g]
Grasas   = (TDEE_corte − Prot×4) × 0.428 / 9  [g]
Peso obj = LBM / (1 − BF_obj/100)
Semanas  = (grasa_a_perder / tasa) × 1.15
Plateau  = |Δpeso_semanal| < 0.25 kg × 14+ días

P = peso_kg, A = altura_cm, E = edad, FA = factor actividad
```

---

*Documento generado el 2026-04-27. Basado en metodología Precision Nutrition y evidencia meta-analítica (Helms et al. 2014, Schoenfeld & Aragon 2018, Hall et al. 2012).*
