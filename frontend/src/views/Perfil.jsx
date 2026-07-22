import React from "react";

// ─── Sello Cósmico ──────────────────────────────────────────────────────────
// El elemento distintivo de Sethi: un sigilo circular único, generado con el
// arquetipo, el signo solar y el camino de vida de cada persona.
const GLIFOS = {
  Aries: "♈", Tauro: "♉", "Géminis": "♊", "Cáncer": "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓",
};

function SelloCosmico({ usuario }) {
  const primario = usuario.arquetipo?.primario;
  const signo = usuario.carta?.sol?.signo;
  const numero = usuario.numerologia?.caminoDeVida?.numero ?? 0;

  // El número de vida define cuántas puntas tiene la estrella interior (mín. 5).
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

export default function Perfil({ usuario, irAlChat, cerrarSesion }) {
  const { arquetipo, carta, numerologia, nombre } = usuario;
  const p = arquetipo?.primario;
  const s = arquetipo?.secundario;

  return (
    <main className="centrado">
      <p className="eyebrow">Tu sello cósmico</p>
      <h1>{nombre}, eres {p?.nombre}</h1>
      <p className="suave" style={{ margin: "14px auto 6px", maxWidth: 480 }}>
        "{p?.lema}" — con la energía secundaria de {s?.nombre}, tu don central es {p?.don?.toLowerCase()}.
      </p>

      <div className="sello-contenedor">
        <SelloCosmico usuario={usuario} />
      </div>

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
        <div className="dato-cosmico">
          <span className="clave">Camino de vida</span>
          <span className="valor">{numerologia?.caminoDeVida?.numero} <em>{numerologia?.caminoDeVida?.significado}</em></span>
        </div>
        <div className="dato-cosmico">
          <span className="clave">Número de destino</span>
          <span className="valor">{numerologia?.destino?.numero} <em>{numerologia?.destino?.significado}</em></span>
        </div>
        <div className="dato-cosmico">
          <span className="clave">Año personal</span>
          <span className="valor">{numerologia?.anioPersonal?.numero} <em>{numerologia?.anioPersonal?.significado}</em></span>
        </div>
      </div>

      <button className="primario" onClick={irAlChat}>Conversar con mi mentor</button>
      <button className="enlace" onClick={cerrarSesion}>Empezar de nuevo con otro perfil</button>
    </main>
  );
}
