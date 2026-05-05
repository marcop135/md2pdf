// Renders social preview SVGs to PNG.
//
//  - docs/og-img.svg          -> public/static/og-img.png  (1200x630, og:image)
//  - docs/github-social.svg   -> docs/github-social-preview.png  (1280x640)
//
// The og:image (1200x630) is the Open Graph standard so unfurls render with
// the proper dimensions and stay under WhatsApp's ~600KB unfurl ceiling.
// The GitHub repo social preview is 1280x640 (no CTA — context already gives
// the user the "click to view repo" affordance).
//
// docs/readme-hero.png is the README screenshot (different aspect ratio).
// It is intentionally NOT used for og:image — separate purposes.
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const targets = [
  {
    src: join(root, 'docs/og-img.svg'),
    out: join(root, 'public/static/og-img.png'),
    width: 1200,
  },
  {
    src: join(root, 'docs/github-social.svg'),
    out: join(root, 'docs/github-social-preview.png'),
    width: 1280,
  },
];

for (const { src, out, width } of targets) {
  if (!existsSync(src)) {
    console.error(`sync-hero: source missing: ${src}`);
    process.exit(1);
  }

  const srcMtime = statSync(src).mtimeMs;
  const outMtime = existsSync(out) ? statSync(out).mtimeMs : 0;
  if (outMtime >= srcMtime) {
    console.log(`sync-hero: ${out} already up to date`);
    continue;
  }

  mkdirSync(dirname(out), { recursive: true });
  const svg = readFileSync(src);
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: '#0d6efd',
  }).render().asPng();

  writeFileSync(out, png);
  const kb = (png.length / 1024).toFixed(1);
  console.log(`sync-hero: rendered ${src} -> ${out} (${kb} KB)`);
}
