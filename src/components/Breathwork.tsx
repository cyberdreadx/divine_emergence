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

        <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>
            People often underestimate the power of something they do thousands of
            times a day: their breath. Your breathing isn't just keeping you alive; it
            is constantly communicating with your brain and influencing your nervous
            system, heart rate, attention, emotional state, and physical health.
          </p>
          <p>
            But learning how to use your breath effectively is very different from
            simply taking deep breaths. Working with a trained breathwork practitioner
            gives you guidance, structure, and a safe container to explore the full
            range of what this modality can offer. A skilled facilitator can teach you
            different breathing techniques, recognize when your body is becoming
            overwhelmed or underactivated, help you understand what you're experiencing,
            and guide you through the process without pushing you beyond your capacity.
          </p>
          <p>
            You don't need years of meditation experience or a spiritual practice. You
            already carry this tool. You just need to learn how to utilize it.
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
