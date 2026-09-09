import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import {
  beginPrintFilenameSession,
  endPrintFilenameSession,
} from './printFilenameSession.js';
import { DEFAULT_TITLE } from './printTitle.js';

describe('printFilenameSession', () => {
  beforeEach(() => {
    document.title = DEFAULT_TITLE;
    document.head.innerHTML = `<title>${DEFAULT_TITLE}</title>`;
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    endPrintFilenameSession();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('begin sets document.title and URL slug', () => {
    beginPrintFilenameSession('My Report');

    expect(document.title).toBe('My Report');
    expect(window.location.pathname).toBe('/My-Report');
  });

  test('end restores title and URL', () => {
    document.title = DEFAULT_TITLE;
    window.history.replaceState(null, '', '/app');

    beginPrintFilenameSession('Hello World');
    endPrintFilenameSession();

    expect(document.title).toBe(DEFAULT_TITLE);
    expect(window.location.pathname).toBe('/app');
  });

  test('end is idempotent', () => {
    beginPrintFilenameSession('Twice');
    endPrintFilenameSession();
    expect(() => endPrintFilenameSession()).not.toThrow();
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  test('re-begin with the same heading keeps the live session', () => {
    window.history.replaceState(null, '', '/app');
    beginPrintFilenameSession('Same Heading');

    // The export button starts the session and window.print() then fires
    // beforeprint, which starts it again. A restart would restore the title
    // and URL and re-capture them mid-print.
    expect(beginPrintFilenameSession('Same Heading')).toBe(true);

    expect(document.title).toBe('Same Heading');
    expect(window.location.pathname).toBe('/Same-Heading');

    endPrintFilenameSession();
    expect(document.title).toBe(DEFAULT_TITLE);
    expect(window.location.pathname).toBe('/app');
  });

  test('double begin ends prior session cleanly', () => {
    beginPrintFilenameSession('First');
    beginPrintFilenameSession('Second');

    expect(document.title).toBe('Second');
    expect(window.location.pathname).toBe('/Second');
  });

  test('returns false for empty heading', () => {
    expect(beginPrintFilenameSession('')).toBe(false);
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  test('restore fires on afterprint', () => {
    beginPrintFilenameSession('After Print');
    window.dispatchEvent(new Event('afterprint'));
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  test('restore fires on focus', () => {
    beginPrintFilenameSession('On Focus');
    window.dispatchEvent(new Event('focus'));
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  test('restore fires when tab becomes visible', () => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
    beginPrintFilenameSession('Visible');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  test('safety timeout restores after 30s', () => {
    vi.useFakeTimers();
    beginPrintFilenameSession('Timed');
    expect(document.title).toBe('Timed');

    vi.advanceTimersByTime(30_000);
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  test('MutationObserver re-applies title when title element changes', () => {
    beginPrintFilenameSession('Guarded');

    const titleEl = document.querySelector('title');
    titleEl.textContent = 'Reset attempt';
    document.title = 'Reset attempt';

    // Observer runs asynchronously in real browsers; flush microtasks.
    return new Promise((resolve) => {
      queueMicrotask(() => {
        expect(document.title).toBe('Guarded');
        resolve();
      });
    });
  });
});
