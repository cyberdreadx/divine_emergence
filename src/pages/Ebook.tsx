import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EbookReader from "@/components/EbookReader";

const Ebook = () => {
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

          <EbookReader />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Ebook;
