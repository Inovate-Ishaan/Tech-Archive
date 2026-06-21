require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

async function sendEmail({ to, subject, text, html }) {
  if (!process.env.BREVO_API_KEY) {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@techarchive.local',
      to, subject, text, html,
    });
    return { provider: 'ethereal', previewUrl: nodemailer.getTestMessageUrl(info) };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_FROM || 'no-reply@techarchive.local' },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data?.message || 'Brevo delivery failed');
    }
  } finally {
    clearTimeout(timeout);
  }
}

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 OTP requests per hour
  message: { error: 'Too many OTP requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // strict limit for sensitive operations
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());

async function cleanExpiredOtps() {
  const { count } = await prisma.otp.deleteMany({
    where: { OR: [{ expiresAt: { lte: new Date() } }, { used: true }] },
  });
  if (count > 0) console.log(`Cleaned ${count} OTP(s)`);
}

// Periodic cleanup every 5 minutes
setInterval(cleanExpiredOtps, 5 * 60 * 1000);
cleanExpiredOtps();

app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'Auth backend running with Prisma' });
});

// Request OTP: validate email, store a one-time code, and send it to the user.
app.post('/api/auth/request-otp', otpLimiter, async (req, res) => {
  try {
    // 1) Basic input validation.
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email required' });
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!email.toLowerCase().endsWith('@iitbhilai.ac.in')) {
      return res.status(400).json({ error: 'Email must be an @iitbhilai.ac.in address' });
    }

    // 2) Invalidate all previous unused OTPs for this email, then create a new one.
    await prisma.otp.updateMany({
      where: { email, used: false },
      data: { used: true },
    });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const user = await prisma.user.findUnique({ where: { email } });
    await prisma.otp.create({ data: { email, code, expiresAt, userId: user ? user.id : null } });
    console.log(`\n[DEV] OTP for ${email}: ${code}\n`);

    // 3) Send the OTP via Brevo API or Ethereal (dev).
    const subject = 'Your Tech Archive OTP';
    const text = `Your one-time sign-in code is: ${code}. It expires in 10 minutes.`;
    const html = `<p>Your one-time sign-in code is: <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`;
    const result = await sendEmail({ to: email, subject, text, html });

    return res.json({ ok: true, devCode: code, previewUrl: result?.previewUrl });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP: check code and issue JWT if user exists
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: 'Email and code required' });
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });

    const now = new Date();
    const otp = await prisma.otp.findFirst({ where: { email, code, used: false, expiresAt: { gt: now } }, orderBy: { createdAt: 'desc' } });
    if (!otp) return res.status(400).json({ error: 'Invalid or expired code' });

    await prisma.otp.update({ where: { id: otp.id }, data: { used: true } });

    // find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Register endpoint - creates user without password (password set later via /set-password)
app.post('/api/auth/register', strictLimiter, async (req, res) => {
  try {
    const { email, username, instituteId } = req.body || {};
    if (!email || !username || !instituteId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!email.toLowerCase().endsWith('@iitbhilai.ac.in')) return res.status(400).json({ error: 'Email must be an @iitbhilai.ac.in address' });
    if (typeof username !== 'string' || username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be 3-30 characters' });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
    }

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }, { instituteId }] } });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const user = await prisma.user.create({ data: { email, username, instituteId } });

    return res.json({ user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Set password after OTP verification
app.post('/api/auth/set-password', strictLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!email.toLowerCase().endsWith('@iitbhilai.ac.in')) return res.status(400).json({ error: 'Email must be an @iitbhilai.ac.in address' });
    if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    // Password complexity: at least one uppercase, one lowercase, one number, one special char
    if (!/[A-Z]/.test(password)) return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
    if (!/[a-z]/.test(password)) return res.status(400).json({ error: 'Password must contain at least one lowercase letter' });
    if (!/[0-9]/.test(password)) return res.status(400).json({ error: 'Password must contain at least one number' });
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return res.status(400).json({ error: 'Password must contain at least one special character' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { email }, data: { password: hashed } });

    return res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Signin endpoint with DB verification
app.post('/api/auth/signin', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!email.toLowerCase().endsWith('@iitbhilai.ac.in')) return res.status(401).json({ error: 'Sign-in restricted to @iitbhilai.ac.in emails' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.password) {
      return res.status(400).json({ error: 'Please complete registration by verifying OTP and setting password first' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth server listening on port ${PORT}`);
});

