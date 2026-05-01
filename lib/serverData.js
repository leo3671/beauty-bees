import fs from 'fs';
import path from 'path';

export function getLiveProducts() {
  const dataFilePath = path.join(process.cwd(), 'data.json');
  try {
    if (fs.existsSync(dataFilePath)) {
      return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }
  } catch (e) {
    console.error("Could not read data.json", e);
  }
  return [];
}
