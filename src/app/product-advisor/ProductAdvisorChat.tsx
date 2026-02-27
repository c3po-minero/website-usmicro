'use client';

import { useState, useRef, useEffect } from 'react';

/* ── Types ─────────────────────────────────────────────── */

interface ParsedProduct {
  partNumber: string;
  category: string;
  matchPercent: number;
  specs: Record<string, string>;
  tags: string[];
  datasheetUrl: string;
}

interface ParsedResponse {
  summary: string;
  products: ParsedProduct[];
}

interface ChatEntry {
  role: 'user' | 'advisor';
  text: string;
}

/* ── Category slug mapping ─────────────────────────────── */

const CATEGORY_URLS: Record<string, string> = {
  tft: '/products/tft',
  amoled: '/products/amoled',
  pmoled: '/products/pmoled',
  touch: '/products/touch',
  smart: '/products/smart',
  graphic: '/products/graphic',
  character: '/products/character',
  ofm: '/products/ofm',
  tablets: '/products/tablets',
};

/* ── Parse JSON from ```json fences ────────────────────── */

function parseApiReply(reply: string): ParsedResponse | null {
  const match = reply.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    if (parsed && typeof parsed.summary === 'string' && Array.isArray(parsed.products)) {
      return parsed as ParsedResponse;
    }
    return null;
  } catch {
    return null;
  }
}

/* ── Spec labels ───────────────────────────────────────── */

const SPEC_LABELS: Record<string, string> = {
  size: 'SIZE',
  resolution: 'RESOLUTION',
  brightness: 'BRIGHTNESS',
  contrast: 'CONTRAST',
  tempRange: 'TEMP RANGE',
  touch: 'TOUCH',
  interface: 'INTERFACE',
};

/* ── Suggestion chips ──────────────────────────────────── */

const SUGGESTIONS = [
  '7" industrial touchscreen',
  'AMOLED for wearables',
  'Sunlight readable display',
  'Medical grade display',
];

/* ── Component ─────────────────────────────────────────── */

export default function ProductAdvisorChat() {
  const [conversation, setConversation] = useState<ChatEntry[]>([]);
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results when products update
  useEffect(() => {
    if (products.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [products]);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput('');
    setConversation((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      if (!res.ok) {
        setConversation((prev) => [
          ...prev,
          { role: 'advisor', text: data.error || 'Something went wrong. Please try again.' },
        ]);
        return;
      }

      const reply = data.reply as string;
      const parsed = parseApiReply(reply);

      if (parsed) {
        setConversation((prev) => [...prev, { role: 'advisor', text: parsed.summary }]);
        if (parsed.products.length > 0) {
          setProducts(parsed.products);
        }
      } else {
        // Fallback: show raw reply
        setConversation((prev) => [...prev, { role: 'advisor', text: reply }]);
      }
    } catch {
      setConversation((prev) => [
        ...prev,
        { role: 'advisor', text: 'Unable to connect to the Product Advisor. Please check your connection and try again.' },
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

  const hasStarted = conversation.length > 0 || loading;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-50">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="bg-[var(--color-navy)] text-white px-6 py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Product Advisor</h1>
        <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Describe your project requirements and our AI Display Engineer will recommend the best products
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* ── Input Area ────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex gap-3">
            <textarea
              ref={textareaRef}
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="e.g., I need a 7-inch touchscreen display for an outdoor industrial kiosk..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm leading-relaxed resize-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="self-end px-5 py-3 bg-[var(--color-accent)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i className="fas fa-paper-plane" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>

          {/* Suggestion chips — show when empty state */}
          {!hasStarted && (
            <div className="flex flex-wrap gap-2 mt-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    sendMessage(s);
                  }}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Empty State ───────────────────────────────── */}
        {!hasStarted && (
          <div className="text-center py-12">
            <i className="fas fa-display text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              Ready to help you find the right display
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Tell us about your application &mdash; size, resolution, environment, interface &mdash; and we&apos;ll recommend the best matching products.
            </p>
          </div>
        )}

        {/* ── Conversation Area (compact) ───────────────── */}
        {hasStarted && (
          <div className="space-y-3">
            {conversation.map((entry, i) => (
              <div key={i}>
                {entry.role === 'user' ? (
                  <div className="border-l-4 border-l-[var(--color-navy)] pl-4 py-2 text-sm text-gray-800 bg-white rounded-r-lg">
                    {entry.text}
                  </div>
                ) : (
                  <div className="text-sm text-gray-700 pl-1 py-2 leading-relaxed">
                    {entry.text}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 py-2 pl-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-gray-400 ml-2">Analyzing requirements...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Product Result Cards (dark section) ─────────── */}
      {products.length > 0 && (
        <div ref={resultsRef} className="bg-[#0B1120] py-12 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-400 text-sm mb-6">
              Found <strong className="text-white">{products.length}</strong> matching {products.length === 1 ? 'product' : 'products'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => {
                const specEntries = Object.entries(product.specs || {});
                const categoryUrl = CATEGORY_URLS[product.category] || `/products/${product.category}`;

                return (
                  <div
                    key={product.partNumber}
                    className="bg-[#131B2E] border border-[#1E293B] rounded-xl p-6"
                  >
                    {/* Row 1: Category + Match badges */}
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-xs font-semibold text-white bg-[#0D9488] rounded px-3 py-1 tracking-wide">
                        {product.category}
                      </span>
                      <span className="text-xs font-semibold text-white bg-[#16A34A] rounded-full px-3.5 py-1">
                        {product.matchPercent}% match
                      </span>
                    </div>

                    {/* Row 2: Part Number */}
                    <h3 className="text-white font-bold text-lg font-mono mt-3">
                      {product.partNumber}
                    </h3>

                    {/* Row 3: Specs Grid */}
                    {specEntries.length > 0 && (
                      <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-5">
                        {specEntries.map(([key, value]) => (
                          <div key={key}>
                            <div className="uppercase text-[10px] font-semibold text-[#64748B] tracking-wider">
                              {SPEC_LABELS[key] || key.toUpperCase()}
                            </div>
                            <div className="text-[#E2E8F0] font-semibold text-[15px] mt-0.5">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Row 4: Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[#94A3B8] text-xs bg-[#1E293B] border border-[#334155] rounded-full px-3 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Row 5: Action buttons */}
                    <div className="flex gap-3 mt-4">
                      <a
                        href={product.datasheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#db282f] text-white text-sm font-semibold rounded-lg hover:bg-[#c12228] transition-colors"
                      >
                        <i className="fas fa-file-pdf" />
                        Download Datasheet
                      </a>
                      <a
                        href={categoryUrl}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#334155] text-[#94A3B8] text-sm font-semibold rounded-lg hover:bg-[#1E293B] transition-colors"
                      >
                        <i className="fas fa-table-list" />
                        View Category
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
