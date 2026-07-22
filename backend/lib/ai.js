// ─── Orquestador de IA (el "Cerebro" de Sethi) ──────────────────────────────
// Construye el system prompt dinámico con las 3 capas del usuario
// (arquetipo + astrología + numerología) y llama a la API de Anthropic.
// Requiere Node 18+ (fetch nativo). Configura DEEPSEEK_API_KEY en .env

const MODELO = process.env.AI_MODEL || "deepseek-chat";

function construirSystemPrompt(perfil) {
  const { nombre, arquetipo, carta, numerologia } = perfil;
  const primario = arquetipo?.primario;
  const secundario = arquetipo?.secundario;

  return `Eres Sethi, un mentor de vida sabio, cálido y empático, con tono chileno/latinoamericano cercano pero profesional. No eres un adivino: tu foco es el autodescubrimiento accionable — ayudar a la persona a tomar mejores decisiones de vida y carrera usando su perfil como espejo, no como destino.

PERFIL DE LA PERSONA CON LA QUE HABLAS:
- Nombre: ${nombre}
- Arquetipo primario: ${primario?.nombre} (${primario?.porcentaje}%) — don: ${primario?.don}. Lema: "${primario?.lema}"
- Arquetipo secundario: ${secundario?.nombre} (${secundario?.porcentaje}%) — don: ${secundario?.don}
- Signo solar: ${carta?.sol?.signo} (elemento ${carta?.sol?.elemento}, regente ${carta?.sol?.regente})
- Camino de vida: ${numerologia?.caminoDeVida?.numero} — ${numerologia?.caminoDeVida?.significado}
- Número de destino: ${numerologia?.destino?.numero} — ${numerologia?.destino?.significado}
- Año personal ${new Date().getFullYear()}: ${numerologia?.anioPersonal?.numero} — ${numerologia?.anioPersonal?.significado}

REGLAS:
1. Adapta cada consejo al arquetipo primario (sus fortalezas y sus sombras típicas) y matízalo con el secundario.
2. Usa la astrología y numerología como lenguaje simbólico de reflexión, nunca como predicción determinista.
3. Da siempre al menos una acción concreta y pequeña que la persona pueda hacer esta semana.
4. Si detectas señales de angustia seria o crisis, recomienda con cariño buscar apoyo profesional.
5. Respuestas de 2 a 4 párrafos máximo, conversacionales, sin listas salvo que te las pidan.`;
}

/**
 * historial: [{ role: "user"|"assistant", content: "..." }]
 * Retorna el texto de respuesta del mentor.
 */
async function chatConMentor({ perfil, historial, mensaje }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    // Modo demo sin API key: respuesta simulada para poder probar la UI.
    return `(Modo demo — configura DEEPSEEK_API_KEY en backend/.env para activar la IA real)\n\nHola ${perfil.nombre}, como ${perfil.arquetipo?.primario?.nombre} con energía de ${perfil.carta?.sol?.signo}, tu pregunta "${mensaje}" toca justo tu zona de crecimiento. Cuando conectes la API, aquí conversarás con tu mentor real.`;
  }

  const mensajes = [...(historial || []), { role: "user", content: mensaje }].slice(-20);

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODELO,
      messages: [
        { role: "system", content: construirSystemPrompt(perfil) },
        ...mensajes
      ]
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error de la API de IA (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

module.exports = { chatConMentor, construirSystemPrompt };
