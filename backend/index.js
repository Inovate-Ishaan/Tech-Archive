require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

// Main backend entry point for auth, OTP email flow, JWT handling, and Prisma demo CRUD.

// Creates the SMTP transport used for email delivery.
// - If SMTP env vars are set, use your real SMTP provider.
// - Otherwise fall back to Ethereal test credentials for local development.
async function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
// Fallback to Ethereal for development/testing
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// Unified email sender used by the OTP flow.
// Priority order:
// 1) Brevo API when BREVO_API_KEY is configured.
// 2) Nodemailer SMTP/Ethereal fallback for local/dev testing.
async function sendEmail({ to, subject, text, html }) {
  if (process.env.BREVO_API_KEY) {
    try {
      const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
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
      if (!resp.ok || data?.code === 'unauthorized') {
        throw new Error(data?.message || 'Brevo delivery failed');
      }

      return { provider: 'brevo', resp: data };
    } catch (err) {
      console.warn('Brevo delivery failed, falling back to nodemailer:', err.message || err);
    }
  }

  // Fallback path: local SMTP (if configured) or Ethereal test account.
  const transporter = await createTransport();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@techarchive.local',
    to,
    subject,
    text,
    html,
  });

  let previewUrl = null;
  if (nodemailer.getTestMessageUrl) previewUrl = nodemailer.getTestMessageUrl(info);

  return { provider: 'nodemailer', info, previewUrl };
}

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'Auth backend running with Prisma' });
});

// Request OTP: validate email, store a one-time code, and send it to the user.
app.post('/api/auth/request-otp', async (req, res) => {
  try {
    // 1) Basic input validation.
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email required' });
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!email.toLowerCase().endsWith('@iitbhilai.ac.in')) {
      return res.status(400).json({ error: 'Email must be an @iitbhilai.ac.in address' });
    }

    // 2) Create an OTP and keep it in the database for later verification.
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const user = await prisma.user.findUnique({ where: { email } });
    await prisma.otp.create({ data: { email, code, expiresAt, userId: user ? user.id : null } });

    // 3) Send the OTP via Brevo or the SMTP/Ethereal fallback.
    const subject = 'Your Tech Archive OTP';
    const text = `Your one-time sign-in code is: ${code}. It expires in 10 minutes.`;
    const html = `<p>Your one-time sign-in code is: <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`;
    const sendResult = await sendEmail({ to: email, subject, text, html });

    // 4) Return a preview URL for dev testing when using Ethereal, otherwise return provider metadata.
    if (sendResult.provider === 'nodemailer') {
      return res.json({ ok: true, previewUrl: sendResult.previewUrl });
    }

    return res.json({ ok: true, provider: sendResult.provider, response: sendResult.resp });
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
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username, instituteId } = req.body || {};
    if (!email || !password || !username || !instituteId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!email.toLowerCase().endsWith('@iitbhilai.ac.in')) return res.status(400).json({ error: 'Email must be an @iitbhilai.ac.in address' });
    if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'Password too short' });

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { instituteId }] } });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, username, password: hashed, instituteId } });

    return res.json({ user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Signin endpoint with DB verification
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!email.toLowerCase().endsWith('@iitbhilai.ac.in')) return res.status(401).json({ error: 'Sign-in restricted to @iitbhilai.ac.in emails' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Demo CRUD endpoints for `Project` (example of Prisma usage)
// List projects
app.get('/api/demo/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ include: { user: true } });
    return res.json({ projects });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create project for a user identified by email
app.post('/api/demo/projects', async (req, res) => {
  try {
    const { email, title, description } = req.body || {};
    if (!email || !title) return res.status(400).json({ error: 'email and title required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const project = await prisma.project.create({ data: { userId: user.id, title, description: description || '' } });
    return res.json({ project });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update project by id
app.put('/api/demo/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body || {};
    const project = await prisma.project.update({ where: { id }, data: { title, description } });
    return res.json({ project });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete project by id
app.delete('/api/demo/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth server listening on port ${PORT}`);
});
