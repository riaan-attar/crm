const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SerialNo = sequelize.define('SerialNo', {
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
  warehouse: {
    type: DataTypes.STRING,
  },
  purchaseDate: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  supplier: {
    type: DataTypes.STRING,
  },
  warrantyExpiry: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'serial_nos',
  timestamps: true,
});

module.exports = SerialNo;
