const authService = require('./auth.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

async function requestOtp(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.requestOtp(email);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyOtp(email, code);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, result));
  } catch (err) {
    next(err);
  }
}

async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.signin(email, password);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  } catch (err) {
    next(err);
  }
}

async function setPassword(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.setPassword(email, password);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  } catch (err) {
    next(err);
  }
}

module.exports = { requestOtp, verifyOtp, register, signin, setPassword };
