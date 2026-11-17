// ─── Módulo Astrológico Ampliado (Sol, Luna, Ascendente y Sinastría) ─────────

export const SIGNOS = [
  { signo: "Capricornio", desde: [12, 22], hasta: [1, 19], elemento: "Tierra", regente: "Saturno", cualidad: "Cardinal" },
  { signo: "Acuario", desde: [1, 20], hasta: [2, 18], elemento: "Aire", regente: "Urano", cualidad: "Fijo" },
  { signo: "Piscis", desde: [2, 19], hasta: [3, 20], elemento: "Agua", regente: "Neptuno", cualidad: "Mutable" },
  { signo: "Aries", desde: [3, 21], hasta: [4, 19], elemento: "Fuego", regente: "Marte", cualidad: "Cardinal" },
  { signo: "Tauro", desde: [4, 20], hasta: [5, 20], elemento: "Tierra", regente: "Venus", cualidad: "Fijo" },
  { signo: "Géminis", desde: [5, 21], hasta: [6, 20], elemento: "Aire", regente: "Mercurio", cualidad: "Mutable" },
  { signo: "Cáncer", desde: [6, 21], hasta: [7, 22], elemento: "Agua", regente: "Luna", cualidad: "Cardinal" },
  { signo: "Leo", desde: [7, 23], hasta: [8, 22], elemento: "Fuego", regente: "Sol", cualidad: "Fijo" },
  { signo: "Virgo", desde: [8, 23], hasta: [9, 22], elemento: "Tierra", regente: "Mercurio", cualidad: "Mutable" },
  { signo: "Libra", desde: [9, 23], hasta: [10, 22], elemento: "Aire", regente: "Venus", cualidad: "Cardinal" },
  { signo: "Escorpio", desde: [10, 23], hasta: [11, 21], elemento: "Agua", regente: "Plutón", cualidad: "Fijo" },
  { signo: "Sagitario", desde: [11, 22], hasta: [12, 21], elemento: "Fuego", regente: "Júpiter", cualidad: "Mutable" },
];

export function signoSolar(fechaISO) {
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

// Orden del zodíaco arrancando en Aries (0)
const ORDEN_ZODIACO = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

/**
 * Luna estimada: basada en el ciclo sideral medio (~27.32 días por vuelta del zodíaco).
 */
export function signoLunar(fechaISO) {
  const [y, m, d] = fechaISO.split("-").map(Number);
  const fecha = new Date(Date.UTC(y, m - 1, d));
  // Época de referencia conocida: Luna en Tauro (1970-01-01)
  const epoch = new Date(Date.UTC(1970, 0, 1));
  const dias = (fecha - epoch) / (1000 * 60 * 60 * 24);
  const signoIndex = Math.floor(((dias % 27.3216) / 27.3216) * 12 + 1) % 12;
  const nombreSigno = ORDEN_ZODIACO[(signoIndex + 12) % 12];
  return SIGNOS.find((s) => s.signo === nombreSigno) || SIGNOS[3];
}

/**
 * Ascendente estimado: cada ~2 horas desde el amanecer (~06:00) avanza un signo respecto al Sol.
 */
export function signoAscendente(fechaISO, horaStr) {
  const sol = signoSolar(fechaISO);
  if (!horaStr) return null;
  const [hora, min] = horaStr.split(":").map(Number);
  const horaDecimal = hora + (min || 0) / 60;
  // A las 06:00 el ascendente coincide aproximadamente con el Sol
  const desfaseHoras = (horaDecimal - 6 + 24) % 24;
  const signosAvanzados = Math.floor(desfaseHoras / 2);
  const indexSol = ORDEN_ZODIACO.indexOf(sol.signo);
  const indexAsc = (indexSol + signosAvanzados) % 12;
  const nombreAsc = ORDEN_ZODIACO[indexAsc];
  return SIGNOS.find((s) => s.signo === nombreAsc) || sol;
}

export function cartaNatal({ fechaNacimiento, horaNacimiento = null, lugar = null }) {
  const sol = signoSolar(fechaNacimiento);
  const luna = signoLunar(fechaNacimiento);
  const asc = signoAscendente(fechaNacimiento, horaNacimiento);

  return {
    sol: { signo: sol.signo, elemento: sol.elemento, regente: sol.regente },
    luna: { signo: luna.signo, elemento: luna.elemento, regente: luna.regente },
    ascendente: asc ? { signo: asc.signo, elemento: asc.elemento, regente: asc.regente } : null,
    datos: { fechaNacimiento, horaNacimiento, lugar },
  };
}

/**
 * Afinidad elemental entre dos signos
 */
export function afinidadElemental(elem1, elem2) {
  if (elem1 === elem2) return { nivel: "Armonía Natural", porcentaje: 95, descripcion: `Ambos vibran en el elemento ${elem1}, compartiendo el mismo ritmo instintivo.` };
  const paresCompatibles = [
    ["Fuego", "Aire"], ["Aire", "Fuego"],
    ["Tierra", "Agua"], ["Agua", "Tierra"]
  ];
  const esCompatible = paresCompatibles.some(([a, b]) => a === elem1 && b === elem2);
  if (esCompatible) return { nivel: "Alquimia Fértil", porcentaje: 88, descripcion: `${elem1} nutre y expande a ${elem2}, creando un balance natural de impulso y estabilidad.` };
  return { nivel: "Tensión Creativa", porcentaje: 72, descripcion: `${elem1} y ${elem2} operan desde perspectivas distintas; requiere consciencia para no sofocarse mutuamente.` };
}
