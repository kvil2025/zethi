import { diaPersonal } from "./_lib/numerology.js";
import { signoSolar } from "./_lib/astrology.js";

export default function handler(req, res) {
  try {
    const { fechaNacimiento, nombre } = req.query;
    if (!fechaNacimiento) {
      return res.status(400).json({ error: "fechaNacimiento es requerida." });
    }

    const diaP = diaPersonal(fechaNacimiento);
    const sol = signoSolar(fechaNacimiento);

    res.status(200).json({
      ok: true,
      nombre: nombre || "Buscador",
      signoSolar: sol.signo,
      elemento: sol.elemento,
      diaPersonal: diaP,
      fechaHoy: new Date().toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    });
  } catch (e) {
    console.error("Error en clima diario:", e);
    res.status(500).json({ error: "No pudimos calcular tu clima diario." });
  }
}
