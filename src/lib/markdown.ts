import { marked } from "marked";
import DOMPurify from "dompurify";

// Turns blog text written in the CMS (Markdown: **bold**, *italic*, ## headings,
// - lists, [links](https://...)) into safe HTML. Anything risky, like scripts
// or inline event handlers, is stripped out.
export function renderMarkdown(md: string): string {
  const html = marked.parse(md ?? "", { async: false, gfm: true, breaks: true }) as string;
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  // Open outside links in a new tab.
  return clean.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}

/** Plain-text preview of a post, for listings and link previews. */
export function excerpt(md: string, max = 180): string {
  const text = (md ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
}
