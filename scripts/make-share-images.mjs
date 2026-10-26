// Renders a 1200x630 link-preview card for each page in scripts/share-pages.mjs
// into public/share/<key>.jpg: the page's photo on the left, its title on the
// right, in the same night-and-gold style as the homepage card.
//
// Run after changing a photo or card wording, then commit public/share/:
//   node scripts/make-share-images.mjs
// Needs Playwright with Chromium (npx playwright install chromium).

import { mkdirSync, readFileSync } from "node:fs";
import { extname } from "node:path";
import { chromium } from "playwright";
import { sharePages } from "./share-pages.mjs";

const root = new URL("../", import.meta.url);
const outDir = new URL("public/share/", root);
mkdirSync(outDir, { recursive: true });

const MIME = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

/** Local files become data URLs; CMS uploads (/uploads/...) live in public/. */
const photoSrc = (photo) => {
  if (!photo) return null;
  if (/^https?:\/\//.test(photo)) return photo;
  const rel = photo.startsWith("/") ? `public${photo}` : photo;
  const data = readFileSync(new URL(rel, root)).toString("base64");
  return `data:${MIME[extname(rel).toLowerCase()] ?? "image/jpeg"};base64,${data}`;
};

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const sun = (size) => `
  <svg width="${size}" height="${size * 0.7}" viewBox="0 0 240 170" fill="none" stroke="#E8B45C" stroke-width="4" stroke-linecap="round">
    <line x1="120" y1="8" x2="120" y2="44"/>
    <line x1="48" y1="28" x2="66" y2="58"/><line x1="192" y1="28" x2="174" y2="58"/>
    <line x1="2" y1="82" x2="32" y2="100"/><line x1="238" y1="82" x2="208" y2="100"/>
    <path d="M48 176 A72 72 0 0 1 192 176"/>
    <line x1="0" y1="176" x2="240" y2="176"/>
    <circle cx="120" cy="170" r="4" fill="#E8B45C" stroke="none"/>
  </svg>`;

const card = (p) => {
  const img = photoSrc(p.photo);
  const titleSize = p.title.length > 26 ? 60 : p.title.length > 18 ? 70 : 80;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&display=block" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;font-family:Inter,sans-serif;
    background:radial-gradient(80% 90% at 70% 40%, #3e2c34 0%, transparent 70%),
      linear-gradient(160deg,#241a33 0%,#1b1430 60%,#1c1531 100%);color:#fff}
  .frame{position:absolute;inset:24px;border:1.5px solid rgba(232,180,92,.28);border-radius:28px;overflow:hidden;display:flex}
  .photo{width:${img ? 440 : 0}px;flex:none;position:relative;background:#120d1f}
  .photo img{width:100%;height:100%;object-fit:${p.photoFit ?? "cover"};display:block}
  .photo:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 70%,rgba(27,20,48,.85))}
  .text{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:${img ? "flex-start" : "center"};
    text-align:${img ? "left" : "center"};padding:0 ${img ? 64 : 80}px}
  .eyebrow{font-size:20px;letter-spacing:.32em;text-transform:uppercase;color:#E8B45C;margin:22px 0 18px}
  h1{font-family:'Playfair Display',serif;font-weight:400;font-size:${titleSize}px;line-height:1.05;color:#F4E6CC}
  .tag{font-family:'Playfair Display',serif;font-style:italic;font-size:30px;color:#EDE6F5;margin-top:22px;line-height:1.25}
  .site{position:absolute;bottom:44px;${img ? "left:504px" : "left:0;right:0;text-align:center"};font-size:19px;letter-spacing:.24em;color:#B9AECB}
</style></head><body>
<div class="frame">
  ${img ? `<div class="photo"><img src="${img}"></div>` : ""}
  <div class="text">
    ${sun(img ? 110 : 150)}
    ${p.eyebrow ? `<div class="eyebrow">${esc(p.eyebrow)}</div>` : ""}
    <h1>${esc(p.title)}</h1>
    ${p.tagline ? `<div class="tag">${esc(p.tagline)}</div>` : ""}
  </div>
</div>
<div class="site">DIVINE EMERGENCE · DIVINEEMERGENCE.ORG</div>
</body></html>`;
};

// CHROMIUM_PATH lets you point at an existing Chromium instead of Playwright's own.
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const p of sharePages()) {
  if (p.image) continue; // uses a hand-made image (e.g. the homepage card)
  await page.setContent(card(p), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL(`${p.key}.jpg`, outDir).pathname, type: "jpeg", quality: 86 });
  console.log(`public/share/${p.key}.jpg`);
}
await browser.close();
