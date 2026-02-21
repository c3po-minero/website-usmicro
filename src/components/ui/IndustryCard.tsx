import Link from 'next/link';

interface IndustryCardProps {
  icon: string;
  name: string;
  description: string;
  href: string;
}

export default function IndustryCard({ icon, name, description, href }: IndustryCardProps) {
  return (
    <Link href={href} className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="w-12 h-12 rounded-[10px] bg-blue-light flex items-center justify-center mb-3.5 text-blue-mid text-xl">
        <i className={`fas ${icon}`} />
      </div>
      <div className="text-base font-bold text-navy mb-1.5">{name}</div>
      <p className="text-[0.8125rem] text-gray-500 leading-relaxed m-0">{description}</p>
    </Link>
  );
}
