import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarHeart, Clock, MapPin, Ticket, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { EVENT_REGISTRATION_ENDPOINT } from "@/lib/site";
import { checkoutUrl, eventDateLabel, getEvent, isPast } from "@/lib/events";

const inputClass =
  "w-full rounded-xl border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/60 transition-colors";
const border = (bad: boolean) => (bad ? "border-red-400" : "border-white/15");

/** One event's details and sign-up form, at /events/<id>. */
const EventSignup = () => {
  const { id } = useParams();
  const event = getEvent(id);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "redirecting">("idle");
  const [botField, setBotField] = useState("");

  useEffect(() => {
    if (event) document.title = `${event.title} | Divine Emergence`;
  }, [event]);

  if (!event) return <NotFound />;

  const past = isPast(event);
  const paid = !!event.paymentLink?.trim();
  const closed = past || !!event.soldOut;

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    const found: Record<string, string> = {};
    if (!form.firstName.trim()) found.firstName = "Please enter your first name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) found.email = "Please enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 7) found.phone = "Please enter a phone number we can reach you at.";
    setErrors(found);
    if (Object.keys(found).length) return;
    if (botField) {
      setStatus("done");
      return;
    }

    setStatus("submitting");
    if (EVENT_REGISTRATION_ENDPOINT) {
      try {
        // GoHighLevel's webhook sends no CORS headers; a completed request
        // counts as delivered. Each field maps to the contact in the workflow.
        await fetch(EVENT_REGISTRATION_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            eventTitle: event.title,
            eventId: event.id,
            eventType: event.eventType ?? "",
            eventDate: eventDateLabel(event),
            eventTime: event.time ?? "",
            eventLocation: event.location,
            eventCost: event.cost ?? "",
            paid: paid ? "Sent to payment" : "Free sign-up",
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch (err) {
        // Don't block payment if the sign-up record fails to send.
        console.warn("Event sign-up was not sent to GoHighLevel", err);
      }
    } else {
      console.warn("EventSignup: EVENT_REGISTRATION_ENDPOINT is empty in src/lib/site.ts, so this sign-up was not saved.");
    }

    if (paid) {
      setStatus("redirecting");
      window.location.href = checkoutUrl(event.paymentLink!, form.email.trim());
    } else {
      setStatus("done");
    }
  };

  const field = (key: keyof typeof form, label: string, type: string, auto: string, required: boolean) => (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-1">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      <input type={type} autoComplete={auto} value={form[key]} onChange={set(key)} className={`${inputClass} ${border(!!errors[key])}`} />
      {errors[key] && <span className="mt-2 block text-sm text-red-300">{errors[key]}</span>}
    </label>
  );

  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 md:pt-36 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.18em] uppercase hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All events
          </Link>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <section>
              {event.eventType && (
                <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-4">{event.eventType}</span>
              )}
              <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.08] mb-6">{event.title}</h1>
              <ul className="space-y-3 text-muted-foreground mb-8">
                <li className="flex items-start gap-3">
                  <CalendarHeart className="w-5 h-5 text-gold/80 mt-0.5 shrink-0" strokeWidth={1.5} />
                  {eventDateLabel(event)}
                </li>
                {event.time && (
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold/80 mt-0.5 shrink-0" strokeWidth={1.5} />
                    {event.time}
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold/80 mt-0.5 shrink-0" strokeWidth={1.5} />
                  {event.location}
                </li>
                {event.cost && (
                  <li className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-gold/80 mt-0.5 shrink-0" strokeWidth={1.5} />
                    {event.cost}
                  </li>
                )}
              </ul>
              {event.image && (
                <img src={event.image} alt={event.title} className="w-full aspect-[4/3] object-cover rounded-3xl ring-1 ring-white/10 mb-8" />
              )}
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description.trim()}</p>
            </section>

            <section className="md:sticky md:top-28 self-start rounded-3xl border border-gold/25 bg-card p-6 md:p-8">
              {status === "done" ? (
                <div className="text-center py-6">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/15 text-gold ring-1 ring-gold/25 mb-5">
                    <Check className="w-5 h-5" />
                  </span>
                  <h2 className="font-serif text-2xl text-foreground mb-3">You're signed up, {form.firstName.trim()}.</h2>
                  <p className="text-muted-foreground leading-relaxed">We'll be in touch with everything you need before the event.</p>
                </div>
              ) : closed ? (
                <div className="text-center py-6">
                  <h2 className="font-serif text-2xl text-foreground mb-3">{past ? "This event has passed" : "Sold out"}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {past ? "Take a look at what's coming up next." : "This one is full. Take a look at other upcoming events."}
                  </p>
                  <Link to="/events" className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-[0.16em]">
                    See upcoming events <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-5">
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" value={botField} onChange={(e) => setBotField(e.target.value)} className="hidden" aria-hidden="true" />
                  <div>
                    <h2 className="font-serif text-2xl text-foreground">Reserve your spot</h2>
                    {event.cost && <p className="text-gold mt-1">{event.cost}</p>}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {field("firstName", "First name", "text", "given-name", true)}
                    {field("lastName", "Last name", "text", "family-name", false)}
                  </div>
                  {field("email", "Email", "email", "email", true)}
                  {field("phone", "Phone", "tel", "tel", true)}
                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-blush px-7 py-4 text-xs tracking-[0.16em] uppercase font-medium text-blush-foreground shadow-lg shadow-gold/10 hover:brightness-110 transition disabled:opacity-60"
                  >
                    {status === "idle" ? (paid ? "Continue to payment" : "Sign up") : status === "redirecting" ? "Opening secure checkout..." : "Saving..."}
                    {status === "idle" && <ArrowRight className="w-4 h-4" />}
                  </button>
                  {paid && <p className="text-xs text-muted-foreground text-center">You'll finish paying on a secure checkout page.</p>}
                </form>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventSignup;
