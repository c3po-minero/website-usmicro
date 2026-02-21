import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage } from '../../../../lib/content';
import { parseContentSections } from '../../../../lib/content-parser';
import { getProductsByCategory, getCategoryBySlug, CATEGORIES } from '../../../../lib/products';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import ProductTable from '@/components/products/ProductTable';
import CTABanner from '@/components/ui/CTABanner';
import FAQAccordion from '@/components/ui/FAQAccordion';
import Link from 'next/link';

interface Props {
  params: Promise<{ category: string }>;
}

const contentFileMap: Record<string, string> = {
  'tft-displays': 'products/tft-displays.md',
  'amoled-displays': 'products/amoled-displays.md',
  'pmoled-displays': 'products/pmoled-displays.md',
  'character-lcd': 'products/character-lcd.md',
  'graphic-lcd': 'products/graphic-lcd.md',
  'smart-displays': 'products/smart-displays.md',
  'touch-panels': 'products/touch-panels.md',
  'open-frame-monitors': 'products/open-frame-monitors.md',
  'tablets': 'products/tablets.md',
};

const categoryImages: Record<string, { portrait: string; square: string }> = {
  'tft-displays': {
    portrait: '/images/content/product-hero-portrait.webp',
    square: '/images/content/product-hero-square.webp',
  },
  'amoled-displays': {
    portrait: '/images/content/amoled-card.webp',
    square: '/images/products/amoled-displays.webp',
  },
  'pmoled-displays': {
    portrait: '/images/content/pmoled-card.webp',
    square: '/images/products/pmoled-displays.webp',
  },
  'character-lcd': {
    portrait: '/images/content/character-lcd-1.webp',
    square: '/images/content/character-lcd-2.webp',
  },
  'graphic-lcd': {
    portrait: '/images/content/graphic-lcd-1.webp',
    square: '/images/content/graphic-lcd-2.webp',
  },
  'smart-displays': {
    portrait: '/images/content/smart-card.webp',
    square: '/images/products/smart-displays.webp',
  },
  'touch-panels': {
    portrait: '/images/content/touch-card.webp',
    square: '/images/products/touch-panels.webp',
  },
  'open-frame-monitors': {
    portrait: '/images/content/open-frame-card.webp',
    square: '/images/products/open-frame-monitors.webp',
  },
  'tablets': {
    portrait: '/images/content/tablets-1.webp',
    square: '/images/content/tablets-2.webp',
  },
};

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: cat.name,
    description: `Browse ${cat.name} from US Micro Products. Filterable specification table with datasheets and request quote.`,
  };
}

function getSpecIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('ips')) return 'fa-eye';
  if (t.includes('tn')) return 'fa-bolt';
  if (t.includes('mva')) return 'fa-adjust';
  if (t.includes('interface')) return 'fa-plug';
  if (t.includes('bright')) return 'fa-sun';
  if (t.includes('temperature')) return 'fa-thermometer-half';
  if (t.includes('touch')) return 'fa-hand-pointer';
  if (t.includes('resolution')) return 'fa-expand';
  if (t.includes('amoled')) return 'fa-mobile-alt';
  if (t.includes('oled')) return 'fa-lightbulb';
  if (t.includes('color')) return 'fa-palette';
  if (t.includes('contrast')) return 'fa-adjust';
  if (t.includes('viewing')) return 'fa-users';
  return 'fa-check';
}

function getSectionIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('interface')) return 'fa-plug';
  if (t.includes('custom')) return 'fa-tools';
  if (t.includes('application')) return 'fa-industry';
  if (t.includes('specification') || t.includes('spec')) return 'fa-list-check';
  if (t.includes('why choose')) return 'fa-award';
  if (t.includes('feature')) return 'fa-star';
  if (t.includes('advantage')) return 'fa-trophy';
  return 'fa-check-circle';
}

interface SpecCard {
  icon: string;
  title: string;
  description: string;
}

