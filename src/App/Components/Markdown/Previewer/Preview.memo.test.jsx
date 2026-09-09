import React, { useState } from 'react';
import { render, act } from '@testing-library/react';
import { vi } from 'vitest';

let parseCount = 0;

// Stand in for the real pipeline so a re-parse is countable. react-markdown
// rebuilds its unified() processor on every render, so one invocation here
// equals one full remark/rehype pass in production.
vi.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => {
    parseCount += 1;
    return <div data-testid="markdown">{children}</div>;
  },
  defaultUrlTransform: (value) => value,
}));

import Preview from './Preview.js';

const Host = ({ source }) => {
  const [, setTick] = useState(0);
  return (
    <>
      <button type="button" onClick={() => setTick((t) => t + 1)}>
        rerender
      </button>
      <Preview source={source} />
    </>
  );
};

describe('Preview memoization', () => {
  beforeEach(() => {
    parseCount = 0;
  });

  test('a parent re-render with unchanged source does not re-parse', () => {
    const { getByText } = render(<Host source="# Title" />);
    expect(parseCount).toBe(1);

    act(() => {
      getByText('rerender').click();
      getByText('rerender').click();
    });

    expect(parseCount).toBe(1);
  });

  test('a changed source does re-parse', () => {
    const { rerender } = render(<Preview source="# One" />);
    expect(parseCount).toBe(1);

    rerender(<Preview source="# Two" />);
    expect(parseCount).toBe(2);
  });
});
