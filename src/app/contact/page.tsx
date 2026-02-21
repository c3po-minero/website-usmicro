import { Metadata } from 'next';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact US Micro Products for custom display solutions. Austin, TX headquarters with global offices.',
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-[2.5rem] font-bold text-navy mb-4">Contact Us</h1>
              <p className="text-lg text-gray-700 mb-8">Have a question about our display solutions? Our engineering team responds within 1 business day.</p>
              <ContactForm />
            </div>
            <aside className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-[1.375rem] font-bold text-navy mb-5">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex gap-3 text-[0.9375rem]">
                  <i className="fas fa-map-marker-alt text-accent mt-1 w-5" />
                  <div>
                    <strong className="text-navy">Headquarters</strong><br />
                    <span className="text-gray-700">Austin, TX</span>
                  </div>
                </div>
                <div className="flex gap-3 text-[0.9375rem]">
                  <i className="fas fa-phone text-accent mt-1 w-5" />
                  <a href="tel:+15129551400" className="text-gray-700 hover:text-accent">(512) 955-1400</a>
                </div>
                <div className="flex gap-3 text-[0.9375rem]">
                  <i className="fas fa-envelope text-accent mt-1 w-5" />
                  <a href="mailto:info@usmicroproducts.com" className="text-gray-700 hover:text-accent">info@usmicroproducts.com</a>
                </div>
                <div className="flex gap-3 text-[0.9375rem]">
                  <i className="fas fa-clock text-accent mt-1 w-5" />
                  <span className="text-gray-700">Mon-Fri 8am-6pm CST</span>
                </div>
              </div>
              <div className="mt-8 w-full h-[200px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                <i className="fas fa-map mr-2" /> Map placeholder
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
