// ─── Almacenamiento MVP en archivo JSON ─────────────────────────────────────
// Para producción, reemplaza este módulo por Supabase (PostgreSQL).
// La interfaz (getUsuario / guardarUsuario / agregarMensaje) se mantiene igual,
// así que la migración solo toca este archivo.

const fs = require("fs");
const path = require("path");

const RUTA = path.join(__dirname, "..", "data", "db.json");

function leer() {
  try {
    return JSON.parse(fs.readFileSync(RUTA, "utf8"));
  } catch {
    return { usuarios: {} };
  }
}

function escribir(db) {
  fs.mkdirSync(path.dirname(RUTA), { recursive: true });
  fs.writeFileSync(RUTA, JSON.stringify(db, null, 2));
}

function getUsuario(id) {
  return leer().usuarios[id] || null;
}

function guardarUsuario(id, datos) {
  const db = leer();
  db.usuarios[id] = { ...(db.usuarios[id] || {}), ...datos, id };
  escribir(db);
  return db.usuarios[id];
}

function agregarMensaje(id, rol, contenido) {
  const db = leer();
  const u = db.usuarios[id];
  if (!u) return null;
  u.historial = [...(u.historial || []), { role: rol, content: contenido }].slice(-50);
  escribir(db);
  return u.historial;
}

module.exports = { getUsuario, guardarUsuario, agregarMensaje };
