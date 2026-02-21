import { Metadata } from 'next';
import { getContentPage } from '../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'US Micro Products privacy policy.',
};

export default async function Page() {
  const page = await getContentPage('privacy.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"Privacy"}]}
      title={(page.frontmatter.title as string) || 'Privacy Policy'}
      htmlContent={page.htmlContent}
    />
  );
}
