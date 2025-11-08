(() => {
  class CssPathBuilder {
    constructor({ maxDepth = 5 } = {}) {
      this.maxDepth = maxDepth;
    }

    build(element) {
      if (!element) return '';
      const path = [];
      let current = element;
      while (current && current.nodeType === Node.ELEMENT_NODE && path.length < this.maxDepth) {
        let selector = current.nodeName.toLowerCase();
        if (current.id) {
          selector += `#${current.id}`;
          path.unshift(selector);
          break;
        }
        if (current.classList.length) {
          selector += `.${Array.from(current.classList).slice(0, 2).join('.')}`;
        }
        const siblings = Array.from(current.parentElement?.children ?? []).filter(
          (sibling) => sibling.nodeName === current.nodeName
        );
        const index = siblings.indexOf(current) + 1;
        if (index > 0) selector += `:nth-of-type(${index})`;
        path.unshift(selector);
        current = current.parentElement;
      }
      return path.join(' > ');
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.CssPathBuilder = CssPathBuilder;
})();


