const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const cors = require('cors'); // Import CORS
const path = require('path'); // Import path for serving static files



// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all origins (or specify origins as needed)
app.use(cors());


app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.get('/shespace', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'index.html')); 
});
app.get('/create-account', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'create-account.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'post-login.html')); 
});
app.get('/edit-profile', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'edit-profile.html')); 
});
app.get('/staff-login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'staff-login.html'));
});
app.get('', (req, res) => {
  res.redirect('/shespace');
});
app.use('/api', authRoutes, bookingRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware for server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
