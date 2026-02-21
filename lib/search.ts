import Fuse from 'fuse.js';
import { getAllProducts, Product } from './products';

export interface SearchItem {
  title: string;
  url: string;
  description: string;
  type: 'product' | 'page';
  category?: string;
}

export function buildSearchIndex(): SearchItem[] {
  const products = getAllProducts();
  return products.map((p) => ({
    title: p.partNumber,
    url: `/products/${p.category === 'tft' ? 'tft-displays' : p.category === 'amoled' ? 'amoled-displays' : p.category === 'pmoled' ? 'pmoled-displays' : p.category === 'ofm' ? 'open-frame-monitors' : p.category === 'character' ? 'character-lcd' : p.category === 'graphic' ? 'graphic-lcd' : p.category === 'smart' ? 'smart-displays' : p.category === 'touch' ? 'touch-panels' : p.category}`,
    description: `${p.diagonalSize}" ${p.resolution} ${p.interface} ${p.brightness}`,
    type: 'product' as const,
    category: p.category,
  }));
}

export function createFuseInstance(items: SearchItem[]) {
  return new Fuse(items, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'description', weight: 1 },
      { name: 'category', weight: 1.5 },
    ],
    threshold: 0.3,
    includeScore: true,
  });
}
