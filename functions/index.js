/* ============================================
   Calibrate — Cloud Function: proxy Claude API
   Endpoint: /calibrateChat (HTTPS callable)
   ============================================ */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret }       = require('firebase-functions/params');
const Anthropic              = require('@anthropic-ai/sdk');

// La API key vive en Secret Manager — nunca en el código
const ANTHROPIC_KEY = defineSecret('ANTHROPIC_API_KEY');

// ── Herramientas que el agente puede ejecutar en el front ──────────────────
const TOOLS = [
  {
    name: 'registrar_comida',
    description: 'Registra una comida externa en el log del día. Úsala cuando el usuario diga que comió algo.',
    input_schema: {
      type: 'object',
      properties: {
        nombre:          { type: 'string',  description: 'Nombre descriptivo de la comida' },
        kcal:            { type: 'number',  description: 'Calorías totales' },
        proteinas_g:     { type: 'number',  description: 'Proteínas en gramos' },
        carbohidratos_g: { type: 'number',  description: 'Carbohidratos en gramos' },
        grasas_g:        { type: 'number',  description: 'Grasas en gramos' },
        reemplaza:       { type: 'string',  description: 'Slot del plan que reemplaza: desayuno | almuerzo | once | cena | colacion. Null si es comida adicional.' }
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
    description: 'Devuelve el resumen de macros consumidos vs objetivo del día actual.',
    input_schema: { type: 'object', properties: {} }
  }
];

// ── System prompt ──────────────────────────────────────────────────────────
function buildSystemPrompt(contexto) {
  const perfil = contexto?.perfil || {};
  const macros = contexto?.macrosObjetivo || {};
  const plan   = contexto?.planHoy || {};
  const consumido = contexto?.macrosConsumidos || {};

  const nombreUsuario = perfil.nombre || 'Usuario';
  const objetivo = perfil.objetivo || 'mantenimiento';

  const planTexto = Object.entries(plan).length > 0
    ? Object.entries(plan)
        .filter(([k]) => !k.startsWith('_'))
        .map(([tipo, receta]) => `  • ${tipo}: ${receta?.nombre || '—'}`)
        .join('\n')
    : '  (sin plan cargado)';

  return `Eres el asistente nutricional de Calibrate, una app de nutrición personalizada para chilenos.

USUARIO: ${nombreUsuario}
OBJETIVO: ${objetivo}

PLAN DE HOY:
${planTexto}

MACROS OBJETIVO HOY:
  • Calorías:      ${macros.kcal || '—'} kcal
  • Proteínas:     ${macros.proteinas || '—'} g
  • Carbohidratos: ${macros.carbohidratos || '—'} g
  • Grasas:        ${macros.grasas || '—'} g

MACROS CONSUMIDOS HASTA AHORA:
  • Calorías:      ${consumido.kcal || 0} kcal
  • Proteínas:     ${consumido.proteinas || 0} g
  • Carbohidratos: ${consumido.carbohidratos || 0} g
  • Grasas:        ${consumido.grasas || 0} g

INSTRUCCIONES:
- Habla en español chileno, de forma cercana pero profesional.
- Cuando el usuario mencione que comió algo, llama a registrar_comida con los macros estimados.
- Si no sabes los macros exactos, estímalos razonablemente y dilo.
- Sé breve: máximo 3–4 oraciones por respuesta salvo que te pidan más detalle.
- No inventes datos del usuario que no estén en el contexto.
- Si el usuario pregunta por el plan del día, lee los datos de contexto.`;
}

// ── Cloud Function ─────────────────────────────────────────────────────────
exports.calibrateChat = onCall(
  { secrets: [ANTHROPIC_KEY], region: 'us-central1', cors: true, invoker: 'public' },
  async (request) => {
    // Validación básica
    if (!request.data || !Array.isArray(request.data.messages)) {
      throw new HttpsError('invalid-argument', 'messages[] requerido');
    }

    const { messages, contexto } = request.data;

    // Sanitizar mensajes (solo roles válidos, sin campos extra)
    // content puede ser string (texto normal) o array (tool_use / tool_result blocks)
    const mensajesLimpios = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-30) // máx 30 para incluir rondas de tool_use
      .map(m => ({
        role: m.role,
        content: Array.isArray(m.content)
          ? m.content   // bloques tool_use / tool_result — pasarlos tal cual
          : String(m.content).slice(0, 4000)
      }));

    if (mensajesLimpios.length === 0) {
      throw new HttpsError('invalid-argument', 'Sin mensajes válidos');
    }

    const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY.value() });

    const response = await anthropic.messages.create({
      model:      'claude-opus-4-5',
      max_tokens: 1024,
      system:     buildSystemPrompt(contexto),
      tools:      TOOLS,
      messages:   mensajesLimpios
    });

    // Devolver todo el response al front para que maneje tool_use
    return {
      id:           response.id,
      stop_reason:  response.stop_reason,
      content:      response.content,   // array de blocks (text | tool_use)
      usage:        response.usage
    };
  }
);
