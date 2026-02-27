import type { Metadata } from 'next';
import ProductAdvisorChat from './ProductAdvisorChat';

export const metadata: Metadata = {
  title: 'AI Product Advisor — Find the Right Display Solution',
  description:
    'Get instant AI-powered product recommendations for TFT LCD, AMOLED, touch panels, and industrial displays. Our Product Advisor helps you find the perfect match.',
  openGraph: {
    title: 'AI Product Advisor — Find the Right Display Solution | US Micro Products',
    description:
      'Get instant AI-powered product recommendations for TFT LCD, AMOLED, touch panels, and industrial displays.',
  },
};

export default function ProductAdvisorPage() {
  return <ProductAdvisorChat />;
}
