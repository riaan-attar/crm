const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UnitOfMeasure = sequelize.define('UnitOfMeasure', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'units_of_measure',
  timestamps: true,
});

module.exports = UnitOfMeasure;
