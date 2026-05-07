/* ============================================
   Calibrate — Cloud Function: proxy Claude API
   Endpoint: /calibrateChat  (Gen 2 HTTPS callable)
   invoker: allAuthenticatedUsers (Firebase Auth tokens son válidos)
   ============================================ */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onSchedule }         = require('firebase-functions/v2/scheduler');
const { defineSecret }       = require('firebase-functions/params');
const https                  = require('https');
const admin                  = require('firebase-admin');
const webpush                = require('web-push');

const ANTHROPIC_KEY     = defineSecret('ANTHROPIC_API_KEY');
const GROQ_KEY          = defineSecret('GROQ_API_KEY');
const VAPID_PRIVATE_KEY = defineSecret('VAPID_PRIVATE_KEY');

// Public VAPID key — embedded in client also (safe to expose)
const VAPID_PUBLIC_KEY = 'BHaa4Gkl2iQ_qrIFze1YaKqkqy2DGdH2Ae4wivJGvR3kgn8ng3qbK_AS9Mu0o1uxzmFDIZIw7QJvTIK_iCdzeGU';
const VAPID_SUBJECT    = 'mailto:crespo.camilo@gmail.com';

// Admin whitelist — solo estos emails pueden llamar getAdminMetrics
const ADMIN_EMAILS = ['crespo.camilo@gmail.com'];

// Init Firebase Admin (idempotente)
if (!admin.apps.length) {
  admin.initializeApp();
}

