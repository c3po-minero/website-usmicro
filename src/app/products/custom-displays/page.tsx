import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import CTABanner from '@/components/ui/CTABanner';
import FAQAccordion from '@/components/ui/FAQAccordion';

export const metadata: Metadata = {
  title: 'Custom Display Solutions | Engineered to Spec | US Micro',
  description: 'Custom TFT, AMOLED, PMOLED & LCD displays engineered to your specifications. From concept to mass production. 25+ years expertise.',
};

const edspSteps = [
  {
    num: '01',
    title: 'Requirements Analysis',
    desc: 'Your engineering team shares application requirements — optical, mechanical, electrical, and environmental. We evaluate your specifications against available technologies.',
    icon: 'fa-clipboard-list',
  },
  {
    num: '02',
    title: 'Technology Selection',
    desc: 'We recommend the display technology (TFT, AMOLED, PMOLED, or LCD), panel type, interface, and customization features that best meet your performance and cost targets.',
    icon: 'fa-search',
  },
  {
    num: '03',
    title: 'Design & Engineering',
    desc: 'Complete display solution design — panel specification, cover glass, touch integration, optical bonding, interface circuitry, FPC routing, and mechanical integration.',
    icon: 'fa-drafting-compass',
  },
  {
    num: '04',
    title: 'Prototype & Evaluation',
    desc: 'Working prototypes for your team to evaluate. Includes optical testing, environmental validation, and interface verification in your application.',
    icon: 'fa-flask',
  },
  {
    num: '05',
    title: 'Design Validation',
    desc: 'Final validation against all specifications — optical performance, mechanical fit, environmental limits, reliability testing, and compliance requirements.',
    icon: 'fa-check-double',
  },
  {
    num: '06',
    title: 'Production & Lifecycle',
    desc: 'Volume manufacturing with full supply chain management, quality control, inventory management, EOL planning, and next-generation development.',
    icon: 'fa-industry',
  },
];

const customizationCategories = [
  { label: 'Size & Shape', value: 'Custom diagonal sizes, round, rectangular, notched, cutout', icon: 'fa-ruler-combined' },
  { label: 'Brightness', value: 'Standard (250 nits) to sunlight-readable (2,500+ nits)', icon: 'fa-sun' },
  { label: 'Optical Bonding', value: 'Air gap elimination for contrast, readability, shock resistance', icon: 'fa-layer-group' },
  { label: 'Cover Glass', value: 'Chemically strengthened, AR/AG/AF coatings, custom printing', icon: 'fa-shield-alt' },
  { label: 'Interface', value: 'SPI, I2C, RGB, LVDS, MIPI DSI, eDP — matching your system', icon: 'fa-plug' },
  { label: 'Touch', value: 'PCAP with glove mode, wet-finger, water rejection', icon: 'fa-hand-pointer' },
  { label: 'Temperature', value: '-40°C to +85°C with heater circuits and wide-temp backlights', icon: 'fa-thermometer-half' },
  { label: 'FPC & Connector', value: 'Custom flex cable length, routing, connector type, pin assignment', icon: 'fa-random' },
  { label: 'Backlight', value: 'Custom LED color, brightness, uniformity, dimming range', icon: 'fa-lightbulb' },
  { label: 'EMI Shielding', value: 'Conductive coatings, mesh, gaskets for medical and military', icon: 'fa-broadcast-tower' },
  { label: 'Protective', value: 'Conformal coating, potting, ruggedization for harsh environments', icon: 'fa-hard-hat' },
];

