(() => {
  class LabelResolver {
    getLabel(element) {
      if (!element) return '';
      if (element.id) {
        const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
        if (label) return label.innerText.trim();
      }
      const parentLabel = element.closest('label');
      return parentLabel ? parentLabel.innerText.trim() : '';
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.LabelResolver = LabelResolver;
})();


