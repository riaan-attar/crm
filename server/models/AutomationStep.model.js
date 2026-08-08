const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AutomationStep = sequelize.define('AutomationStep', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  automationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  parentStepId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stepType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stepConfig: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'automation_steps',
  timestamps: true,
});

module.exports = AutomationStep;
