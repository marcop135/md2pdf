import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FileEarmarkPdfFill } from 'react-bootstrap-icons';
import UploadButton from './Upload.js';
import { waitForMermaidRenders } from '../Markdown/Previewer/Mermaid.jsx';
import packageMeta from '../../../../package.json';

const { version } = packageMeta;

const Header = ({ className }) => {
  const onTransform = async () => {
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
    await waitForMermaidRenders();
    window.print();
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className={className + ' no-print'}>
        <p className="project">
          Markdown To PDF <small>v{version}</small>
        </p>

        <div className="menu">
          <UploadButton className="button upload" />
          <p className="button download primary" onClick={onTransform} tabIndex={0}>
            <FileEarmarkPdfFill size={18} aria-label="Export to PDF" />
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
  padding: 0 12px;
  color: #1f2328;
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  display: flex;
  align-items: center;
  height: 48px;

  .project {
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.2px;
    margin: 5px;
    flex-shrink: 0;
    height: 20px;

    small {
      margin-left: 4px;
      color: #6c757d;
      font-weight: 400;
    }

    @media (max-width: 420px) {
      small {
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
      height: 32px;
      min-width: 60px;
      display: flex;
      align-items: center;
      margin-left: 8px;
      padding: 0 12px;
      font-size: 14px;
      font-weight: 400;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      cursor: pointer;
      background-color: #ffffff;
      color: #1f2328;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        transform 0.15s ease;

      @media (max-width: 600px) {
        svg + span {
          display: none;
        }
        svg {
          margin: auto !important;
        }
      }

      &:hover {
        background-color: #f6f8fa;
        border-color: #afb8c1;
      }

      &:active {
        transform: scale(0.97);
      }

      &.primary svg {
        color: rgb(53, 123, 253);
      }

      svg {
        margin-right: 6px;
        flex-shrink: 0;
      }
    }
  }
`;
