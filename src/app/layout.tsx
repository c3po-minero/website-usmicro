import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import PasswordGate from '@/components/PasswordGate';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'US Micro Products | Engineered Solutions',
    template: '%s | US Micro Products',
  },
  description: 'US Micro Products engineers custom TFT, AMOLED, OLED & LCD display solutions for medical, military, aerospace & industrial OEMs. 25+ years expertise.',
  keywords: ['custom display solutions', 'display manufacturer USA', 'TFT displays', 'AMOLED displays', 'LCD displays', 'OEM display supplier'],
  metadataBase: new URL('https://www.usmicroproducts.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'US Micro Products',
    title: 'US Micro Products | Engineered Solutions',
    description: 'Custom TFT, AMOLED, OLED & LCD display solutions for OEMs.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Micro Products | Engineered Solutions',
    description: 'Custom display solutions for medical, military, aerospace & industrial OEMs.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.usmicroproducts.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <noscript><link rel="stylesheet" href="/fontawesome/css/all.min.css" /></noscript>
      </head>
      <body className="font-sans text-gray-900 bg-white leading-relaxed antialiased">
        <PasswordGate>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <SearchOverlay />
        </PasswordGate>
        <Script id="load-fontawesome" strategy="afterInteractive">
          {`var l=document.createElement('link');l.rel='stylesheet';l.href='/fontawesome/css/all.min.css';document.head.appendChild(l);`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'US Micro Products',
              url: 'https://www.usmicroproducts.com',
              logo: 'https://www.usmicroproducts.com/images/logos/USMP-horizontal.svg',
              description: 'Custom display solutions manufacturer serving medical, military, aerospace, and industrial OEMs since 1996.',
              foundingDate: '1996',
              address: { '@type': 'PostalAddress', addressLocality: 'Austin', addressRegion: 'TX', addressCountry: 'US' },
              contactPoint: { '@type': 'ContactPoint', contactType: 'sales', availableLanguage: 'English' },
              sameAs: ['https://www.linkedin.com/company/us-micro-products'],
            }),
          }}
        />
      </body>
    </html>
  );
}
