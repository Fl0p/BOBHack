export const applyFieldsToTab = (tabId, fields) =>
  new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { type: 'APPLY_FIELD_VALUES', payload: { fields } }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(response);
    });
  });

