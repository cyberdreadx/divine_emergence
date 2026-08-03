import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  ArrowLeft, Calendar, Clock, MapPin, Users, Sparkles, Play, Music,
  Heart, MessageCircle, Coffee, Mic, Loader2, ExternalLink, Crown,
  ShieldCheck, CalendarPlus, Plus, Minus, Sun,
} from "lucide-react";
import { downloadICS } from "@/lib/calendar";
import heroFloralAsset from "@/assets/hero-floral-blurred.jpeg.asset.json";
const heroFloral = heroFloralAsset.url;
import cacaoScrubAsset from "@/assets/red-light-therapy.jpg.asset.json";
import cacaoShoulderAsset from "@/assets/cacao-scrub-shoulder.png.asset.json";
import alejandraAsset from "@/assets/host-alejandra.png.asset.json";
import carlaAsset from "@/assets/host-carla.jpg.asset.json";
import dearBodyAsset from "@/assets/dear-body.jpg.asset.json";
import finalCtaBloomAsset from "@/assets/final-cta-bloom.jpg.asset.json";
import breatheBloomLogoAsset from "@/assets/breathe-bloom-logo.png.asset.json";
import partnerSilaAsset from "@/assets/partner-sila.png.asset.json";
import partner2Asset from "@/assets/partner-2.png.asset.json";

const SEGMENT_ICONS: Record<string, typeof Play> = {
  welcome: Sparkles, breathwork: Play, sound: Music, integration: Heart,
  closing: MessageCircle, mingle: Coffee, partner: Mic, custom: Clock,
};

const STRIPE_PAYMENT_URL = "https://buy.stripe.com/14A5kC7lFgkPgEw8dg1VK01";

// Luxury wellness palette
const C = {
  cream: "#faf5ee",
  card: "#fdfaf4",
  blush: "#f5e6e0",
  blushDeep: "#ecd4cc",
  rose: "#c87a6f",      // primary CTA - dusty rose
  roseHover: "#b66a5f",
  champagne: "#e8d5b8",
  butter: "#f0dca0",
  sage: "#b8c4a8",
  taupe: "#8a7a6c",
  ink: "#3a2e26",       // body text deep brown
  inkSoft: "#5a4a3e",
  hairline: "#e8ddd0",
};

