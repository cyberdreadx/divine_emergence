import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getOffering } from "@/lib/offerings";

const OfferingDetail = () => {
  const { slug } = useParams();
  const offering = getOffering(slug);

  if (!offering) {
    return <Navigate to="/" replace />;
  }

  const { title, Icon, eyebrow, headline, intro, body, listTitle, list, image, imageAlt, ctaLabel, ctaHref } = offering;

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

          {/* Body copy */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            <div className="space-y-6">
              {body.map((para, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {list && list.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-8">
                {listTitle && (
                  <h2 className="font-serif text-2xl text-foreground mb-6">{listTitle}</h2>
                )}
                <ul className="space-y-4">
                  {list.map((item, i) => (
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
          </div>

          {/* CTA */}
          <div className="mt-16 md:mt-24 rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-10 md:p-14 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Ready to begin?
            </h2>
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
