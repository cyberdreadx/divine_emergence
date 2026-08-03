import { Star, Quote, ArrowUpRight } from "lucide-react";
import { REVIEWS, reviews } from "@/lib/reviews";

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-gold text-gold" strokeWidth={0} />
    ))}
  </span>
);

const Reviews = () => {
  return (
    <section id="reviews" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-5">
            Kind words
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.1]">
            Loved by the <span className="italic">people I work with</span>.
          </h2>

          {/* Real, verifiable aggregate from the Google Business Profile. */}
          <a
            href={REVIEWS.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-card/40 backdrop-blur-sm pl-4 pr-3 py-2 hover:border-gold/40 transition-colors"
          >
            <span className="font-serif text-xl text-foreground leading-none">{REVIEWS.rating}</span>
            <Stars />
            <span className="text-muted-foreground text-sm">
              {REVIEWS.count} Google reviews
            </span>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="relative flex flex-col rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-7"
            >
              <Quote className="w-6 h-6 text-gold/40 mb-4" strokeWidth={1.5} />
              <blockquote className="text-muted-foreground leading-relaxed flex-1">
                {r.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <div>
                  <div className="text-foreground text-sm font-medium">{r.name}</div>
                  {r.context && (
                    <div className="text-muted-foreground/60 text-xs mt-0.5">{r.context}</div>
                  )}
                </div>
                <Stars />
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-muted-foreground/50 text-xs">
          Reviews sourced from Google. Star rating and count reflect the Divine Emergence,
          LLC Google Business Profile.
        </p>
      </div>
    </section>
  );
};

export default Reviews;
