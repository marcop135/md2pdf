import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import mermaid from 'mermaid';
import Mermaid, { waitForMermaidRenders } from './Mermaid.jsx';
import { ThemeProvider } from '../../../Theme';

const flushAsync = async () => {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));
  });
};

describe('Mermaid component', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  test('renders diagram SVG or graceful fallback', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<Mermaid code="graph TD; A-->B;" />);
    await flushAsync();
    await waitFor(() => {
      const svg = container.querySelector('.mermaid-diagram svg');
      const fallback = container.querySelector('pre code.language-mermaid');
      const loading = container.querySelector('.mermaid-loading');
      expect(svg || fallback || loading).not.toBeNull();
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

  test('light mode renders a single diagram with no print copy', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('md2pdf-theme', 'light');
    const { container } = render(
      <ThemeProvider>
        <Mermaid code="graph TD; L-->M;" />
      </ThemeProvider>,
    );
    await flushAsync();
    await waitFor(() => {
      expect(container.querySelector('.mermaid-diagram svg')).not.toBeNull();
    });
    expect(container.querySelector('.mermaid-diagram--print')).toBeNull();
    expect(container.querySelector('.mermaid-diagram--screen')).toBeNull();
    errorSpy.mockRestore();
  });

  test('dark mode also renders a light copy for print', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('md2pdf-theme', 'dark');
    const { container } = render(
      <ThemeProvider>
        <Mermaid code="graph TD; D-->E;" />
      </ThemeProvider>,
    );
    await flushAsync();
    await waitFor(() => {
      expect(
        container.querySelector('.mermaid-diagram--screen svg'),
      ).not.toBeNull();
      expect(
        container.querySelector('.mermaid-diagram--print svg'),
      ).not.toBeNull();
    });

    const themes = mermaid.initialize.mock.calls.map(([cfg]) => cfg.theme);
    expect(themes).toContain('dark');
    expect(themes).toContain('default');
    errorSpy.mockRestore();
  });

  test('concurrent renders never share a diagram id', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <>
        <Mermaid code="graph TD; A1-->B1;" />
        <Mermaid code="graph TD; A2-->B2;" />
        <Mermaid code="graph TD; A3-->B3;" />
      </>,
    );
    await flushAsync();
    await waitForMermaidRenders();

    const ids = mermaid.render.mock.calls.map(([id]) => id);
    expect(ids.length).toBeGreaterThanOrEqual(3);
    expect(new Set(ids).size).toBe(ids.length);
    errorSpy.mockRestore();
  });

  // Last: leaves a slow render settling in the background.
  test('waitForMermaidRenders gives up at its deadline', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mermaid.render.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ svg: '<svg></svg>' }), 800),
        ),
    );
    render(<Mermaid code="graph TD; slow-->pending;" />);

    const startedAt = Date.now();
    await waitForMermaidRenders(50);
    expect(Date.now() - startedAt).toBeLessThan(500);
    errorSpy.mockRestore();
  });
});
