// Blog posts and podcast appearances, edited in the CMS (/admin -> "Blog" and
// "Podcasts"). Each one is a JSON file; the file name becomes its web address.
// Use the CMS "Duplicate" option to start a new one from an existing entry, and
// switch off "Show on website" to hide one without deleting it.

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary?: string;
  image?: string;
  body: string;
  published?: boolean;
}

export interface Podcast {
  id: string;
  /** Episode title. */
  title: string;
  /** Name of the podcast or show. */
  show: string;
  date: string;
  description?: string;
  /** Where to listen: Spotify, Apple Podcasts, YouTube or any page. */
  link: string;
  image?: string;
  published?: boolean;
}

const load = <T,>(files: Record<string, { default: Omit<T, "id"> }>) =>
  Object.entries(files).map(([path, mod]) => ({ ...mod.default, id: path.split("/").pop()!.replace(/\.json$/, "") }) as T);

const blogFiles = import.meta.glob<{ default: Omit<BlogPost, "id"> }>("../content/blog/*.json", { eager: true });
const podcastFiles = import.meta.glob<{ default: Omit<Podcast, "id"> }>("../content/podcasts/*.json", { eager: true });

const byNewest = (a: { date: string }, b: { date: string }) => (b.date || "").localeCompare(a.date || "");

export const blogPosts = load<BlogPost>(blogFiles)
  .filter((p) => p.published !== false && p.title && p.body)
  .sort(byNewest);

export const podcasts = load<Podcast>(podcastFiles)
  .filter((p) => p.published !== false && p.title && p.link)
  .sort(byNewest);

export const getPost = (id?: string) => blogPosts.find((p) => p.id === id);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "November 28, 2026" from a YYYY-MM-DD date, without timezone drift. */
export function longDate(iso: string) {
  const [y, m, d] = (iso || "").slice(0, 10).split("-").map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : "";
}

/**
 * A player URL for links from Spotify, Apple Podcasts or YouTube, so the
 * episode can play right on the page. Other links just get a Listen button.
 */
export function embedUrl(link: string): string | null {
  try {
    const u = new URL(link.trim());
    const host = u.hostname.replace(/^www\./, "");
    if (host === "open.spotify.com") {
      const m = u.pathname.match(/^\/(episode|show)\/([A-Za-z0-9]+)/);
      return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
    }
    if (host === "podcasts.apple.com") return `https://embed.podcasts.apple.com${u.pathname}${u.search}`;
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      return v ? `https://www.youtube-nocookie.com/embed/${v}` : null;
    }
    if (host === "youtu.be") {
      const v = u.pathname.slice(1).split("/")[0];
      return v ? `https://www.youtube-nocookie.com/embed/${v}` : null;
    }
  } catch {
    // Not a valid URL: no player.
  }
  return null;
}
