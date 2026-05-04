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
        tipo:  { type: 'string', description: 'Slot del plan. Valores exactos: desayuno | snack_am | almuerzo | snack_pm | cena. Mapeo: desayuno → "desayuno", colación mañana → "snack_am", almuerzo → "almuerzo", once/merienda tarde → "snack_pm", cena → "cena".' },
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
  • Usuario propuso macros antes de confirmar, y ahora dice "sí", "dale", "ok", "correcto", "adelante", "confirma" → llama registrar_comida de inmediato con los macros de la propuesta anterior.
  • Usuario dice que siguió el plan en un slot específico → llama marcar_comida_plan de inmediato.

ELIGE UNA SOLA VÍA, NUNCA LAS DOS:
  • Comió EXACTAMENTE lo planificado → USA SOLO marcar_comida_plan. NO llames registrar_comida.
  • Comió algo DIFERENTE al plan pero corresponde a ese horario → USA SOLO registrar_comida CON reemplaza=slot. NO llames marcar_comida_plan.
  • Comió algo ADICIONAL sin relación con ningún slot → USA SOLO registrar_comida SIN reemplaza.
  NUNCA llames registrar_comida Y marcar_comida_plan para la misma comida — causaría doble conteo.

REGLA CRÍTICA — inferir reemplaza automáticamente:
  Si el usuario menciona el nombre de una comida principal al registrar, SIEMPRE asigna reemplaza:
  • "desayuné X", "de desayuno comí X", "en el desayuno tuve X" → reemplaza: "desayuno"
  • "almorcé X", "en el almuerzo comí X", "al almuerzo tuve X" → reemplaza: "almuerzo"
  • "en la once comí X", "en la merienda", "en el snack de la tarde" → reemplaza: "snack_pm"
  • "cené X", "en la cena comí X" → reemplaza: "cena"
  • "en la colación de la mañana", "snack de mañana" → reemplaza: "snack_am"
  El usuario NO necesita decir explícitamente "esto reemplaza mi desayuno" — basta con mencionar el tipo de comida.
  Solo omite reemplaza si la comida es genuinamente extra sin horario de slot (ej: "me comí una fruta mientras trabajaba").

- registrar_comida: para comidas en tiempo PASADO o confirmaciones de propuestas. Los valores válidos para reemplaza son: desayuno | snack_am | almuerzo | snack_pm | cena.
- eliminar_comida: cuando una comida fue registrada por error, no la comió, o quiere desmarcarla.
- marcar_comida_plan: SOLO cuando el usuario confirme que comió EXACTAMENTE lo planificado en un slot. NUNCA la combines con registrar_comida para la misma comida.
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
- NUNCA digas "registré" o "marqué" sin haber llamado efectivamente la herramienta en ese turno. Si el usuario confirma con "sí" o "dale" tras una propuesta de macros, llama la herramienta ANTES de confirmar. El total a reportar al usuario es SIEMPRE el campo "totalFecha" del tool result.

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
