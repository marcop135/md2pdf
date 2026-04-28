import DOMPurify from 'dompurify';
import mermaid from 'mermaid';

const MERMAID_CODE_SELECTOR = [
  'pre > code.language-mermaid',
  'pre > code.mermaid',
  'code.language-mermaid',
  'code.mermaid',
].join(', ');

let hasInitializedMermaid = false;
let renderBatch = 0;
let hydrationToken = 0;

const createFallbackCodeBlock = (definition) => {
  const pre = document.createElement('pre');
  const code = document.createElement('code');

  code.className = 'language-mermaid';
  code.textContent = definition;
  pre.appendChild(code);

  return pre;
};

const replaceWithMermaidNodes = (container) => {
  const codeNodes = Array.from(
    container.querySelectorAll(MERMAID_CODE_SELECTOR),
  );
  const uniqueCodeNodes = Array.from(new Set(codeNodes));

  return uniqueCodeNodes
    .map((codeNode, index) => {
      const definition = codeNode.textContent
        ? codeNode.textContent.trim()
        : '';
      if (!definition) {
        return null;
      }

      const preNode = codeNode.closest('pre');
      const targetNode = preNode || codeNode;
      const parentNode = targetNode.parentNode;
      if (!parentNode) {
        return null;
      }

      const diagramNode = document.createElement('div');
      diagramNode.className = 'mermaid mermaid-diagram';
      diagramNode.setAttribute(
        'data-mermaid-id',
        `mermaid-${renderBatch}-${index}`,
      );
      diagramNode.textContent = definition;

      parentNode.replaceChild(diagramNode, targetNode);

      return { definition, diagramNode };
    })
    .filter(Boolean);
};

const initializeMermaid = () => {
  if (hasInitializedMermaid) {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'default',
  });
  hasInitializedMermaid = true;
};

export const hydrateMermaidBlocks = async (container) => {
  if (!container) {
    return;
  }

  const diagramEntries = replaceWithMermaidNodes(container);
  if (diagramEntries.length === 0) {
    return;
  }

  initializeMermaid();
  renderBatch += 1;
  hydrationToken += 1;
  const currentHydrationToken = hydrationToken;

  await Promise.all(
    diagramEntries.map(async ({ definition, diagramNode }, index) => {
      const renderId = `mermaid-${renderBatch}-${index}`;

      try {
        const { svg, bindFunctions } = await mermaid.render(
          renderId,
          definition,
        );

        if (
          currentHydrationToken !== hydrationToken ||
          !container.contains(diagramNode)
        ) {
          return;
        }

        diagramNode.innerHTML = DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true } });
        if (typeof bindFunctions === 'function') {
          bindFunctions(diagramNode);
        }
      } catch (error) {
        console.error(
          'Mermaid render failed. Falling back to code block.',
          error,
        );

        const parentNode = diagramNode.parentNode;
        if (!parentNode) {
          return;
        }
        parentNode.replaceChild(
          createFallbackCodeBlock(definition),
          diagramNode,
        );
      }
    }),
  );
};

export const resetMermaidStateForTests = () => {
  hasInitializedMermaid = false;
  renderBatch = 0;
  hydrationToken = 0;
};
