import { Briefcase, Leaf, Star, UserCheck } from "lucide-react";

const audiences = [
  { icon: Briefcase, title: "Corporate Leaders", desc: "C-suite executives and entrepreneurs seeking mindful leadership and rejuvenation." },
  { icon: Leaf, title: "Health Enthusiasts", desc: "Wellness advocates exploring cutting-edge holistic health practices." },
  { icon: Star, title: "Luxury Brands", desc: "Premium lifestyle brands looking to connect with an affluent, health-conscious audience." },
  { icon: UserCheck, title: "Conscious Adults", desc: "Individuals committed to personal growth, community, and purposeful living." },
];

const Audience = () => {
  return (
    <section className="py-24 px-6 bg-section-sage">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-3">Who Attends</p>
        <h2 className="font-serif text-3xl md:text-4xl text-center text-foreground mb-14">The Audience</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="bg-card/70 backdrop-blur rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-accent flex items-center justify-center">
                <a.icon className="w-4 h-4 text-foreground" />
              </div>
              <h3 className="font-serif text-base mb-2 text-foreground">{a.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-8 max-w-xl mx-auto">
          An exclusive gathering of 80–100 influential individuals united by a passion for wellness, creativity, and purpose.
        </p>
      </div>
    </section>
  );
};

export default Audience;
