const parseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const extractFields = (payload) => {
  payload = payload.data.outputs.json_data;

  console.log('matched fields', JSON.parse(payload));
  if (!payload) return [];

  const jsonString = typeof payload === 'string' ? payload : payload.json_data;
  if (typeof jsonString !== 'string') return [];

  const parsed = parseJson(jsonString);
  if (!parsed) return [];

  const fields = parsed?.result?.fields ?? parsed?.fields;
  return Array.isArray(fields) ? fields : [];
};