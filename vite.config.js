import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { site, absolute } from './site.config.js'

// Security policy for the production page. Zoho Catalyst Slate documents no
// way to set HTTP response headers, so the parts a page can enforce itself go
// in <meta> tags. (frame-ancestors, X-Frame-Options, X-Content-Type-Options,
// HSTS and Permissions-Policy only work as real HTTP headers; see
// DEPLOYMENT.md.) Added at build time only: the dev server injects inline
// scripts this policy would block.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  // React writes inline style attributes and index.html has one small <style>.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

// Placed right after <meta charset>, which must stay first in <head>, and
// before any script or stylesheet the policy has to cover.
const securityMeta = () => ({
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml: (html) => {
    const charset = '<meta charset="UTF-8" />'
    if (!html.includes(charset)) throw new Error('security-meta: <meta charset="UTF-8" /> not found in index.html')
    return html.replace(charset, `${charset}
    <meta http-equiv="Content-Security-Policy" content="${CSP}">
    <meta name="referrer" content="strict-origin-when-cross-origin">`)
  },
})

// Structured data: a ProfilePage about one Person, on one WebSite. Every
// value is also visible on the page.
const jsonLd = () => {
  const url = absolute('/')
  const person = {
    '@type': 'Person',
    '@id': `${url}#person`,
    name: site.name,
    givenName: site.firstName,
    familyName: site.lastName,
    jobTitle: site.jobTitle,
    url,
    image: absolute(site.ogImage),
    email: `mailto:${site.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    alumniOf: { '@type': 'CollegeOrUniversity', name: site.alumniOf },
    knowsAbout: site.knowsAbout,
    hasCredential: site.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: c.issuer },
      dateCreated: c.year,
    })),
    sameAs: site.sameAs,
  }
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${url}#website`, url, name: site.name, description: site.description, inLanguage: 'en' },
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profilepage`,
        url,
        name: site.title,
        description: site.description,
        inLanguage: 'en',
        isPartOf: { '@id': `${url}#website` },
        about: { '@id': `${url}#person` },
        mainEntity: { '@id': `${url}#person` },
        dateModified: new Date().toISOString().slice(0, 10),
      },
      person,
    ],
  }
  // "</" can't appear inside a <script> element.
  return JSON.stringify(data, null, 2).replace(/<\//g, '<\\/')
}

// Title, description, canonical, social cards, icons and JSON-LD, all from
// site.config.js so the domain is set in one place.
// Vite writes tag text and attribute values as given, so escape them here.
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const seoHead = () => ({
  name: 'seo-head',
  transformIndexHtml: () => {
    const url = absolute('/')
    const image = absolute(site.ogImage)
    const escaped = (attrs) => Object.fromEntries(Object.entries(attrs).map(([k, v]) => [k, escapeHtml(v)]))
    const meta = (attrs) => ({ tag: 'meta', attrs: escaped(attrs), injectTo: 'head' })
    const link = (attrs) => ({ tag: 'link', attrs: escaped(attrs), injectTo: 'head' })
    return [
      { tag: 'title', children: escapeHtml(site.title), injectTo: 'head' },
      meta({ name: 'description', content: site.description }),
      meta({ name: 'author', content: site.name }),
      meta({ name: 'robots', content: 'index, follow, max-image-preview:large' }),
      meta({ name: 'theme-color', content: site.themeColor }),
      link({ rel: 'canonical', href: url }),
      meta({ property: 'og:type', content: 'profile' }),
      meta({ property: 'og:site_name', content: site.name }),
      meta({ property: 'og:title', content: site.title }),
      meta({ property: 'og:description', content: site.description }),
      meta({ property: 'og:url', content: url }),
      meta({ property: 'og:image', content: image }),
      meta({ property: 'og:image:type', content: 'image/png' }),
      meta({ property: 'og:image:width', content: '1200' }),
      meta({ property: 'og:image:height', content: '630' }),
      meta({ property: 'og:image:alt', content: site.ogImageAlt }),
      meta({ property: 'og:locale', content: site.locale }),
      meta({ property: 'profile:first_name', content: site.firstName }),
      meta({ property: 'profile:last_name', content: site.lastName }),
      meta({ name: 'twitter:card', content: 'summary_large_image' }),
      meta({ name: 'twitter:title', content: site.title }),
      meta({ name: 'twitter:description', content: site.description }),
      meta({ name: 'twitter:image', content: image }),
      meta({ name: 'twitter:image:alt', content: site.ogImageAlt }),
      link({ rel: 'icon', href: './favicon.ico', sizes: '32x32' }),
      link({ rel: 'icon', href: './favicon.svg', type: 'image/svg+xml' }),
      link({ rel: 'apple-touch-icon', href: './apple-touch-icon.png' }),
      link({ rel: 'manifest', href: './site.webmanifest' }),
      { tag: 'script', attrs: { type: 'application/ld+json' }, children: jsonLd(), injectTo: 'head' },
    ]
  },
})

export default defineConfig({
  plugins: [react(), seoHead(), securityMeta()],
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
