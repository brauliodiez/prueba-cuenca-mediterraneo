import path from "path";
import * as fs from "fs";
import { scrapeAndalucia } from "./scraper";

scrapeAndalucia().then((data) => {
  const filePath = path.join(__dirname, "embalsesAndalucia.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data saved to ${filePath}`);
});
