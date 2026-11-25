import type { APIRoute } from "astro";
import settings from "../data/settings.json";
import template from "../data/robots.txt.tpl?raw";

const SITE = new URL(settings.canonicalUrl).origin;
export const GET: APIRoute = () =>
  new Response(template.replaceAll("{{SITE}}", SITE), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
