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
          {/* Header */}
          <div className="max-w-[880px] mb-12">
            <h1 className="text-3xl md:text-[2.5rem] font-bold text-navy mb-4">Contact Us</h1>
            <p className="text-lg text-gray-700 mb-3">US Micro Products is headquartered in Austin, Texas. Our engineering, sales, and support teams are available to discuss your display requirements, provide technical guidance, or answer questions about our products and services.</p>
            <p className="text-[0.9375rem] text-gray-700">
              <i className="fas fa-clock text-accent mr-2" />
              <strong>We respond within 1 business day.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="text-[1.375rem] font-bold text-navy mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Info Sidebar */}
            <aside className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-[1.125rem] font-bold text-navy mb-5">
                  <i className="fas fa-building text-accent mr-2" /> Austin Headquarters
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3 text-[0.9375rem]">
                    <i className="fas fa-map-marker-alt text-accent mt-1 w-5 flex-shrink-0" />
                    <div className="text-gray-700">
                      US Micro Products, Inc.<br />
                      13785 Research Blvd, Suite 125<br />
                      Austin, TX 78750
                    </div>
                  </div>
                  <div className="flex gap-3 text-[0.9375rem]">
                    <i className="fas fa-phone text-accent mt-1 w-5 flex-shrink-0" />
                    <a href="tel:+15123856010" className="text-gray-700 hover:text-accent">(512) 385-6010</a>
                  </div>
                  <div className="flex gap-3 text-[0.9375rem]">
                    <i className="fas fa-envelope text-accent mt-1 w-5 flex-shrink-0" />
                    <a href="mailto:sales@usmicro.com" className="text-gray-700 hover:text-accent">sales@usmicro.com</a>
                  </div>
                  <div className="flex gap-3 text-[0.9375rem]">
                    <i className="fas fa-clock text-accent mt-1 w-5 flex-shrink-0" />
                    <div className="text-gray-700">
                      Mon-Fri: 8:00 AM - 5:30 PM CT<br />
                      Sat-Sun: Closed
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-[1.125rem] font-bold text-navy mb-4">
                  <i className="fas fa-globe text-accent mr-2" /> International Offices
                </h3>
                <p className="text-sm text-gray-600 mb-3">US Micro Products operates across six locations on three continents.</p>
                <ul className="text-[0.8125rem] text-gray-700 space-y-1 list-none p-0">
                  <li>Austin, TX (HQ)</li>
                  <li>Los Angeles, CA</li>
                  <li>New York, NY</li>
                  <li>Shenzhen, China</li>
                  <li>Taichung, Taiwan</li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Map placeholder */}
          <div className="mt-12 w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm">
            <div className="text-center">
              <i className="fas fa-map-marked-alt text-2xl block mb-2" />
              Google Maps embed: 13785 Research Blvd, Suite 125, Austin, TX 78750
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
