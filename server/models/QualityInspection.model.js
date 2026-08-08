const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const QualityInspection = sequelize.define('QualityInspection', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  item: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inspectionType: {
    type: DataTypes.STRING,
    defaultValue: 'Inward',
  },
  inspector: {
    type: DataTypes.STRING,
  },
  referenceType: {
    type: DataTypes.STRING,  // e.g., 'Purchase Receipt', 'Stock Entry'
  },
  referenceId: {
    type: DataTypes.STRING,
  },
  inspectionDate: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  remarks: {
    type: DataTypes.TEXT,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'quality_inspections',
  timestamps: true,
});

module.exports = QualityInspection;
