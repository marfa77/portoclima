import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "./i18n";

export type GuideEntry = CollectionEntry<"guidesPt"> | CollectionEntry<"guidesEn">;

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

export function guidePath(locale: Locale, slug: string): string {
  return locale === "pt" ? `/guias/${slug}/` : `/en/guides/${slug}/`;
}

export function guidesIndexPath(locale: Locale): string {
  return locale === "pt" ? "/guias/" : "/en/guides/";
}

export function guideOgImage(heroImage: string): string {
  return heroImage.startsWith("/") ? heroImage : `/${heroImage}`;
}
