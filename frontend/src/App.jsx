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

  // Sesión persistente resiliente: cargamos el perfil completo desde localStorage
  useEffect(() => {
    const guardado = window.localStorage.getItem("sethi_usuario");
    if (guardado) {
      try {
        const u = JSON.parse(guardado);
        if (u && u.nombre) {
          setUsuario(u);
          setVista(u.arquetipo ? "perfil" : "test");
          return;
        }
      } catch (e) {
        window.localStorage.removeItem("sethi_usuario");
      }
    }

    // Fallback: intentar por id si existía
    const id = window.localStorage.getItem("sethi_id");
    if (!id) return;
    api
      .perfil(id)
      .then((data) => {
        if (data && data.usuario) {
          setUsuario(data.usuario);
          window.localStorage.setItem("sethi_usuario", JSON.stringify(data.usuario));
          setVista(data.usuario.arquetipo ? "perfil" : "test");
        } else {
          window.localStorage.removeItem("sethi_id");
        }
      })
      .catch(() => window.localStorage.removeItem("sethi_id"));
  }, []);

  const alRegistrar = (u) => {
    window.localStorage.setItem("sethi_id", u.id);
    window.localStorage.setItem("sethi_usuario", JSON.stringify(u));
    setUsuario(u);
    setVista("test");
  };

  const alTerminarTest = (arquetipo) => {
    setUsuario((u) => {
      const actualizado = { ...u, arquetipo };
      window.localStorage.setItem("sethi_usuario", JSON.stringify(actualizado));
      return actualizado;
    });
    setVista("perfil");
  };

  const cerrarSesion = () => {
    window.localStorage.removeItem("sethi_id");
    window.localStorage.removeItem("sethi_usuario");
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
