import { processDomSnapshot } from './processDom.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'PROCESS_DOM') return;

  processDomSnapshot(message.payload ?? {})
    .then(() => sendResponse({ ok: true }))
    .catch((error) => sendResponse({ ok: false, error: error.message ?? 'Processing failed.' }));

  return true;
});

