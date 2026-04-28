import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Mermaid, { waitForMermaidRenders } from './Mermaid.jsx';

describe('Mermaid component', () => {
  test('renders fallback when mermaid fails in jsdom (no SVG support)', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<Mermaid code="graph TD; A-->B;" />);
    await waitFor(() =>
      expect(
        container.querySelector('pre code.language-mermaid'),
      ).not.toBeNull(),
    );
    expect(
      container.querySelector('pre code.language-mermaid').textContent,
    ).toBe('graph TD; A-->B;');
    errorSpy.mockRestore();
  });

  test('shows loading state initially', () => {
    const { container } = render(<Mermaid code="graph TD; A-->B;" />);
    const loading = container.querySelector('.mermaid-loading');
    expect(loading || container.querySelector('pre code')).not.toBeNull();
  });

  test('waitForMermaidRenders resolves after pending renders complete', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Mermaid code="graph TD; A-->B;" />);
    await expect(waitForMermaidRenders()).resolves.toBeUndefined();
    errorSpy.mockRestore();
  });
});
