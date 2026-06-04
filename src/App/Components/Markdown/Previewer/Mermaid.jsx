import React, { useEffect, useRef, useState } from 'react';
import { useThemeMode } from '../../../Theme';

// The mermaid engine is the single heaviest dependency in the app. Load it
// only when a diagram is actually rendered (dynamic import => its own chunk),
// so the initial page load and the Header import of waitForMermaidRenders
// below do not pull it into the main bundle. The module-level promise caches
// the load so concurrent diagrams share one fetch.
let mermaidPromise = null;
const loadMermaid = () => {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => m.default || m);
  }
  return mermaidPromise;
};

let currentTheme = null;
const initMermaid = (mermaid, theme) => {
  if (currentTheme === theme) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme,
    suppressErrorRendering: true,
  });
  currentTheme = theme;
};

const pending = new Set();
const nextFrame = () =>
  new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
export const waitForMermaidRenders = async () => {
  // Yield to let any in-flight React re-render commit and register its task.
  await nextFrame();
  // Drain the registered tasks (each resolves only after its setSvg has committed).
  while (pending.size > 0) {
    await Promise.allSettled(Array.from(pending));
  }
};

let uid = 0;

export default function Mermaid({ code }) {
  const { resolved } = useThemeMode();
  const mermaidTheme = resolved === 'dark' ? 'dark' : 'default';
  const [svg, setSvg] = useState('');
  const [failed, setFailed] = useState(false);
  const idRef = useRef(`mermaid-${++uid}`);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    let resolveCommitted;
    const committed = new Promise((r) => {
      resolveCommitted = r;
    });
    pending.add(committed);
    committed.finally(() => pending.delete(committed));

    (async () => {
      try {
        const mermaid = await loadMermaid();
        initMermaid(mermaid, mermaidTheme);
        await mermaid.parse(code);
        const { svg: out } = await mermaid.render(idRef.current, code);
        if (!cancelled) setSvg(out);
      } catch (err) {
        if (!cancelled) {
          console.error('Mermaid render failed:', err);
          setFailed(true);
          setSvg('');
        }
      } finally {
        await nextFrame();
        resolveCommitted();
      }
    })();

    return () => {
      cancelled = true;
      resolveCommitted();
    };
  }, [code, mermaidTheme]);

  if (failed) {
    return (
      <pre>
        <code className="language-mermaid">{code}</code>
      </pre>
    );
  }
  if (!svg) {
    return (
      <div
        className="mermaid-diagram mermaid-loading"
        aria-label="Rendering diagram"
      >
        {code}
      </div>
    );
  }
  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
