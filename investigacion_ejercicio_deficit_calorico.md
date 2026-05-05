# Investigación: Rutinas de ejercicio en déficit calórico — bajada a features de Calibrate

**Fecha:** 2026-05-05
**Fuente:** NotebookLM cuaderno "Calibrate" (9 sources científicas)
**Notebook URL:** https://notebooklm.google.com/notebook/860bea31-8fa5-4474-987c-b0e5047df4b5

---

## Glosario rápido

**Modalidades de entrenamiento**
- **RT** — *Resistance Training*: entrenamiento de fuerza/pesas.
- **AT** — *Aerobic Training*: cardio sostenido (trote, bici, elíptica, etc.).
- **CT** — *Concurrent Training*: combinación de RT + AT en la misma semana.
- **LISS** — *Low-Intensity Steady State*: cardio largo y suave (caminar inclinado, bici suave).
- **HIIT** — *High-Intensity Interval Training*: cardio en intervalos cortos a alta intensidad.

**Esfuerzo y carga**
- **RPE** — *Rate of Perceived Exertion*: escala 1–10 de cuán duro se sintió el esfuerzo.
- **sRPE** — *session RPE*: RPE × duración en minutos. Mide carga interna acumulada.
- **RIR** — *Reps In Reserve*: cuántas reps quedaban en el tanque al terminar el set (RIR 2 ≈ RPE 8).
- **1RM** — peso máximo que se puede levantar 1 sola vez. La intensidad se expresa como % de 1RM.
- **HR** — *Heart Rate* (frecuencia cardiaca).

**Composición corporal y energía**
- **FFM** — *Fat-Free Mass*: masa libre de grasa (incluye músculo, hueso, agua, órganos).
- **LBM** — *Lean Body Mass*: equivalente práctico a FFM, suele usarse intercambiablemente.
- **NEAT** — *Non-Exercise Activity Thermogenesis*: calorías quemadas en movimiento espontáneo (caminar, fidgeting, postura). Cae con el déficit.
- **TDEE** — *Total Daily Energy Expenditure*: gasto calórico total del día.
- **TEF** — *Thermic Effect of Food*: calorías quemadas digiriendo (≈10% del TDEE).
- **EPOC** — *Excess Post-exercise Oxygen Consumption*: el "afterburn" tras entrenar.
- **EA** — *Energy Availability*: kcal disponibles tras descontar el ejercicio, divididas por kg de FFM.
- **LEA** — *Low Energy Availability*: EA bajo umbrales saludables (<30 kcal/kg FFM = clínica).

---

## Resumen ejecutivo

Tres hallazgos que deberían moldear el módulo de entrenamiento de Calibrate:

1. **La modalidad importa según el objetivo.** Para perder grasa absoluta, el cardio aeróbico (AT) y el entrenamiento concurrente (CT, fuerza + cardio) ganan al entrenamiento de fuerza solo (RT). Para *preservar masa magra*, RT puro es superior a AT y empata con CT — pero solo si el volumen de cardio no canibaliza la recuperación. Resultado: en Fase 1 de Calibrate, **CT es la elección por defecto**; en Last Mile, **transicionar a RT casi puro**.

2. **El déficit cobra una factura medible y predecible.** Hombres no obesos en déficit del 50% durante 24 semanas perdieron 40% del gasto energético basal — y 15% de esa caída fue adaptación metabólica pura, más allá de la pérdida de peso. El NEAT (movimiento espontáneo no-ejercicio) cae proporcionalmente al déficit y permanece suprimido tras volver a comer ad libitum. Calibrate ya tiene Refeed y Last Mile como respuesta a esto; **falta agregar tracking explícito de actividad espontánea (pasos diarios) como early-warning**.

3. **El esfuerzo percibido (RPE) supera a la frecuencia cardiaca como métrica interna.** El sRPE (RPE × duración de la sesión) detecta acumulación de fatiga 2–3 semanas antes que las métricas de HR, especialmente en periodos de alta carga. Para Calibrate esto significa: el feedback semanal del usuario sobre dificultad subjetiva del entrenamiento es la métrica más útil para autorregular el déficit.

---

## Hallazgos clave (con cifras)

### Modalidad y composición corporal

| Comparación | Pérdida masa total | Pérdida masa grasa | Retención FFM |
|---|---|---|---|
| AT vs RT (≥10 sem) | AT gana en -1.82 kg | AT gana en -1.06 kg | RT gana en +0.88 kg |
| CT vs RT | sin dif. signif. | CT gana en -1.09 kg | sin dif. signif. |
| AT vs CT | AT gana en -1.13 kg | sin dif. signif. | sin dif. signif. |
| Mismo día vs días separados (CT) | sin dif. signif. | sin dif. signif. | sin dif. signif. |

