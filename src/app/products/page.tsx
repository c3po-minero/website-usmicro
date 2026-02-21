import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import CTABanner from '@/components/ui/CTABanner';

export const metadata: Metadata = {
  title: 'Display Products',
  description: 'Browse 450+ display products: TFT LCD, AMOLED, PMOLED, character LCD, graphic LCD, smart displays, touch panels, open frame monitors, and tablets.',
};

const categories = [
  { slug: 'tft-displays', name: 'TFT LCD Displays', icon: 'fa-desktop', count: '225+', desc: 'IPS, TN, and MVA from 0.96" to 84"' },
  { slug: 'amoled-displays', name: 'AMOLED Displays', icon: 'fa-mobile-alt', count: '77+', desc: 'Round, rectangular, and flexible form factors' },
  { slug: 'pmoled-displays', name: 'PMOLED Displays', icon: 'fa-lightbulb', count: '36+', desc: 'Ultra-low-power for wearables and instrumentation' },
  { slug: 'character-lcd', name: 'Character LCD', icon: 'fa-font', count: '45+', desc: 'Monochrome character modules for industrial controls' },
  { slug: 'graphic-lcd', name: 'Graphic LCD', icon: 'fa-th', count: '20+', desc: 'STN, FSTN, and COG graphic modules' },
  { slug: 'smart-displays', name: 'Smart Displays', icon: 'fa-microchip', count: '30+', desc: 'Integrated controller modules for HMI' },
  { slug: 'touch-panels', name: 'Touch Panels', icon: 'fa-hand-pointer', count: '24+', desc: 'PCAP, multi-touch, glove-compatible' },
  { slug: 'open-frame-monitors', name: 'Open Frame Monitors', icon: 'fa-tv', count: '20+', desc: 'Kiosk, gaming, POS, and industrial' },
  { slug: 'tablets', name: 'Tablets', icon: 'fa-tablet-alt', count: '5+', desc: 'Custom industrial tablets' },
];

export default function ProductsHub() {
  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <h1 className="text-3xl md:text-[2.5rem] font-bold text-navy mb-4">Display Products</h1>
          <p className="text-lg text-gray-700 mb-12 max-w-[700px]">Browse our complete catalog of 450+ display products across 9 technology categories. Every display can be customized to your exact specifications.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products/${cat.slug}`} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all block">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-[10px] bg-blue-light flex items-center justify-center text-blue-mid text-xl"><i className={`fas ${cat.icon}`} /></div>
                  <div>
                    <h2 className="text-lg font-bold text-navy">{cat.name}</h2>
                    <span className="text-sm text-accent font-semibold">{cat.count} SKUs</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTABanner title="Need a Custom Display?" description="Our engineers can modify any product to meet your exact requirements." ctaLabel="Request a Quote" ctaHref="/support/request-quote" ctaIcon="fa-file-alt" />
    </>
  );
}
