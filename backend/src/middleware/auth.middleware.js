const { verifyToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../utils/constants');

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token'));
  }
}

function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.user = verifyToken(token);
    }
  } catch {
    // ignore
  }
  next();
}

module.exports = { authenticate, optionalAuth };
