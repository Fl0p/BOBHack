import { MESSAGE_TYPES } from './src/common/messageTypes.js';

const button = document.getElementById('run');
const statusEl = document.getElementById('status');

const updateStatus = (text) => {
  statusEl.textContent = text;
};

const getActiveTabId = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id ?? null;
};

const sendMessageToTab = (tabId, message) =>
  new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(response);
    });
  });

const sendMessageToBackground = (message) =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(response);
    });
  });

const runAutomation = async () => {
  updateStatus('Collecting DOM...');

  const tabId = await getActiveTabId();
  if (!tabId) {
    updateStatus('Active tab not found.');
    return;
  }

  updateStatus('Preparing page...');
  const prepareResponse = await sendMessageToTab(tabId, { type: MESSAGE_TYPES.PREPARE_PAGE });
  if (prepareResponse?.ok === false) {
    updateStatus(prepareResponse.error ?? 'Failed to prepare page.');
    return;
  }

  const domResponse = await sendMessageToTab(tabId, { type: MESSAGE_TYPES.COLLECT_DOM });
  if (!domResponse?.domSnapshot) {
    updateStatus('Unable to capture DOM.');
    return;
  }

  updateStatus('Sending data to Dify...');
  const processResponse = await sendMessageToBackground({
    type: MESSAGE_TYPES.PROCESS_DOM,
    payload: {
      domSnapshot: domResponse.domSnapshot,
      tabId
    }
  });

  if (!processResponse?.ok) {
    updateStatus(processResponse?.error ?? 'Dify returned an error.');
    return;
  }

  updateStatus('Completed. Check the page.');
};

button.addEventListener('click', () => {
  runAutomation().catch((error) => {
    updateStatus(error?.message ?? 'Unexpected error.');
  });
});

