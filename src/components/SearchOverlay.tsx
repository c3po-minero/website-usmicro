'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import searchIndex from '@/data/search-index.json';

interface SearchEntry {
  title: string;
  url: string;
  excerpt: string;
  category: string;
}

const fuse = new Fuse<SearchEntry>(searchIndex, {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'excerpt', weight: 0.3 },
    { name: 'category', weight: 0.15 },
    { name: 'url', weight: 0.15 },
  ],
  threshold: 0.4,
  minMatchCharLength: 2,
});

const popularSearches = [
  { label: 'TFT Displays', href: '/products/tft-displays' },
  { label: 'Medical Displays', href: '/applications/medical' },
  { label: 'Custom Solutions', href: '/products/custom-displays' },
  { label: 'EMS Services', href: '/services/ems' },
];

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit: 6 });
  }, [query]);

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('toggle-search', handler);

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', keyHandler);

    return () => {
      document.removeEventListener('toggle-search', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [open]);

  function handleSubmit() {
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function navigate(url: string) {
    setOpen(false);
    router.push(url);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true" aria-label="Site search">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-[90%] max-w-[640px]">
        <button className="absolute -top-12 right-0 text-white/85 hover:text-white text-xl p-2" onClick={() => setOpen(false)} aria-label="Close search">
          <i className="fas fa-xmark" />
        </button>
        <div className="relative flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
          <i className="fas fa-magnifying-glass absolute left-6 text-gray-400 text-xl pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            className="w-full border-none outline-none py-6 px-6 pl-14 text-xl text-gray-900 bg-transparent"
            placeholder="Search US Micro Products..."
            aria-label="Search US Micro Products"
          />
          <kbd className="hidden sm:inline-flex items-center mr-4 px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded border border-gray-200 whitespace-nowrap">ESC</kbd>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-2 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {suggestions.map(({ item }) => (
              <button key={item.url} onClick={() => navigate(item.url)} className="w-full text-left px-5 py-3 hover:bg-blue-light transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0">
                <i className="fas fa-arrow-right text-xs text-gray-300" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 truncate">{item.excerpt}</p>
                </div>
                <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full whitespace-nowrap">{item.category}</span>
              </button>
            ))}
            <button onClick={handleSubmit} className="w-full text-left px-5 py-3 text-sm font-medium text-accent-text hover:bg-blue-light transition-colors">
              View all results for &ldquo;{query}&rdquo; →
            </button>
          </div>
        )}

        {!query.trim() && (
          <div className="flex flex-wrap items-center gap-2 mt-4 px-1">
            <span className="text-white/80 text-sm font-medium">Popular:</span>
            {popularSearches.map((s) => (
              <button key={s.href} onClick={() => navigate(s.href)} className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-sm rounded-full transition-colors backdrop-blur-sm">
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
