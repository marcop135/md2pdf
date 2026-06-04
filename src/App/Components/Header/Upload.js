import React from 'react';
import { useProvided } from 'nonaction';
import { FileEarmarkArrowUpFill } from 'react-bootstrap-icons';
import { TextContainer } from '../../Container';

export default (props) => {
  const [, setText] = useProvided(TextContainer);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const onChange = (e) => {
    const files = e.currentTarget.files;
    if (files.length > 0) {
      const file = files[0];
      if (!/\.(md|markdown|mdown|mkd)$/i.test(file.name)) {
        alert('Only Markdown files are allowed.');
        e.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert('File too large. Maximum size is 2MB.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setText(loadEvent.target.result);
      };
      reader.onerror = () => {
        alert('Error while reading file');
      };
      reader.readAsText(file);
      e.target.value = '';
    }
  };
  return (
    <p {...props} style={{ position: 'relative' }}>
      {/* The file input stays keyboard-focusable but visually hidden (not
          display:none, which removes it from the tab order). It is sized to
          fill the control so a pointer click anywhere still opens the picker;
          the parent gets a focus ring via :focus-within. */}
      <input
        id="mdFile"
        type="file"
        aria-label="Import .md file"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          margin: 0,
          zIndex: 2,
          cursor: 'pointer',
        }}
        onChange={onChange}
        accept=".md,.markdown,.mdown,.mkd"
      />
      <FileEarmarkArrowUpFill size={18} aria-hidden />
      <span>Import .md file</span>
    </p>
  );
};
