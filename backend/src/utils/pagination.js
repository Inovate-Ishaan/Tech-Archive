const { PAGINATION } = require('./constants');

function paginationHelper(query) {
  const page = Math.max(PAGINATION.DEFAULT_PAGE, parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { paginationHelper };
