# NutriPlan - Planificador Nutricional Semanal

Aplicación SPA de planificación nutricional semanal con recetas 100% en español latino, búsqueda de recetas en vivo por internet con priorización geográfica, cálculo de TDEE, escalado dinámico de recetas e instrucciones Thermomix TM6.

## 🎯 Características Principales

### Perfil Nutricional
- Cálculo BMR con ecuación Mifflin-St Jeor
- TDEE = BMR × Factor de Actividad (5 niveles: 1.2–1.9)
- Calorías objetivo = TDEE + ajuste (-500/0/+500 kcal), mínimo 1200 kcal
- **Calorías manuales**: opción de ingresar directamente las calorías objetivo (800–6000 kcal) sin depender del cálculo TDEE
- Macros editables (Proteínas/Carbohidratos/Grasas %) que deben sumar 100%
- Restricciones: sin gluten, sin lactosa, vegetariano, ingredientes excluidos

### Navegación en Configuraciones
- **Botón "Volver al plan"**: al editar perfil desde un plan existente, se puede volver sin regenerar ni perder el plan actual
- Texto del botón principal cambia contextualmente: "Generar Plan Semanal" (primera vez) vs "Guardar y Regenerar Plan" (edición)
- Subtítulo contextual: "Configurá tu perfil..." vs "Editá tu perfil..."

### Plan Semanal (hasta 4 semanas × 7 días × 5 comidas)
- **Selector de semanas**: 1-4 semanas de planificación desde el perfil
- **Multi-semana**: cada semana con recetas distintas, minimizando repeticiones entre semanas
- **Tabs de semana**: selector visual de semana activa (Semana 1, 2, 3, 4)
- Distribución calórica: Desayuno 25%, Snack AM 10%, Almuerzo 35%, Snack PM 10%, Cena 20%
- Escalado de recetas: factor_escala = calorías_objetivo_comida / calorías_base_receta
- Día actual resaltado con badge "HOY" verde (solo en semana 1)
- Botón 🔀 por receta para cambiar individualmente (async con fallback online, respeta semana activa)
- Sin repetición en 14 días (historial `{fecha, receta_id}` en LocalStorage)
- **Compatibilidad retroactiva**: planes guardados en formato anterior se normalizan automáticamente

### 🌐 Búsqueda en Vivo (100% español)
- **Almuerzo y cena enriquecidos**: cuando la base local no alcanza para almuerzo/cena, busca automáticamente en internet
- **Fuente**: TheMealDB API (gratuita, sin autenticación, CORS habilitado)
- **Nombres en español**: generados desde los ingredientes y categoría, nunca traducidos literalmente
- **Instrucciones en español**: generadas paso a paso según los ingredientes detectados (proteínas, verduras, carbohidratos, etc.)
- **Ingredientes en español latino**: diccionario de ~200 ingredientes EN→ES con formas singulares normalizadas
- **Priorización geográfica**: recetas americanas primero, luego europeas, y por último Medio Oriente
  - Búsqueda por áreas: American, Canadian, British, French, Italian, Spanish, Irish
  - Puntuación: Americana=100, Europea=80, Otras=50, Medio Oriente=10
- **Normalización de ingredientes**: "huevos" y "huevo" se agrupan como uno solo; "plátano congelado" se agrupa con "plátano"
- **Estimación de macros**: perfiles nutricionales por categoría
- **Detección de flags**: sin gluten, sin lactosa, vegetariana
- **Cache inteligente**: hasta 200 recetas online en LocalStorage (v7, solo almuerzo/cena, invalida cachés anteriores)
- **Indicador visual**: badge azul "🌐 Internet" en recetas online
- **Imagen del plato**: las recetas online muestran foto en el modal
- **Loading overlay**: animación durante búsqueda en vivo
- **Fallback offline**: si la API falla, usa plan local sin errores
- **Safety net agresivo**: al mostrar cualquier receta, se analiza cada paso de las instrucciones con un diccionario de ~300 palabras en inglés. Si se detectan al menos 2 palabras en inglés en cualquier paso, se regeneran TODAS las instrucciones desde los ingredientes de la receta, preservando la categoría (desayuno/almuerzo/cena/snack) para generar instrucciones contextualmente apropiadas
- **Migración automática de planes guardados**: al cargar un plan semanal desde LocalStorage, se sanitizan todas las instrucciones automáticamente y se re-guarda el plan limpio

### 📝 Instrucciones Detalladas de Recetas
- **Instrucciones completas**: cada receta incluye 5-8 pasos detallados que mencionan TODOS los ingredientes por nombre y cantidad
- **Tiempos y temperaturas**: cada paso incluye tiempos de cocción, temperaturas de horno, y técnicas específicas (ej: "200°C por 25 minutos", "fuego medio-bajo por 3-4 minutos")
- **Sin ingredientes omitidos**: las instrucciones referencian cada ingrediente individualmente
- **Verificación automática**: el generador de instrucciones rastrea cada ingrediente usado y agrega automáticamente los no mencionados al final
- **Recetas locales (160)**: 32 desayunos + 32 snack AM + 32 almuerzos + 32 snack PM + 32 cenas, escritas manualmente con pasos claros, técnicas culinarias y tiempos precisos
- **Recetas online (generadas)**: `_generarInstruccionesEspanol()` completamente reescrito: rastrea ingredientes usados, clasifica en 15+ categorías (proteína, verduras duras/blandas, legumbres, salsas, especias, frutas, frutos secos, etc.), genera instrucciones específicas por tipo de proteína, y verifica que ningún ingrediente quede sin mencionar
- **Safety net mejorado**: `asegurarInstruccionesEspanol()` preserva el tipo de comida al regenerar instrucciones
- **Migración de instrucciones pobres**: `_sanitizarPlan()` detecta recetas con instrucciones simplistas (≤3 pasos con ≥4 ingredientes, o pasos genéricos) y las regenera automáticamente

