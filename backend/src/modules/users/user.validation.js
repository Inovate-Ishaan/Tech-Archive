function validateUpdateProfile(body) {
  const { displayname, bio, branch, year, github, linkedin, website } = body || {};
  if (displayname !== undefined && (typeof displayname !== 'string' || displayname.trim().length === 0)) {
    return 'Display name cannot be empty';
  }
  if (bio !== undefined && typeof bio !== 'string') return 'Invalid bio';
  if (year !== undefined && (typeof year !== 'number' || year < 1950 || year > 2100)) {
    return 'Invalid year';
  }
  if (github !== undefined && typeof github !== 'string') return 'Invalid github URL';
  if (linkedin !== undefined && typeof linkedin !== 'string') return 'Invalid linkedin URL';
  if (website !== undefined && typeof website !== 'string') return 'Invalid website URL';
  return null;
}

function validateUpdateUsername(body) {
  const { username } = body || {};
  if (typeof username !== 'string' || username.length < 3 || username.length > 30) {
    return 'Username must be 3-30 characters';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return null;
}

module.exports = { validateUpdateProfile, validateUpdateUsername };
