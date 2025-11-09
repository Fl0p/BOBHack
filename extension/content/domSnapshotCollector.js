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
      const label = this.labelResolver.getLabel(element);
      return {
        tag: element.tagName.toLowerCase(),
        type: element.type ?? null,
        name: element.name ?? null,
        id: element.id ?? null,
        label,
        placeholder: element.placeholder ?? null,
        aliases: this.extractAliases(element, label),
        path: this.pathBuilder.build(element)
      };
    }

    extractAliases(element, labelText) {
      if (!element) return [];

      const aliases = new Set();
      const add = (value) => {
        if (typeof value !== 'string') return;
        const trimmed = value.trim();
        if (trimmed) aliases.add(trimmed);
      };

      const parseOptionList = (raw) => {
        if (typeof raw !== 'string' || !raw.trim()) return;
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => add(typeof item === 'string' ? item : String(item ?? '')));
            return;
          }
        } catch {
          const items = raw
            .split(/[\n;,]+/)
            .map((item) => item.trim())
            .filter(Boolean);
          items.forEach(add);
        }
      };

      add(labelText);
      add(element.placeholder);
      add(element.name);
      add(element.id);
      add(element.getAttribute?.('aria-label'));

      const labelledBy = element.getAttribute?.('aria-labelledby');
      if (typeof labelledBy === 'string' && labelledBy.trim()) {
        labelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id))
          .filter(Boolean)
          .forEach((node) => add(node.textContent ?? ''));
      }

      const dataSources = [
        element.dataset?.bobOlxFieldLabel,
        element.dataset?.bobOlxFieldName
      ];

      const container = element.closest?.('[data-bob-olx-field-label],[data-bob-olx-field-name],[data-bob-olx-options]');
      if (container?.dataset) {
        dataSources.push(container.dataset.bobOlxFieldLabel, container.dataset.bobOlxFieldName);
      }

      dataSources.forEach(add);

      const optionSources = [
        element.dataset?.bobOlxOptions,
        element.getAttribute?.('data-bob-olx-options'),
        container?.dataset?.bobOlxOptions
      ].filter(Boolean);

      optionSources.forEach(parseOptionList);

      return Array.from(aliases);
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.DomSnapshotCollector = DomSnapshotCollector;
})();


