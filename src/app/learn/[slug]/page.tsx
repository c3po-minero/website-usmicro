import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage, getContentFiles } from '../../../../lib/content';
import { extractTOC } from '../../../../lib/content-parser';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import TableOfContents from '@/components/ui/TableOfContents';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getContentFiles('learn').filter((f) => f !== 'index.md' && f !== 'glossary.md').map((f) => ({ slug: f.replace('.md', '') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await getContentPage(`learn/${slug}.md`);
    return {
      title: (page.frontmatter.title as string) || slug,
      description: (page.frontmatter.description as string) || `Learn about ${slug} from US Micro Products.`,
    };
  } catch { return { title: slug }; }
}

function addIdsToHeadings(html: string): string {
  return html.replace(/<h([23])>(.*?)<\/h[23]>/gi, (_match, level, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

/** Transform blockquotes into callout boxes with orange left border */
function transformCallouts(html: string): string {
  return html.replace(
    /<blockquote>([\s\S]*?)<\/blockquote>/gi,
    '<div class="callout-box">$1</div>'
  );
}

export default async function LearnGuidePage({ params }: Props) {
  const { slug } = await params;
  let page;
  try { page = await getContentPage(`learn/${slug}.md`); } catch { notFound(); }

  const title = (page.frontmatter.title as string) || slug;
  const displayTitle = title.replace(/\s*\|.*$/, '').trim();
  const tocItems = extractTOC(page.htmlContent);
  let htmlWithIds = addIdsToHeadings(page.htmlContent);
  htmlWithIds = transformCallouts(htmlWithIds);

  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Learn' }, { label: displayTitle }]} />

      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Author attribution */}
          <div className="flex items-center gap-4 mb-8 p-5 bg-gray-50 rounded-xl max-w-[1080px]">
            <div className="w-12 h-12 rounded-full bg-blue-mid flex items-center justify-center text-white font-bold flex-shrink-0">SE</div>
            <div>
              <div className="font-semibold text-navy text-[0.9375rem]">Written by the US Micro Products Engineering Team</div>
              <div className="text-[0.8125rem] text-gray-500">Last updated: February 2026 · 15 min read</div>
            </div>
          </div>

          {/* Mobile TOC */}
          {tocItems.length > 2 && (
            <div className="lg:hidden">
              <TableOfContents items={tocItems} />
            </div>
          )}

          <div className="flex gap-12">
            {/* Sticky TOC sidebar - left */}
            {tocItems.length > 2 && (
              <div className="hidden lg:block w-[260px] flex-shrink-0">
                <TableOfContents items={tocItems} />
              </div>
            )}

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-[2.5rem] font-bold text-navy mb-8 leading-tight">{displayTitle}</h1>
              <div
                className="prose max-w-none text-gray-700 leading-relaxed
                  [&_h2]:text-[1.625rem] [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24
                  [&_h3]:text-[1.25rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24
                  [&_p]:mb-4 [&_p]:text-base
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2
                  [&_a]:text-blue-mid
                  [&_strong]:text-gray-900
                  [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-200
                  [&_th]:bg-navy [&_th]:text-white [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_th]:font-semibold
                  [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-gray-100 [&_td]:text-sm
                  [&_tr:hover]:bg-blue-light
                  [&_.callout-box]:border-l-4 [&_.callout-box]:border-accent [&_.callout-box]:bg-blue-light [&_.callout-box]:rounded-r-xl [&_.callout-box]:p-5 [&_.callout-box]:my-6
                  [&_figure]:bg-gray-100 [&_figure]:rounded-xl [&_figure]:p-12 [&_figure]:text-center [&_figure]:my-8
                  [&_figcaption]:text-gray-500 [&_figcaption]:text-sm [&_figcaption]:mt-3"
                dangerouslySetInnerHTML={{ __html: htmlWithIds }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources - 3 cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[1.625rem] font-bold text-navy mb-6">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <p className="text-[0.6875rem] uppercase tracking-wider text-accent font-semibold mb-2">Product Catalog</p>
              <h4 className="text-[0.9375rem] font-bold text-navy mb-1">
                <Link href="/products/tft-displays" className="text-navy hover:text-accent-text">TFT LCD Displays</Link>
              </h4>
              <p className="text-[0.8125rem] text-gray-600 m-0">Browse 225+ TFT modules with filterable spec table.</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <p className="text-[0.6875rem] uppercase tracking-wider text-accent font-semibold mb-2">Guide</p>
              <h4 className="text-[0.9375rem] font-bold text-navy mb-1">
                <Link href="/learn" className="text-navy hover:text-accent-text">Display Technology Guides</Link>
              </h4>
              <p className="text-[0.8125rem] text-gray-600 m-0">Explore all display technology guides and resources.</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <p className="text-[0.6875rem] uppercase tracking-wider text-accent font-semibold mb-2">Application</p>
              <h4 className="text-[0.9375rem] font-bold text-navy mb-1">
                <Link href="/applications/medical" className="text-navy hover:text-accent-text">Medical Display Solutions</Link>
              </h4>
              <p className="text-[0.8125rem] text-gray-600 m-0">FDA-ready display solutions for medical devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA with 2 buttons */}
      <section className="bg-gradient-to-br from-blue to-navy text-white py-16 text-center">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="text-white text-[1.875rem] font-bold mb-4">Ready to Specify a Display?</h2>
          <p className="text-white/80 mb-8">Our engineers can help you select the optimal panel for your application.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
              <i className="fas fa-search" /> Browse Catalog
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-transparent text-white rounded-md border-2 border-white hover:bg-white hover:text-navy transition-all">
              <i className="fas fa-comments" /> Talk to an Engineer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
