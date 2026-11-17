import React, { useState } from "react";
import { api } from "../api.js";

export default function Registro({ alRegistrar }) {
  const [nombre, setNombre] = useState("Cristian Ávila Elgueta");
  const [fecha, setFecha] = useState("1988-05-15");
  const [hora, setHora] = useState("09:30");
  const [lugar, setLugar] = useState("Santiago, Chile");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarPerfilCristian = async () => {
    setCargando(true);
    setError("");
    try {
      const data = await api.perfil("cristian");
      if (data && data.usuario) {
        alRegistrar(data.usuario);
      }
    } catch (e) {
      setError("No se pudo cargar el perfil: " + e.message);
    } finally {
      setCargando(false);
    }
  };

  const enviar = async () => {
    setError("");
    if (!nombre.trim() || !fecha) {
      setError("Necesitamos tu nombre completo y tu fecha de nacimiento.");
      return;
    }
    setCargando(true);
    try {
      const { id, usuario } = await api.registrar({
        nombreCompleto: nombre.trim(),
        fechaNacimiento: fecha,
        horaNacimiento: hora || null,
        lugar: lugar || null,
      });
      alRegistrar({ ...usuario, id });
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main>
      <p className="eyebrow">Bienvenida · Bienvenido</p>
      <h1>Conócete más profundo de lo que creías posible</h1>
      <p className="suave" style={{ margin: "18px 0 24px" }}>
        Sethi cruza tu perfil arquetípico, tu carta astral y tu numerología para
        acompañarte como mentor de vida y carrera.
      </p>

      {/* Acceso Rápido 1-Clic a Perfil Guardado */}
      <div
        className="tarjeta"
        style={{
          marginBottom: 24,
          border: "1px solid rgba(212, 175, 55, 0.6)",
          background: "linear-gradient(180deg, rgba(30, 24, 50, 0.85) 0%, rgba(20, 16, 35, 0.95) 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
          textAlign: "center",
          padding: "24px 20px",
        }}
      >
        <span className="eyebrow" style={{ color: "#d4af37", margin: "0 0 6px", display: "inline-block" }}>
          ✦ Acceso Instantáneo Guardado
        </span>
        <h3 style={{ margin: "6px 0 6px", fontSize: "1.3rem", color: "#f5f3ef" }}>
          Cristian Ávila Elgueta
        </h3>
        <p className="suave" style={{ fontSize: "0.92rem", margin: "0 0 18px", color: "#c5c0d8" }}>
          Rey Protector (70%) & Creador (30%) · Tauro · Camino 1 · Destino 8
        </p>
        <button
          className="primario"
          onClick={cargarPerfilCristian}
          disabled={cargando}
          style={{
            width: "100%",
            fontSize: "1rem",
            padding: "13px 18px",
            background: "linear-gradient(135deg, #d4af37 0%, #aa8222 100%)",
            color: "#0f0d18",
            fontWeight: 700,
            border: "none",
            borderRadius: "10px",
            boxShadow: "0 4px 18px rgba(212, 175, 55, 0.35)",
            cursor: "pointer",
          }}
        >
          {cargando ? "Cargando perfil cósmico…" : "✦ Entrar al instante como Cristian"}
        </button>
      </div>

      <div className="separador" style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
        <span style={{ fontSize: "0.8rem", color: "#a49fb4", textTransform: "uppercase", letterSpacing: 1.5 }}>
          o ingresar otro consultante
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
      </div>

      <div className="tarjeta">
        <label htmlFor="nombre">Nombre completo (como aparece en tu registro de nacimiento)</label>
        <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Avi Andrea Rojas Fuentes" />

        <label htmlFor="fecha">Fecha de nacimiento</label>
        <input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <label htmlFor="hora">Hora de nacimiento (opcional, mejora tu carta natal)</label>
        <input id="hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />

        <label htmlFor="lugar">Ciudad de nacimiento (opcional)</label>
        <input id="lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Ej: Santiago, Chile" />

        {error && <p className="error">{error}</p>}
        <button className="secundario" onClick={enviar} disabled={cargando} style={{ width: "100%", marginTop: 8 }}>
          {cargando ? "Leyendo las estrellas…" : "Comenzar nuevo viaje"}
        </button>
      </div>
    </main>
  );
}
