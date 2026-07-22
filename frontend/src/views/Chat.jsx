import React, { useState, useRef, useEffect } from "react";
import { api } from "../api.js";

export default function Chat({ usuario, volver }) {
  const [mensajes, setMensajes] = useState(
    usuario.historial?.length
      ? usuario.historial
      : [{
          role: "assistant",
          content: `Hola ${usuario.nombre}. Soy Sethi, tu mentor. Conozco tu energía de ${usuario.arquetipo?.primario?.nombre} y tu camino ${usuario.numerologia?.caminoDeVida?.numero}. ¿Qué decisión o inquietud quieres mirar juntos hoy?`,
        }]
  );
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const finRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  const enviar = async () => {
    const mensaje = texto.trim();
    if (!mensaje || cargando) return;
    setError("");
    setTexto("");
    setMensajes((m) => [...m, { role: "user", content: mensaje }]);
    setCargando(true);
    try {
      const { respuesta } = await api.chatear(usuario.id, mensaje);
      setMensajes((m) => [...m, { role: "assistant", content: respuesta }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="chat-marco">
      <p className="eyebrow">Tu mentor · sesión abierta</p>

      <div className="chat-mensajes">
        {mensajes.map((m, i) => (
          <div key={i} className={`burbuja ${m.role === "user" ? "usuario" : "mentor"}`}>
            {m.content}
          </div>
        ))}
        {cargando && <div className="burbuja mentor">Pensando…</div>}
        <div ref={finRef} />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="chat-entrada">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escríbele a tu mentor…"
          aria-label="Mensaje para tu mentor"
        />
        <button onClick={enviar} disabled={cargando}>Enviar</button>
      </div>

      <button className="enlace" onClick={volver}>← Volver a mi sello cósmico</button>
    </main>
  );
}
