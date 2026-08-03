import { BOOKING_URL } from "@/lib/site";
import circle from "@/assets/de-circle.webp";

const Breathwork = () => {
  return (
    <section id="breathwork" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-5">
            Why breathwork is for everyone
          </span>
          <p className="font-serif text-2xl md:text-4xl text-foreground leading-[1.3] italic font-light">
            "Breathwork is for everyone because your breath is always with you.
            It's the simplest tool you have, and one of the most powerful."
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl mb-14">
          <img
            src={circle}
            alt="A breathwork circle in session"
            className="w-full aspect-[16/9] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-muted-foreground leading-relaxed">
          <p>
            Every inhale and exhale is influencing your mind, your emotions, and your
            entire nervous system, whether you realize it or not.
          </p>
          <p>
            If you're anxious, overwhelmed, stuck, or just ready to feel like yourself
            again, breathwork meets you exactly where you are.
          </p>
          <p>
            You don't need experience. You don't need a spiritual practice. You just
            need to learn how to actually breathe, and everything starts to shift for
            the better.
          </p>
          <p>
            You can practice on your own, but working with a trained facilitator takes
            you somewhere you can't usually get to. Having someone hold the space while
            you move through your breath makes all the difference.
          </p>
        </div>

        <div className="mt-12 text-center">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-serif text-lg text-foreground border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            Schedule a clarity call to begin your journey home to yourself
          </a>
        </div>
      </div>
    </section>
  );
};

export default Breathwork;
