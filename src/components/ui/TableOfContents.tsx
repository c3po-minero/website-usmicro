'use client';

import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  label: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  const tocList = (
    <ul className="list-none p-0 space-y-1">
      {items.map((item) => (
        <li key={item.id} className={item.level > 2 ? 'pl-3' : ''}>
          <a
            href={`#${item.id}`}
            onClick={() => setMobileOpen(false)}
            className={`text-[0.8125rem] block py-1.5 pl-3 border-l-2 transition-colors ${
              activeId === item.id
                ? 'text-accent border-accent font-semibold'
                : 'text-gray-500 border-transparent hover:text-accent hover:border-accent'
            }`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile: collapsible TOC at top */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-navy"
          aria-expanded={mobileOpen}
        >
          <i className={`fas fa-list text-accent`} />
          Table of Contents
          <i className={`fas fa-chevron-${mobileOpen ? 'up' : 'down'} ml-auto text-gray-400`} />
        </button>
        {mobileOpen && <div className="mt-2 p-4 bg-gray-50 rounded-xl">{tocList}</div>}
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block sticky top-[96px] bg-gray-50 rounded-xl p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">On This Page</h4>
        {tocList}
      </aside>
    </>
  );
}
