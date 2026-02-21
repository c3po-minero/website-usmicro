import Link from 'next/link';

interface CTABannerProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaIcon?: string;
}

export default function CTABanner({ title, description, ctaLabel, ctaHref, ctaIcon }: CTABannerProps) {
  return (
    <section className="bg-gradient-to-br from-blue to-navy text-white py-15 text-center">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-white text-[1.875rem] font-bold mb-3">{title}</h2>
        <p className="text-white/85 mb-6 max-w-[600px] mx-auto">{description}</p>
        <Link href={ctaHref} className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
          {ctaIcon && <i className={`fas ${ctaIcon}`} />} {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
