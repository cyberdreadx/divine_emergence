import { Sparkles, Users, Heart } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Elevated Wellness",
    description: "Curated experiences designed to nurture mind, body, and spirit.",
  },
  {
    icon: Users,
    title: "Revolutionary Connections",
    description: "Meaningful relationships with like-minded visionaries and leaders.",
  },
  {
    icon: Heart,
    title: "Creating Social Impact",
    description: "Purpose-driven partnerships that give back to the community.",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-6 bg-section-sage">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card/70 backdrop-blur rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
              <f.icon className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="font-serif text-lg mb-2 text-foreground">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
