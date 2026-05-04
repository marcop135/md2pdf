// Renders docs/og-img.svg -> public/static/og-img.png at 1200x630 (the
// Open Graph standard) so social link previews unfurl with the proper
// dimensions and stay under WhatsApp's ~600KB unfurl ceiling.
//
// docs/readme-hero.png is the README screenshot (different aspect ratio,
// version chip baked in). It is intentionally NOT used for og:image
// anymore — they have separate purposes.
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcPath = join(root, 'docs/og-img.svg');
const outPath = join(root, 'public/static/og-img.png');

if (!existsSync(srcPath)) {
  console.error(`sync-hero: source missing: ${srcPath}`);
  process.exit(1);
}

const srcMtime = statSync(srcPath).mtimeMs;
const outMtime = existsSync(outPath) ? statSync(outPath).mtimeMs : 0;
if (outMtime >= srcMtime) {
  console.log('sync-hero: og-img already up to date');
  process.exit(0);
}

mkdirSync(dirname(outPath), { recursive: true });
const svg = readFileSync(srcPath);
const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  background: '#0d6efd',
}).render().asPng();

writeFileSync(outPath, png);
const kb = (png.length / 1024).toFixed(1);
console.log(`sync-hero: rendered docs/og-img.svg -> public/static/og-img.png (${kb} KB)`);
