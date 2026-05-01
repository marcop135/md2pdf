import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useProvided } from 'nonaction';
import { TextContainer } from '../../Container';
import Previewer from './Previewer';
import Editor from './Editor';
import DragBar from './DragBar.js';
import 'github-markdown-css';
import useDrop from '../../Container/Hooks/useDrop.js';
import useIsMobile from '../../Container/Hooks/useIsMobile.js';

const Markdown = ({ className }) => {
  const [text, setText] = useProvided(TextContainer);
  const [isDrag, setDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
  );
  const [activeTab, setActiveTab] = useState('editor');
  const markdownRef = useRef(null);
  const [uploading, isOver] = useDrop(markdownRef, setText);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleMouseUp = () => setDrag(false);
    const handleTouchEnd = () => setDrag(false);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!isDrag) return;
    const pageX = e.nativeEvent.pageX;
    setWidth(pageX - startX);
  };

  const handleTouchMove = (e) => {
    if (!isDrag || e.touches.length === 0) return;
    const pageX = e.touches[0].pageX;
    setWidth(pageX - startX);
  };

  return (
    <div
      ref={markdownRef}
      style={{ opacity: isOver || uploading ? 0.5 : 1 }}
      className={className}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {isMobile ? (
        <>
          <TabBar>
            <TabButton
              $active={activeTab === 'editor'}
              onClick={() => setActiveTab('editor')}
            >
              Editor
            </TabButton>
            <TabButton
              $active={activeTab === 'preview'}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </TabButton>
          </TabBar>
          <MobilePanel>
            {activeTab === 'editor' && (
              <Editor
                className="no-print"
                text={text}
                width={width}
                setText={setText}
                isMobile
              />
            )}
            {activeTab === 'preview' && <Previewer>{text}</Previewer>}
          </MobilePanel>
        </>
      ) : (
        <>
          <Editor
            className="no-print"
            text={text}
            width={width}
            setText={setText}
          />
          <DragBar
            className="no-print"
            isDrag={isDrag}
            setDrag={setDrag}
            setStartX={setStartX}
            currentWidth={width}
          />
          <Previewer>{text}</Previewer>
        </>
      )}
    </div>
  );
};

const TabBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 8px;
  gap: 4px;
  background-color: rgb(233, 233, 233);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const TabButton = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${(props) => (props.$active ? '#0984e3' : 'transparent')};
  color: ${(props) => (props.$active ? '#fff' : '#333')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? '#0984e3' : 'rgba(0,0,0,0.06)'};
  }
`;

const MobilePanel = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export default styled(Markdown)`
  * {
    box-sizing: border-box;
  }
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;

  @media (min-width: 769px) {
    flex-direction: row;
  }
`;
