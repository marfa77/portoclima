/**
 * Fetch hero images for SEO guides from Pexels.
 * Usage: npm run fetch:guide-images
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/guides");

const PEXELS_API = "https://api.pexels.com/v1/search";

/** translation_key → search query */
const GUIDE_QUERIES = {
  "portable-ac-porto-2026": "porto portugal apartment window summer",
  "rented-apartment-ac-porto": "portugal apartment living room interior window",
  "porto-summer-heat-comfort": "porto douro river city summer skyline",
  "portable-vs-split-porto": "portable air conditioner home interior",
};

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
    per_page: "12",
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

async function downloadAndProcess(sourceUrl, destPath) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  const webp = await sharp(input)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .webp({ quality: 84 })
    .toBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, webp);
  return webp.length;
}

async function main() {
  loadEnvFromSibling();
  const credits = {};

  for (const [key, query] of Object.entries(GUIDE_QUERIES)) {
    console.log(`\n[${key}] Searching: ${query}`);
    const hit = await searchPexels(query);
    if (!hit) {
      console.warn(`  No photo — skip`);
      continue;
    }
    const dest = path.join(OUT_DIR, `${key}.webp`);
    const bytes = await downloadAndProcess(hit.url, dest);
    credits[key] = {
      photographer: hit.photographer,
      url: hit.pexelsUrl,
      photoId: hit.id,
      query,
    };
    console.log(`  ${key}.webp — ${(bytes / 1024).toFixed(1)} KB — ${hit.photographer}`);
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "attribution.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), guides: credits }, null, 2),
  );
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
