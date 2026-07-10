import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "./i18n";

export type GuideEntry = CollectionEntry<"guidesPt"> | CollectionEntry<"guidesEn">;

/** translation_key → slug per locale */
export const GUIDE_SLUGS: Record<string, { pt: string; en: string }> = {
  "portable-ac-porto-2026": {
    pt: "ar-condicionado-movel-porto-2026",
    en: "portable-ac-porto-2026",
  },
  "rented-apartment-ac-porto": {
    pt: "ar-condicionado-apartamento-arrendado-porto",
    en: "portable-ac-rented-apartment-porto",
  },
  "porto-summer-heat-comfort": {
    pt: "verao-porto-temperatura-humidade",
    en: "porto-summer-heat-humidity-comfort",
  },
  "portable-vs-split-porto": {
    pt: "ar-condicionado-movel-vs-split-porto",
    en: "portable-vs-split-ac-porto",
  },
};

const collectionFor = (locale: Locale) => (locale === "pt" ? "guidesPt" : "guidesEn") as const;

export async function getGuides(locale: Locale): Promise<GuideEntry[]> {
  const col = collectionFor(locale);
  const guides = await getCollection(col);
  return guides.sort(
    (a, b) => b.data.date_modified.getTime() - a.data.date_modified.getTime(),
  );
}

export async function getGuideBySlug(locale: Locale, slug: string): Promise<GuideEntry | undefined> {
  const guides = await getGuides(locale);
  return guides.find((g) => g.id === slug);
}

export async function getGuideAlternate(
  entry: GuideEntry,
  locale: Locale,
): Promise<GuideEntry | undefined> {
  const altLocale: Locale = locale === "pt" ? "en" : "pt";
  const altGuides = await getGuides(altLocale);
  return altGuides.find((g) => g.data.translation_key === entry.data.translation_key);
}

export async function getRelatedGuides(
  entry: GuideEntry,
  locale: Locale,
): Promise<GuideEntry[]> {
  const guides = await getGuides(locale);
  const keys = entry.data.related_keys ?? [];
  return keys
    .map((key) => guides.find((g) => g.data.translation_key === key))
    .filter((g): g is GuideEntry => Boolean(g));
}

export function guidePath(locale: Locale, slug: string): string {
  return locale === "pt" ? `/guias/${slug}/` : `/en/guides/${slug}/`;
}

export function guidePathByKey(locale: Locale, translationKey: string): string {
  const slug = GUIDE_SLUGS[translationKey]?.[locale];
  return slug ? guidePath(locale, slug) : guidesIndexPath(locale);
}

export function guidesIndexPath(locale: Locale): string {
  return locale === "pt" ? "/guias/" : "/en/guides/";
}

export function guideOgImage(heroImage: string): string {
  return heroImage.startsWith("/") ? heroImage : `/${heroImage}`;
}
