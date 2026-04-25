import React from 'react';
import { render, waitFor } from '@testing-library/react';
import mermaid from 'mermaid';
import { vi } from 'vitest';
import Mermaid, { waitForMermaidRenders } from './Mermaid.jsx';

describe('Mermaid component', () => {
  beforeEach(() => {
    mermaid.initialize.mockClear?.();
    mermaid.render.mockReset?.();
    mermaid.render.mockResolvedValue?.({
      svg: '<svg data-test-id="mermaid"></svg>',
      bindFunctions: undefined,
    });
    if (mermaid.parse?.mockResolvedValue) {
      mermaid.parse.mockResolvedValue(true);
    } else {
      mermaid.parse = vi.fn().mockResolvedValue(true);
    }
  });

  test('renders SVG when mermaid resolves', async () => {
    const { container } = render(<Mermaid code="graph TD; A-->B;" />);
    await waitFor(() =>
      expect(container.querySelector('.mermaid-diagram svg')).not.toBeNull(),
    );
    expect(mermaid.render).toHaveBeenCalled();
  });

  test('falls back to code block on render failure', async () => {
    mermaid.render.mockRejectedValueOnce(new Error('boom'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<Mermaid code="not a diagram" />);
    await waitFor(() =>
      expect(
        container.querySelector('pre code.language-mermaid'),
      ).not.toBeNull(),
    );
    expect(container.querySelector('pre code.language-mermaid').textContent).toBe(
      'not a diagram',
    );
    errorSpy.mockRestore();
  });

  test('waitForMermaidRenders resolves after pending renders complete', async () => {
    render(<Mermaid code="graph TD; A-->B;" />);
    await expect(waitForMermaidRenders()).resolves.toBeUndefined();
  });
});
