import { Metadata } from 'next';
import { getContentPage } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the US Micro Products team.',
};

export default async function Page() {
  const page = await getContentPage('about/careers.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"About","href":"/about"},{"label":"Careers"}]}
      title={(page.frontmatter.title as string) || 'Careers'}
      htmlContent={page.htmlContent}
    />
  );
}
