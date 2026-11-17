// Cliente de la API de Sethi (Conexión Serverless Vercel + Gemini).
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
  salud: () => pedir("/salud"),
  registrar: (datos) => pedir("/registro", { method: "POST", body: JSON.stringify(datos) }),
  obtenerTest: () => pedir("/test"),
  enviarTest: (usuarioId, respuestas) =>
    pedir("/test/resultado", { method: "POST", body: JSON.stringify({ usuarioId, respuestas }) }),
  perfil: (id) => pedir(`/perfil/${id}`),
  chatear: (usuario, mensaje, historial) =>
    pedir("/chat", {
      method: "POST",
      body: JSON.stringify(
        typeof usuario === "object"
          ? { usuario, mensaje, historial }
          : { usuarioId: usuario, mensaje, historial }
      ),
    }),
};
