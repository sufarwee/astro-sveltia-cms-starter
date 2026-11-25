// After `astro build`: write the phone crop of hero slide 1 that index.astro references (see src/lib/hero-mobile.mjs).
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import sharp from "sharp";
import { heroMobilePath, positionFraction, HERO_MOBILE_ASPECT, PHONE_ASPECT } from "../src/lib/hero-mobile.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const slide = JSON.parse(readFileSync(join(root, "src/data/hero.json"), "utf8")).slides[0];
const src = join(dist, slide.image.replace(/^\.?\//, ""));
if (!existsSync(src)) throw new Error("hero slide 1 image not in dist: " + slide.image);

const img = sharp(src);
const { width: W, height: H } = await img.metadata();
// Centre of the strip a portrait phone sees with the desktop background-position
const stripW = Math.min(W, Math.round(H * PHONE_ASPECT));
const centre = (W - stripW) * positionFraction(slide.position) + stripW / 2;
const cw = Math.min(W, Math.round(H * HERO_MOBILE_ASPECT));
const left = Math.round(Math.min(W - cw, Math.max(0, centre - cw / 2)));

const out = join(dist, heroMobilePath(slide).slice(1));
const info = await img.extract({ left, top: 0, width: cw, height: H }).webp({ quality: 72 }).toFile(out);
if (!info.size || info.size < 1000) throw new Error("hero mobile crop looks empty");
console.log(`hero mobile: ${slide.image} ${W}x${H} -> ${heroMobilePath(slide)} ${cw}x${H} ${Math.round(info.size / 1024)} KB`);
