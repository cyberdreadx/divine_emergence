import { Crown, Gem, Sparkles, Gift } from "lucide-react";

const experiences = [
  { title: "Welcome Drinks and Introduction", desc: "Begin your journey with a grounding ceremony and intention-setting workshop." },
  { title: "Wellness Experience", desc: "Revitalizing movement and pranayama sessions led by world-class instructors." },
  { title: "Curated Journeys", desc: "Special experiences curated just for your group." },
  { title: "Sound Bath", desc: "Deep meditative healing through live music and frequencies." },
  { title: "Community & Discussion", desc: "Win your guest's hearts with Integration modalities and sharing as it is one of the most powerful ways for people to bond over shared experiences. " },
];

const audiences = [
  { title: "Corporate Leaders", desc: "C-suite executives and entrepreneurs seeking mindful leadership and rejuvenation." },
  { title: "Health Enthusiasts", desc: "Wellness advocates exploring cutting-edge holistic health practices." },
  { title: "Luxury Brands", desc: "Premium lifestyle brands looking to connect with an affluent, health-conscious audience." },
  { title: "Conscious Adults", desc: "Individuals committed to personal growth, community, and purposeful living." },
];

const tiers = [
  { title: "Title Sponsor", tag: "Naming Rights", Icon: Crown },
  { title: "Premium Partner", tag: "VIP Access", Icon: Gem },
  { title: "Activation Partner", tag: "Brand Experience", Icon: Sparkles },
  { title: "Gift Bag Inclusion", tag: "Curated Reach", Icon: Gift },
];

import experiencePhoto from "@/assets/experience-ritual.jpg.asset.json";
import audiencePhoto from "@/assets/audience-oils.jpg.asset.json";
import synergyPhoto from "@/assets/synergy-swim.jpg.asset.json";

const BrandStory = () => {
  return (
    <section id="experience" className="py-14 md:py-32 px-6 md:px-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-32">
        {/* 01 — The Experience */}
        <div className="relative">
          <span className="text-gold font-sans text-xs uppercase tracking-widest mb-6 block font-medium">
            01. The Experience
          </span>
          <h2 className="font-serif text-5xl md:text-7xl text-foreground leading-[1.1] mb-10">
            A curated journey of <span className="italic">unrivaled</span> elegance.
          </h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl">
              <img
                src={experiencePhoto.url}
                alt="A moment of stillness — reading by the rocks at golden hour"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-6">
              {experiences.map((e) => (
                <div key={e.title}>
                  <h3 className="font-serif text-xl text-foreground mb-1">{e.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 02 — The Audience */}
        <div className="relative">
          <span className="text-gold font-sans text-xs uppercase tracking-widest mb-6 block font-medium">
            02. The Audience
          </span>
          <h2 className="font-serif text-5xl md:text-7xl text-foreground leading-[1.1] mb-6">
            Connecting with the <span className="italic">discerning</span> few.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-10">
            An exclusive gathering of individuals united by a passion for wellness, creativity, connection, adventure, and purpose.
          </p>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="space-y-6 md:order-1 order-2">
              {audiences.map((a) => (
                <div key={a.title}>
                  <h4 className="font-serif text-xl text-foreground mb-1">{a.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl md:order-2 order-1">
              <img
                src={audiencePhoto.url}
                alt="Guests exploring botanical oils at a Breathe & Bloom gathering"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* 03 — Why Partner */}
        <div className="relative">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <span className="text-gold font-sans text-xs uppercase tracking-widest mb-6 block font-medium">
                03. Synergy
              </span>
              <h2 className="font-serif text-4xl text-foreground mb-8">Why Partner With Us</h2>
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl">
                <img
                  src={synergyPhoto.url}
                  alt="Guests bathing in golden light during a Breathe & Bloom retreat"
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="md:w-2/3 space-y-12">
              <div className="group">
                <h4 className="font-serif text-2xl text-foreground mb-3 group-hover:text-gold transition-colors">
                  Authentic Alignment
                </h4>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  We don't just host brands; we integrate legacies. Your identity becomes part of the atmosphere, felt through subtle touches rather than loud assertions.
                </p>
              </div>
              <div className="group">
                <h4 className="font-serif text-2xl text-foreground mb-3 group-hover:text-gold transition-colors">
                  The Inner Circle
                </h4>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  Gain direct access to an insulated demographic that values exclusivity and craftsmanship over mass-market visibility.
                </p>
              </div>
              <div className="group">
                <h4 className="font-serif text-2xl text-foreground mb-3 group-hover:text-gold transition-colors">
                  Bespoke Gifting
                </h4>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  Premium products staged elegantly with your brand for an unforgettable gift bag experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 04 — Partnership Opportunities */}
        <div className="relative pt-16 border-t border-foreground/10">
          <span className="text-gold font-sans text-xs uppercase tracking-widest mb-12 block font-medium">
            04. Opportunities
          </span>
          <div>
            {tiers.map((t) => (
              <div
                key={t.title}
                className="flex justify-between items-baseline py-6 border-b border-foreground/10 hover:bg-accent/20 px-4 -mx-4 transition-colors"
              >
                <span className="flex items-center gap-3 font-serif text-2xl italic text-foreground">
                  <t.Icon size={20} strokeWidth={1.5} className="text-gold" />
                  {t.title}
                </span>
                <span className="font-sans text-xs uppercase tracking-tighter text-muted-foreground">{t.tag}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-20 text-center">
            <a
              href="#connect"
              className="inline-block font-serif text-foreground text-xl border-b border-gold pb-1 hover:text-gold transition-colors duration-500"
            >
              Inquire for the full prospectus
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
