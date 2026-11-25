import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import settings from "./src/data/settings.json";

// The site's public domain lives in one place: settings.json -> canonicalUrl (editable in the CMS)
export default defineConfig({
  site: settings.canonicalUrl,
  integrations: [tailwind()],
  // Inline Astro's small CSS files into the HTML (they were separate render-blocking requests); position/order is unchanged
  build: { inlineStylesheets: "always" },
});
