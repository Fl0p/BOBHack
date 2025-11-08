(() => {
  class DomExclusionRegistry {
    constructor() {
      this.selectors = new Set();
    }

    addSelector(selector) {
      if (typeof selector !== 'string' || !selector.trim()) return;
      this.selectors.add(selector.trim());
    }

    addSelectors(selectors) {
      (selectors ?? []).forEach((selector) => this.addSelector(selector));
    }

    shouldExclude(element) {
      if (!element || !(element instanceof Element)) return false;
      for (const selector of this.selectors) {
        try {
          if (element.matches(selector)) return true;
        } catch (error) {
          console.warn('Invalid exclusion selector skipped', selector, error);
        }
      }
      return false;
    }

    getSelectors() {
      return Array.from(this.selectors);
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.DomExclusionRegistry = DomExclusionRegistry;
})();


