(() => {
  const toComparableString = (input) => {
    if (input === null || input === undefined) return '';
    return String(input);
  };

  class ElementValueSetter {
    setValue(element, value) {
      if (!element) return;
      if (element.isContentEditable) {
        this.setContentEditableValue(element, value);
      } else {
        const tag = element.tagName.toLowerCase();
        if (tag === 'select') {
          this.setSelectValue(element, value);
        } else if (tag === 'input') {
          this.setInputValue(element, value);
        } else if (tag === 'textarea') {
          element.value = value;
        }
      }
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    setContentEditableValue(element, value) {
      const normalized = value ?? '';
      element.textContent = Array.isArray(normalized) ? normalized.join(' ') : String(normalized);
    }

    setSelectValue(element, value) {
      if (Array.isArray(value)) {
        const desired = new Set(value.map(toComparableString));
        Array.from(element.options).forEach((option) => {
          const normalized = toComparableString(option.value);
          const byText = toComparableString(option.text);
          const matches = desired.has(normalized) || desired.has(byText);
          option.selected = matches;
        });
        if (!element.multiple) {
          const firstSelected = Array.from(element.options).find((option) => option.selected);
          if (firstSelected) element.value = firstSelected.value;
        }
        return;
      }
      const target = toComparableString(value);
      const match = Array.from(element.options).find(
        (option) => option.value === target || toComparableString(option.text) === target
      );
      if (match) element.value = match.value;
    }

    setInputValue(element, value) {
      const type = element.type;
      if (type === 'file') {
        return;
      }
      if (type === 'checkbox') {
        if (Array.isArray(value)) {
          const desired = new Set(value.map(toComparableString));
          const normalized = toComparableString(element.value);
          element.checked = desired.has(normalized);
        } else {
          element.checked = Boolean(value);
        }
        return;
      }
      if (type === 'radio') {
        element.checked = toComparableString(element.value) === toComparableString(value);
        return;
      }
      element.value = value ?? '';
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.ElementValueSetter = ElementValueSetter;
})();


