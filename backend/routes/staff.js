const express = require('express');
const { loginStaff, registerStaff, getTodaysBookings, getBookingsForDate, 
    getUserDetails } = require('../controllers/staffController');

const router = express.Router();

// Staff Login Route
router.post('/stafflogin', loginStaff);
// Staff Registration Route (For admin use or testing)`
router.post('/staffregister', registerStaff);
router.post('/todays-bookings', getTodaysBookings);
router.post('/booking-calendar', getBookingsForDate);
router.post('/user-details', getUserDetails);

module.exports = router;
