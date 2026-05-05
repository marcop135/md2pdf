import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const outDir = join(publicDir, 'icons');

const targets = [
  { src: 'favicon.svg', out: join(outDir, 'icon-192.png'), size: 192 },
  { src: 'favicon.svg', out: join(outDir, 'icon-512.png'), size: 512 },
  { src: 'favicon-maskable.svg', out: join(outDir, 'icon-maskable-512.png'), size: 512 },
  // Legacy /favicon.ico for clients that still GET it (some unfurl bots,
  // older browsers, certain Slack/Discord versions). PNG-in-ICO container.
  { src: 'favicon.svg', out: join(publicDir, 'favicon.ico'), size: 32, ico: true },
];

mkdirSync(outDir, { recursive: true });

const wrapPngInIco = (png) => {
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: 1 = ICO
  dir.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width (32; 0 means 256)
  entry.writeUInt8(32, 1); // height
  entry.writeUInt8(0, 2);  // palette
  entry.writeUInt8(0, 3);  // reserved
  entry.writeUInt16LE(1, 4);  // planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // image size
  entry.writeUInt32LE(22, 12); // offset (6 + 16)
  return Buffer.concat([dir, entry, png]);
};

let regenerated = 0;
for (const { src, out, size, ico } of targets) {
  const srcPath = join(publicDir, src);
  if (!existsSync(srcPath)) {
    console.error(`sync-icons: source missing: ${srcPath}`);
    process.exit(1);
  }
  const srcMtime = statSync(srcPath).mtimeMs;
  const outMtime = existsSync(out) ? statSync(out).mtimeMs : 0;
  if (outMtime >= srcMtime) continue;

  const svg = readFileSync(srcPath);
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'rgba(0,0,0,0)',
  })
    .render()
    .asPng();
  writeFileSync(out, ico ? wrapPngInIco(png) : png);
  regenerated += 1;
  console.log(`sync-icons: rendered ${src} -> ${out.replace(publicDir, 'public')} (${size}x${size}${ico ? ', ico' : ''})`);
}

if (regenerated === 0) {
  console.log('sync-icons: icons already up to date');
}
