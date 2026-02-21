import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage } from '../../../../lib/content';
import { getProductsByCategory, getCategoryBySlug, CATEGORIES } from '../../../../lib/products';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
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

export default async function ProductCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const products = getProductsByCategory(category);
  const contentFile = contentFileMap[category];
  let htmlContent = '';
  let title: string = cat.name;

  if (contentFile) {
    try {
      const page = await getContentPage(contentFile);
      htmlContent = page.htmlContent;
      title = (page.frontmatter.title as string) || cat.name;
    } catch { /* content optional */ }
  }

  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: cat.name }]} />
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <h1 className="text-3xl md:text-[2.5rem] font-bold text-navy mb-6">{title}</h1>
          {htmlContent && (
            <div className="prose max-w-none text-gray-700 mb-12 [&_h2]:text-[1.625rem] [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-10 [&_h3]:text-[1.25rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-8 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-blue-mid [&_a:hover]:text-accent [&_strong]:text-gray-900" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
          <h2 className="text-2xl font-bold text-navy mb-6">Product Specifications</h2>
          <ProductTable products={products} categoryName={cat.name} />
        </div>
      </section>
      <CTABanner title={`Need a Custom ${cat.name.split(' ')[0]} Display?`} description="Our engineers can modify any product to meet your exact requirements." ctaLabel="Request a Quote" ctaHref="/support/request-quote" ctaIcon="fa-file-alt" />
    </>
  );
}