### 🥄 Medidas Caseras (Cucharadas, Tazas, Cucharaditas)
- **Conversión automática g/ml → medidas caseras**: todas las cantidades en gramos y mililitros se convierten a tazas, cucharadas, cucharaditas o pizcas al mostrar la receta
- **Tabla de densidades completa**: ~100 ingredientes con densidades reales (ej: avena 0.37 g/ml → 80g = 1 taza; miel 1 g/ml → 15ml = 1 cucharada; edamame 0.65, almendras 0.58, garbanzos 0.72, queso cheddar 0.45, etc.)
- **Fracciones legibles**: las cantidades se redondean a fracciones familiares: ¼, ⅓, ½, ⅔, ¾ (ej: "⅔ taza de harina", "½ cucharadita de canela")
- **Cobertura total 115 ingredientes**: de los 115 ingredientes únicos en recetas (g/ml), 94 se convierten a medidas caseras y 21 se mantienen intencionalmente en gramos
- **Ingredientes que mantienen gramos**: proteínas (pollo, carne, salmón, tofu, camarones, pavo, pescado), tubérculos (papa, camote, zapallo), vegetales enteros (brócoli, espárragos, ejotes), pasta (espagueti, fideos, penne) y frutas grandes (mango, piña) — todos sin equivalente casero práctico
- **Aliases plurales**: las recetas usan `nombre_normalizado` con variantes (ej: `almendras` vs `almendra`, `nueces` vs `nuez`, `garbanzos` vs `garbanzo`) — todos mapeados correctamente en la tabla de densidades
- **Conversión en instrucciones**: `convertirInstruccionesAMedidasCaseras()` usa regex inteligente para detectar patrones como "los 80 g de avena en hojuelas" → "la 1 taza de avena en hojuelas", con detección de artículos, modificadores de ingrediente ("en polvo", "picado", "fresco") y "restantes"
- **Conversión en lista de ingredientes**: el modal de receta muestra las cantidades escaladas ya convertidas a medidas caseras
- **Recetas online**: `_ingConCantidad()` y `_sc()` en recipeAPI.js también generan instrucciones en medidas caseras desde el inicio
- **Diccionario de normalización**: ~80 entradas que mapean nombres libres de ingredientes a sus claves normalizadas para buscar la densidad correcta
- **Líquidos ampliados**: caldo de carne, salsa picante y salsa verde añadidos a la lista de líquidos para conversión directa ml→medida casera

### 🍳 Desayunos Tradicionales
- **Base local ampliada**: 16 desayunos (avena con frutas, huevos con arepa, smoothie tropical, tostadas de camote, panqueques, tostada francesa, yogur con granola, arepa con porotos, tortilla española, waffles, chilaquiles, overnight oats, empanadas, batido proteico, tacos de huevo, galletas de avena)
- **Desayunos 100% locales**: NUNCA busca online (MealDB devuelve Full English Breakfast, platos anglosajones pesados)
- **Calorías de desayuno**: 350-480 kcal base (25% del objetivo diario)

### 🍎 Snacks Livianos y Tradicionales
- **Base local ampliada**: 16 snacks AM + 16 snacks PM (frutos secos, yogur, frutas, hummus, bolitas energéticas, galletas de arroz, edamames, smoothies, pudín de chía, palomitas, chips de plátano, dátiles rellenos, gelatina, compota, bastones de verdura, etc.)
- **Snacks 100% locales**: NUNCA buscan recetas online (TheMealDB no tiene snacks ligeros reales)
- **Calorías de snack**: ~120-250 kcal base (10% del objetivo diario)

### 🍽️ Almuerzos y Cenas Completos
- **Base local ampliada**: 32 almuerzos + 32 cenas con instrucciones Thermomix profesionales generadas automáticamente
- **Almuerzos**: pollo al horno, porotos con arroz, salmón con quinoa, lentejas guisadas, tacos de pollo, bowl de quinoa, pasta boloñesa, arroz con pollo, estofado de carne, hamburguesa casera, pollo al curry, ensalada César, chili con carne, pechuga rellena, camarones al ajillo, burrito bowl
- **Cenas**: crema de zapallo, ensalada de atún, wrap de pollo, sopa con fideos, tortilla española, pechuga con puré, salmón con brócoli, omelette de champiñones, pasta con pesto, tacos de pescado, risotto, garbanzos con vegetales asados, sopa de lentejas, pavo con puré, stir-fry de tofu, quesadillas
- **Instrucciones Thermomix TM6 (nivel profesional)**: incluidas para almuerzo y cena, con estructura de receta de chef:
  - **Mise en place explícito**: cortes específicos por ingrediente (cebolla en cuartos, zanahoria rodajas 0.5 cm, papa cubos 2 cm, pescado sin espinas, pollo atemperado 10 min, etc.)
  - **Base aromática**: picado fino (5 seg / Vel 5) + pochado sin cubilete (5 min / 120°C / Vel 1) con señales sensoriales ("translúcida, brillante, nunca marrón")
  - **Sellado de proteínas**: carne molida con giro inverso Vel Cuchara a 120°C, 7 min; verduras al sofrito posteriormente
  - **Cocción simultánea Varoma**: líquido aromatizado en vaso (mín. 500 ml), proteína sobre papel de hornear en bandeja, verduras densas abajo y delicadas arriba
  - **Tiempos diferenciados y justificados**: pescado 15 min (pasa a seco en 2 min), pollo 25 min (clave seguridad alimentaria ≥74°C), res 28 min (atemperado 15 min previo)
  - **Verificación crítica**: termómetro (74°C aves, 63°C res), camarones en "C" cerrada (no "O"), pescado en lascas opaco
  - **Salsas**: temperatura ajustada (lácteos/coco máx 85-90°C para no cortar), señal "napa la espátula"
  - **Legumbres**: sin sal durante cocción (endurece piel), con laurel, con control de nivel de líquido
  - **Reposo de proteína**: 3-5 min tapada con aluminio antes de cortar (redistribuye jugos)
  - **Hierbas frescas**: se pican justo antes de servir (evita oxidación)
  - **Emplatado profesional**: platos entibiados, proteína al bisel, hilo de AOVE crudo, pimienta recién molida
  - **Autolimpieza express del vaso**: 1 L agua + 2 gotas detergente / 3 min / 70°C / Vel 5
  - **Renderizado con tipografía rica**: comandos técnicos y títulos internos en negrita indigo, banner informativo con tips del chef al final
  - **Integración WhatsApp**: al compartir, los `**` se convierten a `*` (formato WhatsApp) y se eliminan prefijos "Paso N:" duplicados

### 🛡️ Protección contra recetas inadecuadas
- `nutritionEngine.js` excluye desayuno, snack_am y snack_pm del fetch online (generación y swap)
- `_obtenerCategoriasMealDB()` devuelve arrays vacíos para desayuno y snacks
- Migración `_sanitizarPlan()` detecta recetas online en slots locales (`_fuente:"online"` o `id:"online_*"`) y las reemplaza automáticamente con recetas locales apropiadas
- Migración de instrucciones: detecta recetas con pasos simplistas y los regenera con el motor mejorado
- Búsqueda online limitada a almuerzo y cena, que son los tipos de comida donde MealDB ofrece buenas recetas

