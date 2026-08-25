const { prisma } = require("../../config/prisma");


const getAllTagsfromDB = async () => {
    return prisma.tags.findMany({
        select: {
            id: true,
            name: true,
            slug: true
        },
        orderBy: {
            name: "asc"
        }
    });
};

const getTagSpecificPostsFromDB = async (page, limit, tags = []) => {
    const skip = (page - 1) * limit;

    const where = {};

    if (tags.length > 0) {
        where.tags = {
                some: {
                    tags: {
                        slug: {
                            in: tags
                        }
                    }
                }
            }
        };
    

    const [posts, totalPosts] = await prisma.$transaction([
        prisma.post.findMany({
            skip,
            take: limit,
            where,

            select: {
                id: true,
                title: true,
                content: true,
                coverImage: true,
                githubUrl: true,
                images: true,
                createdAt: true,
                updatedAt: true,

                author: {
                    select: {
                        id: true,
                        username: true,
                        displayname: true,
                        avatar: true
                    }
                },

                tags: {
                    select: {
                        tags: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                description: true
                            }
                        }
                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            }
        }),

        prisma.post.count({
            where
        })
    ]);

    return {
        posts,
        totalPosts,
        page,
        limit,
        hasNext: skip + posts.length < totalPosts
    };
};

module.exports = {
    getAllTagsfromDB,
    getTagSpecificPostsFromDB
};
