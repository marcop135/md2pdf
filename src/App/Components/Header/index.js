import React from 'react';
import styled from 'styled-components';
import {
  CircleHalf,
  FileEarmarkPdfFill,
  Github,
  MoonFill,
  SunFill,
} from 'react-bootstrap-icons';
import UploadButton from './Upload.js';
import { waitForMermaidRenders } from '../Markdown/Previewer/Mermaid.jsx';
import { useThemeMode } from '../../Theme';
import packageMeta from '../../../../package.json';

const { version } = packageMeta;

const SOURCE_REPO_URL = 'https://github.com/marcop135/md2pdf';

const THEME_ICON = {
  system: CircleHalf,
  light: SunFill,
  dark: MoonFill,
};

const NEXT_MODE_LABEL = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const Header = ({ className }) => {
  const { mode, cycleMode } = useThemeMode();
  const ThemeIcon = THEME_ICON[mode] || CircleHalf;

  // The Markdown component keeps document.title synced to the first heading
  // so that any print path (this button, Ctrl/Cmd+P, browser menu, Android
  // share-to-PDF) reads the right value. See src/App/Lib/printTitle.js.
  const onTransform = async () => {
    await waitForMermaidRenders();
    window.print();
  };

  return (
    <header className={className + ' no-print'}>
      <p className="project">
        <strong className="brand-title">Markdown to PDF</strong>{' '}
        <small className="version-chip">v{version}</small>
      </p>

      <div className="menu">
        <UploadButton className="button upload" />
        <button
          type="button"
          className="button download primary"
          onClick={onTransform}
          aria-label="Export to .pdf"
        >
          <FileEarmarkPdfFill size={18} aria-hidden />
          <span>Export to .pdf</span>
        </button>
        <button
          type="button"
          className="button theme-toggle icon-only"
          onClick={cycleMode}
          aria-label={`Theme: ${mode}. Switch to ${NEXT_MODE_LABEL[mode]}.`}
          title={`Theme: ${mode}`}
        >
          <ThemeIcon size={18} aria-hidden />
        </button>
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
  gap: 8px;

  @media (max-width: 420px) {
    padding: 0 8px;
    gap: 4px;
  }
  font-family: inherit;
  color: ${({ theme }) => theme.colors.headerText};
  background-color: ${({ theme }) => theme.colors.headerBg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.headerBorder};
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
      color: ${({ theme }) => theme.colors.versionChip};
      font-weight: 400;
      font-size: 0.9em;
    }

    @media (max-width: 480px) {
      font-size: 13px;
    }

    @media (max-width: 420px) {
      .version-chip {
        display: none;
      }
    }

    @media (max-width: 360px) {
      font-size: 12px;
      letter-spacing: 0;
    }

    @media (max-width: 320px) {
      .brand-title {
        font-size: 11px;
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
      border: 1px solid ${({ theme }) => theme.colors.buttonBorder};
      border-radius: 6px;
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.buttonBg};
      color: ${({ theme }) => theme.colors.buttonText};
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
        min-width: 64px;
        width: 64px;
        padding: 0 22px;
      }

      @media (max-width: 360px) {
        min-width: 34px;
        width: 34px;
        padding: 0;
      }

      &:hover {
        background-color: ${({ theme }) => theme.colors.buttonHoverBg};
        border-color: ${({ theme }) => theme.colors.buttonHoverBorder};
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
