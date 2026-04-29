/* ============================================
   Calibrate — Cloud Function: proxy Claude API
   Endpoint: /calibrateChat  (Gen 2 HTTPS callable)
   invoker: allAuthenticatedUsers (Firebase Auth tokens son válidos)
   ============================================ */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret }       = require('firebase-functions/params');
const https                  = require('https');

const ANTHROPIC_KEY = defineSecret('ANTHROPIC_API_KEY');

// ── Herramientas ────────────────────────────────────────────────────────────
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

  const planTexto = Object.entries(plan).length > 0
    ? Object.entries(plan)
        .filter(([k]) => !k.startsWith('_'))
        .map(([tipo, receta]) => `  • ${tipo}: ${receta?.nombre || '—'}`)
        .join('\n')
    : '  (sin plan cargado)';

  return `Eres el asistente nutricional de Calibrate, una app de nutrición personalizada para chilenos.

USUARIO: ${perfil.nombre || 'Usuario'}
OBJETIVO: ${perfil.objetivo || 'mantenimiento'}

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
