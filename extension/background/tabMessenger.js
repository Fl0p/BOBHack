import { MESSAGE_TYPES } from '../src/common/messageTypes.js';

export const applyFieldsToTab = (tabId, fields) =>
  new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: MESSAGE_TYPES.APPLY_FIELD_VALUES, payload: { fields } },
      (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(response);
      }
    );
  });

