const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Warehouse = sequelize.define('Warehouse', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  warehouseType: {
    type: DataTypes.STRING,
    defaultValue: 'Stores',
  },
  city: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  parentWarehouse: {
    type: DataTypes.STRING,
  },
  stockValue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  isGroup: {
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
  tableName: 'warehouses',
  timestamps: true,
});

module.exports = Warehouse;
