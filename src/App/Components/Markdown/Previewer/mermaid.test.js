import { vi } from 'vitest';

const mockMermaid = vi.hoisted(() => ({
  initialize: vi.fn(),
  render: vi.fn(),
}));

vi.mock('mermaid', () => ({
  __esModule: true,
  default: mockMermaid,
}));

const { hydrateMermaidBlocks, resetMermaidStateForTests } =
  await vi.importActual('./mermaid.js');

describe('hydrateMermaidBlocks', () => {
  beforeEach(() => {
    resetMermaidStateForTests();
    mockMermaid.initialize.mockClear();
    mockMermaid.render.mockReset();
    mockMermaid.render.mockResolvedValue({
      svg: '<svg data-test-id="mermaid"></svg>',
      bindFunctions: undefined,
    });
  });

  test('hydrates fenced mermaid code blocks', async () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<pre><code class="language-mermaid">graph TD; A-->B;</code></pre>';

    await hydrateMermaidBlocks(container);

    expect(mockMermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        startOnLoad: false,
        securityLevel: 'strict',
      }),
    );
    expect(mockMermaid.render).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.mermaid-diagram')).not.toBeNull();
    expect(container.querySelector('.mermaid-diagram svg')).not.toBeNull();
  });

  test('skips non-mermaid code blocks', async () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<pre><code class="language-javascript">const x = 1;</code></pre>';

    await hydrateMermaidBlocks(container);

    expect(mockMermaid.initialize).not.toHaveBeenCalled();
    expect(mockMermaid.render).not.toHaveBeenCalled();
    expect(
      container.querySelector('pre code.language-javascript'),
    ).not.toBeNull();
  });

  test('falls back to code block if render fails', async () => {
    const container = document.createElement('div');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    container.innerHTML =
      '<pre><code class="language-mermaid">graph TD; A-->B;</code></pre>';
    mockMermaid.render.mockRejectedValueOnce(new Error('render failed'));

    await hydrateMermaidBlocks(container);

    expect(mockMermaid.render).toHaveBeenCalledTimes(1);
    const fallbackCode = container.querySelector('pre code.language-mermaid');
    expect(fallbackCode).not.toBeNull();
    expect(fallbackCode.textContent).toBe('graph TD; A-->B;');

    errorSpy.mockRestore();
  });
});
