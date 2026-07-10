const mapPostToFeedCard = (post) => {
    return {
        id: post.id,
        title: post.title,
        image: post.coverImage,
        author: {
            username: post.author.username,
            avatar: post.author.avatar
        },
        tags: post.tags.map((t) => t.tags.name)
    };
};

module.exports = {
    mapPostToFeedCard
};