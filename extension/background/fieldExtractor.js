const toArray = (value) => (Array.isArray(value) ? value : []);

export const extractFields = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const fallbackOrder = [
    payload.fields,
    payload.result?.fields,
    payload.data?.fields,
    payload.outputs
  ];

  for (const candidate of fallbackOrder) {
    const fields = toArray(candidate);
    if (fields.length) return fields;
  }

  return [];
};

