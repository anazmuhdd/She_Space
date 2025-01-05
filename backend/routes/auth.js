const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserDetails ,getUserDetails } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/updateProfile', updateUserDetails);
router.get('/user/:email', getUserDetails);
module.exports = router;
