const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Controller for user registration
const registerUser = async (req, res) => {
  const { name, dob, address, phone, email, password } = req.body;

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
    const user = new User({
      name,
      dob,
      address,
      phone,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Successful login
    res.status(200).json({
      message: 'Login successful',
      userId: user._id // Add the ObjectId of the user in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller for updating user profile
const updateUserProfile = async (req, res) => {
  const { name, dob, address, phone, email } = req.body;

  try {
    // Find the user by email and update the fields
    const user = await User.findOneAndUpdate(
      { email },
      { name, dob, address, phone },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller for fetching user details by email
const getUserProfile = async (req, res) => {
  const { email } = req.params; // Get email from URL parameter

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data (excluding password for security)
    res.status(200).json({
      name: user.name,
      dob: user.dob,
      address: user.address,
      phone: user.phone,
      email: user.email,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, getUserProfile };
