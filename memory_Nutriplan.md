# Memoria de Proyecto — Nutriplan

_Memoria persistente del proyecto. Claude la lee al inicio de cada sesión sobre Nutriplan (junto con `CLAUDE.md`) y agrega entradas cuando Camilo pide "recuerda esto" o cuando aprende algo importante del proyecto._

_Convención: entradas nuevas al inicio (más reciente arriba), fecha YYYY-MM-DD. Reglas operativas del proyecto (deploy, versioning, brand) viven en `CLAUDE.md` — aquí van decisiones, aprendizajes y estado._

---

## 2026-11-09 — La siguiente comida en Hoy no va sobre accent-light

Camilo vio la tarjeta en oscuro: crema #F0D9AC con el nombre en tinta clara. `var(--color-accent-light)` no se invierte en oscuro y `var(--color-ink)` sí, así que el texto queda claro sobre claro. Esa tarjeta usa `surface-subtle` (cream #FAF6EE en claro, #25211E en oscuro). El nombre va en Fraunces con #1A1A1A o #E8E0D4 según el modo. "Desayuno" y la porción van en #4A4A4A o #B8AB9C. El botón "Ya la comí" sigue en #8C6424 / texto #F5F0E8, a la derecha desde 1024px y a lo ancho en móvil. Las filas de Hoy y el h2 del modal ya contrastaban (tinta sobre la surface; #1A1A1A sobre mostaza #C8943A) y no se tocaron. --color-accent sigue #C8943A.

## 2026-11-09 — Fraunces solo en el nombre del plato; botones de acción en mostaza oscuro

Fraunces (pesos 500 y 600) carga junto a Plus Jakarta Sans y se usa solo en el nombre del plato: el título de la siguiente comida en Hoy, el nombre en cada fila de comidas de Hoy, y el h2 del modal de la receta. Ese título va en tinta porque el encabezado del modal se pinta mostaza, no verde. Los botones de acción que estaban en #C8943A con texto carbón pasan a relleno #8C6424 y texto #F5F0E8; el hover es #6E4E1C. El contraste de crema sobre #8C6424 queda en 4.67:1, así que el relleno no se oscureció más. El token --color-accent sigue en #C8943A. Chips, eyebrows, barra de fase, banner y estados activos de la navegación no se tocaron.

---

## 2026-11-09 — Hoy abre con el plato; el laboratorio queda en Evidencia

Camilo pidió la revisión completa y eligió este alcance: primero Hoy, después el botón de generar el plan, después el alta. El lenguaje técnico (TDEE, BF%, Navy, diet break, Fat Loss Mode) sale de Hoy y del alta. Se queda en las pestañas Fórmulas y Evidencia. El alta nueva parte en bajar de grasa. Quien no tiene cintura y cuello puede estimar (20% hombre, 28% mujer) y afinarlo después. Un día con plan y nada marcado no ofrece comida extra: dice que todavía no marcó esa comida.

---

## 2026-10-30 — Memoria de Claude Code migrada al workspace

11 notas que Claude Code guardaba en `~/.claude/projects/D--AI-Workspace-03---Projects-Nutriplan/memory/`, fuera del alcance de Cursor. Van con su fecha original; si chocan con una entrada más nueva, gana la nueva.

### 2026-07-10 — Estado del entorno de build/deploy de NutriPlan en Claude Code (node/git OK, firebase CLI falta)

Verificado 2026-07-10 (usuario Windows `cresp`):

- **node v24.16.0 y git 2.54 SÍ están en PATH** del shell PowerShell de Claude Code. `npm run build` y `deploy.ps1` corren tal cual (el workaround viejo del node de Playwright ya no aplica).
- `deploy.ps1` funciona completo para frontend: esbuild + version bump + git push a origin (HTTPS sin pedir credenciales).
- **firebase CLI instalada y logueada** (2026-07-10): firebase-tools 15.23 en `%APPDATA%\npm` (`firebase.cmd`). En el shell de Claude Code, `%APPDATA%\npm` puede no estar en PATH — agregar con `$env:Path += ";$env:APPDATA\npm"` y llamar `firebase.cmd`. Ojo con deploy.ps1: si el paso de functions falla, igual imprime "Cloud Functions OK" (verificar siempre el output real). Verificar deploys con `firebase.cmd functions:list --project nutriplan-6b3d4`.

