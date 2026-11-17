import React, { useState, useEffect } from "react";
import Registro from "./views/Registro.jsx";
import Test from "./views/Test.jsx";
import Perfil from "./views/Perfil.jsx";
import Chat from "./views/Chat.jsx";
import { api } from "./api.js";

// Flujo: registro → test → perfil (sello cósmico + clima diario + sinastría) → chat con el mentor
export default function App() {
  const [vista, setVista] = useState("registro");
  const [usuario, setUsuario] = useState(null);
  const [mensajeChatInicial, setMensajeChatInicial] = useState("");
  const [sinastriaChatInicial, setSinastriaChatInicial] = useState(null);

  // Sesión persistente resiliente: cargamos el perfil completo desde localStorage o precargamos Cristian por defecto
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const usuarioParam = params.get("usuario");

    const guardado = window.localStorage.getItem("sethi_usuario");
    if (guardado && !usuarioParam) {
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

    const id = usuarioParam || window.localStorage.getItem("sethi_id");
    const sesionCerrada = window.sessionStorage.getItem("sethi_sesion_cerrada");

    // Si el usuario cerró sesión en esta pestaña y no especificó parámetro en URL, mantener en registro
    if (sesionCerrada && !usuarioParam) {
      return;
    }

    // Carga directa del perfil (por ID o por defecto "cristian")
    const targetId = id || "cristian";
    api
      .perfil(targetId)
      .then((data) => {
        if (data && data.usuario) {
          setUsuario(data.usuario);
          window.localStorage.setItem("sethi_id", data.usuario.id);
          window.localStorage.setItem("sethi_usuario", JSON.stringify(data.usuario));
          setVista(data.usuario.arquetipo ? "perfil" : "test");
        } else {
          window.localStorage.removeItem("sethi_id");
        }
      })
      .catch(() => {
        window.localStorage.removeItem("sethi_id");
      });
  }, []);

  const alRegistrar = (u) => {
    window.sessionStorage.removeItem("sethi_sesion_cerrada");
    window.localStorage.setItem("sethi_id", u.id);
    window.localStorage.setItem("sethi_usuario", JSON.stringify(u));
    setUsuario(u);
    setVista(u.arquetipo ? "perfil" : "test");
  };

  const alTerminarTest = (arquetipo) => {
    setUsuario((u) => {
      const actualizado = { ...u, arquetipo };
      window.localStorage.setItem("sethi_usuario", JSON.stringify(actualizado));
      return actualizado;
    });
    setVista("perfil");
  };

  const irAlChat = (mensaje = "") => {
    setMensajeChatInicial(mensaje);
    setSinastriaChatInicial(null);
    setVista("chat");
  };

  const irAlChatConSinastria = (sinastriaData) => {
    setMensajeChatInicial("");
    setSinastriaChatInicial(sinastriaData);
    setVista("chat");
  };

  const cerrarSesion = () => {
    window.localStorage.removeItem("sethi_id");
    window.localStorage.removeItem("sethi_usuario");
    window.sessionStorage.setItem("sethi_sesion_cerrada", "true");
    setUsuario(null);
    setVista("registro");
  };

  return (
    <div className="app">
      <header className="marca">
        <div
          className="marca-logo"
          onClick={() => usuario?.arquetipo && setVista("perfil")}
          style={{ cursor: usuario?.arquetipo ? "pointer" : "default" }}
          title={usuario?.arquetipo ? "Ir a mi perfil y sello cósmico" : "Sethi"}
        >
          <span className="estrella" aria-hidden="true">✦</span>
          <span>Sethi</span>
        </div>

        {/* Botón Salir visible en todas las pantallas */}
        <div className="marca-acciones">
          {vista === "chat" && (
            <button
              className="btn-header-nav"
              onClick={() => setVista("perfil")}
              title="Volver a mi perfil y sello"
            >
              ← Mi Perfil
            </button>
          )}
          <button
            className="btn-salir"
            onClick={cerrarSesion}
            title="Cerrar sesión o cambiar consultante"
          >
            <span>✕</span> Salir
          </button>
        </div>
      </header>

      {vista === "registro" && <Registro alRegistrar={alRegistrar} />}
      {vista === "test" && <Test usuario={usuario} alTerminar={alTerminarTest} />}
      {vista === "perfil" && (
        <Perfil
          usuario={usuario}
          irAlChat={irAlChat}
          irAlChatConSinastria={irAlChatConSinastria}
          cerrarSesion={cerrarSesion}
        />
      )}
      {vista === "chat" && (
        <Chat
          usuario={usuario}
          volver={() => setVista("perfil")}
          mensajeInicial={mensajeChatInicial}
          sinastriaInicial={sinastriaChatInicial}
        />
      )}
    </div>
  );
}