### 📅 Filtro de Días Restantes (Despensa y Lista de Compras)
- **Toggle "Solo desde mañana"**: tanto en Despensa como en Lista de Compras, permite ver solo los ingredientes necesarios para los días restantes de la semana (desde el día siguiente al actual)
- **Cálculo automático del día actual**: usa `obtenerDiaActual()` para determinar qué día de la semana es hoy y filtra el plan semanal excluyendo los días ya pasados
- **Información contextual**: muestra cuántos días quedan y cuáles son (ej: "Hoy es Miércoles. Mostrando ingredientes para: Jueves, Viernes, Sábado, Domingo")
- **Actualiza conteos**: el total de ingredientes, los que faltan, y el porcentaje de la barra de progreso se recalculan dinámicamente
- **Lista de compras inteligente**: la lista copiada al portapapeles incluye encabezado indicando los días filtrados cuando el toggle está activo
- **Toggle oculto los domingos**: si hoy es domingo no quedan días, así que el toggle no aparece

### Unidades de Compra Realistas
- Ingredientes consolidados por `nombre_normalizado` (singular, sin modificadores, sin acentos)
- Cantidades internas (g/ml) convertidas a unidades de compra con `Math.ceil()`
- Formato: "2 paquetes de Arroz integral (paquete de 500g c/u)"

### 🔀 Consolidación Inteligente de Ingredientes
- **Mapa de consolidación ampliado** (`_CONSOLIDAR_NOMBRE`): ~50 entradas que unifican variantes como:
  - `diente_de_ajo`, `ajo_picado` → `ajo`
  - `nueces` → `nuez`, `almendras` → `almendra`
  - `crema_doble`, `crema_ligera` → `crema`
  - `ejotes`, `judías_verdes`, `porotos_verdes` → `poroto_verde`
  - `frijoles_negros`, `poroto_negro` → `poroto_negro`
  - `aceitunas_negras`, `aceitunas_verdes` → `aceituna`
  - `cabbage` → `repollo`, `parsley` → `perejil` (residuos de API en inglés)
- **Nombres de display preferidos** (`_DISPLAY_PREFERIDO`): tabla de ~50 claves normalizadas → nombre legible en español chileno (ej: `poroto_verde` → "Porotos verdes", `camaron` → "Camarones", `nuez` → "Nueces")
- **Aplicado en 4 rutas de resolución**: nombre_normalizado directo, lookup por nombre exacto, match parcial más largo, y normalización manual de fallback

### 🏷️ Clasificación de Ingredientes en Lista de Compras
- **7 categorías**: 🥬 Frutas y Verduras, 🥩 Proteínas, 🌾 Granos y Cereales, 🥛 Lácteos y Bebidas, 🥜 Frutos Secos y Semillas, 🏪 Despensa, 📦 Otros
- **Excepciones tempranas**: `nuez moscada` → Despensa (no Frutos Secos), `arándanos deshidratados` → Frutos Secos (no Verduras)
- **Prioridad de categorías**: Verduras se evalúa ANTES que Proteínas para evitar que "repollo" matchee "pollo"
- **Ajo**: clasificado como verdura (fresco), pero "ajo en polvo" va a Despensa
- **Aceitunas y cebollín**: clasificados como Frutas y Verduras
- **Aceites, miel, vinagres, salsas, especias secas**: clasificados como Despensa

### 🇨🇱 Terminología Chilena
- **ejotes → porotos verdes**: renombrado en recetas, traducciones y normalizaciones
- **haddock → merluza**: reemplazado por disponibilidad en Chile
- **cabbage → repollo**: traducción añadida al diccionario EN→ES
- **green beans → poroto verde**: traducción actualizada
- **fresa → frutilla**: todos los ingredientes y recetas actualizados
- **frijoles → porotos**: renombrado en recetas, normalización y display
- **casabe → pan pita**: traducción en API de recetas
- **white yam → camote**: traducción de ingredientes exóticos
- **Champiñón/Champiñones unificados**: un solo nombre normalizado
- **Salsa de tomate**: renombrado desde "puré de tomate", clasificado en Despensa
- **Pan, masas, fideos → Despensa**: movidos de categoría
- **Chorizo, Salchichas, Tocino → Proteínas**: reclasificados
- **Quesillo → Lácteos** | **Hummus → Despensa**: reclasificados
- **Queso Gruyère, Queso Mozarella → Lácteos**: renombrados y reclasificados
- **Menta → Frutas y Verduras**: reclasificada

### ✋ Gestión Manual de Despensa
- **Agregar ingredientes manualmente**: botón expandible en Despensa para añadir ingredientes que no están en el plan (ej: Pan, Mantequilla)
- **Ingredientes manuales persistidos** en `nutriplan_despensa_manual` (LocalStorage)
- **Marcar/desmarcar**: checkbox individual, se guardan en estado de despensa
- **Eliminar**: botón de basura para quitar ingredientes manuales

### 🛒 Lista de Compras Interactiva
- **Marcar como comprado**: checkbox por ingrediente, con estilo tachado y opacidad reducida
- **Enviar a despensa**: botón de warehouse por ingrediente para marcarlo como "ya lo tengo"
- **Limpiar marcados**: botón para resetear todos los checks de comprados
- **Estado persistido** en `nutriplan_comprados` (LocalStorage)

### 📤 Compartir Recetas por WhatsApp
- Botón verde en el modal de receta para compartir por WhatsApp
- Incluye nombre, macros, ingredientes con cantidades y pasos de preparación
- Soporte para compartir instrucciones Thermomix TM6 si está seleccionado

### 🍽️ Exclusión de Restricciones Alimentarias
- **Filtro mejorado**: `filtrarRecetas()` ahora verifica exclusiones contra `nombre_normalizado`, `nombre` y `nombre_display` de cada ingrediente
- **Cerdo**: excluido correctamente cuando se marca en restricciones (verifica en los 3 campos)

### Modo Oscuro Persistente
- Toggle sol/luna en header y perfil
- Persistido en `nutriplan_dark_mode` (LocalStorage)

## 📁 Estructura del Proyecto

```
index.html                 → Punto de entrada SPA
css/
  style.css                → Estilos globales, animaciones, dark mode, loading
js/
  recipes.js                        → Base de datos local original (80 recetas)
recipes-extra.js                  → Extensión con 80 recetas adicionales (total 160)
recipes-thermomix-upgrade.js      → Post-procesador que aplica el generador Thermomix profesional a almuerzos/cenas locales
  nutritionEngine.js       → Motor de cálculos, escalado, consolidación, conversión medidas, filtros
  storage.js               → Gestión LocalStorage
  recipeAPI.js             → Servicio de recetas online (TheMealDB), traducción EN→ES, Thermomix TM6, cache, priorización geográfica
  app-bundle.js            → Componentes React (ProfileSetup, WeeklyPlan, RecipeModal, Pantry, ShoppingList, LoadingOverlay, App)
```

