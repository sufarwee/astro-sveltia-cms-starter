import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import settings from "../data/settings.json";
import hero from "../data/hero.json";
import standards from "../data/standards.json";
import gallery from "../data/gallery.json";
import homeSchema from "../schema/home.json";

// Generated on every build: new blog posts, videos, and gallery photos are included automatically
const SITE = new URL(settings.canonicalUrl).origin;
const abs = (path: string) => {
  if (!path) return "";
  const cleaned = path.replace("__SITE__", SITE).replace(/^\.\//, "/");
  return new URL(cleaned, SITE).href;
};

const esc = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const day = (d: string | Date | undefined) =>
  d ? (typeof d === "string" ? d : d.toISOString()).slice(0, 10) : undefined;

function parseDurationSeconds(duration = ""): number | undefined {
  const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;
  const minutes = parseInt(match[1] || "0", 10);
  const seconds = parseInt(match[2] || "0", 10);
  return minutes * 60 + seconds;
}

const img = (loc: string, title = "") =>
  `    <image:image>\n      <image:loc>${esc(abs(loc))}</image:loc>${title ? `\n      <image:title>${esc(title)}</image:title>` : ""}\n    </image:image>`;

const vid = (v: any) => {
  const contentUrl = abs(v.contentUrl);
  const thumbnailUrl = abs(v.thumbnailUrl);
  const durationSec = parseDurationSeconds(v.duration);
  const parts = [
    `    <video:video>`,
    `      <video:thumbnail_loc>${esc(thumbnailUrl)}</video:thumbnail_loc>`,
    `      <video:title>${esc(v.name || "")}</video:title>`,
    `      <video:description>${esc(v.description || "")}</video:description>`,
    `      <video:content_loc>${esc(contentUrl)}</video:content_loc>`,
  ];
  if (durationSec) {
    parts.push(`      <video:duration>${durationSec}</video:duration>`);
  }
  if (v.uploadDate) {
    parts.push(`      <video:publication_date>${esc(v.uploadDate)}</video:publication_date>`);
  }
  parts.push(`      <video:family_friendly>yes</video:family_friendly>`);
  parts.push(`    </video:video>`);
  return parts.join("\n");
};

function renderUrl(loc: string, lastmod?: string, extras: string[] = []) {
  const lines = [`  <url>`, `    <loc>${esc(loc)}</loc>`];
  if (lastmod) {
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
  }
  if (extras.length) {
    lines.push(extras.join("\n"));
  }
  lines.push(`  </url>`);
  return lines.join("\n");
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog", (p) => settings.blogEnabled !== false && p.data.published))
    .map((p) => ({ p, mod: day(p.data.updatedDate) || day(p.data.pubDate) }))
    .sort((a, b) => (b.mod || "").localeCompare(a.mod || ""));

  const today = new Date().toISOString().slice(0, 10);

  // Extract and format videos from Schema.org VideoObjects
  const rawVideos = (homeSchema[0]?.["@graph"] || []).filter((x: any) => x["@type"] === "VideoObject");
  const homeVideos = rawVideos.map(vid);

  // Collect and deduplicate images
  const rawHomeImages = [
    ...hero.slides.map((s) => ({ loc: s.image, title: s.name })),
    ...standards.images.map((s) => ({ loc: s.image, title: s.alt })),
    ...gallery.items.filter((g) => g.type === "image").map((g) => ({ loc: g.src, title: g.altTh || g.th })),
  ];

  const seenImages = new Set<string>();
  const homeImages: string[] = [];
  for (const { loc, title } of rawHomeImages) {
    if (!loc) continue;
    const absUrl = abs(loc);
    if (!seenImages.has(absUrl)) {
      seenImages.add(absUrl);
      homeImages.push(img(loc, title));
    }
  }

  const urlBlocks = [
    renderUrl(`${SITE}/`, today, [...homeVideos, ...homeImages]),
    ...(posts.length ? [renderUrl(`${SITE}/blog/`, posts[0].mod)] : []),
    ...posts.map(({ p, mod }) =>
      renderUrl(
        `${SITE}/blog/${p.slug}/`,
        mod,
        p.data.coverImage ? [img(p.data.coverImage, p.data.coverAlt)] : []
      )
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlBlocks.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
