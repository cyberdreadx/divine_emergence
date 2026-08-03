// Download all Lovable assets to local src/assets/ for local development.
// Usage: node scripts/download-assets.mjs
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";

const BASE = "https://id-preview--f80ef90a-6ab0-4e9e-875d-952abe985269.lovable.app";
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
