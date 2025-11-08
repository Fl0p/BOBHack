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
      if (!message?.type) return;
      if (message.type === 'COLLECT_DOM') {
        const domSnapshot = this.snapshotCollector.collect();
        sendResponse({ domSnapshot });
        return;
      }
      if (message.type === 'APPLY_FIELD_VALUES') {
        const fields = message.payload?.fields ?? [];
        this.fieldValueApplier.apply(fields);
        sendResponse({ ok: true });
      }
    }
  }

  const bobNamespace = (window.bobContent = window.bobContent || {});
  bobNamespace.MessageRouter = MessageRouter;
})();


