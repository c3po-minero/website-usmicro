'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ContentSection {
  id: string;
  title: string;
  html: string;
}

interface ServiceTemplateProps {
  title: string;
  description: string;
  intro: string;
  sections: ContentSection[];
  serviceName: string;
}

/* ---------- Image map ---------- */
const serviceImages: Record<string, { img1: string; img2: string }> = {
  ems: { img1: '/images/services/ems-1.webp', img2: '/images/services/ems-2.webp' },
  integration: { img1: '/images/services/integration-1.webp', img2: '/images/services/integration-2.webp' },
  'inventory-management': { img1: '/images/services/inventory-1.webp', img2: '/images/services/inventory-2.webp' },
  logistics: { img1: '/images/services/logistics-1.webp', img2: '/images/services/logistics-2.webp' },
};

/* ---------- Helpers ---------- */
function getCapabilityIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('smt') || t.includes('surface mount')) return 'fa-microchip';
  if (t.includes('chip-on-board') || t.includes('cob')) return 'fa-project-diagram';
  if (t.includes('sub-assembly') || t.includes('box build')) return 'fa-box-open';
  if (t.includes('test') || t.includes('quality')) return 'fa-vial';
  if (t.includes('iso') || t.includes('certif')) return 'fa-certificate';
  if (t.includes('vertical') || t.includes('integrat')) return 'fa-link';
  if (t.includes('design')) return 'fa-drafting-compass';
  if (t.includes('prototype')) return 'fa-flask';
  if (t.includes('production') || t.includes('ramp')) return 'fa-industry';
  if (t.includes('logistics') || t.includes('supply') || t.includes('ship')) return 'fa-truck';
  if (t.includes('inventory') || t.includes('warehouse') || t.includes('stock')) return 'fa-warehouse';
  if (t.includes('optical') || t.includes('bonding')) return 'fa-layer-group';
  if (t.includes('touch') || t.includes('sensor') || t.includes('controller')) return 'fa-hand-pointer';
  if (t.includes('custom')) return 'fa-tools';
  if (t.includes('display') || t.includes('monitor')) return 'fa-desktop';
  if (t.includes('interface') || t.includes('conversion')) return 'fa-exchange-alt';
  if (t.includes('backlight') || t.includes('bright')) return 'fa-sun';
  if (t.includes('cover') || t.includes('glass')) return 'fa-shield-alt';
  if (t.includes('housing') || t.includes('enclosure')) return 'fa-cube';
  if (t.includes('safety') || t.includes('eol') || t.includes('end-of-life')) return 'fa-exclamation-triangle';
  if (t.includes('demand') || t.includes('forecast')) return 'fa-chart-line';
  if (t.includes('kitting')) return 'fa-boxes';
  if (t.includes('global') || t.includes('location') || t.includes('office')) return 'fa-globe';
  if (t.includes('fulfillment') || t.includes('direct')) return 'fa-dolly';
  return 'fa-cog';
}

function extractSubSections(html: string): { preamble: string; subs: { title: string; html: string }[] } {
  const h3Regex = /<h3>(.*?)<\/h3>/gi;
  const parts: string[] = [];
  const titles: string[] = [];
  let lastIndex = 0;
  let match;
  while ((match = h3Regex.exec(html)) !== null) {
    parts.push(html.slice(lastIndex, match.index));
    titles.push(match[1].replace(/<[^>]*>/g, '').trim());
    lastIndex = match.index + match[0].length;
  }
  parts.push(html.slice(lastIndex));
  return {
    preamble: parts[0] || '',
    subs: titles.map((t, i) => ({ title: t, html: (parts[i + 1] || '').trim() })),
  };
}

function stripAndTruncate(html: string, maxLen: number): string {
  const text = html.replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLen) return text;
  const cut = text.lastIndexOf('.', maxLen);
  if (cut > maxLen * 0.6) return text.substring(0, cut + 1);
  return text.substring(0, maxLen).trimEnd() + '…';
}

function extractFirstParagraph(html: string): string {
  const m = html.match(/<p>([\s\S]*?)<\/p>/i);
  if (m) return m[1].replace(/<[^>]*>/g, '').trim();
  return html.replace(/<[^>]*>/g, '').trim().split('\n')[0] || '';
}

