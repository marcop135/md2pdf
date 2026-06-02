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
      <input
        id="mdFile"
        type="file"
        style={{ display: 'none' }}
        onChange={onChange}
        accept=".md,.markdown,.mdown,.mkd"
      />
      <label
        htmlFor="mdFile"
        style={{
          position: 'absolute',
          opacity: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          cursor: 'pointer',
        }}
      />
      <FileEarmarkArrowUpFill size={18} aria-label="Import .md file" />
      <span>Import .md file</span>
    </p>
  );
};
