import { Metadata } from 'next';
import { getContentPage } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'EOL Parts',
  description: 'End-of-life parts replacement and redesign.',
};

export default async function Page() {
  const page = await getContentPage('support/eol-parts.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"Support","href":"/support"},{"label":"EOL Parts"}]}
      title={(page.frontmatter.title as string) || 'EOL Parts'}
      htmlContent={page.htmlContent}
    />
  );
}
