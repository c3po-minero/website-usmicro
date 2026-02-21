import { Metadata } from 'next';
import { getContentPage } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Leadership Team',
  description: 'Meet the leadership team of US Micro Products.',
};

export default async function Page() {
  const page = await getContentPage('about/leadership.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"About","href":"/about"},{"label":"Leadership"}]}
      title={(page.frontmatter.title as string) || 'Leadership Team'}
      htmlContent={page.htmlContent}
    />
  );
}
