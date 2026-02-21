import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage, getContentFiles } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

interface Props {
  params: Promise<{ industry: string }>;
}

export function generateStaticParams() {
  return getContentFiles('applications').map((f) => ({ industry: f.replace('.md', '') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  try {
    const page = await getContentPage(`applications/${industry}.md`);
    return {
      title: (page.frontmatter.title as string) || industry,
      description: (page.frontmatter.description as string) || `${industry} display solutions from US Micro Products.`,
    };
  } catch { return { title: industry }; }
}

export default async function ApplicationPage({ params }: Props) {
  const { industry } = await params;
  let page;
  try { page = await getContentPage(`applications/${industry}.md`); } catch { notFound(); }

  return (
    <ContentPage
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Applications' }, { label: (page.frontmatter.title as string) || industry }]}
      title={(page.frontmatter.title as string) || industry}
      htmlContent={page.htmlContent}
      ctaTitle={`Discuss Your ${(page.frontmatter.title as string)?.split(' ')[0] || ''} Project`}
    />
  );
}