// ── Herramientas ────────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'planear_comida',
    description: 'Agrega una comida al plan del día como PENDIENTE (no consumida aún). SOLO úsala cuando el usuario diga EXPLÍCITAMENTE que PLANEA comer algo en el FUTURO ("voy a comer", "voy a tomar X más tarde", "lo voy a almorzar al mediodía", "para la cena pienso comer X"). La comida aparece en pantalla pero NO se cuenta en los macros hasta que se confirme. CRÍTICO: si el usuario dice "agregar X", "anota X", "registra X", "súmale X", "ponme X" sin marcador explícito de futuro, NO uses esta herramienta — usa registrar_comida (es comida ya consumida por defecto).',
    input_schema: {
      type: 'object',
      properties: {
        nombre:          { type: 'string',  description: 'Nombre descriptivo de la comida' },
        kcal:            { type: 'number',  description: 'Calorías estimadas' },
        proteinas_g:     { type: 'number',  description: 'Proteínas en gramos' },
        carbohidratos_g: { type: 'number',  description: 'Carbohidratos en gramos' },
        grasas_g:        { type: 'number',  description: 'Grasas en gramos' }
      },
      required: ['nombre', 'kcal', 'proteinas_g', 'carbohidratos_g', 'grasas_g']
    }
  },
  {
    name: 'registrar_comida',
    description: 'Registra una comida que el usuario YA comió. SOLO úsala cuando el usuario use tiempo pasado ("comí", "me comí", "almorcé", "tomé", "desayuné", "cené"). NUNCA la uses para comidas futuras, planificación, cambios de menú ni sugerencias. Puede registrar en días anteriores especificando fecha.\n\nREGLA CRÍTICA — campo reemplaza: si el usuario menciona el tipo de comida ("de desayuno", "en el almuerzo", "en la once", "en la cena", "en la colación", o usa verbos como "desayuné", "almorcé", "cené"), SIEMPRE debes asignar reemplaza con el slot correcto. Usa EXACTAMENTE uno de estos valores: desayuno | snack_am | almuerzo | snack_pm | cena. Mapeo: desayuno/breakfast → "desayuno", colación AM/snack mañana → "snack_am", almuerzo/lunch → "almuerzo", once/snack tarde/merienda → "snack_pm", cena/dinner → "cena". Solo deja reemplaza vacío/null si la comida es genuinamente adicional sin relación a ningún slot del plan (ej: "me comí una fruta de snack entre comidas sin horario definido").',
    input_schema: {
      type: 'object',
      properties: {
        nombre:          { type: 'string',  description: 'Nombre descriptivo de la comida' },
        kcal:            { type: 'number',  description: 'Calorías totales' },
        proteinas_g:     { type: 'number',  description: 'Proteínas en gramos' },
        carbohidratos_g: { type: 'number',  description: 'Carbohidratos en gramos' },
        grasas_g:        { type: 'number',  description: 'Grasas en gramos' },
        reemplaza:       { type: 'string',  description: 'Slot del plan que reemplaza. Valores exactos permitidos: desayuno | snack_am | almuerzo | snack_pm | cena. Omitir (o null) SOLO si es una comida adicional sin relación a ningún slot del plan.' },
        fecha:           { type: 'string',  description: 'Fecha en formato YYYY-MM-DD. Omitir para usar hoy. Usar cuando el usuario mencione un día anterior ("ayer comí", "el lunes tuve", etc.).' }
      },
      required: ['nombre', 'kcal', 'proteinas_g', 'carbohidratos_g', 'grasas_g']
    }
  },
  {
    name: 'buscar_alimento',
    description: 'Busca información nutricional de un alimento en la base de datos.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Nombre del alimento a buscar' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_resumen_dia',
    description: 'Devuelve el resumen de macros consumidos vs objetivo para una fecha. La respuesta incluye: consumido (totales), objetivo, diferencia, comidas_plan_comidas (slots del plan marcados como comidos), comidas_reemplazo (comidas externas que reemplazan un slot, campo reemplaza≠null), comidas_adicionales (extras sin slot asignado, pueden ser muchas — es normal). Sin fecha devuelve hoy; con fecha devuelve ese día específico.',
    input_schema: {
      type: 'object',
      properties: {
        fecha: { type: 'string', description: 'Fecha en formato YYYY-MM-DD. Omitir para hoy.' }
      }
    }
  },
  {
    name: 'eliminar_comida',
    description: 'Elimina una comida registrada por error del log. Úsala cuando el usuario diga que una comida fue registrada por error, que no la comió, o que quiere desmarcarla.',
    input_schema: {
      type: 'object',
      properties: {
        id:     { type: 'string', description: 'ID de la comida a eliminar (si se conoce)' },
        nombre: { type: 'string', description: 'Nombre de la comida a eliminar (si no se conoce el ID)' },
        fecha:  { type: 'string', description: 'Fecha en formato YYYY-MM-DD. Omitir para hoy.' }
      }
    }
  },
  {
    name: 'get_plan_semana',
    description: 'Devuelve el plan de comidas de la semana completa (desayuno, almuerzo, once, cena, colación por día). Úsala cuando el usuario pregunte qué tiene planificado, qué come esta semana, etc.',
    input_schema: { type: 'object', properties: {} }
  },
  {
    name: 'get_lista_compras',
    description: 'Devuelve los ingredientes necesarios para el plan semanal, indicando cuáles están en la despensa y cuáles faltan comprar. Úsala cuando el usuario pregunte qué necesita comprar.',
    input_schema: { type: 'object', properties: {} }
  },
  {
    name: 'marcar_comprado',
    description: 'Marca un ingrediente de la lista de compras como ya comprado. Úsala cuando el usuario diga que ya compró un ingrediente.',
    input_schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', description: 'Nombre del ingrediente a marcar como comprado (búsqueda parcial)' }
      },
      required: ['nombre']
    }
  },
  {
    name: 'marcar_en_despensa',
    description: 'Marca un ingrediente como disponible en la despensa (ya lo tiene en casa). Úsala cuando el usuario diga que ya tiene ese ingrediente.',
    input_schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', description: 'Nombre del ingrediente (búsqueda parcial)' }
      },
      required: ['nombre']
    }
  },
  {
    name: 'quitar_de_despensa',
    description: 'Quita un ingrediente de la despensa, marcándolo como faltante (aparecerá en la lista de compras). Úsala cuando el usuario diga que se le acabó o que necesita comprar ese ingrediente.',
    input_schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', description: 'Nombre del ingrediente (búsqueda parcial)' }
      },
      required: ['nombre']
    }
  },
  {
    name: 'marcar_comida_plan',
    description: 'Marca una comida del plan semanal como cumplida (ya la comió, siguió el plan). Úsala cuando el usuario confirme que comió exactamente lo que tenía planificado para ese slot del plan. Puede marcar días anteriores con fecha.',
    input_schema: {
      type: 'object',
      properties: {
        dia:   { type: 'string', description: 'Día de la semana: Lunes | Martes | Miércoles | Jueves | Viernes | Sábado | Domingo' },
        tipo:  { type: 'string', description: 'Slot del plan. Valores exactos: desayuno | snack_am | almuerzo | snack_pm | cena. Mapeo: desayuno → "desayuno", colación mañana → "snack_am", almuerzo → "almuerzo", once/merienda tarde → "snack_pm", cena → "cena".' },
        fecha: { type: 'string', description: 'Fecha exacta YYYY-MM-DD. Usar cuando el usuario mencione un día anterior. Si se omite, se infiere del día de la semana más reciente.' }
      },
      required: ['dia', 'tipo']
    }
  },
  {
    name: 'aplicar_cambios_perfil',
    description: 'Modifica el perfil del usuario y opcionalmente regenera el plan semanal. TOOL DESTRUCTIVA — sobrescribe objetivo calórico, macros y/o plan completo. ANTES de llamarla, SIEMPRE resume en texto los cambios y pide confirmación explícita; solo llámala después de que el usuario confirme con "sí", "dale", "confirmo", "adelante" o equivalente. Si calorias_objetivo está fuera de [1200, 4000], requiere confirmar_fuera_de_rango=true (de lo contrario devuelve error). El campo nivel_actividad representa la rutina de ejercicios del usuario (sedentario | ligera | moderada | muy_activo | extremo). Cuando el cambio afecte kcal o macros, usa regenerar_plan=true para que el plan quede sincronizado.',
    input_schema: {
      type: 'object',
      properties: {
        peso_kg:          { type: 'number', description: 'Peso en kg' },
        altura_cm:        { type: 'number', description: 'Altura en cm' },
        edad:             { type: 'number', description: 'Edad en años' },
        genero:           { type: 'string', description: 'masculino | femenino' },
        nivel_actividad:  { type: 'string', description: 'sedentario | ligera | moderada | muy_activo | extremo. Representa la rutina de ejercicios (frecuencia semanal).' },
        objetivo:         { type: 'string', description: 'perdida | mantenimiento | volumen' },
        calorias_objetivo: { type: 'number', description: 'Override manual de calorías diarias. Sobrescribe el cálculo automático del roadmap.' },
        macros_porcentaje: {
          type: 'object',
          description: 'Distribución de macros como porcentajes (deben sumar 100). Override del cálculo automático.',
          properties: {
            proteinas:     { type: 'number' },
            carbohidratos: { type: 'number' },
            grasas:        { type: 'number' }
          }
        },
        peso_target:                { type: 'number', description: 'Peso objetivo kg (solo objetivo=perdida)' },
        bf_target:                  { type: 'number', description: '%BF objetivo (solo objetivo=perdida)' },
        tasa_perdida:               { type: 'string', description: 'conservadora | moderada | agresiva (solo objetivo=perdida)' },
        timeline_meses_deseado:     { type: 'number', description: 'Plazo en meses para target (solo objetivo=perdida)' },
        tasa_ganancia:              { type: 'string', description: 'conservadora | moderada | agresiva (solo objetivo=volumen)' },
        peso_objetivo_volumen:      { type: 'number', description: 'Peso objetivo (solo objetivo=volumen)' },
        regenerar_plan:             { type: 'boolean', description: 'OPCIONAL. Por defecto el plan se regenera automáticamente cuando el cambio afecta kcal/macros/objetivo. Pasa false solo si el usuario explícitamente pide no regenerar el plan.' },
        confirmar_fuera_de_rango:   { type: 'boolean', description: 'Confirmación obligatoria si calorias_objetivo < 1200 o > 4000.' }
      }
    }
  },
  {
    name: 'regenerar_plan_semanal',
    description: 'Regenera el plan semanal con los parámetros actuales del perfil (sin modificar perfil). Útil cuando el usuario quiere "nuevas recetas" o "cambiar el plan" sin tocar objetivo/macros. TOOL DESTRUCTIVA — sobrescribe el plan actual. SIEMPRE pide confirmación antes de llamarla.',
    input_schema: { type: 'object', properties: {} }
  }
];

