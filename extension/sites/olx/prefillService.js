(() => {
  const DEFAULT_TITLE = 'iPhone 13 Max Pro';
  const DEFAULT_DELAY_MS = 1000;
  const POLL_INTERVAL_MS = 100;
  const MAX_WAIT_MS = 5000;
  const DROPDOWN_SELECTOR = '[data-testid="dropdown"]';
  const DROPDOWN_INPUT_SELECTOR = 'input.n-textinput-input, input[type="text"]';
  const ANNOTATION_MAX_WAIT_MS = 4000;
  const ANNOTATION_POLL_MS = 150;
  const OPTIONS_MAX_WAIT_MS = 1500;
  const OPTIONS_POLL_INTERVAL_MS = 100;

  const wait = (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  class OlxPrefillService {
    constructor({ elementValueSetter, title = DEFAULT_TITLE, delayMs = DEFAULT_DELAY_MS } = {}) {
      this.elementValueSetter = elementValueSetter;
      this.title = title;
      this.delayMs = delayMs;
      this.pendingOptionCollections = new WeakSet();
    }

    matchesLocation(locationRef = window.location) {
      const { hostname, pathname } = locationRef ?? {};
      if (!hostname || !pathname) return false;
      const normalizedHost = hostname.toLowerCase();
      if (!normalizedHost.endsWith('olx.pl')) return false;
      return pathname.startsWith('/adding');
    }

    async prepare() {
      if (!this.matchesLocation()) {
        return { handled: false, applied: false };
      }

      const annotationApplied = await this.ensureDropdownAnnotation();
      this.observeDropdowns();

      const field = await this.waitForTitleField();
      if (!field) {
        const reason = 'Title field not found on OLX page.';
        console.warn(reason);
        return { handled: true, applied: annotationApplied, reason };
      }

      this.elementValueSetter.setValue(field, this.title);
      await wait(this.delayMs);

      return { handled: true, applied: true };
    }

    async ensureDropdownAnnotation() {
      const deadline = Date.now() + ANNOTATION_MAX_WAIT_MS;
      let applied = false;
      do {
        const containers = this.getDropdownContainers();
        if (containers.length) {
          const changed = this.annotateDropdowns(containers);
          applied = applied || changed;
          if (containers.every((container) => this.isDropdownAnnotated(container))) {
            break;
          }
        }
        await wait(ANNOTATION_POLL_MS);
      } while (Date.now() < deadline);
      return applied;
    }

    observeDropdowns() {
      if (this.dropdownObserver || !document?.body) return;
      this.dropdownObserver = new MutationObserver(() => {
        if (this.annotationScheduled) return;
        this.annotationScheduled = true;
        requestAnimationFrame(() => {
          this.annotationScheduled = false;
          this.annotateDropdowns(this.getDropdownContainers());
        });
      });
      this.dropdownObserver.observe(document.body, { childList: true, subtree: true });
    }

    getDropdownContainers() {
      return Array.from(document.querySelectorAll(DROPDOWN_SELECTOR));
    }

    annotateDropdowns(containers = []) {
      if (!containers.length) return false;
      const existingNames = new Set(
        Array.from(document.querySelectorAll('input[name]'))
          .map((input) => input?.name)
          .filter((name) => typeof name === 'string' && name.trim())
      );

      let changed = false;
      containers.forEach((container, index) => {
        const result = this.annotateDropdown(container, existingNames, index);
        changed = changed || result;
      });
      return changed;
    }

    annotateDropdown(container, existingNames, index) {
      if (!container || this.isDropdownAnnotated(container)) return false;

      const input = this.findDropdownInput(container);
      if (!input) return false;

      const baseLabel = this.resolveDropdownLabel(container, input);
      if (!baseLabel) return false;

      const storedName = input.dataset.bobOlxFieldName;
      if (storedName) {
        if (!existingNames.has(storedName)) existingNames.add(storedName);
        if (!input.name || input.name !== storedName) input.name = storedName;
        if (container.dataset.bobOlxOptions && !input.dataset.bobOlxOptions) {
          input.dataset.bobOlxOptions = container.dataset.bobOlxOptions;
        }
        this.scheduleOptionsCollection(container);
        return false;
      }

      const name = this.createUniqueName(baseLabel, existingNames, index);
      input.name = name;
      input.dataset.bobOlxFieldLabel = baseLabel;
      input.dataset.bobOlxFieldName = name;
      container.dataset.bobOlxFieldLabel = baseLabel;
      container.dataset.bobOlxFieldName = name;
      if (container.dataset.bobOlxOptions) {
        input.dataset.bobOlxOptions = container.dataset.bobOlxOptions;
      }
      this.scheduleOptionsCollection(container);
      existingNames.add(name);
      return true;
    }

    isDropdownAnnotated(container) {
      const input = this.findDropdownInput(container);
      if (!input) return false;
      const storedName = input.dataset.bobOlxFieldName;
      const currentName = input.name?.trim();
      return Boolean(storedName && currentName && storedName === currentName);
    }

    findDropdownInput(container) {
      if (!container) return null;
      const input = container.querySelector(DROPDOWN_INPUT_SELECTOR);
      return input instanceof HTMLInputElement ? input : null;
    }

    resolveDropdownLabel(container, input) {
      const labelSources = [
        container.querySelector('label'),
        container.querySelector('[data-testid="dropdown-label"]'),
        container.parentElement?.querySelector(':scope > label'),
        input?.closest('label')
      ].filter(Boolean);

      for (const source of labelSources) {
        const text = source?.textContent?.trim();
        if (text) return text;
      }

      const ariaLabel = input?.getAttribute('aria-label');
      if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

      const describedBy = input?.getAttribute('aria-labelledby');
      if (describedBy) {
        const labelElement = document.getElementById(describedBy);
        const text = labelElement?.textContent?.trim();
        if (text) return text;
      }

      return null;
    }

    createUniqueName(label, existingNames, indexHint = 0) {
      const base = label.trim();
      if (!existingNames.has(base)) return base;

      let index = Math.max(2, Number.isFinite(indexHint) ? indexHint + 1 : 2);
      let candidate = `${base} (${index})`;
      while (existingNames.has(candidate)) {
        index += 1;
        candidate = `${base} (${index})`;
      }
      return candidate;
    }

    async waitForTitleField() {
      const deadline = Date.now() + MAX_WAIT_MS;
      do {
        const field = this.findTitleField();
        if (field) return field;
        await wait(POLL_INTERVAL_MS);
      } while (Date.now() < deadline);
      return null;
    }

    findTitleField() {
      const selectors = ['textarea#title', 'textarea[name="title"]'];
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
      }
      return null;
    }

    scheduleOptionsCollection(container) {
      if (!container) return;
      if (container.dataset.bobOlxOptions) return;
      if (this.pendingOptionCollections.has(container)) return;
      this.pendingOptionCollections.add(container);
      setTimeout(() => {
        this.collectDropdownOptions(container)
          .catch((error) => {
            console.warn('OLX options capture failed', error);
          })
          .finally(() => {
            this.pendingOptionCollections.delete(container);
          });
      }, 0);
    }

    async collectDropdownOptions(container) {
      const input = this.findDropdownInput(container);
      if (!input) return;
      if (this.getStoredOptions(container).length) return;

      const trigger = this.findDropdownTrigger(container, input);
      const wasOpen = this.isDropdownOpen(container);

      if (!wasOpen && trigger) {
        this.triggerDropdownToggle(trigger);
        await wait(OPTIONS_POLL_INTERVAL_MS);
      }

      const menu = await this.waitForDropdownMenu(container, input);
      if (menu) {
        const options = this.extractDropdownOptions(menu);
        if (options.length) {
          this.storeDropdownOptions(container, input, options);
        }
      }

      if (!wasOpen && trigger) {
        this.triggerDropdownToggle(trigger);
      }
    }

    findDropdownTrigger(container, input) {
      return (
        container.querySelector('button.n-referenceinput-button') ??
        container.querySelector('button[type="button"]') ??
        input
      );
    }

    triggerDropdownToggle(trigger) {
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

    async waitForDropdownMenu(container, input) {
      const deadline = Date.now() + OPTIONS_MAX_WAIT_MS;
      do {
        const menu = this.findDropdownMenu(container, input);
        if (menu) return menu;
        await wait(OPTIONS_POLL_INTERVAL_MS);
      } while (Date.now() < deadline);
      return null;
    }

    findDropdownMenu(container, input) {
      const button = container?.querySelector('button.n-referenceinput-button');
      const controlledId = button?.getAttribute('aria-controls');
      if (controlledId) {
        const controlled = document.getElementById(controlledId);
        if (controlled) return controlled;
      }
      const inputRect = input.getBoundingClientRect();
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

    extractDropdownOptions(menu) {
      if (!menu) return [];
      const items = menu.querySelectorAll(
        '[data-cy="dropdown-menu-item"], [data-testid="dropdown-menu-item"]'
      );
      const options = new Set();
      items.forEach((item) => {
        const interactive = item.querySelector('a, button, span, div');
        const node = interactive instanceof HTMLElement ? interactive : item;
        const text = node.textContent?.trim();
        if (text) options.add(text);
      });
      return Array.from(options);
    }

    storeDropdownOptions(container, input, options) {
      const normalized = Array.from(
        new Set(
          (options ?? [])
            .map((text) => (typeof text === 'string' ? text.trim() : ''))
            .filter(Boolean)
        )
      );
      if (!normalized.length) return;
      const serialized = JSON.stringify(normalized);
      container.dataset.bobOlxOptions = serialized;
      if (input?.dataset) input.dataset.bobOlxOptions = serialized;
    }

    getStoredOptions(container) {
      const raw = container?.dataset?.bobOlxOptions;
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    isDropdownOpen(container) {
      if (!container) return false;
      const button = container.querySelector('button.n-referenceinput-button');
      if (
        button &&
        (button.getAttribute('data-referenceinput-open') === 'true' ||
          button.getAttribute('aria-expanded') === 'true')
      ) {
        return true;
      }
      return Boolean(container.querySelector('.n-referenceinput--open-true'));
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.OlxPrefillService = OlxPrefillService;

  const registerPrefillService = (registration) => {
    if (typeof bobNamespace.registerPrefillService === 'function') {
      bobNamespace.registerPrefillService(registration);
    } else {
      bobNamespace._pendingPrefillRegistrations = bobNamespace._pendingPrefillRegistrations || [];
      bobNamespace._pendingPrefillRegistrations.push(registration);
    }
  };

  registerPrefillService({
    id: 'olx',
    key: 'olxPrefillService',
    create: ({ elementValueSetter }) =>
      new OlxPrefillService({
        elementValueSetter
      })
  });
})();


