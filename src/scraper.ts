import * as cheerio from "cheerio";
import { EmbalsesAndalucia } from "./cuenca.model";
import {
  extractProvinceFromRow,
  isReservoirDataRow,
  processReservoirRow,
} from "./helpers";
import { getCuencaPageHTMLContent } from "./cuenca.api";

/**
 * Scrapea los datos de embalses de Andalucía y los devuelve como un array.
 */
export async function scrapeAndalucia(): Promise<EmbalsesAndalucia[]> {
  const html = await getCuencaPageHTMLContent();
  const $ = cheerio.load(html);

  const embalses: EmbalsesAndalucia[] = [];
  let currentProvince = "";

  $("table tbody tr").each((_, row) => {
    const $row = $(row);

    // Intentar extraer provincia de la fila
    const provincia = extractProvinceFromRow($row);
    if (provincia) {
      currentProvince = provincia;
      return; // Continuar con la siguiente fila
    }

    // Verificar si es una fila de datos de embalse
    if (isReservoirDataRow($row) && currentProvince) {
      const reservoir = processReservoirRow($row, $, currentProvince);
      if (reservoir) {
        embalses.push(reservoir);
      }
    }
  });

  return embalses;
}
