import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, MapPin, Clock, CalendarHeart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BOOKING_URL } from "@/lib/site";
import { getUpcomingEvents, formatEventDate, DEFAULT_EVENT_CTA } from "@/lib/events";

const EventsPage = () => {
  const upcoming = getUpcomingEvents();

  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.18em] uppercase hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>

          {/* Header */}
          <div className="max-w-2xl mb-14">
            <span className="inline-flex items-center gap-3 text-gold font-sans text-xs uppercase tracking-[0.3em] mb-6">
              <CalendarHeart className="w-4 h-4" strokeWidth={1.5} />
              In Person, South Florida
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.05] mb-6">
              Upcoming workshops <span className="italic">&amp; events</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Breathwork circles, sound journeys, and community gatherings. Come breathe
              in person, regulate your nervous system, and find your people.
            </p>
          </div>

          {upcoming.length > 0 ? (
            <div className="space-y-5">
              {upcoming.map((e) => {
                const d = formatEventDate(e.date);
                const href = e.ctaHref ?? DEFAULT_EVENT_CTA;
                return (
                  <div
                    key={e.slug}
                    className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8"
                  >
                    {/* Date badge */}
                    <div className="shrink-0 flex md:flex-col items-center md:justify-center gap-3 md:gap-0 md:w-24 md:text-center">
                      <div className="rounded-2xl bg-gold/10 ring-1 ring-gold/20 text-gold px-4 py-3 md:w-full">
                        <div className="text-xs uppercase tracking-[0.2em] leading-none">{d.monthShort}</div>
                        <div className="font-serif text-3xl leading-tight mt-1">{d.day}</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">{e.title}</h2>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground text-sm mb-4">
                        <span className="inline-flex items-center gap-2">
                          <CalendarHeart className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
                          {d.full}
                        </span>
                        {e.time && (
                          <span className="inline-flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
                            {e.time}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
                          {e.location}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6">{e.description}</p>

                      {e.soldOut ? (
                        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/15 text-muted-foreground text-xs tracking-[0.16em] uppercase">
                          Sold out
                        </span>
                      ) : (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold to-blush text-blush-foreground text-xs tracking-[0.16em] uppercase font-medium shadow-lg shadow-gold/10 hover:brightness-110 transition"
                        >
                          {e.ctaLabel ?? "Reserve your spot"}
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-10 md:p-14 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold ring-1 ring-gold/20 mb-6">
                <CalendarHeart className="w-6 h-6" strokeWidth={1.5} />
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
                Nothing on the calendar right now
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                New workshops and events are announced first to the Divine Emergence
                community. Join the list, or reach out to ask what is coming up next.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold to-blush text-blush-foreground text-xs tracking-[0.16em] uppercase font-medium shadow-lg shadow-gold/10 hover:brightness-110 transition"
              >
                Ask about upcoming events
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventsPage;
