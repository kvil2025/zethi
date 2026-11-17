import { calcularArquetipo, TEST } from "./frontend/api/lib/archetypes.js";

try {
  const respuestas = [{ preguntaId: 1, opcionIndex: 0 }];
  const res = calcularArquetipo(respuestas);
  console.log("Calculated:", res);
} catch (e) {
  console.error("Error:", e);
}
