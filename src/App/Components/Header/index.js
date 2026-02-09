import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import UploadButton from './Upload.js';

const Header = ({ className }) => {
  const onTransfrom = () => {
    let candidateTitle = '';
    const previewEl = document.querySelector('.preview');
    const candidateTitleEl = previewEl?.querySelector('h1');
    if (candidateTitleEl) {
      candidateTitle = candidateTitleEl.innerText;
      const currentTitle = document.title;
      document.title = candidateTitle;
      window.requestAnimationFrame(() => {
        document.title = currentTitle;
      });
    }
    window.print();
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className={className + ' no-print'}>
        <p className="project">
          MarkdownPDF <small>v2.4.0</small>&nbsp;
          <a
            href="https://github.com/realdennis/md2pdf"
            title="md2pdf github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <small>(md2pdf fork)</small>
          </a>
        </p>

        <div className="menu">
          <UploadButton className="button upload" />
          <p className="button download" onClick={onTransfrom} tabIndex={0}>
            <span role="img" aria-label="download">
              ⬇️
            </span>
            <span>Export to .pdf</span>
          </p>
        </div>
      </header>
    </>
  );
};

export default styled(Header)`
  * {
    box-sizing: border-box;
  }

  flex-shrink: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  user-select: none;
  padding: 0 5px;
  color: black;
  background-color: rgb(233, 233, 233);
  display: flex;
  align-items: center;
  height: 40px;

  .project {
    font-weight: bold;
    margin: 5px;
    flex-shrink: 0;
    height: 20px;

    @media (max-width: 420px) {
      small,
      a small {
        display: none;
      }
    }
  }

  .menu {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .button {
      height: 75%;
      min-width: 60px;
      display: flex;
      align-items: center;
      margin-left: 8px;
      padding: 0 10px;
      border: 1px solid rgb(53, 123, 253);
      border-radius: 5px;
      cursor: pointer;
      background-color: #cde4fe;
      transition: background-color 0.2s ease, transform 0.2s ease;

      @media (max-width: 600px) {
        span + span {
          display: none;
        }
        span[role='img'] {
          margin: auto !important;
          padding: 0 !important;
        }
      }

      &:hover {
        background-color: #eaf4ff;
      }

      &:active {
        transform: scale(0.97);
      }

      span[role='img'] {
        margin-right: 5px;
      }
    }
  }
`;
