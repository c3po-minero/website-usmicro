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
  contrast: string;
  panelSize: string;
  color: string;
  bonding: string;
  ic: string;
  brightness: string;
  operatingTemp: string;
  touchPanel: string;
  datasheetUrl: string;
  [key: string]: string;
}

interface ColumnDef {
  key: string;
  label: string;
  icon?: string;
}

interface ProductTableProps {
  products: Product[];
  categoryName: string;
  categorySlug?: string;
}

type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 20;

// Category-specific column definitions
const CATEGORY_COLUMNS: Record<string, ColumnDef[]> = {
  'amoled-displays': [
    { key: 'diagonalSize', label: 'Size', icon: 'fa-expand-alt' },
    { key: 'partNumber', label: 'Part Number', icon: 'fa-barcode' },
    { key: 'resolution', label: 'Resolution', icon: 'fa-th' },
    { key: 'brightness', label: 'Brightness', icon: 'fa-sun' },
    { key: 'contrast', label: 'Contrast', icon: 'fa-adjust' },
    { key: 'operatingTemp', label: 'Temperature', icon: 'fa-thermometer-half' },
    { key: 'viewingAngle', label: 'Viewing Angles', icon: 'fa-users' },
  ],
  'pmoled-displays': [
    { key: 'diagonalSize', label: 'Size', icon: 'fa-expand-alt' },
    { key: 'partNumber', label: 'Part Number', icon: 'fa-barcode' },
    { key: 'panelSize', label: 'Panel Size', icon: 'fa-ruler-combined' },
    { key: 'resolution', label: 'Resolution', icon: 'fa-th' },
    { key: 'color', label: 'Color', icon: 'fa-palette' },
    { key: 'bonding', label: 'Bonding', icon: 'fa-link' },
    { key: 'ic', label: 'IC', icon: 'fa-microchip' },
    { key: 'interface', label: 'Interface', icon: 'fa-plug' },
  ],
  // Default columns for TFT and others
  default: [
    { key: 'diagonalSize', label: 'Size', icon: 'fa-expand-alt' },
    { key: 'partNumber', label: 'Part Number', icon: 'fa-barcode' },
    { key: 'resolution', label: 'Resolution', icon: 'fa-th' },
    { key: 'interface', label: 'Interface', icon: 'fa-plug' },
    { key: 'brightness', label: 'Brightness', icon: 'fa-sun' },
    { key: 'operatingTemp', label: 'Temp Range', icon: 'fa-thermometer-half' },
    { key: 'touchPanel', label: 'Touch', icon: 'fa-hand-pointer' },
  ],
};

function getColumns(categorySlug?: string): ColumnDef[] {
  if (categorySlug && CATEGORY_COLUMNS[categorySlug]) {
    return CATEGORY_COLUMNS[categorySlug];
  }
  return CATEGORY_COLUMNS.default;
}