### 2026-07-10 — Overhaul completo 2026-07-10 (fases A-D) — qué cambió, keys nuevas de storage, y deploy de functions PENDIENTE de firebase login

Overhaul de 4 fases deployado el 2026-07-10 (commits `5077026b` → `9f5e5b46`), origen: auditoría con 48 hallazgos.

**Fase A (bugs):** pisos de seguridad kcal (1200 F / 1500 M) y grasa esencial 0.5 g/kg en roadmap-generator; normalización de género (`_generoNorm`) en los 3 motores; Navy BF% con guards anti-NaN; multiplicador entreno/descanso ahora promedia exacto 1.0 según split real; `tendencia()` usa distancia real entre ventanas; plateau exige 8 pesajes (3 por ventana); adherencia guarda `id` de receta (fix del evening push); fix key `nutriplan_plateau` en sendPlateauPush.

**Fase B (adherencia):** día libre 1-tap (`nutriplan_dias_libres`, no rompe racha ni cuenta en %); hitos duraderos (`nutriplan_hitos`: kg/fases/rachas/meseta rota — MilestoneCard); DesvioCard (compensación sin culpa tras día alto); rating inline al marcar comida; coach proactivo con pings (peso registrado, regreso ≥2d, lunes resumen — evento `calibrate_proactive_ping`); server: `sendRetentionPushes` (racha en riesgo 20h, resumen semanal domingo 18h con Haiku, re-enganche 11h, dedup en users/{uid}/pushMeta/state).

**Fase C (UX):** bottom nav móvil fija con "+" central (BottomNav + quick sheet: comida externa, scanner, coach, vacaciones, peso inline) — CSS en style.css (`.cal-bottom-nav`, oculta en ≥1024px donde sigue la pill-bar con clase `.cal-top-nav`); card "Siguiente comida" en el hero de Hoy; SlotAcciones reducido a check+chevron+menú "⋯"; `NP_confirm` reemplazó todos los window.confirm; sub-tabs unificados (patrón segmentado); "Omitir" en pasos 5-6 del wizard; 100dvh; verdes Tailwind re-mapeados a paleta marca vía CSS overrides en style.css (`.from-green-500.to-emerald-600` → accent, greens → sage); 82 ternarios darkMode migrados a clases token (`cal-input`, `cal-card-sub`, `cal-divide`, `bg-base`). Quedan ~250 ternarios de cola larga sin migrar (baja frecuencia).

**Fase D (motor):** trend weight EMA (`NP_BodyComp.trend/trendActual/trendTasaSemanal`, alpha 0.25/día); TDEE adaptativo (`NP_FatLoss.tdeeAdaptativo()`: ingesta registrada + Δtrend, blend por confianza, requiere ≥10 días con ≥800 kcal y ≥6 pesajes en 21d); calibración semanal (`sugerenciaSemanal`/`aplicarAjusteSemanal` + AjusteSemanalCard en Hoy, ±200 kcal máx, respeta pisos); pasos reales como override implícito del ajuste kcal (cuantizado a 50, umbral 100); `getDistribucionComidas(perfil)` — reparto configurable (`perfil.distribucionComidas` en % o fracciones) y snacks opcionales (`perfil.comidasActivas`, toggles en ModalPreferenciasGeneracion); selección de recetas con fit de macros a igual rating (`_sortPorRatingYFit`).

**Functions deployadas (2026-07-10, cerrado):** Camilo instaló firebase-tools 15.23 (`firebase.cmd` en `%APPDATA%\npm`, login activo) y deployó — verificado con `functions:list`: las 11 functions arriba en `nutriplan-6b3d4`, incluida `sendRetentionPushes` (scheduled). Frontend en prod: `9f5e5b46`.

