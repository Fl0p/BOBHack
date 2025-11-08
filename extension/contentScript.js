const textFromLabel = (element) => {
  if (element.id) {
    const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
    if (label) return label.innerText.trim();
  }
  const parentLabel = element.closest('label');
  return parentLabel ? parentLabel.innerText.trim() : '';
};

const cssPath = (element) => {
  const path = [];
  let el = element;
  while (el && el.nodeType === Node.ELEMENT_NODE && path.length < 5) {
    let selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += `#${el.id}`;
      path.unshift(selector);
      break;
    }
    if (el.classList.length) {
      selector += `.${Array.from(el.classList).slice(0, 2).join('.')}`;
    }
    const siblingIndex =
      Array.from(el.parentElement?.children ?? []).filter((sib) => sib.nodeName === el.nodeName).indexOf(el) + 1;
    if (siblingIndex > 0) selector += `:nth-of-type(${siblingIndex})`;
    path.unshift(selector);
    el = el.parentElement;
  }
  return path.join(' > ');
};

const collectDomSnapshot = () => {
  const inputs = Array.from(document.querySelectorAll('input, textarea, select')).filter((el) => {
    if (el.disabled) return false;
    if (el.type === 'hidden') return false;
    return true;
  });

  const fields = inputs.map((el) => ({
    tag: el.tagName.toLowerCase(),
    type: el.type ?? null,
    name: el.name ?? null,
    id: el.id ?? null,
    label: textFromLabel(el),
    placeholder: el.placeholder ?? null,
    path: cssPath(el)
  }));

  return {
    url: window.location.href,
    title: document.title,
    fields
  };
};

const setElementValue = (element, value) => {
  const tag = element.tagName.toLowerCase();
  if (tag === 'select') {
    const option = Array.from(element.options).find((opt) => opt.value === value || opt.text === value);
    if (option) element.value = option.value;
  } else if (tag === 'input' && element.type === 'checkbox') {
    element.checked = Boolean(value);
  } else if (tag === 'input' && element.type === 'radio') {
    element.checked = element.value === value;
  } else if (tag === 'input' || tag === 'textarea') {
    element.value = value;
  }
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

const applyFieldValues = (items) => {
  items.forEach((item) => {
    const { id, name, path, value } = item ?? {};
    if (value === undefined) return;

    let target = null;
    if (id) target = document.getElementById(id);
    if (!target && name) {
      try {
        target = document.querySelector(`[name="${CSS.escape(name)}"]`);
      } catch (error) {
        target = null;
      }
    }
    if (!target && path) {
      try {
        target = document.querySelector(path);
      } catch (error) {
        target = null;
      }
    }
    if (!target) return;
    setElementValue(target, value);
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'COLLECT_DOM') {
    sendResponse({ domSnapshot: collectDomSnapshot() });
    return;
  }

  if (message?.type === 'APPLY_FIELD_VALUES') {
    applyFieldValues(message.payload?.fields ?? []);
    sendResponse({ ok: true });
  }
});

