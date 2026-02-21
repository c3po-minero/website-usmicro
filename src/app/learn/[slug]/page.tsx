import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage, getContentFiles } from '../../../../lib/content';
import { extractTOC } from '../../../../lib/content-parser';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import TableOfContents from '@/components/ui/TableOfContents';
import CTABanner from '@/components/ui/CTABanner';

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

export default async function LearnGuidePage({ params }: Props) {
  const { slug } = await params;
  let page;
  try { page = await getContentPage(`learn/${slug}.md`); } catch { notFound(); }

  const title = (page.frontmatter.title as string) || slug;
  const displayTitle = title.replace(/\s*\|.*$/, '').trim();
  const tocItems = extractTOC(page.htmlContent);
  const htmlWithIds = addIdsToHeadings(page.htmlContent);

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

          <div className="flex gap-12">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-[2.5rem] font-bold text-navy mb-8 leading-tight">{displayTitle}</h1>
              <div
                className="prose max-w-none text-gray-700 leading-relaxed
                  [&_h2]:text-[1.625rem] [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24
                  [&_h3]:text-[1.25rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24
                  [&_p]:mb-4 [&_p]:text-base
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2
                  [&_a]:text-blue-mid [&_a:hover]:text-accent
                  [&_strong]:text-gray-900
                  [&_table]:w-full [&_table]:border-collapse [&_th]:bg-navy [&_th]:text-white [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider
                  [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-gray-100 [&_td]:text-sm
                  [&_tr:hover]:bg-blue-light"
                dangerouslySetInnerHTML={{ __html: htmlWithIds }}
              />
            </div>

            {/* Sticky TOC sidebar */}
            {tocItems.length > 2 && (
              <div className="hidden lg:block w-[260px] flex-shrink-0">
                <TableOfContents items={tocItems} />
              </div>
            )}
          </div>
        </div>
      </section>

      <CTABanner
        title="Need Help Choosing a Display?"
        description="Our engineers can help you find the right display technology for your application."
        ctaLabel="Contact Engineering"
        ctaHref="/contact"
        ctaIcon="fa-comments"
      />
    </>
  );
}
