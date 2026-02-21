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
  if (t.includes('challenge')) return 'fa-exclamation-triangle';
  if (t.includes('environment')) return 'fa-globe';
  if (t.includes('standard')) return 'fa-certificate';
  if (t.includes('technolog')) return 'fa-microchip';
  if (t.includes('display')) return 'fa-desktop';
  return 'fa-chevron-right';
}

function getSubIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('color')) return 'fa-eye';
  if (t.includes('resolution')) return 'fa-expand';
  if (t.includes('viewing')) return 'fa-users';
  if (t.includes('bright') || t.includes('contrast')) return 'fa-sun';
  if (t.includes('antimicrobial') || t.includes('microbial')) return 'fa-bacterium';
  if (t.includes('chemical')) return 'fa-flask';
  if (t.includes('sealed') || t.includes('cleanable') || t.includes('ip6') || t.includes('ip5')) return 'fa-tint-slash';
  if (t.includes('touch') || t.includes('glove')) return 'fa-hand-pointer';
  if (t.includes('temperature') || t.includes('thermal')) return 'fa-thermometer-half';
  if (t.includes('rugged') || t.includes('vibration') || t.includes('shock') || t.includes('impact')) return 'fa-shield-alt';
  if (t.includes('sunlight') || t.includes('outdoor') || t.includes('readab')) return 'fa-sun';
  if (t.includes('emi') || t.includes('emc')) return 'fa-bolt';
  if (t.includes('power') || t.includes('battery')) return 'fa-battery-full';
  if (t.includes('weight') || t.includes('thin') || t.includes('compact') || t.includes('portable')) return 'fa-feather-alt';
  if (t.includes('lifetime') || t.includes('reliab') || t.includes('longevity')) return 'fa-clock';
  if (t.includes('cost')) return 'fa-dollar-sign';
  if (t.includes('monitor')) return 'fa-desktop';
  if (t.includes('surgical')) return 'fa-heartbeat';
  if (t.includes('wearab')) return 'fa-watch';
  if (t.includes('tablet')) return 'fa-tablet-alt';
  if (t.includes('point-of-care') || t.includes('portable')) return 'fa-briefcase-medical';
  if (t.includes('instrument')) return 'fa-tachometer-alt';
  if (t.includes('iso') || t.includes('fda') || t.includes('iec') || t.includes('mil-std') || t.includes('compliance')) return 'fa-certificate';
  if (t.includes('quality') || t.includes('biocompat')) return 'fa-check-double';
  if (t.includes('design') || t.includes('document')) return 'fa-file-alt';
  if (t.includes('traceab')) return 'fa-barcode';
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

/** Strip HTML to plain text and truncate */
function stripAndTruncate(html: string, maxLen: number): string {
  const text = html.replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLen) return text;
  // Find the last period within range
  const cut = text.lastIndexOf('.', maxLen);
  if (cut > maxLen * 0.6) return text.substring(0, cut + 1);
  return text.substring(0, maxLen).trimEnd() + '…';
}

/** Extract first paragraph as summary from html */
function extractFirstParagraph(html: string): string {
  const m = html.match(/<p>([\s\S]*?)<\/p>/i);
  if (m) return m[1].replace(/<[^>]*>/g, '').trim();
  return html.replace(/<[^>]*>/g, '').trim().split('\n')[0] || '';
}

const proseClasses = "prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2";

