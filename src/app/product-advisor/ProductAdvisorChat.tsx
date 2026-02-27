'use client';

import { useState, useRef, useEffect } from 'react';

/* ── Types ─────────────────────────────────────────────── */

interface Message {
  role: 'user' | 'advisor';
  content: string;
}

interface Product {
  partNumber: string;
  specs: string[];
  datasheetUrl: string;
  category: string;
  categorySlug: string;
}

/* ── Category mapping ──────────────────────────────────── */

function categorySlugFromPartNumber(pn: string): { category: string; slug: string } {
  const after = pn.replace(/^USMP-/, '');
  if (after.startsWith('T0')) return { category: 'TFT Display', slug: 'tft' };
  if (after.startsWith('A0')) return { category: 'AMOLED Display', slug: 'amoled' };
  if (after.startsWith('P0')) return { category: 'PMOLED Display', slug: 'pmoled' };
  if (after.startsWith('TP')) return { category: 'Touch Panel', slug: 'touch' };
  if (after.startsWith('S0') || after.startsWith('M0')) return { category: 'Smart Display', slug: 'smart' };
  if (after.startsWith('G0')) return { category: 'Graphic Display', slug: 'graphic' };
  if (after.startsWith('C0')) return { category: 'Character Display', slug: 'character' };
  if (after.startsWith('OFM')) return { category: 'Optical Film', slug: 'ofm' };
  return { category: 'Products', slug: 'tft' };
}

/* ── Product parsing ───────────────────────────────────── */

function parseProducts(markdown: string): Product[] {
  const products: Product[] = [];
  const pnRegex = /USMP-[A-Z0-9]+-[A-Z0-9-]+/g;
  const partNumbers = [...new Set(markdown.match(pnRegex) || [])];

  for (const pn of partNumbers) {
    const pnEscaped = pn.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const sectionRegex = new RegExp(
      `${pnEscaped}[\\s\\S]*?(?=USMP-[A-Z0-9]+-[A-Z0-9-]+|$)`,
    );
    const section = markdown.match(sectionRegex)?.[0] || '';

    const specLines = section.match(/^[-*•]\s+.+$/gm) || [];
    const specs = specLines.map((l) => l.replace(/^[-*•]\s+/, '').trim()).filter(Boolean);

    const dsMatch = section.match(/\[.*?\]\((https?:\/\/[^\s)]+\.pdf)\)/i)
      || markdown.match(new RegExp(`\\[.*?\\]\\((https?://[^\\s)]*${pnEscaped}[^\\s)]*\\.pdf)\\)`, 'i'));
    const datasheetUrl = dsMatch?.[1] || `https://djnr.net/usmp/${pn}.pdf`;

    const { category, slug } = categorySlugFromPartNumber(pn);

    products.push({
      partNumber: pn,
      specs: specs.length > 0 ? specs : ['See datasheet for full specifications'],
      datasheetUrl,
      category,
      categorySlug: slug,
    });
  }

  return products;
}

/* ── Simple markdown → HTML ────────────────────────────── */

function parseMarkdown(text: string): string {
  let html = text
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-sm font-mono">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-sm mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-base mt-3 mb-1">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="font-semibold text-lg mt-3 mb-1">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--color-accent-text)] underline hover:opacity-80">$1</a>')
    .replace(/^---$/gm, '<hr class="my-3 border-gray-200" />');

  html = html.replace(/((?:^[-*] .+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map((line) =>
      `<li class="ml-4 list-disc">${line.replace(/^[-*] /, '')}</li>`
    ).join('');
    return `<ul class="my-2 space-y-0.5 text-sm">${items}</ul>`;
  });

  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map((line) =>
      `<li class="ml-4 list-decimal">${line.replace(/^\d+\. /, '')}</li>`
    ).join('');
    return `<ol class="my-2 space-y-0.5 text-sm">${items}</ol>`;
  });

  html = html
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return trimmed;
      return `<p class="mb-1.5">${trimmed}</p>`;
    })
    .join('\n');

  return html;
}

