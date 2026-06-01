import React, { Suspense, lazy } from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary.js';
import { useThemeMode } from '../../../Theme';
import lightMarkdownCss from 'github-markdown-css/github-markdown-light.css?raw';
import darkMarkdownCss from 'github-markdown-css/github-markdown-dark.css?raw';
import lightHljsCss from 'highlight.js/styles/github.css?raw';
import darkHljsCss from 'highlight.js/styles/github-dark.css?raw';
const Wrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  padding: 20px clamp(14px, 3vw, 28px);
  background-color: ${({ theme }) => theme.colors.previewBg} !important;
  color: ${({ theme }) => theme.colors.previewText} !important;
  word-wrap: break-word;

  .markdown-body {
    background-color: ${({ theme }) => theme.colors.previewBg} !important;
    color: ${({ theme }) => theme.colors.previewText} !important;
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
    color: ${({ theme }) => theme.colors.mermaidLoadingText};
    background: ${({ theme }) => theme.colors.mermaidLoadingBg};
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
  const { resolved } = useThemeMode();
  return (
    <ErrorBoundary>
      <style
        dangerouslySetInnerHTML={{
          __html: resolved === 'dark' ? darkMarkdownCss : lightMarkdownCss,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: resolved === 'dark' ? darkHljsCss : lightHljsCss,
        }}
      />
      <Wrapper className="preview  markdown-body">
        <Suspense fallback={<Loading duration={0.5} />}>
          <LazyPreview source={source || children} />
        </Suspense>
      </Wrapper>
    </ErrorBoundary>
  );
};
