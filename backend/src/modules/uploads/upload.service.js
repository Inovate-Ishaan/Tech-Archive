function getAvatarUrl(avatarUrl) {
  return avatarUrl;
}

function getPostImageUrl(imageUrl) {
  return imageUrl;
}

function getPostImageUrls(files) {
  return files.map((f) => f.path);
}

module.exports = { getAvatarUrl, getPostImageUrl, getPostImageUrls };
