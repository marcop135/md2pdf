import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  CircleHalf,
  FileEarmarkPdfFill,
  Github,
  MoonFill,
  Robot,
  SunFill,
} from 'react-bootstrap-icons';
import { useProvided } from 'nonaction';
import UploadButton from './Upload.js';
import { waitForMermaidRenders } from '../Markdown/Previewer/Mermaid.jsx';
import { extractHeading } from '../../Lib/printTitle.js';
import {
  beginPrintFilenameSession,
  endPrintFilenameSession,
} from '../../Lib/printFilenameSession.js';
import {
  registerAgentHandlers,
  unregisterAgentHandlers,
} from '../../Lib/agentBridge.js';
import { TextContainer } from '../../Container';
import { useThemeMode } from '../../Theme';
import packageMeta from '../../../../package.json';

const { version } = packageMeta;

const SOURCE_REPO_URL = 'https://github.com/marcop135/md2pdf';
const FOR_AGENTS_HREF = '/for-agents.html';

// Toolbar breakpoints (max-width, px). Each tier's natural width (Segoe UI)
// sits below the next breakpoint up with slack for wider system fonts:
//  - full row needs ~700px            -> COMPACT below 768
//  - COMPACT (short labels) ~590px    -> ICON_ONLY below 640
//  - ICON_ONLY with chip ~400px       -> NO_CHIP below 420
// Phone tiers (ICON_ONLY and below) drop the logo and keep the title text,
// stepping its size down at SMALL, TINY and MICRO.
// The brand title also truncates with an ellipsis, so a wider font degrades
// to "Markdown to P…" instead of scrolling the bar.
const BP = {
  COMPACT: 768,
  ICON_ONLY: 640,
  SMALL: 480,
  NO_CHIP: 420,
  TINY: 360,
  NARROW: 355,
  MICRO: 320,
};

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

const settlePreviewFrames = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

const Header = ({ className }) => {
  const { mode, cycleMode } = useThemeMode();
  const ThemeIcon = THEME_ICON[mode] || CircleHalf;
  const [text, setText] = useProvided(TextContainer);

  // Read the live text without making it an effect dependency: a [text] dep
  // would re-register the listeners on every keystroke and, worse, run the
  // cleanup's endPrintFilenameSession() mid-print. On Android window.print()
  // is non-blocking, so that would drop the filename hint while the save sheet
  // is still open (the v2.11.3 regression in docs/print-filename.md).
  const textRef = useRef(text);
  textRef.current = text;
  const setTextRef = useRef(setText);
  setTextRef.current = setText;

  const prepareExport = async () => {
    await settlePreviewFrames();
    await waitForMermaidRenders();
    const heading = extractHeading(textRef.current);
    if (heading) beginPrintFilenameSession(heading);
  };

  const runExport = async () => {
    try {
      await prepareExport();
    } finally {
      window.print();
    }
  };

  // Tab title stays the app name during editing; printFilenameSession applies
  // the heading (and optional URL slug) only for the print/save flow. See
  // docs/print-filename.md.
  useEffect(() => {
    const handleBeforePrint = () => {
      beginPrintFilenameSession(extractHeading(textRef.current));
    };
    const handleAfterPrint = () => {
      endPrintFilenameSession();
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      endPrintFilenameSession();
    };
  }, []);

  useEffect(() => {
    registerAgentHandlers({
      getText: () => textRef.current,
      setText: (next) => setTextRef.current(next),
      prepareExport,
      exportPdf: runExport,
    });
    return () => {
      unregisterAgentHandlers();
    };
  }, []);

  return (
    <header className={className + ' no-print'}>
      <p className="project">
        <img
          className="brand-logo"
          src="/favicon.svg"
          alt=""
          width="24"
          height="24"
        />
        <strong className="brand-title">Markdown to PDF</strong>
        <small className="version-chip">v{version}</small>
      </p>

      <div className="menu">
        <UploadButton className="button upload" />
        <button
          type="button"
          className="button download primary"
          onClick={runExport}
          aria-label="Export to .pdf"
          title="Export to .pdf"
        >
          <FileEarmarkPdfFill size={18} aria-hidden />
          <span className="label-long">Export to .pdf</span>
          <span className="label-short">Export PDF</span>
        </button>
        <a
          className="button agents-link icon-only"
          href={FOR_AGENTS_HREF}
          aria-label="For agents"
          title="For agents"
        >
          <Robot size={18} aria-hidden />
        </a>
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
          title="View source on GitHub"
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
  user-select: none;
  padding-block: 0;
  padding-inline: max(12px, env(safe-area-inset-left, 0px))
    max(12px, env(safe-area-inset-right, 0px));
  gap: 12px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.headerText};
  background-color: ${({ theme }) => theme.colors.headerBg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.headerBorder};
  display: flex;
  align-items: center;
  min-height: 48px;
  -webkit-font-smoothing: antialiased;

  @media (max-width: ${BP.NO_CHIP}px) {
    padding-inline: max(8px, env(safe-area-inset-left, 0px))
      max(8px, env(safe-area-inset-right, 0px));
    gap: 4px;
  }

  .project {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    margin: 0;
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 0.2px;
    line-height: 1.35;
    white-space: nowrap;

    .brand-logo {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .brand-title {
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .version-chip {
      margin-left: -4px;
      color: ${({ theme }) => theme.colors.versionChip};
      font-weight: 400;
      font-size: 0.9em;
    }

    @media (max-width: ${BP.ICON_ONLY}px) {
      font-size: 14px;

      .brand-logo {
        display: none;
      }
    }

    @media (max-width: ${BP.SMALL}px) {
      font-size: 13px;
    }

    @media (max-width: ${BP.NO_CHIP}px) {
      .version-chip {
        display: none;
      }
    }

    @media (max-width: ${BP.TINY}px) {
      font-size: 12px;
      letter-spacing: 0;
    }

    @media (max-width: ${BP.MICRO}px) {
      .brand-title {
        font-size: 11px;
      }
    }
  }

  .menu {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    flex-shrink: 0;

    @media (max-width: ${BP.SMALL}px) {
      gap: 6px;
    }

    a.button {
      text-decoration: none;
    }

    .button {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin: 0;
      padding: 0 12px;
      font-size: 14px;
      font-family: inherit;
      font-weight: 400;
      white-space: nowrap;
      border: 1px solid ${({ theme }) => theme.colors.buttonBorder};
      border-radius: 6px;
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.buttonBg};
      color: ${({ theme }) => theme.colors.buttonText};
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        transform 0.15s ease;

      &:hover {
        background-color: ${({ theme }) => theme.colors.buttonHoverBg};
        border-color: ${({ theme }) => theme.colors.buttonHoverBorder};
      }

      &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.focusRing};
        outline-offset: 2px;
      }

      &:active {
        transform: scale(0.97);
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
        &:active {
          transform: none;
        }
      }

      &.primary svg {
        color: rgb(53, 123, 253);
      }

      svg {
        flex-shrink: 0;
      }

      .label-short {
        display: none;
      }

      &.icon-only {
        width: 34px;
        padding: 0;
      }
    }

    @media (max-width: ${BP.COMPACT}px) {
      .button .label-long {
        display: none;
      }

      .button .label-short {
        display: inline;
      }
    }

    @media (max-width: ${BP.ICON_ONLY}px) {
      .button {
        width: 64px;
        padding: 0;

        .label-short {
          display: none;
        }

        &.icon-only {
          width: 34px;
        }
      }

      .agents-link {
        display: none;
      }
    }

    @media (max-width: ${BP.NARROW}px) {
      .button {
        width: 34px;
      }
    }
  }
`;
