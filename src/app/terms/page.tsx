import { Metadata } from 'next';
import { getContentPage } from '../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'US Micro Products terms and conditions.',
};

export default async function Page() {
  const page = await getContentPage('terms.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"Terms"}]}
      title={(page.frontmatter.title as string) || 'Terms & Conditions'}
      htmlContent={page.htmlContent}
    />
  );
}
