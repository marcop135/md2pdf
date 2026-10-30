const MARKDOWN_EXT = /\.(md|markdown|mdown|mkd)$/i;
const MERMAID_EXT = /\.mmd$/i;

export function classifyImport(name) {
  const base = String(name || '');
  if (MARKDOWN_EXT.test(base)) return 'markdown';
  if (MERMAID_EXT.test(base)) return 'mermaid';
  return null;
}

function isSingleMermaidFence(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  if (lines.length < 2) return false;
  const open = /^(`{3,})mermaid[ \t]*$/.exec(lines[0]);
  if (!open) return false;
  const closeRe = new RegExp('^`{' + open[1].length + ',}[ \\t]*$');
  if (!closeRe.test(lines[lines.length - 1])) return false;
  for (let i = 1; i < lines.length - 1; i += 1) {
    if (closeRe.test(lines[i])) return false;
  }
  return true;
}

function wrapMermaid(body) {
  let max = 0;
  for (const run of body.matchAll(/`+/g)) {
    if (run[0].length > max) max = run[0].length;
  }
  const fence = '`'.repeat(Math.max(3, max + 1));
  const inner = body.endsWith('\n') ? body : `${body}\n`;
  return `${fence}mermaid\n${inner}${fence}\n`;
}

export function textForImport(kind, raw) {
  if (kind === 'markdown') return raw;
  const source = String(raw).replace(/^\uFEFF/, '');
  if (isSingleMermaidFence(source)) return source;
  const body = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return wrapMermaid(body);
}
