// Google reviews shown on the site.
//
// The aggregate below is real and verifiable on Laura's Google Business
// Profile (Divine Emergence, LLC). The `items` are the curated quotes shown
// on the page. Replace the placeholders with real reviews: copy your favorite
// Google reviews here (reviewer's first name + their words). Do not invent
// reviews. Keep each quote fairly short so the cards stay elegant.

export const REVIEWS = {
  rating: "5.0",
  count: 59,
  // TODO: replace with the exact Google Business Profile reviews link.
  // For now this opens a Google search for the business.
  url: "https://www.google.com/search?q=Divine+Emergence+LLC+reviews",
};

export type Review = {
  name: string;
  quote: string;
  /** Optional short context, e.g. "Breathwork" or "Bufo journey". */
  context?: string;
};

// PLACEHOLDERS — replace these three with real Google reviews before publishing.
export const reviews: Review[] = [
  {
    name: "Add a real review",
    quote:
      "Paste one of your favorite Google reviews here. Keep it a sentence or two so the card stays clean and readable.",
    context: "Placeholder",
  },
  {
    name: "Add a real review",
    quote:
      "A second real review goes here. Reviews with a clear before-and-after tend to resonate most with new visitors.",
    context: "Placeholder",
  },
  {
    name: "Add a real review",
    quote:
      "A third real review goes here. Aim for three to six curated quotes across your different offerings.",
    context: "Placeholder",
  },
];
