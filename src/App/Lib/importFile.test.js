import { describe, expect, test } from 'vitest';
import { classifyImport, textForImport } from './importFile.js';

describe('classifyImport', () => {
  test('accepts markdown extensions', () => {
    expect(classifyImport('notes.md')).toBe('markdown');
    expect(classifyImport('Notes.MARKDOWN')).toBe('markdown');
    expect(classifyImport('draft.mdown')).toBe('markdown');
    expect(classifyImport('draft.mkd')).toBe('markdown');
  });

  test('accepts .mmd', () => {
    expect(classifyImport('flow.mmd')).toBe('mermaid');
    expect(classifyImport('flow.MMD')).toBe('mermaid');
  });

  test('rejects other names', () => {
    expect(classifyImport('notes.txt')).toBe(null);
    expect(classifyImport('notes.md.txt')).toBe(null);
    expect(classifyImport('diagram.mermaid')).toBe(null);
  });
});

describe('textForImport', () => {
  test('markdown bytes pass through', () => {
    const raw = '# Title\r\n\r\nbody\n';
    expect(textForImport('markdown', raw)).toBe(raw);
  });

  test('wraps a raw .mmd body in one mermaid fence', () => {
    expect(textForImport('mermaid', 'graph TD\r\nA-->B')).toBe(
      '```mermaid\ngraph TD\nA-->B\n```\n',
    );
  });

  test('returns an already-fenced .mmd unchanged', () => {
    const raw = '```mermaid\ngraph TD\nA-->B\n```\n';
    expect(textForImport('mermaid', raw)).toBe(raw);
  });

  test('uses a longer fence when the body contains triple backticks', () => {
    expect(textForImport('mermaid', 'A["```"]\nB')).toBe(
      '````mermaid\nA["```"]\nB\n````\n',
    );
  });

  test('strips a leading BOM before wrapping', () => {
    expect(textForImport('mermaid', '\uFEFFgraph TD')).toBe(
      '```mermaid\ngraph TD\n```\n',
    );
  });
});
