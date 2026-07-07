const path = require('path');

function getAvatarUrl(filename) {
  return `/avatars/${filename}`;
}

function getPostImageUrl(filename) {
  return `/posts/${filename}`;
}

function getPostImageUrls(files) {
  return files.map((f) => `/posts/${f.filename}`);
}

module.exports = { getAvatarUrl, getPostImageUrl, getPostImageUrls };
