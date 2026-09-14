// Central content for every offering and the women's retreat. The Offerings
// grid, the detail pages at /offerings/:slug, and the /retreat page all read
// from this list.
//
// EDITABLE COPY now lives in src/content/offerings/<slug>.json and is editable
// by Laura in the CMS (/admin -> "Offering pages"). This file merges that copy
// with the code-only pieces that can't live in JSON: the icon component, the
// hero/gallery images, and the call-to-action link targets. Keep the tone warm,
// grounded, and reverent, and avoid em dashes.

import {
  Wind,
  Flame,
  Leaf,
  Compass,
  GraduationCap,
  Sparkles,
  Users,
  CalendarHeart,
  type LucideIcon,
} from "lucide-react";
import { BOOKING_URL, TRAINING_APPLY_URL, BUFO_INTAKE_URL } from "@/lib/site";

import waterfallImg from "@/assets/waterfall.jpg";
import circleImg from "@/assets/de-circle.webp";

import breathworkContent from "@/content/offerings/breathwork.json";
import bufoContent from "@/content/offerings/bufo-alvarius.json";
import kamboContent from "@/content/offerings/kambo.json";
import womensRetreatContent from "@/content/offerings/womens-retreat.json";
import workshopsEventsContent from "@/content/offerings/workshops-events.json";
import coachingContent from "@/content/offerings/coaching.json";
import trainingContent from "@/content/offerings/training.json";
import regulationContent from "@/content/offerings/regulation-is-power.json";

export type Feature = { title: string; text: string };
export type Step = { label: string; title: string; text?: string; items?: string[] };
export type Tier = { name: string; price: string; note?: string };
export type Testimonial = { name: string; quote: string };
export type FaqItem = { q: string; a: string };
export type ProseSection = { heading: string; paragraphs: string[]; items?: string[] };
export type SecondaryCta = { heading: string; text: string; label: string; href: string };

export type Offering = {
  slug: string;
  title: string;
  cardTitle?: string; // shorter label for the homepage offerings grid
  Icon: LucideIcon;
  eyebrow: string;
  cardDesc: string;
  headline: string;
  intro: string;
  image: string;
  imageAlt: string;
  gallery?: string[];
  ctaLabel: string;
  ctaHref: string;
  body?: string[];
  approach?: { title: string; features: Feature[] };
  benefits?: { title: string; items: string[] };
  sections?: ProseSection[];
  curriculum?: { title: string; steps: Step[] };
  values?: { title: string; features: Feature[] };
  includes?: { title: string; items: string[] };
  pricing?: { title: string; tiers: Tier[]; note?: string };
  testimonials?: Testimonial[];
  faq?: FaqItem[];
  embedEbook?: boolean; // render the free page-turning ebook on the detail page
  secondaryCta?: SecondaryCta; // an extra call-to-action block above the main CTA
  hideFromGrid?: boolean;
  disabled?: boolean; // fully retire the offering: no grid card, no detail page
};

// Code-only per-offering config: icon component, images, link targets, and
// flags. Everything else (all copy) comes from the JSON content files.
type OfferingMeta = {
  Icon: LucideIcon;
  image: string;
  gallery?: string[];
  ctaHref: string;
  embedEbook?: boolean;
  hideFromGrid?: boolean;
  disabled?: boolean;
  secondaryCtaHref?: string;
};

