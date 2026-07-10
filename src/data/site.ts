/** Site-wide config — update before launch */
import { serviceArea } from "./service-area";

export const siteConfig = {
  domain: "climaporto.pt",
  brand: "Porto Clima",
  /** Update when business email is live */
  contactEmail: "contacto@climaporto.pt",
  serviceAreaLabelPt: serviceArea.labelPt,
  serviceAreaLabelEn: serviceArea.labelEn,
  waitlistSlots: 20,
  /** Formspree form id — create at https://formspree.io → submissions go to your email */
  formspreeId: "xnjkedeo",
  /** E.164 without + for wa.me — separate channel, opens WhatsApp app, not Formspree */
  whatsapp: "351900000000",
  /** Set to true when whatsapp is a real E.164 number (not placeholder) */
  whatsappEnabled: false,
  /** Plausible — leave empty to disable until domain is live */
  plausibleDomain: "climaporto.pt",
  /** GA4 — optional fallback; leave empty to use Plausible only */
  ga4Id: "",
} as const;
