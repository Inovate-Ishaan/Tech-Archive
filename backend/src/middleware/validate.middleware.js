const fs = require('fs');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../utils/constants');

function validate(validationFn) {
  return (req, res, next) => {
    const error = validationFn(req.body);
    if (error) {
      if (req.file) fs.unlink(req.file.path, () => {});
      if (req.files) req.files.forEach((f) => fs.unlink(f.path, () => {}));
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, error));
    }
    next();
  };
}

module.exports = { validate };
