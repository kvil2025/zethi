import React, { useState } from "react";
import CompartirModal from "./CompartirModal.jsx";
import SinastriaModal from "./SinastriaModal.jsx";

const GLIFOS = {
  Aries: "♈", Tauro: "♉", Géminis: "♊", Cáncer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓",
};

const IMAGENES_ARQUETIPO = {
  rey: "/arquetipos/rey.jpg",
  creador: "/arquetipos/creador.jpg",
};

function IlustracionArquetipo({ usuario, modoVisual, setModoVisual, arqSeleccionado, setArqSeleccionado }) {
  const p = usuario.arquetipo?.primario;
  const s = usuario.arquetipo?.secundario;
  const actual = arqSeleccionado === "secundario" && s ? s : p;
  const clave = actual?.clave || "rey";
  const imagenSrc = IMAGENES_ARQUETIPO[clave] || "/arquetipos/rey.jpg";

  return (
    <div className="arquetipo-visual-contenedor">
      {modoVisual === "imagen" ? (
        <div className="arquetipo-card-marco">
          <img
            src={imagenSrc}
            alt={`Ilustración cósmica del arquetipo ${actual?.nombre}`}
            className="arquetipo-card-img"
            loading="eager"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/arquetipos/rey.jpg";
            }}
          />
          <div className="arquetipo-card-overlay">
            <span style={{ color: "#d4af37", fontSize: "0.72rem", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>
              {actual === p ? `Arquetipo Primario · ${actual?.porcentaje || 70}%` : `Arquetipo Secundario · ${actual?.porcentaje || 30}%`}
            </span>
            <h4 style={{ margin: "3px 0 2px", color: "#f5f3ef", fontSize: "1.15rem", fontFamily: "var(--display)" }}>
              {actual?.nombre}
            </h4>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#c5c0d8", fontStyle: "italic" }}>
              "{actual?.lema}"
            </p>
          </div>
        </div>
      ) : (
        <div className="sello-contenedor">
          <SelloCosmico usuario={usuario} />
        </div>
      )}

      {/* Selector de Arquetipo Primario / Secundario */}
      {s && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            type="button"
            className={`arquetipo-toggle-tab ${arqSeleccionado === "primario" ? "activo" : ""}`}
            onClick={() => setArqSeleccionado("primario")}
          >
            ✦ Primario: {p?.nombre}
          </button>
          <button
            type="button"
            className={`arquetipo-toggle-tab ${arqSeleccionado === "secundario" ? "activo" : ""}`}
            onClick={() => setArqSeleccionado("secundario")}
          >
            ✦ Secundario: {s?.nombre}
          </button>
        </div>
      )}

      {/* Selector entre Ilustración y Sello Geométrico */}
      <div className="arquetipo-toggle-tabs">
        <button
          type="button"
          className={`arquetipo-toggle-tab ${modoVisual === "imagen" ? "activo" : ""}`}
          onClick={() => setModoVisual("imagen")}
        >
          ✦ Ilustración
        </button>
        <button
          type="button"
          className={`arquetipo-toggle-tab ${modoVisual === "sello" ? "activo" : ""}`}
          onClick={() => setModoVisual("sello")}
        >
          ✦ Sello Sagrado
        </button>
      </div>
    </div>
  );
}

function SelloCosmico({ usuario }) {
  const primario = usuario.arquetipo?.primario;
  const signo = usuario.carta?.sol?.signo;
  const numero = usuario.numerologia?.caminoDeVida?.numero ?? 0;

  const puntas = Math.max(5, ((numero - 1) % 9) + 3);
  const R = 78, r = 34, cx = 130, cy = 130;
  const puntos = [];
  for (let i = 0; i < puntas * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const ang = (Math.PI / puntas) * i - Math.PI / 2;
    puntos.push(`${cx + rad * Math.cos(ang)},${cy + rad * Math.sin(ang)}`);
  }

  return (
    <svg width="260" height="260" viewBox="0 0 260 260" role="img"
      aria-label={`Sello cósmico: ${primario?.nombre}, ${signo}, camino de vida ${numero}`}>
      <circle cx={cx} cy={cy} r="118" fill="none" stroke="#c9a24b" strokeWidth="1" opacity="0.5" />
      <circle cx={cx} cy={cy} r="108" fill="none" stroke="#7d6bc7" strokeWidth="0.7" opacity="0.6"
        strokeDasharray="3 6" />
      <polygon points={puntos.join(" ")} fill="rgba(125,107,199,0.10)" stroke="#c9a24b" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="30" fill="#14121f" stroke="#c9a24b" strokeWidth="1" />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="26" fill="#ede9e0">{GLIFOS[signo] || "✦"}</text>
      <text x={cx} y="246" textAnchor="middle" fontSize="11" letterSpacing="4"
        fill="#a49fb4" style={{ textTransform: "uppercase" }}>
        {primario?.nombre} · {numero}
      </text>
    </svg>
  );
}