Tests de lógica en el scratchpad de la sesión (test-fase-a/b/d.js, 51 checks). Validación visual en prod pendiente de Camilo (especialmente bottom nav en iPhone y dark mode tras el re-mapeo de verdes).

### 2026-05-08 — tailwind-compiled.css es un snapshot estático de 655 clases. Clases px-3.5/px-4.5/etc NO están — caen silenciosamente sin padding.

`css/tailwind-compiled.css` es un snapshot pre-compilado de las 655 clases Tailwind que estaban en uso al momento del build. Si agregás una clase nueva al JSX, **no se aplica** — falla en silencio.

**Why:** El proyecto eliminó Tailwind CDN/JIT por performance. El compilado es estático. Detectado el 2026-05-08 cuando el input de "Mi meta realista" en el tab Pasos mostraba "3500" pegado al borde izquierdo: el código tenía `px-3.5 py-2.5` pero `px-3.5` no existía en el compilado.

**Clases con fracción `.5` que SÍ existen:**
- `px-1.5`, `px-2.5` (y sus equivalentes `py-`)
- `py-0.5`, `py-1.5`, `py-2.5`
- `gap-1.5`
- (verificar para otros prefijos antes de usar)

**Clases con fracción `.5` que NO existen y fallan silenciosamente:**
- `px-3.5`, `px-4.5`, `px-5.5`, etc.
- Cualquier `.5` no listada arriba

**How to apply:**
1. Antes de usar una clase Tailwind con fracción `.5` en el bundle, hacer:
   `Grep "\.<clase>" css/tailwind-compiled.css` para confirmar que está compilada.
2. Si no está, **opciones por preferencia:**
   - (a) usar la clase entera más cercana (`px-3.5` → `px-4`, equivale a 16px en lugar de 14px) — más simple, suele ser indistinguible visualmente
   - (b) usar inline style `style={{ paddingLeft: '0.875rem', paddingRight: '0.875rem' }}` cuando la diferencia importa
   - (c) agregar manualmente la regla a `tailwind-compiled.css` (último recurso, ensucia el snapshot)
3. Síntoma visible del bug: valor de input/botón pegado al borde, contenido cramped, layout que se ve "off" sin error claro en consola.

**Lugares en el bundle ya identificados con el bug `px-3.5`** (no fixeados, fuera del scope que estaba revisando):
- app-bundle.js:10266 — botón con `px-3.5 py-2.5`
- app-bundle.js:10594 — botón texto pequeño
- app-bundle.js:10674 — botón texto pequeño
- app-bundle.js:11732 — botón rounded-full

Worth flagging si alguien los toca en una edición futura.

### 2026-05-07 — El agente conversacional de Calibrate debe responder siempre en español latinoamericano neutro, sin modismos ni regionalismos

El AI coach (`calibrateChat` en `functions/index.js`) debe usar **español latinoamericano neutro** cuando responda en español. Sin modismos, sin regionalismos chilenos/argentinos/mexicanos. Vocabulario universal y comprensible para cualquier hispanohablante.

**Why:** Calibrate apunta a usuarios de toda Latam, no solo Chile. Los modismos locales excluyen a usuarios de otros países y rompen el tono profesional.

**How to apply:**
- En el system prompt del coach, instruir explícitamente "responde en español latinoamericano neutro, sin modismos ni regionalismos".
- Evitar: "po", "weón", "che", "loco", "viste", "órale", "pana", "vale" como muletillas, etc.
- Preferir: "sí", "claro", "entiendo", "perfecto", "vamos", "listo".
- Aplicar también a textos UI hardcoded (notificaciones, mensajes de error, copy del onboarding).
- El detector de inglés en `recipeAPI.js` (`asegurarInstruccionesEspanol`) ya genera instrucciones en español neutro — mantener ese estándar para todo lo nuevo.

