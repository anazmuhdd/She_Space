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

  // Show Available Rooms Modal when Check Availability button is clicked
  checkAvailabilityBtn.addEventListener("click", () => {
    const availableRoomsModal = new bootstrap.Modal(document.getElementById('availableRoomsModal'));
    availableRoomsModal.show();
  });

  // Update room options based on selected room type
  const roomType = document.getElementById("roomType");
  const roomOrBed = document.getElementById("roomOrBed");
  const rentType = document.getElementById("rentType");
  const duration = document.getElementById("duration");

  roomType.addEventListener("change", () => {
    let options = [];
    const selectedRoom = roomType.value;

    if (selectedRoom === "Dormitory") {
      options = [1, 2, 3, 4, 5, 6, 7, 8];
    } else if (selectedRoom === "NonAC" || selectedRoom === "AC") {
      options = [1, 2];
    }

    roomOrBed.innerHTML = "";
    options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = selectedRoom === "Dormitory" ? `${option} Bed(s)` : `${option} Room(s)`;
      roomOrBed.appendChild(optionElement);
    });

    rentType.dispatchEvent(new Event('change'));
  });

  // Update duration options based on rent type
  rentType.addEventListener("change", () => {
    let options = [];
    const selectedRentType = rentType.value;

    if (selectedRentType === "Days") {
      options = [1, 2, 3, 4, 5, 6, 7];
    } else if (selectedRentType === "Hours") {
      options = [2, 4, 6, 8];
    }

    duration.innerHTML = "";
    options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = `${option} ${selectedRentType}`;
      duration.appendChild(optionElement);
    });
  });

  // Trigger Room/Bed and Duration dropdown updates
  roomType.dispatchEvent(new Event('change'));
  rentType.dispatchEvent(new Event('change'));
});
