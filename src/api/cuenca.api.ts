import axios from "axios";

const URL = "https://www.redhidrosurmedioambiente.es/saih/resumen/embalses";

/**
 * Obtiene el contenido HTML de la página de embalses de Andalucía.
 * @returns Promise que resuelve con el HTML de la página
 */
export async function getCuencaPageHTMLContent(): Promise<string> {
  const { data: html } = await axios.get(URL);
  return html;
}
