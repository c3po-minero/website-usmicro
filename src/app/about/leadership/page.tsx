import { Metadata } from 'next';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import HeroSection from '@/components/ui/HeroSection';
import LeadershipCard from '@/components/ui/LeadershipCard';
import CTABanner from '@/components/ui/CTABanner';

export const metadata: Metadata = {
  title: 'Leadership Team | US Micro Products',
  description: 'Meet the experienced leadership team behind US Micro Products. Engineers, supply chain experts, and business leaders driving display innovation since 1996.',
};

const teamMembers = [
  {
    name: 'Dave Alben',
    role: 'Leadership',
    photo: '/images/team/dave-alben.webp',
    bio: '<p>Dave Alben is a founding member of US Micro Products with decades of experience in the display industry. He has been instrumental in building the company from a small Austin startup into a global custom display solutions provider serving OEMs across medical, military, aerospace, and industrial markets.</p><p>Under his leadership, USMP has earned five consecutive Inc. 5000 recognitions and expanded to six offices across three continents.</p>',
  },
  {
    name: 'Vincent Chou',
    role: 'Leadership',
    photo: '/images/team/vincent-chou.webp',
    bio: '<p>Vincent Chou brings deep expertise in Asian supply chain operations and display manufacturing partnerships. He oversees US Micro Products\' relationships with panel manufacturers across China, Taiwan, Japan, and South Korea.</p><p>His in-region presence and technical knowledge ensure USMP customers get access to the best display technology from the best factories worldwide.</p>',
  },
  {
    name: 'Chris Seymour',
    role: 'Leadership',
    photo: '/images/team/chris-seymour.webp',
    bio: '<p>Chris Seymour is a display technology veteran with extensive experience in engineering and customer-facing roles. He works directly with OEM customers to translate application requirements into optimal display solutions.</p><p>His technical depth across TFT, AMOLED, PMOLED, and touch technologies makes him a trusted advisor for customers in demanding industries.</p>',
  },
  {
    name: 'Brian Wilkie',
    role: 'Leadership',
    photo: '/images/team/brian-wilkie.webp',
    bio: '<p>Brian Wilkie leads business development and strategic growth initiatives at US Micro Products. With a strong background in the electronics distribution and manufacturing sectors, he drives partnerships and market expansion.</p><p>Brian\'s focus on building long-term customer relationships aligns with USMP\'s core value of doing the right thing for every customer engagement.</p>',
  },
  {
    name: 'Daniel Wu',
    role: 'Leadership',
    photo: '/images/team/daniel-wu.webp',
    bio: '<p>Daniel Wu oversees operations and logistics for US Micro Products\' global supply chain. He ensures seamless coordination between manufacturing partners in Asia and customers worldwide.</p><p>His operational expertise enables USMP to maintain fast lead times and high quality across hundreds of active SKUs and custom projects.</p>',
  },
];

export default function LeadershipPage() {
  return (
    <>
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Leadership' }]} />

      <HeroSection
        eyebrow="About Us"
        title="Leadership Team"
        description="US Micro Products is led by a team of display industry veterans who combine deep technical expertise with decades of supply chain and business experience."
        short
      />

      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-center text-lg text-gray-700 max-w-[800px] mx-auto mb-12">
            In a company of approximately 30 people, leadership isn&apos;t isolated in a corner office. Our executives work directly with customers, participate in design reviews, and stay connected to the engineering and operational details that determine project success.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <LeadershipCard
                key={member.name}
                name={member.name}
                role={member.role}
                photo={member.photo}
                bio={member.bio}
              />
            ))}
          </div>
          <p className="text-center mt-10 text-sm text-gray-500">Click a team member to view their full profile.</p>
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
