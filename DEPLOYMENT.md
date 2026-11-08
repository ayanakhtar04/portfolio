# Deploying to Zoho Catalyst Slate

The site is a static React + Vite build. `npm run build` writes everything to `dist/`:
the pre-rendered `index.html`, hashed assets, `404.html`, `sitemap.xml`, `robots.txt`,
icons, the share image and the résumé PDF. No server, runtime or environment variables
are needed.

| Setting | Value |
| --- | --- |
| Framework | Vite (or React) |
| Node.js | 22 |
| Install command | `npm install` (or `npm ci`) |
| Build command | `npm run build` |
| Output / build path | `dist` |

Every step below follows the official Slate docs, which are linked in each section.
Where the docs say nothing about a feature, this file says so and doesn't guess.

## 0. Before the first deploy

- Set the real domain in **`site.config.js`** (`SITE_URL`). Every canonical URL, social
  card URL, the sitemap and `robots.txt` are built from it.
- Commit and push. Slate's Git deploy builds what is on the branch, not your working copy.

## 1. Install the Catalyst CLI and log in

Docs: [Installing the Catalyst CLI](https://docs.catalyst.zoho.com/en/getting-started/installing-catalyst-cli/),
[Login from CLI](https://docs.catalyst.zoho.com/en/cli/v1/login/login-from-cli/)

```bash
npm install -g zcatalyst-cli
```

```bash
catalyst --version
```

```bash
catalyst login
```

`catalyst login` asks about error reporting, then for a data centre (US, EU, IN, JP, SA,
AU or CA). Finish signing in in the browser and click **Accept**.

## 2. Create a project and link this app to Slate

Docs: [Slate quick start](https://docs.catalyst.zoho.com/en/slate/help/quick-start-guide/),
[Deploy from CLI](https://docs.catalyst.zoho.com/en/slate/help/deploy-from-cli/)

1. Create a project in the [Catalyst console](https://console.catalyst.zoho.com/) first.
2. From the repository root, link the existing app (don't use `catalyst init slate`: it
   downloads a boilerplate template):

   ```bash
   catalyst slate:link
   ```

3. Pick the source path (the repo root) and a name. When the CLI shows the detected
   install command, build command and build path, answer **Y** to change them if they
   differ from the table above, and make sure the build path is `dist`.

The CLI records the app in `catalyst.json` and the dev command in `cli-config.json`.

## 3. Deploy from the CLI

Docs: [Deploy from CLI](https://docs.catalyst.zoho.com/en/slate/help/deploy-from-cli/)

```bash
catalyst deploy slate -m "First deploy"
```

This deploys to the development environment. Once production is set up in the console:

```bash
catalyst deploy slate --production
```

## 4. Auto-deploy from GitHub on push to `main`

Docs: [Deploy from a private repository](https://docs.catalyst.zoho.com/en/slate/help/git-integration/deploy-from-private-repository/)

1. In the console, open **Catalyst Slate**, click **Start Exploring** and choose **GitHub**.
2. In **Catalyst Settings > Git Integration**, click **Add Account**, then **Agree**, and
   authorise access to `ayanakhtar04/portfolio`.
3. Click the repository to open **Create Deployment**. Select the branch **`main`** and
   enter a deployment name.
4. Framework: **Vite**. Node runtime: **Node.js 22**. Root path: the repository root.
5. Turn on **Auto Deploy**. Every push to `main` then builds and deploys. It applies to
   the branch, not to deployments pinned to a single commit.
6. Check the output path (`dist`), build command (`npm run build`) and install command,
   then click **Deploy**.

Pull requests are checked by `.github/workflows/ci.yml` (lint, build, HTML validation,
link check, Lighthouse). Deployment itself stays with Slate.

To change the Node version later: **App Settings > Framework and command > General Details >
Edit > Update**, then redeploy. Changing it doesn't rebuild on its own
([Monitor deployment](https://docs.catalyst.zoho.com/en/slate/help/monitor-deployment/)).

## 5. Map the custom domain

Docs: [Custom domains](https://docs.catalyst.zoho.com/en/slate/help/custom-domains/)

The domain has to be registered and live first. One custom domain can be mapped per app.

1. On the app's **Deployment Overview**, in **Domain Mapping**, click **Add Domain**.
2. Enter the domain (for example `ayanakhtar.dev`) and click **Next**.
3. At your DNS provider, add the **first CNAME record** the console shows, then click
   **Verify**. Once verified, add the **second CNAME record** and click **Verify** again,
   then **Next**. The record values appear only in the console.
4. **Root domain caveat:** most DNS providers don't allow a CNAME on the root (`@`) of a
   domain. If yours doesn't, either use a provider with CNAME flattening, ALIAS or ANAME
   records, or map `www.ayanakhtar.dev` and change `SITE_URL` to match. The Slate docs
   don't cover this.

## 6. SSL for the custom domain

Docs: [Custom domains](https://docs.catalyst.zoho.com/en/slate/help/custom-domains/)

After the domain verifies, click **Request** to request the **Group SSL certificate**.
Catalyst issues and activates it within 48 hours and renews it automatically. Only
Zoho's certificate can be used for a mapped domain. You'll get email updates on the
mapping.

## What Slate doesn't document

None of the following appears in the Slate docs (checked November 2026). The site
doesn't depend on any of them:

| Feature | Status | What the site does instead |
| --- | --- | --- |
| Custom response headers | Not documented | `Content-Security-Policy` and `Referrer-Policy` are set with `<meta>` tags (vite.config.js). |
| `Strict-Transport-Security`, `X-Content-Type-Options`, `Permissions-Policy`, `frame-ancestors` / `X-Frame-Options` | Not documented, and they only work as real HTTP headers | **Not set.** Ask Zoho support whether Slate can add headers, or put a proxy/CDN that can in front of it. Check first that this doesn't break Slate's domain verification and SSL. |
| `Cache-Control` rules | Only an on/off cache toggle, on by default ([Cache](https://docs.catalyst.zoho.com/en/slate/help/cache/)) | Asset file names are content-hashed (`assets/index-[hash].js`), so they're safe to cache long-term. HTML can't be given a short cache from config. |
| Redirects (www to non-www) | Not documented | The canonical tag tells search engines which host to index. If you want a hard redirect, use your registrar's URL forwarding for the host you don't map. |
| SPA fallback | Not documented | Not needed: the site has a single route (`/`). |
| Custom 404 page | Not documented | `dist/404.html` is built (self-contained, `noindex`). After deploying, open `https://<domain>/does-not-exist` to see whether Slate serves it. |

## Changing the domain later

1. Edit `SITE_URL` in `site.config.js`.
2. Run `npm run build` (or push to `main`). Canonical URLs, social card URLs, JSON-LD,
   the sitemap and `robots.txt` all update.
3. The share image doesn't contain the domain. Regenerate it with
   `node scripts/generate-images.mjs` only if you change the name, title or colours.
