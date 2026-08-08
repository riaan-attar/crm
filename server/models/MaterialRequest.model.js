const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MaterialRequest = sequelize.define('MaterialRequest', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  requestedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    defaultValue: 'Purchase',
  },
  requiredDate: {
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
  totalItems: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  remarks: {
    type: DataTypes.TEXT,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'material_requests',
  timestamps: true,
});

module.exports = MaterialRequest;
