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
    if (text.toLowerCase().includes('learn more') || text.toLowerCase().includes('contact') || text.toLowerCase().includes('request')) {
      links.push({ text, href: match[1] });
    }
  }
  return links;
}

function hasListItems(html: string): boolean {
  return /<li>/i.test(html);
}

function isWhyChooseSection(title: string): boolean {
  return /why choose/i.test(title);
}

function isSpecTable(title: string): boolean {
  return /specification|spec/i.test(title) && /range|across/i.test(title);
}

function renderSection(section: { id: string; title: string; html: string }, idx: number) {
  const isEven = idx % 2 === 1;
  const bgClass = isEven ? 'bg-gray-50' : 'bg-white';
  const tableRows = extractTableRows(section.html);
  const listItems = hasListItems(section.html) ? extractListItems(section.html) : [];
  const links = extractLinks(section.html);
  const isWhyChoose = isWhyChooseSection(section.title);
  const isSpecTableSection = isSpecTable(section.title) || tableRows !== null;

  // Why Choose section — navy callout
  if (isWhyChoose) {
    return (
      <section key={section.id} className="py-16 bg-navy text-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-white mb-8">
            <i className="fas fa-award text-accent mr-3" />
            {section.title}
          </h2>
          {listItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {listItems.map((item, i) => (
                <div key={i} className="p-5 bg-white/10 rounded-xl border border-white/20">
                  <h3 className="text-base font-bold text-white mb-1">
                    <i className={`fas ${getSectionIcon(item.title)} text-accent mr-2`} />
                    {item.title}
                  </h3>
                  {item.description && <p className="text-sm text-white/80 m-0">{item.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-invert max-w-none [&_a]:text-accent [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
          )}
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
    // Remove list from HTML for intro text
    const introHtml = section.html.replace(/<ul[\s\S]*?<\/ul>/gi, '').replace(/<ol[\s\S]*?<\/ol>/gi, '');
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
          <ProductTable products={products} categoryName={cat.name} />
        </div>
      </section>

      {/* Additional content sections — styled */}
      {otherSections.map((section, idx) => renderSection(section, idx))}

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
