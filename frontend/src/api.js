// Cliente de la API de Sethi.
// Desarrollo: Vite hace proxy de /api al backend local.
// Producción: define VITE_API_URL en Vercel (ej: https://sethi-api.up.railway.app)
const BASE = (import.meta.env.VITE_API_URL || "") + "/api";

async function pedir(ruta, opciones = {}) {
  const res = await fetch(`${BASE}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Algo salió mal. Intenta de nuevo.");
  return data;
}

export const api = {
  registrar: (datos) => pedir("/registro", { method: "POST", body: JSON.stringify(datos) }),
  obtenerTest: () => pedir("/test"),
  enviarTest: (usuarioId, respuestas) =>
    pedir("/test/resultado", { method: "POST", body: JSON.stringify({ usuarioId, respuestas }) }),
  perfil: (id) => pedir(`/perfil/${id}`),
  chatear: (usuarioId, mensaje) =>
    pedir("/chat", { method: "POST", body: JSON.stringify({ usuarioId, mensaje }) }),
};