const EventDetail = () => {
  const { id } = useParams();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSegment, setActiveSegment] = useState<number>(0);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) setActiveSegment(idx);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    segmentRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);





  const { data: event, isLoading } = useQuery({
    queryKey: ["public-event", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id!).eq("status", "active").maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: segments = [] } = useQuery({
    queryKey: ["public-segments", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_flow_segments").select("*").eq("event_id", id!).order("segment_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: guestCount = 0 } = useQuery({
    queryKey: ["public-guest-count", id],
    queryFn: async () => {
      const { count, error } = await supabase.from("guests").select("*", { count: "exact", head: true }).eq("event_id", id!).in("status", ["confirmed", "checked_in"]);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!id,
  });

  const { data: sponsorsEnabled = true } = useQuery({
    queryKey: ["public-sponsors-enabled", id],
    queryFn: async () => {
      const { data } = await supabase.from("event_settings").select("setting_value").eq("event_id", id!).eq("setting_key", "sponsors_enabled").maybeSingle();
      return (data?.setting_value as boolean) !== false;
    },
    enabled: !!id,
  });

  const { data: sponsors = [] } = useQuery({
    queryKey: ["public-sponsors", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_sponsors").select("*").eq("event_id", id!).order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id && sponsorsEnabled,
  });

  const { data: ticketTiers = [] } = useQuery({
    queryKey: ["public-ticket-tiers", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("ticket_tiers").select("*").eq("event_id", id!).in("status", ["active", "sold_out"]).order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: waiverSettings } = useQuery({
    queryKey: ["public-waiver", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_settings").select("setting_key, setting_value").eq("event_id", id!).in("setting_key", ["waiver_enabled", "waiver_type", "waiver_content", "waiver_required"]);
      if (error) throw error;
      const map: Record<string, any> = {};
      data?.forEach((row) => { map[row.setting_key] = row.setting_value; });
      return map;
    },
    enabled: !!id,
  });

  const waiverEnabled = waiverSettings?.waiver_enabled === true;
  const waiverRequired = waiverSettings?.waiver_required === true;
  const waiverType = waiverSettings?.waiver_type;
  const waiverContent = typeof waiverSettings?.waiver_content === "string" ? waiverSettings.waiver_content : "";

  // Pre-paint: mark sections (except hero) as hidden so the fade starts from opacity 0
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section")).slice(1);
    sections.forEach((el) => {
      if (!el.classList.contains("is-visible")) el.classList.add("lux-reveal");
    });
  }, [event, segments.length, sponsors.length, ticketTiers.length]);

  // Luxurious scroll reveal: stagger direct children of each section (skip the hero)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!event) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section")).slice(1);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [event, segments.length, sponsors.length, ticketTiers.length]);



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.cream }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.taupe }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: C.cream }}>
        <div className="text-center">
          <p className="text-lg" style={{ color: C.inkSoft }}>Event not found or not active</p>
          <Link to="/" className="text-sm mt-4 inline-block hover:opacity-80" style={{ color: C.rose }}>Back to home</Link>
        </div>
      </div>
    );
  }

  const totalMinutes = segments.reduce((sum, s: any) => sum + (s.duration_minutes || 0), 0);
  const spotsLeft = Math.max((event.max_guests || 100) - guestCount, 0);
  const highlights: { label: string; value: string }[] = Array.isArray((event as any).highlights) ? (event as any).highlights : [];
  const coverImage = (event as any).cover_image || heroFloral;

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${m} ${hour < 12 ? "AM" : "PM"}`;
  };

  const getSegmentTime = (segIndex: number) => {
    if (!(event as any).time) return null;
    const [startH, startM] = (event as any).time.split(":").map(Number);
    let totalMins = startH * 60 + startM;
    for (let i = 0; i < segIndex; i++) totalMins += (segments[i] as any).duration_minutes || 0;
    const h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    return formatTime12(`${h}:${String(m).padStart(2, "0")}`);
  };

  const dateObj = event.date ? new Date(event.date + "T00:00:00") : null;
  const dateLong = dateObj?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const dateShort = dateObj?.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  const faqs = [
    { q: "What should I bring?", a: "Just yourself, comfortable clothing, and an open heart. We provide everything else: mats, blankets, eye pillows, refreshments, and all journey materials." },
    { q: "What is the cancellation policy?", a: "Tickets are non-refundable but are transferable to another woman if you're unable to attend. Please reach out at least 48 hours before the event to arrange a transfer." },
    { q: "Is this beginner friendly?", a: "Absolutely. Our experiences are held with care for all levels, first-timers and seasoned practitioners alike. Facilitators guide you gently throughout." },
    { q: "Are food and drinks provided?", a: "Yes. Welcome drinks, light bites, and a closing tea are included. Please share any dietary preferences when you RSVP." },
    { q: "Can I come with a friend?", a: "Of course. Many guests come solo and leave with new connections, but you're welcome to invite someone special. Each guest needs their own ticket." },
  ];

  // -- decorative inline botanical marker (small sage flower)
  const Bloom = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="2" fill={C.butter} />
      <g stroke={C.sage} strokeWidth="1.2" strokeLinecap="round">
        <path d="M12 4 L12 8" /><path d="M12 16 L12 20" />
        <path d="M4 12 L8 12" /><path d="M16 12 L20 12" />
        <path d="M6.5 6.5 L9 9" /><path d="M15 15 L17.5 17.5" />
        <path d="M17.5 6.5 L15 9" /><path d="M9 15 L6.5 17.5" />
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream, color: C.ink, fontFamily: "'Inter', sans-serif" }}>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[88vh] flex flex-col">
        <img
          src={coverImage}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Soft cream wash + bottom fade */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${C.cream}cc 0%, ${C.blush}33 35%, ${C.cream}f5 100%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 80% 20%, ${C.butter}30, transparent 50%)` }} />

        {/* Nav */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 backdrop-blur-md border-b"
          style={{ backgroundColor: `${C.cream}d9`, borderColor: `${C.ink}10` }}
        >
          <Link to="/" className="font-serif text-lg tracking-wide uppercase" style={{ color: C.ink }}>
            Breathe&Bloom
          </Link>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] uppercase" style={{ color: C.inkSoft }}>
            <a href="#experience" className="hover:opacity-70">Experience</a>
            <a href="#hosts" className="hover:opacity-70">Hosts</a>
            <a href="#pricing" className="hover:opacity-70">Pricing</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
          </div>
          <a
            href={STRIPE_PAYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.18em] uppercase px-5 py-2.5 rounded-full text-white transition-colors"
            style={{ backgroundColor: C.rose }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.roseHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.rose)}
          >
            Reserve
          </a>
        </nav>
        <div className="h-20" />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center px-6 sm:px-10 lg:px-20 pb-20 pt-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6 font-bold">
              <Bloom className="w-4 h-4" />
              <p className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: C.taupe }}>
                A Curated Wellness Experience
              </p>
            </div>

            <h1 className="font-serif font-light leading-[0.95] tracking-tight mb-8" style={{ color: C.ink, fontSize: "clamp(3rem, 8vw, 6rem)" }}>
              <span>{event.name.split(" ").slice(0, -2).join(" ")}</span>
              <span> </span>
              <span style={{ color: C.rose }}>{event.name.split(" ").slice(-2, -1)[0]}</span>
              <br />
              <em className="italic font-light" style={{ color: C.rose }}>
                {event.name.split(" ").slice(-1)[0]}
              </em>
            </h1>

            {event.description && (
              <p className="text-base sm:text-lg leading-relaxed max-w-xl mb-10" style={{ color: C.inkSoft }}>
                {event.description}
              </p>
            )}

            {/* Detail pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {dateObj && (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm" style={{ backgroundColor: `${C.card}b3`, border: `1px solid ${C.hairline}` }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: C.rose }} />
                  <span className="text-xs tracking-wide" style={{ color: C.ink }}>
                    {dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              )}
              {(event as any).time && (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm" style={{ backgroundColor: `${C.card}b3`, border: `1px solid ${C.hairline}` }}>
                  <Clock className="w-3.5 h-3.5" style={{ color: C.rose }} />
                  <span className="text-xs tracking-wide" style={{ color: C.ink }}>{formatTime12((event as any).time)}</span>
                </div>
              )}
              {(event.location || (event as any).venue_name) && (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm" style={{ backgroundColor: `${C.card}b3`, border: `1px solid ${C.hairline}` }}>
                  <MapPin className="w-3.5 h-3.5" style={{ color: C.rose }} />
                  <span className="text-xs tracking-wide" style={{ color: C.ink }}>
                    {[(event as any).venue_name, event.location].filter(Boolean).join(" · ")}
                  </span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={STRIPE_PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-sm tracking-wide transition-all shadow-lg"
                style={{ backgroundColor: C.rose, boxShadow: `0 20px 40px -15px ${C.rose}66` }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.roseHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.rose)}
              >
                Reserve Your Seat
              </a>
              {dateObj && (
                <button
                  onClick={() => downloadICS({
                    name: event.name, date: event.date!,
                    time: (event as any).time, endTime: (event as any).end_time,
                    location: event.location, description: event.description,
                  })}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm tracking-wide transition-colors"
                  style={{ color: C.ink, border: `1px solid ${C.taupe}66`, backgroundColor: `${C.card}99` }}
                >
                  <CalendarPlus className="w-4 h-4" /> Save the Date
                </button>
              )}
            </div>

            {/* tiny meta row */}
            <div className="mt-10 flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase" style={{ color: C.taupe }}>
              <span>Intimate Setting</span>
              <span style={{ color: C.hairline }}>·</span>
              <span>All Levels Welcome</span>
              {spotsLeft > 0 && spotsLeft <= 20 && (
                <>
                  <span style={{ color: C.hairline }}>·</span>
                  <span style={{ color: C.rose }}>{spotsLeft} Spots Remaining</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ INTRO / ELEVATED ESCAPE ============ */}
      <section id="experience" className="px-6 sm:px-10 lg:px-20 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-8" style={{ backgroundColor: C.rose }} />
              <p className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: C.taupe }}>The Vision</p>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mb-6" style={{ color: C.ink }}>
              An elevated wellness escape with{" "}
              <em className="italic" style={{ color: C.rose }}>tulum style + biohacking</em> energy.
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: C.inkSoft }}>
              A guided morning of somatic practices, movement, and recovery. In a private outdoor palapa at SILA Miami, you'll move through an opening circle with nourishing drinks, yoga, somatic breath work, soul gazing with yourself, contrast therapy, and sound bath experience.
            </p>
            <p className="text-base leading-relaxed mb-4 whitespace-pre-line" style={{ color: C.inkSoft }}>
              The session is structured to create a space of gentleness to release limiting beliefs within the mind and body, building resilience and help you manage stress under pressure. {"\n\n"}Every practice is chosen to both challenge and soften the nervous system , sharpen focus, and leave you feeling steadier, lighter, and more grounded.
            </p>
            <p className="text-base leading-relaxed mb-10" style={{ color: C.inkSoft }}>
              Your reservation includes access to the red light therapy room, sauna, and cold plunge: recovery tools that support circulation, muscle recovery, and stress reduction. Alongside, curated sponsored  gifts for you to pamper yourself with at home.
            </p>

            {/* stat row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 pt-8 gap-y-6" style={{ borderTop: `1px solid ${C.hairline}` }}>
              {[
                { value: "4.5", suffix: "hrs", label: "Experience" },
                { value: "10", label: "Guests" },
                { value: "Women", label: "Only" },
                { value: "$150", label: "Investment" },

              ].map((s, i) => (
                <div
                  key={i}
                  className="px-5 py-2 text-center min-w-0"
                  style={{
                    borderLeft: i % 2 === 0 ? "none" : `1px solid ${C.hairline}`,
                  }}
                >
                  <p
                    className="font-serif font-light mb-2 leading-none flex items-baseline justify-center gap-1 whitespace-nowrap"
                    style={{ color: C.rose, fontSize: "clamp(1.55rem, 2.2vw, 1.9rem)" }}
                  >
                    <span>{s.value}</span>
                    {s.suffix && <span className="font-sans text-[0.42em] uppercase tracking-[0.16em]" style={{ color: C.taupe }}>{s.suffix}</span>}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.16em] uppercase leading-relaxed whitespace-nowrap"
                    style={{ color: C.taupe }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>


          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem]" style={{ background: `linear-gradient(135deg, ${C.blush} 0%, ${C.champagne} 100%)`, opacity: 0.5 }} />
            <img
              src={cacaoScrubAsset.url}
              alt="Curated wellness detail"
              loading="lazy"
              className="relative rounded-[1.5rem] w-full aspect-[4/5] object-cover shadow-2xl"
            />
            {/* floating quote card */}
            <div className="absolute -bottom-6 -left-6 sm:-left-10 max-w-[260px] p-5 rounded-2xl shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.hairline}` }}>
              <p className="text-[9px] tracking-[0.3em] uppercase mb-2" style={{ color: C.rose }}>Felt by Past Guests</p>
              <p className="font-serif italic text-sm leading-snug" style={{ color: C.ink }}>
                "I forgot the city existed. I'll be back for every single one."
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ============ WHAT'S INCLUDED ============ */}
      <section id="included" className="px-6 sm:px-10 lg:px-20 py-16" style={{ backgroundColor: C.cream }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-5 rounded-[2rem]" style={{ background: `linear-gradient(135deg, ${C.champagne} 0%, ${C.blush} 100%)`, opacity: 0.55 }} />
            <img
              src={cacaoShoulderAsset.url}
              alt="Cacao body scrub ritual"
              loading="lazy"
              className="relative rounded-[1.5rem] w-full aspect-[4/5] object-cover shadow-xl"
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-7">
            <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: C.taupe }}>What's Included</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mb-4" style={{ color: C.ink }}>
              Everything you want <em className="italic" style={{ color: C.rose }}>to bloom.</em>
            </h2>
            <div className="h-px w-16 mb-10" style={{ backgroundColor: C.rose, opacity: 0.4 }} />

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
              {[
                { icon: Sparkles, title: "Reset Kit", body: "Sponsored gift bag with probiotic drinks, electrolyte packs, skin care, and more." },
                { icon: Sun, title: "Red Light Therapy", body: "Private and group red light therapy sessions throughout the experience." },
                { icon: Heart, title: "Sauna & Cold Plunge", body: "Full access to SILA Miami's contrast therapy suite to support recovery and circulation." },
                { icon: Music, title: "Guided Practices", body: "Breathwork, journaling, yoga, a cacao body scrub, and a sound bath experience." },
                { icon: Coffee, title: "Welcome Drinks", body: "Functional welcome drinks to hydrate and start the morning." },
                { icon: Crown, title: "SILA Access", body: "SILA Miami remains available to you after the retreat, plus 15% off at Devia Juice Bar." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" style={{ color: C.rose }} strokeWidth={1.5} />
                      <h3 className="font-serif text-xl" style={{ color: C.ink }}>{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: C.inkSoft }}>{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOSTS ============ */}

      <section id="hosts" className="px-6 sm:px-10 lg:px-20 py-16" style={{ backgroundColor: C.champagne + "40" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: C.taupe }}>Your Hosts</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] max-w-3xl mx-auto" style={{ color: C.ink }}>
              Hosted by women who blend emotional depth with{" "}
              <em className="italic" style={{ color: C.rose }}>elevated care.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Alejandra Arias",
                role: "Host & Breathwork Guide",
                photo: alejandraAsset.url,
                bio: "Alejandra leads breathwork and somatic sessions with a trauma-informed approach. Her focus is practical: using breath and movement to help women manage stress and feel more at ease in their bodies.",
              },
              {
                name: "Carla Masquida",
                role: "Host & Vinyasa Yoga Teacher",
                photo: carlaAsset.url,
                bio: "Carla teaches vinyasa yoga focused on strength, mobility, and breath. Her classes are approachable and grounded, helping women build physical resilience and move with confidence.",
              },
            ].map((h, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl"
                style={{ backgroundColor: C.card, border: `1px solid ${C.hairline}` }}
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <img
                    src={h.photo}
                    alt={`Portrait of ${h.name}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(20%)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(180deg, transparent 55%, ${C.ink}66 100%)` }}
                  />
                </div>
                <div className="p-7">
                  <h3 className="font-serif text-2xl" style={{ color: C.ink }}>{h.name}</h3>
                  <p className="text-[10px] tracking-[0.25em] uppercase mb-4 mt-1" style={{ color: C.rose }}>{h.role}</p>
                  <p className="text-sm leading-relaxed" style={{ color: C.inkSoft }}>{h.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING + DETAILS ============ */}
      <section id="pricing" className="px-6 sm:px-10 lg:px-20 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-8" style={{ backgroundColor: C.taupe, opacity: 0.4 }} />
              <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: C.taupe }}>Reserve Your Seat</p>
              <span className="h-px w-8" style={{ backgroundColor: C.taupe, opacity: 0.4 }} />
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight" style={{ color: C.ink }}>
              Choose your <em className="italic font-normal" style={{ color: C.rose }}>arrival.</em>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* UNIFIED CARD - price + included with care */}
            <div
              className="rounded-3xl p-8 sm:p-10 lg:p-12 flex flex-col"
              style={{
                background: `linear-gradient(165deg, ${C.blush}55, ${C.champagne}40)`,
                border: `1px solid ${C.hairline}`,
              }}
            >
              {(() => {
                const tier = ticketTiers[0];
                const price = tier ? tier.price : (event as any).ticket_price;
                const tierName = tier?.name || "Admission";
                const tierDesc = tier?.description;
                const isSoldOut = tier && (tier.status === "sold_out" || (tier.capacity && tier.sold_count >= tier.capacity));
                const spotsRemaining = tier?.capacity ? Math.max(tier.capacity - tier.sold_count, 0) : null;

                return (
                  <>
                    <div className="pb-7 mb-7" style={{ borderBottom: `1px solid ${C.hairline}` }}>
                      <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-3" style={{ color: C.rose }}>
                        Investment
                      </p>
                      <div className="flex items-baseline justify-between gap-6 mb-3">
                        <h3 className="font-serif text-2xl sm:text-3xl" style={{ color: C.ink }}>
                          {tierName}
                        </h3>
                        <p className="font-serif text-4xl sm:text-5xl tracking-tight" style={{ color: C.rose }}>
                          {price > 0 ? `$${Number(price).toFixed(0)}` : "Free"}
                        </p>
                      </div>
                      {tierDesc && (
                        <p className="text-sm leading-relaxed mb-2" style={{ color: C.inkSoft }}>
                          {tierDesc}
                        </p>
                      )}
                      {spotsRemaining !== null && !isSoldOut && spotsRemaining <= 10 && (
                        <p className="text-[10px] tracking-[0.3em] uppercase mt-3" style={{ color: C.rose }}>
                          Only {spotsRemaining} remaining
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: C.taupe }}>
                        Included With Care
                      </p>
                      <h4 className="font-serif text-xl sm:text-2xl leading-tight mb-4" style={{ color: C.ink }}>
                        Everything prepared for your <em className="italic" style={{ color: C.rose }}>deep reset.</em>
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "4.5-hour guided wellness session",
                          "Functional welcome drinks",
                          "Vinyasa Yoga",
                          "Somatic Breathwork",
                          "Guided Contrast Therapy with Sauna & Cold Plunge",
                          "Cacao Body Scrub",
                          "Live Sound Bath Session",
                          "Sponsored Reset Gift Kit",
                          "Post-Retreat SILA Access",
                          "15% off Devia Juice Bar",
                          "Bio-hacking amenities at 20% off",
                          "Red light therapy (private + group)",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] leading-snug" style={{ color: C.inkSoft }}>
                            <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: C.rose }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 mt-6" style={{ borderTop: `1px solid ${C.hairline}` }}>

                      {isSoldOut ? (
                        <span className="inline-block w-full text-center py-4 rounded-full text-sm tracking-wide" style={{ backgroundColor: C.hairline, color: C.taupe }}>
                          Sold Out
                        </span>
                      ) : (
                        <a
                          href={STRIPE_PAYMENT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full py-4 rounded-full text-white text-sm tracking-[0.15em] uppercase transition-colors"
                          style={{ backgroundColor: C.rose }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.roseHover)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.rose)}
                        >
                          {price > 0 ? "Claim Your Seat" : "Request Invitation"}
                        </a>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* RIGHT - editorial photo */}
            <div className="relative rounded-3xl overflow-hidden min-h-[480px] lg:min-h-0" style={{ border: `1px solid ${C.hairline}` }}>
              <img
                src={dearBodyAsset.url}
                alt="Soft skin with water droplets, dear body, I love you"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(180deg, ${C.ink}55 0%, transparent 35%, transparent 60%, ${C.ink}55 100%)` }}
              />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 lg:p-12">
                <p className="font-serif italic text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight" style={{ color: C.cream }}>
                  dear body,
                  <br />
                  I hear you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============ AGENDA / GRACEFUL RHYTHM ============ */}
      {segments.length > 0 && (
        <section className="px-6 sm:px-10 lg:px-20 py-20 lg:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 lg:mb-20">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="h-px w-8" style={{ backgroundColor: C.taupe, opacity: 0.4 }} />
                <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: C.taupe }}>The Flow</p>
                <span className="h-px w-8" style={{ backgroundColor: C.taupe, opacity: 0.4 }} />
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight" style={{ color: C.ink }}>
                A graceful rhythm from arrival
                <br />
                to <em className="italic font-normal" style={{ color: C.rose }}>integration.</em>
              </h2>
            </div>

            {(() => {
              const N = segments.length;
              const active = segments[activeSegment] ?? segments[0];
              const activeTime = getSegmentTime(activeSegment);

              const cx = 200, cy = 200;
              // Wide, rounded, cupped petal - base at (0,0), tip up at (0,-144)
              const petalD =
                "M 0 0 C 34 -10, 48 -56, 28 -116 C 18 -134, 8 -144, 0 -144 C -8 -144, -18 -134, -28 -116 C -48 -56, -34 -10, 0 0 Z";
              const petalSm =
                "M 0 0 C 22 -6, 30 -36, 18 -72 C 12 -82, 6 -88, 0 -88 C -6 -88, -12 -82, -18 -72 C -30 -36, -22 -6, 0 0 Z";

              return (
                <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-center">
                  {/* LOTUS BLOOM */}
                  <div className="relative mx-auto w-full max-w-[540px] aspect-square">
                    <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible" aria-hidden>
                      <defs>
                        <linearGradient id="petalBack" x1="50%" y1="0%" x2="50%" y2="100%">
                          <stop offset="0%" stopColor="#fdf0ec" stopOpacity="0.95" />
                          <stop offset="60%" stopColor="#f5d4cb" stopOpacity="0.8" />
                          <stop offset="100%" stopColor={C.rose} stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="petalFront" x1="50%" y1="0%" x2="50%" y2="100%">
                          <stop offset="0%" stopColor="#fde2dc" stopOpacity="1" />
                          <stop offset="55%" stopColor="#f3bdb0" stopOpacity="0.95" />
                          <stop offset="100%" stopColor={C.rose} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="petalActive" x1="50%" y1="0%" x2="50%" y2="100%">
                          <stop offset="0%" stopColor="#fbcfc6" stopOpacity="1" />
                          <stop offset="50%" stopColor="#e8a094" stopOpacity="1" />
                          <stop offset="100%" stopColor={C.rose} stopOpacity="0.95" />
                        </linearGradient>
                        <radialGradient id="lotusCore" cx="50%" cy="45%" r="55%">
                          <stop offset="0%" stopColor="#fdebb0" />
                          <stop offset="70%" stopColor="#e8c074" stopOpacity="0.95" />
                          <stop offset="100%" stopColor="#c89a52" stopOpacity="0.85" />
                        </radialGradient>
                      </defs>

                      <g
                        style={{
                          transformOrigin: `${cx}px ${cy}px`,
                          animation: "lotus-breath 22s ease-in-out infinite",
                        }}
                      >
                        {/* Whisper-thin outer ornamental ring */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="180"
                          fill="none"
                          stroke={C.taupe}
                          strokeOpacity="0.16"
                          strokeWidth="0.5"
                          strokeDasharray="1 5"
                        />

                        {/* BACK PETAL RING - splayed wider, offset by half-angle */}
                        {segments.map((_, i) => {
                          const angle = (360 / N) * i + 180 / N;
                          const isActive = i === activeSegment;
                          return (
                            <path
                              key={`b${i}`}
                              d={petalD}
                              fill="url(#petalBack)"
                              stroke={C.rose}
                              strokeOpacity={isActive ? 0.45 : 0.28}
                              strokeWidth="0.5"
                              transform={`translate(${cx} ${cy}) rotate(${angle}) scale(1.05)`}
                              style={{ transition: "all 700ms ease" }}
                            />
                          );
                        })}

                        {/* FRONT PETAL RING - clickable, full color */}
                        {segments.map((_, i) => {
                          const angle = (360 / N) * i;
                          const isActive = i === activeSegment;
                          return (
                            <g
                              key={`f${i}`}
                              style={{ cursor: "pointer" }}
                              onMouseEnter={() => setActiveSegment(i)}
                              onClick={() => setActiveSegment(i)}
                            >
                              <path
                                d={petalD}
                                fill={isActive ? "url(#petalActive)" : "url(#petalFront)"}
                                stroke={C.rose}
                                strokeOpacity={isActive ? 0.9 : 0.5}
                                strokeWidth={isActive ? 0.9 : 0.55}
                                transform={`translate(${cx} ${cy}) rotate(${angle}) ${isActive ? "scale(1.05)" : ""}`}
                                style={{
                                  transition: "all 700ms cubic-bezier(.2,.7,.2,1)",
                                  filter: isActive
                                    ? `drop-shadow(0 4px 12px ${C.rose}55)`
                                    : "none",
                                }}
                              />
                              {isActive && (
                                <path
                                  d="M 0 -8 C 3 -50, 3 -100, 0 -138"
                                  fill="none"
                                  stroke="#ffffff"
                                  strokeOpacity="0.55"
                                  strokeWidth="0.5"
                                  transform={`translate(${cx} ${cy}) rotate(${angle})`}
                                />
                              )}
                            </g>
                          );
                        })}

                        {/* INNER CUP - small petals around seed pod */}
                        {[0, 60, 120, 180, 240, 300].map((a) => (
                          <path
                            key={`i${a}`}
                            d={petalSm}
                            fill="url(#petalFront)"
                            stroke={C.rose}
                            strokeOpacity="0.5"
                            strokeWidth="0.5"
                            transform={`translate(${cx} ${cy}) rotate(${a})`}
                          />
                        ))}

                        {/* SEED POD */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="22"
                          fill="url(#lotusCore)"
                          stroke="#c89a52"
                          strokeOpacity="0.5"
                          strokeWidth="0.6"
                        />
                        {/* Stamen filaments */}
                        {Array.from({ length: 16 }).map((_, i) => {
                          const a = ((i * (360 / 16)) * Math.PI) / 180;
                          const r1 = 14, r2 = 21;
                          return (
                            <line
                              key={`st${i}`}
                              x1={cx + Math.cos(a) * r1}
                              y1={cy + Math.sin(a) * r1}
                              x2={cx + Math.cos(a) * r2}
                              y2={cy + Math.sin(a) * r2}
                              stroke="#c89a52"
                              strokeOpacity="0.55"
                              strokeWidth="0.5"
                            />
                          );
                        })}
                        {[0, 72, 144, 216, 288].map((a) => {
                          const r = (a * Math.PI) / 180;
                          return (
                            <circle
                              key={`s${a}`}
                              cx={cx + Math.cos(r) * 7}
                              cy={cy + Math.sin(r) * 7}
                              r="1.4"
                              fill="#8a6a3a"
                              opacity="0.7"
                            />
                          );
                        })}
                        <circle cx={cx} cy={cy} r="2" fill="#8a6a3a" opacity="0.8" />
                      </g>

                      {/* Numerals - quiet, outside the bloom */}
                      {segments.map((_, i) => {
                        const angle = (360 / N) * i - 90;
                        const rad = (angle * Math.PI) / 180;
                        const r = 180;
                        const lx = cx + Math.cos(rad) * r;
                        const ly = cy + Math.sin(rad) * r;
                        const isActive = i === activeSegment;
                        return (
                          <text
                            key={`n${i}`}
                            x={lx}
                            y={ly}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={isActive ? "11" : "9"}
                            fontFamily="serif"
                            fontStyle="italic"
                            letterSpacing="1.5"
                            fill={isActive ? C.rose : C.taupe}
                            opacity={isActive ? 1 : 0.5}
                            style={{ transition: "all 400ms ease", pointerEvents: "none" }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </text>
                        );
                      })}
                    </svg>

                    <style>{`
                      @keyframes lotus-breath {
                        0%, 100% { transform: rotate(0deg) scale(1); }
                        50% { transform: rotate(1.5deg) scale(1.015); }
                      }
                    `}</style>
                  </div>


                  {/* ACTIVE DETAIL - editorial side panel */}
                  <div className="relative lg:pl-10">
                    {/* Hairline vertical divider */}
                    <div
                      className="hidden lg:block absolute left-0 top-2 bottom-2 w-px"
                      style={{ backgroundColor: C.hairline }}
                    />

                    <div key={activeSegment} className="animate-fade-in">
                      {/* Chapter line */}
                      <div className="flex items-baseline gap-3 mb-6">
                        <span
                          className="font-serif italic text-2xl leading-none"
                          style={{ color: C.rose }}
                        >
                          {String(activeSegment + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: C.rose, opacity: 0.4 }} />
                        <span
                          className="text-[10px] tracking-[0.4em] uppercase font-semibold"
                          style={{ color: C.taupe }}
                        >
                          {activeTime}
                        </span>
                      </div>

                      <h3
                        className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.05] tracking-tight mb-5"
                        style={{ color: C.ink }}
                      >
                        {active.title}
                      </h3>

                      {active.description && (
                        <p
                          className="text-[15px] leading-[1.7] mb-7 max-w-md"
                          style={{ color: C.inkSoft }}
                        >
                          {active.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] tracking-[0.15em] uppercase" style={{ color: C.taupe }}>
                        <span>{active.duration_minutes} minutes</span>
                        {active.facilitator && (
                          <>
                            <span style={{ color: C.rose, opacity: 0.5 }}>·</span>
                            {active.facilitator_instagram ? (
                              <a
                                href={`https://instagram.com/${active.facilitator_instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition-opacity normal-case tracking-normal italic font-serif text-sm"
                                style={{ color: C.rose }}
                              >
                                Led by {active.facilitator}
                              </a>
                            ) : (
                              <span className="normal-case tracking-normal italic font-serif text-sm" style={{ color: C.ink }}>
                                Led by {active.facilitator}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Refined segment navigator */}
                    <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${C.hairline}` }}>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: C.taupe }}>
                          {String(activeSegment + 1).padStart(2, "0")} <span style={{ opacity: 0.4 }}>/ {String(N).padStart(2, "0")}</span>
                        </span>
                        <div className="flex-1 flex items-center gap-1">
                          {segments.map((_, i) => (
                            <button
                              key={i}
                              onMouseEnter={() => setActiveSegment(i)}
                              onClick={() => setActiveSegment(i)}
                              aria-label={`Segment ${i + 1}`}
                              className="flex-1 h-px transition-all duration-500"
                              style={{
                                backgroundColor: i === activeSegment ? C.rose : C.taupe,
                                opacity: i === activeSegment ? 1 : 0.25,
                                transform: i === activeSegment ? "scaleY(3)" : "scaleY(1)",
                                transformOrigin: "center",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}


      {/* ============ FAQ + GOOD TO KNOW ============ */}
      <section id="faq" className="px-6 sm:px-10 lg:px-20 py-16" style={{ backgroundColor: C.blush + "30" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: C.taupe }}>Good to Know</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05]" style={{ color: C.ink }}>
              Everything you may want to know before <em className="italic" style={{ color: C.rose }}>reserving.</em>
            </h2>
          </div>

          {highlights.length > 0 && (
            <div
              className="mb-10 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-7 px-6 sm:px-8 py-8 rounded-2xl"
              style={{ backgroundColor: C.card, border: `1px solid ${C.hairline}` }}
            >
              {highlights.map((h, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <p
                    className="text-[10px] tracking-[0.25em] uppercase"
                    style={{ color: C.taupe }}
                  >
                    {h.label}
                  </p>
                  <p className="font-serif text-sm sm:text-base leading-snug break-words" style={{ color: C.ink }}>
                    {h.value}
                  </p>
                </div>
              ))}
            </div>
          )}


          <div className="space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.hairline}` }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-serif text-lg" style={{ color: C.ink }}>{f.q}</span>
                    {open ? (
                      <Minus className="w-4 h-4 shrink-0" style={{ color: C.rose }} />
                    ) : (
                      <Plus className="w-4 h-4 shrink-0" style={{ color: C.rose }} />
                    )}
                  </button>
                  {open && (
                    <div className="px-6 pb-6 -mt-1">
                      <p className="text-sm leading-relaxed" style={{ color: C.inkSoft }}>{f.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ============ SPONSORS (kept, restyled) ============ */}
      {sponsorsEnabled && sponsors.length > 0 && (
        <section className="px-6 sm:px-10 lg:px-20 py-14">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-3" style={{ color: C.taupe }}>In Beautiful Partnership With</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 mt-8">
              {sponsors.map((s: any) => (
                <a
                  key={s.id}
                  href={s.website_url || s.cta_link || undefined}
                  target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
                >
                  {s.logo_url ? (
                    <img src={s.logo_url} alt={s.name} className="h-10 w-auto object-contain opacity-80" />
                  ) : (
                    <span className="font-serif text-xl" style={{ color: C.ink }}>{s.name}</span>
                  )}
                  {s.is_main && (
                    <span className="text-[9px] tracking-[0.3em] uppercase flex items-center gap-1" style={{ color: C.rose }}>
                      <Crown className="w-3 h-3" /> Featured
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ WAIVER (kept, soft restyle) ============ */}
      {waiverEnabled && waiverContent && (
        <section className="px-6 sm:px-10 lg:px-20 py-12">
          <div className="max-w-3xl mx-auto p-6 rounded-2xl flex items-start gap-4" style={{ backgroundColor: C.card, border: `1px solid ${C.hairline}` }}>
            <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" style={{ color: C.rose }} />
            <div className="flex-1">
              <p className="font-serif text-lg mb-1" style={{ color: C.ink }}>
                Waiver {waiverRequired && <span className="text-[10px] tracking-[0.25em] uppercase ml-2" style={{ color: C.rose }}>Required</span>}
              </p>
              {waiverType === "link" ? (
                <a href={waiverContent} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline inline-flex items-center gap-1" style={{ color: C.rose }}>
                  Review waiver <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: C.inkSoft }}>{waiverContent}</p>
              )}
            </div>
          </div>
        </section>
      )}



      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        {/* Background image - full bleed */}
        <img
          src={finalCtaBloomAsset.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Soft warm overlay for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${C.blush}55 0%, ${C.champagne}66 55%, ${C.ink}55 100%)`,
          }}
        />

        <div className="relative px-6 sm:px-10 lg:px-20 py-12 sm:py-16 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: C.card }}>
            A Final Invitation
          </p>

          {/* Logo */}
          <div className="flex justify-center -my-16 sm:-my-20 overflow-hidden">
            <img
              src={breatheBloomLogoAsset.url}
              alt="Breathe&Bloom"
              className="h-56 sm:h-72 w-auto opacity-90"
            />
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl leading-[0.95] mb-8" style={{ color: C.card }}>
            Come as you are. <br />
            <em className="italic" style={{ color: C.blush }}>Leave restored.</em>
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-10" style={{ color: C.card }}>
            Some mornings change the shape of the season. <br className="hidden sm:block" />
            This is one of them.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={STRIPE_PAYMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white text-sm tracking-[0.15em] uppercase transition-colors shadow-xl"
              style={{ backgroundColor: C.rose, boxShadow: `0 20px 40px -15px ${C.ink}99` }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.roseHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.rose)}
            >
              Reserve Your Seat
            </a>
            {dateObj && (
              <button
                onClick={() => downloadICS({
                  name: event.name, date: event.date!,
                  time: (event as any).time, endTime: (event as any).end_time,
                  location: event.location, description: event.description,
                })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase transition-colors backdrop-blur"
                style={{ color: C.card, border: `1px solid ${C.card}99`, backgroundColor: `${C.ink}22` }}
              >
                <CalendarPlus className="w-4 h-4" /> Save the Date
              </button>
            )}
          </div>

          {/* Curated + Partners - unified block */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: C.card, opacity: 0.9 }}>
              Curated Wellness · Held with Intention
            </p>
            <p className="text-[10px] tracking-[0.45em] uppercase" style={{ color: C.card, opacity: 0.75 }}>
              In Partnership With
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
              <div className="flex items-center justify-center h-36 sm:h-48">
                <img
                  src={partnerSilaAsset.url}
                  alt="Sila"
                  className="max-h-full w-auto opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center h-36 sm:h-48">
                <img
                  src={partner2Asset.url}
                  alt="Vibranto"
                  className="max-h-28 sm:max-h-36 w-auto opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-xs hover:opacity-80"
            style={{ color: C.card }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all experiences
          </Link>

        </div>
      </section>
    </div>
  );
};

export default EventDetail;
