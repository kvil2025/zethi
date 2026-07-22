// ─── Motor de Numerología (escala pitagórica) ────────────────────────────────
// Calcula: Camino de Vida, Número de Destino (Expresión) y Año Personal.
// Conserva los números maestros 11, 22 y 33.

const TABLA_PITAGORICA = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5, ñ: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const MAESTROS = new Set([11, 22, 33]);

function reducir(n) {
  while (n > 9 && !MAESTROS.has(n)) {
    n = String(n).split("").reduce((acc, d) => acc + Number(d), 0);
  }
  return n;
}

function sumarDigitos(str) {
  return String(str).replace(/\D/g, "").split("").reduce((a, d) => a + Number(d), 0);
}

/** Camino de vida a partir de fecha ISO "YYYY-MM-DD" */
function caminoDeVida(fechaISO) {
  const [y, m, d] = fechaISO.split("-").map(Number);
  const suma = reducir(sumarDigitos(y)) + reducir(m) + reducir(d);
  return reducir(suma);
}

/** Número de destino (expresión) a partir del nombre completo */
function numeroDestino(nombreCompleto) {
  const letras = nombreCompleto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\u0303/g, "\u0303") // conserva la ñ
    .replace(/[\u0300-\u0302\u0304-\u036f]/g, "")
    .replace(/[^a-zñ]/g, "");
  const suma = letras.split("").reduce((acc, l) => acc + (TABLA_PITAGORICA[l] || 0), 0);
  return reducir(suma);
}

/** Año personal: día + mes de nacimiento + año en curso */
function anioPersonal(fechaISO, hoy = new Date()) {
  const [, m, d] = fechaISO.split("-").map(Number);
  const suma = reducir(d) + reducir(m) + reducir(sumarDigitos(hoy.getFullYear()));
  return reducir(suma);
}

const SIGNIFICADOS = {
  1: "Liderazgo, independencia y capacidad de iniciar proyectos.",
  2: "Diplomacia, sensibilidad y talento para la colaboración.",
  3: "Creatividad, comunicación y expresión personal.",
  4: "Estructura, disciplina y construcción de bases sólidas.",
  5: "Libertad, adaptabilidad y amor por el cambio.",
  6: "Cuidado, responsabilidad y armonía en las relaciones.",
  7: "Introspección, análisis y búsqueda de sabiduría.",
  8: "Poder material, gestión y ambición constructiva.",
  9: "Compasión, visión humanitaria y cierres de ciclo.",
  11: "Intuición elevada, inspiración y sensibilidad espiritual (maestro).",
  22: "El gran constructor: visión y capacidad de materializar en grande (maestro).",
  33: "Maestría en el servicio y la enseñanza compasiva (maestro).",
};

function perfilNumerologico({ nombreCompleto, fechaNacimiento }) {
  const vida = caminoDeVida(fechaNacimiento);
  const destino = numeroDestino(nombreCompleto);
  const anio = anioPersonal(fechaNacimiento);
  return {
    caminoDeVida: { numero: vida, significado: SIGNIFICADOS[vida] },
    destino: { numero: destino, significado: SIGNIFICADOS[destino] },
    anioPersonal: { numero: anio, significado: SIGNIFICADOS[anio] },
  };
}

module.exports = { perfilNumerologico, caminoDeVida, numeroDestino, anioPersonal };
