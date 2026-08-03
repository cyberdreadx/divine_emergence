import { ArrowRight } from "lucide-react";
import { BOOKING_URL, BRAND } from "@/lib/site";
import logo from "@/assets/de-logo.svg";

const Hero = () => {
  return (
    <section
      id="top"
      className="de-halo relative w-full min-h-[92vh] flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
    >
      <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center">
        <img
          src={logo}
          alt={`Divine Emergence: ${BRAND.tagline}`}
          className="w-[22rem] md:w-[34rem] max-w-full h-auto"
        />

        <h1 className="mt-8 font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.15] italic font-light text-foreground">
          Come home to yourself.
        </h1>

        <p className="mt-6 text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
          A psychospiritual practice guiding you out of survival mode and into
          authentic living through breathwork, psychedelic-assisted support,
          and immersive retreats.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-gold to-blush text-blush-foreground px-8 py-4 rounded-full font-medium tracking-wide shadow-xl shadow-gold/15 hover:brightness-110 transition"
          >
            Book Your Free Clarity Call
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#about"
            className="text-muted-foreground text-sm tracking-[0.2em] uppercase border-b border-transparent hover:border-gold/60 hover:text-foreground transition-colors pb-1"
          >
            Meet Laura
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
