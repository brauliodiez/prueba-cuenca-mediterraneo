import { EmbalsesAndalucia } from "../api";
import { EmbalseUpdateSAIH } from "../db-model/db.model";

/**
 * Maps EmbalsesAndalucia data to EmbalseUpdateSAIH format.
 * @param embalsesAndalucia - Array of EmbalsesAndalucia objects
 * @returns Array of EmbalseUpdateSAIH objects
 */
export function mapToEmbalseUpdateSAIH(
  embalsesAndalucia: EmbalsesAndalucia[]
): EmbalseUpdateSAIH[] {
  const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  return embalsesAndalucia.map((embalse) => ({
    id: embalse.id,
    nombre: embalse.embalse,
    aguaActualSAIH: embalse.volumenActualHm3,
    fechaMedidaSAIH: currentDate,
  }));
}
