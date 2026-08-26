import { BOOKING_URL } from "@/lib/site";
import content from "@/content/breathwork.json";
import { renderRichText } from "@/lib/richText";
import circle from "@/assets/de-circle.webp";

const Breathwork = () => {
  return (
    <section id="breathwork" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-5">
            {content.eyebrow}
          </span>
          <p className="font-serif text-2xl md:text-4xl text-foreground leading-[1.3] italic font-light">
            {renderRichText(content.quote)}
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
          {content.paragraphs.map((p, i) => (
            <p key={i}>{renderRichText(p)}</p>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-serif text-lg text-foreground border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            {content.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Breathwork;
