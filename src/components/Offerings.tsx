import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { gridOfferings } from "@/lib/offerings";

const Offerings = () => {
  return (
    <section id="offerings" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-5">
            Ways to work together
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.1]">
            Guiding you out of <span className="italic">survival mode</span>.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Through breathwork, private coaching, natural medicine, and immersive
            retreats, I guide people out of survival mode and into authentic living.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gridOfferings.map((o) => (
            <Link
              key={o.slug}
              to={`/offerings/${o.slug}`}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-7 hover:border-gold/40 hover:bg-card/60 transition-all"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
                  <o.Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-3">{o.cardTitle ?? o.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{o.cardDesc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offerings;
