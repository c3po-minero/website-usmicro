import dynamic from 'next/dynamic';
import HeroSection from '@/components/ui/HeroSection';
import StatsBar from '@/components/ui/StatsBar';
import IndustryCard from '@/components/ui/IndustryCard';
import ProductCard from '@/components/ui/ProductCard';
import CTABanner from '@/components/ui/CTABanner';
import Link from 'next/link';

const FAQAccordion = dynamic(() => import('@/components/ui/FAQAccordion'));
const LogoCarousel = dynamic(() => import('@/components/ui/LogoCarousel'));
const NewsletterSignup = dynamic(() => import('@/components/ui/NewsletterSignup'));

const stats = [
  { number: '30', label: 'Celebrating Our 30th Anniversary' },
  { number: '450+', label: 'Active SKUs' },
  { number: '6', label: 'Global Offices' },
  { number: '200+', label: 'Custom Designs / Year' },
  { number: '5x', label: 'Inc. 5000 Honoree' },
];

const pillars = [
  { icon: 'fa-rocket', title: 'Innovation', desc: 'Display innovation and customization that sets your product apart. Over 200 custom designs completed annually, pushing the boundaries of display technology.' },
  { icon: 'fa-microscope', title: 'Expertise', desc: 'Engineering expertise across TFT, AMOLED, PMOLED, LCD, and touch technologies. We act as your display engineering department.' },
  { icon: 'fa-handshake', title: 'Service', desc: 'Global scale with local support. Six offices across three continents. When you call, you reach engineers who solve problems.' },
];

const productCategories = [
  { title: 'TFT LCD Displays', desc: '225+ models from 0.96" to 84". IPS, TN, and MVA types with SPI, LVDS, MIPI, and RGB interfaces.', href: '/products/tft-displays', icon: 'fa-desktop', imageUrl: '/images/products/tft-displays.webp' },
  { title: 'AMOLED Displays', desc: '77+ modules from 0.95" to 6.67". Round, rectangular, and flexible form factors for wearables and premium devices.', href: '/products/amoled-displays', icon: 'fa-mobile-alt', imageUrl: '/images/products/amoled-displays.webp' },
  { title: 'PMOLED Displays', desc: '36+ ultra-low-power OLED modules for wearables, instrumentation, and battery-powered devices.', href: '/products/pmoled-displays', icon: 'fa-lightbulb', imageUrl: '/images/products/pmoled-displays.webp' },
  { title: 'Touch Panels', desc: '24+ capacitive touch solutions. PCAP, multi-touch, glove-compatible, and custom cover glass options.', href: '/products/touch-panels', icon: 'fa-hand-pointer', imageUrl: '/images/products/touch-panels.webp' },
  { title: 'Open Frame Monitors', desc: '20+ monitors for kiosk, gaming, POS, and industrial integration with optional touch and VESA mounting.', href: '/products/open-frame-monitors', icon: 'fa-tv', imageUrl: '/images/products/open-frame-monitors.webp' },
  { title: 'Smart Displays', desc: '30+ modules with integrated controllers. Simplify your HMI design with all-in-one display solutions.', href: '/products/smart-displays', icon: 'fa-microchip', imageUrl: '/images/products/smart-displays.webp' },
];

const industries = [
  { icon: 'fa-heartbeat', name: 'Medical', desc: 'FDA-ready displays for surgical equipment, patient monitors, and portable diagnostic devices.', href: '/applications/medical' },
  { icon: 'fa-fighter-jet', name: 'Military', desc: 'Rugged, sunlight-readable displays for defense systems and field-deployed electronics.', href: '/applications/military' },
  { icon: 'fa-plane', name: 'Aerospace', desc: 'High-reliability displays for avionics, cockpit instrumentation, and satellite systems.', href: '/applications/aerospace' },
  { icon: 'fa-car', name: 'Automotive', desc: 'Wide-temperature, vibration-resistant displays for dashboards, HUDs, and infotainment.', href: '/applications/automotive' },
  { icon: 'fa-dice', name: 'Gaming', desc: 'High-brightness, wide-viewing-angle displays for slot machines, arcade, and table games.', href: '/applications/gaming' },
  { icon: 'fa-industry', name: 'Industrial', desc: 'Rugged HMI displays for factory automation, process control, and harsh environments.', href: '/applications/industrial' },
  { icon: 'fa-microchip', name: 'Wearables', desc: 'Compact AMOLED and PMOLED displays for smartwatches, fitness bands, and medical wearables.', href: '/applications/wearables' },
  { icon: 'fa-mobile-alt', name: 'Consumer', desc: 'Cost-effective, high-quality displays for consumer electronics and smart home devices.', href: '/applications/consumer' },
  { icon: 'fa-store', name: 'Kiosk & POS', desc: 'Touch-enabled displays for self-service kiosks, point-of-sale terminals, and digital signage.', href: '/applications/kiosk-pos' },
  { icon: 'fa-tachometer-alt', name: 'Instrumentation', desc: 'Precision displays for test equipment, lab instruments, and measurement devices.', href: '/applications/instrumentation' },
  { icon: 'fa-anchor', name: 'Marine', desc: 'Waterproof, sunlight-readable displays for navigation, sonar, and vessel control systems.', href: '/applications/marine' },
  { icon: 'fa-mountain', name: 'Harsh Environments', desc: 'Extended temperature, high-brightness displays for outdoor, mining, and extreme conditions.', href: '/applications/harsh-environments' },
];

