export const DEFAULT_TITLE = 'Markdown to PDF';

// Firefox on Android derives the saved/printed PDF name from the document URL
// (via GeckoView's guessFileName), not document.title, so the continuous title
// sync that fixes Chromium and desktop has no effect there. The print handler
// briefly rewrites the URL path to this slug so Firefox names the file from the
// heading. Keep it ASCII path-safe: collapse every non-alphanumeric run to a
// single hyphen and cap the length so the path stays short.
export const toFilenameSlug = (raw) =>
  (raw ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .slice(0, 100)
    .replace(/-+$/, '');

export const sanitizeForFilename = (raw) =>
  (raw ?? '')
    .replace(/[\\/:*?"<>|\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const stripInlineMarkdown = (text) =>
  text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Underscores only mark emphasis when not intraword (CommonMark), so the
    // boundary guards keep snake_case identifiers in headings intact.
    .replace(/(^|[^\w])__([^_]+)__(?!\w)/g, '$1$2')
    .replace(/(^|[^\w])_([^_]+)_(?!\w)/g, '$1$2')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<\/?[^>]+>/g, '');

const ATX = /^[ \t]{0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/m;
const SETEXT = /^[ \t]{0,3}([^\n]+?)[ \t]*\n[ \t]{0,3}=+[ \t]*$/m;
const HTML_HEADING = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i;

export const extractHeading = (markdown) => {
  if (typeof markdown !== 'string' || markdown.length === 0) return '';

  const candidates = [];
  const atx = markdown.match(ATX);
  if (atx) candidates.push({ index: atx.index, text: atx[1] });
  const setext = markdown.match(SETEXT);
  if (setext) candidates.push({ index: setext.index, text: setext[1] });
  const html = markdown.match(HTML_HEADING);
  if (html) candidates.push({ index: html.index, text: html[1] });

  if (candidates.length === 0) return '';
  candidates.sort((a, b) => a.index - b.index);
  return sanitizeForFilename(stripInlineMarkdown(candidates[0].text));
};
