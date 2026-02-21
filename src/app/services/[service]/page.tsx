import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage, getContentFiles } from '../../../../lib/content';
import { parseContentSections } from '../../../../lib/content-parser';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import HeroSection from '@/components/ui/HeroSection';
import ServiceTemplate from '@/components/templates/ServiceTemplate';

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

  const title = (page.frontmatter.title as string) || service;
  const description = (page.frontmatter.description as string) || '';
  const parsed = parseContentSections(page.htmlContent);
  const displayTitle = title.replace(/\s*\|.*$/, '').trim();

  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Services' }, { label: displayTitle }]} />

      <HeroSection
        eyebrow="Service"
        title={displayTitle}
        description={description}
        short
      />

      <ServiceTemplate
        title={displayTitle}
        description={description}
        intro={parsed.intro}
        sections={parsed.sections}
        serviceName={displayTitle}
      />
    </>
  );
}
