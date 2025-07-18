import * as cheerio from "cheerio";
import { EmbalsesAndalucia, getCuencaPageHTMLContent } from "../api";
import { EmbalseUpdateSAIH } from "../db-model/db.model";
import { extractProvinceTables, reservoirInfoFromTable } from "./business";
import { mapToEmbalseUpdateSAIH } from "./mapper";

/**
 * Scrapes Andalusian reservoir data and returns it as an array.
 */
export async function scrapeCuencaMediterranea(): Promise<EmbalseUpdateSAIH[]> {
  const html = await getCuencaPageHTMLContent();
  const $ = cheerio.load(html);

  // Extract tables organized by province
  const provinceTables = extractProvinceTables($);

  // Process each province table and flatten the results
  const allReservoirs = provinceTables.flatMap((table) => {
    return reservoirInfoFromTable(table.rows, table.province, $);
  });

  // Map to EmbalseUpdateSAIH format
  return mapToEmbalseUpdateSAIH(allReservoirs);
}
