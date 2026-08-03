import { ShieldCheck, Scale, Feather } from "lucide-react";

const values = [
  { title: "Safety", desc: "A held, grounded space where your nervous system can finally let go.", Icon: ShieldCheck },
  { title: "Integrity", desc: "Honest, holistic work. No masking, no shortcuts, no symptom management.", Icon: Scale },
  { title: "Authenticity", desc: "Guiding you back to who you actually are beneath the survival patterns.", Icon: Feather },
];

const Mission = () => {
  return (
    <section id="mission" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-6">
          My Mission
        </span>
        <p className="font-serif text-2xl md:text-4xl text-foreground leading-[1.35] italic font-light max-w-3xl mx-auto">
          To help people reconnect to their wholeness through breathwork, psychedelic
          therapies, and integration, moving beyond survival and into clarity,
          personal power, and true freedom.
        </p>

        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-8"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold ring-1 ring-gold/20 mb-5">
                <v.Icon className="w-5 h-5" strokeWidth={1.5} />
              </span>
              <h3 className="font-serif text-2xl text-foreground mb-2">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
