import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const md = readFileSync(join(root, "CHANGELOG.md"), "utf8");

const allowedSections = new Set([
  "Added",
  "Changed",
  "Removed",
  "Fixed",
  "Security",
]);

const sectionOrder = ["Added", "Changed", "Removed", "Fixed", "Security"];

const lines = md.split(/\r?\n/);
const errors = [];

let currentVersion = null;
let seenInVersion = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const version = line.match(/^## \[([^\]]+)\]/);
  if (version) {
    currentVersion = version[1];
    seenInVersion = [];
    continue;
  }

  const section = line.match(/^### (.+)$/);
  if (section) {
    const name = section[1].trim();
    if (!allowedSections.has(name)) {
      errors.push(
        `Line ${i + 1}: unknown section "${name}" (use ${[...allowedSections].join(", ")})`,
      );
      continue;
    }
    if (seenInVersion.includes(name)) {
      errors.push(
        `Line ${i + 1}: duplicate ### ${name} under ${currentVersion ?? "unknown"}`,
      );
    }
    const last = seenInVersion[seenInVersion.length - 1];
    if (last) {
      const prevIdx = sectionOrder.indexOf(last);
      const nextIdx = sectionOrder.indexOf(name);
      if (nextIdx < prevIdx) {
        errors.push(
          `Line ${i + 1}: ### ${name} out of order under ${currentVersion ?? "unknown"} (want ${sectionOrder.join(" → ")})`,
        );
      }
    }
    seenInVersion.push(name);
    continue;
  }

  // Reject leftover label-style bullets
  if (/^- \*\*[^*]+:\*\*/.test(line) || /^- \*\*[^*]+\*\*:/.test(line)) {
    errors.push(
      `Line ${i + 1}: label-style bullet; use ### Added/Changed/Removed/Fixed/Security sections instead`,
    );
  }
}

if (errors.length) {
  console.error("CHANGELOG.md lint failed:\n", errors.join("\n"));
  process.exit(1);
}

console.log("CHANGELOG.md OK.");
