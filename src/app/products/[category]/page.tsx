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
    portrait: '/images/products/tft-displays.webp',
    square: '/images/products/tft-displays.webp',
  },
  'amoled-displays': {
    portrait: '/images/products/amoled-displays.webp',
    square: '/images/products/amoled-displays.webp',
  },
  'pmoled-displays': {
    portrait: '/images/products/pmoled-displays.webp',
    square: '/images/products/pmoled-displays.webp',
  },
  'smart-displays': {
    portrait: '/images/products/smart-displays.webp',
    square: '/images/products/smart-displays.webp',
  },
  'touch-panels': {
    portrait: '/images/products/touch-panels.webp',
    square: '/images/products/touch-panels.webp',
  },
  'open-frame-monitors': {
    portrait: '/images/products/open-frame-monitors.webp',
    square: '/images/products/open-frame-monitors.webp',
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

interface SpecCard {
  icon: string;
  title: string;
  description: string;
}

function extractSpecCards(html: string): SpecCard[] {
  // Look for h3 elements within the first section to extract key specs
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
  const otherSections = parsed?.sections?.slice(1) || [];
  const specCards = overviewSection ? extractSpecCards(overviewSection.html) : [];
  const images = categoryImages[category];

  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: cat.name }]} />

      {/* Hero: 2-column with images on right */}
      <section className="relative bg-navy text-white overflow-hidden py-14 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue/30 to-navy opacity-50" />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[1.5px] text-accent mb-3">Products</p>
              <h1 className="text-white text-3xl md:text-[3rem] font-bold leading-tight mb-5">{displayTitle}</h1>
              <p className="text-lg md:text-[1.1875rem] text-white/85 mb-8 leading-relaxed max-w-[640px]">
                {description || `Browse our complete ${cat.name} catalog with filterable specifications.`}
              </p>
            </div>
            {images && (
              <div className="lg:col-span-2 relative min-h-[280px] hidden lg:block" aria-hidden="true">
                <img
                  src={images.portrait}
                  alt={`${cat.name} product`}
                  className="absolute left-0 top-0 w-[calc(100%-40px)] h-[calc(100%-50px)] object-cover rounded-xl shadow-2xl z-[1]"
                  loading="eager"
                />
                <img
                  src={images.square}
                  alt={`${cat.name} collection`}
                  className="absolute right-0 bottom-0 w-[160px] h-[160px] object-cover rounded-xl shadow-xl z-[3] border-4 border-navy"
                  loading="eager"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Overview + Spec Highlight Cards */}
      {parsed && (
        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <div className="lg:col-span-3">
                {overviewSection && (
                  <>
                    <h2 className="text-[1.625rem] font-bold text-navy mb-6">{overviewSection.title}</h2>
                    {parsed.intro && (
                      <div className="prose max-w-none text-gray-700 text-lg leading-relaxed mb-6 [&_p]:mb-4 [&_a]:text-blue-mid" dangerouslySetInnerHTML={{ __html: parsed.intro }} />
                    )}
                  </>
                )}
              </div>
              {specCards.length > 0 && (
                <div className="lg:col-span-2 space-y-4">
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

      {/* Additional content sections as structured cards */}
      {otherSections.length > 0 && (
        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            {otherSections.map((section) => (
              <div key={section.id} className="mb-12 last:mb-0">
                <h2 className="text-[1.625rem] font-bold text-navy mb-6">{section.title}</h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
              </div>
            ))}
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
              <Link href="/products/custom-displays" className="text-[0.8125rem] font-semibold text-accent inline-flex items-center gap-1.5">
                Learn about customization <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
            <div className="p-6 bg-blue-light rounded-xl border border-gray-200">
              <h3 className="text-base font-bold text-navy mb-2">
                <i className="fas fa-book-open text-accent mr-2" />
                Technology Guide
              </h3>
              <p className="text-sm text-gray-600 mb-3">Comprehensive guide covering how displays work, panel types, interfaces, and selection criteria.</p>
              <Link href="/learn" className="text-[0.8125rem] font-semibold text-accent inline-flex items-center gap-1.5">
                Read the guide <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
            <div className="p-6 bg-blue-light rounded-xl border border-gray-200">
              <h3 className="text-base font-bold text-navy mb-2">
                <i className="fas fa-heartbeat text-accent mr-2" />
                Medical Applications
              </h3>
              <p className="text-sm text-gray-600 mb-3">Displays for patient monitors, surgical displays, and portable medical devices.</p>
              <Link href="/applications/medical" className="text-[0.8125rem] font-semibold text-accent inline-flex items-center gap-1.5">
                Explore medical displays <i className="fas fa-arrow-right text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - 2 column grid */}
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
