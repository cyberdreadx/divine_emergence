import { Wind, Flame, Compass, GraduationCap, Sparkles, ArrowUpRight } from "lucide-react";
import { LINKS } from "@/lib/site";

const offerings = [
  {
    title: "Breathwork",
    desc: "The simplest tool you have, and one of the most powerful. Facilitated sessions that regulate your nervous system and release what the body has been holding.",
    href: LINKS.breathwork,
    Icon: Wind,
  },
  {
    title: "Bufo Alvarius",
    desc: "Psychedelic-assisted support for those ready to move beyond survival, held with safety, integrity, and deep reverence.",
    href: LINKS.bufo,
    Icon: Flame,
  },
  {
    title: "Private Coaching",
    desc: "One-on-one guidance for navigating trauma, addiction, and anxiety. A holistic path toward clarity, personal power, and true freedom.",
    href: LINKS.coaching,
    Icon: Compass,
  },
  {
    title: "Breathwork Training Program",
    desc: "For those called to carry this work forward. Learn to hold space and facilitate transformational breath.",
    href: LINKS.training,
    Icon: GraduationCap,
  },
  {
    title: "Regulation Is Power",
    desc: "Practices and teachings to bring you back to yourself in a way that feels aligned, free, and grounded.",
    href: LINKS.regulation,
    Icon: Sparkles,
  },
];

const Offerings = () => {
  return (
    <section id="offerings" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-5">
            Ways to work together
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.1]">
            A holistic path to <span className="italic">transformation</span>.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Through breathwork, private coaching, psychedelic-assisted support, and
            immersive retreats, I guide people out of survival mode and into
            authentic living.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offerings.map((o) => (
            <a
              key={o.title}
              href={o.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-7 hover:border-gold/40 hover:bg-card/60 transition-all"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
                  <o.Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-3">{o.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{o.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offerings;
