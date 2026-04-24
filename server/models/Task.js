const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  due_date: { type: DataTypes.DATE },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Task;