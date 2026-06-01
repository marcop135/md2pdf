import React from 'react';
import styled from 'styled-components';
// import EditArea from './EditArea.js';
import Mirror from './MirrorEditor.js';
const Editor = ({ className, text, setText, width, isMobile }) => {
  return (
    <div style={{ width }} className={className}>
      <Mirror text={text} setText={setText} isMobile={isMobile} />
    </div>
  );
};
export default styled(Editor)`
  flex-shrink: 0;
  height: 100%;
  width: 50%;
  color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgb(204, 204, 204)' : '#1f2328'};

  @media (max-width: 768px) {
    width: 100% !important;
    flex-shrink: 1;

    .cm-scroller {
      font-size: 12px;
    }
  }
`;
