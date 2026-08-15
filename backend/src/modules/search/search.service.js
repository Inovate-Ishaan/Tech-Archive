const { prisma } = require("../../config/prisma");
const SearchRepository = require("./search.repository")
const { mapPostToFeedCard } = require("./feed.mapper");

const searchPosts = async (query, page = 1, limit = 6) => {
    query = query.trim();

    if (!query) {
        throw new Error("Search query cannot be empty");
    }

    page = Number(page);
    limit = Number(limit);

    if (page < 1) {
        page = 1;
    }

    if (limit < 1 || limit > 50) {
        limit = 6;
    }

    const skip = (page - 1) * limit;

    const { posts, totalPosts } =
        await SearchRepository.searchFromPosts(
            query,
            skip,
            limit
        );

    const totalPages = Math.ceil(totalPosts / limit);

    return {
        posts,
        pagination: {
            page,
            limit,
            total: totalPosts,
            totalPages,
            hasNext: page < totalPages
        }
    };
};

module.exports = { searchPosts }