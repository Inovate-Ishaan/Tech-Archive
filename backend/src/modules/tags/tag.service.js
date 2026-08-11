const tagRepository = require("./tag.repository");

const sendAllTags = async () => {
    return tagRepository.getAllTagsfromDB();
};

const getAllTagSpecificPosts = async (page, limit, tags = []) => {
    return await tagRepository.getTagSpecificPostsFromDB(
        page,
        limit,
        tags
    );
};

module.exports = {
    sendAllTags,
    getAllTagSpecificPosts
};
