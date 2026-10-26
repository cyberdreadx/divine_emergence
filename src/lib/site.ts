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

// GoHighLevel booking widget for the Reverence Retreat free clarity call.
// Note: the "reverance" spelling is Laura's actual widget slug, keep it as-is.
export const REVERENCE_BOOKING_URL =
  "https://grow.divineemergence.org/widget/bookings/reverance-retreat-tulum-mexico";

// Email capture popup ("Welcome to the Divine Emergence Community").
// GoHighLevel inbound-webhook endpoint. The popup posts the email here as a
// form-urlencoded `email` field; a GHL workflow maps it to Create/Update
// Contact and tags the newsletter list. Publish that workflow (not Draft) for
// submissions to actually land.
export const NEWSLETTER_ENDPOINT =
  "https://services.leadconnectorhq.com/hooks/Xf8ncPOdulMSwnurGzU0/webhook-trigger/5efcaf76-369a-404f-93c7-fc49df33d076";

// Ceremony Intake Form and Waiver (/intake). GoHighLevel inbound-webhook URL.
// Each answer posts as a form field named by its id in src/lib/intake.ts, plus
// `summary` (the whole form as readable text) and `signature` (a PNG data URL).
// The GHL workflow must be Published for submissions to land. If this is ever
// blanked, nothing is sent and clients are asked to email their signed PDF.
export const INTAKE_ENDPOINT =
  "https://services.leadconnectorhq.com/hooks/Xf8ncPOdulMSwnurGzU0/webhook-trigger/6cd7419c-6ecc-4d6a-bdc8-2739238d04a5";

// Existing detail pages on the live site. These currently resolve on GoHighLevel;
// update them here if the pages move.
export const LINKS = {
  breathwork: "https://divineemergence.org/breathwork",
  bufo: "https://divineemergence.org/bufo_alvarius",
  kambo: "https://divineemergence.org/kambo",
  coaching: "https://divineemergence.org/coaching",
  training: "https://divineemergence.org/training",
  retreat: "https://divineemergence.org/reverence-retreat",
  regulation: "https://divineemergence.org/regulation-is-power",
  booking: BOOKING_URL,
  // Social - fill in when handles are confirmed.
  instagram: "",
};
