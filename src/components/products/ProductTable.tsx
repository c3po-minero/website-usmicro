'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Product {
  partNumber: string;
  diagonalSize: string;
  resolution: string;
  interface: string;
  viewingAngle: string;
  contrastRatio: string;
  brightness: string;
  operatingTemp: string;
  touchPanel: string;
  datasheetUrl: string;
}

interface ProductTableProps {
  products: Product[];
  categoryName: string;
}

type SortKey = keyof Product;
type SortDir = 'asc' | 'desc';

export default function ProductTable({ products, categoryName }: ProductTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('partNumber');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.partNumber.toLowerCase().includes(q) ||
        p.resolution.toLowerCase().includes(q) ||
        p.interface.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [products, search, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: 'partNumber', label: 'Part Number' },
    { key: 'diagonalSize', label: 'Size' },
    { key: 'resolution', label: 'Resolution' },
    { key: 'interface', label: 'Interface' },
    { key: 'brightness', label: 'Brightness' },
    { key: 'touchPanel', label: 'Touch' },
    { key: 'operatingTemp', label: 'Temp Range' },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <label htmlFor="product-search" className="text-[0.8125rem] font-semibold text-gray-700">Search:</label>
        <input
          type="text"
          id="product-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${categoryName}...`}
          className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10"
        />
        <span className="text-[0.8125rem] text-gray-500">{filtered.length} of {products.length} products</span>
      </div>
      <div className="product-table-wrap border border-gray-200 rounded-xl">
        <table className="w-full border-collapse text-[0.8125rem] whitespace-nowrap" aria-label={`${categoryName} specifications`}>
          <thead className="bg-navy">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3.5 text-left text-white font-semibold text-xs uppercase tracking-wider cursor-pointer hover:bg-blue select-none"
                  onClick={() => handleSort(col.key)}
                  aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  scope="col"
                >
                  {col.label}
                  <i className={`fas fa-sort ml-1 opacity-50 text-[0.625rem] ${sortKey === col.key ? 'opacity-100' : ''}`} />
                </th>
              ))}
              <th className="px-4 py-3.5 text-left text-white font-semibold text-xs uppercase tracking-wider" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.partNumber} className="hover:bg-blue-light border-b border-gray-100">
                <td className="px-4 py-3 font-semibold text-navy">{product.partNumber}</td>
                <td className="px-4 py-3 text-gray-700">{product.diagonalSize}&quot;</td>
                <td className="px-4 py-3 text-gray-700">{product.resolution}</td>
                <td className="px-4 py-3 text-gray-700">{product.interface}</td>
                <td className="px-4 py-3 text-gray-700">{product.brightness}</td>
                <td className="px-4 py-3">
                  {product.touchPanel && product.touchPanel !== 'N/A' && product.touchPanel !== '-' ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[0.6875rem] font-semibold">{product.touchPanel}</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[0.6875rem] font-semibold">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">{product.operatingTemp}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 whitespace-nowrap">
                    {product.datasheetUrl && (
                      <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 text-[0.8125rem] font-semibold text-blue-mid hover:text-accent" aria-label={`Download datasheet for ${product.partNumber} (PDF)`}>
                        <i className="fas fa-file-pdf" /> PDF
                      </a>
                    )}
                    <Link href={`/support/request-quote?part=${product.partNumber}`} className="inline-flex items-center gap-1 px-2 py-1 text-[0.8125rem] font-semibold text-accent hover:text-accent-hover">
                      <i className="fas fa-file-alt" /> Quote
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
