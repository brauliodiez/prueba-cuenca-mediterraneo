import * as cheerio from "cheerio";
import { EmbalsesAndalucia, getCuencaPageHTMLContent } from "../api";
import { extractProvinceTables, reservoirInfoFromTable } from "./business";

/**
 * Scrapes Andalusian reservoir data and returns it as an array.
 */
export async function scrapeAndalucia(): Promise<EmbalsesAndalucia[]> {
  const html = await getCuencaPageHTMLContent();
  const $ = cheerio.load(html);

  // Extract tables organized by province
  const provinceTables = extractProvinceTables($);

  // Process each province table and flatten the results
  const allReservoirs = provinceTables.flatMap((table) => {
    return reservoirInfoFromTable(table.rows, table.province, $);
  });

  return allReservoirs;
}
