import React, { useState } from "react";
import CompartirModal from "./CompartirModal.jsx";
import SinastriaModal from "./SinastriaModal.jsx";

const GLIFOS = {
  Aries: "♈", Tauro: "♉", Géminis: "♊", Cáncer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓",
};

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

  const { arquetipo, carta, numerologia, nombre } = usuario;
  const p = arquetipo?.primario;
  const s = arquetipo?.secundario;
  const diaP = numerologia?.diaPersonal;

  return (
    <main className="centrado">
      <p className="eyebrow">Tu sello cósmico & mapa de autodescubrimiento</p>
      <h1>{nombre}, eres {p?.nombre}</h1>
      <p className="suave" style={{ margin: "14px auto 6px", maxWidth: 520 }}>
        "{p?.lema}" — con la energía secundaria de {s?.nombre}, tu don central es {p?.don?.toLowerCase()}.
      </p>

      <div className="sello-contenedor">
        <SelloCosmico usuario={usuario} />
      </div>

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
