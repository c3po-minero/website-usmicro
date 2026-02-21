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
  const [filterInterface, setFilterInterface] = useState('');
  const [filterTouch, setFilterTouch] = useState('');
  const [filterTemp, setFilterTemp] = useState('');

  // Extract unique values for filters
  const uniqueInterfaces = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.interface.split(/[\/,]/).forEach((i) => set.add(i.trim()));
    });
    return Array.from(set).sort();
  }, [products]);

  const uniqueTouch = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.touchPanel || 'N/A'));
    return Array.from(set).sort();
  }, [products]);

  const uniqueTemp = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.operatingTemp) set.add(p.operatingTemp); });
    return Array.from(set).sort();
  }, [products]);

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
    if (filterInterface) {
      result = result.filter((p) => p.interface.includes(filterInterface));
    }
    if (filterTouch) {
      result = result.filter((p) => {
        const touch = p.touchPanel || 'N/A';
        return filterTouch === 'N/A' ? (touch === 'N/A' || touch === '-' || touch === '') : touch === filterTouch;
      });
    }
    if (filterTemp) {
      result = result.filter((p) => p.operatingTemp === filterTemp);
    }
    result.sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [products, search, sortKey, sortDir, filterInterface, filterTouch, filterTemp]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: 'diagonalSize', label: 'Size' },
    { key: 'partNumber', label: 'Part Number' },
    { key: 'resolution', label: 'Resolution' },
    { key: 'interface', label: 'Interface' },
    { key: 'brightness', label: 'Brightness' },
    { key: 'operatingTemp', label: 'Temp Range' },
    { key: 'touchPanel', label: 'Touch' },
  ];

  return (
    <div>
      {/* Filter controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-interface" className="text-[0.8125rem] font-semibold text-gray-700">Interface:</label>
          <select
            id="filter-interface"
            value={filterInterface}
            onChange={(e) => setFilterInterface(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10"
            aria-label="Filter by interface"
          >
            <option value="">All</option>
            {uniqueInterfaces.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-touch" className="text-[0.8125rem] font-semibold text-gray-700">Touch:</label>
          <select
            id="filter-touch"
            value={filterTouch}
            onChange={(e) => setFilterTouch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10"
            aria-label="Filter by touch type"
          >
            <option value="">All</option>
            {uniqueTouch.map((t) => <option key={t} value={t}>{t === 'N/A' || t === '-' || t === '' ? 'None' : t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-temp" className="text-[0.8125rem] font-semibold text-gray-700">Temp:</label>
          <select
            id="filter-temp"
            value={filterTemp}
            onChange={(e) => setFilterTemp(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10"
            aria-label="Filter by temperature range"
          >
            <option value="">All</option>
            {uniqueTemp.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input
            type="text"
            id="product-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by part number..."
            className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10 w-[200px]"
            aria-label="Search products"
          />
        </div>
      </div>

      {/* Table */}
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
            {filtered.map((product, idx) => (
              <tr key={product.partNumber} className={`hover:bg-blue-light border-b border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                <td className="px-4 py-3 text-gray-700">{product.diagonalSize}&quot;</td>
                <td className="px-4 py-3 font-semibold text-navy">{product.partNumber}</td>
                <td className="px-4 py-3 text-gray-700">{product.resolution}</td>
                <td className="px-4 py-3 text-gray-700">{product.interface}</td>
                <td className="px-4 py-3 text-gray-700">{product.brightness}</td>
                <td className="px-4 py-3 text-gray-700">{product.operatingTemp}</td>
                <td className="px-4 py-3">
                  {product.touchPanel && product.touchPanel !== 'N/A' && product.touchPanel !== '-' ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[0.6875rem] font-semibold">{product.touchPanel}</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[0.6875rem] font-semibold">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 whitespace-nowrap">
                    {product.datasheetUrl && (
                      <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 text-[0.8125rem] font-semibold text-blue-mid hover:text-accent" aria-label={`Download datasheet for ${product.partNumber} (PDF)`}>
                        <i className="fas fa-file-pdf" /> PDF
                      </a>
                    )}
                    <Link href={`/support/request-quote?part=${product.partNumber}`} className="inline-flex items-center gap-1 px-3 py-1 text-[0.8125rem] font-semibold bg-accent text-white rounded hover:bg-accent-hover transition-colors">
                      Quote
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[0.8125rem] text-gray-500">
        Showing {filtered.length} of {products.length} products.
        {' '}<Link href="/contact" className="text-blue-mid hover:text-accent">Request a custom configuration</Link>
      </p>
    </div>
  );
}