function extractSpecCards(html: string): SpecCard[] {
  const h3Regex = /<h3>(.*?)<\/h3>([\s\S]*?)(?=<h3>|$)/gi;
  const cards: SpecCard[] = [];
  let match;

  while ((match = h3Regex.exec(html)) !== null && cards.length < 3) {
    const title = match[1].replace(/<[^>]*>/g, '').trim();
    const content = match[2].replace(/<[^>]*>/g, '').trim();
    const firstSentence = content.split('.')[0] + '.';
    cards.push({
      icon: getSpecIcon(title),
      title,
      description: firstSentence.length > 150 ? firstSentence.substring(0, 147) + '...' : firstSentence,
    });
  }

  return cards;
}

// Parse list items from HTML for card rendering
function extractListItems(html: string): { title: string; description: string }[] {
  const liRegex = /<li>([\s\S]*?)<\/li>/gi;
  const items: { title: string; description: string }[] = [];
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    const content = match[1].trim();
    // Try to split on bold text
    const boldMatch = content.match(/^<strong>(.*?)<\/strong>[\s:–—-]*(.*)/i);
    if (boldMatch) {
      items.push({
        title: boldMatch[1].replace(/<[^>]*>/g, '').trim(),
        description: boldMatch[2].replace(/<[^>]*>/g, '').trim(),
      });
    } else {
      const text = content.replace(/<[^>]*>/g, '').trim();
      const colonIdx = text.indexOf(':');
      if (colonIdx > 0 && colonIdx < 50) {
        items.push({ title: text.substring(0, colonIdx).trim(), description: text.substring(colonIdx + 1).trim() });
      } else {
        items.push({ title: text, description: '' });
      }
    }
  }
  return items;
}

// Detect if section has a table
function extractTableRows(html: string): { key: string; value: string }[] | null {
  if (!html.includes('<table')) return null;
  const rowRegex = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  const rows: { key: string; value: string }[] = [];
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    rows.push({
      key: match[1].replace(/<[^>]*>/g, '').trim(),
      value: match[2].replace(/<[^>]*>/g, '').trim(),
    });
  }
  return rows.length > 0 ? rows : null;
}

// Extract CTA links from section
function extractLinks(html: string): { text: string; href: string }[] {
  const linkRegex = /<a\s+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  const links: { text: string; href: string }[] = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text.toLowerCase().includes('learn') || text.toLowerCase().includes('contact') || text.toLowerCase().includes('request')) {
      links.push({ text, href: match[1] });
    }
  }
  return links;
}

function hasListItems(html: string): boolean {
  return /<li>/i.test(html);
}

function isWhyChooseSection(title: string): boolean {
  return /why (choose|us micro)/i.test(title);
}

function isSpecTable(title: string): boolean {
  return /specification|spec/i.test(title) && /range|across/i.test(title);
}

