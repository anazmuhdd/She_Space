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

  // Set up event listeners for dynamic options
  const roomType = document.getElementById("roomType");
  const roomOrBed = document.getElementById("roomOrBed");
  const rentType = document.getElementById("rentType");
  const duration = document.getElementById("duration");

  // Update room options based on selected room type
  roomType.addEventListener("change", () => {
    let options = [];
    const selectedRoom = roomType.value;

    if (selectedRoom === "Dormitory") {
      options = [1, 2, 3, 4, 5, 6, 7, 8];  // Dormitory has 8 beds, user can select from 1 to 8 beds
    } else if (selectedRoom === "NonAC" || selectedRoom === "AC") {
      options = [1, 2];  // Non A/C and A/C rooms have 1 or 2 rooms available
    }

    roomOrBed.innerHTML = "";
    options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = selectedRoom === "Dormitory" ? `${option} Bed(s)` : `${option} Room(s)`;
      roomOrBed.appendChild(optionElement);
    });

    // Update rent options based on selected rent type
    rentType.dispatchEvent(new Event('change'));
  });

  // Update duration options based on rent type
  rentType.addEventListener("change", () => {
    let options = [];
    const selectedRentType = rentType.value;

    if (selectedRentType === "Days") {
      options = [1, 2, 3, 4, 5, 6, 7];  // Rent in days
    } else if (selectedRentType === "Hours") {
      options = [2, 4, 6, 8];  // Rent in hours
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
