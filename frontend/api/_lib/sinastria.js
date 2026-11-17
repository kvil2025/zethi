// ─── Motor de Sinastría Cósmica y Relaciones Arquetípicas ─────────────────
import { afinidadElemental, signoSolar } from "./astrology.js";
import { sinastriaNumerologica } from "./numerology.js";

// Matriz arquetípica de alianzas
const ALIANZAS = {
  "rey-creador": { titulo: "El Imperio Inspirado", dinamica: "Uno aporta estructura, visión y recursos; el otro llena el mundo de belleza, innovación y significado.", sinergia: 94 },
  "rey-sabio": { titulo: "El Trono de la Claridad", dinamica: "Estrategia impecable basada en datos y visión de largo plazo. Nada queda al azar.", sinergia: 91 },
  "rey-rebelde": { titulo: "La Tensión del Cambio", dinamica: "Poderosa pero eléctrica. El rey busca consolidar orden y el rebelde desafía los límites. Gran crecimiento mutuo si hay respeto.", sinergia: 76 },
  "rey-cuidador": { titulo: "La Fortaleza Protectora", dinamica: "El rey resguarda el perímetro y el cuidador nutre el corazón del hogar o equipo.", sinergia: 93 },
  "mago-creador": { titulo: "Alquimia Pura", dinamica: "Transforman ideas etéreas en realidades palpables que sorprenden al mundo.", sinergia: 96 },
  "sabio-explorador": { titulo: "La Expedición de la Verdad", dinamica: "Uno descubre nuevos territorios y el otro descifra los mapas y las leyes ocultas.", sinergia: 90 },
  "amante-bufon": { titulo: "La Fiesta del Alma", dinamica: "Alegría constante, conexión sensorial y capacidad de no ahogarse en los dramas de la vida.", sinergia: 89 },
  "heroe-cuidador": { titulo: "El Escudo y el Abrazo", dinamica: "Uno libra las batallas afuera y el otro provee refugio incondicional.", sinergia: 92 },
};

function buscarDinamica(arq1, arq2) {
  const k1 = `${arq1}-${arq2}`.toLowerCase();
  const k2 = `${arq2}-${arq1}`.toLowerCase();
  return ALIANZAS[k1] || ALIANZAS[k2] || {
    titulo: "Danza de Espejos Cósmicos",
    dinamica: "Ambos arquetipos se desafían a integrar sus sombras y celebrar sus dones únicos.",
    sinergia: 84
  };
}

export function analizarSinastria({ persona1, persona2, tipo = "pareja" }) {
  const nombre1 = persona1.nombre || "Persona 1";
  const nombre2 = persona2.nombre || "Persona 2";

  const arq1 = persona1.arquetipo?.primario?.clave || "sabio";
  const arq2 = persona2.arquetipo?.primario?.clave || "explorador";

  const sol1 = persona1.carta?.sol || signoSolar(persona1.fechaNacimiento);
  const sol2 = persona2.carta?.sol || signoSolar(persona2.fechaNacimiento);

  const numRelacion = sinastriaNumerologica(persona1.fechaNacimiento, persona2.fechaNacimiento);
  const afinidadSol = afinidadElemental(sol1.elemento, sol2.elemento);
  const dinamicaArq = buscarDinamica(arq1, arq2);

  const porcentajeGlobal = Math.round((dinamicaArq.sinergia * 0.4) + (afinidadSol.porcentaje * 0.35) + (numRelacion.numeroVinculo % 2 === 0 ? 88 * 0.25 : 85 * 0.25));

  return {
    tituloVínculo: dinamicaArq.titulo,
    tipo,
    persona1: { nombre: nombre1, arquetipo: persona1.arquetipo?.primario?.nombre || "Explorador", signo: sol1.signo },
    persona2: { nombre: nombre2, arquetipo: persona2.arquetipo?.primario?.nombre || "Sabio", signo: sol2.signo },
    porcentajeGlobal,
    dinamicaArquetipica: dinamicaArq.dinamica,
    afinidadElemental: afinidadSol,
    numerologiaRelacional: numRelacion,
    consejoMentor: `Para honrar el vínculo ${tipo} entre ${nombre1} y ${nombre2}: reconozcan que cuando ${nombre1} actúa desde su ${persona1.arquetipo?.primario?.nombre || "energía"}, no está compitiendo, sino expresando su naturaleza. Su número de vínculo ${numRelacion.numeroVinculo} les pide poner el foco en ${numRelacion.significado.split('.')[0]}.`
  };
}
