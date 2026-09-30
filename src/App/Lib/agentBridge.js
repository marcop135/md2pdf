/** Cap matches Import / drag-drop (2 MB). */
export const MAX_MARKDOWN_CHARS = 2 * 1024 * 1024;

let handlers = null;

const notReady = () => {
  throw new Error('md2pdf agent bridge is not ready');
};

const api = {
  getMarkdown() {
    if (!handlers) notReady();
    return handlers.getText();
  },
  setMarkdown(markdown) {
    if (!handlers) notReady();
    if (typeof markdown !== 'string') {
      throw new Error('markdown must be a string');
    }
    if (markdown.length > MAX_MARKDOWN_CHARS) {
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
};

export const getAgentHandlers = () => handlers;

export const registerAgentHandlers = (next) => {
  handlers = next;
  if (typeof window !== 'undefined') {
    window.md2pdf = api;
  }
};

export const unregisterAgentHandlers = () => {
  handlers = null;
};

export default api;
