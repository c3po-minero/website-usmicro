'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <i className="fas fa-check-circle text-3xl text-success mb-4" />
        <h3 className="text-xl font-bold text-navy mb-2">Thank You!</h3>
        <p className="text-gray-700">We&apos;ve received your message and will respond within 1 business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
          <input type="text" id="contact-name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
        <div>
          <label htmlFor="contact-company" className="block text-sm font-semibold text-gray-700 mb-1.5">Company *</label>
          <input type="text" id="contact-company" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
          <input type="email" id="contact-email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
          <input type="tel" id="contact-phone" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-type" className="block text-sm font-semibold text-gray-700 mb-1.5">Inquiry Type</label>
        <select id="contact-type" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10">
          <option value="quote">Request a Quote</option>
          <option value="technical">Technical Support</option>
          <option value="sales">Sales Inquiry</option>
          <option value="general">General Question</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
        <textarea id="contact-message" required rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[0.9375rem] focus:outline-none focus:border-blue-mid focus:ring-3 focus:ring-blue/10 resize-y" />
      </div>
      <button type="submit" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
        <i className="fas fa-paper-plane" /> Send Message
      </button>
    </form>
  );
}