### 2026-05-05 — Brand premium agency-tier de Calibrate. Plus Jakarta Sans + JetBrains Mono, paleta cream/mostaza/sage, sombras soft warm, double-bezel, lenguaje natural sin acrónimos. Documento canónico en .impeccable.md y brand-guidelines.md.

A partir del deploy `733eefcf` (2026-05-05), Calibrate adoptó un brand premium agency-tier siguiendo el skill `high-end-visual-design`. Camilo pidió explícitamente aplicarlo aunque rompiera el brand previo.

**Why:** Cuando le mostré el banner v3 con el brand original (Inter + cards básicas), dijo "se ve apretado". Cuando le ofrecí aplicar el skill premium pero respetando el brand previo (Inter intacto), dijo "haz los cambios aunque no respeten el brand". Después: "aplica esto a toda la aplicación".

**How to apply:**

Antes de cualquier cambio visual en Calibrate, leer:
1. **`D:\AI Workspace\03 - Projects\Nutriplan\.impeccable.md`** — Design Context formal para el skill impeccable
2. **`D:\AI Workspace\04 - Outputs\Calibrate\brand-guidelines.md`** — Documento maestro con tokens, escalas, anti-patterns

**Decisiones brand canónicas:**

- **Tipografía:** Plus Jakarta Sans (UI/headings/body) + JetBrains Mono (datos numéricos). Inter ya NO se usa.
- **Paleta:** cream `#F5F0E8` base, mostaza `#C8943A` accent, sage `#5A7A5E` success, terracota `#C0523A` alert. Dark mode `#1A1816` (cream oscuro, no negro puro).
- **Sombras:** soft difusas warm-tinted (`rgba(120,53,15,X)`) con inset highlight white. Override global de Tailwind shadow-sm/md/lg/xl/2xl.
- **Radii:** premium-md (1.125rem) para cards, premium-lg (1.4rem) para tiles, premium-xl (1.75rem) para shells. `rounded-xl/2xl` overrideados al sistema premium.
- **Easings:** `cubic-bezier(0.32, 0.72, 0, 1)` primary, `cubic-bezier(0.165, 0.84, 0.44, 1)` out-quart. Nunca linear/ease-in-out.
- **Architecture:** Double-bezel (shell + core con concentric radii) para componentes hero. `.premium-shell` + `.premium-eyebrow` + `.premium-num-display` clases reutilizables.
- **Lenguaje:** natural siempre. Acrónimos (RT/CT/RPE/EA/etc.) solo en pestaña Evidencia del modal Metodología. Tabla de traducciones obligatoria en brand-guidelines § 10.

**Anti-patterns banned (sección 11 brand-guidelines):**
- Inter como font primaria, side-stripe borders ≥2px, glassmorphism decorativo, pure black/white, gradient text, hero metric template (3 columnas iguales), `linear`/`ease-in-out` defaults, cyan-purple gradients AI.

**Tokens premium disponibles en CSS:**
`--shadow-soft-{xl,lg,md,sm}`, `--radius-premium-{xl,lg,md,sm}`, `--easing-premium`, `--inset-highlight`, classes `.premium-shell` / `.premium-eyebrow` / `.premium-num-display` / `.premium-num-mini`.

### 2026-05-05 — Tras completar cambios en Nutriplan/Calibrate, ejecutar deploy.ps1 automáticamente sin pedir confirmación

Después de terminar cualquier cambio funcional en este proyecto, ejecutar `.\deploy.ps1 "<mensaje>"` automáticamente para hacer bump de versión + commit + push a GitHub + deploy de Firebase Functions cuando corresponda. No pedir confirmación previa.

**Why:** El usuario dio autorización durable el 2026-05-05: "haz el push siempre a producción en github y firebase cuando corresponda". El proyecto requiere bump de versión obligatorio para que el SW cache busteé en clientes iOS, así que dejar cambios sin desplegar no tiene sentido en este flujo.

