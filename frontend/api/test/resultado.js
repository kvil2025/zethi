import { calcularArquetipo } from "../lib/archetypes.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { respuestas } = req.body || {};
    if (!Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ error: "Envía respuestas: [{preguntaId, opcionIndex}]." });
    }

    const arquetipo = calcularArquetipo(respuestas);
    res.status(200).json({ arquetipo });
  } catch (e) {
    console.error("Error al calcular arquetipo:", e);
    res.status(500).json({ error: "No pudimos calcular tu arquetipo." });
  }
}
