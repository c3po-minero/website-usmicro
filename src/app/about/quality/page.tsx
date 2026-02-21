import { Metadata } from 'next';
import { getContentPage } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Quality & Certifications',
  description: 'US Micro Products quality certifications and processes.',
};

export default async function Page() {
  const page = await getContentPage('about/quality.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"About","href":"/about"},{"label":"Quality"}]}
      title={(page.frontmatter.title as string) || 'Quality & Certifications'}
      htmlContent={page.htmlContent}
    />
  );
}
