'use client';

export default function NewsletterSignup() {
  return (
    <section className="py-20">
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <h2 className="text-[1.875rem] font-bold text-navy mb-3">Stay Updated</h2>
        <p className="max-w-[500px] mx-auto text-gray-700 mb-6">Subscribe to our newsletter for product announcements, technical articles, and industry insights.</p>
        <form className="flex gap-2 max-w-[400px] mx-auto" aria-label="Newsletter signup" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            type="email"
            id="newsletter-email"
            placeholder="Enter your email address"
            required
            className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-md text-sm font-sans focus:outline-none focus:border-accent"
          />
          <button type="submit" className="px-4 py-2.5 text-[0.8125rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
