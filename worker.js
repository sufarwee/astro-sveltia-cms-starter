export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Optional: set MAIN_DOMAIN to move everything on workers.dev (CMS included) to your domain.
    // The GitHub OAuth app's callback URL must be https://<your domain>/callback.
    const MAIN = env.MAIN_DOMAIN;
    if (MAIN && MAIN !== "xxxx" && url.hostname.endsWith(".workers.dev")) {
      return Response.redirect("https://" + MAIN + url.pathname + url.search, 301);
    }

    // 1. GitHub OAuth Login redirect
    if (url.pathname === '/auth') {
      const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
      githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      githubAuthUrl.searchParams.set('scope', 'repo,read:user');
      const state = crypto.randomUUID();
      githubAuthUrl.searchParams.set('state', state);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': githubAuthUrl.toString(),
          'Set-Cookie': `oauth_state=${state}; Path=/callback; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }

    // 2. GitHub OAuth Callback
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code parameter', { status: 400 });
      }

      const state = url.searchParams.get('state');
      const saved = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)oauth_state=([^;]+)/)?.[1];
      if (!state || state !== saved) {
        return new Response('Invalid OAuth state. Close this window and log in again.', { status: 403 });
      }

      try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'JinaServiceCMS'
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            // Encrypted Cloudflare secret (dashboard → Variables and Secrets), never stored in the repo
            client_secret: env.GITHUB_OAUTH_SECRET,
            code: code
          })
        });

        const data = await tokenResponse.json();
        if (data.error || !data.access_token) {
          const errDesc = data.error_description || data.error || 'Failed to get access token';
          return new Response(`OAuth Error: ${errDesc}`, { status: 400 });
        }

        const token = data.access_token;
        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>เข้าสู่ระบบสำเร็จ</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; text-align: center;">
  <h2 style="color: #059669;">✅ ยืนยันตัวตนกับ GitHub สำเร็จ</h2>
  <p style="color: #4b5563;">กำลังเชื่อมต่อไปยังระบบจัดการเว็บ (CMS)...</p>
  <script>
  (function() {
    function receiveMessage(e) {
      // Only hand the token to the CMS running on this same site
      if (e.data === "authorizing:github" && e.origin === window.location.origin) {
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify({ token: ${JSON.stringify(token)}, provider: 'github' }),
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
        setTimeout(function() { window.close(); }, 500);
      }
    }
    window.addEventListener("message", receiveMessage, false);
    if (window.opener) {
      window.opener.postMessage("authorizing:github", "*");
    }
  })();
  </script>
</body>
</html>`;

        return new Response(html, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      } catch (err) {
        return new Response(`Internal Error: ${err.message}`, { status: 500 });
      }
    }

    // 3. Static assets. HTML pages advertise llms.txt and the sitemap in a Link header (for AI agents);
    // an agent asking for Markdown (Accept: text/markdown) on the homepage gets llms-full.txt instead of HTML.
    const LINKS = '</llms.txt>; rel="describedby"; type="text/markdown", </llms-full.txt>; rel="alternate"; type="text/markdown", </sitemap.xml>; rel="sitemap"; type="application/xml"';
    if (url.pathname === "/" && /text\/markdown/i.test(request.headers.get("Accept") || "")) {
      const md = await env.ASSETS.fetch(new Request(new URL("/llms-full.txt", url), request));
      return new Response((await md.text()).replace(/^\uFEFF/, ""), {
        status: md.status,
        headers: { "Content-Type": "text/markdown; charset=utf-8", "Vary": "Accept", "Link": LINKS },
      });
    }
    const res = await env.ASSETS.fetch(request);
    const contentType = res.headers.get("Content-Type") || "";
    const out = new Response(res.body, res);
    out.headers.set("Content-Signal", "search=yes, ai-input=yes, ai-train=yes");
    if (!contentType.includes("text/html")) return out;
    out.headers.append("Link", LINKS);
    // Declare UTF-8 in the header too: without it Bing decoded the Thai text as Latin-1
    out.headers.set("Content-Type", "text/html; charset=utf-8");
    out.headers.append("Vary", "Accept");
    out.headers.set("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, must-revalidate");
    return out;
  }
};
