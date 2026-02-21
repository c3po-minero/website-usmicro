'use client';

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
  if (t.includes('logistics') || t.includes('supply')) return 'fa-truck';
  if (t.includes('inventory')) return 'fa-warehouse';
  if (t.includes('optical') || t.includes('bonding')) return 'fa-layer-group';
  if (t.includes('touch') || t.includes('sensor')) return 'fa-hand-pointer';
  if (t.includes('custom')) return 'fa-tools';
  if (t.includes('display driver')) return 'fa-desktop';
  if (t.includes('touch controller')) return 'fa-hand-pointer';
  if (t.includes('interface')) return 'fa-exchange-alt';
  if (t.includes('backlight')) return 'fa-sun';
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

function SectionRenderer({ section, index, isFirst }: { section: ContentSection; index: number; isFirst: boolean }) {
  const { preamble, subs } = extractSubSections(section.html);
  const bgClass = index % 2 === 0 ? '' : 'bg-gray-50';
  const isCapabilities = section.title.toLowerCase().includes('capabilit');
  const isProcess = section.title.toLowerCase().includes('process');
  const isApplications = section.title.toLowerCase().includes('application') || section.title.toLowerCase().includes('typical');
  const isQuality = section.title.toLowerCase().includes('quality');

  // First "Why" section: 2-column with image placeholder on right
  if (isFirst) {
    return (
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-[1.625rem] font-bold text-navy mb-6">{section.title}</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [[&_a:hover]:text-accent_a:hover]:text-accent-text [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
            </div>
            <div className="lg:col-span-2 hidden lg:block relative min-h-[350px]" aria-hidden="true">
              <div className="absolute left-0 top-0 w-[calc(100%-30px)] h-[calc(100%-40px)] bg-gray-200 rounded-xl shadow-lg z-[1] flex items-center justify-center">
                <i className="fas fa-industry text-gray-400 text-4xl" />
              </div>
              <div className="absolute right-0 bottom-0 w-[140px] h-[140px] bg-gray-300 rounded-xl shadow-md z-[3] flex items-center justify-center border-4 border-white">
                <i className="fas fa-microchip text-gray-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Process steps - numbered timeline with connecting line
  if (isProcess && subs.length > 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.625rem] font-bold text-navy mb-10">{section.title}</h2>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[50px] left-0 right-0 h-[3px] bg-gray-200 z-0" aria-hidden="true">
              <div className="h-full bg-accent/30 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-[1]">
              {subs.map((sub, i) => (
                <div key={sub.title} className="relative bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg">{i + 1}</div>
                  <h3 className="font-bold text-navy mb-2">{sub.title}</h3>
                  <div className="text-sm text-gray-600 [&_p]:mb-2" dangerouslySetInnerHTML={{ __html: sub.html }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Capabilities - benefit grid cards with icons
  if (isCapabilities && subs.length > 0) {
    return (
      <section className={`py-16 ${bgClass}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-4">{section.title}</h2>
          {preamble && (
            <div className="prose max-w-none text-gray-700 mb-8 [&_p]:mb-4 [&_a]:text-blue-mid" dangerouslySetInnerHTML={{ __html: preamble }} />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subs.map((sub) => (
              <div key={sub.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <i className={`fas ${getCapabilityIcon(sub.title)} text-accent text-2xl mb-4 block`} />
                <h3 className="font-bold text-navy mb-2">{sub.title}</h3>
                <div className="text-sm text-gray-600 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:text-gray-900 [&_a]:text-blue-mid" dangerouslySetInnerHTML={{ __html: sub.html }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Quality system - boxed card section
  if (isQuality) {
    return (
      <section className={`py-16 ${bgClass}`}>
        <div className="max-w-[900px] mx-auto px-6">
          <div className="bg-blue-light border border-gray-200 rounded-xl p-8">
            <h2 className="text-[1.625rem] font-bold text-navy mb-4">
              <i className="fas fa-certificate text-accent mr-2" />
              {section.title}
            </h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
          </div>
        </div>
      </section>
    );
  }

  // Applications - horizontal card strip
  if (isApplications && subs.length > 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-6">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subs.map((sub) => (
              <div key={sub.title} className="p-5 bg-white border border-gray-200 rounded-xl hover:border-accent hover:shadow-sm transition-all">
                <h3 className="font-bold text-navy mb-1 text-base">
                  <i className={`fas ${getCapabilityIcon(sub.title)} text-accent mr-2`} />
                  {sub.title}
                </h3>
                <div className="text-[0.8125rem] text-gray-600 [&_p]:mb-0" dangerouslySetInnerHTML={{ __html: sub.html }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: prose section
  return (
    <section className={`py-16 ${bgClass}`} id={section.id}>
      <div className="max-w-[900px] mx-auto px-6">
        <h2 className="text-[1.625rem] font-bold text-navy mb-6">{section.title}</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [[&_a:hover]:text-accent_a:hover]:text-accent-text [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
      </div>
    </section>
  );
}

export default function ServiceTemplate({ title, description, intro, sections, serviceName }: ServiceTemplateProps) {
  return (
    <>
      {/* Intro */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-[900px]">
            <div className="prose max-w-none text-gray-700 text-lg leading-relaxed [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid" dangerouslySetInnerHTML={{ __html: intro }} />
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} index={i} isFirst={i === 0} />
      ))}

      {/* CTA with 2 buttons */}
      <section className="bg-gradient-to-br from-blue to-navy text-white py-16 text-center">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="text-white text-[1.875rem] font-bold mb-4">Need {serviceName}?</h2>
          <p className="text-white/80 mb-8">Contact our team to discuss your requirements and get a quote.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
              <i className="fas fa-comments" /> Contact Team
            </Link>
            <Link href="/support/request-quote" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-transparent text-white rounded-md border-2 border-white hover:bg-white hover:text-navy transition-all">
              <i className="fas fa-file-alt" /> Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