> Lafontant et al. (2025), meta-análisis de 36 RCTs / 1564 participantes [^1].

**Para Calibrate:** el cardio "no estorba" en términos de masa magra **siempre que esté combinado con RT** (CT). El timing es libre — la app puede dejar al usuario elegir AM/PM y mismo día/distinto.

### Volumen, frecuencia, intensidad

- **Volumen objetivo:** 6–9 series por grupo muscular por sesión (sesión de "volumen moderado", como las usan los bodybuilders en prep) [^2].
- **Intensidad:** 70–80% 1RM [^2].
- **RPE objetivo:** ≥7 en escala 1–10 ("Hard") para asegurar estímulo anabólico; sesiones a RPE 5–6 dan estímulo moderado, ≤4 son "fáciles" y no construyen [^3].
- **Frecuencia por grupo muscular:** la literatura no fija un número exacto, pero priorizar **volumen total y intensidad** sobre frecuencia [^1].

### Cardio

- **Tipo:** LISS y HIIT son equivalentes en pérdida de grasa cuando se iguala la carga total. La diferencia en EPOC depende de la intensidad, no de la modalidad [^1].
- **Dosis:** ajustada al gasto calórico objetivo, no hay un número absoluto. Ojo con sesiones de RT/CT cortas: por los descansos, RT/CT necesitan más duración para igualar el gasto de AT continuo [^1].
- **Timing:** mismo día vs días distintos no afecta el resultado; queda a preferencia personal [^1].

### Adaptación metabólica

- **Caída de gasto basal:** hombres no obesos con 50% déficit durante 24 sem → -40% gasto, de los cuales 15% es adaptación pura más allá de pérdida de peso [^2].
- **NEAT:** decrece con el déficit y **permanece suprimido tras volver a alimentación libre** — riesgo de regain [^4].
- **Identificación práctica:** plateau de pérdida con calorías ya bajas + alto volumen de entreno = adaptación metabólica clínica [^4].
- **Estrategias evidenciadas:** déficit "stepwise" (re-abrir el déficit cuando hay plateau), RT estructurado, proteína 2.3–3.1 g/kg LBM, refeeds [^4][^2].

### Refeeds

- **Definición:** 1–2 días/semana de calorías ligeramente sobre mantenimiento, mayormente en carbos [^4].
- **Efecto medido en TDEE:** ~7% aumento agudo (≈138 kcal extra), de los cuales ~36 kcal son TEF de los carbos [^4].
- **Mecanismo:** elevación aguda de leptina, correlacionada con ingesta de carbos [^4].
- **Bajada práctica:** programar **sesiones más pesadas en días de refeed** para aprovechar glucógeno y mayor disponibilidad energética [^2].

### Energy Availability — el límite no negociable

| EA (kcal/kg FFM/día) | Estado | Implicancia |
|---|---|---|
| ≥45 | Óptimo | Sin restricciones |
| 30–40 (♂) / 30–45 (♀) | LEA subclínica | Tolerable en periodos cortos de cut bien diseñado |
| <30 | LEA clínica | Compromete entrenamiento, performance, sistemas múltiples |

> Melin et al., World Athletics consensus [^5].

**EA = (intake en kcal − gasto del ejercicio) / kg FFM**. Para Calibrate: si conocemos peso y % grasa del usuario, podemos estimar FFM y advertir cuando el déficit + entrenamiento empuja EA bajo 30. Esa es una **red flag clara, cuantitativa, accionable**.

### Periodización del déficit

- **Tasa óptima de pérdida:** 0.5–1% peso/sem para maximizar retención muscular [^2].
- **Pérdida más rápida (>1%/sem) = más LBM perdida, especialmente en personas magras** [^2].
- **Duración:** dietas de 2–4 meses con pérdida 0.5–1%/sem retienen más LBM que cuts cortos y agresivos [^2].
- **Conforme el sujeto se pone más magro:** bajar la tasa hacia 0.5%/sem, subir proteína al tope del rango, considerar reducir el déficit subiendo carbos [^2].

---

## Prescripción por fase de Calibrate

### Fase 1 — Déficit moderado (8–12 semanas)

| Variable | Prescripción |
|---|---|
| Modalidad | **CT** (RT + cardio combinado), o RT con cardio NEAT |
| Volumen RT | 6–9 sets/grupo muscular/sesión |
| Frecuencia RT | 3–5 sesiones/sem (split o full-body), ajustar para que entren los sets totales |
| Intensidad | 70–80% 1RM, RPE 7–8 |
| Cardio | A discreción según gasto objetivo. LISS o HIIT indistinto. Mismo día o separado. |
| NEAT | Apuntar a 8–10k pasos/día como baseline; tracking diario |
| Tasa de pérdida objetivo | 0.7–1% peso/sem |
| Métricas core | Peso (promedio semanal), carga en 3–5 lifts clave, sRPE por sesión, pasos diarios |
| Red flags | Caída >5% en lifts; pasos diarios cayendo sin razón; sRPE subiendo sin cambios en programa |

