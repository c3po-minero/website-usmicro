import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage, getContentFiles } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

interface Props {
  params: Promise<{ service: string }>;
}

export function generateStaticParams() {
  return getContentFiles('services').filter((f) => f !== 'index.md').map((f) => ({ service: f.replace('.md', '') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  try {
    const page = await getContentPage(`services/${service}.md`);
    return {
      title: (page.frontmatter.title as string) || service,
      description: (page.frontmatter.description as string) || `${service} services from US Micro Products.`,
    };
  } catch { return { title: service }; }
}

export default async function ServicePage({ params }: Props) {
  const { service } = await params;
  let page;
  try { page = await getContentPage(`services/${service}.md`); } catch { notFound(); }

  return (
    <ContentPage
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }, { label: (page.frontmatter.title as string) || service }]}
      title={(page.frontmatter.title as string) || service}
      htmlContent={page.htmlContent}
    />
  );
}