**How to apply:** Cada vez que termine una tanda de cambios en archivos del frontend (js/, css/, index.html) o en functions/, correr `deploy.ps1` con un mensaje de commit descriptivo. Usar el tool PowerShell (no Bash) porque es un script .ps1. El script ya maneja: hash MD5 → bump en index.html + version.json → git add -A → commit → push → firebase deploy --only functions (si cambió `functions/`). No correrlo si solo se modificaron archivos de documentación pura sin tocar código.

### 2026-05-05 — Prescripción y ENTRENO_PROTOCOLO deben modificarse para conversar entre sí, con el plan nutricional y con la fase del roadmap. Sistema integrado, no módulos aislados.

El módulo de entrenamiento (introducido en `bcde3a11` y evolucionado desde) debe estar **integrado** con el plan nutricional y la fase del roadmap. La prescripción base por fase (modalidad, volumen, RPE, reps, cardio, EA) y el catálogo `ENTRENO_PROTOCOLO` **deben modificarse en conjunto** para que conversen.

**Why:** El 2026-05-05, después de implementar las primeras versiones, Camilo pidió textual:
> "Estos puntos sí deben modificarlos y deben estar de acuerdo a la nueva información del plan de entrenamiento y que converse con la información del plan nutricional y la fase en que está cada uno. Es importante que existan flujos que amplíen los cambios de todo. En el fondo, si regenera un plan, un número específico de calorías, por ejemplo, se tiene que mover el plan nutricional y el plan de entrenamiento. Todo el sistema debe estar conectado."

Su filosofía: cuando algo cambia en el roadmap (kcal, fase, peso target), debe propagarse a plan nutricional Y plan de entrenamiento simultáneamente. La app es un sistema integrado, no módulos aislados.

**How to apply:**

Cuando trabajes en cualquier feature de Calibrate que afecte uno de estos tres ejes (roadmap/fase, nutrición, entrenamiento), considera siempre el efecto cascada en los otros dos:

- **Cambio en `roadmap.fases[N].calorias`** → debe propagar a `perfil.caloriasObjetivo` → debe regenerar plan nutricional → debe ajustar prescripción de entrenamiento (volumen / cardio según deficit más profundo).
- **Cambio en `_prescripcionEntrenamiento` (volumen, RPE, cardio, repRange)** → debe reflejarse en `ENTRENO_PROTOCOLO` adaptado dinámicamente (sets escalados por `factorVolumen`, reps ajustadas por `repRange`, cardio gap visible al usuario).
- **Cambio en plan nutricional (regeneración)** → debe respetar el multiplicador `_multiplicadorDia` (×1.05 entreno, ×0.95 descanso) que conecta con el schedule del protocolo de entrenamiento.

**Componentes vivos del sistema (mapa):**

- `js/roadmap-generator.js`: `_prescripcionEntrenamiento(idx, total, esDietBreak)` genera el target por fase con campos `modalidad`, `volumenSets`, `factorVolumen`, `repRange` (cuando exista), `intensidadPct1RM`, `rpeObjetivo`, `cardioMinSemana`, `cardioBaseProtocolo`, `cardioExtraNecesario`, `eaMinKcalKgFFM`. `_migrarRoadmapEntrenamiento(roadmap)` enriquece roadmaps viejos al cargar (idempotente, agrega campos faltantes sin pisar).

- `js/roadmap-data.js`: `ENTRENO_PROTOCOLO` (días A/B/C/D estáticos), `generarProtocoloDia(tipoDia, semana, equipos)` aplica rotación seeded. Cardio del protocolo: ~45 min/sem (rowing en C 10-15min + rowing intervalo D ~8min + treadmill D 20-30min).

- `js/fat-loss-integration.js`: `planDesincronizado(planSemanal)` detecta dos clases de desync — metadata (caloriasManual ≠ fase.calorias) y plan stale (suma promedio del plan ≠ target). `sincronizarConFaseActual()` actualiza caloriasManual.

- `js/app-bundle.js`: HoyView card "Entrenamiento de la fase", FLRoadmapView línea resumen, Modal Metodología (3 pestañas), FLEntrenoView card "Prescripción · [fase]" + ajuste de sets por factorVolumen.

