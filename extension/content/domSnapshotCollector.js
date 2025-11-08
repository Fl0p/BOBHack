(() => {
  class DomSnapshotCollector {
    constructor({ labelResolver, pathBuilder }) {
      this.labelResolver = labelResolver;
      this.pathBuilder = pathBuilder;
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

      const tag = element.tagName.toLowerCase();
      if (tag === 'input') {
        const type = (element.type ?? '').toLowerCase();
        const excludedTypes = new Set(['hidden', 'button', 'submit', 'reset', 'image']);
        if (excludedTypes.has(type)) return false;
      }

      return true;
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


