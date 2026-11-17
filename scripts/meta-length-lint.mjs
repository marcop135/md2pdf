#!/usr/bin/env node
/**
 * meta:lint: fail when a built page's <title> is outside 30-65 characters or
 * its meta description is outside 70-160 characters.
 * Usage: node scripts/meta-length-lint.mjs [dir] (default: dist)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, process.argv[2] || 'dist');
const TITLE = [30, 65];
const DESCRIPTION = [70, 160];

if (!existsSync(dir)) {
  console.error(`meta:lint: ${dir} missing, run npm run build first`);
  process.exit(1);
}

const htmlFiles = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = join(d, e.name);
    if (e.isDirectory()) return e.name === 'assets' ? [] : htmlFiles(p);
    return e.name.endsWith('.html') ? [p] : [];
  });

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const errors = [];
const files = htmlFiles(dir);

for (const file of files) {
  const rel = relative(dir, file).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  const desc = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((m) => m[0])
    .find((tag) => /\bname\s*=\s*["']description["']/i.test(tag));
  const content = desc && desc.match(/\bcontent\s*=\s*"([^"]*)"|\bcontent\s*=\s*'([^']*)'/i);

  const check = (label, value, [min, max]) => {
    if (value === undefined) {
      errors.push(`${rel}: missing ${label}`);
      return;
    }
    const len = [...decode(value)].length;
    if (len < min || len > max) {
      errors.push(`${rel}: ${label} is ${len} characters (want ${min}-${max})`);
    }
  };
  check('title', title?.[1], TITLE);
  check('meta description', content ? (content[1] ?? content[2]) : undefined, DESCRIPTION);
}

if (!files.length) errors.push(`no .html files under ${dir}`);

if (errors.length) {
  console.error('meta:lint failed:');
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log(`meta:lint OK (${files.length} pages)`);
