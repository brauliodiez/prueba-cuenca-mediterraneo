import { EmbalsesAndalucia } from "../api";

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
 * Extrae el nombre de la provincia de una fila de encabezado.
 * @param $row - Elemento cheerio que representa una fila de tabla
 * @returns El nombre de la provincia o null si no es una fila de encabezado
 */
export function extractProvinceFromRow($row: any): string | null {
  const provinceHeader = $row.find('th[colspan="2"]');
  const detectedProvince = provinceHeader.text().trim();

  // Verificar que sea realmente una provincia (no fechas ni otros encabezados)
  if (
    detectedProvince &&
    !detectedProvince.includes("Fecha Actual") &&
    !detectedProvince.includes("TOTAL") &&
    !detectedProvince.includes("D.H.") &&
    detectedProvince !== "" &&
    detectedProvince !== "&nbsp"
  ) {
    return detectedProvince;
  }

  return null;
}

/**
 * Verifica si una fila es una fila de datos de embalse (tiene celdas td).
 * @param $row - Elemento cheerio que representa una fila de tabla
 * @returns true si es una fila de datos de embalse
 */
export function isReservoirDataRow($row: any): boolean {
  const cells = $row.find("td");
  return cells.length >= 10; // Una fila de embalse tiene al menos 10 columnas
}

/**
 * Extrae las secciones de provincia de la tabla principal.
 * @param $ - Instancia de cheerio
 * @returns Array de objetos con provincia y sus filas de datos
 */
export function extractProvinceTables(
  $: any
): Array<{ province: string; rows: any[] }> {
  const provinceTables: Array<{ province: string; rows: any[] }> = [];
  let currentProvince = "";
  let currentRows: any[] = [];

  $("table tbody tr").each((_: any, row: any) => {
    const $row = $(row);

    // Intentar extraer provincia de la fila
    const provincia = extractProvinceFromRow($row);
    if (provincia) {
      // Si ya teníamos una provincia anterior, guardar sus datos
      if (currentProvince && currentRows.length > 0) {
        provinceTables.push({
          province: currentProvince,
          rows: [...currentRows],
        });
      }

      // Iniciar nueva provincia
      currentProvince = provincia;
      currentRows = [];
      return;
    }

    // Si es una fila de datos de embalse, agregarla a la provincia actual
    if (isReservoirDataRow($row) && currentProvince) {
      currentRows.push($row);
    }
  });

  // No olvidar la última provincia
  if (currentProvince && currentRows.length > 0) {
    provinceTables.push({
      province: currentProvince,
      rows: [...currentRows],
    });
  }

  return provinceTables;
}

/**
 * Procesa todas las filas de embalses de una provincia específica.
 * @param rows - Array de filas de cheerio
 * @param province - Nombre de la provincia
 * @param $ - Instancia de cheerio
 * @returns Array de embalses procesados
 */
export function reservoirInfoFromTable(
  rows: any[],
  province: string,
  $: any
): EmbalsesAndalucia[] {
  const reservoirs: EmbalsesAndalucia[] = [];

  rows.forEach((row) => {
    const reservoir = processReservoirRow(row, $, province);
    if (reservoir) {
      reservoirs.push(reservoir);
    }
  });

  return reservoirs;
}

/**
 * Procesa una fila de datos de embalse y devuelve el objeto EmbalsesAndalucia.
 * @param $row - Elemento cheerio que representa una fila de tabla
 * @param $ - Instancia de cheerio para procesar elementos
 * @param provincia - Nombre de la provincia actual
 * @returns El embalse parseado o null si no se pudo procesar
 */
export function processReservoirRow(
  $row: any,
  $: any,
  provincia: string
): EmbalsesAndalucia | null {
  const cols = extractTableCellsText($row, $);
  return parseReservoirRow(cols, provincia);
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
