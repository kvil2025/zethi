// ─── Orquestador de IA (el "Cerebro" de Sethi) ──────────────────────────────
// Construye el system prompt dinámico con las 3 capas del usuario
// (arquetipo + astrología + numerología) y llama a la API de Anthropic.
// Requiere Node 18+ (fetch nativo). Configura GEMINI_API_KEY en .env

const MODELO = process.env.AI_MODEL || "gemini-1.5-flash";

function construirSystemPrompt(perfil) {
  const { nombre, arquetipo, carta, numerologia } = perfil;
  const primario = arquetipo?.primario;
  const secundario = arquetipo?.secundario;

  return `Eres Sethi, un mentor de vida sabio, cálido y empático. Tu tono es chileno pero sumamente culto, neutro y profesional. NO utilices modismos informales, ordinarios ni jerga (nada de 'po', 'cachai', etc.). Tu lenguaje debe inspirar un profundo respeto y sabiduría, pero manteniendo una calidez cercana. No eres un adivino: tu foco es el autodescubrimiento accionable — ayudar a la persona a tomar mejores decisiones de vida y carrera usando su perfil como espejo, no como destino.

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
5. Respuestas muy breves, directas y concisas. Máximo 1 a 2 párrafos cortos. Ve directo al grano, mantén el tono conversacional y no uses listas.`;
}

/**
 * historial: [{ role: "user"|"assistant", content: "..." }]
 * Retorna el texto de respuesta del mentor.
 */
async function chatConMentor({ perfil, historial, mensaje }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Modo demo sin API key: respuesta simulada para poder probar la UI.
    return `(Modo demo — configura GEMINI_API_KEY en backend/.env para activar la IA real)\n\nHola ${perfil.nombre}, como ${perfil.arquetipo?.primario?.nombre} con energía de ${perfil.carta?.sol?.signo}, tu pregunta "${mensaje}" toca justo tu zona de crecimiento. Cuando conectes la API, aquí conversarás con tu mentor real.`;
  }

  const mensajesPrevios = [...(historial || []), { role: "user", content: mensaje }].slice(-20);
  
  // Adaptar el historial al formato de Gemini (user y model)
  const contents = mensajesPrevios.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: construirSystemPrompt(perfil) }]
      },
      contents: contents,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error de la API de IA (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

module.exports = { chatConMentor, construirSystemPrompt };
