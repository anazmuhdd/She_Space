const express = require('express');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
require('./models/association');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const staffRoutes = require('./routes/staff');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to PostgreSQL
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all origins (or specify origins as needed)
app.use(cors());

// Static file routes
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
app.get('/userviewbookings', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'view-bookings.html'));
});
app.get('/staff-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'staff-post-login.html'));
});
app.get('', (req, res) => {
  res.redirect('/shespace');
});

// API Routes
app.use('/api', authRoutes, bookingRoutes, staffRoutes);

// 404 Error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Sync Sequelize models and start the server
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }) // Set to true only if you want to reset the database schema
  .then(() => {
    console.log('Database & tables synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