function renderSection(section: { id: string; title: string; html: string }, idx: number) {
  const isEven = idx % 2 === 1;
  const bgClass = isEven ? 'bg-gray-50' : 'bg-white';
  const tableRows = extractTableRows(section.html);
  const listItems = hasListItems(section.html) ? extractListItems(section.html) : [];
  // Also extract bold paragraphs as card items (for "Why Choose" sections without <li>)
  const boldParagraphs: { title: string; description: string }[] = [];
  if (listItems.length === 0) {
    const boldParaRegex = /<p>\s*<strong>(.*?)<\/strong>\s*([\s\S]*?)<\/p>/gi;
    let bm;
    while ((bm = boldParaRegex.exec(section.html)) !== null) {
      const t = bm[1].replace(/<[^>]*>/g, '').replace(/[.:]$/, '').trim();
      const d = bm[2].replace(/<[^>]*>/g, '').trim();
      if (t.length > 2) boldParagraphs.push({ title: t, description: d });
    }
  }
  const links = extractLinks(section.html);
  const isWhyChoose = isWhyChooseSection(section.title);
  const isWhenToChoose = /when to choose/i.test(section.title);
  const isKeyAdvantages = /key (advantages|benefits)|advanced touch capabilities/i.test(section.title);
  const isApplications = /^applications$/i.test(section.title.trim());
  const isCustomization = /customization/i.test(section.title);
  const isSpecTableSection = isSpecTable(section.title) || tableRows !== null;

  // "When to Choose" section — horizontal feature highlights with accent left border
  if (isWhenToChoose) {
    // Extract bold paragraphs as features
    const boldParaRegex = /<p>\s*<strong>(.*?)<\/strong>([\s\S]*?)<\/p>/gi;
    const features: { title: string; desc: string }[] = [];
    let bm;
    while ((bm = boldParaRegex.exec(section.html)) !== null) {
      features.push({
        title: bm[1].replace(/<[^>]*>/g, '').trim(),
        desc: bm[2].replace(/<[^>]*>/g, '').trim(),
      });
    }
    const introHtml = section.html.replace(/<p>\s*<strong>.*?<\/strong>[\s\S]*?<\/p>/gi, '');
    const hasIntro = introHtml.replace(/<[^>]*>/g, '').trim().length > 20;
    const featureIcons = ['fa-ruler-combined', 'fa-adjust', 'fa-battery-full', 'fa-tag', 'fa-cube', 'fa-bolt'];

    if (features.length > 0) {
      return (
        <section key={section.id} className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-[1.625rem] font-bold text-navy mb-3">{section.title}</h2>
              {hasIntro && (
                <div className="prose max-w-2xl mx-auto text-gray-600" dangerouslySetInnerHTML={{ __html: introHtml }} />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <i className={`fas ${featureIcons[i % featureIcons.length]} text-accent text-lg`} />
                  </div>
                  <div>
                    <h3 className="text-[0.9375rem] font-bold text-navy mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-600 m-0 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
  }

  // Key Advantages — gradient bg with cards + decorative photos
  if (isKeyAdvantages && listItems.length > 0) {
    const advIcons = ['fa-code', 'fa-battery-full', 'fa-thermometer-half', 'fa-shield-alt', 'fa-dollar-sign', 'fa-plug'];
    return (
      <section key={section.id} className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 50%, #0f1d32 100%)' }}>
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Why It Matters</p>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-white mb-4">{section.title}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: 4 cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {listItems.map((item, i) => (
                <div key={i} className="group p-5 bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/[0.12] hover:border-accent/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-colors">
                    <i className={`fas ${advIcons[i % advIcons.length]} text-accent`} />
                  </div>
                  <h3 className="text-[0.9375rem] font-bold text-white mb-1">{item.title}</h3>
                  {item.description && <p className="text-sm text-white/70 m-0 leading-relaxed">{item.description}</p>}
                </div>
              ))}
            </div>
            {/* Right: stacked photos */}
            <div className="hidden lg:flex flex-col gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden border border-white/10">
                <img src="/images/content/character-lcd-1.webp" alt="Character LCD display" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border border-white/10">
                <img src="/images/content/character-lcd-2.webp" alt="Character LCD application" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Applications — 2-column layout: cards left, photos right
  if (isApplications && listItems.length > 0) {
    return (
      <section key={section.id} className="py-16 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-8">{section.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: application cards + CTAs */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {listItems.map((item, i) => {
                  const appIcons = ['fa-industry', 'fa-tachometer-alt', 'fa-heartbeat', 'fa-shopping-cart', 'fa-cog', 'fa-microchip'];
                  return (
                    <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-accent/30 transition-all duration-300">
                      <h3 className="text-[0.9375rem] font-bold text-navy mb-1">
                        <i className={`fas ${appIcons[i % appIcons.length]} text-accent mr-2`} />
                        {item.title}
                      </h3>
                      {item.description && <p className="text-xs text-gray-600 m-0 leading-relaxed">{item.description}</p>}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/support/request-quote" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors">
                  <i className="fas fa-file-alt" /> Request a Quote
                </Link>
                <Link href="/learn/lcd-technology" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-blue transition-colors">
                  <i className="fas fa-book-open" /> Learn About LCD Technology
                </Link>
              </div>
            </div>
            {/* Right: 2x2 photo grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden aspect-[4/3]">
                <img src="/images/content/character-lcd-1.webp" alt="Industrial LCD application" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="rounded-xl overflow-hidden aspect-[4/3]">
                <img src="/images/content/character-lcd-2.webp" alt="Instrumentation display" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="rounded-xl overflow-hidden aspect-[4/3]">
                <img src="/images/content/graphic-lcd-1.webp" alt="LCD module close-up" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="rounded-xl overflow-hidden aspect-[4/3]">
                <img src="/images/content/product-hero-square.webp" alt="Display integration" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Why Choose section — gradient callout with optional images
  if (isWhyChoose) {
    const whyItems = listItems.length > 0 ? listItems : boldParagraphs;
    const whyIcons = ['fa-boxes', 'fa-headset', 'fa-sync-alt', 'fa-dollar-sign', 'fa-trophy', 'fa-handshake'];

    if (whyItems.length > 0) {
      return (
        <section key={section.id} className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Why Choose Us</p>
              <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-navy mb-3">{section.title}</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Decades of display engineering expertise, direct manufacturer partnerships, and a relentless focus on your success.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {whyItems.map((item, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <i className={`fas ${whyIcons[i % whyIcons.length]} text-accent text-lg`} />
                  </div>
                  <div>
                    <h3 className="text-[0.9375rem] font-bold text-navy mb-1">{item.title}</h3>
                    {item.description && <p className="text-sm text-gray-600 m-0 leading-relaxed">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Fallback: prose
    return (
      <section key={section.id} className="py-20 bg-gray-50">
        <div className="max-w-[900px] mx-auto px-6">
          <h2 className="text-[1.75rem] font-bold text-navy mb-6">{section.title}</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
        </div>
      </section>
    );
  }

  // Spec table section — key-value grid
  if (isSpecTableSection && tableRows) {
    return (
      <section key={section.id} className={`py-16 ${bgClass}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-8">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tableRows.map((row, i) => (
              <div key={i} className="p-5 bg-navy rounded-xl text-white">
                <p className="text-xs uppercase tracking-wider text-white/60 mb-1 font-semibold">{row.key}</p>
                <p className="text-lg font-bold text-white m-0">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Sections with lists — icon card grid
  if (listItems.length > 0) {
    // Remove list from HTML for intro text, and strip paragraphs that are only links
    let introHtml = section.html.replace(/<ul[\s\S]*?<\/ul>/gi, '').replace(/<ol[\s\S]*?<\/ol>/gi, '');
    // Strip paragraphs that contain only links (CTA paragraphs)
    introHtml = introHtml.replace(/<p>\s*(?:<a\s[^>]*>[^<]*<\/a>\s*\|?\s*)+<\/p>/gi, '');
    if (isCustomization) introHtml = introHtml.replace(/<p>[\s\S]*?<a[\s\S]*?<\/a>[\s\S]*?<\/p>/gi, '');
    const hasIntro = introHtml.replace(/<[^>]*>/g, '').trim().length > 20;

    return (
      <section key={section.id} className={`py-16 ${bgClass}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-6">{section.title}</h2>
          {hasIntro && (
            <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 [&_p]:mb-4 [[&_a]:text-blue-mid_a]:text-blue-mid [[&_a]:text-blue-mid_a]:underline" dangerouslySetInnerHTML={{ __html: introHtml }} />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listItems.map((item, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-base font-bold text-navy mb-1">
                  <i className={`fas ${getSectionIcon(item.title)} text-accent mr-2`} />
                  {item.title}
                </h3>
                {item.description && <p className="text-sm text-gray-600 m-0">{item.description}</p>}
              </div>
            ))}
          </div>
          {!isCustomization && links.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-8">
              {links.map((link, i) => (
                <Link key={i} href={link.href} className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${i === 0 ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-navy text-white hover:bg-blue'}`}>
                  {link.text} <i className="fas fa-arrow-right text-xs" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default: prose section
  return (
    <section key={section.id} className={`py-16 ${bgClass}`}>
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-[1.625rem] font-bold text-navy mb-6">{section.title}</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [[&_a]:text-blue-mid_a]:text-blue-mid [[&_a]:text-blue-mid_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_table]:w-full [&_table]:border-collapse [&_th]:bg-navy [&_th]:text-white [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-sm [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-gray-200 [&_td]:text-sm" dangerouslySetInnerHTML={{ __html: section.html }} />
        {links.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-8">
            {links.map((link, i) => (
              <Link key={i} href={link.href} className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors">
                {link.text} <i className="fas fa-arrow-right text-xs" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default async function ProductCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const products = getProductsByCategory(category);
  const contentFile = contentFileMap[category];
  let htmlContent = '';
  let title: string = cat.name;
  let description = '';

  if (contentFile) {
    try {
      const page = await getContentPage(contentFile);
      htmlContent = page.htmlContent;
      title = (page.frontmatter.title as string) || cat.name;
      description = (page.frontmatter.description as string) || '';
    } catch { /* content optional */ }
  }

  const parsed = htmlContent ? parseContentSections(htmlContent) : null;
  const displayTitle = title.replace(/\s*\|.*$/, '').trim();

  const overviewSection = parsed?.sections?.[0];
  // Find section with h3 sub-items for spec cards (e.g. "Panel Types Available")
  const panelTypesIdx = parsed?.sections?.findIndex((s, i) => i > 0 && extractSpecCards(s.html).length >= 2) ?? -1;
  const panelTypesSection = panelTypesIdx >= 0 ? parsed?.sections?.[panelTypesIdx] : null;
  const specCards = panelTypesSection ? extractSpecCards(panelTypesSection.html) : (overviewSection ? extractSpecCards(overviewSection.html) : []);
  // Exclude panel types section from otherSections since we render it as cards
  const otherSections = (parsed?.sections?.slice(1) || []).filter((_, i) => i + 1 !== panelTypesIdx);
  const images = categoryImages[category];

  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: cat.name }]} />

      {/* Hero: Simple short hero — navy bg, no images */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[1.5px] text-white/70 mb-3">Products</p>
          <h1 className="text-white text-3xl md:text-[2.75rem] font-bold leading-tight mb-4">{displayTitle}</h1>
          <p className="text-lg md:text-[1.125rem] text-white/85 leading-relaxed max-w-[700px] mx-auto">
            {description || `Browse our complete ${cat.name} catalog with filterable specifications.`}
          </p>
        </div>
      </section>

      {/* Overview with photo collage */}
      {parsed && (
        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Left column: 60% — text + spec cards */}
              <div className="lg:col-span-3">
                {overviewSection && (
                  <>
                    <h2 className="text-[1.625rem] font-bold text-navy mb-6">{overviewSection.title}</h2>
                    {parsed.intro && (
                      <div className="prose max-w-none text-gray-700 text-lg leading-relaxed mb-8 [&_p]:mb-4 [[&_a]:text-blue-mid_a]:text-blue-mid [[&_a]:text-blue-mid_a]:underline" dangerouslySetInnerHTML={{ __html: parsed.intro }} />
                    )}
                  </>
                )}
                {specCards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    {specCards.map((card) => (
                      <div key={card.title} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-base font-bold text-navy mb-1">
                          <i className={`fas ${card.icon} text-accent mr-2`} />
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-600 m-0">{card.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right column: 40% — photo collage */}
              {images && (
                <div className="lg:col-span-2 relative min-h-[350px] hidden lg:block" aria-hidden="true">
                  <img
                    src={images.portrait}
                    alt={`${cat.name} product`}
                    className="absolute left-0 top-0 w-[85%] h-[85%] object-cover rounded-xl shadow-2xl z-[1]"
                    loading="eager"
                  />
                  <img
                    src={images.square}
                    alt={`${cat.name} collection`}
                    className="absolute right-0 bottom-0 w-[160px] h-[160px] object-cover rounded-xl shadow-xl z-[3] border-4 border-white"
                    loading="eager"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Product Specifications Table */}
      <section className="py-16 bg-gray-50" id="products">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-navy mb-6">Product Catalog</h2>
          <ProductTable products={products} categoryName={cat.name} categorySlug={category} />
        </div>
      </section>

      {/* Additional content sections — styled */}
      {otherSections.map((section, idx) => renderSection(section, idx))}

      {/* PMOLED vs AMOLED Comparison — only for pmoled category */}
      {category === 'pmoled-displays' && (
        <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 50%, #0f1d32 100%)' }}>
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-blue-400 rounded-full blur-[80px]" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Technology Comparison</p>
              <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-white mb-4">PMOLED vs. AMOLED</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">Two OLED technologies, different strengths. Choose the right one for your application.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* PMOLED Side */}
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-lightbulb text-accent text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">PMOLED</h3>
                    <p className="text-white/50 text-sm">Passive Matrix OLED</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Size Range', value: 'Under 3"', icon: 'fa-ruler' },
                    { label: 'Resolution', value: 'Low–Moderate', icon: 'fa-th' },
                    { label: 'Content', value: 'Text, icons, simple graphics', icon: 'fa-font' },
                    { label: 'Power (dark)', value: '★★★★★ Excellent', icon: 'fa-battery-full' },
                    { label: 'Cost (small)', value: '★★★★★ Very competitive', icon: 'fa-tag' },
                    { label: 'Thickness', value: 'Ultra-thin (1.4mm+)', icon: 'fa-compress-alt' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                      <i className={`fas ${item.icon} text-accent/70 w-5 text-center text-sm`} />
                      <span className="text-white/50 text-sm w-28 flex-shrink-0">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <p className="text-white/80 text-sm m-0"><strong className="text-accent">Best for:</strong> Wearables, instrumentation, IoT status displays, battery-powered devices with simple UI</p>
                </div>
              </div>

              {/* AMOLED Side */}
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-mobile-alt text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AMOLED</h3>
                    <p className="text-white/50 text-sm">Active Matrix OLED</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Size Range', value: '1" – 27"+', icon: 'fa-ruler' },
                    { label: 'Resolution', value: 'Moderate–Ultra high', icon: 'fa-th' },
                    { label: 'Content', value: 'Full UI, video, rich graphics', icon: 'fa-film' },
                    { label: 'Power (dark)', value: '★★★★★ Excellent', icon: 'fa-battery-full' },
                    { label: 'Cost (small)', value: '★★★ Higher', icon: 'fa-tag' },
                    { label: 'Thickness', value: 'Thin', icon: 'fa-compress-alt' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                      <i className={`fas ${item.icon} text-blue-400/70 w-5 text-center text-sm`} />
                      <span className="text-white/50 text-sm w-28 flex-shrink-0">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-400/10 rounded-xl border border-blue-400/20">
                  <p className="text-white/80 text-sm m-0"><strong className="text-blue-400">Best for:</strong> Smartphones, smartwatches, medical monitors, military HUDs, premium consumer devices</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href="/products/amoled-displays" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20">
                Browse AMOLED Displays <i className="fas fa-arrow-right text-xs" />
              </Link>
              <Link href="/learn/oled-technology" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors">
                OLED Technology Guide <i className="fas fa-book-open text-xs" />
              </Link>
            </div>
            {/* Decorative images */}
            <div className="mt-10 flex justify-center gap-4 opacity-50">
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden">
                <img src="/images/content/pmoled-card.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden sm:block">
                <img src="/images/content/amoled-card.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden md:block">
                <img src="/images/products/pmoled-displays.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden lg:block">
                <img src="/images/products/amoled-displays.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Open Frame vs Complete Monitors Comparison */}
      {category === 'open-frame-monitors' && (
        <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 50%, #0f1d32 100%)' }}>
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-blue-400 rounded-full blur-[80px]" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Comparison</p>
              <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-white mb-4">Open Frame vs. Enclosed Monitors</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">Understand the trade-offs to choose the right form factor for your integration.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-tv text-accent text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Open Frame</h3>
                    <p className="text-white/50 text-sm">No Enclosure</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Cost', value: '★★★★★ Lower (no enclosure)', icon: 'fa-tag' },
                    { label: 'Weight', value: '★★★★★ Lighter', icon: 'fa-feather-alt' },
                    { label: 'Flexibility', value: 'Fits any enclosure design', icon: 'fa-drafting-compass' },
                    { label: 'Custom', value: 'Easy (brightness, touch, I/O)', icon: 'fa-tools' },
                    { label: 'Mounting', value: 'VESA or custom brackets', icon: 'fa-th-large' },
                    { label: 'Branding', value: 'Your brand, your design', icon: 'fa-paint-brush' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                      <i className={`fas ${item.icon} text-accent/70 w-5 text-center text-sm`} />
                      <span className="text-white/50 text-sm w-24 flex-shrink-0">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <p className="text-white/80 text-sm m-0"><strong className="text-accent">Best for:</strong> Kiosks, gaming cabinets, POS terminals, custom enclosures, OEM integration</p>
                </div>
              </div>
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-desktop text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Enclosed Monitor</h3>
                    <p className="text-white/50 text-sm">Complete Housing</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Cost', value: '★★★ Higher (enclosure included)', icon: 'fa-tag' },
                    { label: 'Weight', value: '★★★ Heavier', icon: 'fa-feather-alt' },
                    { label: 'Flexibility', value: 'Fixed form factor', icon: 'fa-drafting-compass' },
                    { label: 'Custom', value: 'Limited modifications', icon: 'fa-tools' },
                    { label: 'Mounting', value: 'Stand or VESA only', icon: 'fa-th-large' },
                    { label: 'Branding', value: "Manufacturer's brand", icon: 'fa-paint-brush' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                      <i className={`fas ${item.icon} text-blue-400/70 w-5 text-center text-sm`} />
                      <span className="text-white/50 text-sm w-24 flex-shrink-0">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-400/10 rounded-xl border border-blue-400/20">
                  <p className="text-white/80 text-sm m-0"><strong className="text-blue-400">Best for:</strong> Desktop use, standalone signage, quick deployment without custom housing</p>
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-center gap-4 opacity-50">
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden">
                <img src="/images/content/open-frame-card.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden sm:block">
                <img src="/images/products/open-frame-monitors.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden md:block">
                <img src="/images/content/product-hero-portrait.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden lg:block">
                <img src="/images/content/product-hero-square.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Character LCD vs Graphic LCD Comparison */}
      {category === 'character-lcd' && (
        <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 50%, #0f1d32 100%)' }}>
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-blue-400 rounded-full blur-[80px]" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-[2px] mb-3">Technology Comparison</p>
              <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-white mb-4">Character LCD vs. Graphic LCD</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">Choose the right LCD technology for your application requirements.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Character LCD Side */}
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-font text-accent text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Character LCD</h3>
                    <p className="text-white/50 text-sm">Text & Symbol Displays</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Content', value: 'Text, numbers, basic symbols', icon: 'fa-font' },
                    { label: 'Resolution', value: '8×1 to 40×4 characters', icon: 'fa-th' },
                    { label: 'Interface', value: 'Parallel 6800, I2C, SPI', icon: 'fa-plug' },
                    { label: 'Firmware', value: '★★★★★ Minimal (ASCII)', icon: 'fa-code' },
                    { label: 'Power', value: '★★★★★ Ultra-low (1-50 mA)', icon: 'fa-battery-full' },
                    { label: 'Cost', value: '★★★★★ Lowest', icon: 'fa-tag' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                      <i className={`fas ${item.icon} text-accent/70 w-5 text-center text-sm`} />
                      <span className="text-white/50 text-sm w-24 flex-shrink-0">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <p className="text-white/80 text-sm m-0"><strong className="text-accent">Best for:</strong> Industrial readouts, instrumentation, HVAC, appliance panels — anywhere text content is sufficient</p>
                </div>
              </div>

              {/* Graphic LCD Side */}
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-th text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Graphic LCD</h3>
                    <p className="text-white/50 text-sm">Pixel-Level Control</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Content', value: 'Graphics, charts, multi-language', icon: 'fa-image' },
                    { label: 'Resolution', value: '128×64 to 320×240 pixels', icon: 'fa-th' },
                    { label: 'Interface', value: 'SPI, Parallel, I2C', icon: 'fa-plug' },
                    { label: 'Firmware', value: '★★★ Frame buffer required', icon: 'fa-code' },
                    { label: 'Power', value: '★★★★ Low', icon: 'fa-battery-full' },
                    { label: 'Cost', value: '★★★★ Low-moderate', icon: 'fa-tag' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                      <i className={`fas ${item.icon} text-blue-400/70 w-5 text-center text-sm`} />
                      <span className="text-white/50 text-sm w-24 flex-shrink-0">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-400/10 rounded-xl border border-blue-400/20">
                  <p className="text-white/80 text-sm m-0"><strong className="text-blue-400">Best for:</strong> Custom UIs, waveforms, bar charts, logos, multi-language text, and richer visual content</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href="/products/graphic-lcd" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20">
                Browse Graphic LCDs <i className="fas fa-arrow-right text-xs" />
              </Link>
              <Link href="/products/tft-displays" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors">
                Need Full Color? See TFT <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
            {/* Photos */}
            <div className="mt-10 flex justify-center gap-4 opacity-50">
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden">
                <img src="/images/content/character-lcd-1.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden sm:block">
                <img src="/images/content/character-lcd-2.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden md:block">
                <img src="/images/content/graphic-lcd-1.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-28 h-18 bg-white/10 rounded-lg overflow-hidden hidden lg:block">
                <img src="/images/content/graphic-lcd-2.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Resources - 3 cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-8">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 bg-blue-light rounded-xl border border-gray-200">
              <h3 className="text-base font-bold text-navy mb-2">
                <i className="fas fa-tools text-accent mr-2" />
                Custom {cat.name.split(' ')[0]} Solutions
              </h3>
              <p className="text-sm text-gray-600 mb-3">Every product in our catalog can be customized: brightness, bonding, cover glass, interface, connectors.</p>
              <Link href="/products/custom-displays" className="text-[0.8125rem] font-semibold text-accent-text inline-flex items-center gap-1.5">
                Learn about customization <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
            <div className="p-6 bg-blue-light rounded-xl border border-gray-200">
              <h3 className="text-base font-bold text-navy mb-2">
                <i className="fas fa-book-open text-accent mr-2" />
                Technology Guide
              </h3>
              <p className="text-sm text-gray-600 mb-3">Comprehensive guide covering how displays work, panel types, interfaces, and selection criteria.</p>
              <Link href="/learn" className="text-[0.8125rem] font-semibold text-accent-text inline-flex items-center gap-1.5">
                Read the guide <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
            <div className="p-6 bg-blue-light rounded-xl border border-gray-200">
              <h3 className="text-base font-bold text-navy mb-2">
                <i className="fas fa-heartbeat text-accent mr-2" />
                Medical Applications
              </h3>
              <p className="text-sm text-gray-600 mb-3">Displays for patient monitors, surgical displays, and portable medical devices.</p>
              <Link href="/applications/medical" className="text-[0.8125rem] font-semibold text-accent-text inline-flex items-center gap-1.5">
                Explore medical displays <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {parsed && parsed.faqs.length > 0 && (
        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="text-center text-[1.625rem] font-bold text-navy mb-8">Frequently Asked Questions</h2>
            <FAQAccordion items={parsed.faqs} twoColumn />
          </div>
        </section>
      )}

      <CTABanner
        title={`Need Help Selecting a ${cat.name.split(' ')[0]} Display?`}
        description="Our engineers evaluate your optical, mechanical, electrical, and environmental requirements to recommend the optimal panel."
        ctaLabel="Request a Quote"
        ctaHref="/support/request-quote"
        ctaIcon="fa-file-alt"
      />
    </>
  );
}
