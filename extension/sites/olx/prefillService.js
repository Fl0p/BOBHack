(() => {
  const DEFAULT_TITLE = 'iPhone 13 Max Pro';
  const DEFAULT_DELAY_MS = 1000;
  const POLL_INTERVAL_MS = 100;
  const MAX_WAIT_MS = 5000;

  const wait = (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  class OlxPrefillService {
    constructor({ elementValueSetter, title = DEFAULT_TITLE, delayMs = DEFAULT_DELAY_MS } = {}) {
      this.elementValueSetter = elementValueSetter;
      this.title = title;
      this.delayMs = delayMs;
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

      const field = await this.waitForTitleField();
      if (!field) {
        const reason = 'Title field not found on OLX page.';
        console.warn(reason);
        return { handled: true, applied: false, reason };
      }

      this.elementValueSetter.setValue(field, this.title);
      await wait(this.delayMs);

      return { handled: true, applied: true };
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
      const selectors = [
        'textarea#title',
        'textarea[name="title"]',
      ];
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
      }
      return null;
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


