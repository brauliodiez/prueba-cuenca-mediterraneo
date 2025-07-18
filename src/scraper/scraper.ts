import * as cheerio from "cheerio";
import { EmbalsesAndalucia, getCuencaPageHTMLContent } from "../api";
import { extractProvinceTables, reservoirInfoFromTable } from "./helpers";

/**
 * Scrapea los datos de embalses de Andalucía y los devuelve como un array.
 */
export async function scrapeAndalucia(): Promise<EmbalsesAndalucia[]> {
  const html = await getCuencaPageHTMLContent();
  const $ = cheerio.load(html);

  // Extraer las tablas organizadas por provincia
  const provinceTables = extractProvinceTables($);

  // Procesar cada tabla de provincia y aplanar los resultados
  const allReservoirs = provinceTables.flatMap((table) => {
    return reservoirInfoFromTable(table.rows, table.province, $);
  });

  return allReservoirs;
}
