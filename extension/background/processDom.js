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

export const createProcessDomSnapshot = ({
  createDomRequestPayload: createPayload,
  postDomPayload: postPayload,
  extractFields: extract,
  applyFieldsToTab: applyToTab
}) => {
  if (typeof createPayload !== 'function') throw new Error('createDomRequestPayload must be provided.');
  if (typeof postPayload !== 'function') throw new Error('postDomPayload must be provided.');
  if (typeof extract !== 'function') throw new Error('extractFields must be provided.');
  if (typeof applyToTab !== 'function') throw new Error('applyFieldsToTab must be provided.');

  return async (params) => {
    const { domSnapshot, tabId } = params ?? {};
    validatePayload({ domSnapshot, tabId });

    const payload = createPayload(params ?? {});
    const difyResponse = await postPayload(payload);
    const fields = extract(difyResponse);

    if (!fields.length) {
      throw new Error('Dify response does not contain fields.');
    }

    const applyResult = await applyToTab(tabId, fields);
    if (!applyResult?.ok) {
      throw new Error(applyResult?.error ?? 'Content script failed to apply fields.');
    }
  };
};

export const processDomSnapshot = createProcessDomSnapshot({
  createDomRequestPayload,
  postDomPayload,
  extractFields,
  applyFieldsToTab
});

