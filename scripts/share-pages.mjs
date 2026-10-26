// Link-preview (Open Graph / Twitter) settings for every page on the site.
//
// When a link is shared in iMessage, Facebook, Instagram DMs, Slack, etc., the
// preview shows the title, description and image listed here for that page.
//
// - Offering pages take their title and description from the CMS copy in
//   src/content/offerings/<slug>.json (title + cardDesc), so edits there flow
//   into previews on the next deploy.
// - `photo` is the picture used on the share card. Offering pages use the
//   CMS `image` when one is set, otherwise the photo listed here.
// - After changing a photo or a card's words, regenerate the cards with
//   `node scripts/make-share-images.mjs` and commit public/share/*.jpg.

import { readFileSync } from "node:fs";

export const SITE_URL = "https://divineemergence.org";

const offering = (slug) =>
  JSON.parse(readFileSync(new URL(`../src/content/offerings/${slug}.json`, import.meta.url), "utf8"));

/** One entry per shareable page. `paths` are every URL that shows it; the first is canonical. */
const offeringPage = (slug, { photo, paths, eyebrow, tagline }) => {
  const c = offering(slug);
  return {
    key: slug,
    paths: paths ?? [`/offerings/${slug}`],
    title: c.title,
    description: c.cardDesc || c.intro || "",
    eyebrow: eyebrow ?? c.eyebrow ?? "",
    tagline,
    photo: typeof c.image === "string" && c.image ? c.image : photo,
  };
};

export function sharePages() {
  return [
    {
      key: "home",
      paths: ["/"],
      // The homepage keeps the original brand card (public/og-image.png).
      image: "/og-image.png",
      title: "Divine Emergence | Breathwork, Psychedelic Therapy & Retreats",
      fullTitle: true,
      description:
        "Reconnect to your wholeness through breathwork, psychedelic therapies, and integration. Guiding people beyond survival into clarity, personal power, and true freedom.",
    },
    offeringPage("breathwork", {
      photo: "public/offerings/breathwork-1.webp",
      tagline: "Regulate your nervous system with the breath",
    }),
    offeringPage("bufo-alvarius", {
      photo: "public/offerings/bufo-alvarius-1.webp",
      tagline: "Sacred medicine held with safety and reverence",
    }),
    offeringPage("kambo", {
      photo: "src/assets/waterfall.jpg",
      tagline: "A traditional Amazonian cleanse",
    }),
    offeringPage("reverence-retreat", {
      photo: "public/offerings/reverence-retreat-hero.webp",
      paths: ["/reverence-retreat", "/offerings/reverence-retreat"],
      eyebrow: "Immersive Retreat",
      tagline: "Five days in the jungle outside Tulum, Mexico",
    }),
    offeringPage("workshops-events", {
      photo: "src/assets/de-circle.webp",
      tagline: "Breathwork circles and community gatherings",
    }),
    offeringPage("coaching", {
      photo: "public/offerings/coaching-1.webp",
      tagline: "Breathwork-focused 1:1 coaching",
    }),
    offeringPage("training", {
      photo: "public/offerings/training-4.webp",
      tagline: "Become a certified breathwork practitioner",
    }),
    offeringPage("regulation-is-power", {
      photo: "public/offerings/regulation-is-power-12.webp",
      tagline: "A 6-week nervous system reset",
    }),
    {
      key: "events",
      paths: ["/events"],
      title: "Upcoming Workshops & Events",
      description:
        "Breathwork circles, sound journeys, and community gatherings. Come breathe in person, regulate your nervous system, and find your people.",
      eyebrow: "In Person, South Florida",
      tagline: "Breathwork circles, sound journeys, community",
      photo: "src/assets/de-circle.webp",
    },
    {
      key: "ebook",
      paths: ["/ebook"],
      title: "Bufo Alvarius: Free Ebook",
      description:
        "A free ebook on Bufo Alvarius: dive into 5-MeO, processing, and integration. Read it right in your browser.",
      eyebrow: "Free Ebook",
      tagline: "5-MeO, processing, and integration",
      photo: "public/ebook/page-1.webp",
      photoFit: "contain",
    },
    {
      key: "coaching-call",
      paths: ["/coaching-call"],
      title: "Your Free Clarity Call",
      description: "Watch this short video before we meet, so you can get the most out of our time together.",
      eyebrow: "Before We Meet",
      tagline: "A short video to help you prepare",
      photo: "public/offerings/coaching-1.webp",
    },
    {
      key: "intake",
      paths: ["/intake"],
      title: "Ceremony Intake Form",
      description:
        "Your confidential intake form and waiver for ceremony with Divine Emergence. Your answers are private and used only to keep you safe.",
      eyebrow: "Confidential",
      tagline: "Intake form and waiver for ceremony",
      photo: null,
      noindex: true,
    },
  ];
}
