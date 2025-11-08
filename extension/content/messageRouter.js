(() => {
  class MessageRouter {
    constructor({ snapshotCollector, fieldValueApplier }) {
      this.snapshotCollector = snapshotCollector;
      this.fieldValueApplier = fieldValueApplier;
      this.listener = this.handleMessage.bind(this);
    }

    register() {
      chrome.runtime.onMessage.addListener(this.listener);
      return () => chrome.runtime.onMessage.removeListener(this.listener);
    }

    handleMessage(message, sender, sendResponse) {
      if (!message?.type) return false;

      if (message.type === 'COLLECT_DOM') {
        try {
          const domSnapshot = this.snapshotCollector.collect();
          sendResponse({ domSnapshot });
        } catch (error) {
          console.error('COLLECT_DOM failed', error);
          sendResponse({ ok: false, error: error.message ?? 'Failed to collect DOM.' });
        }
        return true;
      }

      if (message.type === 'APPLY_FIELD_VALUES') {
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

      return false;
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.MessageRouter = MessageRouter;
})();


