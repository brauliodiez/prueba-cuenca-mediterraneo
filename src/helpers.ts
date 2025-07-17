import { EmbalsesAndalucia } from "./cuenca.model";

/**
 * Extrae el contenido de texto de todas las celdas (td) de una fila de tabla.
 * @param $row - Elemento cheerio que representa una fila de tabla
 * @param $ - Instancia de cheerio para procesar elementos
 * @returns Array de strings con el contenido de texto de cada celda
 */
export function extractTableCellsText($row: any, $: any): string[] {
  return $row
    .find("td")
    .map((_: any, el: any) => $(el).text().trim())
    .get();
}

/**
 * Parsea una fila HTML de la tabla de embalses y devuelve un objeto con los datos.
 */
export function parseReservoirRow(
  cols: string[],
  provincia: string
): EmbalsesAndalucia | null {
  if (cols.length < 10) return null;

  const [
    id,
    embalse,
    porcentajeActual,
    capacidadTotalHm3,
    acumuladoHoyMm,
    volumenActualHm3,
    acumuladoSemanaAnteriorMm,
    volumenSemanaAnteriorHm3,
    acumuladoAnioAnteriorMm,
    volumenAnioAnteriorHm3,
    grafico,
  ] = cols;

  return {
    id: parseInt(id, 10),
    embalse,
    provincia,
    porcentajeActual: parseFloat(porcentajeActual),
    capacidadTotalHm3: parseFloat(capacidadTotalHm3),
    acumuladoHoyMm: parseFloat(acumuladoHoyMm),
    volumenActualHm3: parseFloat(volumenActualHm3),
    acumuladoSemanaAnteriorMm: parseFloat(acumuladoSemanaAnteriorMm),
    volumenSemanaAnteriorHm3: parseFloat(volumenSemanaAnteriorHm3),
    acumuladoAnioAnteriorMm: parseFloat(acumuladoAnioAnteriorMm),
    volumenAnioAnteriorHm3: parseFloat(volumenAnioAnteriorHm3),
    grafico,
  };
}
