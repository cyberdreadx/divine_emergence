import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { NEWSLETTER_ENDPOINT } from "@/lib/site";

// A real person cannot read the form and type an email in under ~2s; anything
// faster is almost certainly a bot auto-filling the fields.
const MIN_FILL_MS = 2000;

/**
 * An inline email-capture form for the Divine Emergence community, sharing the
 * same GoHighLevel backend and bot protections as the NewsletterPopup. Drop it
 * into any page that should invite visitors onto the events list.
 *
 * Submissions POST to NEWSLETTER_ENDPOINT (set it in src/lib/site.ts). While
 * that is blank the visitor still gets a friendly confirmation, but nothing is
 * saved server-side, so wire up the GoHighLevel endpoint before launch.
 */
const EmailSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  // Honeypot: a hidden field real users leave empty and bots tend to fill.
  const [botField, setBotField] = useState("");
  const mountedAtRef = useRef(Date.now());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;

    // Bot filters: if the honeypot is filled, or the form was submitted faster
    // than any human could, silently show success without posting so the bot
    // gets no signal and no webhook execution is spent.
    const tooFast = Date.now() - mountedAtRef.current < MIN_FILL_MS;
    if (botField || tooFast) {
      setStatus("done");
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
        console.warn(
          "EmailSignup: NEWSLETTER_ENDPOINT is empty in src/lib/site.ts, so this email was not saved."
        );
      }
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-8 md:p-12">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-4">
          Stay connected
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
          Be the first to know
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Join my email list to hear first about upcoming events, new offerings,
          retreats, and community experiences.
        </p>

        {status === "done" ? (
          <p className="text-foreground font-serif text-xl italic">
            You're in. Keep an eye on your inbox for what's coming next.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-3 text-left">
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
              <p className="text-sm text-blush text-center">
                Something went wrong. Please try again in a moment.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailSignup;
