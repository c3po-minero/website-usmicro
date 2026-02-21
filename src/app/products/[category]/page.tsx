import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage } from '../../../../lib/content';
import { parseContentSections } from '../../../../lib/content-parser';
import { getProductsByCategory, getCategoryBySlug, CATEGORIES } from '../../../../lib/products';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import HeroSection from '@/components/ui/HeroSection';
import ProductTable from '@/components/products/ProductTable';
import CTABanner from '@/components/ui/CTABanner';

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
  return 'fa-check';
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

  // Extract first section for overview, use rest as supplementary
  const overviewSection = parsed?.sections?.[0];
  const otherSections = parsed?.sections?.slice(1) || [];

  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: cat.name }]} />

      <HeroSection
        eyebrow="Products"
        title={displayTitle}
        description={description || `Browse our complete ${cat.name} catalog with filterable specifications.`}
        short
      />

      {/* Overview with key spec highlights */}
      {parsed && (
        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            {parsed.intro && (
              <div className="prose max-w-[900px] text-gray-700 text-lg leading-relaxed mb-10 [&_p]:mb-4 [&_a]:text-blue-mid" dangerouslySetInnerHTML={{ __html: parsed.intro }} />
            )}
            {overviewSection && (
              <>
                <h2 className="text-[1.625rem] font-bold text-navy mb-6">{overviewSection.title}</h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: overviewSection.html }} />
              </>
            )}
          </div>
        </section>
      )}

      {/* Additional content sections */}
      {otherSections.map((section, i) => (
        <section key={section.id} className={`py-16 ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
          <div className="max-w-[900px] mx-auto px-6">
            <h2 className="text-[1.625rem] font-bold text-navy mb-6">{section.title}</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-6 [&_p]:mb-4 [&_strong]:text-gray-900 [&_a]:text-blue-mid [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: section.html }} />
          </div>
        </section>
      ))}

      {/* Product Specifications Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-navy mb-6">Product Specifications</h2>
          <ProductTable products={products} categoryName={cat.name} />
        </div>
      </section>

      <CTABanner title={`Need a Custom ${cat.name.split(' ')[0]} Display?`} description="Our engineers can modify any product to meet your exact requirements." ctaLabel="Request a Quote" ctaHref="/support/request-quote" ctaIcon="fa-file-alt" />
    </>
  );
}
