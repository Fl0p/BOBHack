import { MESSAGE_TYPES } from './src/common/messageTypes.js';

const MANUAL_MODE_KEY = 'manualModeEnabled';

const form = document.getElementById('form');
const runButton = document.getElementById('run');
const statusEl = document.getElementById('status');
const productField = document.getElementById('product-field');
const manualField = document.getElementById('manual-field');
const productInput = document.getElementById('productId');
const manualInput = document.getElementById('manualInput');
const manualToggle = document.getElementById('manualToggle');
const manualMicButton = document.getElementById('manualMicButton');

const updateStatus = (text) => {
  statusEl.textContent = text;
};

const applyManualMode = (manualMode) => {
  productField.classList.toggle('hidden', manualMode);
  manualField.classList.toggle('hidden', !manualMode);
};

const loadManualMode = () =>
  new Promise((resolve) => {
    const storage = chrome?.storage?.local;
    if (!storage?.get) {
      resolve(false);
      return;
    }
    storage.get([MANUAL_MODE_KEY], (result) => {
      resolve(Boolean(result?.[MANUAL_MODE_KEY]));
    });
  });

const saveManualMode = (manualMode) =>
  new Promise((resolve) => {
    const storage = chrome?.storage?.local;
    if (!storage?.set) {
      resolve();
      return;
    }
    storage.set({ [MANUAL_MODE_KEY]: manualMode }, () => resolve());
  });

const initManualMode = async () => {
  try {
    const manualMode = await loadManualMode();
    manualToggle.checked = manualMode;
    applyManualMode(manualMode);
  } catch {
    applyManualMode(manualToggle.checked);
  }
};

applyManualMode(manualToggle.checked);
initManualMode();

const getActiveTabId = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id ?? null;
};

const simulateOptionKeyPress = async () => {
  const scripting = chrome?.scripting;
  if (!scripting?.executeScript) {
    updateStatus('Simulating Option key is not supported in this browser.');
    return;
  }

  const tabId = await getActiveTabId();
  if (!tabId) {
    updateStatus('Active tab not found.');
    return;
  }

  try {
    await scripting.executeScript({
      target: { tabId },
      func: () => {
        const target = document.activeElement ?? document.body;
        const createEvent = (type, altKey) =>
          new KeyboardEvent(type, {
            key: 'Alt',
            code: 'AltLeft',
            keyCode: 18,
            which: 18,
            altKey,
            bubbles: true,
            cancelable: true
          });
        target.dispatchEvent(createEvent('keydown', true));
        target.dispatchEvent(createEvent('keyup', false));
      }
    });
    updateStatus('Option key sent to the active tab.');
  } catch (error) {
    console.error('Failed to simulate Option key', error);
    updateStatus('Failed to simulate Option key press.');
  }
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

const runAutomation = async ({ manualMode, productId, manualData }) => {
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
      tabId,
      productId: manualMode ? null : productId,
      manualInput: manualMode ? manualData : null,
      manualMode
    }
  });

  if (!processResponse?.ok) {
    updateStatus(processResponse?.error ?? 'Dify returned an error.');
    return;
  }

  updateStatus('Completed. Check the page.');
};

manualToggle.addEventListener('change', () => {
  const manualMode = manualToggle.checked;
  applyManualMode(manualMode);
  saveManualMode(manualMode).catch(() => {});
  updateStatus('');
});

manualMicButton?.addEventListener('click', () => {
  simulateOptionKeyPress().catch((error) => {
    console.error('Unexpected error when simulating Option key', error);
    updateStatus('Failed to simulate Option key press.');
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const manualMode = manualToggle.checked;
  const productId = productInput.value.trim();
  const manualData = manualInput.value.trim();

  if (manualMode) {
    if (!manualData) {
      updateStatus('Manual input is required.');
      return;
    }
  } else if (!productId) {
    updateStatus('Product ID is required.');
    return;
  }

  runButton.disabled = true;
  updateStatus('');

  runAutomation({ manualMode, productId, manualData })
    .catch((error) => {
      updateStatus(error?.message ?? 'Unexpected error.');
    })
    .finally(() => {
      runButton.disabled = false;
    });
});
