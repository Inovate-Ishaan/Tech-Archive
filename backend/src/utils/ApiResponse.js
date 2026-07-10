const sendSuccess = (res, statusCode, message, data = null,extra={}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...extra
    });
};

const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = {
    sendSuccess,
    sendError,
    ApiResponse
};