const technologies = [
  {
    name: 'Custom TFT Displays',
    slug: 'tft-displays',
    icon: 'fa-desktop',
    color: 'accent',
    desc: 'The broadest customization platform. Modify size, brightness, interface, cover glass, bonding, and environmental rating across our 225+ TFT display portfolio.',
    sizes: '1.22" – 8.5"',
    resolution: '128×128 to QHD',
    structures: 'COG, TAB, COF',
    interfaces: 'RGB, TTL, LVDS, MIPI',
    customizations: [
      { area: 'Panel', items: 'LC type (TN/VA/IPS), dimension, color gamut, polarizer, shape, heater, sunlight readable, FPC' },
      { area: 'Backlight', items: 'LED position (array/edge), outline dimension, mounting hole, brightness/uniformity, lifetime' },
      { area: 'Cover', items: 'Plastic or glass, AR/AG/HC treatment, thickness, hardness, shape, drill hole, mask printing' },
      { area: 'Bezel', items: 'Metal or plastic frame, screw hole, output port location, bezel size' },
      { area: 'Touch', items: 'RTP/CTP, GG/GFF/GF/DITO/SITO/on-cell/in-cell, single/multi/gesture' },
      { area: 'Others', items: 'Air/optical/nano bonding, OCA/OCR, PCBA, interface bridge, LED driving, AD board (DVI/VGA/DP/USB)' },
    ],
    apps: ['Wearables', 'Medical', 'Transportation', 'Gaming', 'Military', 'Industrial'],
  },
  {
    name: 'Custom AMOLED Displays',
    slug: 'amoled-displays',
    icon: 'fa-mobile-alt',
    color: 'blue-400',
    desc: 'Custom AMOLED solutions for wearables, medical, and premium consumer. Round, rectangular, and flexible form factors with custom cover glass, touch, and bonding.',
    sizes: '0.39" – 6"',
    resolution: 'Up to 3840×2160 UHD',
    structures: 'Soldering, ACF bonding, Connector',
    interfaces: 'Customizable',
    customizations: [
      { area: 'Panel', items: 'Dimension, color gamut, polarizer, shape (round/rect/square), heater, sunlight readable, FPC' },
      { area: 'Cover', items: 'Plastic or glass, AR/AG/HC treatment, thickness, shape, drill hole, mask printing (logo/icon/color)' },
      { area: 'Bezel', items: 'Metal or plastic frame, screw hole location, output port, bezel size' },
      { area: 'Touch', items: 'GG/GFF/GF/DITO/SITO/on-cell/in-cell, single/multi/gesture, I2C/USB' },
      { area: 'Bonding', items: 'Air/optical/nano bonding, OCA/OCR' },
      { area: 'Others', items: 'PCBA, interface bridge (8080/SPI/I2C), DCDC' },
    ],
    apps: ['Smart Watch', 'Medical', 'Automotive', 'Gaming'],
    advantages: ['High resolution', 'Rich colors & true blacks', 'Great wide viewing angles', 'Amazing contrast', 'Fast response time', 'Very thin', 'Good sunlight readability', 'Low power consumption'],
  },
  {
    name: 'Custom PMOLED Displays',
    slug: 'pmoled-displays',
    icon: 'fa-lightbulb',
    color: 'emerald-400',
    desc: 'Ultra-low-power custom OLED solutions for compact wearable and instrumentation applications. Custom shapes, colors, and interface configurations.',
    sizes: '0.5" – 5.9"',
    resolution: 'Up to 256×64 or 160×128',
    structures: 'COG, COF, TAB',
    interfaces: '8080, SPI, I2C',
    customizations: [
      { area: 'Panel', items: 'Resolution, dimension (OD/VA/AA/thickness), monochrome or full color, contrast 2000:1, viewing 160°, shape, heater, FPC' },
      { area: 'Cover', items: 'Plastic or glass, AR/AG/HC treatment, thickness, hardness, transmittance, shape, drill hole, mask printing' },
      { area: 'Bezel', items: 'Metal or plastic frame, screw hole, output port location, bezel size' },
      { area: 'Touch', items: 'RTP/CTP, GG/GFF/GF/DITO/SITO/on-cell/in-cell, single/multi/gesture' },
      { area: 'Bonding', items: 'Air/optical/nano bonding, OCA/OCR' },
      { area: 'Others', items: 'PCBA, interface bridge (8080/SPI/I2C), DCDC' },
    ],
    apps: ['Wearables', 'Small Gadgets', 'Sub Displays', 'Instrumentation'],
  },
  {
    name: 'Custom Passive LCD',
    slug: 'character-lcd',
    icon: 'fa-font',
    color: 'amber-400',
    desc: 'Custom character and graphic LCD solutions with modified dimensions, backlights, temperature ranges, and connector configurations. Low cost, ideal for small applications.',
    sizes: 'Up to 5–6"',
    resolution: 'Up to 320×240',
    structures: 'COB, COG, TAB, COF, SMT',
    interfaces: '6800, 8080, SPI, I2C',
    customizations: [
      { area: 'Panel', items: 'LC type (TN/STN/FSTN/VATN), image, monochrome/full color, background color, reflective/transflective/transmissive, shape, heater, FPC' },
      { area: 'Backlight', items: 'Backlight color, outline dimension, mounting hole, brightness/uniformity, lifetime' },
      { area: 'Cover', items: 'Plastic or glass, AR/AG/HC treatment, thickness, shape, drill hole, mask printing' },
      { area: 'Bezel', items: 'Metal or plastic frame, screw hole, output port location, bezel size' },
      { area: 'Touch', items: 'RTP/CTP, GG/GFF/GF/DITO/SITO/on-cell/in-cell, single/multi/gesture' },
      { area: 'Others', items: 'Air/optical/nano bonding, OCA/OCR, PCBA, interface bridge, LED driving, DCDC' },
    ],
    apps: ['Wearables', 'Medical', 'Transportation', 'Gaming', 'Military', 'Industrial', 'Instrumentation', 'Appliances'],
  },
];

