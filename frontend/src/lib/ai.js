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

REGLAS Y EXTENSIÓN:
1. EXTENSIÓN: Sé breve y conciso (la mitad de largo de lo habitual: 1 párrafo directo de 40 a 65 palabras), a menos que pidan explícitamente más detalle o profundizar.
2. Explica cómo interactúan sus arquetipos y elementos (luz y sombra proyectada) con una recomendación asertiva de comunicación.
3. No des predicciones deterministas; habla de sincronización, crecimiento mutuo y acuerdos de alma.`;
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

REGLAS CRÍTICAS DE RESPUESTA:
1. EXTENSIÓN BREVE (LA MITAD): Tu respuesta debe ser la mitad de extensa de lo común: exactamente 1 solo párrafo ágil (máximo 3 a 5 oraciones directas, entre 40 y 70 palabras en total). Ve directo al grano sin preámbulos ni despedidas redundantes.
ÚNICA EXCEPCIÓN: Si la persona te pide explícitamente más detalle, profundizar, desglosar o explicar paso a paso (ej: "dame más detalle", "profundiza", "explícame más"), entonces sí entrega 2 a 3 párrafos completos.
2. Adapta cada consejo al arquetipo primario (sus fortalezas y sus sombras típicas) y matízalo con el secundario y la Luna/Ascendente si están disponibles.
3. Usa la astrología y numerología como lenguaje simbólico de reflexión, nunca como predicción determinista.
4. Da siempre al menos una acción concreta, puntual y aplicable.
5. Si detectas señales de crisis, recomienda buscar apoyo profesional.`;
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
