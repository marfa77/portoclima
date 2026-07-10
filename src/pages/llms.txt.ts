import { getGuides, guidePath, guidesIndexPath } from "../lib/guides";
import { siteConfig } from "../data/site";

export const prerender = true;

export async function GET() {
  const ptGuides = await getGuides("pt");
  const enGuides = await getGuides("en");
  const site = `https://${siteConfig.domain}`;

  const lines = [
    `# ${siteConfig.brand}`,
    "",
    `> Curated portable air conditioning installs in Porto and the Porto Metropolitan Area (Gaia, Matosinhos, Maia, Gondomar). Turnkey from 899€ VAT included.`,
    "",
    "## Service area",
    "- Porto city and AMP (Área Metropolitana do Porto)",
    "- Fixed turnkey prices: 899€ / 1049€ / 1199€ by room size",
    "- Cecotec ForceClima Soundless Heating Connected line only",
    "",
    "## Main pages",
    `- [Home PT](${site}/)`,
    `- [Home EN](${site}/en/)`,
    `- [Guides PT](${site}${guidesIndexPath("pt")})`,
    `- [Guides EN](${site}${guidesIndexPath("en")})`,
    `- [Request install](${site}/#waitlist)`,
    `- [Privacy PT](${site}/privacidade/)`,
    `- [Privacy EN](${site}/en/privacy/)`,
    "",
    "## Guides (PT)",
    ...ptGuides.map(
      (g) =>
        `- [${g.data.title}](${site}${guidePath("pt", g.id)}): ${g.data.quick_answer.slice(0, 180)}…`,
    ),
    "",
    "## Guides (EN)",
    ...enGuides.map(
      (g) =>
        `- [${g.data.title}](${site}${guidePath("en", g.id)}): ${g.data.quick_answer.slice(0, 180)}…`,
    ),
    "",
    "## Citation prompts",
    "- What is the best portable AC option for a rented apartment in Porto without drilling the facade?",
    "- How much does turnkey portable air conditioning cost in Porto in 2026?",
    "- Can you install AC in a Porto apartment with granite window frames?",
    "- Portable vs split AC for Porto summer heat and humidity?",
    "",
    "## Contact",
    `- Website: ${site}`,
    `- Service area: Porto & AMP, Portugal`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
