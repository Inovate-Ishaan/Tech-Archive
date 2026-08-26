const { prisma } = require("../../config/prisma");
const bookmarkRepository = require('./bookmark.repository');
const ApiError = require('../../utils/ApiError');
const { HTTP_STATUS } = require('../../utils/constants');
const { mapPostToFeedCard } = require("../feed/feed.mapper");

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

const getAllPosts = async (page,limit,username) => {

    const skip = (page-1)*limit;

    const [posts,totalPosts] = await prisma.$transaction([ 
    prisma.bookmark.findMany({
        skip,
        take:limit,
        where : {username},
        orderBy:{
            createdAt : "desc"
        },
        include:{post:{select: {
            id: true,
            title: true,
            coverImage: true,
            author: {
                select: {
                    username: true,
                    avatar: true
                }
            },
            tags:{
                select:{
                    tags:{
                        select:{
                            name:true
                        }
                    }
                }
            },
        }}
        }
    }),
    prisma.bookmark.count({ where: {username} })
    ])

    const mappedPosts = posts.map((bookmark) => mapPostToFeedCard(bookmark.post));

    const totalPages = Math.ceil(totalPosts/limit);

    return {
        posts: mappedPosts,
        pagination: {
            page,
            limit,
            totalPosts,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page>1
        }
    }
};

module.exports = { toggleBookmark , getAllPosts}