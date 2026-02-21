import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.usmicroproducts.com';
  const now = new Date().toISOString();

  const staticPages = [
    '/', '/products', '/about', '/about/leadership', '/about/quality', '/about/careers', '/about/community',
    '/contact', '/support', '/support/faq', '/support/request-quote', '/support/eol-parts',
    '/terms', '/privacy', '/search', '/products/custom-displays',
    '/learn/glossary',
  ];

  const productCategories = [
    'tft-displays', 'amoled-displays', 'pmoled-displays', 'character-lcd', 'graphic-lcd',
    'smart-displays', 'touch-panels', 'open-frame-monitors', 'tablets',
  ];

  const customTypes = ['tft', 'amoled', 'pmoled', 'lcd'];

  const applications = [
    'medical', 'military', 'aerospace', 'automotive', 'gaming', 'industrial',
    'wearables', 'consumer', 'kiosk-pos', 'instrumentation', 'marine', 'harsh-environments',
  ];

  const services = ['ems', 'integration', 'inventory-management', 'logistics'];

  const learn = ['tft-display-technology', 'lcd-technology', 'oled-technology', 'touch-screen-technology', 'open-frame-monitors'];

  return [
    ...staticPages.map((url) => ({ url: `${base}${url}`, lastModified: now, changeFrequency: 'monthly' as const, priority: url === '/' ? 1 : 0.8 })),
    ...productCategories.map((slug) => ({ url: `${base}/products/${slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 })),
    ...customTypes.map((t) => ({ url: `${base}/products/custom-displays/${t}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...applications.map((a) => ({ url: `${base}/applications/${a}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...services.map((s) => ({ url: `${base}/services/${s}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...learn.map((l) => ({ url: `${base}/learn/${l}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
