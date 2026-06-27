const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemGroup: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },
  uom: {
    type: DataTypes.STRING,
    defaultValue: 'Nos',
  },
  rate: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  openingStock: {
    type: DataTypes.DECIMAL(15, 3),
    defaultValue: 0,
  },
  currentStock: {
    type: DataTypes.DECIMAL(15, 3),
    defaultValue: 0,
  },
  reorderLevel: {
    type: DataTypes.DECIMAL(15, 3),
    defaultValue: 0,
  },
  warehouse: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  hasSerialNo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasBatchNo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'items',
  timestamps: true,
});

module.exports = Item;
