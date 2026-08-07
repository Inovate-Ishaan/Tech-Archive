const { prisma } = require("../../config/prisma");

async function findBookmark(username,postId) {
    const bookmark = await prisma.bookmark.findUnique({
        where: {
            username_postId: {
                username,
                postId
            }
        }
    })
}

async function createBookmark(username,postId) {
    return prisma.bookmark.create({
        data: {
            username,
            postId
        }
    })
}

async function deleteBookmark(username,postId) {
    return prisma.bookmark.delete({
        where: {
            username,
            postId
        }
    })
}

module.exports = { findBookmark , createBookmark , deleteBookmark }