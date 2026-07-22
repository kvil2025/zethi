// ─── Sethi API — Servidor principal (listo para producción) ─────────────────
// Rutas:
//   GET  /api/salud           → verificación para el hosting
//   POST /api/registro        → crea usuario con nombre + fecha de nacimiento
//   GET  /api/test            → preguntas del test de arquetipos
//   POST /api/test/resultado  → calcula el perfil arquetípico
//   GET  /api/perfil/:id      → perfil cósmico completo
//   POST /api/chat            → conversación con el mentor IA (con límite diario)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const { perfilNumerologico } = require("./lib/numerology");
const { cartaNatal } = require("./lib/astrology");
const { TEST, calcularArquetipo } = require("./lib/archetypes");
const { chatConMentor } = require("./lib/ai");
const { permitirMensaje, LIMITE } = require("./lib/limits");

// Almacenamiento: JSON local en desarrollo, Supabase en producción.
const store =
  process.env.STORAGE === "supabase"
    ? require("./lib/store-supabase")
    : require("./lib/store");

const app = express();

// CORS: en producción, solo tu dominio puede llamar a la API.
const origen = process.env.FRONTEND_ORIGIN;
app.use(cors(origen ? { origin: origen.split(",").map((o) => o.trim()) } : {}));
app.use(express.json());

app.get("/api/salud", (_req, res) => res.json({ ok: true, servicio: "sethi-api" }));

// ── Registro ────────────────────────────────────────────────────────────────
app.post("/api/registro", async (req, res) => {
  try {
    const { nombreCompleto, fechaNacimiento, horaNacimiento, lugar } = req.body || {};
    if (!nombreCompleto || !fechaNacimiento) {
      return res.status(400).json({ error: "Faltan nombreCompleto o fechaNacimiento (YYYY-MM-DD)." });
    }
    const id = crypto.randomUUID();
    const numerologia = perfilNumerologico({ nombreCompleto, fechaNacimiento });
    const carta = cartaNatal({ fechaNacimiento, horaNacimiento, lugar });
    const usuario = await store.guardarUsuario(id, {
      nombre: nombreCompleto.split(" ")[0],
      nombreCompleto,
      fechaNacimiento,
      numerologia,
      carta,
      historial: [],
    });
    res.json({ id, usuario });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No pudimos crear tu perfil. Intenta de nuevo." });
  }
});

// ── Test de arquetipos ──────────────────────────────────────────────────────
app.get("/api/test", (_req, res) => {
  const preguntas = TEST.map((p) => ({
    id: p.id,
    pregunta: p.pregunta,
    opciones: p.opciones.map((o) => o.texto),
  }));
  res.json({ preguntas });
});

app.post("/api/test/resultado", async (req, res) => {
  try {
    const { usuarioId, respuestas } = req.body || {};
    const usuario = await store.getUsuario(usuarioId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
    if (!Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ error: "Envía respuestas: [{preguntaId, opcionIndex}]." });
    }
    const arquetipo = calcularArquetipo(respuestas);
    await store.guardarUsuario(usuarioId, { arquetipo });
    res.json({ arquetipo });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No pudimos calcular tu arquetipo. Intenta de nuevo." });
  }
});

// ── Perfil completo ─────────────────────────────────────────────────────────
app.get("/api/perfil/:id", async (req, res) => {
  const usuario = await store.getUsuario(req.params.id);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
  res.json({ usuario });
});

// ── Chat con el mentor ──────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { usuarioId, mensaje } = req.body || {};
    const usuario = await store.getUsuario(usuarioId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
    if (!usuario.arquetipo) return res.status(400).json({ error: "Completa el test de arquetipos primero." });
    if (!mensaje?.trim()) return res.status(400).json({ error: "El mensaje está vacío." });

    const cupo = permitirMensaje(usuarioId);
    if (!cupo.permitido) {
      return res.status(429).json({
        error: `Alcanzaste tus ${LIMITE} mensajes de hoy. Tu mentor te espera mañana ✦`,
      });
    }

    const respuesta = await chatConMentor({
      perfil: usuario,
      historial: usuario.historial,
      mensaje: mensaje.trim(),
    });

    await store.agregarMensaje(usuarioId, "user", mensaje.trim());
    await store.agregarMensaje(usuarioId, "assistant", respuesta);
    res.json({ respuesta, mensajesRestantesHoy: cupo.restantes });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "El mentor no pudo responder. Intenta de nuevo en un momento." });
  }
});

const PUERTO = process.env.PORT || 3001;
app.listen(PUERTO, () => console.log(`✦ Sethi API escuchando en el puerto ${PUERTO}`));