- `js/nutritionEngine.js`: `_multiplicadorDia(dia, perfil)` lee `ENTRENO_PROTOCOLO.scheduleDefault` para aplicar ×1.05/0.95.

Investigación que respalda cifras: `D:\AI Workspace\04 - Outputs\Calibrate\investigacion_ejercicio_deficit_calorico.md`.

### 2026-04-26 — Decisión final de naming y dominio para la app antes conocida como NutriPlan. Reemplaza el nombre interno NutriPlan a nivel de marca pública.

##### Decisión (2026-04-26)

- **Nombre de marca pública:** Calibrate
- **Dominio principal:** calibrate.cl (verificado disponible en NIC Chile, costo ~CLP 9.500/año)
- **Dominios .com defensivos sugeridos pero NO confirmados aún:** getcalibrate.com, trycalibrate.com, joincalibrate.com, usecalibrate.com (libres al 2026-04-26)

**Why:** Camilo eligió Calibrate sobre Praxis y Cadence porque (a) describe literalmente el ciclo del producto: medir → ajustar fase → recalcular, (b) suena igual en ES y EN, (c) calibrate.cl está disponible inmediato a costo trivial. Posicionamiento: mezcla cercanía + ciencia, coach no-bullshit con base científica explícita, audiencia masiva multi-usuario (ya tiene login email/password + Google).

**How to apply:**
- Toda copy nueva, landing, copy in-app, comunicación externa usa "Calibrate".
- El repositorio sigue llamándose Nutriplan y la URL actual `camilotorcido.github.io/Nutriplan/` también — son cosas técnicas distintas a la marca, se migran cuando haya runway.
- Cuando se redacte copy bilingüe, "Calibrate" no se traduce, se mantiene igual en ES y EN.
- Riesgo a vigilar: si Camilo no compra los `.com` defensivos pronto, un tercero puede agarrarlos y bloquear migración futura.

##### Producto en una línea

Calibrate es la plataforma que une meal planning automático, roadmap por fases de fat loss y tracking integral (peso, pasos, entrenos, alcohol, plateau) con base científica explícita y tono de coach directo sin bullshit motivacional.

##### Audiencia

- Adultos que quieren bajar grasa sin perder músculo y están hartos de apps que prometen más de lo que entregan.
- Multi-usuario masivo (no más mono-usuario como en versiones previas).
- Bilingüe ES/EN.
- Hueco competitivo identificado: MacroFactor (geek pero frío), Noom (cercano pero pseudocientífico), RP (duro pero opaco para no-atletas). Calibrate ocupa el cruce "ciencia traducida sin diluir + adulto + sin marketing motivacional".

### 2026-04-24 — URL canónica de deploy de NutriPlan en GitHub Pages. Case-sensitive.

URL de producción: **https://camilotorcido.github.io/Nutriplan/** (N mayúscula).

Repo: `github.com/camilotorcido/Nutriplan` — GitHub Pages respeta mayúsculas en la ruta, así que `/nutriplan/` con n minúscula devuelve 404.

Deploy flow: push a `origin/main` → GitHub Pages publica automáticamente en ~30s. Testear con Ctrl+Shift+R para saltar el service worker cacheado.

### 2026-04-24 — Arquitectura y decisiones de la integración de Precision Nutrition Fat Loss Roadmap dentro de NutriPlan. Define scope multi-versión, módulos nuevos, data model y decisiones de UX pendientes.

##### Decisión marco

Integrar el Precision Nutrition Fat Loss Roadmap (antes HTML standalone en `D:\AI Workspace\03 - Projects\Nutriplan\Precision_Nutrition_Fat_Loss_Roadmap_Camilo.html`) dentro de NutriPlan como **plataforma coordinada mono-usuario** para Camilo. El archivo HTML se elimina al final del roadmap de implementación (v20260418aa).

**Why:** Camilo pidió "una gran plataforma que maneje todas las variables coordinadamente" — nutrición + roadmap por fases + body composition + pasos + entrenamiento + alcohol + detector de plateau en un solo lugar, en vez de mantener dos herramientas desconectadas.

