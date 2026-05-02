import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "docs/readme-hero.png");
const dst = join(root, "public/static/og-img.png");

if (!existsSync(src)) {
  console.error(`sync-hero: source missing: ${src}`);
  process.exit(1);
}

const srcMtime = statSync(src).mtimeMs;
const dstMtime = existsSync(dst) ? statSync(dst).mtimeMs : 0;

if (srcMtime > dstMtime) {
  mkdirSync(dirname(dst), { recursive: true });
  copyFileSync(src, dst);
  console.log("sync-hero: copied docs/readme-hero.png -> public/static/og-img.png");
} else {
  console.log("sync-hero: og-img already up to date");
}
