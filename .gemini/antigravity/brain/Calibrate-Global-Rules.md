# Calibrate — Project Rules

## Identidad del proyecto

- **Nombre de marca:** Calibrate
- **Nombre técnico / repo:** Nutriplan (no renombrar hasta migración explícita)
- **URL de producción:** https://camilotorcido.github.io/Nutriplan/ — la **N es mayúscula**, case-sensitive. `/nutriplan/` con n minúscula devuelve 404.
- **Deploy:** push a `origin/main` → GitHub Pages publica en ~30 s. Testear siempre con Ctrl+Shift+R para forzar bypass del service worker.

## Stack

| Capa | Tecnología | Restricción |
|---|---|---|
| UI | React 18.2.0 (CDN UMD) + Babel Standalone 7.23.6 | Versiones **bloqueadas** — no actualizar sin aviso explícito |
| CSS | Tailwind pre-compilado (`css/tailwind-compiled.css`) | Solo ~655 clases en uso; agregar clases nuevas requiere recompilar Tailwind |
| PWA | Service Worker (`sw.js`) + `manifest.webmanifest` | Scope `./` relativo al root; no mover |
| Storage | LocalStorage (perfil + logs) + Firebase Firestore (sync cloud) | Ver claves en sección Data model |
| Backend | Firebase Functions (`functions/index.js`) | |

**No hay bundler.** Los archivos JS se cargan directamente como `<script type="text/babel">` via lazy loader. Toda función pública debe exponerse en `window.*` al final de su archivo, de lo contrario el bundle compilado de Babel no la encontrará cuando IndexedDB cachee el módulo.

## Versioning — regla crítica

Cualquier edición de JS o CSS **requiere bump de versión** en exactamente 3 lugares:

1. `index.html` — todas las referencias `?v=HASH` (20+ ocurrencias) + la const `APP_VERSION` del loader
2. `sw.js` — la versión se lee desde el query param de registro (`sw.js?v=HASH`)
3. `js/lazy-recipes-loader.js` — var `VERSION`

El formato actual es un hash corto de 8 hex (ej. `30f93b9f`). Generar con `git rev-parse --short=8 HEAD` justo antes del commit, o incrementar manualmente.

**Por qué es crítico:** el SW hace cache-first agresivo + `skipWaiting`. Sin bump, el usuario ve código viejo hasta que desregistre el SW a mano.

**No bumpear** si el cambio es solo HTML visible (ej. `<title>`, copy estática).

## Zonas intocables sin confirmación explícita del usuario

- Estructura de `RECETAS_DB` (ids, campos normalizados, `factor_conversion`) — rompe las 160+ recetas
- Scope y estrategia del Service Worker
- Versiones CDN de React, ReactDOM y Babel
- Claves de LocalStorage (cambiar un nombre de clave = pérdida de datos del usuario)

## Arquitectura: módulos JS principales

```
js/
  auth.js                  — Firebase Auth (email/password + Google)
  cloud-storage.js         — Sync LocalStorage ↔ Firestore
  storage.js               — Capa de abstracción LocalStorage
  nutritionEngine.js       — Motor central de nutrición y planes
  recipes.js               — Base de recetas (~160 recetas)
  lazy-recipes-loader.js   — Loader dinámico de módulos JS (evita bloquear el hilo inicial)
  fat-loss-integration.js  — Orquestador fat loss: roadmap → perfil → plan activo
  roadmap-generator.js     — Generador puro de fases desde wizard inputs
  roadmap-data.js          — Tablas estáticas: protocolo plateau, impacto alcohol, días A/B/C/D
  body-comp.js             — Log peso/medidas, Navy BF%, promedio 7 d, tendencia
  steps.js                 — Tracker pasos manual, target dinámico por fase
  plateau-detector.js      — Detecta ≥14 d sin cambio → sugiere siguiente paso protocolo
  alcohol-calc.js          — Kcal por bebida, impacto en oxidación grasa
  protein-complement.js    — Déficit proteico diario, card batido complementario
  entrenamiento.js         — Log entrenos, progresión de cargas, scheduler A/B/C/D
  perfiles.js              — Gestión multi-perfil de usuario
```

## Data model (claves LocalStorage)

| Clave | Contenido |
|---|---|
| `nutriplan_perfil` | Perfil + fat loss config (`fatLossMode`, `roadmap`, `ajustesManuales`, ...) |
| `nutriplan_body_comp` | `[{fecha, peso, cintura?, cadera?, bf?}]` |
| `nutriplan_steps` | `[{fecha, pasos, target}]` |
| `nutriplan_training` | `[{fecha, dia_tipo, ejercicios:[{nombre, sets, reps, peso?, done}]}]` |
| `nutriplan_alcohol` | `[{fecha, bebida, ml, kcal}]` |
| `nutriplan_plateau` | `{ultimoCambio, pasoActual, inicioPaso}` |

## Fat Loss Roadmap — estado de implementación

| Versión | Feature | Estado |
|---|---|---|
| x | Wizard + generador + perfil extendido + banner fase + proteína tracker | Integrado |
| y | Tab Fat Loss + Body comp (Navy + override) + Pasos manual | Integrado |
| z | Entreno (log cargas) + Plateau detector + Alcohol calc | Integrado |
| aa | Roadmap view dinámico + export PDF unificado + eliminar HTML standalone | **Pendiente** |

El archivo `Precision_Nutrition_Fat_Loss_Roadmap_Camilo.html` en la raíz es el standalone **a eliminar** al completar `aa`.

## Convenciones de código

- Idioma del código: **inglés** para nombres de funciones/variables, **español** para strings de UI y comentarios de dominio nutricional.
- No hay TypeScript — JSX compilado por Babel en runtime.
- No agregar dependencias NPM al frontend; solo CDN UMD ya presentes.
- Para Firebase Functions sí se puede agregar dependencias en `functions/package.json`.

## Producto en una línea

Calibrate une meal planning automático, roadmap por fases de fat loss y tracking integral (peso, pasos, entrenos, alcohol, plateau) con base científica explícita y tono de coach directo sin bullshit motivacional.
