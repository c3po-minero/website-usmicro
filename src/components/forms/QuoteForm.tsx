'use client';

import { useState } from 'react';

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <i className="fas fa-check-circle text-3xl text-success mb-4" />
        <h3 className="text-xl font-bold text-navy mb-2">Quote Request Received!</h3>
        <p className="text-gray-700">Our team will review your requirements and respond within 1 business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5" aria-label="Request a quote">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quote-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
          <input type="text" id="quote-name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
        <div>
          <label htmlFor="quote-company" className="block text-sm font-semibold text-gray-700 mb-1.5">Company *</label>
          <input type="text" id="quote-company" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quote-email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
          <input type="email" id="quote-email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
        <div>
          <label htmlFor="quote-phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
          <input type="tel" id="quote-phone" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
      </div>
      <div>
        <label htmlFor="quote-parts" className="block text-sm font-semibold text-gray-700 mb-1.5">Part Number(s)</label>
        <input type="text" id="quote-parts" placeholder="e.g. USMP-T070-102480LFW-E0" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quote-quantity" className="block text-sm font-semibold text-gray-700 mb-1.5">Estimated Quantity</label>
          <input type="text" id="quote-quantity" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
        <div>
          <label htmlFor="quote-timeline" className="block text-sm font-semibold text-gray-700 mb-1.5">Project Timeline</label>
          <select id="quote-timeline" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10">
            <option value="">Select...</option>
            <option value="immediate">Immediate (1-2 weeks)</option>
            <option value="1month">1-3 months</option>
            <option value="3month">3-6 months</option>
            <option value="6month">6+ months</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="quote-details" className="block text-sm font-semibold text-gray-700 mb-1.5">Project Details</label>
        <textarea id="quote-details" rows={5} placeholder="Describe your application, requirements, and any specific needs..." className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10 resize-y" />
      </div>
      <button type="submit" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
        <i className="fas fa-file-alt" /> Submit Quote Request
      </button>
    </form>
  );
}
