/**
 * GitHub Pages has no redirects — expose /sitemap.xml for tools that
 * ignore sitemap-index.xml (and for auditors that only probe /sitemap.xml).
 */
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve("dist");
const urlset = resolve(dist, "sitemap-0.xml");
const index = resolve(dist, "sitemap-index.xml");
const alias = resolve(dist, "sitemap.xml");

if (existsSync(urlset)) {
  copyFileSync(urlset, alias);
  console.log("alias-sitemap: wrote dist/sitemap.xml from sitemap-0.xml");
} else if (existsSync(index)) {
  copyFileSync(index, alias);
  console.log("alias-sitemap: wrote dist/sitemap.xml from sitemap-index.xml");
} else {
  console.warn("alias-sitemap: no Astro sitemap found in dist/");
  process.exitCode = 1;
}
