import React, { useState } from "react";
import { analizarSinastria } from "../lib/sinastria.js";

export default function SinastriaModal({ usuario, cerrar, irAlChatConSinastria }) {
  const [nombre2, setNombre2] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [tipo, setTipo] = useState("pareja");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const calcular = (e) => {
    e.preventDefault();
    if (!nombre2.trim() || !fecha2) return;
    setCargando(true);

    const persona2 = {
      nombre: nombre2.trim(),
      fechaNacimiento: fecha2,
      // Si no ha hecho test, calculamos arquetipo probable por Camino de Vida
      arquetipo: { primario: { clave: "creador", nombre: "Creador" } },
    };

    const res = analizarSinastria({
      persona1: usuario,
      persona2,
      tipo,
    });

    setResultado(res);
    setCargando(false);
  };

  const iniciarChatVinculo = () => {
    if (!resultado) return;
    irAlChatConSinastria(resultado);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-tarjeta sinastria-modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#d4af37" }}>
            ✦ Cruzar Energías · Sinastría Cósmica
          </h2>
          <button className="boton-cerrar" onClick={cerrar}>✕</button>
        </div>

        {!resultado ? (
          <form onSubmit={calcular}>
            <p className="suave" style={{ fontSize: "0.95rem", marginBottom: 20 }}>
              Descubre cómo interactúa tu perfil cósmico con tu pareja, socio de negocios o persona especial.
            </p>

            <div className="campo">
              <label htmlFor="nombre2">Nombre de la otra persona</label>
              <input
                id="nombre2"
                value={nombre2}
                onChange={(e) => setNombre2(e.target.value)}
                placeholder="Ej: Camila, Matías..."
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="fecha2">Fecha de nacimiento</label>
              <input
                id="fecha2"
                type="date"
                value={fecha2}
                onChange={(e) => setFecha2(e.target.value)}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="tipo">Tipo de vínculo</label>
              <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="select-cosmico">
                <option value="pareja">Pareja / Amor romántico</option>
                <option value="socio">Socio de negocios / Proyecto</option>
                <option value="amistad">Amistad profunda</option>
                <option value="familiar">Vínculo familiar</option>
              </select>
            </div>

            <button type="submit" className="primario" style={{ width: "100%", marginTop: 14 }} disabled={cargando}>
              {cargando ? "Alineando orbes..." : "Calcular Compatibilidad Cósmica"}
            </button>
          </form>
        ) : (
          <div className="resultado-sinastria">
            <div className="sinergia-badge">
              <span className="sinergia-numero">{resultado.porcentajeGlobal}%</span>
              <span className="sinergia-label">Sinergia Cósmica</span>
            </div>

            <h3 style={{ color: "#f5f3ef", marginTop: 12, marginBottom: 4 }}>
              {resultado.tituloVínculo}
            </h3>
            <p className="suave" style={{ fontSize: "0.9rem", margin: "0 auto 16px" }}>
              {resultado.dinamicaArquetipica}
            </p>

            <div className="tarjeta-cruce">
              <div className="cruce-persona">
                <span className="nombre-persona">{usuario.nombre}</span>
                <span className="rol-persona">{usuario.arquetipo?.primario?.nombre}</span>
                <span className="sub-persona">{usuario.carta?.sol?.signo}</span>
              </div>
              <div className="icono-union">✦</div>
              <div className="cruce-persona">
                <span className="nombre-persona">{resultado.persona2.nombre}</span>
                <span className="rol-persona">{resultado.persona2.arquetipo}</span>
                <span className="sub-persona">{resultado.persona2.signo}</span>
              </div>
            </div>

            <div className="dato-cosmico" style={{ marginTop: 12 }}>
              <span className="clave">Alquimia Elemental</span>
              <span className="valor">{resultado.afinidadElemental.nivel} ({resultado.afinidadElemental.porcentaje}%)</span>
            </div>

            <div className="dato-cosmico">
              <span className="clave">Camino Conjunto</span>
              <span className="valor">Vibración {resultado.numerologiaRelacional.numeroVinculo}</span>
            </div>

            <p className="suave" style={{ fontSize: "0.85rem", fontStyle: "italic", margin: "14px 0" }}>
              "{resultado.numerologiaRelacional.significado}"
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button className="primario" onClick={iniciarChatVinculo} style={{ flex: 1 }}>
                Conversar con Sethi sobre nosotros
              </button>
              <button className="secundario" onClick={() => setResultado(null)}>
                Otro cruce
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
