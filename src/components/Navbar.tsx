import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BOOKING_URL } from "@/lib/site";
import logo from "@/assets/de-logo.svg";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Offerings", href: "#offerings" },
  { label: "Breathwork", href: "#breathwork" },
  { label: "Retreat", href: "#retreat" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#top" className="flex items-center" aria-label="Divine Emergence home">
          <img
            src={logo}
            alt="Divine Emergence"
            className="h-9 md:h-10 w-auto object-contain"
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-muted-foreground text-xs tracking-[0.18em] uppercase hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-gold to-blush text-blush-foreground text-xs tracking-[0.16em] uppercase font-medium shadow-lg shadow-gold/10 hover:brightness-110 transition"
          >
            Free Clarity Call
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-white/10 px-6 py-5 space-y-4">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-muted-foreground text-sm tracking-wide uppercase hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block text-center px-5 py-3 rounded-full bg-gradient-to-r from-gold to-blush text-blush-foreground text-sm tracking-wide uppercase font-medium"
          >
            Book Your Free Clarity Call
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