const moqs = [
  { type: 'Catalog Modifications', desc: 'Bonding, cover glass, FPC, brightness', qty: '100–500 units', icon: 'fa-sliders-h' },
  { type: 'Semi-Custom Panels', desc: 'Modified standard panel designs', qty: '500–1,000 units', icon: 'fa-pencil-ruler' },
  { type: 'Fully Custom Designs', desc: 'New panel specification from scratch', qty: '1,000–5,000 units', icon: 'fa-cogs' },
];

const faqs = [
  { question: 'How long does custom display development take?', answer: 'Typical timeline is 8–16 weeks from requirements lock to prototype delivery. Catalog modifications (bonding, cover glass, FPC) can be as fast as 4–6 weeks. Fully custom panel designs may require 16–24 weeks. Production ramp follows prototype approval.' },
  { question: 'Do I need to commit to volume before starting a custom design?', answer: 'No. We begin the design process based on your requirements and expected volumes. There\'s no commitment until you approve the prototype and issue a production order. We understand that engineering schedules and market timing are uncertain.' },
  { question: 'What information do I need to start a custom display project?', answer: 'At minimum: display size range, resolution requirements, interface preference, brightness needs, environmental conditions (temperature, humidity, outdoor/indoor), touch requirements, mechanical constraints (thickness, weight, mounting), and expected annual volume.' },
  { question: 'Can you help if I don\'t know what display technology to use?', answer: 'Absolutely. Many customers come to us with application requirements, not display specifications. Our engineers evaluate your application and recommend the optimal technology, panel type, and configuration. We\'re technology-agnostic and recommend what\'s best for your product.' },
  { question: 'How do you handle EOL (End of Life) for custom displays?', answer: 'We proactively monitor our supply chain for EOL notices. When a panel or component reaches EOL, we identify replacement options, validate compatibility, and manage the transition — often before you\'re aware of the change. We also offer last-time-buy inventory programs.' },
  { question: 'Do custom modifications require NRE fees?', answer: 'Many modifications don\'t require tooling charges or NRE fees. Cover glass changes, optical bonding, brightness modifications, FPC changes, and interface board modifications are engineering work — not manufacturing tooling. Fully custom panel sizes and custom LCD glass may require tooling, which we\'ll clearly identify during design phase.' },
];

