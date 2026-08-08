const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AutomationPendingExecution = sequelize.define('AutomationPendingExecution', {
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
  logId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  parentStepId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nextStepPosition: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  context: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  runAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
}, {
  tableName: 'automation_pending_executions',
  timestamps: true,
});

module.exports = AutomationPendingExecution;
