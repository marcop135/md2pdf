import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const md = readFileSync(join(root, "CHANGELOG.md"), "utf8");

const allowed = new Set([
  "Build",
  "Chore",
  "CI",
  "Docs",
  "Enhance",
  "Feat",
  "Fix",
  "Perf",
  "Revert",
  "Sec",
  "Style",
]);

const lines = md.split(/\r?\n/);
const errors = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/^- \*\*([^*]+):\*\*\s*(.+)$/);
  if (!m) continue;

  const rawLabel = m[1].replace(/\s*\(WIP\)\s*$/i, "").trim();
  const body = m[2].trim();

  if (!allowed.has(rawLabel)) {
    errors.push(`Line ${i + 1}: unknown label "${rawLabel}"`);
    continue;
  }

  const words = body.replace(/[.,;:()\[\]`'"]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length > 20) {
    errors.push(
      `Line ${i + 1}: more than 20 words after label (${words.length}: "${rawLabel}")`,
    );
  }

  if (body && !/[.!?]$/.test(body)) {
    errors.push(`Line ${i + 1}: sentence should end with punctuation`);
  }
}

if (errors.length) {
  console.error("CHANGELOG.md lint failed:\n", errors.join("\n"));
  process.exit(1);
}

console.log("CHANGELOG.md OK.");
