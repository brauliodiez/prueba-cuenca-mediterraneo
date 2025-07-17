import axios from "axios";
import * as cheerio from "cheerio";
import { EmbalsesAndalucia } from "./cuenca.model";
import { parseReservoirRow, extractTableCellsText } from "./helpers";

const URL = "https://www.redhidrosurmedioambiente.es/saih/resumen/embalses";

/**
 * Scrapea los datos de embalses de Andalucía y los devuelve como un array.
 */
export async function scrapeAndalucia(): Promise<EmbalsesAndalucia[]> {
  const { data: html } = await axios.get(URL);
  const $ = cheerio.load(html);

  const embalses: EmbalsesAndalucia[] = [];
  let currentProvince = "";

  $("table tbody tr").each((_, row) => {
    const $row = $(row);
    const provinceHeader = $row.find('th[colspan="2"]');
    const detectedProvince = provinceHeader.text().trim();

    if (detectedProvince) {
      currentProvince = detectedProvince;
    }

    const cols = extractTableCellsText($row, $);

    const reservoir = parseReservoirRow(cols, currentProvince);

    if (reservoir) {
      embalses.push(reservoir);
    }
  });

  return embalses;
}
