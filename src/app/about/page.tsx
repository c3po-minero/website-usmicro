import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import HeroSection from '@/components/ui/HeroSection';
import StatsBar from '@/components/ui/StatsBar';
import LogoCarousel from '@/components/ui/LogoCarousel';
import LeadershipCard from '@/components/ui/LeadershipCard';

export const metadata: Metadata = {
  title: 'About US Micro Products | Custom Display Manufacturer',
  description: 'Founded in 1996 in Austin, TX. Fabless custom display manufacturer with global supply chain across 3 continents. We add the human touch to technology.',
};

const stats = [
  { number: '1996', label: 'Founded' },
  { number: '~30', label: 'Employees' },
  { number: '6', label: 'Global Offices' },
  { number: '450+', label: 'Active SKUs' },
  { number: '200+', label: 'Custom Designs/Year' },
];

const values = [
  { icon: 'fa-check-circle', title: 'Do the Right Thing', desc: 'Long-term relationships built on trust. We recommend the right solution, even when a more expensive option would be more profitable.' },
  { icon: 'fa-bolt', title: 'Take Action', desc: 'Display projects have timelines. We respond quickly, solve problems proactively, and maintain urgency.' },
  { icon: 'fa-smile', title: 'Have Fun', desc: "We're engineers who love display technology. That enthusiasm translates to creative solutions." },
];

const timeline = [
  { year: '1996', title: 'Founded in Austin, Texas', text: 'Established as a custom display solutions provider for OEMs, filling a gap in the market for engineering-focused display sourcing. Started with a small team and a vision to add the human touch to technology.' },
  { year: '2001', title: 'Defense & Aerospace Expansion', text: 'Expanded into military and aerospace markets, securing Lockheed Martin and Honeywell as customers. Developed rugged display solutions for harsh environment applications.' },
  { year: '2006', title: 'Asian Operations Established', text: 'Opened offices in Shenzhen and Taichung to strengthen supply chain partnerships. Direct presence in Asia enabled closer factory relationships and faster turnaround.' },
  { year: '2010', title: 'ISO 9001 Certification', text: 'Achieved ISO 9001 certification, formalizing quality management processes. Product catalog exceeded 200 active SKUs across multiple display technologies.' },
  { year: '2015', title: 'Inc. 5000 Recognition', text: 'Recognized on Inc. 5000 list of America\'s fastest-growing private companies for the first time. Entered the AMOLED and wearable display market with new product lines.' },
  { year: '2019', title: 'Five-Time Inc. 5000 Honoree', text: 'Achieved five consecutive years on Inc. 5000 list. Became a leading provider of displays for the wearable technology market. Expanded EMS capabilities.' },
  { year: '2024', title: '450+ SKUs, Global Presence', text: 'Product catalog exceeds 450 SKUs across 9 display technologies. Six offices on three continents serve customers worldwide with local support and engineering expertise.' },
];

