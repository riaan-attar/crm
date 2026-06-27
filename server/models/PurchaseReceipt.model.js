const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PurchaseReceipt = sequelize.define('PurchaseReceipt', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postingDate: {
    type: DataTypes.STRING,
  },
  acceptedWarehouse: {
    type: DataTypes.STRING,
  },
  items: {
    type: DataTypes.TEXT, // JSON stringified array
    defaultValue: '[]',
  },
  totalQty: {
    type: DataTypes.DECIMAL(15, 3),
    defaultValue: 0,
  },
  totalAmount: {
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
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'purchase_receipts',
  timestamps: true,
});

module.exports = PurchaseReceipt;
