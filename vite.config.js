import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Security policy for the production page. Static hosting may not let you set
// HTTP headers, so the parts a page can enforce itself go in <meta> tags.
// (frame-ancestors, X-Frame-Options, X-Content-Type-Options and HSTS only work
// as real HTTP headers; see the deploy notes.) Added at build time only: the
// dev server injects inline scripts this policy would block.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  // React writes inline style attributes; Google Fonts serves the CSS.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

const securityMeta = () => ({
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml: () => [
    { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
    { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
  ],
})

export default defineConfig({
  plugins: [react(), securityMeta()],
  // Relative asset URLs: the build works from a domain root or a sub-folder,
  // whichever the static host serves it from.
  base: './',
  build: {
    sourcemap: false, // don't publish source maps
  },
  server: {
    port: 5173,
    open: true,
  },
})
