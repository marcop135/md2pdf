import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  MAX_MARKDOWN_BYTES,
  registerAgentHandlers,
  unregisterAgentHandlers,
} from './agentBridge.js';

describe('agentBridge', () => {
  beforeEach(() => {
    unregisterAgentHandlers();
    delete window.md2pdf;
  });

  afterEach(() => {
    unregisterAgentHandlers();
    delete window.md2pdf;
  });

  test('exposes window.md2pdf after register', () => {
    registerAgentHandlers({
      getText: () => 'hi',
      setText: vi.fn(),
      prepareExport: vi.fn(),
      exportPdf: vi.fn(),
    });
    expect(window.md2pdf.getMarkdown()).toBe('hi');
  });

  test('setMarkdown rejects non-strings and oversized payloads', () => {
    const setText = vi.fn();
    registerAgentHandlers({
      getText: () => '',
      setText,
      prepareExport: vi.fn(),
      exportPdf: vi.fn(),
    });
    expect(() => window.md2pdf.setMarkdown(1)).toThrow(/string/);
    expect(() =>
      window.md2pdf.setMarkdown('x'.repeat(MAX_MARKDOWN_BYTES + 1)),
    ).toThrow(/2MB/);
    expect(setText).not.toHaveBeenCalled();
  });

  test('setMarkdown caps multi-byte text by UTF-8 bytes, like file import', () => {
    const setText = vi.fn();
    registerAgentHandlers({
      getText: () => '',
      setText,
      prepareExport: vi.fn(),
      exportPdf: vi.fn(),
    });
    // 1M three-byte characters: under the cap in UTF-16 units, 3 MB in bytes.
    expect(() => window.md2pdf.setMarkdown('€'.repeat(1024 * 1024))).toThrow(
      /2MB/,
    );
    expect(setText).not.toHaveBeenCalled();
  });

  test('window.md2pdf cannot be reassigned or mutated', () => {
    registerAgentHandlers({
      getText: () => 'real',
      setText: vi.fn(),
      prepareExport: vi.fn(),
      exportPdf: vi.fn(),
    });
    const bridge = window.md2pdf;
    expect(() => {
      window.md2pdf = { getMarkdown: () => 'fake' };
    }).toThrow(TypeError);
    expect(() => {
      bridge.getMarkdown = () => 'fake';
    }).toThrow(TypeError);
    expect(window.md2pdf.getMarkdown()).toBe('real');
  });

  test('setMarkdown updates text through handlers', () => {
    const setText = vi.fn();
    registerAgentHandlers({
      getText: () => '',
      setText,
      prepareExport: vi.fn(),
      exportPdf: vi.fn(),
    });
    expect(window.md2pdf.setMarkdown('# Hello')).toEqual({
      ok: true,
      length: 7,
    });
    expect(setText).toHaveBeenCalledWith('# Hello');
  });

  test('throws when bridge is not registered', () => {
    registerAgentHandlers({
      getText: () => 'a',
      setText: vi.fn(),
      prepareExport: vi.fn(),
      exportPdf: vi.fn(),
    });
    unregisterAgentHandlers();
    expect(() => window.md2pdf.getMarkdown()).toThrow(/not ready/);
  });
});
