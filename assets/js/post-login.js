document.addEventListener('DOMContentLoaded', () => {
  // Initialize Flatpickr for check-in and check-out date & time
  flatpickr("#checkIn", {
    enableTime: true,
    dateFormat: "Y-m-d H:i", // Format to include date and time
    minDate: "today", // Prevent past dates from being selected
  });

  flatpickr("#checkOut", {
    enableTime: true,
    dateFormat: "Y-m-d H:i", // Format to include date and time
    minDate: "today", // Prevent past dates from being selected
  });

  // Disable Check Availability Button initially
  const checkAvailabilityBtn = document.getElementById("checkAvailabilityBtn");

  // Enable Check Availability Button when Check-in and Check-out are filled
  const checkInInput = document.getElementById("checkIn");
  const checkOutInput = document.getElementById("checkOut");

  checkInInput.addEventListener("change", toggleCheckAvailability);
  checkOutInput.addEventListener("change", toggleCheckAvailability);

  function toggleCheckAvailability() {
    if (checkInInput.value && checkOutInput.value) {
      checkAvailabilityBtn.disabled = false;
    } else {
      checkAvailabilityBtn.disabled = true;
    }
  }

  // Declare availability at the top, so it's accessible globally
  let availability = {};

  // Show Available Rooms Modal when Check Availability button is clicked
  checkAvailabilityBtn.addEventListener("click", async () => {
    const checkInDate = checkInInput.value;
    const checkOutDate = checkOutInput.value;
    localStorage.setItem('checkInDate', checkInDate);
    localStorage.setItem('checkOutDate', checkOutDate);

    if (!checkInDate || !checkOutDate) return;

    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn: checkInDate, checkOut: checkOutDate }),
      });

      const data = await response.json();

      if (response.ok) {
        availability = data.availability; // Store the availability data in the global variable
        populateAvailableRooms(availability); // Pass the global availability variable here
        const availableRoomsModal = new bootstrap.Modal(document.getElementById('availableRoomsModal'));
        availableRoomsModal.show();
      } else {
        alert(data.message || 'Error fetching room availability.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while checking availability.');
    }
  });

  // Update room options based on selected room type
  const roomType = document.getElementById("roomType");
  const roomOrBed = document.getElementById("roomOrBed");

  roomType.addEventListener("change", () => {
    const selectedRoom = roomType.value;
    if (selectedRoom !== "selectRoom") {
      updateRoomOrBedDropdown(selectedRoom);
    } else {
      roomOrBed.innerHTML = ""; // Clear options if "Select Room" is chosen
    }
  });

  function updateRoomOrBedDropdown(selectedRoom) {
    let availableQuantity = availability[selectedRoom] || 0; // Use the globally defined availability

    roomOrBed.innerHTML = ""; // Clear existing options

    for (let i = 1; i <= availableQuantity; i++) {
      const optionElement = document.createElement("option");
      optionElement.value = i;
      optionElement.textContent = `${i} ${selectedRoom === 'Dormitory' ? 'Bed(s)' : 'Room(s)'}`;
      roomOrBed.appendChild(optionElement);
    }
  }

  // Populate available rooms in the modal
  function populateAvailableRooms(availability) {
    const availableRoomsList = document.querySelector('.list-group');
    availableRoomsList.innerHTML = '';

    const roomTypes = ['Dormitory', 'NonAC', 'AC'];

    roomTypes.forEach(type => {
      const available = availability[type] || 0;
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.textContent = `${type} - ${available} ${type === 'Dormitory' ? 'Beds' : 'Beds'} Available`;
      availableRoomsList.appendChild(listItem);
    });
  }

  // Book Now button functionality
  document.getElementById("bookNowBtn").addEventListener("click", async function (event) {
    event.preventDefault();

    // Collect user input
    const user_Id = localStorage.getItem("userId");
    const checkInDate = localStorage.getItem("checkInDate");
    const checkOutDate = localStorage.getItem("checkOutDate");
    const num_Rooms = document.getElementById("roomOrBed").value;
    let typeroom = "";
    if (document.getElementById("roomType").value == "AC") {
      typeroom = "A/C";
    } else if (document.getElementById("roomType").value == "NonAC") {
      typeroom = "Non A/C";
    } else {
      typeroom = "Dormitory";
    }

    // Data to be sent to the backend
    const bookingData = {
      userId: user_Id,
      r_type: typeroom,
      checkInD: checkInDate,
      checkOut: checkOutDate,
      numRooms: num_Rooms
    };

    try {
      // Send the booking request to the backend
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      // Handle the response from the backend
      const data = await response.json();

      if (response.ok) {
        // Hide the Available Rooms Modal if it is open
        const availableRoomsModal = bootstrap.Modal.getInstance(document.getElementById('availableRoomsModal'));
        availableRoomsModal.hide();

        // Populate and show the booking success modal
        const bookingId = data.bookingId;
        const bookedRoomsDetails = data.rooms
          .map(room => `Room Number: ${room.dormitory_id}, Bed Number: ${room.room_id}`)
          .join('<br>');

        document.getElementById("bookingId").innerText = bookingId;
        document.getElementById("checkInDetails").innerText = checkInDate;
        document.getElementById("checkOutDetails").innerText = checkOutDate;
        document.getElementById("bookedRoomsList").innerHTML = bookedRoomsDetails;

        const successModal = new bootstrap.Modal(document.getElementById('bookingSuccessModal'));
        successModal.show();
      } else {
        alert(`Booking failed: ${data.message}`);
      }

    } catch (error) {
      console.error("Error occurred while booking rooms:", error);
      alert("An error occurred while processing your booking. Please try again later.");
    }
  });
});
