import { Metadata } from 'next';
import { getContentPage } from '../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Support',
  description: 'US Micro Products support resources.',
};

export default async function Page() {
  const page = await getContentPage('support/index.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"Support"}]}
      title={(page.frontmatter.title as string) || 'Support'}
      htmlContent={page.htmlContent}
    />
  );
}
