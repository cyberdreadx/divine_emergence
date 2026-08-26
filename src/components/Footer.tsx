import { BRAND, BOOKING_URL, LINKS } from "@/lib/site";
import content from "@/content/footer.json";
import logo from "@/assets/de-logo.svg";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 pt-14 pb-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-sm">
            <img src={logo} alt="Divine Emergence" className="h-11 w-auto mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              {content.blurb}
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="font-serif text-foreground text-xs uppercase tracking-[0.2em] mb-4">
                {content.exploreHeading}
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">{content.linkAbout}</a></li>
                <li><a href="#offerings" className="hover:text-foreground transition-colors">{content.linkOfferings}</a></li>
                <li><a href={LINKS.retreat} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{content.linkRetreat}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-foreground text-xs uppercase tracking-[0.2em] mb-4">
                {content.beginHeading}
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    {content.linkClarityCall}
                  </a>
                </li>
                <li><a href="#connect" className="hover:text-foreground transition-colors">{content.linkContact}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground/70 text-[11px] tracking-wider">
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-muted-foreground/50 text-[11px] tracking-[0.2em] uppercase">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
