// After `astro build`: drop unused rules from dist/gray-green.css, then minify it in place.
// It stays a plain <link> in the same position, so the CSS cascade order is unchanged
// (bundling it through Vite reordered it against Tailwind base, so we don't do that).
// Unused = a selector naming a class or id that appears nowhere in the built HTML/JS. Runs on every
// build, so classes added later through the CMS are kept automatically.
// shortcut: classes built by string concatenation in JS ("is-" + x) would be dropped; standalone.js only uses literals.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { transformSync } from "esbuild";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const file = join(dist, "gray-green.css");
const src = readFileSync(file, "utf8");

const words = new Set();
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(html|js|mjs)$/.test(e.name)) for (const w of readFileSync(p, "utf8").match(/[\w-]+/g) || []) words.add(w);
  }
};
walk(dist);

// Classes inside :not()/:is()/:has()... are ignored (".a:not(.x)" still matches when .x is unused)
const used = (sel) => [...sel.replace(/:[\w-]+\([^()]*(\([^()]*\)[^()]*)*\)/g, "").matchAll(/[.#]([\w-]+)/g)].every((m) => words.has(m[1]));
const root = postcss.parse(src);
let dropped = 0;
root.walkRules((rule) => {
  if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
  const keep = rule.selectors.filter(used);
  if (keep.length === rule.selectors.length) return;
  dropped += rule.selectors.length - keep.length;
  if (keep.length) rule.selectors = keep;
  else rule.remove();
});
root.walkAtRules("media", (at) => { if (!at.nodes?.length) at.remove(); });

const purged = root.toString();
const { code } = transformSync(purged, { loader: "css", minify: true });
if (!code || code.length > src.length || !code.includes("@keyframes")) throw new Error("gray-green.css purge/minify produced unexpected output");
writeFileSync(file, code);
console.log(`gray-green.css: ${src.length} -> ${code.length} bytes (${dropped} unused selectors dropped)`);

// Minify standalone.js in dist for PageSpeed JavaScript optimization
const jsFile = join(dist, "standalone.js");
try {
  const jsSrc = readFileSync(jsFile, "utf8");
  const jsMin = transformSync(jsSrc, { loader: "js", minify: true, charset: "utf8" }).code;
  writeFileSync(jsFile, jsMin);
  console.log(`standalone.js: ${jsSrc.length} -> ${jsMin.length} bytes (saved ${jsSrc.length - jsMin.length} bytes)`);
} catch (e) {
  console.warn("standalone.js minification skipped:", e.message);
}

// Inline both site stylesheets into every page at the <link>'s position (same cascade order), so first
// paint doesn't wait on two extra CSS requests. Relative url()s become absolute so /blog/ pages still resolve.
const absUrls = (css, cssPath) =>
  css.replace(/url\(\s*(['"]?)(?![a-z]+:|\/|#)([^'")]+)\1\s*\)/gi, (_, q, u) => `url(${q}${new URL(u, "https://x" + cssPath).pathname}${q})`);
const sheets = [...new Set(
  readdirSync(dist, { recursive: true }).filter((f) => f.endsWith(".html"))
    .flatMap((f) => [...readFileSync(join(dist, f), "utf8").matchAll(/<link rel="stylesheet" href="(\/(?:assets\/[\w.-]+\.css|gray-green\.css)[^"]*)">/g)].map((m) => m[1]))
)];
const inlineCss = Object.fromEntries(sheets.map((href) => {
  const path = href.split("?")[0];
  const css = transformSync(absUrls(readFileSync(join(dist, path), "utf8"), path), { loader: "css", minify: true }).code;
  if (css.includes("</style")) throw new Error(path + " contains </style");
  return [href, css];
}));
let pages = 0;
for (const f of readdirSync(dist, { recursive: true }).filter((f) => f.endsWith(".html"))) {
  const p = join(dist, f), html = readFileSync(p, "utf8");
  const out = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (tag, href) => (href in inlineCss ? `<style data-href="${href}">${inlineCss[href]}</style>` : tag));
  if (out !== html) { writeFileSync(p, out); pages++; }
}
console.log(`inlined ${sheets.length} stylesheet(s) into ${pages} page(s)`);
