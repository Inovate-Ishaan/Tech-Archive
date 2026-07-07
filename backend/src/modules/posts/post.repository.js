const { prisma } = require('../../config/prisma');

const postInclude = {
  author: {
    select: { id: true, username: true, displayname: true, avatar: true },
  },
};

async function findAll({ skip, limit, author, search }) {
  const where = {};
  if (author) where.author = { username: author };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: postInclude,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total };
}

async function findById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: postInclude,
  });
}

async function create(data) {
  return prisma.post.create({
    data,
    include: postInclude,
  });
}

async function update(id, data) {
  return prisma.post.update({
    where: { id },
    data,
    include: postInclude,
  });
}

async function remove(id) {
  return prisma.post.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