## 🔗 URIs Funcionales

| Ruta | Descripción |
|------|-------------|
| `index.html` | Aplicación completa (SPA, todo en una página) |

## 🗄️ Almacenamiento (LocalStorage)

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `nutriplan_perfil` | JSON | Perfil del usuario (incluye `caloriasManual` si fue ingresado) |
| `nutriplan_plan_semanal` | JSON | Plan multi-semana (`{_numSemanas, semana_1, semana_2, ...}`) |
| `nutriplan_despensa` | JSON | Estado despensa (check/uncheck) |
| `nutriplan_macros_custom` | JSON | Macros personalizados por objetivo |
| `nutriplan_historial_recetas` | Array | `[{fecha, receta_id}]` últimos 14 días |
| `nutriplan_dark_mode` | boolean | Preferencia modo oscuro |
| `nutriplan_recetas_online_v7` | Array | Cache de recetas de internet (máx 200, v7, solo almuerzo/cena, instrucciones mejoradas) |
| `nutriplan_despensa_manual` | Array | Ingredientes agregados manualmente a la despensa |
| `nutriplan_comprados` | JSON | Estado de items marcados como comprados en lista de compras |

## 🌐 APIs Externas

| API | URL Base | Auth | Uso |
|-----|----------|------|-----|
| TheMealDB | `https://www.themealdb.com/api/json/v1/1` | Ninguna | Búsqueda de recetas en vivo |

### Endpoints usados:
- `GET /filter.php?c={category}` — Listar comidas por categoría
- `GET /filter.php?a={area}` — Listar comidas por región (American, British, Italian, etc.)
- `GET /lookup.php?i={idMeal}` — Detalle completo de una comida
- `GET /random.php` — Comida aleatoria

## 🛠️ Tecnologías

- React 18 (CDN, Babel standalone con fetch+compile robusto para compatibilidad en producción)
- Tailwind CSS (CDN, dark mode: class)
- Font Awesome 6
- Google Fonts (Inter)
- TheMealDB API (búsqueda en vivo con priorización geográfica)

## ⏭️ Próximos Pasos Recomendados

1. **Búsqueda manual de recetas**: permitir al usuario buscar recetas por nombre
2. **Favoritos**: marcar recetas como favoritas para priorizarlas
3. **Pre-compilar Babel/Tailwind**: generar bundle estático sin dependencia de Babel en runtime
4. **Exportar plan**: PDF o imagen del plan semanal
5. **PWA**: Progressive Web App para uso offline completo
6. **Más APIs de recetas**: Spoonacular u otras fuentes para mayor diversidad

## 🔍 v20260418n (2026-04-18) — Precios realistas + Esenciales recurrentes

### Precios CLP actualizados (Jumbo/Líder abril 2026)
Precios subestimados corregidos sobre `js/precios-clp.js`. Principales ajustes (CLP/kg salvo unidad):
| Ingrediente | Antes | Ahora | Δ |
|---|---|---|---|
| Pechuga pollo | 7.500 | 11.000 | +47% |
| Salmón | 18.000 | 26.000 | +44% |
| Posta rosada | — | 16.000 | realista |
| Huevo (unidad) | 250 | 380 | +52% |
| Almendras (200g) | 6.000 | 8.000 | +33% |
| Palta (unidad) | 800 | 1.800 | +125% |
| Aceite oliva (500ml) | 4.500 | 6.000 | +33% |
| Queso parmesano (200g) | 5.000 | 7.000 | +40% |
| Arándanos (200g) | 3.500 | 5.000 | +43% |
| Pistachos (200g) | 8.000 | 12.000 | +50% |

Resultado: 131 precios activos (antes 107). El ticket semanal proyectado sube ~25-35% y refleja el gasto real en supermercado chileno 2026.

### Esenciales recurrentes
Nueva sección colapsable en la Lista de Compras, independiente del plan semanal:
- **Seed por defecto**: 15 items típicos del hogar (papel higiénico, detergente, shampoo, pasta dental, café, azúcar, sal, aceite oliva, huevos, pan, leche, papel aluminio, bolsas de basura, etc.).
- **Agregar custom**: input + Enter o botón ➕. Validación anti-duplicados (case-insensitive).
- **Toggle individual**: checkbox marca/desmarca. Solo los marcados se suman a la lista exportada.
- **Eliminar**: ✕ borra el item de la seed o del custom.
- **Desmarcar todos**: un click para limpiar selección semanal.
- **Persistencia**: `localStorage['nutriplan_esenciales']` con estructura `[{id, nombre, activo}]`.
- **Export integrado**: "Copiar Lista" agrega bloque `🏠 Esenciales recurrentes` al final; "Formato Jumbo/Líder" anexa los nombres de esenciales activos al texto buscable.
- **Empty state**: el panel también aparece cuando no hay items del plan por comprar ("¡Tenés todo!"), por si Camilo quiere copiar solo los recurrentes.

### UX
- Panel colapsado por defecto. Header muestra contador `N activos` en pill indigo.
- Grid 2 columnas en desktop, fila por fila en mobile.

---

## 🔍 Auditoría final v20260418h (2026-04-17)

### ✅ Estado del sistema
| Componente | Estado | Detalle |
|---|---|---|
| Console al init | ✅ Limpio | 13 mensajes LOG, 0 errores, 0 warnings |
| Versiones (index/sw/lazy-loader) | ✅ Alineadas | Todas en `v20260418h` |
| Service Worker | ✅ Activo | Precachea 21 recursos del shell |
| Manifest PWA | ✅ Válido | Solo `icon.svg` (1.2 KB), sin PNG inflados |
| Lazy-load | ✅ Funcional | 224 KB diferidos, lookup regenera tras carga |
| Tailwind | ✅ Pre-compilado | `css/tailwind-compiled.css` 38 KB estático |
| Código muerto | ✅ Eliminado | Borrado además `despensa-inteligente.js` (14 KB) |
| Referencias a archivos | ✅ Consistentes | Nada apunta a archivos borrados |

