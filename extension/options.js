import { getDifySettings, saveDifySettings } from './config.js';

const form = document.getElementById('settings-form');
const endpointInput = document.getElementById('dify-endpoint');
const apiKeyInput = document.getElementById('dify-api-key');
const statusEl = document.getElementById('status');

const setStatus = (message, variant) => {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', variant === 'error');
  statusEl.classList.toggle('success', variant === 'success');
};

const loadSettings = async () => {
  try {
    const { difyEndpoint, difyApiKey } = await getDifySettings();
    endpointInput.value = difyEndpoint ?? '';
    apiKeyInput.value = difyApiKey ?? '';
  } catch (error) {
    console.error('Failed to load Dify settings', error);
    setStatus('Failed to load settings. Check the extension console for details.', 'error');
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const difyEndpoint = endpointInput.value.trim();
  const difyApiKey = apiKeyInput.value.trim();

  if (!difyEndpoint || !difyApiKey) {
    setStatus('Both fields are required.', 'error');
    return;
  }

  endpointInput.disabled = true;
  apiKeyInput.disabled = true;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setStatus('Saving...');

  try {
    await saveDifySettings({ difyEndpoint, difyApiKey });
    setStatus('Settings saved.', 'success');
  } catch (error) {
    console.error('Failed to save Dify settings', error);
    setStatus('Failed to save settings. Check the extension console for details.', 'error');
  } finally {
    endpointInput.disabled = false;
    apiKeyInput.disabled = false;
    submitButton.disabled = false;
  }
};

form.addEventListener('submit', handleSubmit);

loadSettings();

