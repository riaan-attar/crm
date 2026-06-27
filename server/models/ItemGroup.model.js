const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ItemGroup = sequelize.define('ItemGroup', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentGroup: {
    type: DataTypes.STRING,
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  tableName: 'item_groups',
  timestamps: true,
});

module.exports = ItemGroup;
