'use client';

import Image from 'next/image';

const logos = [
  { src: '/images/clients/lockheed-martin.png', alt: 'Lockheed Martin', w: 248, h: 60 },
  { src: '/images/clients/honeywell.png', alt: 'Honeywell', w: 336, h: 60 },
  { src: '/images/clients/ge-healthcare.png', alt: 'GE Healthcare', w: 269, h: 60 },
  { src: '/images/clients/philips.png', alt: 'Philips', w: 106, h: 60 },
  { src: '/images/clients/siemens.png', alt: 'Siemens', w: 106, h: 60 },
  { src: '/images/clients/abbott.svg', alt: 'Abbott', w: 120, h: 60 },
  { src: '/images/clients/raytheon.png', alt: 'Raytheon', w: 228, h: 60 },
  { src: '/images/clients/northrop-grumman.svg', alt: 'Northrop Grumman', w: 200, h: 60 },
];

export default function LogoCarousel() {
  // Triple the logos for seamless infinite scroll
  const allLogos = [...logos, ...logos, ...logos];

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-center text-[1.875rem] font-bold text-navy mb-3">Trusted by Industry Leaders</h2>
        <p className="text-center text-gray-700 mb-6">Our customers include some of the world&apos;s most demanding OEMs and contract manufacturers.</p>
        <div className="overflow-hidden py-6" aria-label="Customer logos">
          <div
            className="flex gap-16 items-center w-max"
            style={{
              animation: 'logoScroll 40s linear infinite',
            }}
          >
            {allLogos.map((logo, i) => (
              <div key={i} className="flex-shrink-0">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.w}
                  height={logo.h}
                  className="h-10 w-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  loading="eager"
                  unoptimized={logo.src.endsWith('.svg')}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
