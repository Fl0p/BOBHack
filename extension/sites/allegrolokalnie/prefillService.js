(() => {
  class AllegroLokalniePrefillService {
    constructor({ elementValueSetter, description } = {}) {
      this.elementValueSetter = elementValueSetter;
      this.description = description;
    }

    matchesLocation(locationRef = window.location) {
      const { hostname } = locationRef ?? {};
      if (!hostname) return false;
      return hostname.toLowerCase().endsWith('allegrolokalnie.pl');
    }

    async prepare(payload = {}) {
      if (!this.matchesLocation()) {
        return { handled: false, applied: false };
      }

      const field = this.findDescriptionField();
      if (!field) {
        const reason = 'Description field not found on Allegro Lokalnie page.';
        console.warn(reason);
        return { handled: true, applied: false, reason };
      }

      const value = this.resolveDescription(payload);
      if (value === undefined || value === null) {
        return { handled: true, applied: false, reason: 'No description provided.' };
      }

      if (this.elementValueSetter && typeof this.elementValueSetter.setValue === 'function') {
        this.elementValueSetter.setValue(field, value);
      } else {
        field.textContent = value ?? '';
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }

      return { handled: true, applied: true };
    }

    findDescriptionField() {
      return document.querySelector('div[contenteditable="true"] p.desc-p');
    }

    resolveDescription(payload) {
      if (payload && typeof payload === 'object') {
        if (payload.description !== undefined) return payload.description;
        if (payload.value !== undefined) return payload.value;
      }
      return this.description;
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.AllegroLokalniePrefillService = AllegroLokalniePrefillService;
})();



