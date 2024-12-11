const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Register User
const registerUser = async (req, res) => {
  const { name, dob, address, phone, email, password } = req.body;

  // Validate required fields
  if (!name || !dob || !phone || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      dob,
      address,
      phone,
      email,
      password: hashedPassword,
    });

    // Return success response
    if (user) {
      res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser };
