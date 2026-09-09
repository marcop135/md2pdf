import React, { useEffect, useState } from 'react';
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

const PRINT_THEME = 'default';

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

// mermaid.initialize() mutates module-global config and mermaid.render() parks
// a temp container in the document keyed by the id it is given. Two renders in
// flight at once therefore fight over both. Serialize every render through one
// chain so a theme is never swapped underneath a running layout.
const QUEUE_SLOT_TIMEOUT_MS = 8000;

let renderChain = Promise.resolve();
let uid = 0;
const renderDiagram = (code, theme) => {
  const run = renderChain.then(async () => {
    const mermaid = await loadMermaid();
    initMermaid(mermaid, theme);
    await mermaid.parse(code);
    // A fresh id per run: reusing one id across re-renders let a superseded
    // render tear out the temp container of the one that replaced it.
    const { svg } = await mermaid.render(`mermaid-${++uid}`, code);
    return svg;
  });
  // Keep the queue moving whatever this render does. A rejection must not break
  // the chain, and a render that never settles must not wedge it for good.
  renderChain = Promise.race([
    run.then(
      () => undefined,
      () => undefined,
    ),
    new Promise((resolve) => setTimeout(resolve, QUEUE_SLOT_TIMEOUT_MS)),
  ]);
  return run;
};

const pending = new Set();

// requestAnimationFrame does not fire in a hidden or throttled tab. Export must
// still reach window.print() there, so fall back to a timer.
const nextFrame = () =>
  new Promise((resolve) => {
    if (
      typeof requestAnimationFrame !== 'function' ||
      (typeof document !== 'undefined' && document.hidden)
    ) {
      setTimeout(resolve, 0);
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

const DEFAULT_RENDER_DEADLINE_MS = 3000;

/**
 * Resolve once every in-flight diagram render has committed, or once the
 * deadline expires — whichever comes first. The deadline matters twice: rAF can
 * stall in a background tab, and typing inside a mermaid fence keeps adding new
 * pending renders, which would otherwise livelock the drain loop.
 */
export const waitForMermaidRenders = async (
  deadlineMs = DEFAULT_RENDER_DEADLINE_MS,
) => {
  const expiry = Date.now() + deadlineMs;
  let expired = false;
  const timeout = new Promise((resolve) =>
    setTimeout(() => {
      expired = true;
      resolve();
    }, deadlineMs),
  );

  // Yield to let any in-flight React re-render commit and register its task.
  await Promise.race([nextFrame(), timeout]);

  // Drain the registered tasks (each resolves only after its setSvg committed).
  while (pending.size > 0 && !expired && Date.now() < expiry) {
    await Promise.race([Promise.allSettled(Array.from(pending)), timeout]);
  }
};

export default function Mermaid({ code }) {
  const { resolved } = useThemeMode();
  const screenTheme = resolved === 'dark' ? 'dark' : PRINT_THEME;
  // A dark diagram carries its palette in a <style> mermaid bakes into the SVG
  // itself, with no media guard, so it would print dark-on-white. Render a
  // second light copy for paper instead of re-rendering at print time: the
  // beforeprint path (Ctrl+P, browser menu) is synchronous and cannot await.
  const needsPrintCopy = screenTheme !== PRINT_THEME;

  const [svg, setSvg] = useState('');
  const [printSvg, setPrintSvg] = useState('');
  const [failed, setFailed] = useState(false);

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
        const screenSvg = await renderDiagram(code, screenTheme);
        if (cancelled) return;
        setSvg(screenSvg);

        if (needsPrintCopy) {
          const lightSvg = await renderDiagram(code, PRINT_THEME);
          if (cancelled) return;
          setPrintSvg(lightSvg);
        } else {
          setPrintSvg('');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Mermaid render failed:', err);
          setFailed(true);
          setSvg('');
          setPrintSvg('');
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
  }, [code, screenTheme, needsPrintCopy]);

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
  if (!needsPrintCopy) {
    return (
      <div
        className="mermaid-diagram"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  return (
    <>
      <div
        className="mermaid-diagram mermaid-diagram--screen"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {printSvg && (
        <div
          className="mermaid-diagram mermaid-diagram--print"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: printSvg }}
        />
      )}
    </>
  );
}
