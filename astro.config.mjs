// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://climaporto.pt",
  trailingSlash: "always",
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "pt",
        locales: { pt: "pt-PT", en: "en" },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
