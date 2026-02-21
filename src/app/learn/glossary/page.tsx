import { Metadata } from 'next';
import { getContentPage } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Display Technology Glossary',
  description: 'Comprehensive glossary of display technology terms.',
};

export default async function Page() {
  const page = await getContentPage('learn/glossary.md');
  return (
    <ContentPage
      breadcrumbs={[{"label":"Home","href":"/"},{"label":"Learn"},{"label":"Glossary"}]}
      title={(page.frontmatter.title as string) || 'Display Technology Glossary'}
      htmlContent={page.htmlContent}
    />
  );
}
