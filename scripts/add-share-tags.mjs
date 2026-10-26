// Runs after `vite build`. The site is a single-page app, so every URL is
// served the same dist/index.html, and link-preview bots (iMessage, Facebook,
// Instagram, Slack, X) don't run JavaScript. Without this step every shared
// link would show the homepage preview.
//
// For each page in scripts/share-pages.mjs this writes dist/<path>/index.html
// with that page's title, description, canonical URL and share image. Netlify
// serves those files before falling back to the SPA redirect in _redirects.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { SITE_URL, sharePages } from "./share-pages.mjs";

const dist = new URL("../dist/", import.meta.url);
const template = readFileSync(new URL("index.html", dist), "utf8");

const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/\s+/g, " ").trim();

/** Replace the content of an existing tag, failing loudly if index.html changed shape. */
const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`add-share-tags: no match for ${pattern} in dist/index.html`);
  return html.replace(pattern, replacement);
};

let count = 0;
for (const p of sharePages()) {
  // The homepage's tags already live in index.html; leave them untouched.
  if (p.paths[0] === "/") continue;
  const url = SITE_URL + p.paths[0];
  const title = p.fullTitle ? p.title : `${p.title} | Divine Emergence`;
  const image = SITE_URL + (p.image ?? `/share/${p.key}.jpg`);
  const alt = p.fullTitle ? "Divine Emergence" : `${p.title}, Divine Emergence`;
  const d = attr(p.description);
  const t = attr(title);

  let html = template;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${d}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${t}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${d}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
  html = setTag(html, /<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${attr(alt)}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${t}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${d}" />`);
  html = setTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`);
  if (p.noindex) html = html.replace("</head>", `    <meta name="robots" content="noindex" />\n  </head>`);

  for (const path of p.paths) {
    const dir = new URL(`.${path}/`, dist);
    mkdirSync(dir, { recursive: true });
    writeFileSync(new URL("index.html", dir), html);
    count++;
  }
}
console.log(`add-share-tags: wrote share tags for ${count} pages`);
