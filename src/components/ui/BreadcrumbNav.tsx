import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: Crumb[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://www.usmicroproducts.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="py-4 bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-[1280px] mx-auto px-6">
          <ol className="flex flex-wrap gap-2 text-[0.8125rem] list-none p-0">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-500" {...(i === items.length - 1 ? { 'aria-current': 'page' as const } : {})}>
                {i > 0 && <span className="text-gray-300">/</span>}
                {item.href && i < items.length - 1 ? (
                  <Link href={item.href} className="text-gray-500 hover:text-accent">{item.label}</Link>
                ) : (
                  <span className={i === items.length - 1 ? 'text-gray-700 font-medium' : ''}>{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
