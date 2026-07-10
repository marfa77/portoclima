import type pt from "../i18n/pt.json";
import en from "../i18n/en.json";
import ptDict from "../i18n/pt.json";

export type Locale = "pt" | "en";
export type Dictionary = typeof pt;

const dictionaries: Record<Locale, Dictionary> = {
  pt: ptDict,
  en,
};

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localePath(locale: Locale, hash = ""): string {
  const base = locale === "en" ? "/en/" : "/";
  return `${base}${hash}`;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "pt" ? "en" : "pt";
}
