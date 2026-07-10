import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const guideSchema = z.object({
  title: z.string(),
  seo_title: z.string().max(65),
  seo_description: z.string().min(145).max(165),
  excerpt: z.string(),
  quick_answer: z.string().min(80),
  translation_key: z.string(),
  related_keys: z.array(z.string()).min(2).max(4),
  tags: z.array(z.string()).min(5).max(8),
  primary_intent: z.enum(["informational", "comparison", "checklist"]),
  districts: z.array(z.string()).default([]),
  estimated_minutes: z.number().int().positive(),
  date_published: z.coerce.date(),
  date_modified: z.coerce.date(),
  hero_image: z.string(),
  hero_credit: z
    .object({
      photographer: z.string(),
      url: z.string().url(),
    })
    .optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).min(5).max(8),
  official_sources: z.array(z.object({ url: z.string().url(), label: z.string() })).min(3),
  llm_facts: z.array(z.string()).min(6).max(10),
});

export const guidesPt = defineCollection({
  loader: glob({ base: "./src/content/guides/pt", pattern: "**/*.md" }),
  schema: guideSchema,
});

export const guidesEn = defineCollection({
  loader: glob({ base: "./src/content/guides/en", pattern: "**/*.md" }),
  schema: guideSchema,
});

export const collections = {
  guidesPt,
  guidesEn,
};