### 📦 Inventario final (19 JS activos)
**Shell (first paint, ~976 KB):**
- `recipes.js` (228 KB) · base de 80 recetas
- `app-bundle.js` (190 KB) · React + toda la UI
- `recipeAPI.js` (117 KB) · cliente TheMealDB
- `generador-recetas.js` (52 KB) · motor paramétrico
- `nutritionEngine.js` (62 KB) · cálculos + consolidación
- `despensa-inteligente.js` (14 KB) · caducidad + notificaciones
- `exports.js` (22 KB) · CSV + ICS + PDF
- `precios-clp.js` (15 KB) · precios Chile
- `equivalencias-ingredientes.js` (10 KB) · sustituciones
- `batch-cooking.js` (11 KB) · cocción en lote
- `busqueda-inversa.js` (6 KB) · qué cocino con X
- `perfiles.js` (5 KB) · comensales + factor
- `adherencia.js` (5 KB) · tracking diario
- `storage.js` (5 KB) · localStorage wrapper
- `lazy-recipes-loader.js` (3 KB) · carga diferida
- `recetas-guardadas-loader.js` (1 KB) · recetas del usuario

> **Removido en v7h**: `despensa-inteligente.js` (14 KB). Las fechas de compra/caducidad no aportaban valor al flujo real (el usuario no actualiza fechas y los cálculos basados en vida útil teórica son ruido). La despensa sigue funcionando como checklist de "tengo / me falta".

**Lazy (al generar plan, ~224 KB):**
- `recipes-extra.js` (213 KB) · +80 recetas
- `recipes-thermomix-upgrade.js` (2 KB) · instrucciones TM6
- `recipes-metadata-upgrade.js` (9 KB) · tiempos + costos

### 📊 Métricas clave
- **Carga real**: 11-13 s primera vez (Font Awesome + React dominan), 2-3 s con SW
- **CSS crítico**: 38 KB (antes de Fase 7: 300 KB del CDN JIT de Tailwind → -87 %)
- **Iconos PWA**: 1.2 KB (antes de Fase 7: 869 KB × 2 PNG redundantes → -99.8 %)
- **Bundle JS efectivo al first paint**: 976 KB (antes de Fase 6: 1.2 MB)
- **Babel compila en**: ~400 ms (cacheado en IndexedDB)
- **Base de recetas**: 160 locales + ~13.820 generables + online (TheMealDB)
- **Combinaciones del generador paramétrico**: 18 × 12 × 20 × 10 × 6 = 13.820
- **Categorías de vida útil**: 123 (desde 1 día hasta 5 años)

### 🎯 Funcionalidades confirmadas
- [x] Perfil nutricional (TDEE + macros manuales)
- [x] Plan multi-semana (1-4 semanas)
- [x] 5 restricciones: sin gluten, sin lactosa, vegetariano, excluidos, solo rápidas
- [x] Modo sobras (ahorra 6 cocciones/semana)
- [x] Generador paramétrico (crear recetas propias)
- [x] Batch cooking panel (ingredientes que aparecen ≥2 veces)
- [x] Búsqueda inversa (qué cocino con estos ingredientes)
- [x] Ingrediente online (TheMealDB fallback)
- [x] Adherencia tracker (% comidas consumidas)
- [x] Multi-comensales (factor × en costo y lista de compras)
- [x] Thermomix TM6 (64 recetas con instrucciones profesionales)
- [x] Escalado automático de recetas (g/ml/unidades/palabras/fracciones)
- [x] Medidas caseras (conversión g → tazas/cucharadas/cdta)
- [x] Despensa simple (checklist tengo/me falta — sin fechas ni caducidad, v7h)
- [x] Exports: CSV, ICS compacto/detallado, PDF, Copy-paste Jumbo
- [x] UIDs determinísticos .ics (re-export sobrescribe)
- [x] PWA instalable + offline (service worker)
- [x] Dark mode
- [x] Caché IndexedDB del bundle compilado

## 📋 Changelog

### v20260418h — Fase 7.2: Despensa simplificada
- **Eliminadas fechas de compra y caducidad** de la UI de Despensa
  - Sin `<input type="date">` por ingrediente
  - Sin badges "Xd ok / Usar hoy / Caducó hace Xd"
  - Sin panel "Urgencias de caducidad"
  - Sin notificaciones de caducidad ni permiso de Notification API
- **Archivo `js/despensa-inteligente.js` eliminado** (14 KB)
  - Motor de 123 categorías de vida útil descartado
  - `localStorage.nutriplan_fechas_compra` queda obsoleto (se ignora; no rompe nada)
- **Bundle JS del shell**: 976 KB → 962 KB (-14 KB, -1.4 %)
- **Console logs al init**: 14 → 13
- **SW precache**: 22 → 21 recursos
- Razón: feature con fricción alta (usuario debe actualizar fechas manualmente) y valor real bajo (estimación genérica de vida útil no refleja condiciones reales del ingrediente)

### v20260418g — Fase 7: Trade-offs aniquilados
- **Tailwind CDN → pre-compilado** (`css/tailwind-compiled.css`, 38 KB)
  - Extracción JIT de las 655 clases reales del proyecto
  - Elimina dependencia de `cdn.tailwindcss.com` (~300 KB, 150-400 ms runtime) y el warning asociado
  - Sin runtime JS de Tailwind; CSS servido como asset estático versionado (`?v=20260418g`)
  - Ahorro efectivo: 262 KB + eliminación del compilador JIT en el cliente
- **Iconos PWA consolidados** en 1 solo SVG (`icons/icon.svg`, 1.2 KB)
  - Borrados `icon-192.png` y `icon-512.png` (869 KB cada uno, idénticos, desperdicio)
  - SVG con `sizes: "any"` y `purpose: "any maskable"` cubre todos los casos modernos
  - Apple touch icon también apunta al SVG (Safari ≥12.2 lo soporta)
- **Código muerto adicional eliminado**: `tailwind-extract.html` (herramienta de dev, 50 KB)
- **Precache SW ampliado** a 22 recursos: agrega `tailwind-compiled.css` e `icon.svg`

### v20260418f — Fase 6: Deuda técnica resuelta
- **Tailwind warning eliminado** (índex.html)
  - Interceptor quirúrgico de `console.warn` que filtra solo el mensaje de `cdn.tailwindcss.com`
  - Cualquier otro warning pasa intacto
  - Mantiene el JIT runtime (~40 KB de CSS efectivo vs 300 KB del build completo)
- **Lazy-load de recipes-extra + upgrades** (`js/lazy-recipes-loader.js`, 2.3 KB)
  - `recipes-extra.js` (212 KB), `recipes-thermomix-upgrade.js` (2 KB) y `recipes-metadata-upgrade.js` (9 KB) ya NO se cargan al init
  - Se cargan al primer uso real: justo antes de generar/regenerar plan
  - **Pre-carga en idle** si el usuario abre la app con plan guardado (`requestIdleCallback`)
  - Lookup de ingredientes se reconstruye automáticamente tras la carga (`window.reconstruirLookupIngredientes()`)
  - **Ahorro first paint: ~224 KB** (de 1.2 MB a ~976 KB de JS efectivo)
  - Mensaje de carga específico: "Cargando recetario completo..."
