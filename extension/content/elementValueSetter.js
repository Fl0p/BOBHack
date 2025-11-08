(() => {
  class ElementValueSetter {
    setValue(element, value) {
      if (!element) return;
      const tag = element.tagName.toLowerCase();
      if (tag === 'select') {
        this.setSelectValue(element, value);
      } else if (tag === 'input') {
        this.setInputValue(element, value);
      } else if (tag === 'textarea') {
        element.value = value;
      }
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    setSelectValue(element, value) {
      const option = Array.from(element.options).find((opt) => opt.value === value || opt.text === value);
      if (option) element.value = option.value;
    }

    setInputValue(element, value) {
      const type = element.type;
      if (type === 'checkbox') {
        element.checked = Boolean(value);
        return;
      }
      if (type === 'radio') {
        element.checked = element.value === value;
        return;
      }
      element.value = value;
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.ElementValueSetter = ElementValueSetter;
})();


