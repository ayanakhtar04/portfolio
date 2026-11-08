// Runs after `vite build` and `vite build --ssr`: puts the rendered page into
// dist/index.html, preloads the critical font, and writes sitemap.xml,
// robots.txt and 404.html. Every URL comes from site.config.js.
import { readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { site, absolute } from '../site.config.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

// 1. Render the app and put it inside #root. The page script replaces this
// markup when it starts; until then it stays hidden (CSS in index.html), so
// the switch to the scroll stage never shows as a layout shift.
const { render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const appHtml = render();
let html = await readFile(join(dist, 'index.html'), 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
html = html.replace('<div id="root"></div>', `<div id="root" data-prerendered>${appHtml}</div>`);

// 2. Preload the one font file the first screen's body text needs.
const assets = await readdir(join(dist, 'assets'));
const bodyFont = assets.find((f) => /^inter-latin-400-normal-.*\.woff2$/.test(f));
if (bodyFont) {
  html = html.replace('</title>', `</title>\n    <link rel="preload" href="./assets/${bodyFont}" as="font" type="font/woff2" crossorigin>`);
}
await writeFile(join(dist, 'index.html'), html);

// 3. Sitemap from the routes that exist (one page today), dated by this build.
const routes = ['/'];
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url>\n    <loc>${absolute(r)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`);

// 4. A small, self-contained 404 page (no script, works even if assets move).
const notFound = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="${site.themeColor}" />
    <title>Page not found | ${site.name}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px;
        background: #070a14; color: #eef2ff; font: 18px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; }
      main { max-width: 34rem; }
      p.code { margin: 0 0 12px; font: 600 15px/1.4 ui-monospace, "Cascadia Code", Consolas, monospace; color: #22d3ee; }
      h1 { margin: 0 0 12px; font-size: clamp(32px, 6vw, 48px); line-height: 1.05; letter-spacing: -0.03em; }
      p { margin: 0 0 28px; color: #aeb8d6; }
      a.btn { display: inline-block; padding: 13px 22px; border-radius: 12px; background: #bef264; color: #0a1200;
        font-weight: 700; text-decoration: none; }
      a.btn:focus-visible { outline: 2px solid #22d3ee; outline-offset: 3px; }
      nav a { color: #eef2ff; }
    </style>
  </head>
  <body>
    <main>
      <p class="code">$ curl ${new URL(site.url).host}/this-page<br>404 Not Found</p>
      <h1>This page doesn&rsquo;t exist.</h1>
      <p>The link may be old or mistyped. Everything about my work as a DevOps &amp; Cloud Engineer is on the home page.</p>
      <a class="btn" href="/">Go to the home page</a>
    </main>
  </body>
</html>
`;
await writeFile(join(dist, '404.html'), notFound);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: index.html (${Math.round(appHtml.length / 1024)} KB of HTML), sitemap.xml, robots.txt, 404.html${bodyFont ? `, preload ${bodyFont}` : ''}`);
