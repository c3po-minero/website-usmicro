'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  twoColumn?: boolean;
}

export default function FAQAccordion({ items, twoColumn = false }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={twoColumn ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : ''}>
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 hover:border-accent hover:shadow-sm transition-all">
          <button
            className="w-full px-6 py-5 flex justify-between items-center text-base font-semibold text-navy text-left"
            aria-expanded={openIndex === i}
            aria-controls={`faq-${i}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{item.question}</span>
            <i className={`fas fa-chevron-down text-accent transition-transform ml-3 flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`} />
          </button>
          <div
            id={`faq-${i}`}
            role="region"
            aria-hidden={openIndex !== i}
            className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-[300px]' : 'max-h-0'}`}
          >
            <div className="px-6 pb-5 text-[0.9375rem] text-gray-700 prose prose-sm max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: item.answer }} />
          </div>
        </div>
      ))}
    </div>
  );
}