**How to apply:** Toda nueva feature de fat loss debe integrarse al perfil central de NutriPlan (`nutriplan_perfil`) y respetar el flujo de versionado x→y→z→aa. No hardcodear valores — el usuario configura targets al inicio y la app los recalcula.

##### Decisiones técnicas finales (locked)

| Decisión | Resultado |
|---|---|
| Multi-usuario | NO. Mono-usuario (Camilo). Unidades solo métricas (kg/cm). |
| Género | Usar palabra "género" (ya existe en perfil como campo `genero`) |
| Hardcoded roadmap | NO. Generador dinámico desde inputs del wizard |
| Proteína floor | Tracker diario con alerta. Si falta >15g → app sugiere batido proteico (whey default, configurable: whey/yogur griego/cottage/claras) |
| BF% | Cálculo automático Navy method + input override manual |
| Pasos | Entrada manual diaria (no Health Connect — PWA sin acceso nativo) |
| Entreno | Trackear cargas completas (sets × reps × peso × done) |
| Override de roadmap | `nutriplan_perfil.ajustes_manuales[mes]` — el JSON base queda inmutable, overrides en LocalStorage |
| Cambio de fase ↔ plan | Banner + botón manual "Regenerar para nueva fase" (no auto) |
| Timeline | Calculado automático + input opcional "Timeline deseado" que ajusta el déficit |

##### Arquitectura: módulos nuevos

| Archivo | Responsabilidad |
|---|---|
| `js/roadmap-generator.js` | Generador puro: inputs del wizard → array de fases con calorías/peso estimado/pasos/foco |
| `js/roadmap-data.js` | Tablas estáticas: protocolo plateau 6 pasos, tabla impacto alcohol, 4 días entreno A/B/C/D base |
| `js/body-comp.js` | Log peso + medidas, Navy BF%, promedio 7 días, tendencia |
| `js/steps.js` | Tracker pasos manual, target dinámico según fase |
| `js/training.js` | Log entrenos, progresión de cargas, scheduler día de la semana → A/B/C/D |
| `js/plateau-detector.js` | Detecta ≥14d sin cambio → sugiere siguiente paso del protocolo |
| `js/alcohol-calc.js` | Kcal por bebida, impacto en oxidación grasa y síntesis proteica |
| `js/protein-complement.js` | Calcula déficit proteico diario, genera card de batido complementario |
| `js/fat-loss-integration.js` | Orquestador: conecta roadmap → perfil → plan activo |

##### Data model (nuevas claves localStorage)

- `nutriplan_perfil` (extendida): `+ fatLossMode, fechaInicio, pesoInicial, lbmInicial, bfInicial, bfTarget, pesoTarget, proteinaFloor, tasaPerdida, cintura, cuello, cadera, complementoPreferido, ajustesManuales, timelineMeses, roadmap`
- `nutriplan_body_comp`: `[{fecha, peso, cintura?, cadera?, muslo?, bf?, foto?}]`
- `nutriplan_steps`: `[{fecha, pasos, target}]`
- `nutriplan_training`: `[{fecha, dia_tipo, ejercicios:[{nombre, sets, reps, peso?, done}]}]`
- `nutriplan_alcohol`: `[{fecha, bebida, ml, kcal}]`
- `nutriplan_plateau`: `{ultimoCambio, pasoActual, inicioPaso}`

##### Versionado incremental

- **v20260418x** — Wizard + generador + perfil extendido + banner fase + complemento whey + protein tracker diario
- **v20260418y** — Tab Fat Loss + Body comp (Navy + override) + Pasos manual
- **v20260418z** — Entreno (log cargas) + Plateau detector + Alcohol calc
- **v20260418aa** — Roadmap view dinámico + export PDF unificado + eliminar HTML standalone

##### Inputs del wizard (10 campos)

