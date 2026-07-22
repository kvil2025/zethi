import React, { useState } from "react";
import { api } from "../api.js";

export default function Registro({ alRegistrar }) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

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
      <p className="suave" style={{ margin: "18px 0 30px" }}>
        Sethi cruza tu perfil arquetípico, tu carta astral y tu numerología para
        acompañarte como mentor de vida y carrera. Empecemos por lo esencial.
      </p>

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
        <button className="primario" onClick={enviar} disabled={cargando}>
          {cargando ? "Leyendo las estrellas…" : "Comenzar mi viaje"}
        </button>
      </div>
    </main>
  );
}
