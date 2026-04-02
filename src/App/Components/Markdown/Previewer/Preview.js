import React from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
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
    <ReactMarkdown skipHtml remarkPlugins={[remarkGfm]} components={components}>
      {markdownSource}
    </ReactMarkdown>
  );
};
