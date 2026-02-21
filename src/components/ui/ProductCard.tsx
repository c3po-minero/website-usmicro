import Link from 'next/link';

interface ProductCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  imageUrl?: string;
}

export default function ProductCard({ title, description, href, icon }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="h-[200px] bg-gradient-to-br from-navy to-blue flex items-center justify-center">
        {icon && <i className={`fas ${icon} text-5xl text-white/30`} />}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2"><Link href={href} className="text-navy hover:text-accent transition-colors">{title}</Link></h3>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        <Link href={href} className="text-sm font-semibold text-accent inline-flex items-center gap-1.5">
          Browse {title.split(' ')[0]} <i className="fas fa-arrow-right" />
        </Link>
      </div>
    </div>
  );
}
