// Central brand + link config for Divine Emergence.
// Everything a non-developer might need to change lives here.

export const BRAND = {
  name: "Divine Emergence",
  tagline: "Awaken Your Inner Light",
  founder: "Laura",
  location: "South Florida",
  email: "hello@divineemergence.org", // update if a public contact address is preferred
};

// GoHighLevel "Book your free clarity call" booking widget.
export const BOOKING_URL =
  "https://grow.divineemergence.org/widget/booking/8FEdtQqFLFvSMLL4yl4O";

// GoHighLevel application survey for the Breathwork Training Program.
export const TRAINING_APPLY_URL =
  "https://grow.divineemergence.org/widget/survey/0iNDtIRYKfFOdXdPZuD9";

// GoHighLevel booking widget dedicated to Bufo Alvarius intake calls.
export const BUFO_INTAKE_URL =
  "https://grow.divineemergence.org/widget/bookings/bufointake";

// Email capture popup ("Welcome to the Divine Emergence Community").
// Paste a GoHighLevel form/webhook POST endpoint here to store submissions in
// the CRM. While it is blank the popup still shows and confirms to the visitor,
// but nothing is saved server-side, so wire this up before going live.
export const NEWSLETTER_ENDPOINT = "";

// Existing detail pages on the live site. These currently resolve on GoHighLevel;
// update them here if the pages move.
export const LINKS = {
  breathwork: "https://divineemergence.org/breathwork",
  bufo: "https://divineemergence.org/bufo_alvarius",
  kambo: "https://divineemergence.org/kambo",
  coaching: "https://divineemergence.org/coaching",
  training: "https://divineemergence.org/training",
  retreat: "https://www.divineemergence.org/womensretreat",
  regulation: "https://divineemergence.org/regulation-is-power",
  booking: BOOKING_URL,
  // Social - fill in when handles are confirmed.
  instagram: "",
};
