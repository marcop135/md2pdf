import { vi } from 'vitest';

vi.mock('mermaid', () => ({
  __esModule: true,
  default: {
    initialize: vi.fn(),
    parse: vi.fn().mockResolvedValue(true),
    render: vi
      .fn()
      .mockResolvedValue({ svg: '<svg></svg>', bindFunctions: undefined }),
    run: vi.fn().mockResolvedValue(undefined),
  },
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

global.document.body.createTextRange = () => {
  return {
    setEnd: () => {},
    setStart: () => {},
    getBoundingClientRect: () => ({}),
    getClientRects: () => [],
  };
};

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: document.body,
  getBoundingClientRect: () => ({}),
  getClientRects: () => [],
});

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
