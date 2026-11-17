import { TEST } from "./_lib/archetypes.js";

export default function handler(req, res) {
  const preguntas = TEST.map((p) => ({
    id: p.id,
    pregunta: p.pregunta,
    opciones: p.opciones.map((o) => o.texto),
  }));
  res.status(200).json({ preguntas });
}
