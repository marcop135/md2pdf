import React from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import hljs from 'highlight.js';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import Mermaid from './Mermaid.jsx';
import 'highlight.js/styles/github.css';

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
            __html: highlight(trimmedCode, match[1]),
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
