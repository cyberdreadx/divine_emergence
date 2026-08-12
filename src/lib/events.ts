// Upcoming workshops and events shown on the /events page.
// ----------------------------------------------------------------------------
// TO ADD AN EVENT: copy one of the example blocks below, remove the leading
// "// " from each line, and fill in your details. Dates use the format
// YYYY-MM-DD (year-month-day). Past events drop off the page automatically.
//
// Only `slug`, `title`, `date`, `location`, and `description` are required.
// If you leave `ctaHref` off, the button falls back to the general booking
// link. Set `soldOut: true` to show a "Sold out" badge instead of a button.

import { BOOKING_URL } from "@/lib/site";

export type DivineEvent = {
  slug: string;
  title: string;
  date: string; // ISO start date, e.g. "2026-09-14"
  endDate?: string; // ISO end date for multi-day events
  time?: string; // e.g. "6:00 PM - 8:00 PM"
  location: string; // e.g. "Delray Beach, FL"
  description: string;
  image?: string; // optional image URL (e.g. "/offerings/breathwork-1.webp")
  ctaLabel?: string; // defaults to "Reserve your spot"
  ctaHref?: string; // event booking link; defaults to the general booking link
  soldOut?: boolean;
};

export const events: DivineEvent[] = [
  // ---- EXAMPLE (delete the // in front of each line to activate) ----
  // {
  //   slug: "full-moon-breathwork-sept",
  //   title: "Full Moon Breathwork Circle",
  //   date: "2026-09-14",
  //   time: "6:00 PM - 8:00 PM",
  //   location: "Delray Beach, FL",
  //   description:
  //     "An evening breathwork journey under the full moon. Move stored emotion, regulate your nervous system, and connect with community in a held, welcoming space.",
  //   ctaLabel: "Reserve your spot",
  //   ctaHref: "https://grow.divineemergence.org/widget/booking/your-event-link",
  // },
  // {
  //   slug: "sound-bath-oct",
  //   title: "Breath & Sound Bath",
  //   date: "2026-10-05",
  //   time: "7:00 PM - 9:00 PM",
  //   location: "Boca Raton, FL",
  //   description:
  //     "A gentle, restorative evening of functional breathwork followed by an immersive sound bath. No experience needed. Come on your own or bring a friend.",
  // },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

// Parse an ISO date string safely (no timezone drift) into display parts.
export function formatEventDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return {
    monthShort: MONTHS_SHORT[m - 1],
    day: d,
    weekday,
    full: `${weekday}, ${MONTHS[m - 1]} ${d}, ${y}`,
  };
}

function todayIso() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}

// Events that have not finished yet, soonest first.
export function getUpcomingEvents(): DivineEvent[] {
  const today = todayIso();
  return events
    .filter((e) => (e.endDate ?? e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export const DEFAULT_EVENT_CTA = BOOKING_URL;
