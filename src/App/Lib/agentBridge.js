/** Cap matches Import / drag-drop (2 MB of UTF-8 bytes, like `File.size`). */
export const MAX_MARKDOWN_BYTES = 2 * 1024 * 1024;

let handlers = null;

const notReady = () => {
  throw new Error('md2pdf agent bridge is not ready');
};

const utf8Bytes = (text) => new TextEncoder().encode(text).length;

const api = Object.freeze({
  getMarkdown() {
    if (!handlers) notReady();
    return handlers.getText();
  },
  setMarkdown(markdown) {
    if (!handlers) notReady();
    if (typeof markdown !== 'string') {
      throw new Error('markdown must be a string');
    }
    if (
      markdown.length > MAX_MARKDOWN_BYTES ||
      utf8Bytes(markdown) > MAX_MARKDOWN_BYTES
    ) {
      throw new Error('markdown exceeds the 2MB limit');
    }
    handlers.setText(markdown);
    return { ok: true, length: markdown.length };
  },
  async prepareExport() {
    if (!handlers) notReady();
    await handlers.prepareExport();
    return { ok: true };
  },
  async exportPdf() {
    if (!handlers) notReady();
    await handlers.exportPdf();
    return { ok: true };
  },
});

export const getAgentHandlers = () => handlers;

export const registerAgentHandlers = (next) => {
  handlers = next;
  if (typeof window !== 'undefined') {
    // Read-only binding to a frozen object: page code or a stray global cannot
    // swap the bridge agents call into.
    Object.defineProperty(window, 'md2pdf', {
      value: api,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
};

export const unregisterAgentHandlers = () => {
  handlers = null;
};

export default api;
