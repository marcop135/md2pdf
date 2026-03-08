import React from 'react';
import styled from 'styled-components';
const width = 15;

const UnwrappedDragBar = ({ className, setDrag, setStartX, currentWidth }) => {
  const dragStart = (e) => {
    const { nativeEvent } = e;
    const offsetX = nativeEvent.offsetX;
    setStartX(offsetX);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 0) return;
    setDrag(true);
    const pageX = e.touches[0].pageX;
    setStartX(pageX - (currentWidth ?? 0));
  };

  return (
    <div
      className={className}
      onMouseDown={(e) => {
        setDrag(true);
        dragStart(e);
      }}
      onTouchStart={handleTouchStart}
    />
  );
};
export default styled(UnwrappedDragBar)`
  width: ${width + 'px'};
  flex-shrink: 0;
  background-color: ${(props) =>
    props.isDrag ? '#0984e3' : 'rgb(233,233,233)'};
  height: 100%;
  color: white;
  text-align: center;
  cursor: col-resize;
  user-select: none;

  @media (max-width: 768px) {
    display: none;
  }
`;
