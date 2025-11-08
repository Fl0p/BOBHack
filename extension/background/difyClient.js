import { getDifySettings } from '../config.js';

const REQUEST_TIMEOUT_MS = 20000;

const buildHeaders = (apiKey) => {
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
};

export const postDomPayload = async (payload) => {
  const { difyEndpoint, difyApiKey } = await getDifySettings();

  if (!difyEndpoint || !difyApiKey) {
    throw new Error('Set Dify endpoint and API key on the extension options page.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(difyEndpoint, {
      method: 'POST',
      headers: buildHeaders(difyApiKey),
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Dify ${response.status}: ${text}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};

