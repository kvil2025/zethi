// ─── Motor de Numerología Avanzado (Pitagórico + Tránsitos Diarios) ────────
// Calcula: Camino de Vida, Número de Destino, Año Personal, Día Personal y Sinastría.

export const TABLA_PITAGORICA = {
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

export const MAESTROS = new Set([11, 22, 33]);

export function reducir(n) {
  while (n > 9 && !MAESTROS.has(n)) {
    n = String(n).split("").reduce((acc, d) => acc + Number(d), 0);
  }
  return n;
}

export function sumarDigitos(str) {
  return String(str).replace(/\D/g, "").split("").reduce((a, d) => a + Number(d), 0);
}

/** Camino de vida a partir de fecha ISO "YYYY-MM-DD" */
export function caminoDeVida(fechaISO) {
  const [y, m, d] = fechaISO.split("-").map(Number);
  const suma = reducir(sumarDigitos(y)) + reducir(m) + reducir(d);
  return reducir(suma);
}

/** Número de destino a partir del nombre completo */
export function numeroDestino(nombreCompleto) {
  const letras = nombreCompleto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\u0303/g, "\u0303")
    .replace(/[\u0300-\u0302\u0304-\u036f]/g, "")
    .replace(/[^a-zñ]/g, "");
  const suma = letras.split("").reduce((acc, l) => acc + (TABLA_PITAGORICA[l] || 0), 0);
  return reducir(suma);
}

/** Año personal: día + mes de nacimiento + año en curso */
export function anioPersonal(fechaISO, hoy = new Date()) {
  const [, m, d] = fechaISO.split("-").map(Number);
  const suma = reducir(d) + reducir(m) + reducir(sumarDigitos(hoy.getFullYear()));
  return reducir(suma);
}

/** Día personal: Año Personal + Mes Actual + Día Actual */
export function diaPersonal(fechaISO, hoy = new Date()) {
  const anioP = anioPersonal(fechaISO, hoy);
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();
  const suma = anioP + reducir(mesActual) + reducir(diaActual);
  const num = reducir(suma);

  const MENSAJES_DIA = {
    1: { foco: "Nuevos Inicios y Liderazgo", accion: "Inicia ese proyecto o conversación que venías postergando. La iniciativa hoy te favorece.", piedra: "Pirita", color: "Dorado" },
    2: { foco: "Cooperación y Paciencia", accion: "Escucha el doble de lo que hables. Hoy es día de acuerdos diplomáticos, no de confrontar.", piedra: "Piedra Luna", color: "Plata" },
    3: { foco: "Creatividad y Expresión", accion: "Escribe, crea, comparte tus ideas. Tu magnetismo verbal está en su punto alto.", piedra: "Citrino", color: "Amarillo Solar" },
    4: { foco: "Estructura y Orden Práctico", accion: "Organiza tus números, tu espacio o tu agenda. Lo que construyas hoy tendrá raíces fuertes.", piedra: "Hematita", color: "Verde Bosque" },
    5: { foco: "Libertad y Adaptabilidad", accion: "Sal de la rutina. Abre tu mente a lo inesperado; un cambio de planes traerá una oportunidad.", piedra: "Turquesa", color: "Cian Cósmico" },
    6: { foco: "Armonía, Familia y Belleza", accion: "Embellece tu entorno y cuida tus vínculos íntimos. Una palabra afectuosa resolverá tensiones.", piedra: "Cuarzo Rosa", color: "Rosa Cuarzo" },
    7: { foco: "Introspección y Sabiduría", accion: "Evita el ruido exterior y la impulsividad. Medita o reflexiona; recibirás una revelación interna.", piedra: "Amatista", color: "Violeta Profundo" },
    8: { foco: "Materialización y Poder", accion: "Toma decisiones financieras o de negocio con aplomo. Reconoce tu autoridad con humildad.", piedra: "Obsidiana", color: "Bronce Noble" },
    9: { foco: "Cierre de Ciclos y Gratitud", accion: "Suelta lo que ya cumplió su propósito. Limpia tu energía para hacer espacio a lo nuevo.", piedra: "Lapislázuli", color: "Azul Índigo" },
    11: { foco: "Intuición Iluminada (Maestro)", accion: "Confía ciegamente en tus corazonadas hoy. Tu percepción psíquica e intuitiva está amplificada.", piedra: "Selenita", color: "Blanco Iridiscente" },
    22: { foco: "El Gran Arquitecto (Maestro)", accion: "Piensa en grande y a largo plazo. Pon la primera piedra de un legado duradero.", piedra: "Malaquita", color: "Esmeralda Profundo" },
    33: { foco: "Servicio y Compasión Cósmica", accion: "Sé faro para otros sin descuidar tu centro. Tu presencia hoy sana y alinea.", piedra: "Diamante Herkimer", color: "Oro Blanco" },
  };

  return {
    numero: num,
    ...(MENSAJES_DIA[num] || MENSAJES_DIA[1]),
  };
}

/** Sinastría numerológica: calcula el número del vínculo */
export function sinastriaNumerologica(fecha1, fecha2) {
  const c1 = caminoDeVida(fecha1);
  const c2 = caminoDeVida(fecha2);
  const vinculo = reducir(c1 + c2);

  const DINAMICA_VINCULO = {
    1: "Unión de pioneros y dinamismo. Mucha fuerza para emprender juntos, cuidando el choque de egos.",
    2: "Vínculo de profunda empatía y compañerismo. Gran soporte emocional mutuo y sensibilidad.",
    3: "Relación magnética, divertida y creativa. Se inspiran mutuamente a disfrutar la vida y comunicar.",
    4: "Alianza sólida como roca. Gran capacidad de construir patrimonio y estabilidad duradera.",
    5: "Vínculo apasionado y aventurero. Mucho movimiento y estímulo, requiere espacio para no asfixiarse.",
    6: "Conexión de nido y compromiso. Gran calidez hogareña y deseo compartido de cuidar a los suyos.",
    7: "Conexión álmica y espiritual. Conversaciones profundas y silencios compartidos que nutren.",
    8: "Dúo de poder. Mucha capacidad de logro material, éxito profesional y visión compartida de grandeza.",
    9: "Encuentro kármico con propósito de evolución y servicio generoso. Trascendencia y perdón.",
    11: "Espejo espiritual de alta frecuencia. Se despiertan mutuamente dones intuitivos y visión de vida.",
    22: "Unión para materializar sueños de impacto masivo. Una fuerza imparable cuando van hacia el mismo norte.",
  };

  return {
    camino1: c1,
    camino2: c2,
    numeroVinculo: vinculo,
    significado: DINAMICA_VINCULO[vinculo] || "Unión de aprendizaje mutuo y expansión de consciencia.",
  };
}

export const SIGNIFICADOS = {
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

export function perfilNumerologico({ nombreCompleto, fechaNacimiento }) {
  const vida = caminoDeVida(fechaNacimiento);
  const destino = numeroDestino(nombreCompleto);
  const anio = anioPersonal(fechaNacimiento);
  const dia = diaPersonal(fechaNacimiento);
  return {
    caminoDeVida: { numero: vida, significado: SIGNIFICADOS[vida] },
    destino: { numero: destino, significado: SIGNIFICADOS[destino] },
    anioPersonal: { numero: anio, significado: SIGNIFICADOS[anio] },
    diaPersonal: dia,
  };
}
