(() => {
  const bobNamespace = (window.bobContent = window.bobContent || {});
  const MESSAGE_TYPES = bobNamespace.MESSAGE_TYPES || {};

  class MessageRouter {
    constructor({ snapshotCollector, fieldValueApplier, pagePreparers = [] }) {
      this.snapshotCollector = snapshotCollector;
      this.fieldValueApplier = fieldValueApplier;
      this.pagePreparers = pagePreparers;
      this.messageTypes = MESSAGE_TYPES;
      this.listener = this.handleMessage.bind(this);
    }

    register() {
      chrome.runtime.onMessage.addListener(this.listener);
      return () => chrome.runtime.onMessage.removeListener(this.listener);
    }

    async runPagePreparers(payload) {
      const results = [];
      for (const preparer of this.pagePreparers ?? []) {
        try {
          if (!preparer || typeof preparer.prepare !== 'function') continue;
          const result = await preparer.prepare(payload);
          if (result) results.push(result);
        } catch (error) {
          console.error('Page preparer failed', error);
          throw error;
        }
      }
      return results;
    }

    handleMessage(message, sender, sendResponse) {
      if (!message?.type) return false;

      if (message.type === this.messageTypes.COLLECT_DOM) {
        try {
          const domSnapshot = this.snapshotCollector.collect();
          sendResponse({ domSnapshot });
        } catch (error) {
          console.error('COLLECT_DOM failed', error);
          sendResponse({ ok: false, error: error.message ?? 'Failed to collect DOM.' });
        }
        return true;
      }

      if (message.type === this.messageTypes.APPLY_FIELD_VALUES) {
        const fields = message.payload?.fields ?? [];
        try {
          this.fieldValueApplier.apply(fields);
          sendResponse({ ok: true });
        } catch (error) {
          console.error('APPLY_FIELD_VALUES failed', error, fields);
          sendResponse({ ok: false, error: error.message ?? 'Failed to apply fields.' });
        }
        return true;
      }

      if (message.type === this.messageTypes.PREPARE_PAGE) {
        (async () => {
          try {
            const results = await this.runPagePreparers(message.payload ?? {});
            sendResponse({ ok: true, results });
          } catch (error) {
            sendResponse({ ok: false, error: error.message ?? 'Failed to prepare page.' });
          }
        })();
        return true;
      }

      return false;
    }
  }

  bobNamespace.MessageRouter = MessageRouter;
})();


