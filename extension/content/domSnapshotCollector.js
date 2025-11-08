(() => {
  class DomSnapshotCollector {
    constructor({ labelResolver, pathBuilder, exclusionRegistry }) {
      this.labelResolver = labelResolver;
      this.pathBuilder = pathBuilder;
      this.exclusionRegistry = exclusionRegistry ?? null;
    }

    collect() {
      const elements = Array.from(document.querySelectorAll('input, textarea, select')).filter((element) =>
        this.isCollectable(element)
      );
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
        path: this.pathBuilder.build(element)
      };
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.DomSnapshotCollector = DomSnapshotCollector;
})();


