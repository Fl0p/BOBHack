(() => {
  class FieldValueApplier {
    constructor({ elementValueSetter }) {
      this.elementValueSetter = elementValueSetter;
    }

    apply(fields) {
      (fields ?? []).forEach((field) => {
        if (!field || field.value === undefined) return;
        const target = this.resolveTarget(field);
        if (!target) return;
        this.elementValueSetter.setValue(target, field.value);
      });
    }

    resolveTarget(field) {
      return this.resolveById(field.id) ?? this.resolveByName(field.name) ?? this.resolveByPath(field.path);
    }

    resolveById(id) {
      if (!id) return null;
      return document.getElementById(id);
    }

    resolveByName(name) {
      if (!name) return null;
      try {
        return document.querySelector(`[name="${CSS.escape(name)}"]`);
      } catch (error) {
        return null;
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


