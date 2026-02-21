import { Metadata } from 'next';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import QuoteForm from '@/components/forms/QuoteForm';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: 'Request a quote for custom display solutions from US Micro Products. Fast response within 1 business day.',
};

export default function RequestQuotePage() {
  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Support', href: '/support' }, { label: 'Request a Quote' }]} />
      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-3xl md:text-[2.5rem] font-bold text-navy mb-4">Request a Quote</h1>
          <p className="text-lg text-gray-700 mb-8">Tell us about your display requirements and our engineers will provide a detailed quote within 1 business day.</p>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
