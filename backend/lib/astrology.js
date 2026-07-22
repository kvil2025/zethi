// ─── Módulo Astrológico ──────────────────────────────────────────────────────
// MVP: calcula el signo solar y el elemento a partir de la fecha de nacimiento.
// PRODUCCIÓN: para carta natal completa (ascendente, luna, casas, tránsitos)
// conecta un microservicio Python con pyswisseph, o una API como
// https://api.prokerala.com / astro-seek. El "contrato" de salida ya está
// definido abajo en cartaNatal() para que el resto de la app no cambie.

const SIGNOS = [
  { signo: "Capricornio", desde: [12, 22], hasta: [1, 19], elemento: "Tierra", regente: "Saturno" },
  { signo: "Acuario", desde: [1, 20], hasta: [2, 18], elemento: "Aire", regente: "Urano" },
  { signo: "Piscis", desde: [2, 19], hasta: [3, 20], elemento: "Agua", regente: "Neptuno" },
  { signo: "Aries", desde: [3, 21], hasta: [4, 19], elemento: "Fuego", regente: "Marte" },
  { signo: "Tauro", desde: [4, 20], hasta: [5, 20], elemento: "Tierra", regente: "Venus" },
  { signo: "Géminis", desde: [5, 21], hasta: [6, 20], elemento: "Aire", regente: "Mercurio" },
  { signo: "Cáncer", desde: [6, 21], hasta: [7, 22], elemento: "Agua", regente: "Luna" },
  { signo: "Leo", desde: [7, 23], hasta: [8, 22], elemento: "Fuego", regente: "Sol" },
  { signo: "Virgo", desde: [8, 23], hasta: [9, 22], elemento: "Tierra", regente: "Mercurio" },
  { signo: "Libra", desde: [9, 23], hasta: [10, 22], elemento: "Aire", regente: "Venus" },
  { signo: "Escorpio", desde: [10, 23], hasta: [11, 21], elemento: "Agua", regente: "Plutón" },
  { signo: "Sagitario", desde: [11, 22], hasta: [12, 21], elemento: "Fuego", regente: "Júpiter" },
];

function signoSolar(fechaISO) {
  const [, mes, dia] = fechaISO.split("-").map(Number);
  for (const s of SIGNOS) {
    const [mD, dD] = s.desde;
    const [mH, dH] = s.hasta;
    const enRango =
      mD === mH
        ? mes === mD && dia >= dD && dia <= dH
        : (mes === mD && dia >= dD) || (mes === mH && dia <= dH);
    if (enRango) return s;
  }
  return SIGNOS[0]; // Capricornio cruza el año
}

/**
 * Carta natal (versión MVP). horaNacimiento y lugar quedan guardados para
 * cuando conectes el servicio de efemérides — el contrato no cambiará.
 */
function cartaNatal({ fechaNacimiento, horaNacimiento = null, lugar = null }) {
  const sol = signoSolar(fechaNacimiento);
  return {
    sol: { signo: sol.signo, elemento: sol.elemento, regente: sol.regente },
    luna: null,        // TODO: pyswisseph
    ascendente: null,  // TODO: pyswisseph (requiere hora + coordenadas)
    datos: { fechaNacimiento, horaNacimiento, lugar },
  };
}

module.exports = { cartaNatal, signoSolar };
