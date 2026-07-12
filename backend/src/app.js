const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');
const authRepository = require('./modules/auth/auth.repository');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Periodic OTP cleanup every 5 minutes
setInterval(() => {
  authRepository.cleanExpiredOtps().catch((err) => {
    console.error('OTP cleanup failed:', err);
  });
}, 5 * 60 * 1000);
authRepository.cleanExpiredOtps().catch((err) => {
  console.error('OTP cleanup failed:', err);
});

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'Tech Archive is running' });
});

// API routes
app.use('/api', routes);

// Global error handler
app.use(errorHandler);

module.exports = app;
