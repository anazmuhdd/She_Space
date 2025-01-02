const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  booking_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  room_ids: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Stores an array of room IDs
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dormitory_ids: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Stores an array of dormitory IDs
  },
  check_in: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  check_out: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Upcoming', 'Completed', 'Cancelled'),
    defaultValue: 'Upcoming',
  },
  total_cost: {
    type: DataTypes.FLOAT,
  },
}, {
  timestamps: true,
});

module.exports = Booking;
