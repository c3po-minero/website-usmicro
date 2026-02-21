import { Metadata } from 'next';
import { getContentPage } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Community',
  description: 'US Micro Products community involvement.',
};

export default async function Page() {
  const page = await getContentPage('about/community.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"About","href":"/about"},{"label":"Community"}]}
      title={(page.frontmatter.title as string) || 'Community'}
      htmlContent={page.htmlContent}
    />
  );
}
