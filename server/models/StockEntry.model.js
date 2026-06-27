const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StockEntry = sequelize.define('StockEntry', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  stockEntryType: {
    type: DataTypes.STRING,
    defaultValue: 'Material Transfer',
  },
  fromWarehouse: {
    type: DataTypes.STRING,
  },
  toWarehouse: {
    type: DataTypes.STRING,
  },
  postingDate: {
    type: DataTypes.STRING,
  },
  totalValue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Draft',
  },
  remarks: {
    type: DataTypes.TEXT,
  },
  items: {
    type: DataTypes.TEXT, // JSON stringified array of items
    defaultValue: '[]',
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'stock_entries',
  timestamps: true,
});

module.exports = StockEntry;
