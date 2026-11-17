export default function handler(req, res) {
  res.status(404).json({ error: "Perfil no encontrado en servidor. Usa almacenamiento local." });
}