/* ---------- Animated counter ---------- */
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ---------- Scroll-reveal wrapper ---------- */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`animate-fadeInUp ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
}

/* ---------- Section renderers ---------- */
function SectionRenderer({ section, index, serviceSlug }: { section: ContentSection; index: number; serviceSlug: string }) {
  const { preamble, subs } = extractSubSections(section.html);
  const t = section.title.toLowerCase();
  const isCapabilities = t.includes('capabilit');
  const isProcess = t.includes('process') || t.includes('how');
  const isQuality = t.includes('quality');
  const isApplications = t.includes('application') || t.includes('typical');
  const isIntegration = t.includes('integration') || t.includes('vertical') || t.includes('advantage') || t.includes('why');

  // Process / How it works — numbered timeline
  if (isProcess && subs.length > 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Our Process</p>
              <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-3">{section.title}</h2>
              {preamble && <p className="text-gray-600 text-lg max-w-2xl mx-auto">{stripAndTruncate(preamble, 200)}</p>}
            </div>
          </Reveal>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[40px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
            <div className={`grid grid-cols-1 md:grid-cols-2 ${subs.length <= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 relative z-[1]`}>
              {subs.map((sub, i) => (
                <Reveal key={sub.title} delay={i * 120}>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-lg hover:border-accent/20 transition-all duration-300 h-full">
                    <div className="w-12 h-12 rounded-full bg-navy text-accent flex items-center justify-center mx-auto mb-4 font-bold text-lg shadow-md">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-[1rem] font-bold text-navy mb-2">{sub.title}</h3>
                    <p className="text-sm text-gray-600 m-0 leading-relaxed">{stripAndTruncate(sub.html, 140)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Capabilities — dark gradient with icon cards (like "Key Advantages" in products)
  if (isCapabilities && subs.length > 0) {
    return (
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 50%, #0f1d32 100%)' }}>
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">What We Offer</p>
              <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-white mb-4">{section.title}</h2>
              {preamble && <p className="text-white/70 text-lg max-w-2xl mx-auto">{stripAndTruncate(preamble, 200)}</p>}
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subs.map((sub, i) => (
              <Reveal key={sub.title} delay={i * 100}>
                <div className="group p-6 bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/[0.12] hover:border-accent/30 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                    <i className={`fas ${getCapabilityIcon(sub.title)} text-accent text-lg`} />
                  </div>
                  <h3 className="text-[1.0625rem] font-bold text-white mb-2">{sub.title}</h3>
                  <p className="text-sm text-white/70 m-0 leading-relaxed">{stripAndTruncate(sub.html, 180)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Quality system — accent-bordered card
  if (isQuality) {
    return (
      <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <div className="bg-gradient-to-br from-navy to-blue rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-certificate text-accent text-xl" />
                  </div>
                  <h2 className="text-[1.75rem] font-bold text-white">{section.title}</h2>
                </div>
                <div className="prose prose-invert max-w-none [&_a]:text-accent [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_li]:text-white/80 [&_p]:text-white/80 [&_strong]:text-white" dangerouslySetInnerHTML={{ __html: section.html }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  // Applications — pill tags + links
  if (isApplications) {
    const items = (section.html.match(/<li>([\s\S]*?)<\/li>/gi) || []).map(li => li.replace(/<\/?li>/gi, '').replace(/<[^>]*>/g, '').trim());
    const trailingHtml = section.html.replace(/<[uo]l>[\s\S]*?<\/[uo]l>/gi, '').trim();
    return (
      <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Use Cases</p>
              <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-3">{section.title}</h2>
            </div>
          </Reveal>
          {items.length > 0 && (
            <Reveal delay={150}>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {items.map((item, i) => (
                  <span key={i} className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-navy shadow-sm hover:border-accent/30 hover:shadow-md transition-all duration-200">
                    <i className={`fas ${getCapabilityIcon(item)} text-accent mr-2`} />
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
          {trailingHtml && trailingHtml.replace(/<[^>]*>/g, '').trim().length > 10 && (
            <Reveal delay={250}>
              <div className="text-center text-gray-600 [&_a]:text-accent [&_a]:font-semibold" dangerouslySetInnerHTML={{ __html: trailingHtml }} />
            </Reveal>
          )}
        </div>
      </section>
    );
  }

  // Integration / Why / Advantages — side-by-side with expandable items
  if (isIntegration && subs.length === 0) {
    // Extract list items from the section
    const items = (section.html.match(/<li>([\s\S]*?)<\/li>/gi) || []).map(li => {
      const content = li.replace(/<\/?li>/gi, '').trim();
      const boldMatch = content.match(/^<strong>(.*?)<\/strong>\s*[-–—]?\s*([\s\S]*)/i);
      if (boldMatch) return { title: boldMatch[1].replace(/<[^>]*>/g, '').trim(), desc: boldMatch[2].replace(/<[^>]*>/g, '').trim() };
      const text = content.replace(/<[^>]*>/g, '').trim();
      const dashIdx = text.indexOf('—');
      if (dashIdx > 0) return { title: text.substring(0, dashIdx).trim(), desc: text.substring(dashIdx + 1).trim() };
      return { title: text, desc: '' };
    });

    if (items.length > 0) {
      const introHtml = section.html.replace(/<[uo]l>[\s\S]*?<\/[uo]l>/gi, '');
      return (
        <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-[1280px] mx-auto px-6">
            <Reveal>
              <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-4">{section.title}</h2>
              {introHtml && introHtml.replace(/<[^>]*>/g, '').trim().length > 20 && (
                <div className="text-gray-600 text-lg max-w-3xl mb-8 [&_p]:mb-3 [&_strong]:text-gray-900" dangerouslySetInnerHTML={{ __html: introHtml }} />
              )}
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {items.map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="flex gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${getCapabilityIcon(item.title)} text-accent`} />
                    </div>
                    <div>
                      <h3 className="text-[0.9375rem] font-bold text-navy mb-1">{item.title}</h3>
                      {item.desc && <p className="text-sm text-gray-600 m-0 leading-relaxed">{item.desc}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );
    }
  }

  // Sections with h3 sub-sections — expandable accordions
  if (subs.length >= 3) {
    return (
      <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} id={section.id}>
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal>
            <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-4">{section.title}</h2>
            {preamble && preamble.replace(/<[^>]*>/g, '').trim().length > 20 && (
              <div className="text-gray-600 text-lg max-w-3xl mb-8 [&_p]:mb-3 [&_strong]:text-gray-900" dangerouslySetInnerHTML={{ __html: preamble }} />
            )}
          </Reveal>
          <div className="space-y-4">
            {subs.map((sub, i) => (
              <Reveal key={sub.title} delay={i * 60}>
                <details className="group bg-white rounded-xl border border-gray-200 hover:border-accent/20 transition-colors overflow-hidden">
                  <summary className="flex items-center gap-4 p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-open:bg-accent/20 transition-colors">
                      <i className={`fas ${getCapabilityIcon(sub.title)} text-accent`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[1rem] font-bold text-navy leading-snug">{sub.title}</h3>
                      <p className="text-sm text-gray-500 m-0 mt-0.5 group-open:hidden">{stripAndTruncate(extractFirstParagraph(sub.html), 120)}</p>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">
                      <i className="fas fa-chevron-down text-sm" />
                    </div>
                  </summary>
                  <div className="px-5 pb-5 pt-0 pl-[4.5rem]">
                    <div className="text-sm text-gray-700 leading-relaxed [&_p]:mb-3 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5" dangerouslySetInnerHTML={{ __html: sub.html }} />
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default prose
  return (
    <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} id={section.id}>
      <div className="max-w-[900px] mx-auto px-6">
        <Reveal>
          <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-6">{section.title}</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Main template ---------- */
export default function ServiceTemplate({ title, description, intro, sections, serviceName }: ServiceTemplateProps) {
  const displayTitle = title.replace(/\s*\|.*$/, '').trim();
  // Derive service slug from serviceName
  const serviceSlug = serviceName.toLowerCase().replace(/\s+services?$/i, '').replace(/\s+/g, '-');
  const images = serviceImages[serviceSlug] || serviceImages['ems'];

  return (
    <>
      {/* Intro with photo collage — matches products/applications */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-[1.625rem] font-bold text-navy mb-6">{displayTitle}</h2>
              <div className="prose max-w-none text-gray-700 text-lg leading-relaxed [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_h1]:hidden" dangerouslySetInnerHTML={{ __html: intro }} />
            </div>
            <div className="lg:col-span-2 relative min-h-[350px] hidden lg:block" aria-hidden="true">
              <img
                src={images.img1}
                alt={displayTitle}
                className="absolute left-0 top-0 w-[85%] h-[85%] object-cover rounded-xl shadow-2xl z-[1]"
                loading="eager"
              />
              <img
                src={images.img2}
                alt={`${displayTitle} detail`}
                className="absolute right-0 bottom-0 w-[160px] h-[160px] object-cover rounded-xl shadow-xl z-[3] border-4 border-white"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content sections */}
      {sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} index={i} serviceSlug={serviceSlug} />
      ))}

      {/* CTA */}
      <section className="bg-gradient-to-br from-navy to-blue text-white py-16 text-center">
        <div className="max-w-[700px] mx-auto px-6">
          <Reveal>
            <h2 className="text-white text-[1.875rem] font-bold mb-4">Need {serviceName}?</h2>
            <p className="text-white/80 mb-8">Contact our team to discuss your requirements and get a custom quote.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-lg border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
                <i className="fas fa-comments" /> Contact Team
              </Link>
              <Link href="/support/request-quote" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-transparent text-white rounded-lg border-2 border-white/50 hover:bg-white hover:text-navy transition-all">
                <i className="fas fa-file-alt" /> Request a Quote
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
