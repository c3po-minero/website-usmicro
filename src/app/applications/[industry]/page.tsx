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
  medical: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&q=80',
  military: 'https://images.unsplash.com/photo-1579187707643-35646d22b596?w=1400&q=80',
  aerospace: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1400&q=80',
  automotive: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1400&q=80',
  gaming: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400&q=80',
  industrial: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1400&q=80',
  wearables: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1400&q=80',
  consumer: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1400&q=80',
  'kiosk-pos': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
  instrumentation: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1400&q=80',
  marine: 'https://images.unsplash.com/photo-1500930287596-c1ecaa210c96?w=1400&q=80',
  'harsh-environments': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1400&q=80',
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
