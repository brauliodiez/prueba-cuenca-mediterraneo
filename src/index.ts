import path from "path";
import { fileURLToPath } from "url";
import { scrapeCuencaMediterranea } from "./scrapper";
import { clearAndCreateDirectory, saveJsonFile } from "./file.helper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL = "https://www.redhidrosurmedioambiente.es/saih/resumen/embalses";

try {
  const data = await scrapeCuencaMediterranea(URL);
  const outputDir = path.join(__dirname, "..", "output");
  const filePath = path.join(outputDir, "embalsesAndalucia.json");

  clearAndCreateDirectory(outputDir);
  saveJsonFile(filePath, data);
} catch (error) {
  console.error("Error scraping data:", error);
}
