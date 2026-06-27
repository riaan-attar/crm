const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  series: {
    type: DataTypes.STRING,
    defaultValue: 'PROJ-.####',
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fromTemplate: {
    type: DataTypes.STRING,
  },
  company: {
    type: DataTypes.STRING,
    defaultValue: 'bootstack (Demo)',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open',
  },
  projectType: {
    type: DataTypes.STRING,
  },
  percentCompleteMethod: {
    type: DataTypes.STRING,
    defaultValue: 'Task Completion',
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Medium',
  },
  department: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.STRING,
    defaultValue: 'Yes',
  },
  estimatedCost: {
    type: DataTypes.STRING,
  },
  defaultCostCenter: {
    type: DataTypes.STRING,
  },
  collectProgress: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  holidayList: {
    type: DataTypes.STRING,
  },
  frequencyToCollectProgress: {
    type: DataTypes.STRING,
    defaultValue: 'Hourly',
  },
  fromTime: {
    type: DataTypes.STRING,
  },
  toTime: {
    type: DataTypes.STRING,
  },
  subject: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.TEXT,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  expectedStartDate: {
    type: DataTypes.STRING,
  },
  expectedEndDate: {
    type: DataTypes.STRING,
  },
  actualStartDate: {
    type: DataTypes.STRING,
  },
  actualEndDate: {
    type: DataTypes.STRING,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'projects',
  timestamps: true,
});

module.exports = Project;
