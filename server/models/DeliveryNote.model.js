const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeliveryNote = sequelize.define('DeliveryNote', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  customer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postingDate: {
    type: DataTypes.STRING,
  },
  fromWarehouse: {
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
  tableName: 'delivery_notes',
  timestamps: true,
});

module.exports = DeliveryNote;