export default function CustomDisplaysPage() {
  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Custom Displays' }]} />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-4">Engineered to Spec</p>
              <h1 className="text-white text-3xl md:text-[2.75rem] font-bold leading-tight mb-6">
                Custom Display Solutions
              </h1>
              <p className="text-lg text-white/85 leading-relaxed mb-6">
                We design a display that works for your system — so you don&apos;t design a system around a display. Over 200 custom designs completed annually across TFT, AMOLED, PMOLED, and LCD technologies.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/support/request-quote" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors">
                  <i className="fas fa-file-alt" /> Start Your Project
                </Link>
                <a href="#process" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20">
                  <i className="fas fa-route" /> See Our Process
                </a>
              </div>
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '200+', label: 'Custom designs per year', icon: 'fa-drafting-compass' },
                { stat: '25+', label: 'Years of expertise', icon: 'fa-award' },
                { stat: '4–6 wk', label: 'For catalog modifications', icon: 'fa-clock' },
                { stat: '4', label: 'Display technologies', icon: 'fa-microchip' },
              ].map((item) => (
                <div key={item.label} className="p-5 bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 text-center">
                  <i className={`fas ${item.icon} text-accent text-xl mb-2`} />
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{item.stat}</p>
                  <p className="text-xs text-white/60 leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EDSP Process */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Our Methodology</p>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-navy mb-4">
              Engineered Display Solution Process (EDSP)
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our proven methodology takes your project from concept through mass production with full engineering support at every stage.
            </p>
          </div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[52px] left-[60px] right-[60px] h-[2px] bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {edspSteps.map((step) => (
                <div key={step.num} className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative z-10 w-14 h-14 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold text-lg">{step.num}</span>
                    </div>
                    <h3 className="text-[1.0625rem] font-bold text-navy">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed m-0">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Customize — gradient section */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 50%, #0f1d32 100%)' }}>
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Customization Options</p>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-white mb-4">What We Customize</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Every display in our catalog is a starting point. We modify every aspect to meet your exact specifications.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {customizationCategories.map((item) => (
              <div key={item.label} className="group p-5 bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/[0.12] hover:border-accent/30 transition-all duration-300">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-colors">
                  <i className={`fas ${item.icon} text-accent`} />
                </div>
                <h3 className="text-[0.9375rem] font-bold text-white mb-1">{item.label}</h3>
                <p className="text-sm text-white/70 m-0 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
          {/* Photo strip */}
          <div className="mt-12 flex justify-center gap-4 opacity-60">
            <div className="w-32 h-20 bg-white/10 rounded-lg overflow-hidden">
              <img src="/images/content/amoled-card.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-32 h-20 bg-white/10 rounded-lg overflow-hidden hidden sm:block">
              <img src="/images/content/pmoled-card.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-32 h-20 bg-white/10 rounded-lg overflow-hidden hidden md:block">
              <img src="/images/content/tft-card.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="w-32 h-20 bg-white/10 rounded-lg overflow-hidden hidden lg:block">
              <img src="/images/content/product-hero-square.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Technology-Specific Customizations */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">By Technology</p>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-navy mb-4">Custom Display Technologies</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each display technology offers unique customization options. Explore what&apos;s possible for your application.
            </p>
          </div>

          <div className="space-y-12">
            {technologies.map((tech, techIdx) => (
              <div key={tech.slug} className={`rounded-2xl border border-gray-200 overflow-hidden ${techIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                {/* Tech header */}
                <div className="p-6 md:p-8 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className={`fas ${tech.icon} text-accent text-xl`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy">{tech.name}</h3>
                        <p className="text-sm text-gray-600 m-0">{tech.desc}</p>
                      </div>
                    </div>
                    <Link href={`/products/${tech.slug}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg font-semibold text-sm hover:bg-blue transition-colors flex-shrink-0 self-start">
                      Browse Catalog <i className="fas fa-arrow-right text-xs" />
                    </Link>
                  </div>
                  {/* Quick specs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    {[
                      { label: 'Sizes', value: tech.sizes },
                      { label: 'Resolution', value: tech.resolution },
                      { label: 'Structures', value: tech.structures },
                      { label: 'Interfaces', value: tech.interfaces },
                    ].map((spec) => (
                      <div key={spec.label} className="p-3 bg-navy/5 rounded-lg">
                        <p className="text-[0.6875rem] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">{spec.label}</p>
                        <p className="text-sm font-bold text-navy m-0">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Customization areas */}
                <div className="p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Customization Areas</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tech.customizations.map((c) => (
                      <div key={c.area} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                        <p className="text-sm font-bold text-navy mb-1">{c.area}</p>
                        <p className="text-xs text-gray-600 m-0 leading-relaxed">{c.items}</p>
                      </div>
                    ))}
                  </div>
                  {/* Applications */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Applications:</span>
                    {tech.apps.map((app) => (
                      <span key={app} className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">{app}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No NRE + MOQ section — side-by-side */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* No NRE */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-dollar-sign text-accent text-xl" />
                </div>
                <h2 className="text-[1.625rem] font-bold text-navy">Custom Without the NRE</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Many display modifications don&apos;t require tooling charges or NRE fees. Cover glass changes, optical bonding, brightness modifications, FPC changes, and interface board modifications are engineering work — not manufacturing tooling.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                This means you get a customized display solution without the upfront costs that typically gate custom component decisions.
              </p>
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                <p className="text-sm text-gray-700 m-0">
                  <i className="fas fa-info-circle text-accent mr-2" />
                  Modifications that may require tooling: fully custom panel sizes, custom LCD glass, and custom cover glass molds. Our team will clearly identify any costs during design phase.
                </p>
              </div>
            </div>
            {/* MOQ */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-boxes text-navy text-xl" />
                </div>
                <h2 className="text-[1.625rem] font-bold text-navy">Minimum Order Quantities</h2>
              </div>
              <div className="space-y-4">
                {moqs.map((m) => (
                  <div key={m.type} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 bg-navy/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${m.icon} text-navy`} />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-[0.9375rem] font-bold text-navy">{m.type}</h3>
                        <span className="text-accent font-bold text-sm">{m.qty}</span>
                      </div>
                      <p className="text-xs text-gray-600 m-0">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                We work with companies of all sizes — from startups with initial prototype quantities to global OEMs requiring millions of units annually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.625rem] font-bold text-navy mb-8">Frequently Asked Questions</h2>
          <FAQAccordion items={faqs} twoColumn />
        </div>
      </section>

      <CTABanner
        title="Ready to Start Your Custom Display Project?"
        description="Share your application requirements — optical, mechanical, electrical, environmental — and our engineers will design the optimal solution."
        ctaLabel="Request a Quote"
        ctaHref="/support/request-quote"
        ctaIcon="fa-file-alt"
      />
    </>
  );
}