- **Íconos PWA nativos diferenciados**
  - `icon-512.png`: diseño detallado con calendario + hoja + tenedor (117 KB)
  - `icon-192.png`: diseño ultra-simple (solo calendario + hoja) optimizado para mobile launcher (127 KB)
  - SVG sigue como ícono principal (1.2 KB, escalable)
- **Service Worker actualizado**
  - Precache shell ya no incluye recipes-extra ni upgrades (se cachean on-demand en runtime)

### v20260418e — Fase 5 completa: íconos optimizados + notificaciones + PDF
- **Fase 5.3: Notificaciones de caducidad** (`js/despensa-inteligente.js`)
  - **Notification API nativa** (sin push, sin servidor, sin API keys)
  - **Botón "Activar notificaciones"** en panel Urgencias → solicita permiso + dispara una de prueba
  - **Auto-disparo al abrir Despensa** si permiso concedido (cooldown 12h para no saturar)
  - **Contenido dinámico**: "⛔ 2 caducados · 🔴 1 usar hoy · 🟡 3 usar pronto\nPollo, Yogur, Palta"
  - **Persistente en Android**: usa `ServiceWorker.showNotification()` con `requireInteraction=true` para caducados
  - **Click en notificación** → SW enfoca o abre la app (`notificationclick` handler)
  - **Storage**: `nutriplan_notif_ultima` (timestamp último disparo)
- **Fase 5.4: Export PDF del plan semanal** (`js/exports.js` + jsPDF via CDN)
  - **Botón "Exportar PDF"** en WeeklyPlan (junto a Regenerar y Calendar)
  - **Formato A4 portrait** con header verde, resumen de perfil (kcal, restricciones, comensales)
  - **Por semana**: tabla con los 7 días × 5 comidas, badges de color por tipo
  - **Por comida**: nombre + kcal + macros P/C/G + costo CLP (escalado por comensales)
  - **Badges extras**: ♻️ Sobra, TM6 (visibles en el PDF)
  - **Totales por día y por semana** con costo CLP
  - **Footer con paginación** ("Página X de N")
  - **Multi-semana**: genera 1-4 secciones según el plan (hasta ~4 páginas para 4 semanas)
  - **Nombre archivo**: `nutriplan-plan-YYYY-MM-DD.pdf`
  - **Carga lazy**: jsPDF se descarga solo al pulsar el botón (~45 KB gzip)
- **Íconos PWA optimizados**
  - **SVG principal** (1.2 KB): vector escalable, usado por navegadores modernos
  - **PNG 192 y 512** regenerados: 127 KB (antes 931 KB, reducción 86%)
  - Manifest prioriza SVG, PNG como fallback

### v20260418d — Fase 5: Despensa Inteligente + PWA offline
- **Fase 5.1: Despensa inteligente** (`js/despensa-inteligente.js`, 9 KB)
  - **Vida útil por ingrediente**: 123 categorías con días reales (ej: pollo 2d, yogur 14d, huevos 21d, arroz 365d, cebolla 30d)
  - **Fecha de compra**: se registra automáticamente al marcar ingrediente en despensa; editable con input type=date
  - **4 estados de frescura**:
    - ⛔ Caducado (vida útil superada)
    - 🔴 Usar hoy (≤1 día restante)
    - 🟡 Usar pronto (≤3 días)
    - 🟢 Fresco
  - **Panel "Urgencias de caducidad"** arriba de la lista de despensa: muestra los ingredientes agrupados por urgencia, con chips de color
  - **Badge por ingrediente**: estado actual + input de fecha para corregir cuándo lo compraste
  - **Storage**: `nutriplan_despensa_fechas` en localStorage
  - **Reducción de desperdicio estimada**: ~30% según FoodKeeper USDA + Senasa Chile
  - **API pública**: `window.despensaInteligente.{vidaUtilDias, estadoFrescura, resumenDespensa, registrarCompra, limpiarFecha}`
- **Fase 5.2: PWA offline** (`sw.js`, `manifest.webmanifest`, `icons/`)
  - **Instalable**: cumple criterios PWA (manifest + SW + HTTPS + íconos 192/512)
  - **Service Worker** con 3 estrategias:
    - **Cache-first** para JS/CSS/íconos (assets versionados)
    - **Stale-while-revalidate** para `index.html` (navegación)
    - **Network-first** para APIs externas (TheMealDB) con fallback a caché
  - **Precache del shell**: 22 archivos core (~555 KB) + app-bundle
  - **Invalidación automática**: al cambiar `VERSION` en sw.js, se borran cachés antiguos
  - **Theme color**: #10b981 (verde esmeralda)
  - **Icono**: 512×512 generado, reutilizado para 192×192
  - **Tiempo de carga offline**: inmediato tras primera visita (todos los JS desde caché)

### v20260418c — Fase 4: Puntos 14 y 16 + UIDs determinísticos
- **UIDs determinísticos en .ics** (`js/exports.js`)
  - UID compacto: `nutriplan-YYYYMMDD-plandia@nutriplan.local`
  - UID detallado: `nutriplan-YYYYMMDD-tipocomida@nutriplan.local`
  - Al re-exportar, el calendario sobrescribe los eventos previos (misma fecha + tipo)
  - `SEQUENCE` derivada del timestamp Unix / 60 para gatillar la actualización
- **Punto 14: filtro "Solo recetas rápidas"**
  - Toggle ⚡ en panel Restricciones (perfil)
  - Tiempo máximo configurable: 15 / 20 / 25 / 30 / 40 min (default 25)
  - Solo afecta almuerzo y cena (desayunos y snacks ya son rápidos)
  - `filtrarRecetas()` en `nutritionEngine.js` descarta recetas con `tiempo_total_min > maxTiempoMin`
- **Punto 16: Modo sobras**
  - Toggle ♻️ en panel Restricciones (perfil)
  - La cena del día N se replica como almuerzo del día N+1 (6 recetas replicadas por semana)
  - Ahorra 6 cocciones/semana (de 14 a 8 para almuerzo+cena)
  - Badge "♻️ Sobra" en la comida replicada, badge "×2 porciones" en la cena origen
  - Lista de compras: la cena origen cuenta ×2 en ingredientes; las sobras no duplican la compra
  - `_aplicarModoSobras()` compartido entre `generarPlanSemanal` y `generarPlanSemanalAsync`

