'use client';

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

interface SearchItem {
  title: string;
  url: string;
  description: string;
  type: string;
  category?: string;
}

export default function SearchResults({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => new Fuse(items, {
    keys: [{ name: 'title', weight: 3 }, { name: 'description', weight: 1 }, { name: 'category', weight: 1.5 }],
    threshold: 0.3,
    includeScore: true,
  }), [items]);

  const results = query ? fuse.search(query).slice(0, 20) : [];

  return (
    <div>
      <div className="py-10 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-6">
          <label htmlFor="search-input" className="sr-only">Search</label>
          <input
            type="search"
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, guides, and more..."
            className="w-full max-w-[640px] px-5 py-3.5 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-accent"
            autoFocus
          />
          {query && <p className="text-sm text-gray-500 mt-3">{results.length} results for &ldquo;{query}&rdquo;</p>}
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {results.map((r) => (
          <div key={r.item.url + r.item.title} className="py-6 border-b border-gray-200">
            <h3 className="text-lg font-bold mb-1"><Link href={r.item.url} className="text-navy hover:text-accent">{r.item.title}</Link></h3>
            <p className="text-[0.8125rem] text-success mb-2">{r.item.url}</p>
            <p className="text-[0.9375rem] text-gray-700">{r.item.description}</p>
          </div>
        ))}
        {query && results.length === 0 && (
          <p className="text-gray-500 py-8">No results found. Try a different search term.</p>
        )}
      </div>
    </div>
  );
}
