import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { EmbalsesAndalucia, Province } from './interfaceAndalucia';

const url = 'https://www.redhidrosurmedioambiente.es/saih/resumen/embalses';

export async function scrapeAndalucia(): Promise<Province> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const reservoirs: Province = {};
  let currentProvince = '';

  $('table tbody tr').each((_, row) => {
    const $row = $(row);
    const provinceCell = $row.find('th[colspan="2"]');
    const province = provinceCell.text().trim();

    if (province) {
      currentProvince = province;
    }

    const cols = $row
      .find('td')
      .map((_, el) => $(el).text().trim())
      .get();

    if (cols.length >= 10) {
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

      const reservoir: EmbalsesAndalucia = {
        id: parseInt(id, 10),
        embalse,
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

      if (!reservoirs[currentProvince]) reservoirs[currentProvince] = [];
      reservoirs[currentProvince].push(reservoir);
    }
  });

  return reservoirs;
}

