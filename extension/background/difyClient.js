import { DIFY_ENDPOINT, DIFY_API_KEY } from '../config.js';

const REQUEST_TIMEOUT_MS = 20000;

const buildHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (DIFY_API_KEY) headers.Authorization = `Bearer ${DIFY_API_KEY}`;
  return headers;
};

export const postDomPayload = async (payload) => {
  if (!DIFY_ENDPOINT || DIFY_ENDPOINT.includes('your-dify-endpoint')) {
    throw new Error('Configure DIFY_ENDPOINT and DIFY_API_KEY in config.js');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(DIFY_ENDPOINT, {
      method: 'POST',
      headers: buildHeaders(),
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

