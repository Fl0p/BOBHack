import { DIFY_USER_ID } from '../config.js';

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

export const createDomRequestPayload = ({ domSnapshot, productId, manualInput, manualMode }) => {
  if (!domSnapshot) {
    throw new Error('DOM snapshot is required.');
  }

  const domString = JSON.stringify(domSnapshot);
  const inputs = { dom: domString };

  const normalizedManual = normalizeString(manualInput);
  const normalizedProductId = normalizeString(productId);
  const mode = manualMode ? 'manual' : 'product';

  if (mode === 'manual') {
    if (!normalizedManual) {
      throw new Error('Manual input is required.');
    }
    inputs.manual_input = normalizedManual;
  } else {
    if (!normalizedProductId) {
      throw new Error('Product ID is required.');
    }
    inputs.product_id = normalizedProductId;
  }

  inputs.mode = mode;

  return {
    inputs,
    response_mode: 'blocking',
    user: DIFY_USER_ID ?? 'chrome-extension-user'
  };
};

