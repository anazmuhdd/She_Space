const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'staff'),
    allowNull: false,
  },
});

module.exports = Staff;
