import { useEffect } from "react";
import { Star, ArrowUpRight } from "lucide-react";
import { REVIEWS } from "@/lib/reviews";

const WIDGET_SRC = "https://widgets.sociablekit.com/google-reviews/widget.js";

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-gold text-gold" strokeWidth={0} />
    ))}
  </span>
);

const Reviews = () => {
  // SociableKit's script scans the page for its widget container on load.
  // Re-inject it on mount so the live Google reviews render (including after
  // client-side navigation), then clean up on unmount.
  useEffect(() => {
    document.querySelectorAll(`script[src="${WIDGET_SRC}"]`).forEach((s) => s.remove());
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

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

        {/* SociableKit live Google reviews widget. Configure its look in the
            SociableKit dashboard (embed id 25702767). */}
        <div className="sk-ww-google-reviews" data-embed-id="25702767" />
      </div>
    </section>
  );
};

export default Reviews;
