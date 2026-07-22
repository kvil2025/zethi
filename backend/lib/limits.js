// ─── Límite de uso del chat ─────────────────────────────────────────────────
// Protege tu cuenta de IA: cada usuario tiene un máximo de mensajes por día.
// Configurable con CHAT_LIMITE_DIARIO en .env (por defecto 20).
// MVP en memoria; si algún día usas varios servidores, muévelo a Supabase/Redis.

const LIMITE = Number(process.env.CHAT_LIMITE_DIARIO || 20);
const contadores = new Map(); // clave: usuarioId → { dia, usados }

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

function permitirMensaje(usuarioId) {
  const dia = hoy();
  const reg = contadores.get(usuarioId);
  if (!reg || reg.dia !== dia) {
    contadores.set(usuarioId, { dia, usados: 1 });
    return { permitido: true, restantes: LIMITE - 1 };
  }
  if (reg.usados >= LIMITE) {
    return { permitido: false, restantes: 0 };
  }
  reg.usados += 1;
  return { permitido: true, restantes: LIMITE - reg.usados };
}

module.exports = { permitirMensaje, LIMITE };
