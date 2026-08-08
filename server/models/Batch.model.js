const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Batch = sequelize.define('Batch', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  item: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemCode: {
    type: DataTypes.STRING,
  },
  qty: {
    type: DataTypes.DECIMAL(15, 3),
    defaultValue: 0,
  },
  mfgDate: {
    type: DataTypes.STRING,
  },
  expiryDate: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  supplier: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'batches',
  timestamps: true,
});

module.exports = Batch;
