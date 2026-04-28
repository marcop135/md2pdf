import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

let initialized = false;
const initMermaid = () => {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'default',
    suppressErrorRendering: true,
  });
  initialized = true;
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
  const [svg, setSvg] = useState('');
  const [failed, setFailed] = useState(false);
  const idRef = useRef(`mermaid-${++uid}`);

  useEffect(() => {
    initMermaid();
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
  }, [code]);

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
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true } }) }}
    />
  );
}
