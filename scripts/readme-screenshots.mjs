// Capture the README screenshots (desktop and mobile, light and dark) with Playwright.
// Usage: node scripts/readme-screenshots.mjs [baseUrl]   (dev server on 5173 by default)
// Writes docs/readme/{desktop,mobile}-{light,dark}.png.
// Optional: if `sharp` is installed, PNGs are palette-compressed like draw's readme:shots.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = process.argv[2] || 'http://localhost:5173';
const outDir = 'docs/readme';
const scale = 2;
const viewports = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};

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

let compress = async (buf) => buf;
try {
  const sharp = (await import('sharp')).default;
  compress = (buf) =>
    sharp(buf).png({ compressionLevel: 9, effort: 10, palette: true }).toBuffer();
} catch {
  // sharp optional at capture time (devDependency); raw Playwright PNG is fine.
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

async function open(viewport, colorScheme) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: scale,
    colorScheme,
    reducedMotion: 'reduce',
  });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  // Theme stays on "system", so the emulated color scheme decides it.
  await page.evaluate(() => window.localStorage.removeItem('md2pdf-theme'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.md2pdf);
  await page.evaluate(async (md) => {
    window.md2pdf.setMarkdown(md);
    await window.md2pdf.prepareExport();
  }, DEMO);
  // prepareExport drains in-flight renders, but the first Mermaid chunk can
  // still land after the 3s deadline on a cold page; wait for the SVG.
  await page.waitForSelector('.mermaid-diagram:not(.mermaid-loading) svg', {
    timeout: 20000,
  });
  return page;
}

for (const scheme of ['light', 'dark']) {
  const desktop = await open(viewports.desktop, scheme);
  await writeFile(
    `${outDir}/desktop-${scheme}.png`,
    await compress(await desktop.screenshot())
  );
  await desktop.close();

  // Preview tab: the phone frame next to desktop in the README.
  const phone = await open(viewports.mobile, scheme);
  await phone.getByRole('tab', { name: 'Preview' }).click();
  await phone.waitForTimeout(800);
  await writeFile(
    `${outDir}/mobile-${scheme}.png`,
    await compress(await phone.screenshot())
  );
  await phone.close();

  console.log(`captured ${scheme}`);
}

await browser.close();
console.log(`Screenshots written to ${outDir}`);