const teamMembers = [
  { name: 'Dave Alben', role: 'Co-Founder & President', photo: '/images/team/dave-alben.webp' },
  { name: 'Vincent Chou', role: 'VP, Asian Operations', photo: '/images/team/vincent-chou.webp' },
  { name: 'Chris Seymour', role: 'VP, Engineering & Sales', photo: '/images/team/chris-seymour.webp' },
  { name: 'Brian Wilkie', role: 'VP, Business Development', photo: '/images/team/brian-wilkie.webp' },
  { name: 'Daniel Wu', role: 'VP, Operations & Logistics', photo: '/images/team/daniel-wu.webp' },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />

      <HeroSection
        eyebrow="About Us"
        title="We Add the Human Touch to Technology"
        description="Founded in 1996 in Austin, Texas. Nearly three decades of engineering custom display solutions for the world's most demanding OEMs."
        primaryCta={{ label: 'Meet the Team', href: '/about/leadership', icon: 'fa-users' }}
        secondaryCta={{ label: 'Contact Us', href: '/contact', icon: 'fa-comments' }}
        backgroundImage="/images/content/about-hero.webp"
      />

      <StatsBar stats={stats} dark />

      {/* Fabless Model - 2 column with images */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-[1.875rem] font-bold text-navy mb-6">The Fabless Model</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">We design and deliver custom display solutions. We don&apos;t own factories — we operate a fabless manufacturing model that gives us access to the best display technology from the best manufacturers worldwide, without locking our customers into a single production line or a single technology.</p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">Our supply chain spans six locations across three continents. Manufacturing partners in China, Taiwan, Japan, and South Korea give us access to the full spectrum of display technologies.</p>
            </div>
            <div className="lg:col-span-2 hidden lg:block relative min-h-[350px]" aria-hidden="true">
              <img
                src="/images/content/fabless-1.webp"
                alt="Global supply chain operations"
                className="absolute left-0 top-0 w-[85%] h-[85%] object-cover rounded-xl shadow-2xl z-[1]"
                loading="eager"
              />
              <img
                src="/images/content/fabless-2.webp"
                alt="Worldwide logistics"
                className="absolute right-0 bottom-0 w-[160px] h-[160px] object-cover rounded-xl shadow-xl z-[3] border-4 border-white"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Small Team, Global Reach */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <h2 className="text-[1.875rem] font-bold text-navy mb-6">Small Team, Global Reach</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">US Micro Products is approximately 30 people. We are not a faceless corporation with a call center. When you work with us, you work with the same engineers and project managers from first conversation through production ramp and beyond.</p>
          <p className="text-gray-700 text-lg leading-relaxed">But don&apos;t let the headcount fool you. Our global supply chain, manufacturing partnerships, and logistics infrastructure give us capabilities that rival companies many times our size. We&apos;ve earned a place on the Inc. 5000 list of America&apos;s fastest-growing private companies for five consecutive years.</p>
        </div>
      </section>

      {/* What We Believe - orange circle icons */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-10">What We Believe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-5 text-white text-2xl">
                  <i className={`fas ${v.icon}`} />
                </div>
                <h3 className="text-[1.25rem] font-bold text-navy mb-3">{v.title}</h3>
                <p className="text-[0.9375rem] text-gray-700">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - zigzag layout */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[900px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-12">Our Journey</h2>
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-gray-200 -translate-x-1/2 hidden md:block" aria-hidden="true" />
            {/* Mobile left line */}
            <div className="absolute left-5 top-0 bottom-0 w-[3px] bg-gray-200 md:hidden" aria-hidden="true" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative">
                  {/* Desktop zigzag */}
                  <div className={`hidden md:flex items-start gap-8 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-[45%] ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="text-[1.5rem] font-extrabold text-accent mb-2">{item.year}</div>
                        <h3 className="text-[1.125rem] font-bold text-navy mb-2">{item.title}</h3>
                        <p className="text-[0.9375rem] text-gray-700 m-0">{item.text}</p>
                      </div>
                    </div>
                    {/* Center dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-7 w-4 h-4 rounded-full bg-accent border-4 border-white shadow z-[2]" />
                    <div className="w-[45%]" />
                  </div>

                  {/* Mobile: left-aligned */}
                  <div className="md:hidden flex items-start gap-4 pl-10 relative">
                    <div className="absolute left-[14px] top-7 w-4 h-4 rounded-full bg-accent border-4 border-white shadow z-[2]" />
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-1">
                      <div className="text-lg font-extrabold text-accent mb-1">{item.year}</div>
                      <h3 className="font-bold text-navy mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-700 m-0">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Leadership Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-3">Leadership Team</h2>
          <p className="text-center text-gray-700 mb-10">Meet the people behind US Micro Products.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <LeadershipCard key={member.name} name={member.name} role={member.role} photo={member.photo} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/about/leadership" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-transparent text-blue border-2 border-blue rounded-md hover:bg-blue hover:text-white transition-all">
              <i className="fas fa-users" /> View Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* CTA with 2 buttons */}
      <section className="bg-gradient-to-br from-blue to-navy text-white py-16 text-center">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="text-white text-[1.875rem] font-bold mb-4">Ready to Work Together?</h2>
          <p className="text-white/80 mb-8">Contact us to discuss your display project or learn more about our capabilities.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-accent text-white rounded-md border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-all">
              <i className="fas fa-comments" /> Contact Us
            </Link>
            <Link href="/products" className="inline-flex items-center gap-2 px-7 py-3 text-[0.9375rem] font-semibold bg-transparent text-white rounded-md border-2 border-white hover:bg-white hover:text-navy transition-all">
              <i className="fas fa-search" /> Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
