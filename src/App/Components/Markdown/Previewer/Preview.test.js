import React from 'react';
import { render } from '@testing-library/react';
import Preview, { sanitizeHighlightHtml } from './Preview.js';

test('strips <script> tags from embedded HTML', () => {
  const source = '<p>Hello</p><script>window.__pwned = true;</script>';
  const { container } = render(<Preview source={source} />);
  expect(container.querySelector('script')).toBeNull();
  expect(container.textContent).toContain('Hello');
});

test('strips event handlers like onerror from <img> tags', () => {
  const source = '<img src="https://example.com/x.png" alt="x" onerror="window.__pwned=true">';
  const { container } = render(<Preview source={source} />);
  const img = container.querySelector('img');
  expect(img).toBeTruthy();
  expect(img.getAttribute('onerror')).toBeNull();
  expect(img.hasAttribute('onerror')).toBe(false);
});

test('strips javascript: URLs from anchors', () => {
  const source = '<a href="javascript:alert(1)">click</a>';
  const { container } = render(<Preview source={source} />);
  const a = container.querySelector('a');
  const href = a?.getAttribute('href') || '';
  expect(href).not.toMatch(/^javascript:/i);
});

test('preserves <style> blocks for user-defined custom styling', () => {
  const source = [
    '<style>',
    'body { max-width: 94%; margin-left: auto; margin-right: auto; }',
    '</style>',
    '',
    '# Hello',
  ].join('\n');
  const { container } = render(<Preview source={source} />);
  const style = container.querySelector('style');
  expect(style).toBeTruthy();
  expect(style.textContent).toContain('max-width: 94%');
  // The CSS rule should NOT appear as visible text content
  // outside the <style> element.
  const visibleText = container.textContent.replace(style.textContent || '', '');
  expect(visibleText).not.toContain('max-width: 94%');
});

test('keeps tel: and mailto: URLs (CV contact rows)', () => {
  const source = [
    '<a href="mailto:cv@example.com">email</a>',
    '<a href="tel:+15555550100">phone</a>',
  ].join('');
  const { container } = render(<Preview source={source} />);
  expect(container.querySelector('a[href="mailto:cv@example.com"]')).toBeTruthy();
  expect(container.querySelector('a[href="tel:+15555550100"]')).toBeTruthy();
});

test('renders embedded raw HTML (e.g. CV contact tables)', () => {
  const source = [
    '<table><tbody><tr><td>user@example.com</td></tr></tbody></table>',
    '',
    '## Summary',
    '',
    'Body text.',
  ].join('\n');

  const { container } = render(<Preview source={source} />);

  expect(container.querySelector('table')).toBeTruthy();
  expect(container.textContent).toContain('user@example.com');
  expect(container.textContent).toContain('Summary');
  expect(container.textContent).toContain('Body text.');
});

test('renders nested HTML tables and mailto links like a CV header', () => {
  const source = [
    '<!-- Contacts -->',
    '<table style="width: 100%;">',
    '  <tr>',
    '    <td><img alt="Photo" src="https://example.com/p.png" /></td>',
    '    <td>',
    '      <table><tr>',
    '        <td><p><strong>Email:</strong> <a href="mailto:test@example.com">test@example.com</a></p></td>',
    '        <td><p><strong>Location:</strong> Munich</p></td>',
    '      </tr></table>',
    '    </td>',
    '  </tr>',
    '</table>',
    '',
    '## Experience',
    '',
    'Role.',
  ].join('\n');

  const { container } = render(<Preview source={source} />);

  expect(container.querySelectorAll('table').length).toBeGreaterThanOrEqual(2);
  expect(
    container.querySelector('a[href="mailto:test@example.com"]'),
  ).toBeTruthy();
  expect(container.textContent).toContain('Munich');
  expect(container.textContent).toContain('Experience');
});

test('renders full CV-style contacts HTML (nested tables, photo, tel/mailto)', () => {
  const source = [
    '<!-- Contacts -->',
    '<!-- Photo included -->',
    '<table style="width: 100%; border-collapse: collapse;">',
    '  <tr style="border: none; background: none;">',
    '    <td style="width: 125px; vertical-align: middle; border: none; background: none; padding: 10px 10px 12px 0;">',
    '      <img src="https://example.com/photo.jpg" alt="Candidate" style="border-radius: 50%; width: 100%; border: 2px solid #ccc;">',
    '    </td>',
    '    <td style="border: none; background: none; vertical-align: middle;">',
    '      <table style="width: 100%; border-collapse: collapse;">',
    '        <tr style="border: none; background: none; vertical-align: middle;">',
    '          <td style="padding: 0 24px 0 3px; border: none; background: none;">',
    '            <p style="margin: 0 0 4px 0;"><strong>Email:</strong> <a href="mailto:cv@example.com">cv@example.com</a></p>',
    '            <p style="margin: 0 0 4px 0;"><strong>Phone:</strong> <a href="tel:+15555550100">+1 555-555-0100</a></p>',
    '            <p style="margin: 0 0 4px 0;"><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/example">linkedin.com/in/example</a></p>',
    '          </td>',
    '          <td style="padding: 0 24px 0 3px; border: none; background: none;">',
    '            <p style="margin: 0 0 4px 0;"><strong>Website:</strong> <a href="https://example.com">example.com</a></p>',
    '            <p style="margin: 0 0 4px 0;"><strong>Location:</strong> Munich, Germany</p>',
    '            <p style="margin:0 0 4px 0;"><strong>Work Status:</strong> EU, unrestricted</p>',
    '          </td>',
    '        </tr>',
    '      </table>',
    '    </td>',
    '  </tr>',
    '</table>',
    '',
    '## Summary',
    '',
    'Intro.',
  ].join('\n');

  const { container } = render(<Preview source={source} />);

  expect(container.querySelector('img[alt="Candidate"]')).toBeTruthy();
  expect(container.querySelector('a[href="mailto:cv@example.com"]')).toBeTruthy();
  expect(container.querySelector('a[href="tel:+15555550100"]')).toBeTruthy();
  expect(container.textContent).toContain('Work Status:');
  expect(container.textContent).toContain('EU, unrestricted');
  expect(container.textContent).toContain('Summary');
  expect(container.textContent).toContain('Intro.');
});

test('keeps only span class wrappers in syntax-highlight HTML', () => {
  const sanitized = sanitizeHighlightHtml(
    '<span class="hljs-keyword" data-x="1">const</span><em> remove tag </em><span onclick="x()">x</span>',
  );

  expect(sanitized).toContain('<span class="hljs-keyword">const</span>');
  expect(sanitized).toContain(' remove tag ');
  expect(sanitized).toContain('<span>x</span>');
  expect(sanitized).not.toContain('<em>');
  expect(sanitized).not.toContain('onclick=');
  expect(sanitized).not.toContain('data-x=');
});

test('renders fenced code blocks even with unknown languages', () => {
  const source = ['```unknownlang', 'const foo = 1;', '```'].join('\n');
  const { container } = render(<Preview source={source} />);
  const code = container.querySelector('code.language-unknownlang');
  expect(code).toBeTruthy();
  expect(code.textContent).toContain('const foo = 1;');
});
