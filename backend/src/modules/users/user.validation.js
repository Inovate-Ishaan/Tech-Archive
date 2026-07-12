function validateUpdateProfile(body) {
  const { displayname, bio, branch, year, github, linkedin, website } = body || {};
  if (displayname !== undefined && (typeof displayname !== 'string' || displayname.trim().length === 0)) {
    return 'Display name cannot be empty';
  }
  if (bio !== undefined && typeof bio !== 'string') return 'Invalid bio';
  if (year !== undefined && (typeof year !== 'number' || year < 1900 || year > 2100)) {
    return 'Invalid year';
  }
  if (github !== undefined && typeof github !== 'string') return 'Invalid github URL';
  if (linkedin !== undefined && typeof linkedin !== 'string') return 'Invalid linkedin URL';
  if (website !== undefined && typeof website !== 'string') return 'Invalid website URL';
  return null;
}

module.exports = { validateUpdateProfile };
