import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage, getContentFiles } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

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

export default async function LearnGuidePage({ params }: Props) {
  const { slug } = await params;
  let page;
  try { page = await getContentPage(`learn/${slug}.md`); } catch { notFound(); }

  return (
    <ContentPage
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Learn', href: '/learn/tft-display-technology' }, { label: (page.frontmatter.title as string) || slug }]}
      title={(page.frontmatter.title as string) || slug}
      htmlContent={page.htmlContent}
    />
  );
}
