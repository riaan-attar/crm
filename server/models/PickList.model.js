const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PickList = sequelize.define('PickList', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  purpose: {
    type: DataTypes.STRING,
    defaultValue: 'Delivery',
  },
  warehouse: {
    type: DataTypes.STRING,
  },
  picker: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Draft',
  },
  items: {
    type: DataTypes.TEXT, // JSON stringified array
    defaultValue: '[]',
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'pick_lists',
  timestamps: true,
});

module.exports = PickList;