// ── Llamada directa a Anthropic ─────────────────────────────────────────────
function callAnthropic(apiKey, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname: 'api.anthropic.com',
      path:     '/v1/messages',
      method:   'POST',
      headers: {
        'Content-Type':      'application/json',
        'Content-Length':    Buffer.byteLength(payload),
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`Anthropic ${res.statusCode}: ${parsed?.error?.message || data}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', e => reject(new Error(`Network: ${e.message}`)));
    req.setTimeout(55000, () => { req.destroy(); reject(new Error('Timeout 55s')); });
    req.write(payload);
    req.end();
  });
}

// ── System prompt ───────────────────────────────────────────────────────────
function buildSystemPrompt(contexto) {
  const perfil    = contexto?.perfil || {};
  const macros    = contexto?.macrosObjetivo || {};
  const plan      = contexto?.planHoy || {};
  const consumido = contexto?.macrosConsumidos || {};
  const slotsReemplazados = contexto?.slotsReemplazados || [];

  const planTexto = Object.entries(plan).length > 0
    ? Object.entries(plan)
        .filter(([k]) => !k.startsWith('_'))
        .map(([tipo, receta]) => {
          const yaReemplazado = slotsReemplazados.includes(tipo);
          return `  • ${tipo}: ${receta?.nombre || '—'}${yaReemplazado ? ' ⚠️ YA REEMPLAZADO HOY' : ''}`;
        })
        .join('\n')
    : '  (sin plan cargado)';

  const slotsLibres   = ['desayuno','snack_am','almuerzo','snack_pm','cena'].filter(s => !slotsReemplazados.includes(s));
  const slotsOcupados = slotsReemplazados;

  // IA redesign 2026-05-07: el coach adapta el saludo y foco según el tab activo
  const activeTab = contexto?.activeTab || 'hoy';
  const tabHint = ({
    hoy:       'El usuario está en la pantalla "Hoy" — prioriza ayudarle con la comida y entreno del día. Si no escribió nada todavía, podrías ofrecer ayuda con la próxima comida pendiente.',
    plan:      'El usuario está en "Plan" (vista semanal) — orientá la conversación a ajustes del plan completo, regenerar comidas o entrenamientos de la semana.',
    progreso:  'El usuario está en "Progreso" — enfocá la conversación en tendencias (peso, fase del roadmap, adherencia, métricas corporales). Evitá registrar comidas acá salvo que lo pida explícito.',
    cocinar:   'El usuario está en "Recetario" — ayudá a buscar recetas, crear con ingredientes que tenga, o sugerir según despensa.',
    despensa:  'El usuario está viendo su Despensa — ayudá a sugerir qué cocinar con lo que tiene o qué falta comprar.',
    compras:   'El usuario está viendo la Lista de compras — ayudá a optimizar la lista o explicar qué se necesita para qué receta.',
    perfil:    'El usuario está editando su perfil — ayudá con dudas sobre su configuración u objetivo.'
  })[activeTab] || '';

  return `Eres el asistente nutricional de Calibrate, una app de nutrición personalizada.

USUARIO: ${perfil.nombre || 'Usuario'}
OBJETIVO: ${perfil.objetivo || 'mantenimiento'}
PANTALLA ACTIVA: ${activeTab}${tabHint ? ` — ${tabHint}` : ''}
DÍA Y FECHA HOY: ${contexto?.diaActual || ''} ${contexto?.fechaHoy || ''}

PLAN DE HOY (${contexto?.diaActual || ''}):
${planTexto}

SLOTS YA REEMPLAZADOS HOY (tienen comida externa registrada; NO usar reemplaza para estos):
  ${slotsOcupados.length > 0 ? slotsOcupados.join(', ') : '(ninguno)'}
SLOTS LIBRES HOY (se pueden reemplazar si el usuario menciona ese tipo de comida):
  ${slotsLibres.length > 0 ? slotsLibres.join(', ') : '(todos reemplazados)'}

MACROS OBJETIVO HOY:
  • Calorías:      ${macros.kcal || '—'} kcal
  • Proteínas:     ${macros.proteinas || '—'} g
  • Carbohidratos: ${macros.carbohidratos || '—'} g
  • Grasas:        ${macros.grasas || '—'} g

MACROS CONSUMIDOS HOY (valor AUTORIZADO — siempre usa este dato para los totales del día; ignora cualquier cálculo acumulado de la conversación):
  • Calorías:      ${consumido.kcal || 0} kcal
  • Proteínas:     ${consumido.proteinas || 0} g
  • Carbohidratos: ${consumido.carbohidratos || 0} g
  • Grasas:        ${consumido.grasas || 0} g
  (Nota: tras cada registrar_comida, marcar_comida_plan o eliminar_comida, el tool result devuelve "totalFecha" con el total REAL de esa fecha — SIEMPRE úsalo para el mensaje de confirmación, nunca sumes tú mismo los números.)

INSTRUCCIONES:
- Responde en español latinoamericano neutro — sin chilenismos, sin voseo (di "llevas", nunca "llevai"), sin "po", sin regionalismos de ningún país. Tono cercano y profesional.
- Si el usuario escribe en inglés, responde en inglés.
- Sé breve: máximo 3–4 oraciones por respuesta salvo que te pidan más detalle.
- No inventes datos del usuario que no estén en el contexto.
- Si el usuario pregunta por el plan del día, lee los datos de contexto.

USO DE HERRAMIENTAS — REGLAS ESTRICTAS:

REGISTRO DE COMIDAS — REGLA CRÍTICA DE TOOL CALLS:
Para registrar una comida, tu respuesta en ese turno DEBE incluir un tool_use de registrar_comida o marcar_comida_plan. NUNCA digas "registré", "guardé" o "marqué" en texto sin haber incluido el tool_use correspondiente en ese mismo turno. Si no incluiste el tool_use, NO digas que registraste.

CUÁNDO REGISTRAR (actúa inmediatamente, sin pedir confirmación extra):
  • Usuario usa tiempo PASADO ("comí", "almorcé", "cené", "tomé", "me comí") → llama registrar_comida de inmediato.
  • Usuario dice "agregar X", "anota X", "registra X", "súmale X", "ponme X", "agrégame X" SIN marcador explícito de futuro → llama registrar_comida (asume ya consumido — es lo que el usuario espera por defecto).
  • Usuario propuso macros antes de confirmar, y ahora dice "sí", "dale", "ok", "correcto", "adelante", "confirma" → llama registrar_comida de inmediato con los macros de la propuesta anterior.
  • Usuario dice que siguió el plan en un slot específico → llama marcar_comida_plan de inmediato.

CUÁNDO PLANEAR (NO consumido aún, solo planificación futura):
  • SOLO usa planear_comida cuando el usuario diga EXPLÍCITAMENTE intención futura: "voy a comer", "voy a almorzar después", "para la cena planeo X", "más tarde tomaré".
  • Si NO hay marcador explícito de futuro, usa registrar_comida (consumido). NUNCA "agregar X" se interpreta como pendiente.

ELIGE UNA SOLA VÍA, NUNCA LAS DOS:
  • Comió EXACTAMENTE lo planificado → USA SOLO marcar_comida_plan. NO llames registrar_comida.
  • Comió algo DIFERENTE al plan pero corresponde a ese horario → USA SOLO registrar_comida CON reemplaza=slot. NO llames marcar_comida_plan.
  • Comió algo ADICIONAL sin relación con ningún slot → USA SOLO registrar_comida SIN reemplaza.
  NUNCA llames registrar_comida Y marcar_comida_plan para la misma comida — causaría doble conteo.

REGLA CRÍTICA — inferir reemplaza automáticamente:
  Si el usuario menciona el nombre de una comida principal al registrar, Y ese slot aparece en "SLOTS LIBRES HOY", asigna reemplaza:
  • "desayuné X", "de desayuno comí X", "en el desayuno tuve X" → reemplaza: "desayuno"
  • "almorcé X", "en el almuerzo comí X", "al almuerzo tuve X" → reemplaza: "almuerzo"
  • "en la once comí X", "en la merienda", "en el snack de la tarde" → reemplaza: "snack_pm"
  • "cené X", "en la cena comí X" → reemplaza: "cena"
  • "en la colación de la mañana", "snack de mañana" → reemplaza: "snack_am"
  El usuario NO necesita decir explícitamente "esto reemplaza mi desayuno" — basta con mencionar el tipo de comida.
  EXCEPCIÓN — slot ya ocupado: si el slot mencionado aparece en "SLOTS YA REEMPLAZADOS HOY", NO uses reemplaza. Registra como comida adicional (sin reemplaza). El usuario está comiendo algo extra en ese horario, no reemplazando de nuevo.
  Solo omite reemplaza si el slot ya está ocupado, o si la comida es genuinamente extra sin horario de slot (ej: "me comí una fruta mientras trabajaba").

MODELO DE DATOS — CRÍTICO PARA ENTENDER LA APP:
  La app tiene DOS tipos de comidas registradas, son completamente independientes:
  1. comidas_reemplazo: comidas externas que REEMPLAZAN un slot del plan (reemplaza≠null). Máximo 1 por slot.
  2. comidas_adicionales: comidas extras SIN slot asignado (reemplaza=null). Puede haber INFINITAS — es normal y esperado.
  Ambas coexisten sin problemas. NUNCA sugieras eliminar una comida adicional porque "ya hay algo en ese slot".
  El campo comidas_adicionales en get_resumen_dia es la lista de extras; que tenga 3, 5 o 10 entradas es perfectamente válido.

- registrar_comida: para comidas en tiempo PASADO o confirmaciones de propuestas. Los valores válidos para reemplaza son: desayuno | snack_am | almuerzo | snack_pm | cena.
- eliminar_comida: cuando una comida fue registrada por error, no la comió, o quiere desmarcarla. NUNCA la uses para "hacer espacio" a otra comida — las comidas adicionales no tienen límite.

CAMBIAR UNA COMIDA DE REEMPLAZO A ADICIONAL — FLUJO OBLIGATORIO:
  Cuando el usuario dice "dejalo como adicional", "quítale el reemplazo", "no reemplaces nada", etc.:
  1. Llama eliminar_comida con el nombre de la comida
  2. Llama registrar_comida con los MISMOS macros pero SIN reemplaza
  NUNCA digas "Entendido, ya está" o "ya está registrado como adicional" sin haber llamado primero estas dos herramientas.
  Si no recuerdas los macros exactos de la comida, llama get_resumen_dia primero para verlos, y luego haz el delete + re-register.
- marcar_comida_plan: SOLO cuando el usuario confirme que comió EXACTAMENTE lo planificado en un slot. NUNCA la combines con registrar_comida para la misma comida.
- get_plan_semana: cuando pregunte qué tiene planificado, qué come esta semana o cualquier día específico.
- get_lista_compras: cuando pregunte qué necesita comprar, qué le falta, o qué hay en la lista.
- marcar_comprado: cuando diga que ya compró un ingrediente específico.
- marcar_en_despensa: cuando diga que ya tiene un ingrediente en casa.
- quitar_de_despensa: cuando diga que se le acabó algo o que necesita comprar un ingrediente que tenía.
- get_resumen_dia: cuando pregunte cómo va el día, cuántas calorías lleva o qué comidas tiene registradas. La respuesta incluye comidas_reemplazo (slots reemplazados), comidas_adicionales (extras sin límite — que haya varias es normal) y comidas_plan_comidas (slots del plan marcados como comidos). Úsala para mostrar el desglose individual. Pasar fecha para días anteriores.
- buscar_alimento: cuando pregunte los macros de un alimento específico.
- Si el usuario pide cambiar, sugerir o planificar comidas futuras, responde con texto solamente — NO llames a registrar_comida.
- Si no sabes los macros exactos al registrar, estímalos razonablemente y dilo.
- Puedes encadenar múltiples tool calls en un mismo turno si la solicitud lo requiere.
- NUNCA digas "registré" o "marqué" sin haber llamado efectivamente la herramienta en ese turno. Si el usuario confirma con "sí" o "dale" tras una propuesta de macros, llama la herramienta ANTES de confirmar. El total a reportar al usuario es SIEMPRE el campo "totalFecha" del tool result.

MODIFICACIÓN DE PERFIL Y PLAN — TOOLS aplicar_cambios_perfil y regenerar_plan_semanal:

REGLA ANTI-ALUCINACIÓN — INVIOLABLE:
Si en tu respuesta dices verbos de ejecución pasada como "regeneré", "modifiqué", "apliqué", "cambié", "actualicé", "guardé" o frases como "Listo", "Hecho", "Ya está" referidos a un cambio del plan/perfil — DEBES haber incluido un tool_use block de aplicar_cambios_perfil o regenerar_plan_semanal en ese MISMO turno. Sin tool_use, NO afirmes que lo hiciste. NO existe memoria de ejecución entre turnos: si en un turno anterior dijiste que ejecutaste algo, eso ya pasó (o no) y no afecta este turno. Si el usuario te pide ahora un cambio, llamalo ahora — no asumas que "ya lo hiciste antes".

CUÁNDO LLAMAR LA TOOL — INMEDIATO:
- Primer pedido de cambio: explica brevemente qué vas a hacer (1-2 oraciones), pedí confirmación, y llamá la tool cuando el usuario diga "sí" / "dale" / "confirmo" / "adelante" / "ok" / "hazlo".
- Comandos directos repetidos como "regenera el plan", "vuelve a regenerar", "hazlo de nuevo", "regenera para X kcal": LLAMÁ LA TOOL DIRECTO sin pedir confirmación adicional — el usuario ya está dando una orden clara, no preguntando. Después confirma con "Listo, regeneré..." (el tool_use ya estará en el turno).
- Cuando el usuario corrige diciendo "no se regeneró" o "el plan sigue igual": LLAMÁ LA TOOL DE INMEDIATO — no expliques, no preguntes, solo llamala.

TOPE SOFT DE CALORÍAS — RANGO SEGURO 1200–4000 KCAL/DÍA:
- Si el usuario pide calorias_objetivo < 1200 o > 4000, advierte explícitamente que es un rango atípico y potencialmente peligroso (déficit/superávit muy agresivo). Pregunta si está seguro y si lo está acompañando con un profesional.
- Si confirma con frases como "sé lo que estoy haciendo", "estoy seguro", "adelante igual" → recién entonces llama aplicar_cambios_perfil con confirmar_fuera_de_rango: true.
- Sin esa confirmación adicional, la tool devuelve error.

CUÁNDO USAR aplicar_cambios_perfil:
- Cambios de objetivo calórico, macros, peso, altura, edad, género, rutina (nivel_actividad), tipo de objetivo (pérdida/mantenimiento/volumen), peso/BF target, tasas.
- El plan semanal se regenera AUTOMÁTICAMENTE cuando el cambio afecta kcal/macros — NO necesitas pasar regenerar_plan: true (es el default).

NUTRIENT TIMING POR ENTRENO — el target diario es un PROMEDIO SEMANAL:
- El sistema aplica nutrient timing: días de entrenamiento ×1.05 kcal, días de descanso ×0.95 kcal (variación de ±5% sobre el promedio).
- Si el usuario fija calorias_objetivo = 1850, eso es el PROMEDIO semanal — los días individuales varían (entreno ~1943, descanso ~1758) pero el promedio es 1850.
- Cuando confirmes el cambio, aclará al usuario: "Voy a fijar tu objetivo en X kcal como PROMEDIO diario. Los días de entreno comerás un poco más (~X×1.05) y los de descanso un poco menos (~X×0.95) — esto es nutrient timing y ayuda al rendimiento."
- Si el usuario te dice "pero el lunes dice más kcal de lo esperado" → explicale el nutrient timing (±5%) en lugar de regenerar.

CUÁNDO USAR regenerar_plan_semanal:
- Cuando el usuario pida regenerar el plan/recetas SIN cambio de perfil ("vuelve a regenerar", "cambia las recetas", "dame otro plan"). Llamá la tool directo, sin pedir confirmación si es un comando claro.

FECHAS Y DÍAS ANTERIORES:
- La fecha de hoy es ${contexto?.fechaHoy || ''}. Cualquier mención a "ayer" = ${contexto?.ayer || ''}, "anteayer" = ${contexto?.anteayer || ''}.
- Si el usuario dice "ayer comí X", "el lunes tuve Y", "olvidé registrar el desayuno de ayer", etc. → usa registrar_comida con el campo fecha en YYYY-MM-DD correspondiente.
- Si dice "borra lo que registré ayer" o "quita el almuerzo de ayer" → eliminar_comida con fecha=ayer.
- Si dice "marqué como comido el almuerzo del lunes pero no lo comí" → eliminar_comida o marcar_comida_plan con fecha del lunes correspondiente.
- Para consultar qué llevaba un día anterior → get_resumen_dia con la fecha correcta.
- Calcula las fechas correctamente a partir de la fecha de hoy antes de llamar la herramienta.`;
}

// ── Cloud Function ──────────────────────────────────────────────────────────
exports.calibrateChat = onCall(
  {
    secrets:  [ANTHROPIC_KEY],
    region:   'us-central1',
    cors:     ['https://camilotorcido.github.io', 'http://localhost:5000', 'http://localhost:3000'],
    invoker:  'public'
  },
  async (request) => {
    try {
      if (!request.data || !Array.isArray(request.data.messages)) {
        throw new HttpsError('invalid-argument', 'messages[] requerido');
      }

      const { messages, contexto } = request.data;

      const mensajesLimpios = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-30)
        .map(m => ({
          role: m.role,
          content: Array.isArray(m.content)
            ? m.content
            : String(m.content).slice(0, 4000)
        }));

      if (mensajesLimpios.length === 0) {
        throw new HttpsError('invalid-argument', 'Sin mensajes válidos');
      }

      const apiKey = ANTHROPIC_KEY.value();
      if (!apiKey) {
        throw new HttpsError('internal', 'ANTHROPIC_API_KEY no configurada');
      }

      console.log('[calibrateChat] key:', apiKey.slice(0, 10), '| msgs:', mensajesLimpios.length);

      const response = await callAnthropic(apiKey, {
        model:      'claude-haiku-4-5',
        max_tokens: 1024,
        system:     buildSystemPrompt(contexto),
        tools:      TOOLS,
        messages:   mensajesLimpios
      });

      console.log('[calibrateChat] OK stop_reason:', response.stop_reason);

      return {
        id:          response.id,
        stop_reason: response.stop_reason,
        content:     response.content,
        usage:       response.usage
      };

    } catch (err) {
      if (err instanceof HttpsError) throw err;
      console.error('[calibrateChat] ERROR:', err.message);
      throw new HttpsError('internal', err.message || String(err));
    }
  }
);

// ── Cloud Function: análisis de comida por foto (Claude Vision) ─────────────
exports.calibrateAnalyzeFood = onCall(
  {
    secrets:  [ANTHROPIC_KEY],
    region:   'us-central1',
    cors:     ['https://camilotorcido.github.io', 'http://localhost:5000', 'http://localhost:3000'],
    invoker:  'public'
  },
  async (request) => {
    try {
      if (!request.data || !request.data.image) {
        throw new HttpsError('invalid-argument', 'image requerido');
      }
      const { image, mimeType = 'image/jpeg' } = request.data;
      const apiKey = ANTHROPIC_KEY.value();
      if (!apiKey) throw new HttpsError('internal', 'ANTHROPIC_API_KEY no configurada');

      const response = await callAnthropic(apiKey, {
        model:      'claude-haiku-4-5',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: image }
            },
            {
              type: 'text',
              text: `Analiza esta foto de comida y estima los valores nutricionales para la porción visible.\nDevuelve ÚNICAMENTE un objeto JSON válido (sin markdown, sin texto adicional) con este formato:\n{"nombre":"nombre del plato","porcion":"descripción de la porción, ej: 1 plato mediano ~350g","kcal":420,"proteinas_g":25,"carbohidratos_g":45,"grasas_g":12,"descripcion":"descripción breve","confianza":"alta"}\nEl campo confianza puede ser: "alta" (comida claramente visible), "media" (dudas parciales), "baja" (foto borrosa o poco clara).\nSi no detectas comida, devuelve: {"error":"No se detectó comida en la imagen"}`
            }
          ]
        }]
      });

      const textBlock = response.content && response.content.find(b => b.type === 'text');
      if (!textBlock) throw new HttpsError('internal', 'Sin respuesta de Claude');

      let result;
      try {
        const match = textBlock.text.match(/\{[\s\S]*\}/);
        result = JSON.parse(match ? match[0] : textBlock.text);
      } catch(e) {
        throw new HttpsError('internal', 'Respuesta no parseable: ' + textBlock.text.slice(0, 200));
      }

      if (result.error) throw new HttpsError('failed-precondition', result.error);

      console.log('[calibrateAnalyzeFood] OK:', result.nombre, '|', result.kcal, 'kcal | confianza:', result.confianza);
      return result;

    } catch (err) {
      if (err instanceof HttpsError) throw err;
      console.error('[calibrateAnalyzeFood] ERROR:', err.message);
      throw new HttpsError('internal', err.message || String(err));
    }
  }
);

// ── Cloud Function: transcripción de voz via Groq Whisper ───────────────────
exports.calibrateTranscribe = onCall(
  {
    secrets:  [GROQ_KEY],
    region:   'us-central1',
    cors:     ['https://camilotorcido.github.io', 'http://localhost:5000', 'http://localhost:3000'],
    invoker:  'public'
  },
  async (request) => {
    try {
      if (!request.data || !request.data.audio) {
        throw new HttpsError('invalid-argument', 'audio requerido');
      }
      const { audio, mimeType = 'audio/webm' } = request.data;
      const apiKey = GROQ_KEY.value();
      if (!apiKey) throw new HttpsError('internal', 'GROQ_API_KEY no configurada');

      const buffer = Buffer.from(audio, 'base64');

      // FormData nativo de Node 20 — no requiere paquetes extra
      const form = new FormData();
      form.append('file', new Blob([buffer], { type: mimeType }), 'audio.webm');
      form.append('model', 'whisper-large-v3-turbo');
      form.append('language', 'es');
      form.append('response_format', 'json');

      const resp = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: form
      });

      const data = await resp.json();
      console.log('[calibrateTranscribe] status:', resp.status, '| text:', (data.text || '').slice(0, 80));

      if (!resp.ok) {
        throw new HttpsError('internal', data?.error?.message || `Groq ${resp.status}`);
      }
      return { text: data.text || '' };

    } catch (err) {
      if (err instanceof HttpsError) throw err;
      console.error('[calibrateTranscribe] ERROR:', err.message);
      throw new HttpsError('internal', err.message || String(err));
    }
  }
);

// ============================================================================
// PUSH NOTIFICATIONS — VAPID-based web push
// Schema: users/{uid}/pushSubscriptions/{subId} { endpoint, keys, userAgent, createdAt }
// ============================================================================

function _setupWebPush() {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY.value());
}

// Hash simple para usar como subId estable basado en endpoint
function _hashEndpoint(endpoint) {
  let h = 0;
  for (let i = 0; i < endpoint.length; i++) {
    h = ((h << 5) - h + endpoint.charCodeAt(i)) | 0;
  }
  return 'sub_' + Math.abs(h).toString(36);
}

// ── pushSubscribe: cliente envía la subscripción para almacenar en Firestore ──
exports.pushSubscribe = onCall(
  {
    region: 'us-central1',
    cors: ['https://camilotorcido.github.io', 'http://localhost:5000', 'http://localhost:3000'],
    invoker: 'public'
  },
  async (request) => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'Requiere autenticación');
    }
    const uid = request.auth.uid;
    const sub = request.data && request.data.subscription;
    if (!sub || !sub.endpoint) {
      throw new HttpsError('invalid-argument', 'subscription.endpoint requerido');
    }
    const subId = _hashEndpoint(sub.endpoint);
    try {
      await admin.firestore()
        .collection('users').doc(uid)
        .collection('pushSubscriptions').doc(subId)
        .set({
          endpoint:  sub.endpoint,
          keys:      sub.keys || {},
          userAgent: request.data.userAgent || null,
          tz:        request.data.tz || 'America/Santiago',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      console.log('[pushSubscribe] uid:', uid, 'subId:', subId);
      return { ok: true, subId, vapidPublicKey: VAPID_PUBLIC_KEY };
    } catch (err) {
      console.error('[pushSubscribe] ERROR:', err.message);
      throw new HttpsError('internal', err.message);
    }
  }
);

// ── pushUnsubscribe ──
exports.pushUnsubscribe = onCall(
  {
    region: 'us-central1',
    cors: ['https://camilotorcido.github.io', 'http://localhost:5000', 'http://localhost:3000'],
    invoker: 'public'
  },
  async (request) => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'Requiere autenticación');
    }
    const uid = request.auth.uid;
    const endpoint = request.data && request.data.endpoint;
    if (!endpoint) throw new HttpsError('invalid-argument', 'endpoint requerido');
    const subId = _hashEndpoint(endpoint);
    try {
      await admin.firestore()
        .collection('users').doc(uid)
        .collection('pushSubscriptions').doc(subId)
        .delete();
      return { ok: true };
    } catch (err) {
      throw new HttpsError('internal', err.message);
    }
  }
);

// ── Helper: leer un key del cloud-storage de un usuario ──
async function _readUserData(uid, key) {
  try {
    const snap = await admin.firestore()
      .collection('users').doc(uid)
      .collection('data').doc(key)
      .get();
    if (!snap.exists) return null;
    const v = snap.data().v;
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch (_) { return v; }
    }
    return v;
  } catch (e) {
    return null;
  }
}

// ── Helper: enviar push a todas las subs de un usuario, limpiando endpoints stale ──
async function _sendPushToUser(uid, payload) {
  const subsSnap = await admin.firestore()
    .collection('users').doc(uid)
    .collection('pushSubscriptions').get();
  const promises = [];
  subsSnap.forEach((doc) => {
    const sub = doc.data();
    if (!sub.endpoint || !sub.keys) return;
    const pushSub = { endpoint: sub.endpoint, keys: sub.keys };
    promises.push(
      webpush.sendNotification(pushSub, JSON.stringify(payload), { TTL: 6 * 3600 })
        .catch(async (err) => {
          if (err.statusCode === 404 || err.statusCode === 410) {
            // Stale endpoint — limpiar
            await doc.ref.delete().catch(() => {});
            console.log('[push] subscription stale removida:', doc.id);
          } else {
            console.warn('[push] error enviando a', doc.id, err.statusCode || err.message);
          }
        })
    );
  });
  return Promise.all(promises);
}

// ── Helper: dia local del usuario en formato YYYY-MM-DD ──
function _localDateForTz(tz) {
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    return fmt.format(new Date());
  } catch (_) {
    return new Date().toISOString().slice(0, 10);
  }
}

// ── Helper: hora local (0-23) en una zona horaria ──
function _localHourForTz(tz) {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hour12: false });
    return parseInt(fmt.format(new Date()), 10);
  } catch (_) {
    return new Date().getHours();
  }
}

// ── Helper: incrementa un contador en admin/stats ──
async function _bumpStatsCounter(field, n) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    await admin.firestore()
      .collection('admin').doc('stats')
      .collection('daily').doc(today)
      .set({ [field]: admin.firestore.FieldValue.increment(n || 1) }, { merge: true });
  } catch (_) {}
}

// ── Helper: itera collection group de pushSubscriptions y agrupa por user ──
// Devuelve Map<uid, [subDocs]> filtrado por TZ que matcha la hora target
async function _activeSubsAtLocalHour(targetHour) {
  const subsSnap = await admin.firestore()
    .collectionGroup('pushSubscriptions').get();
  const byUser = new Map();
  subsSnap.forEach((doc) => {
    const data = doc.data();
    const tz = data.tz || 'America/Santiago';
    if (_localHourForTz(tz) !== targetHour) return;
    // El path del doc es users/{uid}/pushSubscriptions/{subId}
    const uid = doc.ref.parent.parent.id;
    if (!byUser.has(uid)) byUser.set(uid, []);
    byUser.get(uid).push({ ref: doc.ref, data });
  });
  return byUser;
}

// ── Scheduled: Cierre del día — corre cada hora, filtra subs cuya hora local sea 19 ──
exports.sendEveningPush = onSchedule(
  {
    schedule: '5 * * * *',
    timeZone: 'UTC',
    secrets: [VAPID_PRIVATE_KEY],
    region: 'us-central1'
  },
  async () => {
    _setupWebPush();
    const TARGET_HOUR = 19;
    const byUser = await _activeSubsAtLocalHour(TARGET_HOUR);
    if (byUser.size === 0) {
      console.log('[sendEveningPush] no subs en hora 19 local');
      return null;
    }
    let sent = 0;
    for (const [uid, subs] of byUser) {
      try {
        const adher  = await _readUserData(uid, 'nutriplan_adherencia') || {};
        const ratings = await _readUserData(uid, 'nutriplan_ratings') || {};
        const tz = subs[0].data.tz || 'America/Santiago';
        const fechaHoy = _localDateForTz(tz);
        const adhHoy = adher[fechaHoy] || {};
        let unrated = 0;
        Object.keys(adhHoy).forEach((slotKey) => {
          const e = adhHoy[slotKey];
          if (!e || !e.comido) return;
          const comidaId = e.id || e.recetaId;
          if (!comidaId) return;
          if ((ratings[comidaId] || 0) === 0) unrated++;
        });
        if (unrated === 0) continue;
        await _sendPushToUser(uid, {
          title: 'Cierre del día — Calibrate',
          body: '¿Cómo estuvieron tus ' + unrated + ' comidas de hoy? Toca para calificar.',
          tag:  'calibrate-evening-' + fechaHoy,
          icon: 'icons/icon.svg',
          url:  './',
          nav:  'hoy'
        });
        sent++;
      } catch (e) {
        console.warn('[sendEveningPush] uid:', uid, 'error:', e.message);
      }
    }
    if (sent > 0) await _bumpStatsCounter('evening_sent', sent);
    console.log('[sendEveningPush] sent:', sent, 'of', byUser.size);
    return null;
  }
);

// ── Scheduled: Meseta detectada — corre cada hora, filtra subs cuya hora local sea 8 ──
exports.sendPlateauPush = onSchedule(
  {
    schedule: '5 * * * *',
    timeZone: 'UTC',
    secrets: [VAPID_PRIVATE_KEY],
    region: 'us-central1'
  },
  async () => {
    _setupWebPush();
    const TARGET_HOUR = 8;
    const byUser = await _activeSubsAtLocalHour(TARGET_HOUR);
    if (byUser.size === 0) {
      console.log('[sendPlateauPush] no subs en hora 8 local');
      return null;
    }
    let sent = 0;
    for (const [uid, subs] of byUser) {
      try {
        const bc = await _readUserData(uid, 'nutriplan_body_comp') || [];
        if (!Array.isArray(bc) || bc.length < 14) continue;
        const sorted = bc.filter((e) => e && e.peso != null && e.fecha).sort((a, b) => a.fecha < b.fecha ? -1 : 1);
        if (sorted.length < 14) continue;
        const ultimos14 = sorted.slice(-14);
        const primero = ultimos14[0].peso;
        const ultimo  = ultimos14[ultimos14.length - 1].peso;
        const deltaSemanal = ((ultimo - primero) / 14) * 7;
        const enPlateau = Math.abs(deltaSemanal) < 0.25;
        const plateauState = await _readUserData(uid, 'nutriplan_plateau_state');
        const pasoActivo = plateauState && plateauState.pasoActual && plateauState.pasoActual > 0;
        if (!enPlateau || pasoActivo) continue;
        const tz = subs[0].data.tz || 'America/Santiago';
        const fechaHoy = _localDateForTz(tz);
        await _sendPushToUser(uid, {
          title: 'Meseta detectada — Calibrate',
          body:  'Tu peso no baja hace 14 días. Hay un protocolo de 6 pasos para romperla.',
          tag:   'calibrate-plateau-' + fechaHoy,
          icon:  'icons/icon.svg',
          url:   './',
          nav:   'progreso'
        });
        sent++;
      } catch (e) {
        console.warn('[sendPlateauPush] uid:', uid, 'error:', e.message);
      }
    }
    if (sent > 0) await _bumpStatsCounter('plateau_sent', sent);
    console.log('[sendPlateauPush] sent:', sent, 'of', byUser.size);
    return null;
  }
);

// ── Test push: dispara una notif inmediata al usuario que llama ──
exports.sendTestPush = onCall(
  {
    secrets: [VAPID_PRIVATE_KEY],
    region: 'us-central1',
    cors: ['https://camilotorcido.github.io', 'http://localhost:5000', 'http://localhost:3000'],
    invoker: 'public'
  },
  async (request) => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError('unauthenticated', 'Requiere autenticación');
    }
    _setupWebPush();
    const uid = request.auth.uid;
    const subsSnap = await admin.firestore()
      .collection('users').doc(uid)
      .collection('pushSubscriptions').get();
    if (subsSnap.empty) {
      throw new HttpsError('failed-precondition', 'Sin subscripciones activas');
    }
    await _sendPushToUser(uid, {
      title: 'Calibrate — Push de prueba',
      body:  'Si recibís esto, las notificaciones funcionan ✓',
      tag:   'calibrate-test-' + Date.now(),
      icon:  'icons/icon.svg',
      url:   './',
      nav:   null
    });
    await _bumpStatsCounter('test_push_sent');
    return { ok: true, count: subsSnap.size };
  }
);

// ── Admin metrics: solo emails whitelist pueden llamar ──
exports.getAdminMetrics = onCall(
  {
    region: 'us-central1',
    cors: ['https://camilotorcido.github.io', 'http://localhost:5000', 'http://localhost:3000'],
    invoker: 'public'
  },
  async (request) => {
    if (!request.auth || !request.auth.token) {
      throw new HttpsError('unauthenticated', 'Requiere autenticación');
    }
    const email = (request.auth.token.email || '').toLowerCase();
    if (!ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email)) {
      throw new HttpsError('permission-denied', 'No autorizado');
    }

    const db = admin.firestore();
    const errors = [];

    // 1. Push subs — todos los docs (total + uids únicos + tz distribution en una pasada)
    const usersWithSubs = new Set();
    const subsByUid = new Map();
    const tzDistribution = {};
    let totalSubs = 0;
    try {
      const subsSnap = await db.collectionGroup('pushSubscriptions').get();
      totalSubs = subsSnap.size;
      subsSnap.forEach((doc) => {
        const uid = doc.ref.parent.parent.id;
        usersWithSubs.add(uid);
        const data = doc.data();
        const tz = data.tz || 'unknown';
        tzDistribution[tz] = (tzDistribution[tz] || 0) + 1;
        const lastSubAt = data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : 0;
        const prev = subsByUid.get(uid);
        if (!prev || lastSubAt > prev.lastSubAt) {
          subsByUid.set(uid, { tz, userAgent: data.userAgent || null, lastSubAt });
        }
      });
    } catch (e) {
      errors.push('subs: ' + e.message);
    }

    // 2. Total Firestore "users" collection (proxy de cloud-sync activado)
    let totalUsersFirestore = 0;
    try {
      const usersSnap = await db.collection('users').select().get();
      totalUsersFirestore = usersSnap.size;
    } catch (e) {
      errors.push('users: ' + e.message);
    }

    // 3. Lista COMPLETA de Firebase Auth users (fuente de verdad de registros)
    const allAuthUsers = [];
    try {
      let nextPageToken = undefined;
      do {
        const list = await admin.auth().listUsers(1000, nextPageToken);
        list.users.forEach((u) => allAuthUsers.push(u));
        nextPageToken = list.pageToken;
      } while (nextPageToken && allAuthUsers.length < 5000);
    } catch (e) {
      errors.push('listUsers: ' + e.message);
    }

    // 4. Calcular registrados hoy / últimos 7 días (usando admin server time)
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const startOfToday = new Date(); startOfToday.setUTCHours(0, 0, 0, 0);
    const todayMs = startOfToday.getTime();

    let registeredToday = 0;
    let registeredLast7d = 0;
    let activeToday = 0;
    let activeLast7d = 0;

    // Pre-cargar lastSeenAt de Firestore (heartbeat client-side) para enriquecer last-active
    const lastSeenByUid = new Map();
    try {
      const profilesSnap = await db.collectionGroup('profile').get();
      profilesSnap.forEach((doc) => {
        if (doc.id !== 'meta') return;
        const uid = doc.ref.parent.parent.id;
        const data = doc.data();
        const ts = data.lastSeenAt && data.lastSeenAt.toMillis ? data.lastSeenAt.toMillis() : null;
        if (ts) lastSeenByUid.set(uid, ts);
      });
    } catch (e) {
      errors.push('lastSeen: ' + e.message);
    }

    const usersList = allAuthUsers.map((u) => {
      const sub = subsByUid.get(u.uid);
      const createdAt    = u.metadata && u.metadata.creationTime    ? new Date(u.metadata.creationTime).getTime()    : null;
      const lastSignIn   = u.metadata && u.metadata.lastSignInTime  ? new Date(u.metadata.lastSignInTime).getTime()  : null;
      const lastRefresh  = u.metadata && u.metadata.lastRefreshTime ? new Date(u.metadata.lastRefreshTime).getTime() : null;
      const lastSeen     = lastSeenByUid.get(u.uid) || null;
      // lastActiveAt: el más reciente entre heartbeat client-side, refresh de token y sign-in
      const lastActiveAt = Math.max(lastSeen || 0, lastRefresh || 0, lastSignIn || 0) || null;

      if (createdAt && createdAt >= todayMs) registeredToday++;
      if (createdAt && (now - createdAt) <= 7 * dayMs) registeredLast7d++;
      if (lastActiveAt && lastActiveAt >= todayMs) activeToday++;
      if (lastActiveAt && (now - lastActiveAt) <= 7 * dayMs) activeLast7d++;

      return {
        uid:         u.uid,
        email:       u.email || null,
        displayName: u.displayName || null,
        photoURL:    u.photoURL || null,
        provider:    (u.providerData && u.providerData[0] && u.providerData[0].providerId) || 'unknown',
        emailVerified: !!u.emailVerified,
        disabled:    !!u.disabled,
        createdAt,
        lastSignIn,
        lastActiveAt,
        hasPush:     !!sub,
        pushTz:      sub ? sub.tz : null,
        pushSince:   sub ? sub.lastSubAt : null
      };
    });

    // Ordenar: más recientes primero por createdAt
    usersList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // 5. Stats de los últimos 7 días
    const stats7d = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setUTCDate(d.getUTCDate() - i);
      const iso = d.toISOString().slice(0, 10);
      try {
        const sd = await db.collection('admin').doc('stats').collection('daily').doc(iso).get();
        const data = sd.exists ? sd.data() : {};
        stats7d.push({
          date: iso,
          evening_sent:   data.evening_sent || 0,
          plateau_sent:   data.plateau_sent || 0,
          test_push_sent: data.test_push_sent || 0
        });
      } catch (_) {
        stats7d.push({ date: iso, evening_sent: 0, plateau_sent: 0, test_push_sent: 0 });
      }
    }

    return {
      generatedAt: Date.now(),
      totals: {
        authUsers:         allAuthUsers.length,
        usersFirestore:    totalUsersFirestore,
        pushSubscriptions: totalSubs,
        usersWithPush:     usersWithSubs.size,
        registeredToday,
        registeredLast7d,
        activeToday,
        activeLast7d
      },
      tzDistribution,
      stats7d,
      users: usersList,
      errors: errors.length ? errors : undefined
    };
  }
);
