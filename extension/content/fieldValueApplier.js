(() => {
  class FieldValueApplier {
    constructor({ elementValueSetter }) {
      this.elementValueSetter = elementValueSetter;
    }

    apply(fields) {
      (fields ?? []).forEach((field) => {
        if (!field || field.value === undefined) return;
        const targets = this.resolveTargets(field);
        if (!targets.length) return;
        targets.forEach((target) => this.elementValueSetter.setValue(target, field.value));
      });
    }

    resolveTargets(field) {
      const results = [];
      const seen = new Set();
      const push = (element) => {
        if (!element) return;
        if (seen.has(element)) return;
        seen.add(element);
        results.push(element);
      };

      push(this.resolveById(field.id));
      this.resolveByName(field.name).forEach(push);
      push(this.resolveByPath(field.path));

      return results;
    }

    resolveById(id) {
      if (!id) return null;
      return document.getElementById(id);
    }

    resolveByName(name) {
      if (!name) return [];
      try {
        return Array.from(document.querySelectorAll(`[name="${CSS.escape(name)}"]`));
      } catch (error) {
        return [];
      }
    }

    resolveByPath(path) {
      if (!path) return null;
      try {
        return document.querySelector(path);
      } catch (error) {
        return null;
      }
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.FieldValueApplier = FieldValueApplier;
})();