/* ── Component ─────────────────────────────────────────── */

export default function ProductAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'advisor', content: data.error || 'Something went wrong. Please try again.' },
        ]);
      } else {
        const reply = data.reply as string;
        setMessages((prev) => [...prev, { role: 'advisor', content: reply }]);

        const parsed = parseProducts(reply);
        if (parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'advisor',
          content: 'Unable to connect to the Product Advisor. Please check your connection and try again.',
        },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-50">
      {/* Header */}
      <div className="bg-[var(--color-navy)] text-white px-6 py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
          <i className="fas fa-microchip text-[var(--color-accent)]" />
          Product Advisor
        </h1>
        <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Describe your project requirements and our AI Display Engineer will recommend the best products
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Search / Input Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <label htmlFor="advisor-input" className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-search text-[var(--color-accent)] mr-1.5" />
            What are you looking for?
          </label>
          <div className="flex gap-3">
            <textarea
              ref={textareaRef}
              id="advisor-input"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="e.g., I need a 7-inch touchscreen display for an outdoor industrial kiosk operating in -20°C to 70°C..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm leading-relaxed resize-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="self-end px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              <i className="fas fa-paper-plane" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>

        {/* Conversation Log */}
        {(messages.length > 0 || loading) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <i className="fas fa-comments mr-1.5" />
                Conversation
              </h2>
            </div>
            <div
              ref={conversationRef}
              className="max-h-[400px] overflow-y-auto divide-y divide-gray-50"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-5 py-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gray-50 border-l-4 border-l-[var(--color-navy)]'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <i
                      className={`fas ${
                        msg.role === 'user' ? 'fa-user' : 'fa-microchip'
                      } text-xs ${
                        msg.role === 'user' ? 'text-[var(--color-navy)]' : 'text-[var(--color-accent)]'
                      }`}
                    />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {msg.role === 'user' ? 'You' : 'Advisor'}
                    </span>
                  </div>
                  {msg.role === 'advisor' ? (
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
                    />
                  ) : (
                    <p className="text-gray-800">{msg.content}</p>
                  )}
                </div>
              ))}

              {loading && (
                <div className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className="fas fa-microchip text-xs text-[var(--color-accent)]" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Advisor
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs text-gray-400 ml-2">Analyzing requirements...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Results Cards */}
        {products.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-th-large text-[var(--color-accent)]" />
              <h2 className="text-lg font-bold text-[var(--color-navy)]">
                Recommended Products
              </h2>
              <span className="text-sm text-gray-500">
                ({products.length} {products.length === 1 ? 'result' : 'results'})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <div
                  key={product.partNumber}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-[var(--color-navy)] px-5 py-3">
                    <h3 className="text-white font-bold text-sm tracking-wide font-mono">
                      {product.partNumber}
                    </h3>
                    <span className="text-gray-400 text-xs">{product.category}</span>
                  </div>

                  <div className="px-5 py-4">
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      {product.specs.slice(0, 6).map((spec, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <i className="fas fa-check text-[var(--color-accent)] text-xs mt-1 flex-shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                      {product.specs.length > 6 && (
                        <li className="text-xs text-gray-400 pl-5">
                          +{product.specs.length - 6} more specs in datasheet
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
                    <a
                      href={product.datasheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
                    >
                      <i className="fas fa-file-pdf" />
                      Datasheet
                    </a>
                    <a
                      href={`/products/${product.categorySlug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <i className="fas fa-table-list" />
                      Category
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <i className="fas fa-display text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Ready to help you find the right display</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Describe your application requirements above — size, resolution, operating temperature, interface, brightness — and we&apos;ll recommend the best matching products.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                'Industrial HMI touchscreen',
                'Outdoor readable TFT',
                'Small OLED for wearable',
                'Wide temperature display',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
