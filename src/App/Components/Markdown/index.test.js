import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'nonaction';
import { TextContainer } from '../../Container';
import useIsMobile from '../../Container/Hooks/useIsMobile.js';
import { ThemeProvider } from '../../Theme';
import Markdown from './index.js';

vi.mock('../../Container/Hooks/useIsMobile.js', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const renderMarkdown = () =>
  render(
    React.createElement(
      ThemeProvider,
      null,
      React.createElement(
        Provider,
        { inject: [TextContainer] },
        React.createElement(Markdown),
      ),
    ),
  );

test('<Markdown /> Previewer lazy load should work', async () => {
  useIsMobile.mockReturnValue(false);
  const { container } = renderMarkdown();
  expect(container.textContent).not.toEqual('');
});

// Regression guard for the v2.9.16 mobile print fix: on mobile, the Previewer
// must remain mounted even on the editor tab so that Header.onTransform can
// query `.preview` and window.print() has the rendered preview in the DOM.
test('<Markdown /> on mobile keeps .preview in the DOM from the editor tab', async () => {
  useIsMobile.mockReturnValue(true);
  const { container } = renderMarkdown();
  await waitFor(() => {
    expect(container.querySelector('.preview')).not.toBeNull();
  });
});

// const Editor = container.querySelector('.CodeMirror');
// Editor.CodeMirror.setValue should make editor change.

// Cause jest dom did not have createTextRange(maybe codemirror fallback IE API)
// so, we could not test for codemirror (like. setValue)...
// bellow is the exception message when codemirror onChange trigger
// TypeError: range(...).getClientRects is not a function
