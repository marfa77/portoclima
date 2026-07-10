import type { Locale } from "./i18n";

export function privacyPath(locale: Locale): string {
  return locale === "pt" ? "/privacidade/" : "/en/privacy/";
}

export function privacyCookiesAnchor(locale: Locale): string {
  return `${privacyPath(locale)}#cookies`;
}
