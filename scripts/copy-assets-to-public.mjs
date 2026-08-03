// Copy downloaded assets into public/ mirroring the /__l5e/ path so existing URLs resolve locally.
// Usage: node scripts/copy-assets-to-public.mjs
import { readdir, readFile, copyFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";

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
  // meta.url is like /__l5e/assets-v1/{id}/filename.jpg
  // Strip leading slash and prepend public/
  const destPath = join("public", meta.url.replace(/^\//, ""));
  await mkdir(dirname(destPath), { recursive: true });
  const srcPath = file.replace(/\.asset\.json$/, "");
  await copyFile(srcPath, destPath);
  console.log(`✓ ${srcPath} -> ${destPath}`);
}
