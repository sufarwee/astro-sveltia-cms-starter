import type { APIRoute } from "astro";
import { fillTokens } from "../lib/contact";
import template from "../data/llms.txt.tpl?raw";

export const GET: APIRoute = () =>
  new Response(fillTokens(template, "{{", "}}"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
