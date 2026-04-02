import mermaid from 'mermaid';
import { vi } from 'vitest';
import { hydrateMermaidBlocks, resetMermaidStateForTests } from './mermaid.js';

vi.mock('mermaid', () => ({
  __esModule: true,
  default: {
    initialize: vi.fn(),
    render: vi.fn(),
  },
}));

describe('hydrateMermaidBlocks', () => {
  beforeEach(() => {
    resetMermaidStateForTests();
    mermaid.initialize.mockClear();
    mermaid.render.mockReset();
    mermaid.render.mockResolvedValue({
      svg: '<svg data-test-id="mermaid"></svg>',
      bindFunctions: undefined,
    });
  });

  test('hydrates fenced mermaid code blocks', async () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<pre><code class="language-mermaid">graph TD; A-->B;</code></pre>';

    await hydrateMermaidBlocks(container);

    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        startOnLoad: false,
        securityLevel: 'strict',
      }),
    );
    expect(mermaid.render).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.mermaid-diagram')).not.toBeNull();
    expect(container.querySelector('.mermaid-diagram svg')).not.toBeNull();
  });

  test('skips non-mermaid code blocks', async () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<pre><code class="language-javascript">const x = 1;</code></pre>';

    await hydrateMermaidBlocks(container);

    expect(mermaid.initialize).not.toHaveBeenCalled();
    expect(mermaid.render).not.toHaveBeenCalled();
    expect(
      container.querySelector('pre code.language-javascript'),
    ).not.toBeNull();
  });

  test('falls back to code block if render fails', async () => {
    const container = document.createElement('div');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    container.innerHTML =
      '<pre><code class="language-mermaid">graph TD; A-->B;</code></pre>';
    mermaid.render.mockRejectedValueOnce(new Error('render failed'));

    await hydrateMermaidBlocks(container);

    expect(mermaid.render).toHaveBeenCalledTimes(1);
    const fallbackCode = container.querySelector('pre code.language-mermaid');
    expect(fallbackCode).not.toBeNull();
    expect(fallbackCode.textContent).toBe('graph TD; A-->B;');

    errorSpy.mockRestore();
  });
});
