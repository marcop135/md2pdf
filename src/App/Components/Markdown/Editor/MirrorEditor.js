import React, { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import styled from 'styled-components';

const Editor = ({ className, text, setText, isMobile }) => {
  const extensions = useMemo(() => [markdown(), EditorView.lineWrapping], []);
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
      theme={oneDark}
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
    line-height: 1.6;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    font-size: 15px;
  }

  .cm-gutters {
    font-size: 13px;
  }
`;
