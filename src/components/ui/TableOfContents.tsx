'use client';

interface TOCItem {
  id: string;
  label: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <aside className="sticky top-[96px] bg-gray-50 rounded-xl p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">On This Page</h4>
      <ul className="list-none p-0 space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level > 2 ? 'pl-3' : ''}>
            <a href={`#${item.id}`} className="text-[0.8125rem] text-gray-500 hover:text-accent block py-1 pl-3 border-l-2 border-transparent hover:border-accent transition-colors">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
