interface Stat {
  number: string;
  label: string;
}

interface StatsBarProps {
  stats: Stat[];
  dark?: boolean;
}

export default function StatsBar({ stats, dark = true }: StatsBarProps) {
  return (
    <section className={dark ? 'bg-navy' : 'bg-white'}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex justify-around flex-wrap gap-6 py-8 md:py-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-5xl font-extrabold text-accent leading-none">{stat.number}</div>
              <div className={`text-sm mt-2 ${dark ? 'text-white/70' : 'text-gray-500'}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
