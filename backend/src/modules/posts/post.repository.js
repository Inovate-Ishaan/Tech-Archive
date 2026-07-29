const { prisma } = require('../../config/prisma');

const postInclude = {
  author: {
    select: { id: true, username: true, displayname: true, avatar: true },
  },
  tags: {
    select: {tags:{select:{id:true,name:true,slug:true}}},
  },
};

async function findAll({ author, search }) {
  const where = {};
  if (author) where.author = { username: author };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: postInclude,
  });

  return posts;
}

async function findById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: postInclude,
  });
}

async function create(data) {
  const { tagIds = [], ...postData } = data;

  return prisma.post.create({
    data: {...postData,
      tags: {create: tagIds.map((tagId) => ({
          tags: {
            connect: {
              id: tagId,
            },
          },
        })),
      },
    },
    include: postInclude,
  });
}

async function update(id, data) {
  const { tagIds, ...postData } = data;

  const updateData = {...postData,};
  if (tagIds) {
    updateData.tags = {
      deleteMany: {},
      create: tagIds.map((tagId) => ({
        tags: {
          connect: {
            id: tagId,
          },
        },
      })),
    };
  }

  return prisma.post.update({
    where: { id },
    data: updateData,
    include: postInclude,
  });
}

async function findByAuthorAndGithubUrl(authorId, githubUrl) {
  return prisma.post.findFirst({
    where: { authorId, githubUrl },
  });
}

async function remove(id) {
  return prisma.post.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove, findByAuthorAndGithubUrl };
