/**
 * Database configuration
 * This file configures the Sequelize instance to connect to MySQL.
 * Extend this file to handle read/write replicas or connection pooling.
 */
const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: false, // Set to console.log to see SQL queries
});

module.exports = sequelize;
