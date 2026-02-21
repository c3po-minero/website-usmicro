import { Metadata } from 'next';
import { getContentPage } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about US Micro Products displays and services.',
};

export default async function Page() {
  const page = await getContentPage('support/faq.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"Support","href":"/support"},{"label":"FAQ"}]}
      title={(page.frontmatter.title as string) || 'FAQ'}
      htmlContent={page.htmlContent}
    />
  );
}
