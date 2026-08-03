import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getOffering } from "@/lib/offerings";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-5">
    {children}
  </span>
);

const OfferingDetail = ({ slug: slugOverride }: { slug?: string }) => {
  const params = useParams();
  const slug = slugOverride ?? params.slug;
  const offering = getOffering(slug);

  if (!offering) {
    return <Navigate to="/" replace />;
  }

  const {
    title, Icon, eyebrow, headline, intro, body, image, imageAlt,
    approach, benefits, sections, curriculum, values, includes, pricing,
    testimonials, faq, ctaLabel, ctaHref,
  } = offering;

  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/#offerings"
            className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.18em] uppercase hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            All offerings
          </Link>

          {/* Hero */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center mb-16 md:mb-24">
            <div>
              <span className="inline-flex items-center gap-3 text-gold font-sans text-xs uppercase tracking-[0.3em] mb-6">
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {eyebrow}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.05] mb-6">
                {headline}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{intro}</p>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
                <img src={image} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="de-halo absolute inset-0 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-16 md:space-y-24">
            {/* Lead body */}
            {body && body.length > 0 && (
              <div className="max-w-3xl space-y-6">
                {body.map((para, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">{para}</p>
                ))}
              </div>
            )}

            {/* Approach / feature cards */}
            {approach && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">{approach.title}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {approach.features.map((f, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-7">
                      <h3 className="font-serif text-xl text-foreground mb-3">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits / checklist */}
            {benefits && (
              <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">{benefits.title}</h2>
                <ul className="space-y-4">
                  {benefits.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                      <span className="mt-1 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prose sections */}
            {sections && sections.map((s, i) => (
              <div key={i} className="max-w-3xl">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{s.heading}</h2>
                <div className="space-y-6">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="text-muted-foreground leading-relaxed">{p}</p>
                  ))}
                </div>
                {s.items && (
                  <ul className="mt-8 space-y-4">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                        <span className="mt-1 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
                          <Check className="w-3 h-3" strokeWidth={2.5} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Curriculum / steps */}
            {curriculum && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">{curriculum.title}</h2>
                <div className="space-y-4">
                  {curriculum.steps.map((step, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-7">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5 mb-3">
                        <span className="text-gold text-xs uppercase tracking-[0.2em] shrink-0 w-16">{step.label}</span>
                        <h3 className="font-serif text-xl text-foreground">{step.title}</h3>
                      </div>
                      {step.text && (
                        <p className="text-muted-foreground text-sm leading-relaxed sm:pl-[5.25rem]">{step.text}</p>
                      )}
                      {step.items && (
                        <ul className="space-y-2 sm:pl-[5.25rem]">
                          {step.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-muted-foreground text-sm leading-relaxed">
                              <span className="mt-1.5 w-1 h-1 shrink-0 rounded-full bg-gold/70" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Values */}
            {values && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">{values.title}</h2>
                <div className="grid sm:grid-cols-3 gap-5">
                  {values.features.map((f, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-7">
                      <h3 className="font-serif text-xl text-foreground mb-3">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Includes */}
            {includes && (
              <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-8 md:p-12">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">{includes.title}</h2>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {includes.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                      <span className="mt-1 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pricing */}
            {pricing && (
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">{pricing.title}</h2>
                <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
                  {pricing.tiers.map((tier, i) => (
                    <div key={i} className="rounded-2xl border border-gold/20 bg-card/40 backdrop-blur-sm p-8 text-center">
                      <div className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-3">{tier.name}</div>
                      <div className="font-serif text-4xl text-foreground mb-2">{tier.price}</div>
                      {tier.note && <div className="text-muted-foreground/70 text-sm">{tier.note}</div>}
                    </div>
                  ))}
                </div>
                {pricing.note && <p className="text-muted-foreground/70 text-sm mt-5">{pricing.note}</p>}
              </div>
            )}

            {/* Testimonials */}
            {testimonials && testimonials.length > 0 && (
              <div>
                <Eyebrow>Kind words</Eyebrow>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {testimonials.map((t, i) => (
                    <figure key={i} className="flex flex-col rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-7">
                      <Quote className="w-6 h-6 text-gold/40 mb-4" strokeWidth={1.5} />
                      <blockquote className="text-muted-foreground leading-relaxed flex-1">{t.quote}</blockquote>
                      <figcaption className="mt-5 text-foreground text-sm font-medium">{t.name}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {faq && faq.length > 0 && (
              <div className="max-w-3xl">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">Frequently asked</h2>
                <div className="divide-y divide-white/10 border-y border-white/10">
                  {faq.map((item, i) => (
                    <details key={i} className="group py-5">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-foreground font-medium">
                        {item.q}
                        <span className="text-gold text-xl leading-none transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="text-muted-foreground leading-relaxed mt-4">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 md:mt-24 rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-10 md:p-14 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Ready to begin?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Every journey starts with a conversation. Reach out and take the first step toward {title.toLowerCase()}.
            </p>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold to-blush text-blush-foreground text-xs tracking-[0.16em] uppercase font-medium shadow-lg shadow-gold/10 hover:brightness-110 transition"
            >
              {ctaLabel}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OfferingDetail;
