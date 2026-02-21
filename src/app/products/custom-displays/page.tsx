import { Metadata } from 'next';
import { getContentPage } from '../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

export const metadata: Metadata = {
  title: 'Custom Display Solutions',
  description: 'US Micro Products custom display solutions: TFT, AMOLED, PMOLED, and LCD customization for OEM applications.',
};

export default async function CustomDisplaysPage() {
  const page = await getContentPage('products/custom-displays/index.md');
  return (
    <ContentPage
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Custom Displays' }]}
      title={(page.frontmatter.title as string) || 'Custom Display Solutions'}
      htmlContent={page.htmlContent}
    />
  );
}
