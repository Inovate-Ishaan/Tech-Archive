require('dotenv').config();

const env = {
  PORT: parseInt(process.env.PORT, 10) || 4000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@techarchive.local',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = env;
