const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectTask = sequelize.define('ProjectTask', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  project: {
    type: DataTypes.STRING,
  },
  isTemplate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  issue: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open',
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Low',
  },
  weight: {
    type: DataTypes.STRING,
  },
  parentTask: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  dependencies: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  company: {
    type: DataTypes.STRING,
    defaultValue: 'Bootstack IO (Demo)',
  },
  department: {
    type: DataTypes.STRING,
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
  tableName: 'project_tasks',
  timestamps: true,
});

module.exports = ProjectTask;
