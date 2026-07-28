import { describe, expect, test } from 'vitest';
import {
  DEFAULT_TITLE,
  extractHeading,
  sanitizeForFilename,
  toFilenameSlug,
} from './printTitle.js';

describe('sanitizeForFilename', () => {
  test('replaces filesystem-illegal characters with spaces', () => {
    expect(sanitizeForFilename('a/b\\c:d*e?f"g<h>i|j')).toBe(
      'a b c d e f g h i j',
    );
  });

  test('collapses whitespace and trims', () => {
    expect(sanitizeForFilename('  hello   world  ')).toBe('hello world');
  });

  test('handles null and undefined', () => {
    expect(sanitizeForFilename(null)).toBe('');
    expect(sanitizeForFilename(undefined)).toBe('');
  });

  test('strips embedded newlines and tabs', () => {
    expect(sanitizeForFilename('line1\nline2\tend')).toBe('line1 line2 end');
  });
});

describe('extractHeading', () => {
  test('returns ATX h1', () => {
    expect(extractHeading('# Hello world')).toBe('Hello world');
  });

  test('returns ATX h2 when no h1', () => {
    expect(extractHeading('Some prose\n\n## Sub heading\nbody')).toBe(
      'Sub heading',
    );
  });

  test('handles ATX h6', () => {
    expect(extractHeading('###### Tiny')).toBe('Tiny');
  });

  test('strips trailing closing hashes from ATX', () => {
    expect(extractHeading('## Heading ##')).toBe('Heading');
  });

  test('returns Setext h1 when it appears first', () => {
    expect(extractHeading('Setext title\n===\n\n# Later atx')).toBe(
      'Setext title',
    );
  });

  test('returns embedded HTML heading', () => {
    expect(extractHeading('<h2>HTML heading</h2>\n\nbody')).toBe(
      'HTML heading',
    );
  });

  test('picks the earliest heading regardless of style', () => {
    const md = '<h1>HTML first</h1>\n\n# ATX later';
    expect(extractHeading(md)).toBe('HTML first');
  });

  test('strips inline emphasis and code from heading text', () => {
    expect(extractHeading('# **Bold** _em_ `code` and [link](url)')).toBe(
      'Bold em code and link',
    );
  });

  test('sanitises filesystem-illegal characters in heading text', () => {
    expect(extractHeading('# foo/bar:baz?')).toBe('foo bar baz');
  });

  test('keeps intraword underscores in snake_case headings', () => {
    expect(extractHeading('# my_snake_case_var')).toBe('my_snake_case_var');
  });

  test('still strips underscore emphasis at word boundaries', () => {
    expect(extractHeading('# _italic_ word')).toBe('italic word');
  });

  test('returns empty string when no heading found', () => {
    expect(extractHeading('just prose, nothing else')).toBe('');
  });

  test('returns empty string for empty input', () => {
    expect(extractHeading('')).toBe('');
    expect(extractHeading(null)).toBe('');
    expect(extractHeading(undefined)).toBe('');
  });

  test('does not match heading inside fenced code block heuristics', () => {
    // Conservative: we still match '#' anywhere; ensure leading whitespace cap.
    // Indented by 4+ spaces (code block) should not match ATX.
    expect(extractHeading('    # not a heading\n\n# Real one')).toBe(
      'Real one',
    );
  });
});

describe('toFilenameSlug', () => {
  test('hyphenates spaces and drops trailing punctuation', () => {
    expect(toFilenameSlug('Hello World!')).toBe('Hello-World');
  });

  test('collapses runs of non-alphanumerics into single hyphens', () => {
    expect(toFilenameSlug('foo / bar : baz')).toBe('foo-bar-baz');
  });

  test('trims leading and trailing hyphens', () => {
    expect(toFilenameSlug('  --weird-- ')).toBe('weird');
  });

  test('transliterates accented characters to ASCII', () => {
    expect(toFilenameSlug('Café Résumé')).toBe('Cafe-Resume');
  });

  test('caps the length so the URL path stays short', () => {
    expect(toFilenameSlug('a'.repeat(200))).toHaveLength(100);
  });

  test('returns empty string for empty or null input', () => {
    expect(toFilenameSlug('')).toBe('');
    expect(toFilenameSlug(null)).toBe('');
    expect(toFilenameSlug(undefined)).toBe('');
  });

  test('returns empty string when nothing alphanumeric remains', () => {
    expect(toFilenameSlug('!!! ??? ...')).toBe('');
  });
});

describe('DEFAULT_TITLE', () => {
  test('is the brand fallback string', () => {
    expect(DEFAULT_TITLE).toBe('Markdown to PDF');
  });
});
