import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BOOKING_URL } from "@/lib/site";

const VIDEO_URL =
  "https://assets.cdn.filesafe.space/Xf8ncPOdulMSwnurGzU0/media/684c514b107fb00a69b5e521.mp4";

const ClarityCall = () => {
  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 md:pt-32 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.18em] uppercase hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>

          <div className="text-center mb-10">
            <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-4">
              Your Free Clarity Call
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.1]">
              Welcome — Watch This Before We Meet
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
              This short video will help you prepare and get the most out of our
              time together. Give it a watch, then we'll see you on the call.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
            <video
              src={VIDEO_URL}
              controls
              playsInline
              controlsList="nodownload"
              className="w-full aspect-video bg-black"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground text-sm mb-4">
              Need to reschedule or book another time?
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-sans uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90"
            >
              Manage Your Booking
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClarityCall;
