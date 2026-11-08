// Draws the share image and the icons in code, then exports the PNG and ICO
// files into public/. Run it again after changing the name, title or colours:
//   node scripts/generate-images.mjs
// Text is drawn with the system's fonts (Segoe UI / Consolas on Windows,
// falling back to any sans and monospace face), so no image files are needed.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../site.config.js';

const pub = fileURLToPath(new URL('../public/', import.meta.url));
const C = { bg: '#070a14', surface: '#0e1426', ink: '#eef2ff', muted: '#aeb8d6', cyan: '#22d3ee', lime: '#bef264', onLime: '#0a1200', green: '#34d399' };
const SANS = "'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO = "Consolas, 'JetBrains Mono', 'DejaVu Sans Mono', monospace";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- Share image, 1200 x 630 ----------
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <g stroke="${C.cyan}" stroke-opacity="0.07" stroke-width="1">
    ${Array.from({ length: 19 }, (_, i) => `<line x1="${i * 64 + 16}" y1="0" x2="${i * 64 + 16}" y2="630"/>`).join('')}
    ${Array.from({ length: 10 }, (_, i) => `<line x1="0" y1="${i * 64 + 27}" x2="1200" y2="${i * 64 + 27}"/>`).join('')}
  </g>
  <rect x="64" y="64" width="1072" height="502" rx="28" fill="${C.surface}"/>
  <circle cx="104" cy="104" r="8" fill="#f43f5e" fill-opacity="0.85"/>
  <circle cx="130" cy="104" r="8" fill="#f59e0b" fill-opacity="0.85"/>
  <circle cx="156" cy="104" r="8" fill="#10b981" fill-opacity="0.85"/>
  <text x="112" y="196" font-family="${MONO}" font-size="30" fill="${C.cyan}">$ <tspan fill="${C.ink}">whoami</tspan></text>
  <text x="108" y="306" font-family="${SANS}" font-size="104" font-weight="800" letter-spacing="-3" fill="${C.ink}">${esc(site.name)}</text>
  <text x="112" y="380" font-family="${SANS}" font-size="50" font-weight="700" fill="${C.cyan}">${esc(site.jobTitle)}</text>
  <text x="112" y="444" font-family="${SANS}" font-size="32" fill="${C.muted}">AWS · Terraform · Docker · CI/CD · ECS &amp; Fargate</text>
  <rect x="112" y="478" width="292" height="56" rx="28" fill="${C.lime}"/>
  <circle cx="146" cy="506" r="9" fill="${C.onLime}"/>
  <text x="168" y="517" font-family="${SANS}" font-size="30" font-weight="700" fill="${C.onLime}">Open to Work</text>
  <text x="1088" y="517" text-anchor="end" font-family="${SANS}" font-size="28" fill="${C.muted}">${esc(site.address.locality)}, India</text>
</svg>
`;

// ---------- Icon: a terminal prompt ">_" on the page's ink ----------
const icon = (size, { rounded = true, pad = 0 } = {}) => {
  const s = size;
  const r = rounded ? s * 0.22 : 0;
  // Drawn on a 64-unit grid, scaled to the size asked for.
  const k = (s - pad * 2) / 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${r}" fill="${C.bg}"/>
  <g transform="translate(${pad} ${pad}) scale(${k})" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21 L31 32 L17 43" stroke="${C.cyan}" stroke-width="6.5"/>
    <path d="M35 44 H48" stroke="${C.lime}" stroke-width="6.5"/>
  </g>
</svg>
`;
};

const png = (svg, width) => new Resvg(svg, {
  fitTo: { mode: 'width', value: width },
  font: { loadSystemFonts: true, defaultFontFamily: 'Arial' },
}).render().asPng();

// ICO with PNG entries (supported by every current browser and Windows).
const ico = (images) => {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((im) => im.data)]);
};

await writeFile(join(pub, 'og-image.svg'), og);
await writeFile(join(pub, 'og-image.png'), png(og, 1200));
await writeFile(join(pub, 'favicon.svg'), icon(64));
// Apple and maskable icons: full square, padded so the mark survives cropping.
await writeFile(join(pub, 'apple-touch-icon.png'), png(icon(180, { rounded: false, pad: 18 }), 180));
await writeFile(join(pub, 'icon-192.png'), png(icon(192, { rounded: false, pad: 24 }), 192));
await writeFile(join(pub, 'icon-512.png'), png(icon(512, { rounded: false, pad: 64 }), 512));
await writeFile(join(pub, 'favicon.ico'), ico([16, 32, 48].map((size) => ({ size, data: png(icon(size), size) }))));
console.log('images: og-image.svg/png, favicon.svg/ico, apple-touch-icon.png, icon-192.png, icon-512.png');
