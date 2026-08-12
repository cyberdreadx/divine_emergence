import { useEffect, useRef, useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { NEWSLETTER_ENDPOINT } from "@/lib/site";

const STORAGE_KEY = "de-newsletter-dismissed";
const SHOW_DELAY_MS = 6000;
// A real person cannot read the popup and type an email in under ~2s; anything
// faster is almost certainly a bot auto-filling the form.
const MIN_FILL_MS = 2000;

/**
 * A one-time email capture popup inviting visitors into the Divine Emergence
 * community. It appears a few seconds after the first visit and never again
 * once the visitor subscribes or dismisses it (tracked in localStorage).
 *
 * Submissions POST to NEWSLETTER_ENDPOINT (set it in src/lib/site.ts). While
 * that is blank the visitor still gets a friendly confirmation, but nothing is
 * saved server-side, so wire up the GoHighLevel endpoint before launch.
 */
const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  // Honeypot: a hidden field real users leave empty and bots tend to fill.
  const [botField, setBotField] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const shownAtRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // localStorage unavailable (private mode) - still show once this session.
    }
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    shownAtRef.current = Date.now();
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const remember = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  const dismiss = () => {
    remember();
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;

    // Bot filters: if the honeypot is filled, or the form was submitted faster
    // than any human could, silently show success without posting so the bot
    // gets no signal and no webhook execution is spent.
    const tooFast = Date.now() - shownAtRef.current < MIN_FILL_MS;
    if (botField || tooFast) {
      setStatus("done");
      remember();
      return;
    }

    setStatus("submitting");
    try {
      if (NEWSLETTER_ENDPOINT) {
        // GoHighLevel's inbound-webhook host does not send CORS headers, so a
        // browser cannot read its response. We post "no-cors" as form-urlencoded
        // (a CORS-safelisted content type) and treat a completed request as
        // success. GHL receives `email` as a form field to map in the workflow.
        await fetch(NEWSLETTER_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams({ email, firstName: firstName.trim() }),
        });
      } else {
        // No endpoint configured yet. Confirm to the visitor anyway.
        console.warn(
          "NewsletterPopup: NEWSLETTER_ENDPOINT is empty in src/lib/site.ts, so this email was not saved."
        );
      }
      setStatus("done");
      remember();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="de-newsletter-title"
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={dismiss}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="de-halo relative w-full max-w-md rounded-[1.75rem] border border-white/15 bg-card/90 backdrop-blur-2xl shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] p-8 md:p-10 text-center overflow-hidden">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/15 text-gold ring-1 ring-gold/25 mb-6">
          <Sparkles className="w-5 h-5" strokeWidth={1.5} />
        </span>

        {status === "done" ? (
          <>
            <h2 id="de-newsletter-title" className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              You're in.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Welcome to the Divine Emergence community. Keep an eye on your inbox for
              events, retreats, and upcoming offers.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold to-blush text-blush-foreground text-xs tracking-[0.16em] uppercase font-medium hover:brightness-110 transition"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-4">
              Join the community
            </span>
            <h2 id="de-newsletter-title" className="font-serif text-2xl md:text-3xl text-foreground mb-3 leading-[1.2]">
              Welcome to the Divine Emergence Community
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-7">
              Stay up to date with all events, retreats, and upcoming offers.
            </p>

            <form onSubmit={submit} className="space-y-3">
              {/* Honeypot: hidden from real users, off the tab order and screen
                  readers. Bots that auto-fill every field will populate it. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
                className="absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
              />
              <input
                ref={inputRef}
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name (optional)"
                aria-label="First name"
                className="w-full rounded-full border border-white/15 bg-background/60 px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Your email address"
                className="w-full rounded-full border border-white/15 bg-background/60 px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold to-blush text-blush-foreground text-xs tracking-[0.16em] uppercase font-medium shadow-lg shadow-gold/10 hover:brightness-110 transition disabled:opacity-60"
              >
                {status === "submitting" ? "Joining..." : "Keep me in the loop"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              {status === "error" && (
                <p className="text-sm text-blush">
                  Something went wrong. Please try again in a moment.
                </p>
              )}
            </form>

            <button
              onClick={dismiss}
              className="mt-5 text-muted-foreground/70 text-xs tracking-wide hover:text-muted-foreground transition-colors"
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterPopup;
