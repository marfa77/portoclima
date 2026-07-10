/**
 * Fetch hero + OG images from Pexels (same pattern as emigro note-og-image).
 * Usage: PEXELS_API_KEY=... node scripts/fetch-stock-images.mjs
 * Or: npm run fetch:images (loads ../../emigro/.env.local if present)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images");

const PEXELS_API = "https://api.pexels.com/v1/search";

/** Porto + portable AC niche — landscape, no portraits. */
const HERO_QUERIES = [
  "porto portugal apartment balcony azulejo",
  "porto apartment interior window light",
  "portugal living room summer interior",
  "home air conditioning unit window",
  "cool bedroom interior europe",
  "douro porto city apartment view",
];

function loadEnvFromSibling() {
  if (process.env.PEXELS_API_KEY?.trim()) return;
  const candidates = [
    path.join(ROOT, "../../emigro/.env.local"),
    path.join(ROOT, "../../reels-studio/.env"),
  ];
  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^PEXELS_API_KEY=(.+)$/);
      if (m) process.env.PEXELS_API_KEY = m[1].trim();
    }
    if (process.env.PEXELS_API_KEY) break;
  }
}

async function searchPexels(query) {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) throw new Error("PEXELS_API_KEY not set");

  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    per_page: "10",
  });

  const res = await fetch(`${PEXELS_API}?${params}`, {
    headers: { Authorization: apiKey },
  });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);

  const json = await res.json();
  for (const photo of json.photos ?? []) {
    const url = photo.src?.landscape || photo.src?.large;
    if (url) {
      return {
        url,
        id: photo.id,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        pexelsUrl: photo.url,
      };
    }
  }
  return null;
}

async function downloadAndProcess(sourceUrl, destPath, width, height) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  const webp = await sharp(input)
    .resize(width, height, { fit: "cover", position: "center" })
    .webp({ quality: 84 })
    .toBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, webp);
  return webp.length;
}

async function main() {
  loadEnvFromSibling();

  let picked = null;
  let usedQuery = null;

  for (const query of HERO_QUERIES) {
    console.log(`Searching: ${query}`);
    const hit = await searchPexels(query);
    if (hit) {
      picked = hit;
      usedQuery = query;
      console.log(`Found photo ${hit.id} by ${hit.photographer}`);
      break;
    }
  }

  if (!picked) {
    console.error("No photo found for any query.");
    process.exit(1);
  }

  const heroPath = path.join(OUT_DIR, "hero.webp");
  const ogPath = path.join(OUT_DIR, "og.webp");

  const heroBytes = await downloadAndProcess(picked.url, heroPath, 1600, 1000);
  const ogBytes = await downloadAndProcess(picked.url, ogPath, 1200, 630);

  const meta = {
    source: "pexels",
    query: usedQuery,
    photoId: picked.id,
    photographer: picked.photographer,
    photographerUrl: picked.photographerUrl,
    pexelsUrl: picked.pexelsUrl,
    files: {
      hero: "/images/hero.webp",
      og: "/images/og.webp",
    },
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(OUT_DIR, "attribution.json"), JSON.stringify(meta, null, 2));

  console.log(`hero.webp: ${(heroBytes / 1024).toFixed(1)} KB`);
  console.log(`og.webp: ${(ogBytes / 1024).toFixed(1)} KB`);
  console.log(`Credit: ${picked.photographer} — ${picked.pexelsUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
