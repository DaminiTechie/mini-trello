const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Column = sequelize.define('Column', {
  title: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Column;