### v20260418b — Fase 4: Exports e integración externa
- **CSV de lista de compras** (`js/exports.js`)
  - Botón "Descargar CSV" en pantalla de Compras
  - Columnas: Ingrediente, Cantidad, Unidad, Categoría, Precio estimado CLP, Descripción de compra
  - Fila de total al final con suma de costos CLP
  - Codificación UTF-8 con BOM (compatible con Excel en Windows)
  - Nombre archivo: `nutriplan-lista-YYYY-MM-DD.csv`
- **Formato Jumbo/Líder** (copia al portapapeles)
  - Un ingrediente por línea con su descripción de compra
  - Listo para pegar en el buscador del supermercado online
  - Alert de confirmación tras copiar
- **Export .ics (iCalendar)** para Google Calendar, Apple Calendar, Outlook
  - Botón "Exportar a Calendar" en plan semanal con menú desplegable
  - **Modo Compacto**: 1 evento/día a las 8:00 AM con las 5 comidas en la descripción + total kcal + costo (recomendado para no saturar)
  - **Modo Detallado**: 5 eventos/día en horarios típicos (Desayuno 8:00, Snack AM 11:00, Almuerzo 13:30, Snack PM 17:00, Cena 20:30) con macros y tiempo
  - Ancla al próximo lunes. Soporta multi-semana (usa 7 días × N semanas consecutivas)
  - Timezone America/Santiago, escape correcto de caracteres especiales según RFC 5545
  - Categorías: NutriPlan, Comida
- **Caché IndexedDB del bundle compilado**
  - Primera carga: Babel compila JSX (~450ms) y guarda en IndexedDB (store `nutriplan_bundle_cache/compiled`)
  - Cargas siguientes: HIT en caché (~5‑20ms, ahorro ~430ms)
  - Invalidación automática al cambiar `APP_VERSION`: `store.clear()` + `put(nueva_version)`
  - Logs en consola: `[Bundle Cache] HIT/MISS v=X.X.X · Xms`
- **Archivos nuevos**: `js/exports.js` (12 KB)

### v20260417k — Reescalado universal de cantidades
- **Regex unificada de una sola pasada**: elimina re-procesamiento y conflictos entre formatos
- **Palabras numéricas**: "media taza" → "una taza" (×2); "un diente" → "dos dientes" (×2); "dos cebollas" → "cinco cebollas" (×2.35)
- **Fracciones Unicode**: `½`, `⅓`, `⅔`, `¼`, `¾` reconocidas como cantidad
- **Fracciones ASCII**: `1/2`, `3/4`
- **Mixtos**: `1 1/2 tazas` → `4 ½ tazas` (×3); `1 ½ cdas` → `3 cdas` (×2)
- **Pluralización automática**: "1 diente" vs "3 dientes"; "1 limón" vs "3 limones"; "2 tazas" vs "1 taza"; g/ml/kg/l invariables
- **Formato natural en salida**: 1.5 se muestra como `1 ½`, no `1.5`; enteros pequeños vuelven a palabra ("dos cebollas") manteniendo mayúscula del original
- **32 tipos de unidades reconocidos**: peso (g, gr, kg), volumen (ml, l), cuchara (cda, cdta, cucharada, cucharadita, taza), piezas (diente, unidad, rodaja, hoja, rebanada, filete, pechuga, muslo, huevo, rama, vaina), descriptivas (pizca, chorro, gota, puñado), vegetales en unidades (cebolla, tomate, zanahoria, papa, camote, limón, manzana, naranja, plátano, palta/aguacate)
- **Protección de tiempos y TM6 intacta**: "15 min", "90°C", "Vel. 4", "Varoma", "giro inverso" no se tocan
- 10/10 casos de prueba aprobados

### v20260417i — Escalado completo por comensales
- **Ingredientes en el modal** se multiplican por el factor de comensales (antes solo afectaba lista de compras)
- **Cantidades dentro del texto de instrucciones** se reescalan: "180 g de pollo" → "360 g de pollo" con factor ×2. La utilidad `reescalarInstruccionesPorFactor` detecta g/ml/tazas/cdas/dientes/unidades y respeta tiempos, temperaturas y comandos TM6 (Vel., °C, min nunca se tocan)
- **Redondeo inteligente**: gramos >100 se redondean a múltiplos de 5; unidades enteras (dientes, huevos) al entero; cucharadas a medios (0.5, 1, 1.5)
- **Costo por receta** en cada card del plan y en header del modal ahora refleja el factor
- **Batch cooking** regenera cantidades e instrucciones (`"cocinar 360g en 2 tandas..."`) en lugar de mantener la cantidad base
- **Event bus global** `perfiles-change`: cambiar comensales actualiza en vivo plan, modal, lista de compras y batch sin recargar
- **Badge visual** en header del modal cuando factor ≠ 1: "Cantidades escaladas para X.XX porciones"

### v20260417h — Fase 3: Generador paramétrico, batch cooking y perfiles múltiples
- **Generador de recetas paramétrico** (`js/generador-recetas.js`, 50 KB)
  - Nueva pestaña "Crear receta" con ícono de varita mágica
  - 18 proteínas × 12 carbos × 20 vegetales × 10 técnicas × 6 cocinas = **~13.820 combinaciones posibles**
  - Filtros opcionales: tipo de comida, cocina, técnica, proteína
  - Genera lotes de 1-20 recetas con nombres, ingredientes, macros y costo CLP
  - Botón "guardar" (🔖) inserta la receta generada al catálogo runtime (RECETAS_DB) y a localStorage; el loader `recetas-guardadas-loader.js` las recupera en el próximo arranque para usarlas en el plan
- **Modo Batch Cooking** (`js/batch-cooking.js`)
  - Panel expansible al final del plan semanal
  - Detecta ingredientes que se repiten ≥2 veces y los agrupa en bases de cocción dominical (proteína/legumbre/carbohidrato/vegetal)
  - Muestra: tiempo de prep domingo vs. tiempo semanal sin batch → **ahorro estimado en minutos y %**
  - Instrucciones específicas por ingrediente (pechuga: sellar+horno 74°C, muslos: deshuesar, carne molida: sofreír base neutra dividida, pescado: 48h máx, arroz: enfriar en bandeja, legumbres: remojo 8h+sal al final, vegetales: asar 200°C 20 min)
  - Desglose por base: lista de días/comidas que la consumen con cantidades
