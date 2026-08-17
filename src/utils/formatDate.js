export const formatIsoDate = (value) => {
  if (!value) return "";

  const date = new Date(Number(value) || value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

export const formatIsoDateTime = (value) => {
  if (!value) return "";

  const date = new Date(Number(value) || value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};
