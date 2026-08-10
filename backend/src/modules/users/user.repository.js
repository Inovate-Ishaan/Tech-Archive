const { prisma } = require('../../config/prisma');

async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      displayname: true,
      avatar: true,
      bio: true,
      branch: true,
      year: true,
      github: true,
      linkedin: true,
      website: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
  });
}

async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      displayname: true,
      avatar: true,
      bio: true,
      branch: true,
      year: true,
      github: true,
      linkedin: true,
      website: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
  });
}

async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      displayname: true,
      avatar: true,
      bio: true,
      branch: true,
      year: true,
      github: true,
      linkedin: true,
      website: true,
      edit_access: true,
    },
  });
}

async function updateAvatar(id, avatarPath) {
  return prisma.user.update({
    where: { id },
    data: { avatar: avatarPath },
    select: { avatar: true },
  });
}

module.exports = { findUserById, findUserByUsername, updateUser, updateAvatar };
