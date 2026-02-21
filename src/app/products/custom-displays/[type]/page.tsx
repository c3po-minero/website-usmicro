import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentPage } from '../../../../../lib/content';
import ContentPage from '@/components/ui/ContentPage';

interface Props {
  params: Promise<{ type: string }>;
}

const TYPES = ['tft', 'amoled', 'pmoled', 'lcd'];

export function generateStaticParams() {
  return TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  return {
    title: `Custom ${type.toUpperCase()} Displays`,
    description: `Custom ${type.toUpperCase()} display solutions from US Micro Products.`,
  };
}

export default async function CustomDisplayTypePage({ params }: Props) {
  const { type } = await params;
  if (!TYPES.includes(type)) notFound();

  const page = await getContentPage(`products/custom-displays/${type}.md`);
  return (
    <ContentPage
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Custom Displays', href: '/products/custom-displays' }, { label: `Custom ${type.toUpperCase()}` }]}
      title={(page.frontmatter.title as string) || `Custom ${type.toUpperCase()} Displays`}
      htmlContent={page.htmlContent}
    />
  );
}
