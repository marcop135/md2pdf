import React, { Suspense, lazy } from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary.js';
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

  .mermaid-diagram {
    display: flex;
    justify-content: center;
    margin: 12px 0;
  }
  .mermaid-diagram svg {
    max-width: 100%;
    height: auto;
  }
  .mermaid-loading {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    white-space: pre-wrap;
    color: #6a737d;
    background: #f6f8fa;
    padding: 8px;
    border-radius: 6px;
    display: block;
    justify-content: initial;
  }

  @media print {
    padding: 0;
    overflow-y: hidden;

    .mermaid-diagram {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .mermaid-diagram svg {
      max-width: 100%;
      max-height: 100%;
    }
  }
`;
const LazyPreview = lazy(() => import('./Preview.js'));
export default ({ source, children }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading duration={0.5} />}>
        <Wrapper className="preview  markdown-body">
          <LazyPreview source={source || children} />
        </Wrapper>
      </Suspense>
    </ErrorBoundary>
  );
};
