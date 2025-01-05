const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Booking = sequelize.define('Booking', {
  booking_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', // Refers to the Users table
      key: 'id',
    },
  },
  room_ids: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dormitory_ids: {
    type: DataTypes.ARRAY(DataTypes.STRING),
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

// Only define associations here, after models are created
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Booking;
