const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  dormitory_id: { type: String, default: null }, // For dormitory beds
  status: { type: String, required: true, enum: ['Available', 'Booked'], default: 'Available' },
  current_booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  rent_rate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