const meta: Record<string, OfferingMeta> = {
  breathwork: {
    Icon: Wind,
    image: "/offerings/breathwork-1.webp",
    gallery: ["/offerings/breathwork-2.webp", "/offerings/breathwork-3.webp"],
    ctaHref: BOOKING_URL,
  },
  "bufo-alvarius": {
    Icon: Flame,
    image: "/offerings/bufo-alvarius-1.webp",
    ctaHref: BUFO_INTAKE_URL,
    embedEbook: true,
  },
  kambo: {
    Icon: Leaf,
    image: waterfallImg,
    ctaHref: BOOKING_URL,
  },
  "womens-retreat": {
    Icon: Users,
    // Retreat retired (Laura is no longer running it). Flip `disabled` back to
    // false to restore the grid card and the /womensretreat detail page.
    disabled: true,
    image: "/offerings/retreat-hero.webp",
    gallery: [
      "/offerings/retreat-1.webp",
      "/offerings/retreat-2.webp",
      "/offerings/retreat-3.webp",
      "/offerings/retreat-4.webp",
      "/offerings/retreat-5.webp",
      "/offerings/retreat-6.webp",
      "/offerings/retreat-7.webp",
      "/offerings/retreat-8.webp",
      "/offerings/retreat-9.webp",
      "/offerings/retreat-10.webp",
      "/offerings/retreat-11.webp",
      "/offerings/retreat-12.webp",
      "/offerings/retreat-13.webp",
      "/offerings/retreat-14.webp",
      "/offerings/retreat-15.webp",
      "/offerings/retreat-16.webp",
      "/offerings/retreat-17.webp",
      "/offerings/retreat-18.webp",
      "/offerings/retreat-19.webp",
      "/offerings/retreat-20.webp",
      "/offerings/retreat-21.webp",
      "/offerings/retreat-22.webp",
    ],
    ctaHref: BOOKING_URL,
  },
  "workshops-events": {
    Icon: CalendarHeart,
    image: circleImg,
    ctaHref: "/events",
  },
  coaching: {
    Icon: Compass,
    image: "/offerings/coaching-1.webp",
    gallery: [
      "/offerings/coaching-2.webp",
      "/offerings/regulation-is-power-5.webp",
      "/offerings/regulation-is-power-7.webp",
    ],
    ctaHref: BOOKING_URL,
    secondaryCtaHref: "/offerings/training",
  },
  training: {
    Icon: GraduationCap,
    image: "/offerings/training-4.webp",
    gallery: [
      "/offerings/training-2.webp",
      "/offerings/training-1.webp",
      "/offerings/training-5.webp",
      "/offerings/training-3.webp",
    ],
    ctaHref: TRAINING_APPLY_URL,
    hideFromGrid: true,
  },
  "regulation-is-power": {
    Icon: Sparkles,
    image: "/offerings/regulation-is-power-12.webp",
    gallery: [
      "/offerings/regulation-is-power-5.webp",
      "/offerings/regulation-is-power-4.webp",
      "/offerings/regulation-is-power-7.webp",
      "/offerings/regulation-is-power-2.webp",
      "/offerings/regulation-is-power-3.webp",
      "/offerings/regulation-is-power-6.webp",
    ],
    ctaHref: BOOKING_URL,
    hideFromGrid: true,
  },
};

// Order here controls the homepage offerings grid order.
const contentInOrder = [
  breathworkContent,
  bufoContent,
  kamboContent,
  womensRetreatContent,
  workshopsEventsContent,
  coachingContent,
  trainingContent,
  regulationContent,
];

// Merge editable JSON copy with the code-only meta into the final Offering list.
export const offerings: Offering[] = contentInOrder.map((content) => {
  const m = meta[content.slug];
  const merged = {
    ...(content as unknown as Offering),
    Icon: m.Icon,
    image: m.image,
    gallery: m.gallery,
    ctaHref: m.ctaHref,
    embedEbook: m.embedEbook,
    hideFromGrid: m.hideFromGrid,
    disabled: m.disabled,
    secondaryCta:
      "secondaryCta" in content && content.secondaryCta
        ? { ...(content.secondaryCta as Omit<SecondaryCta, "href">), href: m.secondaryCtaHref as string }
        : undefined,
  };
  return merged;
});

// Disabled offerings resolve to nothing, so their detail route redirects home.
export const getOffering = (slug?: string) =>
  offerings.find((o) => o.slug === slug && !o.disabled);

export const gridOfferings = offerings.filter((o) => !o.hideFromGrid && !o.disabled);
