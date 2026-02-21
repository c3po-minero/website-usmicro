import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import HeroSection from '@/components/ui/HeroSection';
import StatsBar from '@/components/ui/StatsBar';
import LogoCarousel from '@/components/ui/LogoCarousel';
import LeadershipCard from '@/components/ui/LeadershipCard';
import CTABanner from '@/components/ui/CTABanner';

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
  { year: '1996', title: 'Founded in Austin, Texas', text: 'Established as a custom display solutions provider for OEMs, filling a gap in the market for engineering-focused display sourcing.' },
  { year: '2001', title: 'Defense & Aerospace Expansion', text: 'Expanded into military and aerospace markets, securing Lockheed Martin and Honeywell as customers.' },
  { year: '2006', title: 'Asian Operations Established', text: 'Opened offices in Shenzhen and Taichung to strengthen supply chain partnerships.' },
  { year: '2010', title: 'ISO 9001 Certification', text: 'Achieved ISO 9001 certification. Product catalog exceeded 200 active SKUs.' },
  { year: '2015', title: 'Inc. 5000 Recognition', text: 'First Inc. 5000 recognition. Entered the AMOLED and wearable display market.' },
  { year: '2019', title: 'Five-Time Inc. 5000 Honoree', text: 'Five consecutive years on Inc. 5000. Became a leading wearable display provider.' },
  { year: '2024', title: '450+ SKUs, Global Presence', text: 'Product catalog exceeds 450 SKUs across 9 display technologies. Six offices on three continents.' },
];

const teamMembers = [
  { name: 'Dave Alben', role: 'Leadership', photo: '/images/team/dave-alben.webp' },
  { name: 'Vincent Chou', role: 'Leadership', photo: '/images/team/vincent-chou.webp' },
  { name: 'Chris Seymour', role: 'Leadership', photo: '/images/team/chris-seymour.webp' },
  { name: 'Brian Wilkie', role: 'Leadership', photo: '/images/team/brian-wilkie.webp' },
  { name: 'Daniel Wu', role: 'Leadership', photo: '/images/team/daniel-wu.webp' },
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
      />

      <StatsBar stats={stats} dark />

      {/* Fabless Model */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-[900px]">
            <h2 className="text-[1.875rem] font-bold text-navy mb-6">The Fabless Model</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">We design and deliver custom display solutions. We don&apos;t own factories — we operate a fabless manufacturing model that gives us access to the best display technology from the best manufacturers worldwide, without locking our customers into a single production line or a single technology.</p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">Our supply chain spans six locations across three continents. Manufacturing partners in China, Taiwan, Japan, and South Korea give us access to the full spectrum of display technologies. We select the optimal technology and factory for each project based on the application requirements, not based on which factory we happen to own.</p>
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

      {/* What We Believe */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-10">What We Believe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-5 text-white text-2xl">
                  <i className={`fas ${v.icon}`} />
                </div>
                <h3 className="text-[1.25rem] font-bold text-navy mb-3">{v.title}</h3>
                <p className="text-[0.9375rem] text-gray-700">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[900px] mx-auto px-6">
          <h2 className="text-center text-[1.875rem] font-bold text-navy mb-12">Our Journey</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={item.year} className={`flex gap-6 ${i < timeline.length - 1 ? 'pb-10' : ''}`}>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{item.year}</div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-300 mt-2" />}
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-navy text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-[0.9375rem]">{item.text}</p>
                </div>
              </div>
            ))}
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

      <CTABanner
        title="Ready to Work Together?"
        description="Contact us to discuss your display project or learn more about our capabilities."
        ctaLabel="Contact Us"
        ctaHref="/contact"
        ctaIcon="fa-comments"
      />
    </>
  );
}
