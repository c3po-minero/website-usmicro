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

const PAGE_SIZE = 20;

export default function ProductTable({ products, categoryName }: ProductTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('partNumber');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterInterface, setFilterInterface] = useState('');
  const [filterTouch, setFilterTouch] = useState('');
  const [filterTemp, setFilterTemp] = useState('');
  const [page, setPage] = useState(1);

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

  // Reset page when filters change
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, filtered.length);
  const paginatedProducts = filtered.length > PAGE_SIZE ? filtered.slice(startIdx, endIdx) : filtered;
  const showPagination = filtered.length > PAGE_SIZE;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
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

  // Generate page numbers to show
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div>
      {/* Filter controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-interface" className="text-[0.8125rem] font-semibold text-gray-700">Interface:</label>
          <select id="filter-interface" value={filterInterface} onChange={handleFilterChange(setFilterInterface)} className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" aria-label="Filter by interface">
            <option value="">All</option>
            {uniqueInterfaces.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-touch" className="text-[0.8125rem] font-semibold text-gray-700">Touch:</label>
          <select id="filter-touch" value={filterTouch} onChange={handleFilterChange(setFilterTouch)} className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" aria-label="Filter by touch type">
            <option value="">All</option>
            {uniqueTouch.map((t) => <option key={t} value={t}>{t === 'N/A' || t === '-' || t === '' ? 'None' : t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-temp" className="text-[0.8125rem] font-semibold text-gray-700">Temp:</label>
          <select id="filter-temp" value={filterTemp} onChange={handleFilterChange(setFilterTemp)} className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" aria-label="Filter by temperature range">
            <option value="">All</option>
            {uniqueTemp.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input type="text" id="product-search" value={search} onChange={handleSearchChange} placeholder="Search by part number..." className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10 w-[200px]" aria-label="Search products" />
        </div>
      </div>

      {/* Table */}
      <div className="product-table-wrap border border-gray-200 rounded-xl">
        <table className="w-full border-collapse text-[0.8125rem] whitespace-nowrap" aria-label={`${categoryName} specifications`}>
          <thead className="bg-navy">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3.5 text-left text-white font-semibold text-xs uppercase tracking-wider cursor-pointer hover:bg-blue select-none" onClick={() => handleSort(col.key)} aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined} scope="col">
                  {col.label}
                  <i className={`fas fa-sort ml-1 opacity-50 text-[0.625rem] ${sortKey === col.key ? 'opacity-100' : ''}`} />
                </th>
              ))}
              <th className="px-4 py-3.5 text-left text-white font-semibold text-xs uppercase tracking-wider" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, idx) => (
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
                      <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 text-[0.8125rem] font-semibold text-blue-mid hover:text-accent-text" aria-label={`Download datasheet for ${product.partNumber} (PDF)`}>
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

      {/* Pagination + count */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.8125rem] text-gray-500 m-0">
          Showing {showPagination ? `${startIdx + 1}–${endIdx}` : filtered.length} of {filtered.length} products{filtered.length !== products.length ? ` (${products.length} total)` : ''}.
          {' '}<Link href="/contact" className="text-blue-mid hover:text-accent-text">Request a custom configuration</Link>
        </p>

        {showPagination && (
          <nav className="flex items-center gap-1" aria-label="Product table pagination">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[0.8125rem] font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left text-[0.625rem]" /> Prev
            </button>
            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-[0.8125rem] font-semibold rounded-md transition-colors ${
                    p === currentPage
                      ? 'bg-navy text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label={`Page ${p}`}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[0.8125rem] font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              Next <i className="fas fa-chevron-right text-[0.625rem]" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
