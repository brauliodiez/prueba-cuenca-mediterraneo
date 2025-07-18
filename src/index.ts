import path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { scrapeAndalucia } from "./scraper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const data = await scrapeAndalucia();
  const outputDir = path.join(__dirname, "..", "output");
  const filePath = path.join(outputDir, "embalsesAndalucia.json");

  // Asegurarse de que la carpeta output existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data saved to ${filePath}`);
} catch (error) {
  console.error("Error scraping data:", error);
}
