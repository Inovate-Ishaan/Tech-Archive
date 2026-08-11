const tagService = require("./tag.service");
const { ApiResponse } = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

const getAllTags = async (req, res, next) => {
    try {
        const tags = await tagService.sendAllTags();
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, tags));
    } catch (error) {
        next(error);
    }
};

const getTagSpecificPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 6, tags } = req.query;

        const tagList = tags
            ? tags.split(",").map(tag => tag.trim()).filter(Boolean)
            : [];

        const posts = await tagService.getAllTagSpecificPosts(
            Number(page),
            Number(limit),
            tagList
        );

        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, posts));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTags,
    getTagSpecificPosts
};
