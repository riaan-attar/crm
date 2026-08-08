const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Timesheet = sequelize.define('Timesheet', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  series: {
    type: DataTypes.STRING,
    defaultValue: 'TS-.YYYY.-',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Draft',
  },
  company: {
    type: DataTypes.STRING,
    defaultValue: 'bootstack (Demo)',
  },
  project: {
    type: DataTypes.STRING,
  },
  customer: {
    type: DataTypes.STRING,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  exchangeRate: {
    type: DataTypes.STRING,
    defaultValue: '1.000',
  },
  employee: {
    type: DataTypes.STRING,
  },
  timeSheets: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  totalWorkingHours: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  totalBillableHours: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  totalBillableAmount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  totalCostingAmount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  note: {
    type: DataTypes.TEXT,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'timesheets',
  timestamps: true,
});

module.exports = Timesheet;