### Fase 2 — Déficit profundo (4–8 semanas)

| Variable | Prescripción |
|---|---|
| Modalidad | Migrar progresivamente hacia **RT-prioritario**, reducir cardio si la fatiga sube |
| Volumen RT | Mantener Fase 1 si recuperación lo permite; bajar 20–30% si sRPE sube |
| Frecuencia RT | Misma o redistribuir en más sesiones cortas si el RPE intra-sesión es excesivo |
| Intensidad | 70–80% 1RM. Priorizar intensidad sobre volumen |
| Cardio | LISS preferente (menos interference); subir minutos solo si peso se estanca |
| NEAT | Defender baseline activamente; agregar caminatas conscientes |
| Tasa de pérdida objetivo | 0.5–0.7% peso/sem |
| Métricas core | Igual que Fase 1 + variación de sRPE entre semanas |
| Red flags | sRPE en aumento para mismo trabajo (fatiga acumulada); pérdida de fuerza en lifts |

### Last Mile (2–4 semanas)

| Variable | Prescripción |
|---|---|
| Modalidad | **RT puro**. Cardio mínimo necesario |
| Volumen RT | Tapering: -20–30% volumen, **mantener intensidad** (peso en barra) |
| Frecuencia RT | Sesiones más cortas y frecuentes para manejar caída de capacidad de trabajo |
| Intensidad | Mantener cargas, evitar fallo excesivo (control cortisol) |
| Cardio | Minimizar; preferir aumentar carbos (reducir déficit) sobre añadir cardio |
| NEAT | Intervenciones conscientes; el NEAT está extremadamente suprimido |
| Tasa de pérdida objetivo | 0.5%/sem máximo. Si peso baja más rápido, sospechar pérdida de FFM |
| Red flags | LEA clínica (<30 kcal/kg FFM): bradicardia, hipotensión, libido caída, sueño malo |

### Refeed (1–2 días/semana)

| Variable | Prescripción |
|---|---|
| Programación | Alinear con **sesiones más pesadas/exigentes de RT** |
| Calorías | Ligeramente sobre mantenimiento (no superávit grande) |
| Composición | Aumento principalmente vía **carbohidratos** (eleva leptina mejor que grasas) |
| RPE objetivo en sesión | 8–10 (aprovechar el glucógeno y la energía) |
| Tracking | Respuesta del peso post-refeed (rebote esperado de 0.5–1.5 kg de agua/glucógeno, normaliza en 3–4 días); sensación de hambre/saciedad |

---

## Diseño del módulo de entrenamiento en Calibrate — recomendaciones

### Inputs mínimos del usuario al setup

1. Peso, altura, % grasa estimado (si tiene)
2. Experiencia con pesas (principiante / intermedio / avanzado)
3. Disponibilidad semanal (días, minutos por sesión)
4. Acceso a equipo (gimnasio completo / equipo casero / solo bodyweight)
5. Preferencias de cardio (LISS vs HIIT vs ninguno)

### Outputs que la app debe generar

1. **Plan semanal** que respete:
   - Mínimo 2 sesiones de RT (o 3 idealmente)
   - 6–9 sets/grupo muscular/sesión, distribuidos
   - Cardio según gasto objetivo y preferencia
2. **Logbook** simple para registrar:
   - Peso × reps × sets por ejercicio
   - sRPE de la sesión (1 input al final)
   - Pasos del día (sync con HealthKit / Google Fit)
3. **Dashboard semanal** con:
   - Promedio semanal de peso (no peso del día — clave para no leer ruido)
   - Cambio % en lifts clave vs semana anterior
   - sRPE promedio y tendencia
   - Pasos diarios promedio y tendencia
   - Estimación de EA (si tiene FFM): kcal/kg FFM/día
4. **Alertas / red flags automáticas:**
   - Caída >5% en lifts en 2 semanas seguidas → sugerir bajar volumen o subir kcal
   - sRPE subiendo >1 punto sin cambio en programa → fatiga acumulada
   - Pasos cayendo >20% sin razón → NEAT crashing
   - EA estimada <30 kcal/kg FFM → señal roja
   - Peso plateaued >2 semanas con todo bien → tiempo de re-abrir déficit o programar diet break

### Integración con el roadmap nutricional existente

El roadmap actual de Calibrate (Fase 1 → Fase 2 → Last Mile → Refeed) ya está bien alineado con lo que dice la literatura. Lo que falta son los **disparadores de transición entre fases basados en métricas de entrenamiento**, no solo en peso o tiempo:

