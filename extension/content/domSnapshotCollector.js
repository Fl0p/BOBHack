(() => {
  class DomSnapshotCollector {
    constructor({ labelResolver, pathBuilder, exclusionRegistry }) {
      this.labelResolver = labelResolver;
      this.pathBuilder = pathBuilder;
      this.exclusionRegistry = exclusionRegistry ?? null;
    }

    collect() {
      const selectors = [
        'input',
        'textarea',
        'select',
        'div[contenteditable="true"]',
        'div[contenteditable="true"] p'
      ];
      const candidates = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
      const elements = Array.from(new Set(candidates)).filter((element) => this.isCollectable(element));
      const fields = elements.map((element) => this.mapElement(element));
      return {
        url: window.location.href,
        title: document.title,
        fields
      };
    }

    isCollectable(element) {
      if (!element) return false;
      if (element.disabled) return false;
      if (this.isExcluded(element)) return false;
      if (element.tagName.toLowerCase() === 'input' && element.type === 'hidden') return false;
      return true;
    }

    isExcluded(element) {
      if (!this.exclusionRegistry) return false;
      return this.exclusionRegistry.shouldExclude(element);
    }

    mapElement(element) {
      return {
        tag: element.tagName.toLowerCase(),
        type: element.type ?? null,
        name: element.name ?? null,
        id: element.id ?? null,
        label: this.labelResolver.getLabel(element),
        placeholder: element.placeholder ?? null,
        aliases: this.extractAliases(element),
        path: this.pathBuilder.build(element)
      };
    }

    extractAliases(element) {
      if (!element) return [];
      const datasets = [
        element.dataset?.bobOlxOptions,
        element.getAttribute?.('data-bob-olx-options')
      ].filter(Boolean);
      if (!datasets.length) return [];

      for (const raw of datasets) {
        if (typeof raw !== 'string' || !raw.trim()) continue;
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => (typeof item === 'string' ? item : String(item ?? ''))).filter(Boolean);
          }
        } catch {
          const items = raw
            .split(/[\n;,]+/)
            .map((item) => item.trim())
            .filter(Boolean);
          if (items.length) return items;
        }
      }

      return [];
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.DomSnapshotCollector = DomSnapshotCollector;
})();


