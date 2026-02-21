import { Metadata } from 'next';
import { getContentPage } from '../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about US Micro Products, a custom display solutions manufacturer based in Austin, TX.',
};

export default async function Page() {
  const page = await getContentPage('about/index.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"About"}]}
      title={(page.frontmatter.title as string) || 'About Us'}
      htmlContent={page.htmlContent}
    />
  );
}
