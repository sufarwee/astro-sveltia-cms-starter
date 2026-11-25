// Phone-sized crop of hero slide 1 (made by scripts/hero-mobile.mjs after `astro build`).
// Phones show only a narrow portrait strip of the 16:9 hero, so they get that strip instead of the full image.
import { createHash } from "node:crypto";

export const HERO_MOBILE_MAX = "(max-width: 600px)";
export const HERO_DESKTOP_MIN = "(min-width: 601px)";
// Crop is 3:4, a little wider than any portrait phone; phones show its middle
export const HERO_MOBILE_ASPECT = 0.75;
// Portrait phone viewport aspect used to find the strip the desktop CSS shows
export const PHONE_ASPECT = 0.59;

export const heroMobilePath = (slide) =>
  "/hero-m-" + createHash("sha1").update(slide.image + "|" + (slide.position || "center")).digest("hex").slice(0, 10) + ".webp";

// "67%" | "center" | "left" | "right" -> 0..1
export const positionFraction = (pos = "center") => {
  const p = String(pos).trim().split(/\s+/)[0];
  if (p.endsWith("%")) return Math.min(1, Math.max(0, parseFloat(p) / 100));
  return { left: 0, right: 1 }[p] ?? 0.5;
};
