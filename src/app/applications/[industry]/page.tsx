import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage, getContentFiles } from '../../../../lib/content';
import { parseContentSections } from '../../../../lib/content-parser';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import HeroSection from '@/components/ui/HeroSection';
import ApplicationTemplate from '@/components/templates/ApplicationTemplate';

interface Props {
  params: Promise<{ industry: string }>;
}

const heroImages: Record<string, string> = {
  medical: '/images/applications/medical.jpg',
  military: '/images/applications/military.jpg',
  aerospace: '/images/applications/aerospace.jpg',
  automotive: '/images/applications/automotive.jpg',
  gaming: '/images/applications/gaming.jpg',
  industrial: '/images/applications/industrial.jpg',
  wearables: '/images/applications/wearables.jpg',
  consumer: '/images/applications/consumer.jpg',
  'kiosk-pos': '/images/applications/kiosk-pos.jpg',
  instrumentation: '/images/applications/instrumentation.jpg',
  marine: '/images/applications/marine.jpg',
  'harsh-environments': '/images/applications/harsh-environments.jpg',
};

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

  const title = (page.frontmatter.title as string) || industry;
  const description = (page.frontmatter.description as string) || '';
  const parsed = parseContentSections(page.htmlContent);
  const displayTitle = title.replace(/\s*\|.*$/, '').trim();

  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Applications' }, { label: displayTitle }]} />

      <HeroSection
        eyebrow="Application"
        title={displayTitle}
        description={description}
        primaryCta={{ label: `Discuss Your ${displayTitle.split(' ')[0]} Project`, href: '/contact', icon: 'fa-comments' }}
        secondaryCta={{ label: 'Browse Products', href: '/products', icon: 'fa-search' }}
      />

      <ApplicationTemplate
        title={displayTitle}
        description={description}
        intro={parsed.intro}
        sections={parsed.sections}
        faqs={parsed.faqs}
        industry={industry}
      />
    </>
  );
}
