function validateTags(tags) {
  if (!Array.isArray(tags)) return 'Tags must be an array';
  if (tags.length === 0) return 'At least one tag required';
  if (tags.length > 4) return 'Maximum 4 tags allowed';
  for (const tag of tags) {
    if (typeof tag !== 'string' || tag.trim().length === 0) return 'Each tag must be a non-empty string';
  }
  return null;
}

function validateCreatePost(body) {
  if (!body || typeof body !== 'object') return 'Invalid request body';
  const { title, content, githubUrl } = body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) return 'Title required';
  if (title.trim().length < 5) return 'Title must be at least 5 characters';
  if (title.length > 100) return 'Title too long (max 100 characters)';

  if (!content || typeof content !== 'string' || content.trim().length === 0) return 'Content required';
  if (content.trim().length < 20) return 'Content must be at least 20 characters';
  if (content.length > 50000) return 'Content too long (max 50000 characters)';

  if (githubUrl !== undefined && typeof githubUrl !== 'string') return 'Invalid GitHub URL';

  if (body.tags !== undefined) {
    let parsed;
    try {
      parsed = typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags;
    } catch {
      return 'Invalid tags format';
    }
    const tagErr = validateTags(parsed);
    if (tagErr) return tagErr;
  }

  if (body.images !== undefined) {
    let parsed;
    try {
      parsed = typeof body.images === 'string' ? JSON.parse(body.images) : body.images;
    } catch {
      return 'Invalid images format';
    }
    if (!Array.isArray(parsed)) return 'Images must be an array';
    if (parsed.length > 5) return 'Maximum 5 images allowed';
  }

  return null;
}

function validateUpdatePost(body) {
  const { title, content } = body || {};
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) return 'Title cannot be empty';
    if (title.trim().length < 5) return 'Title must be at least 5 characters';
    if (title.length > 100) return 'Title too long (max 100 characters)';
  }
  if (content !== undefined) {
    if (typeof content !== 'string' || content.trim().length === 0) return 'Content cannot be empty';
    if (content.trim().length < 20) return 'Content must be at least 20 characters';
    if (content.length > 50000) return 'Content too long (max 50000 characters)';
  }
  if (body.tags !== undefined) {
    let parsed;
    try {
      parsed = typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags;
    } catch {
      return 'Invalid tags format';
    }
    const tagErr = validateTags(parsed);
    if (tagErr) return tagErr;
  }
  return null;
}

module.exports = { validateCreatePost, validateUpdatePost };
