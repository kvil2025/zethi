import { perfilNumerologico } from "../_lib/numerology.js";
import { cartaNatal } from "../_lib/astrology.js";

export const PERFILES_PREDETERMINADOS = {
  cristian: {
    id: "cristian",
    nombre: "Cristian",
    nombreCompleto: "Cristian Ávila Elgueta",
    fechaNacimiento: "1988-05-15",
    horaNacimiento: "09:30",
    lugar: "Santiago, Chile",
    arquetipo: {
      primario: {
        clave: "rey",
        nombre: "Rey Protector",
        lema: "El poder no lo es todo, es lo único",
        don: "Liderazgo, orden y prosperidad",
        porcentaje: 70,
      },
      secundario: {
        clave: "creador",
        nombre: "Creador",
        lema: "Si lo puedes imaginar, lo puedes crear",
        don: "Imaginación y expresión",
        porcentaje: 30,
      },
    },
    carta: {
      sol: { signo: "Tauro", elemento: "Tierra", regente: "Venus" },
      luna: { signo: "Tauro", elemento: "Tierra", regente: "Venus" },
      ascendente: { signo: "Cáncer", elemento: "Agua", regente: "Luna" },
      datos: { fechaNacimiento: "1988-05-15", horaNacimiento: "09:30", lugar: "Santiago, Chile" },
    },
    numerologia: {
      caminoDeVida: { numero: 1, significado: "Liderazgo, independencia y capacidad de iniciar proyectos." },
      destino: { numero: 8, significado: "Poder material, gestión y ambición constructiva." },
      anioPersonal: { numero: 5, significado: "Libertad, adaptabilidad y amor por el cambio." },
    },
  },
};

export default function handler(req, res) {
  const { id } = req.query;
  const perfilKey = (id || "").toLowerCase();

  const perfil = PERFILES_PREDETERMINADOS[perfilKey] || PERFILES_PREDETERMINADOS["cristian"];

  // Actualizar día personal dinámicamente según la fecha de hoy
  const numActualizado = perfilNumerologico({
    nombreCompleto: perfil.nombreCompleto,
    fechaNacimiento: perfil.fechaNacimiento,
  });

  const usuarioCompleto = {
    ...perfil,
    numerologia: {
      ...perfil.numerologia,
      diaPersonal: numActualizado.diaPersonal,
    },
  };

  res.status(200).json({
    ok: true,
    usuario: usuarioCompleto,
  });
}
