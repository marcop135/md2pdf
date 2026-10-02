// Capture the README screenshots (desktop and mobile, light and dark) with Playwright.
// Usage: node scripts/readme-screenshots.mjs [baseUrl]   (dev server on 5173 by default)
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.argv[2] || 'http://localhost:5173';
const outDir = 'docs/screenshots';
const scale = 2;
const mobile = { width: 390, height: 844 };
const gap = 48;

const DEMO = `# Quarterly report

**Markdown to PDF** renders GitHub-flavored Markdown in your browser and prints it to PDF. Nothing is uploaded.

## Highlights

| Area    | Status  | Owner |
| ------- | ------- | ----- |
| Editor  | Shipped | Ana   |
| Preview | Shipped | Luca  |
| Export  | Beta    | Mia   |

- [x] Tables, task lists, footnotes
- [x] Syntax-highlighted code
- [ ] Your next document

\`\`\`js
const pdf = await md2pdf.exportPdf();
\`\`\`

## Pipeline

\`\`\`mermaid
flowchart LR
  A[Markdown] --> B[Preview] --> C[PDF]
\`\`\`
`;

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

async function open(viewport, colorScheme) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: scale, colorScheme });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  // Theme stays on "system", so the emulated color scheme decides it.
  await page.evaluate(() => window.localStorage.removeItem('md2pdf-theme'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.md2pdf);
  await page.evaluate(async (md) => {
    window.md2pdf.setMarkdown(md);
    await window.md2pdf.prepareExport();
  }, DEMO);
  await page.waitForTimeout(500);
  return page;
}

const png = (buf) => sharp(buf).png({ compressionLevel: 9, effort: 10 }).toBuffer();

for (const scheme of ['light', 'dark']) {
  const desktop = await open({ width: 1280, height: 800 }, scheme);
  await sharp(await png(await desktop.screenshot())).toFile(`${outDir}/desktop-${scheme}.png`);
  await desktop.close();

  // Editor and Preview tabs side by side on a transparent ground.
  const phone = await open(mobile, scheme);
  const editor = await phone.screenshot();
  await phone.getByRole('tab', { name: 'Preview' }).click();
  await phone.waitForTimeout(800);
  const preview = await phone.screenshot();
  await phone.close();

  const w = mobile.width * scale;
  const h = mobile.height * scale;
  const radius = 28 * scale;
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${radius}"/></svg>`
  );
  const round = (buf) => sharp(buf).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  await sharp({
    create: { width: w * 2 + gap * scale, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: await round(editor), left: 0, top: 0 },
      { input: await round(preview), left: w + gap * scale, top: 0 },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(`${outDir}/mobile-${scheme}.png`);

  console.log(`captured ${scheme}`);
}

await browser.close();
console.log(`Screenshots written to ${outDir}`);
