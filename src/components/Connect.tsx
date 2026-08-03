import { ArrowRight, Phone } from "lucide-react";
import { BOOKING_URL } from "@/lib/site";

const Connect = () => {
  return (
    <section id="connect" className="py-16 md:py-28 px-6">
      <div className="de-halo relative max-w-4xl mx-auto rounded-[2rem] border border-white/15 bg-white/[0.04] backdrop-blur-2xl shadow-[0_30px_120px_-30px_rgba(0,0,0,0.7)] px-6 md:px-16 py-14 md:py-20 text-center overflow-hidden">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/15 text-gold ring-1 ring-gold/25 mb-7">
          <Phone className="w-6 h-6" strokeWidth={1.5} />
        </span>

        <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-[1.15] mb-5">
          Start your transformation today.
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
          If you're ready to stop managing your pain and start moving through it,
          let's talk. Your first clarity call is free, a warm, no-pressure
          conversation about where you are and where you want to go.
        </p>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-gold to-blush text-blush-foreground px-9 py-4 rounded-full font-medium tracking-wide shadow-xl shadow-gold/15 hover:brightness-110 transition"
        >
          Book Your Free Clarity Call
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
};

export default Connect;
