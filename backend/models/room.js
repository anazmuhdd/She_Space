const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dormitory_id: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  status: {
    type: DataTypes.ENUM('Available', 'Closed'),
    defaultValue: 'Available',
  },
  rent_rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Room;
