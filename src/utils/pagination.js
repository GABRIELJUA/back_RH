const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const getPagination = (query = {}) => {
  const hasPagination = query.page !== undefined || query.limit !== undefined;

  if (!hasPagination) {
    return null;
  }

  const page = parsePositiveInt(query.page, 1);
  const limit = parsePositiveInt(query.limit, 10);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

module.exports = {
  getPagination
};
