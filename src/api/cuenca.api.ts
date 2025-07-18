import axios from "axios";

const URL = "https://www.redhidrosurmedioambiente.es/saih/resumen/embalses";

/**
 * Gets the HTML content from the Andalusian reservoirs page.
 * @returns Promise that resolves with the page HTML
 */
export async function getCuencaPageHTMLContent(): Promise<string> {
  const { data: html } = await axios.get(URL);
  return html;
}
