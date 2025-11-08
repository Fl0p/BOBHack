import { processDomSnapshot } from './processDom.js';
import { MESSAGE_TYPES } from '../src/common/messageTypes.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== MESSAGE_TYPES.PROCESS_DOM) return false;

  (async () => {
    try {
      await processDomSnapshot(message.payload ?? {});
      sendResponse({ ok: true });
    } catch (error) {
      console.error('PROCESS_DOM failed', error);
      sendResponse({ ok: false, error: error.message ?? 'Processing failed.' });
    }
  })();

  return true;
});

