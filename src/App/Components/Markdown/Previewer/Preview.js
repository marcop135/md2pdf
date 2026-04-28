import React from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import hljs from 'highlight.js';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] || []), 'style'],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href || []), 'tel'],
  },
};
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';

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
    code({ className, children: codeChildren }) {
      const match = /language-(\w+)/.exec(className || '');
      const rawCode = String(codeChildren || '');
      const trimmedCode = rawCode.replace(/\n$/, '');

      if (!match) {
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
