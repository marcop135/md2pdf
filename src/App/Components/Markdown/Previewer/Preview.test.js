import React from 'react';
import { render } from '@testing-library/react';
import Preview from './Preview.js';

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
