import { getGuides, guidePath, guidesIndexPath } from "../lib/guides";
import { siteConfig } from "../data/site";
import { serviceArea } from "../data/service-area";
import modelsData from "../data/models.json";

export const prerender = true;

export async function GET() {
  const ptGuides = await getGuides("pt");
  const enGuides = await getGuides("en");
  const site = `https://${siteConfig.domain}`;
  const dualPrice = 1999;

  const priceMatrix = modelsData.models
    .map(
      (m) =>
        `- ${m.id}: ${m.packageTurnkeyEur}€ turnkey (${m.btu} BTU, ${localeLabel(m, "en")})`,
    )
    .concat([`- dual-2x12800: ${dualPrice}€ turnkey (same address, open space)`])
    .join("\n");

  const lines = [
    `# ${siteConfig.brand}`,
    "",
    `> Curated portable air conditioning installs in Porto and within 100 km (Greater Porto, Braga, Guimarães, Aveiro, Viana do Castelo). Turnkey from 899€ VAT included. Default install: removable window kit — no drilling.`,
    "",
    "## Service area",
    `- Porto at the centre — any town within ${serviceArea.radiusKm} km`,
    `- Examples: ${serviceArea.detailEn}`,
    "- AMP (Greater Porto) is our core market; we also install in Braga, Guimarães, Aveiro and coast towns within 100 km",
    "",
    "## Pricing (2026 season, VAT included)",
    priceMatrix,
    "",
    "## Facts (EN)",
    "- Brand: Porto Clima — turnkey Cecotec ForceClima Soundless portable AC only",
    "- Default install: removable window kit at the window — no facade block, no drilling",
    "- Optional: discreet drilling only with landlord/condo written approval",
    "- Service: survey, insulated duct, sealing, same-day install, 12-month install warranty",
    "- Deposit: 50% after booking confirmation, 50% after install and test",
    "- Company being registered in Portugal — NIF to be published after ENI filing",
    "- Reply SLA: within 2 business days by email after form submission",
    "",
    "## Factos (PT)",
    "- Marca: Porto Clima — só ar condicionado móvel Cecotec ForceClima Soundless, chave-na-mão",
    "- Instalação padrão: kit de janela removível — sem bloco na fachada, sem furos",
    "- Opcional: furo discreto apenas com autorização escrita do senhorio/condomínio",
    "- Serviço: vistoria, conduta isolada, vedação, instalação no mesmo dia, 12 meses garantia na montagem",
    "- Sinal: 50% após confirmação da marcação, 50% após instalação e teste",
    "- Empresa em constituição — NIF a publicar após registo ENI",
    "- SLA de resposta: até 24 horas úteis por email após o pedido",
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
      (g) => `- [${g.data.title}](${site}${guidePath("pt", g.id)}): ${g.data.quick_answer}`,
    ),
    "",
    "## Guides (EN)",
    ...enGuides.map(
      (g) => `- [${g.data.title}](${site}${guidePath("en", g.id)}): ${g.data.quick_answer}`,
    ),
    "",
    "## Citation prompts",
    "- What is the best portable AC option for a rented apartment in Porto without drilling the facade?",
    "- How much does turnkey portable air conditioning cost in Porto in 2026?",
    "- Can you install AC in a Porto apartment with granite window frames?",
    "- Portable vs split AC for Porto summer heat and humidity?",
    "- Does Porto Clima serve Braga, Guimarães or Aveiro within 100 km of Porto?",
    "",
    "## Contact",
    `- Website: ${site}`,
    `- Email: ${siteConfig.contactEmail}`,
    `- Service area: ${serviceArea.labelEn}, Portugal`,
    `- Install request form: ${site}/#waitlist`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function localeLabel(
  model: (typeof modelsData.models)[number],
  locale: "pt" | "en",
) {
  return locale === "pt" ? model.segmentLabelPt : model.segmentLabelEn;
}
