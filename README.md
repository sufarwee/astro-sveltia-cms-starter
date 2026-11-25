# Astro + Sveltia CMS Starter

A real one-page business site with a blog, a customised Thai-language Sveltia CMS admin, and a Cloudflare Worker that handles GitHub login for the CMS.

**Stack:** Astro 4, Tailwind CSS 3, Sveltia CMS, Cloudflare Workers.

> The demo content is a real business (JINA SERVICE). Only the code is open source. Replace the content before you use it: see [TRADEMARKS.md](TRADEMARKS.md). The demo contact details are real, so do not deploy the site unchanged.

## Layout
| Path | What |
|---|---|
| `02-astro-version/src/` | Pages, components, editable data (`data/*.json`), blog posts |
| `02-astro-version/public/admin/` | CMS admin page and `config.yml` |
| `worker.js`, `wrangler.json` | Static hosting, CMS GitHub OAuth, headers for AI agents |
| `.github/` | Converts media uploaded through the CMS to WebP/WebM |

## Run locally
```bash
cd 02-astro-version
npm install
npm run dev
npm run build
```

## Set up (replace every `xxxx`)
| Where | Value |
|---|---|
| `02-astro-version/public/admin/config.yml` | `repo`: your `owner/repo`; `base_url`: your site URL; help links |
| `wrangler.json` | `name`: your Worker name; `GITHUB_CLIENT_ID`: from your GitHub OAuth app; `MAIN_DOMAIN`: your domain, or leave `xxxx` to stay on workers.dev |
| `02-astro-version/src/data/settings.json` | `gtmId`, `sentryKey` (`xxxx` = off), `canonicalUrl`, contact and business data |
| `02-astro-version/public/standalone.js` | Web3Forms `access_key` and fallback reply address for the contact form |
| `02-astro-version/src/layouts/BaseLayout.astro` | `msvalidate.01` (Bing verification), or delete the tag |

Also replace the sample licence image in `02-astro-version/public/documents/`.

### CMS login
1. Create a GitHub OAuth app with callback URL `https://<your domain>/callback`.
2. Add its secret to the Worker: `npx wrangler secret put GITHUB_OAUTH_SECRET`. **Never commit it.**
3. Deploy: `npm run build && npx wrangler deploy`
4. Open `https://<your domain>/admin/`.

The login asks for GitHub's `repo` scope, which covers all repositories the user can access. Limit who logs in, or change the scope in `worker.js` to fit your needs.

### Media workflow
It commits converted files back to `main`. Enable GitHub Actions in your copy to use it.

## License
Code: [Apache License 2.0](LICENSE). Keep the license and [NOTICE](NOTICE) when you redistribute it.
Brand and demo content are excluded: [TRADEMARKS.md](TRADEMARKS.md).