export default function Perfil({ usuario, irAlChat, irAlChatConSinastria, cerrarSesion }) {
  const [mostrarCompartir, setMostrarCompartir] = useState(false);
  const [mostrarSinastria, setMostrarSinastria] = useState(false);
  const [modoVisual, setModoVisual] = useState("imagen");
  const [arqSeleccionado, setArqSeleccionado] = useState("primario");

  const { arquetipo, carta, numerologia, nombre } = usuario;
  const p = arquetipo?.primario;
  const s = arquetipo?.secundario;
  const diaP = numerologia?.diaPersonal;

  return (
    <main className="centrado">
      <p className="eyebrow">Tu arquetipo cósmico & mapa de autodescubrimiento</p>
      <h1>{nombre}, eres {p?.nombre}</h1>
      <p className="suave" style={{ margin: "14px auto 6px", maxWidth: 520 }}>
        "{p?.lema}" — con la energía secundaria de {s?.nombre}, tu don central es {p?.don?.toLowerCase()}.
      </p>

      {/* Ilustración Artística Mística del Arquetipo / Sello Sagrado */}
      <IlustracionArquetipo
        usuario={usuario}
        modoVisual={modoVisual}
        setModoVisual={setModoVisual}
        arqSeleccionado={arqSeleccionado}
        setArqSeleccionado={setArqSeleccionado}
      />

      {/* Botones de acción viral e interactiva */}
      <div className="acciones-sello" style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        <button className="secundario" onClick={() => setMostrarCompartir(true)}>
          ✦ Compartir en Stories
        </button>
        <button className="secundario" onClick={() => setMostrarSinastria(true)}>
          ✦ Cruzar con Pareja / Socio
        </button>
      </div>

      {/* Oráculo / Clima Cósmico de Hoy */}
      {diaP && (
        <div className="tarjeta clima-diario-card" style={{ border: "1px solid rgba(212, 175, 55, 0.45)", background: "rgba(25, 20, 42, 0.65)", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="eyebrow" style={{ color: "#d4af37", margin: 0 }}>Energía de Hoy · Día Personal {diaP.numero}</span>
            <span style={{ fontSize: "0.85rem", color: "#a49fb4" }}>{diaP.piedra} · {diaP.color}</span>
          </div>
          <h3 style={{ margin: "8px 0 4px", fontSize: "1.15rem", color: "#f5f3ef" }}>{diaP.foco}</h3>
          <p className="suave" style={{ fontSize: "0.9rem", margin: "4px 0 10px" }}>{diaP.accion}</p>
          <button className="enlace" onClick={() => irAlChat(`Hola Sethi, hoy estoy transitando mi Día Personal ${diaP.numero} (${diaP.foco}). ¿Cómo puedo aprovechar esta vibración con mi perfil de ${p?.nombre}?`)}>
            Profundizar sobre mi día con Sethi →
          </button>
        </div>
      )}

      {/* Desglose de Datos Cósmicos */}
      <div className="tarjeta" style={{ textAlign: "left" }}>
        <div className="dato-cosmico">
          <span className="clave">Arquetipo primario</span>
          <span className="valor">{p?.nombre} <em>{p?.porcentaje}%</em></span>
        </div>
        <div className="dato-cosmico">
          <span className="clave">Arquetipo secundario</span>
          <span className="valor">{s?.nombre} <em>{s?.porcentaje}%</em></span>
        </div>
        <div className="dato-cosmico">
          <span className="clave">Signo solar</span>
          <span className="valor">{carta?.sol?.signo} <em>Elemento {carta?.sol?.elemento} · regente {carta?.sol?.regente}</em></span>
        </div>
        {carta?.luna?.signo && (
          <div className="dato-cosmico">
            <span className="clave">Signo lunar (Emociones)</span>
            <span className="valor">{carta.luna.signo} <em>Elemento {carta.luna.elemento}</em></span>
          </div>
        )}
        {carta?.ascendente?.signo && (
          <div className="dato-cosmico">
            <span className="clave">Signo ascendente (Propósito)</span>
            <span className="valor">{carta.ascendente.signo} <em>Elemento {carta.ascendente.elemento}</em></span>
          </div>
        )}
        <div className="dato-cosmico">
          <span className="clave">Camino de vida</span>
          <span className="valor">{numerologia?.caminoDeVida?.numero} <em>{numerologia?.caminoDeVida?.significado}</em></span>
        </div>
        <div className="dato-cosmico">
          <span className="clave">Número de destino</span>
          <span className="valor">{numerologia?.destino?.numero} <em>{numerologia?.destino?.significado}</em></span>
        </div>
        <div className="dato-cosmico">
          <span className="clave">Año personal 2026</span>
          <span className="valor">{numerologia?.anioPersonal?.numero} <em>{numerologia?.anioPersonal?.significado}</em></span>
        </div>
      </div>

      <button className="primario" style={{ width: "100%", maxWidth: 360, marginTop: 14 }} onClick={() => irAlChat()}>
        Conversar con mi mentor
      </button>
      <button className="enlace" onClick={cerrarSesion} style={{ marginTop: 10 }}>
        Empezar de nuevo con otro perfil
      </button>

      {mostrarCompartir && (
        <CompartirModal usuario={usuario} cerrar={() => setMostrarCompartir(false)} />
      )}

      {mostrarSinastria && (
        <SinastriaModal
          usuario={usuario}
          cerrar={() => setMostrarSinastria(false)}
          irAlChatConSinastria={(sinastria) => {
            setMostrarSinastria(false);
            irAlChatConSinastria(sinastria);
          }}
        />
      )}
    </main>
  );
}
