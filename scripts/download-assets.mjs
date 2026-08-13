// Download remote source assets referenced by .asset.json files into
// src/assets/ for local development.
// Usage: ASSET_BASE_URL="https://host" node scripts/download-assets.mjs
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";

const BASE = process.env.ASSET_BASE_URL;
if (!BASE) {
  console.error("Set ASSET_BASE_URL to the host that serves the .asset.json url paths.");
  process.exit(1);
}
const ROOT = "src/assets";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.name.endsWith(".asset.json")) yield p;
  }
}

for await (const file of walk(ROOT)) {
  const meta = JSON.parse(await readFile(file, "utf8"));
  const outPath = file.replace(/\.asset\.json$/, "");
  const url = BASE + meta.url;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${url} -> ${res.status}`);
    continue;
  }
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${outPath} (${meta.size} bytes)`);
}
