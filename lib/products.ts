import fs from 'fs';
import path from 'path';

export interface Product {
  partNumber: string;
  diagonalSize: string;
  resolution: string;
  interface: string;
  viewingAngle: string;
  contrastRatio: string;
  brightness: string;
  operatingTemp: string;
  touchPanel: string;
  contrast: string;
  panelSize: string;
  color: string;
  bonding: string;
  ic: string;
  datasheetUrl: string;
  category: string;
  [key: string]: string;
}

const dataDir = path.join(process.cwd(), 'data/products');

export const CATEGORIES = [
  { slug: 'tft-displays', file: 'tft.json', name: 'TFT LCD Displays', icon: 'fa-desktop' },
  { slug: 'amoled-displays', file: 'amoled.json', name: 'AMOLED Displays', icon: 'fa-mobile-alt' },
  { slug: 'pmoled-displays', file: 'pmoled.json', name: 'PMOLED Displays', icon: 'fa-lightbulb' },
  { slug: 'character-lcd', file: 'character.json', name: 'Character LCD', icon: 'fa-font' },
  { slug: 'graphic-lcd', file: 'graphic.json', name: 'Graphic LCD', icon: 'fa-th' },
  { slug: 'smart-displays', file: 'smart.json', name: 'Smart Displays', icon: 'fa-microchip' },
  { slug: 'touch-panels', file: 'touch.json', name: 'Touch Panels', icon: 'fa-hand-pointer' },
  { slug: 'open-frame-monitors', file: 'ofm.json', name: 'Open Frame Monitors', icon: 'fa-tv' },
  { slug: 'tablets', file: 'tablets.json', name: 'Tablets', icon: 'fa-tablet-alt' },
] as const;

export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  const filePath = path.join(dataDir, cat.file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getAllProducts(): Product[] {
  return CATEGORIES.flatMap((cat) => {
    const filePath = path.join(dataDir, cat.file);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  });
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