function RenderSection({ section, index, totalSections }: { section: ContentSection; index: number; totalSections: number }) {
  const { preamble, subs } = extractSubSections(section.html);
  const isRecommended = /recommend|product/i.test(section.title);
  const isRequirements = /requirement|challenge|standard|specification/i.test(section.title);
  const isExpertise = /expertise|experience|capability|why/i.test(section.title);
  const hasSubSections = subs.length > 0;

  // Recommended Products — clean cards with icon, title, and truncated summary
  if (isRecommended && hasSubSections) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Solutions</p>
            <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-3">{section.title}</h2>
            {preamble && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">{stripAndTruncate(preamble, 200)}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subs.map((sub) => {
              const summary = stripAndTruncate(sub.html, 160);
              return (
                <div key={sub.title} className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-accent/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <i className={`fas ${getSubIcon(sub.title)} text-accent text-lg`} />
                  </div>
                  <h3 className="text-[1.0625rem] font-bold text-navy mb-2 leading-snug">{sub.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed m-0">{summary}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Requirements / Technical sections with many sub-sections — accordion-style with expandable detail
  if ((isRequirements || (!isRecommended && !isExpertise)) && hasSubSections && subs.length >= 3) {
    return (
      <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} id={section.id}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-3">{section.title}</h2>
            {preamble && (
              <div className="text-gray-600 text-lg max-w-3xl [&_p]:mb-2 [&_strong]:text-gray-900" dangerouslySetInnerHTML={{ __html: preamble }} />
            )}
          </div>
          <div className="space-y-4">
            {subs.map((sub) => (
              <SubSectionAccordion key={sub.title} sub={sub} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Expertise / Why Us — dark gradient
  if (isExpertise) {
    return (
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 50%, #0f1d32 100%)' }}>
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Why US Micro</p>
            <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-white mb-4">{section.title}</h2>
          </div>
          {hasSubSections ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {subs.map((sub, i) => {
                const icons = ['fa-trophy', 'fa-handshake', 'fa-brain', 'fa-tools', 'fa-rocket', 'fa-headset', 'fa-certificate', 'fa-globe', 'fa-clock'];
                return (
                  <div key={sub.title} className="group p-5 bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/[0.12] hover:border-accent/30 transition-all duration-300">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-colors">
                      <i className={`fas ${icons[i % icons.length]} text-accent`} />
                    </div>
                    <h3 className="text-[0.9375rem] font-bold text-white mb-1">{sub.title}</h3>
                    <p className="text-sm text-white/70 m-0 leading-relaxed">{stripAndTruncate(sub.html, 150)}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="prose prose-invert max-w-3xl mx-auto [&_a]:text-accent [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_li]:text-white/80 [&_p]:text-white/80 [&_strong]:text-white" dangerouslySetInnerHTML={{ __html: section.html }} />
          )}
        </div>
      </section>
    );
  }

  // Sections with few sub-sections (2) — side by side cards
  if (hasSubSections && subs.length === 2) {
    return (
      <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} id={section.id}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-10">{section.title}</h2>
          {preamble && (
            <div className="text-gray-600 text-lg max-w-3xl mb-8 [&_p]:mb-3 [&_strong]:text-gray-900" dangerouslySetInnerHTML={{ __html: preamble }} />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {subs.map((sub) => (
              <div key={sub.title} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <i className={`fas ${getSubIcon(sub.title)} text-accent`} />
                  </div>
                  <h3 className="text-lg font-bold text-navy">{sub.title}</h3>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed [&_p]:mb-3 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1" dangerouslySetInnerHTML={{ __html: sub.html }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default — clean prose section
  return (
    <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} id={section.id}>
      <div className="max-w-[900px] mx-auto px-6">
        <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-6">{section.title}</h2>
        <div className={proseClasses} dangerouslySetInnerHTML={{ __html: section.html }} />
      </div>
    </section>
  );
}

/** Expandable sub-section: shows title + first sentence, click to expand */
function SubSectionAccordion({ sub }: { sub: SubSection }) {
  const summary = extractFirstParagraph(sub.html);
  const truncated = stripAndTruncate(summary, 120);
  // Check if there's more content beyond the first paragraph
  const paragraphs = sub.html.match(/<p>[\s\S]*?<\/p>/gi) || [];
  const lists = sub.html.match(/<[uo]l>[\s\S]*?<\/[uo]l>/gi) || [];
  const hasMore = paragraphs.length > 1 || lists.length > 0 || sub.html.replace(/<[^>]*>/g, '').trim().length > 200;

  return (
    <details className="group bg-white rounded-xl border border-gray-200 hover:border-accent/20 transition-colors overflow-hidden">
      <summary className="flex items-center gap-4 p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-open:bg-accent/20 transition-colors">
          <i className={`fas ${getSubIcon(sub.title)} text-accent`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[1rem] font-bold text-navy leading-snug">{sub.title}</h3>
          <p className="text-sm text-gray-500 m-0 mt-0.5 group-open:hidden">{truncated}</p>
        </div>
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">
          <i className="fas fa-chevron-down text-sm" />
        </div>
      </summary>
      <div className="px-5 pb-5 pt-0 pl-[4.5rem]">
        <div className="text-sm text-gray-700 leading-relaxed [&_p]:mb-3 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_li]:text-gray-600" dangerouslySetInnerHTML={{ __html: sub.html }} />
      </div>
    </details>
  );
}

export default function ApplicationTemplate({ title, description, intro, sections, faqs, industry }: ApplicationTemplateProps) {
  const industryName = title.replace(/\s*(Display|Solutions?|Displays?)\s*/gi, ' ').replace(/\s*\|.*$/, '').trim();
  const displayTitle = title.replace(/\s*\|.*$/, '').trim();

  // Extract first h2 title from intro sections for the overview heading
  const firstSection = sections[0];
  const overviewTitle = firstSection?.title || displayTitle;

  return (
    <>
      {/* Overview with photo collage — matches product category pages */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Left column: 60% — text */}
            <div className="lg:col-span-3">
              <h2 className="text-[1.625rem] font-bold text-navy mb-6">{displayTitle}</h2>
              <div className="prose max-w-none text-gray-700 text-lg leading-relaxed [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_h1]:hidden" dangerouslySetInnerHTML={{ __html: intro }} />
            </div>

            {/* Right column: 40% — photo collage */}
            <div className="lg:col-span-2 relative min-h-[350px] hidden lg:block" aria-hidden="true">
              <img
                src={`/images/applications/${industry}.webp`}
                alt={`${displayTitle}`}
                className="absolute left-0 top-0 w-[85%] h-[85%] object-cover rounded-xl shadow-2xl z-[1]"
                loading="eager"
              />
              <img
                src={`/images/applications/${industry}-2.webp`}
                alt={`${displayTitle} application`}
                className="absolute right-0 bottom-0 w-[160px] h-[160px] object-cover rounded-xl shadow-xl z-[3] border-4 border-white"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content sections */}
      {sections.map((section, i) => (
        <RenderSection key={section.id} section={section} index={i} totalSections={sections.length} />
      ))}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="text-center text-[1.625rem] font-bold text-navy mb-8">Frequently Asked Questions</h2>
            <FAQAccordion items={faqs} twoColumn />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-br from-navy to-blue text-white py-16 text-center">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="text-white text-[1.875rem] font-bold mb-4">Start Your {industryName} Display Project</h2>
          <p className="text-white/80 mb-8">Our engineers have decades of experience supplying displays to leading {industryName.toLowerCase()} manufacturers worldwide.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-lg border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
              <i className="fas fa-comments" /> Contact Engineering
            </Link>
            <Link href="/support/request-quote" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-transparent text-white rounded-lg border-2 border-white/50 hover:bg-white hover:text-navy transition-all">
              <i className="fas fa-file-alt" /> Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
