import React from 'react';
import styled from 'styled-components';
import { Header, Markdown } from './Components';
import { Provider } from 'nonaction';
import { TextContainer } from './Container';
import ErrorBoundary from './ErrorBoundary.js';
import { ThemeProvider } from './Theme';
const App = ({ className }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className={className} id="md2pdf-app">
          <Provider inject={[TextContainer]}>
            <Header />
            <Markdown />
          </Provider>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
export default styled(App)`
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: system-ui, sans-serif;
  @media print {
    &,
    div {
      display: block;
      height: auto;
      /* Reset to normalize for FireFox */
    }
    .no-print,
    .no-print * {
      display: none !important;
    }
    /* Preserve syntax highlighting and Mermaid colors when printing. */
    .preview.markdown-body,
    .preview.markdown-body * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    /* Avoid orphaned headings / split code blocks. */
    .preview.markdown-body h1,
    .preview.markdown-body h2,
    .preview.markdown-body h3 {
      break-after: avoid;
      page-break-after: avoid;
    }
    .preview.markdown-body pre,
    .preview.markdown-body table {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }

  @page {
    margin: 18mm 14mm 18mm 14mm;
  }
`;
