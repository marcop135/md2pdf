import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const outDir = join(publicDir, 'icons');

const targets = [
  { src: 'favicon.svg', out: 'icon-192.png', size: 192 },
  { src: 'favicon.svg', out: 'icon-512.png', size: 512 },
  { src: 'favicon-maskable.svg', out: 'icon-maskable-512.png', size: 512 },
];

mkdirSync(outDir, { recursive: true });

let regenerated = 0;
for (const { src, out, size } of targets) {
  const srcPath = join(publicDir, src);
  const outPath = join(outDir, out);
  if (!existsSync(srcPath)) {
    console.error(`sync-icons: source missing: ${srcPath}`);
    process.exit(1);
  }
  const srcMtime = statSync(srcPath).mtimeMs;
  const outMtime = existsSync(outPath) ? statSync(outPath).mtimeMs : 0;
  if (outMtime >= srcMtime) continue;

  const svg = readFileSync(srcPath);
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'rgba(0,0,0,0)',
  })
    .render()
    .asPng();
  writeFileSync(outPath, png);
  regenerated += 1;
  console.log(`sync-icons: rendered ${src} -> icons/${out} (${size}x${size})`);
}

if (regenerated === 0) {
  console.log('sync-icons: icons already up to date');
}
