(() => {
  const toComparableString = (input) => {
    if (input === null || input === undefined) return '';
    return String(input);
  };

  class ElementValueSetter {
    setValue(element, value) {
      if (!element) return;
      let skipEvents = false;
      if (element.isContentEditable) {
        this.setContentEditableValue(element, value);
      } else {
        const tag = element.tagName.toLowerCase();
        if (tag === 'select') {
          this.setSelectValue(element, value);
        } else if (tag === 'input') {
          skipEvents = this.setInputValue(element, value) === true;
        } else if (tag === 'textarea') {
          element.value = value;
        }
      }
      if (!skipEvents) {
        this.emitInputEvents(element);
      }
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
      if (this.trySetOlxDropdownValue(element, value)) return true;
      const type = element.type;
      if (type === 'file') {
        return true;
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
        return false;
      }
      element.value = value ?? '';
      return false;
    }

    trySetOlxDropdownValue(element, value) {
      if (!this.isOlxContext()) return false;
      const dropdown = element.closest('[data-testid="dropdown"]');
      if (!dropdown) return false;

      if (element instanceof HTMLElement && typeof element.focus === 'function') {
        try {
          element.focus({ preventScroll: true });
        } catch {
          element.focus();
        }
      }

      const picked = this.pickOlxDropdownValue(value);
      if (!picked) {
        element.value = '';
        this.emitInputEvents(element);
        return true;
      }

      const target = {
        raw: picked,
        normalized: this.normalizeOlxValue(picked)
      };

      if (this.normalizeOlxValue(element.value) === target.normalized) {
        return true;
      }

      this.scheduleOlxSelection({ element, dropdown, target });
      return true;
    }

    isOlxContext() {
      try {
        return typeof window !== 'undefined' && window.location.hostname.toLowerCase().includes('olx');
      } catch {
        return false;
      }
    }

    pickOlxDropdownValue(value) {
      if (Array.isArray(value)) {
        for (const candidate of value) {
          const normalized = toComparableString(candidate).trim();
          if (normalized) return normalized;
        }
        return null;
      }
      const normalized = toComparableString(value).trim();
      return normalized || null;
    }

    normalizeOlxValue(value) {
      let text = toComparableString(value).trim().toLowerCase();
      if (typeof text.normalize === 'function') {
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
      return text;
    }

    scheduleOlxSelection({ element, dropdown, target }) {
      const attempts = [0, 80, 160, 320, 500];
      let resolved = false;

      const attempt = () => {
        if (resolved) return;
        if (!this.isOlxDropdownOpen(dropdown)) {
          this.openOlxDropdown(dropdown, element);
        }
        const menu = this.findOlxDropdownMenu(element, dropdown);
        if (!menu) return;
        const option = this.findOlxMenuItem(menu, target);
        if (!option) return;
        this.selectOlxMenuItem(option);
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
        this.emitInputEvents(element);
      }, attempts[attempts.length - 1] + 150);
    }

    emitInputEvents(element) {
      if (!(element instanceof HTMLElement)) return;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    openOlxDropdown(dropdown, element) {
      const button =
        dropdown.querySelector('button.n-referenceinput-button') ??
        dropdown.querySelector('button[type="button"]');
      const trigger = button || element;
      if (!(trigger instanceof HTMLElement)) return;
      if (typeof trigger.focus === 'function') {
        try {
          trigger.focus({ preventScroll: true });
        } catch {
          trigger.focus();
        }
      }
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
    }

    isOlxDropdownOpen(dropdown) {
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
    }

    findOlxDropdownMenu(element, dropdown) {
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
    }

    findOlxMenuItem(menu, target) {
      if (!menu || !target) return null;
      const items = menu.querySelectorAll(
        '[data-cy="dropdown-menu-item"], [data-testid="dropdown-menu-item"]'
      );
      let candidate = null;
      items.forEach((item) => {
        if (candidate) return;
        const interactive = item.querySelector('a, button, span, div');
        const clickable = interactive instanceof HTMLElement ? interactive : item;
        const text = this.normalizeOlxValue(clickable.textContent || '');
        if (text === target.normalized) {
          candidate = clickable;
          return;
        }
        const dataValue = this.normalizeOlxValue(
          clickable.getAttribute('data-value') ?? item.getAttribute('data-value') ?? ''
        );
        if (dataValue && dataValue === target.normalized) {
          candidate = clickable;
        }
      });
      return candidate;
    }

    selectOlxMenuItem(option) {
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
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.ElementValueSetter = ElementValueSetter;
})();


