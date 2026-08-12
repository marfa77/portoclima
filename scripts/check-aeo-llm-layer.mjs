#!/usr/bin/env node
/**
 * Pre-deploy AEO checker (PixID / Prep2Go pattern).
 * Verifies built dist/ has ai:description + data-llm capsules + healthy llms.txt.
 *
 * Usage:
 *   node scripts/check-aeo-llm-layer.mjs
 *   npm run check:aeo
 *
 * Exit 1 if any required check fails.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const write = process.argv.includes("--write");

/** @type {{ id: string, ok: boolean, detail: string }[]} */
const checks = [];

function ok(id, pass, detail) {
  checks.push({ id, ok: Boolean(pass), detail });
}

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (name === "index.html") out.push(p);
  }
  return out;
}

function main() {
  if (!existsSync(DIST)) {
    console.error("dist/ missing — run npm run build first");
    process.exit(1);
  }

  const pages = walkHtml(DIST);
  ok("dist:pages", pages.length >= 10, `${pages.length} HTML pages`);

  for (const file of pages) {
    const rel = relative(DIST, file);
    const html = readFileSync(file, "utf8");
    ok(`${rel}:ai-description`, /name="ai:description"\s+content="[^"]+"/i.test(html), "meta ai:description");
    ok(`${rel}:llms-link`, html.includes('href="https://climaporto.pt/llms.txt"') || html.includes('href="/llms.txt"'), "llms.txt alternate");
    ok(`${rel}:llms-title`, html.includes("Information for LLMs"), "llms.txt title attr");
    ok(`${rel}:data-llm-facts`, html.includes('data-llm="facts"'), "facts capsule");
    ok(`${rel}:data-llm-commercial`, html.includes('data-llm="commercial"'), "commercial capsule");

    const ai = html.match(/name="ai:description"\s+content="([^"]*)"/i);
    if (ai) {
      const content = ai[1];
      ok(`${rel}:ai-not-empty`, content.length >= 40, `len=${content.length}`);
      const aiUrls = content.match(/https:\/\/climaporto\.pt[^\s"]*/g) || [];
      const trunc = aiUrls.some(
        (u) => !u.includes("#") && !/\.[a-z0-9]+$/i.test(u) && !u.endsWith("/"),
      );
      ok(`${rel}:ai-no-trunc-url`, !trunc, trunc ? `bad urls: ${aiUrls.join(" | ")}` : "urls complete");
      if (rel.startsWith("guias/") && rel !== "guias/index.html") {
        ok(`${rel}:ai-pt-locale`, !/\bTurnkey portable AC\b/.test(content), "no EN bleed on PT guide");
        ok(`${rel}:ai-pt-guia`, /\bGuia:\s*https:\/\//.test(content), "PT uses Guia: label");
      }
      if (rel.startsWith("en/guides/") && rel !== "en/guides/index.html") {
        ok(`${rel}:ai-en-guide`, /\bGuide:\s*https:\/\//.test(content), "EN uses Guide: label");
      }
    }

    // Capsules must not glue sentence period onto URLs (#waitlist.)
    const capsules = [...html.matchAll(/data-llm="(?:facts|commercial)"[^>]*>(.*?)<\/div>/gis)].map((m) =>
      m[1].replace(/\s+/g, " "),
    );
    for (const [i, body] of capsules.entries()) {
      ok(`${rel}:capsule-${i}-no-url-period`, !/utm_medium=llms\.txt(?:#[\w-]+)?\./.test(body), "no period glued to UTM URL");
      ok(`${rel}:capsule-${i}-min`, body.length >= 40, `len=${body.length}`);
    }
  }

  const homes = ["index.html", "en/index.html"];
  for (const rel of homes) {
    const html = readFileSync(join(DIST, rel), "utf8");
    ok(`${rel}:differentiators`, html.includes('data-llm="differentiators"'), "home differentiators");
  }

  const llmsPath = join(DIST, "llms.txt");
  ok("llms.txt:exists", existsSync(llmsPath), "dist/llms.txt");
  if (existsSync(llmsPath)) {
    const llms = readFileSync(llmsPath, "utf8");
    ok("llms.txt:answer-card", llms.includes("AI Answer Card") && llms.includes("utm_source=llm"), "Answer Card + UTM");
    ok("llms.txt:high-intent", llms.includes("LLM High-Intent"), "High-Intent section");
    ok("llms.txt:waitlist", llms.includes("#waitlist"), "request CTA");
    ok("llms.txt:price", llms.includes("899"), "price signal");
    const hi = [...llms.matchAll(/^### "([^"]+)"\n([^\n]+)/gm)];
    ok("llms.txt:hi-count", hi.length >= 8, `${hi.length} high-intent entries`);
    for (const [, q, a] of hi) {
      ok(`llms.txt:hi:${q.slice(0, 40)}`, a.includes("climaporto.pt") && a.includes("utm_source=llm"), "domain + utm");
    }
  }

  ok("sitemap.xml", existsSync(join(DIST, "sitemap.xml")), "sitemap alias");
  const robots = readFileSync(join(DIST, "robots.txt"), "utf8");
  ok("robots:sitemap", /sitemap\.xml/i.test(robots), "robots lists sitemap.xml");

  const failed = checks.filter((c) => !c.ok);
  const lines = [
    `# LLM/AEO layer check — ${new Date().toISOString().slice(0, 10)}`,
    "",
    `Passed: ${checks.length - failed.length}/${checks.length}`,
    "",
    ...checks.map((c) => `- ${c.ok ? "✅" : "❌"} **${c.id}** — ${c.detail}`),
    "",
    failed.length
      ? "Fix failing surfaces before deploy. Pattern: `ai:description` + `<LlmFactsCapsule data-llm>` + High-Intent `llms.txt`."
      : "All required AEO wiring present.",
    "",
  ];

  const report = lines.join("\n");
  console.log(report);

  if (write) {
    const outDir = join(ROOT, "docs/seo-weekly");
    mkdirSync(outDir, { recursive: true });
    const out = join(outDir, "llm-aeo-check-latest.md");
    writeFileSync(out, report, "utf8");
    console.log(`Wrote ${out}`);
  }

  if (failed.length) process.exit(1);
}

main();
