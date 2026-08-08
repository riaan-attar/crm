const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Automation = sequelize.define('Automation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  triggerType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  triggerConfig: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  executionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastExecutedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'automations',
  timestamps: true,
});

module.exports = Automation;
