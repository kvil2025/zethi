// ─── Arquetipos junguianos (modelo de 12) + Test interactivo ────────────────
// Cada respuesta suma puntos ponderados a uno o más arquetipos.
// El resultado entrega arquetipo primario y secundario con porcentajes.

const ARQUETIPOS = {
  inocente: { nombre: "Inocente", lema: "La vida puede ser simple y buena", don: "Optimismo y confianza" },
  explorador: { nombre: "Explorador", lema: "No me encierres", don: "Autonomía y búsqueda de autenticidad" },
  sabio: { nombre: "Sabio", lema: "La verdad te hará libre", don: "Análisis, claridad y visión profunda" },
  heroe: { nombre: "Héroe", lema: "Donde hay voluntad, hay camino", don: "Coraje y disciplina" },
  rebelde: { nombre: "Rebelde", lema: "Las reglas se hicieron para romperse", don: "Cambio radical y valentía" },
  mago: { nombre: "Mago", lema: "Hago que las cosas sucedan", don: "Transformación y visión sistémica" },
  amante: { nombre: "Amante", lema: "Solo tengo ojos para ti", don: "Pasión, conexión y estética" },
  bufon: { nombre: "Bufón", lema: "Solo se vive una vez", don: "Alegría, ligereza y perspectiva" },
  cuidador: { nombre: "Cuidador", lema: "Ama a tu prójimo como a ti mismo", don: "Generosidad y protección" },
  creador: { nombre: "Creador", lema: "Si lo puedes imaginar, lo puedes crear", don: "Imaginación y expresión" },
  rey: { nombre: "Rey Protector", lema: "El poder no lo es todo, es lo único", don: "Liderazgo, orden y prosperidad" },
  comun: { nombre: "Hombre/Mujer Común", lema: "Todas las personas son iguales", don: "Empatía, realismo y pertenencia" },
};

