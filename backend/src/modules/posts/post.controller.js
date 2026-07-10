const postService = require('./post.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

async function listPosts(req, res, next) {
  try {
    const result = await postService.listPosts(req.query);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await postService.getPost(req.params.id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, post));
  } catch (err) {
    next(err);
  }
}

async function createPost(req, res, next) {
  try {
    const post = await postService.createPost(req.user.id, req.body, req.file);
    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(HTTP_STATUS.CREATED, { id: post.id, images: post.images, message: 'Post created successfully' })
    );
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const post = await postService.updatePost(req.params.id, req.user.id, req.body, req.file);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, post));
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const result = await postService.deletePost(req.params.id, req.user.id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  } catch (err) {
    next(err);
  }
}

async function fetchReadme(req, res, next) {
  try {
    const { githubUrl } = req.body;
    if (!githubUrl) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'GitHub URL required'));
    }
    const result = await postService.fetchReadme(githubUrl);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  } catch (err) {
    next(err);
  }
}

module.exports = { listPosts, getPost, createPost, updatePost, deletePost, fetchReadme };
