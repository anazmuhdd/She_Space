const Staff = require('../models/Staff');
const Booking = require('../models/booking');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { Op } = Sequelize;

// Staff Login
exports.loginStaff = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Staff login attempt:", email);

        // Check if the staff exists
        const staff = await Staff.findOne({ where: { email } });
        console.log("Fetched staff:", staff);

        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, staff.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', staff: { id: staff.id, name: staff.name, role: staff.role } });
    } catch (error) {
        console.error("Error during staff login:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Staff Registration
exports.registerStaff = async (req, res) => {
    const { id, name, email, password, role } = req.body;

    try {
        console.log("Registering staff:", { email, name });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);

        // Create new staff with hashed password
        const newStaff = await Staff.create({ id, name, email, password: hashedPassword, role });
        console.log("New staff created:", newStaff);

        res.status(201).json({ message: 'Staff registered successfully', staff: { id: newStaff.id, name: newStaff.name, role: newStaff.role } });
    } catch (error) {
        console.error("Error registering staff:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Today's Bookings
exports.getTodaysBookings = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        console.log("Fetching today's bookings...");

        const bookings = await Booking.findAll({
            where: {
                check_in: { [Op.lt]: tomorrow },
                check_out: { [Op.gte]: today },
                status: { [Op.ne]: 'Cancelled' },
            },
            include: {
                model: User,
                as: 'bookedUser',  // Added 'as' to specify the correct association
                attributes: ['id', 'name', 'phone', 'email'],
            },
        });
        console.log("Today's bookings fetched:", bookings);

        const formattedBookings = bookings.map((booking) => ({
            booking_id: booking.booking_id,
            user_id: booking.bookedUser.id,  // Use the alias here
            name: booking.bookedUser.name,   // Use the alias here
            phone: booking.bookedUser.phone, // Use the alias here
            email: booking.bookedUser.email, // Use the alias here
            dormitory_ids: booking.dormitory_ids,
            room_ids: booking.room_ids,
            number_of_beds: Array.isArray(booking.room_ids) ? booking.room_ids.length : 0,
            type: booking.type,
        }));
        console.log("Formatted bookings:", formattedBookings);

        res.status(200).json({ success: true, bookings: formattedBookings });
    } catch (error) {
        console.error("Error fetching today's bookings:", error);
        res.status(500).json({ message: "Error fetching today's bookings", error: error.message });
    }
};


// Get Bookings for a Specific Date
exports.getBookingsForDate = async (req, res) => {
    const { selectedDate } = req.body;

    try {
        console.log("Fetching bookings for date:", selectedDate);

        const date = new Date(selectedDate);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const bookings = await Booking.findAll({
            where: {
                check_in: { [Op.lt]: nextDay },
                check_out: { [Op.gte]: date },
                status: { [Op.ne]: 'Cancelled' },
            },
            include: {
                model: User,
                as: 'bookedUser',  // Added 'as' to specify the correct alias
                attributes: ['id', 'name', 'phone', 'email'],
            },
        });
        console.log("Bookings fetched for date:", bookings);

        const formattedBookings = bookings.map((booking) => ({
            booking_id: booking.booking_id,
            user_id: booking.bookedUser.id,  // Use the alias here
            name: booking.bookedUser.name,   // Use the alias here
            phone: booking.bookedUser.phone, // Use the alias here
            email: booking.bookedUser.email, // Use the alias here
            dormitory_ids: booking.dormitory_ids,
            room_ids: booking.room_ids,
            number_of_rooms: booking.room_ids.length + booking.dormitory_ids.length,
            type: booking.type,
        }));
        console.log("Formatted bookings:", formattedBookings);

        res.status(200).json({ success: true, bookings: formattedBookings });
    } catch (error) {
        console.error("Error fetching bookings for the date:", error);
        res.status(500).json({ message: "Error fetching bookings for the date", error: error.message });
    }
};


// Get User Details
exports.getUserDetails = async (req, res) => {
    try {
        console.log("Fetching user details...");

        const users = await User.findAll();
        console.log("Users fetched:", users);

        const userDetails = users.map((user) => ({
            user_id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            address: user.address,
        }));

        console.log("Formatted user details:", userDetails);

        res.status(200).json({ success: true, users: userDetails });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};

