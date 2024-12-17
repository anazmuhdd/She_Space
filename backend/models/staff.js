const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff'], required: true }
});

// Hash password before saving


const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
