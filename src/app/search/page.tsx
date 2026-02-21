import { Metadata } from 'next';
import { buildSearchIndex } from '../../../lib/search';
import SearchResults from '@/components/ui/SearchResults';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search US Micro Products for displays, guides, and resources.',
};

export default function SearchPage() {
  const items = buildSearchIndex();
  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
      <SearchResults items={items} />
    </>
  );
}
