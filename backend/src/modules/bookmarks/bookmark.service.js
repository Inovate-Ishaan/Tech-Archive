const bookmarkRepository = require('./bookmark.repository');
const ApiError = require('../../utils/ApiError');
const { HTTP_STATUS } = require('../../utils/constants');

async function toggleBookmark(username, postId) {

    const bookmark = await bookmarkRepository.findBookmark(username, postId);

    if (bookmark) {
        await bookmarkRepository.deleteBookmark(username, postId);
        return {
            bookmarked: false
        }
    }

    await bookmarkRepository.createBookmark(username, postId);
    return {
        bookmarked: true
    }
}

module.exports = { toggleBookmark }