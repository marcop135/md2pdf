import React, { Suspense, lazy, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary.js';
import { hydrateMermaidBlocks } from './mermaid.js';
import 'github-markdown-css';
const Wrapper = styled.div`
  overflow-y: scroll;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  padding: 10px;
  background-color: #ffffff !important;
  color: #24292e !important;
  word-wrap: break-word;

  .markdown-body {
    background-color: #ffffff !important;
    color: #24292e !important;
  }

  pre,
  code,
  table {
    max-width: 100%;
    overflow-x: auto;
  }

  @media print {
    padding: 0;
    overflow-y: hidden;
  }
`;
const LazyPreview = lazy(() => import('./Preview.js'));
export default ({ source, children }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    hydrateMermaidBlocks(previewRef.current);
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading duration={0.5} />}>
        <Wrapper ref={previewRef} className="preview  markdown-body">
          <LazyPreview source={source || children} />
        </Wrapper>
      </Suspense>
    </ErrorBoundary>
  );
};
