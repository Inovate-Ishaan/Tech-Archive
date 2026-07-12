const { prisma } = require("../../config/prisma");
const { mapPostToFeedCard } = require("./feed.mapper");
const NotFoundError = require("../../errors/NotFoundError");

console.log(prisma);
console.log(prisma.post);

const getAllPosts = async (page,limit) => {

    const skip = (page-1)*limit;

    const [posts,totalPosts] = await prisma.$transaction([ 
    prisma.post.findMany({
        skip,
        take:limit,
        select: {
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
        },
        orderBy:{
            createdAt : "desc"
        }
    }),
    prisma.post.count()
    ])

    const mappedPosts = posts.map(mapPostToFeedCard);

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

module.exports = {
    getAllPosts
};