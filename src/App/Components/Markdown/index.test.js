import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'nonaction';
import { TextContainer } from '../../Container';
import Markdown from './index.js';
// afterEach(cleanup);
// duplicate of setupTests.js
test('<Markdown /> Previewer lazy load should work', async () => {
  const { container } = render(
    React.createElement(
      Provider,
      { inject: [TextContainer] },
      React.createElement(Markdown),
    ),
  );
  expect(container.textContent).not.toEqual('');
});

// const Editor = container.querySelector('.CodeMirror');
// Editor.CodeMirror.setValue should make editor change.

// Cause jest dom did not have createTextRange(maybe codemirror fallback IE API)
// so, we could not test for codemirror (like. setValue)...
// bellow is the exception message when codemirror onChange trigger
// TypeError: range(...).getClientRects is not a function