const faqs = [
  { question: 'What types of displays do you offer?', answer: 'We offer TFT LCD, AMOLED, PMOLED, character LCD, graphic LCD, smart displays, touch panels, open frame monitors, and tablets. Over 450 active SKUs spanning 0.96" to 84" diagonal.' },
  { question: 'Can you customize displays for my application?', answer: 'Yes. Every display in our catalog can be customized: brightness enhancement, optical bonding, custom cover glass, interface adaptation, connector changes, and more. We complete 200+ custom designs annually.' },
  { question: 'What industries do you serve?', answer: 'We serve medical, military, aerospace, automotive, gaming, industrial, wearable, consumer electronics, kiosk/POS, instrumentation, marine, and harsh environment applications.' },
  { question: 'What is your typical lead time?', answer: 'Standard products ship in 1-2 weeks from inventory. Custom modifications typically require 8-12 weeks. Contact us for specific timelines based on your requirements.' },
  { question: 'Do you offer PCB assembly services?', answer: 'Yes. Our EMS division provides display-focused electronic manufacturing services including SMT assembly, chip-on-board, sub-assembly, and complete box build integration.' },
  { question: 'How do I get started with a project?', answer: 'Contact us with your application requirements. Our engineers will evaluate your optical, mechanical, electrical, and environmental needs and recommend the optimal display solution. Request a quote to get started.' },
];

const featuredContent = [
  { icon: 'fa-book-open', title: 'TFT Display Technology Guide', desc: 'Comprehensive guide to TFT LCD technology: how it works, panel types, interfaces, and selection criteria.', href: '/learn/tft-display-technology', link: 'Read Guide' },
  { icon: 'fa-heartbeat', title: 'Medical Display Solutions', desc: 'FDA-ready displays for surgical, diagnostic, and patient monitoring applications.', href: '/applications/medical', link: 'Explore Medical' },
  { icon: 'fa-cogs', title: 'EMS / PCB Assembly', desc: 'Display-focused electronic manufacturing services: SMT, COB, sub-assembly, and box build.', href: '/services/ems', link: 'Learn About EMS' },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'US Micro Products',
            url: 'https://www.usmicroproducts.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://www.usmicroproducts.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }),
        }}
      />

      {/* Hero */}
      <HeroSection
        eyebrow="Custom Display Manufacturer — Austin, TX — Est. 1996"
        title="Custom Display Solutions Engineered for Your Product"
        description="We add the human touch to technology. For nearly three decades, US Micro Products has designed and delivered high-performance display solutions for OEMs across medical, military, aerospace, industrial, and consumer markets."
        primaryCta={{ label: 'Request a Quote', href: '/support/request-quote', icon: 'fa-file-alt' }}
        secondaryCta={{ label: 'Explore Products', href: '/products', icon: 'fa-search' }}
        backgroundImage="/images/hero-bg.webp"
      />

      {/* Stats Bar */}
      <StatsBar stats={stats} dark />

      {/* Three Pillars */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-12">Three Pillars That Drive Every Solution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillars.map((p) => (
              <div key={p.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-5 text-white text-2xl">
                  <i className={`fas ${p.icon}`} />
                </div>
                <h3 className="text-[1.375rem] font-bold text-navy mb-3">{p.title}</h3>
                <p className="text-[0.9375rem] text-gray-700">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Display Technologies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-3">Display Technologies</h2>
          <p className="text-center text-gray-700 max-w-[640px] mx-auto mb-10">From compact wearable screens to large-format industrial monitors, we offer the broadest range of display technologies in the industry.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((cat, i) => (
              <ProductCard key={cat.href} title={cat.title} description={cat.desc} href={cat.href} icon={cat.icon} imageUrl={cat.imageUrl} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-3">Industries We Serve</h2>
          <p className="text-center text-gray-700 max-w-[600px] mx-auto mb-10">We engineer display solutions for the most demanding applications across these industries.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map((ind) => (
              <IndustryCard key={ind.href} icon={ind.icon} name={ind.name} description={ind.desc} href={ind.href} />
            ))}
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Featured Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-10">Featured Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredContent.map((item) => (
              <div key={item.href} className="bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-[10px] bg-blue-light flex items-center justify-center mb-4 text-blue-mid text-xl">
                    <i className={`fas ${item.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2"><Link href={item.href} className="text-navy hover:text-accent-text">{item.title}</Link></h3>
                  <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                  <Link href={item.href} className="text-sm font-semibold text-accent-text inline-flex items-center gap-1.5">{item.link} <i className="fas fa-arrow-right" /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-3">Frequently Asked Questions</h2>
          <p className="text-center text-gray-700 max-w-[600px] mx-auto mb-10">Quick answers to common questions about our display solutions and services.</p>
          <FAQAccordion items={faqs} twoColumn />
          <div className="text-center mt-8">
            <Link href="/support/faq" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-transparent text-blue border-2 border-blue rounded-md hover:bg-blue hover:text-white transition-all">
              <i className="fas fa-question-circle" /> View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      {/* CTA Banner */}
      <CTABanner
        title="Start Your Display Project"
        description="Tell us about your application and our engineers will recommend the optimal display solution."
        ctaLabel="Request a Quote"
        ctaHref="/support/request-quote"
        ctaIcon="fa-file-alt"
      />
    </>
  );
}
