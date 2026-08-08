const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AutomationLog = sequelize.define('AutomationLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  automationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  leadId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  triggerEvent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stepsExecuted: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'failed',
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'automation_logs',
  timestamps: true,
});

module.exports = AutomationLog;
