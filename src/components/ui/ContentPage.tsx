import BreadcrumbNav from './BreadcrumbNav';
import CTABanner from './CTABanner';

interface Crumb {
  label: string;
  href?: string;
}

interface ContentPageProps {
  breadcrumbs: Crumb[];
  title: string;
  htmlContent: string;
  showCTA?: boolean;
  ctaTitle?: string;
  ctaDesc?: string;
}

export default function ContentPage({ breadcrumbs, title, htmlContent, showCTA = true, ctaTitle, ctaDesc }: ContentPageProps) {
  return (
    <>
      <BreadcrumbNav items={breadcrumbs} />
      <section className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <h1 className="text-3xl md:text-[2.5rem] font-bold text-navy mb-8 leading-tight">{title}</h1>
          <div className="prose max-w-none text-gray-700 leading-relaxed [&_h2]:text-[1.625rem] [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-10 [&_h3]:text-[1.25rem] [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-8 [&_p]:mb-4 [&_p]:text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2 [&_a]:text-blue-mid [&_strong]:text-gray-900" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </section>
      {showCTA && (
        <CTABanner
          title={ctaTitle || 'Start Your Display Project'}
          description={ctaDesc || 'Tell us about your application and our engineers will recommend the optimal display solution.'}
          ctaLabel="Request a Quote"
          ctaHref="/support/request-quote"
          ctaIcon="fa-file-alt"
        />
      )}
    </>
  );
}
