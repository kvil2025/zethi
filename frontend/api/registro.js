import crypto from "crypto";
import { perfilNumerologico } from "./_lib/numerology.js";
import { cartaNatal } from "./_lib/astrology.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { nombreCompleto, fechaNacimiento, horaNacimiento, lugar } = req.body || {};
    if (!nombreCompleto || !fechaNacimiento) {
      return res.status(400).json({ error: "Faltan nombreCompleto o fechaNacimiento (YYYY-MM-DD)." });
    }

    const id = crypto.randomUUID();
    const numerologia = perfilNumerologico({ nombreCompleto, fechaNacimiento });
    const carta = cartaNatal({ fechaNacimiento, horaNacimiento, lugar });

    const usuario = {
      id,
      nombre: nombreCompleto.trim().split(" ")[0],
      nombreCompleto: nombreCompleto.trim(),
      fechaNacimiento,
      numerologia,
      carta,
      historial: [],
    };

    res.status(200).json({ id, usuario });
  } catch (e) {
    console.error("Error en registro:", e);
    res.status(500).json({ error: "No pudimos calcular tu perfil inicial." });
  }
}
