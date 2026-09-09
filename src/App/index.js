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
    /* Keep a heading with the text it introduces. */
    .preview.markdown-body h1,
    .preview.markdown-body h2,
    .preview.markdown-body h3,
    .preview.markdown-body h4,
    .preview.markdown-body h5,
    .preview.markdown-body h6 {
      break-after: avoid;
      page-break-after: avoid;
    }
    /* Only blocks that reliably fit on one page get break-inside: avoid. On an
       unbounded block (a long code fence or table) browsers push it to a fresh
       page and then overflow it, cutting the bottom off — pre and table are
       deliberately absent here so they paginate instead. */
    .preview.markdown-body blockquote,
    .preview.markdown-body li,
    .preview.markdown-body img {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .preview.markdown-body p,
    .preview.markdown-body li {
      orphans: 3;
      widows: 3;
    }
  }

  @page {
    margin: 18mm 14mm 18mm 14mm;
  }
`;
