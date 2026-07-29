const postRepository = require('./post.repository');
const ApiError = require('../../utils/ApiError');
const { HTTP_STATUS } = require('../../utils/constants');
const { prisma } = require('../../config/prisma');

async function listPosts(query) {
  return postRepository.findAll({
    author: query.author,
    search: query.search,
  });
}

async function resolveTagIds(tags) {
  if (!tags || tags.length === 0) {
    return [];
  }

  const cleanedTags = [...new Set(tags.filter(tag => typeof tag === "string").map(tag => tag.trim()).filter(tag => tag.length > 0))];

  const tagRecords = [];
  for (const tagName of cleanedTags) {
    const slug = tagName.toLowerCase().trim().replace(/\s+/g, "-");

    let tag = await prisma.tags.findUnique({where: { slug }});

    if (!tag) {
      tag = await prisma.tags.create({
        data: {
          name: tagName,
          slug,
        },
      });
    }
    tagRecords.push(tag.id);
  }
  return tagRecords;
}

async function getPost(id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid post ID format');
  }
  const post = await postRepository.findById(id);
  if (!post) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Post not found');
  }
  return post;
}

async function createPost(userId, body, file) {
  const { title, content, githubUrl } = body;

  let tags = [];
  if (body.tags !== undefined) {
    try {
      tags = typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags;
    } catch {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid tags format');
    }
    if (!Array.isArray(tags)) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Tags must be an array');
    if (tags.length > 4) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Maximum 4 tags allowed');
  }

  let images = [];
  if (body.images !== undefined) {
    try {
      images = typeof body.images === 'string' ? JSON.parse(body.images) : body.images;
    } catch {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid images format');
    }
    if (!Array.isArray(images)) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Images must be an array');
    if (images.length > 5) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Maximum 5 images allowed');
  }

  let coverImage = null;
  if (file) {
    coverImage = file.path;
  }

  if (githubUrl) {
    const existing = await postRepository.findByAuthorAndGithubUrl(userId, githubUrl);
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'You have already posted a project with this GitHub URL');
    }
  }

  const tagIds = await resolveTagIds(tags)

  const post = await postRepository.create({
    title: title.trim(),
    content,
    coverImage,
    tagIds,
    images,
    githubUrl: githubUrl || null,
    authorId: userId,
  });

  return post;
}

async function updatePost(postId, userId, body, file) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid post ID format');
  }
  const existing = await postRepository.findById(postId);
  if (!existing) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Post not found');
  }
  if (existing.authorId !== userId) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to update this post');
  }

  const updateData = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.content !== undefined) updateData.content = body.content;
  if (file) updateData.coverImage = file.path;
  if (body.coverImage !== undefined && !file) updateData.coverImage = body.coverImage;
  if (body.githubUrl !== undefined) updateData.githubUrl = body.githubUrl;
  if (body.tags !== undefined) {
    let parsed;
    try {
      parsed = typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags;
    } catch {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid tags format');
    }
    if (!Array.isArray(parsed) || parsed.length > 4) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Maximum 4 tags allowed');
    }
    updateData.tagIds = await resolveTagIds(parsed);
  }
  if (body.images !== undefined) {
    let parsed;
    try {
      parsed = typeof body.images === 'string' ? JSON.parse(body.images) : body.images;
    } catch {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid images format');
    }
    if (!Array.isArray(parsed) || parsed.length > 5) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Maximum 5 images allowed');
    }
    updateData.images = parsed;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No fields to update');
  }

  return postRepository.update(postId, updateData);
}

async function deletePost(postId, userId) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid post ID format');
  }
  const existing = await postRepository.findById(postId);
  if (!existing) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Post not found');
  }
  if (existing.authorId !== userId) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to delete this post');
  }
  await postRepository.remove(postId);
  return { ok: true };
}

async function fetchReadme(githubUrl) {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid GitHub repository URL');
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, '');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          'User-Agent': 'Tech-Archive/1.0',
        },
      }
    );

    if (resp.status === 404) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No README found in this repository');
    }
    if (resp.status === 403) {
      throw new ApiError(HTTP_STATUS.TOO_MANY, 'GitHub API rate limit exceeded. Try again later.');
    }
    if (!resp.ok) {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to fetch README from GitHub');
    }

    const content = await resp.text();
    return { content, repo: `${owner}/${repo}` };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Request to GitHub timed out');
    }
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to fetch README from GitHub');
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { listPosts, getPost, createPost, updatePost, deletePost, fetchReadme };
