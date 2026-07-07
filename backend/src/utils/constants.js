const RATE_LIMITS = {
  AUTH: { windowMs: 15 * 60 * 1000, max: process.env.NODE_ENV === 'development' ? 50 : 10 },
  OTP: { windowMs: 60 * 60 * 1000, max: process.env.NODE_ENV === 'development' ? 50 : 3 },
  STRICT: { windowMs: 15 * 60 * 1000, max: process.env.NODE_ENV === 'development' ? 50 : 5 },
};

const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

module.exports = { RATE_LIMITS, OTP_CONFIG, HTTP_STATUS, PAGINATION };
