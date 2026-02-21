'use client';

import Link from 'next/link';
import FAQAccordion from '@/components/ui/FAQAccordion';

interface ContentSection {
  id: string;
  title: string;
  html: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface SubSection {
  title: string;
  html: string;
}

interface ApplicationTemplateProps {
  title: string;
  description: string;
  intro: string;
  sections: ContentSection[];
  faqs: FAQ[];
  industry: string;
}

function getSectionIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('requirement')) return 'fa-clipboard-list';
  if (t.includes('safety') || t.includes('biocompat')) return 'fa-shield-alt';
  if (t.includes('touch')) return 'fa-hand-pointer';
  if (t.includes('regulat') || t.includes('compliance')) return 'fa-clipboard-check';
  if (t.includes('recommend') || t.includes('product')) return 'fa-boxes';
  if (t.includes('expertise') || t.includes('experience')) return 'fa-award';
  if (t.includes('capabilit')) return 'fa-cogs';
  return 'fa-chevron-right';
}

function getRequirementIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('color')) return 'fa-eye';
  if (t.includes('resolution')) return 'fa-expand';
  if (t.includes('viewing')) return 'fa-users';
  if (t.includes('bright') || t.includes('contrast')) return 'fa-sun';
  if (t.includes('antimicrobial') || t.includes('microbial')) return 'fa-bacterium';
  if (t.includes('chemical')) return 'fa-flask';
  if (t.includes('sealed') || t.includes('cleanable')) return 'fa-tint-slash';
  if (t.includes('touch') || t.includes('glove')) return 'fa-hand-pointer';
  if (t.includes('temperature') || t.includes('thermal')) return 'fa-thermometer-half';
  if (t.includes('rugged') || t.includes('vibration')) return 'fa-shield-alt';
  if (t.includes('sunlight') || t.includes('outdoor')) return 'fa-sun';
  if (t.includes('emi') || t.includes('emc')) return 'fa-bolt';
  return 'fa-check-circle';
}

