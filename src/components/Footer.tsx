import { BRAND, BOOKING_URL, LINKS } from "@/lib/site";
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
              A psychospiritual practice with {BRAND.founder}, based in {BRAND.location}.
              Reconnect to your wholeness through breathwork, psychedelic therapies,
              and integration.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="font-serif text-foreground text-xs uppercase tracking-[0.2em] mb-4">
                Explore
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#offerings" className="hover:text-foreground transition-colors">Offerings</a></li>
                <li><a href={LINKS.retreat} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Retreat</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-foreground text-xs uppercase tracking-[0.2em] mb-4">
                Begin
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Free Clarity Call
                  </a>
                </li>
                <li><a href="#connect" className="hover:text-foreground transition-colors">Contact</a></li>
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
