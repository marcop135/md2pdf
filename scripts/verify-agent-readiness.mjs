#!/usr/bin/env node
/**
 * verify:agent-readiness — static checks for the agent discovery surface.
 * Usage: node scripts/verify-agent-readiness.mjs [baseUrl]
 * Default baseUrl: file:// dist after build, or pass https://md2pdf.marcopontili.com
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = join(root, 'dist');

const requiredFiles = [
  'llms.txt',
  'auth.md',
  'for-agents.html',
  'openapi.json',
  '.well-known/ard.json',
  '.well-known/ai-catalog.json',
  '.well-known/agent-skills/index.json',
];

const failures = [];

const assert = (ok, msg) => {
  if (!ok) failures.push(msg);
};

const baseArg = process.argv[2];

if (baseArg) {
  const base = baseArg.replace(/\/$/, '');
  for (const rel of requiredFiles) {
    const url = `${base}/${rel.replace(/^\//, '')}`;
    const res = await fetch(url, {
      headers: { Accept: '*/*' },
      redirect: 'manual',
    });
    assert(res.status === 200, `${url} → HTTP ${res.status}`);
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (rel.endsWith('.html')) {
      assert(ct.includes('text/html'), `${url} content-type ${ct}`);
    } else if (rel.endsWith('.json')) {
      assert(ct.includes('json') || ct.includes('text/plain'), `${url} content-type ${ct}`);
      const body = await res.text();
      try {
        JSON.parse(body);
      } catch {
        assert(false, `${url} is not valid JSON`);
      }
    } else {
      assert(
        !ct.includes('text/html'),
        `${url} should not be HTML (got ${ct || 'missing'})`,
      );
      const body = await res.text();
      assert(body.length >= 100, `${url} body too short`);
      assert(!body.trimStart().startsWith('<!DOCTYPE'), `${url} looks like SPA HTML`);
    }
  }
  const missing = `${base}/this-path-should-404-for-agents.json`;
  const miss = await fetch(missing, { redirect: 'manual' });
  assert(
    miss.status === 404 || miss.status === 410,
    `${missing} should 404 (got ${miss.status})`,
  );
} else {
  assert(existsSync(dist), 'dist/ missing — run npm run build first');
  for (const rel of requiredFiles) {
    const path = join(dist, rel);
    assert(existsSync(path), `missing ${rel} in dist/`);
    if (rel.endsWith('.json')) {
      try {
        JSON.parse(readFileSync(path, 'utf8'));
      } catch {
        assert(false, `${rel} is not valid JSON`);
      }
    } else if (rel.endsWith('.txt') || rel.endsWith('.md')) {
      const body = readFileSync(path, 'utf8');
      assert(body.length >= 100, `${rel} too short`);
      assert(!body.trimStart().startsWith('<!DOCTYPE'), `${rel} looks like HTML`);
    }
  }
  const htaccess = readFileSync(join(dist, '.htaccess'), 'utf8');
  assert(
    htaccess.includes('for-agents.html'),
    '.htaccess missing for-agents aliases',
  );
  assert(
    /R=404/.test(htaccess),
    '.htaccess missing hard 404 for agent static probes',
  );
  const bridgeSrc = readFileSync(
    join(root, 'src/App/Lib/agentBridge.js'),
    'utf8',
  );
  assert(bridgeSrc.includes('window.md2pdf'), 'agentBridge must expose window.md2pdf');
  const headerSrc = readFileSync(
    join(root, 'src/App/Components/Header/index.js'),
    'utf8',
  );
  assert(
    headerSrc.includes('registerAgentHandlers'),
    'Header must register the agent bridge',
  );
}

if (failures.length) {
  console.error('verify:agent-readiness failed:');
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log(
  baseArg
    ? `verify:agent-readiness OK against ${baseArg}`
    : `verify:agent-readiness OK (dist + source) ${pathToFileURL(dist).href}`,
);