- **Pasar de Fase 1 a Fase 2:** después de 8–12 sem o cuando peso se estanca con buen compliance.
- **Pasar a Last Mile:** cuando el sujeto está cerca de meta (último 2–4% grasa por bajar) Y los lifts aún están dentro de -5% del baseline.
- **Disparar Refeed:** cuando 2+ red flags activas, o cada 7–14 días en Fase 2 / Last Mile.
- **Detener el cut (volver a mantenimiento o reverse diet):** EA <30, lifts >10% por debajo, sRPE crónicamente elevado, sueño/libido afectados.

### Coaching con AI (la diferenciación de Calibrate)

El agente de coach de Calibrate (Haiku) ya tiene tools para leer/escribir el plan. Agregar tools para:

1. `read_training_log(week)` — devuelve sets/reps/RPE/pasos de la semana
2. `read_red_flags()` — devuelve cuáles están activas y por qué
3. `suggest_phase_transition()` — analiza métricas y propone si toca cambiar de fase
4. `prescribe_session(session_id, fatigue_state)` — ajusta sets y carga según RPE de la sesión anterior

El system prompt debe enseñarle al agente las reglas de oro:
- Nunca recomendar volumen >12 sets/grupo/sesión en cut
- Nunca bajar la intensidad por debajo de 70% 1RM en cut
- Si RPE >9 reportado dos sesiones seguidas: bajar volumen, no carga
- Si peso baja >1.5%/sem: forzar refeed inmediato o pausar Fase 2

---

## Brechas detectadas en esta investigación

Cosas que las fuentes del cuaderno no resuelven con datos sólidos y que valen futura investigación:

1. **Frecuencia óptima por grupo muscular en cut.** 2x/sem vs 3x/sem no está claro en la literatura específica de déficit. Para resolver: agregar Schoenfeld 2017 dose-response como source.
2. **Cuánto cardio antes del interference effect en cut.** Hay umbral en literatura de hipertrofia (≥3-4 sesiones HIIT/sem en sujetos con RT serio comienza a interferir), pero no específico de cut.
3. **Diet breaks (1-2 sem en mantenimiento) vs refeeds (1-2 días/sem).** La evidencia es mixta. Vale la pena buscar el MATADOR study o equivalentes.
4. **Periodización del cardio dentro del cut** (ej. más en Fase 1, menos en Last Mile vs constante). Las fuentes asumen volumen flexible pero no prescriben curvas.
5. **Auto-regulación con RPE en RT específicamente** (la mayor parte de la evidencia de RPE viene de endurance). Helms 3DMJ tiene material práctico aquí — sumar como fuente.

---

## Fuentes en el cuaderno

[^1]: **Lafontant et al. (2025).** *Comparison of concurrent, resistance, or aerobic training on body fat loss: a systematic review and meta-analysis.* JISSN. — La fuente más actualizada y robusta para modalidad. 36 RCTs, 1564 participantes.

[^2]: **Helms, Aragon & Fitschen (2014).** *Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation.* JISSN. — El paper madre sobre cut en atletas naturales.

[^3]: **Mikulic et al. (2021).** *Increases in RPE Rating Predict Fatigue Accumulation Without Changes in Heart Rate Zone Distribution.* Frontiers in Physiology. — La justificación cuantitativa de por qué sRPE es la métrica interna más útil.

[^4]: **Trexler, Smith-Ryan & Norton (2014).** *Metabolic adaptation to weight loss: implications for the athlete.* JISSN. — Adaptación metabólica, NEAT, refeeds, reverse dieting.

[^5]: **Melin, Heikura, Tenforde & Mountjoy.** *Energy Availability in Athletics: Health, Performance, and Physique.* World Athletics consensus. — Define los umbrales de EA y los riesgos clínicos de LEA.

**Otras fuentes en el cuaderno consultadas pero menos citadas en este dossier:**

- Murphy & Koehler (2022) — Caloric restriction induces anabolic resistance to resistance exercise (artículo no cargado en el cuaderno; recomendado para futura ronda).
- *Lean mass sparing in resistance-trained athletes during caloric restriction: the role of resistance training volume* (PMC9012799).
- *Achieving an Optimal Fat Loss Phase in Resistance-Trained Athletes: A Narrative Review* (PMC8471721).
- *Expert Consensus on Weight Management Strategies for Strength and Physique Athletes* (Buechel et al., 2025).
- *International Society of Sports Nutrition position stand: diets and body composition.*

---

*Generado con NotebookLM MCP — todas las cifras, rangos y aseveraciones específicas están respaldadas por las fuentes científicas listadas. Las recomendaciones de diseño para Calibrate son interpretación propia basada en esa evidencia.*
