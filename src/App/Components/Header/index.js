import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FileEarmarkPdfFill, Github } from 'react-bootstrap-icons';
import UploadButton from './Upload.js';
import { waitForMermaidRenders } from '../Markdown/Previewer/Mermaid.jsx';
import packageMeta from '../../../../package.json';

const { version } = packageMeta;

const SOURCE_REPO_URL = 'https://github.com/marcop135/md2pdf';

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
          <strong className="brand-title">Markdown to PDF</strong>{' '}
          <small className="version-chip">v{version}</small>
        </p>

        <div className="menu">
          <UploadButton className="button upload" />
          <p className="button download primary" onClick={onTransform} tabIndex={0}>
            <FileEarmarkPdfFill size={18} aria-label="Export to PDF" />
            <span>Export to .pdf</span>
          </p>
          <a
            className="button github-link icon-only"
            href={SOURCE_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <Github size={18} aria-hidden />
          </a>
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
  font-family: inherit;
  color: #1f2328;
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  display: flex;
  align-items: center;
  min-height: 48px;
  -webkit-font-smoothing: antialiased;

  .project {
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 0.2px;
    margin: 0;
    flex-shrink: 0;
    line-height: 1.35;

    .brand-title {
      font-weight: 700;
    }

    .version-chip {
      margin-left: 4px;
      color: #656d76;
      font-weight: 400;
      font-size: 0.9em;
    }

    @media (max-width: 420px) {
      .version-chip {
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

    a.button {
      text-decoration: none;
    }

    .button {
      height: 32px;
      min-width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      padding: 0 12px;
      font-size: 14px;
      font-family: inherit;
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

      &:not(.icon-only) {
        justify-content: flex-start;
      }

      svg {
        margin-right: 6px;
        flex-shrink: 0;
      }

      &.icon-only {
        min-width: 34px;
        width: 34px;
        padding: 0;
        margin-left: 8px;
      }

      &.icon-only svg {
        margin-right: 0;
        margin-left: 0;
      }
    }
  }
`;
