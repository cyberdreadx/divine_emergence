import { forwardRef, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND, BOOKING_URL } from "@/lib/site";

/**
 * EBOOK PAGES
 * -----------
 * To use Laura's real ebook, export it from Canva as PNG (one image per page)
 * or as a PDF split into images, drop the files in `public/ebook/`, and list
 * them here in reading order, for example:
 *
 *   const EBOOK_PAGES = [
 *     "/ebook/page-1.png",
 *     "/ebook/page-2.png",
 *     ...
 *   ];
 *
 * While this array is empty, a branded placeholder book is shown so the
 * page-turning animation can be previewed.
 */
const EBOOK_PAGES: string[] = [
  "/ebook/page-1.webp",
  "/ebook/page-2.webp",
  "/ebook/page-3.webp",
  "/ebook/page-4.webp",
  "/ebook/page-5.webp",
  "/ebook/page-6.webp",
  "/ebook/page-7.webp",
  "/ebook/page-8.webp",
  "/ebook/page-9.webp",
];

// react-pageflip ships every setting as a required prop; cast to a permissive
// component so we can pass only the ones we care about.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlipBook = HTMLFlipBook as unknown as any;

// A single leaf of the book. react-pageflip needs each page to forward a ref
// to its root DOM node.
const Page = forwardRef<HTMLDivElement, { children: ReactNode; hard?: boolean }>(
  ({ children, hard }, ref) => (
    <div
      ref={ref}
      data-density={hard ? "hard" : "soft"}
      className="ebook-page bg-[#efe7d8] text-[#2a2038] overflow-hidden"
    >
      {children}
    </div>
  )
);
Page.displayName = "Page";

const ImagePage = forwardRef<HTMLDivElement, { src: string; index: number; hard?: boolean }>(
  ({ src, index, hard }, ref) => (
    <div
      ref={ref}
      data-density={hard ? "hard" : "soft"}
      className="ebook-page bg-[#241a30] overflow-hidden"
    >
      <img
        src={src}
        alt={`Page ${index + 1}`}
        className="w-full h-full object-contain"
        loading={index < 3 ? "eager" : "lazy"}
      />
    </div>
  )
);
ImagePage.displayName = "ImagePage";

const placeholderContent = [
  {
    title: "Welcome",
    body:
      "This is a placeholder preview of the page-turning reader. Export the real ebook from Canva as images, and these pages are replaced automatically.",
  },
  {
    title: "The Breath",
    body:
      "Your breath is the one tool you always carry with you, and it speaks directly to every system in your body.",
  },
  {
    title: "Regulation",
    body:
      "When the nervous system feels safe, the body softens, the mind clears, and you come home to yourself.",
  },
  {
    title: "Begin",
    body:
      "When you are ready, the next step is a single conversation. Take it gently, and take it soon.",
  },
];

// Return an array of page elements (not a Fragment) so react-pageflip registers
// each leaf individually.
const placeholderPages = [
  <Page hard key="cover">
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-8 bg-gradient-to-b from-[#2a1a3e] to-[#3a2450] text-[#f3ead9]">
      <span className="text-gold/90 text-[11px] tracking-[0.3em] uppercase mb-6">
        {BRAND.name}
      </span>
      <h2 className="font-serif text-3xl leading-tight mb-4">Your Free Ebook</h2>
      <p className="text-sm text-[#f3ead9]/70 max-w-[24ch]">
        A gentle guide to regulating your nervous system and returning to yourself.
      </p>
      <span className="mt-10 text-[#f3ead9]/50 text-[10px] tracking-[0.25em] uppercase">
        Tap or drag a corner to begin
      </span>
    </div>
  </Page>,
  ...placeholderContent.map((p, i) => (
    <Page key={`content-${i}`}>
      <div className="w-full h-full flex flex-col justify-center px-9 py-10">
        <span className="text-[#8a6d2f] text-[10px] tracking-[0.3em] uppercase mb-4">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="font-serif text-2xl mb-4">{p.title}</h3>
        <p className="text-sm leading-relaxed text-[#2a2038]/75">{p.body}</p>
      </div>
    </Page>
  )),
  <Page hard key="back">
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-8 bg-gradient-to-b from-[#3a2450] to-[#2a1a3e] text-[#f3ead9]">
      <h3 className="font-serif text-2xl mb-4">Ready to begin?</h3>
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-blush text-blush-foreground text-[11px] tracking-[0.16em] uppercase"
      >
        Book a free clarity call
      </a>
    </div>
  </Page>,
];

const Ebook = () => {
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } }>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const hasRealPages = EBOOK_PAGES.length > 0;

  const flip = (dir: "next" | "prev") => {
    const api = bookRef.current?.pageFlip();
    if (!api) return;
    dir === "next" ? api.flipNext() : api.flipPrev();
  };

  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 md:pt-32 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.18em] uppercase hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>

          <div className="text-center mb-10">
            <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-4">
              Free Ebook
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.1]">
              Bufo Alvarius
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Dive into 5-MeO, processing, and integration. Turn the pages just like a real
              book, drag a corner, swipe, or use the arrows.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="ebook-stage w-full flex justify-center">
              <FlipBook
                ref={bookRef}
                width={464}
                height={600}
                size="stretch"
                minWidth={300}
                maxWidth={520}
                minHeight={388}
                maxHeight={673}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                drawShadow={true}
                flippingTime={800}
                usePortrait={true}
                className="ebook-flip"
                onFlip={(e: { data: number }) => setPage(e.data)}
                onInit={(e: { object: { getPageCount: () => number } }) =>
                  setTotal(e.object.getPageCount())
                }
              >
                {hasRealPages
                  ? EBOOK_PAGES.map((src, i) => (
                      <ImagePage
                        key={i}
                        src={src}
                        index={i}
                        hard={i === 0 || i === EBOOK_PAGES.length - 1}
                      />
                    ))
                  : placeholderPages}
              </FlipBook>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={() => flip("prev")}
                aria-label="Previous page"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-foreground hover:border-gold/50 hover:text-gold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-muted-foreground text-xs tracking-[0.18em] uppercase tabular-nums">
                {total > 0 ? `${Math.min(page + 1, total)} / ${total}` : ""}
              </span>
              <button
                onClick={() => flip("next")}
                aria-label="Next page"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-foreground hover:border-gold/50 hover:text-gold transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {!hasRealPages && (
              <p className="mt-8 text-center text-muted-foreground/60 text-xs max-w-md leading-relaxed">
                Preview mode: export the ebook from Canva as images and drop them into
                the reader to replace these placeholder pages.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Ebook;
