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
    const requestLog = {
      ...payload,
      inputs: {
        ...payload.inputs,
        dom: domSnapshot
      }
    };
    console.log('Dify request payload', requestLog);

    const fields = extract(difyResponse);
    console.log('Dify extracted fields', fields);

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

