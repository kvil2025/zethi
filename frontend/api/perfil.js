import handler from "./perfil/[id].js";

export default function rootPerfilHandler(req, res) {
  req.query = req.query || {};
  req.query.id = req.query.id || "cristian";
  return handler(req, res);
}
