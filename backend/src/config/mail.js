const nodemailer = require('nodemailer');
const env = require('./env');

async function sendEmail({ to, subject, text, html }) {
  if (!env.BREVO_API_KEY) {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
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
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: env.EMAIL_FROM },
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

module.exports = { sendEmail };
