import { Crown, Award, Palette, Gift } from "lucide-react";

const tiers = [
  { icon: Crown, title: "Title Sponsor", desc: "Top-tier visibility, naming rights, and premium brand integration throughout the event." },
  { icon: Award, title: "Premium Partner", desc: "Exclusive product placement, VIP access, and co-branded marketing materials." },
  { icon: Palette, title: "Activation Partner", desc: "Interactive brand experiences, pop-up activations, and direct attendee engagement." },
  { icon: Gift, title: "Gift Bag Inclusion", desc: "Reach every attendee with curated product placements in luxury gift bags." },
];

const Partnership = () => {
  return (
    <section className="py-24 px-6 bg-section-sage">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-3">Sponsor Tiers</p>
        <h2 className="font-serif text-3xl md:text-4xl text-center text-foreground mb-4">Partnership Opportunities</h2>
        <p className="text-center text-muted-foreground text-sm mb-14 max-w-xl mx-auto">
          Align your brand with an elevated wellness experience that resonates with a discerning, influential audience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tiers.map((t) => (
            <div
              key={t.title}
              className="bg-card/70 backdrop-blur rounded-xl p-7 hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 mb-3 rounded-full bg-accent flex items-center justify-center">
                <t.icon className="w-4 h-4 text-foreground" />
              </div>
              <h3 className="font-serif text-lg mb-2 text-foreground">{t.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partnership;
