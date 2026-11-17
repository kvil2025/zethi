// ─── Orquestador de IA (el "Cerebro" de Sethi con Google Gemini) ───────────
// Soporta: Mentoría Personal + Sinastría de Relaciones (Parejas, Socios, Vínculos).

const MODELO = process.env.AI_MODEL || "gemini-3.1-flash-lite";

export function construirSystemPrompt(perfil = {}, sinastria = null) {
  const { nombre = "Buscador", arquetipo, carta, numerologia } = perfil;
  const primario = arquetipo?.primario;
  const secundario = arquetipo?.secundario;

  if (sinastria) {
    const { persona2, tipoRelacion = "pareja", sinergia } = sinastria;
    return `Eres Sethi, un mentor cósmico y consejero relacional de alta sabiduría, cálido, empático, culto y profesional (tono chileno/latinoamericano neutro y refinado, sin jerga ni modismos vulgares).
Estás analizando la SINASTRÍA y compatibilidad energética entre dos personas:
1. ${nombre} (${primario?.nombre || "Explorador"}, Sol en ${carta?.sol?.signo || "Aries"}, Camino ${numerologia?.caminoDeVida?.numero || 1})
2. ${persona2?.nombre || "La otra persona"} (${persona2?.arquetipo || "Complemento"}, Sol en ${persona2?.signo || "Libra"}, Camino ${persona2?.camino || 2})
Tipo de vínculo: ${tipoRelacion.toUpperCase()}
Sinergia estimada: ${sinergia?.porcentajeGlobal || 88}% — ${sinergia?.tituloVínculo || "Danza de Espejos"}

REGLAS DE RELACIONES:
1. Explica cómo interactúan sus dos arquetipos y elementos (puntos de luz y dónde pueden chocar o proyectarse sombras).
2. Da herramientas de comunicación concreta y asertiva para este vínculo específico.
3. No des predicciones fatales ni sentencias deterministas; habla de sincronización, crecimiento mutuo y acuerdos de alma.
4. Mantén respuestas de 2 a 3 párrafos concisos, profundos y conversacionales.`;
  }

  const lunaStr = carta?.luna?.signo ? `\n- Signo lunar (mundo emocional): ${carta.luna.signo} (elemento ${carta.luna.elemento})` : "";
  const ascStr = carta?.ascendente?.signo ? `\n- Ascendente (máscara y propósito exterior): ${carta.ascendente.signo}` : "";
  const diaStr = numerologia?.diaPersonal?.numero ? `\n- Día personal hoy: ${numerologia.diaPersonal.numero} (${numerologia.diaPersonal.foco})` : "";

  return `Eres Sethi, un mentor de vida sabio, cálido y empático. Tu tono es chileno pero sumamente culto, neutro y profesional. NO utilices modismos informales, ordinarios ni jerga (nada de 'po', 'cachai', etc.). Tu lenguaje debe inspirar un profundo respeto y sabiduría, pero manteniendo una calidez cercana. No eres un adivino: tu foco es el autodescubrimiento accionable — ayudar a la persona a tomar mejores decisiones de vida y carrera usando su perfil como espejo, no como destino.

PERFIL DE LA PERSONA CON LA QUE HABLAS:
- Nombre: ${nombre}
- Arquetipo primario: ${primario?.nombre || "Explorador"} (${primario?.porcentaje || 50}%) — don: ${primario?.don || "Autonomía"}. Lema: "${primario?.lema || ""}"
- Arquetipo secundario: ${secundario?.nombre || "Sabio"} (${secundario?.porcentaje || 30}%) — don: ${secundario?.don || "Claridad"}
- Signo solar: ${carta?.sol?.signo || "Aries"} (elemento ${carta?.sol?.elemento || "Fuego"}, regente ${carta?.sol?.regente || "Marte"})${lunaStr}${ascStr}
- Camino de vida: ${numerologia?.caminoDeVida?.numero || "1"} — ${numerologia?.caminoDeVida?.significado || ""}
- Número de destino: ${numerologia?.destino?.numero || "1"} — ${numerologia?.destino?.significado || ""}
- Año personal ${new Date().getFullYear()}: ${numerologia?.anioPersonal?.numero || "1"} — ${numerologia?.anioPersonal?.significado || ""}${diaStr}

REGLAS:
1. Adapta cada consejo al arquetipo primario (sus fortalezas y sus sombras típicas) y matízalo con el secundario y la Luna/Ascendente si están disponibles.
2. Usa la astrología y numerología como lenguaje simbólico de reflexión, nunca como predicción determinista.
3. Da siempre al menos una acción concreta y pequeña que la persona pueda hacer esta semana.
4. Si detectas señales de angustia seria o crisis, recomienda con cariño buscar apoyo profesional.
5. Respuestas muy breves, directas y concisas. Máximo 1 a 2 párrafos cortos. Ve directo al grano, mantén el tono conversacional y no uses listas.`;
}

/**
 * Chat con el mentor utilizando Google Gemini API
 */
export async function chatConMentor({ perfil, sinastria = null, historial = [], mensaje }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return `Hola ${perfil?.nombre || ""}. Soy Sethi, tu mentor cósmico. Tu pregunta "${mensaje}" toca justo tu zona de autodescubrimiento. Para activar respuestas en tiempo real con Gemini, configura tu GEMINI_API_KEY en Vercel. ✦`;
  }

  const todos = [...(historial || []), { role: "user", content: mensaje }].slice(-20);
  
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: construirSystemPrompt(perfil, sinastria) }],
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
