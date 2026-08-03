import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroFloral from "@/assets/hero-floral-blurred.jpeg.asset.json";
import waterfall from "@/assets/waterfall.jpg.asset.json";

const Events = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "active")
        .gte("date", today)
        .order("date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const longDate = (date: string | null, time: string | null) => {
    if (!date) return null;
    const d = new Date(date + "T12:00:00");
    const dateStr = format(d, "EEEE, MMMM d, yyyy");
    if (!time) return dateStr;
    const [h, m] = time.split(":").map(Number);
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h < 12 ? "AM" : "PM";
    return `${dateStr} · ${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const shortDate = (date: string | null) => {
    if (!date) return null;
    return format(new Date(date + "T12:00:00"), "MMM d, yyyy");
  };

  return (
    <div className="on-dark-bg min-h-screen relative">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${waterfall.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/90 pointer-events-none" />
      <div className="fixed inset-0 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        <section className="pt-28 pb-16 px-4 md:px-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-12 md:mb-20">
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-semibold mb-3 md:mb-4">
                The Calendar
              </span>
              <h1 className="font-serif text-4xl md:text-6xl text-foreground italic leading-tight">
                Upcoming Experiences
              </h1>
              <div className="w-10 h-px bg-foreground/30 mt-5 md:mt-8" />
              <p className="mt-5 text-sm md:text-base text-foreground/85 font-light max-w-lg">
                Immersive gatherings designed to deepen your connection to self, community, and nature.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center text-foreground/50 text-sm">Loading events…</div>
            ) : events.length === 0 ? (
              <div className="text-center text-foreground/50 text-sm">
                No upcoming events at this time. Check back soon.
              </div>
            ) : (
              <div className="space-y-10 md:space-y-16">
                {events.map((event, i) => (
                  <article
                    key={event.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch bg-card/70 backdrop-blur-xl rounded-3xl ring-1 ring-white/10 shadow-2xl p-5 md:p-8"
                  >
                    <Link
                      to={`/event/${event.id}`}
                      className={`lg:col-span-5 group block relative overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl ${
                        i % 2 === 1 ? "lg:order-2" : ""
                      }`}
                    >
                      <img
                        src={
                          event.cover_image && event.cover_image.trim()
                            ? event.cover_image
                            : heroFloral.url
                        }
                        alt={event.name}
                        className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <span className="absolute top-5 left-5 bg-black/60 backdrop-blur px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white border border-white/20 rounded-full">
                        {shortDate(event.date)}
                      </span>
                    </Link>

                    <div className={`lg:col-span-7 flex flex-col justify-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                      <h3 className="font-serif text-2xl md:text-4xl text-foreground leading-[1.1] mb-4 md:mb-6 italic">
                        {event.name}
                      </h3>

                      {event.description && (
                        <p className="text-sm md:text-base text-foreground/85 font-light leading-relaxed mb-5 md:mb-8 max-w-md">
                          {event.description}
                        </p>
                      )}

                      <dl className="grid grid-cols-[4.5rem_1fr] md:grid-cols-[5rem_1fr] gap-x-5 md:gap-x-6 gap-y-2.5 md:gap-y-4 mb-6 md:mb-10 text-sm">
                        {event.date && (
                          <>
                            <dt className="text-[10px] uppercase tracking-widest text-foreground/60 pt-1">
                              Date
                            </dt>
                            <dd className="text-foreground font-light">
                              {longDate(event.date, event.time)}
                            </dd>
                          </>
                        )}
                        {((event as any).venue_name || event.location) && (
                          <>
                            <dt className="text-[10px] uppercase tracking-widest text-foreground/60 pt-1">
                              Venue
                            </dt>
                            <dd className="text-foreground font-light leading-relaxed">
                              {(event as any).venue_name && (
                                <div className="text-foreground font-normal">
                                  {(event as any).venue_name}
                                </div>
                              )}
                              {event.location && (
                                <div className="text-foreground/75">
                                  {event.location}
                                </div>
                              )}
                            </dd>
                          </>
                        )}
                        {(event as any).ticket_price != null && (
                          <>
                            <dt className="text-[10px] uppercase tracking-widest text-foreground/60 pt-1">
                              From
                            </dt>
                            <dd className="text-foreground font-medium">
                              ${Number((event as any).ticket_price).toFixed(0)}
                            </dd>
                          </>
                        )}
                      </dl>

                      <Link
                        to={`/event/${event.id}`}
                        className="inline-block self-start bg-blush hover:bg-blush/90 text-blush-foreground px-10 py-4 rounded-full uppercase tracking-[0.25em] text-xs transition-colors"
                      >
                        Reserve Your Place
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Events;
