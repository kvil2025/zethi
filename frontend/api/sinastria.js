import { analizarSinastria } from "./lib/sinastria.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { persona1, persona2, tipo } = req.body || {};
    if (!persona1 || !persona2 || !persona2.nombre || !persona2.fechaNacimiento) {
      return res.status(400).json({ error: "Faltan los datos de la segunda persona (nombre y fecha de nacimiento)." });
    }

    const resultado = analizarSinastria({
      persona1,
      persona2,
      tipo: tipo || "pareja",
    });

    res.status(200).json(resultado);
  } catch (e) {
    console.error("Error en sinastria:", e);
    res.status(500).json({ error: "No pudimos calcular la sinastría cósmica." });
  }
}
