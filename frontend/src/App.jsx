import React, { useState, useEffect } from "react";
import Registro from "./views/Registro.jsx";
import Test from "./views/Test.jsx";
import Perfil from "./views/Perfil.jsx";
import Chat from "./views/Chat.jsx";
import { api } from "./api.js";

// Flujo: registro → test → perfil (sello cósmico) → chat con el mentor
export default function App() {
  const [vista, setVista] = useState("registro");
  const [usuario, setUsuario] = useState(null);

  // Sesión persistente simple (MVP): recordamos el id en localStorage del navegador.
  useEffect(() => {
    const id = window.localStorage.getItem("sethi_id");
    if (!id) return;
    api
      .perfil(id)
      .then(({ usuario }) => {
        setUsuario(usuario);
        setVista(usuario.arquetipo ? "perfil" : "test");
      })
      .catch(() => window.localStorage.removeItem("sethi_id"));
  }, []);

  const alRegistrar = (u) => {
    window.localStorage.setItem("sethi_id", u.id);
    setUsuario(u);
    setVista("test");
  };

  const alTerminarTest = (arquetipo) => {
    setUsuario((u) => ({ ...u, arquetipo }));
    setVista("perfil");
  };

  const cerrarSesion = () => {
    window.localStorage.removeItem("sethi_id");
    setUsuario(null);
    setVista("registro");
  };

  return (
    <div className="app">
      <header className="marca">
        <span className="estrella" aria-hidden="true">✦</span>
        <span>Sethi</span>
      </header>

      {vista === "registro" && <Registro alRegistrar={alRegistrar} />}
      {vista === "test" && <Test usuario={usuario} alTerminar={alTerminarTest} />}
      {vista === "perfil" && (
        <Perfil usuario={usuario} irAlChat={() => setVista("chat")} cerrarSesion={cerrarSesion} />
      )}
      {vista === "chat" && <Chat usuario={usuario} volver={() => setVista("perfil")} />}
    </div>
  );
}
