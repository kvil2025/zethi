import React, { useState, useRef, useEffect } from "react";
import { api } from "../api.js";

export default function Chat({ usuario, volver, mensajeInicial = "", sinastriaInicial = null }) {
  const [sinastria, setSinastria] = useState(sinastriaInicial);
  const [mensajes, setMensajes] = useState(() => {
    if (sinastriaInicial) {
      return [
        {
          role: "assistant",
          content: `Hola ${usuario.nombre}. He cruzado tu energía con la de ${sinastriaInicial.persona2.nombre} (${sinastriaInicial.tipo}). Su sinergia cósmica es del ${sinastriaInicial.porcentajeGlobal}% bajo el arquetipo de "${sinastriaInicial.tituloVínculo}". ¿Qué inquietud o decisión sobre este vínculo quieren mirar juntos hoy?`,
        },
      ];
    }
    if (usuario.historial?.length) return usuario.historial;
    try {
      const guardado = window.localStorage.getItem(`sethi_chat_${usuario.id || "default"}`);
      if (guardado) return JSON.parse(guardado);
    } catch (e) {}
    return [
      {
        role: "assistant",
        content: `Hola ${usuario.nombre}. Soy Sethi, tu mentor. Conozco tu energía de ${usuario.arquetipo?.primario?.nombre || "autodescubrimiento"} y tu camino ${usuario.numerologia?.caminoDeVida?.numero || ""}. ¿Qué decisión o inquietud quieres mirar juntos hoy?`,
      },
    ];
  });

  const [texto, setTexto] = useState(mensajeInicial || "");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const finRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  // Si había un mensaje inicial, enviarlo automáticamente
  useEffect(() => {
    if (mensajeInicial && mensajes.length <= 1) {
      enviar(mensajeInicial);
    }
  }, []);

  // Guardar historial local
  useEffect(() => {
    if (usuario?.id && !sinastria && mensajes.length > 0) {
      window.localStorage.setItem(`sethi_chat_${usuario.id}`, JSON.stringify(mensajes));
    }
  }, [mensajes, usuario, sinastria]);

  const enviar = async (textoAEnviar) => {
    const mensaje = (textoAEnviar || texto).trim();
    if (!mensaje || cargando) return;
    setError("");
    setTexto("");
    const nuevosMensajes = [...mensajes, { role: "user", content: mensaje }];
    setMensajes(nuevosMensajes);
    setCargando(true);

    try {
      const { respuesta } = await api.chatear(usuario, mensaje, mensajes, sinastria);
      setMensajes((m) => [...m, { role: "assistant", content: respuesta }]);
    } catch (e) {
      setError(e.message || "No pudimos conectar con tu mentor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="chat-marco">
      {sinastria ? (
        <div className="banner-sinastria" style={{ background: "rgba(125,107,199,0.18)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 12, padding: "8px 14px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ color: "#d4af37", fontSize: "0.85rem", fontWeight: "bold" }}>✦ Vínculo Activo: </span>
            <span style={{ color: "#f5f3ef", fontSize: "0.85rem" }}>{usuario.nombre} + {sinastria.persona2.nombre} ({sinastria.tipo})</span>
          </div>
          <button className="enlace" onClick={() => setSinastria(null)} style={{ fontSize: "0.75rem", margin: 0 }}>
            Volver a sesión individual
          </button>
        </div>
      ) : (
        <p className="eyebrow">Tu mentor · sesión abierta</p>
      )}

      <div className="chat-mensajes">
        {mensajes.map((m, i) => (
          <div key={i} className={`burbuja ${m.role === "user" ? "usuario" : "mentor"}`}>
            {m.content}
          </div>
        ))}
        {cargando && <div className="burbuja mentor">Reflexionando con sabiduría cósmica…</div>}
        <div ref={finRef} />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="chat-entrada">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder={sinastria ? `Pregunta sobre tu dinámica con ${sinastria.persona2.nombre}…` : "Escríbele a tu mentor…"}
          aria-label="Mensaje para tu mentor"
        />
        <button onClick={() => enviar()} disabled={cargando}>Enviar</button>
      </div>

      <button className="enlace" onClick={volver}>← Volver a mi sello cósmico</button>
    </main>
  );
}
