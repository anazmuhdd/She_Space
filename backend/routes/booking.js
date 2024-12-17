const express = require('express');
const router = express.Router();
const { checkAvailability, bookRoom, getUserBookings, cancelBooking } = require('../controllers/bookingController');

// Route to check availability
router.post('/availability', checkAvailability);
router.post('/book', bookRoom);
router.get('/:userId', getUserBookings);

// Route to cancel a booking
router.put('/cancel', cancelBooking);
module.exports = router;
