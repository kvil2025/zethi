// ─── Almacenamiento en Supabase (producción) ────────────────────────────────
// Misma interfaz que store.js (getUsuario / guardarUsuario / agregarMensaje).
// Se activa con STORAGE=supabase en .env. Requiere haber creado la tabla con
// el archivo supabase/schema.sql (ver la guía de despliegue).

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // clave "service_role": solo vive en el servidor
);

async function getUsuario(id) {
  const { data, error } = await supabase.from("usuarios").select("*").eq("id", id).single();
  if (error || !data) return null;
  return { id: data.id, ...data.perfil, historial: data.historial || [] };
}

async function guardarUsuario(id, datos) {
  const existente = await getUsuario(id);
  const { historial, ...restoNuevo } = datos;
  const { historial: histPrevio, id: _omit, ...restoPrevio } = existente || {};
  const perfil = { ...restoPrevio, ...restoNuevo };
  const hist = historial ?? histPrevio ?? [];
  const { error } = await supabase
    .from("usuarios")
    .upsert({ id, perfil, historial: hist, actualizado: new Date().toISOString() });
  if (error) throw new Error(`Supabase: ${error.message}`);
  return { id, ...perfil, historial: hist };
}

async function agregarMensaje(id, rol, contenido) {
  const u = await getUsuario(id);
  if (!u) return null;
  const historial = [...(u.historial || []), { role: rol, content: contenido }].slice(-50);
  await guardarUsuario(id, { historial });
  return historial;
}

module.exports = { getUsuario, guardarUsuario, agregarMensaje };
