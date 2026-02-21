'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-[72px]" role="banner">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="US Micro Products - Home">
          <Image src="/images/logos/USMP-horizontal.svg" alt="US Micro Products logo" width={160} height={40} priority />
        </Link>

        <nav className={`${mobileOpen ? 'flex' : 'hidden'} lg:flex items-center gap-1 fixed lg:static top-[72px] left-0 right-0 bottom-0 lg:bottom-auto bg-white lg:bg-transparent flex-col lg:flex-row p-6 lg:p-0 overflow-y-auto lg:overflow-visible z-50`} role="navigation" aria-label="Main navigation">
          <div className="nav-item relative group">
            <button className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent-text hover:bg-gray-50 transition-all inline-flex items-center gap-1" tabIndex={0}>
              Products <i className="fas fa-chevron-down text-[0.625rem] ml-1" />
            </button>
            <div className="mega-menu hidden group-hover:grid group-focus-within:grid absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl p-6 min-w-[600px] grid-cols-3 gap-2 z-50">
              {productLinks.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.8125rem] text-gray-700 hover:bg-blue-light hover:text-blue transition-all" role="menuitem">
                  <i className={`fas ${item.icon} w-[18px] text-blue-mid text-sm`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/applications/medical" className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent-text hover:bg-gray-50 transition-all">Applications</Link>
          <Link href="/services/ems" className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent-text hover:bg-gray-50 transition-all">Services</Link>
          <Link href="/learn/tft-display-technology" className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent-text hover:bg-gray-50 transition-all">Learn</Link>
          <Link href="/about" className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent-text hover:bg-gray-50 transition-all">About</Link>
          <Link href="/support/faq" className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent-text hover:bg-gray-50 transition-all">Support</Link>
          <Link href="/contact" className="px-3.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-accent-text hover:bg-gray-50 transition-all">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center" role="search">
            <label htmlFor="header-search" className="sr-only">Search</label>
            <input
              type="search"
              id="header-search"
              className={`absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm font-sans transition-all ${searchOpen ? 'w-[220px] opacity-100 mr-2' : 'w-0 opacity-0'}`}
              placeholder="Search..."
              aria-label="Search site"
            />
            <button className="p-2 text-gray-700 text-lg hover:text-accent transition-colors" aria-label="Toggle search" onClick={() => setSearchOpen(!searchOpen)}>
              <i className="fas fa-search" />
            </button>
          </div>
          <Link href="/support/request-quote" className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-[0.8125rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
            <i className="fas fa-file-alt" /> Request Quote
          </Link>
          <button className="lg:hidden p-2 text-navy text-2xl" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
