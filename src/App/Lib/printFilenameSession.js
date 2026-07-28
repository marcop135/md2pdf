import { DEFAULT_TITLE, toFilenameSlug } from './printTitle.js';

const SAFETY_TIMEOUT_MS = 30_000;

/** @type {import('./printFilenameSession.js').PrintFilenameSessionInternal | null} */
let activeSession = null;

const setTitleText = (title) => {
  document.title = title;
  const titleEl = document.querySelector('title');
  if (titleEl) titleEl.textContent = title;
};

const installTitleGuard = (heading) => {
  const titleEl = document.querySelector('title');
  if (!titleEl || typeof MutationObserver === 'undefined') return null;

  const observer = new MutationObserver(() => {
    if (document.title !== heading) document.title = heading;
    if (titleEl.textContent !== heading) titleEl.textContent = heading;
  });
  observer.observe(titleEl, {
    characterData: true,
    childList: true,
    subtree: true,
  });
  return observer;
};

/**
 * Begin a print filename session: set document.title, guard it, optionally
 * rewrite the URL to a heading slug, and register deferred restore listeners.
 * See docs/print-filename.md for browser notes.
 *
 * @param {string} heading - sanitized heading from extractHeading
 * @returns {boolean} true when a session started
 */
export const beginPrintFilenameSession = (heading) => {
  if (!heading) return false;

  endPrintFilenameSession();

  const originalTitle = document.title;
  const originalUrl =
    window.location.pathname + window.location.search + window.location.hash;
  const slug = toFilenameSlug(heading);

  setTitleText(heading);
  if (slug) window.history.replaceState(null, '', `/${slug}`);

  let ended = false;
  const end = () => {
    if (ended) return;
    ended = true;
    activeSession = null;

    observer?.disconnect();
    window.removeEventListener('afterprint', end);
    window.removeEventListener('focus', end);
    document.removeEventListener('visibilitychange', onVisible);
    if (safetyTimer !== null) window.clearTimeout(safetyTimer);

    setTitleText(originalTitle || DEFAULT_TITLE);
    window.history.replaceState(null, '', originalUrl);
  };

  const onVisible = () => {
    if (document.visibilityState === 'visible') end();
  };

  const observer = installTitleGuard(heading);
  window.addEventListener('afterprint', end);
  window.addEventListener('focus', end);
  document.addEventListener('visibilitychange', onVisible);
  const safetyTimer = window.setTimeout(end, SAFETY_TIMEOUT_MS);

  activeSession = { end };
  return true;
};

/** End the active print filename session and restore title/URL. Idempotent. */
export const endPrintFilenameSession = () => {
  activeSession?.end();
  activeSession = null;
};
