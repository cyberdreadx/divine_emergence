import { useEffect } from "react";
import { ArrowUpRight, Mic } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { embedUrl, longDate, podcasts } from "@/lib/media";

/** /podcasts: shows Laura has been a guest on, newest first. */
const Podcasts = () => {
  useEffect(() => {
    document.title = "Podcasts | Divine Emergence";
  }, []);

  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="inline-flex items-center gap-3 text-gold font-sans text-xs uppercase tracking-[0.3em] mb-6">
              <Mic className="w-4 h-4" strokeWidth={1.5} />
              As heard on
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.05] mb-6">
              Podcasts <span className="italic">&amp; conversations</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Conversations about breathwork, ancestral medicine, healing, and integration.
            </p>
          </div>

          {podcasts.length ? (
            <div className="space-y-6">
              {podcasts.map((p) => {
                const player = embedUrl(p.link);
                return (
                  <section key={p.id} className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {p.image && <img src={p.image} alt="" className="w-28 h-28 rounded-2xl object-cover ring-1 ring-white/10 shrink-0" loading="lazy" />}
                      <div className="flex-1 min-w-0">
                        <span className="text-gold text-xs uppercase tracking-[0.25em]">{p.show}</span>
                        <h2 className="font-serif text-2xl md:text-3xl text-foreground leading-snug mt-2 mb-2">{p.title}</h2>
                        {p.date && <p className="text-sm text-muted-foreground mb-3">{longDate(p.date)}</p>}
                        {p.description && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{p.description.trim()}</p>}
                      </div>
                    </div>
                    {player && (
                      <iframe
                        title={`${p.show}: ${p.title}`}
                        src={player}
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                        className={`mt-6 w-full rounded-2xl border-0 ${player.includes("youtube") ? "aspect-video" : "h-[175px]"}`}
                      />
                    )}
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold/40 text-foreground text-xs tracking-[0.16em] uppercase hover:border-gold hover:text-gold transition"
                    >
                      Listen to the episode
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-card/40 p-10 md:p-14 text-center">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">Episodes coming soon</h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">Check back for conversations Laura has shared on other shows.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Podcasts;
