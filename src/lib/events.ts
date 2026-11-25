// Workshops and events shown on /events, each with its own sign-up page at
// /events/<id>.
//
// Events are edited in the CMS (/admin -> "Events"). Each event is one JSON
// file in src/content/events/, and the file name is the event's web address.
// Use the CMS "Duplicate" option to copy an event for a new date. Past events
// drop off the list automatically, and "Show on website" hides one without
// deleting it.

export type DivineEvent = {
  /** File name without .json; used in the event's URL. */
  id: string;
  title: string;
  /** What the event is, e.g. "Breathwork Circle" or "Sound Bath". */
  eventType?: string;
  /** Start date, YYYY-MM-DD. */
  date: string;
  /** Optional last day for multi-day events, YYYY-MM-DD. */
  endDate?: string;
  /** e.g. "6:00 PM to 8:00 PM". */
  time?: string;
  location: string;
  /** e.g. "$45" or "Free". */
  cost?: string;
  description: string;
  image?: string;
  /** Checkout link from GoHighLevel, Stripe, Square, etc. Empty = free sign-up. */
  paymentLink?: string;
  soldOut?: boolean;
  /** false hides the event from the site. */
  published?: boolean;
};

const files = import.meta.glob<{ default: Omit<DivineEvent, "id"> }>("../content/events/*.json", { eager: true });

export const events: DivineEvent[] = Object.entries(files).map(([path, mod]) => ({
  ...mod.default,
  id: path.split("/").pop()!.replace(/\.json$/, ""),
}));

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Display parts for a YYYY-MM-DD date, without timezone drift. */
export function formatEventDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return {
    monthShort: MONTHS_SHORT[m - 1],
    day: d,
    weekday,
    full: `${weekday}, ${MONTHS[m - 1]} ${d}, ${y}`,
  };
}

/** "Saturday, December 12, 2026" or a range for multi-day events. */
export function eventDateLabel(e: DivineEvent) {
  const start = formatEventDate(e.date).full;
  if (!e.endDate || e.endDate.slice(0, 10) === e.date.slice(0, 10)) return start;
  return `${start} to ${formatEventDate(e.endDate).full}`;
}

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const isLive = (e: DivineEvent) => e.published !== false && !!e.title && !!e.date;

export const isPast = (e: DivineEvent) => (e.endDate || e.date).slice(0, 10) < todayIso();

/** Published events that have not finished yet, soonest first. */
export function getUpcomingEvents(): DivineEvent[] {
  return events.filter((e) => isLive(e) && !isPast(e)).sort((a, b) => a.date.localeCompare(b.date));
}

/** A published event by id (past ones included, so old links still open). */
export const getEvent = (id?: string) => events.find((e) => e.id === id && isLive(e));

/**
 * The checkout URL with the person's email filled in where the payment page
 * supports it (Stripe Payment Links read prefilled_email).
 */
export function checkoutUrl(link: string, email: string) {
  try {
    const url = new URL(link.trim());
    if (/(^|\.)stripe\.com$/.test(url.hostname)) url.searchParams.set("prefilled_email", email);
    return url.toString();
  } catch {
    return link.trim();
  }
}
