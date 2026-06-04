// Capture audit screenshots across breakpoints using Playwright.
// Usage: node scripts/audit-screenshots.mjs <outDir> [baseUrl]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const outDir = process.argv[2] || 'screenshots/baseline';
const baseUrl = process.argv[3] || 'http://localhost:5173';

const viewports = [
  { name: 'desktop-1280', width: 1280, height: 800, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'mobile-375', width: 375, height: 812, mobile: true },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  // Let CodeMirror, styled-components and Mermaid settle.
  await page.waitForTimeout(1500);

  if (vp.mobile) {
    // Mobile/tablet layout uses Editor/Preview tabs. Capture both.
    await page.screenshot({ path: `${outDir}/${vp.name}-editor.png`, fullPage: false });
    // The Preview control is a tab (role="tab"); older builds rendered it as a
    // plain button. Match either so the script works across versions.
    const previewTab = page
      .getByRole('tab', { name: 'Preview' })
      .or(page.getByRole('button', { name: 'Preview' }));
    if (await previewTab.count()) {
      await previewTab.first().click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${outDir}/${vp.name}-preview.png`, fullPage: false });
    }
  } else {
    await page.screenshot({ path: `${outDir}/${vp.name}.png`, fullPage: false });
  }
  await page.close();
  console.log(`captured ${vp.name}`);
}

await browser.close();
console.log(`Screenshots written to ${outDir}`);
