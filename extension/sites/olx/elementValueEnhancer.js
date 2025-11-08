(() => {
  const namespace = (window.bobContent = window.bobContent || {});
  const ENHANCER_FLAG = '__olxElementValueEnhancerApplied';

  const toComparableString = (input) => {
    if (input === null || input === undefined) return '';
    return String(input);
  };

  const isOlxHost = () => {
    try {
      const hostname = window.location.hostname?.toLowerCase() ?? '';
      return hostname.includes('olx.');
    } catch {
      return false;
    }
  };

  const focusElement = (element) => {
    if (!(element instanceof HTMLElement)) return;
    if (typeof element.focus !== 'function') return;
    try {
      element.focus({ preventScroll: true });
    } catch {
      element.focus();
    }
  };

  const pickDropdownValue = (value) => {
    if (Array.isArray(value)) {
      for (const candidate of value) {
        const normalized = toComparableString(candidate).trim();
        if (normalized) return normalized;
      }
      return null;
    }
    const normalized = toComparableString(value).trim();
    return normalized || null;
  };

  const normalizeOptionValue = (value) => {
    let text = toComparableString(value).trim().toLowerCase();
    if (typeof text.normalize === 'function') {
      text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return text;
  };

  const emitInputEvents = (element) => {
    if (!(element instanceof HTMLElement)) return;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const applyOlxDropdownValue = (element, value) => {
    if (!isOlxHost()) return false;
    if (!element) return false;

    const dropdown = element.closest('[data-testid="dropdown"]');
    if (!dropdown) return false;

    focusElement(element);

    const picked = pickDropdownValue(value);
    if (!picked) {
      element.value = '';
      emitInputEvents(element);
      return true;
    }

    const target = {
      raw: picked,
      normalized: normalizeOptionValue(picked)
    };

    if (normalizeOptionValue(element.value) === target.normalized) {
      return true;
    }

    scheduleOlxSelection({ element, dropdown, target });
    return true;
  };

  const scheduleOlxSelection = ({ element, dropdown, target }) => {
    const attempts = [0, 80, 160, 320, 500];
    let resolved = false;

    const attempt = () => {
      if (resolved) return;
      if (!isDropdownOpen(dropdown)) {
        openDropdown(dropdown, element);
      }
      const menu = findDropdownMenu(element, dropdown);
      if (!menu) return;
      const option = findMenuItem(menu, target);
      if (!option) return;
      selectMenuItem(option);
      resolved = true;
    };

    attempts.forEach((delay) => {
      setTimeout(() => {
        attempt();
      }, delay);
    });

    setTimeout(() => {
      if (resolved) return;
      element.value = target.raw;
      emitInputEvents(element);
    }, attempts[attempts.length - 1] + 150);
  };

  const openDropdown = (dropdown, element) => {
    const button =
      dropdown.querySelector('button.n-referenceinput-button') ??
      dropdown.querySelector('button[type="button"]');
    const trigger = button || element;
    if (!(trigger instanceof HTMLElement)) return;
    focusElement(trigger);
    const events = ['pointerdown', 'mousedown', 'mouseup', 'pointerup', 'click'];
    events.forEach((type) => {
      const eventInit = {
        bubbles: true,
        cancelable: true,
        view: window,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true
      };
      const event =
        type.startsWith('pointer')
          ? new PointerEvent(type, eventInit)
          : type.startsWith('mouse')
          ? new MouseEvent(type, eventInit)
          : new Event(type, eventInit);
      trigger.dispatchEvent(event);
    });
  };

  const isDropdownOpen = (dropdown) => {
    if (!dropdown) return false;
    const button = dropdown.querySelector('button.n-referenceinput-button');
    if (
      button &&
      (button.getAttribute('data-referenceinput-open') === 'true' ||
        button.getAttribute('aria-expanded') === 'true')
    ) {
      return true;
    }
    return Boolean(dropdown.querySelector('.n-referenceinput--open-true'));
  };

  const findDropdownMenu = (element, dropdown) => {
    const button = dropdown?.querySelector('button.n-referenceinput-button');
    const controlledId = button?.getAttribute('aria-controls');
    if (controlledId) {
      const controlled = document.getElementById(controlledId);
      if (controlled) return controlled;
    }
    const inputRect = element.getBoundingClientRect();
    const candidates = Array.from(
      document.querySelectorAll('div[role="menubar"], div[role="listbox"], div[data-popper-placement]')
    ).filter((menu) =>
      menu.querySelector('[data-cy="dropdown-menu-item"], [data-testid="dropdown-menu-item"]')
    );

    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    candidates.forEach((menu) => {
      const rect = menu.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      const distance =
        Math.abs(rect.left - inputRect.left) + Math.abs(rect.top - inputRect.bottom);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = menu;
      }
    });

    if (!best) return null;
    if (bestDistance > 600) return null;
    return best;
  };

  const findMenuItem = (menu, target) => {
    if (!menu || !target) return null;
    const items = menu.querySelectorAll(
      '[data-cy="dropdown-menu-item"], [data-testid="dropdown-menu-item"]'
    );
    let candidate = null;
    items.forEach((item) => {
      if (candidate) return;
      const interactive = item.querySelector('a, button, span, div');
      const clickable = interactive instanceof HTMLElement ? interactive : item;
      const text = normalizeOptionValue(clickable.textContent || '');
      if (text === target.normalized) {
        candidate = clickable;
        return;
      }
      const dataValue = normalizeOptionValue(
        clickable.getAttribute('data-value') ?? item.getAttribute('data-value') ?? ''
      );
      if (dataValue && dataValue === target.normalized) {
        candidate = clickable;
      }
    });
    return candidate;
  };

  const selectMenuItem = (option) => {
    if (!(option instanceof HTMLElement)) return;
    const events = ['pointerdown', 'mousedown', 'mouseup', 'pointerup', 'click'];
    events.forEach((type) => {
      const eventInit = {
        bubbles: true,
        cancelable: true,
        view: window,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true
      };
      const event =
        type.startsWith('pointer')
          ? new PointerEvent(type, eventInit)
          : type.startsWith('mouse')
          ? new MouseEvent(type, eventInit)
          : new Event(type, eventInit);
      option.dispatchEvent(event);
    });
  };

  const enhanceElementValueSetter = () => {
    const Setter = namespace.ElementValueSetter;
    if (!Setter) return;
    const proto = Setter.prototype;
    if (proto[ENHANCER_FLAG]) return;

    const originalSetInputValue = proto.setInputValue;
    proto.setInputValue = function olxEnhancedSetInputValue(element, value) {
      if (applyOlxDropdownValue(element, value)) return true;
      return originalSetInputValue.call(this, element, value);
    };

    proto[ENHANCER_FLAG] = true;
  };

  const initialize = () => {
    if (!isOlxHost()) return;
    if (namespace.ElementValueSetter) {
      enhanceElementValueSetter();
      return;
    }
    const observer = new MutationObserver(() => {
      if (namespace.ElementValueSetter) {
        try {
          enhanceElementValueSetter();
        } finally {
          observer.disconnect();
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();



