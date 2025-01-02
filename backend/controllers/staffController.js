const Staff = require('../models/staff');
const Booking = require('../models/booking');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Staff Login
exports.loginStaff = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the staff exists
        const staff = await Staff.findOne({ where: { email } });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // If login is successful
        res.status(200).json({ message: 'Login successful', staff: { id: staff.id, name: staff.name, role: staff.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Staff Registration (For admin use or testing)
exports.registerStaff = async (req, res) => {
    const { id, name, email, password, role } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new staff with hashed password
        const newStaff = await Staff.create({ id, name, email, password: hashedPassword, role });
        res.status(201).json({ message: 'Staff registered successfully', staff: { id: newStaff.id, name: newStaff.name, role: newStaff.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Controller for Today's Bookings
// Get Today's Bookings
exports.getTodaysBookings = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Fetch bookings for the current day
        const bookings = await Booking.findAll({
            where: {
                check_in: { [Sequelize.Op.lt]: tomorrow },
                check_out: { [Sequelize.Op.gte]: today }
            },
            include: {
                model: User,
                attributes: ['name', 'phone', 'email']
            }
        });

        if (!bookings.length) {
            return res.status(404).json({ success: false, message: 'No bookings found for today' });
        }

        // Format the bookings
        const formattedBookings = bookings.map((booking) => {
            const { user, dormitory_ids, room_ids, type } = booking;

            return {
                booking_id: booking.booking_id,
                user_id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                dormitory_ids,
                room_ids,
                number_of_beds: Array.isArray(room_ids) ? room_ids.length : 0, // Check if array
                type,
            };
        });

        res.status(200).json({ success: true, bookings: formattedBookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching today\'s bookings', error: error.message });
    }
};

// Get Bookings for a Specific Date
exports.getBookingsForDate = async (req, res) => {
    const { selectedDate } = req.body;

    try {
        const date = new Date(selectedDate);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        // Fetch bookings for the selected date
        const bookings = await Booking.findAll({
            where: {
                check_in: { [Sequelize.Op.lt]: nextDay },
                check_out: { [Sequelize.Op.gte]: date }
            },
            include: {
                model: User,
                attributes: ['name', 'phone', 'email']
            }
        });

        const formattedBookings = bookings.map((booking) => ({
            booking_id: booking.booking_id,
            user_id: booking.user.id,
            name: booking.user.name,
            phone: booking.user.phone,
            email: booking.user.email,
            dormitory_ids: booking.dormitory_ids,
            room_ids: booking.room_ids,
            number_of_rooms: booking.room_ids.length + booking.dormitory_ids.length,
            type: booking.type,
        }));

        res.status(200).json({ success: true, bookings: formattedBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bookings for the date', error: error.message });
    }
};

// Controller for User Details
// Get User Details
exports.getUserDetails = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.findAll();

        // Prepare user details without bookings
        const userDetails = users.map((user) => ({
            user_id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            address: user.address,
        }));

        res.status(200).json({ success: true, users: userDetails });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};
