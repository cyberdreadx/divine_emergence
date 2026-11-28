import { ArrowUpRight, Leaf } from "lucide-react";
import content from "@/content/partners.json";
import { renderRichText } from "@/lib/richText";

/** Homepage block for Laura's affiliate partner (editable in the CMS). */
const Partner = () => {
  if (!content.url?.trim()) return null;
  return (
    <section id="partners" className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto rounded-3xl border border-gold/20 bg-card/40 backdrop-blur-sm p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold ring-1 ring-gold/25 shrink-0">
          <Leaf className="w-6 h-6" strokeWidth={1.5} />
        </span>
        <div className="flex-1">
          <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-3">{content.eyebrow}</span>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground leading-snug mb-4">{content.heading}</h2>
          <p className="text-muted-foreground leading-relaxed">{renderRichText(content.body.trim())}</p>
          {content.disclosure && <p className="text-xs text-muted-foreground/70 mt-4">{content.disclosure}</p>}
        </div>
        <a
          href={content.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gold/40 text-foreground text-xs tracking-[0.16em] uppercase font-medium hover:border-gold hover:text-gold transition"
        >
          {content.buttonLabel}
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default Partner;
