// Patch asset JSON files to use local paths instead of /__l5e/ CDN paths.
// Usage: node scripts/patch-asset-urls.mjs
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

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
  // Convert Windows backslashes to forward slashes and strip .asset.json
  const localPath = "/" + file.replace(/\\/g, "/").replace(/\.asset\.json$/, "");
  meta.url = localPath;
  await writeFile(file, JSON.stringify(meta, null, 2));
  console.log(`✓ ${file} -> ${localPath}`);
}
