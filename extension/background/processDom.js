import { createDomRequestPayload } from './domPayload.js';
import { postDomPayload } from './difyClient.js';
import { extractFields } from './fieldExtractor.js';
import { applyFieldsToTab } from './tabMessenger.js';

const validatePayload = ({ domSnapshot, tabId }) => {
  if (!domSnapshot) {
    throw new Error('DOM snapshot is missing.');
  }
  if (!tabId) {
    throw new Error('Tab id is missing.');
  }
};

export const processDomSnapshot = async ({ domSnapshot, tabId }) => {
  validatePayload({ domSnapshot, tabId });

  const payload = createDomRequestPayload(domSnapshot);
  const difyResponse = await postDomPayload(payload);
  const fields = extractFields(difyResponse);

  if (!fields.length) {
    throw new Error('Dify response does not contain fields.');
  }

  const applyResult = await applyFieldsToTab(tabId, fields);
  if (!applyResult?.ok) {
    throw new Error(applyResult?.error ?? 'Content script failed to apply fields.');
  }
};

