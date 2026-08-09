const { prisma } = require("../../config/prisma");

const searchFromPosts = async (query, skip, limit) => {
    const searchQuery = query.trim();

    const posts = await prisma.$queryRaw`
        SELECT
            p.id,
            p.title,
            p.content,
            p."coverImage",
            p."createdAt",

            json_build_object(
                'username', u.username,
                'displayname', u.displayname,
                'avatar', u.avatar
            ) AS author,

            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', t.id,
                        'name', t.name,
                        'slug', t.slug
                    )
                ) FILTER (WHERE t.id IS NOT NULL),
                '[]'::json
            ) AS tags,

            ts_rank(
                setweight(
                    to_tsvector(
                        'english',
                        COALESCE(p.title, '')
                    ),
                    'A'
                )
                ||
                setweight(
                    to_tsvector(
                        'english',
                        COALESCE(p.content, '')
                    ),
                    'C'
                )
                ||
                setweight(
                    to_tsvector(
                        'english',
                        COALESCE(u.username, '')
                    ),
                    'B'
                )
                ||
                setweight(
                    to_tsvector(
                        'english',
                        COALESCE(u.displayname, '')
                    ),
                    'B'
                ),
                plainto_tsquery(
                    'english',
                    ${searchQuery}
                )
            ) AS rank

        FROM "Post" p

        JOIN "User" u
            ON u.id = p."authorId"

        JOIN "PostTag" pt
            ON pt."postId" = p.id

        JOIN "Tags" t
            ON t.id = pt."tagId"

        WHERE
            (
                setweight(
                    to_tsvector(
                        'english',
                        COALESCE(p.title, '')
                    ),
                    'A'
                )
                ||
                setweight(
                    to_tsvector(
                        'english',
                        COALESCE(p.content, '')
                    ),
                    'C'
                )
                ||
                setweight(
                    to_tsvector(
                        'english',
                        COALESCE(u.username, '')
                    ),
                    'B'
                )
                ||
                setweight(
                    to_tsvector(
                        'english',
                        COALESCE(u.displayname, '')
                    ),
                    'B'
                )
            )
            @@ plainto_tsquery(
                'english',
                ${searchQuery}
            )

        GROUP BY
            p.id,
            u.id

        ORDER BY
            rank DESC,
            p."createdAt" DESC

        OFFSET ${skip}
        LIMIT ${limit}
    `;

    const totalResult = await prisma.$queryRaw`
        SELECT COUNT(*)::int AS count

        FROM (
            SELECT p.id

            FROM "Post" p

            JOIN "User" u
                ON u.id = p."authorId"

            JOIN "PostTag" pt
                ON pt."postId" = p.id

            JOIN "Tags" t
                ON t.id = pt."tagId"

            WHERE
                (
                    to_tsvector(
                        'english',
                        COALESCE(p.title, '')
                        || ' ' ||
                        COALESCE(p.content, '')
                        || ' ' ||
                        COALESCE(u.username, '')
                        || ' ' ||
                        COALESCE(u.displayname, '')
                    )
                )
                @@ plainto_tsquery(
                    'english',
                    ${searchQuery}
                )

            GROUP BY p.id

        ) AS results
    `;

    return {
        posts,
        totalPosts: totalResult[0].count
    };
};
module.exports = { searchFromPosts }