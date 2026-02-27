'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'advisor';
  content: string;
}

const WELCOME_MESSAGE =
  "Hello! I'm the US Micro Products Display Engineer. Tell me about your project requirements — display size, resolution, environment, interface needs — and I'll recommend the best products for your application.";

function parseMarkdown(text: string): string {
  let html = text
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-sm font-mono">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="font-bold text-sm mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-bold text-base mt-3 mb-1">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="font-bold text-lg mt-3 mb-1">$1</h2>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-mid underline hover:text-accent">$1</a>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-3 border-gray-200" />');

  // Process unordered lists
  html = html.replace(/((?:^[-*] .+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(line =>
      `<li class="ml-4 list-disc">${line.replace(/^[-*] /, '')}</li>`
    ).join('');
    return `<ul class="my-2 space-y-1">${items}</ul>`;
  });

  // Process ordered lists
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(line =>
      `<li class="ml-4 list-decimal">${line.replace(/^\d+\. /, '')}</li>`
    ).join('');
    return `<ol class="my-2 space-y-1">${items}</ol>`;
  });

  // Paragraphs (lines not already wrapped in HTML tags)
  html = html
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return trimmed;
      return `<p class="mb-2">${trimmed}</p>`;
    })
    .join('\n');

  return html;
}

export default function ProductAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'advisor', content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        setMessages((prev) => [...prev, { role: 'advisor', content: data.reply }]);
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
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-navy">
          <i className="fas fa-wand-magic-sparkles text-accent mr-2" />
          Product Advisor
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Powered by AI — Ask about any US Micro Products display, module, or component
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm ${
                  msg.role === 'advisor' ? 'bg-blue' : 'bg-accent'
                }`}
              >
                <i className={`fas ${msg.role === 'advisor' ? 'fa-microchip' : 'fa-user'}`} />
              </div>
              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'advisor'
                    ? 'bg-white border border-gray-200 text-gray-800'
                    : 'bg-blue text-white'
                }`}
              >
                {msg.role === 'advisor' ? (
                  <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue flex items-center justify-center text-white text-sm">
                <i className="fas fa-microchip" />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Describe your display requirements..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-mid focus:ring-1 focus:ring-blue-mid disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-accent text-white rounded-lg font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i className="fas fa-paper-plane" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
