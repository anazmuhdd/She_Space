const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile ,getUserProfile } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/updateProfile', updateUserProfile);
router.get('/user/:email', getUserProfile);

module.exports = router;


