import { chatConMentor } from "./lib/ai.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { usuario, sinastria, mensaje, historial } = req.body || {};
    if (!mensaje?.trim()) {
      return res.status(400).json({ error: "El mensaje está vacío." });
    }

    const respuesta = await chatConMentor({
      perfil: usuario || {},
      sinastria: sinastria || null,
      historial: historial || [],
      mensaje: mensaje.trim(),
    });

    res.status(200).json({
      respuesta,
      mensajesRestantesHoy: 20,
    });
  } catch (e) {
    console.error("Error en chat mentor:", e);
    res.status(500).json({
      error: "El mentor cósmico no pudo responder en este instante. Intenta en un momento.",
    });
  }
}
