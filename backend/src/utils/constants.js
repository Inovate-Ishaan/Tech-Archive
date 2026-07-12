const RATE_LIMITS = {
  AUTH: { windowMs: 15 * 60 * 1000, max: 200 },
  OTP: { windowMs: 60 * 60 * 1000, max: 200 },
  STRICT: { windowMs: 15 * 60 * 1000, max: 200 },
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

module.exports = { RATE_LIMITS, OTP_CONFIG, HTTP_STATUS };
