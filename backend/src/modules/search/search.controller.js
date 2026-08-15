const SearchService = require("./search.service");
const { ApiResponse } = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

const getsearchPosts = async (req, res) => {
    try {
        const {q ,page = 1,limit = 6} = req.query;

        if (!q || !q.trim()) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'Search Query is required'));
        }

        const result = await SearchService.searchPosts(
            q,
            page,
            limit
        );
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));

    } catch (error) {
        next(error)
    }
};

module.exports = { getsearchPosts }