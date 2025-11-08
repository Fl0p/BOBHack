import { DIFY_USER_ID } from '../config.js';

export const createDomRequestPayload = (domSnapshot) => {
  if (!domSnapshot) {
    throw new Error('DOM snapshot is required.');
  }
  console.log('dom snapshot 2', domSnapshot);
  
  const domString = JSON.stringify(domSnapshot);

  return {
    inputs: { dom: domString },
    response_mode: 'blocking',
    user: DIFY_USER_ID ?? 'chrome-extension-user'
  };
};

