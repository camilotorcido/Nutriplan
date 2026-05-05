# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Brand

Lee **`.impeccable.md`** y **`D:\Claude\04 - Outputs\Calibrate\brand-guidelines.md`** antes de hacer cualquier cambio visual. Brand premium agency-tier: Plus Jakarta Sans + JetBrains Mono, paleta cream/mostaza/sage, sombras soft difusas warm-tinted, double-bezel architecture, easings cubic-bezier custom, lenguaje natural sin acrónimos.

## Development

```powershell
# Start local dev server (port 3000)
npx serve .

# Deploy to production (esbuild compile + version bump + git push + Firebase Functions)
.\deploy.ps1
```

`deploy.ps1` corre `npm run build` (esbuild) antes de versionar. Si esbuild falla, el deploy se aborta.

## Versioning (critical)

Every deploy must bump the version hash. `deploy.ps1` does this automatically by MD5-hashing 8 key files and writing the hash into `index.html` (19 occurrences), `sw.js`, and `version.json`. If you manually edit these files, run `deploy.ps1` rather than committing directly — otherwise the service worker cache will not bust on iOS clients.

The version string format is in `index.html` as `?v=<hash>` query params on asset URLs.

## Architecture

**Build step:** esbuild pre-compila `js/app-bundle.js` (JSX, ~830 KB) → `js/app-bundle.compiled.js` (~553 KB minificado, ES2020). Babel Standalone runtime fue eliminado.

`index.html` carga el bundle compilado directamente: `<script src="js/app-bundle.compiled.js?v=...">`. React + ReactDOM siguen como UMD CDN globals.

### Key files

| File | Role |
|------|------|
| `index.html` | HTML shell: loads Babel, registers SW, polls `version.json` every 60s |
| `sw.js` | Service worker: cache-first for assets, network-first for HTML/APIs |
| `js/app-bundle.js` | Entire React app (~822 KB JSX source — the "bundle" is uncompiled) |
| `js/storage.js` | localStorage manager + IndexedDB backup |
| `js/cloud-storage.js` | Multi-user localStorage proxy; auto-scopes keys to `nutriplan_key__userId`; debounced Firestore sync (3s) |
| `js/recipes.js` | 160 local recipes (static data, 316 KB) |
| `js/recipeAPI.js` | TheMealDB integration + Spanish instruction generation |
| `js/nutritionEngine.js` | Macro math, TDEE, recipe scaling |
| `js/roadmap-generator.js` | Fat-loss phase roadmap (Fase 1–3, Last Mile, Refeed) |
| `functions/index.js` | Firebase Cloud Functions: AI coach (`calibrateChat`), food analysis, Whisper transcription |
| `css/tailwind-compiled.css` | Pre-compiled Tailwind (655 classes, ~38 KB) — do NOT use Tailwind CDN or JIT |
| `deploy.ps1` | Version hash generation + git push + Firebase Functions deploy |

### Data flow

```
index.html → Babel compiles app-bundle.js → React renders
                ↓
        Firebase Auth (email / Google)
                ↓
  localStorage (primary) ↔ cloud-storage.js proxy ↔ Firestore (debounced sync)
                ↓
  Cloud Functions → Claude Haiku 4.5 (AI coach with 13 tool definitions)
```

### Storage scoping

`cloud-storage.js` wraps `localStorage` so all keys are automatically namespaced per user (`nutriplan_key__<userId>__<key>`). Always access storage through this proxy — never write raw `localStorage` calls that assume a single user.

### Meal planning rules

- Calorie distribution per meal: 25% breakfast, 10% AM snack, 35% lunch, 10% PM snack, 20% dinner.
- Multi-week plans (1–4 weeks) use `_sanitizarPlan()` for format migrations.
- Recipe repetition is blocked within a rolling 14-day window.
- Lunch and dinner may fall back to TheMealDB online search; breakfast and snacks always use local `recipes.js`.

### Recipe instruction safety

`asegurarInstruccionesEspanol()` in `recipeAPI.js` detects English-language instructions (≥2 English words from a 300-word dictionary) and regenerates them in Spanish. `_generarInstruccionesEspanol()` produces step-by-step Thermomix-compatible Spanish instructions from ingredient types.

### iOS PWA update detection

`version.json` is polled every 60s and also on each visibility-change event. On version mismatch: clear IndexedDB, unregister SW, hard-reload. This is intentional — do not add caching headers or SW caching to `version.json`.

### CSS

Edit `css/style.css` for custom design tokens and dark mode. Do not modify `css/tailwind-compiled.css` manually — it is a pre-compiled snapshot of the 655 Tailwind classes actually used. If new Tailwind classes are needed, add them manually to `tailwind-compiled.css` or recompile via `npx tailwindcss`.

## Backend (Cloud Functions)

`functions/index.js` exposes three callable functions:
- `calibrateChat` — Claude Haiku 4.5 AI coach with stateful tool use (13 tools for reading/writing meal plan, macros, shopping list)
- `calibrateAnalyzeFood` — food image analysis
- `calibrateTranscribe` — Groq Whisper audio transcription

Functions require Firebase service account credentials and Anthropic + Groq API keys in Firebase Secret Manager.

## Public identity

The app is branded **Calibrate** (production URL: `camilotorcido.github.io/Nutriplan/` — note capital N). Internal code and repo name still say "nutriplan".
