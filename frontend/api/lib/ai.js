// ─── Orquestador de IA (el "Cerebro" de Sethi con Google Gemini) ───────────
// Construye el system prompt dinámico con las 3 capas del usuario
// (arquetipo + astrología + numerología) y llama a la API de Google Gemini.

const MODELO = process.env.AI_MODEL || "gemini-2.5-flash";

export function construirSystemPrompt(perfil = {}) {
  const { nombre = "Buscador", arquetipo, carta, numerologia } = perfil;
  const primario = arquetipo?.primario;
  const secundario = arquetipo?.secundario;

  return `Eres Sethi, un mentor de vida sabio, cálido y empático. Tu tono es chileno pero sumamente culto, neutro y profesional. NO utilices modismos informales, ordinarios ni jerga (nada de 'po', 'cachai', etc.). Tu lenguaje debe inspirar un profundo respeto y sabiduría, pero manteniendo una calidez cercana. No eres un adivino: tu foco es el autodescubrimiento accionable — ayudar a la persona a tomar mejores decisiones de vida y carrera usando su perfil como espejo, no como destino.

PERFIL DE LA PERSONA CON LA QUE HABLAS:
- Nombre: ${nombre}
- Arquetipo primario: ${primario?.nombre || "Explorador"} (${primario?.porcentaje || 50}%) — don: ${primario?.don || "Autonomía"}. Lema: "${primario?.lema || ""}"
- Arquetipo secundario: ${secundario?.nombre || "Sabio"} (${secundario?.porcentaje || 30}%) — don: ${secundario?.don || "Claridad"}
- Signo solar: ${carta?.sol?.signo || "Aries"} (elemento ${carta?.sol?.elemento || "Fuego"}, regente ${carta?.sol?.regente || "Marte"})
- Camino de vida: ${numerologia?.caminoDeVida?.numero || "1"} — ${numerologia?.caminoDeVida?.significado || ""}
- Número de destino: ${numerologia?.destino?.numero || "1"} — ${numerologia?.destino?.significado || ""}
- Año personal ${new Date().getFullYear()}: ${numerologia?.anioPersonal?.numero || "1"} — ${numerologia?.anioPersonal?.significado || ""}

REGLAS:
1. Adapta cada consejo al arquetipo primario (sus fortalezas y sus sombras típicas) y matízalo con el secundario.
2. Usa la astrología y numerología como lenguaje simbólico de reflexión, nunca como predicción determinista.
3. Da siempre al menos una acción concreta y pequeña que la persona pueda hacer esta semana.
4. Si detectas señales de angustia seria o crisis, recomienda con cariño buscar apoyo profesional.
5. Respuestas muy breves, directas y concisas. Máximo 1 a 2 párrafos cortos. Ve directo al grano, mantén el tono conversacional y no uses listas.`;
}

/**
 * Chat con el mentor utilizando Google Gemini API
 */
export async function chatConMentor({ perfil, historial = [], mensaje }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return `Hola ${perfil?.nombre || ""}. Soy Sethi, tu mentor cósmico. Tu pregunta "${mensaje}" toca justo tu zona de autodescubrimiento como ${perfil?.arquetipo?.primario?.nombre || "arquetipo activo"}. Para activar respuestas en tiempo real con Gemini, configura tu GEMINI_API_KEY en las variables de entorno de Vercel. ✦`;
  }

  // Filtrar y preparar mensajes asegurando que Gemini comience con 'user'
  const todos = [...(historial || []), { role: "user", content: mensaje }].slice(-20);
  
  // Limpiar mensajes iniciales del asistente para que el primer mensaje sea siempre 'user'
  let indicePrimerUser = todos.findIndex((m) => m.role === "user");
  const listaValida = indicePrimerUser >= 0 ? todos.slice(indicePrimerUser) : [{ role: "user", content: mensaje }];

  const contents = listaValida.map((m) => ({
    role: m.role === "assistant" || m.role === "model" ? "model" : "user",
    parts: [{ text: m.content || "" }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: construirSystemPrompt(perfil) }],
        },
        contents: contents,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error de la API de IA (${res.status}): ${err}`);
  }

  const data = await res.json();
  const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return respuesta || "Sethi está reflexionando en silencio cósmico. Intenta preguntarme de nuevo en un momento.";
}
