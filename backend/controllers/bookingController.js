const Rooms = require('../models/room');
const Bookings = require('../models/booking');
const { v4: uuidv4 } = require('uuid');

// Check availability for given dates
async function checkAvailability(req, res) {
  const { checkIn, checkOut } = req.body;

  try {
    // Convert date strings to Date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Fetch all bookings within the given date range
    const bookings = await Bookings.find({
      $or: [
        { check_in: { $lt: checkOutDate, $gte: checkInDate } },
        { check_out: { $gt: checkInDate, $lte: checkOutDate } },
        { check_in: { $lte: checkInDate }, check_out: { $gte: checkOutDate } }
      ]
    });
    // Count the booked rooms by type
    const bookedRoomCounts = bookings.reduce((counts, booking) => {
      counts[booking.type] = (counts[booking.type] || 0)
      return counts;
    }, {});

    // Fetch all rooms
    const rooms = await Rooms.find();

    // Initialize availability counters
    const availability = {
      Dormitory: 0,
      NonAC: 0,
      AC: 0
    };

    // Count available rooms based on their type
    rooms.forEach(room => {
      if (room.status === 'Available') {
        if (room.type === 'Dormitory') availability.Dormitory++;
        else if (room.type === 'Non A/C') availability.NonAC++;
        else if (room.type === 'A/C') availability.AC++;
      }
    });

    // Subtract booked rooms from available rooms
    availability.Dormitory -= bookedRoomCounts.Dormitory || 0;
    availability.NonAC -= bookedRoomCounts.NonAC || 0;
    availability.AC -= bookedRoomCounts.AC || 0;

    // Return availability information
    res.status(200).json({ success: true, availability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error checking availability' });
  }
}

async function bookRoom(req, res) {
  const { userId, r_type, checkInD, checkOut, numRooms } = req.body;

  try {
    const checkInDate = new Date(checkInD);  // Ensure checkInD is being passed correctly
    const checkOutDate = new Date(checkOut);

    // Step 1: Check availability of rooms within the specified dates
    const bookedRooms = await Bookings.find({
      check_in: { $lte: checkOutDate },
      check_out: { $gte: checkInDate }
    }).select('room_ids');
    console.log("booked room numbers: ",bookedRooms);

    const filteredbookedRooms = bookedRooms.length > 0 
    ? [...new Set(bookedRooms.flatMap(booking => booking.room_ids))] 
    : []; 
    console.log("filtered booked room numbers: ",filteredbookedRooms);
    // Step 2: Get all available rooms (status: "Available" and not already booked in the date range)
    const availableRooms = await Rooms.find({
      status: 'Available',
      type: r_type,
      room_id: { $nin: filteredbookedRooms }
    });
    console.log("availabenumbers: ",availableRooms);

    // Step 4: Generate a unique booking ID
    const bookingId = await generateBookingId();

    // Step 5: Select the room numbers from the available rooms
    const roomNumbers = availableRooms.slice(0, numRooms).map(room => room.room_id);
    console.log("bookedNumbers:",roomNumbers );

    // Step 6: Create the booking record in the database
    const newBooking = new Bookings({
      booking_id: bookingId,  // Make sure the field is named booking_id in the schema
      user_id: userId,        // Ensure user_id is correctly referenced
      room_ids: roomNumbers,
      type: r_type,
      check_in: checkInDate,  // Ensure check_in is passed to the schema
      check_out: checkOutDate, // Ensure check_out is passed to the schema
      status: "Upcoming"       // Set the status to "pending" for now
    });

    // Save the booking in the database
    await newBooking.save();

    // Step 7: Respond with booking details (Booking ID and Room Numbers)
    return res.status(200).json({
      message: "Booking successful",
      bookingId,
      roomNumbers
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error. Please try again." });
  }
}


async function generateBookingId() {
  try {
    // Find the latest booking (sorted by createdAt)
    const lastBooking = await Bookings.findOne().sort({ createdAt: -1 });

    // If no bookings exist, start from B2000
    let newBookingId = 'B2000';

    if (lastBooking) {
      const lastBookingNumber = parseInt(lastBooking.booking_id.substring(1)); // Remove 'B' and convert to number
      newBookingId = 'B' + (lastBookingNumber + 1).toString(); // Increment and add 'B' back
    }

    return newBookingId;
  } catch (error) {
    console.error('Error generating booking ID:', error);
    throw error;
  }
}

module.exports = { checkAvailability, bookRoom };
