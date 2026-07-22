import React, { useState, useEffect } from "react";
import { api } from "../api.js";

export default function Test({ usuario, alTerminar }) {
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.obtenerTest().then(({ preguntas }) => setPreguntas(preguntas)).catch((e) => setError(e.message));
  }, []);

  const responder = async (opcionIndex) => {
    const nuevas = [...respuestas, { preguntaId: preguntas[indice].id, opcionIndex }];
    if (indice + 1 < preguntas.length) {
      setRespuestas(nuevas);
      setIndice(indice + 1);
      return;
    }
    // Última pregunta: calculamos el resultado.
    setEnviando(true);
    try {
      const { arquetipo } = await api.enviarTest(usuario.id, nuevas);
      alTerminar(arquetipo);
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!preguntas.length) return <p className="suave">Preparando tu test…</p>;
  if (enviando) return (
    <div className="centrado" style={{ marginTop: 80 }}>
      <p className="eyebrow">Un momento</p>
      <h2>Descifrando tu arquetipo…</h2>
    </div>
  );

  const actual = preguntas[indice];
  const avance = ((indice) / preguntas.length) * 100;

  return (
    <main>
      <p className="eyebrow">Test de arquetipos · {indice + 1} de {preguntas.length}</p>
      <div className="progreso" role="progressbar" aria-valuenow={Math.round(avance)} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ width: `${avance}%` }} />
      </div>

      <h2>{actual.pregunta}</h2>
      <div style={{ marginTop: 20 }}>
        {actual.opciones.map((texto, i) => (
          <button key={i} className="opcion" onClick={() => responder(i)}>
            {texto}
          </button>
        ))}
      </div>
    </main>
  );
}
