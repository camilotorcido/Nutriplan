/* ============================================
   Calibrate — Cloud Function: proxy Claude API
   Endpoint: /calibrateChat  (Gen 2 HTTPS callable)
   invoker: allAuthenticatedUsers (Firebase Auth tokens son válidos)
   ============================================ */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret }       = require('firebase-functions/params');
const https                  = require('https');

const ANTHROPIC_KEY = defineSecret('ANTHROPIC_API_KEY');
const GROQ_KEY      = defineSecret('GROQ_API_KEY');

// ── Herramientas ────────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'planear_comida',
    description: 'Agrega una comida al plan del día como PENDIENTE (no consumida aún). Úsala cuando el usuario diga que PLANEA comer algo más tarde ("voy a tomar", "voy a comer", "lo tomaré después", "lo voy a comer"). La comida aparece en pantalla pero NO se cuenta en los macros hasta que el usuario la confirme como comida.',
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
    description: 'Registra una comida que el usuario YA comió. SOLO úsala cuando el usuario use tiempo pasado ("comí", "me comí", "almorcé", "tomé"). NUNCA la uses para comidas futuras, planificación, cambios de menú ni sugerencias. Puede registrar en días anteriores especificando fecha.',
    input_schema: {
      type: 'object',
      properties: {
        nombre:          { type: 'string',  description: 'Nombre descriptivo de la comida' },
        kcal:            { type: 'number',  description: 'Calorías totales' },
        proteinas_g:     { type: 'number',  description: 'Proteínas en gramos' },
        carbohidratos_g: { type: 'number',  description: 'Carbohidratos en gramos' },
        grasas_g:        { type: 'number',  description: 'Grasas en gramos' },
        reemplaza:       { type: 'string',  description: 'Slot del plan que reemplaza: desayuno | almuerzo | once | cena | colacion. Null si es comida adicional.' },
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
    description: 'Devuelve el resumen de macros consumidos vs objetivo para una fecha, incluyendo el listado detallado de cada comida registrada. La respuesta incluye: consumido (totales kcal/proteínas/carbos/grasas), objetivo, comidas_externas (array con id/nombre/kcal de cada comida registrada manualmente) y comidas_plan_comidas (array con slot/nombre/kcal de los slots del plan marcados como comidos). Sin fecha devuelve hoy; con fecha devuelve ese día específico.',
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
        tipo:  { type: 'string', description: 'Slot del plan: desayuno | almuerzo | once | cena | colacion' },
        fecha: { type: 'string', description: 'Fecha exacta YYYY-MM-DD. Usar cuando el usuario mencione un día anterior. Si se omite, se infiere del día de la semana más reciente.' }
      },
      required: ['dia', 'tipo']
    }
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

  return `Eres el asistente nutricional de Calibrate, una app de nutrición personalizada.

USUARIO: ${perfil.nombre || 'Usuario'}
OBJETIVO: ${perfil.objetivo || 'mantenimiento'}
DÍA Y FECHA HOY: ${contexto?.diaActual || ''} ${contexto?.fechaHoy || ''}

PLAN DE HOY (${contexto?.diaActual || ''}):
${planTexto}

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
  (Nota: tras cada registrar_comida o eliminar_comida, el tool result devuelve "totalHoy" con el total actualizado — úsalo para el mensaje de confirmación.)

INSTRUCCIONES:
- Responde en español latinoamericano neutro — sin chilenismos, sin voseo (di "llevas", nunca "llevai"), sin "po", sin regionalismos de ningún país. Tono cercano y profesional.
- Si el usuario escribe en inglés, responde en inglés.
- Sé breve: máximo 3–4 oraciones por respuesta salvo que te pidan más detalle.
- No inventes datos del usuario que no estén en el contexto.
- Si el usuario pregunta por el plan del día, lee los datos de contexto.

USO DE HERRAMIENTAS — REGLAS ESTRICTAS:
- registrar_comida: SOLO cuando el usuario use tiempo PASADO ("comí", "me comí", "almorcé", "tomé"). NUNCA para comidas futuras ni sugerencias. Si el usuario ya registró la comida y ahora dice que reemplaza un slot del plan (ej: "eso fue mi almuerzo"), llama registrar_comida UNA SOLA VEZ con reemplaza=slot. No vuelvas a registrar la misma comida; el sistema actualiza la entrada existente automáticamente.
- eliminar_comida: cuando una comida fue registrada por error, no la comió, o quiere desmarcarla.
- marcar_comida_plan: cuando el usuario confirme que siguió el plan y comió lo planificado (usa tiempo pasado y menciona el slot del plan).
- get_plan_semana: cuando pregunte qué tiene planificado, qué come esta semana o cualquier día específico.
- get_lista_compras: cuando pregunte qué necesita comprar, qué le falta, o qué hay en la lista.
- marcar_comprado: cuando diga que ya compró un ingrediente específico.
- marcar_en_despensa: cuando diga que ya tiene un ingrediente en casa.
- quitar_de_despensa: cuando diga que se le acabó algo o que necesita comprar un ingrediente que tenía.
- get_resumen_dia: cuando pregunte cómo va el día, cuántas calorías lleva, qué comidas tiene registradas, o pida listar lo que comió en un día. La respuesta incluye comidas_externas (cada comida registrada manualmente con nombre y kcal) y comidas_plan_comidas (slots del plan marcados como comidos). Úsala para mostrar el desglose individual cuando el usuario pida "lista mis comidas de ayer" o similar. Pasar fecha para días anteriores.
- buscar_alimento: cuando pregunte los macros de un alimento específico.
- Si el usuario pide cambiar, sugerir o planificar comidas futuras, responde con texto solamente — NO llames a registrar_comida.
- Si no sabes los macros exactos al registrar, estímalos razonablemente y dilo.
- Puedes encadenar múltiples tool calls en un mismo turno si la solicitud lo requiere.

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
