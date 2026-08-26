import content from "@/content/story.json";
import { renderRichText } from "@/lib/richText";
import meditation from "@/assets/de-meditation.webp";

const Story = () => {
  return (
    <section id="about" className="py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-6">
          {content.eyebrow}
        </span>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl md:sticky md:top-24">
            <img
              src={meditation}
              alt="A moment of stillness in breathwork"
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.15] mb-8">
              {content.heading}{" "}
              <span className="italic text-gold">{content.headingHighlight}</span>.
            </h2>

            <div className="space-y-5 text-muted-foreground leading-relaxed">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{renderRichText(p)}</p>
              ))}
              <p className="text-foreground font-serif text-xl italic leading-relaxed">
                {renderRichText(content.pullQuote)}
              </p>
            </div>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
              <h3 className="font-serif text-lg text-foreground mb-4">{content.factsHeading}</h3>
              {content.facts.map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="font-serif text-gold text-lg leading-none mt-0.5">
                    0{i + 1}
                  </span>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
