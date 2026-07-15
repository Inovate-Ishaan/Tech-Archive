const validator = require('validator');

function validateEmail(email) {
  if (!email) return 'Email required';
  if (!validator.isEmail(email)) return 'Invalid email';
  if (!email.toLowerCase().endsWith('@iitbhilai.ac.in')) {
    return 'Email must be an @iitbhilai.ac.in address';
  }
  return null;
}

function validateRegister(body) {
  const { email, username, instituteId, firstName, lastName } = body || {};
  if (!email || !username || !instituteId || !firstName || !lastName) return 'Missing fields';
  const emailErr = validateEmail(email);
  if (emailErr) return emailErr;
  if (typeof username !== 'string' || username.length < 3 || username.length > 30) {
    return 'Username must be 3-30 characters';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  if (typeof firstName !== 'string' || firstName.trim().length === 0) return 'First name required';
  if (typeof lastName !== 'string' || lastName.trim().length === 0) return 'Last name required';
  return null;
}

function validateSetPassword(body) {
  const { email, password } = body || {};
  if (!email || !password) return 'Email and password required';
  const emailErr = validateEmail(email);
  if (emailErr) return emailErr;
  if (/\s/.test(password)) return 'Password must not contain spaces';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) return 'Password must contain at least one special character';
  return null;
}

function validateRequestOtp(body) {
  return validateEmail(body?.email);
}

function validateVerifyOtp(body) {
  const { email, code } = body || {};
  if (!email || !code) return 'Email and code required';
  return validateEmail(email);
}

function validateSignin(body) {
  const { email, password } = body || {};
  if (!email || !password) return 'Email and password required';
  return validateEmail(email);
}

function validateResetPassword(body) {
  const { email, password } = body || {};
  if (!email || !password) return 'Email and password required';
  const emailErr = validateEmail(email);
  if (emailErr) return emailErr;
  if (/\s/.test(password)) return 'Password must not contain spaces';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) return 'Password must contain at least one special character';
  return null;
}

module.exports = {
  validateEmail,
  validateRegister,
  validateRequestOtp,
  validateVerifyOtp,
  validateSignin,
  validateSetPassword,
  validateResetPassword,
};
