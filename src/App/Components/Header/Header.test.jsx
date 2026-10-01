import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'nonaction';
import { TextContainer } from '../../Container';
import { ThemeProvider } from '../../Theme';
import Header from './index.js';

const renderHeader = () =>
  render(
    <ThemeProvider>
      <Provider inject={[TextContainer]}>
        <Header />
      </Provider>
    </ThemeProvider>,
  );

// Narrow tiers hide labels with CSS, so every control must keep an accessible
// name that does not depend on its visible text.
test('<Header /> controls keep accessible names at every breakpoint', () => {
  renderHeader();
  expect(
    screen.getByRole('link', { name: 'For agents' }).getAttribute('href'),
  ).toBe('/for-agents.html');
  expect(screen.getByLabelText('Import .md file').getAttribute('type')).toBe(
    'file',
  );
  expect(screen.getByRole('button', { name: 'Export to .pdf' })).toBeTruthy();
  expect(screen.getByRole('button', { name: /^Theme:/ })).toBeTruthy();
  expect(
    screen.getByRole('link', { name: 'View source on GitHub' }),
  ).toBeTruthy();
});

test('<Header /> keeps the brand title in the DOM', () => {
  const { container } = renderHeader();
  expect(container.querySelector('.brand-title').textContent).toBe(
    'Markdown to PDF',
  );
});