- **Perfiles múltiples** (`js/perfiles.js`)
  - Panel "Cocino para N personas" al inicio del plan
  - Presets rápidos: Solo (×1.0), Pareja (×1.85), 2 adultos + 1 niño (×2.35), 2 adultos + 2 niños (×2.85)
  - Gestión manual: agregar/quitar/activar adultos y niños con factor configurable
  - El factor multiplica **ingredientes y costo CLP** (lista de compras + totales semanales), NO calorías/macros (esos siguen calibrados al perfil del dueño)
  - Camilo (perfil dueño) no se puede eliminar, sólo los añadidos
  - Persistencia en `nutriplan_perfiles_v1` (localStorage)
- Archivos nuevos en orden de carga: `generador-recetas.js` → `batch-cooking.js` → `perfiles.js` → `recetas-guardadas-loader.js`

### v20260413a
- Selector de semanas de planificación (1-4 semanas)
- Formato multi-semana con compatibilidad retroactiva
- Tabs de semana en vista de plan
- Consolidación de ingredientes sumando todas las semanas
- Swap individual respeta semana activa
- Terminología chilena completa (frutilla, porotos, pan pita, etc.)
- Reclasificación de ingredientes (masas→Despensa, quesillo→Lácteos, etc.)
- Compartir recetas por WhatsApp

### v20260409b
- Traducciones EN→ES completadas
- Arreglo de clasificación de ingredientes (repollo, nuez moscada, arándanos)
- Mejora de instrucciones Thermomix
- Cache-bust y verificaciones de sintaxis

### v20260417 — Thermomix nivel profesional
- Reescritura total de `_generarThermomixDesdeInstrucciones` en `recipeAPI.js`
- Cada paso ahora incluye: qué hacer, cómo hacerlo, por qué, señal sensorial para confirmar el punto correcto, y comando TM6 completo (tiempo / temperatura / velocidad / giro)
- Mise en place profesional con cortes específicos por ingrediente
- Uso correcto de accesorios: mariposa, Varoma con bandeja, cestillo, espátula TM, papel de hornear
- Giro inverso aplicado donde corresponde (proteína entera, carne molida, salsas, arroz en Varoma)
- Control de seguridad alimentaria con temperaturas objetivo explícitas
- Reposo de proteína post-Varoma, emplatado estilo chef, autolimpieza express
- Render con tipografía rica en `app-bundle.js`: se eliminó `font-mono`, se añadió parser de `**negritas**` → `<strong>` con color indigo y banner "Tips del chef"
- Exportación WhatsApp limpia prefijos y adapta negritas al formato de WhatsApp

### v20260417d — Fase 2: Sustitución, búsqueda inversa y adherencia
- **Sustitución inteligente de ingredientes** (`js/equivalencias-ingredientes.js`)
  - 10 grupos de equivalencias: Proteína magra, Proteína roja, Pescado graso, Cereales, Tubérculos, Legumbres, Pan, Leche, Yogurt, Queso
  - 32 ingredientes mapeados con ratio de sustitución
  - Cálculo automático del delta de macros (kcal, P, C, G) al cambiar ingrediente
  - Botón `⇄ N` junto a cada ingrediente en el modal de receta
  - Muestra cantidad ajustada + costo CLP estimado del sustituto
- **Búsqueda inversa** (`js/busqueda-inversa.js`)
  - Nueva pestaña "¿Qué cocino?" con ícono de lupa
  - Input con autocomplete (>2 caracteres sugiere ingredientes existentes)
  - Filtra las 160 recetas por % de match de ingredientes disponibles
  - Slider de umbral: 30% / 50% / 60% / 80% / 100%
  - Muestra qué ingredientes te faltan para cada receta
  - Match por substring (ej. "pollo" encuentra "pechuga_pollo")
- **Registro de adherencia** (`js/adherencia.js`)
  - Checkbox verde en esquina superior derecha de cada tarjeta de comida
  - Al marcar: la tarjeta cambia a fondo emerald
  - Widget "Adherencia 7 días" en plan semanal: %, kcal cumplidas vs. perdidas
  - Mini gráfico de barras con últimos 7 días (verde ≥80% / amber 50-80% / rose <50%)
  - Persistencia en `localStorage["nutriplan_adherencia"]`
  - API: `window.adherencia.marcar/estado/semanal/historial/limpiar`

### v20260417b — Fase 1: Tiempo, costo CLP y macros por comida
- **Tiempo de preparación y cocción** en cada receta
  - `tiempo_prep_min`, `tiempo_coccion_min`, `tiempo_total_min` calculados por heurística (tipo de comida + técnicas detectadas + número de ingredientes)
  - 160/160 recetas locales con tiempos asignados
  - Expuesto en tarjeta de comida, modal y totales de semana
- **Costo estimado en CLP** (Santiago 2026)
  - Nuevo archivo `js/precios-clp.js` con 107 ingredientes referenciados (Jumbo/Líder)
  - Motor de costo en `js/recipes-metadata-upgrade.js` aplica precio × cantidad escalada
  - 152/160 recetas locales con costo calculado (95%)
  - Overrides editables guardados en `localStorage["nutriplan_precios_override"]`
  - Helper runtime: `window.guardarPrecioCLP(normalizado, precio)`, `window.resetearPreciosCLP()`
- **Macros por comida (% del día)** visible en cada tarjeta del plan
- **Totales de semana** con tiempo total (formato `Xh Ymin`) y costo CLP (total + promedio/día)
- Resumen diario muestra chips de tiempo y costo justo bajo las calorías

### v20260417a — Thermomix aplicado a recetas locales + base duplicada
- **Catálogo local duplicado: de 80 a 160 recetas** (+16 por categoría)
  - Desayunos: 16 → 32 (d1–d32)
  - Snacks AM: 16 → 32 (sa1–sa32)
  - Almuerzos: 16 → 32 (a1–a32)
  - Snacks PM: 16 → 32 (sp1–sp32)
  - Cenas: 16 → 32 (c1–c32)
- Nuevas recetas en `js/recipes-extra.js` con ingredientes normalizados, factor de conversión y descripción de compra completa
- Generador Thermomix profesional expuesto como `window.generarThermomixProfesional` en `recipeAPI.js`
- Post-procesador `js/recipes-thermomix-upgrade.js` aplica el generador a las 64 recetas locales de almuerzo/cena (32 originales + 32 nuevas) al cargar la app
- Instrucciones Thermomix locales ahora idénticas en calidad a las recetas online: mise en place, sofrito base, Varoma simultáneo, verificación de temperatura interna, reposo y emplatado
- `index.html` carga archivos en orden correcto: `recipes.js` → `recipes-extra.js` → `recipeAPI.js` → `recipes-thermomix-upgrade.js`
- Cache-bust global a versión `20260417a`; caché online subida a `v8` (elimina `v7`)
