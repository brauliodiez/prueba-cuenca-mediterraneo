import path from "path";
import { fileURLToPath } from "url";
import { scrapeAndalucia } from "./scrapper";
import { clearAndCreateDirectory, saveJsonFile } from "./file.helper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const data = await scrapeAndalucia();
  const outputDir = path.join(__dirname, "..", "output");
  const filePath = path.join(outputDir, "embalsesAndalucia.json");

  clearAndCreateDirectory(outputDir);
  saveJsonFile(filePath, data);
} catch (error) {
  console.error("Error scraping data:", error);
}
