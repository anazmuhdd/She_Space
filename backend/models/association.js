const User = require('./User'); // Import the User model
const Booking = require('./booking'); // Import the Booking model

// Define the associations
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'bookedUser' });  // Changed alias to 'bookedUser'
