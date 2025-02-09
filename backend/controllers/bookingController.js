const { Op } = require('sequelize');
const Rooms = require('../models/room');
const Bookings = require('../models/booking');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Check availability for given dates
async function checkAvailability(req, res) {
  const { checkIn, checkOut } = req.body;

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    console.log("Request received with dates:", { checkIn, checkOut });

    // Fetch all bookings with status "Upcoming" within the given date range
    const bookings = await Bookings.findAll({
      where: {
        status: 'Upcoming',
        [Op.or]: [
          { check_in: { [Op.lt]: checkOutDate, [Op.gte]: checkInDate } },
          { check_out: { [Op.gt]: checkInDate, [Op.lte]: checkOutDate } },
          { check_in: { [Op.lte]: checkInDate }, check_out: { [Op.gte]: checkOutDate } }
        ]
      }
    });

    console.log("Bookings fetched:", JSON.stringify(bookings, null, 2));

    // Count the booked rooms by type
    const bookedRoomCounts = bookings.reduce((counts, booking) => {
      const normalizedType =
        booking.type === 'Non A/C'
          ? 'NonAC'
          : booking.type === 'A/C'
          ? 'AC'
          : booking.type;
      counts[normalizedType] = (counts[normalizedType] || 0) + (booking.room_ids?.length || 0);
      return counts;
    }, {});

    console.log("Booked Room Counts:", JSON.stringify(bookedRoomCounts, null, 2));

    // Fetch all rooms
    const rooms = await Rooms.findAll();

    console.log("Rooms fetched:", JSON.stringify(rooms, null, 2));

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

    console.log("Initial Availability:", JSON.stringify(availability, null, 2));

    // Subtract booked rooms from available rooms
    availability.Dormitory -= bookedRoomCounts.Dormitory || 0;
    availability.NonAC -= bookedRoomCounts.NonAC || 0;
    availability.AC -= bookedRoomCounts.AC || 0;

    console.log("Final Availability:", JSON.stringify(availability, null, 2));

    // Return availability information
    res.status(200).json({ success: true, availability });
  } catch (error) {
    console.error("Error during availability check:", error);
    res.status(500).json({ success: false, message: 'Error checking availability' });
  }
}


// Book a room
async function bookRoom(req, res) {
  const { userId, r_type, checkInD, checkOut, numRooms } = req.body;

  try {
    const checkInDate = new Date(checkInD);
    const checkOutDate = new Date(checkOut);

    console.log("Request received with data:", {
      userId,
      r_type,
      checkInDate,
      checkOutDate,
      numRooms
    });

    // Fetch bookings with status "Upcoming" within the date range
    const bookedRooms = await Bookings.findAll({
      where: {
        status: 'Upcoming',
        check_in: { [Op.lte]: checkOutDate },
        check_out: { [Op.gte]: checkInDate }
      },
      attributes: ['room_ids']
    });

    console.log("Booked rooms fetched:", JSON.stringify(bookedRooms, null, 2));

    // Filter booked room numbers
    const filteredbookedRooms = bookedRooms.length > 0
      ? [...new Set(bookedRooms.flatMap(booking => booking.room_ids))]
      : [];
    
    console.log("Filtered booked room IDs:", filteredbookedRooms);

    // Find available rooms that are not already booked
    const availableRooms = await Rooms.findAll({
      where: {
        status: 'Available',
        type: r_type,
        room_id: { [Op.notIn]: filteredbookedRooms }
      },
      attributes: ['room_id', 'dormitory_id']
    });

    console.log("Available rooms fetched:", JSON.stringify(availableRooms, null, 2));

    // Generate a unique booking ID
    const bookingId = await generateBookingId();
    console.log("Generated booking ID:", bookingId);

    // Select rooms to book
    const roomNumbers = availableRooms.slice(0, numRooms).map(room => ({
      room_id: room.room_id,
      dormitory_id: room.dormitory_id
    }));

    console.log("Selected rooms for booking:", roomNumbers);

    // Create the booking record
    const newBooking = await Bookings.create({
      booking_id: bookingId,
      user_id: userId,
      room_ids: roomNumbers.map(room => room.room_id),
      type: r_type,
      dormitory_ids: roomNumbers.map(room => room.dormitory_id),
      check_in: checkInDate,
      check_out: checkOutDate,
      status: "Upcoming"
    });

    console.log("New booking created:", JSON.stringify(newBooking, null, 2));

    res.status(200).json({
      message: "Booking successful",
      bookingId,
      rooms: roomNumbers
    });
  } catch (error) {
    console.error("Error during room booking:", error);
    res.status(500).json({ message: "Internal server error. Please try again." });
  }
}

// Generate a new booking ID
async function generateBookingId() {
  try {
    // Find the latest booking (sorted by createdAt)
    const lastBooking = await Bookings.findOne({ order: [['createdAt', 'DESC']] });

    console.log("Last booking record fetched:", JSON.stringify(lastBooking, null, 2));

    // If no bookings exist, start from B2000
    let newBookingId = 'B2000';

    if (lastBooking) {
      const lastBookingNumber = parseInt(lastBooking.booking_id.substring(1)); // Remove 'B' and convert to number
      newBookingId = 'B' + (lastBookingNumber + 1).toString(); // Increment and add 'B' back
    }

    console.log("Generated new booking ID:", newBookingId);
    return newBookingId;
  } catch (error) {
    console.error('Error generating booking ID:', error);
    throw error;
  }
}

// Get user bookings
async function getUserBookings(req, res) {
  const userId = req.params.userId;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Fetch past bookings (before today and not canceled)
    const pastBookings = await Bookings.findAll({
      where: {
        user_id: userId,
        check_out: { [Op.lt]: today },
        status: { [Op.ne]: 'Cancelled' }
      }
    });

    // Fetch upcoming bookings (from today onwards and not canceled)
    const upcomingBookings = await Bookings.findAll({
      where: {
        user_id: userId,
        check_in: { [Op.gte]: today },
        status: 'Upcoming'
      }
    });

    // Fetch canceled bookings
    const cancelledBookings = await Bookings.findAll({
      where: { 
        user_id: userId, 
        status: 'Cancelled' 
      }
    });

    res.status(200).json({
      success: true,
      pastBookings,
      upcomingBookings,
      cancelledBookings
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
}


async function cancelBooking(req, res) {
  const { bookingId } = req.body;

  try {
    console.log("Received bookingId for cancellation:", bookingId); // Debugging
    
    // Update the booking status to "Cancelled"
    const [affectedRows, updatedBooking] = await Bookings.update(
      { status: "Cancelled" },
      { where: { booking_id: bookingId }, returning: true }
    );

    // Log affected rows and updated booking details
    console.log("Number of affected rows:", affectedRows);
    console.log("Updated booking details:", updatedBooking);

    // Check if the booking was found and updated
    if (!affectedRows) {
      console.log("Booking not found for cancellation.");
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updatedBooking[0] // Return the updated booking details
    });
  } catch (error) {
    console.error("Error cancelling booking:", error); // Log the error
    res.status(500).json({ success: false, message: 'Error cancelling booking' });
  }
}

module.exports = { checkAvailability, bookRoom, getUserBookings, cancelBooking };
