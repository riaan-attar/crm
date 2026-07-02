const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const getRequiredEnv = (name) => {
  const val = process.env[name];
  if (val === undefined) {
    throw new Error(`CRITICAL ERROR: Environment variable ${name} is not set!`);
  }
  return val;
};

module.exports = {
  PORT: process.env.PORT || 5000,
  DB_HOST: getRequiredEnv('DB_HOST'),
  DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  DB_USER: getRequiredEnv('DB_USER'),
  DB_PASS: process.env.DB_PASS || '', // Allow empty password string if defined in .env
  DB_NAME: getRequiredEnv('DB_NAME'),
  JWT_SECRET: getRequiredEnv('JWT_SECRET')
};
