import React, { useRef, useEffect, useState } from "react";

const GLIFOS = {
  Aries: "♈", Tauro: "♉", Géminis: "♊", Cáncer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓",
};

export default function CompartirModal({ usuario, cerrar }) {
  const canvasRef = useRef(null);
  const [generando, setGenerando] = useState(true);
  const [compartido, setCompartido] = useState(false);

  useEffect(() => {
    dibujarStories();
  }, [usuario]);

  const dibujarStories = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    // 1. Fondo Deep Space con gradiente radial místico
    const bgGrad = ctx.createRadialGradient(W / 2, H * 0.4, 100, W / 2, H / 2, W * 0.9);
    bgGrad.addColorStop(0, "#19152b");
    bgGrad.addColorStop(0.5, "#0d0b17");
    bgGrad.addColorStop(1, "#05040a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Polvo de estrellas cósmico
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 90; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * W;
      const sy = (Math.cos(i * 33) * 0.5 + 0.5) * H;
      const sr = (i % 3) + 0.8;
      ctx.globalAlpha = (i % 5) * 0.15 + 0.2;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 3. Encabezado Marca
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 36px 'Cormorant Garamond', serif";
    ctx.fillText("✦  S E T H I  ✦", W / 2, 140);

    ctx.fillStyle = "#958fb0";
    ctx.font = "24px 'Sora', sans-serif";
    ctx.fillText("SELLO CÓSMICO & MAPA ARQUETÍPICO", W / 2, 185);

    // 4. Nombre del usuario
    ctx.fillStyle = "#f5f3ef";
    ctx.font = "bold 64px 'Cormorant Garamond', serif";
    ctx.fillText(usuario.nombreCompleto || usuario.nombre, W / 2, 280);

    // 5. Geometría Sagrada (Sello Cósmico en alta resolución)
    const cx = W / 2;
    const cy = 680;
    const primario = usuario.arquetipo?.primario;
    const signo = usuario.carta?.sol?.signo || "Aries";
    const numero = usuario.numerologia?.caminoDeVida?.numero ?? 1;

    // Círculos concéntricos dorados
    ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 320, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(138, 120, 208, 0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.arc(cx, cy, 290, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Estrella poligonal del Camino de Vida
    const puntas = Math.max(5, ((numero - 1) % 9) + 4);
    const R = 220;
    const r = 95;
    ctx.beginPath();
    for (let i = 0; i < puntas * 2; i++) {
      const rad = i % 2 === 0 ? R : r;
      const ang = (Math.PI / puntas) * i - Math.PI / 2;
      const px = cx + rad * Math.cos(ang);
      const py = cy + rad * Math.sin(ang);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(138, 120, 208, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Núcleo central
    ctx.fillStyle = "#0c0a14";
    ctx.beginPath();
    ctx.arc(cx, cy, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Glifo Astrológico
    ctx.fillStyle = "#ffffff";
    ctx.font = "60px 'Sora', sans-serif";
    ctx.fillText(GLIFOS[signo] || "✦", cx, cy + 20);

    // 6. Arquetipo Principal - Gran Titular
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 56px 'Cormorant Garamond', serif";
    ctx.fillText(`${primario?.nombre?.toUpperCase()}  ·  ${primario?.porcentaje || 50}%`, W / 2, 1100);

    ctx.fillStyle = "#d6d2e6";
    ctx.font = "italic 32px 'Cormorant Garamond', serif";
    ctx.fillText(`"${primario?.lema || ""}"`, W / 2, 1160);

    // 7. Tarjeta con Pilares Cósmicos
    const boxY = 1240;
    const boxW = 860;
    const boxH = 430;
    const boxX = (W - boxW) / 2;

    ctx.fillStyle = "rgba(22, 18, 38, 0.75)";
    ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
    ctx.lineWidth = 2;
    ctx.roundRect(boxX, boxY, boxW, boxH, 28);
    ctx.fill();
    ctx.stroke();

    const drawDato = (label, val, x, y) => {
      ctx.textAlign = "left";
      ctx.fillStyle = "#8e88a8";
      ctx.font = "24px 'Sora', sans-serif";
      ctx.fillText(label.toUpperCase(), x, y);
      ctx.fillStyle = "#f5f3ef";
      ctx.font = "bold 34px 'Sora', sans-serif";
      ctx.fillText(val, x, y + 44);
    };

    drawDato("Signo Solar", `${usuario.carta?.sol?.signo} (${usuario.carta?.sol?.elemento})`, boxX + 50, boxY + 75);
    drawDato("Don Arquetípico", primario?.don || "Liderazgo", boxX + 460, boxY + 75);

    drawDato("Camino de Vida", `Número ${usuario.numerologia?.caminoDeVida?.numero}`, boxX + 50, boxY + 205);
    drawDato("Número de Destino", `Destino ${usuario.numerologia?.destino?.numero}`, boxX + 460, boxY + 205);

    drawDato("Año Personal 2026", `Vibración ${usuario.numerologia?.anioPersonal?.numero}`, boxX + 50, boxY + 335);
    drawDato("Día Personal Hoy", `Energía ${usuario.numerologia?.diaPersonal?.numero || 1}`, boxX + 460, boxY + 335);

    // 8. Pie de página con invitación viral
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 32px 'Sora', sans-serif";
    ctx.fillText("Descubre tu Sello Cósmico en zethi.vercel.app", W / 2, 1780);

    ctx.fillStyle = "#7b7596";
    ctx.font = "24px 'Sora', sans-serif";
    ctx.fillText("Mentoría arquetípica, astrología y numerología con IA", W / 2, 1825);

    setGenerando(false);
  };

  const descargarImagen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `Sethi-Sello-${(usuario.nombre || "Cosmico").replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const compartirNativo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "mi-sello-sethi.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: "Mi Sello Cósmico en Sethi",
            text: `Descubrí mi arquetipo cósmico: soy ${usuario.arquetipo?.primario?.nombre}. Conoce el tuyo en Sethi!`,
            files: [file],
          });
          setCompartido(true);
        } catch (e) {
          descargarImagen();
        }
      } else {
        descargarImagen();
      }
    }, "image/png");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-tarjeta">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#d4af37" }}>✦ Tu Sello para Instagram Stories</h2>
          <button className="boton-cerrar" onClick={cerrar}>✕</button>
        </div>

        <p className="suave" style={{ fontSize: "0.9rem", margin: "0 0 16px" }}>
          Listo en formato vertical 9:16 (1080x1920 HD) para compartir con tu comunidad.
        </p>

        <div className="preview-container" style={{ textAlign: "center", marginBottom: 18 }}>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              maxWidth: 270,
              aspectRatio: "9/16",
              borderRadius: 14,
              border: "1px solid rgba(212, 175, 55, 0.4)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="primario" onClick={compartirNativo}>
            {navigator.share ? "Compartir en Stories" : "Descargar Imagen HD"}
          </button>
          <button className="secundario" onClick={descargarImagen}>
            Descargar PNG
          </button>
        </div>

        {compartido && <p className="exito" style={{ marginTop: 12 }}>¡Sello compartido con éxito!</p>}
      </div>
    </div>
  );
}
