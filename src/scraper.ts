import axios from "axios";
import * as cheerio from "cheerio";
import { EmbalsesAndalucia, Province } from "./cuenca.model";
import { parseReservoirRow } from "./helpers";

const URL = "https://www.redhidrosurmedioambiente.es/saih/resumen/embalses";


/**
 * Scrapea los datos de embalses de Andalucía y los organiza por provincia.
 */
export async function scrapeAndalucia(): Promise<Province> {
  const { data: html } = await axios.get(URL);
  const $ = cheerio.load(html);

  const provinces: Province = {};
  let currentProvince = "";

  $("table tbody tr").each((_, row) => {
    const $row = $(row);
    const provinceHeader = $row.find('th[colspan="2"]');
    const detectedProvince = provinceHeader.text().trim();

    if (detectedProvince) {
      currentProvince = detectedProvince;
    }

    const cols = $row
      .find("td")
      .map((_, el) => $(el).text().trim())
      .get();

    const reservoir = parseReservoirRow(cols);

    if (reservoir) {
      if (!provinces[currentProvince]) {
        provinces[currentProvince] = [];
      }
      provinces[currentProvince].push(reservoir);
    }
  });

  return provinces;
}
