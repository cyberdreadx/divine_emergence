import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import connection from "@/assets/de-connection.webp";

const Retreat = () => {
  return (
    <section id="retreat" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl grid md:grid-cols-2">
          <div className="relative min-h-[20rem]">
            <img
              src={connection}
              alt="Women connecting at a Divine Emergence retreat"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/80 md:from-transparent md:to-background/80 to-transparent" />
          </div>

          <div className="relative bg-card/50 backdrop-blur-sm p-8 md:p-14 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-gold font-sans text-xs uppercase tracking-[0.3em] mb-5">
              <MapPin className="w-3.5 h-3.5" />
              Immersive Retreat
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.1] mb-6">
              Women's Lakehouse Retreat
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              A few days away from the noise: breath, ceremony, and community in an
              intimate setting. Space to move through what you've been carrying and
              return to yourself, alongside women walking the same path.
            </p>
            <Link
              to="/retreat"
              className="group inline-flex items-center gap-2.5 self-start bg-gradient-to-r from-gold to-blush text-blush-foreground px-7 py-3.5 rounded-full font-medium tracking-wide shadow-lg shadow-gold/10 hover:brightness-110 transition"
            >
              Explore the Retreat
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Retreat;
