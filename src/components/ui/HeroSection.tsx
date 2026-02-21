import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string; icon?: string };
  secondaryCta?: { label: string; href: string; icon?: string };
  short?: boolean;
  backgroundImage?: string;
}

export default function HeroSection({ eyebrow, title, description, primaryCta, secondaryCta, short, backgroundImage }: HeroProps) {
  return (
    <section className={`relative bg-navy text-white overflow-hidden ${short ? 'py-15 md:py-12' : 'py-20 md:py-25'}`}>
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority
          quality={80}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/80 to-navy/60" />
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="max-w-[720px]">
          {eyebrow && <p className="text-[0.8125rem] font-semibold uppercase tracking-[1.5px] text-accent mb-3">{eyebrow}</p>}
          <h1 className="text-white text-3xl md:text-[3rem] font-bold leading-tight mb-5">{title}</h1>
          <p className="text-lg md:text-[1.1875rem] text-white/85 mb-8 leading-relaxed">{description}</p>
          <div className="flex gap-4 flex-wrap">
            {primaryCta && (
              <Link href={primaryCta.href} className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
                {primaryCta.icon && <i className={`fas ${primaryCta.icon}`} />} {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-transparent text-white rounded-md border-2 border-white hover:bg-white hover:text-navy transition-all">
                {secondaryCta.icon && <i className={`fas ${secondaryCta.icon}`} />} {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
