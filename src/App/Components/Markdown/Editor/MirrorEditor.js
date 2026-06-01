import React, { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLightInit } from '@uiw/codemirror-theme-github';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { EditorView } from '@codemirror/view';
import styled from 'styled-components';
import { useThemeMode } from '../../../Theme';

const githubLight = githubLightInit({
  settings: { caret: '#1f2328' },
});

const markdownLightHighlight = HighlightStyle.define([
  { tag: [t.heading1], color: '#005cc5', fontWeight: '700' },
  { tag: [t.heading2], color: '#005cc5', fontWeight: '700' },
  { tag: [t.heading3, t.heading4, t.heading5, t.heading6, t.heading], color: '#005cc5', fontWeight: '700' },
  { tag: t.strong, color: '#b31d28', fontWeight: '700' },
  { tag: t.emphasis, color: '#6f42c1', fontStyle: 'italic' },
  { tag: t.link, color: '#22863a', textDecoration: 'underline' },
  { tag: t.url, color: '#22863a' },
  { tag: t.monospace, color: '#d73a49' },
  { tag: t.quote, color: '#6a737d', fontStyle: 'italic' },
  { tag: t.meta, color: '#a0a0a0' },
  { tag: t.processingInstruction, color: '#a0a0a0' },
  { tag: t.contentSeparator, color: '#a0a0a0' },
  { tag: t.list, color: '#e36209' },
]);

const Editor = ({ className, text, setText, isMobile }) => {
  const { resolved } = useThemeMode();
  const extensions = useMemo(
    () => [
      markdown(),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ 'aria-label': 'Markdown source' }),
      ...(resolved === 'dark' ? [] : [syntaxHighlighting(markdownLightHighlight)]),
    ],
    [resolved],
  );
  const basicSetup = useMemo(
    () => ({
      lineNumbers: !isMobile,
    }),
    [isMobile],
  );

  return (
    <CodeMirror
      className={className}
      value={text}
      theme={resolved === 'dark' ? oneDark : githubLight}
      extensions={extensions}
      basicSetup={basicSetup}
      onChange={(value) => {
        setText(value);
      }}
    />
  );
};
export default styled(Editor)`
  height: 100%;
  .cm-editor {
    height: 100%;
  }

  .cm-scroller {
    line-height: 1.65;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    font-size: 13px;
  }

  .cm-gutters {
    font-size: 12px;
  }
`;