export default function ProductTable({ products, categoryName, categorySlug }: ProductTableProps) {
  const columns = getColumns(categorySlug);
  const [search, setSearch] = useState('');
  const [mobileSearch, setMobileSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('partNumber');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterInterface, setFilterInterface] = useState('');
  const [filterTouch, setFilterTouch] = useState('');
  const [filterTemp, setFilterTemp] = useState('');
  const [page, setPage] = useState(1);

  const hasInterface = columns.some(c => c.key === 'interface');
  const hasTouch = columns.some(c => c.key === 'touchPanel');

  const uniqueInterfaces = useMemo(() => {
    if (!hasInterface) return [];
    const set = new Set<string>();
    products.forEach((p) => { p.interface.split(/[\/,]/).forEach((i) => set.add(i.trim())); });
    return Array.from(set).sort();
  }, [products, hasInterface]);

  const uniqueTouch = useMemo(() => {
    if (!hasTouch) return [];
    const set = new Set<string>();
    products.forEach((p) => set.add(p.touchPanel || 'N/A'));
    return Array.from(set).sort();
  }, [products, hasTouch]);

  const uniqueTemp = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.operatingTemp) set.add(p.operatingTemp); });
    return Array.from(set).sort();
  }, [products]);

  const activeSearch = search || mobileSearch;

  const filtered = useMemo(() => {
    let result = products;
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      result = result.filter((p) =>
        columns.some(col => (p[col.key] || '').toLowerCase().includes(q))
      );
    }
    if (filterInterface && hasInterface) result = result.filter((p) => p.interface.includes(filterInterface));
    if (filterTouch && hasTouch) {
      result = result.filter((p) => {
        const touch = p.touchPanel || 'N/A';
        return filterTouch === 'N/A' ? (touch === 'N/A' || touch === '-' || touch === '') : touch === filterTouch;
      });
    }
    if (filterTemp) result = result.filter((p) => p.operatingTemp === filterTemp);
    result.sort((a, b) => {
      const cmp = String(a[sortKey] || '').localeCompare(String(b[sortKey] || ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [products, activeSearch, sortKey, sortDir, filterInterface, filterTouch, filterTemp, columns, hasInterface, hasTouch]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages || 1);
  if (safePage !== page) setPage(safePage);

  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const updateFilter = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  const touchBadge = (touch: string) => {
    if (touch && touch !== 'N/A' && touch !== '-') {
      return <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[0.6875rem] font-semibold">{touch}</span>;
    }
    return <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-[0.6875rem] font-semibold">N/A</span>;
  };

  const renderCellValue = (product: Product, col: ColumnDef) => {
    const val = product[col.key] || '';
    if (col.key === 'diagonalSize') return <>{val}&quot;</>;
    if (col.key === 'partNumber') return <span className="font-semibold text-navy">{val}</span>;
    if (col.key === 'touchPanel') return touchBadge(val);
    return <>{val}</>;
  };

  return (
    <div>
      {/* Mobile search */}
      <div className="md:hidden mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={mobileSearch}
            onChange={(e) => { setMobileSearch(e.target.value); setPage(1); }}
            placeholder="Search part number, resolution..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10"
            aria-label="Search all products"
          />
          <button
            onClick={() => setPage(1)}
            className="px-5 py-3 bg-accent text-white rounded-lg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            <i className="fas fa-search mr-1" /> Search
          </button>
        </div>
      </div>

      {/* Desktop filter controls */}
      <div className="hidden md:flex flex-wrap gap-3 mb-4 items-center">
        {hasInterface && (
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-interface" className="text-[0.8125rem] font-semibold text-gray-700">Interface:</label>
            <select id="filter-interface" value={filterInterface} onChange={(e) => updateFilter(setFilterInterface)(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" aria-label="Filter by interface">
              <option value="">All</option>
              {uniqueInterfaces.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        )}
        {hasTouch && (
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-touch" className="text-[0.8125rem] font-semibold text-gray-700">Touch:</label>
            <select id="filter-touch" value={filterTouch} onChange={(e) => updateFilter(setFilterTouch)(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" aria-label="Filter by touch type">
              <option value="">All</option>
              {uniqueTouch.map((t) => <option key={t} value={t}>{t === 'N/A' || t === '-' || t === '' ? 'None' : t}</option>)}
            </select>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-temp" className="text-[0.8125rem] font-semibold text-gray-700">Temp:</label>
          <select id="filter-temp" value={filterTemp} onChange={(e) => updateFilter(setFilterTemp)(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] bg-white focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" aria-label="Filter by temperature range">
            <option value="">All</option>
            {uniqueTemp.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input type="text" id="product-search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by part number..." className="px-3 py-2 border border-gray-300 rounded-md text-[0.8125rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10 w-[200px]" aria-label="Search products" />
        </div>
      </div>

      {/* Showing count */}
      <p className="text-[0.8125rem] text-gray-500 mb-3">
        Showing {filtered.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length} products
      </p>

      {/* Desktop Table */}
      <div className="hidden md:block product-table-wrap border border-gray-200 rounded-xl">
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
            {paged.map((product, idx) => (
              <tr key={`${product.partNumber}-${idx}`} className={`hover:bg-blue-light border-b border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.key === 'partNumber' ? 'font-semibold text-navy' : 'text-gray-700'}`}>
                    {renderCellValue(product, col)}
                  </td>
                ))}
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paged.map((product, idx) => (
          <div key={`${product.partNumber}-${idx}`} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-base font-bold text-navy mb-2">{product.partNumber}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
              {columns.filter(c => c.key !== 'partNumber').slice(0, 3).map(col => (
                <span key={col.key}><i className={`fas ${col.icon || 'fa-circle'} text-gray-400 mr-1`} />{col.key === 'diagonalSize' ? `${product[col.key]}"` : (product[col.key] || 'N/A')}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
              {columns.filter(c => c.key !== 'partNumber').slice(3).map(col => (
                <span key={col.key}>
                  <i className={`fas ${col.icon || 'fa-circle'} text-gray-400 mr-1`} />
                  {col.key === 'touchPanel' ? (product[col.key] || 'N/A') : (product[col.key] || 'N/A')}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              {product.datasheetUrl && (
                <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-blue-mid border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <i className="fas fa-file-pdf" /> PDF
                </a>
              )}
              <Link href={`/support/request-quote?part=${product.partNumber}`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">
                <i className="fas fa-file-alt" /> Quote
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            &lt; Previous
          </button>
          {pageNumbers.map((n, i) =>
            n === '...' ? (
              <span key={`dots-${i}`} className="px-2 py-2 text-sm text-gray-400">…</span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${safePage === n ? 'bg-accent text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {n}
              </button>
            )
          )}
          <button
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next &gt;
          </button>
        </div>
      )}

      <p className="mt-4 text-[0.8125rem] text-gray-500 text-center">
        {filtered.length} of {products.length} products match your filters.
        {' '}<Link href="/contact" className="text-blue-mid underline hover:text-accent-text">Request a custom configuration</Link>
      </p>
    </div>
  );
}
