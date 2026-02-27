'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const productLinks = [
  { href: '/products/tft-displays', icon: 'fa-desktop', label: 'TFT Displays' },
  { href: '/products/amoled-displays', icon: 'fa-mobile-alt', label: 'AMOLED Displays' },
  { href: '/products/pmoled-displays', icon: 'fa-lightbulb', label: 'PMOLED Displays' },
  { href: '/products/character-lcd', icon: 'fa-font', label: 'Character LCD' },
  { href: '/products/graphic-lcd', icon: 'fa-th', label: 'Graphic LCD' },
  { href: '/products/smart-displays', icon: 'fa-microchip', label: 'Smart Displays' },
  { href: '/products/touch-panels', icon: 'fa-hand-pointer', label: 'Touch Panels' },
  { href: '/products/open-frame-monitors', icon: 'fa-tv', label: 'Open Frame Monitors' },
  { href: '/products/tablets', icon: 'fa-tablet-alt', label: 'Tablets' },
  { href: '/products/custom-displays', icon: 'fa-cogs', label: 'Custom Displays' },
];

const applicationLinks = [
  { href: '/applications/medical', icon: 'fa-heartbeat', label: 'Medical' },
  { href: '/applications/military', icon: 'fa-shield-alt', label: 'Military' },
  { href: '/applications/aerospace', icon: 'fa-plane', label: 'Aerospace' },
  { href: '/applications/automotive', icon: 'fa-car', label: 'Automotive' },
  { href: '/applications/gaming', icon: 'fa-dice', label: 'Gaming' },
  { href: '/applications/industrial', icon: 'fa-industry', label: 'Industrial' },
  { href: '/applications/wearables', icon: 'fa-microchip', label: 'Wearables' },
  { href: '/applications/consumer', icon: 'fa-mobile-alt', label: 'Consumer' },
  { href: '/applications/kiosk-pos', icon: 'fa-store', label: 'Kiosk & POS' },
  { href: '/applications/instrumentation', icon: 'fa-tachometer-alt', label: 'Instrumentation' },
  { href: '/applications/marine', icon: 'fa-anchor', label: 'Marine' },
  { href: '/applications/harsh-environments', icon: 'fa-mountain', label: 'Harsh Environments' },
];

const resourceLinks = [
  { href: '/learn/tft-display-technology', icon: 'fa-book-open', label: 'Learn' },
  { href: '/support/faq', icon: 'fa-life-ring', label: 'Support' },
];

const mainNavItems = [
  { label: 'Products', hasSubmenu: true, submenuKey: 'products' as const },
  { label: 'Applications', hasSubmenu: true, submenuKey: 'applications' as const },
  { label: 'Services', href: '/services/ems' },
  { label: 'Resources', hasSubmenu: true, submenuKey: 'resources' as const },
  { label: 'About', href: '/about' },
  { label: 'Product Advisor', href: '/product-advisor' },
];

