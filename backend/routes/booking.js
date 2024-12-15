const express = require('express');
const router = express.Router();
const { checkAvailability, bookRoom } = require('../controllers/bookingController');

// Route to check availability
router.post('/availability', checkAvailability);

// Route to book a room/bed
router.post('/book', bookRoom);

module.exports = router;