function extractSubSections(html: string): { preamble: string; subs: SubSection[] } {
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

/** Extract a key stat from intro text (e.g., "1,500+ nits", "IP65+", numbers with units) */
function extractKeyStat(intro: string): { number: string; text: string } | null {
  const plainText = intro.replace(/<[^>]*>/g, '');
  // Look for patterns like "1,500+ nits" or "IP65" or numbers with + suffix
  const patterns = [
    /(\d[\d,]*\+?\s*nits)/i,
    /(IP\d+\+?)/i,
    /(\d[\d,]*\+?\s*(?:hours|years|degrees?))/i,
  ];
  for (const pat of patterns) {
    const m = plainText.match(pat);
    if (m) {
      // Get surrounding context
      const idx = plainText.indexOf(m[1]);
      const sentence = plainText.substring(Math.max(0, idx - 60), Math.min(plainText.length, idx + m[1].length + 60));
      const parts = sentence.split(m[1]);
      return { number: m[1].trim(), text: (parts[1] || parts[0] || '').replace(/^\s*[,.]?\s*/, '').trim() };
    }
  }
  return null;
}

function RenderSection({ section, index }: { section: ContentSection; index: number }) {
  const { preamble, subs } = extractSubSections(section.html);
  const isRecommended = section.title.toLowerCase().includes('recommend') || section.title.toLowerCase().includes('product');
  const hasSubSections = subs.length > 0;
  const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

  // Recommended products section - card grid with icon circles
  if (isRecommended && hasSubSections) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-8">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subs.map((sub) => (
              <div key={sub.title} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent text-xl">
                    <i className={`fas ${getRequirementIcon(sub.title)}`} />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{sub.title}</h3>
                  <div className="text-sm text-gray-600 leading-relaxed [&_a]:text-blue-mid [[&_a:hover]:text-accent_a:hover]:text-accent-text [&_p]:mb-2" dangerouslySetInnerHTML={{ __html: sub.html }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Sections with sub-sections as requirement cards (2x2 grid with orange circle icons)
  if (hasSubSections && subs.length >= 3) {
    return (
      <section className={`py-16 ${bgClass}`} id={section.id}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-4">
            <i className={`fas ${getSectionIcon(section.title)} text-accent mr-3`} />
            {section.title}
          </h2>
          {preamble && (
            <div className="prose max-w-none text-gray-700 mb-8 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [[&_a:hover]:text-accent_a:hover]:text-accent-text" dangerouslySetInnerHTML={{ __html: preamble }} />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subs.map((sub) => (
              <div key={sub.title} className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-lg">
                  <i className={`fas ${getRequirementIcon(sub.title)}`} />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1 text-base">{sub.title}</h3>
                  <div className="text-sm text-gray-600 leading-relaxed [&_p]:mb-2 [&_strong]:text-gray-900 [&_a]:text-blue-mid [[&_a:hover]:text-accent_a:hover]:text-accent-text [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1" dangerouslySetInnerHTML={{ __html: sub.html }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default prose section
  return (
    <section className={`py-16 ${bgClass}`} id={section.id}>
      <div className="max-w-[900px] mx-auto px-6">
        <h2 className="text-[1.625rem] font-bold text-navy mb-6">
          <i className={`fas ${getSectionIcon(section.title)} text-accent mr-3`} />
          {section.title}
        </h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [[&_a:hover]:text-accent_a:hover]:text-accent-text [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
      </div>
    </section>
  );
}

export default function ApplicationTemplate({ title, description, intro, sections, faqs, industry }: ApplicationTemplateProps) {
  const industryName = industry.charAt(0).toUpperCase() + industry.slice(1);
  const keyStat = extractKeyStat(intro);

  return (
    <>
      {/* Intro */}
      <section className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="prose max-w-none text-gray-700 text-lg leading-relaxed [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [[&_a:hover]:text-accent_a:hover]:text-accent-text" dangerouslySetInnerHTML={{ __html: intro }} />

          {/* Stat callout bar */}
          {keyStat && (
            <div className="bg-blue-light border-l-4 border-accent rounded-r-xl p-6 my-8">
              <div className="text-[2rem] font-extrabold text-accent leading-none">{keyStat.number}</div>
              <div className="text-[0.9375rem] text-gray-700 mt-1">{keyStat.text}</div>
            </div>
          )}
        </div>
      </section>

      {/* Content Sections */}
      {sections.map((section, i) => (
        <RenderSection key={section.id} section={section} index={i} />
      ))}

      {/* Case Study - dark navy background */}
      <section className="bg-gradient-to-br from-navy to-blue text-white py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[1.5px] text-accent font-bold mb-3">
                <i className="fas fa-award mr-1.5" /> Case Study
              </p>
              <h3 className="text-white text-[1.5rem] font-bold mb-4">
                {industryName} Display Project for Leading OEM
              </h3>
              <p className="text-white/85 mb-4">
                A major {industryName.toLowerCase()} manufacturer needed a custom display solution meeting strict industry standards. US Micro Products engineered a complete display assembly — from panel selection through optical bonding and environmental testing — delivered within 10 weeks from design freeze to production samples.
              </p>
              <Link href="/contact" className="text-accent font-semibold inline-flex items-center gap-1.5 hover:text-accent-hover transition-colors">
                Discuss Your Project <i className="fas fa-arrow-right text-sm" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl h-[200px] flex items-center justify-center">
                <i className="fas fa-desktop text-white/20 text-4xl" />
              </div>
              <div className="bg-white/10 rounded-xl h-[200px] flex items-center justify-center">
                <i className="fas fa-microchip text-white/20 text-4xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="text-center text-[1.625rem] font-bold text-navy mb-8">Frequently Asked Questions</h2>
            <FAQAccordion items={faqs} twoColumn />
          </div>
        </section>
      )}

      {/* CTA with 2 buttons */}
      <section className="bg-gradient-to-br from-blue to-navy text-white py-16 text-center">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="text-white text-[1.875rem] font-bold mb-4">Discuss Your {industryName} Display Project</h2>
          <p className="text-white/80 mb-8">Our team has decades of experience supplying displays to the world&apos;s leading {industryName.toLowerCase()} manufacturers.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
              <i className="fas fa-comments" /> Contact Engineering
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
