import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 pt-16" role="contentinfo">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Image src="/images/logos/USMP-square-white.svg" alt="US Micro Products logo" width={80} height={80} />
            <p className="text-sm leading-relaxed mt-3">Custom display solutions engineered for your product. Fabless manufacturer serving medical, military, aerospace, and industrial OEMs since 1996.</p>
            <div className="flex gap-3 mt-4">
              <a href="https://linkedin.com" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-accent hover:text-white transition-all"><i className="fab fa-linkedin-in" /></a>
              <a href="https://twitter.com" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-accent hover:text-white transition-all"><i className="fab fa-x-twitter" /></a>
              <a href="https://youtube.com" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-accent hover:text-white transition-all"><i className="fab fa-youtube" /></a>
            </div>
          </div>
          <div>
            <p className="text-white text-[0.8125rem] uppercase tracking-wider font-bold mb-4">Products</p>
            <ul className="space-y-2">
              {[['TFT Displays', '/products/tft-displays'], ['AMOLED Displays', '/products/amoled-displays'], ['PMOLED Displays', '/products/pmoled-displays'], ['Touch Panels', '/products/touch-panels'], ['Open Frame Monitors', '/products/open-frame-monitors'], ['Smart Displays', '/products/smart-displays']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-white/60 text-[0.8125rem] hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-[0.8125rem] uppercase tracking-wider font-bold mb-4">Applications</p>
            <ul className="space-y-2">
              {[['Medical', '/applications/medical'], ['Military', '/applications/military'], ['Aerospace', '/applications/aerospace'], ['Industrial', '/applications/industrial'], ['Automotive', '/applications/automotive'], ['Wearables', '/applications/wearables']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-white/60 text-[0.8125rem] hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-[0.8125rem] uppercase tracking-wider font-bold mb-4">Company</p>
            <ul className="space-y-2">
              {[['About Us', '/about'], ['Leadership', '/about/leadership'], ['Quality', '/about/quality'], ['Careers', '/about/careers'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-white/60 text-[0.8125rem] hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-[0.8125rem] uppercase tracking-wider font-bold mb-4">Resources</p>
            <ul className="space-y-2">
              {[['Learning Center', '/learn/tft-display-technology'], ['FAQ', '/support/faq'], ['Request Quote', '/support/request-quote'], ['Services', '/services/ems']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-white/60 text-[0.8125rem] hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 flex flex-wrap justify-between items-center gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} US Micro Products</span>
          <span><Link href="/terms" className="text-white/50 hover:text-white">Terms</Link> &middot; <Link href="/privacy" className="text-white/50 hover:text-white">Privacy Policy</Link></span>
        </div>
      </div>
    </footer>
  );
}