const submenus = { products: productLinks, applications: applicationLinks, resources: resourceLinks };

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'main' | 'products' | 'applications' | 'resources'>('main');
  const [megaHidden, setMegaHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
    setMobilePanel('main');
    setMegaHidden(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function openSearch() {
    document.dispatchEvent(new Event('toggle-search'));
  }

  function closeMobile() {
    setMobileOpen(false);
    setMobilePanel('main');
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-[72px]" role="banner">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="US Micro Products - Home">
          <Image src="/images/logos/USMP-horizontal.svg" alt="US Micro Products logo" width={160} height={38} priority className="h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          <div className="nav-item relative group" onMouseLeave={() => setMegaHidden(false)}>
            <button className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent hover:bg-gray-50 transition-all inline-flex items-center gap-1" tabIndex={0}>
              Products <i className="fas fa-chevron-down text-[0.625rem] ml-1" />
            </button>
            <div className={`mega-menu hidden grid-cols-3 gap-2 absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl p-6 min-w-[600px] z-50 ${megaHidden ? 'mega-hidden' : ''}`}>
              {productLinks.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.8125rem] text-gray-700 hover:bg-blue-light hover:text-blue transition-all" role="menuitem" onClick={() => setMegaHidden(true)}>
                  <i className={`fas ${item.icon} w-[18px] text-blue-mid text-sm`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="nav-item relative group" onMouseLeave={() => setMegaHidden(false)}>
            <button className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent hover:bg-gray-50 transition-all inline-flex items-center gap-1" tabIndex={0}>
              Applications <i className="fas fa-chevron-down text-[0.625rem] ml-1" />
            </button>
            <div className={`mega-menu hidden grid-cols-3 gap-2 absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl p-6 min-w-[600px] z-50 ${megaHidden ? 'mega-hidden' : ''}`}>
              {applicationLinks.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.8125rem] text-gray-700 hover:bg-blue-light hover:text-blue transition-all" role="menuitem" onClick={() => setMegaHidden(true)}>
                  <i className={`fas ${item.icon} w-[18px] text-blue-mid text-sm`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/services/ems" className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent hover:bg-gray-50 transition-all">Services</Link>
          <div className="nav-item relative group" onMouseLeave={() => setMegaHidden(false)}>
            <button className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent hover:bg-gray-50 transition-all inline-flex items-center gap-1" tabIndex={0}>
              Resources <i className="fas fa-chevron-down text-[0.625rem] ml-1" />
            </button>
            <div className={`mega-menu hidden grid-cols-1 gap-1 absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 min-w-[200px] z-50 ${megaHidden ? 'mega-hidden' : ''}`}>
              {resourceLinks.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.8125rem] text-gray-700 hover:bg-blue-light hover:text-blue transition-all" role="menuitem" onClick={() => setMegaHidden(true)}>
                  <i className={`fas ${item.icon} w-[18px] text-blue-mid text-sm`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/about" className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent hover:bg-gray-50 transition-all">About</Link>
          <Link href="/product-advisor" className="px-3.5 py-2 text-sm font-semibold text-accent rounded-md hover:bg-red-50 transition-all inline-flex items-center gap-1.5">
            <i className="fas fa-wand-magic-sparkles text-xs" /> Product Advisor
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-700 text-lg hover:text-accent transition-colors" aria-label="Search (Ctrl+K)" onClick={openSearch}>
            <i className="fas fa-search" />
          </button>
          <Link href="/support/request-quote" className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-[0.8125rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
            <i className="fas fa-file-alt" /> Request Quote
          </Link>
          <button className="lg:hidden p-2 text-navy text-2xl" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={() => { mobileOpen ? closeMobile() : setMobileOpen(true); }}>
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] z-50 bg-white overflow-hidden">
          <div className="relative h-full">
            <div
              className="absolute inset-0 flex flex-col p-6 overflow-y-auto bg-white transition-transform duration-300 ease-in-out"
              style={{ transform: mobilePanel === 'main' ? 'translateX(0)' : 'translateX(-100%)' }}
            >
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {mainNavItems.map((item) =>
                  item.hasSubmenu ? (
                    <button
                      key={item.label}
                      onClick={() => setMobilePanel(item.submenuKey!)}
                      className="flex items-center justify-between px-4 py-3.5 text-[1rem] font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                      <i className="fas fa-chevron-right text-gray-400 text-sm" />
                    </button>
                  ) : (
                    <Link key={item.label} href={item.href!} className="px-4 py-3.5 text-[1rem] font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobile}>
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
              <div className="mt-auto pt-6">
                <Link href="/support/request-quote" className="flex items-center justify-center gap-2 w-full px-6 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-lg hover:bg-accent-hover transition-all" onClick={closeMobile}>
                  <i className="fas fa-file-alt" /> Request Quote
                </Link>
              </div>
            </div>

            <div
              className="absolute inset-0 flex flex-col p-6 overflow-y-auto bg-white transition-transform duration-300 ease-in-out"
              style={{ transform: mobilePanel === 'products' ? 'translateX(0)' : 'translateX(100%)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setMobilePanel('main')} className="flex items-center gap-1.5 text-sm font-medium text-accent-text">
                  <i className="fas fa-chevron-left text-xs" /> Back
                </button>
                <span className="text-lg font-bold text-navy mx-auto pr-12">Products</span>
              </div>
              <nav className="flex flex-col gap-1">
                {productLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 text-[0.9375rem] text-gray-700 rounded-lg hover:bg-blue-light transition-colors" onClick={closeMobile}>
                    <i className={`fas ${item.icon} w-5 text-blue-mid text-sm`} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div
              className="absolute inset-0 flex flex-col p-6 overflow-y-auto bg-white transition-transform duration-300 ease-in-out"
              style={{ transform: mobilePanel === 'applications' ? 'translateX(0)' : 'translateX(100%)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setMobilePanel('main')} className="flex items-center gap-1.5 text-sm font-medium text-accent-text">
                  <i className="fas fa-chevron-left text-xs" /> Back
                </button>
                <span className="text-lg font-bold text-navy mx-auto pr-12">Applications</span>
              </div>
              <nav className="flex flex-col gap-1">
                {applicationLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 text-[0.9375rem] text-gray-700 rounded-lg hover:bg-blue-light transition-colors" onClick={closeMobile}>
                    <i className={`fas ${item.icon} w-5 text-blue-mid text-sm`} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div
              className="absolute inset-0 flex flex-col p-6 overflow-y-auto bg-white transition-transform duration-300 ease-in-out"
              style={{ transform: mobilePanel === 'resources' ? 'translateX(0)' : 'translateX(100%)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setMobilePanel('main')} className="flex items-center gap-1.5 text-sm font-medium text-accent-text">
                  <i className="fas fa-chevron-left text-xs" /> Back
                </button>
                <span className="text-lg font-bold text-navy mx-auto pr-12">Resources</span>
              </div>
              <nav className="flex flex-col gap-1">
                {resourceLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 text-[0.9375rem] text-gray-700 rounded-lg hover:bg-blue-light transition-colors" onClick={closeMobile}>
                    <i className={`fas ${item.icon} w-5 text-blue-mid text-sm`} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
