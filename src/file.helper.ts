import * as fs from "fs";
import path from "path";

export const clearAndCreateDirectory = (dirPath: string): void => {
  // Limpiar carpeta si existe
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }

  // Crear la carpeta
  fs.mkdirSync(dirPath, { recursive: true });
};

export const saveJsonFile = (filePath: string, data: any): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data saved to ${filePath}`);
};
