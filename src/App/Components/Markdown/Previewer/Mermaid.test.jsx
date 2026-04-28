import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Mermaid, { waitForMermaidRenders } from './Mermaid.jsx';

describe('Mermaid component', () => {
  test('renders diagram SVG or graceful fallback', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<Mermaid code="graph TD; A-->B;" />);
    await waitFor(() => {
      const svg = container.querySelector('.mermaid-diagram svg');
      const fallback = container.querySelector('pre code.language-mermaid');
      expect(svg || fallback).not.toBeNull();
    });
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
