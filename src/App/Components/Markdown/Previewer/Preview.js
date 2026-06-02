import React from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import hljs from 'highlight.js';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import Mermaid from './Mermaid.jsx';

const layoutTags = [
  'table',
  'tbody',
  'thead',
  'tfoot',
  'tr',
  'td',
  'th',
  'img',
  'p',
  'div',
  'span',
  'a',
  'strong',
  'em',
  'br',
  'hr',
  'ul',
  'ol',
  'li',
  // Inline <style> blocks: lets users customize their document layout
  // (page width, fonts, etc.) directly from the markdown. Constrained by the
  // page's Content-Security-Policy on what the CSS can fetch.
  'style',
];

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...((defaultSchema.attributes && defaultSchema.attributes['*']) || []),
      'className',
    ],
    a: [
      ...((defaultSchema.attributes && defaultSchema.attributes.a) || []),
      ['href', /^(https?:\/\/|mailto:|tel:|#|\/)/i],
      'target',
      'rel',
      'title',
      'style',
    ],
    img: [
      ['src', /^(https?:\/\/|data:image\/|\/)/i],
      'alt',
      'title',
      'width',
      'height',
      'style',
    ],
    table: ['style', 'align', 'border', 'cellpadding', 'cellspacing'],
    tr: ['style', 'align', 'valign'],
    td: ['style', 'align', 'valign', 'colspan', 'rowspan'],
    th: ['style', 'align', 'valign', 'colspan', 'rowspan', 'scope'],
    p: ['style', 'align'],
    div: ['style'],
    span: ['style'],
    code: ['className'],
    pre: ['className'],
  },
  tagNames: Array.from(
    new Set([...(defaultSchema.tagNames || []), ...layoutTags]),
  ),
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https', 'data'],
  },
  clobberPrefix: '',
  clobber: [],
};

const highlight = (str, lang) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(str, { language: lang }).value;
    } catch (err) {
      console.error(err);
    }
  }

  try {
    return hljs.highlightAuto(str).value;
  } catch (err) {
    console.error(err);
  }

  return '';
};

// hljs emits only <span class="hljs-*"> wrappers around HTML-escaped text.
// That output is injected via dangerouslySetInnerHTML, i.e. *after*
// rehype-sanitize has already run, so re-filter it down to span+class to keep
// "sanitize is the last line" true for the syntax-highlight path too.
export const sanitizeHighlightHtml = (html) => {
  if (typeof document === 'undefined') return '';
  const template = document.createElement('template');
  template.innerHTML = html;
  const walk = (parent) => {
    Array.from(parent.childNodes).forEach((node) => {
      if (node.nodeType !== 1) return;
      if (node.tagName !== 'SPAN') {
        parent.replaceChild(document.createTextNode(node.textContent), node);
        return;
      }
      Array.from(node.attributes).forEach((attr) => {
        if (attr.name !== 'class') node.removeAttribute(attr.name);
      });
      walk(node);
    });
  };
  walk(template.content);
  return template.innerHTML;
};

/** react-markdown's defaultUrlTransform drops `tel:` (CV contact rows); keep it. */
const urlTransform = (value) => {
  const v = String(value || '').trim();
  if (/^tel:/i.test(v)) {
    return v;
  }
  return defaultUrlTransform(value);
};

export default ({ source, children }) => {
  const markdownSource =
    typeof source === 'string'
      ? source
      : typeof children === 'string'
        ? children
        : '';

  const components = {
    pre({ children, ...rest }) {
      const only = React.Children.toArray(children).find((c) =>
        React.isValidElement(c),
      );
      const cls = only?.props?.className || '';
      const m = /language-(\w+)/.exec(cls);
      if (m && m[1] === 'mermaid') {
        const raw = String(only.props.children || '').replace(/\n$/, '');
        return <Mermaid code={raw} />;
      }
      return <pre {...rest}>{children}</pre>;
    },
    code({ className, children: codeChildren }) {
      const match = /language-(\w+)/.exec(className || '');
      const rawCode = String(codeChildren || '');
      const trimmedCode = rawCode.replace(/\n$/, '');

      if (!match || match[1] === 'mermaid') {
        return <code className={className}>{codeChildren}</code>;
      }

      return (
        <code
          className={className}
          dangerouslySetInnerHTML={{
            __html: sanitizeHighlightHtml(highlight(trimmedCode, match[1])),
          }}
        />
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
      urlTransform={urlTransform}
      components={components}
    >
      {markdownSource}
    </ReactMarkdown>
  );
};
