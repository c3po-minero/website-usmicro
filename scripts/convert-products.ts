#!/usr/bin/env node
// @ts-nocheck
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT = process.argv[2] || path.join(__dirname, '../../.openclaw/workspace/working/usmicro/docs/USMP-Product-List-Q4.xlsx');
const OUTPUT_DIR = path.join(__dirname, '../data/products');

const SHEET_MAP: Record<string, string> = {
  'TFT': 'tft',
  'Smart': 'smart',
  'Touch': 'touch',
  'AMOLED': 'amoled',
  'PMOLED': 'pmoled',
  'OFM': 'ofm',
  'Graphic': 'graphic',
  'Character': 'character',
  'Tablet': 'tablets',
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const wb = XLSX.readFile(INPUT);

for (const [sheetName, fileName] of Object.entries(SHEET_MAP)) {
  const ws = wb.Sheets[sheetName];
  if (!ws) { console.warn(`Sheet "${sheetName}" not found`); continue; }
  
  const rows = XLSX.utils.sheet_to_json(ws);
  const products = rows.map((row: any) => ({
    partNumber: String(row['Part Number'] || '').trim(),
    diagonalSize: String(row['Diagonal Size'] || '').trim(),
    resolution: String(row['Resolution'] || '').trim(),
    interface: String(row['Interface'] || '').trim(),
    viewingAngle: String(row['Viewing Angle'] || '').trim(),
    contrastRatio: String(row['Contrast Ratio'] || '').trim(),
    brightness: String(row['Brightness'] || '').trim(),
    operatingTemp: String(row['Operating Temp.'] || row['Operating Temp'] || '').trim(),
    touchPanel: String(row['Touch Panel'] || '').trim(),
    datasheetUrl: String(row['Datasheet'] || '').trim(),
    category: fileName,
  })).filter((p: any) => p.partNumber);

  const outPath = path.join(OUTPUT_DIR, `${fileName}.json`);
  fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
  console.log(`${fileName}.json: ${products.length} products`);
}

console.log('Done!');