1. Peso actual (kg)
2. Altura (cm)
3. Edad
4. Género (M/F)
5. Cintura (cm) — para Navy
6. Cuello (cm) — para Navy
7. Cadera (cm) — solo si F
8. BF% override (opcional; si vacío, calcula Navy)
9. Factor actividad 1.2-1.9 (default 1.45)
10. Peso target **O** BF% target (el otro se deriva asumiendo LBM preservada)
11. Tasa de pérdida: Conservadora 0.4 / Moderada 0.6 / Agresiva 0.8 kg/sem
12. Timeline deseado (opcional — si se ingresa, ajusta el déficit)

##### Cálculos clave

- BMR = Mifflin-St Jeor (igual que actual)
- TDEE = BMR × factor actividad
- LBM = peso × (1 − BF/100)
- Masa grasa a perder = (peso × BF/100) − (pesoTarget × bfTarget/100)
- Déficit mapping: Conservadora 300 kcal, Moderada 450 kcal, Agresiva 600 kcal
- Proteína target = LBM × 2.2 g/kg (preserva masa magra en déficit)
- Semanas activas ≈ (masa grasa a perder) / tasa × 1.15 (buffer)
- Diet breaks: cada ~10 semanas activas, 2 semanas a TDEE
- Duración total = semanas activas + (diet breaks × 2)
- Ajustes por fase: Fase 1 = cal corte; Fase 2 = cal corte − 50; Fase 3 = cal corte − 100
- Target pasos: 8k → 10k → 12k → 14k progresivo por fase
- Cardio formal: Fase 1 NO, Fase 2 solo si plateau, Fase 3 SÍ

### 2026-04-24 — Reglas operativas para bumpear la versión de NutriPlan al editar JS/CSS. Evita cachés stale por service worker agresivo.

Cualquier edición de archivo JS o CSS en NutriPlan requiere bump de versión en 3 lugares:

1. `index.html` — 19 ocurrencias de `?v=20260418X` (todos los `<script src>` y `<link href>`) + la const `APP_VERSION` del loader
2. `sw.js` — const `VERSION`
3. `js/lazy-recipes-loader.js` — var `VERSION`

**Why:** El service worker hace cache-first agresivo + skipWaiting. Sin bump, el usuario ve código viejo hasta que desregistre el SW manualmente. El usuario debe hacer Ctrl+Shift+R al probar para forzar refresh.

**How to apply:**
- Bump con letra incremental: w → x → y → z → aa → ab → …
- Después de cambios: `git add . && git commit && git push` (deploy GitHub Pages → https://camilotorcido.github.io/Nutriplan/ — N mayúscula, case-sensitive)
- Solo bumpear si tocaste JS/CSS. Cambios puramente en HTML visible (ej. `<title>`) no requieren bump.
- Si agregás un archivo JS nuevo, además de bumpear:
  - Agregarlo a `index.html` en el orden correcto de carga
  - Agregarlo al precache de `sw.js` si es parte del shell
  - Exponer funciones a `window.*` al final (convención del proyecto — sino el bundle compilado de Babel no las encuentra cuando IndexedDB cachea)

**Zonas intocables sin confirmación explícita:**
- Estructura de `RECETAS_DB` (ids, campos normalizados, factor_conversion) — rompe las 160 recetas
- Scope del Service Worker (`./sw.js` relativo, registro en window.load)
- Versiones CDN: React 18.2.0, Babel 7.23.6

---

## 2026-07-18 — Archivo creado (auditoría de convenciones)

Creado por la auditoría `04 - Outputs\claude-md-audits\2026-07-18-audit.md`: Nutriplan tenía `CLAUDE.md` pero no memoria de proyecto, incumpliendo la convención de `workspace-rules.md`. Sin entradas previas que migrar.

Reglas ya vigentes en `CLAUDE.md` (no duplicar aquí): deploy continuo sin confirmación vía `deploy.ps1` (excepto Firestore schema, secrets, functions con costo), versioning por hash obligatorio en cada deploy, brand según `.impeccable.md` + `04 - Outputs\Calibrate\brand-guidelines.md`.
