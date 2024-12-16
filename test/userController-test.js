const User = require('../models/user'); // Replace with your actual User model path
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

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

// Controller for sending OTP
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiry in the database
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await User.updateOne(
      { email },
      { email, otp, otpExpiry },
      { upsert: true }
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or use a reliable email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Account Verification',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller for verifying OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP fields after verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  sendOTP,
  verifyOTP,
};