// 12 preguntas. Cada opción reparte puntos entre arquetipos.
const TEST = [
  {
    id: 1,
    pregunta: "Cuando enfrentas un problema grande, tu primer impulso es…",
    opciones: [
      { texto: "Organizar un plan y asignar responsabilidades", puntos: { rey: 3, heroe: 1 } },
      { texto: "Investigar a fondo antes de actuar", puntos: { sabio: 3 } },
      { texto: "Buscar una solución creativa que nadie haya intentado", puntos: { creador: 2, mago: 2 } },
      { texto: "Preguntar cómo afecta a las personas involucradas", puntos: { cuidador: 3, amante: 1 } },
    ],
  },
  {
    id: 2,
    pregunta: "¿Qué te quita el sueño con más frecuencia?",
    opciones: [
      { texto: "Sentir que no tengo el control de la situación", puntos: { rey: 3 } },
      { texto: "Que la rutina me atrape y deje de crecer", puntos: { explorador: 3, rebelde: 1 } },
      { texto: "No estar aprovechando todo mi potencial creativo", puntos: { creador: 3 } },
      { texto: "Que alguien que quiero lo esté pasando mal", puntos: { cuidador: 3 } },
    ],
  },
  {
    id: 3,
    pregunta: "En un grupo de trabajo, naturalmente terminas siendo…",
    opciones: [
      { texto: "Quien lidera y toma las decisiones difíciles", puntos: { rey: 3, heroe: 1 } },
      { texto: "Quien aporta los datos y la mirada estratégica", puntos: { sabio: 3 } },
      { texto: "Quien mantiene el ánimo y une al equipo", puntos: { bufon: 2, comun: 2 } },
      { texto: "Quien desafía la forma en que siempre se han hecho las cosas", puntos: { rebelde: 3 } },
    ],
  },
  {
    id: 4,
    pregunta: "El éxito, para ti, se parece más a…",
    opciones: [
      { texto: "Construir algo próspero que proteja a los míos", puntos: { rey: 2, cuidador: 2 } },
      { texto: "Vivir con total libertad, sin ataduras", puntos: { explorador: 3 } },
      { texto: "Dominar mi disciplina y ser reconocido por ello", puntos: { heroe: 2, sabio: 1 } },
      { texto: "Dejar una obra o legado que me trascienda", puntos: { creador: 2, mago: 2 } },
    ],
  },
  {
    id: 5,
    pregunta: "Cuando algo te parece injusto…",
    opciones: [
      { texto: "Actúo de frente, aunque me cueste caro", puntos: { rebelde: 3, heroe: 1 } },
      { texto: "Busco entender todas las versiones antes de opinar", puntos: { sabio: 2, comun: 1 } },
      { texto: "Protejo primero a los más vulnerables", puntos: { cuidador: 3 } },
      { texto: "Uso mi posición o red de contactos para corregirlo", puntos: { rey: 3 } },
    ],
  },
  {
    id: 6,
    pregunta: "Tu forma favorita de recargar energía es…",
    opciones: [
      { texto: "Un viaje o panorama nuevo, lejos de lo conocido", puntos: { explorador: 3 } },
      { texto: "Tiempo de calidad con las personas que amo", puntos: { amante: 3, comun: 1 } },
      { texto: "Silencio, lectura o aprender algo nuevo", puntos: { sabio: 3 } },
      { texto: "Reírme y no tomarme nada demasiado en serio", puntos: { bufon: 3 } },
    ],
  },
  {
    id: 7,
    pregunta: "¿Cuál de estas frases te representa mejor?",
    opciones: [
      { texto: "Si quieres que algo salga bien, hazlo tú mismo", puntos: { rey: 2, heroe: 2 } },
      { texto: "Todo pasa por algo", puntos: { inocente: 2, mago: 2 } },
      { texto: "Prefiero pedir perdón que pedir permiso", puntos: { rebelde: 3 } },
      { texto: "El detalle hace la diferencia", puntos: { amante: 2, creador: 2 } },
    ],
  },
  {
    id: 8,
    pregunta: "Frente a un cambio inesperado y fuerte…",
    opciones: [
      { texto: "Lo transformo en una oportunidad", puntos: { mago: 3 } },
      { texto: "Confío en que las cosas se van a acomodar", puntos: { inocente: 3 } },
      { texto: "Me adapto rápido, siempre he sido flexible", puntos: { explorador: 2, comun: 2 } },
      { texto: "Reorganizo todo para retomar el control", puntos: { rey: 3 } },
    ],
  },
  {
    id: 9,
    pregunta: "Lo que más valoras en otras personas es…",
    opciones: [
      { texto: "La lealtad", puntos: { rey: 2, cuidador: 2 } },
      { texto: "La inteligencia", puntos: { sabio: 3 } },
      { texto: "La autenticidad", puntos: { explorador: 2, rebelde: 2 } },
      { texto: "La calidez", puntos: { amante: 2, comun: 2 } },
    ],
  },
  {
    id: 10,
    pregunta: "Tu mayor miedo (aunque cueste admitirlo) es…",
    opciones: [
      { texto: "El caos: perder lo que he construido", puntos: { rey: 3 } },
      { texto: "Ser engañado o vivir en la ignorancia", puntos: { sabio: 3 } },
      { texto: "La mediocridad: pasar por la vida sin destacar", puntos: { heroe: 2, creador: 2 } },
      { texto: "La soledad: no ser querido", puntos: { amante: 3 } },
    ],
  },
  {
    id: 11,
    pregunta: "Si mañana te ganaras un premio grande de dinero…",
    opciones: [
      { texto: "Invierto: quiero que ese dinero trabaje y crezca", puntos: { rey: 3 } },
      { texto: "Financio ese proyecto propio que tengo pendiente", puntos: { creador: 3 } },
      { texto: "Aseguro primero a mi familia y cercanos", puntos: { cuidador: 3 } },
      { texto: "Me tomo un año sabático para recorrer el mundo", puntos: { explorador: 3, bufon: 1 } },
    ],
  },
  {
    id: 12,
    pregunta: "¿Cómo te gustaría que te recuerden?",
    opciones: [
      { texto: "Como alguien que construyó y dejó a otros mejor parados", puntos: { rey: 2, cuidador: 2 } },
      { texto: "Como alguien sabio, que siempre tenía una respuesta", puntos: { sabio: 3 } },
      { texto: "Como alguien libre, que vivió a su manera", puntos: { explorador: 2, rebelde: 2 } },
      { texto: "Como alguien que transformó su entorno", puntos: { mago: 2, heroe: 2 } },
    ],
  },
];

/**
 * respuestas: [{ preguntaId, opcionIndex }]
 * Retorna primario y secundario con porcentajes normalizados.
 */
function calcularArquetipo(respuestas) {
  const puntajes = Object.fromEntries(Object.keys(ARQUETIPOS).map((k) => [k, 0]));
  for (const r of respuestas) {
    const pregunta = TEST.find((p) => p.id === r.preguntaId);
    if (!pregunta) continue;
    const opcion = pregunta.opciones[r.opcionIndex];
    if (!opcion) continue;
    for (const [arq, pts] of Object.entries(opcion.puntos)) puntajes[arq] += pts;
  }
  const total = Object.values(puntajes).reduce((a, b) => a + b, 0) || 1;
  const ranking = Object.entries(puntajes)
    .map(([clave, pts]) => ({ clave, ...ARQUETIPOS[clave], porcentaje: Math.round((pts / total) * 100) }))
    .sort((a, b) => b.porcentaje - a.porcentaje);
  return { primario: ranking[0], secundario: ranking[1], ranking };
}

module.exports = { ARQUETIPOS, TEST, calcularArquetipo };
