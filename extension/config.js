const DEFAULT_SETTINGS = Object.freeze({
  difyEndpoint: '',
  difyApiKey: ''
});

const storageGet = (defaults) =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.get(defaults, (items) => {
      const error = chrome.runtime?.lastError;
      if (error) {
        reject(new Error(error.message ?? String(error)));
        return;
      }
      resolve(items);
    });
  });

const storageSet = (items) =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.set(items, () => {
      const error = chrome.runtime?.lastError;
      if (error) {
        reject(new Error(error.message ?? String(error)));
        return;
      }
      resolve();
    });
  });

export const DIFY_USER_ID = 'chrome-extension-user';

export const getDifySettings = async () => {
  const { difyEndpoint, difyApiKey } = await storageGet(DEFAULT_SETTINGS);
  return { difyEndpoint, difyApiKey };
};

export const saveDifySettings = async ({ difyEndpoint, difyApiKey }) => {
  await storageSet({ difyEndpoint, difyApiKey });
};
