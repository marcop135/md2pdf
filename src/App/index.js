import React from 'react';
import styled from 'styled-components';
import { Header, Markdown } from './Components';
import { Provider } from 'nonaction';
import { TextContainer } from './Container';
const App = ({ className }) => {
  return (
    <div className={className} id="md2pdf-app">
      <Provider inject={[TextContainer]}>
        <Header />
        <Markdown />
      </Provider>
    </div>
  );
};
export default styled(App)`
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 微軟正黑體, sans-serif;
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
  }

  @page {
    margin: 18mm 14mm 22mm 14mm;
    @bottom-center {
      content: 'Generated with md2pdf.marcopontili.com · verify authenticity';
      font: 9px/1.2 sans-serif;
      color: #999;
    }
  }
`;
